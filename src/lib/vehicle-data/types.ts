export interface VehicleFeatures {
  features: Record<
    string,
    {
      available: boolean;
      confidence: number;
      notes?: string;
    }
  >;
  trim_levels?: string[];
  standard_or_optional?: "standard" | "optional" | "varies_by_trim";
}

export interface EnrichmentResult {
  features: VehicleFeatures;
  cached: boolean;
  lastUpdated: Date;
}
