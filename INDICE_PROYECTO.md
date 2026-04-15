# 📑 Índice del Proyecto - Mapa Completo

Navega fácilmente por todos los archivos y componentes del proyecto.

---

## 🚀 EMPEZAR AQUÍ

| Archivo | Descripción | Prioridad |
|---------|-------------|-----------|
| [QUICK_START.md](QUICK_START.md) | Configuración en 5 minutos | ⭐⭐⭐ |
| [README.md](README.md) | Visión general del proyecto | ⭐⭐⭐ |
| [.env.example](.env.example) | Variables de entorno necesarias | ⭐⭐⭐ |

---

## 📚 DOCUMENTACIÓN

### Guías de Usuario
| Archivo | Contenido | Audiencia |
|---------|----------|-----------|
| [MANUAL_DE_USUARIO.md](MANUAL_DE_USUARIO.md) | Instrucciones paso a paso con 6 secciones | Usuarios finales, clientes |
| [GUIA_IMPLEMENTACION.md](GUIA_IMPLEMENTACION.md) | Fases de desarrollo con checklist | Desarrolladores |
| [RESUMEN_IMPLEMENTACION.md](RESUMEN_IMPLEMENTACION.md) | Qué se hizo y próximos pasos | Project Manager, Equipo |

### Configuración Técnica
| Archivo | Contenido | Quién |
|---------|----------|-------|
| [DATABASE_SCHEMA.sql](DATABASE_SCHEMA.sql) | Script SQL completo (tablas + RLS + índices) | Andrés & Jhonatan |
| [MODELO_DATOS.md](MODELO_DATOS.md) | Diagrama ERD con descripción de tablas | Todos |
| [SETUP_RESEND.md](SETUP_RESEND.md) | Configuración de correos automáticos | Emanuel & Giseella |

---

## 💻 CÓDIGO - PÁGINAS

### Páginas Públicas
```
app/
├── page.tsx                    # 🏠 Página principal (hero + lotes + etapas)
├── layout.tsx                  # 🎨 Layout global con metadata
└── globals.css                 # 🎨 Estilos globales
```

### Rutas Dinámicas
```
app/
└── lotes/
    └── [id]/
        └── page.tsx           # 📄 Página de detalle del lote (a crear)
```

---

## 🔌 APIS REST

### Estructura
```
app/api/
├── lotes/
│   ├── route.ts              # GET /api/lotes [?etapa=X&estado=X]
│   └── [id]/
│       └── route.ts          # GET /api/lotes/123
├── pagos/
│   ├── crear.ts              # POST /api/pagos/crear (envía correo)
│   └── estado-cuenta.ts      # GET /api/pagos/estado-cuenta?compra_id=X
├── compras/
│   └── route.ts              # GET /api/compras [?estado=X&user_id=X]
├── pqrs/
│   └── route.ts              # GET/POST /api/pqrs
└── email/
    └── (reservado para futuro)
```

### Detalle de APIs

#### `GET /api/lotes`
- Obtiene lotes disponibles
- Parámetros: `etapa`, `estado`
- Respuesta: Array de lotes

#### `GET /api/pagos/estado-cuenta?compra_id=123`
- Estado actual de una compra
- Retorna: `{ valor_total, total_pagado, saldo_pendiente, pagos: [] }`

#### `POST /api/pagos/crear`
- Registra un pago
- Body: `{ compra_id, monto_abonado, metodo_pago, usuario_email }`
- Acción: Envía correo automático con Resend

#### `GET /api/pqrs`
- Lista todas las PQRS

#### `POST /api/pqrs`
- Crea nueva PQRS
- Body: `{ tipo, asunto, descripcion, user_id? }`

---

## 🎨 COMPONENTES

### Ubicación: `components/`

#### Componentes de UI (shadcn/ui)
```
components/ui/
├── button.tsx                  # Botón genérico
├── card.tsx                    # Tarjeta contenedora
├── input.tsx                   # Input de texto
├── label.tsx                   # Etiqueta de formulario
├── textarea.tsx                # Área de texto
├── select.tsx                  # Select dropdown
├── table.tsx                   # Tabla
├── alert.tsx                   # Alerta
├── badge.tsx                   # Badge
├── progress.tsx                # Barra de progreso
├── separator.tsx               # Divisor
├── dialog.tsx                  # Modal/Dialog
└── [otros 20+ componentes]     # Ver `components.json`
```

#### Componentes Custom
| Archivo | Propósito | Props |
|---------|-----------|-------|
| [etapas-timeline.tsx](components/etapas-timeline.tsx) | Timeline de 4 etapas | None (data interna) |
| [lote-card.tsx](components/lote-card.tsx) | Tarjeta individual de lote | `id, numero_lote, etapa, area_m2, ubicacion, valor_total, estado, onSelect` |
| [estado-cuenta.tsx](components/estado-cuenta.tsx) | Dashboard de pagos | `compraId: number` |
| [formulario-pqrs.tsx](components/formulario-pqrs.tsx) | Formulario PQRS | None (self-contained) |
| [admin-panel.tsx](components/admin-panel.tsx) | Panel admin (2 secciones) | None (admin page) |

---

## 🪝 HOOKS & UTILIDADES

### Hooks
```
hooks/
└── use-toast.ts               # Hook para notifications (Sonner)
```

### Utilidades
```
lib/
├── utils.ts                   # Utilidades generales (clsx, cn)
└── payment-utils.ts           # 💰 Funciones de cálculo de pagos:
                               #    - calcularSaldoPendiente()
                               #    - calcularPorcentajePago()
                               #    - formatearMoneda()
                               #    - generarPlanPagos()
                               #    - validarMontoPago()
                               #    - Y 10+ más...
```

---

## ⚙️ CONFIGURACIÓN

| Archivo | Propósito |
|---------|-----------|
| [package.json](package.json) | Dependencias y scripts |
| [tsconfig.json](tsconfig.json) | Configuración TypeScript |
| [next.config.js](next.config.js) | Configuración Next.js |
| [tailwind.config.ts](tailwind.config.ts) | Configuración Tailwind |
| [postcss.config.js](postcss.config.js) | Procesamiento CSS |
| [components.json](components.json) | Configuración shadcn/ui |
| [.eslintrc.json](.eslintrc.json) | Reglas de linting |
| [middleware.ts](middleware.ts) | Middleware de Next.js (protección admin) |

---

## 📋 ARCHIVOS ESPECIALES

| Archivo | Descripción |
|---------|-------------|
| [.gitignore](.gitignore) | Archivos ignorados en Git |
| [.env.local (local)](.env.example) | Variables secretas (NO commitir) |
| [.env.example](.env.example) | Template de `.env.local` |
| [netlify.toml](netlify.toml) | Config para deploy en Netlify |
| [next-env.d.ts](next-env.d.ts) | Tipos generados por Next.js |

---

## 📦 ESTRUCTURA COMPLETA

```
project/
├── 📄 Documentación
│   ├── README.md
│   ├── QUICK_START.md
│   ├── MANUAL_DE_USUARIO.md
│   ├── GUIA_IMPLEMENTACION.md
│   ├── RESUMEN_IMPLEMENTACION.md
│   ├── MODELO_DATOS.md
│   ├── SETUP_RESEND.md
│   └── VERIFICAR_SETUP.sh
│
├── 📁 app/ (Next.js App Router)
│   ├── 📄 layout.tsx
│   ├── 📄 page.tsx
│   ├── globals.css
│   └── 📁 api/
│       ├── lotes/
│       ├── pagos/
│       ├── compras/
│       └── pqrs/
│
├── 📁 components/
│   ├── etapas-timeline.tsx
│   ├── lote-card.tsx
│   ├── estado-cuenta.tsx
│   ├── formulario-pqrs.tsx
│   ├── admin-panel.tsx
│   └── 📁 ui/ (shadcn/ui components)
│
├── 📁 lib/
│   ├── utils.ts
│   └── payment-utils.ts
│
├── 📁 hooks/
│   └── use-toast.ts
│
├── ⚙️ Config Files
│   ├── .env.local (local)
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── components.json
│   ├── .eslintrc.json
│   └── middleware.ts
│
├── 📊 Base de Datos
│   └── DATABASE_SCHEMA.sql
│
└── 📁 node_modules/
```

---

## 🔍 CÓMO BUSCAR EN EL PROYECTO

### Por Tipo de Tarea

**Quiero ver la homepage:**  
→ `app/page.tsx`

**Quiero agregar un nuevo lote:**  
→ `DATABASE_SCHEMA.sql` (tabla lotes) + `POST /api/lotes`

**Quiero personalizar colores:**  
→ `tailwind.config.ts`

**Quiero agregar un correo:**  
→ `SETUP_RESEND.md` + `/app/api/pagos/crear.ts`

**Quiero proteger una ruta:**  
→ `middleware.ts`

**Quiero agregar una columna a lotes:**  
→ `DATABASE_SCHEMA.sql` (alter table)

---

## 🚀 FLUJO DE DATOS

```
Usuario accede homepage
         ↓
    app/page.tsx (cargar LoteCard)
         ↓
    Fetch GET /api/lotes (con filtros)
         ↓
    Mostrar estado de cuenta
         ↓
    Fetch GET /api/pagos/estado-cuenta
         ↓
    Registrar pago
         ↓
    POST /api/pagos/crear
         ↓
    Resend.emails.send() (correo automático)
         ↓
    Supabase actualiza BD
```

---

## 📲 RESPONSIVE DESIGN

El proyecto usa Tailwind CSS con breakpoints:
- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px
- `2xl:` - 1536px

Todos los componentes son responsive.

---

## 🔐 SEGURIDAD

- RLS habilitado en `DATABASE_SCHEMA.sql`
- Validaciones en `/app/api/` (server-side)
- Middleware en `middleware.ts`
- Variables sensibles en `.env.local` (no commitir)

---

## ✨ CARACTERÍSTICAS PRINCIPALES

| Feature | Ubicación | Estado |
|---------|-----------|--------|
| Catálogo de lotes | `page.tsx`, `/api/lotes` | ✅ |
| Filtro por etapa | `page.tsx` (UI hook) | ✅ |
| Estado de cuenta | `components/estado-cuenta.tsx` | ✅ |
| Registrar pago | `/api/pagos/crear` | ✅ |
| Correos automáticos | `SETUP_RESEND.md`, `/api/pagos/crear` | ✅ |
| PQRS | `components/formulario-pqrs.tsx`, `/api/pqrs` | ✅ |
| Panel Admin | `components/admin-panel.tsx` | ✅ |
| RLS (Seguridad) | `DATABASE_SCHEMA.sql` | ✅ |

---

## 💡 TIPS

1. **Buscar por nombre de función**: Usa `Ctrl+F` en archivos
2. **Navegar componentes**: Ver `components/` y `app/`
3. **Entender BD**: Leer `MODELO_DATOS.md`
4. **Deploy**: Seguir `GUIA_IMPLEMENTACION.md`
5. **Bugs**: Revisar consola del navegador (F12)

---

**¿No encuentras algo?** Revisa los comentarios de código o pregunta al equipo.

*Última actualización: 10 de marzo de 2025*
