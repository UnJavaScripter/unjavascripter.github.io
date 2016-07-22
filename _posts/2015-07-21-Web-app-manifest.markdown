---
layout: post
title:  "Web App Manifest"
date:   2016-07-21 19:00:10
categories: js, web
lvl: intro
comments: true
description: "El primer paso para crear aplicaciones web progresivas es crear un archivo 'manifest'. Gracias a este archivo podemos definir iconos y configuración de colores para nuestra app, entre otros"
---

## 1. Referencia a nuestro 'manifest'

Empecemos por 'llamar' al archivo manifest que crearemos en el siguiente paso:

`<link rel="manifest" href="manifest.json">`

Como ves, usamos la etiqueta `link` como si fuéramos a referenciar una hoja de estilos `CSS`, sólo que cambiamos el valor del atributo `rel` a `manifest`. Con esto el navegador entenderá que nos referimos a un _manifiesto_

## 2. El archivo 'manifest'

Ahora podemos crear el archivo `manifest.json` (puede tener un nombre diferente si así lo quisiéramos) en la raíz de nuestro proyecto, al mismo nivel de `index.html`:

```JSON
{
  "name": "Blog de UnJavaScripter",
  "short_name": "UnJavaScripter",
  "icons": [
    {
      "src": "logo_48.png",
      "type": "image/png",
      "sizes": "48x48"
    },
    {
      "src": "logo_96.png",
      "type": "image/png",
      "sizes": "96x96"
    },
    {
      "src": "logo_192.png",
      "type": "image/png",
      "sizes": "192x192"
    }
  ],
  "start_url": "index.html?origin=installed",
  "background_color": "#ffd301",
  "theme_color": "#0ff"
}

```

Cuándo la aplicación se ejecuta desde el escritorio de un teléfono, el usuario verá una pantalla con el valor de `background_color` definido como color de fondo, un nombre para la aplicación definido en `name` y un icono del array `icons`.


### "name"

El nombre completo de nuestra aplicación, con 'pelos y señales' para describirla.

### "short_name"

El nombre corto para acceso directo (después veremos cómo se crean).

### "icons"

Un array de objetos que describen iconos para nuestra aplicación, en donde `src` es la ruta de la imagen, `type` es el tipo de imagen que usamos y `sizes` representa el tamaño de la imagen.

### "start_url"

En esta propiedad especificamos el documento html que queremos que se ejecute al ejecutar la aplicación desde el escritorio de un teléfono.

Un truco muy útil es pasar un argumento como en este caso `?origin=installed` de esta forma podemos verificar, en Google Analytics por ejemplo, cuántos usuarios acceden a nuestra aplicación desde un _shortcut_ en su teléfono. Tanto el argumento que pasamos y su valor pueden ser lo que queramos.

### "background_color"

Fondo de pantalla que aparecerá mientras la aplicación carga (aplica para ejecuciones desde el escritorio de un teléfono).

### "theme_color"

Establece el color de fondo de la interfaz de Chrome en dispositivos móviles.


  