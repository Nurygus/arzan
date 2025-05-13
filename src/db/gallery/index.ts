import { GalleryDB } from "./query";
import { ApiResponse } from "@/types/response";
import {
  UserGalleryGetRequest,
  UserGalleryListRequest,
  UserGalleryPhotoLikeRequest,
  UserGalleryPhotoViewRequest,
} from "@/types/request/gallery";

export class GalleryDAO {
  private gallery: GalleryDB;

  constructor() {
    this.gallery = new GalleryDB();
  }

  list = async (body: UserGalleryListRequest): Promise<any[]> => {
    const result = await this.gallery.list(body);
    return result;
  };

  get = async (body: UserGalleryGetRequest): Promise<any> => {
    const result = await this.gallery.get(body);
    return result;
  };

  like = async (
    body: UserGalleryPhotoLikeRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.gallery.like(body);
    return result;
  };

  getBadgeCount = async (
    session: any,
    lastFetchedDate?: number,
  ): Promise<ApiResponse<{ count: number }>> => {
    const result = await this.gallery.getBadgeCount(session, lastFetchedDate);
    return result;
  };

  view = async (
    body: UserGalleryPhotoViewRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.gallery.view(body);
    return result;
  };
}
