
export interface IndicatorResult {
    name: string;
    data: { time: number; value: number }[];
    color?: string;
}

export function executePineScript(code: string, data: any[]): { success: boolean; results?: IndicatorResult[]; error?: string } {
    try {
        const lines = code.split('\n');

        // Initialize all built-in variables
        const variables: Record<string, number[]> = {
            'close': data.map(d => d.close),
            'open': data.map(d => d.open),
            'high': data.map(d => d.high),
            'low': data.map(d => d.low),
            'volume': data.map(d => d.volume),
        };

        const timeStamps = data.map(d => d.time);
        const results: IndicatorResult[] = [];

        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('//') || trimmed === '' || trimmed.startsWith('indicator(')) continue;

            // Handle variable assignment: r = ta.rsi(close, 14)
            if (trimmed.includes('=') && !trimmed.startsWith('plot')) {
                const [varName, expression] = trimmed.split('=').map(s => s.trim());

                // Technical Indicators
                if (expression.startsWith('ta.rsi')) {
                    variables[varName] = parseAndCalculate('rsi', expression, variables);
                } else if (expression.startsWith('ta.sma')) {
                    variables[varName] = parseAndCalculate('sma', expression, variables);
                } else if (expression.startsWith('ta.ema')) {
                    variables[varName] = parseAndCalculate('ema', expression, variables);
                } else if (expression.startsWith('ta.macd')) {
                    variables[varName] = parseAndCalculate('macd', expression, variables);
                } else if (expression.startsWith('ta.bb')) {
                    variables[varName] = parseAndCalculate('bb', expression, variables);
                } else if (expression.startsWith('ta.atr')) {
                    variables[varName] = parseAndCalculate('atr', expression, variables);
                } else if (expression.startsWith('ta.stoch')) {
                    variables[varName] = parseAndCalculate('stoch', expression, variables);
                } else if (expression.startsWith('ta.wma')) {
                    variables[varName] = parseAndCalculate('wma', expression, variables);
                } else {
                    // Try to evaluate simple arithmetic expressions
                    variables[varName] = evaluateExpression(expression, variables);
                }
            }

            // Handle plot: plot(r, "RSI", color=color.purple)
            if (trimmed.startsWith('plot')) {
                const argsContent = trimmed.match(/plot\((.*)\)/)?.[1];
                if (argsContent) {
                    const args = parseArguments(argsContent);
                    const seriesName = args[0];
                    const title = args[1]?.replace(/['"]/g, '') || "Indicator";
                    const colorArg = args.find(a => a.startsWith('color='));
                    const color = parseColor(colorArg);

                    const seriesData = variables[seriesName];
                    if (seriesData) {
                        const plotData = seriesData.map((val, i) => ({
                            time: timeStamps[i],
                            value: val
                        })).filter(d => !isNaN(d.value));

                        results.push({
                            name: title,
                            data: plotData,
                            color: color
                        });
                    }
                }
            }
        }

        return { success: true, results };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

function parseArguments(argsStr: string): string[] {
    // Simple argument parser that handles quoted strings
    const args: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < argsStr.length; i++) {
        const char = argsStr[i];
        if ((char === '"' || char === "'") && (i === 0 || argsStr[i - 1] !== '\\')) {
            inQuotes = !inQuotes;
            current += char;
        } else if (char === ',' && !inQuotes) {
            args.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    if (current) args.push(current.trim());

    return args;
}

function parseColor(colorArg?: string): string {
    if (!colorArg) return '#2962FF';

    const colorValue = colorArg.split('=')[1].trim();
    const colorMap: Record<string, string> = {
        'color.purple': '#A020F0',
        'color.blue': '#2962FF',
        'color.red': '#FF0000',
        'color.green': '#00FF00',
        'color.orange': '#FFA500',
        'color.yellow': '#FFFF00',
        'color.aqua': '#00FFFF',
        'color.white': '#FFFFFF',
    };

    return colorMap[colorValue] || colorValue.replace('color.', '#');
}

function parseAndCalculate(funcName: string, expression: string, variables: Record<string, number[]>): number[] {
    const argsMatch = expression.match(/\(([^)]+)\)/);
    if (!argsMatch) return [];

    const args = argsMatch[1].split(',').map(s => s.trim());

    switch (funcName) {
        case 'rsi':
            return calculateRSI(variables[args[0]], parseInt(args[1]));
        case 'sma':
            return calculateSMA(variables[args[0]], parseInt(args[1]));
        case 'ema':
            return calculateEMA(variables[args[0]], parseInt(args[1]));
        case 'wma':
            return calculateWMA(variables[args[0]], parseInt(args[1]));
        case 'macd':
            return calculateMACD(variables[args[0]], parseInt(args[1] || '12'), parseInt(args[2] || '26'), parseInt(args[3] || '9'));
        case 'atr':
            return calculateATR(variables['high'], variables['low'], variables['close'], parseInt(args[0] || '14'));
        case 'stoch':
            return calculateStochastic(variables['high'], variables['low'], variables['close'], parseInt(args[0] || '14'), parseInt(args[1] || '3'));
        default:
            return [];
    }
}

function evaluateExpression(expr: string, variables: Record<string, number[]>): number[] {
    // Handle simple arithmetic: close * 2, (high + low) / 2, etc.
    try {
        const varNames = Object.keys(variables);
        const length = variables[varNames[0]]?.length || 0;
        const result: number[] = [];

        for (let i = 0; i < length; i++) {
            let evalExpr = expr;
            for (const varName of varNames) {
                const regex = new RegExp(`\\b${varName}\\b`, 'g');
                evalExpr = evalExpr.replace(regex, variables[varName][i]?.toString() || 'NaN');
            }

            try {
                result.push(eval(evalExpr));
            } catch {
                result.push(NaN);
            }
        }

        return result;
    } catch {
        return [];
    }
}

// Technical Indicator Calculations

function calculateSMA(data: number[], length: number): number[] {
    const sma = [];
    for (let i = 0; i < data.length; i++) {
        if (i < length - 1) {
            sma.push(NaN);
            continue;
        }
        let sum = 0;
        for (let j = 0; j < length; j++) {
            sum += data[i - j];
        }
        sma.push(sum / length);
    }
    return sma;
}

function calculateEMA(data: number[], length: number): number[] {
    const k = 2 / (length + 1);
    const ema = [];
    let prevEma = data[0];

    for (let i = 0; i < data.length; i++) {
        if (i === 0) {
            ema.push(data[0]);
        } else {
            prevEma = data[i] * k + prevEma * (1 - k);
            ema.push(prevEma);
        }
    }
    return ema;
}

function calculateWMA(data: number[], length: number): number[] {
    const wma = [];
    const denominator = (length * (length + 1)) / 2;

    for (let i = 0; i < data.length; i++) {
        if (i < length - 1) {
            wma.push(NaN);
            continue;
        }

        let sum = 0;
        for (let j = 0; j < length; j++) {
            sum += data[i - j] * (length - j);
        }
        wma.push(sum / denominator);
    }
    return wma;
}

function calculateRSI(data: number[], length: number): number[] {
    const rsi = [];
    const changes = [];

    for (let i = 1; i < data.length; i++) {
        changes.push(data[i] - data[i - 1]);
    }

    let avgGain = 0;
    let avgLoss = 0;

    for (let i = 0; i < length; i++) {
        if (changes[i] > 0) avgGain += changes[i];
        else avgLoss += Math.abs(changes[i]);
    }

    avgGain /= length;
    avgLoss /= length;

    for (let i = 0; i < length; i++) rsi.push(NaN);
    rsi.push(100 - (100 / (1 + avgGain / avgLoss)));

    for (let i = length + 1; i < data.length; i++) {
        const change = changes[i - 1];
        const gain = change > 0 ? change : 0;
        const loss = change < 0 ? Math.abs(change) : 0;

        avgGain = (avgGain * (length - 1) + gain) / length;
        avgLoss = (avgLoss * (length - 1) + loss) / length;

        rsi.push(100 - (100 / (1 + avgGain / avgLoss)));
    }

    return rsi;
}

function calculateMACD(data: number[], fast: number = 12, slow: number = 26, signal: number = 9): number[] {
    const fastEma = calculateEMA(data, fast);
    const slowEma = calculateEMA(data, slow);
    const macdLine = fastEma.map((val, i) => val - slowEma[i]);
    return macdLine;
}

function calculateATR(high: number[], low: number[], close: number[], length: number = 14): number[] {
    const tr = [];

    for (let i = 0; i < high.length; i++) {
        if (i === 0) {
            tr.push(high[i] - low[i]);
        } else {
            const hl = high[i] - low[i];
            const hc = Math.abs(high[i] - close[i - 1]);
            const lc = Math.abs(low[i] - close[i - 1]);
            tr.push(Math.max(hl, hc, lc));
        }
    }

    return calculateEMA(tr, length);
}

function calculateStochastic(high: number[], low: number[], close: number[], kLength: number = 14, dLength: number = 3): number[] {
    const k = [];

    for (let i = 0; i < close.length; i++) {
        if (i < kLength - 1) {
            k.push(NaN);
            continue;
        }

        let highestHigh = -Infinity;
        let lowestLow = Infinity;

        for (let j = 0; j < kLength; j++) {
            highestHigh = Math.max(highestHigh, high[i - j]);
            lowestLow = Math.min(lowestLow, low[i - j]);
        }

        const range = highestHigh - lowestLow;
        k.push(range > 0 ? ((close[i] - lowestLow) / range) * 100 : 50);
    }

    return calculateSMA(k, dLength);
}
