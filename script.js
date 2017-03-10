var canvas = document.getElementById("imgCanvas");
var ctx = canvas.getContext("2d");
var isDrawing, isErasing, isDragging, isSelected;
var tool;
var canvasPosition;
var rect = {};
var previousMouseX = null;
var previousMouseY = null;

var currImgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

// var id_menu = new Array('sub_menu_1');
// startList = function allclose() {
//   for (i=0; i < id_menu.length; i++){
//     document.getElementById(id_menu[i]).style.display = "none";
//   }
// }
// function openMenu(id){
//   for (i=0; i < id_menu.length; i++){
//     if (id != id_menu[i]){
//       document.getElementById(id_menu[i]).style.display = "none";
//     }
//   }
//   if (document.getElementById(id).style.display == "block"){
//     document.getElementById(id).style.display = "none";
//   }else{
//     document.getElementById(id).style.display = "block";
//   }
// }
//  window.onload=startList;

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

var draw = function(){  
  var currImgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for(var i = 0; i < currImgData.data.length; i += 4){
    currImgData.data[i]   = imgData[i];
    currImgData.data[i+1] = imgData[i+1];
    currImgData.data[i+2] = imgData[i+2];
  }
  ctx.putImageData(currImgData, 0, 0);
}
/*-------------Moving inside the canvas------------*/
function move(mouseX, mouseY) {
    previousMouseX = mouseX;
    previousMouseY = mouseY;
}

/*-------------Panting/erasing/selecting------------------*/
function painting(mouseX, mouseY) {
    if (tool == "pencil") {
	    ctx.globalCompositeOperation = "source-over";
	    ctx.lineWidth = 5;
	    ctx.globalAlpha = "1";
	    //ctx.beginPath();
	    ctx.moveTo(previousMouseX, previousMouseY);
	    ctx.lineTo(mouseX, mouseY );
	    //ctx.closePath();
	    ctx.stroke();
	    move(mouseX, mouseY);
    } else if(tool == "eraser"){
        ctx.beginPath();
        ctx.globalCompositeOperation="destination-out";
        ctx.arc(previousMouseX, previousMouseY, 10, 0, Math.PI * 2 , false);
        ctx.fill();
        move(mouseX, mouseY);
    }  else if (tool == 'selection')  {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(p, 0, 0);
        ctx.setLineDash([5, 3]);
        var x = Math.min(mouseX,  previousMouseX),
        y = Math.min(mouseY,  previousMouseY),
        w = Math.abs(mouseX - previousMouseX),
        h = Math.abs(mouseY - previousMouseY);
        ctx.strokeRect(x, y, w, h);
        if($('#bucket').click(function(){
          ctx.fillRect(x, y, w, h);
          isSelected = false;
        }));
    }
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
 /*-------------Color-----------------------------------------*/
color = document.getElementById("color");
color.addEventListener("input", function() {
      ctx.strokeStyle = color.value;
      ctx.fillStyle = color.value;
  },
  false
);
/*-----------------------Filters-------------------------------*/
function grayscale (){
    var currImgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        //var pixels = currImgData.data;
        for (var i = 0; i < currImgData.data.length; i += 4) {
          var r = currImgData.data[i];
          var g = currImgData.data[i + 1];
          var b = currImgData.data[i + 2];
          var v = 0.2126*r + 0.7152*g + 0.0722*b;
          currImgData.data[i] = v;
          currImgData.data[i + 1] = v;
          currImgData.data[i + 2] = v;
        }
        ctx.putImageData(currImgData, 0, 0);
}


function original(weights){
  var currImgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        //var pixels = currImgData.data;
        for (var i = 0; i < currImgData.data.length; i += 4) {
          
          currImgData.data[i]     += weights[i % 8]; // red
          currImgData.data[i + 1] += weights[i % 8]; // green
          currImgData.data[i + 2] += weights[i % 8]; // blue

        }
        //return imageData;
        ctx.putImageData(currImgData, 0, 0);
}
function blur(weights){
  var currImgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        //var pixels = currImgData.data;
        for (var i = 4; i < currImgData.data.length - 4; i += 4) {

          currImgData.data[i]     = (currImgData.data[i-1] + currImgData.data[i] + currImgData.data[i+1])/3; // red
          currImgData.data[i + 1] = (currImgData.data[i] + currImgData.data[i+1] + currImgData.data[i+2])/3; // green
          currImgData.data[i + 2] = (currImgData.data[i] + currImgData.data[i+2] + currImgData.data[i+3])/3;
        }
        //return imageData;
        ctx.putImageData(currImgData, 0, 0);
}


function sepia(){
  var currImgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        //var pixels = currImgData.data;
        for (var i = 0; i < currImgData.data.length; i += 4) {
          var r = currImgData.data[i];
          var g = currImgData.data[i + 1];
          var b = currImgData.data[i + 2];
          currImgData.data[i]     = (r * 0.393)+(g * 0.769)+(b * 0.189); // red
          currImgData.data[i + 1] = (r * 0.349)+(g * 0.686)+(b * 0.168); // green
          currImgData.data[i + 2] = (r * 0.272)+(g * 0.534)+(b * 0.131); // blue

        }
        //return imageData;
        ctx.putImageData(currImgData, 0, 0);
}

function brightness(){
  var currImgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        //var pixels = currImgData.data;
        var bright_lvl = 50;
        for (var i = 0; i < currImgData.data.length; i += 4) {
          currImgData.data[i] += bright_lvl;
          currImgData.data[i + 1] += bright_lvl;
          currImgData.data[i + 2] += bright_lvl;
        }
        //return imageData;
        ctx.putImageData(currImgData, 0, 0);
}
function treshold(){
  var currImgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        //var pixels = currImgData.data;
        var bright_lvl = 50;
        for (var i = 0; i < currImgData.data.length; i += 4) {
          var r = currImgData.data[i];
          var g = currImgData.data[i + 1];
          var b = currImgData.data[i + 2];
          var v = (0.2126*r + 0.7152*g + 0.0722*b >= 100) ? 255 : 0;
          currImgData.data[i]     = v; // red
          currImgData.data[i + 1] = v; // green
          currImgData.data[i + 2] = v; // blue
        }
        //return imageData;
        ctx.putImageData(currImgData, 0, 0);
}
function inverse(){
  var currImgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        for (var i = 0; i < currImgData.data.length; i += 4) {
          
          currImgData.data[i]     = 255 - currImgData.data[i]; // red
          currImgData.data[i + 1] = 255 - currImgData.data[i+1] ; // green
          currImgData.data[i + 2] = 255 - currImgData.data[i+2]; ; // blue
        }
        ctx.putImageData(currImgData, 0, 0);
}

/*---------------------Main-----------------------------------*/
$(document).ready(function(){
   	$("#img-file").on('change', handleImage);
  	$("#backward").click(function(){
      p = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      $("#forward").click(function(){
          ctx.putImageData(p, 0, 0);
      });
  	});
  	$("#selection").click(function(){ 
      tool = "selection"; 
      isDragging = false;
      isSelected = true;
      p = ctx.getImageData(0, 0, canvas.width, canvas.height);
      $('#canvas').mousedown(function(e){
        isDragging = true;
        var pos = getMousePosition(e);
        move(pos.x, pos.y);
      });
      $('#canvas').mousemove(function(e){
       if(isDragging) {
         var pos = getMousePosition(e);
         stroke(pos.x, pos.y);   
        }
      });
      $('#canvas').mouseup(function(e){
        isDragging = false;
      });
    });
  	$('#bucket').click(function(){
    if(!isSelected){
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  })
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
  		console.log('hi');
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
  $('#grayscale').click(function(){
      grayscale();
  	});
  $('#blur').click(function(){
      blur();
    });
  $('#sepia').click(function(){
    sepia();
    });
  $('#brightness').click(function(){
    brightness();
    });
  $('#treshold').click(function(){
    treshold();
    });
  $('#sharpen').click(function(){
    original(
      [  0, -20,  0,
        -20,  70, -20,
         0, -20,  0 ]);
    });
  $('#sobel').click(function(){
    //grayscale();
    original(
      [-20, 50, 20,
       -40, 50, 40,
       -20, 50, 20 ]);
    original(
      [-20, -40, -20,
         50, 50, 50,
        20, 40, 20 ]);
    });
  $('#blur').click(function(){
    blur();
    });
  $('#inverse').click(function(){
    inverse();
    });  
});

