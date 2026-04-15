# 🔧 SOLUCIÓN - Configurar Admin Panel con tu BD existente

## ❌ Problema que tenías

El script SQL intentaba crear la tabla `lotes` con estructura diferente a la que ya tienes. Tu tabla lotes tiene:
```sql
- numero_lote (TEXT)
- ubicacion (TEXT)
- area_m2 (DECIMAL)
- valor_total (DECIMAL)
- etapa (TEXT)
```

Pero el script esperaba:
```sql
- nombre (TEXT)
- ubicacion (TEXT)
- area (FLOAT)
- valor (FLOAT)
```

---

## ✅ SOLUCIÓN RÁPIDA (2 minutos)

⚠️ **IMPORTANTE:** Usa el archivo **SETUP_SQL_LIMPIO.sql** para copiar directamente sin problemas.

### **Opción 1: MÁS FÁCIL - Usar archivo SQL limpio**

1. Abre el archivo: **SETUP_SQL_LIMPIO.sql** en tu proyecto
2. Copia SOLO el código SQL entre los comentarios
3. Pega en Supabase SQL Editor
4. Ejecuta

---

### **Opción 2: Copiar paso a paso (si prefieres)**

**⚠️ ATENCIÓN:** Cuando copies el código, asegúrate de:
- ❌ NO copiar las líneas que dicen ` ``` ` (comillas invertidas)
- ✅ Copiar SOLO desde la primera línea de SQL hasta la última

Sigue estos pasos exactamente en este orden en Supabase SQL Editor:

### **Paso 1: Crear tabla PQRS**

Copia y ejecuta:

```sql
CREATE TABLE IF NOT EXISTS pqrs (
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

✅ **Debería decir: "Query executed successfully"**

---

### **Paso 2: Agregar columnas a tu tabla LOTES**

Copia y ejecuta:

```sql
ALTER TABLE lotes ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'Disponible' 
  CHECK (estado IN ('Disponible', 'Reservado', 'Vendido'));

-- columnas nuevas por ADSO-17
ALTER TABLE lotes ADD COLUMN IF NOT EXISTS area_m2 DECIMAL;
ALTER TABLE lotes ADD CONSTRAINT IF NOT EXISTS chk_area_m2 CHECK (area_m2 >= 100 AND area_m2 <= 200);
ALTER TABLE lotes ADD COLUMN IF NOT EXISTS valor_total DECIMAL;
ALTER TABLE lotes ADD COLUMN IF NOT EXISTS ubicacion TEXT;

ALTER TABLE lotes ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE lotes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
```

✅ **Debería decir: "Query executed successfully"**

---

### **Paso 3: Crear índices (Performance)**

Copia y ejecuta:

```sql
CREATE INDEX IF NOT EXISTS idx_pqrs_estado ON pqrs(estado);
CREATE INDEX IF NOT EXISTS idx_pqrs_tipo ON pqrs(tipo);
CREATE INDEX IF NOT EXISTS idx_pqrs_created_at ON pqrs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lotes_estado ON lotes(estado);
```

✅ **Debería decir: "Query executed successfully"**

---

### **Paso 4: Habilitar Row Level Security**

Copia y ejecuta:

```sql
ALTER TABLE pqrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lotes ENABLE ROW LEVEL SECURITY;
```

✅ **Debería decir: "Query executed successfully"**

---

### **Paso 5: Crear Políticas de Seguridad**

Ejecuta CADA UNA por separado:

```sql
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver PQRS" ON pqrs;
CREATE POLICY "Usuarios autenticados pueden ver PQRS" ON pqrs
  FOR SELECT USING (auth.role() = 'authenticated');
```

```sql
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar PQRS" ON pqrs;
CREATE POLICY "Usuarios autenticados pueden actualizar PQRS" ON pqrs
  FOR UPDATE USING (auth.role() = 'authenticated');
```

```sql
DROP POLICY IF EXISTS "Cualquiera puede ver lotes" ON lotes;
CREATE POLICY "Cualquiera puede ver lotes" ON lotes
  FOR SELECT USING (true);
```

✅ **Debería decir: "Query executed successfully" para cada una**

---

### **Paso 6: Crear Triggers (actualizar fecha)**

Copia y ejecuta:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_pqrs_updated_at ON pqrs;
CREATE TRIGGER update_pqrs_updated_at
  BEFORE UPDATE ON pqrs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lotes_updated_at ON lotes;
CREATE TRIGGER update_lotes_updated_at
  BEFORE UPDATE ON lotes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

✅ **Debería decir: "Query executed successfully"**

---

### **Paso 7: Insertar datos de prueba PQRS**

Copia y ejecuta:

```sql
INSERT INTO pqrs (tipo, nombre, email, telefono, asunto, descripcion, estado) 
VALUES 
  ('Petición', 'Juan Pérez', 'juan@example.com', '3001234567', 'Información de lotes', 'Quisiera saber sobre disponibilidad', 'Pendiente'),
  ('Queja', 'María García', 'maria@example.com', '3009876543', 'Atención lenta', 'La respuesta fue muy demorada', 'Resuelto'),
  ('Reclamo', 'Carlos López', 'carlos@example.com', '3005551234', 'Error en cotización', 'El precio mostrado no coincide', 'En Proceso'),
  ('Sugerencia', 'Ana Martínez', 'ana@example.com', '3007778888', 'Mejorar plataforma', 'Agregar más fotos de los lotes', 'Pendiente')
ON CONFLICT DO NOTHING;
```

✅ **Debería decir: "4 row(s) inserted"**

---

### **Paso 8: Actualizar estado de tus lotes**

Copia y ejecuta (esto marca tus lotes como Disponibles):

```sql
UPDATE lotes SET estado = 'Disponible' WHERE estado IS NULL;
```

✅ **Debería decir: "X row(s) updated"**

---

## ✅ VERIFICAR QUE FUNCIONÓ

Ejecuta estas consultas para verificar:

```sql
SELECT COUNT(*) as "Lotes existentes" FROM lotes;
SELECT COUNT(*) as "PQRS de prueba" FROM pqrs;
```

Deberías ver:
- Lotes existentes: (número de tus lotes)
- PQRS de prueba: 4

---

## 🚀 AHORA USA EL ADMIN

1. **Inicia tu proyecto:**
   ```bash
   npm run dev
   ```

2. **Regístrate:**
   - Ve a `http://localhost:3000/register`
   - Crea una cuenta

3. **Abre el Admin:**
   - Ve a `http://localhost:3000/admin`
   - ¡Debería mostrar tus PQRS y lotes!

---

## 🎯 Si algo sale mal

### Error: "42703: column "tipo" does not exist"
- ✅ Verificaste que ejecutaste el Paso 1 (Crear PQRS)? 
- ✅ Ejecutaste los comandos en orden?
- Intenta hacer REFRESH en Supabase e intenta de nuevo

### Error: "Relation pqrs does not exist"
- La tabla PQRS no fue creada
- Repite el Paso 1 lentamente

### No veo datos en el Admin
- Verifica que ejecutaste el Paso 7 (INSERT datos)
- Ejecuta: `SELECT * FROM pqrs;` en Supabase para confirmar

### El admin se ve pero "No hay PQRS"
- Abre la consola del navegador (F12)
- Mira si hay errores en rojo
- Verifica que el usuario está logueado

---

## 📋 Archivo Helper

Tengo un archivo SQL ya preparado: **SETUP_ADMIN_SIMPLE.sql**

Lo puedes usar como referencia pero **ejecuta los comandos paso a paso** como describo arriba.

---

## 📝 Cambios que hicimos

1. **lib/supabase.ts** - Actualizada interfaz `Lote` para usar tus columnas reales
   - De: `nombre, ubicacion, area, valor`
   - A: `numero_lote, ubicacion, area_m2, valor_total, etapa`

2. **components/admin/lotes-list.tsx** - Columnas de tabla actualizadas

3. **INIT_DATABASE.sql** - Actualizado para no recrear tabla lotes

---

**¿Listo? ¡Comienza a ejecutar los pasos! 🚀**

Avísame cuando llegues a cada paso para confirmar que funcionó. 👍
