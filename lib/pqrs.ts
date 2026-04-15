import { supabase } from './supabase'

export interface PQRS {
  id?: number
  tipo: 'Petición' | 'Queja' | 'Reclamo' | 'Sugerencia'
  nombre: string
  email: string
  telefono: string
  asunto: string
  descripcion: string
  estado?: 'Pendiente' | 'En Proceso' | 'Resuelto'
  created_at?: string
}

export interface PQRSResponse {
  success: boolean
  message: string
  error?: string
}

export async function submitPQRS(data: PQRS): Promise<PQRSResponse> {
  try {
    // Validación basica
    if (!data.tipo || !data.nombre || !data.email || !data.telefono || !data.asunto || !data.descripcion) {
      return {
        success: false,
        message: 'Validación fallida',
        error: 'Todos los campos son obligatorios',
      }
    }

    const { error } = await supabase.from('pqrs').insert([
      {
        tipo: data.tipo,
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
        asunto: data.asunto,
        descripcion: data.descripcion,
      },
    ])

    if (error) {
      return {
        success: false,
        message: 'Error al enviar PQRS',
        error: error.message,
      }
    }

    return {
      success: true,
      message: 'PQRS enviado correctamente. Nos pondremos en contacto pronto.',
    }
  } catch (err) {
    return {
      success: false,
      message: 'Error inesperado',
      error: err instanceof Error ? err.message : 'Error desconocido',
    }
  }
}
export async function getAllPQRS(): Promise<{ data: PQRS[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('pqrs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return {
        data: null,
        error: `Error al cargar PQRS: ${error.message}`,
      }
    }

    return {
      data: data as PQRS[],
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: 'No hay conexión con la base de datos.',
    }
  }
}

export async function updatePQRSStatus(
  id: number,
  estado: 'Pendiente' | 'En Proceso' | 'Resuelto'
): Promise<PQRSResponse> {
  try {
    const { error } = await supabase.from('pqrs').update({ estado }).eq('id', id)

    if (error) {
      return {
        success: false,
        message: 'Error al actualizar estado',
        error: error.message,
      }
    }

    return {
      success: true,
      message: 'Estado actualizado correctamente',
    }
  } catch (err) {
    return {
      success: false,
      message: 'Error inesperado',
      error: err instanceof Error ? err.message : 'Error desconocido',
    }
  }
}