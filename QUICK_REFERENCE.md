# 📝 Referencia Rápida - Panel Administrativo

## Componentes Principales

### 1. Página Admin (`app/admin/page.tsx`)

```typescript
// Características principales:
- Componente 'use client' (cliente)
- Verifica autenticación con useEffect
- Redirige a /login si no está autenticado
- Muestra AdminHeader, Tabs con LotesList y PQRSTable
- Loading state mientras verifica sesión
- Manejo de errores
```

---

## Funciones de Supabase

### Obtener todas las PQRS

```typescript
// En lib/pqrs.ts
const { data, error } = await getAllPQRS()

// Retorna:
{
  data: [
    {
      id: 1,
      tipo: 'Petición',
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      telefono: '3001234567',
      asunto: 'Información de lotes',
      descripcion: 'Quisiera saber sobre...',
      estado: 'Pendiente',
      created_at: '2024-02-24T10:30:00Z'
    },
    ...
  ],
  error: null
}
```

---

### Actualizar Estado PQRS

```typescript
// En lib/pqrs.ts
const response = await updatePQRSStatus(pqrsId, 'En Proceso')

// Estados válidos:
// - 'Pendiente'
// - 'En Proceso'
// - 'Resuelto'

// Retorna:
{
  success: true,
  message: 'Estado actualizado correctamente'
}
```

---

### Obtener Lotes

```typescript
// En lib/supabase.ts
const { data, error } = await getLotes()

// Retorna:
{
  data: [
    {
      id: 1,
      nombre: 'Lote A-01',
      ubicacion: 'Sector A, Manzana 1',
      area: 250,
      valor: 50000000,
      estado: 'Disponible',
      caracteristicas: ['Esquina', 'Acceso a calle principal']
    },
    ...
  ],
  error: null
}
```

---

## Estructura de Datos

### Interfaz PQRS

```typescript
interface PQRS {
  id?: number
  tipo: 'Petición' | 'Queja' | 'Reclamo' | 'Sugerencia'
  nombre: string
  email: string
  telefono: string
  asunto: string
  descripcion: string
  estado?: 'Pendiente' | 'En Proceso' | 'Resuelto'
  created_at?: string
}
```

### Interfaz Lote

```typescript
interface Lote {
  id: number
  nombre: string
  ubicacion: string
  area: number            // en metros cuadrados
  valor: number           // en pesos
  estado: 'Disponible' | 'Reservado' | 'Vendido'
  caracteristicas?: string[]
}
```

---

## Componentes UI Utilizados

### PQRSTable
```typescript
import { PQRSTable } from '@/components/admin/pqrs-table'

// Características:
// - Muestra tabla de PQRS
// - Selector de estado en cada fila
// - Colores según tipo
// - Botón recargar
// - Toast notifications
```

### LotesList
```typescript
import { LotesList } from '@/components/admin/lotes-list'

// Características:
// - Cards estadísticas (Disponibles, Reservados, Vendidos)
// - Tabla de lotes
// - Colores según estado
// - Información completa de cada lote
```

### AdminHeader
```typescript
import { AdminHeader } from '@/components/admin/admin-header'

// Características:
// - Branding del panel
// - Avatar y nombre usuario
// - Dropdown menu
// - Botón logout
```

---

## Colores por Estado

### Estados PQRS
```
Pendiente:    🟨 Amarillo (bg-yellow-100 text-yellow-800)
En Proceso:   🟦 Azul (bg-blue-100 text-blue-800)
Resuelto:     🟩 Verde (bg-green-100 text-green-800)
```

### Tipos PQRS
```
Petición:     🟣 Púrpura (bg-purple-100 text-purple-800)
Queja:        🔴 Rojo (bg-red-100 text-red-800)
Reclamo:      🟠 Naranja (bg-orange-100 text-orange-800)
Sugerencia:   🟢 Verde (bg-green-100 text-green-800)
```

### Estados Lotes
```
Disponible:   🟩 Verde (bg-green-100 text-green-800)
Reservado:    🟦 Azul (bg-blue-100 text-blue-800)
Vendido:      ⬜ Gris (bg-gray-100 text-gray-800)
```

---

## Flujo de Autenticación

```
1. Usuario accede /admin
2. Componente verifica auth con supabase.auth.getSession()
3. Si no hay sesión → Redirige a /login
4. Si hay sesión → Muestra el dashboard
5. Usuario puede cerrar sesión desde el header
6. Logout redirige a /login
```

---

## Manejo de Errores

### PQRS Table
```typescript
if (error) {
  toast({
    title: 'Error',
    description: error,
    variant: 'destructive',
  })
}
```

### Lotes List
```typescript
if (error) {
  toast({
    title: 'Error',
    description: error,
    variant: 'destructive',
  })
}
```

---

## Cómo Agregar Nuevas Funcionalidades

### 1. Agregar Nueva Función en Supabase

```typescript
// En lib/pqrs.ts o lib/supabase.ts
export async function deletePQRS(id: number): Promise<PQRSResponse> {
  try {
    const { error } = await supabase.from('pqrs').delete().eq('id', id)
    
    if (error) {
      return {
        success: false,
        message: 'Error al eliminar',
        error: error.message,
      }
    }

    return {
      success: true,
      message: 'PQRS eliminado correctamente',
    }
  } catch (err) {
    return {
      success: false,
      message: 'Error inesperado',
      error: err instanceof Error ? err.message : 'Error desconocido',
    }
  }
}
```

### 2. Usar Función en Componente

```typescript
// En components/admin/pqrs-table.tsx
const handleDelete = async (id: number) => {
  const response = await deletePQRS(id)
  
  if (response.success) {
    setPQRSData(pqrsData.filter(p => p.id !== id))
    toast({
      title: 'Éxito',
      description: 'PQRS eliminado',
    })
  }
}
```

---

## Base de Datos - Consultas Útiles

### Ver todas las PQRS (SQL)
```sql
SELECT * FROM pqrs ORDER BY created_at DESC;
```

### Ver PQRS pendientes
```sql
SELECT * FROM pqrs WHERE estado = 'Pendiente' ORDER BY created_at;
```

### Ver lotes disponibles
```sql
SELECT * FROM lotes WHERE estado = 'Disponible';
```

### Cambiar estado de PQRS
```sql
UPDATE pqrs SET estado = 'Resuelto' WHERE id = 1;
```

### Contar PQRS por estado
```sql
SELECT estado, COUNT(*) as cantidad
FROM pqrs
GROUP BY estado;
```

### Contar lotes por estado
```sql
SELECT estado, COUNT(*) as cantidad
FROM lotes
GROUP BY estado;
```

### Ver valor total del inventario
```sql
SELECT SUM(valor) as valor_total FROM lotes WHERE estado = 'Disponible';
```

---

## Environment Variables Requeridas

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Testing

### Pruebas Manuales Recomendadas

1. **Login/Logout:**
   - [ ] Crear nueva cuenta en /register
   - [ ] Iniciar sesión en /login
   - [ ] Acceder a /admin
   - [ ] Ver botón logout
   - [ ] Logout redirige a /login

2. **PQRS:**
   - [ ] Ver tabla de PQRS
   - [ ] Cambiar estado de una PQRS
   - [ ] Ver cambio reflejado inmediatamente
   - [ ] Recargar página (cambio debe persister)
   - [ ] Toast notification al cambiar

3. **Lotes:**
   - [ ] Ver cards estadísticas
   - [ ] Conteos coinciden con tabla
   - [ ] Ver tabla de lotes
   - [ ] Ver colores según estado
   - [ ] Ver características como badges

4. **Responsividad:**
   - [ ] Abrir en mobile (iPhone)
   - [ ] Tablas scroll horizontal
   - [ ] Layout responsive
   - [ ] Dropdown menu accesible

---

## Performance Tips

### Para muchos registros (1000+):

1. **Paginación:**
```typescript
const ITEMS_PER_PAGE = 20
const [page, setPage] = useState(0)

const paginatedData = pqrsData.slice(
  page * ITEMS_PER_PAGE,
  (page + 1) * ITEMS_PER_PAGE
)
```

2. **Virtualización** (para listas muy largas):
```typescript
import { FixedSizeList } from 'react-window'
```

3. **Caching:**
```typescript
const [cache, setCache] = useState<PQRS[] | null>(null)

const loadPQRS = async () => {
  if (cache) {
    setPQRSData(cache)
    return
  }
  // ... cargar y cachear
}
```

---

## Debugging

### Activar Logs de Supabase
```typescript
// En lib/supabase.ts
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    debug: true
  }
})
```

### Logs en Navegador
```typescript
// En cualquier componente
console.log('PQRS Data:', pqrsData)
console.log('Error:', error)
console.log('User:', user)
```

### Network Inspector (DevTools)
- F12 → Network tab
- Ver llamadas a `supabase.co`
- Revisar responses
- Buscar errores 401/403

---

## Style Customization

### Cambiar Colores Principales

En los componentes, reemplaza:
```typescript
// Azul actual
'bg-blue-600' → 'bg-indigo-600'

// Aplicable a todos los componentes
```

### Cambiar Fonts

En `app/globals.css` o `tailwind.config.ts`:
```typescript
theme: {
  fontFamily: {
    sans: ['Segoe UI', 'sans-serif']
  }
}
```

---

## Publicación (Deployment)

### Vercel (Recomendado)
1. Push a GitHub
2. Conectar repo a Vercel
3. Settear environment variables
4. Deploy automático

### Netlify
1. Conectar repo
2. Build command: `npm run build`
3. Publish directory: `.next`

### Self-hosted
1. Build: `npm run build`
2. Start: `npm start`
3. Usar PM2 o similar para mantener activo

---

✅ **Referencia completa creada. ¡Listo para implementar!**
