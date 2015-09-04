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
```html
<!DOCTYPE html>
<html>
<head>
    <title></title>
</head>
<body>

	<!--- Agrega la siguiente línea -->
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.4/angular.min.js"></script>

</body>
</html>
```
- En el navegador verás: nada

###2 - Definir en donde vivirá nuestra aplicación AngularJS
Algo maravilloso de AngularJS es que puede residir en conjunto con otros frameworks dentro de la misma aplicación, fácilmente podemos hacer que Angular viva dentro de un <div> sin preocuparse por lo que exista fuera de él.

Para definir nuestra aplicación simplemente usamos la directiva (ya después veremos que es eso, por ahora vamos a pensar en ella como un atributo más para una etiqueta HTML) **ng-app**. Si bien podemos ubicarla dentro de cualquier contenedor html, vamos a ponerla dentro de la etiqueta < body >, de esta forma todo lo que esté dentro del cuerpo (body) de nuestr aplicación estará al alcance (en el *scope*) de AngularJS.

La directiva **ng-app** requiere un valor, este será el nombre de nuestra aplicación, en nuestro caso será *listaDeCosasPorHacer*
```html
<!DOCTYPE html>
<html>
<head>
    <title></title>
</head>
<body ng-app="listaDeCosasPorHacer">

	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.4/angular.min.js"></script>

</body>
</html>
```
- En el navegador verás: nada

###3 - Crear nuestra aplicación en JavaScript
Ya definimos en donde va a existir nuestra aplicación dentro del HTML de nuestra aplicación, ahora debemos referenciarlo en nuestro archivo JavaScript
```html
<!DOCTYPE html>
<html>
<head>
    <title></title>
</head>
<body ng-app="listaDeCosasPorHacer">

	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.4/angular.min.js"></script>

	<!-- Creamos una etiqueta script -->
	<script>
		 // Definimos nuestra aplicación con el mismo nombre que
		 // pusimos en la directiva ng-app y a continuación pasamos
		 // un array vació (allí pondríamos las dependencias de la 
		 // aplicación si existieran... Ya lo veremos en algún momento).
		 // Es importante recordar poner el array vacío, así es como
		 // Angular sabe que esa definición se refiere a toda la aplicación
		 angular
		 	.module('listaDeCosasPorHacer', []);
	</script>

</body>
</html>
```
- En el navegador verás: nada

###4 - Probar que funciona
AngularJS intentará interpretar cualquier cosa que encuentre envuelta en llaves dobles: {{ }}. Más adelante veremos cómo funcionan, por ahora nos bastará con ver si al poner en ellas una operación matematica obtenemos un resultado
```html
<!DOCTYPE html>
<html>
<head>
    <title></title>
</head>
<body ng-app="listaDeCosasPorHacer">
	La respuesta a la vida, el universo y todo es: {{7*6}}

	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.4/angular.min.js"></script>

	<script>
		 angular
		 	.module('listaDeCosasPorHacer', []);
	</script>
</body>
</html>
```
- En el navegador verás: [La respuesta a la vida, el universo y todo es: 42](http://plnkr.co/edit/rKrLZC7yCKdXwpzBC8Fh?p=preview){:target="_blank"}


###5 - Creando un controlador
Ya tenemos nuestra aplicación definida, ahora necesitamos un controlador para trabajar en un bloque específico de código. Una aplicación puede tener n cantidad de controladores.

Dentro del controlador usaremos **$scope**, creo que lo mejor es pensar en él como el puente que permite conectar nuestro controlador con el HTML (la vista). Todo lo que se defina dentro de $scope será visible en la vista y será accesible a través de dobles llaves.

En la vista crearemos un div con la directiva ng-controller con valor igual al nombre del controlador ponemos en nuestro archivo JavaScript
```html
<!DOCTYPE html>
<html>
<head>
    <title></title>
</head>
<body ng-app="listaDeCosasPorHacer">
	<!-- Lo que esté dentro de este div estará disponible para el controlador y viceversa -->
	<div ng-controller="controladorPrincipal">
		<!-- Llamamos al elemento del controlador que definimos más abajo usando llaves dobles y omitiendo "$scope." -->

		Aquí viene texto generado en el controlador: {{tareaNueva}}
	</div>
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.4/angular.min.js"></script>

	<script>
		 angular
		 	.module('listaDeCosasPorHacer', []);

 		 // Definimos el controlador como un hijo de la aplicación
 		 // por eso la referenciamos nuevamente, pero
 		 // **sin poner el array vacío después del nombre**

		 angular
		 	.module('listaDeCosasPorHacer')
		 		// En la definición del controlador primero va el
		 		// nombre como string y luego el nombre de la
		 		// función que lo representa

		 		.controller('controladorPrincipal', controladorPrincipal);
 		 
 		 // Pasamos $scope como argumento de la función,
 		 // esto es inyección de dependencias.
 		 // Si no lo pasaramos como argumento no lo podríamos usar
 		 // dentro del controlador

 		 function controladorPrincipal($scope){
 		 	$scope.tareaNueva = 'Algo que me falta hacer';
 		 }

	</script>
</body>
</html>
```
- [Demo](http://plnkr.co/edit/JegccOMiGutygr2LVIpt?p=preview){:target="_blank"}

###6 - Binding
Ya sabemos que funciona, ahora vamos a conectar nuestro código JavaScript a nuestro HTML.

Vamos a crear un campo de texto en el html, le asignaremos el valor tareaNueva usando la directiva ng-model, así ambos valores quedarán ligados.

Para que sea visible el binding vamos a poner entre llaves dobles "tareaNueva"
```html
<!DOCTYPE html>
<html>
<head>
    <title></title>
</head>
<body ng-app="listaDeCosasPorHacer">
	<div ng-controller="controladorPrincipal">
		<input ng-model="tareaNueva"> {{tareaNueva}}
	</div>

	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.4/angular.min.js"></script>

	<script>
		 angular
		 	.module('listaDeCosasPorHacer', []);



		 angular
		 	.module('listaDeCosasPorHacer')
		 		.controller('controladorPrincipal', controladorPrincipal);

 		 function controladorPrincipal($scope){
 		 	$scope.tareaNueva = 'Algo que me falta hacer';
 		 }

	</script>
</body>
</html>
```

- [Demo](http://plnkr.co/edit/PqREpmoDJjATvQFtYc5N?p=preview){:target="_blank"}

###7 - Lista de tareas con ng-repeat
Vamos a usar otra directiva, en este punto ya es evidente que las directivas son una gran cantidad de funcionalidades que Angular agrega a nuestro HTML y nosotros solo debemos llamarlas. [Hay muchas directivas que vienen por defecto con AngularJS](https://docs.angularjs.org/guide/directive){:target="_blank"} y lo mejor de todo es que nosotros podemos crear aun más (en otro post veremos cómo se hace). La directiva que usaremos repite algo con base en el número de elementos en una lista u objeto.

Vamos a crear una lista de tareas pendientes con tareas predeterminadas para visualizar los datos. Agregaremos un formulario que al ser enviado ejecutará una función (definida en la directiva ng-submit) que va a tomar el valor de tareaNueva en el < input > y lo agregará a la lista.
```html
<!DOCTYPE html>
<html>
<head>
    <title></title>
</head>
<body ng-app="listaDeCosasPorHacer">
	<div ng-controller="controladorPrincipal">

		<form ng-submit="agregarTareaNueva()">
			<input ng-model="tareaNueva">
			<input type="submit" value="Agregar">
		</form>
    <hr>
    <ul>
      <li ng-repeat="tarea in tareas">{{tarea}}</li>
    </ul>
	</div>

	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.4/angular.min.js"></script>

	<script>
		 angular
		 	.module('listaDeCosasPorHacer', []);



		 angular
		 	.module('listaDeCosasPorHacer')
		 		.controller('controladorPrincipal', controladorPrincipal);

 		 function controladorPrincipal($scope){

 		 	$scope.tareas = ["Aprender AngularJS", "Dejar un comentario", "No usar Internet Explorer"]

 		 	$scope.agregarTareaNueva = function(){

 		 		// Hacemos un push al array de tareas
 		 		// pasando como valor $scope.tareaNueva
 		 		$scope.tareas.push($scope.tareaNueva);

 		 		//Borramos el texto que habíamos puesto en el < input >
 		 		$scope.tareaNueva = '';
 		 	}
 		 }

	</script>
</body>
</html>
```
- [Demo](http://plnkr.co/edit/uYu4lTX6FxCjsI2DTMTj?p=preview){:target="_blank"}

###8 - Agregando estados (completado/pendiente)
Ya tenemos una lista a la que podemos agregar elementos, ahora necesitamos poder marcar un elemento como completado.

En el controlador: la lista de tareas $scope.tareas debe contener objetos en vez de strings (cadenas de texto) unicamente así que vamos a reemplazar cada elemento por un objeto conteniendo las propiedades "nombre" y "completada".

En la vista: vamos a añadir un checkbox conectado a la propiedad "completada" del objeto que representa la tarea.
```html
<!DOCTYPE html>
<html>
<head>
    <title></title>
</head>
<body ng-app="listaDeCosasPorHacer">
	<div ng-controller="controladorPrincipal">

		<form ng-submit="agregarTareaNueva()">
			<input ng-model="tareaNueva">
			<input type="submit" value="Agregar">
		</form>
    <hr>
    <ul>
      <li ng-repeat="tarea in tareas">
        <input type="checkbox" id="{{tarea}}" ng-model="tarea.completada">
        <label for="tarea">{{tarea.nombre}}</label>
      </li>
    </ul>
	</div>

	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.4/angular.min.js"></script>

	<script>
		 angular
		 	.module('listaDeCosasPorHacer', []);



		 angular
		 	.module('listaDeCosasPorHacer')
		 		.controller('controladorPrincipal', controladorPrincipal);

 		 function controladorPrincipal($scope){

 		 	$scope.tareas = [
 		 	  {nombre: "Aprender AngularJS", completada: false},
 		 	  {nombre: "Dejar un comentario", completada: false},
 		 	  {nombre: "No usar Internet Explorer", completada: true}
 	 	  ]

 		 	$scope.agregarTareaNueva = function(){

 		 		$scope.tareas.push($scope.tareaNueva);

 		 		$scope.tareaNueva = '';
 		 	}
 		 }

	</script>
</body>
</html>
```
- [Demo](http://plnkr.co/edit/e9P5ugLBWGUoLETxIr9K?p=preview){:target="_blank"}

###9 - Marcando tareas completadas con ng-class
Las tareas completadas deberían tener una apariencia diferente, vamos a usar la directiva ng-class para asignar dinámicamente una clase (tarea-terminada) cuando la propiedad completada de una tarea sea == true.

Creamos la clase tarea terminada dentro de una etiqueta < style > dentro de < head >

```html
<!DOCTYPE html>
<html>
<head>
    <title></title>
    <style>
      .tarea-terminada {
        text-decoration: line-through;
      }
    </style>
</head>
<body ng-app="listaDeCosasPorHacer">
	<div ng-controller="controladorPrincipal">

		<form ng-submit="agregarTareaNueva()">
			<input ng-model="tareaNueva">
			<input type="submit" value="Agregar">
		</form>
    <hr>
    <ul>
      <li ng-repeat="tarea in tareas">
        <input type="checkbox" id="{{tarea}}" ng-model="tarea.completada">
        <!-- la sinaxis de un ng-class es similar a la de un objeto en JavaScript: primero va el nombre de la clase dentro de comillas, a continuación ":" y finalmente la condición a evaluar. La clase aplicará cuando la condición sea verdadera.

        Podemos encadenar varias condiciones separadas por comas -->
        <label for="tarea" ng-class="{'tarea-terminada': tarea.completada}">{{tarea.nombre}}</label>
      </li>
    </ul>
	</div>

	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.4/angular.min.js"></script>

	<script>
		 angular
		 	.module('listaDeCosasPorHacer', []);



		 angular
		 	.module('listaDeCosasPorHacer')
		 		.controller('controladorPrincipal', controladorPrincipal);

 		 function controladorPrincipal($scope){

 		 	$scope.tareas = [
 		 	  {nombre: "Aprender AngularJS", completada: false},
 		 	  {nombre: "Dejar un comentario", completada: false},
 		 	  {nombre: "No usar Internet Explorer", completada: true}
 	 	  ]

 		 	$scope.agregarTareaNueva = function(){


 		 		$scope.tareas.push({nombre: $scope.tareaNueva, completada: false});

 		 		$scope.tareaNueva = '';
 		 	}
 		 }

	</script>
</body>
</html>
```
- [Demo](http://plnkr.co/edit/Nsjb73rRBaSbGQEXO2oH?p=preview){:target="_blank"}


Creo que es suficiente por ahora ¿Comentarios?