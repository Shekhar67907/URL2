"use client";

import { useState } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, Filter, Loader2 } from "lucide-react";
import { FormState } from "@/types";
import { useSPCData } from "@/hooks/useSPCdata";

// Sample sizes with corresponding control chart constants
const sampleSizes = [
  { value: "1", label: "1", A2: 2.66, D3: 0, D4: 3.267 },
  { value: "2", label: "2", A2: 1.88, D3: 0, D4: 3.267 },
  { value: "3", label: "3", A2: 1.772, D3: 0, D4: 2.574 },
  { value: "4", label: "4", A2: 0.796, D3: 0, D4: 2.282 },
  { value: "5", label: "5", A2: 0.691, D3: 0, D4: 2.114 },
];

interface AnalysisFormProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  onAnalyze: (formData: FormState) => void;
  loading: boolean;
  error: string | null;
}

export default function AnalysisForm({
  formState,
  setFormState,
  onAnalyze,
  loading,
  error,
}: AnalysisFormProps) {
  // Use the consolidated hook for data fetching
  const {
    shifts,
    materials,
    operations,
    gauges,
    error: fetchError,
    isLoading: {
      shifts: isLoadingShifts,
      materials: isLoadingMaterials,
      operations: isLoadingOperations,
      gauges: isLoadingGauges
    }
  } = useSPCData({
    startDate: formState.startDate,
    endDate: formState.endDate,
    selectedShifts: formState.selectedShifts,
    material: formState.material,
    operation: formState.operation
  });

  // Event handlers
  const handleShiftToggle = (shiftId: number) => {
    const updatedShifts = formState.selectedShifts.includes(shiftId)
      ? formState.selectedShifts.filter((id) => id !== shiftId)
      : [...formState.selectedShifts, shiftId];

    setFormState({
      ...formState,
      selectedShifts: updatedShifts,
    });
  };

  const handleDateChange = (field: "startDate" | "endDate", date: Date) => {
    setFormState({
      ...formState,
      [field]: date,
    });
  };

  const handleFieldChange = (
    field: "material" | "operation" | "gauge" | "sampleSize",
    value: string
  ) => {
    setFormState({
      ...formState,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    try {
      onAnalyze(formState);
    } catch (err) {
      console.error(err);
    }
  };

  const renderDatePicker = (label: string, field: "startDate" | "endDate", selected: Date) => (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal text-sm h-9"
            size="sm"
          >
            {format(selected, "PPP")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(date) => date && handleDateChange(field, date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );

  const formIsValid =
    formState.selectedShifts.length > 0 &&
    formState.material &&
    formState.operation &&
    formState.gauge &&
    formState.sampleSize;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            <div>
              <CardTitle>Analysis Parameters</CardTitle>
              <CardDescription>Select process data to analyze</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            {(error || fetchError) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm"
              >
                {error || fetchError}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {/* Date range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderDatePicker("Start Date", "startDate", formState.startDate)}
              {renderDatePicker("End Date", "endDate", formState.endDate)}
            </div>

            {/* Shifts */}
            <div className="space-y-1">
              <Label className="text-xs">Shifts</Label>
              {isLoadingShifts ? (
                <div className="text-sm text-gray-500">Loading shifts...</div>
              ) : (
                <div className="flex flex-wrap gap-2 mt-1">
                  {shifts.map((shift) => (
                    <div
                      key={shift.ShiftId}
                      className="flex items-center space-x-1"
                    >
                      <Checkbox
                        id={`shift-${shift.ShiftId}`}
                        checked={formState.selectedShifts.includes(shift.ShiftId)}
                        onCheckedChange={() => handleShiftToggle(shift.ShiftId)}
                        className="h-3 w-3"
                      />
                      <Label
                        htmlFor={`shift-${shift.ShiftId}`}
                        className="text-xs"
                      >
                        {shift.ShiftName}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Material */}
              <div className="space-y-1">
                <Label className="text-xs">Material</Label>
                <Select
                  disabled={isLoadingMaterials || materials.length === 0}
                  value={formState.material}
                  onValueChange={(value) => handleFieldChange("material", value)}
                >
                  <SelectTrigger className="w-full h-9 text-sm">
                    <SelectValue placeholder="Select Material" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingMaterials ? (
                      <div className="text-sm text-gray-500 p-2">
                        Loading materials...
                      </div>
                    ) : (
                      materials.map((m) => (
                        <SelectItem
                          key={m.MaterialCode}
                          value={m.MaterialCode.toString()}
                          className="text-sm"
                        >
                          {m.MaterialName}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Operation */}
              <div className="space-y-1">
                <Label className="text-xs">Operation</Label>
                <Select
                  disabled={isLoadingOperations || operations.length === 0}
                  value={formState.operation}
                  onValueChange={(value) => handleFieldChange("operation", value)}
                >
                  <SelectTrigger className="w-full h-9 text-sm">
                    <SelectValue placeholder="Select Operation" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingOperations ? (
                      <div className="text-sm text-gray-500 p-2">
                        Loading operations...
                      </div>
                    ) : (
                      operations.map((o) => (
                        <SelectItem
                          key={o.OperationCode}
                          value={o.OperationCode.toString()}
                          className="text-sm"
                        >
                          {o.OperationName}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Gauge */}
              <div className="space-y-1">
                <Label className="text-xs">Gauge</Label>
                <Select
                  disabled={isLoadingGauges || gauges.length === 0}
                  value={formState.gauge}
                  onValueChange={(value) => handleFieldChange("gauge", value)}
                >
                  <SelectTrigger className="w-full h-9 text-sm">
                    <SelectValue placeholder="Select Gauge" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingGauges ? (
                      <div className="text-sm text-gray-500 p-2">
                        Loading gauges...
                      </div>
                    ) : (
                      gauges.map((g) => (
                        <SelectItem
                          key={g.GuageCode}
                          value={g.GuageCode.toString()}
                          className="text-sm"
                        >
                          {g.GuageName}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Sample Size */}
              <div className="space-y-1">
                <Label className="text-xs">Sample Size</Label>
                <Select
                  value={formState.sampleSize}
                  onValueChange={(value) => handleFieldChange("sampleSize", value)}
                >
                  <SelectTrigger className="w-full h-9 text-sm">
                    <SelectValue placeholder="Sample Size" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleSizes.map((size) => (
                      <SelectItem
                        key={size.value}
                        value={size.value}
                        className="text-sm"
                      >
                        {size.label} (A2: {size.A2}, D3: {size.D3}, D4: {size.D4})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action button */}
            <div className="pt-2">
              <Button
                className="w-full sm:w-auto h-9"
                onClick={handleSubmit}
                disabled={loading || !formIsValid}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Analyze Data
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}