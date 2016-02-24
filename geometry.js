
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

    if(raydx === 0) expr2 = 0;


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

