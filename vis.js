
var Data = "1: (0, 0), (2, 0), (2, 2)";

function init() {
	var stage = new createjs.Stage("demoCanvas");
	var poly = new createjs.Shape();
	Data = Data.replace(/ /g,"");
	Data = Data.split(':');
	Data = Data.replace( /(\(([\d]+,[\d]+)\),)+/ , '($1,$2)');
	console.log(Data);
	stage.update();
}

function readTextFile(file)
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
                console.log(allText);
                return allText;
            }
        }
    }
    rawFile.send(null);
}