#!/bin/bash

# SCRIPT DE VERIFICACIÓN RÁPIDA - MONTEVERDE
# Permite verificar que todo funciona correctamente antes de deploy

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  VERIFICACIÓN RÁPIDA - TERRASOFT MONTEVERDE               ║"
echo "║  Script para validar implementación local                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function para verificar archivos
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 existe"
        return 0
    else
        echo -e "${RED}✗${NC} $1 NO ENCONTRADO"
        return 1
    fi
}

# Function para verificar contenido en archivo
check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $3"
        return 0
    else
        echo -e "${RED}✗${NC} $3 - NO ENCONTRADO"
        return 1
    fi
}

echo ""
echo "📁 VERIFICANDO ARCHIVOS CLAVE..."
echo "─────────────────────────────────"

# Verificar archivos principales
check_file "lib/supabase.ts"
check_file "lib/payments.ts"
check_file "app/page.tsx"
check_file "middleware.ts"
check_file "DATABASE_SCHEMA.sql"
check_file ".env.example"

echo ""
echo "🔍 VERIFICANDO CONTENIDO..."
echo "─────────────────────────────"

# Verificar contenido de archivos
check_content "lib/supabase.ts" "getLotes" "getLotes definida en supabase.ts"
check_content "lib/payments.ts" "calcularSaldoPendiente" "calcularSaldoPendiente definida"
check_content "app/page.tsx" "notranslate" "notranslate en home page"
check_content "components/header.tsx" "MonteVerde" "Logo MonteVerde en header"
check_content "components/etapas-timeline.tsx" "Etapas de MonteVerde" "Etapas mejoradas"
check_content "components/formulario-pqrs.tsx" "user_id" "PQRS captura user_id"
check_content "middleware.ts" "ADMIN_EMAILS" "Middleware protege admin"

echo ""
echo "📦 VERIFICANDO DEPENDENCIAS..."
echo "─────────────────────────────"

# Verificar package.json
if grep -q "supabase" package.json; then
    echo -e "${GREEN}✓${NC} Supabase instalado"
else
    echo -e "${RED}✗${NC} Supabase NO instalado"
fi

if grep -q "next" package.json; then
    echo -e "${GREEN}✓${NC} Next.js instalado"
else
    echo -e "${RED}✗${NC} Next.js NO instalado"
fi

if grep -q "tailwind" package.json; then
    echo -e "${GREEN}✓${NC} Tailwind instalado"
else
    echo -e "${RED}✗${NC} Tailwind NO instalado"
fi

if grep -q "lucide-react" package.json; then
    echo -e "${GREEN}✓${NC} Lucide Icons instalado"
else
    echo -e "${RED}✗${NC} Lucide Icons NO instalado"
fi

echo ""
echo "🔧 VERIFICANDO VARIABLES DE ENTORNO..."
echo "────────────────────────────────────"

if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓${NC} .env.local existe"
    
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
        echo -e "${GREEN}✓${NC} NEXT_PUBLIC_SUPABASE_URL configurado"
    else
        echo -e "${YELLOW}⚠${NC}  NEXT_PUBLIC_SUPABASE_URL falta"
    fi
    
    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
        echo -e "${GREEN}✓${NC} NEXT_PUBLIC_SUPABASE_ANON_KEY configurado"
    else
        echo -e "${YELLOW}⚠${NC}  NEXT_PUBLIC_SUPABASE_ANON_KEY falta"
    fi
else
    echo -e "${YELLOW}⚠${NC}  .env.local NO encontrado (copiar de .env.example)"
fi

echo ""
echo "✅ VERIFICACIÓN COMPLETADA"
echo "─────────────────────────────"
echo ""
echo "Próximos pasos:"
echo "1. npm install (si no lo has hecho)"
echo "2. Configurar .env.local con credenciales Supabase"
echo "3. npm run dev"
echo "4. Abrir http://localhost:3000"
echo "5. Verificar que todo funciona:"
echo "   - Home page carga sin errores"
echo "   - Botones navegan correctamente"
echo "   - Login funciona"
echo "   - Sidebar aparece para usuarios logueados"
echo ""
echo "¿Preguntas? Revisar RESUMEN_QUICK_CHECK.md o VERIFICACION_FINAL.md"
echo ""
