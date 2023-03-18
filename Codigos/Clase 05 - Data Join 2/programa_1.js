// Encontrar el body en el HTML y agregar un elemento SVG
const SVG = d3.select("#vis");

function datajoin(datos) {
  // Agregar rect según los datos que tenemos
  SVG.selectAll("rect").data(datos).join("rect")
    .attr("height", 20)
    .attr("x", 0)
    .attr("fill", "orange")
    .attr("width", d => d * 10)
    .attr("y", (d, i) => i * 30)
}

document.querySelector("#button1").addEventListener("click", () => {
  datajoin([1, 2, 3])
})
document.querySelector("#button2").addEventListener("click", () => {
  datajoin([5, 6])
})
document.querySelector("#button3").addEventListener("click", () => {
  datajoin([5, 10])
})
document.querySelector("#button4").addEventListener("click", () => {
  d3.selectAll("rect").remove()
})