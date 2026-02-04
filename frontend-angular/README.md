# 🎨 Frontend Angular - Plataforma Tributaria

Frontend moderno desarrollado en Angular 19 con arquitectura standalone components para la Plataforma Tributaria.

## 🚀 Características

- ✅ **Angular 19** con Standalone Components
- ✅ **Lazy Loading** de módulos
- ✅ **Angular Material** para UI components
- ✅ **Reactive Forms** para formularios
- ✅ **HttpClient** con interceptores
- ✅ **Proxy Configuration** para desarrollo
- ✅ **TypeScript** con strict mode
- ✅ **SCSS** para estilos
- ✅ **Responsive Design**

## 📦 Estructura del Proyecto

```
frontend-angular/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── models/              # Interfaces y tipos
│   │   │   ├── services/            # Servicios HTTP
│   │   │   └── interceptors/        # Interceptores HTTP
│   │   ├── features/                # Módulos funcionales
│   │   │   ├── dashboard/
│   │   │   ├── parametrizacion/
│   │   │   ├── formulas/
│   │   │   ├── liquidaciones/
│   │   │   ├── facturas/
│   │   │   ├── pagos/
│   │   │   └── cartera/
│   │   ├── shared/                  # Componentes compartidos
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── environments/                # Configuración por ambiente
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── angular.json
├── package.json
├── proxy.conf.json                  # Configuración proxy para APIs
└── tsconfig.json
```

## 🛠️ Requisitos Previos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Angular CLI** >= 19.x (se instalará automáticamente)

## 📥 Instalación

```powershell
# Navegar a la carpeta del frontend
cd frontend-angular

# Instalar dependencias
npm install

# Instalar Angular Material (opcional)
ng add @angular/material
```

## 🏃 Ejecutar en Desarrollo

```powershell
# Iniciar servidor de desarrollo
npm start

# O con Angular CLI
ng serve

# La aplicación estará disponible en:
# http://localhost:4200
```

El proxy está configurado para redirigir las llamadas a los microservicios backend:
- Parametrización: http://localhost:8080
- Fórmulas: http://localhost:8081
- Liquidaciones: http://localhost:8082
- Facturas: http://localhost:8083
- Pagos: http://localhost:8084
- Cartera: http://localhost:8085
- Contabilidad: http://localhost:8086
- Notificaciones: http://localhost:8087
- Seguridad: http://localhost:8088

## 🏗️ Compilar para Producción

```powershell
# Build de producción
npm run build

# Los archivos compilados estarán en dist/
```

## 🧪 Ejecutar Tests

```powershell
# Tests unitarios
npm test

# Tests con coverage
npm run test:coverage
```

## 📚 Módulos Implementados

### 1. Dashboard
- Vista general de estadísticas
- Indicadores clave (KPIs)
- Accesos rápidos

### 2. Parametrización
- CRUD de rentas
- Configuración de conceptos tributarios
- Gestión de tarifas

### 3. Fórmulas
- Creación de fórmulas dinámicas
- Evaluación de expresiones
- Versionamiento

### 4. Liquidaciones
- Generación de liquidaciones
- Consulta y filtros
- Reliquidaciones

### 5. Facturas
- Generación de facturas
- Visualización de QR
- Gestión de estados

### 6. Pagos
- Registro de pagos
- Aplicación de pagos
- Conciliación

### 7. Cartera
- Estados de cuenta
- Consulta de saldos
- Gestión de mora

## 🔧 Configuración

### Environments

Editar `src/environments/environment.ts` para desarrollo:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost',
  services: {
    parametrizacion: 'http://localhost:8080/api',
    formulas: 'http://localhost:8081/api',
    // ...otros servicios
  }
};
```

### Proxy Configuration

El archivo `proxy.conf.json` maneja las redirecciones:

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

## 🎨 Estilos

El proyecto usa **SCSS** con las siguientes convenciones:

- Variables globales en `styles.scss`
- Estilos por componente en archivos `.scss`
- Angular Material theme personalizable
- Diseño responsive con breakpoints

## 📡 Servicios HTTP

Todos los servicios están en `src/app/core/services/`:

```typescript
// Ejemplo de uso
constructor(private parametrizacionService: ParametrizacionService) {}

ngOnInit() {
  this.parametrizacionService.getRentas().subscribe({
    next: (rentas) => console.log(rentas),
    error: (error) => console.error(error)
  });
}
```

## 🔐 Autenticación

El interceptor `auth.interceptor.ts` agrega el token JWT automáticamente:

```typescript
// El token se obtiene del localStorage
const token = localStorage.getItem('token');
if (token) {
  req = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
}
```

## 🌐 Routing

Lazy loading configurado en `app.routes.ts`:

```typescript
{
  path: 'dashboard',
  loadComponent: () => import('./features/dashboard/dashboard.component')
}
```

## 📦 Dependencias Principales

```json
{
  "@angular/core": "^19.0.0",
  "@angular/common": "^19.0.0",
  "@angular/router": "^19.0.0",
  "@angular/forms": "^19.0.0",
  "@angular/material": "^19.0.0",
  "rxjs": "~7.8.0",
  "typescript": "~5.6.2"
}
```

## 🚦 Comandos Útiles

```powershell
# Generar nuevo componente
ng generate component features/mi-componente

# Generar servicio
ng generate service core/services/mi-servicio

# Linting
ng lint

# Actualizar Angular
ng update @angular/cli @angular/core
```

## 📱 Responsive Breakpoints

```scss
// Mobile
@media (max-width: 767px) { ... }

// Tablet
@media (min-width: 768px) and (max-width: 1023px) { ... }

// Desktop
@media (min-width: 1024px) { ... }
```

## 🐛 Troubleshooting

### Puerto ya en uso
```powershell
# Cambiar puerto
ng serve --port 4201
```

### Errores de compilación
```powershell
# Limpiar caché
rm -r node_modules package-lock.json
npm install
```

### Proxy no funciona
Verificar que `proxy.conf.json` esté referenciado en `angular.json`:
```json
"serve": {
  "options": {
    "proxyConfig": "proxy.conf.json"
  }
}
```

## 🤝 Contribuir

1. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
2. Commit cambios: `git commit -am 'Add: nueva funcionalidad'`
3. Push: `git push origin feature/nueva-funcionalidad`
4. Crear Pull Request

## 📞 Soporte

Para más información consultar:
- [Documentación Angular](https://angular.dev)
- [Angular Material](https://material.angular.io)
- `../INFRAESTRUCTURA.md` para información del backend

## 🎯 Próximas Mejoras

- [ ] Implementar NgRx para state management
- [ ] Agregar tests e2e con Cypress
- [ ] PWA con service workers
- [ ] Internacionalización (i18n)
- [ ] Dark mode
- [ ] Graficas con Chart.js o D3
- [ ] Exportación a PDF/Excel
- [ ] Notificaciones en tiempo real con WebSockets

---

**Versión:** 1.0.0  
**Última actualización:** Febrero 2026  
**Stack:** Angular 19 + Material + TypeScript
