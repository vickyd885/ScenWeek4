
function getIntersection(ray, segment) {

    if(isNaN(ray.a.x) || isNaN(ray.a.y) || isNaN(ray.b.x) || isNaN(ray.b.y)) {
        console.log(ray);
        console.log(segment);
        debugger;
    }
    if(isNaN(segment.a.x) || isNaN(segment.a.y) || isNaN(segment.b.x) || isNaN(segment.b.y)) {
        console.log(ray);
        console.log(segment);
        debugger;
    }

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

    if(raydx == 0) expr2 = 0;

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

function createSegments(data) {

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
            b: data[(i + 1) % data.length],
            angle: 0
        });
    }
}

// takes parameters of the polygon in array form
function pointInPolygon(poly, rayx, rayy) {

    var x, vertx, nextx, y, verty, nexty;
    var x1;
    var y1;
    var intersections = 0;

    for ( var i = 0; i < poly.length; i++ )
    {
        vertx = poly[i].x;
        verty = poly[i].y;

        if(i<poly.length-1)
        {
            nextx = poly[i + 1].x;
            nexty = poly[i + 1].y;
        }
        else
        {
            nextx = poly[0].x;
            nexty = poly[0].y; 
        }

        if ( vertx < nextx){
            x1 = vertx;
            x2 = nextx;
        } else {
            x1 = nextx;
            x2 = vertx;
        }

        if ( rayx > x1 && rayx <= x2 && ( rayy < verty || rayy <= nexty ) ) {
            var eps = 0.000000001;

            var dx = nextx - vertx;
            var dy = nexty - verty;
            var k;

            if ( Math.abs(dx) < eps ){
                k = Infinity;
            } else {
                k = dy/dx;
            }

            var m = verty - k * vertx;

            y2 = k * rayx + m;
            if ( rayy <= y2 ){
                intersections++;
            }
        }
    }

    var intersectFlag = (intersections/2) + "";

    if(intersectFlag.indexOf(".")!=-1) {
        return true;
    } else {
        return false;
    }
}

// Check if point is on segment
function onSegment(segments, gx, gy) {

    var lineSegments = [];

    segments.forEach( function(element, index) {
        var x1 = element.a.x, x2 = element.b.x;
        var y1 = element.a.y, y2 = element.b.y;
        var dx1 = gx - x1, dy1 = gy - y1;
        var dx2 = x2 - x1, dy2 = y2 - y1;


        var crossProduct = dx1 * dy2 - dy1 * dx2;

        if(crossProduct == false) {
            if (Math.abs(dx2) >= Math.abs(dy2)) {
                if(dx2 > 0) {
                    if (x1 <= gx && gx <= x2) {
                        lineSegments.push(element);
                    } 
                } else {
                    if (x2 <= gx && gx <= x1) {
                        lineSegments.push(element);
                    }
                }
            } else {
                if(dy2 > 0) {               
                    if(y1 <= gy && gy <= y2) {
                        lineSegments.push(element);
                    }
                }else {
                    if(y2 <= gy && gy <= y1) {
                        lineSegments.push(element);
                    }
                }   
            } 
        }
    });
    return lineSegments;

}
