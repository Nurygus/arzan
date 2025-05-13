import { Router } from "express";
import { adminServiceUpload } from "@/components/admin/service/storage";
import { AdminServiceValidator } from "@/components/admin/service/validators";
import { AdminServiceController } from "@/components/admin/service/controller";
import { adminAuthMiddleware } from "@/middlewares/auth/admin";
import { sanitizer } from "@/helpers";
import { adminUserUpload } from "@/components/admin/user/storage";
import { AdminUserController } from "@/components/admin/user/controller";
import {
  AdminUserProfileController,
  AdminUserProfileValidator,
} from "@/components/admin/user-profile";
import { postUpload } from "@/components/post";
import {
  AdminPostController,
  AdminPostValidator,
} from "@/components/admin/post";
import { AdminPaymentController } from "@/components/admin/payment/controller";
import { adminPaymentUpload } from "@/components/admin/payment/storage";
import { adminLoginValidator } from "@/components/admin/auth/validators";
import { AdminAuthController } from "@/components/admin/auth";
import {
  AdminBannerController,
  AdminBannerValidator,
  adminBannerUpload,
} from "@/components/admin/banner";
import {
  AdminCategoryController,
  adminCategoryUpload,
} from "@/components/admin/category";
import { AdminCategoryValidator } from "@/components/admin/category/validators";
import { AdminSubCategoryValidator } from "@/components/admin/sub-category/validators";
import { AdminSubCategoryController } from "@/components/admin/sub-category/controller";
import {
  AdminVideoController,
  AdminVideoValidator,
  adminVideoUpload,
} from "@/components/admin/video";
import {
  AdminPageCategoryController,
  AdminPageCategoryValidator,
  adminPageCategoryImageUpload,
} from "@/components/admin/page-category";
import {
  AdminGalleryController,
  AdminGalleryValidator,
  adminGalleryUpload,
} from "@/components/admin/gallery";
import {
  AdminPublicationTypeController,
  AdminPublicationTypeValidator,
} from "@/components/admin/publication-type";

const adminRouter = Router();

adminRouter.post(
  "/service",
  adminAuthMiddleware,
  adminServiceUpload.single("image"),
  sanitizer(AdminServiceValidator.postValidator),
  AdminServiceController.post,
);

adminRouter.put(
  "/service/:id([0-9]+)",
  adminAuthMiddleware,
  adminServiceUpload.single("image"),
  sanitizer(AdminServiceValidator.postValidator),
  AdminServiceController.put,
);

adminRouter.delete(
  "/service/:id([0-9]+)",
  adminAuthMiddleware,
  AdminServiceController.delete,
);

adminRouter.get("/service", adminAuthMiddleware, AdminServiceController.list);
adminRouter.get(
  "/service/:id([0-9]+)",
  adminAuthMiddleware,
  AdminServiceController.get,
);

adminRouter.post(
  "/user",
  adminAuthMiddleware,
  adminUserUpload.single("image"),
  AdminUserController.post,
);

adminRouter.get("/user", adminAuthMiddleware, AdminUserController.list);

adminRouter.post(
  "/user/follow/reward",
  adminAuthMiddleware,
  sanitizer(AdminUserProfileValidator.setFollowReward),
  AdminUserProfileController.setFollowReward,
);

adminRouter.get(
  "/user/follow/reward",
  adminAuthMiddleware,
  sanitizer(AdminUserProfileValidator.listFollowReward),
  AdminUserProfileController.listFollowReward,
);

adminRouter.put(
  "/user/day-streak/reward",
  adminAuthMiddleware,
  sanitizer(AdminUserProfileValidator.setDayStreakCoinReward),
  AdminUserProfileController.setDayStreakCoinReward,
);

// Do we really need it?
// adminRouter.get(
//   "/user/follow/reward",
//   adminAuthMiddleware,
//   sanitizer(AdminUserProfileValidator.getFollowReward),
//   AdminUserProfileController.getFollowReward,
// );

adminRouter.post(
  "/user/top-list/limit",
  adminAuthMiddleware,
  sanitizer(AdminUserProfileValidator.setTopListLimit),
  AdminUserProfileController.setTopListLimit,
);

adminRouter.get(
  "/user/top-list/limit",
  adminAuthMiddleware,
  sanitizer(AdminUserProfileValidator.listTopListLimit),
  AdminUserProfileController.listTopListLimit,
);

adminRouter.delete(
  "/user/:id([0-9]+)",
  adminAuthMiddleware,
  sanitizer(AdminUserProfileValidator.delteUser),
  AdminUserProfileController.delteUser,
);

adminRouter.post(
  "/post",
  adminAuthMiddleware,
  postUpload.array("image", Number(process.env.POST_UPLOAD_LIMIT)),
  AdminPostController.post,
);

adminRouter.put(
  "/post",
  adminAuthMiddleware,
  postUpload.array("image", Number(process.env.POST_UPLOAD_LIMIT)),
  sanitizer(AdminPostValidator.update),
  AdminPostController.update,
);

adminRouter.get("/post", adminAuthMiddleware, AdminPostController.list);
adminRouter.get(
  "/post/:id([0-9]+)",
  adminAuthMiddleware,
  AdminPostController.get,
);
adminRouter.delete(
  "/post/:id([0-9]+)",
  adminAuthMiddleware,
  AdminPostController.delete,
);

adminRouter.post(
  "/post/:id/approve",
  adminAuthMiddleware,
  AdminPostController.approve,
);

adminRouter.post(
  "/post/publication-type",
  adminAuthMiddleware,
  sanitizer(AdminPostValidator.setPublicationTypeValidator),
  AdminPostController.setPublicationType,
);

adminRouter.get(
  "/post/publication-type/:id([0-9]+)",
  adminAuthMiddleware,
  sanitizer(AdminPostValidator.getPublicationTypeValidator),
  AdminPostController.getPublicationType,
);

adminRouter.get(
  "/user/payment",
  adminAuthMiddleware,
  AdminPaymentController.userList,
);

adminRouter.post(
  "/payment",
  adminAuthMiddleware,
  adminPaymentUpload.single("image"),
  AdminPaymentController.post,
);

adminRouter.get("/payment", adminAuthMiddleware, AdminPaymentController.list);

adminRouter.delete(
  "/payment/:id",
  adminAuthMiddleware,
  AdminPaymentController.delete,
);

// Admin API
adminRouter.post(
  "/account/login",
  sanitizer(adminLoginValidator),
  AdminAuthController.login,
);

adminRouter.post(
  "/banner",
  adminAuthMiddleware,
  adminBannerUpload.single("image"),
  sanitizer(AdminBannerValidator.createValidator),
  AdminBannerController.create,
);

adminRouter.put(
  "/banner",
  adminAuthMiddleware,
  adminBannerUpload.single("image"),
  sanitizer(AdminBannerValidator.edit),
  AdminBannerController.edit,
);

adminRouter.get(
  "/banner/:id([0-9]+)",
  adminAuthMiddleware,
  sanitizer(AdminBannerValidator.getValidator),
  AdminBannerController.get,
);

adminRouter.get(
  "/banner",
  adminAuthMiddleware,
  sanitizer(AdminBannerValidator.listValidator),
  AdminBannerController.list,
);

adminRouter.delete(
  "/banner/:id([0-9]+)",
  adminAuthMiddleware,
  sanitizer(AdminBannerValidator.deleteValidator),
  AdminBannerController.delete,
);

adminRouter.post(
  "/category",
  adminAuthMiddleware,
  adminCategoryUpload.single("image"),
  sanitizer(AdminCategoryValidator.createValidator),
  AdminCategoryController.post,
);
adminRouter.get("/category", adminAuthMiddleware, AdminCategoryController.list);
adminRouter.get(
  "/category/:id",
  adminAuthMiddleware,
  AdminCategoryController.get,
);
adminRouter.delete(
  "/category/:id",
  adminAuthMiddleware,
  AdminCategoryController.delete,
);

adminRouter.post(
  "/sub-category",
  sanitizer(AdminSubCategoryValidator.postValidator),
  AdminSubCategoryController.post,
);
adminRouter.get("/sub-category", AdminSubCategoryController.list);
adminRouter.get("/sub-category/:id", AdminSubCategoryController.get);
adminRouter.delete("/sub-category/:id", AdminSubCategoryController.delete);

adminRouter.post(
  "/video",
  adminAuthMiddleware,
  adminVideoUpload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  sanitizer(AdminVideoValidator.createValidator),
  AdminVideoController.create,
);

adminRouter.put(
  "/video",
  adminAuthMiddleware,
  adminVideoUpload.fields([{ name: "thumbnail", maxCount: 1 }]),
  sanitizer(AdminVideoValidator.edit),
  AdminVideoController.edit,
);

adminRouter.get(
  "/video",
  adminAuthMiddleware,
  sanitizer(AdminVideoValidator.listValidator),
  AdminVideoController.list,
);

adminRouter.get(
  "/video/:id([0-9]+)",
  adminAuthMiddleware,
  sanitizer(AdminVideoValidator.getValidator),
  AdminVideoController.get,
);

adminRouter.delete(
  "/video/:id([0-9]+)",
  adminAuthMiddleware,
  sanitizer(AdminVideoValidator.deleteValidator),
  AdminVideoController.delete,
);

adminRouter.post(
  "/video/publication-type",
  adminAuthMiddleware,
  sanitizer(AdminVideoValidator.setPublicationTypeValidator),
  AdminVideoController.setPublicationType,
);

adminRouter.get(
  "/video/publication-type/:id([0-9]+)",
  adminAuthMiddleware,
  sanitizer(AdminVideoValidator.getPublicationTypeValidator),
  AdminVideoController.getPublicationType,
);

adminRouter.post(
  "/page-category",
  adminAuthMiddleware,
  adminPageCategoryImageUpload.single("image"),
  sanitizer(AdminPageCategoryValidator.createValidator),
  AdminPageCategoryController.create,
);

adminRouter.put(
  "/page-category",
  adminAuthMiddleware,
  adminPageCategoryImageUpload.single("image"),
  sanitizer(AdminPageCategoryValidator.edit),
  AdminPageCategoryController.edit,
);

adminRouter.get(
  "/page-category",
  adminAuthMiddleware,
  sanitizer(AdminPageCategoryValidator.listValidator),
  AdminPageCategoryController.list,
);

adminRouter.get(
  "/page-category/:id([0-9]+)",
  adminAuthMiddleware,
  sanitizer(AdminPageCategoryValidator.getValidator),
  AdminPageCategoryController.get,
);

adminRouter.delete(
  "/page-category/:id([0-9]+)",
  adminAuthMiddleware,
  sanitizer(AdminPageCategoryValidator.deleteValidator),
  AdminPageCategoryController.delete,
);

adminRouter.post(
  "/gallery",
  adminAuthMiddleware,
  adminGalleryUpload.fields([
    { name: "avatar_image", maxCount: 1 },
    { name: "images", maxCount: Number(process.env.GALLERY_UPLOAD_LIMIT) },
  ]),
  sanitizer(AdminGalleryValidator.createValidator),
  AdminGalleryController.create,
);

adminRouter.put(
  "/gallery",
  adminAuthMiddleware,
  adminGalleryUpload.fields([{ name: "avatar_image", maxCount: 1 }]),
  sanitizer(AdminGalleryValidator.edit),
  AdminGalleryController.edit,
);

adminRouter.post(
  "/gallery/add-images",
  adminAuthMiddleware,
  adminGalleryUpload.fields([
    { name: "images", maxCount: Number(process.env.GALLERY_UPLOAD_LIMIT) },
  ]),
  sanitizer(AdminGalleryValidator.addImages),
  AdminGalleryController.addImages,
);

adminRouter.post(
  "/gallery/delete-images",
  adminAuthMiddleware,
  sanitizer(AdminGalleryValidator.deleteImages),
  AdminGalleryController.deleteImages,
);

adminRouter.get(
  "/gallery",
  adminAuthMiddleware,
  sanitizer(AdminGalleryValidator.listValidator),
  AdminGalleryController.list,
);

adminRouter.get(
  "/gallery/:id([0-9]+)",
  adminAuthMiddleware,
  sanitizer(AdminGalleryValidator.getValidator),
  AdminGalleryController.get,
);

adminRouter.delete(
  "/gallery/:id([0-9]+)",
  adminAuthMiddleware,
  sanitizer(AdminGalleryValidator.deleteValidator),
  AdminGalleryController.delete,
);

adminRouter.post(
  "/gallery/publication-type",
  adminAuthMiddleware,
  sanitizer(AdminGalleryValidator.setPublicationTypeValidator),
  AdminGalleryController.setPublicationType,
);

adminRouter.get(
  "/gallery/publication-type/:id([0-9]+)",
  adminAuthMiddleware,
  sanitizer(AdminGalleryValidator.getPublicationTypeValidator),
  AdminGalleryController.getPublicationType,
);

// Publication Type API

adminRouter.post(
  "/publication-type",
  adminAuthMiddleware,
  sanitizer(AdminPublicationTypeValidator.createValidator),
  AdminPublicationTypeController.create,
);

adminRouter.get(
  "/publication-type",
  adminAuthMiddleware,
  sanitizer(AdminPublicationTypeValidator.listValidator),
  AdminPublicationTypeController.list,
);

adminRouter.get(
  "/publication-type/:id([0-9]+)",
  adminAuthMiddleware,
  sanitizer(AdminPublicationTypeValidator.getValidator),
  AdminPublicationTypeController.get,
);

export { adminRouter };
