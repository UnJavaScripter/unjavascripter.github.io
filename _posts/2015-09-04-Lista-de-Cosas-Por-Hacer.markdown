---
layout: post
title:  "Ejemplo básico: Lista de Cosas Por Hacer"
date:   2015-09-04 14:30:50
categories: angularjs
---
##Lista de Cosas Por Hacer
En el mundo AngularJS el ejemplo básico suele ser un To Do list (lista de cosas por hacer/asuntos pendientes/...), entonces hagamos una.

###1 - Agregando la librería
Simplemente llamamos a un único script
<script src="https://gist.github.com/UnJavaScripter/b997ae77a65829f696f8.js?file=listaDeCosasPorHacer_0.html"></script>
- En el navegador verás: nada

###2 - Definir en donde vivirá nuestra aplicación AngularJS
Algo maravilloso de AngularJS es que puede residir en conjunto con otros frameworks dentro de la misma aplicación, fácilmente podemos hacer que Angular viva dentro de un <div> sin preocuparse por lo que exista fuera de él.
<!--more-->
Para definir nuestra aplicación simplemente usamos la directiva (ya después veremos que es eso, por ahora vamos a pensar en ella como un atributo más para una etiqueta HTML) **ng-app**. Si bien podemos ubicarla dentro de cualquier contenedor html, vamos a ponerla dentro de la etiqueta < body >, de esta forma todo lo que esté dentro del cuerpo (body) de nuestr aplicación estará al alcance (en el *scope*) de AngularJS.

La directiva **ng-app** requiere un valor, este será el nombre de nuestra aplicación, en nuestro caso será *listaDeCosasPorHacer*
<script src="https://gist.github.com/UnJavaScripter/b997ae77a65829f696f8.js?file=listaDeCosasPorHacer_1_controlador.html"></script>
- En el navegador verás: nada

###3 - Crear nuestra aplicación en JavaScript
Ya definimos en donde va a existir nuestra aplicación dentro del HTML de nuestra aplicación, ahora debemos referenciarlo en nuestro archivo JavaScript
<script src="https://gist.github.com/UnJavaScripter/b997ae77a65829f696f8.js?file=listaDeCosasPorHacer_2_binding.html"></script>
- En el navegador verás: nada

###4 - Probar que funciona
AngularJS intentará interpretar cualquier cosa que encuentre envuelta en llaves dobles: {{ }}. Más adelante veremos cómo funcionan, por ahora nos bastará con ver si al poner en ellas una operación matematica obtenemos un resultado
<iframe style="width: 100%; min-min-height: 360px; height: auto" src="http://embed.plnkr.co/rKrLZC7yCKdXwpzBC8Fh/index.html" frameborder="0"></iframe>


###5 - Creando un controlador
Ya tenemos nuestra aplicación definida, ahora necesitamos un controlador para trabajar en un bloque específico de código. Una aplicación puede tener n cantidad de controladores.

Dentro del controlador usaremos **$scope**, creo que lo mejor es pensar en él como el puente que permite conectar nuestro controlador con el HTML (la vista). Todo lo que se defina dentro de $scope será visible en la vista y será accesible a través de dobles llaves.

En la vista crearemos un div con la directiva ng-controller con valor igual al nombre del controlador ponemos en nuestro archivo JavaScript
<iframe style="width: 100%; min-height: 360px; height: auto" src="http://embed.plnkr.co/JegccOMiGutygr2LVIpt/index.html" frameborder="0"></iframe>


###6 - Binding
Ya sabemos que funciona, ahora vamos a conectar nuestro código JavaScript a nuestro HTML.

Vamos a crear un campo de texto en el html, le asignaremos el valor tareaNueva usando la directiva ng-model, así ambos valores quedarán ligados.

Para que sea visible el binding vamos a poner entre llaves dobles "tareaNueva"
<iframe style="width: 100%; min-height: 360px; height: auto" src="http://embed.plnkr.co/PqREpmoDJjATvQFtYc5N/index.html" frameborder="0"></iframe>


###7 - Lista de tareas con ng-repeat
Vamos a usar otra directiva, en este punto ya es evidente que las directivas son una gran cantidad de funcionalidades que Angular agrega a nuestro HTML y nosotros solo debemos llamarlas. [Hay muchas directivas que vienen por defecto con AngularJS](https://docs.angularjs.org/guide/directive){:target="_blank"} y lo mejor de todo es que nosotros podemos crear aun más (en otro post veremos cómo se hace). La directiva que usaremos repite algo con base en el número de elementos en una lista u objeto.

Vamos a crear una lista de tareas pendientes con tareas predeterminadas para visualizar los datos. Agregaremos un formulario que al ser enviado ejecutará una función (definida en la directiva ng-submit) que va a tomar el valor de tareaNueva en el < input > y lo agregará a la lista.
<iframe style="width: 100%; min-height: 360px; height: auto" src="http://embed.plnkr.co/uYu4lTX6FxCjsI2DTMTj/index.html" frameborder="0"></iframe>

###8 - Agregando estados (completado/pendiente)
Ya tenemos una lista a la que podemos agregar elementos, ahora necesitamos poder marcar un elemento como completado.

En el controlador: la lista de tareas $scope.tareas debe contener objetos en vez de strings (cadenas de texto) unicamente así que vamos a reemplazar cada elemento por un objeto conteniendo las propiedades "nombre" y "completada".

En la vista: vamos a añadir un checkbox conectado a la propiedad "completada" del objeto que representa la tarea.
<iframe style="width: 100%; min-height: 360px; height: auto" src="http://embed.plnkr.co/e9P5ugLBWGUoLETxIr9K/index.html" frameborder="0"></iframe>


###9 - Marcando tareas completadas con ng-class
Las tareas completadas deberían tener una apariencia diferente, vamos a usar la directiva ng-class para asignar dinámicamente una clase (tarea-terminada) cuando la propiedad completada de una tarea sea == true.

Creamos la clase tarea terminada dentro de una etiqueta < style > dentro de < head >
<iframe style="width: 100%; min-height: 360px; height: auto" src="http://embed.plnkr.co/Nsjb73rRBaSbGQEXO2oH/index.html" frameborder="0"></iframe>


Creo que es suficiente por ahora ¿Comentarios?

**El demo funcionando:**

<iframe style="width: 100%; min-height: 360px; height: auto" src="http://embed.plnkr.co/Nsjb73rRBaSbGQEXO2oH/index.html" frameborder="0"></iframe>