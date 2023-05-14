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

/* En este caso nos interesa utilizar un brush circular, esto lo implementaremos a partir de un cuadrado el 
cual suavizaremos sus esquinas hasta tener un circulo. Por lo tanto, tomaremos una forma cuadrada como base. 
La vista está posicionada al lado derecho de la vista panorámica, por lo tanto, definiremos el tamaño del svg 
de la vista detalle de forma que coincidan sus lados con la altura de la vista panorámica (HEIGHT)*/

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

    /* Una diferencia importante de la implementación de brush circular, es que deberemos adapaptar la forma 
    del clip-path para la vista en detalle, para que tome la forma de un circulo. Esto lo hacemos cambiando
    el elemento svg que hacemos append, en este caso indicamos que sea 'circle' y ajustamos sus atributos 
    respectivos. */

    svgDetalle
        .append("clipPath")
        .attr("id", "clip-detalle")
        .append("circle")
        .attr("cx", (HEIGHT - margin.top - margin.bottom) / 2)
        .attr("cy", (HEIGHT - margin.top - margin.bottom) / 2)
        .attr("r", (HEIGHT - margin.top - margin.bottom) / 2);

    contenedorPuntosDetalle
        .attr("clip-path", "url(#clip-detalle)");

    /* Hasta este punto notamos que los ejes no son suficiente para demarcar el área 'visible' de los
    puntos en la vista en detalle. Entoces, lo que haremos es agregar algunas figuras que nos ayuden a que
    se noten de mejor manera. */

    svgDetalle
        .append("circle")
        .attr("cx", (HEIGHT - margin.top - margin.bottom) / 2)
        .attr("cy", (HEIGHT - margin.top - margin.bottom) / 2)
        .attr("r", (HEIGHT - margin.top - margin.bottom) / 2)
        .attr("fill", "white")
        .attr("stroke", "steelblue")
        .attr("transform", `translate(${margin.left} ${margin.top})`)
        .lower();

    svgDetalle
        .append("rect")
        .attr("width", HEIGHT - margin.top - margin.bottom)
        .attr("height", HEIGHT - margin.top - margin.bottom)
        .attr("fill", "gray")
        .attr("opacity", 0.2)
        .attr("transform", `translate(${margin.left} ${margin.top})`)
        .lower();

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

        /* En este caso lo siguiente que deberemos adaptar es cómo funciona nuestro filtro. Para ello deberemos 
        encontrar un cx, cy y r respecto al brush, en términos del svg para luego, para así poder identificar 
        qué datos se encuentran dentro de la región del brush. Estos valores los calculamos a partir de 
        'seleccion'*/

        const r = (seleccion[1][0] - seleccion[0][0]) / 2;
        const cx = (seleccion[1][0] + seleccion[0][0]) / 2;
        const cy = (seleccion[1][1] + seleccion[0][1]) / 2;

        /* Ahora, definiremos el filtro, tal que la distancia entre el centro del brush y el punto que estemos
        revisando sea menor o igual al radio del brush. */

        const filtro = d =>
            (escalaPagesPanoramica(d.pages) - cx) ** 2 + (escalaRatingPanoramica(d.rating) - cy) ** 2 <= r ** 2;

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

    //brush
    //    .on("brush", brushed);

    /* De momento si vinculamos el evento brush a la función que acabamos de crear ya tendríamos lista 
    la implementación sobre la vista detalle. Sin embargo, como se podría ver, tal como está definido el 
    brush actualmente el uso de la visualización se vuelve caótico, debido a que el filtro para los puntos
    dentro del brush está definido para un círculo y no elipses, por lo que es necesario poder limitar el 
    brush. Para ello, filtraremos algunos de los eventos brush que se gatillan antes de vincular la función 
    y definiremos un tamaño fijo con la misma proporción de la vista detalle. */

    brush.filter((event) => {
        return (
            !event.ctrlKey &&
            !event.button &&
            event.target.__data__.type !== "overlay"
        );
    })
        .on("brush", brushed);

    /* Si no indicamos ningún filtro, por defecto se aplica:

    function filter(event) {
        return !event.ctrlKey && !event.button;
    }

    Este filtro lo que hace es ignorar los eventos derivados del uso de la tecla Ctrl y los eventos de los
    botones secundarios del mouse, ya que comunmente pueden estar reservados para otros usos como context menu
    (o, menú contextual).

    La última condición que indicamos: 
        event.target.__data__.type !== "overlay"

    nos permite evitar que se cree una nueva seleccion del brush, ya que en este caso brush define un 
    "overlay" invisible sobre el cual al hacer click y arrastrar nos permite crear nuevas selecciones del
    brush. Entonces, en este caso al limitar los eventos que tenga por objetivo interactuar con este overlay 
    evitamos justamente que se creen nuevas selecciones del brush. */

    contenedorBrush
        .call(brush.move, [
            [100, 100],
            [200, 200]
        ]);

    /* Por último, deberemos modificar cómo se ve visualmente la forma del brush. Para ello, indicamos que la 
    parte de selection que indica los datos seleccionados por el brush, también tenga las esquinas redondeadas.*/
    contenedorBrush.select(".selection")
        .attr("fill", "steelblue")
        .attr("rx", "50%")
        .attr("ry", "50%");

    /* Realizamos un cambio estético en que el mouse (o cursor) se vea por default al estar sobre el overlay, 
    es decir, el espacio de la visualización externo al cuadrado del brush. */

    contenedorBrush.select(".overlay").style("cursor", "default");

    contenedorBrush.selectAll(".handle").remove();

    /* Esta última línea de código evita que podamos modificar el tamaño del brush a partir de 
    los bordes de él (pensando en la forma cuadrada original del brush). Ya que en las 4 esquinas 
    y los 4 lados existen las clases handle que permiten modificar el tamaño, y por lo tanto, las quitamos. 
    Además, como ahora trabajamos con un circulo tampoco nos conviene mantener estos bordes y esquinas 
    'invisibles'*/
}

d3.csv('./../top_100_scifi_books_preprocessed.csv', d => ({ pages: parseInt(d.pages), rating: parseFloat(d.ratings) }))
    .then(datos => visualizacion(datos))
    .catch(error => console.log(error));