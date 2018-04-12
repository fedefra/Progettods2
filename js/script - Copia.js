var idCircle=0;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var $canvas = $("#canvas");
var canvasOffset = $canvas.offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var scrollX = $canvas.scrollLeft();
var scrollY = $canvas.scrollTop();
var cw = canvas.width;
var ch = canvas.height;
// flag to indicate a drag is in process
// and the last XY position that has already been processed
var isDown = false;
var lastX;
var lastY;

// the radian value of a full circle is used often, cache it


// array contenente i nodi correnti
var circles = [];
var PI2 = Math.PI * 2;
var stdRadius = 10;
var draggingCircle = -1;


    var bw = 520;
    var bh = 520;
    var p = 0;
    var cw = bw + (p*2) + 1;
    var ch = bh + (p*2) + 1;
//Per disegnare la griglia
function drawBoard(){
    ctx.clearRect(0, 0, cw, ch);
    ctx.beginPath();
    for (var x = 0; x <= bw; x += 40) {
        ctx.moveTo(0.5 + x + p, p);
        ctx.lineTo(0.5 + x + p, bh + p);
    }
    for (var x = 0; x <= bh; x += 40) {
        ctx.moveTo(p, 0.5 + x + p);
        ctx.lineTo(bw + p, 0.5 + x + p);
    }
    ctx.strokeStyle = "black";
    ctx.stroke();
    
    }
drawBoard();

// clear the canvas and redraw all existing circles
function drawAll(selectedNode,connectedNode) {
   if(circles.length > 0){
    for (var i = 0; i < circles.length; i++) {

        var circle = circles[i];
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, PI2);
        ctx.closePath();
        ctx.fillStyle = circle.color;
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(circle.idCircle,circle.x,circle.y+3);

        if(selectedNode!=undefined && selectedNode.length > 0) {
        	if(selectedNode.indexOf(circle.idCircle) > -1){
        		ctx.fillStyle = 'blue';
		        ctx.textAlign = 'center';
		        ctx.fillText(circle.idCircle,circle.x,circle.y+3);       		 
        	}
        }
        if(connectedNode!=undefined && connectedNode.length > 0){
        	jQuery.each( connectedNode, function( i, val ) {
			  		jQuery.each( connectedNode[i], function( j, value ) {
			  			if(circle.idCircle==connectedNode[i][j]){
				  		    ctx.fillStyle = 'green';
			        		ctx.fill();
			        		if(selectedNode.indexOf(circles[connectedNode[i][j]].idCircle) > -1){
			        			ctx.fillStyle = 'blue';
			        		}
			        		else{
			        			ctx.fillStyle = 'white';
			        		}			        		
					        ctx.textAlign = 'center';
					        ctx.fillText(circle.idCircle,circle.x,circle.y+3);
				        }	
			  		});
			    });
        	   var headlen = 10;   // length of head in pixels
               	jQuery.each( connectedNode, function( i, val ) {
			  			circleTempId=connectedNode[i][0];
			  			fromx=circles[circleTempId].x-5;
			  			fromy=circles[circleTempId].y-5;
			  			circleTempId=connectedNode[i][1];
			  			tox=circles[circleTempId].x-5
			  			toy=circles[circleTempId].y-5;
			  			var angle = Math.atan2(toy-fromy,tox-fromx);
			  			ctx.beginPath();
						ctx.moveTo(fromx, fromy);						
						ctx.lineTo(tox, toy);
						ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
					    ctx.moveTo(tox, toy);
					    ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
						ctx.stroke();
			  		});

               	aggiornaTabellaPercorsi();
    	}
	}
	    aggiornaTabellaNodi();
}
}

function handleMouseDown(e) {

    if(event.which==1){
        // tell the browser we'll handle this event
        e.preventDefault();
        e.stopPropagation();

        // save the mouse position
        // in case this becomes a drag operation
        lastX = parseInt(e.clientX - offsetX);
        lastY = parseInt(e.clientY - offsetY);
        // hit test all existing circles
        var hit = -1;
        for (var i = 0; i < circles.length; i++) {
            var circle = circles[i];

            var dx = lastX - circle.x;
            var dy = lastY - circle.y;
            if (dx * dx + dy * dy < circle.radius * circle.radius) {
                hit = i;
            }
        }

        // if no hits then add a circle
        // if hit then set the isDown flag to start a drag
        
        if (hit < 0) {
            circles.push({
            	idCircle: idCircle,
                x: lastX,
                y: lastY,
                radius: stdRadius,
                color: randomColor()
            });
            idCircle++;
            drawBoard();
           drawAll(selectedCircle,connectedNode ); 
           
        } else {
            draggingCircle = circles[hit];
            isDown = true;
        }
    }
}

function handleMouseUp(e) {
    // tell the browser we'll handle this event
    e.preventDefault();
    e.stopPropagation();

    // stop the drag
    isDown = false;
}

function handleMouseMove(e) {

    // if we're not dragging, just exit
    if (!isDown) {
        return;
    }

    // tell the browser we'll handle this event
    e.preventDefault();
    e.stopPropagation();

    // get the current mouse position
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);

    // calculate how far the mouse has moved
    // since the last mousemove event was processed
    var dx = mouseX - lastX;
    var dy = mouseY - lastY;

    // reset the lastX/Y to the current mouse position
    lastX = mouseX;
    lastY = mouseY;

    // change the target circles position by the 
    // distance the mouse has moved since the last
    // mousemove event
    draggingCircle.x += dx;
    draggingCircle.y += dy;

    // redraw all the circles
     drawBoard();
    drawAll(selectedCircle,connectedNode ); 
   
}
function aggiornaTabellaNodi(){
	var content;
	content += ' <caption>Tabella nodi</caption><tr><th>ID nodo</th><th>Coordinata x</th><th>Coordinata y</th></tr>';
	for (var i = 0; i < circles.length; i++) {
    	content += '<tr><td>' +   circles[i].idCircle + '</td><td>' +   circles[i].x + '</td><td>' +   circles[i].y + '</td></tr>';
	}
	$('#table_nodi').html(content);
}
function aggiornaTabellaPercorsi(){
	var content;
	content += ' <caption>Tabella percorso</caption><tr><th>Nodo partenza</th><th>Nodo destinatario</th></tr>';
	jQuery.each( connectedNode, function( i, val ) {
			content += '<tr><td>' +   connectedNode[i][0] + '</td><td>' +   connectedNode[i][1] + '</td></tr>';
	});
	$('#table_percorsi').html(content);
}

// listen for mouse events
$("#clear").click(function (e) {
      circles=[];
      connectedNode=[];
      selectedCircle=[];
      currentCircle='';
      idCircle=0;
      aggiornaTabellaNodi();
      aggiornaTabellaPercorsi();
      ctx.clearRect(0, 0, cw, ch);
      drawBoard();


});
$("#canvas").mousedown(function (e) {
    handleMouseDown(e);
});
$("#canvas").mousemove(function (e) {
    handleMouseMove(e);
});
$("#canvas").mouseup(function (e) {
    handleMouseUp(e);
});
$("#canvas").mouseout(function (e) {
    handleMouseUp(e);
});

//////////////////////
// Utility functions

function randomColor() {
    //return ('#' + Math.floor(Math.random() * 16777215).toString(16));
    return('#000');
}