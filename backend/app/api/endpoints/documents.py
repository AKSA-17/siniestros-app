# Gestiona operaciones CRUD para documentos y maneja la carga de archivos.

from typing import Any, List
import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse

from app import crud, models, schemas
from app.api import deps
from app.services.ocr.service import OCRService

router = APIRouter()
ocr_service = OCRService()

# Directorio para guardar documentos
UPLOAD_DIRECTORY = "uploads"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

@router.post("/upload/{siniestro_id}", response_model=schemas.Document)
async def upload_document(
    *,
    db: Session = Depends(deps.get_db),
    siniestro_id: int,
    document_type: str,
    file: UploadFile = File(...),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Upload a document for a siniestro.
    """
    # Verificar que el siniestro existe
    siniestro = crud.siniestro.get(db=db, id=siniestro_id)
    if not siniestro:
        raise HTTPException(status_code=404, detail="Siniestro no encontrado")
    
    # Verificar permisos
    if not crud.user.is_agent(current_user) and (siniestro.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="No tiene permisos suficientes")
    
    # Crear directorio específico para el siniestro si no existe
    siniestro_dir = os.path.join(UPLOAD_DIRECTORY, str(siniestro_id))
    os.makedirs(siniestro_dir, exist_ok=True)
    
    # Guardar el archivo
    file_path = os.path.join(siniestro_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Crear entrada en la base de datos
    document_in = schemas.DocumentCreate(
        name=file.filename,
        document_type=document_type,
        siniestro_id=siniestro_id
    )
    document = crud.document.create_with_siniestro(
        db=db, obj_in=document_in, siniestro_id=siniestro_id, path=file_path
    )
    
    return document

@router.post("/ocr/{document_id}", response_model=dict)
async def extract_text_from_document(
    *,
    db: Session = Depends(deps.get_db),
    document_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Extract text from a document using OCR.
    """
    # Obtener el documento
    document = crud.document.get(db=db, id=document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    
    # Verificar permisos
    siniestro = crud.siniestro.get(db=db, id=document.siniestro_id)
    if not crud.user.is_agent(current_user) and (siniestro.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="No tiene permisos suficientes")
    
    # Verificar que el archivo existe
    if not os.path.exists(document.path):
        raise HTTPException(status_code=404, detail="Archivo no encontrado en el servidor")
    
    # Verificar extensión del archivo
    file_extension = os.path.splitext(document.path)[1].lower()
    if file_extension not in ['.jpg', '.jpeg', '.png', '.bmp', '.pdf', '.tif', '.tiff']:
        raise HTTPException(status_code=400, detail="Formato de archivo no soportado para OCR")
    
    # Ejecutar OCR dependiendo del tipo de documento
    try:
        with open(document.path, "rb") as file:
            contents = file.read()
            
        document_type = document.document_type.lower()
        
        if document_type == "ine":
            result = ocr_service.extract_data_from_ine(contents)
            
            # Actualizar siniestro con datos extraídos si están disponibles
            if result.get("nombre") and not siniestro.asegurado:
                siniestro_update = schemas.SiniestroUpdate(asegurado=result["nombre"])
                crud.siniestro.update(db=db, db_obj=siniestro, obj_in=siniestro_update)
            
            return {"data": result}
        
        elif document_type == "póliza" or document_type == "poliza":
            result = ocr_service.extract_data_from_poliza(contents)
            
            # Actualizar siniestro con datos extraídos si están disponibles
            update_data = {}
            if result.get("numero_poliza") and not siniestro.numero_poliza:
                update_data["numero_poliza"] = result["numero_poliza"]
            if result.get("asegurado") and not siniestro.asegurado:
                update_data["asegurado"] = result["asegurado"]
                
            if update_data:
                siniestro_update = schemas.SiniestroUpdate(**update_data)
                crud.siniestro.update(db=db, db_obj=siniestro, obj_in=siniestro_update)
            
            return {"data": result}
        
        else:
            text = ocr_service.extract_text_from_image(contents)
            return {"text": text}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en el procesamiento OCR: {str(e)}")

@router.get("/by-siniestro/{siniestro_id}", response_model=List[schemas.Document])
def read_documents_by_siniestro(
    *,
    db: Session = Depends(deps.get_db),
    siniestro_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get all documents for a specific siniestro.
    """
    siniestro = crud.siniestro.get(db=db, id=siniestro_id)
    if not siniestro:
        raise HTTPException(status_code=404, detail="Siniestro no encontrado")
    
    if not crud.user.is_agent(current_user) and (siniestro.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="No tiene permisos suficientes")
    
    documents = crud.document.get_multi_by_siniestro(
        db=db, siniestro_id=siniestro_id
    )
    return documents

@router.put("/{id}/validate", response_model=schemas.Document)
def validate_document(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_agent),
) -> Any:
    """
    Mark a document as validated.
    """
    document = crud.document.get(db=db, id=id)
    if not document:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    
    document_update = schemas.DocumentUpdate(validated=True)
    document = crud.document.update(db=db, db_obj=document, obj_in=document_update)
    return document

@router.get("/download/{document_id}", response_class=FileResponse)
async def download_document(
    *,
    db: Session = Depends(deps.get_db),
    document_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Download a document.
    """
    # Get the document
    document = crud.document.get(db=db, id=document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    
    # Check permissions
    siniestro = crud.siniestro.get(db=db, id=document.siniestro_id)
    if not crud.user.is_agent(current_user) and (siniestro.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="No tiene permisos suficientes")
    
    # Check if the file exists
    if not os.path.exists(document.path):
        raise HTTPException(status_code=404, detail="Archivo no encontrado en el servidor")
    
    # Return the file
    return FileResponse(
        path=document.path,
        filename=document.name,
        media_type="application/octet-stream"
    )

@router.post("/ocr-direct", response_model=dict)
async def extract_text_direct(
    *,
    file: UploadFile = File(...),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Extract text directly from an uploaded file without storing it.
    """
    # Verificar tipo de archivo
    filename = file.filename.lower()
    if not any(filename.endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.bmp', '.pdf', '.tif', '.tiff']):
        raise HTTPException(status_code=400, detail="Formato de archivo no soportado para OCR")
    
    try:
        # Leer el contenido del archivo
        contents = await file.read()
        
        # Determinar el tipo de documento basado en la extensión
        document_type = None
        if "ine" in filename or "credencial" in filename:
            document_type = "ine"
        elif "poliza" in filename or "póliza" in filename:
            document_type = "poliza"
        
        # Ejecutar OCR según el tipo de documento
        if document_type == "ine":
            result = ocr_service.extract_data_from_ine(contents)
            return {"data": result}
        elif document_type == "poliza":
            result = ocr_service.extract_data_from_poliza(contents)
            return {"data": result}
        else:
            text = ocr_service.extract_text_from_image(contents)
            return {"text": text}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en el procesamiento OCR: {str(e)}")
    finally:
        # Asegurar que el archivo se cierre
        await file.close()