import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY en el entorno')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
)

export interface Lote {
  id: string
  numero_lote: string
  area_m2: number
  ubicacion?: string | null
  valor_total: number
  etapa: string
  estado: 'disponible' | 'reservado' | 'vendido'
  descripcion?: string | null
  created_at?: string
  updated_at?: string
}

export interface Venta {
  id?: string
  user_id: string
  lote_id: string
  fecha_compra?: string
  estado?: 'activa' | 'cancelada' | 'completada'
  valor_total?: number
  created_at?: string
}

export interface Pago {
  id?: string
  compra_id: string
  monto_abonado: number
  fecha_pago?: string
  estado_pago?: 'pendiente' | 'completado' | 'rechazado'
  metodo_pago?: string
  comprobante_url?: string
  created_at?: string
}

export interface Cuenta {
  compra_id: string
  total: number
  pagado: number
  saldo: number
}

export async function getLotes(): Promise<{ data: Lote[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase.from('lotes').select('*')
    if (error) return { data: null, error: `Error al cargar los lotes: ${error.message}` }
    return { data: data as Lote[], error: null }
  } catch (err) {
    return { data: null, error: 'No hay conexión con la base de datos.' }
  }
}

export async function createVenta(data: Venta): Promise<{ data: Venta | null; error: string | null }> {
  try {
    const { data: result, error } = await supabase.from('compras').insert([data]).select().single()
    if (error) return { data: null, error: error.message }
    return { data: result as Venta, error: null }
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Error desconocido' }
  }
}

export async function addPago(data: Pago): Promise<{ data: Pago | null; error: string | null }> {
  try {
    const { data: result, error } = await supabase.from('pagos').insert([data]).select().single()
    if (error) return { data: null, error: error.message }
    return { data: result as Pago, error: null }
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Error desconocido' }
  }
}

export async function getCuenta(compra_id: string): Promise<{ data: Cuenta | null; error: string | null }> {
  try {
    const { data: compra, error: compraError } = await supabase
      .from('compras')
      .select('lote_id, lotes(valor_total)')
      .eq('id', compra_id)
      .single()

    if (compraError || !compra) return { data: null, error: 'Compra no encontrada' }

    const total = (compra as any).lotes?.valor_total ?? 0
    const { data: pagos, error: pagosError } = await supabase
      .from('pagos')
      .select('monto_abonado')
      .eq('compra_id', compra_id)

    if (pagosError) return { data: null, error: pagosError.message }

    const pagado = (pagos as any[]).reduce((sum, p) => sum + (p.monto_abonado || 0), 0)
    return { data: { compra_id, total, pagado, saldo: total - pagado }, error: null }
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Error desconocido' }
  }
}
