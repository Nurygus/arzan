import crypto from "crypto";
import multer from "multer";

class PostStorage {
  postMulterStorage = multer.diskStorage({
    destination: (_, __, cb) => {
      cb(null, "static/post");
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

  postUpload() {
    return multer({
      storage: this.postMulterStorage,
      fileFilter(_, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg|webp|svg)$/i)) {
          cb(new Error("Please upload image file"));
        }
        cb(null, true);
      },
    });
  }
}

export const postUpload = new PostStorage().postUpload();
