Something something github api repo

Versión live del sitio web en [Heroku](https://voice-stats-20.herokuapp.com/)

<!-- USO DE ARCHIVOS -->
## Archivos importantes

* model.js

Maneja el modelo de datos que accesa al clúster de MongoDB a través del driver Mongoose. La conexión con la base de datos empieza con un [esquema](https://mongoosejs.com/docs/guide.html) que define con qué datos y tipos vamos a trabajar (leer y escribir).

Ejemplo del código en este repo
```sh
let vicepresidenciaSchema = mongoose.Schema({
	vp: { type : String },
	gastosjd19: { type: Number },
	planjd19 : { type: Number },
	gastosjd18 : { type: Number },
	gastosjd14 : { type : Number }
});
```

Cuando tengamos el esquema, necesitamos convertirlo a un modelo que podamos usar para hacer las llamadas a la API.

```sh
let Vicepresidencia = mongoose.model( 'Viajes', vicepresidenciaSchema );
```

'Viajes' es el nombre de la colección que se guardará en Mongo para manejar los archivos con dicho esquema. Por defecto Mongo convierte el nombre que demos a plural y minúsculas. Si definiéramos 

```sh
let Pet = mongoose.model( 'Pet', petSchema );
```
La colección que verías en tu base de datos se llamaría 'pets'


Ahora que tenemos el modelo, utilizaremos las funciones incluidas en el driver Mongoose para acceder registros en nuestra colección de viajes. El siguiente código utiliza la función "find" de MongoDB para traer todos los registros correspondientes al modelo de Vicepresidencia (la colección de viajes)

```sh
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
```


* server.js
Contiene los métodos a los que accesaremos para leer o escribir información; cada método hace uso de los modelos que definimos previamente en el model.js

```sh
app.get( "/api/gastosVP", ( req, res, next ) => {
	VPList.get()
		.then( vicepresidencia => {
			return res.status( 200 ).json( vicepresidencia );
		})
		.catch( error => {
			res.statusMessage = "No pudimos accesar a la base de datos. Intenta más tarde.";
			return res.status( 500 ).json({
				status : 500,
				message : "No pudimos accesar a la base de datos. Intenta más tarde."
			})
		});
});
```
Este método utiliza la función que definimos anteriormente en nuestro archivo model.js, retorna todos los registros en la colección "viajes"; y se accesa utilizando la url del servidor web que tenemos funcionando, por ejemplo:

```sh
https://misitioweb.com/api/gastosVP
```

Y lo que obtendremos haciendo un API call serán todos los registros de los gastos de las vicepresidencias.

* Deployment
Puedes usar Heroku para poner tu servidor en línea. Sólo necesitas agregar una variable de entorno (DATABASE_URL) en el dashboard de tu Heroku app que contenga el string de conexión a tu clúster de MongoDB.

### Uso con Alexa
1. Agrega la dependencia 'node-fetch' a tu archivo package.json
```sh
La sección de dependencies debe reflejar el paquete node-fetch

  "dependencies": {
    "ask-sdk-core": "^2.6.0",
    "ask-sdk-model": "^1.18.0",
    "aws-sdk": "^2.326.0",
    "node-fetch": "^2.6.0"
  }
```

2. En un archivo aparte (yo lo nombré 'apiUtils.js') puedes agregar las funciones auxiliares que se encargarán de hacer las llamadas a los endpoints que definimos en server.js

```sh
const fetch = require('node-fetch');

module.exports.findVP = async function findVP(slotUsuario) {
    let data = await getVP();
    let gastos = '';
        for ( let i = 0; i < data.length; i ++ ){
            if (data[i].vp === slotUsuario) {
                gastos = data[i].gastosjd19;
            }

		}
	console.log(gastos);
	return gastos;
}

async function getVP() {
  let url =
    "https://voice-stats-20.herokuapp.com/api/gastosVP";
  let settings = {
    method: 'GET'
  };
  let response = await fetch(url, settings);
  let data = await response.json();
  console.log(data);
  return data;
}
```

La función getVP() hace la llamada al servidor que tenemos (en mi caso la URL es https://voice-stats-20.herokuapp.com) y retorna todos los datos de ese query. La función findVP toma como parámetro la vicepresidencia que dio el usuario en la interacción, itera por todos los datos hasta que encuentra el set de datos que concuerda con el slot que buscamos.


3. En index.js manejamos cómo utilizar los datos que regresamos de las llamadas a la API
```sh
const fetch = require('node-fetch');
const API = require('./apiUtils.js');

const DarNombreHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'DarNombreIntent';
    },
    async handle(handlerInput) {
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        let slotDadoPorUsuario = slots.nombre.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let speakOutput = 'Perfecto, tus gastos del periodo agosto-diciembre del 2019 son ';
        let gastos = await API.findVP(slotDadoPorUsuario);
        speakOutput += gastos + ' millones de pesos.';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
```
Es importante preceder la función handle con 'async' para poder obtener los datos que necesitamos antes de que termine la respuesta de Alexa al usuario. 
