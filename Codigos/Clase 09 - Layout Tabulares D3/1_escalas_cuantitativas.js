//////////////////////////////////////////////////
//////               Ejemplo 1             ///////
//////////////////////////////////////////////////
const svgEj1 = d3
  .select("#ej1")
  .append("svg")
  .attr("width", 1000)
  .attr("height", 200);

// Escala lineal
const escalaLinealDecimal = d3
  .scaleLinear()
  .domain([1, 10 ** 6])   // Dominio de 1 a 1 millon
  .range([0, 800]);       // Rango de 0 a 800 pixeles

// Definimos un eje inferior con dicha escala
const ejeLinealDecimal = d3.axisBottom(escalaLinealDecimal);

// Creamos un "g" trasladado 100 pixeles a la derecha. Y lo llenamos con nuestro eje
svgEj1.append("g").attr("transform", `translate(100, 0)`).call(ejeLinealDecimal);

// Escala logaritico
const escalaLogaritmicaDecimal = d3
  .scaleLog()
  .domain([1, 10 ** 6])   // Dominio de 1 a 1 millon. El domonio no puede ser 0
  .range([0, 800]);       // Rango de 0 a 800 pixeles

// Definimos un eje inferior con dicha escala
const ejeLogaritmicoDecimal = d3.axisBottom(escalaLogaritmicaDecimal);

// Creamos un "g" trasladado 100 pixeles a la derecha y 75 hacia abajo
// Y lo llenamos con nuestro eje
svgEj1.append("g").attr("transform", `translate(100, 75)`).call(ejeLogaritmicoDecimal);

// Escala potencia. En este caso potenia 1/2 == raiz cuadrada
const escalaRaizCuadrada = d3
  .scalePow().exponent(0.5) // Potencia a utilizar en la escala
  .domain([1, 10 ** 6])     // Dominio de 0 a 1 millon 
  .range([0, 800]);         // Rango de 0 a 800 pixeles

// Definimos un eje inferior con dicha escala
const ejeRaizCuadradaDecimal = d3.axisBottom(escalaRaizCuadrada);

// Creamos un "g" trasladado 100 pixeles a la derecha y 150 hacia abajo
// Y lo llenamos con nuestro eje
svgEj1.append("g").attr("transform", `translate(100, 150)`).call(ejeRaizCuadradaDecimal);


//////////////////////////////////////////////////
//////               Ejemplo 2             ///////
//////////////////////////////////////////////////

// Jugar con el radio de un círculo y sus escalas.
const svg3 = d3
  .select("#ej2")
  .append("svg")
  .attr("width", 1000)
  .attr("height", 500);

// Intente cambiar los datos en casa y vea lo que sucede
const datos = [1, 2, 4, 8];

// Escala lineal
const escalaLinealParaRadio = d3
  .scaleLinear()
  .domain([0, d3.max(datos)])   // Dominio 0 al máximo de los datos
  .range([0, 100]);             // Rango de 0 a 100 pixeles

// Datos usando escala lineal
svg3
  .append("g")
  .attr("transform", `translate(100, 0)`)
  .selectAll("circle")
  .data(datos)
  .join("circle")
  .attr("cx", (_, i) => i * 200)
  .attr("cy", 100)
  .attr("r", escalaLinealParaRadio); // A cada dato le aplico la función de escala

// Escala raíz cuadrada
const escalaRaizParaRadio = d3
  .scalePow()
  .exponent(0.5)
  .domain([0, d3.max(datos)])   // Dominio 0 al máximo de los datos
  .range([0, 100]);             // Rango de 0 a 100 pixeles

// Datos usando escala raiz cuadrada
svg3
  .append("g")
  .attr("transform", `translate(100, 220)`)
  .selectAll("circle")
  .data(datos)
  .join("circle")
  .attr("cx", (_, i) => i * 200)
  .attr("cy", 100)
  .attr("r", d => {
    console.log(d, escalaRaizParaRadio(d))
    return escalaRaizParaRadio(d)
  }); // A cada dato le aplico la función de escala
