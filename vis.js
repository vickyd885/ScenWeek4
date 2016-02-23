
function init() {

    var input = getInput();
    var data = input[18 ];
    createPolygon(data);
}

function createPolygon(points) {

    var svg = d3.select("body").append("svg").attr("width", "100%").attr("height", "100%");

    var xs = [];
    var ys = [];

    points.forEach( function(element, index, callback) {
        xs.push(parseInt(element[0]));
        ys.push(parseInt(element[1]));
    });

    console.log(xs);
    console.log(ys);

    var scaleX = d3.scale.linear()
        .domain([d3.min(xs)-2,d3.max(xs)+2])
        .range([0, 600]);

    var scaleY = d3.scale.linear()
        .domain([d3.min(ys)-2,d3.max(ys)+2])
        .range([500,0]);

    var coords = [];

    points.forEach( function(element, index) {
        coords.push([scaleX(element[0]),scaleY(element[1])].join(","));
    });
    coords = coords.join(" ");

    svg.append("polygon")
        .attr("points", coords)
        .attr("stroke", "white")
        .attr("stroke-width", 4);
}

function getInput(){
    readTextFile("guards.pol",function(data){
        Text = data;
    });

    Text = Text.replace(/ /g,"").replace(/[\d]+:/g,'H').split('H');
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

