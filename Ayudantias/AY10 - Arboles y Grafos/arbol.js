const WIDTH = 600;
const HEIGHT = 600;

const margin = {
  top: 100,
  bottom: 100,
  left: 100,
  right: 100,
};

const width = WIDTH - margin.left - margin.right;
const height = HEIGHT - margin.top - margin.bottom;

const SVG = d3
  .select("body")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT);

// d3.json("simpson_relativo.json")
//     .then((datos) => {
//         const raiz = d3.hierarchy(datos, (d) => d.hijos);

//         let layout = d3.tree()
//         layout.size([width, height])
//         layout(raiz)

//         const generadorEnlaces = d3
//         .linkVertical()
//         .source((d) => d.source)
//         .target((d) => d.target)
//         .x((d) => d.x)
//         .y((d) => d.y)

//         SVG.selectAll("path")
//         .data(raiz.links())
//         .join("path")
//         .attr("d", generadorEnlaces)
//         .attr("stroke", "black")
//         .attr("fill", "none")

//         SVG.selectAll("circle")
//         .data(raiz.descendants())
//         .join("circle")
//         .attr("cx", (d) => d.x)
//         .attr("cy", (d) => d.y)
//         .attr("r", 5)

//         SVG.selectAll("text")
//         .data(raiz.descendants())
//         .join("text")
//         .attr("x", (d) => d.x + 10)
//         .attr("y", (d) => d.y + 10)
//         .text((d) => d.data.nombre)

//     })

d3.csv("simpson_tabular.csv", d3.autoType).then((datos) => {
  const stratify = d3
    .stratify()
    .id((d) => d.nombre)
    .parentId((d) => d.padre);

  const raiz = stratify(datos);

  let layout = d3.tree();
  layout.size([width, height]);
  layout(raiz);

  const generadorEnlaces = d3
    .linkVertical()
    .source((d) => d.source)
    .target((d) => d.target)
    .x((d) => d.x)
    .y((d) => d.y);

  SVG.selectAll("path")
    .data(raiz.links())
    .join("path")
    .attr("d", generadorEnlaces)
    .attr("stroke", "black")
    .attr("fill", "none");

  SVG.selectAll("circle")
    .data(raiz.descendants())
    .join("circle")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", 5);

  SVG.selectAll("text")
    .data(raiz.descendants())
    .join("text")
    .attr("x", (d) => d.x + 10)
    .attr("y", (d) => d.y + 10)
    //.attr("fill", (d) => d.color)
    .text((d) => d.data.nombre);
});
