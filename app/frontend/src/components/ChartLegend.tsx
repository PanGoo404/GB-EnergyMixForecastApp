import type { ChartChunk, GraphsDataPack } from "../../../backend/src/types";
import {useMemo} from 'react';

interface ChartLegendProps {
  data: GraphsDataPack | null;
}

export const ChartLegend = ({ data }: ChartLegendProps) => {
  
  const legendItems = useMemo(() => {
    if (!data) return [];

    const uniqueItemsMap = new Map<string, ChartChunk>();

    const processMix = (mix: ChartChunk[]) => {
        mix.forEach(chunk => {
        if (!uniqueItemsMap.has(chunk.label)) {
          uniqueItemsMap.set(chunk.label, chunk);
        }
      });
    };

    processMix(data.day0.mix);
    processMix(data.day1.mix);
    processMix(data.day2.mix);

    return Array.from(uniqueItemsMap.values());
  }, [data]);

  if (!data || legendItems.length === 0){
    throw new Error("Brak danych dla Legendy.");
  }

  return (
    <div style={{ 
      display: 'flex', 
      gap: '15px', 
      justifyContent: 'center', 
      marginBottom: '30px', 
      flexWrap: 'wrap',
      padding: '10px',
      backgroundColor: '#ffffffff',
      borderRadius: '8px'
    }}>
      {legendItems.map((item) => (
        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            borderRadius: '50%', 
            backgroundColor: item.color 
          }}></div>
          <span style={{ 
            fontSize: '15px', 
            fontWeight: 500, 
            color: '#000000ff' 
          }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};