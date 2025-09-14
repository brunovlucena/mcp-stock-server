# 📈 MCP Stock Server - Makefile
# Facilita o desenvolvimento e uso do servidor

.PHONY: help install build start dev test clean lint format

# Cores para output
GREEN = \033[0;32m
YELLOW = \033[1;33m
RED = \033[0;31m
NC = \033[0m # No Color

help: ## 📋 Mostra esta ajuda
	@echo "$(GREEN)📈 MCP Stock Server$(NC)"
	@echo ""
	@echo "$(YELLOW)Comandos disponíveis:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## 📦 Instala as dependências
	@echo "$(GREEN)📦 Instalando dependências...$(NC)"
	npm install

build: ## 🔨 Compila o projeto TypeScript
	@echo "$(GREEN)🔨 Compilando projeto...$(NC)"
	npm run build

start: build ## 🚀 Inicia o servidor (produção)
	@echo "$(GREEN)🚀 Iniciando servidor...$(NC)"
	npm start

dev: ## 🔧 Inicia o servidor em modo desenvolvimento
	@echo "$(GREEN)🔧 Iniciando em modo desenvolvimento...$(NC)"
	npm run dev

watch: ## 👀 Inicia o servidor com watch mode
	@echo "$(GREEN)👀 Iniciando com watch mode...$(NC)"
	npm run watch

test: build ## 🧪 Executa os testes do servidor
	@echo "$(GREEN)🧪 Executando testes...$(NC)"
	node examples/test-server.js

setup: install ## 🛠️ Configura o projeto (instala + setup inicial)
	@echo "$(GREEN)🛠️ Configurando projeto...$(NC)"
	@if [ ! -f .env ]; then \
		echo "$(YELLOW)📝 Criando arquivo .env...$(NC)"; \
		cp env.example .env; \
		echo "$(GREEN)✅ Arquivo .env criado! Edite com suas configurações.$(NC)"; \
	fi
	@echo "$(GREEN)✅ Projeto configurado!$(NC)"

clean: ## 🧹 Limpa arquivos compilados
	@echo "$(GREEN)🧹 Limpando arquivos compilados...$(NC)"
	rm -rf dist/
	@echo "$(GREEN)✅ Limpeza concluída!$(NC)"

lint: ## 🔍 Executa o linter
	@echo "$(GREEN)🔍 Executando linter...$(NC)"
	npx eslint src/ --ext .ts

format: ## 🎨 Formata o código
	@echo "$(GREEN)🎨 Formatando código...$(NC)"
	npx prettier --write src/

# Comandos de desenvolvimento
dev-setup: setup build ## 🛠️ Setup completo para desenvolvimento
	@echo "$(GREEN)✅ Setup de desenvolvimento concluído!$(NC)"
	@echo "$(YELLOW)💡 Use 'make dev' para iniciar em modo desenvolvimento$(NC)"

# Comandos de produção
prod-setup: setup build ## 🚀 Setup completo para produção
	@echo "$(GREEN)✅ Setup de produção concluído!$(NC)"
	@echo "$(YELLOW)💡 Use 'make start' para iniciar em produção$(NC)"

# Comandos Docker
docker-build: ## 🐳 Build da imagem Docker
	@echo "$(GREEN)🐳 Building imagem Docker...$(NC)"
	./docker-build.sh build

docker-build-dev: ## 🐳 Build da imagem Docker de desenvolvimento
	@echo "$(GREEN)🐳 Building imagem Docker de desenvolvimento...$(NC)"
	./docker-build.sh build-dev

docker-run: docker-build ## 🐳 Executa o container Docker
	@echo "$(GREEN)🐳 Executando container Docker...$(NC)"
	./docker-build.sh run

docker-run-dev: docker-build-dev ## 🐳 Executa o container Docker em modo desenvolvimento
	@echo "$(GREEN)🐳 Executando container Docker em modo desenvolvimento...$(NC)"
	./docker-build.sh run-dev

docker-stop: ## 🐳 Para os containers Docker
	@echo "$(GREEN)🐳 Parando containers Docker...$(NC)"
	./docker-build.sh stop

docker-logs: ## 🐳 Mostra logs dos containers Docker
	@echo "$(GREEN)🐳 Mostrando logs...$(NC)"
	./docker-build.sh logs

docker-clean: ## 🐳 Limpa imagens e containers Docker
	@echo "$(GREEN)🐳 Limpando Docker...$(NC)"
	./docker-build.sh clean

docker-compose-up: ## 🐳 Inicia com docker-compose
	@echo "$(GREEN)🐳 Iniciando com docker-compose...$(NC)"
	docker-compose up -d

docker-compose-down: ## 🐳 Para com docker-compose
	@echo "$(GREEN)🐳 Parando com docker-compose...$(NC)"
	docker-compose down

docker-compose-logs: ## 🐳 Mostra logs do docker-compose
	@echo "$(GREEN)🐳 Mostrando logs do docker-compose...$(NC)"
	docker-compose logs -f

docker-compose-dev: ## 🐳 Inicia em modo desenvolvimento com docker-compose
	@echo "$(GREEN)🐳 Iniciando modo desenvolvimento...$(NC)"
	docker-compose --profile dev up -d

# Comandos de teste
test-quote: build ## 📊 Testa cotação de uma ação
	@echo "$(GREEN)📊 Testando cotação...$(NC)"
	@echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_stock_quote","arguments":{"symbol":"AAPL"}}}}' | node dist/index.js

test-search: build ## 🔍 Testa busca de ações
	@echo "$(GREEN)🔍 Testando busca...$(NC)"
	@echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search_stocks","arguments":{"query":"Apple","limit":3}}}}' | node dist/index.js

# Comandos de monitoramento
logs: ## 📋 Mostra logs do servidor
	@echo "$(GREEN)📋 Logs do servidor:$(NC)"
	@echo "$(YELLOW)💡 Use Ctrl+C para sair$(NC)"
	tail -f /dev/null

# Comandos de ajuda
examples: ## 📚 Mostra exemplos de uso
	@echo "$(GREEN)📚 Exemplos de uso do MCP Stock Server:$(NC)"
	@echo ""
	@echo "$(YELLOW)1. Cotação de uma ação:$(NC)"
	@echo '   {"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_stock_quote","arguments":{"symbol":"AAPL"}}}}'
	@echo ""
	@echo "$(YELLOW)2. Buscar ações:$(NC)"
	@echo '   {"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search_stocks","arguments":{"query":"Tesla","limit":5}}}}'
	@echo ""
	@echo "$(YELLOW)3. Histórico de preços:$(NC)"
	@echo '   {"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_stock_history","arguments":{"symbol":"AAPL","period":"1mo"}}}}'
	@echo ""
	@echo "$(YELLOW)4. Resumo do mercado:$(NC)"
	@echo '   {"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_market_summary","arguments":{"region":"US"}}}}'
	@echo ""
	@echo "$(YELLOW)5. Notícias de uma ação:$(NC)"
	@echo '   {"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_stock_news","arguments":{"symbol":"MSFT","limit":3}}}}'
	@echo ""
	@echo "$(YELLOW)6. Dados fundamentais:$(NC)"
	@echo '   {"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_stock_fundamentals","arguments":{"symbol":"AAPL"}}}}'

# Comando padrão
.DEFAULT_GOAL := help
