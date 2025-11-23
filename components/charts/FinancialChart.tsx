"use client";

import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickSeries, HistogramSeries, LineSeries } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

interface FinancialChartProps {
    data: any[];
    volumeData?: any[];
    indicators?: {
        name: string;
        data: { time: number; value: number }[];
        color?: string;
    }[];
    colors?: {
        backgroundColor?: string;
        lineColor?: string;
        textColor?: string;
        areaTopColor?: string;
        areaBottomColor?: string;
    };
}

export const FinancialChart: React.FC<FinancialChartProps> = ({
    data,
    volumeData,
    indicators,
    colors: {
        backgroundColor = 'transparent',
        lineColor = '#2962FF',
        textColor = '#D9D9D9',
        areaTopColor = '#2962FF',
        areaBottomColor = 'rgba(41, 98, 255, 0.28)',
    } = {},
}) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const [tooltipData, setTooltipData] = React.useState<{
        time: string;
        open: string;
        high: string;
        low: string;
        close: string;
        volume: string;
        change: string;
        changeColor: string;
    } | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const handleResize = () => {
            chartRef.current?.applyOptions({ width: chartContainerRef.current!.clientWidth });
        };

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor,
            },
            width: chartContainerRef.current.clientWidth,
            height: 500,
            grid: {
                vertLines: { color: 'rgba(197, 203, 206, 0.1)' },
                horzLines: { color: 'rgba(197, 203, 206, 0.1)' },
            },
            timeScale: {
                borderColor: 'rgba(197, 203, 206, 0.1)',
            },
            rightPriceScale: {
                borderColor: 'rgba(197, 203, 206, 0.1)',
            },
            crosshair: {
                // Enable crosshair but we'll use our own tooltip
                vertLine: {
                    width: 1,
                    color: 'rgba(224, 227, 235, 0.1)',
                    style: 0,
                },
                horzLine: {
                    visible: true,
                    labelVisible: true,
                },
            },
        });

        chartRef.current = chart;

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });

        candlestickSeries.setData(data);

        let volumeSeries: any = null;
        if (volumeData) {
            volumeSeries = chart.addSeries(HistogramSeries, {
                priceFormat: {
                    type: 'volume',
                },
                priceScaleId: '',
            });

            volumeSeries.priceScale().applyOptions({
                scaleMargins: {
                    top: 0.8,
                    bottom: 0,
                },
            });

            volumeSeries.setData(volumeData);
        }

        if (indicators) {
            indicators.forEach(ind => {
                const lineSeries = chart.addSeries(LineSeries, {
                    color: ind.color || '#2962FF',
                    lineWidth: 2,
                    title: ind.name,
                    priceScaleId: 'right2', // Use a separate price scale for indicators
                });
                lineSeries.setData(ind.data as any);

                // Configure the indicator scale to not interfere with main price
                lineSeries.priceScale().applyOptions({
                    scaleMargins: {
                        top: 0.8, // Indicator at bottom 20% of chart
                        bottom: 0,
                    },
                });
            });
        }

        // Subscribe to crosshair move for tooltip
        chart.subscribeCrosshairMove(param => {
            if (
                param.point === undefined ||
                !param.time ||
                param.point.x < 0 ||
                param.point.x > chartContainerRef.current!.clientWidth ||
                param.point.y < 0 ||
                param.point.y > chartContainerRef.current!.clientHeight
            ) {
                setTooltipData(null);
            } else {
                // Get data for the current logical index
                const dataPoint = param.seriesData.get(candlestickSeries) as any;
                if (dataPoint) {
                    const open = dataPoint.open;
                    const close = dataPoint.close;
                    const high = dataPoint.high;
                    const low = dataPoint.low;
                    const change = ((close - open) / open) * 100;

                    let volume = '';
                    if (volumeSeries) {
                        const volData = param.seriesData.get(volumeSeries) as any;
                        if (volData) {
                            volume = volData.value.toLocaleString();
                        }
                    }

                    const dateStr = new Date(dataPoint.time * 1000).toLocaleString();

                    setTooltipData({
                        time: dateStr,
                        open: open.toFixed(2),
                        high: high.toFixed(2),
                        low: low.toFixed(2),
                        close: close.toFixed(2),
                        volume: volume,
                        change: change.toFixed(2) + '%',
                        changeColor: change >= 0 ? '#26a69a' : '#ef5350'
                    });
                }
            }
        });

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data, volumeData, indicators, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]);

    return (
        <div
            ref={chartContainerRef}
            className="w-full h-[500px] relative group"
        >
            {tooltipData && (
                <div className="absolute top-2 left-2 z-20 bg-background/80 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-lg text-xs pointer-events-none">
                    <div className="flex flex-col gap-1">
                        <div className="text-muted-foreground font-mono">{tooltipData.time}</div>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                                <span className="text-muted-foreground">O</span>
                                <span className="font-mono text-blue-400">{tooltipData.open}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-muted-foreground">H</span>
                                <span className="font-mono text-blue-400">{tooltipData.high}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-muted-foreground">L</span>
                                <span className="font-mono text-blue-400">{tooltipData.low}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-muted-foreground">C</span>
                                <span className="font-mono text-blue-400">{tooltipData.close}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-muted-foreground">Vol</span>
                                <span className="font-mono text-yellow-400">{tooltipData.volume}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-muted-foreground">Chg</span>
                                <span className="font-mono" style={{ color: tooltipData.changeColor }}>
                                    {tooltipData.change}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
