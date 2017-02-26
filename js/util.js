/**
Returns a one dimensional array representing the image.
**/
function getImageData(context, image, width, height){
    context.drawImage(image, 0, 0); 
    return context.getImageData(0, 0, width, height);
}

function callback(){
    
    imageData = getImageData(context, image, width, height);
    while(numPoints < total){
        x = getRandomInt(0, width);
        y = getRandomInt(0, height);
        i = (y * width + x) << 2;
        var brightness = getBrightness(imageData.data[i + 0], imageData.data[i + 1], imageData.data[i + 2]);
        if (Math.random() >= brightness ) {
            myPoints.push([x, y]);
            numPoints++;
        }
    }
    sites = myPoints;
    polygon = svg.append("g")
      .attr("class", "polygons")
      .selectAll("path")
      .data(voronoi.polygons(sites))
      .enter().append("path")
      .call(redrawPolygon);
    link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(voronoi.links(sites))
      .enter().append("line")
      .call(redrawLink);
    site = svg.append("g")
      .attr("class", "sites")
      .selectAll("circle")
      .data(sites)
      .enter().append("circle")
      .attr("r", 2.5)
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

function moved() {
    sites[0] = d3.mouse(this);
    redraw();
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

function redraw() {
    var diagram = voronoi(sites);
    var newPoints = getCentroids(diagram.polygons());
    sites = newPoints;
    polygon = polygon.data(diagram.polygons()).call(redrawPolygon);
    link = link.data(diagram.links()), link.exit().remove();
    link = link.enter().append("line").merge(link).call(redrawLink);
    site = site.data(sites).call(redrawSite);
}

function redrawPolygon(polygon){
    polygon
        .attr("d", function(d){ return d ? "M" + d.join("L") + "Z" : null;})
        .style("stroke", function(d) { return lines ? "black" : "white";});
}

function redrawLink(link){
    link
        .attr("x1", function(d){ return d.source[0];})
        .attr("y1", function(d){ return d.source[1];})
        .attr("x2", function(d){ return d.target[0];})
        .attr("y2", function(d){ return d.target[1];})
        .style("stroke", function(d) { return lines ? "black" : "white";});
}

function redrawSite(site){
    site
        .attr("cx", function(d){ return d[0];})
        .attr("cy", function(d){ return d[1];})
        .attr('r', function(d){ return getBrightnessFromXY(parseInt(d[0]),parseInt(d[1]))})
        .style("fill", function(d){ return  getColor(parseInt(d[0]),parseInt(d[1]));})
        .style("stroke", function(d){ return  getColor(parseInt(d[0]),parseInt(d[1]));});
}