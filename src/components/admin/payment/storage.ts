import crypto from "crypto";
import multer from "multer";

class PaymentStorage {
  paymentMulterStorage = multer.diskStorage({
    destination: (_, __, cb) => {
      cb(null, "static/payment");
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

  paymentUpload() {
    return multer({
      storage: this.paymentMulterStorage,
      fileFilter(_, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg|webp|svg)$/i)) {
          cb(new Error("Please upload image file"));
        }
        cb(null, true);
      },
    });
  }
}

export const adminPaymentUpload = new PaymentStorage().paymentUpload();
