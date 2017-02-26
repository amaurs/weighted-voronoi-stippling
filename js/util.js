function callback(){
  context.drawImage(image, 0, 0);
  imageData = context.getImageData(0, 0, width, height);

  while(numPoints < total){
//  for(var x=0; x < width; x++){
//    for(var y=0; y < height; y++){
      x = getRandomInt(0, width);
      y = getRandomInt(0, height);

      i = (y * width + x) << 2;
      //console.log(d3.rgb(image.data[i + 0], image.data[i + 1], image.data[i + 2]));
      var brightness = getBrightness(imageData.data[i + 0], imageData.data[i + 1], imageData.data[i + 2]);


      if (Math.random() >= brightness ) {
          myPoints.push([x, y]);
          /**
          context.beginPath();
          context.moveTo(x,y);
          context.arc(x,y,5,0,toRadians(360));
          context.lineTo(x,y);
          context.closePath();
          context.fill();

          **/
          numPoints++;
      } 
//    }
//  }
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
    var bright = (imageData.data[i + 0] / 255.0) * 0.3 + (imageData.data[i + 1] / 255.0) * 0.59 + (imageData.data[i + 2] / 255.0) * 0.11; 



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

function getDifference(pointsA, pointsB){
  var sum = 0;
  for(var i = 0; i < pointsA.length; i++){
    sum = sum + Math.sqrt((pointsA[i][0]-pointsB[i][0])*(pointsA[i][0]-pointsB[i][0]) + (pointsA[i][1]-pointsB[i][1])*(pointsA[i][1]-pointsB[i][1]));
  }
  return sum;
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

function redrawPolygon(polygon) {
  polygon
      .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; })
      .style("stroke", function(d) { return lines?"black":"white"; });
}

function redrawLink(link) {
  link
      .attr("x1", function(d) { return d.source[0]; })
      .attr("y1", function(d) { return d.source[1]; })
      .attr("x2", function(d) { return d.target[0]; })
      .attr("y2", function(d) { return d.target[1]; })
      .style("stroke", function(d) { return lines?"black":"white"; });
}

function redrawSite(site) {
  site
      .attr("cx", function(d) { return d[0]; })
      .attr("cy", function(d) { return d[1]; })
      .attr('r', function(d) { return getBrightnessFromXY(parseInt(d[0]),parseInt(d[1]));})
      .style("fill", function(d) { return  getColor(parseInt(d[0]),parseInt(d[1])); })
      .style("stroke", function(d) { return  getColor(parseInt(d[0]),parseInt(d[1])); });
}