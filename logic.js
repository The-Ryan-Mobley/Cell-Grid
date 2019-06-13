var canvas = document.getElementById("canvas"); //gets elements of canvas
var my_context = canvas.getContext('2d');
my_context.strokeStyle = "black"; // Draws the canvas border
my_context.fillStyle = "#f2f2f2";

class cell {
    constructor(x, y) {                 //cell is drawn along xpos and ypos. active determines if the cell
        this.xpos = x;                  //is drawn as a filled in square for true, and blank for false
        this.ypos = y;                  //neighbors checks for adjacent active cells, decides if cells populate at end of the generation
        this.active = false;            //life checks if the cell has already been active, and then must stay inactive for a set amount time
        this.neighbors = 0;
        this.life = 0;
    }
    coinflip() { //decides if cell starts as either active or inactive
        let activator = Math.floor(Math.random() * 100);
        if (activator >= 75) {
            this.active = true;
        }
    }
    drawcell(ctx) { //draw function for the cell, based on active and inactive
        if (this.active == true) {

            ctx.fillStyle = "#2ba81a"; //"#f97509"
            ctx.fillRect(this.xpos, this.ypos, 9, 9);
        } else {
            ctx.fillStyle = "#f2f2f2"; //""#f2f2f2""
            ctx.fillRect(this.xpos, this.ypos, 9, 9);
        }
    }
    neighborcheck(x, y) {                                   //checks for active neighbors based on pixel distance
        let xd = x - this.xpos;
        let yd = y - this.ypos;
        xd *= xd;
        yd *= yd;
        let dis = Math.sqrt(xd + yd);

        if (dis <= 14.5) {
            this.neighbors++;
        }
    }
    population() {                           //checks if cell has enough neighbors to stay active, and checks how long the cell has been alive
        if (this.neighbors >= 5) {
            this.active = true;
        } else {
            this.active = false;
        }
        if(this.life > 1){
            this.active = false;

        }


    }
    newcell(x, y) {                                       //checks distance of active cells
        let percentile = Math.floor(Math.random() * 100); //(add extra varible to holld active 
        let xd = x - this.xpos;                           //to combine the two distance functions)
        let yd = y - this.ypos;
        xd *= xd;
        yd *= yd;
        let dis = Math.sqrt(xd + yd);


        if ((dis <= 14.5) && (percentile >= 65)) {
            this.active = true;

        }
    }

}

var cellarray = [];

function creategrid() {
    let xvalue = 0;
    let yvalue = 0;
    for (var x = 0; x <= 2547; x++) {

        if ((x + 1) % 51 == 0) {
            yvalue += 10;
            xvalue = 0;
        }

        cellarray[x] = new cell(xvalue, yvalue);
        cellarray[x].coinflip();
        cellarray[x].drawcell(my_context);

        xvalue += 10;
    }
}

function getneighborhood() { //nested loops causing performance issues
    let cl = cellarray.length;

    for (let i = 0; i < cl; i++) {
        if (cellarray[i].active == true) {
            for (let j = 0; j < cl; j++) {
                if (cellarray[j].active == true) {
                    cellarray[i].neighborcheck(cellarray[j].xpos, cellarray[j].ypos);
                }
            }
        }

    }
}

function automation() {
    let cl = cellarray.length;
    for (let i = 0; i < cl; i++) {

        if (cellarray[i].active == false) {
            for (let j = 0; j < cl; j++) {
                if (cellarray[j].neighbors >= 5) {
                    cellarray[i].newcell(cellarray[j].xpos, cellarray[j].ypos);


                }
            }

        }
    }
}

function newgeneration() {
    for (let i = 0; i < 2547; i++) {

        cellarray[i].neighbors = 0;
        if (cellarray[i].life >= 5) {
            cellarray[i].life = 0;
        }
    }
}

function action() {
    for (let i = 0; i < cellarray.length; i++) {


        cellarray[i].population();
        cellarray[i].life++;

    }
    automation();
    for (let j = 0; j < cellarray.length; j++) {
        cellarray[j].drawcell(my_context);

    }
}

creategrid();

setInterval(function () {
    getneighborhood();
    action();
    newgeneration();
}, 100);