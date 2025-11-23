"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Play, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { executePineScript, IndicatorResult } from "@/lib/pineEngine";
import { FinancialChart } from "@/components/charts/FinancialChart";

export default function EditorPage() {
    const [code, setCode] = useState(`//@version=5
indicator("RSI")
r = ta.rsi(close, 14)
plot(r, "RSI", color=color.purple)`);
    const [output, setOutput] = useState<string>("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [chartData, setChartData] = useState<any[]>([]);
    const [indicators, setIndicators] = useState<IndicatorResult[]>([]);

    useEffect(() => {
        // Fetch default data for preview
        const fetchData = async () => {
            try {
                const res = await fetch('/api/stock/RELIANCE.NS');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setChartData(data);
                }
            } catch (e) {
                console.error("Failed to fetch preview data", e);
            }
        };
        fetchData();
    }, []);

    const handleRun = () => {
        setStatus("idle");
        setOutput("Compiling...");

        setTimeout(() => {
            const result = executePineScript(code, chartData);

            if (result.success && result.results) {
                setStatus("success");
                setOutput(`Compilation successful! Generated ${result.results.length} plot(s).`);
                setIndicators(result.results);
            } else {
                setStatus("error");
                setOutput(`Error: ${result.error || "Unknown error"}`);
                setIndicators([]);
            }
        }, 500);
    };

    return (
        <div className="grid h-[calc(100vh-8rem)] gap-6 lg:grid-cols-2">
            <Card className="flex flex-col border-blue-900/20 bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 py-3">
                    <CardTitle className="text-base font-medium">Script Editor</CardTitle>
                    <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onClick={handleRun}>
                            <Play className="mr-2 h-4 w-4" /> Run
                        </Button>
                        <Button size="sm">
                            <Save className="mr-2 h-4 w-4" /> Save
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="h-full w-full resize-none bg-transparent p-4 font-mono text-sm outline-none"
                        spellCheck={false}
                    />
                </CardContent>
            </Card>

            <div className="flex flex-col gap-6">
                <Card className="flex-1 border-blue-900/20 bg-card/50 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="border-b border-white/5 py-3">
                        <CardTitle className="text-base font-medium">Preview & Console</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex flex-col h-full">
                        <div className="p-4 border-b border-white/5">
                            <div className={`flex items-center gap-2 text-sm ${status === "success" ? "text-green-400" :
                                status === "error" ? "text-red-400" : "text-muted-foreground"
                                }`}>
                                {status === "success" && <CheckCircle2 className="h-4 w-4" />}
                                {status === "error" && <AlertCircle className="h-4 w-4" />}
                                {output || "Ready to compile..."}
                            </div>
                        </div>
                        <div className="flex-1 relative min-h-[300px]">
                            {chartData.length > 0 ? (
                                <FinancialChart
                                    data={chartData}
                                    indicators={indicators}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    Loading preview data...
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

