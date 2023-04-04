const WIDTH = 500;
const HEIGHT = 500;

//////////////////////////////////////////////////
//////                 Datos               ///////
//////////////////////////////////////////////////

const categorias = ["A", "B", "C", "D"];
const otrasCategorias = ["E", "F", "G", "H"];
const datos = [
  { categoria1: "A", categoria2: "E", color: "blue" },
  { categoria1: "B", categoria2: "E", color: "magenta" },
  { categoria1: "C", categoria2: "E", color: "yellow" },
  { categoria1: "D", categoria2: "E", color: "green" },
  { categoria1: "A", categoria2: "F", color: "red" },
  { categoria1: "B", categoria2: "F", color: "orange" },
  { categoria1: "C", categoria2: "F", color: "yellow" },
  { categoria1: "D", categoria2: "F", color: "magenta" },
  { categoria1: "A", categoria2: "G", color: "green" },
  { categoria1: "B", categoria2: "G", color: "blue" },
  { categoria1: "C", categoria2: "G", color: "olive" },
  { categoria1: "D", categoria2: "G", color: "gray" },
  { categoria1: "A", categoria2: "H", color: "orange" },
  { categoria1: "B", categoria2: "H", color: "yellow" },
  { categoria1: "C", categoria2: "H", color: "magenta" },
  { categoria1: "D", categoria2: "H", color: "green" },
];

const SVG = d3
  .select("#ej1")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT);

// Definir escala puntual para las columnas.
const escalaPuntual = d3
  .scalePoint()
  .domain(categorias)
  .range([0, WIDTH])
  .padding(1)
  .align(0.5);

// Agregar líneas con la posición de cada escala (columnas).
SVG
  .append("g")
  .selectAll("line")
  .data(categorias)
  .join("line")
  .attr("x1", escalaPuntual)
  .attr("x2", escalaPuntual)
  .attr("y1", 0)
  .attr("y2", HEIGHT)
  .attr("stroke", "black")
  .attr("stroke-dasharray", 12)
  .attr("stroke-width", 3);

// Agregar texto de la categoría de cada punto (columnas).
SVG
  .append("g")
  .selectAll("text")
  .data(categorias)
  .join("text")
  .attr("x", d => escalaPuntual(d) + 5)
  .attr("y", 15)
  .text((d) => d);

// Definir escala puntual para las filas.
const escalaPuntual2 = d3
  .scalePoint()
  .domain(otrasCategorias)
  .range([0, HEIGHT])
  .padding(1)
  .align(0.5);

// Agregar líneas con la posición de cada escala (filas).
SVG
  .append("g")
  .selectAll("line")
  .data(otrasCategorias)
  .join("line")
  .attr("y1", escalaPuntual2)
  .attr("y2", escalaPuntual2)
  .attr("x1", 0)
  .attr("x2", WIDTH)
  .attr("stroke", "black")
  .attr("stroke-dasharray", 12)
  .attr("stroke-width", 3);

// Agregar texto de la categoría de cada punto (filas).
SVG
  .append("g")
  .selectAll("text")
  .data(otrasCategorias)
  .join("text")
  .attr("y", d => escalaPuntual2(d) + 15)
  .text((d) => d);

// Agregar datos usando categoria1 y categoria2 para definir su espacio.
SVG
  .append("g")
  .selectAll("circle")
  .data(datos)
  .join("circle")
  .attr("cx", (d) => escalaPuntual(d.categoria1))
  .attr("cy", (d) => escalaPuntual2(d.categoria2))
  .attr("r", escalaPuntual2.step() / 3)
  .attr("fill", (d) => d.color);
