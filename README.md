# Agentic Trader 📊

AI-powered stock market analysis platform with Pine Script support, real-time charting, and intelligent market insights.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## 🌟 Features

### 📈 Real-Time Market Data
- Live stock data from NSE/BSE via Yahoo Finance API
- Interactive candlestick charts with volume indicators
- Support for any Indian stock symbol

### 📝 Pine Script Engine
- **Custom Indicator Support**: Write and execute Pine Script indicators
- **Built-in Technical Indicators**:
  - Moving Averages (SMA, EMA, WMA)
  - Momentum Indicators (RSI, MACD, Stochastic)
  - Volatility Indicators (ATR)
- **Arithmetic Expressions**: Create complex calculations
- **Script Management**: Save, edit, and toggle indicators with popup editor

### 🤖 AI Market Analyst
- Intelligent market analysis with context awareness
- Technical indicator interpretation
- Trading signals and recommendations
- Support/Resistance level identification
- Educational insights and risk management tips

### 🎨 Modern UI/UX
- Dark theme with glassmorphism effects
- Responsive design for all devices
- Real-time chart updates
- Intuitive Pine Script editor with dialog popup

## 🚀 Getting Started

### Prerequisites
- Node.js 22.x or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/SwarnabhR/agentic-trader.git
cd agentic-trader
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Viewing Live Charts
1. Go to `/dashboard/chart`
2. Enter a stock symbol (e.g., RELIANCE, TATASTEEL)
3. Click "Update" to load real-time data

### Creating Pine Script Indicators
1. Click "New" in the Indicators panel
2. Name your indicator
3. Write Pine Script code (see examples below)
4. Click "Save Script"
5. Toggle the eye icon to show/hide on chart

#### Example Scripts

**RSI Indicator:**
```pinescript
//@version=5
indicator("RSI")
r = ta.rsi(close, 14)
plot(r, "RSI", color=color.purple)
```

**Moving Average Crossover:**
```pinescript
//@version=5
indicator("MA Cross")
fast = ta.sma(close, 20)
slow = ta.sma(close, 50)
plot(fast, "Fast MA", color=color.blue)
plot(slow, "Slow MA", color=color.red)
```

**MACD:**
```pinescript
//@version=5
indicator("MACD")
macd = ta.macd(close, 12, 26, 9)
plot(macd, "MACD", color=color.blue)
```

### Using AI Insights
1. Go to `/dashboard/ai`
2. Use quick action buttons or ask questions
3. Get intelligent market analysis with context

**Example Questions:**
- "Analyze RELIANCE for me"
- "What are the current RSI levels?"
- "Should I buy or sell?"
- "Give me support and resistance levels"

## 🛠️ Tech Stack

- **Framework**: Next.js 16.0.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: lightweight-charts
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Data Source**: yahoo-finance2
- **Icons**: Lucide React

## 📂 Project Structure

```
agentic-trader/
├── app/
│   ├── api/stock/[symbol]/    # Stock data API routes
│   ├── dashboard/
│   │   ├── ai/                # AI insights page
│   │   ├── chart/             # Interactive charts
│   │   └── editor/            # Pine Script editor (legacy)
│   └── page.tsx               # Landing page
├── components/
│   ├── charts/                # Chart components
│   ├── ui/                    # Reusable UI components
│   └── ScriptEditorDialog.tsx # Pine Script popup editor
├── lib/
│   ├── aiService.ts           # AI analysis engine
│   ├── pineEngine.ts          # Pine Script interpreter
│   └── scriptStorage.ts       # localStorage management
└── docs/                      # Documentation
```

## 🎯 Roadmap

- [ ] LLM Integration (OpenAI/Anthropic/Gemini)
- [ ] User authentication
- [ ] Portfolio tracking
- [ ] Backtesting engine
- [ ] Alert notifications
- [ ] Mobile app

## 📝 Pine Script Support

See [docs/pine-script-support.md](docs/pine-script-support.md) for complete documentation on supported features.

### Supported Indicators
✅ SMA, EMA, WMA  
✅ RSI, MACD  
✅ ATR, Stochastic  
✅ Custom arithmetic expressions  

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## ⚠️ Disclaimer

This software is for educational and informational purposes only. It is not financial advice. Always do your own research and consult with a qualified financial advisor before making investment decisions.

## 🙏 Acknowledgments

- [TradingView](https://www.tradingview.com/) for inspiration
- [Yahoo Finance](https://finance.yahoo.com/) for market data
- [lightweight-charts](https://github.com/tradingview/lightweight-charts) for charting library

---

**Built with ❤️ by [SwarnabhR](https://github.com/SwarnabhR)**

**Repository**: [github.com/SwarnabhR/agentic-trader](https://github.com/SwarnabhR/agentic-trader)
