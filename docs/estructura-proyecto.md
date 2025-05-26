# Documentación de Archivos del Proyecto

## Estructura Modular
```
proyecto/
├── src/
│   ├── modules/           # Módulos principales
│   │   ├── auth/         # Módulo de autenticación
│   │   │   ├── components/
│   │   │   ├── context/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── students/     # Módulo de estudiantes
│   │   ├── grades/       # Módulo de calificaciones
│   │   ├── attendance/   # Módulo de asistencia
│   │   ├── subjects/     # Módulo de asignaturas
│   │   ├── settings/     # Módulo de configuración
│   │   ├── dashboard/    # Módulo de dashboard
│   │   └── shared/       # Componentes y utilidades compartidas
│   ├── App.tsx
│   └── Router.tsx
├── docs/
└── ...
```

## Módulos

### Auth
- Manejo de autenticación y autorización
- Contexto global de usuario
- Componentes de login/logout
- Tipos relacionados con usuarios

### Students
- Gestión completa de estudiantes
- Componentes de listado y formularios
- Servicios de API para estudiantes
- Tipos específicos de estudiantes

### Grades
- Sistema de calificaciones
- Componentes de registro y visualización
- Servicios de API para notas
- Tipos relacionados con calificaciones

### Attendance
- Control de asistencia
- Componentes de registro
- Servicios de API para asistencia
- Tipos específicos de asistencia

### Subjects
- Gestión de asignaturas
- Componentes de administración
- Servicios de API para materias
- Tipos relacionados con asignaturas

### Settings
- Configuración del sistema
- Componentes de administración
- Servicios de configuración
- Tipos de configuración

### Dashboard
- Visualización de KPIs
- Componentes de gráficos
- Servicios de datos estadísticos
- Tipos para métricas

### Shared
- Componentes reutilizables
- Utilidades comunes
- Tipos compartidos
- Servicios base

## Beneficios de la Estructura

1. **Modularidad**: Cada módulo es independiente y contiene todo lo necesario
2. **Mantenibilidad**: Código organizado y fácil de mantener
3. **Escalabilidad**: Fácil agregar nuevos módulos
4. **Reutilización**: Componentes compartidos centralizados
5. **Testing**: Estructura que facilita las pruebas unitarias

## Convenciones

1. Cada módulo debe:
   - Tener su propia carpeta de tipos
   - Mantener sus servicios
   - Gestionar sus propios componentes
   - Ser independiente de otros módulos

2. El módulo shared:
   - Contiene utilidades comunes
   - Provee tipos base
   - Ofrece componentes reutilizables

3. Importaciones:
   - Usar rutas relativas dentro del módulo
   - Usar rutas absolutas entre módulos
   - Evitar dependencias circulares