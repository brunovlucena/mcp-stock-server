#!/bin/bash

# 📈 MCP Stock Server - Script de Build Docker
# Facilita o build e deploy do servidor usando Docker

set -e

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
IMAGE_NAME="mcp-stock-server"
TAG="latest"
DEV_TAG="dev"

echo -e "${GREEN}📈 MCP Stock Server - Docker Build${NC}"
echo "====================================="
echo ""

# Função para mostrar ajuda
show_help() {
    echo -e "${YELLOW}Uso: $0 [COMANDO] [OPÇÕES]${NC}"
    echo ""
    echo -e "${YELLOW}Comandos:${NC}"
    echo "  build       - Build da imagem de produção"
    echo "  build-dev   - Build da imagem de desenvolvimento"
    echo "  run         - Executa o container"
    echo "  run-dev     - Executa o container em modo desenvolvimento"
    echo "  stop        - Para o container"
    echo "  logs        - Mostra logs do container"
    echo "  clean       - Remove imagens e containers"
    echo "  push        - Faz push da imagem para registry"
    echo "  help        - Mostra esta ajuda"
    echo ""
    echo -e "${YELLOW}Opções:${NC}"
    echo "  --tag TAG   - Define a tag da imagem (padrão: latest)"
    echo "  --no-cache  - Build sem cache"
    echo "  --registry  - Registry para push (padrão: local)"
    echo ""
    echo -e "${YELLOW}Exemplos:${NC}"
    echo "  $0 build"
    echo "  $0 build --tag v1.0.0"
    echo "  $0 run"
    echo "  $0 run-dev"
    echo "  $0 push --registry myregistry.com"
}

# Função para build da imagem de produção
build_production() {
    echo -e "${BLUE}🔨 Building imagem de produção...${NC}"
    
    local build_args=""
    if [ "$NO_CACHE" = "true" ]; then
        build_args="--no-cache"
    fi
    
    docker build $build_args \
        -t "${IMAGE_NAME}:${TAG}" \
        -t "${IMAGE_NAME}:latest" \
        -f Dockerfile \
        .
    
    echo -e "${GREEN}✅ Imagem de produção criada: ${IMAGE_NAME}:${TAG}${NC}"
}

# Função para build da imagem de desenvolvimento
build_development() {
    echo -e "${BLUE}🔨 Building imagem de desenvolvimento...${NC}"
    
    local build_args=""
    if [ "$NO_CACHE" = "true" ]; then
        build_args="--no-cache"
    fi
    
    docker build $build_args \
        -t "${IMAGE_NAME}:${DEV_TAG}" \
        -f Dockerfile.dev \
        .
    
    echo -e "${GREEN}✅ Imagem de desenvolvimento criada: ${IMAGE_NAME}:${DEV_TAG}${NC}"
}

# Função para executar o container
run_container() {
    echo -e "${BLUE}🚀 Executando container...${NC}"
    
    # Parar container existente se estiver rodando
    docker stop mcp-stock-server 2>/dev/null || true
    docker rm mcp-stock-server 2>/dev/null || true
    
    # Executar novo container
    docker run -d \
        --name mcp-stock-server \
        --restart unless-stopped \
        -p 3000:3000 \
        -e NODE_ENV=production \
        -e MCP_SERVER_NAME=stock-server \
        -e MCP_SERVER_VERSION=1.0.0 \
        -e PORT=3000 \
        -e LOG_LEVEL=info \
        -v "$(pwd)/logs:/app/logs" \
        -v "$(pwd)/data:/app/data" \
        "${IMAGE_NAME}:${TAG}"
    
    echo -e "${GREEN}✅ Container executando: mcp-stock-server${NC}"
    echo -e "${YELLOW}💡 Use 'docker logs mcp-stock-server' para ver logs${NC}"
}

# Função para executar em modo desenvolvimento
run_development() {
    echo -e "${BLUE}🔧 Executando em modo desenvolvimento...${NC}"
    
    # Parar container existente se estiver rodando
    docker stop mcp-stock-dev 2>/dev/null || true
    docker rm mcp-stock-dev 2>/dev/null || true
    
    # Executar container de desenvolvimento
    docker run -d \
        --name mcp-stock-dev \
        -p 3001:3000 \
        -e NODE_ENV=development \
        -e MCP_SERVER_NAME=stock-server-dev \
        -e MCP_SERVER_VERSION=1.0.0-dev \
        -e PORT=3000 \
        -e LOG_LEVEL=debug \
        -v "$(pwd):/app" \
        -v "/app/node_modules" \
        "${IMAGE_NAME}:${DEV_TAG}"
    
    echo -e "${GREEN}✅ Container de desenvolvimento executando: mcp-stock-dev${NC}"
    echo -e "${YELLOW}💡 Use 'docker logs -f mcp-stock-dev' para ver logs em tempo real${NC}"
}

# Função para parar containers
stop_containers() {
    echo -e "${BLUE}🛑 Parando containers...${NC}"
    
    docker stop mcp-stock-server mcp-stock-dev 2>/dev/null || true
    docker rm mcp-stock-server mcp-stock-dev 2>/dev/null || true
    
    echo -e "${GREEN}✅ Containers parados${NC}"
}

# Função para mostrar logs
show_logs() {
    echo -e "${BLUE}📋 Logs do container...${NC}"
    
    if docker ps -q -f name=mcp-stock-server | grep -q .; then
        docker logs -f mcp-stock-server
    elif docker ps -q -f name=mcp-stock-dev | grep -q .; then
        docker logs -f mcp-stock-dev
    else
        echo -e "${RED}❌ Nenhum container rodando${NC}"
        exit 1
    fi
}

# Função para limpeza
clean_docker() {
    echo -e "${BLUE}🧹 Limpando imagens e containers...${NC}"
    
    # Parar e remover containers
    docker stop mcp-stock-server mcp-stock-dev 2>/dev/null || true
    docker rm mcp-stock-server mcp-stock-dev 2>/dev/null || true
    
    # Remover imagens
    docker rmi "${IMAGE_NAME}:${TAG}" "${IMAGE_NAME}:${DEV_TAG}" 2>/dev/null || true
    
    # Limpeza geral
    docker system prune -f
    
    echo -e "${GREEN}✅ Limpeza concluída${NC}"
}

# Função para push da imagem
push_image() {
    echo -e "${BLUE}📤 Fazendo push da imagem...${NC}"
    
    local registry="${REGISTRY:-}"
    if [ -n "$registry" ]; then
        docker tag "${IMAGE_NAME}:${TAG}" "${registry}/${IMAGE_NAME}:${TAG}"
        docker push "${registry}/${IMAGE_NAME}:${TAG}"
        echo -e "${GREEN}✅ Imagem enviada para ${registry}/${IMAGE_NAME}:${TAG}${NC}"
    else
        echo -e "${RED}❌ Registry não especificado. Use --registry para definir${NC}"
        exit 1
    fi
}

# Processar argumentos
COMMAND=""
NO_CACHE="false"
REGISTRY=""

while [[ $# -gt 0 ]]; do
    case $1 in
        build|build-dev|run|run-dev|stop|logs|clean|push|help)
            COMMAND="$1"
            shift
            ;;
        --tag)
            TAG="$2"
            shift 2
            ;;
        --no-cache)
            NO_CACHE="true"
            shift
            ;;
        --registry)
            REGISTRY="$2"
            shift 2
            ;;
        *)
            echo -e "${RED}❌ Argumento desconhecido: $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

# Executar comando
case $COMMAND in
    build)
        build_production
        ;;
    build-dev)
        build_development
        ;;
    run)
        build_production
        run_container
        ;;
    run-dev)
        build_development
        run_development
        ;;
    stop)
        stop_containers
        ;;
    logs)
        show_logs
        ;;
    clean)
        clean_docker
        ;;
    push)
        push_image
        ;;
    help|"")
        show_help
        ;;
    *)
        echo -e "${RED}❌ Comando desconhecido: $COMMAND${NC}"
        show_help
        exit 1
        ;;
esac
