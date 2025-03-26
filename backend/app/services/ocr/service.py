import pytesseract
from PIL import Image
import io
import numpy as np
import os
import re
from typing import Dict, Any, Optional, List

# Configurar ruta a Tesseract basada en variables de entorno
import os
from dotenv import load_dotenv

load_dotenv()

TESSERACT_PATH = os.getenv('TESSERACT_PATH', r'C:\Program Files\Tesseract-OCR\tesseract.exe')
pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH

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
    
    def extract_text_from_image(self, image_bytes: bytes) -> str:
        """Extrae texto de una imagen usando pytesseract"""
        try:
            image = Image.open(io.BytesIO(image_bytes))
            text = pytesseract.image_to_string(image, lang='spa')
            return text
        except Exception as e:
            print(f"Error al extraer texto: {str(e)}")
            return "Error al procesar la imagen"
    
    def extract_data_from_ine(self, image_bytes: bytes) -> Dict[str, Any]:
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
            
            # Mejorar detección de nombre
            for detection in result:
                text = detection[1].upper()
                
                # Nombre normalmente después de "NOMBRE"
                if "NOMBRE" in text:
                    # Buscar texto después de "NOMBRE"
                    name_match = re.search(r'NOMBRE[S]?\s*(.*)', text)
                    if name_match and len(name_match.group(1)) > 2:
                        data["nombre"] = name_match.group(1).strip()
                
                # Domicilio normalmente después de "DOMICILIO"
                elif "DOMICILIO" in text:
                    # Buscar texto después de "DOMICILIO"
                    address_match = re.search(r'DOMICILIO\s*(.*)', text)
                    if address_match and len(address_match.group(1)) > 2:
                        data["domicilio"] = address_match.group(1).strip()
                
                # CURP es una cadena de 18 caracteres
                elif len(text) == 18 and re.match(r'^[A-Z]{4}[0-9]{6}[A-Z]{8}[0-9A-Z]{2}$', text):
                    data["curp"] = text
                
                # Clave de elector es una cadena de 18 caracteres alfanuméricos
                elif len(text) == 18 and text.isalnum():
                    # Si no es CURP, probablemente es clave de elector
                    if not re.match(r'^[A-Z]{4}[0-9]{6}[A-Z]{8}[0-9A-Z]{2}$', text):
                        data["clave_elector"] = text
                
                # Búsqueda explícita de "CLAVE DE ELECTOR"
                elif "CLAVE" in text and "ELECTOR" in text:
                    parts = re.split(r'[:;]', text, 1)
                    if len(parts) > 1 and len(parts[1].strip()) > 0:
                        data["clave_elector"] = parts[1].strip()
            
            return data
            
        except Exception as e:
            print(f"Error al extraer datos de INE: {str(e)}")
            return {"error": str(e)}
            
    def extract_data_from_poliza(self, image_bytes: bytes) -> Dict[str, Any]:
        """Extrae datos específicos de una póliza de seguro"""
        try:
            image = Image.open(io.BytesIO(image_bytes))  # CORREGIDO: BytysIO → BytesIO
            text = pytesseract.image_to_string(image, lang='spa')
            
            # Detectar información de la póliza usando expresiones regulares
            data = {
                "numero_poliza": None,
                "asegurado": None,
                "vigencia": None,
                "suma_asegurada": None,
                "prima": None,
            }
            
            # Buscar número de póliza
            poliza_pattern = r'[pP][oóÓ][lL][iI][zZ][aA][\s#:.]*([A-Z0-9-/]+)'
            poliza_match = re.search(poliza_pattern, text)
            if poliza_match:
                data["numero_poliza"] = poliza_match.group(1).strip()
            
            # Buscar nombre del asegurado
            asegurado_patterns = [
                r'[aA][sS][eE][gG][uU][rR][aA][dD][oO][\s:]*([^\n\r]+)',
                r'[nN][oO][mM][bB][rR][eE][\s:]*([^\n\r]+)'
            ]
            
            for pattern in asegurado_patterns:
                match = re.search(pattern, text)
                if match:
                    data["asegurado"] = match.group(1).strip()
                    break
            
            # Buscar vigencia
            vigencia_pattern = r'[vV][iI][gG][eE][nN][cC][iI][aA][\s:]*([^\n\r]+)'
            vigencia_match = re.search(vigencia_pattern, text)
            if vigencia_match:
                data["vigencia"] = vigencia_match.group(1).strip()
            
            # Buscar suma asegurada
            suma_pattern = r'[sS][uU][mM][aA][\s]*[aA][sS][eE][gG][uU][rR][aA][dD][aA][\s:]*\$?([0-9,.]+)'
            suma_match = re.search(suma_pattern, text)
            if suma_match:
                data["suma_asegurada"] = suma_match.group(1).strip()
            
            # Buscar prima
            prima_pattern = r'[pP][rR][iI][mM][aA][\s:]*\$?([0-9,.]+)'
            prima_match = re.search(prima_pattern, text)
            if prima_match:
                data["prima"] = prima_match.group(1).strip()
                
            return data
            
        except Exception as e:
            print(f"Error al extraer datos de póliza: {str(e)}")
            return {"error": str(e)}