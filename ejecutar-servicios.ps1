# Script para ejecutar todos los microservicios
Write-Host "Iniciando Todos los Microservicios de la Plataforma Tributaria" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host ""

$services = @(
    @{Name="motor-formulas-service"; Port=8081},
    @{Name="liquidacion-service"; Port=8082},
    @{Name="facturacion-service"; Port=8083},
    @{Name="recaudo-service"; Port=8084},
    @{Name="cartera-service"; Port=8085},
    @{Name="contabilidad-service"; Port=8086},
    @{Name="notificaciones-service"; Port=8087},
    @{Name="seguridad-service"; Port=8088}
)

foreach ($service in $services) {
    $serviceName = $service.Name
    $port = $service.Port
    $servicePath = "services\$serviceName"
    
    Write-Host "Iniciando: $serviceName en puerto $port" -ForegroundColor Yellow
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\$servicePath'; Write-Host 'Servicio: $serviceName' -ForegroundColor Green; Write-Host 'Puerto: $port' -ForegroundColor Cyan; mvn spring-boot:run"
    
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "Todos los servicios se estan iniciando en ventanas separadas" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Puertos de los servicios:" -ForegroundColor Cyan
Write-Host "  - Motor de Formulas: http://localhost:8081" -ForegroundColor Gray
Write-Host "  - Liquidacion: http://localhost:8082" -ForegroundColor Gray
Write-Host "  - Facturacion: http://localhost:8083" -ForegroundColor Gray
Write-Host "  - Recaudo: http://localhost:8084" -ForegroundColor Gray
Write-Host "  - Cartera: http://localhost:8085" -ForegroundColor Gray
Write-Host "  - Contabilidad: http://localhost:8086" -ForegroundColor Gray
Write-Host "  - Notificaciones: http://localhost:8087" -ForegroundColor Gray
Write-Host "  - Seguridad: http://localhost:8088" -ForegroundColor Gray
Write-Host ""
Write-Host "Frontend Angular: http://localhost:4200" -ForegroundColor Green
Write-Host ""
