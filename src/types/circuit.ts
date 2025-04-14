
export type Component = {
  id: string;
  type: "resistor" | "capacitor" | "inductor" | "voltage" | "current";
  value: number;
  unit: string;
};

export interface CircuitAnalysisResult {
  totalResistance: number;
  current?: number;
  totalCurrent?: number;
  totalPower: number;
  voltageDrops?: {
    id: string;
    voltage: number;
    current: number;
  }[];
  branchCurrents?: {
    id: string;
    current: number;
    voltage: number;
  }[];
  powerConsumption: {
    id: string;
    power: number;
  }[];
}
