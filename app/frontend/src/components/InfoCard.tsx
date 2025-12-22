/*Component Encapsulating Single Day Data
// 
// ! Need to add CSS styles
*/

//IMPORT//
import type { DailyStats } from '../../../backend/src/types';
import EnergyChart from './EnergyChart';
//IMPORT*/

interface Props {
    title: string;
    stats: DailyStats;
}

const InfoCard = ({ title, stats }: Props) => {
return (
    <div style={{ 
      background: '#ffffff',
      borderRadius: '10px', 
      padding: '20px', 
      flex: '1',
      minWidth: '200px',
      maxWidth: '300px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>

      <h3 style={{ 
        margin: '0 0 10px 0', 
        fontSize: '30px',
        textTransform: 'uppercase' 
      }}>{title}</h3>

      <div style={{ 
          fontSize: '40px', 
          color: '#059669'
        }}>{stats.cleanPerc}%</div>

        <div style={{ 
          fontSize: '20px', 
          marginTop: '10px',
          textTransform: 'uppercase'
        }}>czystej energii</div>

      <div style={{ width: '100%', marginBottom: '-20px' }}>
        <EnergyChart data={stats.mix} />
      </div>
      <div style={{ 
        textAlign: 'center', 
        transform: 'translateY(-15px)'
      }}>
      </div>
    </div>
);
};

export default InfoCard;