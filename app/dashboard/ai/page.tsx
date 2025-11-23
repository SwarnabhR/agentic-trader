"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { askAI } from "@/lib/aiService";
import { Bot, Send, User, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

interface Message {
    role: "user" | "ai";
    content: string;
}

export default function AIPage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: "ai", content: "Hello! I'm your AI market analyst. I can analyze stocks, interpret technical indicators, and help with your trading strategies. Try asking me about a specific stock or technical pattern!" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [currentSymbol, setCurrentSymbol] = useState("RELIANCE");
    const [stockData, setStockData] = useState<any[]>([]);

    // Fetch stock data for context
    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const response = await fetch(`/api/stock/${currentSymbol}`);
                const data = await response.json();
                if (Array.isArray(data)) {
                    setStockData(data);
                }
            } catch (error) {
                console.error("Failed to fetch stock data", error);
            }
        };

        fetchStockData();
    }, [currentSymbol]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user" as const, content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // Extract symbol if mentioned in query
            const symbolMatch = input.match(/\b([A-Z]{2,10})\b/);
            if (symbolMatch && symbolMatch[1] !== currentSymbol) {
                setCurrentSymbol(symbolMatch[1]);
            }

            const response = await askAI(input, {
                symbol: currentSymbol,
                priceData: stockData,
                currentPrice: stockData[stockData.length - 1]?.close
            });

            setMessages((prev) => [...prev, { role: "ai", content: response }]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [...prev, {
                role: "ai",
                content: "I encountered an error. Please try again."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickQuestion = (question: string) => {
        setInput(question);
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
            {/* Quick Actions */}
            <div className="flex gap-2 flex-wrap">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickQuestion(`Analyze ${currentSymbol} for me`)}
                    className="text-xs"
                >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Analyze {currentSymbol}
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickQuestion("What are the current RSI levels?")}
                    className="text-xs"
                >
                    RSI Analysis
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickQuestion("Should I buy or sell?")}
                    className="text-xs"
                >
                    Trading Signal
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickQuestion("Give me support and resistance levels")}
                    className="text-xs"
                >
                    Key Levels
                </Button>
            </div>

            <Card className="flex-1 border-blue-900/20 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col">
                <CardHeader className="border-b border-white/5 py-3">
                    <CardTitle className="text-base font-medium flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                            <Bot className="h-5 w-5 text-blue-400" /> AI Analyst
                        </div>
                        <div className="text-xs font-normal text-muted-foreground">
                            Analyzing: {currentSymbol}.NS
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-hidden">
                    <ScrollArea className="h-full p-4">
                        <div className="space-y-4">
                            {messages.map((m, i) => (
                                <div
                                    key={i}
                                    className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    {m.role === "ai" && (
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-900/50 text-blue-400">
                                            <Bot className="h-5 w-5" />
                                        </div>
                                    )}
                                    <div
                                        className={`rounded-lg px-4 py-2 max-w-[80%] whitespace-pre-wrap ${m.role === "user"
                                            ? "bg-blue-600 text-white"
                                            : "bg-white/10 text-foreground"
                                            }`}
                                    >
                                        {m.content}
                                    </div>
                                    {m.role === "user" && (
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                                            <User className="h-5 w-5" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-900/50 text-blue-400">
                                        <Bot className="h-5 w-5" />
                                    </div>
                                    <div className="rounded-lg px-4 py-2 bg-white/10 text-foreground">
                                        <span className="animate-pulse">Analyzing market data...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
                <div className="p-4 border-t border-white/5 bg-background/50">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend();
                        }}
                        className="flex gap-2"
                    >
                        <Input
                            placeholder="Ask about RELIANCE trends, indicators, or get trading signals..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="bg-background/50"
                        />
                        <Button type="submit" size="icon" disabled={isLoading}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}
