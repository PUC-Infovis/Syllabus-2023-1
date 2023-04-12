// Definimos los margenes del segundo svg

const margenSegundoSvg = {
    top: 100,
    bottom: 30,
    left: 120,
    right: 30
}

const WIDTH_VIS_2 = 1500
// Agregamos el segundo svg con el ancho definido anteriormente, la altura la agregamos
// cuando creemos la visualizacion

const segundoSvg = d3.select("#vis2")
    .append("svg")
    .attr("width", WIDTH_VIS_2)


// Agregamos un g en el segundo svg que contenga nuestra visualización

const contenedorVis = segundoSvg
    .append("g")
    .attr("transform", `translate(${margenSegundoSvg.left} ${margenSegundoSvg.top})`);

function crearSegundaVis(datos, pais, escalaDeColores) {
    // Obtenemos los parámetros de nuestros selectores
    let ORDER_BY = document.getElementById("orden").selectedOptions[0].value;
    let ASCENDENTE = document.getElementById("ascendente").selectedOptions[0].value;
    let FILTRO_DATOS = document.getElementById("filtro").selectedOptions[0].value;

    // Nos aseguramos de vincular cada vez que cambia un selector
    // que se vuelva a llamar esta función.
    d3.select("#orden").on("change", event => {
        crearSegundaVis(datos, pais, escalaDeColores)
    })

    d3.select("#ascendente").on("change", event => {
        crearSegundaVis(datos, pais, escalaDeColores)
    })

    d3.select("#filtro").on("change", event => {
        crearSegundaVis(datos, pais, escalaDeColores)
    })

    // Filtramos los datos según el país seleccionado
    let datosFiltrados = d3.filter(datos, d => d.Language == pais);

    // Acotamos los datos a 42
    datosFiltrados = datosFiltrados.slice(0, 42);

    // Filtramos los datos según el selector de edad o canales patrocinados
    if (FILTRO_DATOS == "mature") {
        datosFiltrados = d3.filter(datosFiltrados, d => d.Mature == "True")
    } else if (FILTRO_DATOS == "partnered") {
        datosFiltrados = d3.filter(datosFiltrados, d => d.Partnered == "False")
    }


    // Ordenamos los datos según el selector de orden
    if (ORDER_BY == "ViewsGained") {
        datosFiltrados = datosFiltrados.sort((a, b) => {
            if (ASCENDENTE == "ascendente") {
                return a.ViewsGained - b.ViewsGained
            } else if (ASCENDENTE == "descendente") {
                return b.ViewsGained - a.ViewsGained
            }
        })

    } else if (ORDER_BY == "FollowersGained") {
        datosFiltrados = datosFiltrados.sort((a, b) => {
            if (ASCENDENTE == "ascendente") {
                return a.FollowersGained - b.FollowersGained
            } else if (ASCENDENTE == "descendente") {
                return b.FollowersGained - a.FollowersGained
            }
        })
    }

    // Construimos la visualización

    // Obtenemos la cantidad de filas que utilizaremos, considerando que tendremos 7 mandos por fila
    // Con este número calculamos la altura del svg

    const filas = [...Array(Math.trunc(datosFiltrados.length / 7) + 1).keys()]
    const heightSegundoSvg = filas.length * 200

    // Seteamos la altura del segundo svg

    segundoSvg.attr("height", heightSegundoSvg)

    // Definimos la escala horizontal para los mandos, de la misma manera que definimos para los televisores,
    // solo que en este caso, serán 7 por fila

    const escalaPosicionHorizontal = d3
        .scaleBand()
        .domain([0, 1, 2, 3, 4, 5, 6])
        .range([0, WIDTH_VIS_2 - margenSegundoSvg.right - margenSegundoSvg.left])

    // Definimos la escala vertical para los mandos, el dominio serán las filas obtenidas anteriormente

    const escalaPosicionVertical = d3
        .scaleBand()
        .domain(filas)
        .range([0, heightSegundoSvg - margenSegundoSvg.top - margenSegundoSvg.bottom])

    // Definimos una escala para el alto de cada elipse, el dominio será las vistas que han ganado los streamers,
    // mientras que el rango será de 40 a 60

    const altoAgarreMando = d3
        .scaleLinear()
        .domain([0, d3.max(datosFiltrados, d => d.ViewsGained)])
        .range([40, 60])

    // Definimos una escala para el alto de cada elipse, el dominio será los seguidores que han ganado los streamers,
    // mientras que el rango será de 70 a 100

    const anchoMando = d3
        .scaleLinear()
        .domain([0, d3.max(datosFiltrados, d => d.FollowersGained)])
        .range([70, 100])


    // Ahora empezamos el datajoin, hay que tener especial cuidado ya que esta es una forma distinta de armar figuras.
    // En el caso de las televisiones, definimos un "g" por cada figura pequeña (botones, televisiones, pantallas, antenas),
    // en este caso, definiremos un "g" por cada figura compleja (mandos) y a ese g, le iremos agregando todos los atributos
    // correspondientes: ellipses, rectangulos y texto

    // Seleccionamos el contenedor y todos los "g" (nuestras figuras), conectamos los datos, seleccionado que se identifiquen
    // mediante el canal, para realizar el update y exit correctamente.
    // Personalizamos el join

    contenedorVis
        .selectAll("g")
        .data(datosFiltrados, d => d.Channel)
        .join(
            enter => {
                // Agregamos un "g", el que será la figura que codificaremos

                const G = enter.append("g")

                // Cada marca que agreguemos pertenecerá a una clase específica, por ejemplo, "mando-derecho"

                // Agregamos una elipse al g (mando derecho), lo haremos con una transición
                // Todas las posiciones ahora dependerán de la posición relativa que tenga la figura en el mando
                // Por ejemplo, en este caso fijamos que el cy de la elipse estará en el 0 de nuestro mando.
                // El cx de la elipse estará fijado por el ancho del mando mas 30 (2 veces el radio en x de la elipse)
                // El radio en y es dado por las vistas ganadas y su respectiva escala
                // Pintaremos de naranjo el mando derecho si es un canal patrocinado, si no, ocuparemos la escala de colores
                // Rotamos la elipse en 10 grados para que de la impresión de que es un mando

                G.append("ellipse")
                    .attr("class", "mando-derecho")
                    .transition()
                    .duration(2000)
                    .attr("cx", (d, i) => anchoMando(d.FollowersGained) + 30)
                    .attr("cy", (d, i) => 0)
                    .attr("rx", 15)
                    .attr("ry", d => altoAgarreMando(d.ViewsGained))
                    .attr("fill", d => d.Partnered != "True" ? "Orange" : escalaDeColores(d.Language))
                    .attr("transform", (d, i) => `rotate(-10 ${anchoMando(d.FollowersGained) + 30} 0)`)
                
                // Se realiza lo mismo que con la elipse anterior, pero el centro en x y en y será 0, ya que 
                // es el mando izquierdo
                // Pintaremos de naranjo el mando izquierdo si es un canal para +18, si no, ocuparemos la escala de colores

                G.append("ellipse")
                    .attr("class", "mando-izquierdo")
                    .transition()
                    .duration(2000)
                    .attr("rx", 15)
                    .attr("ry", d => altoAgarreMando(d.ViewsGained))
                    .attr("fill", d => d.Mature == "True" ? "Orange" : escalaDeColores(d.Language))
                    .attr("transform", "rotate(10 0 0)")

                // Agregamos el centro del mando, con un rectángulo, la posición en x será el radio de la elipse
                // mientras que la posición en y será la mitad del radio de la elipse menos el alto del agarre del mando
                // La altura será fija (30)
                // El ancho estará dado por los seguidores ganados y su respectiva escala
                // El color está dado por la escala de colores

                G.append("rect")
                    .attr("class", "centro-mando")
                    .transition()
                    .duration(2000)
                    .attr("x", (d, i) => 15)
                    .attr("y", (d, i) => 7.5 - altoAgarreMando(d.ViewsGained))
                    .attr("height", 30)
                    .attr("width", d => anchoMando(d.FollowersGained))
                    .attr("fill", d => escalaDeColores(d.Language));

                // Agregamos texto con los nombres
                // Se realiza una transición para que no aparezca de la nada
                // La posición en x será el radio de la elipse más el ancho del mando / 2 (para centrarlo)
                // La posición en y será el valor máximo del alto del mando + 20, para que todos los nombres
                // estén a la misma altura
                // El texto corresponderá al nombre del canal, si este supera los 10 caracteres, se le pondrán 3 puntos
                // suspensivos después de los 10

                G.append("text")
                    .attr("font-size", "0")
                    .transition()
                    .duration(2000)
                    .attr("class", "nombre")
                    .attr("x", (d, i) => 15 + anchoMando(d.FollowersGained) / 2)
                    .attr("y", (d, i) => altoAgarreMando.range()[1] + 20)
                    .attr("text-anchor", "middle")
                    .attr("font-size", "20")
                    .attr("fill", d => escalaDeColores(d.Language))
                    .text(d => d.Channel.length > 13 ? d.Channel.slice(0, 10) + "..." : d.Channel)

                // Retornamos la figura que acabamos de crear y la posicionamos en la grilla mediante el atributo transform
                // Para posicionarla ocupamos la misma lógica que las televisiones y las escalas construidas anteriormente

                return G.attr("transform", (d, i) => `translate(${escalaPosicionHorizontal(i % 7)} ${escalaPosicionVertical(Math.trunc(i / 7))})`)
            },
            update => {
                // Actualizamos únicamente atributos que dependan de las escalas que
                // fueron actualizadas
                
                // La posición será actualizada por lo que actualizamos cy y la rotación

                update.selectAll(".mando-derecho")
                    .transition()
                    .duration(2000)
                    .attr("cx", (d, i) => anchoMando(d.FollowersGained) + 30)
                    .attr("ry", d => altoAgarreMando(d.ViewsGained))
                    .attr("transform", (d, i) => `rotate(-10 ${anchoMando(d.FollowersGained) + 30} 0)`)

                // Se puede actualizar el radio en y de la elipse si es que filtramos, por lo que 
                // lo actualizamos en el update

                update.selectAll(".mando-izquierdo")
                    .transition()
                    .duration(2000)
                    .attr("ry", d => altoAgarreMando(d.ViewsGained));

                // Se actualiza la posición en y del mando y el ancho si es que filtramos

                update.selectAll(".centro-mando")
                    .transition()
                    .duration(2000)
                    .attr("y", (d, i) => 7.5 - altoAgarreMando(d.ViewsGained))
                    .attr("width", d => anchoMando(d.FollowersGained));

                // Se actualiza la posición en x de los nombres

                update.selectAll(".nombre")
                    .transition()
                    .duration(2000)
                    .attr("x", (d, i) => 15 + anchoMando(d.FollowersGained) / 2);

                // Trasladamos la figura que creamos mediante la misma lógica que el enter

                update
                    .transition()
                    .duration(1000)
                    .attr("transform", (d, i) => `translate(${escalaPosicionHorizontal(i % 7)} ${escalaPosicionVertical(Math.trunc(i / 7))})`)

                // Retornamos los cambios realizados

                return update
            },
            exit => {
                // Creamos una transición y llevamos los de las elipses a 0 para ser removidas

                exit.selectAll(".mando-derecho")
                    .transition()
                    .duration(1000)
                    .attr("rx", 0)
                    .attr("ry", 0)
                    .remove();

                exit.selectAll(".mando-izquierdo")
                    .transition()
                    .duration(1000)
                    .attr("rx", 0)
                    .attr("ry", 0)
                    .remove();

                // Creamos una transición y, llevamos el ancho y alto de los rectángulos a 0 para ser removidos

                exit.selectAll(".centro-mando")
                    .transition()
                    .duration(1000)
                    .attr("WIDTH_VIS_2", 0)
                    .attr("height", 0)
                    .remove();

                // Creamos una transición y llevamos el tamaño del texto a 0 para ser removidos

                exit
                    .selectAll(".nombre")
                    .transition()
                    .duration(1000)
                    .attr("font-size", 0)
                    .remove();

                // Removemos la figura completa que realizamos

                exit.transition().delay(1000).remove()
            }
        )
}