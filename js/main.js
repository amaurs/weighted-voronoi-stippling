var total = 2500;

var svg = d3.select("svg").on("click", moved),
    width = + svg.attr("width"),
    height = + svg.attr("height");

var voronoi = d3.voronoi()
    .extent([[-1, -1], [width + 1, height + 1]]);

var polygon;
var link;
var site;

var canvas = d3.select("body").append("canvas")
    .attr("width", width)
    .attr("height", height);
var context = canvas.node().getContext("2d");
var image = new Image();
var numPoints = 0;
var myPoints = [];
var first = true;
var lines = false;
var imageData;


document.getElementById("toggle").onclick = function(){
    lines = lines?false:true;
    redraw();
};


image.crossOrigin="Anonymous";
image.src = "images/robot-square.jpg";
image.onload = callback;