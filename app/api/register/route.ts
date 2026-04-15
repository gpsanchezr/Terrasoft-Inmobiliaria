import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password, username } = await request.json();

    // Validar datos requeridos
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: 'Email, contraseña y nombre de usuario son requeridos' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Validar nombre de usuario
    if (username.trim().length < 2) {
      return NextResponse.json(
        { error: 'El nombre de usuario debe tener al menos 2 caracteres' },
        { status: 400 }
      );
    }

    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
    });

    if (authError) {
      console.error('Error en Supabase Auth:', authError);
      return NextResponse.json(
        { error: `Error al crear usuario: ${authError.message}` },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'No se pudo crear el usuario' },
        { status: 400 }
      );
    }

    // Crear perfil de usuario usando cliente de servicio (evita RLS)
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        email: email.trim().toLowerCase(),
        full_name: username.trim(),
        role: 'cliente',
      });

    if (profileError) {
      console.error('Error al crear perfil:', profileError);
      // Si falla el perfil, intentar eliminar el usuario de auth con cliente admin
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      } catch (cleanupError) {
        console.error('No se pudo eliminar usuario tras fallo de perfil:', cleanupError);
      }
      return NextResponse.json(
        { error: `Error al crear perfil: ${profileError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        full_name: username.trim(),
      },
    });

  } catch (error) {
    console.error('Error inesperado en registro:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}