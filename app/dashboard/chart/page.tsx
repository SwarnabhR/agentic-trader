"use client";

import { FinancialChart } from "@/components/charts/FinancialChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ScriptEditorDialog } from "@/components/ScriptEditorDialog";
import { getAllScripts, SavedScript, deleteScript } from "@/lib/scriptStorage";
import { executePineScript, IndicatorResult } from "@/lib/pineEngine";
import { Plus, Trash2, Edit, Eye, EyeOff } from "lucide-react";

export default function ChartPage() {
    const [data, setData] = useState<any[]>([]);
    const [volumeData, setVolumeData] = useState<any[]>([]);
    const [symbol, setSymbol] = useState("RELIANCE");
    const [interval, setInterval] = useState("1d");
    const [isLoading, setIsLoading] = useState(false);

    const intervals = [
        { label: "1m", value: "1m" },
        { label: "15m", value: "15m" },
        { label: "30m", value: "30m" },
        { label: "1h", value: "1h" },
        { label: "1d", value: "1d" },
        { label: "1W", value: "1wk" },
        { label: "1M", value: "1mo" },
    ];

    // Script management
    const [scripts, setScripts] = useState<SavedScript[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingScript, setEditingScript] = useState<SavedScript | undefined>();
    const [activeScripts, setActiveScripts] = useState<Set<string>>(new Set());
    const [indicators, setIndicators] = useState<IndicatorResult[]>([]);

    useEffect(() => {
        setScripts(getAllScripts());
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/stock/${symbol}?interval=${interval}`);
                const result = await response.json();

                if (Array.isArray(result)) {
                    setData(result);
                    setVolumeData(result.map((item: any) => ({
                        time: item.time,
                        value: item.volume,
                        color: item.close > item.open ? '#26a69a' : '#ef5350',
                    })));
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [symbol, interval]);

    // Re-calculate indicators when data or active scripts change
    useEffect(() => {
        if (data.length === 0) return;

        const allIndicators: IndicatorResult[] = [];
        scripts.forEach(script => {
            if (activeScripts.has(script.id)) {
                const result = executePineScript(script.code, data);
                if (result.success && result.results) {
                    allIndicators.push(...result.results);
                }
            }
        });
        setIndicators(allIndicators);
    }, [data, activeScripts, scripts]);

    const handleNewScript = () => {
        setEditingScript(undefined);
        setDialogOpen(true);
    };

    const handleEditScript = (script: SavedScript) => {
        setEditingScript(script);
        setDialogOpen(true);
    };

    const handleDeleteScript = (id: string) => {
        deleteScript(id);
        setScripts(getAllScripts());
        setActiveScripts(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
        });
    };

    const toggleScript = (id: string) => {
        setActiveScripts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleScriptSaved = () => {
        setScripts(getAllScripts());
    };

    return (
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Advanced Charting</h2>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center bg-card/50 border border-white/10 rounded-md p-1">
                            {intervals.map((int) => (
                                <button
                                    key={int.value}
                                    onClick={() => setInterval(int.value)}
                                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${interval === int.value
                                            ? "bg-blue-600 text-white"
                                            : "text-muted-foreground hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    {int.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={symbol}
                                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                                className="bg-background border border-input rounded px-3 py-1 text-sm w-32"
                                placeholder="Symbol"
                            />
                            <button
                                className="bg-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                                disabled={isLoading}
                            >
                                {isLoading ? "Loading..." : "Update"}
                            </button>
                        </div>
                    </div>
                </div>

                <Card className="border-blue-900/20 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="border-b border-white/5 p-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-medium">{symbol}.NS - NSE India</CardTitle>
                            <div className="text-sm text-muted-foreground">
                                {intervals.find(i => i.value === interval)?.label} Interval
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <FinancialChart data={data} volumeData={volumeData} indicators={indicators} />
                    </CardContent>
                </Card>
            </div>

            {/* Script Management Panel */}
            <div className="space-y-4">
                <Card className="border-blue-900/20 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="border-b border-white/5 p-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-medium">Indicators</CardTitle>
                            <Button size="sm" onClick={handleNewScript}>
                                <Plus className="h-4 w-4 mr-1" />
                                New
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        {scripts.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                No scripts yet. Create one to get started!
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {scripts.map(script => (
                                    <div
                                        key={script.id}
                                        className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-background/50"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm truncate">{script.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {new Date(script.updatedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 ml-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0"
                                                onClick={() => toggleScript(script.id)}
                                            >
                                                {activeScripts.has(script.id) ? (
                                                    <Eye className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <EyeOff className="h-4 w-4" />
                                                )}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0"
                                                onClick={() => handleEditScript(script)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0"
                                                onClick={() => handleDeleteScript(script.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <ScriptEditorDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                script={editingScript}
                onSave={handleScriptSaved}
            />
        </div>
    );
}
