# Gestiona operaciones CRUD para siniestros.

from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.Siniestro])
def read_siniestros(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve siniestros.
    """
    if crud.user.is_agent(current_user):
        siniestros = crud.siniestro.get_multi(db, skip=skip, limit=limit)
    else:
        siniestros = crud.siniestro.get_multi_by_owner(
            db=db, owner_id=current_user.id, skip=skip, limit=limit
        )
    return siniestros

@router.post("/", response_model=schemas.Siniestro)
def create_siniestro(
    *,
    db: Session = Depends(deps.get_db),
    siniestro_in: schemas.SiniestroCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new siniestro.
    """
    siniestro = crud.siniestro.create_with_owner(
        db=db, obj_in=siniestro_in, owner_id=current_user.id
    )
    return siniestro

@router.put("/{id}", response_model=schemas.Siniestro)
def update_siniestro(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    siniestro_in: schemas.SiniestroUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update a siniestro.
    """
    siniestro = crud.siniestro.get(db=db, id=id)
    if not siniestro:
        raise HTTPException(status_code=404, detail="Siniestro no encontrado")
    if not crud.user.is_agent(current_user) and (siniestro.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="No tiene permisos suficientes")
    siniestro = crud.siniestro.update(db=db, db_obj=siniestro, obj_in=siniestro_in)
    return siniestro

@router.get("/{id}", response_model=schemas.Siniestro)
def read_siniestro(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get siniestro by ID.
    """
    siniestro = crud.siniestro.get(db=db, id=id)
    if not siniestro:
        raise HTTPException(status_code=404, detail="Siniestro no encontrado")
    if not crud.user.is_agent(current_user) and (siniestro.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="No tiene permisos suficientes")
    return siniestro

@router.delete("/{id}", response_model=schemas.Siniestro)
def delete_siniestro(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_agent),
) -> Any:
    """
    Delete a siniestro.
    """
    siniestro = crud.siniestro.get(db=db, id=id)
    if not siniestro:
        raise HTTPException(status_code=404, detail="Siniestro no encontrado")
    siniestro = crud.siniestro.remove(db=db, id=id)
    return siniestro