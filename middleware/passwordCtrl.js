
//import un validator de mot de passe utilisé dans le  schemaPassword
const passwordValidator = require('password-validator');

// Creer un schema
const schemaPassword = new passwordValidator();

// Ajouter des propriétés
schemaPassword
.is().min(5)                                    // Longueur minimale 5
.is().max(50)                                  // Longueur maximale 50
//.has().uppercase()                              // lettre majuscule
.has().lowercase()                              // lettre minuscule
//.has().digits(2)                                // avoir 2 chiffres
.has().not().spaces()                           // Aucun espace
.is().not().oneOf(['Password123']);            // Blacklist 

module.exports = (req, res, next) => {
    if(schemaPassword.validate(req.body.password)) {
        console.log('password ok');
        next();
    }else{
        return res.status(400).json({ error : `this password is nt enough: ${schemaPassword.validate('req.body.password',{list: true })}`})
    }
}