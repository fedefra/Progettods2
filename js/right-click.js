var currentCircle='';
var selectedCircle=[];
var connectedNode=[];

$(document).bind("contextmenu", function (event) {

    event.preventDefault();
    
        lastX = parseInt(event.clientX - offsetX);
        lastY = parseInt(event.clientY - offsetY);
        var hit = -1;
        for (var i = 0; i < circles.length; i++) {
            var circle = circles[i];
            var dx = lastX - circle.x;
            var dy = lastY - circle.y;
            if (dx * dx + dy * dy < circle.radius * circle.radius) {
                hit = i;
                currentCircle=circle.idCircle;
            }
        }
        //se clicco su un nodo apro il menù
    if (hit >= 0) {
        $(".custom-menu").finish().toggle(100).
        css({
            top: event.pageY + "px",
            left: event.pageX + "px"
        });
    }

});

$(document).bind("mousedown", function (e) {
    if (!$(e.target).parents(".custom-menu").length > 0) {
        $(".custom-menu").hide(100);
    }
});


//se premo su un bottone del menù
$(".custom-menu li").click(function(e){

    //per gestire le varie azioni
    switch($(this).attr("data-action")) {        
        case "select":
        if(selectedCircle['0']!=currentCircle){
        	selectedCircle.push(currentCircle);  	
        	if(selectedCircle.length==2){      
        	  	connectedNode.push(selectedCircle);
        	  	selectedCircle=[];
        	}
        }
        	drawBoard();
        	drawAll(selectedCircle,connectedNode );   

         break;
    }
    $(".custom-menu").hide(100);
  });