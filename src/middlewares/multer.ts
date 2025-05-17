import multer from "multer";

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5, },
  fileFilter(req, file, callback) {
    const ext = file.mimetype
    const permittedExts = ["image/jpeg", "image/png", "image/jpg"]

    if (!permittedExts.includes(ext)) {
      return callback(new Error("Extensões inválidas!"))
    }
    callback(null, true)
  },
});