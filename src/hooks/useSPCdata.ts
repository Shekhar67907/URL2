import { useState, useEffect } from "react";
import { format } from "date-fns";
import { 
  ShiftData, 
  MaterialData, 
  OperationData, 
  GuageData
} from "@/types/spc";

interface UseSPCDataParams {
  startDate: Date;
  endDate: Date;
  selectedShifts: string[];
  material: string;
  operation: string;
}

interface LoadingState {
  shifts: boolean;
  materials: boolean;
  operations: boolean;
  gauges: boolean;
}

export function useSPCData({ 
  startDate, 
  endDate, 
  selectedShifts, 
  material, 
  operation 
}: UseSPCDataParams) {
  const [shifts, setShifts] = useState<ShiftData[]>([]);
  const [materials, setMaterials] = useState<MaterialData[]>([]);
  const [operations, setOperations] = useState<OperationData[]>([]);
  const [gauges, setGauges] = useState<GuageData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<LoadingState>({
    shifts: false,
    materials: false,
    operations: false,
    gauges: false
  });

  // Fetch shifts
  useEffect(() => {
    const fetchShifts = async () => {
      setIsLoading(prev => ({ ...prev, shifts: true }));
      try {
        const response = await fetch('/api/commonappservices/getshiftdatalist');
        if (!response.ok) throw new Error('Failed to fetch shifts');
        const data = await response.json();
        setShifts(data);
        setError(null);
      } catch (err) {
        setError('Failed to load shifts');
        console.error(err);
      } finally {
        setIsLoading(prev => ({ ...prev, shifts: false }));
      }
    };
    fetchShifts();
  }, []);

  // Fetch materials
  useEffect(() => {
    const fetchMaterials = async () => {
      if (!startDate || !endDate || selectedShifts.length === 0) {
        setMaterials([]);
        return;
      }
      
      setIsLoading(prev => ({ ...prev, materials: true }));
      try {
        const params = new URLSearchParams({
          FromDate: format(startDate, 'dd/MM/yyyy'),
          ToDate: format(endDate, 'dd/MM/yyyy'),
          ShiftId: selectedShifts.join(',')
        });

        const response = await fetch(`/api/productionappservices/getspcmateriallist?${params}`);
        if (!response.ok) throw new Error('Failed to fetch materials');
        const data = await response.json();
        setMaterials(data);
        setError(null);
      } catch (err) {
        setError('Failed to load materials');
        console.error(err);
      } finally {
        setIsLoading(prev => ({ ...prev, materials: false }));
      }
    };
    fetchMaterials();
  }, [startDate, endDate, selectedShifts]);

  // Fetch operations
  useEffect(() => {
    const fetchOperations = async () => {
      if (!material || !startDate || !endDate || selectedShifts.length === 0) {
        setOperations([]);
        return;
      }

      setIsLoading(prev => ({ ...prev, operations: true }));
      try {
        const params = new URLSearchParams({
          FromDate: format(startDate, 'dd/MM/yyyy'),
          ToDate: format(endDate, 'dd/MM/yyyy'),
          MaterialCode: material,
          ShiftId: selectedShifts.join(',')
        });

        const response = await fetch(`/api/productionappservices/getspcoperationlist?${params}`);
        if (!response.ok) throw new Error('Failed to fetch operations');
        const data = await response.json();
        setOperations(data);
        setError(null);
      } catch (err) {
        setError('Failed to load operations');
        console.error(err);
      } finally {
        setIsLoading(prev => ({ ...prev, operations: false }));
      }
    };
    fetchOperations();
  }, [material, startDate, endDate, selectedShifts]);

  // Fetch gauges
  useEffect(() => {
    const fetchGauges = async () => {
      if (!operation || !material || !startDate || !endDate || selectedShifts.length === 0) {
        setGauges([]);
        return;
      }

      setIsLoading(prev => ({ ...prev, gauges: true }));
      try {
        const params = new URLSearchParams({
          FromDate: format(startDate, 'dd/MM/yyyy'),
          ToDate: format(endDate, 'dd/MM/yyyy'),
          MaterialCode: material,
          OperationCode: operation,
          ShiftId: selectedShifts.join(',')
        });

        const response = await fetch(`/api/productionappservices/getspcguagelist?${params}`);
        if (!response.ok) throw new Error('Failed to fetch gauges');
        const data = await response.json();
        setGauges(data);
        setError(null);
      } catch (err) {
        setError('Failed to load gauges');
        console.error(err);
      } finally {
        setIsLoading(prev => ({ ...prev, gauges: false }));
      }
    };
    fetchGauges();
  }, [operation, material, startDate, endDate, selectedShifts]);

  return {
    shifts,
    materials,
    operations,
    gauges,
    error,
    isLoading
  };
}