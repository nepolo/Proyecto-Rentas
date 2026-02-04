# 🏛 Plataforma Tributaria Empresarial Escalable

## Arquitectura Basada en Microservicios -- Especificación Funcional y Técnica

------------------------------------------------------------------------

# 🎯 OBJETIVO GENERAL

Diseñar y construir una plataforma tributaria modular, altamente
escalable y completamente parametrizable que permita administrar
múltiples tipos de rentas sin necesidad de cambios de código.

El sistema debe soportar el ciclo completo tributario:

Parametrización → Liquidación → Facturación → Recaudo → Cartera →
Contabilidad → Reportes → Auditoría

------------------------------------------------------------------------

# 🧠 PRINCIPIOS DE DISEÑO

• Arquitectura de Microservicios\
• Domain Driven Design (DDD)\
• Event Driven Architecture\
• Clean / Hexagonal Architecture\
• Alta disponibilidad y resiliencia\
• Multi-entidad\
• Multi-renta\
• Versionamiento histórico obligatorio

------------------------------------------------------------------------

# ☁ STACK TECNOLÓGICO

## Backend

-   Java 21
-   Spring Boot
-   Spring Cloud
-   Spring Security + OAuth2 + JWT
-   Hibernate / JPA
-   Flyway / Liquibase
-   Kafka o RabbitMQ
-   OpenFeign
-   Resilience4j

## Frontend

-   Angular última versión
-   Angular Material
-   NgRx o Signals
-   Arquitectura Modular

## Infraestructura

-   Docker
-   Kubernetes
-   CI/CD
-   Prometheus + Grafana
-   ELK

------------------------------------------------------------------------

# 🧩 MICRO SERVICIOS Y CASOS DE USO

------------------------------------------------------------------------

# 1️⃣ MICRO SERVICIO PARAMETRIZACIÓN TRIBUTARIA

## Objetivo

Permitir la configuración total del sistema sin modificar código.

## Casos de Uso

### Crear Renta

-   Definir nombre
-   Tipo de renta
-   Periodicidad
-   Vigencias
-   Estados

### Crear Conceptos Tributarios

-   Impuestos
-   Tasas
-   Intereses
-   Sanciones
-   Descuentos

### Configurar Tarifas

-   Tarifas por rango
-   Tarifas por vigencia
-   Tarifas diferenciales

### Configurar Calendarios Tributarios

-   Fecha inicio obligación
-   Fecha vencimiento
-   Descuentos por pronto pago
-   Mora

### Configurar Sujetos Pasivos

-   Personas naturales
-   Personas jurídicas
-   Predios
-   Vehículos

------------------------------------------------------------------------

# 2️⃣ MICRO SERVICIO MOTOR DE FÓRMULAS

## Objetivo

Permitir que usuarios funcionales construyan reglas tributarias.

## Casos de Uso

### Crear Fórmula

Ejemplo:

IMPUESTO = BASE_GRAVABLE \* TARIFA

### Validar Fórmula

-   Validación sintáctica
-   Validación semántica

### Versionar Fórmula

-   Histórico de cambios
-   Control de vigencias

### Ejecutar Fórmula

-   Evaluación dinámica
-   Simulación

------------------------------------------------------------------------

# 3️⃣ MICRO SERVICIO LIQUIDACIÓN

## Objetivo

Calcular obligaciones tributarias.

## Casos de Uso

### Liquidación Individual

-   Selección contribuyente
-   Selección periodo
-   Cálculo automático

### Liquidación Masiva

-   Generación por lote
-   Validaciones previas

### Re-liquidación

-   Ajustes
-   Correcciones

### Simulación Tributaria

-   Proyección de obligaciones

------------------------------------------------------------------------

# 4️⃣ MICRO SERVICIO FACTURACIÓN

## Objetivo

Generar documentos oficiales de cobro.

## Casos de Uso

### Generar Factura

-   Numeración única
-   Detalle de conceptos
-   Fecha vencimiento
-   Código QR

### Refacturación

-   Corrección errores

### Facturación Electrónica

-   Integración DIAN
-   Validación documentos

------------------------------------------------------------------------

# 5️⃣ MICRO SERVICIO RECAUDO

## Objetivo

Registrar pagos y conciliaciones.

## Casos de Uso

### Registrar Pago

-   Pago total
-   Pago parcial

### Aplicar Pago

-   Distribución automática

### Conciliación Bancaria

-   Cruce extractos bancarios

### Generar Comprobantes

-   Recibos
-   Soportes contables

------------------------------------------------------------------------

# 6️⃣ MICRO SERVICIO CARTERA

## Objetivo

Gestionar deuda tributaria.

## Casos de Uso

### Consultar Estado Cuenta

-   Obligaciones vigentes
-   Mora
-   Prescripciones

### Generar Intereses

-   Cálculo automático diario

### Crear Acuerdos Pago

-   Definición cuotas
-   Seguimiento

### Cobro Coactivo

-   Mandamientos de pago
-   Embargos

------------------------------------------------------------------------

# 7️⃣ MICRO SERVICIO CONTABILIDAD

## Objetivo

Registrar información financiera oficial.

## Casos de Uso

### Causación Contable

-   Registro obligación tributaria

### Registro Recaudo

-   Integración ERP

### Generar Asientos Contables

-   Clasificación presupuestal

------------------------------------------------------------------------

# 8️⃣ MICRO SERVICIO NOTIFICACIONES

## Casos de Uso

-   Envío correos
-   Envío SMS
-   Alertas tributarias
-   Notificación facturas

------------------------------------------------------------------------

# 9️⃣ MICRO SERVICIO SEGURIDAD

## Casos de Uso

### Autenticación

-   OAuth2
-   JWT

### Autorización

-   Roles dinámicos
-   Permisos por módulo

### Auditoría

-   Registro operaciones financieras
-   Trazabilidad completa

------------------------------------------------------------------------

# 📊 FRONTEND -- PORTAL TRIBUTARIO

## Dashboard Inicial

Debe mostrar:

• Estado cuenta consolidado\
• Total deuda\
• Facturas pendientes\
• Historial pagos\
• Indicadores recaudo\
• Alertas tributarias

------------------------------------------------------------------------

# 🔄 EVENTOS DEL SISTEMA

Ejemplos:

-   LiquidacionGenerada
-   FacturaEmitida
-   PagoRegistrado
-   InteresGenerado

------------------------------------------------------------------------

# 🧬 REQUISITOS AVANZADOS

• Multi-renta\
• Multi-entidad\
• Multi-moneda\
• Multi-país\
• Multi-idioma\
• Versionamiento obligatorio

------------------------------------------------------------------------

# 📦 ENTREGABLES ESPERADOS

-   Diagramas C4
-   Diseño Base Datos
-   Contratos API
-   Diseño Eventos Kafka
-   Código Base Microservicios
-   Código Base Frontend
-   Configuración Docker y Kubernetes

------------------------------------------------------------------------

# ⭐ REGLAS CRÍTICAS DEL NEGOCIO

• Nunca eliminar registros financieros\
• Todo debe versionarse\
• Separación por dominios\
• Alta trazabilidad

------------------------------------------------------------------------

# 🚀 PROMPT BASE PARA GENERACIÓN AUTOMÁTICA

Generar arquitectura completa, diagramas, modelos de dominio, diseño
base de datos, contratos API, eventos, código base backend y frontend
siguiendo estándares empresariales y gubernamentales.
