import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ symbol: string }> }
) {
    const symbol = (await params).symbol;
    const searchParams = request.nextUrl.searchParams;
    const interval = searchParams.get("interval") || "1d";
    const range = searchParams.get("range");

    // Append .NS if not present, assuming NSE by default for Indian context
    const querySymbol = symbol.toUpperCase().endsWith(".NS") || symbol.toUpperCase().endsWith(".BO")
        ? symbol.toUpperCase()
        : `${symbol.toUpperCase()}.NS`;

    try {
        // Determine start date (period1) based on interval
        const now = new Date();
        let pastDate = new Date();

        switch (interval) {
            case "1m":
                pastDate.setDate(now.getDate() - 7); // Max 7 days for 1m
                break;
            case "2m":
            case "5m":
            case "15m":
            case "30m":
            case "90m":
                pastDate.setDate(now.getDate() - 59); // Max 60 days for intraday (use 59 to be safe)
                break;
            case "1h":
                pastDate.setDate(now.getDate() - 729); // Max 730 days for 1h
                break;
            case "1d":
            case "5d":
            case "1wk":
            case "1mo":
            case "3mo":
                pastDate.setFullYear(now.getFullYear() - 5); // 5 years for daily+
                break;
            default:
                pastDate.setFullYear(now.getFullYear() - 1);
        }

        const queryOptions = {
            period1: pastDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
            interval: interval as any,
        };

        const result = await yahooFinance.chart(querySymbol, queryOptions);
        const quotes = result.quotes as any[];

        if (!quotes || quotes.length === 0) {
            return NextResponse.json([]);
        }

        const formattedData = quotes
            .filter(quote => quote.date && quote.open !== null && quote.close !== null) // Filter invalid candles
            .map((quote: any) => ({
                time: new Date(quote.date).getTime() / 1000,
                open: quote.open,
                high: quote.high,
                low: quote.low,
                close: quote.close,
                volume: quote.volume,
            }));

        return NextResponse.json(formattedData);
    } catch (error) {
        console.error("Error fetching stock data for symbol:", querySymbol, error);
        return NextResponse.json(
            { error: "Failed to fetch stock data", details: (error as Error).message },
            { status: 500 }
        );
    }
}
