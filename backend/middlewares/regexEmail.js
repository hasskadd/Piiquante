module.exports = (req, res, next)=>{
        // //création du reg exp pour la validation du mail
        let emailRegex = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/
        let testEmail = emailRegex.test(req.body.email);
        testEmail ? next() :  res.status(400).json({ message: 'mail non valide, choisiez un nouveau mail' });
    
};