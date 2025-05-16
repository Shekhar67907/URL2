// Consolidate all types here
import { format } from "date-fns";

export interface FormState {
  selectedShifts: number[];
  material: string;
  operation: string;
  gauge: string;
  sampleSize: string;
  startDate: Date;
  endDate: Date;
}

export interface ShiftData {
  ShiftId: number;
  ShiftName: string;
}

export interface MaterialData {
  MaterialCode: string;
  MaterialName: string;
}

export interface OperationData {
  OperationCode: string;
  OperationName: string;
}

export interface GuageData {
  GuageCode: string;
  GuageName: string;
}

export interface InspectionData {
  ShiftCode: string;
  ActualSpecification: string;
  FromSpecification: string;
  ToSpecification: string;
}

export interface ChartPoint {
  x: number;
  y: number;
}

export interface DistributionData {
  data: ChartPoint[];
  stats: {
    min: number;
    max: number;
    mean: number;
    stdDev: number;
    target: number;
    binEdges: number[];
  };
}

export interface ControlChartLimits {
  xBarUcl: number;
  xBarMean: number;
  xBarLcl: number;
  rangeUcl: number;
  rangeMean: number;
  rangeLcl: number;
  Agostinho: number;
}

export interface ControlCharts {
  xBarData: ChartPoint[];
  rangeData: ChartPoint[];
  limits: ControlChartLimits;
}

export interface Metrics {
  xBar: number;
  stdDevOverall: number;
  stdDevWithin: number;
  avgRange: number;
  cp: number;
  cpu: number;
  cpl: number;
  cpk: number;
  pp: number;
  ppu: number;
  ppl: number;
  ppk: number;
  lsl: number;
  usl: number;
  target: number;
}

export interface SSAnalysis {
  pointsOutsideLimits: string;
  rangePointsOutsideLimits: string;
  eightConsecutivePoints: string;
  sixConsecutiveTrend: string;
  processShift: string;
  processSpread: string;
  specialCausePresent: string;
}

export interface ProcessInterpretation {
  decisionRemark: string;
  processPotential: string;
  processPerformance: string;
  processStability: string;
  processShift: string;
}

export interface AnalysisData {
  metrics: Metrics;
  controlCharts: ControlCharts;
  distribution: DistributionData;
  ssAnalysis: SSAnalysis;
  processInterpretation: ProcessInterpretation;
}