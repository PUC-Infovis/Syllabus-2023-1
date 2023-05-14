/* RECORDATORIO: definimos todas nuestras constantes que vayamos usar y las referencias a contenedores
fuera de nuestras funciones que crean las visualizaciones. De esta forma evitamos volver a definir o crear
elementos demás, en el caso que sea una función que se use de forma recurrente. De esta forma, por ejemplo
y muy importante, evitamos que se acumulen contenedores uno sobre otro (OJO) */

const margin = {
    top: 40,
    left: 60,
    bottom: 40,
    right: 30,
    inner: 80
};

const scatterHeight = 300;
const scatterWidth = 500;

const histogramHeight = 150;

const WIDTH = margin.left + scatterWidth + margin.right;
const HEIGHT = margin.top + scatterHeight +  margin.inner + histogramHeight + margin.bottom;

const svg = d3
    .select("#visualizacion")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

// Contenedores
const contenedorDispersion = svg
    .append("g")
    .attr("transform", `translate(${margin.left} ${margin.top})`);

const contenedorEjeRating = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const contenedorEjePages = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top + scatterHeight})`);


/* Definimos los contenedores para el histograma */
const contenerBarras = svg
    .append("g")
    .attr("transform", `translate(${margin.left} ${margin.top + scatterHeight + margin.inner})`);

const contenedorEjeFrecuencia = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top + scatterHeight + margin.inner})`);

const contenedorEjePagesHistograma = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top + scatterHeight + margin.inner})`);

// Titulos de las visualizaciones
const contenedorTitulos = svg.append("g");

contenedorTitulos
    .append("text")
    .attr("transform", `translate(${WIDTH/2} ${margin.top/2})`)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "mathematical")
    .attr("font-size", 20)
    .text("Diagrama de dispersión");

contenedorTitulos
    .append("text")
    .attr("transform", `rotate(-90) translate(${-(margin.top + scatterHeight/2)} ${margin.left/4})`)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "mathematical")
    .attr("font-size", 16)
    .text("Rating");

contenedorTitulos
    .append("text")
    .attr("transform", `translate(${margin.left + scatterWidth/2} ${margin.top + scatterHeight + margin.inner/2})`)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .attr("font-size", 16)
    .text("Cantidad de páginas");

contenedorTitulos
    .append("text")
    .attr("transform", `rotate(-90) translate(${-(margin.top + scatterHeight + margin.inner + histogramHeight/2)} ${margin.left/4})`)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "mathematical")
    .attr("font-size", 16)
    .text("Frecuencia");

contenedorTitulos
    .append("text")
    .attr("transform", `translate(${WIDTH/2} ${HEIGHT - margin.bottom/1.8})`)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "mathematical")
    .attr("font-size", 20)
    .text("Histograma");

const visualizacion = (datos) => {
    // Definimos las escalas y ejes del gráfico de dispersión
    const escalaRating = d3
        .scaleLinear()
        .domain(d3.extent(datos, d => d.rating))
        .range([scatterHeight, 0])
        .nice();

    const ejeRating = d3.axisLeft(escalaRating);

    contenedorEjeRating.call(ejeRating);

    const escalaPages = d3
        .scaleLinear()
        .domain(d3.extent(datos, d => d.pages))
        .range([0, scatterWidth])
        .nice();

    const ejePages = d3.axisBottom(escalaPages);

    contenedorEjePages.call(ejePages);

    // Data join de los puntos de la dispersión
    contenedorDispersion
        .selectAll("circle")
        .data(datos)
        .join("circle")
        .attr("fill", "steelblue")
        .attr("r", 7)
        .attr("cx", d => escalaPages(d.pages))
        .attr("cy", d => escalaRating(d.rating));

    /* Nuevo Código para implementar el histograma */

    // Definir los grupos utilizando bin



    // Crear la nueva escala para la frecuencia y crear ejes



    // Realizar el data join para las barras

    /* contenerBarras
        .selectAll("rect")
        .data(gruposPages)
        .join("rect")
        .attr("width", )
        .attr("height", )
        .attr("x", )
        .attr("fill", "steelblue")
        .attr("stroke", "white"); */

};

d3.csv('./../top_100_scifi_books_preprocessed.csv', d => ({pages: parseInt(d.pages), rating: parseFloat(d.ratings)}))
    .then((datos) => visualizacion(datos))
    .catch((error) => console.log(error));