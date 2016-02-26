// Format for segments - a: Start, b: End of eachsegment
var polySegments = [];
var boundaries = [];

var guards = [[2,2]];
var updateScreen = false;
var height, width, svg;

var scaleX, scaleY;

function init() {
    height = 666.7, width = 1000;
    svg = d3.select("body")
        .append("svg")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("preserveAspectRatio", "xMidYMid meet");
    // .on("mousemove", mousemoved);

    var input = getInput();
    var data = input[1];

    var Text;

    readTextFile("check.pol", function (data) {
        Text = data;
    });

    Text = Text.replace(/ /g, "").replace(/[\n]?[\d]+:/g, 'H').split('H');
    Text.shift();
    Text.forEach(function (element, index, callback1) {
        callback1[index] = element.split(";");
    });
    var a;
    Text.forEach(function (element, index, callback1) {
        callback1[index] = element.forEach(function(element2,index2,callback2) {
            a = element2.replace(/\(([\d-.]+),([\d-.]+)\)/g, '$1H$2').split(',');
            a.forEach(function (element3, index3, callback3) {
                callback3[index3] = element3.split('H');
            });            
        });
    });

    console.log(a);

    data = scaleData(data);

    createBoundaries(height, width);
    createGallery(polygonConvert(data));
    createSegments(data);

    var points = [], gallery = [];
    polySegments.forEach( function(element, index) {
        points.push([[element.a.x,element.a.y],[element.b.x,element.b.y]]);
    });

    data.forEach( function(element, index) {
        gallery.push([element.x,element.y]);
    });
    guards.forEach( function(element, index) {    
        var v = d3.geom.polygon(VisibilityPolygon.compute([scaleX(element[0]),scaleY(element[1])],points));
        console.log(v);
        var g = d3.geom.polygon(gallery);   

        svg.append("polygon").classed("intersects", true)
            .attr({
                points: v,
                stroke : "black",
                fill : "white",
            });
    });
    
    // drawLoop();
    // addGuards(data);
}

function createBoundaries(height, width) {
    boundaries = [
        {
            a: {
                x: 0,
                y: 0
            },
            b: {
                x: width,
                y: 0
            }
        },

        {
            a: {
                x: width,
                y: 0
            },
            b: {
                x: width,
                y: height
            }
        },

        {
            a: {
                x: width,
                y: height
            },
            b: {
                x: 0,
                y: height
            }
        },

        {
            a: {
                x: 0,
                y: height
            },
            b: {
                x: 0,
                y: 0
            }
        }
    ];
}

function addGuards(data) {

    guards.forEach(function (item, index) {

        var guard = {
            'x': scaleX(item[0]),
            'y': scaleY(item[1])
        };

        var lineSegs = onSegment(polySegments, guard.x, guard.y);
        var inPoly = pointInPolygon(data, guard.x, guard.y);

        console.log(lineSegs);

        // if(lineSegs.length < 1 && !inPoly){

        // }


        var points = (function (segs) {
            var u = [];
            segs.forEach(function (element, index) {
                u.push(element.a, element.b);
            });
            return u;
        })(polySegments);
        var uniquePoints = (function (points) {
            var set = {};
            return points.filter(function (p) {
                var k = p.x + "," + p.y;
                if (k in set) {
                    return false;
                } else {
                    set[k] = true;
                    return true;
                }
            });
        })(points);

        var uniqueAngles = [], boundaryElems = [];

        for (i = 0; i < uniquePoints.length; i++) {
            var unique = uniquePoints[i];
            var angle = Math.atan2(unique.y - guard.y, unique.x - guard.x);
            unique.angle = angle;
            uniqueAngles.push(angle - 0.00001, angle, angle + 0.00001);
            if(lineSegs.length > 0) {
                lineSegs.forEach( function(element, index) {
                    if (Math.abs(unique.angle) > 0) {
                        if(uniquePoints[i] === element.a) {
                            boundaryElems.push(element.a);
                        } else if (uniquePoints[i] === element.b) {
                            boundaryElems.push(element.b);
                        }
                    }
                });
            }
        }

        uniqueAngles = uniqueAngles.sort(function(a,b){
            return a - b;
        });

        if(boundaryElems.length > 0) {
            var boundaryElems = boundaryElems.sort(function(a,b) {
                return a.angle - b.angle;
            })
        }

        console.log(boundaryElems, uniqueAngles);

        var intersects = [];
        for (i = 0; i < uniqueAngles.length; i++) {
            var angle = uniqueAngles[i];
            if(lineSegs.length > 0 ) {
                // if(boundaryElems[0].angle < angle && angle > boundaryElems[boundaryElems.length - 1].angle) {
                //     intersects.push({
                //         'x' : guard.x,
                //         'y' : guard.y,
                //         'angle' : 
                //     });
                //     continue;
                // } else if (angle === boundaryElems[0].angle || angle === boundaryElems[boundaryElems.length - 1].angle){
                //     var x = boundaryElems[0].angle === angle ? x = boundaryElems[0].x : boundaryElems[boundaryElems.length-1].x;
                //     var y = boundaryElems[boundaryElems.length-1].angle === angle ? y = boundaryElems[boundaryElems.length-1].y : boundaryElems[0].y;
                //     intersects.push({
                //         'x' : x,
                //         'y' : y,
                //         'angle' : angle 
                //     });
                //     continue;
                // } 
            }
            var dx = Math.cos(angle);
            var dy = Math.sin(angle);
            var ray = {
                'a': {
                    'x': guard.x,
                    'y': guard.y
                },
                'b': {
                    'x': guard.x + dx,
                    'y': guard.y + dy
                }
            };

            var closestIntersect = null;
            for (j = 0; j < polySegments.length; j++) {
                var foundSeg = false;

                if (lineSegs.length > 0) {
                    lineSegs.forEach(function (element, index) {
                        if (polySegments[j] == element) {
                            foundSeg = true;
                        }
                    });
                }
                if(foundSeg) {
                    continue;
                }
                var intersect = getIntersection(ray, polySegments[j]);                    
                if (!intersect) continue;
                if (!closestIntersect || intersect.param < closestIntersect.param) {
                    closestIntersect = intersect;
                }
            }
            if (!closestIntersect) continue;
            closestIntersect.angle = angle;
            intersects.push(closestIntersect);
        }
        intersects = intersects.sort(function (a, b) {
            return a.angle - b.angle;
        });

        var polypoints = [],
            polyCoords = [];

        intersects.forEach(function (element, index) {
            polyCoords.push([element.x, element.y]);
        });

        var poly1 = d3.geom.polygon(polyCoords);

        data.forEach(function (element, index, callback) {
            callback[index] = [element.x, element.y];
        });


        data.forEach( function(element1, index1, call1) {
            polyCoords.forEach( function(element2, index2, call2) {
                if(Math.abs(element1[0] - element2[0]) < 0.000001 ) {
                    call2[index2][0] = element1[0]; 
                }
                if (Math.abs(element1[1] - element2[1]) < 0.000001 ) {
                    call2[index2][1] = element1[1];
                }
            });
        });

        // if (lineSegs.length > 0) {
        //     var gpoly = d3.geom.polygon(data);
        //     var interpoly = gpoly.clip(poly1.slice());

        //     d3.selectAll("svg").append("polygon").attr({
        //         points: interpoly,
        //         fill: "#70db83",
        //         stroke: "#70db83",
        //         strokeWidth: "#70db83"
        //     });
        //     interpoly.forEach(function (element, index) {
        //         svg.append("line").classed("intersects", true)
        //             .attr({
        //                 x1: guard.x,
        //                 y1: guard.y,
        //                 x2: element[0],
        //                 y2: element[1],
        //                 stroke: "darkgreen",
        //             }).attr("stroke-width", 1);
        //         svg.append("circle").classed("intersects", true)
        //             .attr({
        //                 fill : "black",
        //                 r : 10,
        //                 cx : element[0],
        //                 cy : element[1],
        //                 stroke : "#EEE"
        //             });

        //     });
        // } else {
            d3.selectAll("svg").append("polygon").classed("intersects", true)
                .attr({
                    points: poly1,
                    fill: "#70db83",
                    stroke: "black",
                })
                .attr("stroke-width",2);
            intersects.forEach(function (element, index, callback) {
                svg.append("line").classed("intersects", true)
                    .attr("x1", guard.x)
                    .attr("y1", guard.y)
                    .attr("x2", element.x)
                    .attr("y2", element.y)
                    .attr("stroke", "darkgreen")
                    .attr("stroke-width", 1);
                svg.append("circle").classed("intersects", true)
                    .attr({
                        fill : "black",
                        r : 10,
                        cx : element.x,
                        cy : element.y,
                        stroke : "#EEE"
                    });
            });

        // }

        svg.append("circle")
            .attr("fill", "#F5F5F5")
            .attr("r", 5)
            .attr("cx", guard.x)
            .attr("cy", guard.y)
            .attr("stroke", "black")
            .attr("stroke-width",1);

    });
}

function createGallery(points) {

    svg.selectAll(".gallery").data([points]).enter()
        .append("polygon")
        .classed("gallery", true)
        .attr("points", points)
        .attr("stroke", "#db7093")
        .attr("fill", "#db7093")
        .attr("stroke-width", 1);
}

function scaleData(points) {
    var xs = [];
    var ys = [];

    points.forEach(function (element, index, callback) {
        xs.push(parseInt(element[0]));
        ys.push(parseInt(element[1]));
    });

    scaleX = d3.scale.linear()
        .domain([d3.min(xs) - 2, d3.max(xs) + 2])
        .range([0, width]);

    scaleY = d3.scale.linear()
        .domain([d3.min(ys) - 2, d3.max(ys) + 2])
        .range([height, 0]);

    points.forEach(function (element, index, callback) {
        callback[index] = [scaleX(element[0]), scaleY(element[1])];
    });

    return points;
}

function polygonConvert(points) {
    var coords = [];

    points.forEach(function (element, index, callback) {
        coords.push([element[0], element[1]].join(","));
    });

    coords = coords.join(" ");

    return coords;

}

window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;

function drawLoop() {
    requestAnimationFrame(drawLoop);
    if (updateScreen == true) {
        draw();
        updateScreen = false;
    }
}

function getInput(path) {
    readTextFile("guards.pol", function (data) {
        Text = data;
    });

    Text = Text.replace(/ /g, "").replace(/[\n]?[\d]+:/g, 'H').split('H');
    Text.shift();
    Text.forEach(function (element, index, callback1) {
        callback1[index] = element.replace(/\(([\d-.]+),([\d-.]+)\)/g, '$1H$2').split(',');
        callback1[index].forEach(function (element1, index, callback2) {
            callback2[index] = element1.split('H');
        });
    });
    return Text;
}

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                callback(allText);
            }
        }
    }
    rawFile.send(null);
}