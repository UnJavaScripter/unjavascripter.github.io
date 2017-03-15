"use strict";


class Tostada {
  constructor(config) {
    // Exponemos config como una variable 'global' dentro de la clase
    this.config = config || {};
    this.config.color = this.config.color || '#f9f9f9';
    this.config.fondo = this.config.fondo || 'rgba(0,0,0,0.8)';
    this.config.tiempo = this.config.tiempo || 4000;

    let estilos = document.createElement('style');
    estilos.innerHTML = `
      /* Elemento (tostada) */
      .tst--tostada {
        padding: 12px;
        margin-bottom: 11px;
        margin-left: 5px;
        background: ${this.config["fondo"]};
        color: ${this.config["color"]};
        font-family: sans-serif;
        bottom: 0;
        position: fixed;
        transform: translateY(100%);
        opacity: 0;
        will-change: transform;
      }
      /* Transición */
      .tst--animable.tst--tostada {
        transition: opacity 0.3s cubic-bezier(0,0,0.3,1), transform 0.5s cubic-bezier(0,0,0.3,1); 
      }
      .tst--visible.tst--animable.tst--tostada {
        transition: opacity 0.5s cubic-bezier(0,0,0.3,1), transform 0.3s cubic-bezier(0,0,0.3,1); 
      }
      .tst--visible {
        transform: translateY(0%);
        opacity: 1;
      }
    `;
    document.head.appendChild(estilos);
  }

  mostrar(mensaje) {

    
    // Creamos una promesa con la API nativa Promise().
    new Promise((resolve, reject) => {

      // Creamos el elemento HTML desde JavaSCript
      this.tostada_div = document.createElement("div");

      // Le asignamos la clase que usaremos para encontrarlo
      this.tostada_div.classList.add('tst--tostada');
      // Le damos un contenido
      this.tostada_div.innerHTML = mensaje;
      resolve();
    })
    .then(_ => {
      // Primero hacemos que se agreguen las clases que necesitamos para iniciar la transición,
        // Si hay algún otro 'toast' presente, lo desplazamos hacia arriba
        let todasLasTostadas = document.querySelectorAll('.tst--tostada');
        if(todasLasTostadas.length > 1) {
          let nextPos  = (100 * (todasLasTostadas.length-1)) + (todasLasTostadas.length*10);
          this.tostada_div.style.transform = `translateY(-${nextPos}%)`
        }

        this.tostada_div.classList.add('tst--animable');
        this.tostada_div.classList.add('tst--visible');

        this.tostada_div.addEventListener('transitionend', this.onTransitionEnd); // Queremos que cuando termine la transición, se remueva la clase tst--animable

        return this.tostada_div;  // Retornamos la referencia al elemento de la 'tostada'
                                    //  para que quede disponible para el siguiente elemento en la cadena de promesas   
    })
    .then(elemento => {              // Recibimos la referencia al elemento de la tostada
      setTimeout(_ => {
        this._ocultar(elemento);       // Pasamos la referencia al elemento al método 'privado' _ocultar para que este sepa qué tiene que ocultar
      }, this.config["tiempo"]);
    })


    // Ya le asignamos todo lo que necesitamos al elemento base, ahora lo agregamos al DOM 
    document.body.appendChild(this.tostada_div);

  }

  _ocultar(elemento) {
    elemento.classList.remove('tst--visible');       
    elemento.classList.add('tst--desechable');
    elemento.classList.add('tst--animable');
    elemento.addEventListener('transitionend', this.onTransitionEnd);
  }

  onTransitionEnd(e) {
    if(e.target.classList.contains('tst--desechable')){
      document.body.removeChild(e.target);  // Eliminamos el elemento del DOM después de que se ha ocultado

      // Si hay algún otro 'toast' presente, lo desplazamos hacia abajo
      let todasLasTostadas = document.querySelectorAll('.tst--tostada');
      if(todasLasTostadas.length) {
        todasLasTostadas.forEach((e, i, a) => {
          let nextPos  = (100 * (a.length-1)) + (a.length*10);
          e.style.transform = `translateY(-${(/\d+/g).exec(e.style.transform)[0] - 110}%)`;
        })
      }

    }
  }
}