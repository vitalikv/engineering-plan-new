
 


document.body.addEventListener('contextmenu', function(event) { event.preventDefault() });
document.body.addEventListener( 'mousedown', onDocumentMouseDown, false );
document.body.addEventListener( 'mousemove', onDocumentMouseMove, false );
document.body.addEventListener( 'mouseup', onDocumentMouseUp, false );


document.body.addEventListener( 'touchstart', onDocumentMouseDown, false );
document.body.addEventListener( 'touchmove', onDocumentMouseMove, false );
document.body.addEventListener( 'touchend', onDocumentMouseUp, false );


document.body.addEventListener("keydown", function (e) { keys[e.keyCode] = true; });
document.body.addEventListener("keyup", function (e) { keys[e.keyCode] = false; });

document.addEventListener('DOMMouseScroll', mousewheel, false);
document.addEventListener('mousewheel', mousewheel, false);	



document.body.addEventListener("keydown", function (e) 
{ 
	
	if(infProject.activeInput) 
	{ 
		if(e.keyCode == 13)
		{
			if(infProject.activeInput == 'input-height') { changeHeightWall(); }
			//if(infProject.activeInput == 'input-width') { inputWidthOneWall({wall:obj_line[0], width:{value:7, unit:'cm'}, offset:'wallRedBlueArrow'}) } 
			if(infProject.activeInput == 'input-width') { changeWidthWall( $('[data-action="input-width"]').val() ); }
			if(infProject.activeInput == 'wall_1') { inputChangeWall_1({}); }	 		
			if(infProject.activeInput == 'wd_1') { inputWidthHeightWD(clickO.last_obj); }
			if(infProject.activeInput == 'wall_plaster_width_1') 
			{ 		
				inputWidthOneWallPlaster({wall:obj_line[0], width:{value:$('[nameid="wall_plaster_width_1"]').val(), unit:'cm'}, index:1}) 
			}
		}		
		 
		return; 
	}


	if(e.keyCode == 46) { detectDeleteObj(); }
	
	if(e.keyCode == 76) { loadFile(''); }
	if(e.keyCode == 79) { getSkeleton_1(room); }
	
	if (window.location.hostname == 'plan1' || window.location.hostname == 'plan3' || window.location.hostname == 'webgl-editor')
	{
		 
		
		//if(e.keyCode == 79) { getDesignFile('https://files.planoplan.com/upload/projects/files/ugol/201803/4b24bf0f.u3d?1525780430', 93); }   
		//if(e.keyCode == 80) { resetStyleRoom(0); }
		
	}
	
} );






