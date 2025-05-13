export interface AdminSetFollowRewardRequest {
  subscription_type_id: number;
  location_id: number;
  coin_amount: number;
}

export interface AdminGetFollowRewardRequest {
  subscription_type_id: number;
  location_id: number;
}

export interface AdminListFollowRewardRequest {
  subscription_type_id?: number;
  location_id?: number;
  sort?: string;
  order?: string;
}

export interface AdminSetTopListLimitRequest {
  name: string;
  limit_count: number;
}

export interface AdminListTopListLimitRequest {}

export interface AdminDeleteUserRequest {
  id: number;
}

export interface AdminUserDayStreakCoinRewardSetRequest {
  day_id: number;
  coin_amount: number;
}
