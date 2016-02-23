// Format for segments - a: Start, b: End of eachsegment
var polySegments = [];

var height, width, path, svg, mousepos, updateScreen = true;

function init() {
    mousepos = [width / 2, height / 2];
    height = 500, width = 600;

    svg = d3.select("body")
        .append("svg")
        .attr("viewBox", "0 0 " + width + " " + height)
        .on("mousemove", mousemoved);
    
    var input = getInput();
    var data = input[1];

    var xs = [];
    var ys = [];

    data.forEach( function(element, index, callback) {
        xs.push(parseInt(element[0]));
        ys.push(parseInt(element[1]));
    });

    var scaleX = d3.scale.linear()
        .domain([d3.min(xs)-2,d3.max(xs)+2])
        .range([0, 600]);

    var scaleY = d3.scale.linear()
        .domain([d3.min(ys)-2,d3.max(ys)+2])
        .range([500,0]);

    var coords = [];

    data.forEach( function(element, index, callback) {
        coords.push([scaleX(element[0]),scaleY(element[1])].join(","));
        callback[index] = [scaleX(element[0]),scaleY(element[1])];
    });
    coords = coords.join(" ");

    createGallery(coords);
    createSegments(data);
    console.log(polySegments);
    drawLoop();
}

function mousemoved() {
    var d = d3.mouse(this);
    mousepos = {
        'x' : d[0],
        'y' : d[1]
    }
    updateScreen = true;
}

function drawLoop() {
    requestAnimationFrame(drawLoop);
    if(updateScreen == true) {
        draw();
        updateScreen = false;
    }
}

function draw() {
    svg.selectAll(".inter").remove();
    svg.selectAll(".intersects").remove();
    svg.append("circle")
        .attr("cx", mousepos.x)
        .attr("cy", mousepos.y)
        .attr("r",1)
        .classed("inter", true);

    var points = (function(segs) {
        var u = [];
        segs.forEach( function(element, index) {
            u.push(element.a,element.b);
        });
        return u;
    }) (polySegments);

    console.log(points);
    debugger;

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

    console.log(uniquePoints);
    debugger;

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
        for(j = 0; j < polySegments.length; i++) {
            var intersect = getIntersection(ray,polySegments[i]);
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

    console.log(intersects);
    debugger;
    
    createPolygon(intersects);
    intersects.forEach( function(element, index, callback) {
        svg.append("line").classed("intersects", true)
            .attr("x1", mousepos.x)
            .attr("y1", mousepos.y)
            .attr("x2", element.x)
            .attr("y2", element.y)
            .attr("stroke", "lightgreen")
            .attr("stroke-width", 2);
    });

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

function createPolygon(points) {

    points.forEach( function(element, index, callback) {
        callback[index] = [element.x,element.y].join(",");
    });
    points = points.join(" ");

    svg.selectAll("intersects").data([points]).enter()
        .append("polygon").classed("intersects", true)
        .attr("points", points)
        .attr("stroke", "green")
        .attr("fill", "green")
        .attr("stroke-width",1);
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
        {a:{x:0,y:0}, b:{x:600,y:0}},

        {a:{x:600,y:0}, b:{x:600,y:500}},

        {a:{x:600,y:500}, b:{x:0,y:500}},

        {a:{x:0,y:500}, b:{x:0,y:0}}
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
    for(i = 0; i <= data.length; i++){
        polySegments.push({
            a: data[i % data.length],
            b: data[(i + 1) % data.length]
        });
    }
}

function getIntersection(ray, segment) {

    console.log(ray);
    console.log(segment);
    debugger;
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

    if(expr1 < 0) {
        return null;
    } else if (expr2 < 0 || expr2 > 1){
        return null;
    }

    return {
        'x' : raypx + raydx * expr1,
        'y' : raypy + raydy * expr1,
        'expr' : expr1
    };
}

