-- ===================================
-- SCRIPT SIMPLIFICADO PARA PANEL ADMIN
-- ===================================
-- Ejecuta SOLO estos comandos en Supabase SQL Editor
-- Uno a uno o en bloques pequeños

-- ===================================
-- PASO 1: CREAR TABLA PQRS
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

-- ===================================
-- PASO 2: AGREGAR COLUMNAS A LOTES
-- ===================================

-- Agregar columna 'estado' si no existe
ALTER TABLE lotes ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'Disponible' 
  CHECK (estado IN ('Disponible', 'Reservado', 'Vendido'));

-- Nuevas columnas de lote requeridas por ADSO-17
ALTER TABLE lotes ADD COLUMN IF NOT EXISTS area_m2 DECIMAL;
ALTER TABLE lotes ADD CONSTRAINT IF NOT EXISTS chk_area_m2 CHECK (area_m2 >= 100 AND area_m2 <= 200);
ALTER TABLE lotes ADD COLUMN IF NOT EXISTS valor_total DECIMAL;
ALTER TABLE lotes ADD COLUMN IF NOT EXISTS ubicacion TEXT;

-- Agregar timestamps si no existen
ALTER TABLE lotes ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE lotes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- ===================================
-- PASO 3: CREAR ÍNDICES
-- ===================================

CREATE INDEX IF NOT EXISTS idx_pqrs_estado ON pqrs(estado);
CREATE INDEX IF NOT EXISTS idx_pqrs_tipo ON pqrs(tipo);
CREATE INDEX IF NOT EXISTS idx_pqrs_created_at ON pqrs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lotes_estado ON lotes(estado);

-- ===================================
-- PASO 4: HABILITAR ROW LEVEL SECURITY
-- ===================================

ALTER TABLE pqrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lotes ENABLE ROW LEVEL SECURITY;

-- ===================================
-- PASO 5: CREAR POLÍTICAS RLS
-- ===================================

-- PQRS - Lectura
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver PQRS" ON pqrs;
CREATE POLICY "Usuarios autenticados pueden ver PQRS" ON pqrs
  FOR SELECT USING (auth.role() = 'authenticated');

-- PQRS - Actualización
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar PQRS" ON pqrs;
CREATE POLICY "Usuarios autenticados pueden actualizar PQRS" ON pqrs
  FOR UPDATE USING (auth.role() = 'authenticated');

-- LOTES - Lectura (todos pueden ver)
DROP POLICY IF EXISTS "Cualquiera puede ver lotes" ON lotes;
CREATE POLICY "Cualquiera puede ver lotes" ON lotes
  FOR SELECT USING (true);

-- ===================================
-- PASO 6: CREAR TRIGGERS
-- ===================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para PQRS
DROP TRIGGER IF EXISTS update_pqrs_updated_at ON pqrs;
CREATE TRIGGER update_pqrs_updated_at
  BEFORE UPDATE ON pqrs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para LOTES
DROP TRIGGER IF EXISTS update_lotes_updated_at ON lotes;
CREATE TRIGGER update_lotes_updated_at
  BEFORE UPDATE ON lotes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- PASO 7: INSERTAR PQRS DE PRUEBA
-- ===================================

INSERT INTO pqrs (tipo, nombre, email, telefono, asunto, descripcion, estado) 
VALUES 
  ('Petición', 'Juan Pérez', 'juan@example.com', '3001234567', 'Información de lotes', 'Quisiera saber sobre disponibilidad', 'Pendiente'),
  ('Queja', 'María García', 'maria@example.com', '3009876543', 'Atención lenta', 'La respuesta fue muy demorada', 'Resuelto'),
  ('Reclamo', 'Carlos López', 'carlos@example.com', '3005551234', 'Error en cotización', 'El precio mostrado no coincide', 'En Proceso'),
  ('Sugerencia', 'Ana Martínez', 'ana@example.com', '3007778888', 'Mejorar plataforma', 'Agregar más fotos de los lotes', 'Pendiente')
ON CONFLICT DO NOTHING;

-- ===================================
-- PASO 8: ACTUALIZAR ESTADO DE LOTES EXISTENTES
-- ===================================

-- Marcar algunos lotes como disponibles
UPDATE lotes SET estado = 'Disponible' WHERE estado IS NULL LIMIT 5;

-- Si lo necesitas, puedes marcar manualmente:
-- UPDATE lotes SET estado = 'Reservado' WHERE numero_lote = 'A-01';
-- UPDATE lotes SET estado = 'Vendido' WHERE numero_lote = 'A-02';

-- ===================================
-- VERIFICACIÓN
-- ===================================

-- Ver todas las PQRS
-- SELECT * FROM pqrs;

-- Ver todos los lotes
-- SELECT id, numero_lote, etapa, area_m2, valor_total, estado FROM lotes;

-- Ver estructura de PQRS
-- \d pqrs;

-- Ver estructura de LOTES
-- \d lotes;
