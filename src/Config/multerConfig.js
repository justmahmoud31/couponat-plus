import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import fs from "fs-extra";
import path from "path";

const UPLOADS_FOLDER = "uploads";

const ensureUploadFolderExists = (folderName) => {
  const folderPath = path.join(UPLOADS_FOLDER, folderName);
  if (!fs.existsSync(folderPath)) {
    fs.ensureDirSync(folderPath);
  }
};

export const fileUpload = (folderName) => {
  ensureUploadFolderExists(folderName);

  const storage = multer.diskStorage({
      destination: (req, file, cb) => {
          console.log("Destination - File:", file); // Debugging
          cb(null, path.join(UPLOADS_FOLDER, folderName));
      },
      filename: (req, file, cb) => {
          console.log("Filename - File:", file); // Debugging
          cb(null, uuidv4() + "-" + file.originalname);
      },
  });

  function fileFilter(req, file, cb) {
      console.log("File Filter - File:", file); // Debugging
      if (file.mimetype.startsWith("image")) {
          cb(null, true);
      } else {
          cb(new Error("Only images are allowed!"), false);
      }
  }

  return multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit
};
export const singleFile = (fieldName, folderName) => {
  return fileUpload(folderName).single(fieldName);
};

export const mixedFiles = (arrayOfFields, folderName) => {
  return fileUpload(folderName).fields(arrayOfFields);
};
