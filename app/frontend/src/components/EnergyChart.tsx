
//IMPORT//
import {PieChart, Pie, Cell, Tooltip, ResponsiveContainer} from 'recharts';
import type {ChartChunk} from '../../../backend/src/types';
//IMPORT*/

interface Props {
    data: ChartChunk[];
}

const EnergyChart = ({data}: Props) => {
return(
    <div style={{ width: '100%', height: '220px', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data as any}
            dataKey="value"
            nameKey="label"
            cx="50%" cy="50%"
            outerRadius={90}
          >
            {data.map((entry) => (
              <Cell key={entry.id} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any) => `${value}%`}
            contentStyle={{ borderRadius: '10px', border: '5px #000000ff' }}
          />
        </PieChart>
      </ResponsiveContainer>
      </div>
    </div>
);
};

export default EnergyChart;