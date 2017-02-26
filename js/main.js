var width = 480,
    height = 480,
    xStep = 16,
    yStep = 16,
    total = (width / xStep) * (height / yStep),
    iterations = 20;
var voronoi = d3.voronoi()
    .extent([[0, 0], [width, height]]);

var polygon;
var link;
var site;


var image = new Image();
var numPoints = 0;
var sites = [];
var originalRejection;
var cells;
var links;
var diagram;
var showGrid = true;
var imageData;


document.getElementById("toggle").onclick = function(){
    showGrid = showGrid ? false : true;

    document.getElementById("toggle").innerHTML = showGrid ? "Hide Grid" : "Show Grid";
    initInteractive();
    redraw();
};

document.getElementById("restart").onclick = function(){
    sites = originalRejection;
    initInteractive();
    redraw();
};


image.crossOrigin="Anonymous";
image.src = "images/robot-square-small.jpg";
image.onload = onImageLoad;