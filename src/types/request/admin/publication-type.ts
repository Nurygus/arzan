export interface AdminPublicationTypeCreateRequest {
  type: string;
  like_amount?: number;
}

export interface AdminPublicationTypeGetRequest {
  id: number;
}

export interface AdminPublicationTypeDeleteRequest {
  id: number;
}

export interface AdminPublicationTypeListRequest {
  type?: string;
}
