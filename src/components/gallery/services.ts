import { GalleryDAO } from "@/db/gallery";
import {
  UserGalleryGetRequest,
  UserGalleryListRequest,
  UserGalleryPhotoLikeRequest,
  UserGalleryPhotoViewRequest,
} from "@/types/request/gallery";
import { ApiResponse } from "@/types/response";

export class GalleryServices {
  galleryDAO: GalleryDAO;
  constructor() {
    this.galleryDAO = new GalleryDAO();
  }

  list = async (body: UserGalleryListRequest): Promise<any[]> => {
    const result = await this.galleryDAO.list(body);
    return result;
  };

  get = async (body: UserGalleryGetRequest): Promise<any> => {
    const result = await this.galleryDAO.get(body);
    return result;
  };

  like = async (
    body: UserGalleryPhotoLikeRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.galleryDAO.like(body);
    return result;
  };

  getBadgeCount = async (
    session: any,
    lastFetchedDate?: number,
  ): Promise<ApiResponse<{ count: number }>> => {
    const result = await this.galleryDAO.getBadgeCount(
      session,
      lastFetchedDate,
    );
    return result;
  };

  view = async (
    body: UserGalleryPhotoViewRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.galleryDAO.view(body);
    return result;
  };
}
