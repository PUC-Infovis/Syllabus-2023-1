// Definimos el ancho y largo del primer svg

const WIDTH = 1500
const HEIGHT = 600

// Definimos los margenes del primer svg

const margin = {
    top: 200,
    bottom: 30,
    left: 100,
    right: 30
}

// Agregamos el svg con el ancho y altura definida anteriormente

const svg = d3.select("#vis1")
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)


// Agregamos un "g" para cada grupo de marcas que codificaremos, traslandolo los margenes correspondientes

const televisiones = svg
    .append("g")
    .attr("id", "televisiones")
    .attr("transform", `translate(${margin.left} ${margin.top})`);

const pantallas = svg
    .append("g")
    .attr("id", "pantallas")
    .attr("transform", `translate(${margin.left} ${margin.top})`);

const botones = svg
    .append("g")
    .attr("id", "botones")
    .attr("transform", `translate(${margin.left} ${margin.top})`);

const antenas = svg
    .append("g")
    .attr("id", "antenas")
    .attr("transform", `translate(${margin.left} ${margin.top})`);

const antenasIzquierdas = svg
    .append("g")
    .attr("id", "antenasIzquierdas")
    .attr("transform", `translate(${margin.left} ${margin.top})`);

const titulos = svg
    .append("g")
    .attr("id", "titulos")
    .attr("transform", `translate(${margin.left} ${margin.top})`);



// Creamos la función para la primera vis, recibe los dos datasets entregados

function crearTelevisiones(datosGenerales, datosParticulares) {
    // Exploramos los datos

    console.log(datosGenerales)
    console.log(datosParticulares)

    // Definimos una variable para saber los lenguajes que hay

    const lenguajes = [...new Set(datosGenerales.map((d) => d.Language))]

    // Definimos una escala ordinal para asignar un color a cada lenguaje
    // Pueden revisar en el siguente link las escalas de colores que provee d3
    // https://github.com/d3/d3-scale-chromatic/blob/main/README.md 

    const escalaDeColores = d3
        .scaleOrdinal()
        .domain(lenguajes)
        .range(d3.schemeCategory10);

    // Creamos una escala de bandas para posicionar horizontalmente a las televisiones, como son 5, el dominio serán las posiciones
    // 0, 1, 2, 3 y 4; mientras que el rango será desde el inicio del svg hasta el ancho menos los márgenes

    const escalaPosicionTelevision = d3
        .scaleBand()
        .domain([0, 1, 2, 3, 4])
        .range([0, WIDTH - margin.right - margin.left])

    // Creamos una escala de bandas para las posiciones verticales, como son solo dos filas, el dominio serán las posiciones 0 y 1,
    // 0 para la fila superior y 1 para la inferior, mientras que el rango será desde el inicio del svg hasta la altura
    // menos los márgenes

    const escalaPosicionTelevisionVertical = d3
        .scaleBand()
        .domain([0, 1])
        .range([0, HEIGHT - margin.top - margin.bottom])

    // Creamos una escala lineal para definir el ancho de las televisiones, el dominio será desde 0 hasta el máximo de seguidores
    // mientras que el rango será desde 150 a 200. No se fija el inicio en 0 para que no hayan televisiones demasiado pequeñas

    const anchoTelevision = d3
        .scaleLinear()
        .domain([0, d3.max(datosGenerales, d => d.Followers)])
        .range([150, 200])

    // Creamos una escala lineal para definir el alto de las televisiones, el dominio será desde 0 hasta el máximo de seguidores
    // mientras que el rango será desde 75 a 100. No se fija el inicio en 0 para que no hayan televisiones demasiado pequeñas

    const altoTelevision = d3
        .scaleLinear()
        .domain([0, d3.max(datosGenerales, d => d.Followers)])
        .range([75, 100])

    // Creamos una escala lineal para definir el ancho de las pantallas, el dominio será desde 0 hasta el máximo del Peak de Viewers
    // mientras que el rango será desde 75 a 120. No se fija el inicio en 0 para que no hayan pantallas demasiado pequeñas

    const anchoPantalla = d3
        .scaleLinear()
        .domain([0, d3.max(datosGenerales, d => d.PeakViewers)])
        .range([75, 120])

    // Creamos una escala lineal para definir el alto de las pantallas, el dominio será desde 0 hasta el máximo del Peak de Viewers
    // mientras que el rango será desde 50 a 70. No se fija el inicio en 0 para que no hayan pantallas demasiado pequeñas

    const altoPantalla = d3
        .scaleLinear()
        .domain([0, d3.max(datosGenerales, d => d.PeakViewers)])
        .range([50, 70])

    
    // Creamos una escala lineal para definir el radio de los botones, el dominio será desde 0 hasta el máximo del promedio
    // de seguidores mientras que el rango será desde 7 a 12. No se fija el inicio en 0 para que no hayan botones tan pequeños

    const radioBotones = d3
        .scaleLinear()
        .domain([0, d3.max(datosGenerales, d => d.AvgViewers)])
        .range([7, 12])

    // Creamos una escala lineal para definir el ancho de las antenas, el dominio será desde 0 hasta el máximo del tiempo en stream
    // mientras que el rango será desde 0 a 50

    const anchoAntenas = d3
        .scaleLinear()
        .domain([0, d3.max(datosGenerales, d => d.StreamTime)])
        .range([0, 50])

    // Creamos una función para centrar las televisiones y sus objetos verticalmente

    function centradoVertical(d, i) {
        return (escalaPosicionTelevisionVertical(Math.trunc(i / 5)) - altoTelevision(d.Followers)) / 2
    }

    // Empezamos los data joins
    // Seleccionamos todos los rectángulos en nuestro g de televisiones. Le agregamos los datos proporcionados
    // Unimos cada dato con un rectángulo con el join("rect") y le asignamos los atributos correspondientes
    // El color dado por el lenguaje y su respectiva escala
    // El ancho dado por los seguidores y su escala
    // La altura dada por los seguidores y su escala
    // La posición en x va a ser el resto entre la posición del dato y 5 (ya que son 5 televisiones por fila)
    // esto dará un número entre 0 y 4 (incluidos), lo cual corresponde al dominio de la escala definida anteriormente
    // La posición en y se maneja mediante la división entera entre 5, ya que esto dará 0 o 1 (son 10 lenguajes)
    // lo cual corresponde al dominio definido en la escala, esto junto con la función de centrado definida anteriormente

    televisiones
        .selectAll("rect")
        .data(datosGenerales)
        .join("rect")
        .attr("fill", d => escalaDeColores(d.Language))
        .attr("width", d => anchoTelevision(d.Followers))
        .attr("height", d => altoTelevision(d.Followers))
        .attr("x", (d, i) => escalaPosicionTelevision(i % 5))
        .attr("y", (d, i) => escalaPosicionTelevisionVertical(Math.trunc(i / 5)) + centradoVertical(d, i))

    // Seleccionamos todos los rectángulos en nuestro g de pantallas. Le agregamos los datos proporcionados.
    // Unimos cada dato con un rectángulo con el join("rect") y le asignamos los atributos correspondientes
    // El color dado por si la televisión está encendida o no
    // El ancho dado el peak de Viewers y su escala
    // La altura dada el peak de Viewers y su escala
    // Las posiciones en x e y se manejan igual que anteriormente, y se le agregan sumas o restas para poder calzar
    // la posición de la pantalla en su televisión

    pantallas
        .selectAll("rect")
        .data(datosGenerales)
        .join("rect")
        .attr("fill", d => d.Encendido ? "white" : "black")
        .attr("width", d => anchoPantalla(d.PeakViewers))
        .attr("height", d => altoPantalla(d.PeakViewers))
        .attr("x", (d, i) => escalaPosicionTelevision(i % 5) + (anchoTelevision(d.Followers) - anchoPantalla(d.PeakViewers)) / 2)
        .attr("y", (d, i) => escalaPosicionTelevisionVertical(Math.trunc(i / 5)) +
            (altoTelevision(d.Followers) - altoPantalla(d.PeakViewers)) / 2 + centradoVertical(d, i))

    // Seleccionamos todos los círculos en nuestro g de botones. Le agregamos los datos proporcionados.
    // Unimos cada dato con un círculo con el join("circle") y le asignamos los atributos correspondientes
    // El color será negro
    // El radio está dado por el promedio de viewers y su escala
    // Las posiciones en cx y cy se manejan igual que anteriormente, con las respectivas sumas y restas para posicionarlo
    // Se le agrega una función al ser seleccionado, la cual hará que la pantalla se prenda una vez que el botón se apriete
    // Esto también hará que se cree la segunda visualización, seteando el encendido de la televisión a true, mientras
    // que si la televisión está encendida y se apaga, se elimina la segunda visualización y se setea el encendido a false


    botones
        .selectAll("circle")
        .data(datosGenerales)
        .join("circle")
        .attr("fill", "black")
        .attr("r", d => radioBotones(d.AvgViewers))
        .attr("cx", (d, i) => escalaPosicionTelevision(i % 5) + (1 / 4) * anchoPantalla(d.PeakViewers) +
            (3 / 4) * (anchoTelevision(d.Followers)))
        .attr("cy", (d, i) => escalaPosicionTelevisionVertical(Math.trunc(i / 5)) + (3 / 4) * altoTelevision(d.Followers) +
            centradoVertical(d, i))
        .on("click", (_, i) => {
            let seleccionada;
            console.log(d3.filter(datosGenerales, (d, x) => {
                if (d.Language == i.Language) {
                    seleccionada = x
                }
            }))

            if (datosGenerales[seleccionada].Encendido) {
                datosGenerales[seleccionada].Encendido = false
                crearTelevisiones(datosGenerales, datosParticulares)
                crearSegundaVis([], i.Language, escalaDeColores)
            } else {
                for (let i = 0; i < datosGenerales.length; i++) {
                    datosGenerales[i].Encendido = false
                }
                datosGenerales[seleccionada].Encendido = true
                crearTelevisiones(datosGenerales, datosParticulares)
                crearSegundaVis(datosParticulares, i.Language, escalaDeColores)
            }
        })

    // Seleccionamos todos los rectángulos en nuestro g de antenas. Le agregamos los datos proporcionados.
    // Unimos cada dato con un rectángulo con el join("react") y le asignamos los atributos correspondientes
    // El color será gris
    // La altura será fija (10)
    // EL ancho estará dado por el tiempo en Stream y su escala
    // Las posiciones en x y y se manejan igual que anteriormente, con las respectivas sumas y restas para posicionarlo
    // Además se le agrega un atributo transform, para que pueda ser rotado, el centro de la rotación es el punto en el 
    // que inicia el rectángulo

    antenas
        .selectAll("rect")
        .data(datosGenerales)
        .join("rect")
        .attr("fill", "grey")
        .attr("height", 10)
        .attr("width", d => anchoAntenas(d.StreamTime))
        .attr("x", (d, i) => escalaPosicionTelevision(i % 5) + anchoTelevision(d.Followers) / 2)
        .attr("y", (d, i) => escalaPosicionTelevisionVertical(Math.trunc(i / 5)) + centradoVertical(d, i))
        .attr("transform", (d, i) => `rotate(-135 ${escalaPosicionTelevision(i % 5) + anchoTelevision(d.Followers) / 2} ` +
            `${escalaPosicionTelevisionVertical(Math.trunc(i / 5)) + centradoVertical(d, i)})`)

    // Funciona igual que el caso anterior pero se cambia el ángulo de rotación

    antenasIzquierdas
        .selectAll("rect")
        .data(datosGenerales)
        .join("rect")
        .attr("fill", "grey")
        .attr("height", 10)
        .attr("width", d => anchoAntenas(d.StreamTime) + 10)
        .attr("x", (d, i) => escalaPosicionTelevision(i % 5) + anchoTelevision(d.Followers) / 2)
        .attr("y", (d, i) => escalaPosicionTelevisionVertical(Math.trunc(i / 5)) + centradoVertical(d, i))
        .attr("transform", (d, i) => `rotate(-45 ${escalaPosicionTelevision(i % 5) + anchoTelevision(d.Followers) / 2} ` +
            `${escalaPosicionTelevisionVertical(Math.trunc(i / 5)) + centradoVertical(d, i)})`)

    // Seleccionamos todos los textos en nuestro g de títulos. Le agregamos los datos proporcionados.
    // Unimos cada dato con un texto con el join("text") y le asignamos los atributos correspondientes
    // Las posiciones en x y y se manejan igual que anteriormente, con las respectivas sumas y restas para posicionarlo
    // Además se le agrega un atributo text-anchor para fijar donde inicia el texto según su posición
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-anchor

    titulos
        .selectAll("text")
        .data(datosGenerales)
        .join("text")
        .attr("x", (d, i) => escalaPosicionTelevision(i % 5) + anchoTelevision(d.Followers) / 2)
        .attr("y", (d, i) => escalaPosicionTelevisionVertical(Math.trunc(i / 5)) - 80 + centradoVertical(d, i))
        .attr("text-anchor", "middle")
        .text(d => d.Language)
}

// Creamos una función que nos convierta a ints las columnas que tienen números, además creamos un nuevo atributo
// para las televisiones. Además, podemos cambiar los nombres de las columnas para más fácil acceso

function parseFirstDataset(d) {
    const data = {
        AvgViewers: +d["Average viewers"],
        Followers: +d.Followers,
        Language: d.Language,
        PeakViewers: +d["Peak viewers"],
        StreamTime: +d["Stream time(minutes)"],
        Encendido: false, // Agregamos un nuevo parámetro
    }

    return data
}

// Creamos una función que nos convierta a ints las columnas que tienen números.
// Además, podemos cambiar los nombres de las columnas para más fácil acceso

function parseSecondDataset(d) {
    const data = {
        AvgViewers: +d["Average viewers"],
        Channel: d.Channel,
        Followers: +d.Followers,
        FollowersGained: +d["Followers gained"],
        Language: d.Language,
        Mature: d.Mature,
        Partnered: d.Partnered,
        PeakViewers: +d["Peak viewers"],
        StreamTime: +d["Stream time(minutes)"],
        ViewsGained: +d["Views gained"],
        WatchTime: +d["Watch time(Minutes)"]
    }

    return data
}

// Leemos los datos mediante el comando tradicional de d3, aplicándole las funciones de parseo definidas anteriormente

d3.csv("streamers-by-country.csv", parseFirstDataset)
    .then(dataGeneral => d3.csv("streamers.csv", parseSecondDataset)
        .then(dataParticular => crearTelevisiones(dataGeneral, dataParticular)))