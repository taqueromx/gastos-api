Something something github api repo

Versión live del sitio web en [Heroku](https://voice-stats-20.herokuapp.com/)

<!-- USO DE ARCHIVOS -->
## Archivos importantes

* model.js

Maneja el modelo de datos que accesa al clúster de MongoDB a través del driver Mongoose de MongoDB para Javascript. La conexión con la base de datos empieza con un [esquema](https://mongoosejs.com/docs/guide.html) que define qué datos y tipos vamos a querer accesar y agregar.

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

### Prerequisites


* npm
```sh
npm install npm@latest -g
```

### Installation
1. On root folder
```sh
npm install
npm start
```
2. Concurrently, on a different terminal window
```sh
cd titania-client
npm start
```


<!-- USAGE EXAMPLES -->
## Usage