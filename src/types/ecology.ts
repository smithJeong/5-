export interface SimulationParameters {
  is_night: boolean;
  rain: boolean;
  car_speed_kmh: number;
  lanes: number;
  initial_population: number;
}

export interface SimulationResults {
  survival_rate_baseline: number; // 0~100 (소수점 첫째자리)
  survival_rate_with_fence: number; // 0~100 (소수점 첫째자리)
  improvement_percentage: number; // difference
}

export interface PolicyRecommendation {
  target_location_recommendation: string;
  structure_spec: string;
  report_text: string;
}

export interface EcologyAnalysisResponse {
  scenario_summary: string;
  parameters: SimulationParameters;
  simulation_results: SimulationResults;
  policy_recommendation: PolicyRecommendation;
}

export type SpeciesType = 'toad' | 'frog' | 'salamander' | 'narrow_mouthed_toad' | 'beetle' | 'reptile';

export interface SpeciesInfo {
  id: SpeciesType;
  name: string;
  sciName: string;
  conservationStatus: string;
  typicalSeason: string;
  speedMultiplier: number;
  icon: string;
  color: string;
}

export interface HotspotLocation {
  id: string;
  name: string;
  region: string;
  coordinates: string; // GPS 37.xxx, 127.xxx
  species: string[];
  lanes: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE';
  fenceStatus: 'INSTALLED' | 'URGENT_REQUIRED' | 'PARTIAL';
  description: string;
  annualCrossingEstimate: number;
}
