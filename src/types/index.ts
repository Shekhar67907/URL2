// src/types.ts

export interface FormState {
  selectedShifts: string[];  // Changed from string[] to match ShiftData
  material: string;
  operation: string;
  gauge: string;
  sampleSize: string;
  startDate: Date;
  endDate: Date;
}

export interface Shift {
  ShiftId: string;  // Changed from string to match API response
  ShiftName: string;
}

export interface Material {
  MaterialCode: string;
  MaterialName: string;
}

export interface Operation {
  OperationCode: string;
  OperationName: string;
}

export interface Gauge {
  GuageCode: string;
  GuageName: string;
}

export interface InspectionData {
  ShiftCode: string;  // Changed from string to match API response
  ActualSpecification: string;
  FromSpecification: string;
  ToSpecification: string;
}

export interface ChartPoint {
  x: number;
  y: number;
}

export interface DistributionData {
  data: { x: number; y: number }[];
  stats: {
    min: number;
    max: number;
    mean: number;
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
  controlCharts: {
    xBarData: { x: number; y: number }[];
    rangeData: { x: number; y: number }[];
    limits: ControlChartLimits;
  };
  distribution: {
    data: { x: number; y: number }[];
    stats: {
      min: number;
      max: number;
      mean: number;
      target: number;
      binEdges: number[];
    };
  };
  ssAnalysis: SSAnalysis;
  processInterpretation: ProcessInterpretation;
}