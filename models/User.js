const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// déclaration du userShema 
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// la méthode plugin est utilisée pour ajouter uniqueValidator à userSchema. En utilisant des index uniques définis dans le schéma.
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
