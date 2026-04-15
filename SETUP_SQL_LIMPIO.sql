-- ✅ COPIAR Y PEGAR DIRECTAMENTE (SIN COMILLAS)
-- Ejecuta estos comandos UNO A UNO en Supabase SQL Editor

-- ===========================================================
-- PASO 1: CREAR TABLA PQRS
-- ===========================================================

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

-- ===========================================================
-- PASO 2: AGREGAR COLUMNAS A TABLA LOTES
-- ===========================================================

ALTER TABLE lotes ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'Disponible' CHECK (estado IN ('Disponible', 'Reservado', 'Vendido'));

ALTER TABLE lotes ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE lotes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- ===========================================================
-- PASO 3: CREAR ÍNDICES
-- ===========================================================

CREATE INDEX IF NOT EXISTS idx_pqrs_estado ON pqrs(estado);

CREATE INDEX IF NOT EXISTS idx_pqrs_tipo ON pqrs(tipo);

CREATE INDEX IF NOT EXISTS idx_pqrs_created_at ON pqrs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_lotes_estado ON lotes(estado);

-- ===========================================================
-- PASO 4: HABILITAR ROW LEVEL SECURITY
-- ===========================================================

ALTER TABLE pqrs ENABLE ROW LEVEL SECURITY;

ALTER TABLE lotes ENABLE ROW LEVEL SECURITY;

-- ===========================================================
-- PASO 5a: CREAR POLÍTICA PQRS - Lectura
-- ===========================================================

DROP POLICY IF EXISTS "Usuarios autenticados pueden ver PQRS" ON pqrs;

CREATE POLICY "Usuarios autenticados pueden ver PQRS" ON pqrs
  FOR SELECT USING (auth.role() = 'authenticated');

-- ===========================================================
-- PASO 5b: CREAR POLÍTICA PQRS - Actualización
-- ===========================================================

DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar PQRS" ON pqrs;

CREATE POLICY "Usuarios autenticados pueden actualizar PQRS" ON pqrs
  FOR UPDATE USING (auth.role() = 'authenticated');

-- ===========================================================
-- PASO 5c: CREAR POLÍTICA LOTES - Lectura
-- ===========================================================

DROP POLICY IF EXISTS "Cualquiera puede ver lotes" ON lotes;

CREATE POLICY "Cualquiera puede ver lotes" ON lotes
  FOR SELECT USING (true);

-- ===========================================================
-- PASO 6: CREAR TRIGGERS
-- ===========================================================

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

-- ===========================================================
-- PASO 7: INSERTAR DATOS DE PRUEBA
-- ===========================================================

INSERT INTO pqrs (tipo, nombre, email, telefono, asunto, descripcion, estado) 
VALUES 
  ('Petición', 'Juan Pérez', 'juan@example.com', '3001234567', 'Información de lotes', 'Quisiera saber sobre disponibilidad', 'Pendiente'),
  ('Queja', 'María García', 'maria@example.com', '3009876543', 'Atención lenta', 'La respuesta fue muy demorada', 'Resuelto'),
  ('Reclamo', 'Carlos López', 'carlos@example.com', '3005551234', 'Error en cotización', 'El precio mostrado no coincide', 'En Proceso'),
  ('Sugerencia', 'Ana Martínez', 'ana@example.com', '3007778888', 'Mejorar plataforma', 'Agregar más fotos de los lotes', 'Pendiente')
ON CONFLICT DO NOTHING;

-- ===========================================================
-- PASO 8: ACTUALIZAR ESTADO DE LOTES
-- ===========================================================

UPDATE lotes SET estado = 'Disponible' WHERE estado IS NULL;

-- ===========================================================
-- VERIFICAR (Ejecuta esto para confirmar)
-- ===========================================================

SELECT COUNT(*) as "Lotes existentes" FROM lotes;

SELECT COUNT(*) as "PQRS de prueba" FROM pqrs;