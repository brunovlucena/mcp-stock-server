import axios from 'axios';

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  timestamp: string;
}

export interface StockHistory {
  symbol: string;
  data: Array<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
}

export interface MarketSummary {
  region: string;
  indices: Array<{
    name: string;
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
  }>;
  topGainers: StockQuote[];
  topLosers: StockQuote[];
}

export interface StockNews {
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  source: string;
}

export interface StockFundamentals {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  marketCap: number;
  pe: number;
  peg: number;
  eps: number;
  bookValue: number;
  priceToBook: number;
  dividendYield: number;
  beta: number;
  revenue: number;
  profitMargin: number;
  returnOnEquity: number;
}

export class StockDataService {
  private alphaVantageKey: string;
  private finnhubKey: string;

  constructor() {
    this.alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY || '';
    this.finnhubKey = process.env.FINNHUB_API_KEY || '';
  }

  async getStockQuote(symbol: string, exchange: string = 'NASDAQ'): Promise<any> {
    try {
      // Usar Yahoo Finance como fonte principal (gratuita)
      const response = await axios.get(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
        {
          params: {
            region: 'US',
            lang: 'en-US',
            includePrePost: false,
            interval: '1m',
            useYfid: true,
            range: '1d',
            corsDomain: 'finance.yahoo.com',
            '.tsrc': 'finance',
          },
        }
      );

      const data = response.data.chart.result[0];
      const meta = data.meta;
      const quote = data.indicators.quote[0];

      const currentPrice = meta.regularMarketPrice;
      const previousClose = meta.previousClose;
      const change = currentPrice - previousClose;
      const changePercent = (change / previousClose) * 100;

      return {
        content: [
          {
            type: 'text',
            text: `📈 **Cotação de ${symbol}**\n\n` +
                  `💰 **Preço Atual:** $${currentPrice.toFixed(2)}\n` +
                  `📊 **Variação:** ${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent.toFixed(2)}%)\n` +
                  `📅 **Fechamento Anterior:** $${previousClose.toFixed(2)}\n` +
                  `📈 **Máxima do Dia:** $${meta.regularMarketDayHigh.toFixed(2)}\n` +
                  `📉 **Mínima do Dia:** $${meta.regularMarketDayLow.toFixed(2)}\n` +
                  `📊 **Volume:** ${meta.regularMarketVolume?.toLocaleString() || 'N/A'}\n` +
                  `🏢 **Market Cap:** ${meta.marketCap ? `$${(meta.marketCap / 1e9).toFixed(2)}B` : 'N/A'}\n` +
                  `⏰ **Última Atualização:** ${new Date(meta.regularMarketTime * 1000).toLocaleString()}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Erro ao buscar cotação de ${symbol}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async searchStocks(query: string, limit: number = 10): Promise<any> {
    try {
      const response = await axios.get(
        `https://query1.finance.yahoo.com/v1/finance/search`,
        {
          params: {
            q: query,
            quotesCount: limit,
            newsCount: 0,
          },
        }
      );

      const results = response.data.quotes || [];

      if (results.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `🔍 Nenhuma ação encontrada para "${query}"`,
            },
          ],
        };
      }

      const stocksList = results.map((stock: any, index: number) => 
        `${index + 1}. **${stock.symbol}** - ${stock.longname || stock.shortname}\n` +
        `   💰 Preço: $${stock.regularMarketPrice?.toFixed(2) || 'N/A'}\n` +
        `   📊 Variação: ${stock.regularMarketChange?.toFixed(2) || 'N/A'} (${stock.regularMarketChangePercent?.toFixed(2) || 'N/A'}%)\n` +
        `   🏢 Exchange: ${stock.exchange || 'N/A'}\n`
      ).join('\n');

      return {
        content: [
          {
            type: 'text',
            text: `🔍 **Resultados da busca por "${query}":**\n\n${stocksList}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Erro ao buscar ações: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async getStockHistory(symbol: string, period: string = '1mo', interval: string = '1d'): Promise<any> {
    try {
      const response = await axios.get(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
        {
          params: {
            region: 'US',
            lang: 'en-US',
            includePrePost: false,
            interval: interval,
            useYfid: true,
            range: period,
            corsDomain: 'finance.yahoo.com',
            '.tsrc': 'finance',
          },
        }
      );

      const data = response.data.chart.result[0];
      const timestamps = data.timestamp;
      const quotes = data.indicators.quote[0];

      const historyData = timestamps.map((timestamp: number, index: number) => ({
        date: new Date(timestamp * 1000).toISOString().split('T')[0],
        open: quotes.open[index],
        high: quotes.high[index],
        low: quotes.low[index],
        close: quotes.close[index],
        volume: quotes.volume[index],
      }));

      const latest = historyData[historyData.length - 1];
      const first = historyData[0];
      const totalChange = latest.close - first.close;
      const totalChangePercent = (totalChange / first.close) * 100;

      const historyTable = historyData.slice(-10).map(day => 
        `${day.date} | $${day.open.toFixed(2)} | $${day.high.toFixed(2)} | $${day.low.toFixed(2)} | $${day.close.toFixed(2)} | ${day.volume?.toLocaleString() || 'N/A'}`
      ).join('\n');

      return {
        content: [
          {
            type: 'text',
            text: `📊 **Histórico de ${symbol} (${period})**\n\n` +
                  `📈 **Resumo do Período:**\n` +
                  `💰 Preço Inicial: $${first.close.toFixed(2)}\n` +
                  `💰 Preço Final: $${latest.close.toFixed(2)}\n` +
                  `📊 Variação Total: ${totalChange >= 0 ? '+' : ''}${totalChange.toFixed(2)} (${totalChangePercent.toFixed(2)}%)\n\n` +
                  `📋 **Últimos 10 dias:**\n` +
                  `Data | Abertura | Máxima | Mínima | Fechamento | Volume\n` +
                  `--- | --- | --- | --- | --- | ---\n` +
                  `${historyTable}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Erro ao buscar histórico de ${symbol}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async getMarketSummary(region: string = 'US'): Promise<any> {
    try {
      // Índices principais por região
      const indices = {
        US: ['^GSPC', '^DJI', '^IXIC', '^RUT'],
        BR: ['^BVSP', '^IBOV', '^IFIX'],
        EU: ['^FCHI', '^GDAXI', '^FTSE'],
        ASIA: ['^N225', '^HSI', '^AXJO'],
      };

      const regionIndices = indices[region as keyof typeof indices] || indices.US;
      const indexNames = {
        '^GSPC': 'S&P 500',
        '^DJI': 'Dow Jones',
        '^IXIC': 'NASDAQ',
        '^RUT': 'Russell 2000',
        '^BVSP': 'Bovespa',
        '^IBOV': 'Ibovespa',
        '^IFIX': 'IFIX',
        '^FCHI': 'CAC 40',
        '^GDAXI': 'DAX',
        '^FTSE': 'FTSE 100',
        '^N225': 'Nikkei 225',
        '^HSI': 'Hang Seng',
        '^AXJO': 'ASX 200',
      };

      const indexData = await Promise.all(
        regionIndices.map(async (symbol) => {
          try {
            const response = await axios.get(
              `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
              {
                params: {
                  region: 'US',
                  lang: 'en-US',
                  includePrePost: false,
                  interval: '1d',
                  useYfid: true,
                  range: '1d',
                },
              }
            );

            const data = response.data.chart.result[0];
            const meta = data.meta;
            const currentPrice = meta.regularMarketPrice;
            const previousClose = meta.previousClose;
            const change = currentPrice - previousClose;
            const changePercent = (change / previousClose) * 100;

            return {
              name: indexNames[symbol as keyof typeof indexNames] || symbol,
              symbol,
              price: currentPrice,
              change,
              changePercent,
            };
          } catch (error) {
            return {
              name: indexNames[symbol as keyof typeof indexNames] || symbol,
              symbol,
              price: 0,
              change: 0,
              changePercent: 0,
              error: true,
            };
          }
        })
      );

      const validIndices = indexData.filter(index => !index.error);
      const indicesList = validIndices.map(index => 
        `📊 **${index.name} (${index.symbol})**\n` +
        `💰 Preço: ${index.price.toFixed(2)}\n` +
        `📈 Variação: ${index.change >= 0 ? '+' : ''}${index.change.toFixed(2)} (${index.changePercent.toFixed(2)}%)\n`
      ).join('\n');

      return {
        content: [
          {
            type: 'text',
            text: `🌍 **Resumo do Mercado - ${region.toUpperCase()}**\n\n` +
                  `📈 **Principais Índices:**\n\n${indicesList}` +
                  `\n⏰ **Atualizado em:** ${new Date().toLocaleString()}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Erro ao buscar resumo do mercado: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async getStockNews(symbol: string, limit: number = 10): Promise<any> {
    try {
      const response = await axios.get(
        `https://query1.finance.yahoo.com/v1/finance/search`,
        {
          params: {
            q: symbol,
            quotesCount: 0,
            newsCount: limit,
          },
        }
      );

      const news = response.data.news || [];

      if (news.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `📰 Nenhuma notícia encontrada para ${symbol}`,
            },
          ],
        };
      }

      const newsList = news.map((article: any, index: number) => 
        `${index + 1}. **${article.title}**\n` +
        `   📝 ${article.summary}\n` +
        `   🔗 [Ler mais](${article.link})\n` +
        `   📅 ${new Date(article.providerPublishTime * 1000).toLocaleString()}\n` +
        `   📰 Fonte: ${article.publisher}\n`
      ).join('\n');

      return {
        content: [
          {
            type: 'text',
            text: `📰 **Notícias sobre ${symbol}:**\n\n${newsList}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Erro ao buscar notícias de ${symbol}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async getStockFundamentals(symbol: string): Promise<any> {
    try {
      // Para dados fundamentais mais detalhados, seria necessário usar APIs pagas
      // Aqui vamos usar dados básicos disponíveis gratuitamente
      const response = await axios.get(
        `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}`,
        {
          params: {
            modules: 'summaryProfile,financialData,defaultKeyStatistics',
          },
        }
      );

      const data = response.data.quoteSummary.result[0];
      const profile = data.summaryProfile;
      const financial = data.financialData;
      const keyStats = data.defaultKeyStatistics;

      return {
        content: [
          {
            type: 'text',
            text: `📊 **Dados Fundamentais de ${symbol}**\n\n` +
                  `🏢 **Informações da Empresa:**\n` +
                  `Nome: ${profile?.longName || 'N/A'}\n` +
                  `Setor: ${profile?.sector || 'N/A'}\n` +
                  `Indústria: ${profile?.industry || 'N/A'}\n` +
                  `Funcionários: ${profile?.fullTimeEmployees?.toLocaleString() || 'N/A'}\n` +
                  `Website: ${profile?.website || 'N/A'}\n\n` +
                  `💰 **Dados Financeiros:**\n` +
                  `Market Cap: ${financial?.marketCap ? `$${(financial.marketCap / 1e9).toFixed(2)}B` : 'N/A'}\n` +
                  `P/E Ratio: ${keyStats?.trailingPE?.toFixed(2) || 'N/A'}\n` +
                  `PEG Ratio: ${keyStats?.pegRatio?.toFixed(2) || 'N/A'}\n` +
                  `EPS: ${keyStats?.trailingEps?.toFixed(2) || 'N/A'}\n` +
                  `Book Value: ${keyStats?.bookValue?.toFixed(2) || 'N/A'}\n` +
                  `Price to Book: ${keyStats?.priceToBook?.toFixed(2) || 'N/A'}\n` +
                  `Dividend Yield: ${keyStats?.dividendYield?.toFixed(4) || 'N/A'}\n` +
                  `Beta: ${keyStats?.beta?.toFixed(2) || 'N/A'}\n` +
                  `Revenue: ${financial?.totalRevenue ? `$${(financial.totalRevenue / 1e9).toFixed(2)}B` : 'N/A'}\n` +
                  `Profit Margin: ${financial?.profitMargins?.toFixed(4) || 'N/A'}\n` +
                  `ROE: ${financial?.returnOnEquity?.toFixed(4) || 'N/A'}\n\n` +
                  `⏰ **Atualizado em:** ${new Date().toLocaleString()}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Erro ao buscar dados fundamentais de ${symbol}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
