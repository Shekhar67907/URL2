"use client";

import { useState, useEffect } from "react";
import { subDays } from "date-fns";
import { 
  ControlCharts,
  Histogram,
  AnalysisCards
} from "@/components/spc/ChartComponent";
import { useSPCData } from "@/hooks/useSPCdata";
import { analyzeData } from "@/lib/spcUtils";
import { AnalysisData } from "@/types";
import { ControlPanel } from "@/components/spc/ControlPanel";
import { MetricCard } from "@/components/spc/MetricCards";

export default function SPCDashboardPage() {
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedShifts, setSelectedShifts] = useState<number[]>([]);
  const [material, setMaterial] = useState<string>("");
  const [operation, setOperation] = useState<string>("");
  const [gauge, setGauge] = useState<string>("");
  
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const { shifts, materials, operations, gauges, error: dataError } = useSPCData({
    startDate,
    endDate,
    selectedShifts,
    material,
    operation
  });

  useEffect(() => {
    if (shifts.length > 0 && selectedShifts.length === 0) {
      setSelectedShifts(shifts.map(shift => Number(shift.ShiftId)));
    }
  }, [shifts, selectedShifts]);

  const handleShiftToggle = (shiftId: number) => {
    setSelectedShifts(prev => 
      prev.includes(shiftId)
        ? prev.filter(id => id !== shiftId)
        : [...prev, shiftId]
    );
  };

  const handleAnalyze = async () => {
    if (!material || !operation || !gauge) {
      setAnalysisError("Please select all required parameters");
      return;
    }

    setLoading(true);
    setAnalysisError(null);

    try {
      const result = await analyzeData({
        startDate,
        endDate,
        selectedShifts,
        material,
        operation,
        gauge
      });

      if (result) {
        setAnalysisData(result);
      } else {
        setAnalysisError("Analysis failed. Please check your parameters and try again.");
      }
    } catch (error) {
      setAnalysisError("An error occurred during analysis");
      console.error(error);
    } finally {
      setLoading(false);
      setDownloading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Statistical Process Control Dashboard</h1>
      
      <ControlPanel
        startDate={startDate}
        endDate={endDate}
        selectedShifts={selectedShifts}
        material={material}
        operation={operation}
        gauge={gauge}
        error={dataError || analysisError}
        loading={loading}
        downloading={downloading}
        hasAnalysisData={!!analysisData}
        shifts={shifts}
        materials={materials}
        operations={operations}
        gauges={gauges}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onShiftToggle={handleShiftToggle}
        onMaterialChange={setMaterial}
        onOperationChange={setOperation}
        onGaugeChange={setGauge}
        onAnalyze={handleAnalyze}
      />
      
      {analysisData && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
          <MetricCard metrics={analysisData.metrics} />
          <ControlCharts chartData={analysisData.controlCharts} />
          <Histogram 
            data={analysisData.distribution.data}
            stats={analysisData.distribution.stats}
            lsl={analysisData.metrics.lsl}
            usl={analysisData.metrics.usl}
          />
          <AnalysisCards 
            ssAnalysis={analysisData.ssAnalysis}
            processInterpretation={analysisData.processInterpretation}
          />
        </div>
      )}
    </div>
  );
}