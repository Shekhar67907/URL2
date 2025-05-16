// src/types/spc.ts
import { 
  Metrics,
  SSAnalysis,
  ProcessInterpretation,
  ShiftData,
  MaterialData,
  OperationData,
  GuageData,
  InspectionData,
  AnalysisData
} from './index';

// Re-export types from index.ts
export type {
  Metrics as ProcessMetrics,
  SSAnalysis,
  ProcessInterpretation,
  ShiftData,
  MaterialData,
  OperationData,
  GuageData,
  InspectionData,
  AnalysisData
};

// Additional SPC-specific types
export interface ChartDataPoint {
  x: number;
  y: number;
}

export interface ControlChartData {
  xBarData: ChartDataPoint[];
  rangeData: ChartDataPoint[];
  limits: {
    xBarUcl: number;
    xBarLcl: number;
    xBarMean: number;
    rangeUcl: number;
    rangeLcl: number;
    rangeMean: number;
  };
}