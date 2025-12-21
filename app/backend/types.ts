/*/
///
/*/

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