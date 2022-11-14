const passworldSchema = require('../models/Password')

module.exports = (req, res, next) =>{
    passworldSchema.validate(req.body.password) ? next() : res.status(400).json({message : `Mots de passe faible ${passworldSchema.validate('req.body.password', { list: true })}`})
}