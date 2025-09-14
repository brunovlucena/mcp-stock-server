#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { StockDataService } from './services/stockDataService.js';
import { config } from 'dotenv';

// Carregar variáveis de ambiente
config();

class StockMCPServer {
  private server: Server;
  private stockService: StockDataService;

  constructor() {
    this.server = new Server(
      {
        name: process.env.MCP_SERVER_NAME || 'stock-server',
        version: process.env.MCP_SERVER_VERSION || '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.stockService = new StockDataService();
    this.setupHandlers();
  }

  private setupHandlers() {
    // Listar ferramentas disponíveis
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_stock_quote',
            description: 'Obter cotação atual de uma ação',
            inputSchema: {
              type: 'object',
              properties: {
                symbol: {
                  type: 'string',
                  description: 'Símbolo da ação (ex: AAPL, PETR4, VALE3)',
                },
                exchange: {
                  type: 'string',
                  description: 'Bolsa de valores (ex: NASDAQ, B3, NYSE)',
                  default: 'NASDAQ',
                },
              },
              required: ['symbol'],
            },
          },
          {
            name: 'search_stocks',
            description: 'Buscar ações por nome ou símbolo',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Termo de busca (nome da empresa ou símbolo)',
                },
                limit: {
                  type: 'number',
                  description: 'Número máximo de resultados',
                  default: 10,
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'get_stock_history',
            description: 'Obter histórico de preços de uma ação',
            inputSchema: {
              type: 'object',
              properties: {
                symbol: {
                  type: 'string',
                  description: 'Símbolo da ação',
                },
                period: {
                  type: 'string',
                  description: 'Período do histórico (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)',
                  default: '1mo',
                },
                interval: {
                  type: 'string',
                  description: 'Intervalo dos dados (1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo)',
                  default: '1d',
                },
              },
              required: ['symbol'],
            },
          },
          {
            name: 'get_market_summary',
            description: 'Obter resumo do mercado e índices principais',
            inputSchema: {
              type: 'object',
              properties: {
                region: {
                  type: 'string',
                  description: 'Região do mercado (US, BR, EU, ASIA)',
                  default: 'US',
                },
              },
            },
          },
          {
            name: 'get_stock_news',
            description: 'Obter notícias relacionadas a uma ação',
            inputSchema: {
              type: 'object',
              properties: {
                symbol: {
                  type: 'string',
                  description: 'Símbolo da ação',
                },
                limit: {
                  type: 'number',
                  description: 'Número máximo de notícias',
                  default: 10,
                },
              },
              required: ['symbol'],
            },
          },
          {
            name: 'get_stock_fundamentals',
            description: 'Obter dados fundamentais de uma ação',
            inputSchema: {
              type: 'object',
              properties: {
                symbol: {
                  type: 'string',
                  description: 'Símbolo da ação',
                },
              },
              required: ['symbol'],
            },
          },
        ],
      };
    });

    // Executar ferramentas
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_stock_quote':
            return await this.stockService.getStockQuote(args.symbol, args.exchange);
          
          case 'search_stocks':
            return await this.stockService.searchStocks(args.query, args.limit);
          
          case 'get_stock_history':
            return await this.stockService.getStockHistory(
              args.symbol,
              args.period,
              args.interval
            );
          
          case 'get_market_summary':
            return await this.stockService.getMarketSummary(args.region);
          
          case 'get_stock_news':
            return await this.stockService.getStockNews(args.symbol, args.limit);
          
          case 'get_stock_fundamentals':
            return await this.stockService.getStockFundamentals(args.symbol);
          
          default:
            throw new Error(`Ferramenta desconhecida: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Erro ao executar ${name}: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MCP Stock Server rodando...');
  }
}

// Iniciar o servidor
const server = new StockMCPServer();
server.run().catch(console.error);
