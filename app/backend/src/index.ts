/*/ no error handling
/// 
/*/

//IMPORT//
import express, {Request, Response} from 'express';
import cors from 'cors';
import {addDays, format} from 'date-fns'
import { wrapChartData, fetchEnergyData, filterDataByDate } from './services';
import { GraphsDataPack } from './types';
//IMPORT*/

const PORT = 3000;

const app = express();
app.use(cors());
app.use(express.json());


/*/ END POINT 1 - Energy Mix Disp
//Fetch API Data
//Sort Data by Date
//Determine Clean Perc
//Push Relative Data to Front
/*/

/*/ END POINT TEST - Energy Mix Disp
app.get('/', (req, res) => {
  res.send('Blank Test');
});
/*/

app.get('/api/energy-mix', async (req:Request, res: Response) => {
        const day0 = new Date();
        const day2 = addDays(day0,2);

        console.log(`Fetching Data from External API: ${format(day0,'yyyy-MM-dd')}<->${format(day2,'yyyy-MM-dd')}`)
        const bulkData = await fetchEnergyData(day0,day2);
        const result: GraphsDataPack = {
            day0 : wrapChartData(filterDataByDate(bulkData,day0)),
            day1 : wrapChartData(filterDataByDate(bulkData,addDays(day0,1))),
            day2 : wrapChartData(filterDataByDate(bulkData,addDays(day0,2)))
        }

        res.json(result);
});


/*/ END POINT 2 - Energy Mix Disp
//On Trigger --> Get Data from User
// Interval (Number)
//Find Optimal Charging Window
//Push Relative Data to Front
//Start,End (Date), CleanPerc (Number) 
/*/

app.listen(PORT, () => {
console.log(`Backend URL on Host: http://localhost:${PORT}`);
});