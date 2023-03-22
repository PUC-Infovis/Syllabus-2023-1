// Hacemos un log para ver con facilidad que carga este archivo
console.log("cargado codigo de tablero")

// cantidad de casillas en un eje
const casillas_tablero = 6;
const ancho_casilla = 50

// Guardamos donde se desea ubicar la esquina
// superior izquierda del tablero
const delta_x = 10;
const delta_y = 40;

// seleccionamos el svg
svg = d3.select("#svg-tablero")

// Cambiamos el tamaño del svg para que el tablero
// se vea completamente
svg.attr("height", delta_y + casillas_tablero*ancho_casilla)
svg.attr("width", delta_x + casillas_tablero*ancho_casilla)

// funcion que crea el tablero
for (let i=0; i<casillas_tablero; i += 1)
{
  for (let j=0; j<casillas_tablero; j++){
    if ((i+j) % 2 == 0){
      svg.append("rect")
        .attr("x", delta_x + i*ancho_casilla)
        .attr("y", delta_y + j*ancho_casilla)
        .attr("height", ancho_casilla - 2)
        .attr("width", ancho_casilla - 2)
        .style("fill", "black")
    }
  }
}

// Funcion que crea una ficha
// requiere:
// i: posicion horizontal tablero
// j: posicion vertical tablero
function crearFicha(i, j, color_ficha){
  // Guardamos la ficha creada para luego cambiarle el color
  const ficha = svg.append("circle")
    // La forma del cx y cy agrega 1/2 de ancho de casilla
    // porque el circulo define el centro del mismo
    // a diferencia de rect, que define la esquina superior
    // izquierda
    .attr("cx", delta_x + i*ancho_casilla + (1/2)*ancho_casilla)
    .attr("cy", delta_y + (j + 1/2)*ancho_casilla)
    .attr("r", ancho_casilla /3)  // definir radio del circulo
    // Definir el ancho del borde del circulo
    .style("stroke-width", (1/8)*ancho_casilla)
  if (color_ficha == "black"){
    ficha.style("fill", "#000000") // (negro) color del circulo
      .style("stroke", "#fff")  // (blanco) color del borde del circulo
    // Se usa el stroke para evitar que no se vea 
    // el caso de ficha blanca sobre fondo blanco 
    // ni ficha negra sobre fondo negro
  }
  // else{  // tambien se puede usar solo el else en este caso
  else if (color_ficha == "white"){  // el "elif" de python se escribe de esta forma aqui
      ficha.style("fill", "white")
        .style("stroke", "black")
  }
}

// Creamos las fichas usando la función
crearFicha(0,0, "black")
crearFicha(0,1, "black")
crearFicha(1,0, "white")
crearFicha(1,1, "white")

