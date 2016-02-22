
var Data = "1: (023231, 055), (211, 02323), (21515, 25151)";

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
	console.log(Text);
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
