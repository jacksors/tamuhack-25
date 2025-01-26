export type VehicleType =
  | "SUV"
  | "Sedan"
  | "Minivan"
  | "Truck"
  | "Hybrid/Electric"
  | "Sports";

export interface OnboardingData {
  vehicleTypes: VehicleType[];
  otherVehicleType?: string;
  usage?: string[];
  priorities?: string[];
  features?: string[];
  fuelPreference?: string;
  passengerCount?: number;
  paymentPlan?: {
    type: string;
    budget?: number;
    monthlyPayment?: number;
    creditScore?: string;
    downPayment?: number;
  };
  location?: string;
}
