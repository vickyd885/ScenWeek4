//var triangles = earcut([10,0, 0,50, 60,60, 70,10]); // returns [1,0,3, 3,2,1]


//var input = [5, 0, 2, 0.5, 0, 5, 0.2, 3, -2, -2, -0.5, 0]; // case 5
// var input = [0, 0, 2, 0, 2,2] 
// '0,50 10,0 70,10'
var visitedNodes = [];
function scaleArray(array){
	for(var i = 0; i < array.length;i++)
		array[i] = array[i]*10;
	return array;
}


function getTriangulationPoints (array,indexes) {
	// body...
	console.log(array);
	var coords = [];
	for(var i = 0; i < indexes.length;i++){
		coords.push([array[2 * indexes[i]], array[2 * indexes[i] + 1]]);
		console.log([array[2 * indexes[i]], array[2 * indexes[i] + 1]]);
		console.log(i, coords);
	}
	var newcoords = [];
	for(var j = 0; j < indexes.length / 3; j++){
		newcoords.push([ [coords[0],null], [coords[1],null], [coords[2],null] ]);
	}
	//console.log(newcoords);
	return newcoords;
}

// function getTriangulationPoints(array,indexes){
// 	var coords = []
// 	console.log(indexes.length);
// 	for(var i = 0; i < indexes.length;i++){
// 		coords.push([array[2 * indexes[i]], array[2 * indexes[i] + 1]]);
// 		console.log([array[2 * indexes[i]], array[2 * indexes[i] + 1]]);
// 		console.log(i, coords);
// 	}
// 	console.log(coords[2]);
// 	var newcoords = [];
// 	for(var j = 0; j < (indexes.length / 3) ; j ++ ) {
// 		coords.shift(3 * j);
// 		newcoords.push([ [coords[0],null], [coords[1],null], [coords[2],null] ]);
// 		console.log([coords[2],null]);
// 		// if (j == 2 ){
// 		// 	console.log(newcoords[0][2]);
// 		// }
// 	}
// 	//console.log(newcoords);
// 	return newcoords;
//}

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
	console.log(nodes);
	// assign the first set in order

	var currentNode = 0;
	nodes[currentNode][0][1] = 'red';
	nodes[currentNode][1][1] = 'yellow';
	nodes[currentNode][2][1] = 'blue';
	visitedNodes.push(nodes[currentNode]);
	console.log(nodes[0][2][1]);
	targetNewNode(nodes);
}

function targetNewNode(nodes){
	var currentNode = 0;
	var totalNumberOfNodes = nodes.length;
	while(!totalNumberOfNodes){
		if( checkIfNodesAreAdjacent(nodes[currentNode][2][0],nodes[(currentNode+1)][0][0])){
			var possibleColours = checkForAdjacentNodes(nodes[(currentNode+1)][0][0]);
			//console.log(nodes[1][0][1]); 
			nodes[(currentNode+1)][0][1] = assignColour(possibleColours);
			visitedNodes.push(nodes[(currentNode+1)]);
		}
		totalNumberOfNodes -=1;
	}
}

function checkForAdjacentNodes(pair){
	var colours = ['red','yellow','blue'];
	console.log(visitedNodes);
	for(var i = 0; i < visitedNodes.length;i++){
		for(var j = 0; j < visitedNodes[i].length;j++){
			console.log(visitedNodes[i][j]);
			if(pair[0] == visitedNodes[i][j][0][0] && pair[1] == visitedNodes[i][j][0][1]){
				console.log("found matching pair which the colour",visitedNodes[i][j][1]);
				removeItem(colours,visitedNodes[i][j][1]);
			}
		}
	}
	console.log(colours);
	return colours;
}


function assignColour(colours){
	if(colours.length == 0)
		console.log(colours[0]);
		return colours[0];
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
	if(least == red) return 'red';
	if(least == yellow) return 'yellow';
	if(least == blue) return 'blue';
}

function getListOfGuards(bestColour){
	list = [];
	for(var i = 0; i < visitedNodes.length; i++){
		for(var j = 0; j < visitedNodes[i].length; j++){
			console.log(visitedNodes[i][j][1], bestColour);
			if(visitedNodes[i][j][1] == bestColour)
				list.push(visitedNodes[i][j][0]);
		}
	}
	console.log("final answer ", list);
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
	console.log(actualInput);
	var input = prepStringForTriangulation(actualInput);

	var triangulationPoints = earcut(input); // pass the input to the library to triangulation points 
	console.log(triangulationPoints); 
	var triangluationCoordinates = getTriangulationPoints(input,triangulationPoints); // get the cordinates of the triangulation points
	//console.log(triangluationCoordinates);
	//console.log(polygonConvert(scaleDataAfterTriangulation(triangluationCoordinates)));

	//console.log(scaleData(triangluationCoordinates));
	svg.append("polygon").attr("points",polygonConvert(scaleDataAfterTriangulation(triangluationCoordinates))).attr("fill","rgba(255, 204, 204,0.3)").attr("stroke-width",1);
	//makeGraph(triangluationCoordinates);
	//var dataSet = polygonConvert(triangluationCoordinates);
	//svg.append("polygon").attr("points",dataSet).attr("fill","black").attr("stroke-width",1);
	//console.log("string" + toString(triangluationCoordinates));
	//createGallery()
	//countColours();
	actualInput = scaleData(actualInput);
	createGallery(polygonConvert(actualInput));
    //createSegments(actualInput);
	getListOfGuards(countColours());
}

function prepStringForTriangulation(rawString){
	var list = [];
	for(var i = 0 ; i < rawString.length; i++){
		for(var j = 0; j < rawString[i].length;j++){
			list.push(+rawString[i][j][0]);
		}
	}
	console.log(list);
	return list;
}