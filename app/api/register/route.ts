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

    try {
      // Paso 1: Crear usuario en Supabase Auth
      console.log('Paso 1: Creando usuario auth...', email);
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        console.error('FALLO PASO 1 Auth:', authError);
        return NextResponse.json({ error: `Error Auth: ${authError.message}` }, { status: 400 });
      }

      if (!authData.user) {
        console.error('FALLO PASO 1: No user creado');
        return NextResponse.json({ error: 'No se pudo crear usuario auth' }, { status: 400 });
      }

      console.log('ÉXITO PASO 1 Auth:', authData.user.id);

      // Paso 2: Crear perfil user_profiles
      console.log('Paso 2: Creando perfil...', authData.user.id);
      const { error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          email: email.trim().toLowerCase(),
          full_name: username.trim(),
          role: 'cliente',
        });

      if (profileError) {
        console.error('FALLO PASO 2 Profile:', profileError);
        return NextResponse.json({ error: `Error Profile: ${profileError.message}` }, { status: 500 });
      }

      console.log('ÉXITO PASO 2 Profile');

      return NextResponse.json({
        message: 'Usuario registrado exitosamente',
        user: {
          id: authData.user.id,
          email: authData.user.email,
          full_name: username.trim(),
        },
      });
    } catch (error) {
      console.error('Error global:', error);
      return NextResponse.json({ error: 'Error interno servidor' }, { status: 500 });
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