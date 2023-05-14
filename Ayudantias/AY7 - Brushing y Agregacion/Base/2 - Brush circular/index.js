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

    const escalaRatingDetalle = d3
        .scaleLinear()
        .domain([200, 100].map(escalaRatingPanoramica.invert))
        .range([height, 0]);

    const ejeRatingDetalle = d3.axisLeft(escalaRatingDetalle);

    contenedorEjeRatingDetalle.call(ejeRatingDetalle);

    const escalaPagesDetalle = d3
        .scaleLinear()
        .domain([100, 200].map(escalaPagesPanoramica.invert))
        .range([0, height]);

    const ejePagesDetalle = d3.axisBottom(escalaPagesDetalle);

    contenedorEjePagesDetalle.call(ejePagesDetalle);

    const puntosDetalle = contenedorPuntosDetalle
        .selectAll("circle")
        .data(datos)
        .join("circle")
        .attr("fill", "steelblue")
        .attr("r", 7)
        .attr("opacity", 1)
        .attr("cx", d => escalaPagesDetalle(d.pages))
        .attr("cy", d => escalaRatingDetalle(d.rating));

    /* A continuación haremos una serie de cambios respecto a la implementación del brush cuadrado */

    // #1 Modificar la forma del clip-path  

    svgDetalle
        .append("clipPath")
        .attr("id", "clip-detalle")
        .append("rect")
        .attr("width", HEIGHT - margin.top - margin.bottom)
        .attr("height", HEIGHT - margin.top - margin.bottom);

    contenedorPuntosDetalle
        .attr("clip-path", "url(#clip-detalle)");

    // #2 Mejorar visualmente la vista detalle

    /* svgDetalle
        .append("circle")
        .attr("cx", height / 2)
        .attr("cy", height / 2)
        .attr("r", height / 2)
        .attr("fill", "white")
        .attr("stroke", "steelblue")
        .attr("transform", `translate(${margin.left} ${margin.top})`)
        .lower(); */

    /* svgDetalle
        .append("rect")
        .attr("width", height)
        .attr("height", height)
        .attr("fill", "gray")
        .attr("opacity", 0.2)
        .attr("transform", `translate(${margin.left} ${margin.top})`)
        .lower(); */


    const brush = d3
        .brush()
        .extent([
            [0, 0],
            [WIDTH - margin.left - margin.right, HEIGHT - margin.top - margin.bottom]
        ]);

    contenedorBrush.call(brush);

    const brushed = (evento) => {
        const seleccion = evento.selection;

        const pagesMin = escalaPagesPanoramica.invert(seleccion[0][0]);
        const pagesMax = escalaPagesPanoramica.invert(seleccion[1][0]);

        const ratingMax = escalaRatingPanoramica.invert(seleccion[0][1]);
        const ratingMin = escalaRatingPanoramica.invert(seleccion[1][1]);

        // #5 Modificar el filtro de los puntos de la vista panorámica

        /* const r = (seleccion[1][0] - seleccion[0][0]) / 2;
        const cx = (seleccion[1][0] + seleccion[0][0]) / 2;
        const cy = (seleccion[1][1] + seleccion[0][1]) / 2; */

        const filtro = d =>
            pagesMin <= d.pages && d.pages <= pagesMax && ratingMin <= d.rating && d.rating <= ratingMax;

        puntosPanoramica
            .attr("fill", d => (filtro(d) ? "steelblue" : "black"));

        escalaPagesDetalle.domain([pagesMin, pagesMax]);
        contenedorEjePagesDetalle.call(d3.axisBottom(escalaPagesDetalle));

        escalaRatingDetalle.domain([ratingMin, ratingMax]);
        contenedorEjeRatingDetalle.call(d3.axisLeft(escalaRatingDetalle));

        puntosDetalle
            .attr("cx", d => escalaPagesDetalle(d.pages))
            .attr("cy", d => escalaRatingDetalle(d.rating));
    }

    // #3 Aplicar un filtro personalizado para el evento de brush

        /* return (
            !event.ctrlKey &&
            !event.button &&
            event.target.__data__.type !== "overlay"
        ); */

    brush
        .on("brush", brushed);


    contenedorBrush
        .call(brush.move, [
            [100, 100],
            [200, 200]
        ]);

    // #4 Varios cambios sobre los componentes de brush

    contenedorBrush.select(".selection").attr("fill", "steelblue");
}

d3.csv('./../top_100_scifi_books_preprocessed.csv', d => ({ pages: parseInt(d.pages), rating: parseFloat(d.ratings) }))
    .then(datos => visualizacion(datos))
    .catch(error => console.log(error));