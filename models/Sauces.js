const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const saucesSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  heat: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  likes: { default: 0, type: Number, required: true },
  dislikes: { default: 0, type: Number, required: true },
  usersLiked: { type: [], required: true },
  usersDisliked: { type: [], required: true },
});

saucesSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Sauces', saucesSchema);

// userId : String — l'identifiant MongoDB unique de l'utilisateur qui a créé la
// sauce
// ● name : String — nom de la sauce
// ● manufacturer : String — fabricant de la sauce
// ● description : String — description de la sauce
// ● mainPepper : String — le principal ingrédient épicé de la sauce
// ● imageUrl : String — l'URL de l'image de la sauce téléchargée par l'utilisateur
// ● heat : Number — nombre entre 1 et 10 décrivant la sauce
// ● likes : Number — nombre d'utilisateurs qui aiment (= likent) la sauce
// ● dislikes : Number — nombre d'utilisateurs qui n'aiment pas (= dislike) la
// sauce
// ● usersLiked : [ "String <userId>" ] — tableau des identifiants des utilisateurs
// qui ont aimé (= liked) la sauce
// ● usersDisliked : [ "String <userId>" ] — tableau des identifiants des
// utilisateurs qui n'ont pas aimé (= disliked) la sauce
