/*/ No ERROR handling
/// calculateCleanPerc (Returns SUM of data) Data is %
/*/
//IMPORT//
import axios from "axios"
import {ApiResponse, GenerationData,GenerationMix, ChartChunk, DailyStats, ChargingResponse} from './types';
import {format} from 'date-fns';
//IMPORT*/

//CONST//
const CLEAN_FUELS = ['biomass','nuclear','hydro','wind','solar'];
const API_URL = 'https://api.carbonintensity.org.uk/generation';
const FLOAT_DEC_LEN = 1
const FUEL_CONFIG: Record<string, { color: string; label: string }> = {
  biomass: { color: '#1697a0ff', label: 'Biomasa' },
  coal:    { color: '#1b1714ff', label: 'Węgiel' },
  imports: { color: '#ff0000ff', label: 'Import' },
  gas:     { color: '#ffc400ff', label: 'Gaz' },
  nuclear: { color: '#ad20ffff', label: 'Atom' },
  other:   { color: '#95a5a6', label: 'Inne' },
  hydro:   { color: '#0044ffff', label: 'Woda' },
  solar:   { color: 'rgba(246, 255, 120, 1)', label: 'Słońce' },
  wind:    { color: '#8dff0aff', label: 'Wiatr' }
};
const CACHE_TTL = 30*60*1000;
//CONST*/

//VAR//
//IN MEMORY CACHE
let storedData: GenerationData[] = [];
let lastFetchTime = 0;
//VAR*//


async function fetchEnergyData(startDate:Date,endDate:Date): Promise<GenerationData[]>
{
    console.log(`Fetching Data from External API: ${format(startDate,'yyyy-MM-dd')}<->${format(endDate,'yyyy-MM-dd')}`)
    const start = format(startDate, "yyyy-MM-dd'T'00:00'Z'");
    const end = format(endDate, "yyyy-MM-dd'T'23:55'Z'");
    const endpoint = `${API_URL}/${start}/${end}`;
    try{
    const response = await axios.get<ApiResponse>(endpoint);
    return response.data.data;
    }catch(error){
        console.error(error);
    }
    return []
};

export async function getEnergyData(startDate:Date,endDate:Date): Promise<GenerationData[]>
{
    const now = Date.now();
    if(storedData.length > 0 && (now-lastFetchTime)<CACHE_TTL)
    {
        console.log(`Data in cache(TS:${lastFetchTime}). Returning from memory`);
        return storedData;
    }
        lastFetchTime = now;
        storedData = await fetchEnergyData(startDate,endDate);
        return storedData
};

function calculateCleanPerc(mix: any[])
{
    return mix.reduce((sum,record) => {
        return CLEAN_FUELS.includes(record.fuel) ? sum + record.perc : sum;
    },0);//Last argument for array.reduce
};

function calculateDailyCleanPerc(dayData: GenerationData[])
{
    if (!dayData.length) return 0;
    const totalCleanSum = dayData.reduce((sum, interval) => {
        const partialCleanSum = calculateCleanPerc(interval.generationmix);
        return sum + partialCleanSum;
    },0);//Last argument for array.reduce

    return parseFloat((totalCleanSum/dayData.length).toFixed(FLOAT_DEC_LEN));
};

export function filterDataByDate(data: GenerationData[], dateObj: Date = new Date())
{
    const dateStr = format(dateObj,'yyyy-MM-dd')
    return data.filter(item=>item.from.startsWith(dateStr));
};

//ENDPOINT 2

export function findChargingWindow(data: GenerationData[],durationInHours: number): ChargingResponse | null
{
    if(durationInHours<0||durationInHours>6) return null;
    const windowSpan = Math.ceil(durationInHours)*2
    if(data.length<windowSpan) return null;

    const cleanPerc = data.map(bit => calculateCleanPerc(bit.generationmix));

    let currentWindowPerc = 0

    for (let i = 0; i < windowSpan; i++)
    {
        currentWindowPerc += cleanPerc[i];
    }

    let maxCleanEngPerc = currentWindowPerc;
    let bestStart = 0

    for (let i = 1; i <= cleanPerc.length - windowSpan; i++)
    {
        currentWindowPerc = currentWindowPerc - cleanPerc[i-1] + cleanPerc[i + windowSpan - 1];
        
        if (currentWindowPerc > maxCleanEngPerc)
        {
                maxCleanEngPerc = currentWindowPerc;
                bestStart = i;
        }
    }

    const avgCleanPerc = maxCleanEngPerc / windowSpan;
    const startDate = data[bestStart].from;
    const endDate = data[bestStart + windowSpan - 1].to;


    return {startDate,endDate,cleanPerc: parseFloat(avgCleanPerc.toFixed(FLOAT_DEC_LEN))}
}




// Frontend Data Prep
function aggregateDailyMixData(dayData:GenerationData[])
{
    if(!dayData.length) return [];

    const chartData: ChartChunk[] = []
    const fuelTotals: Record<string,number> = {};

    dayData.forEach(interval => {
        interval.generationmix.forEach(item =>{
            if(!fuelTotals[item.fuel]) fuelTotals[item.fuel] = 0;
            fuelTotals[item.fuel] += item.perc;
        });
    });

    for (const fuel in fuelTotals)
    {
        const avgPerc = fuelTotals[fuel]/dayData.length;
        if (avgPerc==0)continue;
        const config = FUEL_CONFIG[fuel] || {color: '#757575ff', label: fuel};
        chartData.push({id: fuel, label: config.label, value: parseFloat(avgPerc.toFixed(FLOAT_DEC_LEN)), color: config.color});
    }

    return chartData;
};

//Frontend Package Wrapper
export function wrapChartData(dayData: GenerationData[])
{
    return{
        cleanPerc: calculateDailyCleanPerc(dayData),
        mix: aggregateDailyMixData(dayData)
    };
};