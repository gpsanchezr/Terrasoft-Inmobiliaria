# 🚀 Guía Rápida de Implementación

Esta guía te ayudará a implementar el sistema de venta de lotes paso a paso.

## 📋 Checklist Pre-implementación

- [ ] Acceso a Supabase
- [ ] Acceso a Resend
- [ ] Acceso a GitHub
- [ ] Node.js 18+ instalado
- [ ] Git instalado
- [ ] Proyecto en Vercel/Netlify

---

## **FASE 1: Configuración de la Base de Datos** (Andrés y Jhonatan)

### Paso 1.1: Ejecutar Script SQL en Supabase

1. Ve a [supabase.co](https://supabase.co)
2. Abre tu proyecto
3. En el menú lateral, ve a **SQL Editor**
4. Haz clic en **New Query**
5. Copia TODO el contenido de `DATABASE_SCHEMA.sql`
6. Pégalo en el editor
7. Haz clic en **Run**
8. ✅ Espera confirmación de que se crearon todas las tablas

### Paso 1.2: Verificar Tablas Creadas

En Supabase, ve a **Table Editor** y verifica que existan:
- [ ] `lotes`
- [ ] `compras`
- [ ] `pagos`
- [ ] `pqrs`
- [ ] `user_profiles`

### Paso 1.3: Habilitar RLS

En Supabase, para cada tabla:
1. Selecciona la tabla
2. Click en **Auth** (arriba)
3. Verifica que **RLS está habilitado**

---

## **FASE 2: Configuración Local** (Todos)

### Paso 2.1: Clonar y Preparar Proyecto

```bash
# En tu terminal
git clone <repo_url>
cd project
npm install
```

### Paso 2.2: Configurar Variables de Entorno

1. En la carpeta raíz, copia `.env.example` a `.env.local`:
```bash
cp .env.example .env.local
```

2. Abre `.env.local` y completa:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_aquí
RESEND_API_KEY=re_xxxxx
ADMIN_EMAILS=tu_correo@example.com
```

### Paso 2.3: Probar Localmente

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

Si ves "Lotes Disponibles", ✅ estás listo.

---

## **FASE 3: Integración de Correos con Resend** (Emanuel y Giseella)

### Paso 3.1: Crear Cuenta en Resend

1. Ve a [resend.com](https://resend.com)
2. Haz clic en **Get started**
3. Registrate con GitHub
4. Confirma tu correo

### Paso 3.2: Obtener API Key

1. En Resend dashboard, ve a **API Keys**
2. Copia tu API key
3. Pégala en `.env.local`:
```env
RESEND_API_KEY=re_xxxxx
```

### Paso 3.3: Verificar Correos de Prueba

En el archivo `/app/api/pagos/crear.ts` verifica:
- [ ] Import de `Resend` está correcto
- [ ] API key se usa correctamente
- [ ] Correo se envía al crear un pago

---

## **FASE 4: Agregar Datos de Prueba** (Todos)

### Paso 4.1: Insertar Lotes de Ejemplo

En Supabase SQL Editor:

```sql
INSERT INTO lotes (numero_lote, etapa, area_m2, ubicacion, valor_total, estado, descripcion)
VALUES 
  ('L-001', 'Preventa', 150.50, 'Sector norte, cerca de avenida principal', 50000000, 'disponible', 'Lote esquinero con buena accesibilidad'),
  ('L-002', 'Preventa', 120.00, 'Sector central, frente a zona verde', 45000000, 'disponible', 'Lote con vista al parque principal'),
  ('L-003', 'Lanzamiento', 180.75, 'Sector sur, acceso directo', 55000000, 'reservado', 'Lote grande con servicios cercanos'),
  ('L-004', 'Construcción', 100.25, 'Sector este, zona residencial', 40000000, 'disponible', 'Lote para inversión a largo plazo');
```

### Paso 4.2: Verificar en UI

1. Ve a [http://localhost:3000](http://localhost:3000)
2. Desplázate a **"Lotes Disponibles"**
3. Deberías ver 3 lotes disponibles

---

## **FASE 5: Crear Rutas Protegidas de Admin** (Emanuel)

### Paso 5.1: Crear Carpeta de Admin

```bash
mkdir -p app/admin
```

### Paso 5.2: Crear Página de Admin

Ver template en `templates/admin-dashboard.tsx` (ver próximos pasos)

### Paso 5.3: Proteger Ruta

El middleware en `middleware.ts` verifica:
- [ ] Usuario está autenticado
- [ ] Usuario tiene rol `admin`

---

## **FASE 6: Deploy en Vercel** (Todos)

### Paso 6.1: Preparar Deploy

```bash
# Verificar que todo compila
npm run build

# Verificar tipos
npm run typecheck
```

### Paso 6.2: Pushear a GitHub

```bash
git add .
git commit -m "feat: sistema completo de venta de lotes"
git push origin main
```

### Paso 6.3: Configurar en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Click en **Add New** > **Project**
3. Selecciona tu repositorio
4. Haz clic en **Import**
5. En **Environment Variables**, agrega:
   - [ ] `NEXT_PUBLIC_SUPABASE_URL`
   - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - [ ] `RESEND_API_KEY`
   - [ ] `ADMIN_EMAILS`

6. Haz clic en **Deploy**
7. ✅ Espera a que termine (5-10 minutos)

---

## **FASE 7: Testing y Validación** (Todos)

### Paso 7.1: Test de Flujo de Compra

1. Accede a tu URL de Vercel
2. [ ] ¿Se ven los lotes en la página principal?
3. [ ] ¿Puedes hacer clic en "Ver Detalles"?
4. [ ] ¿Aparecen las etapas en timeline?

### Paso 7.2: Test de Pagos

1. En admin, intenta registrar un pago (simulado)
2. [ ] ¿El correo fue enviado?
3. [ ] ¿El estado de cuenta se actualizó?

### Paso 7.3: Test de PQRS

1. Envía un PQRS de prueba
2. [ ] ¿Se registró en la BD?
3. [ ] ¿Recibiste confirmación por correo?

---

## **FASE 8: Documentación Final** (Deivis)

### Paso 8.1: Capturar Pantallas

1. Toma screenshots de:
   - [ ] Página principal
   - [ ] Catálogo de lotes
   - [ ] Estado de cuenta
   - [ ] Formulario PQRS
   - [ ] Panel de admin

### Paso 8.2: Crear Manual Completo

1. Descargar `MANUAL_DE_USUARIO.md`
2. Agregar las capturas en cada sección
3. Guardar como PDF

### Paso 8.3: Guardar Diagrama ERD

1. Ir a `MODELO_DATOS.md`
2. El diagrama Mermaid está listo para usar

---

## 🔧 Solución de Problemas Comunes

### ❌ "cannot find module @supabase/supabase-js"
```bash
npm install @supabase/supabase-js
```

### ❌ "SUPABASE_URL is undefined"
Verifica que `.env.local` tenga:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### ❌ Correos no se envían
1. Verifica `RESEND_API_KEY` en `.env.local`
2. Reinicia servidor: `npm run dev`
3. Chequea logs en Resend dashboard

### ❌ Lotes no aparecen
1. Verifica que insertaste datos en table `lotes`
2. Revisa que RLS esté habilitado en Supabase
3. Abre DevTools (F12) > Network > chequea `/api/lotes`

---

## ✅ Checklist Final

Antes de presentar el proyecto:

### Funcionalidades Core
- [ ] Usuarios pueden ver lotes
- [ ] Pueden filtrar por etapa
- [ ] Estado de cuenta muestra saldo correcto
- [ ] Pagos registran automáticamente
- [ ] Correos se envían
- [ ] PQRS se guardan
- [ ] Admin puede gestionar todo

### Documentación
- [ ] README.md completo
- [ ] Manual de usuario en PDF
- [ ] Diagrama ERD visible
- [ ] Guía de Resend resolvida

### Performance
- [ ] Página carga rápido
- [ ] No hay errores en consola
- [ ] Imágenes están optimizadas
- [ ] Responsive en móvil

### Seguridad
- [ ] RLS habilitado
- [ ] Claves no commitidas
- [ ] Validación en servidor
- [ ] CORS configurado

---

## 📞 Contactos Rápidos

- **Andrés & Jhonatan**: Base de datos
- **Emanuel & Giseella**: Pagos y correos
- **Deivis**: Documentación

---

*Última actualización: Marzo 10, 2025*
