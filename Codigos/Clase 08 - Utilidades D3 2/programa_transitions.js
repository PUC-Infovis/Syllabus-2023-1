// Creamos constantes para esta visualización.
const WIDTH = 1000;
const HEIGHT = 400;
const MARGIN = {
  top: 70,
  bottom: 70,
  right: 30,
  left: 70, // se agranda este margen para asegurar que se vean los números
};

const HEIGHTVIS = HEIGHT - MARGIN.top - MARGIN.bottom;
const WIDTHVIS = WIDTH - MARGIN.right - MARGIN.left;

// Creamos un SVG en body junto con su tamaño ya definido.
const svg = d3.select("body")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT)

// Creamos un boton y un párrafo en el body.
const boton = d3.select("body").append("button").text("Agregar elemento");
const parrafo = d3.select("body").append("p");

// Creamos un contenedor específico para cada eje y la visualización.
const contenedorEjeY = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)

const contenedorEjeX = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${HEIGHTVIS + MARGIN.top})`)

const contenedorVis = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)


// Creamos una función que se encarga de actualizar el SVG según los datos que llegan.
function joinDeDatos(datos) {

  // Obtenemos los rangos de los datos. En este caso solo necesitamos el máximo.
  const maximaFrecuencia = d3.max(datos, (d) => d.frecuencia);

  // Definimos una escala lineal para determinar la altura.
  // Mapea un número entre 0 y maximaFrecuencia a un rango entre 0 y (HEIGHT - los margenes)
  // Así nos aseguramos que el número mapeado esté en los rangos de nuestro contenedor.
  const escalaAltura = d3.scaleLinear()
    .domain([0, maximaFrecuencia])
    .range([0, HEIGHTVIS]);

  // Definimos una escala lineal para determinar la posición en el eje Y.
  // Mapea un número entre 0 y maximaFrecuencia a un rango entre (HEIGHT - los margenes) y 0.
  // Así nos aseguramos que el número mapeado esté en los rangos de nuestro contenedor.
  const escalaY = d3.scaleLinear()
    .domain([0, maximaFrecuencia])
    .range([HEIGHTVIS, 0]);

  // Creamos un eje izquierdo con D3 y le damos nuestra escala línea
  // para que sepa qué valores incluir en el eje.
  const ejeY = d3.axisLeft(escalaY);

  // Agregamos al SVG el eje. La función call se encarga de indicarle al
  // objeto ejeY a qué selección de la visualización debe vincular sus 
  // datos para agregar el eje.
  // Luego personalizamos las líneas del eje.
  contenedorEjeY.transition()
    .duration(500)
    .call(ejeY)
    .selectAll("line")
    .attr("x1", WIDTHVIS)
    .attr("stroke-dasharray", "5")
    .attr("opacity", 0.5);

  // Definimos una escala de datos categóricos para determinar la posición en el eje X.
  // Esta escala genera una banda por cada cateoría. 
  // Esta escala determinará la posición y ancho de cada banda en función del dominio y rango.
  // Mapea cada categoría a una banda específica.
  const escalaX = d3.scaleBand()
    .domain(datos.map((d) => d.categoria))
    .rangeRound([0, WIDTHVIS])
    .padding(0.5);

  // Creamos un eje inferior con D3 y le damos nuestra escala línea
  // para que sepa qué valores incluir en el eje.
  const ejeX = d3.axisBottom(escalaX);

  // Agregamos al SVG el eje. La función call se encarga de indicarle al
  // objeto ejeX a qué selección de la visualización debe vincular sus 
  // datos para agregar el eje.
  // Luego personalizamos el texto de dicho eje.
  contenedorEjeX.transition()
    .duration(500)
    .call(ejeX)
    .selectAll("text")
    .attr("font-size", 20);

  // Vinculamos los datos con cada elemento rect con el comando join.
  // Usamos el enter para personalizar nuestros rect cuando se crean.
  // Los creamos con largo 0 pero ya posicionados donde corresponde.
  const rectangulos = contenedorVis
    .selectAll("rect")
    .data(datos)
    .join(enter =>
      enter
        .append("rect")
        .attr("fill", "orange")
        .attr("y", HEIGHTVIS)
        .attr("height", 0)
        .attr("width", escalaX.bandwidth())
        .attr("x", (d) => escalaX(d.categoria))
    )

  ////////////////////////////////////////////
  ////      Inicio Nuevo Codigo           ////
  ////////////////////////////////////////////
  // Personalizamos según la información de los datos.
  // Usamos nuestras escalas para actualizar sus posiciones y altura de
  // las barras que ya estaban creadas y las nuevas.
  rectangulos.transition("update")
    .duration(500)
    .attr("width", escalaX.bandwidth())
    .attr("height", (d) => escalaAltura(d.frecuencia))
    .attr("x", (d) => escalaX(d.categoria))
    .attr("y", (d) => escalaY(d.frecuencia))
  ////////////////////////////////////////////
  ////        Fin Nuevo Codigo            ////
  ////////////////////////////////////////////

  // Definimos eventos. En particular:
  // (1) [click] Click en una barra
  // (2) [mouseenter] Pasar el mouse sobre una barra
  // (2) [mouseleave] Sacar el mouse de una barra
  rectangulos.on("click", () => {
    console.log("evento");
  })
    .on("mouseenter", (evento, d) => {
      // console.log(d);
      // console.log(evento.currentTarget);
      parrafo.text(`Categoría: ${d.categoria}, Frecuencia: ${d.frecuencia}`);
    })
    .on("mouseleave", (evento, d) => {
      // console.log(d);
      // console.log(evento.currentTarget);
      parrafo.text("");
    });
}


// Lista global para guardar todos los datos.
let datosFinales = [];

// Función encargada de crear un nuevo dato.
// Revisa la última categoría de la lista y utiliza la siguiente letra
// para definir la nueva categoría.
const datoNuevoRandom = (datos) => {
  if (datos.length == 0) {
    return { categoria: "A", frecuencia: Math.floor(Math.random() * 800) }
  }
  return {
    categoria: String.fromCharCode(
      datos[datos.length - 1].categoria.charCodeAt(0) + 1
    ),
    frecuencia: Math.floor(Math.random() * 800)
  }
};

// Vinculamos el click del boton con una función encargada de
// generar un nuevo dato, agregarlo a la lista global y de llamar
// a la función joinDeDatos para actualizar la visualización.
boton.on("click", () => {
  const nuevoValor = datoNuevoRandom(datosFinales)
  datosFinales.push(nuevoValor);
  joinDeDatos(datosFinales);
});

////////////////////////////////////////////
////                                    ////
////          CODIGO A EJECUTAR         ////
////                                    ////
////////////////////////////////////////////

function runCode(option) {
  if (option == 1) {
    // Cargamos el json de internet.
    // Esta opción no requiere hacer python3 -m http.server.
    const BASE_URL = "https://gist.githubusercontent.com/Hernan4444/";
    const URL = BASE_URL + "7f34b01b0dc34fbc6ad8dd1e686b6875/raw/bfb874f18a545e0a33218b5fd345b97cbfa74e84/letter.json"

    d3.json(URL).then(datos => {
      //NEW: Asignamos una copia de los datos a la variable datosFinales
      // De esta forma podemos editar la lista datosFinales
      datosFinales = JSON.parse(JSON.stringify(datos));
      joinDeDatos(datosFinales);
    }).catch(error => {
      console.log("UPS hubo un error :c ")
    })
  }

  else if (option == 2) {
    // opción 2: usar los datos desde el mismo archivo JS
    // Esta opción no requiere hacer python3 -m http.server.
    const datos = [
      { "categoria": "A", "frecuencia": 100 },
      { "categoria": "B", "frecuencia": 120 },
      { "categoria": "C", "frecuencia": 140 },
    ]
    joinDeDatos(datos);
  }
}

const OPTION = 1;
runCode(OPTION);