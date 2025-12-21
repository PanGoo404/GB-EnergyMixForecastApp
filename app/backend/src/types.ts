/*/
///
/*/

//Backend Types
export interface GenerationMix {
  fuel: string;
  perc: number;
}

export interface GenerationData {
  from: string;
  to: string;
  generationmix: GenerationMix[];
}

export interface ApiResponse {
  data: GenerationData[];
}

//Frontend exchange types
export interface ChartChunk{
  id: string
  label: string
  value: number
  color: string
}

export interface DailyStats{
  cleanPerc: number;
  mix: ChartChunk[];
}

export interface GraphsDataPack{
day0: DailyStats,
day1: DailyStats,
day2: DailyStats
}