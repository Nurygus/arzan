import crypto from "crypto";
import multer from "multer";

class PageCategoryImageStorage {
  bannerMulterStorage = multer.diskStorage({
    destination: (_, __, cb) => {
      cb(null, "static/page-category");
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

  categoryImageUpload() {
    return multer({
      storage: this.bannerMulterStorage,
      fileFilter(_, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg|webp|svg)$/i)) {
          cb(new Error("Please upload image file"));
        }
        cb(null, true);
      },
    });
  }
}

export const adminPageCategoryImageUpload =
  new PageCategoryImageStorage().categoryImageUpload();
