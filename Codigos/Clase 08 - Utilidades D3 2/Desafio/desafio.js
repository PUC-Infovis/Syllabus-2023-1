const WIDTH = 600;
const linearScale = d3.scaleLinear().domain([-30, 30]).range([0, WIDTH]);

const parrafo = d3.select(".info");

// Construir ejes
const axis = d3.axisBottom(linearScale);
d3.select(".axis").call(axis);

// actualizar rect y vincular evento de click
d3.select(".click-area")
    .attr("width", WIDTH)
    .attr("height", 40)
    .attr("fill", "orange")
    .on("click", (event, d) => {
        const pos = d3.pointer(event);
        const value = linearScale.invert(pos[0]).toFixed(1);
        parrafo.text(`${pos} --> ${value}`);
    });
