import crypto from "crypto";
import multer from "multer";

class GalleryStorage {
  galleryMulterStorage = multer.diskStorage({
    destination: (_, file, cb) => {
      if (file.fieldname === "avatar_image") {
        cb(null, "static/gallery/avatar");
      } else if (file.fieldname === "images") {
        cb(null, "static/gallery");
      }
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

  galleryUpload() {
    return multer({
      storage: this.galleryMulterStorage,
      fileFilter(_, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg|webp|svg)$/i)) {
          cb(new Error("Please upload image file"));
        }
        cb(null, true);
      },
    });
  }
}

export const adminGalleryUpload = new GalleryStorage().galleryUpload();
