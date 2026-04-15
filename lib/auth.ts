import { supabase } from './supabase'

export interface AuthResponse {
  success: boolean
  message: string
  error?: string
}

export async function signUp(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      return {
        success: false,
        message: 'Error en el registro',
        error: error.message,
      }
    }

    return {
      success: true,
      message: 'Registro exitoso. Por favor, verifica tu correo electrónico.',
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error inesperado durante el registro',
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return {
        success: false,
        message: 'Error en el inicio de sesión',
        error: error.message,
      }
    }

    return {
      success: true,
      message: 'Inicio de sesión exitoso',
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error inesperado durante el inicio de sesión',
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}

export async function signOut(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return {
        success: false,
        message: 'Error al cerrar sesión',
        error: error.message,
      }
    }

    return {
      success: true,
      message: 'Sesión cerrada exitosamente',
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error inesperado al cerrar sesión',
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}
