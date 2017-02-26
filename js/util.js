function onImageLoad(){
    var canvas = d3.select("#robot-regular").append("canvas")
        .attr("width", width)
        .attr("height", height);
    var context = canvas.node().getContext("2d");
    var regular = [];
    context.drawImage(image, 0, 0);
    imageData = context.getImageData(0, 0, width, height);

    canvas = d3.select("#robot-rejection").append("canvas")
        .attr("width", width)
        .attr("height", height);
    context = canvas.node().getContext("2d");
    context.drawImage(image, 0, 0);

    canvas = d3.select("#robot-voronoi").append("canvas")
        .attr("width", width)
        .attr("height", height);
    context = canvas.node().getContext("2d");
    context.drawImage(image, 0, 0);


    while(numPoints < total){
        var x = getRandomInt(0, width);
        var y = getRandomInt(0, height);
        var i = (y * width + x) << 2;
        var brightness = getBrightness(imageData.data[i + 0], imageData.data[i + 1], imageData.data[i + 2]);
        if (Math.random() >= brightness ) {
            sites.push([x, y]);
            numPoints++;
        }
    }



    for(var i = xStep / 2; i < width; i+=xStep){
        for(var j = yStep / 2; j < width; j+=yStep){
            regular.push([i, j]);
        }
    }

    var rejectionSites = sites.slice();;

    diagram = voronoi(sites);

    cells = diagram.polygons();
    links = diagram.links();

    polygon = svg.append("g")
      .attr("class", "polygons")
      .selectAll("path")
      .data(cells)
      .enter().append("path")
      .call(redrawPolygon);
    link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .call(redrawLink);
    site = svg.append("g")
      .attr("class", "sites")
      .selectAll("circle")
      .data(sites)
      .enter().append("circle")
      .call(redrawSite);



    var svgRegular = d3.select("#svg-regular");

    svgRegular.append("g")
      .attr("class", "sites")
      .selectAll("circle")
      .data(regular)
      .enter().append("circle")
      .call(redrawSite);

    var svgRejection = d3.select("#svg-rejection");

    svgRejection.append("g")
      .attr("class", "sites")
      .selectAll("circle")
      .data(sites)
      .enter().append("circle")
      .call(redrawSite);

    var svgVoronoi = d3.select("#svg-voronoi");

    for(var i=0; i < iterations; i++){
      rejectionSites = getCentroids(voronoi.polygons(rejectionSites));
    }


    svgVoronoi.append("g")
      .attr("class", "sites")
      .selectAll("circle")
      .data(rejectionSites)
      .enter().append("circle")
      .call(redrawSite);

}

function getColor(x,y){
    var i = (y * width + x) << 2;
    return d3.rgb(imageData.data[i + 0], imageData.data[i + 1], imageData.data[i + 2])
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function toRadians(deg) {
    return deg * Math.PI / 180
}

function getBrightness(red, green, blue){
    return (red / 255.0) * 0.3 + (green / 255.0) * 0.59 + (blue / 255.0) * 0.11; 
}

function getBrightnessFromXY(x,y){
    var i = (y * width + x) << 2;
    var bright = getBrightness(imageData.data[i + 0], imageData.data[i + 1], imageData.data[i + 2]); 
    return (1 - bright) > .5 ? 2: 3;
}

function getCentroids(polygons){
    var points = [];  
    polygons.forEach(function(polygon){
        var x = 0;
        var y = 0;
        polygon.forEach(function(point){
          x = x + point[0];
          y = y + point[1];
        })
        x = x / polygon.length;
        y = y / polygon.length;
        points.push([x,y]);
    });
  return points;
}

function getNorm(x1, y1, x2, y2){
    return Math.sqrt(getNormSquared(x1, y1, x2, y2));
}

function getNormSquared(x1, y1, x2, y2){
    return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)
}



function getDifference(pointsA, pointsB){
  var totalDiff = 0;
  for(var i = 0; i < pointsA.length; i++){
    totalDiff = totalDiff + getNorm(pointsA[i][0], pointsA[i][1], pointsB[i][0], pointsB[i][1]);
  }
  return totalDiff;
}



function step() {
    var centroids = getCentroids(voronoi.polygons(sites));
    sites = centroids;
    diagram = voronoi(sites);
    cells = diagram.polygons();
    links = diagram.links();
    redraw();
}


function redraw(){
    polygon = polygon.data(cells).call(redrawPolygon);
    link = link.data(links) 
    link.exit().remove();
    link = link.enter()
            .append("line")
            .merge(link)
            .call(redrawLink);
    site = site.data(sites).call(redrawSite);
}


function redrawPolygon(polygon){
    polygon
        .attr("d", function(d){ return d ? "M" + d.join("L") + "Z" : null;})
        .style("display", function(d) { return showGrid ? "inline" : "none";});
}

function redrawLink(link){
    link
        .attr("x1", function(d){ return d.source[0];})
        .attr("y1", function(d){ return d.source[1];})
        .attr("x2", function(d){ return d.target[0];})
        .attr("y2", function(d){ return d.target[1];})
        .style("display", function(d) { return showGrid ? "inline" : "none";});
}

function redrawSite(site){
    site
        .attr("cx", function(d){ return d[0];})
        .attr("cy", function(d){ return d[1];})
        .attr('r', function(d){ return getBrightnessFromXY(parseInt(d[0]),parseInt(d[1]))})
        .style("fill", function(d){ return  getColor(parseInt(d[0]),parseInt(d[1]));})
        .style("stroke", function(d){ return  getColor(parseInt(d[0]),parseInt(d[1]));});
}