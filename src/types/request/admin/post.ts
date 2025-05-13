export interface AdminPostRequest {
  user_id: number;
  title: string;
  description: string;
  phone: string;
  price: string;
  discount: string;
  tags: string;
  category_id: number;
  sub_category_id: number;
  start_date: string;
  end_date: string;
}

export interface AdminPostListRequest {
  category_id?: number;
  sub_category_id?: number;
  publication_type_id?: number;
  title?: string;
  description?: string;
  query?: string;
  sort?: string;
  order?: string;
  limit?: number;
  offset?: number;
}

export interface AdminPostApproveRequest {
  approve: boolean;
}

export interface AdminPostSetPublicationTypeRequest {
  id: number;
  publication_type_id: number;
}

export interface AdminPostGetPublicationTypeRequest {
  id: number;
}

export interface AdminPostDeleteRequest {
  id: number;
}

export interface AdminPostUpdateRequest {
  post_id: number;
  title?: string;
  description?: string;
  phone?: string;
  price?: string;
  discount?: string;
  tags?: string;
  category_id?: number;
  sub_category_id?: number;
  start_date?: string;
  end_date?: string;
  images?: string[];
}
