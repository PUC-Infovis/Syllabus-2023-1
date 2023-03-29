/* 1) Definimos nuestras constantes, ancho y alto del SVG. Y, los márgenes que querramos dejar a cada lado.*/
const WIDTH = 800,
    HEIGHT = 450;

const margins = {
    top: 50,
    bottom: 60,
    left: 60,
    right: 30
};

//Asignamos el tamaño al svg
const svg = d3.select("#visualizacion")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

/* Definimos los contenedores de los elementos de la visualización. Como la visualización se irá actualizando
mediante varias llamadas a su función, es importante definir los contenedores fuera de la función para 
que no se crean ejes nuevos o figuras que se sobrepongan entre ellos. */
const contenedorEjeVentas = svg
    .append("g")
    .attr("transform", `translate(${margins.left} ${margins.top})`);

const contenedorEjeTiempo = svg
    .append("g")
    .attr("transform", `translate(${margins.left} ${HEIGHT - margins.bottom})`);

const contenedorBarras = svg
    .append("g")
    .attr("transform", `translate(${margins.left} ${margins.top})`);

const contenedorPuntosMin = svg
    .append("g")
    .attr("transform", `translate(${margins.left} ${margins.top})`);

const contenedorPuntosMax = svg
    .append("g")
    .attr("transform", `translate(${margins.left} ${margins.top})`);

const contenedorLineaMedian = svg
    .append("g")
    .attr("transform", `translate(${margins.left} ${margins.top})`);

const contenedorTitulos = svg.append("g");

/* 5) Definimos los títulos de nuestra visualización y de los ejes. Aquí le damos una propiedad al texto para
que su punto de referencia para ser ubicado sea al medio de la palabra/oración. Y según su posición y orientación
ajustamos sus valores con el atributo transform para desplazar y rotar. */

contenedorTitulos
    .append("text")
    .attr("transform", `translate(${WIDTH/2} ${margins.top/2})`)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "mathematical") 
    .text("Ventas de Videojuegos por Consola");

contenedorTitulos
    .append("text")
    .attr("transform", `translate(${WIDTH/2} ${HEIGHT - margins.bottom/2})`)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "mathematical") 
    .text("Años");

/* ¡Aquí hay un punto importante! Al utilizar la transformación de rotate + translate, para que el elemento
sea ubicado correctamente hay que considerar que los argumentos de translate se invierten y el primero 
hay que escribirlo como negativo. De esta forma seremos capaces de ubicarlo de forma correcta y fácil. */
contenedorTitulos
    .append("text")
    .attr("transform", `rotate(-90) translate(${-HEIGHT/2} ${margins.left/4})`)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "mathematical") 
    .text("Ventas Totales");

/* Ahora para crear la leyenda de la visualización utilizaremos el segundo svg que definimos
y definiremos algunas constantes a utilizar. */
const widthLegend = 200,
    heightLegend = 200;

const svgLegend = d3
    .select("#leyenda")
    .attr("width", widthLegend)
    .attr("height", heightLegend);

const leyendaInfo = ["Máximo", "Mínimo", "Rango", "Mediana"];


/* 3) Antes de pasar los datos a la función que cree la visualización. Vamos a manipularlos para guardarlos
dentro de una estructura de datos que nos facilité su uso. En este caso queremos que cada vez que se seleccione
una plataforma, los datos se actualicen y cambien en la visualización. */

const manejarDatos = (datos) => {
    /* Primero cargaremos los nombres de las plataformas dentro del elemento html de seleccion. En este
    caso queremos guardar dentro de un arreglo los valores sin repetición de cada plataforma disponible
    en los datos. Para ello utilizaremos el método .map() para obtener un arreglo con los datos de las
    plataformas (con repeticiones) y luego guardaremos los valores únicos en un Set, que es una 
    estructura de datos que no admite valores duplicados.*/

    const plataformasRepetidas = datos.map(d => d.platform);
    const plataformasUnicas = [...new Set(plataformasRepetidas)];


    /* Ahora, separaremos los datos según la plataforma. Para facilitar su uso utilizaremos un diccionario,
    con los pares plataforma:datos (key:value). Las siguientes líneas crean primero los pares
    plataforma:[] "arreglo vacío", y luego utilizando map, sobre los datos hacemos push al arreglo
    que corresponda dentro del diccionario. */
    let data_dict = Object.fromEntries(plataformasUnicas.map(x => [x, []]));
    datos.map(d => data_dict[d.platform].push(d))


    /* Ahora que tenemos el diccionario que utilizaremos para crear la visualización. Agregaremos las 
    opciones al elemento de selección de plataformas.*/
    d3.select("#seleccion")
        .selectAll("option")
        .data(plataformasUnicas)
        .join("option") 
        .attr("value", d => d)
        .text(d => d)

    /* También, agregaremos un evento al elemento de selección para que cada vez que efectivamente sea
    seleccionada una opción se gatille la función para crear la visualización según la opción elegida */
    const seleccion = document.getElementById("seleccion");
    seleccion.addEventListener("change", () => visualizacion(data_dict));


    /* Luego, agregaremos la función del botón para limpiar la visualización. En este caso cada vez que 
    se haga click le entregaremos un diccionario similar al de los datos, que use las mismas llaves, pero
    su valor sean arreglos vacíos. De esta forma la visualización al tener menos datos que elementos 
    hará uso de exit en el DataJoin */
    let empty_dict = Object.fromEntries(plataformasUnicas.map(x => [x, []]));
    const boton = document.getElementById("boton");
    boton.addEventListener("click", () => visualizacion(empty_dict));


    /* Llamamos a la función que creará la visualización, y le entregamos como argumentos el arreglo 
    correspondiente a una de las plataformas. Por medio del diccionario que acabamos de crear. De esta 
    forma al cargar la página habrá una visualización por defecto.*/
    visualizacion(data_dict);
};

/* 4) Definiremos la función encargada de crear la visualización. */
const visualizacion = (data_dict) => {
    /* Guardamos qué plataforma fue seleccionada tras ser llamada la función. */
    const platform = document.getElementById("seleccion").selectedOptions[0].value;
    const datos = data_dict[platform];

    /* Definimos las escalas que utilizaremos para construir la visualización. En este caso nuestra
    visualización utilizará dos escalas diferentes. Por un lado, una escala logaritmica para todas las 
    medidas estadísticas respecto a las ventas. Y, por otro lado, una escala más bien discreta para
    los años; en este caso utilizaremos una escala de bandas para la construcción del Boxplot*/

    /* Definmos la escala para definir la altura (magnitud) de las barras. En este caso
    es necesario utilizar una escala logarítmica, ya que los valores mínimos son decimales y después los
    valores crecen demasiado rápido. Entonces, al utilizar una escala logarítmica, se logra "compensar"
    y es posible visualizar algo con una forma "más lineal". */
    const escalaVentas = d3.scaleLog()
        .domain([0.00001, d3.max(datos, d => d.max)])
        .range([0, HEIGHT - margins.top - margins.bottom])
        .nice();

    //Definimos la escala para la posición (vertical) de las barras
    const escalaPosicionVentas = d3.scaleLog()
        .domain([0.00001, d3.max(datos, d => d.max)])
        .range([HEIGHT - margins.top - margins.bottom, 0])
        .nice();


    /*Definimos la escala para los años. En este caso hay que entregar todos los valores de los años.
    Para ello obtendremos un arreglo con los años utilizando el método .map().*/

    const tiempo = datos.map(d => d.year);

    const escalaTiempo = d3.scaleBand()
        .domain(tiempo)
        .range([0, WIDTH - margins.left - margins.right]);

    /* Una vez tenemos las escalas, definiremos los ejes de nuestra visualización. En el caso
    del eje de ventas incluimos un método extra para indicar apróximadamente cuántos "ticks" queremos
    que hayan en el eje.*/
    const ejeVentas = d3.axisLeft(escalaPosicionVentas)
        .ticks(5);

    const ejeTiempo = d3.axisBottom(escalaTiempo);

    //Y, los llamamos para que sean dibujados, sobre los contenedores que definimos previamente
    contenedorEjeVentas.call(ejeVentas);

    contenedorEjeTiempo.call(ejeTiempo);

    /* Algo extra que podemos hacer, es una vez definidos los ejes es tratar de manipular la apariencia de
    algunos de sus elementos. Por ejemplo, los "ticks" que dentro del eje están identificados por la clase
    con el mismo nombre, y son un elemento svg de tipo line. Algo recomendado es explorar los elementos de 
    la visualización con la herramienta de inspeccionar del navegador para saber de estos detalles.*/

    contenedorEjeVentas
        .selectAll(".tick")
        .select("line")
        .attr("x1", WIDTH - margins.left - margins.right)
        .attr("opacity", 0.5)
        .attr("stroke-dasharray", 15);


    /* Ahora, comenzaremos a definir los elementos de nuestra visualización. Para ello realizaremos su
     Data Join respectivo y definiremos los contenedores fuera de esta función para que se vayan
     actualizando y no sobreponiendo uno sobre otro. */
    contenedorBarras
        .selectAll("rect")
        .data(datos)
        .join(
            (enter) => {
                enter
                    .append("rect")
                    .attr("height", d => escalaVentas(d.max) - escalaVentas(d.min))
                    .attr("width", escalaTiempo.bandwidth() / 2)
                    .attr("x", d => escalaTiempo(d.year) + escalaTiempo.bandwidth() / 4)
                    .attr("y", d => escalaPosicionVentas(d.max))
                    .attr("rx", 15)
                    .style("fill", "steelblue")
                    .style("opacity", 0.3);
            },
            (update) => {
                update
                    .attr("height", d => escalaVentas(d.max) - escalaVentas(d.min))
                    .attr("x", d => escalaTiempo(d.year) + escalaTiempo.bandwidth() / 4)
                    .attr("y", d => escalaPosicionVentas(d.max))
            },
            (exit) => exit.remove()
        );

    contenedorPuntosMax
        .selectAll("circle")
        .data(datos)
        .join(
            (enter) => {
                enter
                    .append("circle")
                    .attr("r", escalaTiempo.bandwidth() / 15)
                    .attr("cx", d => escalaTiempo(d.year) + escalaTiempo.bandwidth() / 2)
                    .attr("cy", d => escalaPosicionVentas(d.max))
                    .style("fill", "red");
            },
            (update) => {
                update
                    .attr("cx", d => escalaTiempo(d.year) + escalaTiempo.bandwidth() / 2)
                    .attr("cy", d => escalaPosicionVentas(d.max));
            },
            (exit) => exit.remove()
        );

    contenedorPuntosMin
        .selectAll("circle")
        .data(datos)
        .join(
            (enter) => {
                enter
                    .append("circle")
                    .attr("r", escalaTiempo.bandwidth() / 15)
                    .attr("cx", d => escalaTiempo(d.year) + escalaTiempo.bandwidth() / 2)
                    .attr("cy", d => escalaPosicionVentas(d.min))
                    .style("fill", "green");
            },
            (update) => {
                update
                    .attr("cx", d => escalaTiempo(d.year) + escalaTiempo.bandwidth() / 2)
                    .attr("cy", d => escalaPosicionVentas(d.min));
            },
            (exit) => exit.remove()
        );

    contenedorLineaMedian
        .selectAll("line")
        .data(datos)
        .join(
            (enter) => {
                enter
                    .append("line")
                    .attr("x1", d => escalaTiempo(d.year))
                    .attr("x2", d => escalaTiempo(d.year) + escalaTiempo.bandwidth())
                    .attr("y1", d => escalaPosicionVentas(d.median))
                    .attr("y2", d => escalaPosicionVentas(d.median))
                    .style("stroke", "white")
                    .attr("stroke-width", 2);
            },
            (update) => {
                update
                    .attr("y1", d => escalaPosicionVentas(d.median))
                    .attr("y2", d => escalaPosicionVentas(d.median));
            },
            (exit) => exit.remove()
        );

    /* Una vez ya construida la visualización, utilizaremos el otro svg que definimos para crear la leyenda
    para nuestra visualización.*/

    svgLegend
        .selectAll("circle")
        .data(leyendaInfo)
        .join(
            (enter) => {
                enter
                    .append("circle")
                    .attr("cx", widthLegend/4)
                    .attr("cy", (_, i) => i * 50 + heightLegend/8)
                    .attr("r", d => {
                        if (d == "Máximo" || d == "Mínimo") {
                            return escalaTiempo.bandwidth() / 15;
                        } else {
                            return escalaTiempo.bandwidth() / 4;
                        }
                    })
                    .attr("fill", (_,i) => ["red", "green", "steelblue", "steelblue"][i])
                    .attr("opacity", (_,i) => [1,1,0.3,0.3][i]);
            }
        )

    svgLegend
        .selectAll("line")
        .data(leyendaInfo)
        .join(
            (enter) => {
                enter
                    .append("line")
                    .attr("stroke", "white")
                    .attr("x1", widthLegend/4 - escalaTiempo.bandwidth() / 4)
                    .attr("x2", widthLegend/4 + escalaTiempo.bandwidth() / 4)
                    .attr("y1", 3 * 50 + heightLegend/8)
                    .attr("y2", 3 * 50 + heightLegend/8)
                    .attr("stroke-width", 2);
            }
        )
        
    svgLegend
        .selectAll("text")
        .data(leyendaInfo)
        .join(
            (enter) => {
                enter
                    .append("text")
                    .attr("x", widthLegend/2)
                    .attr("y", (_, i) => i * 50 + 20)
                    .attr("dominant-baseline", "mathematical") 
                    .text(d => d);
            }
        )
        
};

/* 2) Utilizamos d3.csv para obtener los datos desde el archivo 'platform_sales.csv'. 
Realizamos el parseo de datos según corresponda. Luego, definimos con el método .then() a que función
serán entregados los datos como argumento. Por último, utilizamos el método .catch() para atrapar
los posibles errores e indicaremos que queremos que sean impresos en consola para poder debugear */
d3.csv('platform_sales.csv', d => ({
    platform: d.Platform,
    year: parseInt(d.Year),
    min: parseFloat(d.Min),
    first: parseFloat(d.First),
    median: parseFloat(d.Median),
    third: parseFloat(d.Third),
    max: parseFloat(d.Max)
}))
    .then(datos => manejarDatos(datos))
    .catch(error => console.log(error));