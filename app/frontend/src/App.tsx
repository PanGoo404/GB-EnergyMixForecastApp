//IMPORT//
import { useEffect, useState } from 'react';
import axios from 'axios';
import type { GraphsDataPack } from '../../backend/src/types';
import InfoCard from './components/InfoCard';
import ChargingCalculator from './components/ChargingCalculator';
import ErrorPopup from './components/ErrorPopUp';
import {ChartLegend} from './components/ChartLegend'
import {API_URL} from './config';
//IMPORT*/

function App() {
  //APP STATES
  const [data, setData] = useState<GraphsDataPack | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string|null>(null);

  useEffect(() => {
    axios.get<GraphsDataPack>(`${API_URL}/api/energy-mix`)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        setErrorMsg("Cant get data from server. Check server status");

      });
  }, []);

  return (
    <div className="container">

      {errorMsg && (
        <ErrorPopup 
          message={errorMsg} 
          onClose={() => setErrorMsg(null)}
        />
      )}

      <h1>Miks Energetyczny GB</h1>
      <section className="charts-section">
        <h2>Prognozowany Miks</h2>
        
        {loading && <p style={{textAlign: 'center'}}>Ładowanie danych...</p>}
        {data && <ChartLegend data={data} />}
        {data && (
          <div className="charts-grid">
            <InfoCard title="Dziś" stats={data.day0} />
            <InfoCard title="Jutro" stats={data.day1} />
            <InfoCard title="Pojutrze" stats={data.day2} />
          </div>
          )}
      </section>
      <section>
        <h2>Kalkulator ładowania EV</h2>
        <p style={{ marginBottom: '20px', color: '#4b5563' }}>
          Wyszukaj okno ładowania o największym udziale zielonej energii.
        </p>
        <ChargingCalculator onError={setErrorMsg} />
      </section>
    </div>
  );
}

export default App;