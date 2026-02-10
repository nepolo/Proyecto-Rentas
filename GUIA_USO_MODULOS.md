# 🚀 Guía de Uso: Entidades y Objetos Tributarios

## 📖 Tabla de Contenidos
1. [Inicio Rápido](#inicio-rápido)
2. [Módulo de Entidades](#módulo-de-entidades)
3. [Módulo de Objetos Tributarios](#módulo-de-objetos-tributarios)
4. [Casos de Uso](#casos-de-uso)
5. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## Inicio Rápido

### Iniciar el Sistema

**Opción 1: Script PowerShell (Recomendado)**
```powershell
cd Proyecto-Rentas
.\iniciar-sistema.ps1
```

**Opción 2: Manual**
```powershell
# Terminal 1 - Backend Seguridad
cd services/seguridad-service
mvn spring-boot:run

# Terminal 2 - Backend Liquidación
cd services/liquidacion-service
mvn spring-boot:run

# Terminal 3 - Frontend
cd frontend-angular
npm start
```

### Acceder al Sistema
- **URL**: http://localhost:4200
- **Usuario**: admin@sistema.com
- **Contraseña**: admin123

---

## Módulo de Entidades

### 1. Acceder al Módulo

1. Iniciar sesión
2. En el menú lateral, hacer clic en **"Admin"**
3. Seleccionar **"Entidades"**

### 2. Registrar una Nueva Entidad

#### Paso 1: Abrir Formulario
- Hacer clic en el botón **"Nueva Entidad"** (esquina superior derecha)

#### Paso 2: Información Legal
```
NIT: 890123456
Dígito Verificación: 7
Razón Social: Municipio de Medellín
Nombre Comercial: Alcaldía de Medellín
Tipo de Entidad: Municipio
Régimen: Especial
```

#### Paso 3: Ubicación
```
Dirección: Calle 44 # 52-165, Piso 8
Municipio: Medellín
Departamento: Antioquia
```

#### Paso 4: Contacto
```
Teléfono: 6045448255
Email: contacto@medellin.gov.co
Sitio Web: https://www.medellin.gov.co
```

#### Paso 5: Representante Legal
```
Nombre Completo: Federico Gutiérrez Zuluaga
Cédula: 71234567
```

#### Paso 6: **Vigencia Fiscal** ⭐ (Importante)
```
Año Fiscal: 2024
Fecha Inicio de Vigencia: 01/01/2024
Fecha Fin de Vigencia: 31/12/2024
```

> **⚠️ Nota Importante**: La vigencia fiscal determina el período en el cual se pueden crear liquidaciones. Es fundamental configurarla correctamente.

#### Paso 7: Guardar
- Hacer clic en **"Guardar Entidad"**
- La entidad aparecerá en la tabla con estado **Activa**

### 3. Editar una Entidad

1. En la tabla, localizar la entidad
2. Hacer clic en el icono de **lápiz** (editar)
3. El formulario se abrirá con los datos actuales
4. Modificar los campos necesarios
5. Hacer clic en **"Guardar Entidad"**

### 4. Eliminar una Entidad

1. En la tabla, localizar la entidad
2. Hacer clic en el icono de **papelera** (eliminar)
3. Confirmar la eliminación en el diálogo

> **⚠️ Advertencia**: No se puede eliminar una entidad con liquidaciones asociadas.

### 5. Cambiar Vigencia Fiscal

Para cambiar la vigencia fiscal de un año a otro:

1. Editar la entidad
2. Modificar:
   - **Año Fiscal**: 2025
   - **Fecha Inicio**: 01/01/2025
   - **Fecha Fin**: 31/12/2025
3. Guardar

> **💡 Tip**: Es recomendable crear una nueva vigencia fiscal al inicio de cada año.

---

## Módulo de Objetos Tributarios

### 1. Acceder al Módulo

1. En el menú lateral, hacer clic en **"Fuentes de Ingreso"**
2. Seleccionar una fuente (ej: **"Predial Unificado Urbano"**)
3. Hacer clic en la pestaña **"Objetos Tributarios"**

### 2. Tipos de Objetos por Fuente

| Fuente | Tipo de Objeto |
|--------|----------------|
| Predial Urbano/Rural | **Predio** |
| ICA Industrial/Comercial | **Establecimiento** |
| Alumbrado Público | **Suscriptor** |
| Valorización | **Obra** |
| Espacio Público | **Permiso** |

### 3. Registrar un Predio (Ejemplo)

#### Paso 1: Crear Nuevo Objeto
- Hacer clic en **"Nuevo Predio"**

#### Paso 2: Código Único
```
Código: 01-001-0001
```
> **Formato sugerido**: `Sector-Manzana-Lote`

#### Paso 3: Grupo Identificación
```
Matrícula Inmobiliaria: 50N-123456
```

#### Paso 4: Grupo Ubicación
```
Dirección: Calle 10 # 5-25
Barrio/Vereda: El Poblado
```

#### Paso 5: Grupo Clasificación
```
Estrato: 3
Uso del Suelo: Residencial
```

#### Paso 6: Grupo Valoración
```
Avalúo Catastral: 120,000,000
```

#### Paso 7: Grupo Características
```
Área m²: 85.5
```

#### Paso 8: Grupo Propietario
```
Propietario: Juan Carlos Pérez
Cédula/NIT: 1234567890
```

#### Paso 9: Grupo Contacto (Opcional)
```
Teléfono: 3001234567
Email: juan.perez@email.com
```

#### Paso 10: Guardar
- Hacer clic en **"Guardar"**
- El predio aparecerá en la tabla

### 4. Agregar Campos Personalizados

Si tu municipio necesita información adicional:

#### Paso 1: En el Formulario
- Desplazarse hasta el final
- Hacer clic en **"Agregar Campo Personalizado"**

#### Paso 2: Configurar Campo
```
Nombre del Campo: zonaRiesgo
Etiqueta: Zona de Riesgo
Tipo de Campo: Lista
Grupo: Clasificación
```

#### Paso 3: Opciones (para tipo Lista)
```
Opciones: Alta, Media, Baja, Ninguna
```

#### Paso 4: Obligatoriedad
- Marcar checkbox si es obligatorio

#### Paso 5: Agregar Campo
- Hacer clic en **"Agregar Campo"**
- El campo aparecerá en el grupo correspondiente

#### Paso 6: Llenar Valor
```
Zona de Riesgo: Media
```

### 5. Registrar un Establecimiento (ICA)

#### Paso 1: Crear Nuevo Objeto
- Fuente: **ICA Industrial**
- Hacer clic en **"Nuevo Establecimiento"**

#### Paso 2: Llenar Formulario
```
Código: ICA-2024-001

Grupo Identificación:
  NIT: 890123456-7
  Razón Social: Industrias XYZ S.A.S.
  Nombre Comercial: XYZ Industries

Grupo Ubicación:
  Dirección: Carrera 50 # 25-40, Bodega 5

Grupo Actividad:
  Actividad Económica CIIU: 2520 - Fabricación de productos metálicos

Grupo Financiero:
  Ingresos Anuales: 850,000,000

Grupo Tributario:
  Tarifa ICA: 0.8%

Grupo Legal:
  Representante Legal: María González

Grupo Contacto:
  Teléfono: 6045551234
  Email: info@xyz.com
```

#### Paso 3: Guardar

### 6. Registrar un Suscriptor (Alumbrado Público)

```
Código: SUSC-12345

Grupo Identificación:
  Número de Suscriptor: 12345

Grupo Personal:
  Nombre Completo: Pedro Martínez
  Cédula: 987654321

Grupo Ubicación:
  Dirección del Servicio: Calle 20 # 15-30

Grupo Clasificación:
  Estrato: 2

Grupo Servicio:
  Número de Medidor: MED-98765 (opcional)

Grupo Contacto:
  Teléfono: 3009876543 (opcional)
```

### 7. Editar un Objeto Tributario

1. En la tabla, localizar el objeto
2. Hacer clic en el icono de **lápiz**
3. Modificar los campos necesarios
4. Hacer clic en **"Guardar"**

### 8. Eliminar un Objeto Tributario

1. En la tabla, localizar el objeto
2. Hacer clic en el icono de **papelera**
3. Confirmar la eliminación

> **⚠️ Advertencia**: No se puede eliminar un objeto con liquidaciones asociadas.

### 9. Buscar Objetos

En el campo de búsqueda:
```
Búsqueda por código: 01-001-0001
Búsqueda por descripción: Calle 10
Búsqueda por propietario: Juan Pérez
```

---

## Casos de Uso

### Caso 1: Configuración Inicial del Municipio

**Escenario**: Municipio nuevo que va a usar el sistema por primera vez.

1. **Registrar Entidad**:
   - Ir a Admin > Entidades
   - Crear entidad con datos del municipio
   - Configurar vigencia fiscal 2024

2. **Configurar Usuarios**:
   - Ir a Admin > Usuarios
   - Crear usuarios para liquidadores y aprobadores

3. **Parametrizar Fuentes de Ingreso**:
   - Ir a Fuentes de Ingreso
   - Configurar conceptos de cobro para Predial
   - Configurar tarifas y períodos

4. **Registrar Objetos Tributarios**:
   - Ir a Fuentes > Predial > Objetos Tributarios
   - Importar desde Excel o registrar manualmente

5. **Crear Primera Liquidación**:
   - Ir a Liquidaciones > Nueva Liquidación
   - Seleccionar objeto tributario
   - Sistema calcula automáticamente

### Caso 2: Inicio de Nueva Vigencia Fiscal

**Escenario**: Cambio de año fiscal 2024 → 2025.

1. **Actualizar Vigencia**:
   - Editar entidad
   - Cambiar vigencia fiscal a 2025
   - Fechas: 01/01/2025 - 31/12/2025

2. **Revisar Tarifas**:
   - Verificar si hay cambios en tarifas de impuestos
   - Actualizar si es necesario

3. **Actualizar Avalúos** (Predial):
   - Editar predios con nuevos avalúos catastrales
   - Usar importación masiva si hay muchos

4. **Generar Liquidaciones 2025**:
   - El sistema solo permitirá liquidaciones dentro de la vigencia

### Caso 3: Agregar Nueva Información Local

**Escenario**: El municipio necesita registrar "Uso Cultural" para predios.

1. **Identificar Tipo de Objeto**: Predio

2. **Crear Campo Personalizado**:
   - Abrir formulario de predio
   - Agregar campo personalizado:
     - Nombre: `usoCultural`
     - Etiqueta: `Uso Cultural`
     - Tipo: Boolean
     - Grupo: Características
     - Obligatorio: No

3. **Usar el Campo**:
   - Al registrar/editar predios, aparecerá checkbox "Uso Cultural"
   - Marcar si aplica

4. **Reportes Futuros**:
   - Podrá filtrar predios por uso cultural
   - Generar estadísticas

### Caso 4: Importación Masiva de Predios

**Escenario**: Municipio tiene 5,000 predios en Excel.

1. **Descargar Plantilla** (Futuro):
   - Clic en "Importar Excel"
   - Descargar plantilla de Predio

2. **Llenar Excel**:
   ```
   Columnas:
   - Código
   - Matrícula
   - Dirección
   - Barrio
   - Estrato
   - Avalúo
   - Área
   - Uso
   - Propietario
   - Cédula
   - Teléfono
   - Email
   ```

3. **Importar**:
   - Clic en "Importar Excel"
   - Seleccionar archivo
   - Sistema valida y carga

4. **Verificar**:
   - Revisar tabla de objetos
   - Corregir errores si los hay

### Caso 5: Establecimiento con Múltiples Actividades

**Escenario**: Negocio con varias actividades CIIU.

**Solución**: Agregar campo personalizado de tipo Lista con múltiples actividades:

1. **Campo Personalizado**:
   - Nombre: `actividadesSecundarias`
   - Tipo: Texto (separadas por coma)
   - Grupo: Actividad

2. **Llenar**:
   ```
   Actividad Principal: 2520
   Actividades Secundarias: 2530, 2540, 2550
   ```

---

## Preguntas Frecuentes

### ¿Puedo tener múltiples entidades activas?

No. Solo una entidad puede estar activa a la vez. Esto representa el municipio/entidad que está usando el sistema.

### ¿Qué pasa si cambio la vigencia fiscal en medio del año?

Las liquidaciones ya creadas mantienen su vigencia original. Las nuevas liquidaciones se crearán con la nueva vigencia.

### ¿Los campos personalizados se guardan para siempre?

Actualmente son temporales (memoria). Con el backend implementado, se guardarán en la base de datos y estarán disponibles para todos los usuarios.

### ¿Puedo eliminar un campo personalizado?

Sí, pero solo si no hay objetos tributarios que lo usen. De lo contrario, los datos se perderían.

### ¿Cómo sé qué tipo de objeto usa cada fuente?

El sistema lo detecta automáticamente según el nombre de la fuente:
- Si contiene "Predial" o "Sobretasa" → Predio
- Si contiene "ICA" → Establecimiento
- Si contiene "Alumbrado" → Suscriptor
- Si contiene "Valorización" → Obra
- Si contiene "Espacio Público" → Permiso

### ¿Puedo cambiar el tipo de objeto de una fuente?

No directamente en la UI. Debe configurarse en el backend al crear la fuente.

### ¿Los campos obligatorios se validan antes de guardar?

Sí. El botón "Guardar" estará deshabilitado hasta que todos los campos obligatorios estén llenos.

### ¿Puedo exportar los objetos tributarios a Excel?

Funcionalidad pendiente de implementar. Por ahora solo visualización en tabla.

### ¿Cómo actualizo avalúos catastrales masivamente?

Actualmente uno por uno. La funcionalidad de importación masiva está pendiente.

### ¿Puedo ver el historial de cambios de un objeto?

Funcionalidad pendiente. Se implementará con el backend para auditoría.

### ¿Los campos de tipo "moneda" formatean automáticamente?

Sí, en la visualización se mostrarán con separador de miles. En edición se ingresa el número.

### ¿Puedo agregar imágenes a los objetos tributarios?

Funcionalidad futura. Se planea agregar adjuntos (fotos, documentos PDF, etc.).

### ¿El sistema valida duplicados de código?

Actualmente no. Con el backend se validará que cada código sea único por fuente.

### ¿Puedo filtrar por grupo de campos?

No directamente. Se puede buscar por valores específicos en el campo de búsqueda.

---

## 🆘 Soporte

### Errores Comunes

**Error: "Campo obligatorio"**
- **Causa**: No se llenó un campo requerido
- **Solución**: Llenar todos los campos con asterisco (*)

**Error: "Email inválido"**
- **Causa**: Formato de email incorrecto
- **Solución**: Usar formato `nombre@dominio.com`

**Error: "Fecha inválida"**
- **Causa**: Fecha fuera de rango o formato incorrecto
- **Solución**: Usar el selector de calendario

**El botón "Guardar" está deshabilitado**
- **Causa**: Formulario inválido
- **Solución**: Revisar campos con error (subrayados en rojo)

**No aparece mi campo personalizado**
- **Causa**: No se agregó correctamente
- **Solución**: Verificar que se hizo clic en "Agregar Campo"

### Contacto

Para soporte técnico, contactar al administrador del sistema.

---

## 📝 Notas Adicionales

### Mejores Prácticas

1. **Códigos**: Usar códigos descriptivos y secuenciales
2. **Vigencia Fiscal**: Actualizar al inicio de cada año
3. **Backups**: Exportar datos regularmente (cuando esté disponible)
4. **Validación**: Revisar datos antes de crear liquidaciones
5. **Campos Personalizados**: Documentar su significado y uso

### Recomendaciones

- Mantener información actualizada
- Usar campos opcionales para datos complementarios
- Aprovechar campos personalizados para normatividad local
- Coordinar cambios de vigencia con el equipo contable
- Capacitar usuarios en el uso del sistema

---

## 🎯 Próximos Pasos

1. Explorar el módulo de Liquidaciones
2. Revisar reportes y estadísticas
3. Configurar fórmulas de cálculo
4. Generar primeras facturas
5. Explorar módulo de Cartera

---

**Versión del Documento**: 1.0.0  
**Última Actualización**: Enero 2025  
**Sistema**: Plataforma Tributaria Municipal
