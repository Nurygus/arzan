import crypto from "crypto";
import multer from "multer";

class VideoStorage {
  videoMulterStorage = multer.diskStorage({
    destination: (_, file, cb) => {
      if (file.fieldname === "video") {
        cb(null, "video");
      } else if (file.fieldname === "thumbnail") {
        cb(null, "static/video/thumbnail");
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

  videoUpload() {
    return multer({
      storage: this.videoMulterStorage,
      limits: { fileSize: 1 * 1024 * 1024 * 1024 },
      fileFilter(_, file, cb) {
        if (
          file.fieldname === "video" &&
          !file.originalname.match(/\.(mp4|mkv|webm|webp)$/i)
        ) {
          cb(new Error("Please upload video file"));
        } else if (
          file.fieldname === "thumbnail" &&
          !file.originalname.match(/\.(png|jpg|jpeg|webp|svg)$/i)
        ) {
          cb(new Error("Please upload image file"));
        }

        cb(null, true);
      },
    });
  }
}

class VideoCategoryImageStorage {
  bannerMulterStorage = multer.diskStorage({
    destination: (_, __, cb) => {
      cb(null, "static/video/category");
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

export const adminVideoUpload = new VideoStorage().videoUpload();
export const adminVideoCategoryImageUpload =
  new VideoCategoryImageStorage().categoryImageUpload();
