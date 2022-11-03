const express = require('express');
const router = express.Router();
//on appelle le middleware authentification qui protège les routes
const auth = require('../middlewares/auth');
// on appelle multer pour ajout d'image
const multer = require('../middlewares/multer-config');
// on importe la logique des routes
const sauceCtrl = require('../controllers/sauce');

router.get('/',auth, sauceCtrl.getAllSauce);
router.get('/:id',auth, sauceCtrl.getOneSauce);
router.post('/',auth,multer, sauceCtrl.createSauce);
router.put('/:id',auth, multer, sauceCtrl.modifySauce);
router.delete('/:id',auth, sauceCtrl.deleteSauce);
router.post('/:id/like',auth, sauceCtrl.createLike);


module.exports = router;