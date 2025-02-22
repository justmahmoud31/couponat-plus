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
      cb(null, path.join(UPLOADS_FOLDER, folderName));
    },
    filename: (req, file, cb) => {
      cb(null, uuidv4() + "-" + file.originalname);
    },
  });

  function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image")) cb(null, true);
    else cb(new Error("Only images are allowed!"), false);
  }

  return multer({ storage, fileFilter });
};

export const singleFile = (fieldName, folderName) => {
  return fileUpload(folderName).single(fieldName);
};

export const mixedFiles = (arrayOfFields, folderName) => {
  return fileUpload(folderName).fields(arrayOfFields);
};
