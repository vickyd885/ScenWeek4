

function init() {
	var Text, newText = [];
	var stage = new createjs.Stage("demoCanvas");
	var poly = new createjs.Shape();
	readTextFile("guards.pol",function(data){
		Text = data;
	});

	Text = Text.replace(/ /g,"").split('\n');
	Text.forEach( function(element, index, callback1) {
		callback1[index] = element.replace(/\d:/,'').replace(/\(([\d]+),([\d]+)\)/g,'$1H$2').split(',');
		callback1[index].forEach( function(element1, index, callback2) {
			callback2[index] = element1.split('H');
		});
	});
	console.log(Text[0]);
    addNodes(stage,Text[0]);
	stage.update();
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

function addNodes(stage,ideal_list){
  var polygon = new createjs.Shape();
  polygon.graphics.beginStroke("black");
  var scaled = ideal_list.forEach(function(element,index,callback){
    callback[index][0] = element[0]*100;
    callback[index][1] = element[1]*100;
  });
  polygon.graphics.beginFill("Red").drawPolygon(200,200,ideal_list);
  //polygon.graphics.lineTo(60, 60).lineTo(30, 90).lineTo(0, 60);
  stage.addChild(polygon)
}


// library function to draw polygon!
(createjs.Graphics.Polygon = function(x, y, points) {
    this.x = x;
    this.y = y;
    this.points = points;
}).prototype.exec = function(ctx) {
    var start = this.points[0];
    ctx.moveTo(start.x, start.y);
    this.points.slice(1).forEach(function(point) {
        ctx.lineTo(point.x, point.y);
    });
    ctx.lineTo(start.x, start.y);
}
createjs.Graphics.prototype.drawPolygon = function(x, y, args) {
    var points = [];
    if (Array.isArray(args)) {
        args.forEach(function(point) {
            point = Array.isArray(point) ? {x:point[0], y:point[1]} : point;
            points.push(point);
        });
    } else {
        args = Array.prototype.slice.call(arguments).slice(2);
        var x = null;
        args.forEach(function(val) {
            if (x == null) {
                x = val;
            } else {
                points.push({x: x, y: val});
                x = null;
            }
        });
    }
    return this.append(new createjs.Graphics.Polygon(x, y, points));
}