-- ================================================================
-- SCHEMA TERRASOFT MONTEVERDE - SUPABASE
-- Ejecutar esto en SQL Editor de Supabase si las tablas NO existen
-- Si ya existen, corre los comandos individuales de cada tabla
-- ================================================================

-- 1️⃣ TABLA: LOTES
-- Si ya existe, comentar o eliminar este bloque
-- DROP TABLE IF EXISTS lotes CASCADE;

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

-- Índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_lotes_estado ON lotes(estado);
CREATE INDEX IF NOT EXISTS idx_lotes_etapa ON lotes(etapa);

-- ================================================================

-- 2️⃣ TABLA: COMPRAS (Asociación entre usuarios y lotes)
-- Si ya existe, comentar o eliminar este bloque
-- DROP TABLE IF EXISTS compras CASCADE;

CREATE TABLE IF NOT EXISTS compras (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lote_id UUID NOT NULL REFERENCES lotes(id) ON DELETE CASCADE,
  fecha_compra TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lote_id)
);

-- Índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_compras_user_id ON compras(user_id);
CREATE INDEX IF NOT EXISTS idx_compras_lote_id ON compras(lote_id);

-- ================================================================

-- 3️⃣ TABLA: PAGOS (Abonos y cuotas)
-- Si ya existe, comentar o eliminar este bloque
-- DROP TABLE IF EXISTS pagos CASCADE;

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

-- Índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_pagos_compra_id ON pagos(compra_id);
CREATE INDEX IF NOT EXISTS idx_pagos_estado ON pagos(estado_pago);

-- ================================================================

-- 4️⃣ TABLA: PQRS (Peticiones, Quejas, Reclamos, Sugerencias)
-- Si ya existe, comentar o eliminar este bloque
-- DROP TABLE IF EXISTS pqrs CASCADE;

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

-- Índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_pqrs_user_id ON pqrs(user_id);
CREATE INDEX IF NOT EXISTS idx_pqrs_estado ON pqrs(estado);
CREATE INDEX IF NOT EXISTS idx_pqrs_tipo ON pqrs(tipo);

-- ================================================================

-- 5️⃣ TABLA: USER_PROFILES (Información adicional de usuarios)
-- Si ya existe, comentar o eliminar este bloque
-- DROP TABLE IF EXISTS user_profiles CASCADE;

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'cliente' CHECK (role IN ('cliente', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================

-- 6️⃣ ROW LEVEL SECURITY (RLS) - Seguridad a nivel de fila

-- Habilitar RLS en todas las tablas
ALTER TABLE lotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE compras ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pqrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para lotes (todos pueden ver, solo admin puede crear/editar)
CREATE POLICY "Lotes visibles para todos" ON lotes FOR SELECT USING (true);
CREATE POLICY "Solo admin puede editar lotes" ON lotes FOR UPDATE USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas para compras (cada usuario solo ve sus compras)
CREATE POLICY "Usuarios ven sus propias compras" ON compras FOR SELECT USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas para pagos (cada usuario solo ve sus pagos)
CREATE POLICY "Usuarios ven sus propios pagos" ON pagos FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM compras 
    WHERE compras.id = pagos.compra_id 
    AND compras.user_id = auth.uid()
  ) OR
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas para PQRS (cada usuario solo ve sus PQRS)
CREATE POLICY "Usuarios ven sus propios PQRS" ON pqrs FOR SELECT USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas para user_profiles (cada usuario ve su perfil)
CREATE POLICY "Usuarios ven su propio perfil" ON user_profiles FOR SELECT USING (
  id = auth.uid() OR
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ================================================================
-- ✅ SCHEMA COMPLETADO
-- ================================================================
