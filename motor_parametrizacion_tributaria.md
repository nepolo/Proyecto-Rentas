# Motor de Parametrización Tributaria Territorial

## Alcance

Este documento define la lógica funcional para la parametrización de
valores base necesarios en el cálculo de rentas territoriales en
Colombia.

Incluye: - Impuesto Predial - Industria y Comercio (ICA)

------------------------------------------------------------------------

## Principio Arquitectónico

Objeto Tributario → Valores Base → Parametrización → Motor de Cálculo →
Liquidación

------------------------------------------------------------------------

## Objetivo

Permitir cálculos tributarios mediante: - Parametrización dinámica -
Configuración por vigencia - Eliminación de reglas hardcodeadas

------------------------------------------------------------------------

## Modelo Conceptual

### 1. Renta

Tipos de impuesto: - Predial - Industria y Comercio - Avisos y
Tableros - Sobretasas

------------------------------------------------------------------------

### 2. Parámetros Tributarios

Tipos: - Tarifas - Rangos - Factores de ajuste - Indicadores
económicos - Exenciones - Descuentos - Recargos

------------------------------------------------------------------------

### 3. Valores Base del Objeto Tributario

Datos propios del objeto: - Versionables por vigencia - Modificables -
Con historial

------------------------------------------------------------------------

## Parametrización Predial

### Valores Base

-   Avalúo catastral
-   Destinación económica
-   Estrato
-   Área terreno
-   Área construida
-   Uso del suelo

------------------------------------------------------------------------

### Parámetros Tributarios

Tarifas por rango de avalúo: SI avalúo entre rango mínimo y máximo →
aplicar tarifa

Tarifas por destinación económica: - Residencial - Comercial -
Industrial - Rural

Factores ajustables: - Actualización catastral - Incrementos anuales -
Límites máximos de crecimiento

------------------------------------------------------------------------

## Parametrización ICA

### Valores Base

-   Actividad económica (CIIU)
-   Ingresos gravados
-   Tipo contribuyente
-   Municipio operación

------------------------------------------------------------------------

### Parámetros ICA

Tarifa ICA: Porcentaje sobre ingresos gravados

Sobretasas: - Avisos y tableros - Sobretasa bomberil

------------------------------------------------------------------------

## Reglas Funcionales

### Versionamiento

Todos los parámetros deben: - Asociarse a vigencia fiscal - Mantener
historial

------------------------------------------------------------------------

### Configuración Dinámica

Debe permitir: - Crear tarifas sin desarrollo - Crear parámetros sin
recompilar

------------------------------------------------------------------------

### Independencia del Objeto

El objeto solo almacena: - Identificación - Datos físicos - Valores base

------------------------------------------------------------------------

### Integridad Tributaria

Debe existir: Una liquidación activa por: Objeto + Tercero + Vigencia +
Renta

------------------------------------------------------------------------

## Flujo de Cálculo

1.  Obtener objeto tributario
2.  Obtener valores base
3.  Obtener parámetros tributarios
4.  Determinar base gravable
5.  Aplicar tarifas
6.  Calcular conceptos derivados
7.  Generar liquidación

------------------------------------------------------------------------

## Diseño Recomendado Microservicio

Servicio: tributary-parameter-service

Responsabilidades: - Administración de tarifas - Administración de
rangos - Administración de parámetros - Exposición de consultas para
cálculo

------------------------------------------------------------------------

## Buenas Prácticas Tributarias

-   Auditoría de cambios
-   Configuración declarativa
-   Modularidad por renta
-   Escalabilidad
-   Trazabilidad fiscal

------------------------------------------------------------------------

## Visión Estratégica

Permite: - Adaptarse a reformas tributarias - Reducir mantenimiento -
Escalar a múltiples municipios
