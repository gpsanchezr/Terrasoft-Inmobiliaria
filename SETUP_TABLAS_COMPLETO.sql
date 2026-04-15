-- ================================================================
-- SCRIPT PARA CREAR TODAS LAS TABLAS DE MONTEVERDE EN SUPABASE
-- Ejecuta esto en SQL Editor COMPLETAMENTE (aunque algunas tablas ya existan)
-- ================================================================

-- 1. TABLA: LOTES
CREATE TABLE IF NOT EXISTS lotes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  numero_lote TEXT NOT NULL UNIQUE,
  etapa TEXT NOT NULL,
  area_m2 DECIMAL(10,2),
  ubicacion TEXT,
  valor_total DECIMAL(15,2) NOT NULL,
  estado TEXT DEFAULT 'disponible' CHECK (estado IN ('disponible', 'reservado', 'vendido')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lotes_estado ON lotes(estado);
CREATE INDEX IF NOT EXISTS idx_lotes_etapa ON lotes(etapa);

-- Insertar datos de ejemplo si está vacía
INSERT INTO lotes (numero_lote, etapa, area_m2, ubicacion, valor_total, estado) VALUES
  ('L001', 'Lanzamiento', 250.00, 'Zona A', 450000000, 'disponible'),
  ('L002', 'Lanzamiento', 280.00, 'Zona A', 480000000, 'disponible'),
  ('L003', 'Preventa', 300.00, 'Zona B', 550000000, 'disponible'),
  ('L004', 'Construcción', 320.00, 'Zona C', 600000000, 'reservado'),
  ('L005', 'Entrega', 350.00, 'Zona D', 700000000, 'vendido')
ON CONFLICT DO NOTHING;

-- 2. TABLA: COMPRAS
CREATE TABLE IF NOT EXISTS compras (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lote_id UUID NOT NULL REFERENCES lotes(id) ON DELETE CASCADE,
  fecha_compra TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lote_id)
);

CREATE INDEX IF NOT EXISTS idx_compras_user_id ON compras(user_id);
CREATE INDEX IF NOT EXISTS idx_compras_lote_id ON compras(lote_id);

-- 3. TABLA: PAGOS
CREATE TABLE IF NOT EXISTS pagos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  compra_id UUID NOT NULL REFERENCES compras(id) ON DELETE CASCADE,
  monto_abonado DECIMAL(15,2) NOT NULL,
  fecha_pago TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  estado_pago TEXT DEFAULT 'completado' CHECK (estado_pago IN ('pendiente', 'completado', 'rechazado')),
  comprobante_url TEXT,
  metodo_pago TEXT DEFAULT 'transferencia',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pagos_compra_id ON pagos(compra_id);
CREATE INDEX IF NOT EXISTS idx_pagos_estado ON pagos(estado_pago);

-- 4. TABLA: PQRS
CREATE TABLE IF NOT EXISTS pqrs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('peticion', 'queja', 'reclamo', 'sugerencia')),
  asunto TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  estado TEXT DEFAULT 'abierto' CHECK (estado IN ('abierto', 'en_proceso', 'cerrado')),
  respuesta TEXT,
  fecha_respuesta TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pqrs_user_id ON pqrs(user_id);
CREATE INDEX IF NOT EXISTS idx_pqrs_estado ON pqrs(estado);
CREATE INDEX IF NOT EXISTS idx_pqrs_tipo ON pqrs(tipo);

-- 5. TABLA: USER_PROFILES (actualizar si existe)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'cliente' CHECK (role IN ('cliente', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. ROW LEVEL SECURITY (RLS)
ALTER TABLE lotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE compras ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pqrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para lotes (todos pueden ver, solo admin puede crear/editar)
CREATE POLICY IF NOT EXISTS "Lotes visibles para todos" ON lotes FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Solo admin puede editar lotes" ON lotes FOR UPDATE USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas para compras (cada usuario solo ve sus compras)
CREATE POLICY IF NOT EXISTS "Usuarios ven sus propias compras" ON compras FOR SELECT USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas para pagos (cada usuario solo ve sus pagos)
CREATE POLICY IF NOT EXISTS "Usuarios ven sus propios pagos" ON pagos FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM compras 
    WHERE compras.id = pagos.compra_id 
    AND compras.user_id = auth.uid()
  ) OR
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas para PQRS (cada usuario solo ve sus PQRS)
CREATE POLICY IF NOT EXISTS "Usuarios ven sus propios PQRS" ON pqrs FOR SELECT USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY IF NOT EXISTS "Usuarios pueden crear PQRS" ON pqrs FOR INSERT WITH CHECK (
  user_id = auth.uid()
);

-- Políticas para user_profiles (cada usuario ve su perfil)
CREATE POLICY IF NOT EXISTS "Usuarios ven su propio perfil" ON user_profiles FOR SELECT USING (
  id = auth.uid() OR
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ================================================================
-- ✅ TODAS LAS TABLAS CREADAS CORRECTAMENTE
-- ================================================================
