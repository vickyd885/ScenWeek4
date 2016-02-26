//var triangles = earcut([10,0, 0,50, 60,60, 70,10]); // returns [1,0,3, 3,2,1]


//var input = [5, 0, 2, 0.5, 0, 5, 0.2, 3, -2, -2, -0.5, 0]; // case 5
// '0,50 10,0 70,10'
var visitedNodes = [];
var expectedNodes; 
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
	nodes[currentNode][0][2] = true;
	nodes[currentNode][1][2] = true;
	nodes[currentNode][2][2] = true;
	visitedNodes.push(nodes[currentNode][0]);
	visitedNodes.push(nodes[currentNode][1]);
	visitedNodes.push(nodes[currentNode][2]);
	console.log(nodes[0]);
	//
	//targetNewNode(nodes);
	//funTraverse(nodes);
	traverseGraph(nodes);
}

function checkForUniqueNodes(){

}


function funTraverse(nodes){
	var i = 0;
	while(i != nodes.length){
		//console.log(nodes[i]);
		i++;
	}
}


function traverseGraph(nodes){
	var currentNode = 0;
	var count = 0;
	var totalNumberOfNodes = nodes.length;
	while(visitedNodes.length < expectedNodes){
		console.log(visitedNodes.length);

		var indexOfNextNode = findNextNode(nodes[currentNode],nodes); // returns i,j of nodes[i][j]
		
		if(indexOfNextNode == -1){
			console.log("check", visitedNodes.length, expectedNodes, nodes[currentNode]);
			console.log("chekcback",visitedNodes,nodes);
			break;
		}

		nodes[indexOfNextNode[0]][indexOfNextNode[1]][2] = true;

		console.log(nodes[indexOfNextNode[0]]);

		var possibleColours = checkForAdjacentNodes( nodes, nodes[indexOfNextNode[0]] );

		if(possibleColours.length == 0){
			nodes[indexOfNextNode[0]][indexOfNextNode[1]][1] = possibleColours[0];
		}else{
			assignColour(possibleColours,nodes[indexOfNextNode[0]]);
		}
		

		console.log(nodes);
		//visitedNodes.push(nodes[indexOfNextNode[0]][indexOfNextNode[1]]);

		console.log(visitedNodes);
		//visitedNodes.push(nodes[indexOfNextNode]);
		currentNode = indexOfNextNode[0];
		count += 1;
	// 	break;
	}
	console.log(count);
	

}


function checkIfAllNodesAreVisited(nodes){
	var count = 0;
	for(var i = 0 ; i < nodes.length ; i++){
		for(var j = 0; j < nodes[i].length ; j++){
			//console.log(nodes[i][j][2]);
			if(nodes[i][j][2] == true)
				count++;
		}
	}
	console.log("counted",count);
	return count;
}
function findNextNode(node, nodes){
	console.log(node);
	var lastUnvisitedI = 10, lastUnvisitedJ = 10;
	console.log(lastUnvisitedI,lastUnvisitedJ);
	for(var i = 0 ; i < nodes.length ;i++){
		for(var j = 0; j < nodes[i].length;j++){
			//console.log(nodes[i][j][0]);
			if(nodes[i][j][2] == false){
				lastUnvisitedJ = j;
				lastUnvisitedI = i;
			}
			for(var k = 0 ; k < node.length ; k++){
				console.log("comparing", node[k][0], "with",nodes[i][j][0]);
				if( node[k][0][0] == nodes[i][j][0][0] && node[k][0][1] ==  nodes[i][j][0][1]){
					console.log("found a match that has been ", nodes[i][j][2]);
					if(!nodes[i][j][2] ){ 
						console.log("found a match",nodes[i][j][0][0] , nodes[i][j][0][1], nodes[i][j][1]);
						visitedNodes.push(nodes[i][j][0]);
						return [i,j]
					}else{
					//so the case where it finds the same node which it visits but no other nodes are available, pick the last available node
					if(nodes[i][j][2] == true){
						return [lastUnvisitedI,lastUnvisitedJ]
					}
					}
				}
			}
		}
		console.log("something went wrong");
	}


	function findUnvisitedNode(nodes){

	}
	// for(var i = 0 ; i < node.length ;i++){
	// 	for(var j = 0; j < nodes.length;j++){
	// 		//console.log(nodes[i][j][0]);
	// 		for(var k = 0 ; k < nodes[j].length ; k++){
	// 			console.log(node[k][0],nodes[i][j][0]);
	// 			if( node[i][0][0] == nodes[j][k][0][0] && node[i][0][1] ==  nodes[j][k][0][1] && !nodes[k][k][2] ){
	// 				console.log("found a match",nodes[i][j][0][0] ,nodes[i][j][0][1] );
	// 				return [i,j]
	// 			}
	// 		}
	// 	}
	// }
	return -1;
}


function findNewNode(setA,setB){
	console.log(setA,setB);
	for(var i = 0; i < setA.length;i++){
		for(var j = 0; j < setA[i][0].length;j++){
			console.log(setA[i][j],setB[i][j],"for ", i ,j);
			if( checkIfNodesAreAdjacent( setA[i][0] , setB[j][0] )){
			 	return [i,j]
			}
		}
	}
}



function checkForAdjacentNodes(nodes, triangles){
	var colours = ['red','yellow','blue'];
	console.log(triangles);
	// var matchingColour;

	for(var i = 0; i < visitedNodes.length;i++){
		for(var j = 0; j < visitedNodes[i].length;j++){
			//console.log(visitedNodes[i][j]);
			for(var k = 0; k < triangles.length;k++){
				//console.log(triangles[k][0]);
				pair = triangles[k][0];

				console.log(visitedNodes[i][0], i, j ,k);

				if(pair[0] == visitedNodes[i][0][0] && pair[1] == visitedNodes[i][0][1]){
					console.log("found matching pair with the colour",visitedNodes[i][1]); 
					triangles[k][1] = visitedNodes[i][1];
					removeItem(colours,visitedNodes[i][1]);
				//assignColour(node,visitedNodes[i][j][1]);
				}

			}
		}
	}
	console.log(colours);
	return colours;
}


function assignColour(colours,triangle){
	//var nodes[currentNode][link][0] = 
	if(colours.length == 0){
		console.log(colours[0]);
		return colours[0];
	}
	else {
		// in the case that there is more!
		console.log("colours to choose from", colours,triangle);

		for(var i = 0; i< triangle.length; i++){
			console.log(triangle[i]);
			if(triangle[i][1] == null){
				triangle[i][1] = colours[(colours.length-1)];
				colours.pop();
			}
		}

			// for(var j = 0; j < triangles.length;j++){
			// 	console.log(nodes[currentNode][j][0],nodes[currentNode][j][1]);
			// 	if(nodes[currentNode][j][1] == null){
			// 		nodes[currentNode][j][1] = colours[(colours.length-1)];
			// 		colours.pop();
			// 	}
			// }
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
			console.log(visitedNodes[i][1]);
			if(visitedNodes[i][1] == 'red')
				red++;
			if(visitedNodes[i][1] == 'yellow')
				yellow++;
			if(visitedNodes[i][1] == 'blue')
				blue++;
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
			if(visitedNodes[i][1] == bestColour){
				console.log("solutions", visitedNodes[i][0], bestColour);
				if(!isInList(visitedNodes[i][0],list)){
				 console.log(visitedNodes[i][0]);
				 list.push(visitedNodes[i][0]);
				 //guards.push(visitedNodes[i][j][0]);
				 console.log(list);
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
			//console.log(array[i][j][0]);
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
	console.log(triangulationPoints); 
	var triangluationCoordinates = getTriangulationPoints(input,triangulationPoints); // get the cordinates of the triangulation points
	//console.log(triangluationCoordinates[0],triangluationCoordinates[1]);
	//console.log(polygonConvert(scaleDataAfterTriangulation(triangluationCoordinates)));
	//console.log(triangluationCoordinates);
	
	// console.log(scaleDataAfterTriangulation(triangluationCoordinates));


	
	makeGraph(triangluationCoordinates);
	// //var dataSet = polygonConvert(triangluationCoordinates);
	// //svg.append("polygon").attr("points",dataSet).attr("fill","black").attr("stroke-width",1);
	// //svg.append("polygon").attr("points",'10,0 0,50, 60,60, 70,10').attr("fill","black").attr("stroke-width",1);


	//console.log("after graph traversal",visitedNodes);
	//countColours();
	// actualInput = scaleData(actualInput);
	// console.log(polygonConvert(actualInput));
	// createGallery(polygonConvert(actualInput));
 //    //createSegments(actualInput);
	//getListOfGuards(countColours());
	//drawGraphs(actualInput,[]);
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
	//svg.append("polygon").attr("points",polygonConvert(scaleDataAfterTriangulation(triangles))).attr("fill","rgba(255, 204, 204,0.3)").attr("stroke-width",1).attr("stroke","blue");
	console.log(string);
	string = string.split(' ')
	console.log(string);


	for(var i = 0; i< string.length;i++){
		if(string[i]==''){
			console.log("wierd")
			string.splice(i);
		}
	}
	console.log(string.length);
	//return; 
	var i = 0;

	while(i!=string.length){
		var localString = string[i] + ' ' + string[(i+1)] + ' ' + string[(i+2)];
		//console.log(localString);
		i+=3;
		svg.append("polygon").attr("points",localString).attr("fill","rgba(255, 204, 204,0.3)").attr("stroke-width",1).attr("stroke","blue");
	}
}

function drawGraphs(polygon,triangles){
	actualInput = scaleData(actualInput);
	console.log(polygonConvert(actualInput));
	createGallery(polygonConvert(actualInput));


	//svg.append("polygon").attr("points",polygonConvert(scaleDataAfterTriangulation(triangles))).attr("fill","rgba(255, 204, 204,0.3)").attr("stroke-width",1).attr("stroke","blue");
	drawTriangulationPolygon(polygonConvert(scaleDataAfterTriangulation(triangles)));
 // //createSegments(actualInput);
}

// Insert points into objects, 

// Extract + draw; 


function createObject(){
	console.log(actualInput);
	expectedNodes = actualInput.length;
	var contour = []
	for(var i =0; i < actualInput.length;i++){
		for(var j = 0 ;j < (actualInput[i].length-1);j++){ // dont include last point
			contour.push(new poly2tri.Point( actualInput[i][0], actualInput[i][1]));
		}
	}
	var swctx = new poly2tri.SweepContext(contour);
	swctx.triangulate();
	var triangles = swctx.getTriangles();
	return triangles;
}

function getScaledList(triangles){
	console.log(triangles);
	string = [];
	console.log(triangles[1]['points_']);
	for(j=0;j<triangles.length;j++){
		var points = triangles[j]['points_'];
		var y = 0;
		while(y!= points.length){
			//string += points[i]['x'] + ',' + points[i]['y'] + ' ';
			//string.push([points[i]['x'],points[i]['y']]);
			var local = [];
			for(var i = 0; i < points.length ; i++){
				console.log(points[0]['x']);
				console.log(points[1]['y']);
				//string += points[i]['x'] + ',' + points[i]['y'] + ' ';
				local.push([[points[i]['x'],points[i]['y']],null,false]);
			}
			string.push(local);
			y += 3;
		}
	}
	console.log(string);
	return string;
}

function pipeString(triangles){
	string = '';

	for(var i = 0; i < triangles.length ; i++){
		for(var j = 0; j < triangles[i].length;j++){
			console.log(triangles[i][j]);
			string += triangles[i][0] +','+triangles[i][1]+' '
		}
		//string += points[i]['x'] + ',' + points[i]['y'] + ' ';
		//string.push([points[i]['x'],points[i]['y']]);
	}
	console.log(string);
	return string;
}

function testNewLibrary(){
	var tri = createObject();
	var triangluationCoordinates = getScaledList(tri);
	drawGraphs(actualInput,triangluationCoordinates);
	//console.log(p);
	makeGraph(triangluationCoordinates);
	countColours();
	getListOfGuards(countColours());

}