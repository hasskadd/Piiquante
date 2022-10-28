const multer = require('multer')

// on définit les images/formats reçu en appartenance de format 
const MIME_TYPES = {
    'images/jpg': 'jpg',
    'images/jpeg': 'jpg',
    'images/png': 'png',
    "image/bmp": "bmp",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/x-icon": "ico",
    "image/svg+xml": "svg"
    
};
// enregistrer sur le disque
const storage = multer.diskStorage({
    destination: (req, file, callback)=>{
        // null dans ce cas , pas d'erreur
        callback(null, 'images')
    },
    filename: (req, file, callback) =>{
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension)
    }
});

module.exports = multer({storage}).single('image');