export interface AdminSubCategoryRequest {
  name: string;
  category_id: number;
}

export interface AdminSubCategoryListRequest {
  category_id?: number;
}
