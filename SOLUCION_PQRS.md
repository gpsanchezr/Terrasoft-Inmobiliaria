# Solución: PQRS no se envía

## Problemas identificados y solucionados:

### 1. ✅ **Campo Teléfono faltante en el formulario** (CORREGIDO)
El formulario tenía un error: le faltaba el campo **teléfono**, que es obligatorio. Sin este campo, la validación fallaba silenciosamente.

**Cambios realizados en [app/page.tsx](app/page.tsx):**
- ✅ Agregado input de teléfono
- ✅ Agregada validación visual con mensajes de error
- ✅ Mejorado indicador de carga con spinner

### 2. ⚠️ **Políticas RLS de Supabase incorrectas** (REQUIERE ACCIÓN MANUAL)
El problema raíz es que la tabla `pqrs` tiene Row Level Security (RLS) habilitado, pero **falta la política de INSERT**.

**Lo que está pasando:**
- ❌ Las políticas RLS actuales solo permiten SELECT y UPDATE para usuarios autenticados
- ❌ No hay política de INSERT para permitir que los usuarios anónimos creen nuevas PQRS
- ❌ Supabase rechaza el INSERT con permiso denegado

## ✅ Pasos para solucionar:

### Opción 1: Aplicar el script SQL (RECOMENDADO)

1. Ve a Supabase Dashboard → Tu proyecto
2. Ve a **SQL Editor**
3. Crea una nueva query
4. Copia todo el contenido de [FIX_PQRS_INSERT.sql](FIX_PQRS_INSERT.sql)
5. Ejecuta la query
6. Verifica que no haya errores

### Opción 2: Hacerlo manualmente (paso a paso)

1. Ve a **Authentication** → **Policies** en Supabase
2. Selecciona la tabla `pqrs`
3. **Elimina** las políticas existentes que causen conflicto
4. **Crea 3 nuevas políticas:**

#### a) **INSERT - Permitir insertar públicamente**
```
- Type: INSERT
- Check expression: true (o dejar vacío)
```

#### b) **SELECT - Permitir ver públicamente**
```
- Type: SELECT
- Using expression: true (o dejar vacío)
```

#### c) **UPDATE - Solo autenticados**
```
- Type: UPDATE
- Using expression: auth.role() = 'authenticated'
```

5. Haz clic en **Save**

## 🧪 Verifica que funcione:

1. Abre la aplicación en http://localhost:3000
2. Ve a la sección "Formulario PQRS"
3. Completa todos los campos:
   - ✅ Tipo de Solicitud
   - ✅ Nombre
   - ✅ Email
   - ✅ **Teléfono** (ahora tiene input)
   - ✅ Asunto
   - ✅ Descripción
4. Haz clic en "Enviar PQRS"
5. Debería aparecer un mensaje de éxito verde

## 📊 Verifica en Supabase:

1. Ve al dashboard de Supabase
2. Selecciona tabla `pqrs`
3. Deberías ver tu nuevo registro

## Si aún tiene problemas:

### Opción de último recurso - Deshabilitar RLS (menos seguro)

```sql
ALTER TABLE pqrs DISABLE ROW LEVEL SECURITY;
```

**⚠️ Nota:** Esto hace la tabla accesible sin restricciones. Solo úsalo temporalmente para debug.

## Cambios realizados en el código:

**Antes:**
```tsx
<Input {...registerPQRS('nombre')} placeholder="Tu nombre" />
<Input {...registerPQRS('email')} placeholder="tu@email.com" />
<Input {...registerPQRS('asunto')} placeholder="Asunto" />
<textarea {...registerPQRS('descripcion')} ... />
```

**Después:**
```tsx
<Input {...registerPQRS('nombre')} placeholder="Tu nombre" />
<Input {...registerPQRS('email')} type="email" placeholder="tu@email.com" />
<Input {...registerPQRS('telefono')} placeholder="Teléfono" /> {/* ← AGREGADO */}
<Input {...registerPQRS('asunto')} placeholder="Asunto" />
<textarea {...registerPQRS('descripcion')} ... />

{/* Más: Validación visual y spinner mejorado */}
```

## Resumen de la solución:

| Problema | Solución |
|----------|----------|
| Campo teléfono faltante | ✅ Agregado input en el formulario |
| Validación sin feedback | ✅ Agregados mensajes de error bajo cada campo |
| Indicador de carga genérico | ✅ Agregado spinner animado |
| Política RLS de INSERT | ⚠️ Requiere script SQL en Supabase |

**Próximos pasos:**
1. Ejecuta el script SQL en Supabase
2. Prueba el formulario nuevamente
3. ¡Listo! El PQRS debería enviarse correctamente
