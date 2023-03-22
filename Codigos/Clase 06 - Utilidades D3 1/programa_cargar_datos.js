// Creamos un SVG en body
const SVG = d3.select("body").append("svg");

// Creamos una función que se encarga de actualizar el SVG según los datos que llegan.
function joinDeDatos(datos) {
  // Definimos el ancho y largo del SVG.
  SVG.attr("width", 50 + datos.length * 100).attr("height", 500);

  // Vinculamos los datos con cada elemento rect con el comando data y join
  // Personalizamos según la información de los datos.
  SVG
    .selectAll("rect")
    .data(datos)
    .join("rect")
    .attr("fill", "orange")
    .attr("width", 40)
    .attr("height", (d) => d.frecuencia)
    .attr("x", (_, i) => 50 + i * 100);

  /*  BONUS
  Casi siempre trabajos con una lista de obejtos
  ¿ Si queremos tranformarla en un diccionario para 
  buscar algún objeto según su identificador ?
  */
  // [x.categoria, x] --> primer elemento será la llave del diccionario
  // Segundo elemento será lo que guardemos como valor en el diccionario
  let diccionario = Object.fromEntries(datos.map(x => [x.categoria, x]));

  /*  
  Con la línea anterior, tendremos un diccionario de la forma
  {
    "Azul": { "categoria": "Azul", "frecuencia": 49},
    "Rojo": { "categoria": "Rojo", "frecuencia": 122},
    ...
  }
  
  */
}


////////////////////////////////////////////
////                                    ////
////          CODIGO A EJECUTAR         ////
////                                    ////
////////////////////////////////////////////

// Creamos una función que parsea los datos del csv al formato deseado.
const parseo = (d) => ({
  categoria: d.categoria,
  frecuencia: parseInt(d.frecuencia),
});


// Esta función es equivalente a la anteior
function parseoV2(d) {

  return {
    categoria: d.categoria,
    frecuencia: parseInt(d.frecuencia),
  }
}


function runCode(option) {
  if (option == 1) {
    // Opción 1: Cargamos el CSV y le indicamos que ocupe la función
    // parseo para procesar cada línea.
    // No olviden hacer python3 -m http.server para que esta opción funcione.
    d3.csv("datos_mate.csv", parseo)
      .then((datos) => {
        // Usamos .then para acceder a los datos ya cargados
        // y actualizamos el svg.
        console.log(datos);
        joinDeDatos(datos);
      })
      .catch((error) => console.log(error));
  }

  else if (option == 2) {
    // opción 2: Cargamos el json y aquí ya vienen los datos con 
    // el formato deseado, así que no necesitamos la función parseo.
    // No olviden hacer python3 -m http.server para que esta opción funcione.
    d3.json("datos_leng.json")
      .then((datos) => {
        console.log(datos);
        joinDeDatos(datos);
      })
      .catch((error) => console.log(error));
  }

  else if (option == 3) {
    // opción 3: Cargamos el json de internet.
    // Esta opción no requiere hacer python3 -m http.server.
    const BASE_URL = "https://gist.githubusercontent.com/Hernan4444/";
    const URL_FINAL = BASE_URL + "7f34b01b0dc34fbc6ad8dd1e686b6875/raw/bfb874f18a545e0a33218b5fd345b97cbfa74e84/letter.json"
    d3.json(URL_FINAL)
      .then((datos) => {
        console.log(datos);
        joinDeDatos(datos);
      })
      .catch((error) => console.log(error));
  }

  else if (option == 4) {
    // opción 4: usar los datos desde el mismo archivo JS
    // Esta opción no requiere hacer python3 -m http.server.
    const datos = [
      {
        "categoria": "Rojo",
        "frecuencia": 104
      },
      {
        "categoria": "Azul",
        "frecuencia": 29
      },
      {
        "categoria": "Verde",
        "frecuencia": 9
      },
    ]
    joinDeDatos(datos);
  }
}

const OPTION = 1;
runCode(OPTION);