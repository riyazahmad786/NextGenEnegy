export interface Consumption {
  percentage: number;
  totalReading: number;
  chartData: any[];
}

export interface ConsumptionData {
  electric: Consumption;
  gas: Consumption;
  water: Consumption;
}

// Initialize default consumption data
export const defaultConsumptionData: ConsumptionData = {
  electric: { percentage: 0, totalReading: 0, chartData: [] },
  gas: { percentage: 0, totalReading: 0, chartData: [] },
  water: { percentage: 0, totalReading: 0, chartData: [] },
};
