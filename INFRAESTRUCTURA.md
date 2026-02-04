# 🏛 Plataforma Tributaria - Infraestructura

## 📋 Microservicios Creados

### ✅ TODOS COMPLETADOS (9/9) 🎉

1. **parametrizacion-service** (Puerto 8080) - ✅ Completo con H2
   - Gestión de rentas, conceptos, tarifas, calendarios tributarios
   - Base de datos H2 en memoria
   - Flyway para migraciones

2. **motor-formulas-service** (Puerto 8081) - ✅ Completo con H2
   - Creación y evaluación de fórmulas tributarias
   - Versionamiento de fórmulas
   - Validación sintáctica

3. **liquidacion-service** (Puerto 8082) - ✅ Completo con H2
   - Liquidación individual y masiva
   - Re-liquidaciones
   - Cálculo automático de valores

4. **facturacion-service** (Puerto 8083) - ✅ Completo con H2
   - Generación de facturas con QR
   - Gestión de vencimientos
   - Anulaciones

5. **recaudo-service** (Puerto 8084) - ✅ Completo con H2
   - Registro de pagos (total/parcial)
   - Múltiples medios de pago
   - Aplicación de pagos

6. **cartera-service** (Puerto 8085) - ✅ Completo con H2
   - Estado de cuenta por contribuyente
   - Cálculo de intereses de mora
   - Gestión de saldos

7. **contabilidad-service** (Puerto 8086) - ✅ Completo con H2
   - Asientos contables automáticos
   - Causación y registro de recaudos
   - Clasificación presupuestal

8. **notificaciones-service** (Puerto 8087) - ✅ Completo con H2
   - Envío de notificaciones (EMAIL, SMS)
   - Gestión de plantillas
   - Tracking de envíos

9. **seguridad-service** (Puerto 8088) - ✅ Completo con H2
   - Gestión de usuarios y roles
   - Autenticación (preparado para OAuth2/JWT)
   - Auditoría de accesos

## 🚀 Cómo Ejecutar

### Opción 1: Ejecutar servicio individual

```powershell
cd services\parametrizacion-service
mvn clean package
mvn spring-boot:run
```

Acceder a:
- API: http://localhost:8080/api/rentas
- H2 Console: http://localhost:8080/h2-console

### Opción 2: Docker Compose (Todos los servicios)

```powershell
# Construir imágenes
docker-compose build

# Levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

## 📊 Puertos Asignados

| Servicio              | Puerto |
|-----------------------|--------|
| Parametrización       | 8080   |
| Motor Fórmulas        | 8081   |
| Liquidación           | 8082   |
| Facturación           | 8083   |
| Recaudo               | 8084   |
| Cartera               | 8085   |
| Contabilidad          | 8086   |
| Notificaciones        | 8087   |
| Seguridad             | 8088   |

## 🗄️ Base de Datos H2

Cada microservicio tiene su propia base de datos H2 en memoria:
- **URL**: `jdbc:h2:mem:<servicio>_db`
- **Usuario**: `sa`
- **Contraseña**: (vacía)

### Acceder a H2 Console

```
http://localhost:<puerto>/h2-console
```

Ejemplo para parametrizacion-service:
```
URL: http://localhost:8080/h2-console
JDBC URL: jdbc:h2:mem:param_db
User: sa
Password: (dejar vacío)
```

## 📦 Tecnologías Utilizadas

- **Java 21** (LTS)
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **H2 Database** (en memoria)
- **Flyway** (migraciones de BD)
- **Maven** (gestión de dependencias)
- **Docker** (containerización)

## 🛠️ Próximos Pasos

### ✅ Completado
- [x] Crear los 9 microservicios base
- [x] Configurar H2 para desarrollo
- [x] Implementar modelos de dominio
- [x] Crear APIs REST básicas
- [x] Configurar Flyway para migraciones
- [x] Dockerizar todos los servicios
- [x] Crear docker-compose.yml

### 🚀 Pendiente (Mejoras)

1. **Spring Cloud Gateway (API Gateway)**
   - Puerto único de entrada (8080)
   - Enrutamiento inteligente
   - Rate limiting

2. **Eureka Server (Service Discovery)**
   - Registro automático de servicios
   - Balanceo de carga
   - Health checks

3. **Event-Driven con Kafka**
   - Eventos: LiquidacionGenerada, FacturaEmitida, PagoRegistrado
   - Comunicación asíncrona entre servicios
   - Event Sourcing

4. **Spring Cloud Config**
   - Configuración centralizada
   - Perfiles por ambiente (dev, test, prod)
   - Refresh dinámico

5. **OAuth2/JWT Completo**
   - Implementar en seguridad-service
   - Integrar con todos los servicios
   - Roles y permisos granulares

6. **Frontend Angular**
   - Portal tributario
   - Dashboard de contribuyentes
   - Módulos administrativos

7. **Testing**
   - Tests unitarios (JUnit 5)
   - Tests de integración
   - Tests e2e con Testcontainers

8. **Observabilidad**
   - Prometheus + Grafana
   - ELK Stack (Logs)
   - Distributed Tracing (Zipkin/Jaeger)

9. **CI/CD**
   - GitHub Actions
   - Pipeline de build y deploy
   - Análisis de código (SonarQube)

## 🧪 Testing

```powershell
# Ejecutar tests de un servicio
cd services\parametrizacion-service
mvn test

# Ejecutar tests de todos los servicios
mvn clean test -pl services/*
```

## 📝 API Endpoints

### Parametrización Service (8080)
- `GET /api/rentas` - Listar todas las rentas
- `GET /api/rentas/{id}` - Obtener renta por ID
- `POST /api/rentas` - Crear nueva renta
- `PUT /api/rentas/{id}` - Actualizar renta
- `DELETE /api/rentas/{id}` - Eliminar renta

### Motor Fórmulas Service (8081)
- `GET /api/formulas` - Listar todas las fórmulas
- `POST /api/formulas` - Crear nueva fórmula
- `POST /api/formulas/evaluar` - Evaluar fórmula
- `GET /api/formulas/estado/{estado}` - Filtrar por estado

### Liquidación Service (8082)
- `GET /api/liquidaciones` - Listar liquidaciones
- `POST /api/liquidaciones` - Crear liquidación
- `POST /api/liquidaciones/{id}/reliquidar` - Reliquidar
- `GET /api/liquidaciones/contribuyente/{id}` - Por contribuyente

### Facturación Service (8083)
- `GET /api/facturas` - Listar facturas
- `POST /api/facturas` - Generar factura
- `PUT /api/facturas/{id}/anular` - Anular factura
- `GET /api/facturas/contribuyente/{id}` - Por contribuyente

### Recaudo Service (8084)
- `GET /api/pagos` - Listar pagos
- `POST /api/pagos` - Registrar pago
- `PUT /api/pagos/{id}/aplicar` - Aplicar pago
- `GET /api/pagos/contribuyente/{id}` - Por contribuyente

### Cartera Service (8085)
- `GET /api/cartera` - Listar estados de cuenta
- `POST /api/cartera` - Crear estado de cuenta
- `GET /api/cartera/contribuyente/{id}` - Por contribuyente

### Contabilidad Service (8086)
- `GET /api/contabilidad` - Listar asientos contables
- `POST /api/contabilidad` - Crear asiento contable
- `GET /api/contabilidad/transaccion/{id}` - Por transacción

### Notificaciones Service (8087)
- `GET /api/notificaciones` - Listar notificaciones
- `POST /api/notificaciones` - Crear notificación
- `PUT /api/notificaciones/{id}/enviar` - Enviar notificación

### Seguridad Service (8088)
- `GET /api/usuarios` - Listar usuarios
- `POST /api/usuarios` - Crear usuario
- `GET /api/usuarios/{username}` - Buscar por username
- `PUT /api/usuarios/{id}/activar` - Activar usuario

## 🔍 Monitoreo

Cada servicio expone endpoints de Spring Boot Actuator:

```
http://localhost:<puerto>/actuator/health
http://localhost:<puerto>/actuator/info
http://localhost:<puerto>/actuator/metrics
```

## 📚 Documentación Adicional

Ver `README_Plataforma_Tributaria_Detallado.md` para especificaciones funcionales completas.

## 🤝 Contribuir

1. Implementar servicios faltantes siguiendo la misma estructura
2. Añadir tests unitarios e integración
3. Documentar APIs con Swagger/OpenAPI
4. Implementar Event Driven Architecture con Kafka
