// Format for segments - a: Start, b: End of eachsegment
var polySegments = [];
var boundaries = [];

var guards = [];
var updateScreen = false;
var height, width, svg;

var scaleX, scaleY;

function init() {
    height = 666.7, width = 1000;
    var current = 7;
    svg = d3.select("body")
    .append("svg")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("preserveAspectRatio", "xMidYMid meet");
    // .on("mousemove", mousemoved);

    var input = getInput();
    var data = input[current];

    var Text;

    readTextFile("check.pol", function (data) {
        Text = data;
    });
    Text = Text.replace(/ /g, "").replace(/[\n]?[\d]+:/g, 'H').split('H');
    Text.shift();
    var a = [], b = [];
    Text.forEach(function (element, index, callback1) {
        a.push(element.split(";"));
    });

    a.forEach(function (element, index, callback1) {
        element.forEach( function(element2, index2, callback2) {
            callback2[index2] = element2.replace(/\(([\d-.]+),([\d-.]+)\)/g, '$1H$2').split(',');
        });
    });

    a.forEach(function (element, index, callback1) {
        element.forEach( function(element2, index2, callback2) {
            element2.forEach( function(element3, index3, callback3) {
                callback3[index3] = element3.split("H");
            });
        });
    });

    var d = a[current];
    data = d[0];
    guards = d[1];
    data = scaleData(data);

    createBoundaries(height, width);
    createGallery(polygonConvert(data));
    createSegments(data);       
    drawLoop();
    addGuards(data);
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

        console.log(data, inPoly);

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
            // if(lineSegs.length > 0) {
            //     lineSegs.forEach( function(element, index) {
            //         if (Math.abs(unique.angle) > 0) {
            //             if(uniquePoints[i] === element.a) {
            //                 boundaryElems.push(element.a);
            //             } else if (uniquePoints[i] === element.b) {
            //                 boundaryElems.push(element.b);
            //             }
            //         }
            //     });
            // }
        }

        uniqueAngles = uniqueAngles.sort(function(a,b){
            return a - b;
        });

        // if(boundaryElems.length > 0) {
        //     var boundaryElems = boundaryElems.sort(function(a,b) {
        //         return a.angle - b.angle;
        //     });
        // }

        // console.log(boundaryElems, uniqueAngles);

        var intersects = [];
        for (i = 0; i < uniqueAngles.length; i++) {
            var angle = uniqueAngles[i];
                // if(lineSegs.length > 0 ) {
            //     if(boundaryElems[0].angle < angle && angle > boundaryElems[boundaryElems.length - 1].angle) {
            //         intersects.push({
            //             'x' : guard.x,
            //             'y' : guard.y,
            //             'angle' : angle
            //         });
            //     } else if (angle === boundaryElems[0].angle || angle === boundaryElems[boundaryElems.length - 1].angle){
            //         var x = boundaryElems[0].angle === angle ? x = boundaryElems[0].x : boundaryElems[boundaryElems.length-1].x;
            //         var y = boundaryElems[boundaryElems.length-1].angle === angle ? y = boundaryElems[boundaryElems.length-1].y : boundaryElems[0].y;

            //         intersects.push({
            //             'x' : x,
            //             'y' : y,
            //             'angle' : angle 
            //         });

            //         continue;
            //     }
            // }
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

        var newIntersects = [];
        var polypoints = [],
        polyCoords = [];

        data.forEach( function(element1, index1, call1) {
            intersects.forEach( function(element2, index2, call2) {
                if(Math.abs(element1[0] - element2.x) < 0.1 ) {
                    call2[index2].x = element1[0]; 
                }
                if (Math.abs(element1[1] - element2.y) < 0.1 ) {
                    call2[index2].y = element1[1];
                }
            });
        });

        intersects.forEach( function(element, index) {
            var midx = (guard.x  + element.x) / 2;
            var midy = (guard.y + element.y) / 2;
            var q1x = midx/2, q1y = midy/2;
            var q2x = (midx/2) * 3, q2y = (midy/2) * 3;

            if(pointInPolygon(data,midx,midy)) {
                newIntersects.push(element);
            }
        });

        newIntersects.push({
            'x' : guard.x,
            'y' : guard.y,
            'angle' : (Math.atan2(0,0))
        });

        newIntersects = newIntersects.map(function (d) {
            if(d.angle < (-1 * (Math.PI / 2)) ){
                d.angle += Math.PI;
            } else if(d.angle > (Math.PI / 2)){
                d.angle -= Math.PI;
            }
            return d;
        });

        newIntersects = newIntersects.sort(function(a,b){
            return b.angle - a.angle;
        });

        newIntersects.forEach(function (element, index) {
            if(Math.abs(element.x -  guard.x) < 0.1 && Math.abs(element.y - guard.y) < 0.1) {
                console.log(element.angle,element.x,element.y);                
            }
            polyCoords.push([element.x, element.y]);
        });


        var poly1 = d3.geom.polygon(polyCoords);



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
                points: polygonConvert(polyCoords),
                fill: "#70db83"
            })
            .attr("stroke-width",1);
            // newIntersects.forEach(function (element, index, callback) {
            //     svg.append("line").classed("intersects", true)
            //     .attr("x1", guard.x)
            //     .attr("y1", guard.y)
            //     .attr("x2", element.x)
            //     .attr("y2", element.y)
            //     .attr("stroke", "darkgreen")
            //     .attr("stroke-width", 1);
            //     svg.append("circle").classed("intersects", true)
            //     .attr({
            //         fill : "black",
            //         r : 10,
            //         cx : element.x,
            //         cy : element.y,
            //         stroke : "#EEE"
            //     });
            // });
        // }

            d3.selectAll("svg").append("circle").classed("intersects", true)
                .attr({
                    fill : "white",
                    r : 10,
                    cx : guard.x,
                    cy : guard.y
                });
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