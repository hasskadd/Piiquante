const Sauce = require('../models/sauce'); //Recuperation du  modele sauce
const fs = require('fs'); //Recuperation du module filesysteme ,permettant  acceder aux fichiers

//---------------------------------------------------
// Afficher toutes les sauces
//---------------------------------------------------

exports.getAllSauce = (req, res, next) => {
    // méthode find() pour obtenir la liste  des sauces trouvées dans la base de données
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({error}));
};
  
//---------------------------------------------------
// Créer une nouvelle sauce
//---------------------------------------------------

exports.createSauce = (req, res, next) => {
// on extrait le sauce de la requete via le parse
  const sauceObject = JSON.parse(req.body.sauce);
  //Suppression de  l'id généré automatiquement 
  delete sauceObject._id;
  const setLikes = {
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
};
// Création d'une instance du modèle Sauce
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    // On modifie l'URL de l'image,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
   ...setLikes
  });
  // Sauvegarde de la sauce dans la base de données
  sauce.save()
    .then(() => res.status(201).json({message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({error}));
};

//---------------------------------------------------
// Récupérer une  sauce
//---------------------------------------------------
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({error}));
  };

//---------------------------------------------------
// Modifier une sauce
//---------------------------------------------------

exports.modifySauce = (req, res, next) => {
  let sauceObject;
  req.file ? (
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
      // On supprime l'ancienne image du serveur
      const filename = sauce.imageUrl.split('/images/')[1]
      fs.unlinkSync(`images/${filename}`)
    }),
    sauceObject = {
      // On modifie les données et on ajoute la nouvelle image
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    }
  ) : (sauceObject = {...req.body })
  Sauce.updateOne({_id: req.params.id},{...sauceObject,_id: req.params.id})
        .then(() => res.status(200).json({message: 'Sauce modifiée !'}))
        .catch((error) => res.status(400).json({error}))
}

//---------------------------------------------------
// Supprimer une sauce
//---------------------------------------------------

exports.deleteSauce = (req, res, next) => {
  // Avant de suppr l'objet, on va le chercher pour obtenir l'url de l'image et supprimer le fichier image de la base
  Sauce.findOne({_id: req.params.id})
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      //Spprimer le fichier avec  unlink
      fs.unlink(`images/${filename}`, () => {
        // On supprime le document correspondant de la base de données
        Sauce.deleteOne({_id: req.params.id})
          .then(() => res.status(200).json({message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({error}));
        });
    })
    .catch(error => res.status(500).json({error}));
};

//---------------------------------------------------
// Ajouter un like ou dislike 
//---------------------------------------------------
exports.createLike = (req, res, next) =>{
    const userId = req.body.userId;
    const like = req.body.like;
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const setValueLike = {
                usersLiked: sauce.usersLiked,
                usersDisliked: sauce.usersDisliked,
                like: 0,
                dislike: 0
            }
            // Différents cas:
            switch (like) {
                case 1:  // sauce liked
                    setValueLike.usersLiked.push(userId);
                    break;
                case -1:  // sauce disliked
                    setValueLike.usersDisliked.push(userId);
                    break;
                case 0:  // Annulation du like/dislike
                    if (setValueLike.usersLiked.includes(userId)) {
                        setValueLike.usersLiked.splice( setValueLike.usersLiked.indexOf(userId), 1);
                    } else {
                        setValueLike.usersDisliked.splice(setValueLike.usersDisliked.indexOf(userId), 1);
                    }
                    break;
            };
            // Calcul du nombre de likes / dislikes
            setValueLike.like = setValueLike.usersLiked.length;
            setValueLike.dislike = setValueLike.usersDisliked.length;
            // Mise à jour de la sauce avec les nouvelles valeurs
            Sauce.updateOne({ _id: req.params.id }, setValueLike )
                .then(() => res.status(200).json({ message: 'nouvelle note !' }))
                .catch(error => res.status(400).json({ error }))  
        })
        .catch(error => res.status(500).json({ error }));
}