-- ============================================================
-- TERRASOFT INMOBILIARIA - SUPABASE SCHEMA COMPLETO
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. TABLA: USER_PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'cliente' CHECK (role IN ('cliente', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- 2. TABLA: LOTES
-- ============================================================
CREATE TABLE IF NOT EXISTS lotes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  numero_lote TEXT NOT NULL UNIQUE,
  etapa TEXT NOT NULL CHECK (etapa IN ('Lanzamiento', 'Preventa', 'Construccion', 'Entrega')),
  area_m2 DECIMAL(10,2) NOT NULL CHECK (area_m2 BETWEEN 100 AND 200),
  ubicacion TEXT,
  descripcion TEXT,
  valor_total DECIMAL(15,2) NOT NULL,
  estado TEXT DEFAULT 'disponible' CHECK (estado IN ('disponible', 'reservado', 'vendido')),
  imagen_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lotes_estado ON lotes(estado);
CREATE INDEX IF NOT EXISTS idx_lotes_etapa ON lotes(etapa);

-- ============================================================
-- 3. TABLA: COMPRAS
-- ============================================================
CREATE TABLE IF NOT EXISTS compras (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lote_id UUID NOT NULL REFERENCES lotes(id) ON DELETE RESTRICT,
  fecha_compra TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  estado TEXT DEFAULT 'activa' CHECK (estado IN ('activa', 'cancelada', 'completada')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lote_id)
);

CREATE INDEX IF NOT EXISTS idx_compras_user_id ON compras(user_id);
CREATE INDEX IF NOT EXISTS idx_compras_lote_id ON compras(lote_id);

-- Trigger: al crear compra, actualizar estado del lote a 'reservado'
CREATE OR REPLACE FUNCTION public.handle_compra_created()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE lotes SET estado = 'reservado', updated_at = NOW() WHERE id = NEW.lote_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_compra_created ON compras;
CREATE TRIGGER on_compra_created
  AFTER INSERT ON compras
  FOR EACH ROW EXECUTE PROCEDURE public.handle_compra_created();

-- ============================================================
-- 4. TABLA: PAGOS
-- ============================================================
CREATE TABLE IF NOT EXISTS pagos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  compra_id UUID NOT NULL REFERENCES compras(id) ON DELETE CASCADE,
  monto_abonado DECIMAL(15,2) NOT NULL CHECK (monto_abonado > 0),
  fecha_pago TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  estado_pago TEXT DEFAULT 'completado' CHECK (estado_pago IN ('pendiente', 'completado', 'rechazado')),
  metodo_pago TEXT DEFAULT 'transferencia',
  comprobante_url TEXT,
  referencia TEXT,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pagos_compra_id ON pagos(compra_id);
CREATE INDEX IF NOT EXISTS idx_pagos_estado ON pagos(estado_pago);

-- Vista: Estado de cuenta por compra
CREATE OR REPLACE VIEW vista_estado_cuenta AS
SELECT
  c.id AS compra_id,
  c.user_id,
  c.lote_id,
  l.numero_lote,
  l.valor_total AS total,
  COALESCE(SUM(p.monto_abonado) FILTER (WHERE p.estado_pago = 'completado'), 0) AS pagado,
  l.valor_total - COALESCE(SUM(p.monto_abonado) FILTER (WHERE p.estado_pago = 'completado'), 0) AS saldo,
  COUNT(p.id) AS num_pagos
FROM compras c
JOIN lotes l ON l.id = c.lote_id
LEFT JOIN pagos p ON p.compra_id = c.id
GROUP BY c.id, c.user_id, c.lote_id, l.numero_lote, l.valor_total;

-- ============================================================
-- 5. TABLA: PQRS
-- ============================================================
CREATE TABLE IF NOT EXISTS pqrs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('peticion', 'queja', 'reclamo', 'sugerencia')),
  asunto TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  estado TEXT DEFAULT 'abierto' CHECK (estado IN ('abierto', 'en_proceso', 'cerrado')),
  respuesta TEXT,
  fecha_respuesta TIMESTAMP WITH TIME ZONE,
  numero_radicado TEXT UNIQUE DEFAULT 'PQRS-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM()*99999)::TEXT, 5, '0'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pqrs_user_id ON pqrs(user_id);
CREATE INDEX IF NOT EXISTS idx_pqrs_estado ON pqrs(estado);

-- ============================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE lotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE compras ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pqrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de LOTES
CREATE POLICY "lotes_select_all" ON lotes FOR SELECT USING (true);
CREATE POLICY "lotes_insert_admin" ON lotes FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "lotes_update_admin" ON lotes FOR UPDATE USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "lotes_delete_admin" ON lotes FOR DELETE USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas de COMPRAS
CREATE POLICY "compras_select_own" ON compras FOR SELECT USING (
  user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "compras_insert_auth" ON compras FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "compras_update_admin" ON compras FOR UPDATE USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas de PAGOS
CREATE POLICY "pagos_select_own" ON pagos FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM compras WHERE compras.id = pagos.compra_id AND compras.user_id = auth.uid()
  ) OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "pagos_insert_own" ON pagos FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM compras WHERE compras.id = pagos.compra_id AND compras.user_id = auth.uid())
);

-- Políticas de PQRS
CREATE POLICY "pqrs_select_own" ON pqrs FOR SELECT USING (
  user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "pqrs_insert_auth" ON pqrs FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "pqrs_update_admin" ON pqrs FOR UPDATE USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas de USER_PROFILES
CREATE POLICY "profiles_select_own" ON user_profiles FOR SELECT USING (
  id = auth.uid() OR
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "profiles_update_own" ON user_profiles FOR UPDATE USING (id = auth.uid());

-- ============================================================
-- 7. DATOS DE EJEMPLO
-- ============================================================
INSERT INTO lotes (numero_lote, etapa, area_m2, ubicacion, valor_total, estado, descripcion) VALUES
  ('MV-001', 'Lanzamiento', 120.00, 'Zona A - Sector Norte', 85000000, 'disponible', 'Lote esquinero con excelente orientación solar'),
  ('MV-002', 'Lanzamiento', 150.00, 'Zona A - Sector Norte', 105000000, 'disponible', 'Amplias dimensiones, ideal para familia grande'),
  ('MV-003', 'Preventa',    180.00, 'Zona B - Sector Sur',  130000000, 'disponible', 'Vista panorámica a las montañas'),
  ('MV-004', 'Preventa',    135.00, 'Zona B - Sector Sur',   95000000, 'reservado',  'Cerca al parque central del proyecto'),
  ('MV-005', 'Construccion',100.00, 'Zona C - Sector Este',  72000000, 'disponible', 'Lote compacto, perfecto para inversión'),
  ('MV-006', 'Construccion',160.00, 'Zona C - Sector Este', 115000000, 'vendido',    'Unidad ya entregada'),
  ('MV-007', 'Entrega',     200.00, 'Zona D - Sector Oeste',145000000, 'disponible', 'El lote más grande del proyecto'),
  ('MV-008', 'Entrega',     140.00, 'Zona D - Sector Oeste', 98000000, 'disponible', 'Acceso directo a vía principal')
ON CONFLICT (numero_lote) DO NOTHING;

-- ============================================================
-- ✅ SCHEMA COMPLETO - TERRASOFT INMOBILIARIA
-- ============================================================
