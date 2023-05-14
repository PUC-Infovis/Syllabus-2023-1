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

/* En este caso nos interesa utilizar un brush cuadrado, por lo tanto, la vista detalle tendrá esa misma
forma. La vista está posicionada al lado derecho de la vista panorámica, por lo tanto, definiremos el 
tamaño del svg de la vista detalle de forma que coincidan sus lados con la altura de la vista
panorámica (HEIGHT)*/

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

    /* Hasta aquí se define la vista panorámica base, muy similar a las visualizaciones que ya han visto y 
    hecho anteriormente. A partir del código que viene a continuación se implementará la vista detalle,
    mediante la implementación de Brushing */

    /* En el caso particular de la visualización que crearemos en esta ayudantía, queremos un brush que 
    tenga un tamaño inicial que sea regular y que sea proporcional al tamaño de la visualización en detalle, y 
    que permita al usuario crear nuevos brush, así como modificar su tamaño y forma posteriormente. */

    /* Es en base a los valores encerrados por el brush que construiremos nuevas escalas, que iremos 
    actualizando, para la vista en detalle. Considerando que crearemos un brush por defecto, este tendrá 
    una posición inicial al crear la visualización. En este caso los valores iniciales que encerrará el brush
    definiremos que será entre los valores 100 y 200 para ambos ejes.*/

    const escalaRatingDetalle = d3
        .scaleLinear()
        .domain([200, 100].map(escalaRatingPanoramica.invert))
        .range([height, 0]);

    /* El método invert nos permite utilizar una escala de forma inversa, podemos entregarle valores del 'rango' 
    y nos retornará el valor del 'dominio' correspondiente. Es decir, si le pasamos un valor utilizando las
    distancias del svg nos devuelve el valor del dato correspondiente */

    const ejeRatingDetalle = d3.axisLeft(escalaRatingDetalle);

    contenedorEjeRatingDetalle.call(ejeRatingDetalle);

    const escalaPagesDetalle = d3
        .scaleLinear()
        .domain([100, 200].map(escalaPagesPanoramica.invert))
        .range([0, height]);

    const ejePagesDetalle = d3.axisBottom(escalaPagesDetalle);

    contenedorEjePagesDetalle.call(ejePagesDetalle);

    /* Una vez creadas las escalas en base a la posición incicial del brush, construiremos los puntos de 
    la vista detalle para esa posición en particular. En este caso el join no es importante que sea 
    personalizado ya que actualizaremos sus valores de 'forma manual' mediante el uso de brush, 
    por lo que sólo indicaremos el tipo de elemento svg (circle).*/

    const puntosDetalle = contenedorPuntosDetalle
        .selectAll("circle")
        .data(datos)
        .join("circle")
        .attr("fill", "steelblue")
        .attr("r", 7)
        .attr("opacity", 1)
        .attr("cx", d => escalaPagesDetalle(d.pages))
        .attr("cy", d => escalaRatingDetalle(d.rating));

    /* Hasta este punto del código, se puede ver que si bien las escalas están correctas y las posiciones de los 
    puntos estan bien, ocurre que hay puntos que se escapan del los ejes de la vista detalle. Para solucionar
    esto deberemos implementar la propiedad de css 'clip-path' que nos permite definir una región en la que los
    elementos pueden ser visibles y fuera de ella no lo son. */

    svgDetalle
        .append("clipPath")
        .attr("id", "clip-detalle")
        .append("rect")
        .attr("width", HEIGHT - margin.top - margin.bottom)
        .attr("height", HEIGHT - margin.top - margin.bottom);

    contenedorPuntosDetalle
        .attr("clip-path", "url(#clip-detalle)");

    /* Definimos entonces el clip-path sobre el svg del detalle, luego, le indicamos al contenedor de los puntos 
    del detalle que utilice ese clip-path en particular mediante el id. */

    /* A continuación vamos a implementar el brush para la visualización. */

    const brush = d3
        .brush()
        .extent([
            [0, 0],
            [WIDTH - margin.left - margin.right, HEIGHT - margin.top - margin.bottom]
        ]);

    contenedorBrush.call(brush);

    /* Primero creamos una forma básica del comportamiento con el método brush, extent() nos permite especificar
    las coordenadas relativas de la región con la que se va a interactuar. Posteriormente, llamamos el 
    comportamiento de brush mediante call() sobre el contenedor que definimos. */

    /* Cada vez que se gatille algún comportamiento del brush, podemos provocar que se ejecute algún código 
    en particular, esto lo hacemos con el método on() y el evento 'brush'; el argumento que recibirá la función
    es un objeto evento con la información del evento que ocurrió.*/

    /* Por lo tanto, aprovecharemos este evento para implementar la funcionalidad de las vista detalle,
    definiremos, primero, entonces la función brushed*/

    const brushed = (evento) => {
        const seleccion = evento.selection;
        // seleccion nos dice los puntos de referencia que conforman el cuadro del brush

        const pagesMin = escalaPagesPanoramica.invert(seleccion[0][0]);
        const pagesMax = escalaPagesPanoramica.invert(seleccion[1][0]);

        const ratingMax = escalaRatingPanoramica.invert(seleccion[0][1]);
        const ratingMin = escalaRatingPanoramica.invert(seleccion[1][1]);

        /* Accedemos al par de coordenadas del svg que definen donde se encuentra el brush y su tamaño. Estas
        estan contenidas dentro de seleccion, las llevamos al dominio de los datos y las guardamos en un formato 
        más intuitivo para ver los rangos de los valores. */

        /* A continuación definiremos una función de filtrado con la que buscaremos acceder a todos los puntos
        que se se encuentren dentro de esos rangos de valores. */

        const filtro = d =>
            pagesMin <= d.pages && d.pages <= pagesMax && ratingMin <= d.rating && d.rating <= ratingMax;

        puntosPanoramica
            .attr("fill", d => (filtro(d) ? "steelblue" : "black"));

        /* Utilizamos el operador ternario ?, para que encaso de que se cumpla el filtro el punto cambie
        de color, y no se cumple entonces se mantenga su color. */

        /* A continuación se actualizarán las escalas de la vista detalle con los nuevos rangos de los datos.
        Para, luego actualizar los ejes y finalmente las posiciones de los puntos. */

        escalaPagesDetalle.domain([pagesMin, pagesMax]);
        contenedorEjePagesDetalle.call(d3.axisBottom(escalaPagesDetalle));

        escalaRatingDetalle.domain([ratingMin, ratingMax]);
        contenedorEjeRatingDetalle.call(d3.axisLeft(escalaRatingDetalle));

        puntosDetalle
            .attr("cx", d => escalaPagesDetalle(d.pages))
            .attr("cy", d => escalaRatingDetalle(d.rating));
    }

    brush
        .on("brush", brushed);

    contenedorBrush
        .call(brush.move, [
            [100, 100],
            [200, 200]
        ]);

    /* Con esta llamada del brush definimos la posición y tamaño inicial que tendrá el brush */

    /* A continuación realizamos un cambio estético en que se modifica el color de la parte de seleccion de los
    datos en el brush (selection).*/
    
    contenedorBrush.select(".selection").attr("fill", "steelblue");
}

d3.csv('./../top_100_scifi_books_preprocessed.csv', d => ({ pages: parseInt(d.pages), rating: parseFloat(d.ratings) }))
    .then(datos => visualizacion(datos))
    .catch(error => console.log(error));