const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
//Define Model
const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    password: String
})
userSchema.methods.comparePassword = function(candidatePassword,callback){
    bcrypt.compare(candidatePassword,this.password,function(err,isMatch){
        if(err) return callback(err)
        callback(null,isMatch);
    })
}
//On save model hook
//adding event handler to execute before the "save event"
userSchema.pre('save', function (next) {
    const user = this;      //get access to the model in this case user model
    //generate salt than run callback
    bcrypt.genSalt(10, function (error, salt) {
        if (error) return next(error);

        //hash the password using the salt
        bcrypt.hash(user.password, salt, null, function (error, hash) {
            if (error) return next(error);

            //overwrite the plaintext with hash
            user.password = hash;
            next();
        });
    });
});

//Create Model

const ModelClass = mongoose.model('user', userSchema);


//Export Model

module.exports = ModelClass;