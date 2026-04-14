# Script para otimizar imagens webp para os cards dos finalistas
# Redimensiona para max 600px de largura mantendo aspect ratio

Add-Type -AssemblyName System.Drawing

$imagesPath = "c:\Users\Reprografia\Documents\Softwares\alfa-omega-site\assets\tpa"
$maxWidth = 600
$quality = 85

Get-ChildItem -Path $imagesPath -Filter "*.webp" | ForEach-Object {
    $imagePath = $_.FullName
    $imageName = $_.Name
    
    $image = [System.Drawing.Image]::FromFile($imagePath)
    $originalWidth = $image.Width
    $originalHeight = $image.Height
    
    Write-Host "Processando: $imageName ($originalWidth x $originalHeight)"
    
    if ($originalWidth -gt $maxWidth) {
        $newHeight = [Math]::Round(($maxWidth / $originalWidth) * $originalHeight)
        
        $bitmap = New-Object System.Drawing.Bitmap($maxWidth, $newHeight)
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        $graphics.DrawImage($image, 0, 0, $maxWidth, $newHeight)
        
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $quality)
        
        $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/webp' }
        
        if ($jpegCodec) {
            $bitmap.Save($imagePath, $jpegCodec, $encoderParams)
            Write-Host "[OK] Otimizado para: $maxWidth x $newHeight"
        } else {
            $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
            $newPath = $imagePath -replace '.webp', '.jpg'
            $bitmap.Save($newPath, $jpegCodec, $encoderParams)
            Write-Host "[OK] Convertido para: $newPath ($maxWidth x $newHeight)"
        }
        
        $graphics.Dispose()
        $bitmap.Dispose()
    } else {
        Write-Host "[SKIP] Tamanho apropriado: $originalWidth x $originalHeight"
    }
    
    $image.Dispose()
}

Write-Host "`nOtimizacao concluida!"
