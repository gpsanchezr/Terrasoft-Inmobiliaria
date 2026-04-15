# Panel Administrativo - Instrucciones de Implementación

## 📋 Resumen de Cambios

Se ha implementado un Panel Administrativo profesional accesible en `/admin` con las siguientes características:

### ✅ Características Implementadas

1. **Página Protegida**: Solo usuarios autenticados pueden acceder
2. **Gestión de PQRS**: 
   - Tabla completa con todas las peticiones, quejas, reclamos y sugerencias
   - Cambio de estado en tiempo real (Pendiente → En Proceso → Resuelto)
   - Filtrado por tipo y estado
   - Banda de colores para distinción visual

3. **Inventario de Lotes**:
   - Vista general con estadísticas (Disponibles, Reservados, Vendidos)
   - Tabla detallada con información completa
   - Badges coloreados por estado
   - Información de características, área y valor

4. **Diseño Dashboard**:
   - Header con información del usuario
   - Tabs para navegación entre secciones
   - Cards estadísticas
   - Tablas responsivas con Radix UI
   - Toast notifications para feedback

## 🗄️ Cambios Requeridos en la Base de Datos

### Tabla `pqrs` - Campos Necesarios

Tu tabla PQRS debe tener los siguientes campos:

```sql
CREATE TABLE pqrs (
  id BIGSERIAL PRIMARY KEY,
  tipo TEXT NOT NULL CHECK (tipo IN ('Petición', 'Queja', 'Reclamo', 'Sugerencia')),
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  asunto TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  estado TEXT DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'En Proceso', 'Resuelto')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla `lotes` - Campos Necesarios (Verificar)

Asegúrate que tu tabla tenga estos campos:

```sql
CREATE TABLE lotes (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  ubicacion TEXT NOT NULL,
  area FLOAT NOT NULL,
  valor FLOAT NOT NULL,
  estado TEXT NOT NULL CHECK (estado IN ('Disponible', 'Reservado', 'Vendido')),
  caracteristicas TEXT[], -- Array de características (opcional)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 📁 Estructura de Archivos Creados

```
app/
  admin/
    page.tsx                    # Página principal del admin (protegida)

components/
  admin/
    admin-header.tsx           # Header con usuario y logout
    pqrs-table.tsx             # Tabla de PQRS con gestor de estado
    lotes-list.tsx             # Vista de lotes e inventario

lib/
  pqrs.ts                       # Actualizado con nuevas funciones:
                                # - getAllPQRS()
                                # - updatePQRSStatus()
```

## 🛠️ Funciones Actualizadas en `lib/pqrs.ts`

### `getAllPQRS()`
- Retorna todas las PQRS ordenadas por fecha (más recientes primero)
- Maneja errores de conexión

### `updatePQRSStatus(id, estado)`
- Actualiza el estado de una PQRS específica
- Estados válidos: 'Pendiente', 'En Proceso', 'Resuelto'

### `submitPQRS(data)` (Existente)
- Se mantuvo igual, pero ahora inserta con estado 'Pendiente' por defecto

## 🔐 Protección de Ruta

La página `/admin` verifica automáticamente:
1. Si el usuario está autenticado
2. Si no lo está, redirige a `/login`
3. Carga la información del usuario en el header

Si necesitas implementar roles específicos (solo ciertos admin), necesitarías:
- Custom Claims en Supabase
- Una tabla `admin_users` para control de permisos

## 🎨 Componentes UI Utilizados

- **Tabs**: Para navegación entre Lotes y PQRS
- **Table**: Para mostrar datos organizados
- **Badge**: Para estados y tipos coloreados
- **Select**: Para cambiar estado de PQRS
- **Card**: Para contenedores de información
- **Button**: Para acciones (Recargar, Logout)
- **Avatar**: Para información del usuario
- **DropdownMenu**: Para opciones de usuario

## 📊 Estadísticas Visuales

El dashboard muestra automáticamente:
- Total de lotes disponibles
- Total de lotes reservados
- Total de lotes vendidos
- Conteo actualizado en tiempo real

## 🚀 Para Usar el Panel

1. Inicia sesión en `/login`
2. Ve a `/admin` (se recomienda bookmark)
3. Selecciona la pestaña que desees:
   - **Lotes**: Ver inventario y disponibilidad
   - **PQRS**: Gestionar peticiones y cambiar estados
4. Los cambios se guardan automáticamente en Supabase
5. Usa el botón "Recargar" para sincronizar datos si necesitas

## ⚠️ Posibles Mejoras Futuras

1. **Búsqueda y Filtrado**: Agregar búsquedas por nombre, email, etc.
2. **Paginación**: Para tablas con muchos registros
3. **Exportar Datos**: Descargar en CSV/Excel
4. **Gráficos**: Visualizar tendencias PQRS
5. **Roles de Usuario**: Implementar diferentes permisos
6. **Edición de Lotes**: Modificar información de lotes
7. **Notificaciones**: Email automático al cambiar estado

## 🐛 Troubleshooting

**Problema**: "Error al cargar PQRS"
- Verifica que la tabla `pqrs` existe en Supabase
- Revisa las RLS policies (Row Level Security)
- Asegúrate que el usuario está autenticado

**Problema**: "No hay lotes registrados"
- Verifica que tienes datos en la tabla `lotes`
- Comprueba el nombre de la tabla en Supabase

**Problema**: "No puedo cambiar estado"
- Verifica RLS policies en tabla `pqrs`
- Asegúrate que el usuario puede hacer UPDATE
- Revisa la consola del navegador para errores

## 📝 Notas de Seguridad

- Implementa Row Level Security (RLS) en Supabase
- Solo administradores deben poder modificar PQRS
- Considera usar Supabase Roles para control fino
- Los datos sensibles (emails, teléfonos) están visibles - considera encriptación si es necesario
