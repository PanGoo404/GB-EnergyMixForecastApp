//IMPORT//
import { useEffect, useState } from 'react';
import axios from 'axios';
import type { GraphsDataPack } from '../../backend/src/types';
import InfoCard from './components/InfoCard';
//IMPORT*/

function App() {
  const [data, setData] = useState<GraphsDataPack | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios.get<GraphsDataPack>('http://localhost:3000/api/energy-mix')
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      <h1>Miks Energetyczny GB</h1>
      <section className="charts-section">
        <h2>Prognozowany Miks</h2>
        
        {loading && <p style={{textAlign: 'center'}}>Ładowanie danych...</p>}

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
      </section>
    </div>
  );
}

export default App;