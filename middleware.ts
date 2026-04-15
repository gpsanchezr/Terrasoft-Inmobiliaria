import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// pequeña utilidad para decodificar el payload de un JWT
function decodeJwt(token: string) {
  try {
    const base64 = token.split('.')[1];
    const json = globalThis.atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Proteger rutas de admin
  if (pathname.startsWith('/admin')) {
    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];

    // obtener token de cookie generado por Supabase
    const token = request.cookies.get('sb-access-token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const decoded: any = decodeJwt(token);
    if (!decoded || !decoded.sub) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // si el correo está en la lista de administradores permitidos, dejar pasar
    if (adminEmails.includes(decoded.email)) {
      return NextResponse.next();
    }

    // si disponemos de la clave de servicio podemos consultar el perfil y verificar el role
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data: profile, error } = await supabaseAdmin
        .from('user_profiles')
        .select('role')
        .eq('id', decoded.sub)
        .single();

      if (!error && profile?.role === 'admin') {
        return NextResponse.next();
      }
    }

    // no autorizado -> redirigir a página principal
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
