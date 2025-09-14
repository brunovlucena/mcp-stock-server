# 🐳 Guia Docker - MCP Stock Server

Este guia mostra como usar o MCP Stock Server com Docker de forma rápida e eficiente.

## 🚀 Início Rápido

### 1. Build e Execução Básica

```bash
# Build da imagem
make docker-build

# Executar container
make docker-run

# Ver logs
make docker-logs
```

### 2. Usando Docker Compose

```bash
# Iniciar em produção
make docker-compose-up

# Iniciar em desenvolvimento
make docker-compose-dev

# Parar
make docker-compose-down
```

### 3. Usando Script Direto

```bash
# Build e execução
./docker-build.sh run

# Desenvolvimento
./docker-build.sh run-dev

# Parar
./docker-build.sh stop
```

## 🔧 Configurações Avançadas

### Variáveis de Ambiente

Crie um arquivo `.env` com suas configurações:

```env
# APIs de dados financeiros (opcional)
ALPHA_VANTAGE_API_KEY=your_key_here
FINNHUB_API_KEY=your_key_here
YAHOO_FINANCE_API_KEY=your_key_here

# Configurações do servidor
NODE_ENV=production
MCP_SERVER_NAME=stock-server
MCP_SERVER_VERSION=1.0.0
PORT=3000
LOG_LEVEL=info
```

### Volumes Persistentes

O Docker Compose está configurado para persistir:
- `./logs` → `/app/logs` (logs do servidor)
- `./data` → `/app/data` (dados persistentes)

### Recursos do Container

Limites configurados:
- **Memória**: 512MB (limite), 256MB (reserva)
- **CPU**: 0.5 cores (limite), 0.25 cores (reserva)

## 📊 Monitoramento

### Health Check

O container inclui health check automático:
- **Intervalo**: 30 segundos
- **Timeout**: 3 segundos
- **Retries**: 3 tentativas
- **Start Period**: 5 segundos

### Logs

```bash
# Logs em tempo real
make docker-logs

# Logs do docker-compose
make docker-compose-logs

# Logs com timestamps
docker logs -t mcp-stock-server
```

### Status do Container

```bash
# Status dos containers
docker ps -a

# Informações detalhadas
docker inspect mcp-stock-server

# Uso de recursos
docker stats mcp-stock-server
```

## 🔌 Integração com Clientes MCP

### Configuração Básica

Use o arquivo `mcp-config-docker.json`:

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

### Configuração com Variáveis de Ambiente

```json
{
  "mcpServers": {
    "stock-server": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "-e",
        "ALPHA_VANTAGE_API_KEY=your_key",
        "mcp-stock-server:latest"
      ]
    }
  }
}
```

### Configuração com Docker Compose

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

## 🛠️ Desenvolvimento

### Modo Desenvolvimento

```bash
# Build da imagem de desenvolvimento
make docker-build-dev

# Executar em modo desenvolvimento
make docker-run-dev

# Ou usar docker-compose
make docker-compose-dev
```

### Hot Reload

O modo desenvolvimento inclui hot reload automático:
- Código é montado como volume
- Mudanças são detectadas automaticamente
- Servidor reinicia automaticamente

### Debug

```bash
# Executar com debug
docker run -it --rm \
  -e NODE_ENV=development \
  -e LOG_LEVEL=debug \
  -p 3000:3000 \
  mcp-stock-server:dev

# Acessar container em execução
docker exec -it mcp-stock-server sh
```

## 🧹 Manutenção

### Limpeza

```bash
# Limpar containers e imagens
make docker-clean

# Limpeza completa do Docker
docker system prune -a

# Remover apenas imagens do projeto
docker rmi mcp-stock-server:latest mcp-stock-server:dev
```

### Backup

```bash
# Backup dos logs
tar -czf logs-backup-$(date +%Y%m%d).tar.gz logs/

# Backup dos dados
tar -czf data-backup-$(date +%Y%m%d).tar.gz data/
```

### Atualização

```bash
# Parar containers
make docker-stop

# Rebuild da imagem
make docker-build

# Iniciar novamente
make docker-run
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Container não inicia**
   ```bash
   # Verificar logs
   docker logs mcp-stock-server
   
   # Verificar se a porta está em uso
   lsof -i :3000
   ```

2. **Erro de permissão**
   ```bash
   # Verificar permissões dos volumes
   ls -la logs/ data/
   
   # Corrigir permissões
   sudo chown -R $USER:$USER logs/ data/
   ```

3. **Problemas de rede**
   ```bash
   # Verificar redes Docker
   docker network ls
   
   # Verificar conectividade
   docker exec mcp-stock-server ping google.com
   ```

### Logs de Debug

```bash
# Executar com logs detalhados
docker run -it --rm \
  -e LOG_LEVEL=debug \
  mcp-stock-server:latest

# Ver logs do sistema
journalctl -u docker
```

## 📚 Comandos Úteis

### Docker Básico

```bash
# Listar containers
docker ps -a

# Listar imagens
docker images

# Remover container
docker rm mcp-stock-server

# Remover imagem
docker rmi mcp-stock-server:latest
```

### Docker Compose

```bash
# Ver status
docker-compose ps

# Restart de um serviço
docker-compose restart mcp-stock-server

# Scale de serviços
docker-compose up --scale mcp-stock-server=2
```

### Monitoramento

```bash
# Uso de recursos
docker stats

# Logs de todos os containers
docker-compose logs

# Logs de um serviço específico
docker-compose logs mcp-stock-server
```

## 🎯 Próximos Passos

1. **Configure suas chaves de API** no arquivo `.env`
2. **Teste o servidor** com `make docker-run`
3. **Integre com seu cliente MCP** usando `mcp-config-docker.json`
4. **Monitore os logs** para verificar funcionamento
5. **Configure backup** dos dados importantes

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs: `make docker-logs`
2. Consulte a documentação principal: `README.md`
3. Verifique as issues no repositório
4. Abra uma nova issue com detalhes do problema
