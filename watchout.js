// start slingin' some d3 here.

var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 3,
  // padding: 20
}

var board = d3.select('.container').append('svg:svg')
  .attr('height', gameOptions.height)
  .attr('width', gameOptions.width)
  .style('border', '1px solid red');


//Good Guy Setup
var guyID = 0;
var Guy = function(x, y, r) {
  this.x = x;
  this.y = y;
  this.dx = 0;
  this.dy = 0
  this.r = r;
  this.id = guyID++;
};

//Create GoodGuy and Badguy subclasses

var GoodGuy = function(x, y, r){
  Guy.call(this, x, y, r);
  this.color = 'green';
  this.good = true;
};
Guy.prototype = {};

GoodGuy.prototype = Object(Guy.prototype);
GoodGuy.prototype.constructor = GoodGuy;


var BadGuy = function(x, y, r){
  Guy.call(this, x, y, r);
  this.color = 'red';
  this.good = false;
};

BadGuy.prototype = Object(Guy.prototype);
BadGuy.prototype.constructor = BadGuy;

//Update Cycle
var randomNumberBelow = function(limit) {
  return Math.random() * limit;
};
var setRandomXY = function (guys) {
  for (var i = 0; i < guys.length; i++) {
    guys[i].x = randomNumberBelow(gameOptions.width);
    guys[i].y = randomNumberBelow(gameOptions.height);
  }
};

var update = function () {
  setRandomXY(allGuys.slice(1));  //exclude hero
  board.selectAll('circle')
    .data(  allGuys, function (d) { return d.id; })
    .transition()
    .duration(1000)
    .attr('cx', function (d) { return d.x; })
    .attr('cy', function (d) { return d.y; });

  setTimeout(update, 1000);
};

var drag = d3.behavior.drag()
  .on("drag", function(d,i) {
    d.dx += d3.event.dx;
    d.dy += d3.event.dy;
    d3.select(this).attr("transform", function(d,i){
        return "translate("+ [ d.dx,d.dy ] + ")"
    })
  });


//create function that generates transformations of badguys
//array of transformation to every badguys x,y coords
//feed new info to d3 w/selectAll on '.badGuy'
//update location data based on newly passed in data
//animate transition (????)
//schedule next update

// Set up all players
var hero = new GoodGuy(gameOptions.width / 2, gameOptions.height / 2, 5);
var allGuys = [hero];

for (var i=0; i<gameOptions.nEnemies; i++){
  allGuys.push(new BadGuy(10*i, 10*i, 5));
}



//Kick-off Game
board.selectAll('circle')
  .data(allGuys, function (d) { return d.id; })
  .enter()
  .append('circle')
  .attr('class', function (d) {
    return d.good ? "goodGuy" : "badGuy";  //(d instanceof GoodGuy) ? "goodGuy" : "badGuy";
  })
  .attr('r', function (d) { return d.r; })
  .attr('cx', function (d) { return d.x; })
  .attr('cy', function (d) { return d.y; })
  .style('fill', function (d) {return d.color;})
  .call(drag);

update();
