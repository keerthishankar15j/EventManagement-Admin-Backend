const multer = require("multer");
const path = require("path");
const fs = require("fs");

// =====================================================
// UPLOAD FOLDER
// =====================================================

const uploadPath = path.join(
  __dirname,
  "../../uploads"
);

// Create uploads folder automatically
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

console.log("UPLOAD FOLDER:", uploadPath);

// =====================================================
// STORAGE
// =====================================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const extension =
      path.extname(file.originalname);

    const fileName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1000000000) +
      extension;

    cb(null, fileName);
  },
});

// =====================================================
// FILE FILTER
// =====================================================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed"
      )
    );
  }
};

// =====================================================
// MULTER
// =====================================================

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;