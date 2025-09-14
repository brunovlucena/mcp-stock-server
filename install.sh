#!/bin/bash

# 📈 MCP Stock Server - Script de Instalação
# Instala e configura o servidor MCP para dados da bolsa

set -e

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}📈 MCP Stock Server - Instalação${NC}"
echo "=================================="
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado!${NC}"
    echo "Por favor, instale o Node.js (versão 18 ou superior) primeiro:"
    echo "https://nodejs.org/"
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js versão 18 ou superior é necessária!${NC}"
    echo "Versão atual: $(node -v)"
    echo "Por favor, atualize o Node.js: https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) encontrado${NC}"

# Instalar dependências
echo -e "${YELLOW}📦 Instalando dependências...${NC}"
npm install

# Compilar o projeto
echo -e "${YELLOW}🔨 Compilando projeto...${NC}"
npm run build

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Criando arquivo .env...${NC}"
    cp env.example .env
    echo -e "${GREEN}✅ Arquivo .env criado!${NC}"
    echo -e "${YELLOW}💡 Edite o arquivo .env com suas configurações (opcional)${NC}"
fi

# Criar diretório de logs se não existir
mkdir -p logs

echo ""
echo -e "${GREEN}🎉 Instalação concluída com sucesso!${NC}"
echo ""
echo -e "${YELLOW}📋 Próximos passos:${NC}"
echo "1. Edite o arquivo .env se necessário"
echo "2. Execute 'make start' para iniciar o servidor"
echo "3. Execute 'make test' para testar o servidor"
echo "4. Execute 'make examples' para ver exemplos de uso"
echo ""
echo -e "${YELLOW}🔧 Comandos úteis:${NC}"
echo "• make help     - Mostra todos os comandos disponíveis"
echo "• make dev      - Inicia em modo desenvolvimento"
echo "• make test     - Executa testes"
echo "• make clean    - Limpa arquivos compilados"
echo ""
echo -e "${GREEN}🚀 Servidor pronto para uso!${NC}"
