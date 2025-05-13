import crypto from "crypto";
import multer from "multer";

class UserProfileStorage {
  avatarMulterStorage = multer.diskStorage({
    destination: (_, __, cb) => {
      cb(null, "static/user/avatar");
    },
    filename: (_, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      const filename = `${crypto
        .createHash("md5")
        .update(file.originalname + Date.now())
        .digest("hex")}`;
      cb(null, `${filename}.${ext}`);
    },
  });

  avatarUpload() {
    return multer({
      storage: this.avatarMulterStorage,
      fileFilter(_, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg|webp|svg)$/i)) {
          cb(new Error("Please upload image file"));
        }
        cb(null, true);
      },
    });
  }

  BGImagesMulterStorage = multer.diskStorage({
    destination: (_, __, cb) => {
      cb(null, "static/user/profile/bg-images");
    },
    filename: (_, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      const filename = `${crypto
        .createHash("md5")
        .update(file.originalname + Date.now())
        .digest("hex")}`;
      cb(null, `${filename}.${ext}`);
    },
  });

  BGImagesUpload() {
    return multer({
      storage: this.BGImagesMulterStorage,
      fileFilter(_, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg|webp|svg)$/i)) {
          cb(new Error("Please upload image file"));
        }
        cb(null, true);
      },
    });
  }
}

export const userProfileAvatarUpload = new UserProfileStorage().avatarUpload();
export const userProfileBGImagesUpload =
  new UserProfileStorage().BGImagesUpload();
