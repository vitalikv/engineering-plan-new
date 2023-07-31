



// кликнули на стену или окно/дверь, когда к мышки привязана вставляемая дверь 
function clickToolWD(obj)
{ 
	  
	if(obj)
	{    
		// кликнули на стену, когда добавляем окно
		if(obj.userData.tag == 'free_dw') 
		{ 
			clickO.obj = obj;
			if(!obj.userData.door.wall) { return true; }
			
			clickO.last_obj = null;
			addWD({ obj : obj, wall : obj.userData.door.wall, pos : obj.position });  
			return true; 
		}
	}

	return false;
}



// добавляем на выбранную стену окно/дверь
// obj 		готовая дверь/окно
// wall		стену на которую кликнули
function addWD( cdm )
{	
	var obj = cdm.obj;
	var wall = cdm.wall;
	var pos = cdm.pos;
	
	pos.y -= 0.001;		// делаем чуть ниже уровня пола
	obj.position.copy( pos );
	obj.rotation.copy( wall.rotation ); 
	obj.material.transparent = false;
	clickO.obj = obj;
	
	if(camera == cameraTop)
	{ 
		obj.material.depthTest = false;  
		obj.material.opacity = 1.0; 		 	
	}
	else
	{ 		
		obj.material.depthTest = true;
		obj.material.transparent = true;
		obj.material.opacity = 0;					
	}	
	
	changeWidthWD(obj, wall);		// выставляем ширину окна/двери равную ширине стены
	
	// обновляем(пересчитываем) размеры двери/окна/двери (если измениалась ширина)
	obj.geometry.computeBoundingBox(); 	
	obj.geometry.computeBoundingSphere();
	
	obj.userData.tag = (obj.userData.door.type == 'WindowSimply') ? 'window' : 'door';
	obj.userData.door.wall = wall;
	obj.userData.door.goList.setEmptyBox = true;  
	//obj.userData.freeze = clickActionBreak_2(obj);
	
	if(obj.userData.tag == 'window') { obj.userData.door.actList = abo.window; }
	else if(obj.userData.tag == 'door') { obj.userData.door.actList = abo.door; }
	
	if(!obj.userData.id) { obj.userData.id = countId; countId++; }  
	
	if(obj.userData.tag == 'window') { arr_window[arr_window.length] = obj; }
	else { arr_door[arr_door.length] = obj; }

	
	//--------
	
	obj.updateMatrixWorld();
	
	
	// создаем клон двери/окна, чтобы вырезать в стене нужную форму
	if(1==1)
	{  
		objsBSP = { wall : wall, wd : createCloneWD_BSP( obj ) };				
		MeshBSP( obj, objsBSP ); 
		cutMeshBlockBSP( obj );
	}	


	wall.userData.wall.arrO[wall.userData.wall.arrO.length] = obj;
	
	obj.geometry.computeBoundingBox();
	obj.geometry.computeBoundingSphere();

	
	
	// правильно поворачиваем окно/дверь	
	// obj.updateMatrixWorld();  сверху уже есть
	
	if(obj.userData.tag == 'door') 
	{ 
		createDoorLeaf(obj, (obj.userData.door.open_type) ? obj.userData.door.open_type : 0); 
		
		// устанавливаем (поварачиваем) ПОП дверь	
		if(obj.userData.door.type == 'DoorSimply') { setPosDoorLeaf_2(obj); }
		else if(obj.userData.door.type == 'DoorPattern') { if(obj.userData.door.goList.setPopObj) { changeWidthParamWD(obj); setPosDoorLeaf_3(obj); } } 		 
	}
	else
	{
		var room = detectCommonZone_1( wall );
		
		if(room.length == 1)
		{
			var side = 0;
			for ( var i2 = 0; i2 < room[0].w.length; i2++ ) { if(room[0].w[i2].userData.id == wall.userData.id) { side = room[0].s[i2]; break; } }

			if(side == 0) { obj.userData.door.popObj.rotation.y += Math.PI; }
			else { }			
		}
		 
		obj.userData.door.popObj.position.copy(obj.geometry.boundingSphere.center.clone());
	}
	
	
	
	resetMenuUI();
 	
	deActiveSelected();
	
	clickRayHit( detectRayHit( event, 'click' ) ); 
	
	renderCamera();
}



// создаем полотно (при вставке двери в стену)
function createDoorLeaf(door, open_type) 
{
	//if(camera != cameraTop) return;
	if(door.userData.door.type == 'DoorEmpty') return;
	
	var geometry = createGeometryWD(1.0, 2.1, 0.08);		
	
	var v = geometry.vertices; 
	v[0].x = v[1].x = v[6].x = v[7].x = 0;
	v[2].x = v[3].x = v[4].x = v[5].x = 0.8;
	var obj = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({ color: colDoor, depthTest: false }) );
	
	obj.renderOrder = 1;
	obj.door = door;
	obj.userData.tag = 'door_leaf';
	
	door.userData.door.leaf_2D = obj;
	door.add( obj );
	
	setPosDoorLeaf_1(door, Number(open_type));	// устанавливаем полотно			
}





// изменяем у ПОП объекта ширину/высоту/центрируем
function changeWindowDoorPop(obj, x, y) 
{
	var popObj = obj.userData.door.popObj;
	
	if(popObj) 
	{ 
		if(obj.userData.door.type == 'DoorPattern')
		{
			obj.geometry.computeBoundingBox();
			popObj.position.x = obj.geometry.boundingSphere.center.x; 
			popObj.position.y = obj.geometry.boundingBox.min.y; 
		}
		else
		{
			popObj.position.x = obj.geometry.boundingSphere.center.x; 
			popObj.position.y = obj.geometry.boundingSphere.center.y;			
		}
		
		popObj.geometry.computeBoundingBox();		
		var dX = popObj.geometry.boundingBox.max.x - popObj.geometry.boundingBox.min.x;
		var dY = popObj.geometry.boundingBox.max.y - popObj.geometry.boundingBox.min.y;	
			
		popObj.scale.set(x * 2 / dX, y * 2 / dY, 1);  
	} 	
}
   


// заменяем старую стену на новыу, переносим все данные, удаляем старую стену
function upWallAfterReplace( newWall, oldWall )
{
	newWall.userData.tag = 'wall';
	
	var point1 = newWall.userData.wall.p[0];	
	var point2 = newWall.userData.wall.p[1];
	
	deleteOneOnPointValue(point1, oldWall);
	deleteOneOnPointValue(point2, oldWall);
		
	for ( var i = 0; i < obj_line.length; i++ ){ if(obj_line[i] == oldWall) { obj_line[i] = newWall; break; } }	// заменяем в массиве новую, на старую стену			
	
	for ( var i = 0; i < newWall.userData.wall.arrO.length; i++ )
	{
		newWall.userData.wall.arrO[i].userData.door.wall = newWall;
	}	
	
	var n = point1.w.length;		
	point1.w[n] = newWall;
	point1.p[n] = point2;
	point1.start[n] = 0;	
	
	var n = point2.w.length;		
	point2.w[n] = newWall;
	point2.p[n] = point1;
	point2.start[n] = 1;

	scene.remove( oldWall );  
}




 
 
 
 
 
 