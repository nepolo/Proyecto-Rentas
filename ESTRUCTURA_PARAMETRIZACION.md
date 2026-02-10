# Estructura de Parametrización Tributaria

## Arquitectura Implementada

Según el documento `motor_parametrizacion_tributaria.md`, se ha implementado la separación de responsabilidades en la configuración tributaria:

## Módulos Separados

### 1. **Parametrización por Fuente** (`/parametrizacion-fuente`)
**Icono:** `tune` (ajustes) | **Color:** Azul

**Responsabilidad:** Configurar las tarifas, rangos y factores de ajuste por cada fuente de ingreso.

**Interfaces:**
- `TarifaRango`: Tarifas por rangos de valores (ej: avalúo catastral)
  - fuenteIngresoId
  - vigencia
  - rangoMinimo, rangoMaximo
  - tarifa
  - destinacion
  - activo

- `FactorAjuste`: Factores multiplicadores, porcentajes o valores fijos
  - fuenteIngresoId
  - vigencia
  - nombre
  - tipo: 'MULTIPLICADOR' | 'PORCENTAJE' | 'FIJO'
  - valor
  - descripcion
  - activo

**Principios:**
- Configuración por vigencia fiscal (versionamiento)
- Tarifas dinámicas sin recompilación
- Independencia del objeto tributario (solo identificación y valores base)

---

### 2. **Descuentos** (`/descuentos`)
**Icono:** `discount` | **Color:** Naranja

**Responsabilidad:** Configurar descuentos tributarios aplicables a las liquidaciones.

**Interface:**
- `Descuento`:
  - fuenteIngresoId
  - vigencia
  - codigo
  - nombre
  - tipo: 'PORCENTAJE' | 'VALOR_FIJO'
  - valor
  - condiciones
  - baseLegal
  - fechaInicio, fechaFin (opcional)
  - beneficiario (opcional)
  - activo

**Ejemplos:**
- Descuento por pronto pago (10% primeros 30 días)
- Descuento tercera edad (20% mayores 65 años)
- Descuento nuevas empresas (50% primeros 2 años)
- Descuento estrato 1 y 2 (valor fijo $50,000)

**Funcionalidades:**
- Filtrado por fuente de ingreso
- Filtrado por vigencia fiscal
- Copiar descuentos a siguiente vigencia
- CRUD completo (crear, editar, eliminar)

---

### 3. **Exenciones** (`/exenciones`)
**Icono:** `star` | **Color:** Dorado

**Responsabilidad:** Configurar exenciones tributarias (total, parcial, condicional).

**Interface:**
- `Exencion`:
  - fuenteIngresoId
  - vigencia
  - codigo
  - nombre
  - tipo: 'TOTAL' | 'PARCIAL' | 'CONDICIONAL'
  - porcentaje (0-100)
  - valorMaximo (opcional)
  - condiciones
  - baseLegal
  - requiereAprobacion
  - beneficiario
  - activo

**Ejemplos:**
- Exención instituciones educativas (100%)
- Exención centros de salud (100%)
- Exención parcial VIS (50%, máximo $5,000,000)
- Exención cooperativas (80%, condicional)
- Exención templos religiosos (100%)

**Funcionalidades:**
- Indicador de "Requiere Aprobación"
- Valor máximo de exención (límite)
- Tipos diferenciados (total, parcial, condicional)
- CRUD completo

---

## Flujo de Cálculo Tributario

Según el documento de arquitectura:

```
1. Obtener Objeto Tributario (identificación, datos físicos)
   ↓
2. Obtener Valores Base (avalúo catastral, ingresos, CIIU)
   ↓
3. Obtener Parámetros Tributarios (tarifas, rangos, factores)
   ↓
4. Determinar Base Gravable
   ↓
5. Aplicar Tarifas (según rangos)
   ↓
6. Aplicar Descuentos (según condiciones)
   ↓
7. Aplicar Exenciones (según tipo y condiciones)
   ↓
8. Calcular Conceptos Derivados (intereses, recargos)
   ↓
9. Generar Liquidación Final
```

---

## Menú de Navegación

```
CONFIGURACIÓN
├── Parametrización por Fuente (tune)
├── Descuentos (discount)
└── Exenciones (star)

HERRAMIENTAS
└── Fórmulas (functions)
```

---

## Versionamiento por Vigencia

**Todos los parámetros incluyen:**
- `vigencia: number` - Año fiscal (ej: 2026, 2025, 2024)
- Historial de cambios mantenido
- Función "Copiar a Siguiente Vigencia" para facilitar configuración anual

**Vigencias disponibles:** Últimos 6 años desde el año actual.

---

## Principios de Diseño

### ✅ Configuración Dinámica
- Crear tarifas sin desarrollo
- Crear parámetros sin recompilar
- Todo configurable desde la UI

### ✅ Independencia del Objeto
- El objeto solo almacena: identificación, datos físicos, valores base
- Los parámetros están separados en tablas independientes
- No hay reglas hardcodeadas en el código

### ✅ Integridad Tributaria
- Una liquidación activa por: Objeto + Tercero + Vigencia + Renta
- Versionamiento histórico de parámetros
- Trazabilidad fiscal completa

### ✅ Separación de Responsabilidades
- **Parametrización:** Tarifas, rangos, factores
- **Descuentos:** Incentivos y reducciones
- **Exenciones:** Exoneraciones tributarias
- Cada módulo independiente con su propia lógica

---

## Pendiente por Implementar

### Backend (Microservicios)
- `tributary-parameter-service`: Administración de tarifas, rangos, parámetros
- `discount-service`: Gestión de descuentos
- `exemption-service`: Gestión de exenciones

### Auditoría
- Registro de cambios (usuario, fecha, acción, valores anterior/nuevo)
- Trazabilidad de modificaciones
- Aprobación de cambios críticos

### Validaciones
- Rangos no solapados en tarifas
- Vigencias consistentes
- Permisos por rol para modificación

---

## Datos Mock Disponibles

**Fuentes de Ingreso:**
1. **IPU** - Impuesto Predial Unificado (5 años prescripción)
2. **ICA** - Industria y Comercio (5 años prescripción)
3. **SOBRETASA_BOMBERIL** - Sobretasa Bomberil (3 años prescripción)
4. **PUBLICIDAD_EXTERIOR** - Publicidad Exterior Visual (3 años prescripción)

**Descuentos Mock:** 4 registros de ejemplo
**Exenciones Mock:** 5 registros de ejemplo

---

## Rutas Implementadas

```typescript
/parametrizacion-fuente  → ParametrizacionFuenteComponent
/descuentos              → DescuentosComponent
/exenciones              → ExencionesComponent
```

---

## Tecnologías

- Angular 19 (standalone components, signals)
- Material Design 3
- TypeScript 5
- Lazy loading components
- FormsModule (template-driven forms)

---

**Fecha de Implementación:** Enero 2025  
**Versión:** 1.0  
**Estado:** ✅ Compilando sin errores
