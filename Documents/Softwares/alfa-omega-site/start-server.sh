#!/bin/bash
# start-server.sh - Script para iniciar servidor local

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   NEXORA SCHOOLS - Servidor Local                         ║"
echo "║   Colégio Alfa e Omega - Panguila, Angola                ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Verificar se está na pasta correta
if [ ! -f "index.html" ]; then
    echo -e "${RED}❌ Erro: index.html não encontrado!${NC}"
    echo "Por favor, execute este script da pasta raiz do projeto:"
    echo "  cd alfa-omega-site"
    echo "  ./start-server.sh"
    exit 1
fi

echo -e "${YELLOW}📦 Iniciando servidor local...${NC}\n"

# Tentar Python 3
if command -v python3 &> /dev/null; then
    echo -e "${GREEN}✅ Python 3 encontrado${NC}"
    echo -e "${BLUE}🚀 Servidor iniciado em: http://localhost:8000${NC}\n"
    echo -e "${YELLOW}Instruções:${NC}"
    echo "  1. Abrir browser: http://localhost:8000"
    echo "  2. Verificar todas as páginas"
    echo "  3. Testar formulário de contacto"
    echo "  4. F12 para verificar console"
    echo "  5. Pressionar Ctrl+C para parar\n"
    
    python3 -m http.server 8000

# Tentar Python 2
elif command -v python &> /dev/null; then
    echo -e "${GREEN}✅ Python encontrado${NC}"
    echo -e "${BLUE}🚀 Servidor iniciado em: http://localhost:8000${NC}\n"
    python -m SimpleHTTPServer 8000

# Tentar Node.js
elif command -v npx &> /dev/null; then
    echo -e "${GREEN}✅ Node.js encontrado${NC}"
    echo -e "${BLUE}🚀 Servidor iniciado em: http://localhost:8000${NC}\n"
    npx http-server -p 8000

# Nenhuma opção disponível
else
    echo -e "${RED}❌ Erro: Nenhum servidor disponível encontrado!${NC}"
    echo ""
    echo -e "${YELLOW}Opções de servidor:${NC}"
    echo "  1. Python 3: pip install http.server (geralmente pré-instalado)"
    echo "  2. Node.js: npm install -g http-server"
    echo "  3. PHP: php -S localhost:8000"
    echo "  4. Usar extensão Live Server do VS Code"
    echo ""
    echo -e "${YELLOW}Instalação rápida:${NC}"
    echo "  macOS: brew install python3"
    echo "  Linux: sudo apt-get install python3"
    echo "  Windows: Descarregar em python.org"
    exit 1
fi
