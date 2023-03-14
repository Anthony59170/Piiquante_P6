const Sauce = require('../models/Sauces');
const fs = require('fs');
// Export de la logique

exports.createSauces = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: 'Post saved successfully!',
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });
};

/* ------------------ Modification Sauce  ------------------*/
exports.modifySauces = (req, res, next) => {
  const sauceObject = req.file // vérifie s'il y a un fichier attaché à la requête (req.file)
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body }; // Autremment, on crée "sauceObject" à partir des données de la requête

  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => {
      res.status(201).json({
        message: 'Succès de la mise à jour du produit !',
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

/* ------------------ Supréssion Sauce  ------------------*/
exports.deleteSauces = (req, res, next) => {
  // Suppréssion de la sauce comportant le même Id que "req.params.id"
  Sauce.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet Supprimé !' }))
    .catch((error) => res.status(400).json({ error }));
};

/* ------------------ Récupération d'une Sauce (page unique)  ------------------*/
exports.getOneSauces = (req, res, next) => {
  // Sélection de LA sauce comportant le même Id que "req.params.id"
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  // Sélection de toutes les sauces
  Sauce.find()
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};

// export du controllers de requête "likeSauces"
exports.likeSauces = (req, res, next) => {
  // Récupération du paramétre URL ':id'
  const sauceId = req.params.id;
  // Récupération dans le corp de la réquête le userId
  const userId = req.body.userId;
  // Récupération dans le corp de la réquête de la valeur du like
  const like = req.body.like;
  // Recherche d'un élément (dynamiquement) grâce à l'argument "sauceId"
  Sauce.findById(sauceId)
    // Pour permettre de traiter les demandes de "like/dislikes" de manière asynchrone (prommess)
    .then((sauce) => {
      // Vérifier si l'utilisateur a déjà aimé ou pas aimé cette sauce
      const likedBefore = sauce.usersLiked.includes(userId);
      const dislikedBefore = sauce.usersDisliked.includes(userId);

      // Mise à jour du statut "Like"
      switch (like) {
        case 1:
          // Valeur de req.body.like : 1
          if (!likedBefore) {
            // Si l'utilisateur n'a pas aimé la sauce auparavant, ajouter son ID au tableau usersLiked
            sauce.usersLiked.push(userId);
            // Puis incrémenter de 1 les "likes" du produit
            sauce.likes++;
          } else {
            // Si l'utilisateur a déjà aimé la sauce, ne rien faire
          }
          if (dislikedBefore) {
            // Si l'utilisateur a précédemment disliké la sauce, retirer son ID du tableau usersDisliked
            sauce.usersDisliked.pull(userId);
            // Puis décrémenter les 'dislikes'
            sauce.dislikes--;
          }
          // Sortie de la boucle
          break;
        case 0:
          // Valeur de req.body.like : 0
          if (likedBefore) {
            // Si l'utilisateur a aimé la sauce auparavant, retirer son ID du tableau usersLiked
            sauce.usersLiked.pull(userId);
            // Puis décrémenter les 'likes'
            sauce.likes--;
          }
          if (dislikedBefore) {
            // Si l'utilisateur a disliké la sauce auparavant, retirer son ID du tableau usersDisliked
            sauce.usersDisliked.pull(userId);
            sauce.dislikes--;
          }
          break;
        case -1:
          // Valeur de req.body.like : -1
          if (!dislikedBefore) {
            // Si l'utilisateur n'a pas disliké la sauce auparavant, ajouter son ID au tableau usersDisliked
            sauce.usersDisliked.push(userId);
            sauce.dislikes++;
          } else {
            // Si l'utilisateur a déjà disliké la sauce, ne rien faire
          }
          if (likedBefore) {
            // Si l'utilisateur a précédemment aimé la sauce, retirer son ID du tableau usersLiked
            sauce.usersLiked.pull(userId);
            sauce.likes--;
          }
          break;
        default:
          return res.status(400).json({ error: "Valeur 'like' invalide." });
      }

      // Mise à jour du nombre total de "Like" et "Dislike" dans la BDD
      sauce
        .save()
        .then(() => {
          res.status(200).json({
            message: 'Le statut de la sauce a été mis à jour avec succès.',
          });
        })
        .catch((error) => {
          res.status(500).json({ error });
        });
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};
