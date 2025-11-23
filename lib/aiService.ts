import { executePineScript } from './pineEngine';

export interface MarketContext {
    symbol?: string;
    currentPrice?: number;
    priceData?: any[];
    indicators?: any[];
}

export async function askAI(query: string, context?: MarketContext): Promise<string> {
    // Simulate network delay for realism
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));

    const lowerQuery = query.toLowerCase();

    // Analyze stock data if provided
    if (context?.priceData && context.priceData.length > 0) {
        return analyzeWithContext(query, context);
    }

    // Pattern-based responses for different query types
    if (lowerQuery.includes('rsi')) {
        return generateRSIAnalysis(context);
    }

    if (lowerQuery.includes('macd')) {
        return generateMACDAnalysis();
    }

    if (lowerQuery.includes('trend') || lowerQuery.includes('direction')) {
        return generateTrendAnalysis(context);
    }

    if (lowerQuery.includes('support') || lowerQuery.includes('resistance')) {
        return generateSupportResistanceAnalysis(context);
    }

    if (lowerQuery.includes('volume')) {
        return generateVolumeAnalysis(context);
    }

    if (lowerQuery.includes('volatility') || lowerQuery.includes('atr')) {
        return generateVolatilityAnalysis();
    }

    if (lowerQuery.includes('buy') || lowerQuery.includes('sell') || lowerQuery.includes('trade')) {
        return generateTradingRecommendation(context);
    }

    if (lowerQuery.includes('script') || lowerQuery.includes('indicator')) {
        return generateScriptAdvice();
    }

    // General market insights
    return generateGeneralInsight(query, context);
}

function analyzeWithContext(query: string, context: MarketContext): string {
    const data = context.priceData!;
    const latest = data[data.length - 1];
    const previous = data[data.length - 2];
    const symbol = context.symbol || 'the stock';

    // Calculate basic metrics
    const priceChange = ((latest.close - previous.close) / previous.close) * 100;
    const priceChangeStr = priceChange > 0 ? `+${priceChange.toFixed(2)}%` : `${priceChange.toFixed(2)}%`;

    // Calculate simple moving averages
    const sma20 = calculateAverage(data.slice(-20).map((d: any) => d.close));
    const sma50 = data.length >= 50 ? calculateAverage(data.slice(-50).map((d: any) => d.close)) : null;

    const trendDirection = latest.close > sma20 ? 'above' : 'below';
    const trendStrength = sma50 && sma20 > sma50 ? 'bullish' : sma50 && sma20 < sma50 ? 'bearish' : 'neutral';

    // Calculate RSI
    const rsiValue = calculateSimpleRSI(data.slice(-15).map((d: any) => d.close));
    const rsiCondition = rsiValue > 70 ? 'overbought' : rsiValue < 30 ? 'oversold' : 'neutral';

    // Volume analysis
    const avgVolume = calculateAverage(data.slice(-20).map((d: any) => d.volume));
    const volumeSignal = latest.volume > avgVolume * 1.5 ? 'unusually high' : latest.volume < avgVolume * 0.5 ? 'unusually low' : 'normal';

    // Generate contextual response
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('analysis') || lowerQuery.includes('how') || lowerQuery.includes('what')) {
        return `📊 **Analysis for ${symbol.toUpperCase()}**\n\n` +
            `**Current Status:**\n` +
            `• Price: ₹${latest.close.toFixed(2)} (${priceChangeStr} from yesterday)\n` +
            `• Trading ${trendDirection} the 20-day SMA (₹${sma20.toFixed(2)})\n` +
            `• Overall trend: ${trendStrength}\n\n` +
            `**Technical Indicators:**\n` +
            `• RSI (14): ${rsiValue.toFixed(1)} - ${rsiCondition}\n` +
            `• Volume: ${volumeSignal}\n\n` +
            `**Interpretation:** ` +
            (rsiCondition === 'overbought'
                ? `The RSI suggests the stock may be overbought. Consider waiting for a pullback.`
                : rsiCondition === 'oversold'
                    ? `The RSI indicates oversold conditions, which could present a buying opportunity if other indicators confirm.`
                    : `The technical indicators are in neutral territory. Watch for a clear directional move.`) +
            `\n\n⚠️ *This is an automated analysis. Always do your own research.*`;
    }

    if (lowerQuery.includes('buy') || lowerQuery.includes('sell')) {
        const signal = rsiValue < 35 && trendStrength === 'bullish' ? 'BUY'
            : rsiValue > 65 && trendStrength === 'bearish' ? 'SELL'
                : 'HOLD';

        return `🎯 **Trading Signal for ${symbol.toUpperCase()}**: ${signal}\n\n` +
            `**Reasoning:**\n` +
            `• Price momentum: ${priceChangeStr}\n` +
            `• RSI: ${rsiValue.toFixed(1)} (${rsiCondition})\n` +
            `• Trend: ${trendStrength}\n` +
            `• Volume: ${volumeSignal}\n\n` +
            (signal === 'HOLD'
                ? `The current technical setup doesn't provide a strong directional bias. It's better to wait for clearer signals.`
                : signal === 'BUY'
                    ? `Technical indicators suggest a potential buying opportunity, but confirm with your risk management strategy.`
                    : `Consider taking profits or reducing position size based on current technical readings.`) +
            `\n\n💡 *Remember to set appropriate stop-losses.*`;
    }

    return generateGeneralInsight(query, context);
}

function generateRSIAnalysis(context?: MarketContext): string {
    const rsiValues = [28, 35, 42, 52, 68, 72];
    const rsi = rsiValues[Math.floor(Math.random() * rsiValues.length)];

    if (rsi < 30) {
        return `📉 The RSI is currently at ${rsi}, indicating **oversold conditions**. This could signal a potential reversal or bounce. However, remember that oversold doesn't mean the price can't go lower. Look for confirmation signals like:\n\n• Bullish divergence on the RSI\n• Price support levels holding\n• Increasing volume on green candles`;
    } else if (rsi > 70) {
        return `📈 The RSI is at ${rsi}, showing **overbought conditions**. This suggests the stock may be due for a pullback. Consider:\n\n• Taking partial profits if you're long\n• Waiting for a better entry point\n• Looking for bearish divergence patterns`;
    } else {
        return `📊 The RSI is at ${rsi}, which is in the **neutral zone** (30-70). This means:\n\n• No extreme momentum in either direction\n• The stock is trading normally\n• Good time to use other indicators for confirmation\n\nConsider combining with MA crossovers or volume analysis for better signals.`;
    }
}

function generateMACDAnalysis(): string {
    const scenarios = [
        `📊 The MACD line has just **crossed above** the signal line - a **bullish signal**. This suggests increasing upward momentum. The histogram is turning positive, confirming the crossover. Consider this as a potential entry signal, especially if it's occurring above the zero line.`,
        `📉 The MACD shows a **bearish crossover** with the MACD line crossing below the signal line. This indicates weakening momentum. The histogram is turning negative. If you're holding a long position, this might be a good time to consider your exit strategy.`,
        `📈 Both MACD and signal lines are trending upward and are above the zero line - a strong **bullish setup**. The histogram is expanding, showing accelerating momentum. This confirms the current uptrend.`,
    ];

    return scenarios[Math.floor(Math.random() * scenarios.length)];
}

function generateTrendAnalysis(context?: MarketContext): string {
    const trends = [
        `📈 **Uptrend Confirmed**: The 50-day SMA is above the 200-day SMA (Golden Cross formation). Price is making higher highs and higher lows. This is a strong bullish signal. Key resistance to watch: ₹1,650.`,
        `📉 **Downtrend in Progress**: The stock is trading below both major moving averages. Lower highs and lower lows pattern is forming. Watch for a potential breakdown below ₹1,420 support. Consider defensive positions.`,
        `〰️ **Sideways/Consolidation**: Price is ranging between ₹1,480-₹1,550 for the past 2 weeks. Volume is declining, suggesting indecision. Wait for a breakout above resistance or breakdown below support before making a move.`,
    ];

    return trends[Math.floor(Math.random() * trends.length)];
}

function generateSupportResistanceAnalysis(context?: MarketContext): string {
    return `🎯 **Key Levels Analysis**\n\n` +
        `**Resistance Levels:**\n` +
        `• R1: ₹1,585 (previous high)\n` +
        `• R2: ₹1,620 (psychological level)\n` +
        `• R3: ₹1,650 (52-week high)\n\n` +
        `**Support Levels:**\n` +
        `• S1: ₹1,520 (20-day SMA)\n` +
        `• S2: ₹1,485 (previous consolidation zone)\n` +
        `• S3: ₹1,450 (50-day SMA)\n\n` +
        `**Trading Strategy:**\n` +
        `• Buy near support with stop-loss below S2\n` +
        `• Take profits near resistance levels\n` +
        `• A breakout above R1 with volume could target R2`;
}

function generateVolumeAnalysis(context?: MarketContext): string {
    return `📊 **Volume Analysis:**\n\n` +
        `Today's volume is **1.2M shares**, which is 65% above the 20-day average. This suggests:\n\n` +
        `• Strong institutional interest\n` +
        `• Increased conviction in the current move\n` +
        `• Higher probability of trend continuation\n\n` +
        `💡 **What this means:** When price moves up with high volume, it's a bullish sign (smart money buying). When price moves down with high volume, it could indicate distribution (smart money selling).`;
}

function generateVolatilityAnalysis(): string {
    return `📊 **Volatility Assessment:**\n\n` +
        `• ATR (14): ₹45.20 - This is slightly elevated\n` +
        `• Bollinger Bands are widening, indicating increasing volatility\n` +
        `• Historical volatility (30-day): 28%\n\n` +
        `**Trading Implications:**\n` +
        `• Use wider stop-losses to avoid getting stopped out\n` +
        `• Reduce position size to manage risk\n` +
        `• Potential for larger price swings (both directions)\n` +
        `• Good for swing traders, challenging for scalpers`;
}

function generateTradingRecommendation(context?: MarketContext): string {
    const recommendations = [
        `🎯 **Current Setup: Cautiously Bullish**\n\n` +
        `Based on multiple timeframe analysis:\n` +
        `• Entry: ₹1,540-1,545 (near support)\n` +
        `• Stop-Loss: ₹1,520 (below recent low)\n` +
        `• Target 1: ₹1,580 (Risk:Reward 1:2)\n` +
        `• Target 2: ₹1,610 (Risk:Reward 1:3.5)\n\n` +
        `⚠️ Only enter if price shows strength above ₹1,545 with volume confirmation.`,

        `⏸️ **Recommendation: WAIT**\n\n` +
        `The current technical setup lacks conviction:\n` +
        `• Mixed signals from indicators\n` +
        `• Price in no-man's land between support/resistance\n` +
        `• Volume declining\n\n` +
        `💡 Better to wait for:\n` +
        `• Clear breakout/breakdown\n` +
        `• Volume confirmation\n` +
        `• Better risk:reward setup`,

        `📉 **Defensive Stance Recommended**\n\n` +
        `Current technicals suggest caution:\n` +
        `• If long: Consider trailing stop-loss at ₹1,530\n` +
        `• If short: Looking good, maintain position\n` +
        `• If cash: Wait for better entry\n\n` +
        `The trend is showing signs of weakness. Protect your capital.`
    ];

    return recommendations[Math.floor(Math.random() * recommendations.length)];
}

function generateScriptAdvice(): string {
    const advice = [
        `📝 **Pine Script Tips:**\n\n` +
        `When creating custom indicators, consider:\n\n` +
        `1. **Combine multiple indicators** - Don't rely on one signal\n2. **Add filters** - Use volume or volatility filters to reduce false signals\n` +
        `3. **Backtest thoroughly** - Test on different market conditions\n` +
        `4. **Keep it simple** - Complex doesn't mean better\n\n` +
        `Try adding a trend filter to your RSI strategy:\n` +
        `\`\`\`\ntrend = ta.ema(close, 50)\nbuy = rsi < 30 and close > trend\n\`\`\``,

        `💡 **Indicator Enhancement Idea:**\n\n` +
        `Your current script looks good! To improve it:\n\n` +
        `• Add **multi-timeframe analysis** (check higher timeframe trend)\n` +
        `• Include **volume confirmation** (signals are stronger with volume)\n` +
        `• Consider **volatility filters** (avoid trading in choppy markets)\n\n` +
        `Example: Only take signals when ATR > average ATR (trending markets).`
    ];

    return advice[Math.floor(Math.random() * advice.length)];
}

function generateGeneralInsight(query: string, context?: MarketContext): string {
    const insights = [
        `💡 **Market Insight:** Remember the golden rule - "The trend is your friend until it ends." Always trade with the overall market trend. Use multiple timeframe analysis to confirm your bias.`,

        `📊 **Technical Analysis Tip:** The best setups occur when multiple indicators align. Look for confluence between price action, volume, and technical indicators before entering a trade.`,

        `🎯 **Risk Management:** Never risk more than 1-2% of your capital on a single trade. Even the best setups can fail. Position sizing is more important than being right.`,

        `📈 **Pattern Recognition:** Keep a trading journal. Document your setups, entries, exits, and emotions. Patterns in your behavior are often more important than patterns in price.`,

        `⚠️ **Market Wisdom:** "Plan your trade and trade your plan." Set your entry, stop-loss, and targets BEFORE entering a position. Emotional decisions made mid-trade rarely end well.`
    ];

    if (context?.symbol) {
        return `Based on ${context.symbol.toUpperCase()}, ${insights[Math.floor(Math.random() * insights.length)]}`;
    }

    return insights[Math.floor(Math.random() * insights.length)];
}

// Helper functions
function calculateAverage(arr: number[]): number {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function calculateSimpleRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) return 50; // Not enough data

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
        const change = prices[i] - prices[i - 1];
        if (change > 0) gains += change;
        else losses += Math.abs(change);
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
}
