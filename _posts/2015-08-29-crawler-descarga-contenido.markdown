---
layout: post
title:  "Haciendo un Crawler para descargar contenido"
date:   2016-05-09 20:37:50
categories: nodejs
comments: true
description: "¿Alguna vez has necesitado descargar una gran cantidad de contenido de Internet? Si es así entonces sabes que lo mejor es automatizarlo."
emoji:  ☑
---


Se ha vuelto costumre en empresas de tecnología solicitar como prueba en sus procesos de selección hacer que el candidato cree un [web crawler](https://es.wikipedia.org/wiki/Ara%C3%B1a_web). Un crawler es una aplicación que básicamente se encarga de seguir links en un sitio web y hacer algo con la información que encuentre en cada ruta, puede ser obtener todos los títulos, referencias externas, nombres, correos electrónicos, imágenes... En este post vamos a hacer un crawler que descargará contenido de una única ruta en un sitio web.


## Set up

Voy a usar [NodeJS](https://nodejs.org/) porque... JavaScript.

Las guías que se encuentran en Internet normalmente usan [CasperJS](http://casperjs.org/)/[PhantomJS](http://phantomjs.org/), en este ejemplo no los usaré porque si bien funcionan sobre node, sus métodos no usan JavaScript entonces resulta antinatural usarlo (no digo que sea malo, es muy poderoso y cubre casos de uso que el método que usaré en esta guía no alcanza a cubrir).

Usaré [Cheerio](https://github.com/cheeriojs/cheerio) que es una implementación de jQuery para node. Nos permite manipular elementos del DOM como si estuvieramos trabajando sobre el sitio web directamente, podemos por ejemplo recorrer una lista de elementos con los mismos métodos que usamos día a día (a diferencia de casper que como dije antes usa métodos específicos de su implementación).

Adicionalmente usaré [request](https://github.com/request/request) para realizar las solicitudes http.

Por último `fs` el paquete de acceso al sistem ade archivos (File System) incluido en node.


## Dependencias

Después de crear una carpeta para el proyecto empezamos con la instalación de dependencias:

`$ npm init`


Seguimos las instrucciones (o enter, enter, enter...) y obtenemos:

```json
{
  "name": "baja-archivos",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "unJavaScripter",
  "license": "MIT"
}
```

(Puedes copiar y pegar ese objeto JSON en un archivo y llamarlo package.json)

Una vez tenemos nuestro package.json podemos empezar a instalar dependencias:


- `$ npm install request --save`
- `$ npm install cheerio --save`


`--save` es un _flag_ que le dice a npm que queremos que se guarde la referencia a estos paquetes en nuestro archivo package.json


## El código

Creamos un archivo `app.js` en donde escribiremos nuestra aplicación. Para poner la aplicación a andar ejecutaremos:


`$ node app`


Lo primero que hacemos es importar las dependencias que instalamos (y _fs_ que ya viene con node):

```js
'use strict';

const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');


// ...

```

Ya podemos empezar a hacer solicitudes.

### Haciendo una solicitud HTTP

```js
'use strict';

const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

let url = 'http://www.rmsproductions.co.uk/kindle/Kindle/';

request(url, (error, response, html) => {

  if(!error){
    console.log(html);
  }else{
    console.log(error);
  }


});
```

Es muy claro lo que hacemos hasta este punto: realizamos una solicitud con `request` en donde el primer parámetro es la url que queremos solicitar y el segundo la función que se ejecutará al tener una respuesta (de solicitud compĺetada o error).

En este punto ya podemos ejecutar nuestra aplicación con `$ node app`. En la terminal veremos el HTML plano del sitio.


### Agregando Cheerio

```js
'use strict';

const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

let url = 'http://www.rmsproductions.co.uk/kindle/Kindle/'

request(url, (error, response, html) => {

  if(!error){
      let $ = cheerio.load(html);
      let anchorTag = $('a');
      
      // Links
      $(anchorTag).each((i, a) =>{
          console.log($(a).attr('href'));
      });

  }else{
    console.log(error);
  }


});
```

Cheerio nos ayuda a filtrar el HTML que request devuelve. Primero filtramos sobre la etiqueta `body` del documento y tomamos todos los elementos `<a></a>` (anchor ~ links) dentro de ella.

Por cada etiqueta `a` enviamos su propiedad `href` a consola después de decodificarla con [`decodeURI`](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/decodeURI).

Al ejecutar la aplicación veremos un listado de todos los links dentro de la url que solicitamos.

```
1776 - David McCullough.mbp
1776 - David McCullough.mobi
1984 - George Orwell.mobi
1st to Die - James Patterson.mobi
2nd Chance - James Patterson.mobi
3rd Degree - James Patterson.mobi
...
```

### Descargando los archivos

Una vez tenemos los links para cada archivo creamos la función que se encargará de realizar la descarga a partir de una url y un nombre de archivo que pasaremos como parámetros:

```js
const writeFile = (uri, fileName) => {
    
  const fileRequest = request(uri)
    .pipe(
      fs.createWriteStream(fileName)
    );

  fileRequest.on('error', function(err) {
    console.log(err);
  });

  fileRequest.on('close', function(response){
    console.log(`File ${fileName} was successfully downloaded!`);
  });

}
```

`fileRequest` es la definición de la solicitud HTTP conectada con la creación del archivo (en _fs.createWriteStream_) usando _pipes_.

Finalmente tenemos un callback para error y otro que se ejecutar al finalizar la solicitud.

### Actualizando nuestra solicitud inicial

Ya tenemos la función que vamos a ejecutar sobre cada link que cumpla las condiciones deseadas, en este caso que dirija a un archivo con una extensión en particular. Para asegurarnos de que así sea vamos a crear una [expresión regular](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/RegExp) sencilla que llamaremos `extensionRegex`.



```js
let url = 'http://www.rmsproductions.co.uk/kindle/Kindle/';
let extension = '.mobi';

request(url, (error, response, html) => {

  if(!error){
      let $ = cheerio.load(html);
      let anchorTag = $('a');
      let extensionRegex = new RegExp(extension+'$');

      // Links
      $(anchorTag).each((i, a) =>{

        let fileUrl = $(a).attr('href');
        
        if(extensionRegex.test(fileUrl)) {
          
          let fileName = decodeURI(fileUrl).match(/[^/]*$/g)[0];
          let isRemoteRoute = (/^http(?:s)?:\/\//).test($(a).attr('href'));
          
          if(isRemoteRoute){
            writeFile(fileUrl, fileName);
          }else{
            writeFile(url + fileUrl, fileName);
          }

        }

      });

  }else{
    console.log(error);
  }


});
```

`extensionRegex` _se alimenta_ de la variable `extension`que contiene la extensión de archivo que deseamos descargar, seguida del símbolo `$` que le indica a la expresión regular que queremos que haga una coincidencia cuando encuentre la extensión al final de una cadena de texto.

Así mismo `fileName` e `isRemoteRoute` se comparan con expresiones regulares para validar su contenido. En el caso de `fileName` extraemos únicamente el nombre del archivo (sin el resto de la ruta).

Para `isRemoteRoute` validamos si la ruta a la que dirige el link empieza por _http://_ o _https://_. De esta forma sabemos si debemos o no pasar el valor de la ruta original a `writeFile`.


### Últimos ajustes

Tener que modificar la URL y la extensión desde el código resulta engorroso (y poco pro). Vamos a pasar estos valores como parámetros de ejecución de nuestra aplicación:

```js
..

let url = process.env.URL;
let extension = process.env.EXTENSION;

...

```

Desde ahora debemos ejecutar nuestra aplicación así: 

`URL='http://www.rmsproductions.co.uk/kindle/Kindle/' EXTENSION='.mobi' node app`

### Resultado final - El código que puedes copíar y pegar

Todo junto se ve así:

```js
'use strict';

const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

const writeFile = (uri, fileName) => {
  console.log('will download from ', fileName);
  const fileRequest = request(uri)
    .pipe(
      fs.createWriteStream(fileName)
    );

  fileRequest.on('error', function(err) {
    console.log(err);
  });

  fileRequest.on('close', function(response){
    console.log(`File ${fileName} was successfully downloaded!`);
  });

}

let url = process.env.URL;
let extension = process.env.EXTENSION;

request(url, (error, response, html) => {

  if(!error){
      let $ = cheerio.load(html);
      let anchorTag = $('a');
      let regex = new RegExp(extension+'$');

      // Links
      $(anchorTag).each((i, a) =>{

        let fileUrl = $(a).attr('href');
        
        if(regex.test(fileUrl)) {
          
          let fileName = decodeURI(fileUrl).match(/[^/]*$/g)[0];
          let isRemoteRoute = (/^http(?:s)?:\/\//).test($(a).attr('href'));
          
          if(isRemoteRoute){
            writeFile(fileUrl, fileName);
          }else{
            writeFile(url + fileUrl, fileName);
          }

        }

      });

  }else{
    console.log(error);
  }


});

```


[Repositorio aquí](https://github.com/UnJavaScripter/node-file-downloader)