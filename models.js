const mongoose = require('mongoose');

const blogPostSchema = mongoose.Schema({
  author: {
    firstName: String,
    lastName: String
  },
  title: {type: String, required: true},
  content: {type: String},
  created: {type: Date, default: Date.now}
});

//added user schema 
//format for users input
const UserSchema = mongoose.Schema({
  username: String,
  password: {type: String},
  firstName: String,
  lastName: String
}); 

//HASH & PASSWORD METHODS 
UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

//creates representation of the user
//receives the form from User schema, then returns this representation
UserSchema.method.apiRepr = function() {
  return {
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName
  };
};

blogPostSchema.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogPostSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    author: this.authorName,
    content: this.content,
    title: this.title,
    created: this.created
  };
}

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
const User = mongoose.model('User', UserSchema);

module.exports = {BlogPost, User};
