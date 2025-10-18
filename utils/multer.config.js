const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

// Define storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function(req, file, cb) {
    crypto.randomBytes(12, function(err, name) {
      if (err) return cb(err);
      const fn = name.toString("hex") + path.extname(file.originalname);
      cb(null, fn);
    });
  }
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
  const allowedDocTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  if (file.fieldname === "photo" && allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else if (
    (file.fieldname === "document" || file.fieldname === "additional_sheet") &&
    allowedDocTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
}).fields([
  { name: "photo", maxCount: 1 },
  { name: "document", maxCount: 1 },
  { name: "additional_sheet", maxCount: 1 }
]);


module.exports = upload;
