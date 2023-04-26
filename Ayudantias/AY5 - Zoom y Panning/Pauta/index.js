/* Nota: Para facilitar la diferenciación del código de esta ayudantía,
		 se borraron los comentarios que originalmente estaban presentes
*/

// Definimos una variable global para guardar el zoom actual
// esto nos ayuda a que cuando se use el filtro, se muestren
// apropiadamente los datos.
// El valor por defecto es la identidad
let zoomActual = d3.zoomIdentity;

// Agregamos botones para controlar el zoom de otra manera
// El selector que se usa es Direct child (>) con el de clase (.)
// Más información de selectores: https://w3c.github.io/csswg-drafts/selectors/#child-combinators
div_botones = d3.selectAll("div > .flex-vertical")

// botón de reiniciar zoom
div_botones
	.append("button")
	.attr("id", "btn-reset")
	.text("Reiniciar Zoom")

// botón de zoom al segundo elemento
div_botones
	.append("button")
	.attr("id", "btn-second")
	.text("Zoom a segundo elemento")

const WIDTH = 800,
	HEIGHT = 450;

const margins = {
	top: 50,
	bottom: 60,
	left: 60,
	right: 30
};

const svg = d3.select("#visualizacion")
	.attr("width", WIDTH)
	.attr("height", HEIGHT);

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

contenedorTitulos
	.append("text")
	.attr("transform", `rotate(-90) translate(${-HEIGHT/2} ${margins.left/4})`)
	.attr("text-anchor", "middle")
	.attr("dominant-baseline", "mathematical") 
	.text("Ventas Totales");

const widthLegend = 200,
	heightLegend = 200;

const svgLegend = d3
	.select("#leyenda")
	.attr("width", widthLegend)
	.attr("height", heightLegend);

const leyendaInfo = ["Máximo", "Mínimo", "Rango", "Mediana"];

const manejarDatos = (datos) => {
	const plataformasRepetidas = datos.map(d => d.platform);
	const plataformasUnicas = [...new Set(plataformasRepetidas)];

	let data_dict = Object.fromEntries(plataformasUnicas.map(x => [x, []]));
	datos.map(d => data_dict[d.platform].push(d))

	d3.select("#seleccion")
		.selectAll("option")
		.data(plataformasUnicas)
		.join("option") 
		.attr("value", d => d)
		.text(d => d)

	const seleccion = document.getElementById("seleccion");
	seleccion.addEventListener("change", () => visualizacion(data_dict));

	let empty_dict = Object.fromEntries(plataformasUnicas.map(x => [x, []]));
	const boton = document.getElementById("boton");
	boton.addEventListener("click", () => visualizacion(empty_dict));
	
	visualizacion(data_dict);
};

const visualizacion = (data_dict) => {
	const platform = document.getElementById("seleccion").selectedOptions[0].value;
	const datos = data_dict[platform];

	const escalaVentas = d3.scaleLog()
		.domain([0.00001, d3.max(datos, d => d.max)])
		.range([0, HEIGHT - margins.top - margins.bottom])
		.nice();

	const escalaPosicionVentas = d3.scaleLog()
		.domain([0.00001, d3.max(datos, d => d.max)])
		.range([HEIGHT - margins.top - margins.bottom, 0])
		.nice();

	const tiempo = datos.map(d => d.year);

	const escalaTiempo = d3.scaleBand()
		.domain(tiempo)
		.range([0, WIDTH - margins.left - margins.right])

	const ejeVentas = d3.axisLeft(escalaPosicionVentas)
		.ticks(5);

	const ejeTiempo = d3.axisBottom(escalaTiempo);

	contenedorEjeVentas.call(ejeVentas);

	contenedorEjeTiempo.call(ejeTiempo);

	contenedorEjeVentas
		.selectAll(".tick")
		.select("line")
		.attr("x1", WIDTH - margins.left - margins.right)
		.attr("opacity", 0.5)
		.attr("stroke-dasharray", 15);

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

	// Contruimos nuestra función manejadora de zoom
	const manejadorZoom = (evento) => {
		const transformacion = evento.transform;
		// Actualizamos el rango de la escala considerando la transformación realizada.
		escalaTiempo.range([transformacion.applyX(0), transformacion.applyX(WIDTH - margins.right - margins.left)])
		// Actualizamos posición en X y ancho de las barras considerando la nueva escala.
		contenedorBarras
			.selectAll("rect")
			.attr("x", (d) => escalaTiempo(d.year) + escalaTiempo.bandwidth() / 4)
			.attr("width", escalaTiempo.bandwidth() / 2)
		
		contenedorPuntosMax
			.selectAll("circle")
			.attr("cx", d => escalaTiempo(d.year) + escalaTiempo.bandwidth() / 2)

		contenedorPuntosMin
			.selectAll("circle")
			.attr("cx", d => escalaTiempo(d.year) + escalaTiempo.bandwidth() / 2)

		contenedorLineaMedian
			.selectAll("line")
			.attr("x1", d => escalaTiempo(d.year))
			.attr("x2", d => escalaTiempo(d.year) + escalaTiempo.bandwidth())
			

		// Actualizamos el ejeX
		contenedorEjeTiempo.call(ejeTiempo);
		// Guardamos dicha transformación en nuestra variable global.
		zoomActual = transformacion;
	};

	// Agregamos clip path a los contenedores
	contenedorBarras
		.attr("clip-path", "url(#clip)")
	contenedorPuntosMax
		.attr("clip-path", "url(#clip)")
	contenedorPuntosMin
		.attr("clip-path", "url(#clip)")
	contenedorLineaMedian
		.attr("clip-path", "url(#clip)")
	contenedorEjeTiempo
		.attr("clip-path", "url(#clip)");

	// Inicializar Zoom
	const zoom = d3.zoom()
		.extent([[0, 0], [WIDTH, HEIGHT]])
		.translateExtent([[0, 0], [WIDTH, HEIGHT]])
		.scaleExtent([1, 8])
		.on("zoom", manejadorZoom);

	// Unimos las funciones necesarias a los botones de zoom
	// Botón resetear zoom
	d3.select("#btn-reset").on("click", ()=>
		svg
			.transition().duration(1000)
			.call(zoom.transform, d3.zoomIdentity)
	)
	// Botón zoom a segundo elemento
	d3.select("#btn-second").on("click", ()=>
		svg
			.transition().duration(1000)
			.call(zoom.transform, d3.zoomIdentity.scale(8).translate(-64, 0))
	)

	// Seteamos que el valor que el zoom tiene actualmente
	// es el zoom que se realizó la vez pasada
	svg.call(zoom.transform, zoomActual)
	// Conectar el zoom al svg
	svg.call(zoom)

};

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


////////////////////////////////////////////
////                                    ////
////       CODIGO DE AYUDANTIA 5        ////
////                                    ////
////////////////////////////////////////////


// Creamos nuestro clip que oculta todo lo que está fuera del rect
svg
  .append("clipPath")
  .attr("id", "clip")
  .append("rect")
  .attr("width", WIDTH  - margins.left - margins.right)
  .attr("height", HEIGHT);





