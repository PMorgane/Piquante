
const Sauces = require('../models/Sauces');
const fs = require('fs');

exports.getAllSauces = (req, res, next) => {
  Sauces.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(404).json({ error }));
};

exports.createSauces = (req, res, next) => {
  console.log(req.body);
  console.log(req.body.sauce);
  const saucesObject = JSON.parse(req.body.sauce);
  
  
  console.log("--------");
  console.log(saucesObject._id);
  console.log(saucesObject);
  console.log("--------");
  console.log(saucesObject.userId);
  delete saucesObject._id;
  delete saucesObject.userId;
  const sauces = new Sauces ({
    ...saucesObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    
  });

  sauces
    .save()
    .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
    .catch(error => { res.status(400).json({ error }) })
};


exports.getOneSauces = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then(
      (sauces) => {
        res.status(200).json(sauces);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
};

exports.modifySauces = (req, res, next) => {
  const saucesObject = req.file ? {
    ...JSON.parse(req.body.sauces),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete saucesObject.userId;
  Sauces.findOne({ _id: req.params.id })
    .then((sauces) => {
      if (sauces.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
        console.log(req.auth.userId);
      } else {
        Sauces.updateOne({ _id: req.params.id }, { ...saucesObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet modifié!' }))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteSauces = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then(sauces => {
      if (sauces.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        const filename = sauces.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, (error) => {
          if(error){
            console.log(error,"erreur");
            throw error;
          }else{
          Sauces.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
            .catch(error => res.status(401).json({ error }));
      }});
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};
exports.likeOrDislike = (req, res, next) => {   
  const likes = req.body.like;

  if (req.body.userId != req.auth.userId) {
      res.status(403).json({ message: 'Non autorisé !'});
  } else {

  Sauces.findOne({ _id: req.params.id })
      .then((objetSauces)=> {
          if (!objetSauces.usersLiked.includes(req.body.userId) && likes === 1 ) {
              console.log("like = 1")
              Sauces.updateOne({ _id: req.params.id }, {
                  $inc: { likes : 1 },
                  $push: { usersLiked : req.body.userId }
          })
              .then(() => res.status(200).json({ message: "Like" }))
              .catch((error) => res.status(400).json({ error }))
          }

          if (!objetSauces.usersDisliked.includes(req.body.userId) && likes === -1 ){
              console.log("like = -1 / dislike = 1")
               Sauces.updateOne({ _id: req.params.id }, {
                  $inc: { dislikes : 1 },
                  $push: { usersDisliked : req.body.userId }
              })
                  .then(() => res.status(200).json({ message: "Unlike" }))
                  .catch((error) => res.status(400).json({ error }))
          }

          if (objetSauces.usersLiked.includes(req.body.userId) && likes === 0){
              console.log("il y a zero like");
  
              Sauces.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } })
                  .then(() => res.status(200).json({ message: "Nothing" }))
                  .catch((error) => res.status(400).json({ error }))
                            
          }
          if (objetSauces.usersDisliked.includes(req.body.userId) && likes === 0){
              console.log("il y a zero Dislike");

              Sauces.updateOne({ _id: req.params.id }, {$inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } })
                  .then(() => res.status(200).json({ message: "Nothing" }))
                  .catch((error) => res.status(400).json({ error }))
          }
      })
      .catch((error) => res.status(500).json({ error }))
  }

};