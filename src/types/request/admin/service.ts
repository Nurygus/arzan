export interface serviceLocationData {
  id: number;
  cost?: number;
  month_cost?: number;
}

export interface AdminServiceRequest {
  name: string;
  cost: number;
  count?: boolean;
  month?: boolean;
  month_cost?: number;
  location_costs?: serviceLocationData[];
}
