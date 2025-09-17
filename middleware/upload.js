const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directories exist
const ensureUploadDirs = () => {
  const dirs = [
    path.join(__dirname, "../uploads"),
    path.join(__dirname, "../uploads/products"),
    path.join(__dirname, "../uploads/users"),
    path.join(__dirname, "../uploads/documents"),
    path.join(__dirname, "../uploads/others")
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

ensureUploadDirs();

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "";

    if (file.fieldname === "product_images") {
      uploadPath = "uploads/products/";
    } else if (file.fieldname === "avatar") {
      uploadPath = "uploads/users/";
    } else if (file.fieldname === "verification_document") {
      uploadPath = "uploads/documents/";
    } else {
      uploadPath = "uploads/others/";
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    "image/jpeg": true,
    "image/jpg": true,
    "image/png": true,
    "image/gif": true,
    "application/pdf": true,
  };

  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, GIF, and PDF are allowed."
      ),
      false
    );
  }
};

// Multer config
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Middleware for specific upload types
const uploadProductImages = upload.array("product_images", 5); // Max 5 product images
const uploadAvatar = upload.single("avatar");
const uploadDocument = upload.single("verification_document");

module.exports = {
  uploadProductImages,
  uploadAvatar,
  uploadDocument,
  upload,
};
