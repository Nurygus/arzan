import { Router } from "express";
import { HomeController, appKeyValidator } from "@/components/home";
import { sanitizer } from "@/helpers";
import { userAuthMiddleware } from "@/middlewares/auth/user";
import { AuthController, AuthValidator } from "@/components/auth";
import { BannerController, BannerListValidator } from "@/components/banner";
import { LocationController } from "@/components/location";
import { ApiPageController } from "@/components/page/controller";
import { ApiPlatformController } from "@/components/platform/controller";
import { ApiCategoryController } from "@/components/category/controller";
import {
  postUpload,
  ApiPostController,
  PostValidator,
} from "@/components/post";
import { UserVideoController, UserVideoValidator } from "@/components/video";
import { UserPageCategoryValidator } from "@/components/page-category/validator";
import { UserPageCategoryController } from "@/components/page-category";
import {
  UserGalleryController,
  UserGalleryValidator,
} from "@/components/gallery";
import {
  UserProfileController,
  UserProfileValidator,
  userProfileAvatarUpload,
  userProfileBGImagesUpload,
} from "@/components/user-profile";
import { ApiPaymentController } from "@/components/payment/controller";
import { AdminPaymentController } from "@/components/admin/payment/controller";
import { ApiServiceRequestController } from "@/components/service-request/controller";
import { ApiServiceRequestValidator } from "@/components/service-request/validators";
import { AdminServiceController } from "@/components/admin/service/controller";

const router = Router();

router.get("/", sanitizer(appKeyValidator), HomeController.getAppInfo);

router.get("/service", AdminServiceController.list);
router.get("/service/:id([0-9]+)", AdminServiceController.get);

router.post(
  "/service-request",
  userAuthMiddleware,
  sanitizer(ApiServiceRequestValidator.postValidator),
  ApiServiceRequestController.post,
);

// router.get(
//   "/service-request",
//   userAuthMiddleware,
//   sanitizer(ApiServiceRequestValidator.postValidator),
//   ApiServiceRequestController.post,
// );

router.get("/payment", userAuthMiddleware, AdminPaymentController.list);
router.get(
  "/payment/form/:id([0-9]+)",
  userAuthMiddleware,
  ApiPaymentController.post,
);
router.get(
  "/payment/:uuid/status",
  userAuthMiddleware,
  ApiPaymentController.status,
);

// Public API
router.post(
  "/account/signup",
  sanitizer(AuthValidator.signupValidator),
  AuthController.signup,
);
router.post(
  "/account/login",
  sanitizer(AuthValidator.loginValidator),
  AuthController.login,
);
router.post(
  "/account/verify",
  sanitizer(AuthValidator.accountVerifyValidator),
  AuthController.accountVerify,
);
router.post(
  "/account/verify/check",
  sanitizer(AuthValidator.accountVerifyCheckValidator),
  AuthController.accountVerifyCheck,
);
router.post(
  "/account/exists",
  sanitizer(AuthValidator.accountVerifyCheckValidator),
  AuthController.userExists,
);
router.post(
  "/account/reset-password",
  sanitizer(AuthValidator.passwordRecoveryValidator),
  AuthController.resetPassword,
);
router.post(
  "/account/recover/verify/check",
  sanitizer(AuthValidator.accountVerifyCheckValidator),
  AuthController.recoverVerifyCheck,
);

// Public API Page
router.get("/platform/list", ApiPlatformController.list);

// Public API Page
router.get("/page/list", ApiPageController.list);

// Public API Location
router.get("/location/list", LocationController.list);

// Public Category API
router.get("/category/list", ApiCategoryController.list);

// Public Post API
router.post(
  "/post/create",
  userAuthMiddleware,
  postUpload.array("image", Number(process.env.POST_UPLOAD_LIMIT)),
  ApiPostController.post,
);

router.put(
  "/post",
  userAuthMiddleware,
  postUpload.array("image", Number(process.env.POST_UPLOAD_LIMIT)),
  sanitizer(PostValidator.update),
  ApiPostController.update,
);

router.get("/post", ApiPostController.list);

router.get("/post/badge", ApiPostController.getBadgeCount);

router.get("/post/:id([0-9]+)", ApiPostController.get);

router.delete("/post/:id([0-9]+)", ApiPostController.delete);

router.post(
  "/post/like",
  userAuthMiddleware,
  sanitizer(PostValidator.likeValidator),
  ApiPostController.like,
);

router.post(
  "/post/view",
  sanitizer(PostValidator.viewValidator),
  ApiPostController.view,
);

// Public API Banner
router.get("/banner", BannerListValidator.listValidator, BannerController.list);

router.get(
  "/banner/:id([0-9]+)",
  BannerListValidator.getValidator,
  BannerController.get,
);

// Public API Video
router.get(
  "/video",
  UserVideoValidator.listValidator,
  UserVideoController.list,
);

router.get("/video/badge", UserVideoController.getBadgeCount);

router.get(
  "/video/:id([0-9]+)",
  UserVideoValidator.getValidator,
  UserVideoController.get,
);

router.post(
  "/video/like",
  userAuthMiddleware,
  UserVideoValidator.likeValidator,
  UserVideoController.like,
);

router.post(
  "/video/view",
  UserVideoValidator.viewValidator,
  UserVideoController.view,
);

// Public API page-category
router.get(
  "/page-category",
  UserPageCategoryValidator.listValidator,
  UserPageCategoryController.list,
);

router.get(
  "/page-category/:id([0-9]+)",
  UserPageCategoryValidator.getValidator,
  UserPageCategoryController.get,
);

// Public API Gallery
router.get(
  "/gallery",
  UserGalleryValidator.listValidator,
  UserGalleryController.list,
);

router.get("/gallery/badge", UserGalleryController.getBadgeCount);

router.get(
  "/gallery/:id([0-9]+)",
  UserGalleryValidator.getValidator,
  UserGalleryController.get,
);

router.post(
  "/gallery/like",
  userAuthMiddleware,
  UserGalleryValidator.likeValidator,
  UserGalleryController.like,
);

router.post(
  "/gallery/view",
  UserGalleryValidator.viewValidator,
  UserGalleryController.view,
);

router.post(
  "/user/profile/avatar",
  userAuthMiddleware,
  userProfileAvatarUpload.single("image"),
  UserProfileController.setAvatar,
);

router.get(
  "/user/profile",
  UserProfileValidator.listValidator,
  UserProfileController.list,
);

router.get(
  "/user/profile/:id([0-9]+)",
  UserProfileValidator.getValidator,
  UserProfileController.get,
);

router.put(
  "/user/profile",
  userAuthMiddleware,
  UserProfileValidator.update,
  UserProfileController.update,
);

router.post(
  "/user/profile/follow",
  userAuthMiddleware,
  UserProfileValidator.followValidator,
  UserProfileController.follow,
);

router.post(
  "/user/profile/unfollow",
  userAuthMiddleware,
  UserProfileValidator.unFollowValidator,
  UserProfileController.unFollow,
);

router.put(
  "/user/profile/day-streak",
  userAuthMiddleware,
  UserProfileValidator.setDayStreak,
  UserProfileController.setDayStreak,
);

router.get(
  "/user/profile/day-streak",
  UserProfileValidator.listDayStreakCoinReward,
  UserProfileController.listDayStreakCoinReward,
);

router.post(
  "/user/profile/bg-image",
  userAuthMiddleware,
  userProfileBGImagesUpload.array(
    "image",
    10, //Number(process.env.USER_PROFILE_BG_IMG_UPLOAD_LIMIT),
  ),
  UserProfileValidator.addUserProfileBackgroundImage,
  UserProfileController.addUserProfileBackgroundImage,
);

router.delete(
  "/user/profile/bg-image",
  userAuthMiddleware,
  UserProfileValidator.deleteUserProfileBackgroundImage,
  UserProfileController.deleteUserProfileBackgroundImage,
);

export { router };
