export interface AdminGalleryCreateRequest {
  title: string;
  user_id: number;
  avatar_image: string;
  images: string[];
  page_category_id: number;
}

export interface AdminGalleryEditRequest {
  gallery_id: number;
  title?: string;
  user_id?: number;
  avatar_image?: string;
  page_category_id?: number;
}

export interface AdminGalleryAddImageRequest {
  gallery_id: number;
  images: string[];
}

export interface AdminGalleryDeleteImageRequest {
  gallery_id: number;
  image_ids: number[];
}

export interface AdminGalleryListRequest {
  user_id?: number;
  page_category_id?: number;
  publication_type_id?: number;
  query?: string;
  sort?: string;
  order?: string;
  limit?: number;
  offset?: number;
}
export interface AdminGalleryGetRequest {
  id: number;
}
export interface AdminGalleryDeleteRequest {
  id: number;
}

export interface AdminGalleryPhotoSetPublicationTypeRequest {
  id: number;
  publication_type_id: number;
}

export interface AdminGalleryPhotoGetPublicationTypeRequest {
  id: number;
}
