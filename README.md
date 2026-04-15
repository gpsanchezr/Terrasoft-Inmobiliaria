# 🏡 Terrasoft — Sistema Web Inmobiliario

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-13.5-black?logo=next.js" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase" />
  <img src="https://img.shields.io/badge/TypeScript-5.2-3178C6?logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.3-38BDF8?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Shadcn/UI-✓-000?logo=radix-ui" />
  <img src="https://img.shields.io/badge/Vercel-Deploy-000?logo=vercel" />
</p>

Plataforma web moderna para la gestión y comercialización de **lotes de terreno** del proyecto habitacional **MonteVerde**. Permite a clientes explorar, comprar y hacer seguimiento de sus lotes; y a administradores gestionar todo el ciclo de venta.

---

## 🎯 Descripción del Proyecto

Terrasoft es una solución tecnológica integral desarrollada para **SENA CNCA – Nodo TIC ADSO-18**, que sistematiza el proceso completo de venta de lotes, pagos por cuotas y comunicación con clientes, eliminando el papel y los procesos manuales.

> Los lotes del proyecto oscilan entre **100 y 200 m²** y el sistema controla su disponibilidad en tiempo real, previniendo la doble venta mediante restricciones en base de datos.

---

## 🚀 Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | Next.js 13.5, React 18, TypeScript |
| **Estilos** | Tailwind CSS 3.3, Shadcn/UI, Radix UI |
| **Backend** | Next.js API Routes (Server Actions) |
| **Base de Datos** | Supabase (PostgreSQL) |
| **Autenticación** | Supabase Auth (JWT) |
| **Correos** | Resend + React Email |
| **Hosting** | Vercel / Netlify |

---

## ⚙️ Requisitos Funcionales — 100% Cubiertos

| # | Módulo | Estado |
|---|---|---|
| RF-01 | Registro de usuarios con validación de correo | ✅ |
| RF-02 | Inicio y cierre de sesión seguro (JWT) | ✅ |
| RF-03 | Recuperación de contraseña por correo | ✅ |
| RF-04 | Catálogo de lotes con estado (Disponible / Reservado / Vendido) | ✅ |
| RF-05 | Clasificación de lotes por etapa del proyecto | ✅ |
| RF-06 | Compra de uno o varios lotes por cliente | ✅ |
| RF-07 | Registro de pagos por cuotas | ✅ |
| RF-08 | Cálculo automático de saldo pendiente | ✅ |
| RF-09 | Historial de pagos por cliente | ✅ |
| RF-10 | Envío automático de comprobante de pago al correo | ✅ |
| RF-11 | Información general del proyecto habitacional | ✅ |
| RF-12 | Timeline de etapas del negocio | ✅ |
| RF-13 | Formulario PQRS con número de radicado | ✅ |
| RF-14 | Seguimiento del estado de cada PQRS | ✅ |
| RF-15 | Panel de administración con CRUD completo | ✅ |

### ✨ Extras Implementados

- [x] **Chatbot IA** integrado con la cartelera de lotes en tiempo real
- [x] **RLS** en todas las tablas (seguridad a nivel de fila)
- [x] **Middleware** de protección para rutas `/admin` y `/mi-cuenta`
- [x] **Vista SQL** para estado de cuenta calculado automáticamente
- [x] **Trigger automático** para crear perfil al registrarse
- [x] **Trigger automático** para cambiar estado del lote al comprar
- [x] **Toasts / Skeletons** para mejor UX

---

## 📦 Instalación y Configuración

### Requisitos Previos
- Node.js 18+
- Cuenta en [Supabase](https://supabase.com) (gratis)
- Cuenta en [Resend](https://resend.com) (gratis, para correos)

### 1. Clonar el repositorio
```bash
git clone https://github.com/gpsanchezr/Terrasoft-Inmobiliaria.git
cd Terrasoft-Inmobiliaria
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Variables de entorno
```bash
cp .env.example .env.local
```

Completa `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
RESEND_API_KEY=re_xxxxx
ADMIN_EMAILS=admin@tudominio.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Configurar base de datos en Supabase
1. Crea un nuevo proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor**
3. Pega y ejecuta el contenido de `DATABASE_SCHEMA_SUPABASE.sql`

### 5. Configurar correos con Resend
1. Crea una cuenta en [resend.com](https://resend.com)
2. Verifica tu dominio o usa el dominio sandbox para pruebas
3. Copia tu API Key y agrégala a `.env.local`

### 6. Ejecutar en desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000)

---

## 📁 Estructura del Proyecto

```
Terrasoft-Inmobiliaria/
├── app/
│   ├── api/
│   │   ├── compras/
│   │   │   ├── crear.ts          ← Crear compra + cambiar estado lote
│   │   │   └── route.ts          ← GET/POST compras
│   │   ├── lotes/
│   │   │   ├── [id]/route.ts     ← GET/PATCH/DELETE lote por ID
│   │   │   └── route.ts          ← GET lotes con filtros
│   │   ├── pagos/
│   │   │   ├── crear.ts          ← Registrar pago + enviar correo
│   │   │   └── estado-cuenta.ts  ← Calcular saldo pendiente
│   │   ├── pqrs/route.ts         ← CRUD PQRS
│   │   └── register/route.ts     ← Registro de usuarios
│   ├── admin/page.tsx            ← Panel administración
│   ├── login/page.tsx            ← Inicio de sesión
│   ├── lotes/[id]/page.tsx       ← Detalle de lote
│   ├── mi-cuenta/page.tsx        ← Dashboard del cliente
│   ├── pqrs/page.tsx             ← Formulario PQRS
│   ├── register/page.tsx         ← Registro de usuarios
│   ├── globals.css               ← Estilos globales
│   ├── layout.tsx                ← Layout principal
│   └── page.tsx                  ← Landing page
├── components/
│   ├── admin/
│   │   ├── admin-header.tsx      ← Encabezado del panel admin
│   │   ├── lotes-list.tsx        ← Tabla CRUD de lotes
│   │   └── pqrs-table.tsx        ← Gestión de PQRS
│   ├── ui/                       ← Componentes Shadcn/UI
│   ├── admin-panel.tsx           ← Panel admin completo
│   ├── chatbot-modal.tsx         ← Modal del chatbot
│   ├── estado-cuenta.tsx         ← Estado de cuenta del cliente
│   ├── etapas-timeline.tsx       ← Timeline del proyecto
│   ├── formulario-pqrs.tsx       ← Formulario PQRS
│   ├── header.tsx                ← Barra de navegación
│   ├── lote-card.tsx             ← Tarjeta de lote
│   └── sidebar-cliente.tsx       ← Menú lateral cliente
├── lib/
│   ├── supabase.ts               ← Cliente Supabase + helpers
│   └── utils.ts                  ← Funciones utilitarias
├── hooks/
│   └── use-toast.ts              ← Hook de notificaciones
├── middleware.ts                 ← Protección de rutas
├── DATABASE_SCHEMA_SUPABASE.sql  ← Script SQL completo
├── tailwind.config.ts            ← Configuración Tailwind
├── next.config.js                ← Configuración Next.js
├── package.json                  ← Dependencias del proyecto
└── README.md                     ← Este archivo
```

---

## 🔌 API — Endpoints Disponibles

### Lotes
| Método | Endpoint | Descripción | Autenticación |
|---|---|---|---|
| GET | `/api/lotes` | Listar lotes (filtros: `?etapa=&estado=`) | Pública |
| GET | `/api/lotes/[id]` | Detalle de un lote | Pública |
| POST | `/api/lotes` | Crear lote | Admin |
| PATCH | `/api/lotes/[id]` | Editar lote | Admin |
| DELETE | `/api/lotes/[id]` | Eliminar lote | Admin |

### Compras
| Método | Endpoint | Descripción | Autenticación |
|---|---|---|---|
| GET | `/api/compras` | Listar compras del usuario | Cliente |
| POST | `/api/compras/crear` | Crear nueva compra | Cliente |

### Pagos
| Método | Endpoint | Descripción | Autenticación |
|---|---|---|---|
| POST | `/api/pagos/crear` | Registrar pago + enviar correo | Cliente |
| GET | `/api/pagos/estado-cuenta?compra_id=` | Estado de cuenta calculado | Cliente |

### PQRS
| Método | Endpoint | Descripción | Autenticación |
|---|---|---|---|
| GET | `/api/pqrs` | Listar PQRS | Cliente/Admin |
| POST | `/api/pqrs` | Crear PQRS | Cliente |

---

## 🗃️ Diagrama de Base de Datos (ERD)

```
auth.users
    │
    ├─────────────── user_profiles ──────── role: 'cliente' | 'admin'
    │
    ├─────────────── pqrs ────────────────── tipo: peticion/queja/reclamo/sugerencia
    │                                        estado: abierto/en_proceso/cerrado
    │
    └─────────────── compras ─────────────── estado: activa/cancelada/completada
                         │
                         │    lotes ─────── etapa: Lanzamiento/Preventa/Construccion/Entrega
                         │                  estado: disponible/reservado/vendido
                         │                  area_m2: 100-200 m²
                         │
                         └──── pagos ─────── monto_abonado
                                             estado_pago: pendiente/completado/rechazado
                                             metodo_pago
                                             comprobante_url
```

### Relaciones
```
auth.users (1) ──── (N) user_profiles
auth.users (1) ──── (N) compras
auth.users (1) ──── (N) pqrs
lotes      (1) ──── (N) compras
compras    (1) ──── (N) pagos
```

---

## 🛡️ Seguridad

### Row Level Security (RLS)
Todas las tablas tienen políticas RLS activas:

| Tabla | Cliente | Admin |
|---|---|---|
| `lotes` | SELECT | SELECT, INSERT, UPDATE, DELETE |
| `compras` | SELECT/INSERT (propias) | SELECT/UPDATE (todas) |
| `pagos` | SELECT/INSERT (propios) | SELECT (todos) |
| `pqrs` | SELECT/INSERT (propias) | SELECT/UPDATE (todas) |
| `user_profiles` | SELECT/UPDATE (propio) | SELECT (todos) |

### Middleware de Protección
- `/admin/*` → Solo accesible con rol `admin` o email en `ADMIN_EMAILS`
- `/mi-cuenta/*` → Requiere sesión activa
- Redirección automática a `/login` si no autenticado

### Contraseñas
- Encriptadas por **Supabase Auth** (bcrypt internamente)
- Tokens JWT con expiración configurable

---

## 📧 Correos Automáticos

Configurados con **Resend + React Email**:

| Evento | Destinatario | Contenido |
|---|---|---|
| Registro exitoso | Cliente | Bienvenida + instrucciones |
| Pago registrado | Cliente | Comprobante con detalles del pago |
| PQRS recibida | Cliente | Número de radicado |
| PQRS respondida | Cliente | Respuesta del administrador |

---

## 🏗️ Etapas del Proyecto MonteVerde

```
🚀 Lanzamiento  →  🏷️ Preventa  →  🔨 Construcción  →  🏠 Entrega
  (Reservas)       (Precios       (Obra en           (Escrituras
                    especiales)    progreso)           y llaves)
```

---

## 🚀 Deploy

### En Vercel (Recomendado)

```bash
# 1. Instalar CLI de Vercel
npm install -g vercel

# 2. Conectar y desplegar
vercel

# 3. Agregar variables de entorno en vercel.com/dashboard
# NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, ADMIN_EMAILS
```

### En Netlify

1. Conectar repositorio en [netlify.com](https://netlify.com)
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Agregar variables de entorno en Site Settings

---

## 🔧 Troubleshooting

| Error | Solución |
|---|---|
| `Table does not exist` | Ejecuta `DATABASE_SCHEMA_SUPABASE.sql` en Supabase |
| `CORS policy error` | Agrega tu dominio en Supabase → Auth → URL Configuration |
| `Correos no se envían` | Verifica `RESEND_API_KEY` y el dominio verificado |
| `Admin no puede entrar` | Agrega email en `ADMIN_EMAILS` o cambia `role = 'admin'` en `user_profiles` |
| `Conflictos de merge en código` | El proyecto usa `lib/supabase.ts` unificado — ya sin MySQL |

---

## 📊 Casos de Uso Principales

| Código | Caso de Uso | Actor |
|---|---|---|
| CU-01 | Registro de Usuario | Cliente |
| CU-02 | Inicio de Sesión | Cliente / Admin |
| CU-03 | Explorar Catálogo de Lotes | Cliente / Visitante |
| CU-04 | Compra de Lote | Cliente |
| CU-05 | Registro de Pago y Envío de Comprobante | Cliente |
| CU-06 | Consulta de Historial de Pagos | Cliente |
| CU-07 | Gestión de Lotes (CRUD) | Admin |
| CU-08 | Registro y Seguimiento de PQRS | Cliente |
| CU-09 | Respuesta a PQRS | Admin |
| CU-10 | Dashboard con reportes | Admin |

---

## 📋 Requisitos No Funcionales

- ✅ **Seguridad**: RLS + JWT + bcrypt (manejado por Supabase Auth)
- ✅ **Roles**: Administrador y Cliente con acceso diferenciado
- ✅ **Responsivo**: Diseño adaptable a móvil, tablet y escritorio
- ✅ **Deploy**: URL pública en Vercel/Netlify
- ✅ **Correos automáticos**: Confirmaciones y comprobantes con Resend

---

## 👥 Equipo de Desarrollo

| Integrante | Rol |
|---|---|
| **Andrés** | Base de Datos & Supabase |
| **Jhonatan** | Base de Datos & SQL |
| **Emanuel** | Lógica de Pagos & API Routes |
| **Giseella Sánchez Rico** | Arquitectura Frontend, Migración Supabase |

---

## 📚 Documentación Adicional

- [`DATABASE_SCHEMA_SUPABASE.sql`](./DATABASE_SCHEMA_SUPABASE.sql) — Script SQL completo con RLS, triggers y datos de ejemplo
- [`MANUAL_DE_USUARIO.md`](./MANUAL_DE_USUARIO.md) — Guía paso a paso para usuarios finales
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — Decisiones de arquitectura y patrones usados

---

## 📄 Licencia

Propiedad privada del proyecto inmobiliario MonteVerde. © 2025 SENA ADSO-18

---

**Versión**: 1.1.0 | **Última actualización**: Abril 2026 | **Proyecto ADSO-18 – SENA CNCA**
