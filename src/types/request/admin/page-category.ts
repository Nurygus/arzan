export interface AdminPageCategoryCreateRequest {
  page_id: number;
  category_name: string;
  image?: string;
}

export interface AdminPageCategoryEditRequest {
  page_category_id: number;
  page_id?: number;
  category_name?: string;
  image?: string;
}

export interface AdminPageCategoryDeleteRequest {
  id: number;
}
export interface AdminPageCategoryGetRequest {
  id: number;
}
export interface AdminPageCategoryListRequest {
  page_id?: number;
}

export interface AdminPageListRequest {}

export interface AdminCategoryListRequest {}
