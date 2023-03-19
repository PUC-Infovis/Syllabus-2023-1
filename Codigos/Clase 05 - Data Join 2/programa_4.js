// Seleccionar el svg cuya id es vis
const SVG = d3.select("#vis");

// Crear una función que genera un data join entre los datos y G rect
// Dentro de cada G pondremos los elementos que correspondan
function datajoin(datos) {

  // Agregar un G para cada dato. Este será nuestro contenedor.
  const G = SVG.selectAll("g")
    .data(datos)
    .join(
      enter => {
        const G = enter.append("g")
        // Agregar rect para mostrar el promedio de nota
        // El hijo del G tambien tendrá acceso al valor de su padre
        G.append("rect")
          .attr("class", "vis-element bar")
          .attr("height", 20)
          .attr("x", 0)
          .attr("y", 0)
          .attr("fill", "orange")
          .attr("width", d => d.nota_promedio);

        // Agregar text para mostrar el nombre de la persona
        // El hijo del G tambien tendrá acceso al valor de su padre
        G.append("text")
          .attr("class", "vis-element")
          .attr("x", 0)
          .attr("y", 0)
          .text(d => d.nombre)

        // Agregar rect para la desvicación de las notas
        // El hijo del G tambien tendrá acceso al valor de su padre
        G.append("rect")
          .attr("class", "vis-element desv")
          .attr("height", 2)
          .attr("x", d => d.nota_promedio - d.desviacion)
          .attr("fill", "red")
          .attr("width", d => 2 * d.desviacion)
          .attr("y", 10)

        return G
      },
      update => {
        // El G debe buscar el elemento que quiere actualizar con "select"
        // Luego actualiza sus propiedades

        // Actualizar ancho de barra
        update.select(".bar").attr("width", d => d.nota_promedio);

        // Actualizar texto
        update.select("text").text(d => d.nombre);

        // Actualizar barra de desviación
        update.select(".desv")
          .attr("x", d => d.nota_promedio - d.desviacion)
          .attr("width", d => 2 * d.desviacion);

        return update
      },
      exit => {
        // Opcional: Buscar cada elemento y eliminarlo
        // Spoiler: cuando veamos transiciones será util hacer esto
        exit.select(".bar").remove()
        exit.select("text").remove()
        exit.select(".desv").remove()

        // Eliminar el G
        return exit.remove()
      }
    )
    .attr("transform", (d, i) => `translate(0, ${i * 40 + 40})`);
  // Trasladamos el G según el índice del dato. Todos sus hijos tambien 
  // se van a trasladar.

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
  d3.selectAll("g").remove()
})