var svg = d3.select("#svg-voronoi-interactive").on("click", step),
    width = svg.attr("width"),
    height = svg.attr("height"),
    xStep = 16,
    yStep = 16,
    total = (width / xStep) * (height / yStep),
    iterations = 20;

console.log(total);

var voronoi = d3.voronoi()
    .extent([[0, 0], [width, height]]);

var polygon;
var link;
var site;


var image = new Image();
var numPoints = 0;
var sites = [];
var cells;
var links;
var diagram;
var showGrid = true;
var imageData;


document.getElementById("toggle").onclick = function(){
    showGrid = showGrid ? false : true;
    redraw();
};


image.crossOrigin="Anonymous";
image.src = "images/robot-square-small.jpg";
image.onload = onImageLoad;