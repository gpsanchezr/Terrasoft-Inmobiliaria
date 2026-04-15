# Configuración de Resend para Correos Automáticos

## ¿Qué es Resend?

Resend es una plataforma moderna para enviar correos transaccionales. Es la forma recomendada para Next.js en Vercel.

## Pasos de Configuración

### 1. Crear Cuenta en Resend

1. Ve a [https://resend.com](https://resend.com)
2. Haz clic en **"Get started"**
3. Registrate con GitHub o correo
4. Confirma tu correo

### 2. Obtener API Key

1. En el dashboard de Resend, ve a **"API Keys"**
2. Copia tu clave API
3. Añádela a `.env.local`:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
```

### 3. Configurar Dominio (Producción)

Para Vercel:
1. En Resend, haz clic en **"Domains"** en la barra lateral
2. Añade tu dominio (ej: `proyecto.vercel.app`)
3. Usa `noreply@proyecto.vercel.app` como remitente

Para desarrollo local:
- Usa `onboarding@resend.dev` como remitente de prueba

### 4. Usar en Next.js

El proyecto ya tiene instalado `resend`. Aquí está la implementación:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Enviar correo simple
await resend.emails.send({
  from: 'noreply@proyecto.com',
  to: 'usuario@example.com',
  subject: 'Confirmación de pago',
  html: '<h1>¡Pago confirmado!</h1>'
});
```

## Correos Automáticos en este Proyecto

### 1. Confirmación de Pago
- **Trigger**: Cuando se registra un pago exitoso
- **Archivo**: `/app/api/pagos/crear.ts`
- **Contiene**: Monto, saldo pendiente, comprobante

### 2. Confirmación de PQRS
- **Trigger**: Cuando se envía un PQRS
- **Archivo**: `/app/api/pqrs/route.ts`
- **Contiene**: Número de seguimiento, detalles

### 3. Respuesta de PQRS
- **Trigger**: Cuando admin responde
- **Archivo**: `/app/api/pqrs/responder.ts`
- **Contiene**: Respuesta y solución

## Variables de Entorno Necesarias

```env
# Resend
RESEND_API_KEY=re_xxxxx

# Correos de Admins para notificaciones
ADMIN_EMAILS=admin1@example.com,admin2@example.com

# URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_URL=http://localhost:3000/admin
```

## Testing de Correos

Para probar localmente:

```bash
# Instala Resend CLI
npm install -g resend-cli

# Inicia el servidor de prueba
resend dev
```

Luego usa `test@example.com` para pruebas.

## Límites y Pricing

**Plan Gratuito**:
- 100 correos/día
- Perfecto para desarrollo

**Plan Pro** (recomendado):
- Correos ilimitados
- $20/mes
- Perfecto para producción

[Ver precios en Resend](https://resend.com/pricing)

## Solución de Problemas

### ❌ Error: "Invalid API key"
- Verifica que `RESEND_API_KEY` esté en `.env.local`
- Reinicia el servidor: `npm run dev`

### ❌ Correos no llegan
- Verifica que el dominio esté verificado en Resend
- Revisa la carpeta de spam
- Chequea los logs en dashboard de Resend

### ❌ Rate limiting
- Plan gratuito: máx 100/día
- Upgrade a Pro para ilimitados

## Ejemplo Completo: Enviar Correo con Comprobante

```typescript
// En /app/api/pagos/crear.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'noreply@proyecto-inmobiliario.com',
  to: usuario_email,
  subject: '✅ Pago confirmado - Lote ' + lote_numero,
  html: `
    <h2>¡Pago Registrado Exitosamente!</h2>
    <p><strong>Lote:</strong> ${lote_numero}</p>
    <p><strong>Monto:</strong> $${monto.toLocaleString()}</p>
    <p><strong>Saldo Pendiente:</strong> $${saldo.toLocaleString()}</p>
    <a href="${comprobante_url}">Descargar Comprobante</a>
  `
});
```

---

*Última actualización: Marzo 2025*
