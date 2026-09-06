const multer = require("multer");
const path = require("path");
const fs = require("fs");

// =====================================================
// UPLOAD FOLDER
// =====================================================

const uploadPath = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

console.log("=================================");
console.log("UPLOAD FOLDER:", uploadPath);
console.log("=================================");

// =====================================================
// STORAGE
// =====================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

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
  console.log("=================================");
  console.log("MULTER FILE RECEIVED");
  console.log("FIELD NAME:", file.fieldname);
  console.log("FILE NAME:", file.originalname);
  console.log("MIME TYPE:", file.mimetype);
  console.log("=================================");

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
      ),
      false
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

// =====================================================
// EXPORT
// =====================================================

module.exports = upload;