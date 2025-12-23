/*/ no error handling
/// 
/*/

//IMPORT//
import express, {Request, Response} from 'express';
import cors from 'cors';
import {addDays, format} from 'date-fns'
import { wrapChartData, fetchEnergyData, filterDataByDate, getEnergyData, findChargingWindow } from './services';
import { ChargingRequest, GraphsDataPack } from './types';
//IMPORT*/

//ENV CONFIG//
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const ALLOWED_ORIGIN = process.env.CLIENT_URL || 'http://localhost:5173'

const app = express();
app.use(cors({
  origin: [ALLOWED_ORIGIN,'http://localhost:5173','http://127.0.0.1:5173'],
  methods: ['GET','POST'],
  credentials: true
}));
app.use(express.json());
//ENV CONFIG*/

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

        console.log(`API Data Requested`)
        const bulkData = await getEnergyData(day0,day2);
        const result: GraphsDataPack = {
            day0 : wrapChartData(filterDataByDate(bulkData,day0)),
            day1 : wrapChartData(filterDataByDate(bulkData,addDays(day0,1))),
            day2 : wrapChartData(filterDataByDate(bulkData,addDays(day0,2)))
        }

        res.json(result);
});
//END POINT 1 */


/*/ END POINT 2 - Energy Mix Disp
//On Trigger --> Get Data from User
// Interval (Number)
//Find Optimal Charging Window
//Push Relative Data to Front
//Start,End (Date), CleanPerc (Number) 
/*/

app.post('/api/optimize', async (req:Request, res: Response) =>{
  try{
    const body = req.body as ChargingRequest;
    const duration = body.durationInHours;

    if (!duration||duration<=0||duration>6)
    {
      res.status(400).json({error: "Podaj liczbę pełnych godzin z zakresu 1-6!"})
      return;
    }
    const day0 = new Date();
    const day2 = addDays(day0,2)
    const data = await getEnergyData(day0,day2);
    const result = findChargingWindow(data,duration);
    if (result){
      res.json(result);
    }
    else{
      res.status(400).json({error: "Nie znaleziono optymalnego okna ładowania."})
    }
  }catch(error){
    console.error("ERROR@/api/optimize:",error);
    res.status(500).json({error: "Błąd Serwera"});
  }

});
//END POINT 2 */


app.listen(PORT, '0.0.0.0',() => {
console.log(`Backend URL on Host: http://localhost:${PORT}`);
});