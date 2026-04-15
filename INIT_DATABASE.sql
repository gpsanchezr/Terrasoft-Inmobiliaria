-- ===================================
-- ESQUEMAS SQL PARA PANEL ADMINISTRATIVO
-- ===================================
-- Ejecuta estos comandos en la consola SQL de Supabase

-- ===================================
-- 1. CREAR TABLA PQRS (si no existe)
-- ===================================

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

-- Si la tabla ya existe, agregar columnas que falten:
ALTER TABLE pqrs ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'En Proceso', 'Resuelto'));
ALTER TABLE pqrs ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE pqrs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- ===================================
-- 2. ACTUALIZAR TABLA LOTES (con tu estructura existente)
-- ===================================

-- Agregar columnas faltantes en lotes (si es necesario):
ALTER TABLE lotes ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'Disponible' CHECK (estado IN ('Disponible', 'Reservado', 'Vendido'));
ALTER TABLE lotes ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE lotes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- ===================================
-- 3. CREAR ÍNDICES (Mejora de Performance)
-- ===================================

CREATE INDEX IF NOT EXISTS idx_pqrs_estado ON pqrs(estado);
CREATE INDEX IF NOT EXISTS idx_pqrs_tipo ON pqrs(tipo);
CREATE INDEX IF NOT EXISTS idx_pqrs_created_at ON pqrs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_lotes_estado ON lotes(estado);
CREATE INDEX IF NOT EXISTS idx_lotes_nombre ON lotes(nombre);

-- ===================================
-- 4. CONFIGURAR ROW LEVEL SECURITY (RLS)
-- ===================================

-- Habilitar RLS en ambas tablas
ALTER TABLE pqrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lotes ENABLE ROW LEVEL SECURITY;

-- POLÍTICA PARA PQRS (Lectura)
-- Cualquier usuario autenticado puede ver las PQRS
CREATE POLICY "Usuarios autenticados pueden ver PQRS" ON pqrs
  FOR SELECT USING (auth.role() = 'authenticated');

-- POLÍTICA PARA PQRS (Actualización)
-- Solo administradores pueden actualizar. Si no tienes roles, todos los autenticados pueden editar
-- Para un control más estricto, implementa una tabla admin_users
CREATE POLICY "Usuarios autenticados pueden actualizar PQRS" ON pqrs
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Si necesitas restringir solo a admins, primero crea una tabla:
-- CREATE TABLE admin_users (
--   id UUID PRIMARY KEY REFERENCES auth.users(id),
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );
-- 
-- Luego reemplaza la política con:
-- CREATE POLICY "Solo admins pueden actualizar PQRS" ON pqrs
--   FOR UPDATE USING (
--     EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
--   );

-- POLÍTICA PARA LOTES (Lectura)
-- Cualquier usuario puede ver los lotes
CREATE POLICY "Cualquiera puede ver lotes" ON lotes
  FOR SELECT USING (true);

-- POLÍTICA PARA LOTES (Actualización)
-- Solo administradores pueden actualizar
-- CREATE POLICY "Solo admins pueden actualizar lotes" ON lotes
--   FOR UPDATE USING (
--     EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
--   );

-- ===================================
-- 5. DATOS DE PRUEBA (OPCIONAL)
-- ===================================

-- Actualizar estado de lotes existentes (si tienes datos):
UPDATE lotes SET estado = 'Disponible' WHERE estado IS NULL LIMIT 2;
UPDATE lotes SET estado = 'Reservado' WHERE id != (SELECT MIN(id) FROM lotes WHERE estado = 'Disponible') LIMIT 1;
UPDATE lotes SET estado = 'Vendido' WHERE id NOT IN (SELECT id FROM lotes WHERE estado IN ('Disponible', 'Reservado')) LIMIT 1;

-- Insertar PQRS de prueba:
INSERT INTO pqrs (tipo, nombre, email, telefono, asunto, descripcion, estado) VALUES
  ('Petición', 'Juan Pérez', 'juan@example.com', '3001234567', 'Información de lotes', 'Quisiera saber sobre disponibilidad', 'Pendiente'),
  ('Queja', 'María García', 'maria@example.com', '3009876543', 'Atención lenta', 'La respuesta fue muy demorada', 'Resuelto'),
  ('Reclamo', 'Carlos López', 'carlos@example.com', '3005551234', 'Error en cotización', 'El precio mostrado no coincide', 'En Proceso'),
  ('Sugerencia', 'Ana Martínez', 'ana@example.com', '3007778888', 'Mejorar plataforma', 'Agregar más fotos de los lotes', 'Pendiente')
ON CONFLICT DO NOTHING;

-- ===================================
-- 6. TRIGGERS PARA ACTUALIZAR TIMESTAMP
-- ===================================

-- Crear función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a pqrs
DROP TRIGGER IF EXISTS update_pqrs_updated_at ON pqrs;
CREATE TRIGGER update_pqrs_updated_at
  BEFORE UPDATE ON pqrs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Aplicar trigger a lotes
DROP TRIGGER IF EXISTS update_lotes_updated_at ON lotes;
CREATE TRIGGER update_lotes_updated_at
  BEFORE UPDATE ON lotes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- 7. VERIFICAR TABLAS Y DATOS
-- ===================================

-- Ver estructura de PQRS
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'pqrs';

-- Ver estructura de LOTES
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'lotes';

-- Ver todas las PQRS
-- SELECT * FROM pqrs; 

-- Ver todos los lotes
-- SELECT * FROM lotes;
