import pytesseract
from PIL import Image
import io
import numpy as np
import os

# Configurar ruta a Tesseract en Windows
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

class OCRService:
    def __init__(self):
        try:
            # Importar EasyOCR solo si está instalado
            import easyocr
            self.reader = easyocr.Reader(['es'])
            self.has_easyocr = True
        except ImportError:
            self.has_easyocr = False
            print("EasyOCR no está instalado. Algunas funciones no estarán disponibles.")
    
    def extract_text_from_image(self, image_bytes):
        """Extrae texto de una imagen usando pytesseract"""
        try:
            image = Image.open(io.BytesIO(image_bytes))
            text = pytesseract.image_to_string(image, lang='spa')
            return text
        except Exception as e:
            print(f"Error al extraer texto: {str(e)}")
            return "Error al procesar la imagen"
    
    def extract_data_from_ine(self, image_bytes):
        """Extrae datos específicos de una INE (credencial de elector mexicana)"""
        if not self.has_easyocr:
            return {"error": "EasyOCR no está instalado"}
        
        try:
            image = Image.open(io.BytesIO(image_bytes))
            
            # Usar EasyOCR para mejor reconocimiento de datos de INE
            result = self.reader.readtext(np.array(image))
            
            # Extraer información específica
            data = {
                "nombre": None,
                "domicilio": None,
                "clave_elector": None,
                "curp": None,
            }
            
            # Lógica para extraer información de INE
            # Esta es una implementación básica que debe refinarse
            # para cada tipo específico de documento
            for detection in result:
                text = detection[1].upper()
                
                # Nombre normalmente después de "NOMBRE"
                if "NOMBRE" in text and len(text) > 7:
                    data["nombre"] = text.replace("NOMBRE", "").strip()
                
                # Domicilio normalmente después de "DOMICILIO"
                elif "DOMICILIO" in text and len(text) > 10:
                    data["domicilio"] = text.replace("DOMICILIO", "").strip()
                
                # Clave de elector es una cadena de 18 caracteres alfanuméricos
                elif len(text) == 18 and text.isalnum():
                    # Primero, verificar si es CURP (inicia con letras)
                    if text[0:4].isalpha():
                        data["curp"] = text
                    else:
                        data["clave_elector"] = text
                
                # Búsqueda explícita de "CLAVE DE ELECTOR"
                elif "CLAVE" in text and "ELECTOR" in text and ":" in text:
                    parts = text.split(":")
                    if len(parts) > 1 and len(parts[1].strip()) > 0:
                        data["clave_elector"] = parts[1].strip()
            
            return data
            
        except Exception as e:
            print(f"Error al extraer datos de INE: {str(e)}")
            return {"error": str(e)}