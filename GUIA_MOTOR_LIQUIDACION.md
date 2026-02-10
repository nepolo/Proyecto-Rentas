# 🎯 Guía Rápida - Motor de Liquidación Tributaria

## 🚀 ¿Qué es?

El **Motor de Liquidación Tributaria** es el corazón del sistema, permitiendo:

- ✅ Crear **fuentes de ingreso** y **conceptos de cobro** personalizados
- ✅ Definir **tipos de liquidación** con flujos específicos
- ✅ Generar liquidaciones **individuales** o **masivas**
- ✅ **Reliquidar** y hacer **ajustes** con trazabilidad completa
- ✅ Ver cada renta en su propia vista con estadísticas

---

## 📸 Capturas del Sistema

### Vista Principal - Tabs
```
┌─────────────────────────────────────────────────────────┐
│  Motor de Liquidación Tributaria                        │
│  ═══════════════════════════════════════════════════════│
│  [+ Nueva]  [⚡ Masiva]                                  │
├─────────────────────────────────────────────────────────┤
│  📝 Liquidaciones │ 💰 Fuentes │ 📊 Conceptos │ 📈 Stats│
└─────────────────────────────────────────────────────────┘
```

### Filtros Inteligentes
```
┌───────────────────────────────────────┐
│ 🔍 [Buscar...]  📅 [2024] [1] [Todos]│
│                                        │
│ Filtros activos:                       │
│ [Estado: APROBADA ✕] [Vigencia: 2024 ✕]
└────────────────────────────────────────┘
```

### Vista Cards (Móvil)
```
┌──────────────────────────┐  ┌──────────────────────────┐
│ 🟢 #LIQ-2024-001         │  │ 🟠 #LIQ-2024-002         │
│ Juan Pérez               │  │ María García             │
│ ─────────────────────    │  │ ─────────────────────    │
│ Renta: Predial           │  │ Renta: ICA               │
│ Periodo: 2024/1          │  │ Periodo: 2024/1          │
│ Base: $50,000,000        │  │ Base: $120,000,000       │
│ Total: $500,000          │  │ Total: $1,200,000        │
│ [APROBADA]               │  │ [PENDIENTE]              │
│ [Ver Detalle] [Acciones] │  │ [Ver Detalle] [Aprobar]  │
└──────────────────────────┘  └──────────────────────────┘
```

### Vista Tabla (Desktop)
```
┌────────────────────────────────────────────────────────────────┐
│ #          │ Contribuyente │ Renta   │ Periodo │ Total       │ Estado    │ ⚙️   │
├────────────────────────────────────────────────────────────────┤
│ LIQ-001    │ Juan Pérez    │ Predial │ 2024/1  │ $500,000    │ [APROBADA]│ ⋮  │
│ LIQ-002    │ María García  │ ICA     │ 2024/1  │ $1,200,000  │ [PENDIENTE]│ ⋮  │
│ LIQ-003    │ Pedro López   │ Predial │ 2024/1  │ $750,000    │ [APROBADA]│ ⋮  │
└────────────────────────────────────────────────────────────────┘
        [< Anterior]  [1 2 3 ... 10]  [Siguiente >]
```

---

## 🎯 Casos de Uso Principales

### 1️⃣ Crear Fuente de Ingreso
```
1. Ir a tab "Fuentes de Ingreso"
2. Click en "Nueva Fuente"
3. Llenar:
   - Código: "IMP_PREDIAL"
   - Nombre: "Impuesto Predial"
   - Descripción: "Impuesto sobre la propiedad inmueble"
   - Estado: ACTIVO
4. Guardar
```

### 2️⃣ Crear Conceptos de Cobro para una Fuente
```
1. Seleccionar fuente "Impuesto Predial"
2. En tab "Conceptos de Cobro" click "Nuevo Concepto"
3. Crear cada concepto:
   
   a) Impuesto Base
      - Obligatorio: Sí
      - Vincula fórmula: "CALCULO_PREDIAL_BASE"
      - Orden: 1
   
   b) Sobretasa Ambiental
      - Obligatorio: No
      - Vincula fórmula: "SOBRETASA_AMB"
      - Orden: 2
   
   c) Alumbrado Público
      - Obligatorio: Sí
      - Permite cero: Sí
      - Orden: 3
```

### 3️⃣ Crear Tipo de Liquidación
```
1. Tab "Tipos de Liquidación"
2. "Nuevo Tipo"
3. Configurar:
   - Nombre: "Liquidación Oficial Predial"
   - Conceptos incluidos:
     ✓ Impuesto Base
     ✓ Sobretasa Ambiental  
     ✓ Alumbrado Público
   - Genera factura: Sí
   - Requiere aprobación: Sí
```

### 4️⃣ Liquidación Individual
```
1. Click "Nueva Liquidación"
2. Wizard:
   
   Paso 1: Datos Básicos
   - Contribuyente: [Buscar/Seleccionar]
   - Renta: Predial
   - Tipo: Liquidación Oficial Predial
   - Periodo: 2024/1
   
   Paso 2: Conceptos
   Sistema muestra conceptos del tipo seleccionado:
   
   📝 Impuesto Base
      Base gravable: $50,000,000
      Tarifa: 0.5%
      [Calcular] → Valor: $250,000
   
   📝 Sobretasa Ambiental
      Base: $50,000,000
      Tarifa: 0.2%
      [Calcular] → Valor: $100,000
   
   📝 Alumbrado Público
      Valor fijo: $50,000
   
   ───────────────────────────
   TOTAL: $400,000
   
   Paso 3: Confirmar
   [Guardar Borrador] [Enviar a Aprobación]
```

### 5️⃣ Liquidación Masiva
```
1. Click "Liquidación Masiva"
2. Configurar:
   
   📋 Datos Generales
   - Nombre: "Predial 2024 - Trimestre 1"
   - Tipo: Liquidación Oficial Predial
   - Periodo: 2024/1
   
   🎯 Criterios de Selección
   - Renta: Predial
   - Actividad: ["Residencial", "Comercial"]
   - Excluir: [Contribuyentes con saldo]
   
   👥 Preview
   Total contribuyentes: 1,247
   [Ver listado]
   
3. [Ejecutar Proceso]

4. Monitor en tiempo real:
   ═══════════════════════ 65% ═══════════════
   Procesados: 811 / 1,247
   Exitosos: 805
   Fallidos: 6
   [Ver errores] [Pausar]
```

### 6️⃣ Reliquidar (Hacer Ajustes)
```
1. Seleccionar liquidación APROBADA
2. Click "⋮" → "Reliquidar"
3. Sistema muestra datos actuales
4. Modificar lo necesario:
   
   Concepto: Impuesto Base
   Base anterior: $50,000,000
   Base nueva:    $48,500,000  ← [Modificado]
   Motivo: "Corrección por avalúo catastral"
   
5. [Confirmar Reliquidación]

Resultado:
- Liquidación original → ANULADA
- Nueva liquidación → PENDIENTE
- Ambas vinculadas (trazabilidad)
- Registro en historial de ajustes
```

### 7️⃣ Ver Liquidaciones por Renta
```
1. Tab "Liquidaciones"
2. Filtrar por:
   - Renta: Predial
   - Vigencia: 2024
   - Periodo: 1

Vista agrupada muestra:
┌──────────────────────────────────┐
│ 📊 IMPUESTO PREDIAL - 2024/1     │
│                                   │
│ Total Liquidaciones: 1,247        │
│ Valor Total: $620,500,000         │
│ Promedio: $497,590                │
│                                   │
│ Estados:                          │
│  🟢 Aprobadas: 1,180 (95%)        │
│  🟠 Pendientes: 60 (5%)           │
│  🔴 Anuladas: 7 (0.5%)            │
│                                   │
│ [Ver Todas] [Exportar] [Gráficos]│
└──────────────────────────────────┘

[Listado de liquidaciones...]
```

---

## 🔄 Flujos de Estado

```
BORRADOR
   ↓ [Enviar a aprobación]
PENDIENTE
   ↓ [Aprobar]          ↓ [Rechazar]
APROBADA              RECHAZADA
   ↓ [Facturar]
FACTURADA
   
   [Anular] → ANULADA (desde cualquier estado)
   [Reliquidar] → Nueva liquidación (PENDIENTE)
```

---

## 🎨 Elementos UX Destacados

### Búsqueda Inteligente
- ⏱️ Debounce de 400ms (no busca en cada tecla)
- 🔍 Busca en: número, contribuyente, renta
- 💡 Sugiere mientras escribes

### Filtros con Chips
```
[Filtros aplicados:]
[Estado: APROBADA ✕] [Vigencia: 2024 ✕] [Periodo: 1 ✕]
```
Click en ✕ para remover filtro individual

### Estados con Colores
- 🟤 BORRADOR - Editable
- 🟠 PENDIENTE - Espera aprobación  
- 🟢 APROBADA - Lista para facturar
- 🔵 FACTURADA - Completada
- 🔴 ANULADA - Cancelada

### Menú Contextual (⋮)
Acciones disponibles según estado:
```
⋮ Menú
├─ 👁️ Ver Detalle (todos)
├─ ✏️ Editar (solo BORRADOR)
├─ ✅ Aprobar (solo PENDIENTE)
├─ 🔄 Reliquidar (APROBADA/FACTURADA)
└─ ❌ Anular (excepto ANULADA)
```

### Toggle de Vista
```
[▦] Cards    [☰] Tabla
```
Click para cambiar entre vistas

---

## 📊 Estadísticas y Reportes

### Dashboard Principal
```
┌─────────────────────────────────────────────┐
│ 📈 ESTADÍSTICAS GENERALES - 2024            │
│                                              │
│ ┌────────────┐ ┌────────────┐ ┌──────────┐ │
│ │ 📝 1,247   │ │ 💰 $620M   │ │ 📊 95%   │ │
│ │ Total      │ │ Recaudado  │ │ Aprobado │ │
│ └────────────┘ └────────────┘ └──────────┘ │
│                                              │
│ Por Renta:                                   │
│ ▓▓▓▓▓▓▓▓▓▓░░ Predial    ($450M - 72%)       │
│ ▓▓▓▓░░░░░░░░ ICA        ($120M - 19%)       │
│ ▓▓░░░░░░░░░░ Otros      ($50M  - 9%)        │
│                                              │
│ Tendencia Mensual:                           │
│     ╱╲                                       │
│    ╱  ╲    ╱╲                                │
│   ╱    ╲  ╱  ╲   ╱                           │
│  ╱      ╲╱    ╲ ╱                            │
│ ╱              ╲                             │
│ E F M A M J J A S O N D                      │
└─────────────────────────────────────────────┘
```

---

## 🚀 Tips de Performance

### Para Datasets Grandes
1. ✅ Usa paginación (50-100 registros max)
2. ✅ Activa filtros antes de buscar
3. ✅ Vista tabla es más eficiente que cards para +100 registros
4. ✅ Liquidación masiva procesa en background

### Optimizaciones Implementadas
- 🚄 Server-side pagination
- ⏱️ Debounce en búsqueda (evita 10+ requests)
- 💾 Caché de catálogos (rentas, tipos, conceptos)
- 📦 Lazy loading de módulos
- 🔄 Virtual scrolling (futuro para listas +1000)

---

## 📱 Uso Móvil

### Gestos Soportados
- 👆 **Tap:** Ver detalle
- 👆 **Long press:** Menú contextual
- 👈 **Swipe left:** Siguiente página
- 👉 **Swipe right:** Página anterior
- 🔍 **Pinch zoom:** En gráficos

### Vista Móvil Optimizada
- Cards más grandes
- Botones de acción más accesibles
- Filtros en panel lateral
- Menú hamburguesa

---

## 🎓 Casos Especiales

### ¿Qué pasa si hay error en liquidación masiva?
```
El proceso continúa con los demás
Los errores se registran con:
- ID del contribuyente
- Motivo del error
- Sugerencia de solución

Al finalizar:
- Reporte de exitosos
- Reporte de fallidos
- Opción de reprocesar solo los fallidos
```

### ¿Puedo editar una liquidación APROBADA?
```
NO directamente.
Debes usar "Reliquidar" que:
1. Anula la original
2. Crea una nueva
3. Mantiene la trazabilidad
```

### ¿Cómo funcionan los conceptos obligatorios?
```
Al crear liquidación:
- Conceptos obligatorios: NO se pueden omitir
- Conceptos opcionales: Pueden agregarse o no
- Si "Permite cero": Puede tener valor 0
- Si NO permite cero: Debe tener valor > 0
```

---

## 🔗 Integraciones

El motor se integra con:
- ✅ **Parametrización:** Usa rentas y configuraciones
- ✅ **Fórmulas:** Aplica cálculos automáticos
- ✅ **Facturación:** Genera facturas automáticas
- ✅ **Cartera:** Actualiza estados de cuenta
- ✅ **Notificaciones:** Envía alertas y recordatorios

---

**¡El Motor de Liquidación Tributaria es el núcleo del sistema moderno!** 🚀

Ver documentación completa en: `MOTOR_LIQUIDACION_DOCUMENTACION.md`
