let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;


let vicepresidenciaSchema = mongoose.Schema({
	vp: { type : String },
	vpName: { type : String },
	gastosjd19: { type: Number },
	planjd19 : { type: Number },
	varvsplan2019 : { type: Number},
	gastosjd18 : { type: Number },
	varvsplan2018 : { type: Number},
	gastosjd14 : { type : Number },
	varvsplan2014 : { type: Number}

});

// let userSchema = mongoose.Schema({
// 	username : { type : String, 
// 				 required : true, 
// 				 unique : true },
// 	password : { type : String,
// 				 required : true }
// })

let Vicepresidencia = mongoose.model( 'Viajes', vicepresidenciaSchema );
// let User = mongoose.model( 'User', userSchema );

// let UserList = {
// 	register : function( user ){
// 		return User.find( {username : user.username} )
// 			.then( checkUser => {
// 				if ( checkUser.length == 0 ){
// 					return bcrypt.hash(user.password, 10)
// 				}
// 			})
// 			.then( hashPassword =>{
// 				return User.create({
// 					username : user.username, 
// 					password : hashPassword
// 				})
// 				.then( newUser => {
// 					return newUser;
// 				})
// 				.catch( error => {
// 					throw Error( error );
// 				});
// 			})
// 			.catch( error => {
// 				throw Error( error );
// 			});
// 	},
// 	login : function( user ){
// 		return User.findOne( {username : user.username} )
// 			.then( checkUser => {
// 				if ( checkUser ){
// 					return bcrypt.compare(user.password, checkUser.password)
// 				}
// 			})
// 			.then( validUser => {
// 				if( validUser ){
// 					return "Valid User";
// 				}
// 				else{
// 					throw Error("Invalid User");
// 				}
// 			})
// 			.catch( error => {
// 				throw Error( error );
// 			});
// 	}
// }


let VPList = {
	get : function(){
		return Vicepresidencia.find()
				.then( datosVP => {
					return datosVP;
				})
				.catch( error => {
					throw Error( error );
				});
	}
	// ,
	// post : function( newPet ){
	// 	return Pet.create( newPet )
	// 			.then( pet => {
	// 				return pet;
	// 			})
	// 			.catch( error => {
	// 				throw Error(error);
	// 			});
	// }
};

module.exports = { VPList };


