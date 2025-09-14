# 📈 MCP Stock Server

Um servidor MCP (Model Context Protocol) para acessar dados da bolsa de valores em tempo real. Este servidor fornece ferramentas para buscar cotações, histórico, notícias e dados fundamentais de ações.

## 🚀 Funcionalidades

- **📊 Cotações em Tempo Real**: Obter preços atuais de ações
- **🔍 Busca de Ações**: Encontrar ações por nome ou símbolo
- **📈 Histórico de Preços**: Dados históricos com diferentes períodos
- **🌍 Resumo do Mercado**: Índices principais por região
- **📰 Notícias**: Notícias relacionadas a ações específicas
- **📊 Dados Fundamentais**: Informações financeiras detalhadas

## 🛠️ Instalação

### Opção 1: Task (Recomendado)

1. **Instale o Task:**
```bash
# macOS
brew install go-task/tap/go-task

# Linux
sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d -b /usr/local/bin

# Windows
choco install go-task
```

2. **Clone o repositório:**
```bash
git clone https://github.com/brunovlucena/mcp-stock-server.git
cd mcp-stock-server
```

3. **Configure e execute:**
```bash
# Setup completo
task setup

# Executar com Docker
task docker:run

# Ou desenvolvimento
task dev
```

### Opção 2: Instalação Local

1. **Clone o repositório:**
```bash
git clone https://github.com/brunovlucena/mcp-stock-server.git
cd mcp-stock-server
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp env.example .env
# Edite o arquivo .env com suas chaves de API (opcional)
```

4. **Compile o projeto:**
```bash
npm run build
```

### Opção 3: Docker (Tradicional)

1. **Clone o repositório:**
```bash
git clone https://github.com/brunovlucena/mcp-stock-server.git
cd mcp-stock-server
```

2. **Configure as variáveis de ambiente:**
```bash
cp env.example .env
# Edite o arquivo .env com suas chaves de API (opcional)
```

3. **Execute com Docker:**
```bash
# Usando Makefile
make docker-run

# Ou usando docker-compose
make docker-compose-up

# Ou usando script direto
./docker-build.sh run
```

## 🚀 Uso

### Execução com Task (Recomendado)

#### Comandos Básicos:
```bash
# Ajuda e listagem
task help              # Mostra todos os comandos
task --list           # Lista todas as tarefas

# Setup e instalação
task setup            # Configura o projeto
task dev-setup        # Setup para desenvolvimento
task prod-setup       # Setup para produção

# Execução
task start            # Inicia o servidor (produção)
task dev              # Modo desenvolvimento
task watch            # Modo watch
```

#### Docker com Task:
```bash
# Docker básico
task docker:build     # Build da imagem
task docker:run       # Executa container
task docker:stop      # Para containers
task docker:logs      # Mostra logs
task docker:clean     # Limpeza

# Docker Compose
task compose:up       # Inicia com docker-compose
task compose:down     # Para com docker-compose
task compose:logs     # Logs do docker-compose
task compose:dev      # Modo desenvolvimento
```

#### MCP Registry:
```bash
# MCP Registry
task registry:build       # Build para MCP Registry
task registry:push        # Push para MCP Registry
task registry:validate    # Valida configuração
task registry:test        # Testa imagem
task registry:deploy      # Deploy completo
```

### Execução Local (Tradicional)

#### Executar o servidor:
```bash
npm start
```

#### Modo desenvolvimento:
```bash
npm run dev
```

#### Modo watch (desenvolvimento):
```bash
npm run watch
```

### Execução com Docker (Tradicional)

#### Usando Makefile:
```bash
# Build e execução em produção
make docker-run

# Build e execução em desenvolvimento
make docker-run-dev

# Parar containers
make docker-stop

# Ver logs
make docker-logs

# Limpeza
make docker-clean
```

#### Usando Docker Compose:
```bash
# Iniciar em produção
make docker-compose-up

# Iniciar em desenvolvimento
make docker-compose-dev

# Parar
make docker-compose-down

# Ver logs
make docker-compose-logs
```

#### Usando Script Direto:
```bash
# Build da imagem
./docker-build.sh build

# Executar container
./docker-build.sh run

# Executar em desenvolvimento
./docker-build.sh run-dev

# Parar containers
./docker-build.sh stop

# Ver logs
./docker-build.sh logs

# Limpeza
./docker-build.sh clean
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` baseado no `env.example`:

```env
# Configurações do MCP Stock Server
MCP_SERVER_NAME=stock-server
MCP_SERVER_VERSION=1.0.0

# APIs de dados financeiros (opcional)
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
FINNHUB_API_KEY=your_finnhub_key_here
YAHOO_FINANCE_API_KEY=your_yahoo_key_here

# Configurações do servidor
PORT=3000
LOG_LEVEL=info
```

**Nota**: O servidor funciona sem chaves de API, usando APIs gratuitas do Yahoo Finance. As chaves são opcionais para funcionalidades avançadas.

## 📋 Ferramentas Disponíveis

### 1. `get_stock_quote`
Obter cotação atual de uma ação.

**Parâmetros:**
- `symbol` (obrigatório): Símbolo da ação (ex: AAPL, PETR4, VALE3)
- `exchange` (opcional): Bolsa de valores (ex: NASDAQ, B3, NYSE)

**Exemplo:**
```json
{
  "symbol": "AAPL",
  "exchange": "NASDAQ"
}
```

### 2. `search_stocks`
Buscar ações por nome ou símbolo.

**Parâmetros:**
- `query` (obrigatório): Termo de busca
- `limit` (opcional): Número máximo de resultados (padrão: 10)

**Exemplo:**
```json
{
  "query": "Apple",
  "limit": 5
}
```

### 3. `get_stock_history`
Obter histórico de preços de uma ação.

**Parâmetros:**
- `symbol` (obrigatório): Símbolo da ação
- `period` (opcional): Período (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
- `interval` (opcional): Intervalo (1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo)

**Exemplo:**
```json
{
  "symbol": "AAPL",
  "period": "1mo",
  "interval": "1d"
}
```

### 4. `get_market_summary`
Obter resumo do mercado e índices principais.

**Parâmetros:**
- `region` (opcional): Região (US, BR, EU, ASIA)

**Exemplo:**
```json
{
  "region": "US"
}
```

### 5. `get_stock_news`
Obter notícias relacionadas a uma ação.

**Parâmetros:**
- `symbol` (obrigatório): Símbolo da ação
- `limit` (opcional): Número máximo de notícias (padrão: 10)

**Exemplo:**
```json
{
  "symbol": "AAPL",
  "limit": 5
}
```

### 6. `get_stock_fundamentals`
Obter dados fundamentais de uma ação.

**Parâmetros:**
- `symbol` (obrigatório): Símbolo da ação

**Exemplo:**
```json
{
  "symbol": "AAPL"
}
```

## 🌍 Regiões Suportadas

- **US**: Estados Unidos (S&P 500, Dow Jones, NASDAQ, Russell 2000)
- **BR**: Brasil (Bovespa, Ibovespa, IFIX)
- **EU**: Europa (CAC 40, DAX, FTSE 100)
- **ASIA**: Ásia (Nikkei 225, Hang Seng, ASX 200)

## 📊 Exemplos de Símbolos

### Ações Americanas:
- AAPL (Apple)
- MSFT (Microsoft)
- GOOGL (Google)
- AMZN (Amazon)
- TSLA (Tesla)

### Ações Brasileiras:
- PETR4 (Petrobras)
- VALE3 (Vale)
- ITUB4 (Itaú)
- BBDC4 (Bradesco)
- WEGE3 (WEG)

### Índices:
- ^GSPC (S&P 500)
- ^DJI (Dow Jones)
- ^IXIC (NASDAQ)
- ^BVSP (Bovespa)

## 🔌 Integração com Clientes MCP

### Configuração Local

Para usar este servidor com um cliente MCP localmente, adicione a configuração:

```json
{
  "mcpServers": {
    "stock-server": {
      "command": "node",
      "args": ["/caminho/para/mcp-stock-server/dist/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### Configuração Docker

Para usar com Docker, você pode configurar de duas formas:

#### Opção 1: Container como comando
```json
{
  "mcpServers": {
    "stock-server": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "mcp-stock-server:latest"
      ]
    }
  }
}
```

#### Opção 2: Docker Compose
```json
{
  "mcpServers": {
    "stock-server": {
      "command": "docker-compose",
      "args": [
        "exec",
        "-T",
        "mcp-stock-server",
        "node",
        "dist/index.js"
      ],
      "cwd": "/caminho/para/mcp-stock-server"
    }
  }
}
```

### Configuração de Rede Docker

Se você estiver usando Docker, certifique-se de que o cliente MCP e o servidor estejam na mesma rede:

```yaml
# docker-compose.yml
version: '3.8'
services:
  mcp-stock-server:
    # ... configuração do servidor
    networks:
      - mcp-network
  
  mcp-client:
    # ... configuração do cliente
    networks:
      - mcp-network
    depends_on:
      - mcp-stock-server

networks:
  mcp-network:
    driver: bridge
```

## 🛠️ Desenvolvimento

### Estrutura do Projeto:
```
mcp-stock-server/
├── src/
│   ├── index.ts              # Servidor MCP principal
│   └── services/
│       └── stockDataService.ts  # Serviço de dados financeiros
├── dist/                     # Código compilado
├── package.json
├── tsconfig.json
├── env.example
└── README.md
```

### Scripts Disponíveis:
- `npm run build`: Compila o TypeScript
- `npm start`: Executa o servidor compilado
- `npm run dev`: Executa em modo desenvolvimento
- `npm run watch`: Executa com watch mode

## 📝 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature
3. Fazer commit das mudanças
4. Fazer push para a branch
5. Abrir um Pull Request

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique se todas as dependências estão instaladas
2. Confirme se o arquivo `.env` está configurado corretamente
3. Verifique os logs para mensagens de erro
4. Abra uma issue no repositório

## 🔮 Roadmap

- [ ] Suporte a criptomoedas
- [ ] Alertas de preço
- [ ] Análise técnica básica
- [ ] Suporte a mais exchanges
- [ ] Cache de dados para melhor performance
- [ ] WebSocket para dados em tempo real
