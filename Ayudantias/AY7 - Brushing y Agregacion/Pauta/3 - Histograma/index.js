/* RECORDATORIO: definimos todas nuestras constantes que vayamos usar y las referencias a contenedores
fuera de nuestras funciones que crean las visualizaciones. De esta forma evitamos volver a definir o crear
elementos demás, en el caso que sea una función que se use de forma recurrente. De esta forma, por ejemplo
y muy importante, evitamos que se acumulen contenedores uno sobre otro (OJO) */

/* En este caso toda la visualización estará incluida dentro de un mismo svg, por lo tanto,
para definir el tamaño del svg definiremos los tamaños por separado de los elementos que la conformarán. 
En este caso un gráfico de dispersión y un histogramas */

/* Definimos los márgenes considerando también un margén intermedio entre visualizaciones */
const margin = {
    top: 40,
    left: 60,
    bottom: 40,
    right: 30,
    inner: 80
};

const scatterHeight = 300;
const scatterWidth = 500; //el histograma usará el mismo ancho

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

    /* Hasta aquí se define el gráfico de dispersión base, muy similar a las visualizaciones que ya han visto y 
    hecho anteriormente. A partir del código que viene a continuación se implementará un histograma,
    mediante la utilización del método bin() */
    
    const pagesBin = d3
        .bin()
        .domain(escalaPages.domain())   //le indicamos el dominio sobre el dato
        .thresholds(30)                 //le indicamos cuantos grupos queremos que 'intente' hacer
        .value((d) => d.pages)          //le indicamos como acceder al valor en caso de ser el dato un objeto

    const gruposPages = pagesBin(datos);    //obtenemos los grupos al pasarle los datos como función  

    /* En este caso la magnitud de las barras del histograma corresponderá a la cantidad de elementos 
    que haya en cada grupo (frecuencia de los datos) */
    
    const escalaFrecuencia = d3
        .scaleLinear()
        .domain([0, d3.max(gruposPages, d => d.length)])
        .range([0, histogramHeight]);

    const ejeFrecuencia = d3.axisLeft(escalaFrecuencia);

    contenedorEjeFrecuencia.call(ejeFrecuencia);

    /* Aprovechamos la escala que ya tenemos para la cantidad de páginas, para crear un eje superior */

    const ejePagesHistograma = d3.axisTop(escalaPages);

    contenedorEjePagesHistograma.call(ejePagesHistograma);

    console.log(gruposPages);
    /* Para realizar data join del histograma utilizaremos los grupos que obtuvimos de bin(). 
    Cada grupo además de contener a ciertos datos, tienen atributos x0 y x1 que indican el rango que abarca
    cada grupo en particular. Esto nos permitiran ubicar y dimensionar cada barra respectiva para cada grupo.*/
    
    contenerBarras
        .selectAll("rect")
        .data(gruposPages)
        .join("rect")
        .attr("width", d => escalaPages(d.x1) - escalaPages(d.x0))
        .attr("height", d => escalaFrecuencia(d.length))
        .attr("x", d => escalaPages(d.x0))
        .attr("fill", "steelblue")
        .attr("stroke", "white"); 
};

d3.csv('./../top_100_scifi_books_preprocessed.csv', d => ({pages: parseInt(d.pages), rating: parseFloat(d.ratings)}))
    .then((datos) => visualizacion(datos))
    .catch((error) => console.log(error));