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
        <div className="input-group">
        <label style={{ fontWeight: 500 }}>Czas ładowania (h): </label>
        <input 
          type="number" 
          min="1" 
          max="6" 
          value={duration} 
          onChange={e => setDuration(Number(e.target.value))}
        />
        <button onClick={handleOptimizeTask} disabled={loading}>
          {loading ? 'Obliczanie...' : 'Znajdź najlepszy czas'}
        </button>
      </div>

      {result && (
        <div className="result-card" style={{ marginTop: '20px' }}>
          <h3 style={{ marginTop: 0, color: '#00791aff' }}>Znaleziono okno ładowania!</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
            <div>
              <small style={{ textTransform: 'uppercase', fontSize: '15px'}}>Start</small>
              <div style={{fontWeight: 'bold', fontSize: '1.2em', color: '#1f2937'}}>
                {result.startDate}
              </div>
            </div>
            
            <div>
              <small style={{ textTransform: 'uppercase', fontSize: '15px'}}>Koniec</small>
              <div style={{fontWeight: 'bold', fontSize: '1.2em', color: '#000000ff'}}>
                {result.endDate}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px #5db462ff' }}>
            Średnia Czysta Energia: <span style={{ color: '#039b3dff', fontWeight: '800', fontSize: '20px' }}>
              {result.cleanPerc}%
            </span>
          </div>
        </div>
      )}
    </div>
    );
};

export default ChargingCalculator