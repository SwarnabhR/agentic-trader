export function generateCandleData(numberOfCandles: number = 100) {
    const data = [];
    let time = new Date("2023-01-01").getTime() / 1000;
    let value = 100;

    for (let i = 0; i < numberOfCandles; i++) {
        const open = value + (Math.random() - 0.5) * 2;
        const high = open + Math.random() * 2;
        const low = open - Math.random() * 2;
        const close = (open + high + low) / 3 + (Math.random() - 0.5);

        value = close;
        time += 60 * 60 * 24; // 1 day

        data.push({
            time: time as any, // Lightweight charts expects specific time format
            open,
            high,
            low,
            close,
        });
    }
    return data;
}

export function generateVolumeData(candleData: any[]) {
    return candleData.map((candle) => ({
        time: candle.time,
        value: Math.random() * 1000000 + 500000,
        color: candle.close > candle.open ? '#26a69a' : '#ef5350',
    }));
}
