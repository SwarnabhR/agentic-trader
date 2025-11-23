# Supported Pine Script Features

## Built-in Variables
All standard price and volume variables are supported:
- `close` - Closing price
- `open` - Opening price
- `high` - High price
- `low` - Low price
- `volume` - Trading volume

## Technical Indicators

### Trend Indicators
- `ta.sma(source, length)` - Simple Moving Average
- `ta.ema(source, length)` - Exponential Moving Average
- `ta.wma(source, length)` - Weighted Moving Average
- `ta.macd(source, fast, slow, signal)` - MACD

### Momentum Indicators
- `ta.rsi(source, length)` - Relative Strength Index
- `ta.stoch(high, low, close, kLength, dLength)` - Stochastic Oscillator

### Volatility Indicators
- `ta.atr(length)` - Average True Range

## Arithmetic Expressions
You can use arithmetic expressions with variables:
```pinescript
avg_price = (high + low) / 2
double_close = close * 2
price_range = high - low
```

## Color Support
Available colors for plots:
- `color.purple`, `color.blue`, `color.red`, `color.green`
- `color.orange`, `color.yellow`, `color.aqua`, `color.white`

## Example Scripts

### Moving Average Crossover
```pinescript
//@version=5
indicator("MA Cross")
fast = ta.sma(close, 20)
slow = ta.sma(close, 50)
plot(fast, "Fast MA", color=color.blue)
plot(slow, "Slow MA", color=color.red)
```

### RSI with Levels
```pinescript
//@version=5
indicator("RSI")
rsi = ta.rsi(close, 14)
plot(rsi, "RSI", color=color.purple)
```

### MACD
```pinescript
//@version=5
indicator("MACD")
macd = ta.macd(close, 12, 26, 9)
plot(macd, "MACD", color=color.blue)
```

### Average True Range
```pinescript
//@version=5
indicator("ATR")
atr = ta.atr(14)
plot(atr, "ATR", color=color.orange)
```
