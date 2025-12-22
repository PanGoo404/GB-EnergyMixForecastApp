/*/ No ERROR handling
/// calculateCleanPerc (Returns SUM of data) Data is %
/*/
//IMPORT//
import axios from "axios"
import {ApiResponse, GenerationData,GenerationMix, ChartChunk, DailyStats} from './types';
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
//CONST*/

export async function fetchEnergyData(startDate:Date,endDate:Date): Promise<GenerationData[]>
{
    console.log("API request")
    const start = format(startDate, "yyyy-MM-dd'T'00:00'Z'");
    const end = format(endDate, "yyyy-MM-dd'T'23:55'Z'");
    const endpoint = `${API_URL}/${start}/${end}`;
    const response = await axios.get<ApiResponse>(endpoint);
    return response.data.data;
};

export function calculateCleanPerc(mix: any[])
{
    return mix.reduce((sum,record) => {
        return CLEAN_FUELS.includes(record.fuel) ? sum + record.perc : sum;
    },0);//Last argument for array.reduce
};

export function calculateDailyCleanPerc(dayData: GenerationData[])
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

export function aggregateDailyMixData(dayData:GenerationData[])
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

export function wrapChartData(dayData: GenerationData[])
{
    return{
        cleanPerc: calculateDailyCleanPerc(dayData),
        mix: aggregateDailyMixData(dayData)
    };
};