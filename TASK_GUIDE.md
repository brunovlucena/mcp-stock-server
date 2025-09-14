# 📋 Guia Task - MCP Stock Server

Este guia mostra como usar o Task (alternativa moderna ao Make) para gerenciar o MCP Stock Server, seguindo o padrão do [Docker MCP Registry](https://github.com/docker/mcp-registry/blob/main/CONTRIBUTING.md).

## 🚀 Instalação do Task

### macOS (Homebrew)
```bash
brew install go-task/tap/go-task
```

### Linux
```bash
sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d -b /usr/local/bin
```

### Windows (Chocolatey)
```bash
choco install go-task
```

### Verificar instalação
```bash
task --version
```

## 📋 Comandos Disponíveis

### 📚 Ajuda e Informações
```bash
task help          # Mostra todos os comandos disponíveis
task --list        # Lista todas as tarefas
task --summary     # Mostra resumo das tarefas
```

### 🛠️ Setup e Instalação
```bash
task setup         # Configura o projeto (instala + setup inicial)
task install       # Instala apenas as dependências
task dev-setup     # Setup completo para desenvolvimento
task prod-setup    # Setup completo para produção
```

### 🔨 Build e Compilação
```bash
task build         # Compila o projeto TypeScript
task clean         # Limpa arquivos compilados
```

### 🚀 Execução Local
```bash
task start         # Inicia o servidor (produção)
task dev           # Inicia em modo desenvolvimento
task watch         # Inicia com watch mode
```

### 🐳 Docker - Básico
```bash
task docker:build      # Build da imagem Docker
task docker:build-dev  # Build da imagem de desenvolvimento
task docker:run        # Executa o container Docker
task docker:run-dev    # Executa em modo desenvolvimento
task docker:stop       # Para os containers
task docker:logs       # Mostra logs
task docker:clean      # Limpa imagens e containers
```

### 🐳 Docker Compose
```bash
task compose:up        # Inicia com docker-compose
task compose:down      # Para com docker-compose
task compose:logs      # Mostra logs do docker-compose
task compose:dev       # Inicia em modo desenvolvimento
```

### 🧪 Testes
```bash
task test              # Executa todos os testes
task test:quote         # Testa cotação de uma ação
task test:search        # Testa busca de ações
```

### 🔍 Qualidade de Código
```bash
task lint              # Executa o linter
task format            # Formata o código
```

### 🐳 MCP Registry
```bash
task registry:build        # Build para MCP Registry
task registry:push         # Push para MCP Registry
task registry:validate     # Valida configuração
task registry:test         # Testa imagem
task registry:deploy       # Deploy completo
task registry:dev          # Setup de desenvolvimento
task registry:logs         # Logs do MCP Registry
task registry:clean        # Limpeza do MCP Registry
```

### 📦 Deploy
```bash
task deploy:build     # Build para deploy
task deploy:push      # Push da imagem para registry
```

### 📊 Monitoramento
```bash
task status           # Status dos containers
task logs:all         # Logs de todos os containers
```

### 🎯 Comandos de Conveniência
```bash
task up               # Inicia o servidor (Docker por padrão)
task down             # Para o servidor
task restart          # Reinicia o servidor
```

## 🔧 Configuração

### Arquivo .taskrc
O arquivo `.taskrc` contém configurações globais do Task:

```yaml
# Configurações globais
output: prefixed
color: true
summary: true

# Configurações de variáveis
vars:
  IMAGE_NAME: mcp-stock-server
  TAG: latest
  DEV_TAG: dev
  PORT: 3000
  CONTAINER_NAME: mcp-stock-server
  DEV_CONTAINER_NAME: mcp-stock-dev

# Configurações de output
output_mode: prefixed
output_group: true
output_group_begin: "📦"
output_group_end: "✅"

# Configurações de erro
stop_on_error: true
error_on_failure: true

# Configurações de paralelização
concurrent: true
max_concurrent: 4

# Configurações de cache
cache: true
cache_dir: .task-cache

# Configurações de watch
watch: true
watch_interval: 1s

# Configurações de log
log_level: info
log_format: json

# Configurações de timeout
timeout: 300s

# Configurações de retry
retry: 3
retry_interval: 5s
```

### Variáveis de Ambiente
Você pode sobrescrever variáveis usando arquivos `.env` ou variáveis de ambiente:

```bash
# Usando arquivo .env
echo "TAG=v1.0.0" >> .env

# Usando variáveis de ambiente
export TAG=v1.0.0
task docker:build
```

## 🚀 Workflows Comuns

### Desenvolvimento Local
```bash
# Setup inicial
task dev-setup

# Desenvolvimento com hot reload
task dev

# Ou usando Docker
task docker:run-dev
```

### Produção
```bash
# Setup para produção
task prod-setup

# Executar em produção
task start

# Ou usando Docker
task docker:run
```

### Deploy para MCP Registry
```bash
# Deploy completo
task registry:deploy

# Ou passo a passo
task registry:validate
task registry:build
task registry:test
task registry:push
```

### CI/CD
```bash
# Build para CI
task deploy:build

# Testes
task test

# Linting
task lint
```

## 🔍 Debugging

### Verbose Mode
```bash
task --verbose docker:run
```

### Dry Run
```bash
task --dry docker:build
```

### Listar Tarefas com Dependências
```bash
task --list-all
```

### Mostrar Variáveis
```bash
task --list | grep vars
```

## 📊 Monitoramento

### Status dos Containers
```bash
task status
```

### Logs em Tempo Real
```bash
task docker:logs
task compose:logs
```

### Logs de Desenvolvimento
```bash
task docker:logs-dev
```

## 🧹 Manutenção

### Limpeza Completa
```bash
task clean
task docker:clean
task registry:clean
```

### Atualização de Dependências
```bash
npm update
task build
```

### Rebuild Completo
```bash
task clean
task docker:clean
task docker:build
```

## 🎯 Dicas e Truques

### 1. Usar Variáveis Dinâmicas
```bash
# Usar data atual como tag
export TAG=$(date +%Y%m%d-%H%M%S)
task docker:build
```

### 2. Executar Múltiplas Tarefas
```bash
# Executar em sequência
task clean build test

# Executar em paralelo (se configurado)
task --concurrent docker:build docker:build-dev
```

### 3. Usar Profiles
```bash
# Executar apenas tarefas de desenvolvimento
task --profile dev

# Executar apenas tarefas de produção
task --profile prod
```

### 4. Watch Mode
```bash
# Executar tarefa e observar mudanças
task --watch dev
```

### 5. Usar Includes
```yaml
# No Taskfile.yml
includes:
  dev: ./tasks/dev.yml
  prod: ./tasks/prod.yml
```

## 🔧 Customização

### Adicionar Nova Tarefa
```yaml
# No Taskfile.yml
my-task:
  desc: "Minha tarefa personalizada"
  cmds:
    - echo "Executando minha tarefa..."
    - npm run my-script
```

### Usar Variáveis Customizadas
```yaml
# No Taskfile.yml
vars:
  MY_VAR: "valor personalizado"

my-task:
  cmds:
    - echo "{{.MY_VAR}}"
```

### Configurar Dependências
```yaml
# No Taskfile.yml
my-task:
  deps: [build, test]
  cmds:
    - echo "Executando após build e test"
```

## 📚 Recursos Adicionais

- [Documentação oficial do Task](https://taskfile.dev/)
- [Docker MCP Registry](https://github.com/docker/mcp-registry)
- [MCP Stock Server](https://github.com/brunovlucena/mcp-stock-server)
- [Exemplos de Taskfile](https://github.com/go-task/task/tree/main/examples)
- [Best Practices](https://taskfile.dev/usage/#best-practices)

## 🆘 Troubleshooting

### Problemas Comuns

1. **Task não encontrado**
   ```bash
   # Verificar instalação
   which task
   task --version
   ```

2. **Permissões negadas**
   ```bash
   # Dar permissão de execução
   chmod +x docker-build.sh
   ```

3. **Docker não encontrado**
   ```bash
   # Verificar Docker
   docker --version
   docker-compose --version
   ```

4. **Variáveis não carregadas**
   ```bash
   # Verificar arquivo .env
   cat .env
   
   # Carregar manualmente
   source .env
   ```

### Logs de Debug
```bash
# Executar com debug
task --verbose --dry docker:run

# Ver logs detalhados
task --verbose registry:deploy
```

## 🎉 Conclusão

O Task oferece uma experiência moderna e poderosa para gerenciar o MCP Stock Server. Com comandos intuitivos, configuração flexível e integração completa com Docker e MCP Registry, você tem tudo que precisa para desenvolver, testar e fazer deploy do seu servidor MCP.

Para mais informações, consulte a [documentação oficial do Task](https://taskfile.dev/) ou o [Docker MCP Registry](https://github.com/docker/mcp-registry/blob/main/CONTRIBUTING.md).
