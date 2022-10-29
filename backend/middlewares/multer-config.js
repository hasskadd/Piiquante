const multer = require("multer");
// on définit les images/formats 
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/svg+xml": "svg",
  "image/webp": "webp",
  "image/bmp": "bmp",
  "image/gif": "gif"
};
// multer.diskStorage on va enregistrer sur le disque
const storage = multer.diskStorage({
  // on choisit la destination
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    // nom d'origine du fichier que l'ont transforme si il y a des espaces, on crée un tableau et on join ses éléments par _
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/bmp" ||
      file.mimetype === "image/gif" ||
      file.mimetype === "image/svg" ||
      file.mimetype === "image/webp"
    ) {
      callback(null, name + Date.now() + "." + extension);
    } 
  },
});

module.exports = multer({ storage }).single("image");