export interface AdminUserRequest {
  name: string;
  password: string;
  phone: string;
  type: string;
  email?: string;
  start_time?: Date;
  end_time?: Date;
  location_id: string;
}

export interface AdminUserListRequest {
  name?: string;
  type?: string;
  location_id?: string;
  limit?: number;
  offset?: number;
}
