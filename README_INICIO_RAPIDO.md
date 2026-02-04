# 🚀 Guía de Inicio Rápido - Plataforma Tributaria

## ✅ Todos los Microservicios Completados (9/9)

Todos los microservicios están listos con Java 21, Spring Boot 3.2.0 y H2.

| # | Servicio | Puerto | Estado |
|---|----------|--------|--------|
| 1 | parametrizacion-service | 8080 | ✅ Completo |
| 2 | motor-formulas-service | 8081 | ✅ Completo |
| 3 | liquidacion-service | 8082 | ✅ Completo |
| 4 | facturacion-service | 8083 | ✅ Completo |
| 5 | recaudo-service | 8084 | ✅ Completo |
| 6 | cartera-service | 8085 | ✅ Completo |
| 7 | contabilidad-service | 8086 | ✅ Completo |
| 8 | notificaciones-service | 8087 | ✅ Completo |
| 9 | seguridad-service | 8088 | ✅ Completo |

## 🏃 Ejecutar Servicios

### Opción 1: Ejecutar un servicio individual

```powershell
# Ejemplo: Parametrización
cd services\parametrizacion-service
mvn clean package
mvn spring-boot:run

# Acceder:
# API: http://localhost:8080/api/rentas
# H2 Console: http://localhost:8080/h2-console
```

### Opción 2: Ejecutar todos con Docker Compose

```powershell
# Construir todas las imágenes
docker-compose build

# Levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f parametrizacion-service

# Detener todo
docker-compose down
```

## 🧪 Probar APIs con PowerShell

### 1. Parametrización - Crear Renta
```powershell
$body = @{
    nombre = "Impuesto Predial"
    tipo = "ANUAL"
    periodicidad = "ANUAL"
    estado = "ACTIVA"
    descripcion = "Impuesto sobre propiedad inmueble"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/rentas" -Method Post -Body $body -ContentType "application/json"
```

### 2. Motor Fórmulas - Crear Fórmula
```powershell
$formula = @{
    nombre = "Cálculo Predial"
    expresion = "BASE_GRAVABLE * TARIFA"
    version = "1.0"
    vigenciaDesde = "2024-01-01T00:00:00"
    descripcion = "Fórmula básica impuesto predial"
    creadoPor = "admin"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8081/api/formulas" -Method Post -Body $formula -ContentType "application/json"
```

### 3. Liquidación - Crear Liquidación
```powershell
$liquidacion = @{
    contribuyenteId = 1
    rentaId = 1
    periodo = 1
    vigencia = 2024
    baseGravable = 100000000
    tarifa = 0.01
    valorImpuesto = 1000000
    valorTotal = 1000000
    tipoLiquidacion = "INDIVIDUAL"
    liquidadoPor = "admin"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8082/api/liquidaciones" -Method Post -Body $liquidacion -ContentType "application/json"
```

### 4. Facturación - Crear Factura
```powershell
$factura = @{
    liquidacionId = 1
    contribuyenteId = 1
    valorTotal = 1000000
    fechaVencimiento = "2024-12-31"
    emitidoPor = "admin"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8083/api/facturas" -Method Post -Body $factura -ContentType "application/json"
```

### 5. Recaudo - Registrar Pago
```powershell
$pago = @{
    facturaId = 1
    contribuyenteId = 1
    valorPagado = 1000000
    medioPago = "TRANSFERENCIA"
    tipoPago = "TOTAL"
    registradoPor = "admin"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8084/api/pagos" -Method Post -Body $pago -ContentType "application/json"
```

### 6. Cartera - Consultar Estado Cuenta
```powershell
$estadoCuenta = @{
    contribuyenteId = 1
    saldoTotal = 0
    saldoVencido = 0
    interesesMora = 0
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8085/api/cartera" -Method Post -Body $estadoCuenta -ContentType "application/json"
```

### 7. Contabilidad - Crear Asiento Contable
```powershell
$asiento = @{
    transaccionId = 1
    tipoTransaccion = "RECAUDO"
    cuentaContable = "1105"
    tipoMovimiento = "DEBITO"
    valor = 1000000
    registradoPor = "admin"
    descripcion = "Registro pago impuesto predial"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8086/api/contabilidad" -Method Post -Body $asiento -ContentType "application/json"
```

### 8. Notificaciones - Enviar Notificación
```powershell
$notificacion = @{
    destinatario = "contribuyente@example.com"
    tipoCanal = "EMAIL"
    asunto = "Factura Generada"
    mensaje = "Su factura ha sido generada exitosamente"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8087/api/notificaciones" -Method Post -Body $notificacion -ContentType "application/json"
```

### 9. Seguridad - Crear Usuario
```powershell
$usuario = @{
    username = "admin"
    password = "admin123"
    email = "admin@plataforma.com"
    rol = "ADMIN"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8088/api/usuarios" -Method Post -Body $usuario -ContentType "application/json"
```

## 📊 Acceder a Consolas H2

Cada servicio tiene su consola H2 disponible:

| Servicio | URL | JDBC URL | User | Password |
|----------|-----|----------|------|----------|
| Parametrización | http://localhost:8080/h2-console | jdbc:h2:mem:param_db | sa | (vacío) |
| Motor Fórmulas | http://localhost:8081/h2-console | jdbc:h2:mem:formulas_db | sa | (vacío) |
| Liquidación | http://localhost:8082/h2-console | jdbc:h2:mem:liquidacion_db | sa | (vacío) |
| Facturación | http://localhost:8083/h2-console | jdbc:h2:mem:facturacion_db | sa | (vacío) |
| Recaudo | http://localhost:8084/h2-console | jdbc:h2:mem:recaudo_db | sa | (vacío) |
| Cartera | http://localhost:8085/h2-console | jdbc:h2:mem:cartera_db | sa | (vacío) |
| Contabilidad | http://localhost:8086/h2-console | jdbc:h2:mem:contabilidad_db | sa | (vacío) |
| Notificaciones | http://localhost:8087/h2-console | jdbc:h2:mem:notificaciones_db | sa | (vacío) |
| Seguridad | http://localhost:8088/h2-console | jdbc:h2:mem:seguridad_db | sa | (vacío) |

## 🔍 Verificar Estado de Servicios

```powershell
# Listar servicios en ejecución
docker-compose ps

# Ver logs de todos los servicios
docker-compose logs

# Verificar salud (requiere actuator)
Invoke-RestMethod -Uri "http://localhost:8080/actuator/health"
```

## 📁 Estructura del Proyecto

```
Proyecto_Rentas/
├── docker-compose.yml
├── INFRAESTRUCTURA.md
├── README_INICIO_RAPIDO.md (este archivo)
└── services/
    ├── parametrizacion-service/
    ├── motor-formulas-service/
    ├── liquidacion-service/
    ├── facturacion-service/
    ├── recaudo-service/
    ├── cartera-service/
    ├── contabilidad-service/
    ├── notificaciones-service/
    └── seguridad-service/
```

Cada servicio contiene:
- `pom.xml` (Java 21, Spring Boot 3.2.0)
- `src/main/java/` (Application, Model, Repository, Service, Controller)
- `src/main/resources/` (application.yml, db/migration/V1__init.sql)
- `Dockerfile`

## 🎯 Próximos Pasos

1. ✅ Todos los microservicios creados (9/9)
2. ✅ Frontend Angular completo
   - Dashboard con estadísticas
   - 6 módulos funcionales (Parametrización, Fórmulas, Liquidaciones, Facturas, Pagos, Cartera)
   - Servicios HTTP configurados
   - UI responsive con Material Design
3. ⏭️ Implementar Spring Cloud Gateway (API Gateway)
4. ⏭️ Añadir Eureka Server (Service Discovery)
5. ⏭️ Implementar Event-Driven con Kafka
6. ⏭️ Añadir Spring Cloud Config (Configuración centralizada)
7. ⏭️ Implementar OAuth2/JWT completo en seguridad-service
8. ⏭️ Añadir tests unitarios e integración
9. ⏭️ Configurar CI/CD con GitHub Actions

## 🎨 Ejecutar Frontend Angular

```powershell
# Navegar al frontend
cd frontend-angular

# Instalar dependencias (primera vez)
npm install

# Ejecutar en desarrollo
npm start

# Acceder a: http://localhost:4200
```

Para más detalles ver: `frontend-angular/README.md`

## 🐛 Solución de Problemas

### Puerto ya en uso
```powershell
# Ver qué proceso usa un puerto
netstat -ano | findstr :8080

# Matar proceso por PID
taskkill /PID <PID> /F
```

### Base de datos no inicializa
Verificar que Flyway esté habilitado en `application.yml`:
```yaml
flyway:
  enabled: true
  locations: classpath:db/migration
```

### Docker no construye
```powershell
# Limpiar caché de Docker
docker system prune -a

# Reconstruir sin caché
docker-compose build --no-cache
```

## 📞 Soporte

Para más detalles ver:
- `README_Plataforma_Tributaria_Detallado.md` - Especificaciones funcionales
- `INFRAESTRUCTURA.md` - Documentación de infraestructura

¡La plataforma tributaria está lista para usarse! 🎉
