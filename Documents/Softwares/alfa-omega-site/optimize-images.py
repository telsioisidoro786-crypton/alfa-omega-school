#!/usr/bin/env python3
"""
Script para otimizar imagens WebP para os cards dos finalistas
Redimensiona para max 600px de largura mantendo aspect ratio
Requer: pip install pillow
"""

from PIL import Image
import os
from pathlib import Path

# Configuracoes
IMAGES_PATH = Path(__file__).parent / "assets" / "tpa"
MAX_WIDTH = 600
QUALITY = 85

def optimize_images():
    """Processa e otimiza todas as imagens WebP"""
    
    if not IMAGES_PATH.exists():
        print(f"Erro: Diretorio {IMAGES_PATH} nao encontrado")
        return
    
    webp_files = list(IMAGES_PATH.glob("*.webp"))
    
    if not webp_files:
        print("Nenhuma imagem WebP encontrada")
        return
    
    print(f"Encontradas {len(webp_files)} imagens para processar\n")
    
    for image_path in webp_files:
        try:
            print(f"Processando: {image_path.name}")
            
            # Abrir imagem
            img = Image.open(image_path)
            original_width, original_height = img.size
            print(f"  Dimensao original: {original_width}x{original_height}")
            
            # Verificar se precisa redimensionar
            if original_width > MAX_WIDTH:
                # Calcular nova altura mantendo aspect ratio
                ratio = MAX_WIDTH / original_width
                new_height = int(original_height * ratio)
                
                # Redimensionar usando filtro de qualidade alta
                img_resized = img.resize(
                    (MAX_WIDTH, new_height),
                    Image.Resampling.LANCZOS
                )
                
                # Salvar com qualidade otimizada
                img_resized.save(
                    image_path,
                    "WEBP",
                    quality=QUALITY,
                    method=6  # slowest but best quality
                )
                
                file_size = os.path.getsize(image_path) / 1024
                print(f"  [OK] Otimizado para: {MAX_WIDTH}x{new_height}")
                print(f"       Tamanho: {file_size:.1f} KB\n")
            else:
                print(f"  [SKIP] Ja esta com tamanho apropriado\n")
            
            img.close()
            
        except Exception as e:
            print(f"  [ERRO] {str(e)}\n")
    
    print("=" * 50)
    print("Otimizacao concluida!")
    print("=" * 50)

if __name__ == "__main__":
    optimize_images()
