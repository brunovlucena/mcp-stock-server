#!/usr/bin/env node

/**
 * Script de exemplo para testar o MCP Stock Server
 * Este script demonstra como usar as ferramentas disponíveis
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuração do servidor
const serverPath = join(__dirname, '../dist/index.js');

console.log('🚀 Iniciando MCP Stock Server...\n');

// Iniciar o servidor
const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// Exemplos de comandos para testar
const testCommands = [
  // Listar ferramentas disponíveis
  {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list',
    params: {}
  },
  
  // Buscar cotação da Apple
  {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'get_stock_quote',
      arguments: {
        symbol: 'AAPL',
        exchange: 'NASDAQ'
      }
    }
  },
  
  // Buscar ações da Tesla
  {
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'search_stocks',
      arguments: {
        query: 'Tesla',
        limit: 3
      }
    }
  },
  
  // Obter resumo do mercado americano
  {
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: {
      name: 'get_market_summary',
      arguments: {
        region: 'US'
      }
    }
  },
  
  // Buscar notícias da Microsoft
  {
    jsonrpc: '2.0',
    id: 5,
    method: 'tools/call',
    params: {
      name: 'get_stock_news',
      arguments: {
        symbol: 'MSFT',
        limit: 3
      }
    }
  }
];

let commandIndex = 0;

// Enviar comandos sequencialmente
function sendNextCommand() {
  if (commandIndex < testCommands.length) {
    const command = testCommands[commandIndex];
    console.log(`📤 Enviando comando ${commandIndex + 1}: ${command.method}`);
    
    server.stdin.write(JSON.stringify(command) + '\n');
    commandIndex++;
    
    // Aguardar um pouco antes do próximo comando
    setTimeout(sendNextCommand, 2000);
  } else {
    console.log('\n✅ Teste concluído! Encerrando servidor...');
    server.kill();
  }
}

// Processar respostas do servidor
server.stdout.on('data', (data) => {
  const lines = data.toString().split('\n').filter(line => line.trim());
  
  lines.forEach(line => {
    try {
      const response = JSON.parse(line);
      console.log('\n📥 Resposta do servidor:');
      console.log(JSON.stringify(response, null, 2));
    } catch (error) {
      console.log('📥 Resposta (texto):', line);
    }
  });
});

// Processar erros do servidor
server.stderr.on('data', (data) => {
  console.log('❌ Erro do servidor:', data.toString());
});

// Quando o servidor estiver pronto, iniciar os testes
server.on('spawn', () => {
  console.log('✅ Servidor iniciado! Iniciando testes...\n');
  setTimeout(sendNextCommand, 1000);
});

// Quando o servidor encerrar
server.on('close', (code) => {
  console.log(`\n🏁 Servidor encerrado com código: ${code}`);
  process.exit(0);
});

// Tratar erros
server.on('error', (error) => {
  console.error('❌ Erro ao iniciar servidor:', error);
  process.exit(1);
});

// Tratar interrupção do usuário
process.on('SIGINT', () => {
  console.log('\n🛑 Interrompendo teste...');
  server.kill();
  process.exit(0);
});
