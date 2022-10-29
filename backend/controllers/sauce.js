const Sauce = require('../models/Sauce'); // modele sauce
const fs = require('fs') // filesysteme , acceder aux fichier


exports.getAllSauce = (req, res, next) =>{
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))  
}

exports.createSauce = (req, res, next) =>{
    // on extrait le sauce de la requete via le parse
    // dans req.body.sauce le sauce correspont à la key de postman pour ajouter les infos en texte
        const sauceObjet = JSON.parse(req.body.sauce);
        delete sauceObjet._id;
        const protocolGet = req.headers.referer.split(':')[0];
        //delete sauceObjet._userId;
        const setLikes = {
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: []
        };
        const sauce = new Sauce({
            ...sauceObjet,
            userId: req.auth.userId,
            imageUrl: `${protocolGet}://${req.get('host')}/images/${req.file.filename}`,
            ...setLikes  
        });
        sauce.save()
        .then(() => res.status(201).json({message: 'objet enregistré'}))
        .catch(error => res.status(400).json({ error }))
        
}

exports.getOneSauce = (req, res, next) =>{
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }))
}



exports.modifySauce = (req, res, next) =>{
    const protocolGet = req.headers.referer.split(':')[0];
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${protocolGet}://${req.get('host')}/images/${req.file.filename}`,
    } : { ...req.body };
  
    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }))
}

exports.deleteSauce = (req, res, next) =>{
    Sauce.findOne({ _id: req.params.id})
    .then((sauce) => {
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({message: 'Not authorized'});
        } else {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                    .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch(error => res.status(500).json({ error }))
    
}
/*exports.createLike = (req, res, next) =>{
 
}*/