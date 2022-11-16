const jwt = require('jsonwebtoken')
require('dotenv').config() 
module.exports = (req, res, next) =>{
    try{
        // on utilise le header authorization de la requete (CORS) on split le tableau et on récupère l'élément à l'indice 1 (Bearer Token)
        const token =req.headers.authorization.split(' ')[1];
        // décoder le token en vérifiant qu'il correspond avec sa clef secrète
        const decodedToken = jwt.verify(token, 'RAMDOM_TOKEN_SECRET');
         // on récupère le user id décodé par le jwt.vérify
        const userId = decodedToken.userId;
        // on rajoute l'objet userId à l'objet requete
        req.auth = {userId: userId};
        next()
    }
    catch(error){
        res.status(401).json({error})
    }
}