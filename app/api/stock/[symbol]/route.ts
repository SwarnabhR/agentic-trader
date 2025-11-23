import { NextRequest, NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ symbol: string }> }
) {
    const symbol = (await params).symbol;

    // Append .NS if not present, assuming NSE by default for Indian context
    const querySymbol = symbol.toUpperCase().endsWith(".NS") || symbol.toUpperCase().endsWith(".BO")
        ? symbol.toUpperCase()
        : `${symbol.toUpperCase()}.NS`;

    try {
        const queryOptions = { period1: "2024-01-01", interval: "1d" }; // Fetch data from start of 2024
        const result = await yahooFinance.chart(querySymbol, queryOptions as any);
        const quotes = result.quotes as any[];

        const formattedData = quotes.map((quote: any) => ({
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
