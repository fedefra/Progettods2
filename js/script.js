var idCircle=0;
//per semplicità utilizzo sia l'oggetto html del DOM che l'oggetto jquery
var canvas = document.getElementById("canvas");
var $canvas = $("#canvas");
var ctx = canvas.getContext("2d");
var canvasOffset = $canvas.offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var scrollX = $canvas.scrollLeft();
var scrollY = $canvas.scrollTop();
var cw = canvas.width;
var ch = canvas.height;

// per indicare il drag di un nodo
var isDown = false;
var lastX;
var lastY;
// array contenente i nodi correnti
var circles = [];
var PI2 = Math.PI * 2;
var stdRadius = 10;

var draggingCircle = -1;
//dimensioni della griglia
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

// pulisce il canvas e disegna i nodi e i percorsi
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
//se un nodo è selezionato lo colora in maniera diversa
        if(selectedNode!=undefined && selectedNode.length > 0) {
        	if(selectedNode.indexOf(circle.idCircle) > -1){
        		ctx.fillStyle = 'blue';
		        ctx.textAlign = 'center';
		        ctx.fillText(circle.idCircle,circle.x,circle.y+3);       		 
        	}
        }
//se ci sono nodi percorsi disegna le frecce e i nodi colorati
        if(connectedNode!=undefined && connectedNode.length > 0){
        	jQuery.each( connectedNode, function( i, val ) {
                //disegno i nodi collegati
			  		jQuery.each( connectedNode[i], function( j, value ) {
			  			if(circle.idCircle==connectedNode[i][j]){
				  		    ctx.fillStyle = 'green';
			        		ctx.fill();
                //disegno i nodi selezionati ma non collegati
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
            //per disegnare i collegamenti
        	   var headlen = 10; 
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
               	updateTablePaths();
    	}
	}
	    updateTableNodes();
}
}

//gestione del click del mouse sulla griglia
function handleMouseDown(e) {

    if(event.which==1){
        e.preventDefault();
        e.stopPropagation();

        lastX = parseInt(e.clientX - offsetX);
        lastY = parseInt(e.clientY - offsetY);
        //controllo che non ho cliccato su un nodo
        var hit = -1;
        for (var i = 0; i < circles.length; i++) {
            var circle = circles[i];

            var dx = lastX - circle.x;
            var dy = lastY - circle.y;
            if (dx * dx + dy * dy < circle.radius * circle.radius) {
                hit = i;
            }
        }
    //se non ci sono hit allora posso disegnare il nodo
        if (hit < 0) {
            circles.push({
            	idCircle: idCircle,
                x: lastX,
                y: lastY,
                radius: stdRadius,
                color: '#000'
            });
            idCircle++;
            console.log(circles);
            drawBoard();
           drawAll(selectedCircle,connectedNode ); 
           
        } else {
    //altrimenti posso draggare il nodo cliccato
            draggingCircle = circles[hit];
            isDown = true;
        }
    }
}
//gestione del rilascio del click
function handleMouseUp(e) {
    e.preventDefault();
    e.stopPropagation();

    isDown = false;
}

//gestione del movimento del mouse
function handleMouseMove(e) {

    if (!isDown) {
        return;
    }
    e.preventDefault();
    e.stopPropagation();

    //posizione corrente del mouse
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);

    //determino di quanto si è mosso il mouse
    var dx = mouseX - lastX;
    var dy = mouseY - lastY;

    //nuova ultima posizione
    lastX = mouseX;
    lastY = mouseY;

    //cambio la posizione del nodo draggato
    draggingCircle.x += dx;
    draggingCircle.y += dy;

    // riscrivo i nodi
     drawBoard();
    drawAll(selectedCircle,connectedNode ); 
   
}
function updateTableNodes(){
	var content;
	content += ' <caption>Tabella nodi</caption><tr><th>ID nodo</th><th>Coordinata x</th><th>Coordinata y</th></tr>';
	for (var i = 0; i < circles.length; i++) {
    	content += '<tr><td>' +   circles[i].idCircle + '</td><td>' +   circles[i].x + '</td><td>' +   circles[i].y + '</td></tr>';
	}
	$('#table_nodi').html(content);
}
function updateTablePaths(){
	var content;
	content += ' <caption>Tabella percorso</caption><tr><th>Nodo partenza</th><th>Nodo destinatario</th></tr>';
	jQuery.each( connectedNode, function( i, val ) {
			content += '<tr><td>' +   connectedNode[i][0] + '</td><td>' +   connectedNode[i][1] + '</td></tr>';
	});
	$('#table_percorsi').html(content);
}

function stampaJson(){
    var JsonOutput;
    var path={};
    var allPaths=[];
    var Node1;
    var Node2;
    jQuery.each( connectedNode, function( i, val ) {
            Node1=circles[connectedNode[i][0]];
            Node2=circles[connectedNode[i][1]];
            path={
                'partenza': Node1,
                'destinazione': Node2
            }
            allPaths.push(path);
    })
    var str = JSON.stringify(allPaths, undefined, 4);
    document.getElementById('json').innerHTML = str;
}


// evento per pulire la griglia
$("#clear").click(function (e) {
      circles=[];
      connectedNode=[];
      selectedCircle=[];
      currentCircle='';
      idCircle=0;
      updateTableNodes();
      updateTablePaths();
      ctx.clearRect(0, 0, cw, ch);
      drawBoard();


});
$("#jsonButton").click(function (e) {
    stampaJson(e);
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