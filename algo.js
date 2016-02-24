//var triangles = earcut([10,0, 0,50, 60,60, 70,10]); // returns [1,0,3, 3,2,1]
var input = [5, 0, 2, 0.5, 0, 5, 0.2, 3, -2, -2, -0.5, 0];
// '0,50 10,0 70,10'

function scaleArray(array){
	for(var i = 0; i < array.length;i++)
		array[i] = array[i]*10;
	return array;
}

function getTriangulationPoints(array,indexes){
	var coords = []
	for(var i = 0; i < indexes.length;i++){
		coords.push([scaleX(array[2 * indexes[i]]), scaleY(array[2 * indexes[i] + 1])]);
	}
	var newcoords = [];
	for(var j = 0; j < (indexes.length / 3) ; j ++ ) {
		coords.shift(3 * j);
		newcoords.push([coords[0],coords[1],coords[2]]);
	}
	return newcoords;
}

function assignColours(array,indexes){

}

function toString(array){
	console.log(array);
}

function tryAlgorithm(){
	var triangulationPoints = earcut(input); // pass the input to the library to triangulation points 
	//console.log(triangulationPoints); 
	var triangluationCoordinates = getTriangulationPoints(input,triangulationPoints); // get the cordinates of the triangulation points
	//toString(triangluationCoordinates);
	var dataSet = polygonConvert(triangluationCoordinates);
	svg.append("polygon").attr("points",dataSet).attr("fill","black").attr("stroke-width",1);
	//console.log("string" + toString(triangluationCoordinates));
	//createGallery()
}