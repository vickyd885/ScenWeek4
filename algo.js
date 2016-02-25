//var triangles = earcut([10,0, 0,50, 60,60, 70,10]); // returns [1,0,3, 3,2,1]


//var input = [5, 0, 2, 0.5, 0, 5, 0.2, 3, -2, -2, -0.5, 0]; // case 5
// '0,50 10,0 70,10'
var visitedNodes = [];
function scaleArray(array){
	for(var i = 0; i < array.length;i++)
		array[i] = array[i]*10;
	return array;
}


function getTriangulationPoints (array,indexes) {
	// body...
	console.log(array,indexes);

	var coords = [];
	for(var i = 0; i < indexes.length;i++){
		coords.push([array[2 * indexes[i]], array[2 * indexes[i] + 1]]);
		//console.log([array[2 * indexes[i]], array[2 * indexes[i] + 1]]);
		console.log(i, coords);
	}
	console.log(coords);
	var newcoords = [];
	var j = 0;
	while(j != coords.length ){
		newcoords.push([[coords[j],null], [coords[(j+1)],null], [coords[(j+2)],null] ]);
		j += 3
	}
	console.log(newcoords);
	return newcoords;
}

function toString(array){
	//console.log(array);
	var points = '';
	for(var i = 0; i <array.length;i++ ){
		for(var j = 0; j <array[i].length;j++){
			console.log(array[i][j]);
			points += array[i][j][0][0] + ',';
			points += array[i][j][0][1] + ' ';
		}
	}
	console.log(points);
	return points;
}

function makeGraph(nodes){ // each array has n polygons which has 3 arrays, consisting of [array[2], colour]
	console.log(nodes[0],nodes[1]);
	// assign the first set in order

	var currentNode = 0;
	nodes[currentNode][0][1] = 'red';
	nodes[currentNode][1][1] = 'yellow';
	nodes[currentNode][2][1] = 'blue';
	visitedNodes.push(nodes[currentNode]);
	console.log(nodes[0][2][1]);
	//
	targetNewNode(nodes);
}

function targetNewNode(nodes){
	var currentNode = 0;
	var totalNumberOfNodes = nodes.length;
	while(totalNumberOfNodes != 1){
		//console.log("here");
		console.log(nodes[0],nodes[1]);
		//console.log("considering",nodes[currentNode][2][0],nodes[(currentNode+1)][0][0]);
		var matchingIndexes = findNewNode(nodes[currentNode],nodes[(currentNode+1)]);
			//console.log("found the next node");
		var possibleColours = checkForAdjacentNodes(nodes,nodes[(currentNode+1)][matchingIndexes[1]][0],(currentNode+1),matchingIndexes[1]);
			//console.log(nodes[1][0][1]); 
		assignColour(possibleColours,nodes,(currentNode+1),matchingIndexes[1]);
		console.log(nodes);
		visitedNodes.push(nodes[(currentNode+1)]);

		currentNode++;
		totalNumberOfNodes -=1;
	}
}

function findNewNode(setA,setB){
	console.log(setA,setB);
	for(var i = 0; i < setA.length;i++){
		for(var j = 0; j < setA[i][0].length;j++){
			console.log(setA[i][j],setB[i][j]);
			if( checkIfNodesAreAdjacent( setA[i][0] , setB[j][0] )){
			 	return [i,j]
			}
		}
	}
}



function checkForAdjacentNodes(nodes,pair,currentNode,index){
	var colours = ['red','yellow','blue'];
	var matchingColour;
	console.log(visitedNodes);
	for(var i = 0; i < visitedNodes.length;i++){
		for(var j = 0; j < visitedNodes[i].length;j++){
			console.log(visitedNodes[i][j]);
			if(pair[0] == visitedNodes[i][j][0][0] && pair[1] == visitedNodes[i][j][0][1]){
				console.log("found matching pair with the colour",visitedNodes[i][j][1]);

				console.log(nodes[(currentNode)][index][1]);
				nodes[(currentNode)][index][1] = visitedNodes[i][j][1];
				console.log("After assginment",nodes[(currentNode)][index][1]);
				removeItem(colours,visitedNodes[i][j][1]);
				//assignColour(node,visitedNodes[i][j][1]);
			}
		}
	}
	console.log(colours);
	return colours;
}


function assignColour(colours,nodes,currentNode,link){
	//var nodes[currentNode][link][0] = 
	if(colours.length == 0){
		console.log(colours[0]);
		return colours[0];
	}
	else {
		// in the case that there is more!
		console.log("colours to choose from", colours,nodes);
			for(var j = 0; j < nodes[currentNode].length;j++){
				console.log(nodes[currentNode][j][0],nodes[currentNode][j][1]);
				if(nodes[currentNode][j][1] == null){
					nodes[currentNode][j][1] = colours[(colours.length-1)];
					colours.pop();
				}
			}
	}
	console.log("remaining colours",colours);
	//console.log(nodes);

}

function removeItem(array, item){
    for(var i in array){
        if(array[i]==item){
            array.splice(i,1);
            break;
        }
    }
}

function checkIfNodesAreAdjacent(pairA,pairB){
	console.log("trying to match", pairA,pairB);
	if(pairA[0] == pairB[0] && pairA[1] == pairB[1])
		return true;
	console.log("pair not adjacent, wtf");
	return false;
}

function countColours(){
	var red = 0, blue = 0, yellow = 0 ;
	for(var i = 0 ; i < visitedNodes.length; i++){
		for(var j = 0; j < visitedNodes[i].length;j++){
			//console.log(visitedNodes[i][j][1]);
			if(visitedNodes[i][j][1] == 'red')
				red++;
			if(visitedNodes[i][j][1] == 'yellow')
				yellow++;
			if(visitedNodes[i][j][1] == 'blue')
				blue++;
		}
	}
	var list = [red,blue,yellow];
	var least = Math.min.apply(Math,list);
	console.log("least is", least);
	if(least == blue) return 'blue';
	if(least == red) return 'red';
	if(least == yellow) return 'yellow';

}
function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

function getListOfGuards(bestColour){
	list = [];
	console.log(visitedNodes);
	for(var i = 0; i < visitedNodes.length; i++){
		for(var j = 0; j < visitedNodes[i].length; j++){
			if(visitedNodes[i][j][1] == bestColour){
				console.log("solutions", visitedNodes[i][j][0], bestColour);
				if(!isInList(visitedNodes[i][j][0],list)){
				 console.log(visitedNodes[i][j][0]);
				 list.push(visitedNodes[i][j][0]);
				 //guards.push(visitedNodes[i][j][0]);
				 console.log(list);
				}
			}
		}
	}
	console.log("final answer ", uniq(list));
}

function isInList(item,list){
	console.log(item,list);
	for(var i = 0; i < list.length;i++){
		if(item == list[i])
			return true;
	}
	return false;
}
function scaleDataAfterTriangulation(array){
	var safe = [];
	for(var i = 0 ; i<array.length;i++){
		for(var j = 0; j < array[i].length;j++){
			//console.log(array[i][j]);
			safe.push([ array[i][j][0][0].toString(),array[i][j][0][1].toString()]);
		}
	}
	console.log(safe);
	return scaleData(safe);
}

function tryAlgorithm(){
	//console.log(actualInput);
	var input = prepStringForTriangulation(actualInput);

	var triangulationPoints = earcut(input); // pass the input to the library to triangulation points 
	//console.log(triangulationPoints); 
	var triangluationCoordinates = getTriangulationPoints(input,triangulationPoints); // get the cordinates of the triangulation points
	//console.log(triangluationCoordinates[0],triangluationCoordinates[1]);
	//console.log(polygonConvert(scaleDataAfterTriangulation(triangluationCoordinates)));
	//console.log(triangluationCoordinates);
	
	// console.log(scaleDataAfterTriangulation(triangluationCoordinates));


	
	makeGraph(triangluationCoordinates);
	// //var dataSet = polygonConvert(triangluationCoordinates);
	// //svg.append("polygon").attr("points",dataSet).attr("fill","black").attr("stroke-width",1);
	// //svg.append("polygon").attr("points",'10,0 0,50, 60,60, 70,10').attr("fill","black").attr("stroke-width",1);


	console.log("after graph traversal",visitedNodes);
	countColours();
	// actualInput = scaleData(actualInput);
	// console.log(polygonConvert(actualInput));
	// createGallery(polygonConvert(actualInput));
 //    //createSegments(actualInput);
	getListOfGuards(countColours());
	drawGraphs(actualInput,triangluationCoordinates);
}

function prepStringForTriangulation(rawString){
	var list = [];
	console.log("raw",rawString);

	for(var i = 0 ; i < rawString.length; i++){
		for(var j = 0; j < rawString[i].length;j++){
			//console.log(rawString[i][j][1], parseFloat(rawString[i][j]));
			list.push(parseFloat(rawString[i][j]));
		}
	}
	console.log(list);
	return list;
}

function drawTriangulationPolygon(string){
	svg.append("polygon").attr("points",polygonConvert(scaleDataAfterTriangulation(triangles))).attr("fill","rgba(255, 204, 204,0.3)").attr("stroke-width",1).attr("stroke","blue");
	string = string.split(' ')
	console.log(string);
	var i = 0;
	while(i!=string.length){
		var localString = string[i] + ' ' + string[(i+1)] + ' ' + string[(i+2)];
		console.log(localString);
		i+=3;
		svg.append("polygon").attr("points",localString).attr("fill","rgba(255, 204, 204,0.3)").attr("stroke-width",1).attr("stroke","blue");
	}
}
function drawGraphs(polygon,triangles){
	
	actualInput = scaleData(actualInput);
	
	console.log(polygonConvert(actualInput));
	createGallery(polygonConvert(actualInput));
	svg.append("polygon").attr("points",polygonConvert(scaleDataAfterTriangulation(triangles))).attr("fill","rgba(255, 204, 204,0.3)").attr("stroke-width",1).attr("stroke","blue");
	drawTriangulationPolygon(polygonConvert(scaleDataAfterTriangulation(triangles)));
 // //createSegments(actualInput);
}