#!/bin/bash

# Script de Verificación - Sistema de Venta de Lotes
# Uso: bash VERIFICAR_SETUP.sh

echo "🔍 Verificando Setup del Proyecto..."
echo "======================================"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de verificaciones
PASSED=0
FAILED=0

# Función para verificar
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ $1${NC}"
        ((FAILED++))
    fi
}

# 1. Verificar Node.js
echo "📦 Verificando Node.js..."
node --version > /dev/null 2>&1
check "Node.js instalado"
echo ""

# 2. Verificar npm
echo "📦 Verificando npm..."
npm --version > /dev/null 2>&1
check "npm instalado"
echo ""

# 3. Verificar dependencias instaladas
echo "📚 Verificando dependencias..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ node_modules existe${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  node_modules no encontrado, ejecuta: npm install${NC}"
    ((FAILED++))
fi
echo ""

# 4. Verificar archivos clave
echo "📄 Verificando archivos clave..."
FILES=(
    ".env.local"
    "app/page.tsx"
    "app/api/lotes/route.ts"
    "DATABASE_SCHEMA.sql"
    "components/etapas-timeline.tsx"
    "lib/payment-utils.ts"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ $file no encontrado${NC}"
        ((FAILED++))
    fi
done
echo ""

# 5. Verificar variables de entorno
echo "🔐 Verificando variables de entorno..."

if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local 2>/dev/null; then
    echo -e "${GREEN}✅ NEXT_PUBLIC_SUPABASE_URL configurado${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ NEXT_PUBLIC_SUPABASE_URL no configurado${NC}"
    ((FAILED++))
fi

if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local 2>/dev/null; then
    echo -e "${GREEN}✅ NEXT_PUBLIC_SUPABASE_ANON_KEY configurado${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ NEXT_PUBLIC_SUPABASE_ANON_KEY no configurado${NC}"
    ((FAILED++))
fi

if grep -q "RESEND_API_KEY" .env.local 2>/dev/null; then
    echo -e "${GREEN}✅ RESEND_API_KEY configurado${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  RESEND_API_KEY no configurado (opcional)${NC}"
fi
echo ""

# 6. Compilar TypeScript
echo "🔨 Compilando TypeScript..."
npm run typecheck > /dev/null 2>&1
check "TypeScript compila sin errores"
echo ""

# 7. Résumen
echo "======================================"
echo "📊 RESULTADO FINAL"
echo "======================================"
echo -e "${GREEN}✅ Pasadas: $PASSED${NC}"
echo -e "${RED}❌ Fallidas: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡Todo está listo! Ejecuta: npm run dev${NC}"
else
    echo -e "${YELLOW}⚠️  Por favor, resuelve los problemas anteriores${NC}"
fi
