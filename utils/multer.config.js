// multerConfig.js  (or wherever you define upload)
const multer = require("multer");
const path = require("path");

// Use memory storage OR fast disk storage WITHOUT crypto
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads/"));
  },
  filename: (req, file, cb) => {
    // FAST & SAFE filename - NO crypto.randomBytes!
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename =
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max - strict!
  },
  fileFilter: (req, file, cb) => {
    const allowedImages = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    const allowedDocs = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (file.fieldname === "photo" && allowedImages.includes(file.mimetype)) {
      cb(null, true);
    } else if (
      (file.fieldname === "document" ||
        file.fieldname === "additional_sheet") &&
      allowedDocs.includes(file.mimetype)
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type! Photo: JPG/PNG/GIF | Documents: PDF/DOC/DOCX only"
        ),
        false
      );
    }
  }
}).fields([
  { name: "photo", maxCount: 1 },
  { name: "document", maxCount: 1 },
  { name: "additional_sheet", maxCount: 1 }
]);

module.exports = upload;
