import multer from "multer";
import path from "path";
import dotenv from 'dotenv'

dotenv.config()
// Configuración de almacenamiento con multer
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error("El archivo debe ser una imagen"));
        }
    },
});

export default upload;
