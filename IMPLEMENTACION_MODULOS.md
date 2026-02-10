# Implementación de Módulos: Entidades y Objetos Tributarios Dinámicos

## 📋 Resumen de Implementación

Se han implementado dos módulos críticos para el sistema de rentas:

### 1. **Módulo de Entidades Territoriales**
Registro y gestión de la entidad territorial que usa el sistema (municipio, distrito, departamento).

### 2. **Módulo de Objetos Tributarios Dinámicos**
Sistema de formularios dinámicos que permite registrar diferentes tipos de objetos tributarios con campos predefinidos y personalizados.

---

## 🏢 Módulo de Entidades

### Ubicación
- **Componente**: `frontend-angular/src/app/features/admin/entidades/entidades.component.ts`
- **Ruta**: `/admin/entidades`

### Funcionalidades Implementadas

#### ✅ Información Legal
- **NIT**: Con validación de patrón numérico
- **Dígito de Verificación**: Campo separado
- **Razón Social**: Nombre legal de la entidad
- **Nombre Comercial**: Nombre comercial (opcional)
- **Tipo de Entidad**: 
  - Municipio
  - Distrito  
  - Departamento
  - Entidad Descentralizada
- **Régimen Tributario**:
  - Especial
  - Común

#### ✅ Ubicación
- **Dirección**: Dirección completa de la entidad
- **Municipio**: Nombre del municipio
- **Departamento**: Selector con 6 departamentos:
  - Antioquia
  - Cundinamarca
  - Valle del Cauca
  - Atlántico
  - Santander
  - Bolívar

#### ✅ Contacto
- **Teléfono**: Número de contacto
- **Email**: Con validación de formato
- **Sitio Web**: URL del sitio oficial

#### ✅ Representante Legal
- **Nombre Completo**: Del representante legal
- **Cédula**: Número de identificación

#### ✅ **Vigencia Fiscal** (Sección Destacada)
- **Año Fiscal**: Año de la vigencia actual (default: año actual)
- **Fecha Inicio de Vigencia**: Calendario de selección (default: 1 de enero)
- **Fecha Fin de Vigencia**: Calendario de selección (default: 31 de diciembre)
- Sección visualmente resaltada con fondo gris
- Texto descriptivo de la importancia de la vigencia fiscal

#### ✅ Gestión de Datos
- **Tabla de visualización** con columnas:
  - NIT-DV (concatenado)
  - Razón Social
  - Tipo (con chip coloreado)
  - Vigencia (año en negrita)
  - Estado (chip verde/rojo: Activa/Inactiva)
  - Acciones (editar/eliminar)
- CRUD completo: Crear, Leer, Actualizar, Eliminar
- Formulario reactivo con validaciones
- Estado vacío con mensaje informativo

### Tecnologías Utilizadas
- **Angular 19**: Standalone components con signals
- **Reactive Forms**: FormBuilder, FormGroup, Validators
- **Material Design**: 13 módulos (FormField, Input, Select, Button, Table, Chips, Datepicker, etc.)
- Layout responsive con CSS Grid (2 columnas)

---

## 🏠 Módulo de Objetos Tributarios Dinámicos

### Ubicación
- **Servicio**: `frontend-angular/src/app/core/services/objetos-tributarios.service.ts`
- **Diálogo**: `frontend-angular/src/app/features/fuentes/objeto-tributario-dialog/objeto-tributario-dialog.component.ts`
- **Integración**: Tab "Objetos Tributarios" en `fuente-detalle.component.ts`

### Concepto del Sistema

El sistema permite gestionar **diferentes tipos de objetos tributarios** según la fuente de ingreso:

| Fuente de Ingreso | Tipo de Objeto |
|-------------------|----------------|
| Predial Urbano/Rural | **Predio** |
| ICA Industrial/Comercial | **Establecimiento** |
| Alumbrado Público | **Suscriptor** |
| Valorización | **Obra** |
| Espacio Público | **Permiso** |

### Arquitectura de Campos Dinámicos

#### Tipos de Campos Soportados (8 tipos)
1. **texto**: Campos de texto general
2. **numero**: Valores numéricos
3. **moneda**: Valores monetarios (con prefijo $)
4. **porcentaje**: Porcentajes (con sufijo %)
5. **fecha**: Selector de fechas (MatDatepicker)
6. **email**: Email con validación
7. **telefono**: Teléfono formateado
8. **boolean**: Checkbox sí/no
9. **lista**: Dropdown con opciones predefinidas

#### Propiedades de Cada Campo
```typescript
{
  id: string;              // Identificador único
  nombre: string;          // Nombre del campo (clave en valores)
  etiqueta: string;        // Etiqueta visible
  tipo: 'texto' | 'numero' | ... ;
  obligatorio: boolean;    // Si es requerido
  valorPorDefecto?: any;   // Valor inicial
  opciones?: string[];     // Para tipo 'lista'
  orden: number;           // Orden de visualización
  grupo?: string;          // Agrupación visual
  ayuda?: string;          // Tooltip informativo
  validaciones?: {         // Reglas de validación
    min?: number;
    max?: number;
    pattern?: string;
    mensaje?: string;
  };
}
```

### Plantillas Predefinidas (5 tipos)

#### 1. **PREDIO** (11 campos)

**Grupos**: Identificación, Ubicación, Clasificación, Valoración, Características, Propietario, Contacto

| Campo | Tipo | Obligatorio | Opciones |
|-------|------|-------------|----------|
| Matrícula Inmobiliaria | texto | ✅ | - |
| Dirección | texto | ✅ | - |
| Barrio/Vereda | texto | ✅ | - |
| Estrato | lista | ✅ | 1, 2, 3, 4, 5, 6 |
| Avalúo Catastral | moneda | ✅ | Con ayuda: "Valor catastral actualizado" |
| Área m² | numero | ✅ | min: 0 |
| Uso del Suelo | lista | ✅ | Residencial, Comercial, Industrial, Mixto, Lote |
| Propietario | texto | ✅ | - |
| Cédula/NIT | texto | ✅ | - |
| Teléfono | telefono | ❌ | - |
| Email | email | ❌ | - |

**Uso**: Impuesto Predial, Sobretasa Ambiental

---

#### 2. **ESTABLECIMIENTO** (10 campos)

**Grupos**: Identificación, Ubicación, Actividad, Financiero, Tributario, Legal, Contacto

| Campo | Tipo | Obligatorio |
|-------|------|-------------|
| NIT | texto | ✅ |
| Razón Social | texto | ✅ |
| Nombre Comercial | texto | ❌ |
| Dirección | texto | ✅ |
| Actividad Económica CIIU | texto | ✅ |
| Ingresos Anuales | moneda | ✅ |
| Tarifa ICA | porcentaje | ✅ |
| Representante Legal | texto | ✅ |
| Teléfono | telefono | ✅ |
| Email | email | ✅ |

**Uso**: ICA Industrial, ICA Comercial

---

#### 3. **SUSCRIPTOR** (7 campos)

**Grupos**: Identificación, Personal, Ubicación, Clasificación, Servicio, Contacto

| Campo | Tipo | Obligatorio | Opciones |
|-------|------|-------------|----------|
| Número de Suscriptor | texto | ✅ | - |
| Nombre Completo | texto | ✅ | - |
| Cédula | texto | ✅ | - |
| Dirección del Servicio | texto | ✅ | - |
| Estrato | lista | ✅ | 1, 2, 3, 4, 5, 6 |
| Número de Medidor | texto | ❌ | - |
| Teléfono | telefono | ❌ | - |

**Uso**: Alumbrado Público, Servicios Públicos

---

#### 4. **OBRA** (7 campos)

**Grupos**: Identificación, Clasificación, Medidas, Financiero, Beneficiarios, Cronograma

| Campo | Tipo | Obligatorio | Opciones |
|-------|------|-------------|----------|
| Código de Obra | texto | ✅ | - |
| Nombre de la Obra | texto | ✅ | - |
| Tipo de Obra | lista | ✅ | Pavimentación, Acueducto, Alcantarillado, Espacio Público, Otra |
| Metros Lineales | numero | ✅ | min: 0 |
| Presupuesto Total | moneda | ✅ | - |
| Número de Beneficiarios | numero | ✅ | min: 0 |
| Fecha de Inicio | fecha | ❌ | - |

**Uso**: Valorización

---

#### 5. **PERMISO** (8 campos)

**Grupos**: Identificación, Clasificación, Titular, Ubicación, Medidas, Vigencia

| Campo | Tipo | Obligatorio | Opciones |
|-------|------|-------------|----------|
| Número de Permiso | texto | ✅ | - |
| Tipo de Permiso | lista | ✅ | Temporal, Permanente, Eventual |
| Titular del Permiso | texto | ✅ | - |
| Cédula/NIT | texto | ✅ | - |
| Ubicación | texto | ✅ | - |
| Área Ocupada m² | numero | ✅ | min: 0 |
| Fecha de Expedición | fecha | ✅ | - |
| Fecha de Vencimiento | fecha | ✅ | - |

**Uso**: Permiso de Espacio Público

---

## 🔧 Funcionalidades del Diálogo de Objetos Tributarios

### Características Principales

#### ✅ Formulario Dinámico
- **Generación automática** de campos basada en el tipo de objeto
- **Validaciones reactivas** según configuración de cada campo
- **Agrupación visual** con Mat Expansion Panels
- **Iconos descriptivos** por grupo
- **Tooltips de ayuda** en campos con información adicional

#### ✅ Campos Personalizados
- **Botón "Agregar Campo Personalizado"**: Aparece después de campos base
- **Formulario de nuevo campo** con:
  - Nombre del Campo
  - Etiqueta visible
  - Tipo de campo (8 opciones)
  - Grupo de agrupación
  - Checkbox "Campo Obligatorio"
- Los campos personalizados se agregan al formulario dinámicamente
- Se integran en la agrupación existente

#### ✅ Renderizado Inteligente
- **Campos de texto**: MatInput estándar
- **Campos numéricos**: Input type="number" con step
- **Moneda**: Input con prefijo "$"
- **Porcentaje**: Input con sufijo "%"
- **Lista**: MatSelect con opciones predefinidas
- **Fecha**: MatDatepicker con calendario
- **Email**: Input con validación de formato
- **Teléfono**: Input con prefijo de icono
- **Boolean**: MatCheckbox

#### ✅ Validaciones
- Campos obligatorios marcados con *
- Validación de email
- Validación de números (min/max)
- Mensajes de error personalizados
- Validación antes de guardar

### Integración en Fuente Detalle

#### Tab "Objetos Tributarios"
- **Título dinámico**: "Gestión de {TipoObjeto}" (Predio, Establecimiento, etc.)
- **Botón "Nuevo {TipoObjeto}"**: Abre el diálogo
- **Botón "Importar Excel"**: Para carga masiva (futuro)
- **Buscador**: Filtro por código o descripción
- **Tabla de resultados**:
  - Código
  - Descripción principal (según tipo de objeto)
  - Estado (chip Activo/Inactivo)
  - Acciones (editar/eliminar)
- **Estado vacío**: Mensaje + botón para registrar primer objeto

### Lógica de Valores Principales por Tipo

```typescript
Predio → matricula o direccion
Establecimiento → razonSocial o nombreComercial
Suscriptor → nombre
Obra → nombreObra
Permiso → titular
```

---

## 📊 Métodos del Servicio

### `obtenerPlantilla(tipoObjeto: string): CampoDinamico[]`
Retorna el array de campos predefinidos para el tipo de objeto solicitado.

**Ejemplo**:
```typescript
const campos = objetosService.obtenerPlantilla('Predio');
// Retorna 11 campos: matricula, direccion, barrio, estrato, etc.
```

### `validarCampo(campo: CampoDinamico, valor: any)`
Valida el valor ingresado según las reglas del campo.

**Retorna**: `{ valido: boolean, mensaje?: string }`

**Validaciones**:
- Campo obligatorio sin valor → `false`
- Valor < min o > max → `false` con mensaje personalizado
- Pattern no cumplido → `false` con mensaje

### `agruparCampos(campos: CampoDinamico[])`
Agrupa los campos por la propiedad `grupo`.

**Retorna**: `{ [grupo: string]: CampoDinamico[] }`

**Ejemplo**:
```typescript
{
  "Identificación": [campo1, campo2],
  "Ubicación": [campo3, campo4],
  "Contacto": [campo5]
}
```

---

## 🎨 Experiencia de Usuario

### Flujo de Trabajo

1. **Usuario navega** a `/fuentes/{id}` (ej: Predial Unificado Urbano)
2. **Hace clic** en tab "Objetos Tributarios"
3. **Sistema detecta** tipo de objeto: "Predio"
4. **Usuario hace clic** en "Nuevo Predio"
5. **Diálogo se abre** con formulario dinámico:
   - Código del Predio (campo obligatorio)
   - 7 grupos expandibles:
     - Identificación (matrícula)
     - Ubicación (dirección, barrio)
     - Clasificación (estrato, uso)
     - Valoración (avalúo)
     - Características (área)
     - Propietario (nombre, cédula)
     - Contacto (teléfono, email)
6. **Usuario llena** los campos
7. **Opcionalmente**, hace clic en "Agregar Campo Personalizado"
8. **Ingresa**: Campo "Zona de Riesgo", Tipo: Lista, Opciones: Alta/Media/Baja
9. **Hace clic** en "Guardar"
10. **Sistema valida** y cierra diálogo
11. **Objeto aparece** en la tabla con código, matrícula y estado Activo

### Ventajas del Sistema Dinámico

✅ **Flexibilidad**: Cada municipio puede agregar campos según normatividad local  
✅ **Consistencia**: Campos base garantizan información mínima requerida  
✅ **Escalabilidad**: Fácil agregar nuevos tipos de objetos tributarios  
✅ **Reutilización**: Una sola infraestructura para múltiples tipos  
✅ **Mantenibilidad**: Cambios en plantillas no requieren modificar componentes  
✅ **Validación**: Reglas centralizadas en el servicio

---

## 🔄 Persistencia de Datos

### Estado Actual
Los datos se almacenan en **signals de Angular** (memoria local).

### Estructura de Almacenamiento

```typescript
ObjetoTributario {
  id?: number;              // Generado automáticamente
  fuenteId: number;         // Relación con fuente de ingreso
  tipoObjeto: string;       // 'Predio', 'Establecimiento', etc.
  codigo: string;           // Código único del objeto
  valores: {                // Diccionario de valores dinámicos
    [nombreCampo]: any
  },
  activo: boolean;          // Estado
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}
```

### Ejemplo de Objeto Guardado

```typescript
{
  id: 1,
  fuenteId: 1,
  tipoObjeto: 'Predio',
  codigo: '01-001-0001',
  valores: {
    matricula: '50N-123456',
    direccion: 'Calle 10 # 5-25',
    barrio: 'Centro',
    estrato: '3',
    avaluo: 120000000,
    area: 85.5,
    uso: 'Residencial',
    propietario: 'Juan Pérez',
    cedula: '1234567890',
    telefono: '3001234567',
    email: 'juan@email.com',
    // Campos personalizados
    zonaRiesgo: 'Media'
  },
  activo: true,
  fechaCreacion: new Date('2024-01-15')
}
```

---

## 🚀 Próximos Pasos (Backend Pendiente)

### 1. Backend para Entidades

**Servicio Sugerido**: `seguridad-service` (puerto 8089)

**Modelo JPA**:
```java
@Entity
@Table(name = "entidades")
public class Entidad {
    @Id @GeneratedValue
    private Long id;
    
    private String nit;
    private String digitoVerificacion;
    private String razonSocial;
    private String nombreComercial;
    
    @Enumerated(EnumType.STRING)
    private TipoEntidad tipoEntidad; // MUNICIPIO, DISTRITO, etc.
    
    @Enumerated(EnumType.STRING)
    private Regimen regimen; // ESPECIAL, COMUN
    
    // Ubicación
    private String direccion;
    private String municipio;
    private String departamento;
    
    // Contacto
    private String telefono;
    private String email;
    private String sitioWeb;
    
    // Representante Legal
    private String representanteLegal;
    private String cedulaRepresentante;
    
    // Vigencia Fiscal
    private Integer vigenciaFiscalActual;
    private LocalDate fechaInicioVigencia;
    private LocalDate fechaFinVigencia;
    
    private String logoUrl;
    private Boolean activa;
}
```

**Endpoints**:
- `GET /api/admin/entidades` - Listar todas
- `POST /api/admin/entidades` - Crear
- `PUT /api/admin/entidades/{id}` - Actualizar
- `DELETE /api/admin/entidades/{id}` - Eliminar
- `GET /api/admin/entidades/activa` - Obtener entidad activa
- `PUT /api/admin/entidades/{id}/activar` - Activar entidad

### 2. Backend para Objetos Tributarios

**Servicio Sugerido**: `liquidacion-service` (puerto 8083)

**Modelo JPA**:
```java
@Entity
@Table(name = "objetos_tributarios")
public class ObjetoTributario {
    @Id @GeneratedValue
    private Long id;
    
    private Long fuenteId;
    private String tipoObjeto; // 'Predio', 'Establecimiento', etc.
    private String codigo;
    
    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> valores; // PostgreSQL JSONB
    
    private Boolean activo;
    
    @CreationTimestamp
    private LocalDateTime fechaCreacion;
    
    @UpdateTimestamp
    private LocalDateTime fechaActualizacion;
}

@Entity
@Table(name = "campos_personalizados")
public class CampoPersonalizado {
    @Id @GeneratedValue
    private Long id;
    
    private Long fuenteId;
    private String tipoObjeto;
    
    private String nombre;
    private String etiqueta;
    
    @Enumerated(EnumType.STRING)
    private TipoCampo tipo; // TEXTO, NUMERO, FECHA, etc.
    
    private Boolean obligatorio;
    private String grupo;
    private String ayuda;
    private Integer orden;
    
    @Type(JsonType.class)
    @Column(columnDefinition = "json")
    private List<String> opciones; // Para tipo LISTA
    
    @Type(JsonType.class)
    @Column(columnDefinition = "json")
    private Map<String, Object> validaciones;
}
```

**Endpoints**:

**Objetos**:
- `GET /api/fuentes/{fuenteId}/objetos` - Listar objetos de una fuente (paginado)
- `GET /api/fuentes/{fuenteId}/objetos/{id}` - Obtener objeto específico
- `POST /api/fuentes/{fuenteId}/objetos` - Crear objeto
- `PUT /api/objetos/{id}` - Actualizar objeto
- `DELETE /api/objetos/{id}` - Eliminar objeto
- `GET /api/objetos/{id}/historial` - Historial de cambios

**Campos Personalizados**:
- `GET /api/fuentes/{fuenteId}/campos-personalizados` - Obtener campos custom
- `POST /api/fuentes/{fuenteId}/campos-personalizados` - Crear campo custom
- `PUT /api/campos-personalizados/{id}` - Actualizar campo custom
- `DELETE /api/campos-personalizados/{id}` - Eliminar campo custom

**Importación Masiva**:
- `POST /api/fuentes/{fuenteId}/objetos/importar` - Importar desde Excel
- `GET /api/fuentes/{fuenteId}/objetos/plantilla-excel` - Descargar plantilla

### 3. Integración con Liquidaciones

Los objetos tributarios son la base para crear liquidaciones:

```java
@Entity
public class Liquidacion {
    // ...
    @ManyToOne
    private ObjetoTributario objetoTributario; // Relación
    
    private String codigoObjeto; // Referencia al código
    // ...
}
```

---

## 📝 Notas de Implementación

### Decisiones de Arquitectura

1. **¿Por qué Signals?**
   - State management reactivo nativo de Angular 19
   - Mejor performance que BehaviorSubject
   - Detección de cambios más eficiente

2. **¿Por qué Standalone Components?**
   - Nueva arquitectura recomendada por Angular
   - Menos boilerplate (no necesita NgModule)
   - Imports explícitos mejoran tree-shaking

3. **¿Por qué Reactive Forms?**
   - Validaciones programáticas complejas
   - Generación dinámica de controles
   - Mejor testing y mantenibilidad

4. **¿Por qué Material Design?**
   - Componentes enterprise-ready
   - Accesibilidad (A11y) incluida
   - Consistencia visual
   - Theming centralizado

5. **¿Por qué JSONB en Backend?**
   - Flexibilidad para valores dinámicos
   - Indexación y búsqueda eficiente
   - No requiere schema fijo
   - Permite agregar campos sin migrations

### Mejoras Futuras

#### Corto Plazo
- [ ] Implementar backend para entidades
- [ ] Implementar backend para objetos tributarios
- [ ] Agregar filtros avanzados en tabla
- [ ] Implementar búsqueda por texto
- [ ] Agregar paginación

#### Mediano Plazo
- [ ] Importación masiva desde Excel
- [ ] Exportación a Excel/PDF
- [ ] Historial de cambios por objeto
- [ ] Validaciones cruzadas entre campos
- [ ] Geolocalización para predios
- [ ] Adjuntar documentos por objeto

#### Largo Plazo
- [ ] Integración con GIS (mapas)
- [ ] OCR para digitalización de documentos
- [ ] API pública para integraciones
- [ ] Machine Learning para validaciones
- [ ] Dashboard de análisis de objetos
- [ ] App móvil para captura en campo

---

## 🧪 Testing

### Tests Unitarios Sugeridos

**Servicio de Objetos Tributarios**:
```typescript
describe('ObjetosTributariosService', () => {
  it('debe retornar 11 campos para Predio', () => {
    const campos = service.obtenerPlantilla('Predio');
    expect(campos.length).toBe(11);
  });

  it('debe validar campo obligatorio', () => {
    const campo: CampoDinamico = {
      id: 'test',
      nombre: 'matricula',
      etiqueta: 'Matrícula',
      tipo: 'texto',
      obligatorio: true,
      orden: 1
    };
    const resultado = service.validarCampo(campo, '');
    expect(resultado.valido).toBe(false);
  });

  it('debe agrupar campos correctamente', () => {
    const campos = service.obtenerPlantilla('Predio');
    const grupos = service.agruparCampos(campos);
    expect(grupos['Identificación']).toBeDefined();
    expect(grupos['Ubicación']).toBeDefined();
  });
});
```

**Diálogo de Objetos Tributarios**:
```typescript
describe('ObjetoTributarioDialogComponent', () => {
  it('debe crear formulario con campos base', () => {
    component.ngOnInit();
    expect(component.objetoForm.get('codigo')).toBeDefined();
    expect(component.objetoForm.get('matricula')).toBeDefined();
  });

  it('debe agregar campo personalizado', () => {
    component.nuevoCampo = {
      nombre: 'custom',
      etiqueta: 'Campo Custom',
      tipo: 'texto',
      grupo: 'Personalizado',
      obligatorio: false
    };
    component.agregarCampoPersonalizado();
    expect(component.objetoForm.get('custom')).toBeDefined();
  });
});
```

---

## 📚 Referencias

### Documentación Técnica
- [Angular Signals](https://angular.io/guide/signals)
- [Angular Reactive Forms](https://angular.io/guide/reactive-forms)
- [Material Design Components](https://material.angular.io/components/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Normatividad Colombia
- Ley 44 de 1990 (Impuesto Predial)
- Ley 14 de 1983 (ICA)
- Ley 97 de 1913 (Valorización)
- Decreto 1333 de 1986 (Código de Régimen Municipal)

---

## ✅ Checklist de Implementación

### Frontend
- [x] Servicio de objetos tributarios
- [x] 5 plantillas predefinidas (Predio, Establecimiento, Suscriptor, Obra, Permiso)
- [x] Diálogo de formulario dinámico
- [x] Renderizado por tipo de campo
- [x] Agrupación visual
- [x] Campos personalizados
- [x] Integración en fuente-detalle
- [x] Tabla de resultados
- [x] CRUD básico (sin backend)
- [x] Componente de entidades
- [x] Formulario de entidades con vigencia fiscal
- [x] Tabla y gestión de entidades

### Backend (Pendiente)
- [ ] Modelo JPA Entidad
- [ ] Repository Entidad
- [ ] Controller Entidad
- [ ] Endpoints REST Entidad
- [ ] Modelo JPA ObjetoTributario
- [ ] Modelo JPA CampoPersonalizado
- [ ] Repository objetos
- [ ] Controller objetos
- [ ] Endpoints REST objetos
- [ ] Validaciones backend
- [ ] Importación Excel
- [ ] Exportación Excel/PDF

### Integración
- [ ] Conectar frontend con backend
- [ ] Manejo de errores
- [ ] Loading states
- [ ] Mensajes de confirmación
- [ ] Tests E2E

---

## 👨‍💻 Autor
Sistema desarrollado para gestión tributaria municipal en Colombia.

**Fecha**: Enero 2025  
**Versión**: 1.0.0  
**Stack**: Angular 19 + Spring Boot 3 + PostgreSQL
