function getInput(){
    readTextFile("guards.pol",function(data){
        Text = data;
    });
    Text = Text.replace(/ /g,"").replace(/\d:/g,'H').split('H');
    Text.shift();
    Text.forEach( function(element, index, callback1) {
        callback1[index] = element.replace(/\(([\d-.]+),([\d-.]+)\)/g,'$1H$2').split(',');
        callback1[index].forEach( function(element1, index, callback2) {
            callback2[index] = element1.split('H');
        });
    });
    return Text[10];
}

function prepString(array){
    var string = '';
    
    if(isNaN(array[array.length-1][1]*10)){
        var replaced = array[array.length-1][1].split('\n')
        array[array.length-1][1] = replaced[0];
    }
    //console.log(replaced)
    for(var i = 0; i < array.length;i++){
        //console.log('adding', array[i][0],array[i][1]);
        string += array[i][0]*10 + ',' + array[i][1]*10
        string +=  ' ';
    }
    return string;
}

function renderSVG(string){
    console.log(string);
    var svg = document.getElementById('main');
    svg.setAttribute("points",string);
    svg.setAttribute("x",100);
    svg.setAttribute("y",100);
    svg.setAttribute("width","100%");
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

function getCurrentWidthHeight(){
    var svg = document.getElementById('svgSet');
    var list = svg.getAttributeNode('viewBox').textContent.split(" ")
    console.log(list);
    return list;
}


$( "#increase" ).click(function() {
  var current = getCurrentWidthHeight();
  var svg = document.getElementById('svgSet');
  svg.setAttribute('viewBox', '0 0 ' + parseInt(current[2])+10 + ' ' + parseInt(current[3])+10 );
  console.log(getCurrentWidthHeight());
});

$( "#decrease" ).click(function() {
  var svg = document.getElementById('svgSet');
  svg.setAttribute('viewBox', '0 0 ' + parseInt(current[2])-10 + ' ' + parseInt(current[3])-10);
});




