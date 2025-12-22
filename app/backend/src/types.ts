/*/ By rule of Domain Separation both EndPoint belong to the same domain <-> belong to the same service. 
/// No file separation.
///
/*/

//Backend Types
//ENDPOINT 1
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
//ENDPOINT 1
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

//ENPOINT 2
export interface ChargingRequest{
  durationInHours: number;
}

export interface ChargingResponse{
  startDate: string;
  endDate: string;
}