let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;

let petSchema = mongoose.Schema({
	name : { type : String },
	typeOfPet : { type : String },
	id : { 
			type : Number,
			required : true }
});

let userSchema = mongoose.Schema({
	username : { type : String, 
				 required : true, 
				 unique : true },
	password : { type : String,
				 required : true }
})

let Pet = mongoose.model( 'Pet', petSchema );
let User = mongoose.model( 'User', userSchema );

let UserList = {
	register : function( user ){
		return User.find( {username : user.username} )
			.then( checkUser => {
				if ( checkUser.length == 0 ){
					return bcrypt.hash(user.password, 10)
				}
			})
			.then( hashPassword =>{
				return User.create({
					username : user.username, 
					password : hashPassword
				})
				.then( newUser => {
					return newUser;
				})
				.catch( error => {
					throw Error( error );
				});
			})
			.catch( error => {
				throw Error( error );
			});
	},
	login : function( user ){
		return User.findOne( {username : user.username} )
			.then( checkUser => {
				if ( checkUser ){
					return bcrypt.compare(user.password, checkUser.password)
				}
			})
			.then( validUser => {
				if( validUser ){
					return "Valid User";
				}
				else{
					throw Error("Invalid User");
				}
			})
			.catch( error => {
				throw Error( error );
			});
	}
}

let PetList = {
	get : function(){
		return Pet.find()
				.then( pets => {
					return pets;
				})
				.catch( error => {
					throw Error( error );
				});
	},
	post : function( newPet ){
		return Pet.create( newPet )
				.then( pet => {
					return pet;
				})
				.catch( error => {
					throw Error(error);
				});
	}
};

module.exports = { PetList, UserList };


