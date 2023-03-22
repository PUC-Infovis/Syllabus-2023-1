// Encontrar el SVG según su ID
const SVG = d3.select("#vis");

// Crear una función que genera un data join entre los datos y 1 rect
function datajoin(datos) {
  // Agregar rect para mostrar el promedio de nota
  // Duda: ¿Por qué no usamos selectAll("rect")?
  // Respuesta: Porque estamos usando rect para diferentes cosas
  // así que necesitamos diferenciar los rect de las barras y los rect de la desviación
  SVG.selectAll(".bar").data(datos).join(
    enter => enter.append("rect")
      .attr("class", "vis-element bar")
      .attr("height", 20)
      .attr("x", 0)
      .attr("fill", "orange")
      .attr("width", d => d.nota_promedio)
      .attr("y", (d, i) => i * 40 + 40)
    ,
    update => update.attr("width", d => d.nota_promedio),
    exit => exit.remove()
  );

  // Agregar text para mostrar el nombre de la persona
  SVG.selectAll("text").data(datos).join(
    enter => enter.append("text")
      .attr("class", "vis-element")
      .attr("x", 0)
      .attr("y", (d, i) => i * 40 + 40)
      .text(d => d.nombre)
    ,
    update => update.text(d => d.nombre),
    exit => exit.remove()
  );

  // Agregar rect para la desvicación de las notas
  // Duda: ¿Por qué no usamos selectAll("rect")?
  // Respuesta: Porque estamos usando rect para diferentes cosas
  // así que necesitamos diferenciar los rect de las barras y los rect de la desviación
  SVG.selectAll(".desv").data(datos).join(
    enter => enter.append("rect")
      .attr("class", "vis-element desv")
      .attr("height", 2)
      .attr("x", d => d.nota_promedio - d.desviacion)
      .attr("fill", "red")
      .attr("width", d => 2 * d.desviacion)
      .attr("y", (d, i) => i * 40 + 40 + 10)
    ,
    update => update
      .attr("x", d => d.nota_promedio - d.desviacion)
      .attr("width", d => 2 * d.desviacion),
    exit => exit.remove()
  );
}

document.querySelector("#button1").addEventListener("click", () => {
  datajoin([
    { nombre: "Alex", nota_promedio: 52, desviacion: 3 },
    { nombre: "Fran", nota_promedio: 60, desviacion: 9 },
    { nombre: "Luis", nota_promedio: 40, desviacion: 16 }
  ])
})
document.querySelector("#button2").addEventListener("click", () => {
  datajoin([
    { nombre: "XXX", nota_promedio: 32, desviacion: 5 },
    { nombre: "Felix", nota_promedio: 50, desviacion: 12 },
  ])
})
document.querySelector("#button3").addEventListener("click", () => {
  d3.selectAll(".vis-element").remove()
})