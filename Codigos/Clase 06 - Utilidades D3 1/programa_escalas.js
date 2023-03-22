// Creamos constantes para esta visualización.
const WIDTH = 600;
const HEIGHT = 300;

// Creamos un SVG en body junto con su tamaño ya definido.
const SVG = d3.select("body")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT);

// Creamos una función que se encarga de actualizar el SVG según los datos que llegan.
function joinDeDatos(datos) {

  // Obtenemos los rangos de los datos. En este caso solo necesitamos el máximo.
  const maximaFrecuencia = d3.max(datos, (d) => d.frecuencia);
  // const minmoFrecuencia = d3.min(datos, (d) => d.frecuencia);
  // const rangoFrecuencia = d3.extent(datos, (d) => d.frecuencia);

  // Definimos una escala lineal para determinar la altura.
  // Mapea un número entre 0 y maximaFrecuencia a un rango entre 0 y HEIGHT.
  const escalaAltura = d3
    .scaleLinear()
    .domain([0, maximaFrecuencia])
    .range([0, HEIGHT]);

  // Definimos una escala lineal para determinar la posición en el eje Y.
  // Mapea un número entre 0 y maximaFrecuencia a un rango entre HEIGHT y 0.
  const escalaY = d3
    .scaleLinear()
    .domain([0, maximaFrecuencia])
    .range([HEIGHT, 0]);

  // Definimos una escala de datos categóricos para determinar la posición en el eje X.
  // Esta escala genera una banda por cada cateoría. 
  // Esta escala determinará la posición y ancho de cada banda en función del dominio y rango.
  // Mapea cada categoría a una banda específica.
  const escalaX = d3
    .scaleBand()
    .domain(datos.map((d) => d.categoria))
    .rangeRound([0, WIDTH])
    .padding(0.5); // agregar sepación entre el final y el inicio de una banda.

  // Vinculamos los datos con cada elemento rect con el comando data y join.
  // Personalizamos según la información de los datos.
  // Usamos nuestras escalas para determinar las posiciones y altura de las barras.
  SVG
    .selectAll("rect")
    .data(datos)
    .join("rect")
    .attr("width", escalaX.bandwidth()) // con bandwidth obtenemos el tamaño de la banda
    .attr("fill", "orange")
    .attr("height", (d) => escalaAltura(d.frecuencia))
    .attr("x", (d) => escalaX(d.categoria))
    .attr("y", (d) => escalaY(d.frecuencia));
}

////////////////////////////////////////////
////                                    ////
////          CODIGO A EJECUTAR         ////
////                                    ////
////////////////////////////////////////////


const BASE_URL = "https://gist.githubusercontent.com/Hernan4444/";
const URL_FINAL = BASE_URL + "7f34b01b0dc34fbc6ad8dd1e686b6875/raw/bfb874f18a545e0a33218b5fd345b97cbfa74e84/letter.json"
d3.json(URL_FINAL)
  .then((datos) => {
    console.log(datos);
    joinDeDatos(datos);
  })
  .catch((error) => console.log(error));
