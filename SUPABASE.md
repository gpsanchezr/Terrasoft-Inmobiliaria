# Conectar este proyecto a Supabase

1) Crear un proyecto en https://app.supabase.com y obtener:
   - Project URL (p.ej. https://your-project-ref.supabase.co)
   - Anon/public API Key (Anon key)

2) Crear un archivo `.env.local` en la raíz del proyecto y copiar los valores desde `.env.local.example`:

   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci... (anon key)

3) Reiniciar el servidor de desarrollo si está en ejecución:

   npm install
   npm run dev

4) Uso básico desde componentes o rutas (ejemplo):

   import { supabase } from '@/lib/supabase'

   // Leer filas
   const { data, error } = await supabase.from('todos').select('*')

   // Insertar
   const { data: d2, error: e2 } = await supabase.from('todos').insert({ title: 'Comprar' })

Notas:
- Las variables con `NEXT_PUBLIC_` son accesibles desde el cliente. No pongas claves privadas allí.
- Para operaciones seguras en servidor (server-side), usa la clave `SERVICE_ROLE` y métodos de server. No exponer en el navegador.

## Estructura de Tablas

### Tabla: `lotes`
Contiene toda la información sobre los lotes de terreno disponibles.

Columnas:
- id (int, primary key)
- nombre (text)
- ubicacion (text)
- area (numeric) - área en metros cuadrados
- valor (numeric) - precio del lote
- estado (text) - Valores: 'Disponible', 'Reservado', 'Vendido'
- caracteristicas (text[], opcional) - características del lote
- created_at (timestamp, default: now())

### Tabla: `pqrs`
Para gestionar Peticiones, Quejas, Reclamos y Sugerencias de los usuarios.

Columnas:
- id (int, primary key)
- tipo (text) - Valores: 'Petición', 'Queja', 'Reclamo', 'Sugerencia'
- nombre (text) - nombre del usuario
- email (text) - correo electrónico
- telefono (text) - teléfono de contacto
- asunto (text) - asunto del mensaje
- descripcion (text) - descripción detallada
- created_at (timestamp, default: now())

## Scripts SQL para crear las tablas

### Crear tabla de lotes
```sql
CREATE TABLE lotes (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  ubicacion TEXT NOT NULL,
  area NUMERIC NOT NULL,
  valor NUMERIC NOT NULL,
  estado TEXT NOT NULL DEFAULT 'Disponible',
  caracteristicas TEXT[],
  created_at TIMESTAMP DEFAULT now()
);
```

### Crear tabla de PQRS
```sql
CREATE TABLE pqrs (
  id SERIAL PRIMARY KEY,
  tipo TEXT NOT NULL,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  asunto TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
```
