var canvas = document.getElementById("imgCanvas");
var ctx = canvas.getContext("2d");
var isDrawing, isErasing, isDragging;
var tool;
var canvasPosition;
var rect = {};
var previousMouseX = null;
var previousMouseY = null;

window.onload = function() {
	canvasPosition = canvas.getBoundingClientRect();
}
/*-----------Getting mouse position(err)----------*/
function getMousePosition(evt) {
	return {
		x: evt.clientX - canvasPosition.left,
		y: evt.clientY - canvasPosition.top	
	};
}

/*-------------Moving inside the canvas------------*/
function move(mouseX, mouseY) {
    previousMouseX = mouseX;
    previousMouseY = mouseY;
}

/*-------------Panting or erasing------------------*/
function painting(mouseX, mouseY) {
    if (tool == "pencil") {
	    ctx.globalCompositeOperation = "source-over";
	    ctx.lineWidth = 5;
	    ctx.globalAlpha = "1";
	    ctx.beginPath();
	    ctx.moveTo(previousMouseX, previousMouseY);
	    ctx.lineTo(mouseX, mouseY);
	    ctx.closePath();
	    ctx.stroke();
	    move(mouseX, mouseY);
    } else if(tool == "eraser"){
        ctx.beginPath();
        ctx.globalCompositeOperation="destination-out";
        ctx.arc(previousMouseX, previousMouseY, 10, 0, Math.PI * 2, false);
        ctx.fill();
        move(mouseX, mouseY);
    }    
}
	
/*-----------------For selection---------------------*/
function mouseDown(e) {
	rect.startX = e.pageX - this.offsetLeft;
	rect.startY = e.pageY - this.offsetTop;
	isDragging = true;
}
function mouseUp() {
	isDragging = false;
}
function mouseMove(e) {
	if (isDragging) {
		rect.w = (e.pageX - this.offsetLeft) - rect.startX;
		rect.h = (e.pageY - this.offsetTop) - rect.startY ;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawRect();
	}
}
function drawRect() {
	ctx.strokeStyle = "black";
	ctx.setLineDash([5, 3]);
	ctx.globalAlpha = "1";
	ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
}

/*-----------For uploading image to canvas------------------*/
function handleImage(e){
    var canvas = document.getElementById("imgCanvas");
	var context = canvas.getContext("2d");
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img,0,0);
        }
        img.src = event.target.result;
    } 
    reader.readAsDataURL(e.target.files[0]);     
}

/*----------------Coordinates of cursor----------------------*/
function showCoords(event) {
    var x = event.clientX - canvasPosition.left;
    var y = event.clientY - canvasPosition.top;
    document.getElementById("mouseX").innerHTML = x;
    document.getElementById("mouseY").innerHTML = y;
}

function clearCoor() {
    document.getElementById("mouseX").innerHTML = "";
    document.getElementById("mouseY").innerHTML = "";
}

/*------------------Filters----------------------------------*/


/*---------------------Main-----------------------------------*/
$(document).ready(function(){
	$("#img-file").on('change', handleImage);
  	$("#backward").click(function(){
  		ctx.clearRect(0, 0, canvas.width, canvas.height);
  	});
  	$("#selection").click(function(){
		canvas.addEventListener('mousedown', mouseDown, false);
		canvas.addEventListener('mouseup', mouseUp, false);
		canvas.addEventListener('mousemove', mouseMove, false);
  	});
  	$('#pencil').click(function(){
    	isDrawing = false;
    	tool = "pencil";
      	$('#imgCanvas').mousedown(function(e){
			isDrawing = true;	
			var pos = getMousePosition(e);
			move(pos.x, pos.y);
      	});
      	$('#imgCanvas').mousemove(function(e){
        	if(isDrawing) {
          		var pos = getMousePosition(e);
          		painting(pos.x, pos.y);   
        	}
      	});
      	$('#imgCanvas').mouseup(function(e){
        	isDrawing = false;
      	});
  	});
  	$('#eraser').click(function(){
    	isErasing = false;
   		tool = "eraser";
        $('#imgCanvas').mousedown(function(e){
        	isErasing = true;
          	var pos = getMousePosition(e);
          	move(pos.x, pos.y);
        });
        $('#imgCanvas').mousemove(function(e){
           if(isErasing) {
        	    var pos = getMousePosition(e);
            	painting(pos.x, pos.y);   
          	}
        });
        $('#imgCanvas').mouseup(function(e){
          	isErasing = false;
        });
  	});
});

// var id_menu = new Array('sub_menu_1');
// startList = function allclose() {
// 	for (i=0; i < id_menu.length; i++){
// 		document.getElementById(id_menu[i]).style.display = "none";
// 	}
// }
// function openMenu(id){
// 	for (i=0; i < id_menu.length; i++){
// 		if (id != id_menu[i]){
// 			document.getElementById(id_menu[i]).style.display = "none";
// 		}
// 	}
// 	if (document.getElementById(id).style.display == "block"){
// 		document.getElementById(id).style.display = "none";
// 	}else{
// 		document.getElementById(id).style.display = "block";
// 	}
// }
//  window.onload=startList;