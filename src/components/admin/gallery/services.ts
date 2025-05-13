import { GalleryDAO } from "@/db/admin/gallery";
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

export class GalleryServices {
  galleryDAO: GalleryDAO;
  constructor() {
    this.galleryDAO = new GalleryDAO();
  }

  create = async (
    body: AdminGalleryCreateRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.galleryDAO.create(body);
    return result;
  };

  edit = async (body: AdminGalleryEditRequest): Promise<ApiResponse<any>> => {
    const result = await this.galleryDAO.edit(body);
    return result;
  };

  addImages = async (
    body: AdminGalleryAddImageRequest,
  ): Promise<ApiResponse<any>> => {
    const result = await this.galleryDAO.addImages(body);
    return result;
  };

  deleteImages = async (
    body: AdminGalleryDeleteImageRequest,
  ): Promise<ApiResponse<any>> => {
    const result = await this.galleryDAO.deleteImages(body);
    return result;
  };

  list = async (body: AdminGalleryListRequest): Promise<any[]> => {
    const result = await this.galleryDAO.list(body);
    return result;
  };

  get = async (body: AdminGalleryGetRequest): Promise<any> => {
    const result = await this.galleryDAO.get(body);
    return result;
  };

  delete = async (
    body: AdminGalleryDeleteRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.galleryDAO.delete(body);
    return result;
  };

  setPublicationType = async (
    body: AdminGalleryPhotoSetPublicationTypeRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.galleryDAO.setPublicationType(body);

    return result;
  };

  getPublicationType = async (
    body: AdminGalleryPhotoGetPublicationTypeRequest,
  ): Promise<any> => {
    const result = await this.galleryDAO.getPublicationType(body);

    return result;
  };
}
