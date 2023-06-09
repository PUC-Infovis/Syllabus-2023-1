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

const iniciarSimulacion = (nodos, enlaces) => {
  const fuerzasEnlace = d3
    .forceLink(enlaces)
    .id((d) => d.name)
    .strength((link) => {
      if ((link.source.name == "Homer")) {
        return 0.008;
      } else {
        return 0;
      }
    });

  const simulacion = d3
    .forceSimulation(nodos)
    .force("enlaces", fuerzasEnlace)
    .force("carga", d3.forceManyBody())
    .force("colision", d3.forceCollide(10))
    .force("centro", d3.forceCenter(WIDTH/2, HEIGHT/2));

  const lineas = SVG.append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(enlaces)
    .join("line")
    .attr("stroke-width", 2);

  const circulos = SVG.append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodos)
    .join("circle")
    .attr("r", 20)
    .attr("fill", (d) => d.color);

  const nombres = SVG.append("g")
    .attr("class", "nombres")
    .selectAll("text")
    .data(nodos)
    .join("text")
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y)
    .style("weight", "bold")
    .style("dominant-baseline", "middle")
    .style("text-anchor", "middle")
    .text((d) => d.name)
    .attr("id", "nombres");

  simulacion.on("tick", () => {
    circulos.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    lineas
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    nombres.attr("x", (d) => d.x).attr("y", (d) => d.y);
  });

  d3.select("#restart").on("click", () => {
    simulacion.alpha(3).restart();
  })

  circulos.call(
    d3.drag().on("drag", (evento, data) => {
      data.fx = evento.x;
      data.fy = evento.y;
      simulacion.alpha(0.3).restart();
    })
  );

  d3.selectAll("circle").on("click", (event, data) => {
    if (data.fx == null) {
      data.fx = data.x;
    } else {
      data.fx = null;
    }
    data.fy = data.y;
  });

};

d3.json("simpson.json")
  .then((datos) => {
    const nodos = datos.nodos;
    const enlaces = datos.enlaces;
    iniciarSimulacion(nodos, enlaces);
  })
  .catch((error) => {
    console.log(error);
  });
