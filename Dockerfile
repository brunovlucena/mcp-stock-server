# 📈 MCP Stock Server - Dockerfile
# Imagem otimizada para produção

# Usar Node.js Alpine para imagem menor
FROM node:18-alpine AS builder

# Instalar dependências necessárias
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Copiar código fonte
COPY . .

# Compilar TypeScript
RUN npm run build

# Imagem de produção
FROM node:18-alpine AS production

# Instalar dependências de runtime
RUN apk add --no-cache \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S mcpuser -u 1001

# Definir diretório de trabalho
WORKDIR /app

# Copiar dependências e código compilado
COPY --from=builder --chown=mcpuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=mcpuser:nodejs /app/dist ./dist
COPY --from=builder --chown=mcpuser:nodejs /app/package*.json ./

# Criar diretório de logs
RUN mkdir -p logs && chown mcpuser:nodejs logs

# Mudar para usuário não-root
USER mcpuser

# Expor porta (opcional, para debug)
EXPOSE 3000

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV MCP_SERVER_NAME=stock-server
ENV MCP_SERVER_VERSION=1.0.0
ENV PORT=3000
ENV LOG_LEVEL=info

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "console.log('Health check')" || exit 1

# Usar dumb-init para gerenciar processos
ENTRYPOINT ["dumb-init", "--"]

# Comando padrão
CMD ["node", "dist/index.js"]
