import { GalleryDB } from "./query";
import {
  AdminGalleryAddImageRequest,
  AdminGalleryCreateRequest,
  AdminGalleryDeleteImageRequest,
  AdminGalleryDeleteRequest,
  AdminGalleryEditRequest,
  AdminGalleryGetRequest,
  AdminGalleryListRequest,
  AdminGalleryPhotoGetPublicationTypeRequest,
  AdminGalleryPhotoSetPublicationTypeRequest,
} from "@/types/request/admin/gallery";
import { ApiResponse } from "@/types/response";

export class GalleryDAO {
  private gallery: GalleryDB;

  constructor() {
    this.gallery = new GalleryDB();
  }

  create = async (
    body: AdminGalleryCreateRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.gallery.insert(body);
    return result;
  };

  edit = async (body: AdminGalleryEditRequest): Promise<ApiResponse<any>> => {
    const result = await this.gallery.edit(body);
    return result;
  };
  addImages = async (
    body: AdminGalleryAddImageRequest,
  ): Promise<ApiResponse<any>> => {
    const result = await this.gallery.addImages(body);
    return result;
  };
  deleteImages = async (
    body: AdminGalleryDeleteImageRequest,
  ): Promise<ApiResponse<any>> => {
    const result = await this.gallery.deleteImages(body);
    return result;
  };

  list = async (body: AdminGalleryListRequest): Promise<any[]> => {
    const result = await this.gallery.list(body);
    return result;
  };

  get = async (body: AdminGalleryGetRequest): Promise<any> => {
    const result = await this.gallery.get(body);
    return result;
  };

  delete = async (
    body: AdminGalleryDeleteRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.gallery.delete(body);
    return result;
  };

  setPublicationType = async (
    body: AdminGalleryPhotoSetPublicationTypeRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.gallery.setPublicationType(body);
    return result;
  };

  getPublicationType = async (
    body: AdminGalleryPhotoGetPublicationTypeRequest,
  ): Promise<any> => {
    const result = await this.gallery.getPublicationType(body);
    return result;
  };
}
