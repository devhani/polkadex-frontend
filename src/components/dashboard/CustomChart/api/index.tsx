import stream, { createNewPromiseforInitialData } from './stream';

const supportedResolutions = ["1", "3", "5", "15", "30", "60", "120", "240", "D"]

const config = {
    supported_resolutions: supportedResolutions
};
let lastBarsCache = new Map();

export default {
    onReady: cb => {
        console.log('=====onReady running')
        setTimeout(() => cb(config), 0)
    },

    searchSymbols: async (userInput, exchange, symbolType, onResultReadyCallback) => {
        console.log('====Search Symbols running')
    },

    resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
        // expects a symbolInfo object in response
        console.log('======resolveSymbol running')
        // console.log('resolveSymbol:',{symbolName})
        const split_data = symbolName.split(/[:/]/)
        // console.log({split_data})
        const symbol_stub = {
            name: symbolName,
            description: '',
            type: 'crypto',
            session: '24x7',
            timezone: 'Etc/UTC',
            ticker: symbolName,
            exchange: split_data[0],
            minmov: 1,
            pricescale: 100,
            has_intraday: true,
            intraday_multipliers: ['1', '60'],
            supported_resolution: supportedResolutions,
            volume_precision: 8,
            data_status: 'streaming',
            pricescale: 100
        }

        onSymbolResolvedCallback(symbol_stub)
    },

    getBars: async (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) => {
        console.log('=====getBars running')
        // console.log("Requested From Time: ", from, " and To Time: ", to)
        if (firstDataRequest) {
            // Create a promise and wait for that promise to resolve
            const cloudBars = await createNewPromiseforInitialData(); // Assign the array coming from initial-graph-data here.
            const bars = [];
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            let lastBar;
            cloudBars.forEach(bar => {
                let newbar;
                if (typeof (lastBar) === "undefined"){
                    lastBar = bar
                    newbar = {
                        ...bar,
                        time: bar.date*1000,
                    }
                }else{
                    if (bar.open === 0 && bar.close === 0 && bar.high === 0 && bar.low === 0 && bar.volume === 0) {
                        newbar = {
                            ...lastBar,
                            time: bar.date*1000,
                            volume: 0
                        }
                    }else{
                        newbar = {
                            ...bar,
                            time: bar.date*1000,
                        }
                    }
                }
                bars.push(newbar);
            });
            console.log("Symbol Info: ",symbolInfo.full_name)
            lastBarsCache.set(symbolInfo.full_name, {
                ...bars[bars.length - 1],
            });
            console.log("Bars: ",bars)
            console.log(`[getBars]: returned ${bars.length} bar(s)`);
            onHistoryCallback(bars, {
                noData: false,
            });
        }else{
            onHistoryCallback(lastBarsCache, {
                noData: false,
            });
        }
    },

    subscribeBars: async (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
        console.log('=====subscribeBars runnning')
        stream.subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback,lastBarsCache.get(symbolInfo.full_name));
    },

    unsubscribeBars: subscriberUID => {
        console.log('=====unsubscribeBars running')
        stream.unsubscribeBars(subscriberUID);
    },

    calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
        //optional
        console.log('=====calculateHistoryDepth running')
        // while optional, this makes sure we request 24 hours of minute data at a time
        // CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no data
        return resolution < 60 ? {resolutionBack: 'D', intervalBack: '1'} : undefined
    },
}
