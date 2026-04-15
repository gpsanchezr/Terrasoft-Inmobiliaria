-- 1) Ajustar la tabla compras para que use UUID en el usuario
-- Primero eliminamos la tabla si se creó mal para recrearla con el tipo correcto
DROP TABLE IF EXISTS pagos CASCADE;
DROP TABLE IF EXISTS compras CASCADE;

CREATE TABLE compras (
  id BIGSERIAL PRIMARY KEY,
  -- Usamos UUID para coincidir con las PK típicas de Supabase (clientes.id y lotes.id son UUID)
  usuario_id uuid NOT NULL,
  lote_id uuid NOT NULL,
  fecha_compra timestamptz NOT NULL DEFAULT now(),
  estado text NOT NULL DEFAULT 'Reservado' CHECK (estado IN ('Reservado','Comprado','Cancelado')),
  valor_total numeric(12,2) NOT NULL,
  saldo_pendiente numeric(12,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2) Añadir FK de usuario (ahora sí son compatibles: UUID con UUID)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'clientes') THEN
    ALTER TABLE compras
      ADD CONSTRAINT fk_compra_cliente FOREIGN KEY (usuario_id) REFERENCES clientes(id) ON DELETE CASCADE;
  END IF;
END$$;

-- 3) Vincular con la tabla lotes
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'lotes') THEN
    ALTER TABLE compras
      ADD CONSTRAINT fk_compra_lote FOREIGN KEY (lote_id) REFERENCES lotes(id) ON DELETE RESTRICT;
  END IF;
END$$;

-- 4) Recrear la tabla pagos
CREATE TABLE pagos (
  id BIGSERIAL PRIMARY KEY,
  compra_id BIGINT NOT NULL REFERENCES compras(id) ON DELETE CASCADE,
  monto numeric(12,2) NOT NULL,
  fecha_pago timestamptz NOT NULL DEFAULT now(),
  metodo text NOT NULL DEFAULT 'Tarjeta' CHECK (metodo IN ('Tarjeta','Transferencia','Efectivo','Otro')),
  comprobante_url text,
  created_at timestamptz DEFAULT now()
);

-- 5) Re-instalar la función de saldo automático (Trigger)
CREATE OR REPLACE FUNCTION recalc_saldo_compra() RETURNS trigger AS $$
BEGIN
  UPDATE compras
  SET saldo_pendiente = valor_total - COALESCE((SELECT SUM(monto) FROM pagos WHERE compra_id = COALESCE(NEW.compra_id, OLD.compra_id)), 0),
      updated_at = now()
  WHERE id = COALESCE(NEW.compra_id, OLD.compra_id);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_recalc_saldo ON pagos;
CREATE TRIGGER trg_recalc_saldo
AFTER INSERT OR UPDATE OR DELETE ON pagos
FOR EACH ROW EXECUTE FUNCTION recalc_saldo_compra();
