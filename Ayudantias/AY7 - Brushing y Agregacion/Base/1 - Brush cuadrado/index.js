/* RECORDATORIO: definimos todas nuestras constantes que vayamos usar y las referencias a contenedores
fuera de nuestras funciones que crean las visualizaciones. De esta forma evitamos volver a definir o crear
elementos demás, en el caso que sea una función que se use de forma recurrente. De esta forma, por ejemplo
y muy importante, evitamos que se acumulen contenedores uno sobre otro (OJO) */

const WIDTH = 600,
    HEIGHT = 400;

const margin = {
    top: 60,
    bottom: 60,
    right: 30,
    left: 60
};

const width = WIDTH - margin.left - margin.right;
const height = HEIGHT - margin.top - margin.bottom;

const svgPanoramica = d3
    .select("#vista_panoramica")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

const svgDetalle = d3
    .select("#vista_detalle")
    .attr("width", HEIGHT)
    .attr("height", HEIGHT);

// Contenedores
const contenedorEjeRating = svgPanoramica
    .append("g")
    .attr("transform", `translate(${margin.left} ${margin.top})`);

const contenedorEjePages = svgPanoramica
    .append("g")
    .attr("transform", `translate(${margin.left} ${HEIGHT - margin.bottom})`);

const contenerdorPuntosPanoramica = svgPanoramica
    .append("g")
    .attr("transform", `translate(${margin.left} ${margin.top})`);

const contenedorBrush = svgPanoramica
    .append("g")
    .attr("transform", `translate(${margin.left} ${margin.top})`);

const contenedorEjeRatingDetalle = svgDetalle
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const contenedorEjePagesDetalle = svgDetalle
    .append("g")
    .attr("transform", `translate(${margin.left}, ${HEIGHT - margin.bottom})`);

const contenedorPuntosDetalle = svgDetalle
    .append("g")
    .attr("transform", `translate(${margin.left} ${margin.top})`);

const contenedorTitulosPanoramica = svgPanoramica
    .append("g");

const contenedorTitulosDetalle = svgDetalle
    .append("g");

// Titulos de las visualizaciones
contenedorTitulosPanoramica
    .append("text")
    .attr("transform", `translate(${WIDTH / 2} ${margin.top / 2})`)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "mathematical")
    .attr("font-size", 20)
    .text("Vista Panorámica");

contenedorTitulosPanoramica
    .append("text")
    .attr("transform", `rotate(-90) translate(${-(margin.top + height / 2)} ${margin.left / 4})`)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "mathematical")
    .attr("font-size", 16)
    .text("Rating");

contenedorTitulosPanoramica
    .append("text")
    .attr("transform", `translate(${margin.left + width / 2} ${HEIGHT - margin.bottom / 2.5})`)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "mathematical")
    .attr("font-size", 16)
    .text("Cantidad de páginas");

contenedorTitulosDetalle
    .append("text")
    .attr("transform", `translate(${HEIGHT / 2} ${margin.top / 2})`)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "mathematical")
    .attr("font-size", 20)
    .text("Vista Detalle");

contenedorTitulosDetalle
    .append("text")
    .attr("transform", `rotate(-90) translate(${-(margin.top + height / 2)} ${margin.left / 4})`)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "mathematical")
    .attr("font-size", 16)
    .text("Rating");

contenedorTitulosDetalle
    .append("text")
    .attr("transform", `translate(${margin.left + height / 2} ${HEIGHT - margin.bottom / 2.5})`)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "mathematical")
    .attr("font-size", 16)
    .text("Cantidad de páginas");


// Función que crea la visualización
const visualizacion = (datos) => {
    //Definimos la escala del Rating (Eje Y) para la vista panorámica
    const escalaRatingPanoramica = d3
        .scaleLinear()
        .domain(d3.extent(datos, d => d.rating))
        .range([height, 0])
        .nice();

    const ejeRatingPanoramica = d3.axisLeft(escalaRatingPanoramica);

    contenedorEjeRating.call(ejeRatingPanoramica);

    //Definimos la escala de la cantidad de páginas (Eje X) para la vista panorámica
    const escalaPagesPanoramica = d3
        .scaleLinear()
        .domain(d3.extent(datos, d => d.pages))
        .range([0, width])
        .nice();

    const ejePagesPanoramica = d3.axisBottom(escalaPagesPanoramica);

    contenedorEjePages.call(ejePagesPanoramica);

    const puntosPanoramica = contenerdorPuntosPanoramica
        .selectAll("circle")
        .data(datos)
        .join("circle")
        .attr("fill", "black")
        .attr("r", 7)
        .attr("opacity", 1)
        .attr("cx", d => escalaPagesPanoramica(d.pages))
        .attr("cy", d => escalaRatingPanoramica(d.rating));

    /* Nuevo Código para implementar brush */

    // Definir nuevas escalas y ejes para la vista detalle




    /* contenedorEjePagesDetalle.call(d3.axisBottom(escalaPagesDetalle));
    contenedorEjeRatingDetalle.call(d3.axisLeft(escalaRatingDetalle)); */


    // Hacer el data join para la vista detalle
    /* const puntosDetalle = contenedorPuntosDetalle
        .selectAll("circle")
        .data(datos)
        .join("circle")
        .attr("fill", "steelblue")
        .attr("opacity", 1)
        .attr("r", 7)
        .attr("cx", d => escalaPagesDetalle(d.pages))
        .attr("cy", d => escalaRatingDetalle(d.rating)) */


    // Definir el clip-path
    /* svgDetalle
        .append("clipPath")
        .attr("id", "clip-detalle")
        .append("rect")
        .attr("width", height)
        .attr("height", height)

    puntosDetalle
        .attr("clip-path", "url(#clip-detalle)") */


    // Definir el brush


    // Crear la función para el comportamiento de brush
    const brushed = (evento) => {
        /* const seleccion = evento.selection;
        console.log(seleccion)

        const pagesMin = escalaPagesPanoramica.invert(seleccion[0][0]);
        const pagesMax = escalaPagesPanoramica.invert(seleccion[1][0]);

        const ratingMax = escalaRatingPanoramica.invert(seleccion[0][1]);
        const ratingMin = escalaRatingPanoramica.invert(seleccion[1][1]); */

        /* escalaPagesDetalle.domain([pagesMin, pagesMax]);
        contenedorEjePagesDetalle.call(d3.axisBottom(escalaPagesDetalle));

        escalaRatingDetalle.domain([ratingMin, ratingMax]);
        contenedorEjeRatingDetalle.call(d3.axisLeft(escalaRatingDetalle)); */

        /* puntosDetalle
            .attr("cx", d => escalaPagesDetalle(d.pages))
            .attr("cy", d => escalaRatingDetalle(d.rating)); */

        /* const filtro = d => 
            pagesMin <= d.pages && d.pages <= pagesMax && ratingMin <= d.rating && d.rating <= ratingMax;

        puntosPanoramica
            .attr("fill", d => (filtro(d) ?  "steelblue" : "black")); */

    }

    /* brush
        .on("brush", brushed); */


    // Posicionamos el brush inicial



    // Cambio estético

    
    
    
}

d3.csv('./../top_100_scifi_books_preprocessed.csv', d => ({ pages: parseInt(d.pages), rating: parseFloat(d.ratings) }))
    .then(datos => visualizacion(datos))
    .catch(error => console.log(error));