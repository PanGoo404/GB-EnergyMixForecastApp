/*/ No ERROR handling
/// calculateCleanPerc (Returns SUM of data) Data is %
/*/
//IMPORT//
import axios from "axios"
import {ApiResponse, GenerationData} from './types.ts';
import {format} from 'date-fns';
//IMPORT*/

//CONST//
const CLEAN_FUELS = ['biomass','nuclear','hydro','wind','solar'];
const API_URL = 'https://api.carbonintensity.org.uk/generation';
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

export async function calculateCleanPerc(mix: any[])
{
    return mix.reduce((sum,record) => {
        return CLEAN_FUELS.includes(record.fuel) ? sum + record.perc : sum;
    },0);//Last argument for array.reduce
};

export async function filterDataByDate(data: GenerationData[], dateObj: Date = new Date())
{
    const dateStr = format(dateObj,'yyyy-MM-dd')
    return data.filter(item=>item.from.startsWith(dateStr));
};

