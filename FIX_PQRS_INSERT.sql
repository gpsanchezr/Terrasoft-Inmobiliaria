-- ===================================
-- CORRECCIÓN: HABILITAR INSERT EN PQRS
-- ===================================
-- Ejecuta estos comandos en la consola SQL de Supabase

-- Paso 1: Verificar que RLS esté habilitado en pqrs
ALTER TABLE pqrs ENABLE ROW LEVEL SECURITY;

-- Paso 2: Eliminar políticas antiguas conflictivas (si existen)
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver PQRS" ON pqrs;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar PQRS" ON pqrs;
DROP POLICY IF EXISTS "Cualquiera puede insertar PQRS" ON pqrs;
DROP POLICY IF EXISTS "Permitir insertar PQRS" ON pqrs;

-- Paso 3: Crear nuevas políticas

-- POLÍTICA: Cualquiera puede CREAR (INSERT) una PQRS
CREATE POLICY "Permitir insertar PQRS públicamente" ON pqrs
  FOR INSERT 
  WITH CHECK (true);

-- POLÍTICA: Cualquiera puede VER (SELECT) las PQRS
CREATE POLICY "Permitir ver PQRS públicamente" ON pqrs
  FOR SELECT 
  USING (true);

-- POLÍTICA: Solo usuarios autenticados pueden ACTUALIZAR PQRS
CREATE POLICY "Solo autenticados pueden actualizar PQRS" ON pqrs
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- POLÍTICA: Opcional - Permitir DELETE solo a autenticados (si es necesario)
-- CREATE POLICY "Solo autenticados pueden eliminar PQRS" ON pqrs
--   FOR DELETE 
--   USING (auth.role() = 'authenticated');

-- Paso 4: Verificar las políticas creadas
-- SELECT * FROM pg_policies WHERE tablename = 'pqrs';

-- Si aún tienes problemas, intenta DESHABILITAR RLS temporalmente (no recomendado para producción):
-- ALTER TABLE pqrs DISABLE ROW LEVEL SECURITY;

-- O permite anon role completamente (menos seguro):
-- CREATE POLICY "Anon puede insertar PQRS" ON pqrs
--   FOR INSERT 
--   TO anon 
--   WITH CHECK (true);
