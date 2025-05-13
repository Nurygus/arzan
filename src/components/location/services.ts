import { LocationDAO } from "@/db/location";
import { ApiLocationResponse } from "@/types/response/location";

export class LocationServices {
  locationDAO: LocationDAO;
  constructor() {
    this.locationDAO = new LocationDAO();
  }

  list = async (): Promise<ApiLocationResponse[]> => {
    const result = await this.locationDAO.list();

    return result;
  };
}
