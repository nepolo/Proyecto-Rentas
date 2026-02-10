# Script para compilar todos los microservicios
Write-Host "Compilando Todos los Microservicios de la Plataforma Tributaria" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host ""

$services = @(
    "parametrizacion-service",
    "motor-formulas-service",
    "liquidacion-service",
    "facturacion-service",
    "recaudo-service",
    "cartera-service",
    "contabilidad-service",
    "notificaciones-service",
    "seguridad-service"
)

$exitCode = 0
$succeeded = @()
$failed = @()

foreach ($service in $services) {
    $servicePath = "services\$service"
    
    Write-Host "Compilando: $service" -ForegroundColor Yellow
    Write-Host "   Ruta: $servicePath" -ForegroundColor Gray
    
    if (Test-Path $servicePath) {
        Push-Location $servicePath
        
        try {
            $output = mvn clean package -DskipTests 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "   OK: $service compilado exitosamente" -ForegroundColor Green
                $succeeded += $service
            } else {
                Write-Host "   ERROR: Error compilando $service" -ForegroundColor Red
                $failed += $service
                $exitCode = 1
            }
        } catch {
            Write-Host "   ERROR: Excepcion compilando $service : $_" -ForegroundColor Red
            $failed += $service
            $exitCode = 1
        } finally {
            Pop-Location
        }
    } else {
        Write-Host "   ADVERTENCIA: Directorio no encontrado: $servicePath" -ForegroundColor Magenta
        $failed += $service
        $exitCode = 1
    }
    
    Write-Host ""
}

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "RESUMEN DE COMPILACION" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host ""

if ($succeeded.Count -gt 0) {
    Write-Host "Exitosos ($($succeeded.Count)):" -ForegroundColor Green
    foreach ($s in $succeeded) {
        Write-Host "   - $s" -ForegroundColor Green
    }
    Write-Host ""
}

if ($failed.Count -gt 0) {
    Write-Host "Fallidos ($($failed.Count)):" -ForegroundColor Red
    foreach ($f in $failed) {
        Write-Host "   - $f" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "Total: $($services.Count) servicios" -ForegroundColor Cyan
Write-Host "Exitosos: $($succeeded.Count)" -ForegroundColor Green
Write-Host "Fallidos: $($failed.Count)" -ForegroundColor Red
Write-Host ""

if ($exitCode -eq 0) {
    Write-Host "Todos los servicios compilados correctamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Proximos pasos:" -ForegroundColor Cyan
    Write-Host "  1. Ejecutar servicios: cd services\<servicio>; mvn spring-boot:run" -ForegroundColor Gray
    Write-Host "  2. O usar Docker: docker-compose up -d" -ForegroundColor Gray
} else {
    Write-Host "Algunos servicios fallaron. Revisa los errores arriba." -ForegroundColor Yellow
}

Write-Host ""
exit $exitCode
