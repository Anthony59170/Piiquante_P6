const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const saucesCtrl = require('../controllers/sauces');

/*--- Paramétrage des routes à la racine, multer pour gérer les fichiers image dl
et auth pour gérer la sécurité des accés --- */
router.post('/', multer, saucesCtrl.createSauces);
router.post('/:id/like', multer, saucesCtrl.likeSauces);
router.put('/:id', auth, multer, saucesCtrl.modifySauces);
router.delete('/:id', auth, saucesCtrl.deleteSauces);
router.get('/', auth, saucesCtrl.getAllSauces);
router.get('/:id', auth, saucesCtrl.getOneSauces);

module.exports = router;
