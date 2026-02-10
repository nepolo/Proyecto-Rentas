# 🚀 Plataforma Tributaria - Sistema de Recaudo Municipal

## ✅ Backend Implementado

Se han creado los siguientes endpoints REST:

### 1. **Seguridad Service** (Puerto 8089)
Gestiona usuarios, roles y permisos del sistema.

**Endpoints Disponibles:**
```
GET    /api/admin/usuarios              - Listar todos los usuarios
GET    /api/admin/usuarios/{id}         - Obtener usuario por ID
POST   /api/admin/usuarios              - Crear nuevo usuario
PUT    /api/admin/usuarios/{id}         - Actualizar usuario
DELETE /api/admin/usuarios/{id}         - Eliminar usuario
PUT    /api/admin/usuarios/{id}/activar - Activar usuario
PUT    /api/admin/usuarios/{id}/desactivar - Desactivar usuario
PUT    /api/admin/usuarios/{id}/cambiar-password - Cambiar contraseña

GET    /api/admin/roles                 - Listar todos los roles
POST   /api/admin/roles                 - Crear nuevo rol
PUT    /api/admin/roles/{id}            - Actualizar rol
DELETE /api/admin/roles/{id}            - Eliminar rol

GET    /api/admin/permisos              - Listar todos los permisos
GET    /api/admin/permisos/modulo/{modulo} - Permisos por módulo
```

**Modelos:**
- `Usuario`: id, nombre, email, username, password, roles[], entidad, activo
- `Rol`: id, codigo, nombre, descripcion, permisos[], activo
- `Permiso`: id, codigo, nombre, descripcion, modulo, accion

### 2. **Liquidacion Service** (Puerto 8083)
Gestiona fuentes de ingreso, conceptos, liquidaciones y dashboard.

**Endpoints Disponibles:**
```
# Dashboard
GET    /api/dashboard/kpis              - KPIs globales del dashboard
GET    /api/dashboard/fuentes-recaudo   - Recaudo por fuente de ingreso

# Fuentes de Ingreso
GET    /api/fuentes                     - Listar fuentes (filtro por categoria)
GET    /api/fuentes/{id}                - Obtener fuente por ID
POST   /api/fuentes                     - Crear nueva fuente
PUT    /api/fuentes/{id}                - Actualizar fuente
DELETE /api/fuentes/{id}                - Eliminar fuente

# Conceptos de Cobro por Fuente
GET    /api/fuentes/{fuenteId}/conceptos - Listar conceptos de una fuente
POST   /api/fuentes/{fuenteId}/conceptos - Crear concepto
PUT    /api/fuentes/{fuenteId}/conceptos/{id} - Actualizar concepto
DELETE /api/fuentes/{fuenteId}/conceptos/{id} - Eliminar concepto
```

**Modelos:**
- `FuenteIngreso`: id, codigo, nombre, descripcion, categoria, tipoObjeto, activo, conceptosCount, objetosCount, etc.
- `ConceptoCobro`: id, fuente, codigo, nombre, tipo (CAPITAL, INTERES, SOBRETASA), tarifaBase, formula, activo

## 🎯 Frontend Implementado

### Módulos Principales:

#### 1. **Dashboard** (`/dashboard`)
- KPIs globales: Recaudo Total, Facturado, Cartera, Contribuyentes
- Desglose por Fuente de Ingreso con efectividad
- Accesos rápidos a funciones principales
- Placeholder para gráficas de recaudo mensual

#### 2. **Administración** (`/admin`)
5 pestañas:
- **Usuarios**: CRUD completo con roles y estado
- **Roles y Permisos**: Gestión granular de permisos por módulo
- **Entidades**: (Placeholder)
- **Configuración**: (Placeholder)
- **Auditoría**: (Placeholder)

#### 3. **Fuentes de Ingreso** (`/fuentes`)
- Dashboard general con 8 fuentes de ejemplo
- Filtros por categoría y búsqueda
- Vista detalle (`/fuentes/:id`) con 7 pestañas:
  1. **Dashboard**: KPIs propios de la fuente
  2. **Objetos Tributarios**: Gestión dinámica (Predios, Establecimientos, etc.)
  3. **Conceptos**: Capital, Interés, Sobretasa
  4. **Fórmulas Dinámicas**: Editor con IF/THEN/ELSE
  5. **Períodos de Facturación**: Configuración anual/bimestral/mensual
  6. **Liquidaciones**: Individual y masiva
  7. **Facturas**: Generadas por período

#### 4. **Liquidaciones** (`/liquidaciones`)
- Tabla con filtros
- Estadísticas
- (Fórmulas y conceptos movidos a Fuentes)

## 📦 Iniciar el Sistema

### Opción 1: Script Automático
```powershell
cd Proyecto-Rentas
.\iniciar-sistema.ps1
```

Este script:
- Detiene procesos previos
- Inicia Seguridad Service (puerto 8089)
- Inicia Liquidacion Service (puerto 8083)
- Inicia Frontend Angular (puerto 4200)

### Opción 2: Manual

#### Backend
```powershell
# Terminal 1 - Seguridad Service
cd services\seguridad-service
mvn spring-boot:run

# Terminal 2 - Liquidacion Service
cd services\liquidacion-service
mvn spring-boot:run
```

#### Frontend
```powershell
# Terminal 3 - Angular
cd frontend-angular
npm start
```

## 🌐 URLs

- **Frontend**: http://localhost:4200
- **Seguridad API**: http://localhost:8089
- **Liquidacion API**: http://localhost:8083
- **H2 Console Seguridad**: http://localhost:8089/h2-console
- **H2 Console Liquidacion**: http://localhost:8083/h2-console

## 🔧 Configuración Base de Datos

Ambos servicios usan H2 en memoria para desarrollo:

**Seguridad Service (application.properties):**
```properties
spring.datasource.url=jdbc:h2:mem:seguridaddb
spring.datasource.username=sa
spring.datasource.password=
```

**Liquidacion Service (application.properties):**
```properties
spring.datasource.url=jdbc:h2:mem:liquidaciondb
spring.datasource.username=sa
spring.datasource.password=
```

## 📊 Datos de Ejemplo

### Dashboard KPIs
- Recaudo Total: $486.2B (+18.4% vs 2023)
- Total Facturado: $612.8B
- Cartera Activa: $126.6B
- Contribuyentes: 45,678

### Fuentes de Ingreso con Recaudo
1. **Predial Unificado**: $156.0B facturado / $128.5B recaudado (82.4%)
2. **ICA Industrial**: $89.3B / $71.2B (79.7%)
3. **ICA Comercial**: $124.5B / $102.8B (82.6%)
4. **Alumbrado Público**: $145.2B / $118.4B (81.5%)
5. **Valorización**: $67.8B / $48.6B (71.7%)
6. **Espacio Público**: $30.0B / $16.7B (55.7%)

### Roles Predefinidos
- **Administrador**: Acceso total
- **Liquidador**: Crear y gestionar liquidaciones
- **Aprobador**: Aprobar liquidaciones y facturas
- **Consulta**: Solo lectura

## 🔄 Flujo Completo del Sistema

```
1. Admin crea FUENTE DE INGRESO
   ↓
2. Configura OBJETOS TRIBUTARIOS (Predios, Establecimientos, etc.)
   ↓
3. Define CONCEPTOS DE COBRO (Capital, Interés, Sobretasa)
   ↓
4. Crea FÓRMULAS DINÁMICAS (IF estrato <= 2 THEN tarifa = 0.005)
   ↓
5. Configura PERÍODOS DE FACTURACIÓN (Anual ÷ 6 = Bimestral)
   ↓
6. Genera LIQUIDACIÓN ANUAL (usando avalúo, área, estrato)
   ↓
7. Sistema genera FACTURAS por período
   ↓
8. Módulo de PAGOS aplica recaudos
   ↓
9. Dashboard muestra EFECTIVIDAD de recaudo
```

## 🚀 Próximas Funcionalidades

### Fase 1: Backend Completo
- [ ] Datos semilla (seed data) para usuarios y roles
- [ ] Autenticación JWT
- [ ] Gestión de objetos tributarios (CRUD dinámico)
- [ ] Motor de fórmulas dinámicas
- [ ] Generación automática de liquidaciones

### Fase 2: Integración
- [ ] Conectar liquidación → facturación
- [ ] Módulo de pagos con búsqueda de facturas
- [ ] Actualización de cartera en tiempo real
- [ ] Generación de recibos oficiales

### Fase 3: Características Avanzadas
- [ ] Importación masiva desde Excel
- [ ] Gráficas interactivas (Chart.js)
- [ ] Exportación de reportes
- [ ] Auditoría de cambios
- [ ] Notificaciones por correo

## 📝 Notas Técnicas

- **Framework**: Spring Boot 3.x + Angular 19
- **Base de Datos**: H2 (desarrollo) - migrar a PostgreSQL/MySQL en producción
- **ORM**: JPA/Hibernate
- **Frontend**: Standalone Components con Signals
- **Estilos**: Material Design + SCSS
- **Arquitectura**: Microservicios REST
- **CORS**: Habilitado para http://localhost:4200

## 🐛 Solución de Problemas

### Frontend no compila
```powershell
cd frontend-angular
Remove-Item -Recurse -Force .angular, node_modules
npm install
npm start
```

### Puerto 4200 ocupado
```powershell
Stop-Process -Name "node" -Force
npm start
```

### Backend no arranca
```powershell
cd services/liquidacion-service
mvn clean install
mvn spring-boot:run
```

## 📞 Endpoints de Prueba (cURL)

### Obtener Dashboard KPIs
```bash
curl http://localhost:8083/api/dashboard/kpis
```

### Listar Fuentes de Ingreso
```bash
curl http://localhost:8083/api/fuentes
```

### Listar Usuarios
```bash
curl http://localhost:8089/api/admin/usuarios
```

### Crear Nueva Fuente
```bash
curl -X POST http://localhost:8083/api/fuentes \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "VEH",
    "nombre": "Impuesto Vehicular",
    "descripcion": "Impuesto sobre vehículos automotores",
    "categoria": "directos",
    "tipoObjeto": "Vehículo",
    "icono": "directions_car",
    "color": "#3f51b5"
  }'
```

---

**¡Sistema listo para desarrollo y pruebas!** 🎉
