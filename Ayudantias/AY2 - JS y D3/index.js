// Este es un comentario
/* Este comentario cubre más de una
  línea */

// Definir valor constante
const radio_estrella = 4;


// Imprimir en consola
// en vez de print, se usa console.log
console.log("Hola mundo")
// cuidado que print si existe, es usado para imprimir con impresora


// Definir función
// Esta funcion retorna n puntos tal que se
// ubiquen de forma que parezca un círculo
function ubicacionesEnCirculo(numero_ubicaciones){
  // Definimos lo que vamos a retornar, una lista de números (Array en JS)
  let ubicaciones = new Array();

  // Mostramos en consola el arreglo
  console.log("Arreglo vacío", ubicaciones)


  // Iteración con for en JS
  // Separados por ";", son:
  //   valor(es) inicial(es),
  //   condición de seguir iterando,
  //   cambios de cada iteración
  // En python: for i in range(0,numero_ubicaciones):
  for (let i=0; i<numero_ubicaciones; i++){
    // Agregamos la ubicación deseada al arreglo (Array).
    // Notar que 2pi es una vuelta completa,
    // asi que hacemos la primera división para encontrar
    // en qué parte debe estar cada punto
    ubicaciones.push( (i / numero_ubicaciones) * (2 * Math.PI) )
  }

  // Mostramos en consola el arreglo con los valores agregados.
  // Notar que se usa una forma distinta para mostrar en consola
  console.log(`Arreglo actualizado ${ubicaciones}`)
  // Notar que se imprimen de forma un poco distinta
  console.log("Arreglo actualizado mostrado de otra forma", ubicaciones)
  // el primero se suele usar más con strings


  // retornamos el arreglo
  return ubicaciones
}


// llamamos a la función pasándole un 4 como parámetro
ubicacionesEnCirculo(4)


// Seleccionamos el SVG
svg = d3.select("#svg-ejemplo")


// Usando style, le cambiamos el color (usando RGB)
svg.style("background", "#dcc")


// podemos crear una funcion que modifique el svg
function crearEstrella(x, y){
  // agregamos un círculo que hará de estrella
  svg.append("circle")
    .attr("cx", x)  // definir ubicacion
    .attr("cy", y)
    .attr("r", radio_estrella)  // definir radio
    .style("fill", "red")  // definir color, 
        //notar que el color se definió con el nombre del color
    // Podemos agregar texto que aparezca cuando hacemos hover sobre el círculo
    .append("title")
    .text("texto de prueba nuevo")


  // como rectángulo:
  /*
  svg.append("rect")
    .attr("x", x)
    .attr("y", y)
    .attr("height", radio_estrella)
    .attr("width", radio_estrella)
    .style("fill", "red")

  //*/
}

// probamos la función
crearEstrella(20, 20)


// Ahora creamos una función para usar el arreglo de ángulos y ubicar
// las estrellas en torno a un círculo más grande
function crearEstrellaConAngulo(cantidad, radio_circulo, x_centro, y_centro){
  const angulos = ubicacionesEnCirculo(cantidad);

  // iteramos sobre el arreglo generado
  for (let i=0; i<angulos.length; i++){
    // encontramos la posicion que debería estar
    const ubicacion_x = x_centro + radio_circulo * Math.cos(angulos[i]);
    const ubicacion_y = y_centro + radio_circulo * Math.sin(angulos[i]);

    // creamos la estrella en la ubicación calculada
    crearEstrella(ubicacion_x, ubicacion_y)
  }
}

crearEstrellaConAngulo(16, 30, 100, 60)
// crearEstrellaConAngulo(8, 20, 100, 60)
crearEstrellaConAngulo(4, 10, 100, 60)


// creamos una función para cambiar el color a los círculos
function cambiarColor(color){
  d3.selectAll("circle")
    .style("fill", color)
}

// Probamos la función
cambiarColor("#00ff00")


// Agregamos event listener al botón
document.getElementById("boton-azul")
  .addEventListener("click", ()=>{  // notar el uso de arrow function
    cambiarColor("blue")
  })

// SPOILER: Agregar event listener con d3:
/*
d3.select("#boton-azul")
  .on("click", ()=>{  // notar el uso de arrow function
  cambiarColor("blue")
})
//*/
