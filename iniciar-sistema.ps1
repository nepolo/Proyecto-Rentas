# Script para iniciar el backend y frontend

Write-Host "🚀 Iniciando Plataforma Tributaria..." -ForegroundColor Cyan

# Detener procesos previos
Write-Host "`n📌 Deteniendo procesos previos..." -ForegroundColor Yellow
Stop-Process -Name "java" -Force -ErrorAction SilentlyContinue
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Iniciar Seguridad Service (puerto 8089)
Write-Host "`n🔐 Iniciando Seguridad Service (puerto 8089)..." -ForegroundColor Green
$seguridadPath = "services\seguridad-service"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$seguridadPath'; mvn spring-boot:run" -WindowStyle Normal

Start-Sleep -Seconds 5

# Iniciar Liquidacion Service (puerto 8083)
Write-Host "`n💰 Iniciando Liquidacion Service (puerto 8083)..." -ForegroundColor Green
$liquidacionPath = "services\liquidacion-service"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$liquidacionPath'; mvn spring-boot:run" -WindowStyle Normal

Start-Sleep -Seconds 5

# Iniciar Frontend Angular (puerto 4200)
Write-Host "`n🎨 Iniciando Frontend Angular (puerto 4200)..." -ForegroundColor Green
$frontendPath = "frontend-angular"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm start" -WindowStyle Normal

Write-Host "`n✅ Servicios iniciándose..." -ForegroundColor Cyan
Write-Host "`n📝 URLs disponibles:" -ForegroundColor Yellow
Write-Host "   Frontend:           http://localhost:4200" -ForegroundColor White
Write-Host "   Seguridad API:      http://localhost:8089" -ForegroundColor White
Write-Host "   Liquidacion API:    http://localhost:8083" -ForegroundColor White
Write-Host "`nPresiona cualquier tecla para cerrar este mensaje..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
