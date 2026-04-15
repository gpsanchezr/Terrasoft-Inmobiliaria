'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { signUp } from '@/lib/auth'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

const registerSchema = z
  .object({
    email: z.string().email('Por favor, ingresa un correo válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setMessage(null)

    const response = await signUp(data.email, data.password)

    if (response.success) {
      setMessage({ type: 'success', text: response.message })
      reset()
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      setMessage({ type: 'error', text: response.error || response.message })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-800">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-white">Crear Cuenta</CardTitle>
          <CardDescription className="text-slate-400">
            Regístrate para comenzar a usar nuestra plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {message && (
              <Alert className={message.type === 'success' ? 'border-green-500/50 bg-green-50/10' : 'border-red-500/50 bg-red-50/10'}>
                <div className="flex items-center gap-2">
                  {message.type === 'success' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <AlertDescription
                    className={message.type === 'success' ? 'text-green-400' : 'text-red-400'}
                  >
                    {message.text}
                  </AlertDescription>
                </div>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">
                Correo Electrónico
              </Label>
              <Input
                {...register('email')}
                id="email"
                type="email"
                placeholder="tu@email.com"
                className="border-slate-600 bg-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-xs text-red-400"><span>{errors.email.message}</span></p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">
                Contraseña
              </Label>
              <Input
                {...register('password')}
                id="password"
                type="password"
                placeholder="••••••"
                className="border-slate-600 bg-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-xs text-red-400"><span>{errors.password.message}</span></p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-200">
                Confirmar Contraseña
              </Label>
              <Input
                {...register('confirmPassword')}
                id="confirmPassword"
                type="password"
                placeholder="••••••"
                className="border-slate-600 bg-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-400"><span>{errors.confirmPassword.message}</span></p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                'Crear Cuenta'
              )}
            </Button>

            <p className="text-center text-sm text-slate-400">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="font-semibold text-blue-400 hover:text-blue-300">
                Inicia sesión
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
