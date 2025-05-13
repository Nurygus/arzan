import crypto from "crypto";
import multer from "multer";

class AdminUserStorage {
  adminUserMulterStorage = multer.diskStorage({
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

  userUpload() {
    return multer({
      storage: this.adminUserMulterStorage,
      fileFilter(_, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg|webp|svg)$/i)) {
          cb(new Error("Please upload image file"));
        }
        cb(null, true);
      },
    });
  }
}

export const adminUserUpload = new AdminUserStorage().userUpload();
