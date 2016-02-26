// Format for segments - a: Start, b: End of eachsegment
var polySegments = [];

var height, width, path, svg, mousepos, updateScreen = false;

function init() {
    height = 666.7, width = 1000;
    svg = d3.select("body")
        .append("svg")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("preserveAspectRatio","xMidYMid meet")
        .on("mousemove", mousemoved);
    
    var input = getInput();
    var data = input[10];

    var xs = [];
    var ys = [];

    data.forEach( function(element, index, callback) {
        xs.push(parseInt(element[0]));
        ys.push(parseInt(element[1]));
    });

    var scaleX = d3.scale.linear()
        .domain([d3.min(xs)-2,d3.max(xs)+2])
        .range([0, width]);

    var scaleY = d3.scale.linear()
        .domain([d3.min(ys)-2,d3.max(ys)+2])
        .range([height,0]);

    var coords = [];

    data.forEach( function(element, index, callback) {
        coords.push([scaleX(element[0]),scaleY(element[1])].join(","));
        callback[index] = [scaleX(element[0]),scaleY(element[1])];
    });
    coords = coords.join(" ");

    createGallery(coords);
    createSegments(data);
    drawLoop();
}

function mousemoved() {
    var d = d3.mouse(this);
    mousepos = {
        'x' : d[0],
        'y' : d[1]
    };
    updateScreen = true;
}

window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;

function drawLoop() {
    requestAnimationFrame(drawLoop);
    if(updateScreen == true) {
        draw();
        updateScreen = false;
    }
}

function draw() {

    svg.selectAll(".intersects").remove();

    var points = (function(segs) {
        var u = [];
        segs.forEach( function(element, index) {
            u.push(element.a,element.b);
        });
        return u;
    }) (polySegments);

    var uniquePoints = (function(points){
        var set = {};
        return points.filter(function(p) {
            var k = p.x + "," + p.y;
            if(k in set){
                return false;
            } else {
                set[k] = true;
                return true;
            }
        });
    })(points);

    var uniqueAngles = [];

    for(i = 0; i < uniquePoints.length; i++) {
        var unique = uniquePoints[i];

        var angle = Math.atan2(unique.y-mousepos.y,unique.x-mousepos.x);
        unique.angle = angle;

        uniqueAngles.push(angle - 0.00001,angle,angle+0.00001);
    }

    var intersects = [];
    for(i = 0; i < uniqueAngles.length; i++) {
        var angle = uniqueAngles[i];
        var dx = Math.cos(angle);
        var dy = Math.sin(angle);

        var ray = {
            'a' : {
                'x' : mousepos.x,
                'y' : mousepos.y
            },
            'b' : {
                'x' : mousepos.x + dx,
                'y' : mousepos.y + dy
            }
        };

        var closestIntersect = null;
        for(j = 0; j < polySegments.length; j++) {
            var intersect = getIntersection(ray,polySegments[j]);
            if(!intersect) continue;
            if(!closestIntersect || intersect.param < closestIntersect.param) {
                closestIntersect = intersect;
            }
        }

        if(!closestIntersect) continue;
        closestIntersect.angle = angle;

        intersects.push(closestIntersect);
    }

    intersects = intersects.sort(function(a,b){
        return a.angle - b.angle;
    });

    var polypoints = [];

    intersects.forEach( function(element, index) {
        polypoints.push([element.x,element.y].join(","));
    });
    polypoints = polypoints.join(" ");

    svg.selectAll("intersects").data([polypoints]).enter()
        .append("polygon").classed("intersects", true)
        .attr("points", polypoints)
        .attr("stroke", "green")
        .attr("fill", "green")
        .attr("stroke-width",1);

    // intersects.forEach( function(element, index, callback) {
    //     svg.append("line").classed("intersects", true)
    //         .attr("x1", mousepos.x)
    //         .attr("y1", mousepos.y)
    //         .attr("x2", element.x)
    //         .attr("y2", element.y)
    //         .attr("stroke", "lightgreen")
    //         .attr("stroke-width", 2);
    // });

}

function createGallery(points) {

    svg.selectAll("polygon").data([points]).enter()
        .append("polygon")
        .classed("gallery", true)
        .attr("points", points)
        .attr("stroke", "#FA7291")
        .attr("fill", "#FA7291")
        .attr("stroke-width", 1);
}

function getInput(){
    readTextFile("guards.pol",function(data){
        Text = data;
    });

    Text = Text.replace(/ /g,"").replace(/[\n]?[\d]+:/g,'H').split('H');
    Text.shift();
    Text.forEach( function(element, index, callback1) {
        callback1[index] = element.replace(/\(([\d-.]+),([\d-.]+)\)/g,'$1H$2').split(',');
        callback1[index].forEach( function(element1, index, callback2) {
            callback2[index] = element1.split('H');
        });
    });
    return Text;
}

function readTextFile(file,callback)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                callback(allText);
            }
        }
    }
    rawFile.send(null);
}


// Creates the segments for the intersection calculation
function createSegments(data) {
    var boundaries = [
        {a:{x:0,y:0}, b:{x:width,y:0}},

        {a:{x:width,y:0}, b:{x:width,y:height}},

        {a:{x:width,y:height}, b:{x:0,y:height}},

        {a:{x:0,y:height}, b:{x:0,y:0}}
    ];

    boundaries.forEach( function(element, index) {
        polySegments.push(element);
    });
    data.forEach( function(element, index, callback) {
        callback[index] = {
            x: element[0],  
            y: element[1]
        };
    });
    for(i = 0; i < data.length; i++){
        polySegments.push({
            a: data[i % data.length],
            b: data[(i + 1) % data.length]
        });
    }
}

function getIntersection(ray, segment) {

    //  Parametric conversion (Ray)
    var raypx = ray.a.x, raypy = ray.a.y;
    var raydx = ray.b.x - ray.a.x, raydy = ray.b.y - ray.a.y;
    //  Parametric conversion (segment)
    var segpx = segment.a.x, segpy = segment.a.y;
    var segdx = segment.b.x - segment.a.x, segdy = segment.b.y - segment.a.y;


    var rayMagnitude = Math.sqrt(raydx * raydx + raydy * raydy);
    var segMagnitude = Math.sqrt(segdx * segdx + segdy * segdy);


    if ((raydx / rayMagnitude == segdx / segMagnitude) && (raydy / rayMagnitude == segdy / segMagnitude)) {
        return null;
    }

    var expr1 = (raydx * (segpy - raypy) + raydy * (raypx - segpx)) / (segdx * raydy - segdy * raydx);
    var expr2 = (segpx + segdx * expr1 - raypx) / raydx;

    if(expr2 < 0) {
        return null;
    }

    if (expr1 < 0 || expr1 > 1){
        return null;
    }

    return {
        'x' : raypx + raydx * expr2,
        'y' : raypy + raydy * expr2,
        'param' : expr2
    };
}

