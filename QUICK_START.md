<<<<<<< HEAD
# ⚡ Quick Start - 5 Minutos

Guía rápida para poner el proyecto en funcionamiento.

## 1️⃣ Clonar y Preparar (2 min)

```bash
git clone <tu-repo>
cd project
npm install
cp .env.example .env.local
```

## 2️⃣ Configurar Supabase (1 min)

En `.env.local`, completa:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

Obtener de: [supabase.co](https://supabase.co) → Tu proyecto → Settings → API

## 3️⃣ Crear Tablas (1 min)

1. En Supabase, abre **SQL Editor**
2. Copia contenido de `DATABASE_SCHEMA.sql`
3. Ejecuta

## 4️⃣ Ejecutar Localmente (1 min)
=======
# 🚀 INSTRUCCIONES RÁPIDAS - Panel Admin

## ❌ El error que tuviste

Copiaste las comillas invertidas (` ``` `) que son parte del Markdown. Supabase no entiende eso.

---

## ✅ LA SOLUCIÓN (30 segundos)

### **Paso 1: Abre este archivo**
```
SETUP_SQL_LIMPIO.sql
```

### **Paso 2: Copia TODO el contenido**
- Abre el archivo
- Ctrl+A (seleccionar todo)
- Ctrl+C (copiar)

### **Paso 3: Pega en Supabase**
1. Ve a: https://app.supabase.com → Tu proyecto → SQL Editor
2. Haz click en "New Query"
3. Ctrl+V (pegar todo)
4. Haz click en "Ejecutar" (o Ctrl+Intro)

### **Paso 4: ¡Listo!**
Deberías ver: "8 queries executed successfully"

---

## 🧪 Verificar que funcionó

En Supabase SQL Editor, ejecuta esto:

```
SELECT COUNT(*) FROM pqrs;
SELECT COUNT(*) FROM lotes;
```

Deberías ver:
- pqrs: 4 filas
- lotes: tus lotes + columna "estado"

---

## 🚀 Ahora inicia el panel
>>>>>>> 500be9bb4e99eaf31295daa1897cf7547e2dcfd3

```bash
npm run dev
```

<<<<<<< HEAD
Abre: [http://localhost:3000](http://localhost:3000)

## ✅ ¿Ya está listt?

Si ves "Lotes Disponibles" → **¡Funciona!** 🎉

---

## 🔧 Solución Rápida de Problemas

| Problema | Solución |
|----------|----------|
| "Cannot find module" | `npm install` |
| Lotes no aparecen | Revisa que ejecutaste el SQL |
| Error de Supabase | Verifica las keys en `.env.local` |
| Correos no se envían | Configura `RESEND_API_KEY` |

---

## 📚 Siguientes Pasos

1. Leer `README.md` para visión general
2. Consultar `MANUAL_DE_USUARIO.md` para funcionalidades
3. Ver `GUIA_IMPLEMENTACION.md` para fases completas

---

**Más documentación en carpeta raíz del proyecto** 📁
=======
1. Regístrate en: `http://localhost:3000/register`
2. Ve a: `http://localhost:3000/admin`

✨ ¡Listo!

---

## 🆘 Si sigue errando

**Opción A: Ejecutar ligne por línea**

Si el archivo todo junto no funciona, abre SETUP_SQL_LIMPIO.sql y copia de a 1-2 comandos a la vez.

**Opción B: Verificar sintaxis**

Asegúrate que:
- ✓ No hay ` ``` ` en lo que pegas
- ✓ No hay ` ``` ` en lo que pegas (repito porque es importante)
- ✓ El archivo comienza con `CREATE TABLE IF NOT EXISTS pqrs`

**Opción C: Pedir ayuda**

Si sigue fallando, dame el error exacto y lo arreglamos.

---

**¿Necesitas el archivo paso a paso? → Ver SETUP_ADMIN_PASO_A_PASO.md**
>>>>>>> 500be9bb4e99eaf31295daa1897cf7547e2dcfd3
