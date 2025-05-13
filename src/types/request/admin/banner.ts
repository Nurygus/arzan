export interface AdminBannerCreateRequest {
  title: string;
  description: string;
  url: string;
  start_date: Date;
  end_date: Date;
  image: string;
  platform_id: number;
  page_category_ids: number[];
  location_ids: number[];
}

export interface AdminBannerEditRequest {
  id: number;
  title?: string;
  description?: string;
  url?: string;
  start_date?: Date;
  end_date?: Date;
  image?: string;
  platform_id?: number;
  page_category_ids?: number[];
  location_ids?: number[];
}

export interface AdminBannerGetRequest {
  id: number;
}

export interface AdminBannerDeleteRequest {
  id: number;
}

export interface AdminBannerListRequest {
  platform?: number;
  location?: number;
  page_category?: number;
}
