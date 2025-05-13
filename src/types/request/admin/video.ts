export interface AdminVideoCreateRequest {
  user_id: number;
  title: string;
  page_category_ids: number[];
  thumbnail: string;
  video: string;
}

export interface AdminVideoEditRequest {
  id: number;
  user_id?: number;
  title?: string;
  page_category_ids?: number[];
  thumbnail?: string;
}

export interface AdminVideoGetRequest {
  id: number;
}

export interface AdminVideoDeleteRequest {
  id: number;
}

export interface AdminVideoListRequest {
  user_id?: number;
  page_category_id?: number;
  publication_type_id?: number;
  query?: string;
  sort?: string;
  order?: string;
  limit?: number;
  offset?: number;
}

export interface AdminVideoSetPublicationTypeRequest {
  id: number;
  publication_type_id: number;
}

export interface AdminVideoGetPublicationTypeRequest {
  id: number;
}
