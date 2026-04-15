# 🏗️ Arquitectura del Panel Administrativo

## Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                    USUARIO FINAL                            │
│                  (En navegador)                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │  http://localhost:3000 │
            │        /admin          │
            └────────────┬───────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
     ¿Está         ¿Tiene        ¿Usuario
   autenticado?  sesión activa?  válido?
        │                │              │
     No│          Sí     │Yes           │
        │          ┌──────┴──────┐      │
        │          │             ▼      │
        │      ┌───►│ ADMIN PAGE │      │
        │      │    │ page.tsx   │      │
        │      │    └─────┬─────────────┘
        │      │          │
        ▼      │          ▼
     /LOGIN ◄──┘   ┌──────────────────┐
                   │  HEADER COMPONENT │
                   │   admin-header.tsx│
                   └──────┬───────────┘
                          │
              ┌───────────┼───────────┐
              │           │           │
              ▼           ▼           ▼
        ┌──────────┐  ┌──────────┐  ┌──────┐
        │  AVATAR  │  │   NAME   │  │LOGOUT│
        └──────────┘  └──────────┘  └──────┘
                          │
        ┌─────────────────┼────────────────┐
        │                 │                │
        ▼                 ▼                ▼
     ┌─ TABS ────────────────────────┐
     │ [LOTES] | [PQRS]              │
     └────┬──────────────────────┬───┘
          │                      │
     LOTES│                      │PQRS
          ▼                      ▼
     ┌─────────────────┐   ┌──────────────────┐
     │  LOTES LIST     │   │   PQRS TABLE     │
     │ lotes-list.tsx  │   │ pqrs-table.tsx   │
     └────────┬────────┘   └────────┬─────────┘
              │                     │
        ┌─────┴────────┬────────┐   │
        │              │        │   │
        ▼              ▼        ▼   ▼
    CARDS   →   TABLE    →  ACTIONS
   STATS       LOTES       RELOAD
   
   - DISPONIBLES
   - RESERVADOS
   - VENDIDOS
        │
        ▼
   SUPABASE API
   ┌────────────────┐
   │ SELECT * FROM  │
   │ lotes          │
   └────────────────┘
     
```

---

## Arquitectura por Capas

```
┌─────────────────────────────────────────────────────────┐
│                   PRESENTACIÓN (UI)                     │
│                                                         │
│  app/admin/page.tsx                                     │
│  ├── Router & Layout                                    │
│  └── Componentes Principales                           │
│                                                         │
│      components/admin/                                  │
│      ├── admin-header.tsx  ─► Avatar, Logout           │
│      ├── pqrs-table.tsx    ─► Tabla + Selectores       │
│      └── lotes-list.tsx    ─► Cards + Tabla            │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│                   CAPA DE ESTADO                        │
│                                                         │
│  React Hooks (useState, useEffect)                      │
│  - Estado de datos                                      │
│  - Loading/Error states                                │
│  - Actualizaciones en tiempo real                       │
│                                                         │
│  Toast System (use-toast)                              │
│  - Notifications de éxito/error                         │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│              CAPA DE DATOS (Services)                   │
│                                                         │
│  lib/pqrs.ts                                            │
│  ├── getAllPQRS()                                        │
│  ├── updatePQRSStatus(id, estado)                      │
│  └── submitPQRS(data)                                   │
│                                                         │
│  lib/supabase.ts                                        │
│  ├── getLotes()                                         │
│  ├── Configuración Supabase                             │
│  └── Interfaces de Datos                                │
│                                                         │
│  lib/auth.ts                                            │
│  ├── getSession()                                       │
│  └── signOut()                                          │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│              BASE DE DATOS (Supabase)                   │
│                                                         │
│  PostgreSQL Tables                                      │
│  ├── pqrs                                               │
│  │   ├── id (PK)                                        │
│  │   ├── tipo, nombre, email, etc.                      │
│  │   └── estado (Pendiente/En Proceso/Resuelto)        │
│  │                                                      │
│  ├── lotes                                              │
│  │   ├── id (PK)                                        │
│  │   ├── nombre, ubicacion, area, valor                │
│  │   └── estado (Disponible/Reservado/Vendido)         │
│  │                                                      │
│  └── auth.users (Supabase Auth)                         │
│      └── Control de sesiones                            │
└─────────────────────────────────────────────────────────┘
```

---

## Flujo de Datos - Cambiar Estado PQRS

```
Usuario hace click en Selector
           │
           ▼
 ┌─────────────────────┐
 │  UI: SelectTrigger  │
 │  Abre Dropdown      │
 └────────┬────────────┘
          │
          ▼
┌───────────────────────────────────────┐
│ Usuario selecciona nuevo estado       │
│ (Pendiente → En Proceso → Resuelto)   │
└────────┬────────────────────────────┐
         │                            │
         ▼                            ▼
   ┌──────────────────────────────────┐
   │ handleStatusChange(id, newStatus)│
   │ (Función en pqrs-table.tsx)      │
   └────────┬─────────────────────────┘
            │
            ▼
   ┌────────────────────────────────┐
   │ updatePQRSStatus(id, newStatus)│
   │ (lib/pqrs.ts)                  │
   └────────┬──────────────────────┘
            │
            ▼
   ┌─────────────────────────────┐
   │ Supabase.from('pqrs')       │
   │ .update({ estado })         │
   │ .eq('id', id)               │
   └────────┬────────────────────┘
            │ SQL UPDATE
            ▼
   ┌─────────────────────────────┐
   │ PostgreSQL Database         │
   │ UPDATE pqrs                 │
   │ SET estado = 'Resuelto'     │
   │ WHERE id = 1                │
   └────────┬────────────────────┘
            │
            ▼
   ┌──────────────────────────────┐
   │ Supabase devuelve SUCCESS    │
   └────────┬─────────────────────┘
            │
            ▼
   ┌──────────────────────────────┐
   │ setState({ estado: ... })    │
   │ (Actualiza UI instantáneamente)
   └────────┬─────────────────────┘
            │
            ▼
   ┌──────────────────────────────┐
   │ Toast Notification           │
   │ "Estado actualizado"         │
   │ (Verde - Éxito)              │
   └──────────────────────────────┘
```

---

## Estructura de Componentes

```
AdminPage (app/admin/page.tsx)
│
├── useEffect (Verificar Auth)
│   └── Si no autenticado → Redirige a /login
│
├── AdminHeader (Header de la página)
│   ├── Branding (Logo + Título)
│   └── Dropdown Menu Usuario
│       ├── Mostrar email
│       └── Logout (redirige a /login)
│
└── Tabs
    ├── Tab 1: "Lotes"
    │   │
    │   └── LotesList (components/admin/lotes-list.tsx)
    │       │
    │       ├── useEffect (Cargar datos)
    │       │
    │       ├── Stats Cards
    │       │   ├── Disponibles ✓
    │       │   ├── Reservados ⌛
    │       │   └── Vendidos ✓✓
    │       │
    │       └── Tabla Lotes
    │           ├── ID
    │           ├── Nombre
    │           ├── Ubicación
    │           ├── Área
    │           ├── Valor
    │           ├── Estado (Badge)
    │           └── Características (Badges)
    │
    └── Tab 2: "PQRS"
        │
        └── PQRSTable (components/admin/pqrs-table.tsx)
            │
            ├── useEffect (Cargar datos)
            │
            └── Tabla PQRS
                ├── ID
                ├── Tipo (Petición/Queja/Reclamo/Sugerencia)
                ├── Nombre
                ├── Email
                ├── Asunto
                ├── Descripción
                ├── Estado (Select Dropdown)
                │   └── Pendiente → En Proceso → Resuelto
                └── Fecha
```

---

## Conexión a Supabase

```
Front-End (Next.js)
     │
     │ import { supabase }
     │ from '@/lib/supabase'
     │
     ▼
src/lib/supabase.ts
     │
     ├── createClient(URL, KEY)
     │
     ▼
Supabase REST API
     │
     ├── POST /rest/v1/pqrs?select=*
     │
     ├── PATCH /rest/v1/pqrs?id=eq.1
     │
     ├── GET /rest/v1/lotes?select=*
     │
     ▼
PostgreSQL Database
     │
     ├── SELECT * FROM pqrs
     │
     ├── UPDATE pqrs SET estado = ...
     │
     └── SELECT * FROM lotes
```

---

## Estados y Transiciones

### PQRS Estados

```
┌──────────┐
│ Pendiente│ ──► ┌──────────┐
└──────────┘     │En Proceso│ ──► ┌─────────┐
                 └──────────┘     │ Resuelto│
                                  └─────────┘

Flujo típico:
1. Usuario envía PQRS → Pendiente
2. Admin lo recibe → Cambia a En Proceso
3. Se resuelve → Cambia a Resuelto
```

### Lotes Estados

```
┌────────────┐
│ Disponible │  ──┐
└────────────┘    │
                  ├──► ┌──────────┐
     ┌──────────────────┤ Reservado│ ──┐
     │                  └──────────┘    │
     │                                  ▼
     │                             ┌─────────┐
     │                             │ Vendido │
     │                             └─────────┘
     │
     └──────────────────────────────────┘
            (Disponible → Vendido)
```

---

## Rendimiento

```
Dashboard Loading
     │
     ├─ Verifica autenticación (rápido)
     │
     ├─ Carga PQRS desde DB
     │   └─ Índice en: created_at, estado, tipo
     │
     ├─ Carga Lotes desde DB
     │   └─ Índice en: estado
     │
     └─ Renderiza componentes
         └─ Actualización instánterea con cambios
         
Cambio de estado PQRS
     │
     ├─ Validación cliente (instant)
     │
     ├─ Request a Supabase (100-500ms típico)
     │
     └─ Update local (instant)
```

---

## Seguridad

```
Acceso sin Autenticación
     │
     ▼
┌──────────────────────┐
│ getSession()         │
│ (Supabase Auth)      │
└────┬────────────────┘
     │
     ├─ Sin sesión → Redirige a /login ✓
     │
     └─ Con sesión → Muestra dashboard ✓
         │
         └─ Row Level Security (RLS)
            ├─ Solo usuarios autenticados ven PQRS ✓
            ├─ Solo autenticados pueden editar ✓
            └─ Todos pueden ver lotes ✓
```

---

## Ciclo de Vida del Componente

```
1. MOUNT
   └── useEffect se ejecuta
       ├── Verifica auth
       ├── Si no auth → redirige
       └── Si auth → Carga datos

2. ESTADO INICIAL
   ├── Loading = true
   ├── pqrsData = []
   └── lotes = []

3. DATOS CARGADOS
   ├── Loading = false
   ├── pqrsData = datos de BD
   └── Renderiza tabla

4. USUARIO INTERACTÚA
   └── Event listener (click selector)
       ├── handleStatusChange
       └── updatePQRSStatus

5. ACTUALIZACIÓN
   ├── setState actualiza UI
   ├── Toast muestra confirmación
   └── Datos persisten en BD

6. UNMOUNT
   └── Componentes se limpian
```

---

## Tabla de Componentes Utilizados

```
┌──────────────────┬─────────────────┬──────────────┐
│  Componente      │  Ubicación      │  Uso         │
├──────────────────┼─────────────────┼──────────────┤
│ Table*           │  ui/table       │  Mostrar     │
│                  │                 │  datos       │
├──────────────────┼─────────────────┼──────────────┤
│ Select*          │  ui/select      │  Cambiar     │
│                  │                 │  estado      │
├──────────────────┼─────────────────┼──────────────┤
│ Badge            │  ui/badge       │  Colores     │
├──────────────────┼─────────────────┼──────────────┤
│ Card             │  ui/card        │  Contenedor  │
├──────────────────┼─────────────────┼──────────────┤
│ Button           │  ui/button      │  Acciones    │
├──────────────────┼─────────────────┼──────────────┤
│ Avatar           │  ui/avatar      │  Usuario     │
├──────────────────┼─────────────────┼──────────────┤
│ DropdownMenu     │  ui/dropdown    │  Menu user   │
├──────────────────┼─────────────────┼──────────────┤
│ Tabs             │  ui/tabs        │  Navegación  │
└──────────────────┴─────────────────┴──────────────┘

* Componentes Radix UI + Tailwind CSS
```

---

## Variables de Estado en Componentes

### pqrs-table.tsx
```typescript
const [pqrsData, setPQRSData] = useState<PQRS[]>([])
  └─ Array de todas las PQRS

const [loading, setLoading] = useState(true)
  └─ Indica si está cargando

const [updating, setUpdating] = useState<number | null>(null)
  └─ ID de PQRS siendo actualizada

const [toast] = useToast()
  └─ Sistema de notificaciones
```

### lotes-list.tsx
```typescript
const [lotes, setLotes] = useState<Lote[]>([])
  └─ Array de todos los lotes

const [loading, setLoading] = useState(true)
  └─ Indica si está cargando
```

### AdminPage
```typescript
const [user, setUser] = useState<any>(null)
  └─ Usuario autenticado

const [loading, setLoading] = useState(true)
  └─ Verificano autenticación
```

---

Este diagrama muestra cómo todos los componentes trabajan juntos para crear
un panel administrativo funcional, seguro y profesional. ✨
