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

        if (volumeData) {
            const volumeSeries = chart.addSeries(HistogramSeries, {
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

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data, volumeData, indicators, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]);

    return (
        <div
            ref={chartContainerRef}
            className="w-full h-[500px] relative"
        />
    );
};
