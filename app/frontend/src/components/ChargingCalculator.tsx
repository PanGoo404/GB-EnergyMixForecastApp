import {useState} from 'react';
import axios from 'axios';
import type { ChargingResponse } from '../../../backend/src/types';
import {API_URL} from '../config';

interface Props{
    onError: (msg: string) => void;
}

const ChargingCalculator = ({onError}: Props) =>{
    const [duration, setDuration] = useState<number>(2);
    const [result, setResult] = useState<ChargingResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const handleOptimizeTask = async () => {
        setLoading(true);
        setResult(null);

        try{
            const payload = {durationInHours: duration};
            const response = await axios.post<ChargingResponse>(`${API_URL}/api/optimize`,payload);

            setResult(response.data);
        }catch(error: any){
            console.error(error);
            const errorMsg = error.response?.data?.error || "Serwer nie odpowiada"
            onError(errorMsg);
        }finally{
            setLoading(false)
        }
    };

    return(
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '20px' }}>
        <label style={{ fontWeight: 600, fontSize: '1.1rem' }}>
          Czas ładowania (h):
        </label>
        
        <input 
          type="number" 
          min="1" 
          max="6" 
          value={duration} 
          onChange={e => setDuration(Number(e.target.value))}
          style={{
            padding: '8px 12px',
            fontSize: '16px',
            width: '80px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            textAlign: 'center'
          }}
        />
        
        <button 
          onClick={handleOptimizeTask} 
          disabled={loading}
          style={{
            padding: '8px 20px',
            fontSize: '16px',
            borderRadius: '6px',
            cursor: 'pointer',
            backgroundColor: '#009637ff',
            color: 'white',
            border: 'none'
          }}
        >
          {loading ? 'Obliczanie...' : 'Znajdź okienko ładowania.'}
        </button>
      </div>

      {result && (
        <div style={{
          marginTop: '24px',
          backgroundColor: '#ffffffff',
          border: '1px solid rgba(0, 0, 0, 1)',
          borderRadius: '8px',
          padding: '16px'
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            color: '#009637ff',
            textAlign: 'center',
            fontSize: '18px'
          }}>
            Znaleziono najlepsze okno!
          </h3>
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ textTransform: 'uppercase', fontSize: '20px', color: '#000000ff', marginBottom: '4px' }}>
                Start
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '1.3em', color: '#1f2937' }}>
                {result.startDate}
              </div>
            </div>
            <div>
              <div style={{ textTransform: 'uppercase', fontSize: '20px', color: '#000000ff', marginBottom: '4px' }}>
                Koniec
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '1.3em', color: '#1f2937' }}>
                {result.endDate}
              </div>
            </div>
            <div>
              <div style={{ textTransform: 'uppercase', fontSize: '20px', color: '#000000ff', marginBottom: '4px' }}>
                Czysta Energia
              </div>
              <div style={{ fontWeight: '800', fontSize: '1.3em', color: '#009637ff' }}>
                {result.cleanPerc}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    );
};

export default ChargingCalculator