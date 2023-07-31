





function fname_s_01(cdm)
{
	var wall = infProject.scene.array.wall[0];
	
	
	
	 
	cdm.wall = wall;
	cdm.type = 'wallRedBlue';
	cdm.side = 'wall_length_1';
	
	var x = $('[nameId="size-wall-length"]').val();
	var y = $('[nameId="size-wall-height"]').val();
	var z = $('[nameId="size-wall-width"]').val();
	
	
	if(1==1)
	{
		var v = wall.userData.wall.v;
		
		if(x == undefined) { x = '' + (v[6].x - v[0].x); }
		if(y == undefined) { y = '' + (v[1].y - v[0].y); }		
		if(z == undefined) { z = '' + (Math.abs(v[4].z) + Math.abs(v[0].z)); }		
		
		x = x.replace(",", ".");
		y = y.replace(",", ".");
		z = z.replace(",", ".");
		
		var x2 = v[6].x - v[0].x;
		var y2 = v[1].y - v[0].y;		
		var z2 = Math.abs(v[4].z) + Math.abs(v[0].z);
		
		x = (fname_s_06(x)) ? x : x2;
		y = (fname_s_06(y)) ? y : y2;
		z = (fname_s_06(z)) ? z : z2;  
	}
	
	
	
	if(1==1)
	{
		if(x > 30) { x = 30; }
		else if(x < 0.5) { x = 0.5; }

		if(y > 10) { y = 10; }
		else if(y < 0.1) { y = 0.1; }	
		
		if(z > 10) { z = 10; }
		else if(z < 0.02) { z = 0.02; }		
	}	
	
	cdm.length = x;
	cdm.height = y;
	cdm.width = z;	
	
	
	fname_s_02(cdm);	
	
	renderCamera();
}



function fname_s_02(cdm)
{
	var wall = cdm.wall;
	var value = cdm.length;
	
	var wallR = fname_s_0104(wall);
	fname_s_037(wallR);

	var p1 = wall.userData.wall.p[1];
	var p0 = wall.userData.wall.p[0];

	var walls = [...new Set([...p0.w, ...p1.w])];	
	
	
	
	if(cdm.height)
	{
		var h2 = Number(cdm.height);
		
		var v = wall.geometry.vertices;	
		v[1].y = h2;
		v[3].y = h2;
		v[5].y = h2;
		v[7].y = h2;
		v[9].y = h2;
		v[11].y = h2;
		wall.geometry.verticesNeedUpdate = true; 
		wall.geometry.elementsNeedUpdate = true;

		wall.userData.wall.height_1 = Math.round(h2 * 100) / 100;
	}
 
	
	if(cdm.width)
	{
		var z = cdm.width/2;
		
		var v = wall.geometry.vertices;	
		v[0].z = v[1].z = v[6].z = v[7].z = z;
		v[4].z = v[5].z = v[10].z = v[11].z = -z;	
		wall.geometry.verticesNeedUpdate = true;
		wall.geometry.elementsNeedUpdate = true;
		
		
		
		for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
		{ 
			var wd = wall.userData.wall.arrO[i];	
			var v = wd.geometry.vertices;
			var f = wd.userData.door.form.v;
			var v2 = wall.geometry.vertices;
			
			for ( var i2 = 0; i2 < f.minZ.length; i2++ ) { v[f.minZ[i2]].z = v2[4].z; }
			for ( var i2 = 0; i2 < f.maxZ.length; i2++ ) { v[f.maxZ[i2]].z = v2[0].z; }	

			wd.geometry.verticesNeedUpdate = true; 
			wd.geometry.elementsNeedUpdate = true;
			wd.geometry.computeBoundingSphere();
			wd.geometry.computeBoundingBox();
			wd.geometry.computeFaceNormals();		
		}

		wall.userData.wall.width = Math.round(cdm.width * 100) / 100;;
	}
 
	
	var ns = 0;
	var flag = true;
	while ( flag )
	{	 
		var v = wall.userData.wall.v;

		var d = 0;
		
		if(cdm.side == 'wall_length_1'){ d = Math.abs( v[6].x - v[0].x );  } 
		else if(cdm.side == 'wall_length_2'){ d = Math.abs( v[10].x - v[4].x );  }
		
		
		var sub = (value - d) / 1;
		if(cdm.type == 'wallRedBlue') { sub /= 2; }	
		
		var dir = new THREE.Vector3().subVectors(p1.position, p0.position).normalize();
		var dir = new THREE.Vector3().addScaledVector( dir, sub );	

		if(cdm.type == 'wallBlueDot')
		{ 
			var offset = new THREE.Vector3().addVectors( p1.position, dir ); 
			p1.position.copy( offset ); 
		}
		else if(cdm.type == 'wallRedDot')
		{ 
			var offset = new THREE.Vector3().subVectors( p0.position, dir ); 
			p0.position.copy( offset ); 
			wall.position.copy( offset );
		}
		else if(cdm.type == 'wallRedBlue')
		{ 			
			var offset = new THREE.Vector3().subVectors( p0.position, dir ); 
			p0.position.copy( offset );
			wall.position.copy( offset );
			
			p1.position.copy( new THREE.Vector3().addVectors( p1.position, dir ) );				
		}

		
		for ( var i = 0; i < walls.length; i++ )
		{
			fname_s_03(walls[i]);
		}			 		 
		
		fname_s_0106(p0);
		fname_s_0106(p1);
		fname_s_040( [wall] );
		if(cdm.side == 'wall_length_1'){ d = Math.abs( v[6].x - v[0].x ); }
		else if(cdm.side == 'wall_length_2'){ d = Math.abs( v[10].x - v[4].x ); }
		

		if(value - d == 0){ flag = false; }
		
		if(ns > 5){ flag = false; }
		ns++;
	} 	
	 
	fname_s_040( wallR );		
	fname_s_0146( fname_s_0116(wall) );  				 			
	
	tabObject.activeObjRightPanelUI_1({obj: wall});

	fname_s_038(wallR);
}

	




function fname_s_03(wall, cdm) 
{
	
	var v = wall.geometry.vertices;
	var p = wall.userData.wall.p;
	
	
	var f1 = false;	
	var f2 = false;	
	
	f1 = !fname_s_021(p[0].userData.point.last.pos, p[0].position); 	
	f2 = !fname_s_021(p[1].userData.point.last.pos, p[1].position); 	
	
	
	if(f1 && f2)
	{
		var offset_1 = new THREE.Vector3().subVectors(p[0].position, p[0].userData.point.last.pos);
		var offset_2 = new THREE.Vector3().subVectors(p[1].position, p[1].userData.point.last.pos);
		
		var equal = fname_s_021(offset_1, offset_2);
		
		
		if(equal)
		{
			var offset = new THREE.Vector3().subVectors(p[0].position, wall.position);
			
			wall.position.copy(p[0].position);
						
			for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
			{
				wall.userData.wall.arrO[i].position.add(offset);
				fname_s_062({obj: wall.userData.wall.arrO[i]});
			}
			
			return;
		}
	}	
	
	
	var dist = p[0].position.distanceTo(p[1].position);
	
	v[0].x = v[1].x = v[2].x = v[3].x = v[4].x = v[5].x = 0;
	v[6].x = v[7].x = v[8].x = v[9].x = v[10].x = v[11].x = dist;
 
	wall.geometry.verticesNeedUpdate = true; 
	wall.geometry.elementsNeedUpdate = true;
	wall.geometry.computeBoundingBox();	
	wall.geometry.computeBoundingSphere();	
	wall.geometry.computeFaceNormals();	

	var dir = new THREE.Vector3().subVectors(p[0].position, p[1].position).normalize();
	var angleDeg = Math.atan2(dir.x, dir.z);
	wall.rotation.set(0, angleDeg + Math.PI / 2, 0);

	wall.position.copy( p[0].position );


	
	
	if(cdm)
	{
		if(cdm.point)	
		{
			if(cdm.point == p[0]) { f1 = true; }
			if(cdm.point == p[1]) { f2 = true; }
		}
	}
	
	
	if(f2){ var dir = new THREE.Vector3().subVectors( p[0].position, p[1].position ).normalize(); }
	else { var dir = new THREE.Vector3().subVectors( p[1].position, p[0].position ).normalize(); }
	
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{
		var wd = wall.userData.wall.arrO[i];	

		if(f2)
		{
			var startPos = new THREE.Vector3(p[0].position.x, 0, p[0].position.z);
			var p1 = p[0].position;			
		}
		else
		{
			var startPos = new THREE.Vector3(p[1].position.x, 0, p[1].position.z);
			var p1 = p[1].position;
		}
		
		var dist = startPos.distanceTo(new THREE.Vector3(wd.position.x, 0, wd.position.z));
		
		
		var pos = new THREE.Vector3().addScaledVector( dir, -dist );
		pos = new THREE.Vector3().addVectors( p1, pos );
		
		wd.position.x = pos.x;
		wd.position.z = pos.z;
		wd.rotation.copy( wall.rotation );
		
		fname_s_062({obj: wd});
	}			
}






function fname_s_04(cdm) 
{
	var wall = cdm.wall;
	
	var width = cdm.width.value;
	var offset = cdm.offset;
	
	if(!wall){ return; } 
	if(wall.userData.tag != 'wall'){ return; } 
	
	var width = fname_s_0227({ value: width, unit: 1, limit: {min: 0.01, max: 1} });
	
	if(!width) 
	{
		$('[nameid="size_wall_width_1"]').val(wall.userData.wall.width);
		
		return;
	}		

	var width = width.num; 
	
	var wallR = fname_s_0104(wall);
	
	fname_s_037(wallR);
			
	var v = wall.geometry.vertices;
	
	var z = [0,0];
	
	if(offset == 'wallRedBlueArrow')
	{ 	
		width = (width < 0.01) ? 0.01 : width;
		width /= 2;		
		z = [width, -width];		
		var value = Math.round(width * 2 * 1000);
	}
	else if(offset == 'wallBlueArrow')
	{ 
		width = (Math.abs(Math.abs(v[4].z) + Math.abs(width)) < 0.01) ? 0.01 - Math.abs(v[4].z) : width;   		
		z = [width, v[4].z];
		var value = width * 1000;
	}
	else if(offset == 'wallRedArrow')
	{		 
		width = (Math.abs(Math.abs(v[0].z) + Math.abs(width)) < 0.01) ? 0.01 - Math.abs(v[0].z) : width;    		
		z = [v[0].z, -width];
		var value = width * 1000;
	}

	v[0].z = v[1].z = v[6].z = v[7].z = z[0];
	v[4].z = v[5].z = v[10].z = v[11].z = z[1];	

	wall.geometry.verticesNeedUpdate = true; 
	wall.geometry.elementsNeedUpdate = true;
	
	wall.geometry.computeBoundingSphere();
	wall.geometry.computeBoundingBox();
	wall.geometry.computeFaceNormals();	
	
	var width = Math.abs(v[0].z) + Math.abs(v[4].z);	
	wall.userData.wall.width = Math.round(width * 100) / 100;
	wall.userData.wall.offsetZ = (v[0].z + v[4].z)/2;	 

	
	var p0 = wall.userData.wall.p[0];
	var p1 = wall.userData.wall.p[1];
	fname_s_0107(p0);	
    fname_s_0107(p1);	
	
	
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{ 
		var wd = wall.userData.wall.arrO[i];	
		var v = wd.geometry.vertices;
		var f = wd.userData.door.form.v;
		var v2 = wall.geometry.vertices;
		
		for ( var i2 = 0; i2 < f.minZ.length; i2++ ) { v[f.minZ[i2]].z = v2[4].z; }
		for ( var i2 = 0; i2 < f.maxZ.length; i2++ ) { v[f.maxZ[i2]].z = v2[0].z; }	

		wd.geometry.verticesNeedUpdate = true; 
		wd.geometry.elementsNeedUpdate = true;
		wd.geometry.computeBoundingSphere();
		wd.geometry.computeBoundingBox();
		wd.geometry.computeFaceNormals(); 

		fname_s_062({obj: wd});
	}	
	
	fname_s_040( wallR );	 				
	fname_s_042( fname_s_0116(wall) );
	
	fname_s_038(wallR);
	
	$('[nameId="size_wall_width_1"]').val(wall.userData.wall.width);
	
	renderCamera();
}







function fname_s_05(cdm)
{  	
	var height = fname_s_0227({ value: cdm.height, unit: 1, limit: {min: 0.1, max: 5} });
	
	if(!height) 
	{
		return;
	}		
	
	if(cdm.load)
	{
		
	}
	else
	{	
		fname_s_037( infProject.scene.array.wall );
		
		for ( var i = 0; i < infProject.scene.array.wall.length; i++ )
		{
			var v = infProject.scene.array.wall[i].geometry.vertices;
			
			v[1].y = height.num;
			v[3].y = height.num;
			v[5].y = height.num;
			v[7].y = height.num;
			v[9].y = height.num;
			v[11].y = height.num;
			infProject.scene.array.wall[i].geometry.verticesNeedUpdate = true;
			infProject.scene.array.wall[i].geometry.elementsNeedUpdate = true;
			
			infProject.scene.array.wall[i].userData.wall.height_1 = height.num;
		}
		
		fname_s_040( infProject.scene.array.wall );
		fname_s_038( infProject.scene.array.wall );

		var floor = infProject.scene.array.floor;
		var ceiling = infProject.scene.array.ceiling;
		
		for ( var i = 0; i < floor.length; i++ )
		{		
			ceiling[i].position.set( 0, height.num, 0 ); 	
		}		
	}
	
	if(cdm.input)
	{  
		
	}
	
	if(cdm.globalHeight)
	{
		infProject.settings.height = height.num;  
	}		
	
	renderCamera();
}
	
	









function fname_s_06(n) 
{   
   return !isNaN(parseFloat(n)) && isFinite(n);   
   
   
   
}




function fname_s_07(point)
{
	var wall = infProject.scene.array.wall;
	
	for ( var i = 0; i < point.w.length; i++ )
	{
		for ( var i2 = 0; i2 < wall.length; i2++ )
		{
			if(point.w[i] == wall[i2]) { continue; }
			
			if(Math.abs(point.position.y - wall[i2].userData.wall.p[0].position.y) > 0.3) continue;		
			
			var p0 = point.w[i].userData.wall.p[0].position;
			var p1 = point.w[i].userData.wall.p[1].position;
			var p2 = wall[i2].userData.wall.p[0].position;
			var p3 = wall[i2].userData.wall.p[1].position;
			
			if(fname_s_0110(p0, p1, p2, p3)) { return true; }	
		}
	}
	
	return false;  
}




function fname_s_08(a1, a2, b1, b2)
{
	var t1 = fname_s_011(a1.x, a1.z, a2.x, a2.z);
	var t2 = fname_s_011(b1.x, b1.z, b2.x, b2.z);

	var point = new THREE.Vector3();
	var f1 = fname_s_012(t1[0], t1[1], t2[0], t2[1]);
	
	if(Math.abs(f1) < 0.0001){ return new THREE.Vector3(a2.x, 0, a2.z); } 
	
	point.x = fname_s_012(-t1[2], t1[1], -t2[2], t2[1]) / f1;
	point.z = fname_s_012(t1[0], -t1[2], t2[0], -t2[2]) / f1;	
	
	
	
	return point;
}




function fname_s_09(a1, a2, b1, b2)
{
	var t1 = fname_s_011(a1.x, a1.z, a2.x, a2.z);
	var t2 = fname_s_011(b1.x, b1.z, b2.x, b2.z);
	var f1 = fname_s_012(t1[0], t1[1], t2[0], t2[1]);
	
	if(Math.abs(f1) < 0.0001)
	{ 
		var s1 = new THREE.Vector3().subVectors( a1, b1 );
		var s2 = new THREE.Vector3().addVectors( s1.divideScalar( 2 ), b1 );
		
		return [new THREE.Vector3(s2.x, 0, s2.z), true]; 
	} 
	
	var point = new THREE.Vector3();
	point.x = fname_s_012(-t1[2], t1[1], -t2[2], t2[1]) / f1;
	point.z = fname_s_012(t1[0], -t1[2], t2[0], -t2[2]) / f1;	
	
	
	
	return [point, false];
}




function fname_s_010(a1, a2, b1, b2)
{
	var t1 = fname_s_011(a1.x, a1.z, a2.x, a2.z);
	var t2 = fname_s_011(b1.x, b1.z, b2.x, b2.z);

	var point = new THREE.Vector3();
	var f1 = fname_s_012(t1[0], t1[1], t2[0], t2[1]);
	
	if(Math.abs(f1) < 0.0001){ return [new THREE.Vector3(a2.x, 0, a2.z), true]; } 
	
	point.x = fname_s_012(-t1[2], t1[1], -t2[2], t2[1]) / f1;
	point.z = fname_s_012(t1[0], -t1[2], t2[0], -t2[2]) / f1;			 
	
	return [point, false];
}



function fname_s_011(x1, y1, x2, y2)
{
	var a = y1 - y2;
	var b = x2 - x1;
	var c = x1 * y2 - x2 * y1;

	return [ a, b, c ];
}

	
function fname_s_012(x1, y1, x2, y2)
{
	return x1 * y2 - x2 * y1;
}




function fname_s_013(a, b, c, d)
{
	return fname_s_014(a.x, b.x, c.x, d.x) && fname_s_014(a.z, b.z, c.z, d.z) && fname_s_015(a, b, c) * fname_s_015(a, b, d) <= 0 && fname_s_015(c, d, a) * fname_s_015(c, d, b) <= 0;
}

function fname_s_014(a, b, c, d)
{
	if (a > b) { var res = fname_s_016(a, b); a = res[0]; b = res[1]; }
	if (c > d) { var res = fname_s_016(c, d); c = res[0]; d = res[1]; }
	return Math.max(a, c) <= Math.min(b, d);
}

function fname_s_015(a, b, c) { return (b.x - a.x) * (c.z - a.z) - (b.z - a.z) * (c.x - a.x); }


function fname_s_016(a, b) { var c; c = a; a = b; b = c; return [a, b]; }



 

function fname_s_017(A,B,C){
    var x1=A.x, y1=A.z, x2=B.x, y2=B.z, x3=C.x, y3=C.z;
    var px = x2-x1, py = y2-y1, dAB = px*px + py*py;
    var u = ((x3 - x1) * px + (y3 - y1) * py) / dAB;
    var x = x1 + u * px, z = y1 + u * py;
    return {x:x, y:0, z:z}; 
} 



function fname_s_018(A,B,C)
{	
	var AB = { x : B.x - A.x, y : B.z - A.z };
	var CD = { x : C.x - A.x, y : C.z - A.z };
	var r1 = AB.x * CD.x + AB.y * CD.y;				

	var AB = { x : A.x - B.x, y : A.z - B.z };
	var CD = { x : C.x - B.x, y : C.z - B.z };
	var r2 = AB.x * CD.x + AB.y * CD.y;

	var cross = (r1 < 0 | r2 < 0) ? false : true;	
	
	return cross;
}

 

function fname_s_019(p1, p2, M)
{	
	var urv = fname_s_011(p1.x, p1.z, p2.x, p2.z);
	
	var A = urv[0];
	var B = urv[1];
	var C = urv[2];
	
	return Math.abs( (A * M.x + B * M.z + C) / Math.sqrt( (A * A) + (B * B) ) );
}







function fname_s_020(point, arrP)
{
	var p = arrP;
	var result = false;
	var j = p.length - 1;
	for (var i = 0; i < p.length; i++) 
	{
		if ( (p[i].position.z < point.position.z && p[j].position.z >= point.position.z || p[j].position.z < point.position.z && p[i].position.z >= point.position.z) &&
			 (p[i].position.x + (point.position.z - p[i].position.z) / (p[j].position.z - p[i].position.z) * (p[j].position.x - p[i].position.x) < point.position.x) )
			result = !result;
		j = i;
	}
	
	return result;
}



function fname_s_021(pos1, pos2, cdm)
{
	if(!cdm) cdm = {};
	
	var x = pos1.x - pos2.x;
	var y = pos1.y - pos2.y;
	var z = pos1.z - pos2.z;
	
	var kof = (cdm.kof) ? cdm.kof : 0.01;
	
	
	var equals = true;
	if(Math.abs(x) > kof){ equals = false; }
	if(Math.abs(y) > kof){ equals = false; }
	if(Math.abs(z) > kof){ equals = false; }

	return equals;
}









function fname_s_022(cdm)
{
	
	for(var i = 0; i < infProject.catalog.texture.length; i++)
	{
		var o = infProject.catalog.texture[i];
		o.name = 'img';
		var str = 
		'<div class="right_panel_1_1_list_item rp_list_item_texture" add_texture="'+o.url+'">\
			<img src="'+infProject.path+o.url+'" nameId="">\
		</div>';
		 
		$('[list_ui="catalog_texture_1"]').append(str);
	}	
}

function fname_s_023(cdm)
{
	
	for(var i = 0; i < infProject.catalog.texture.length; i++)
	{
		var o = infProject.catalog.texture[i];
		o.name = 'img';
		var str = 
		'<div class="right_panel_1_1_list_item rp_list_item_texture" add_texture="'+o.url+'">\
			<img src="'+infProject.path+o.url+'" nameId="">\
		</div>';
		 
		$('[list_ui="catalog_texture_2"]').append(str);
	}	
}


function fname_s_024()
{
	let html = '';
	let arr = infProject.catalog.texture;
	
	let container = document.querySelector('[nameId="catalog_texture_obj"]');
	
	for(let i = 0; i < arr.length; i++)
	{
		let div = document.createElement('div');
		div.innerHTML = 
		`<div class="right_panel_1_1_list_item rp_list_item_texture">
			<img src="${infProject.path+arr[i].url}">
		</div>`;
		let elem = div.children[0];
		container.append(elem);	
		
		elem.onmousedown = () => { myObj.clickBtnChangeTextureObj3D({url: arr[i].url}) }
	}		
}


function fname_s_025(cdm)
{
	if(cdm.type == 1)
	{
		$('[nameId="rp_catalog_texture_1"]').hide(); 
		$('[nameId="rp_block_wall_texture_1"]').show(); 		
	}
	else
	{
		$('[nameId="rp_catalog_texture_1"]').show(); 
		$('[nameId="rp_block_wall_texture_1"]').hide(); 		
	}
}













function fname_s_026(cdm) 
{
	var el = cdm.el;
	var value = el.val();
	
	var inf = null;
	if(cdm.el[0] == $('[nameId="rp_wall_width_1"]')[0]) { var inf = { json: infProject.settings.wall, name: 'width' }; }
	else if(cdm.el[0] == $('[nameId="rp_door_length_1"]')[0]) { var inf = { json: infProject.settings.door, name: 'width' }; }
	else if(cdm.el[0] == $('[nameId="rp_door_height_1"]')[0]) { var inf = { json: infProject.settings.door, name: 'height' }; }
	else if(cdm.el[0] == $('[nameId="rp_wind_length_1"]')[0]) { var inf = { json: infProject.settings.wind, name: 'width' }; }
	else if(cdm.el[0] == $('[nameId="rp_wind_height_1"]')[0]) { var inf = { json: infProject.settings.wind, name: 'height' }; }	
	else if(cdm.el[0] == $('[nameId="rp_wind_above_floor_1"]')[0]) { var inf = { json: infProject.settings.wind, name: 'h1' }; }
	else if(cdm.el[0] == $('[nameId="rp_gate_length_1"]')[0]) { var inf = { json: infProject.settings.gate, name: 'width' }; }
	else if(cdm.el[0] == $('[nameId="rp_gate_height_1"]')[0]) { var inf = { json: infProject.settings.gate, name: 'height' }; }
	else if(cdm.el[0] == $('[nameId="rp_roof_width_1"]')[0]) { var inf = { json: infProject.settings.roof, name: 'width' }; }
	else if(cdm.el[0] == $('[nameId="rp_roof_length_1"]')[0]) { var inf = { json: infProject.settings.roof, name: 'length' }; }		
	else { return; }	
	
	var res = fname_s_0227({ value: value, unit: 1, limit: {min: 0.01, max: 5} });	
	
	if(!res) 
	{
		el.val(inf.json[inf.name]);
		return;
	}
	
	el.val(res.num);
	
	inf.json[inf.name] = res.num; 
}




function fname_s_027(cdm) 
{
	$('[nameId="wall_texture_1img"]').attr('src', infProject.path+cdm.obj.userData.material[1].img);  
	$('[nameId="wall_texture_2img"]').attr('src', infProject.path+cdm.obj.userData.material[2].img);
}







function fname_s_028(cdm)
{
	var arr = cdm.arr;
	var floor = infProject.scene.array.floor;
	
	for ( var i = 0; i < arr.length; i++ )
	{
		for ( var i2 = 0; i2 < floor.length; i2++ )
		{
			if(arr[i].id !== floor[i2].userData.id) continue;
			
			if(arr[i].zone == undefined){ arr[i].zone = -1; };
			
			floor[i].userData.room.zone.id = arr[i].zone;
			
			if(infProject.settings.floor.label.visible)  
			{ 				 
				fname_s_029({id: floor[i].userData.room.zone.id, obj: floor[i]});			
			}
			
			break;
		}		
	}
	
	renderCamera();		
}



function fname_s_029(cdm)
{ 
	var type = infProject.settings.room.type;	
	
	var id = cdm.id;
	var obj = null;
	
	if(cdm.button) { obj = clickO.last_obj; }
	if(cdm.obj) { obj = cdm.obj; }
	
	var elem = obj.userData.room.html.label;
	elem.style.display = 'none';
	elem.userData.elem.show = false;
	
	
	
	if(!id) return;
	if(!obj) return;
	if(type.length == 0) return;	
	
	for(var i = 0; i < type.length; i++)
	{ 
		if(type[i].id !== id) continue;
		
		obj.userData.room.zone.id = type[i].id;
		obj.userData.room.zone.name = type[i].title;		
		
		elem.textContent = type[i].title;
		elem.style.display = 'block';
		elem.userData.elem.show = true;
		
		fname_s_0194({elem: elem});
		
		break;
	}
	
	renderCamera();
}





function fname_s_030()
{
	let list = [];
	
	list[0] = {id: 1, name: 'куб'};
	list[1] = {id: 2, name: 'сфера'};
	list[2] = {id: 3, name: 'цилиндр'};
	
	return list;
}


async function fname_s_031(cdm) 
{
	
	if(1==2)
	{
		var url = infProject.path+'t/catalog_2.json';
		var url = infProject.path+'components_2/getListObjSql.php';	

		var response = await fetch(url, 
		{
			method: 'POST',
			body: 'select_list=id, name' ,
			headers: 
			{
				'Content-Type': 'application/x-www-form-urlencoded'
			},		
			
		});
		var json = await response.json(); 		
	}
	else
	{
		json = fname_s_030();
	}
	
	for(var i = 0; i < json.length; i++)
	{
		if(json[i].id == 10 || json[i].id == 11) continue;
		
		json[i] = fname_s_032({json: json[i]});		
		
		json[i].elem.appendTo('[list_ui="catalog"]');
	}
		
	
	
	function fname_s_032({json})
	{
		
		if(json.id != 'group') 
		{
			json.html = 
			'<div class="right_panel_1_1_list_item" add_lotid="'+json.id+'" style="top:0px; left:0px">\
				<div class="right_panel_1_1_list_item_text">'
				+json.name+
				'</div>\
			</div>';
			
			json.elem = $(json.html);

			var n = json.id;
			(function(n) 
			{
				json.elem.on('mousedown', function(e){ fname_s_active_int({button: 'add_lotid', value: n}); e.stopPropagation(); });	
			}(n));			
		}
		else
		{
			var groupItem = '';

			var str_button = 
			'<div nameId="shCp_1" style="display: block; width: 10px; height: 10px; margin: auto 0;">\
				<svg height="100%" width="100%" viewBox="0 0 100 100">\
					<polygon points="0,0 100,0 50,100" style="fill:#ffffff;stroke:#000000;stroke-width:4" />\
				</svg>\
			</div>';
				
			json.html = 
			'<div class="right_panel_1_1_list_item" add_lotid="'+json.id+'" style="top:0px; left:0px;">\
				<div class="flex_1 relative_1" style="margin: auto;">\
					<div class="right_panel_1_1_list_item_text" nameid="nameItem">'+json.name+'</div>\
					'+str_button+'\
				</div>\
				<div nameId="groupItem" style="display: none;">\
					'+groupItem+'\
				</div>\
			</div>';
			
			json.elem = $(json.html); 

			
			var n = json.id;
			(function(n) 
			{
				json.elem.on('mousedown', function(e){ fname_s_active_int({button: 'add_lotid', value: n}); e.stopPropagation(); }); 	
			}(n));

			
			
			var el_2 = $(json.elem[0].querySelector('[nameId="shCp_1"]'));
			var el_3 = json.elem[0].querySelector('[nameId="groupItem"]');
			var num = 0;
			(function(num) 
			{
				el_2.on('mousedown', function(e){ fname_s_033({elem: this, elem_2: el_3}); e.stopPropagation(); });	
			}(num));

			
			
			var container = json.elem[0].querySelector('[nameid="groupItem"]');
			
			for ( var i = 0; i < json.child.length; i++ )
			{
				json.child[i] = fname_s_032({json: json.child[i]});
				
				json.child[i].elem.appendTo(container);
			}			
		}
		
		return json;
	}	
}






function fname_s_033(cdm)
{
	
	
	var display = cdm.elem_2.style.display;
	
	var display = (display == 'none') ? 'block' : 'none';
	
	cdm.elem_2.style.display = display;
	
	var parentEl = cdm.elem_2.parentElement;	

	if(display == 'block') { parentEl.style.backgroundColor = '#ebebeb'; }
	else { parentEl.style.backgroundColor = '#ffffff'; }
	
}












function fname_s_034( wd, wall )  
{
	
	
	if(!wall) { wall = wd.userData.door.wall; }		else {  }		
	var p1 = wall.userData.wall.p[0].position;
	var p2 = wall.userData.wall.p[1].position;	
	var d = p1.distanceTo( p2 );		
	

	wall.geometry.dispose();
	wall.geometry = fname_s_0199(d, wall.userData.wall.height_1, wall.userData.wall.width, wall.userData.wall.offsetZ);		
		var v = wall.geometry.vertices;
	
	for ( var i = 0; i < v.length; i++ ) { v[i] = wall.userData.wall.v[i].clone(); }
	
	
	fname_s_0219( wall ); 
	
		var arrO = wall.userData.wall.arrO;
	
	for ( var n = 0; n < arrO.length; n++ )
	{
		if(arrO[n] == wd) continue;
		
		var objClone = fname_s_035( arrO[n] ); 

		var wdBSP = new ThreeBSP( objClone );    
		var wallBSP = new ThreeBSP( wall ); 					var newBSP = wallBSP.subtract( wdBSP );				wall.geometry = newBSP.toGeometry();	
	}
	
	if(arrO.length > 1 || wd == null)
	{
		wall.geometry.computeFaceNormals();

		for ( var i = 0; i < wall.geometry.faces.length; i++ )
		{
			wall.geometry.faces[i].normal.normalize();
			if(wall.geometry.faces[i].normal.z == 1) { wall.geometry.faces[i].materialIndex = 1; }
			else if(wall.geometry.faces[i].normal.z == -1) { wall.geometry.faces[i].materialIndex = 2; }
			else if(wall.geometry.faces[i].normal.y == 1) { wall.geometry.faces[i].materialIndex = 3; }
			else if(wall.geometry.faces[i].normal.y == -1) { wall.geometry.faces[i].materialIndex = 3; }
		}		
	}			
	
	return wall; 
}




function fname_s_035( wd )
{
		if(wd.children.length > 0 && wd.children[0].userData.contour && wd.children[0].userData.contour.length > 0)
	{
		const wdCSG = myWindows.calcContourCSG(wd.children[0]);		
		return wdCSG;
	}
	
	var obj = new THREE.Mesh();
	obj.geometry = wd.geometry.clone(); 
	obj.position.copy( wd.position );
	obj.rotation.copy( wd.rotation );
	
		var minZ = wd.userData.door.form.v.minZ;
	var maxZ = wd.userData.door.form.v.maxZ;
	
	var v = obj.geometry.vertices;
	
	for ( var i = 0; i < minZ.length; i++ ) { v[minZ[i]].z -= 3.2; }
	for ( var i = 0; i < maxZ.length; i++ ) { v[maxZ[i]].z += 3.2; }

	return obj;		
}



function fname_s_036( wd, objsBSP, wall )
{  
	if(!wall) wall = wd.userData.door.wall;
	
	var wallClone = objsBSP.wall;
	var wdClone = objsBSP.wd;
	
	wdClone.position.copy( wd.position );

	var wdBSP = new ThreeBSP( wdClone );    
	var wallBSP = new ThreeBSP( wallClone ); 				var newBSP = wallBSP.subtract( wdBSP );					
	
	wallClone.geometry.dispose();
	wall.geometry.dispose();	
	
	wall.geometry = newBSP.toGeometry();		
	wall.geometry.computeFaceNormals();
 
	for ( var i = 0; i < wall.geometry.faces.length; i++ )
	{
		wall.geometry.faces[i].normal.normalize();
		if(wall.geometry.faces[i].normal.z == 1) { wall.geometry.faces[i].materialIndex = 1; }
		else if(wall.geometry.faces[i].normal.z == -1) { wall.geometry.faces[i].materialIndex = 2; }
		else if(wall.geometry.faces[i].normal.y == 1) { wall.geometry.faces[i].materialIndex = 3; }
		else if(wall.geometry.faces[i].normal.y == -1) { wall.geometry.faces[i].materialIndex = 3; }
	}
	
}

 
 
 
 function fname_s_037( arrW ) 
{
	
	
	for ( var i = 0; i < arrW.length; i++ )
	{
		var wall = arrW[i]; 
		
				
		var p1 = wall.userData.wall.p[0].position;
		var p2 = wall.userData.wall.p[1].position;	
		var d = p1.distanceTo( p2 );		
		
		wall.geometry.dispose();
		wall.geometry = fname_s_0199(d, wall.userData.wall.height_1, wall.userData.wall.width, wall.userData.wall.offsetZ);			 
				var v = wall.geometry.vertices;
		for ( var i2 = 0; i2 < v.length; i2++ ) { v[i2] = wall.userData.wall.v[i2].clone(); }	
		wall.geometry.verticesNeedUpdate = true;
		wall.geometry.elementsNeedUpdate = true;	
		wall.geometry.computeBoundingSphere();
	}
}
 
 
function fname_s_038( arrW )   
{
	
	
	for ( var i = 0; i < arrW.length; i++ )
	{
		var wall = arrW[i];
		
		for ( var i2 = 0; i2 < wall.userData.wall.arrO.length; i2++ )
		{
			var wd = wall.userData.wall.arrO[i2];
			
			var wdClone = fname_s_035( wd );
			
			objsBSP = { wall : wall, wd : wdClone };		
			
			fname_s_036( wd, objsBSP );			
		}
		
		fname_s_0219( wall ); 
	}
} 





 
 


function fname_s_039( wall, index ) 
{
	wall.updateMatrixWorld();
	
	var v = wall.userData.wall.v;		
	
	var h = v[1].y;	
	
	if(index == 1)
	{
		var x = v[v.length - 6].x - v[0].x;
	}
	else if(index == 2)
	{
		var x = v[v.length - 2].x - v[4].x;
	}	
	
	var space = Math.round((x * h) * 100) / 100;
	
	var length = x;
	var spaceArrO = 0;
	
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{
		var v = wall.userData.wall.arrO[i].geometry.vertices;
		var h = v[1].y;
		var x = Math.abs(v[0].x * 2);
		spaceArrO += Math.round((x * h) * 100) / 100;
	}
	
	space = space - spaceArrO;	
	
	return { area : space, length : length }; 
}
 

 




function fname_s_040(arrWall, Zoom)
{
	for ( var i = 0; i < arrWall.length; i ++ )
	{
		var wall = arrWall[i];		
		
		if(Zoom) { var v = wall.userData.wall.v; }		
		else { var v = wall.geometry.vertices; }
		
		if(wall.userData.wall.html.label)
		{
			var d1 = Math.abs( v[6].x - v[0].x );		
			var d2 = Math.abs( v[10].x - v[4].x );

			wall.userData.wall.html.label[0].textContent = Math.round(d1 * 100) / 100;
			wall.userData.wall.html.label[1].textContent = Math.round(d2 * 100) / 100;			
	
			 
			var p1 = wall.userData.wall.p[0].position;
			var p2 = wall.userData.wall.p[1].position;			 
			var dir = new THREE.Vector3().subVectors( p2, p1 );
			var rotY = Math.atan2(dir.x, dir.z);
			var pos = dir.divideScalar ( 2 ).add( p1 );
			
			if(rotY <= 0.001){ rotY += Math.PI / 2;  }
			else { rotY -= Math.PI / 2; }
			
			
			var x1 = p2.z - p1.z;
			var z1 = p1.x - p2.x;		 		 
			 
			var dir = new THREE.Vector3().addScaledVector( new THREE.Vector3(x1, 0, z1).normalize(), -v[0].z - 0.08 );
			var pos1 = new THREE.Vector3().addVectors( pos, dir );

			var dir = new THREE.Vector3().addScaledVector( new THREE.Vector3(x1, 0, z1).normalize(), -v[4].z + 0.08 );
			var pos2 = new THREE.Vector3().addVectors( pos, dir );
		 
			wall.userData.wall.html.label[0].userData.elem.pos = pos1;
			wall.userData.wall.html.label[1].userData.elem.pos = pos2;
			wall.userData.wall.html.label[0].userData.elem.rot = -rotY;
			wall.userData.wall.html.label[1].userData.elem.rot = -rotY;
			
			wall.userData.wall.html.label[0].style.transform = 'translate(-50%, -50%) rotate('+THREE.Math.radToDeg(-rotY)+'deg)';
			wall.userData.wall.html.label[1].style.transform = 'translate(-50%, -50%) rotate('+THREE.Math.radToDeg(-rotY)+'deg)';
			
			fname_s_0194({elem: wall.userData.wall.html.label[0]});
			fname_s_0194({elem: wall.userData.wall.html.label[1]});
			
		 
		}

		if(!Zoom)	
		{
			var v = wall.geometry.vertices; 
			wall.geometry.verticesNeedUpdate = true;
			
			for ( var i2 = 0; i2 < v.length; i2++ ) { wall.userData.wall.v[i2] = v[i2].clone(); }	
		}
	}
	
}



function fname_s_041(cdm)
{
	var wall = cdm.wall;		
	var v = wall.userData.wall.v;
	
	var d1 = Math.abs( v[6].x - v[0].x );		
	var d2 = Math.abs( v[10].x - v[4].x );

	if(wall.userData.wall.html.label)
	{
		wall.userData.wall.html.label[0].textContent = Math.round(d1 * 100) / 100;
		wall.userData.wall.html.label[1].textContent = Math.round(d2 * 100) / 100;
					
		fname_s_0194({elem: wall.userData.wall.html.label[0]});
		fname_s_0194({elem: wall.userData.wall.html.label[1]});
	}	
}




function fname_s_042( room ) 
{	 
	if(!infProject.settings.floor.o) { return; }	
	
	var contour = [];	
	
	for (var u = 0; u < room.length; u++)
	{  
		var arrW = room[u].userData.room.w; 
		var arrP = room[u].userData.room.p;  
		var arrS = room[u].userData.room.s;
		var n = room[u].userData.room.w.length;
		var res = 0;
		
		contour[u] = [];
		
		if(infProject.settings.floor.areaPoint == 'inside')
		{
			for (var i = 0; i < n; i++) { arrW[i].updateMatrixWorld(); }
			
			for (var i = 0; i < n; i++) 
			{
				var ch = (arrS[i] == 0) ? 4 : 6;				
				var p1 = arrW[i].localToWorld( arrW[i].userData.wall.v[ ch ].clone() );						
				
				if (i == 0) 
				{
					var num2 = n-1;
					var num3 = i+1;
				}
				else if (i == n-1)
				{
					var num2 = i-1;
					var num3 = 0;					
				}
				else
				{
					var num2 = i-1;
					var num3 = i+1;					
				}
				
				var ch1 = (arrS[ num2 ] == 0) ? 4 : 6;
				var ch2 = (arrS[ num3 ] == 0) ? 4 : 6;
				
				var p2 = arrW[num2].localToWorld( arrW[num2].userData.wall.v[ ch1 ].clone() );
				var p3 = arrW[num3].localToWorld( arrW[num3].userData.wall.v[ ch2 ].clone() );							

				contour[u][contour[u].length] = p1;
				
				var ch = (arrS[i] == 0) ? 10 : 0;					
				var p4 = arrW[i].localToWorld( arrW[i].userData.wall.v[ ch ].clone() );	
				
				
				
				if(!fname_s_021(p3, p4, {kof: 0.001}))
				{					
					contour[u][contour[u].length] = p4;
				}
			}
		}
		else
		{
			for (i = 0; i < arrW.length; i++)
			{
				var p1 = (arrS[i] == 0) ? arrW[i].userData.wall.p[0].position : arrW[i].userData.wall.p[1].position;	
				
				if (i == 0) 
				{
					var p2 = (arrS[ n-1 ] == 0) ? arrW[n-1].userData.wall.p[0].position : arrW[n-1].userData.wall.p[1].position; 
					var p3 = (arrS[ i+1 ] == 0) ? arrW[i+1].userData.wall.p[0].position : arrW[i+1].userData.wall.p[1].position;						
				}
				else if (i == n-1) 
				{
					var p2 = (arrS[ i-1 ] == 0) ? arrW[i-1].userData.wall.p[0].position : arrW[i-1].userData.wall.p[1].position;
					var p3 = (arrS[ 0 ] == 0) ? arrW[0].userData.wall.p[0].position : arrW[0].userData.wall.p[1].position;								
				}
				else 
				{
					var p2 = (arrS[ i-1 ] == 0) ? arrW[i-1].userData.wall.p[0].position : arrW[i-1].userData.wall.p[1].position; 
					var p3 = (arrS[ i+1 ] == 0) ? arrW[i+1].userData.wall.p[0].position : arrW[i+1].userData.wall.p[1].position; 						
				}
				
				contour[u][contour[u].length] = p1;				
			}			
		}
		
		room[u].userData.room.contour = contour[u];

		for (i = 0; i < contour[u].length; i++)
		{
			if (i == 0) 
			{
				var num2 = contour[u].length - 1;
				var num3 = i+1;
			}
			else if (i == contour[u].length - 1)
			{
				var num2 = i-1;
				var num3 = 0;					
			}
			else
			{
				var num2 = i-1;
				var num3 = i+1;					
			}
			
			var p1 = contour[u][i];
			var p3 = contour[u][num2];
			var p2 = contour[u][num3];
			
			var sum = p1.x*(p2.z - p3.z); 
			sum = Math.round(sum * 100) * 10;
			res += sum;				
		}
		
		res = Math.abs( res ) / 2;
		res = Math.round(res / 10) / 100;	
		
		room[u].updateMatrixWorld();
		room[u].geometry.computeBoundingSphere();
		var pos = room[u].localToWorld( room[u].geometry.boundingSphere.center.clone() );
					
		
		room[u].userData.room.areaTxt = res;
		
		if(res < 0.5) { res = ''; }
		
		if(infProject.settings.floor.label.visible) 
		{		
			var elem = room[u].userData.room.html.label;
			
			elem.userData.elem.pos = new THREE.Vector3(pos.x, 0.2, pos.z);			
			elem.style.transform = 'translate(-50%, -50%) rotate(0deg)';
			
			fname_s_0194({elem: elem});						
		}
	}

	return contour;
}




function fname_s_043( arrP )
{  
	var res = 0;
	var n = arrP.length;
	
	for (i = 0; i < n; i++) 
	{
		var p1 = arrP[i].position;
		
		if (i == 0)
		{
			var p2 = arrP[n-1].position;
			var p3 = arrP[i+1].position;					
		}
		else if (i == n-1)
		{
			var p2 = arrP[i-1].position;
			var p3 = arrP[0].position;			
		}
		else
		{
			var p2 = arrP[i-1].position;
			var p3 = arrP[i+1].position;			
		}
		
		res += p1.x*(p2.z - p3.z);
	}
	
	
	res = res / 2;
	res = Math.round(res * 10) / 10;
	
	return res;
}





 






function fname_s_044( obj ) 
{
	obj.updateMatrixWorld();
	obj.geometry.computeBoundingSphere();
	
	
	var pos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );
	pos.y = 1;
	
	var ray = new THREE.Raycaster();
	ray.set( pos, new THREE.Vector3(0, -1, 0) );
	
	var intersects = ray.intersectObjects( room, true );	
	
	var floor = (intersects.length == 0) ? null : intersects[0].object;				
	
	return { id : (floor) ? floor.userData.id : 0, obj : floor };
}



 



function fname_s_045(point) 
{
	var obj = point.userData.point.cross;
	
	if(!obj) return;
	
	if(point.userData.point.type == 'create_wall')
	{ 
		if(obj.userData.tag == 'planeMath') { fname_s_056( point ); } 
		else if(obj.userData.tag == 'point') { fname_s_053( point ); }
		else if(obj.userData.tag == 'wall') { fname_s_055( obj, point ); } 
	}
	else if(point.userData.point.type == 'continue_create_wall') 
	{ 
		if(obj.userData.tag == 'planeMath') { fname_s_053( point ); }
		else if(obj.userData.tag == 'wall') { fname_s_055( obj, point ); }
		else if(obj.userData.tag == 'point') { fname_s_053( point ); }
	}	
	else if(point.userData.point.type == 'add_point')
	{  
		if(obj.userData.tag == 'wall') { fname_s_055( obj, point ); } 
	}
	else
	{   
		if(!fname_s_047(point))
		{ 
			if(obj.userData.tag == 'planeMath') { fname_s_046(point); }
			else if(obj.userData.tag == 'point') { fname_s_053( point ); }
			else if(obj.userData.tag == 'wall') { fname_s_055( obj, point ); }	 		
		}
	}
	
	point.userData.point.cross = null;
}



function fname_s_046(point) 
{
	fname_s_0146(point.zone); 
	
	fname_s_038(param_wall.wallR);
}



function fname_s_047(point)
{
	var flag = false;
	var crossObj = point.userData.point.cross;
	
	if(crossObj.userData.tag == 'point' || crossObj.userData.tag == 'wall')
	{  
		if(point.w.length > 1)
		{
			if(Math.abs(point.position.y - crossObj.position.y) < 0.3) { flag = true; }			
		}		
	}
		
	
	if(fname_s_07(point)) { flag = true; }	
	
	
	if(flag)
	{
		fname_s_0111( point, param_wall.wallR ); 			
		
				
	}
	
	return flag;
}





function fname_s_048(point1, point2)
{
	var wall = null;
	
	for ( var i = 0; i < point1.p.length; i++ )
	{
		if(point1.p[i] == point2) { wall = point1.w[i]; break; }
	}

	return wall;
}




function fname_s_049()
{
	var wall = clickO.obj;
	clickO.obj = null;
	fname_s_0171();
	
	var pos1 = wall.userData.wall.p[0].position;
	var pos2 = wall.userData.wall.p[1].position;
	
	var pos = new THREE.Vector3().subVectors( pos2, pos1 ).divideScalar( 2 ).add(pos1); 
	var point = fname_s_0207( pos, 0 );
	
	fname_s_050( wall, point );
}



function fname_s_050( wall, point )
{	 
	clickO.move = null;					
	infProject.tools.axis[0].visible = false;
	infProject.tools.axis[1].visible = false;																
	  
	point.userData.point.last.cdm = 'add_point';
	
	var walls = fname_s_052( wall, point );	

	point.userData.point.type = null; 

	return point;
}




function fname_s_051(wall, posx)
{
	var arrL = [], arrR = [];
	
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{		
		var v = wall.worldToLocal( wall.userData.wall.arrO[i].position.clone() );
		
		if (v.x <= posx){ arrL[arrL.length] = wall.userData.wall.arrO[i]; }
		else { arrR[arrR.length] = wall.userData.wall.arrO[i]; }
	}	

	return { wall_1 : arrL, wall_2 : arrR };
}





function fname_s_052( wall, point )
{
	
	var width = wall.userData.wall.width;
	var height = wall.userData.wall.height_1;
	var offsetZ = wall.userData.wall.offsetZ;
	var material = wall.material; 
	var userData = wall.userData;
	var p1 = { id : wall.userData.wall.p[0].userData.id, pos : wall.userData.wall.p[0].position.clone() };
	var p2 = { id : wall.userData.wall.p[1].userData.id, pos : wall.userData.wall.p[1].position.clone() };
	
	 
	var arrW_2 = [];
	var point1 = wall.userData.wall.p[0];
	var point2 = wall.userData.wall.p[1];
	for ( var i = 0; i < point1.w.length; i++ ) { if(point1.w[i] == wall) { continue; } arrW_2[arrW_2.length] = point1.w[i]; }
	for ( var i = 0; i < point2.w.length; i++ ) { if(point2.w[i] == wall) { continue; } arrW_2[arrW_2.length] = point2.w[i]; }
	
	if(point.p.length > 0)
	{ 
		for ( var i = 0; i < point.p[0].w.length; i++ )
		{
			for ( var i2 = 0; i2 < arrW_2.length; i2++ )
			{
				if(point.p[0].w[i] == arrW_2[i2]) continue;
				
				arrW_2[arrW_2.length] = point.p[0].w[i]; break;
			}
		}		
	}
	var wallC = point.w[0];
	var point_0 = point.p[0];
	
	var arrW = (point.userData.point.last.cdm == 'add_point') ? [wall] : fname_s_0105(wallC);
	fname_s_037( arrW );	
	
	
	wall.updateMatrixWorld();
	var ps = wall.worldToLocal( point.position.clone() );	
	var wd = fname_s_051(wall, ps.x);	

	
	if(point.userData.point.last.cdm == 'new_point_2' || point.userData.point.last.cdm == 'new_point')
	{	
		var zone = fname_s_044( point.w[0] ).obj;
		var oldZ_1 = fname_s_0147(zone);
	}

	var v2 = wall.userData.wall.v;
	for ( var i2 = 0; i2 < wall.userData.wall.v.length; i2++ ) { v2[i2] = wall.userData.wall.v[i2].clone(); }

	var oldZones = fname_s_0167( wall );   	
	var oldZ = fname_s_0147( oldZones );
	fname_s_0160( oldZones );						
	
	fname_s_0135({wall: wall, delWD: false, upWall: false});  		
	
	
	var point1 = fname_s_0224( 'point', p1.id );
	var point2 = fname_s_0224( 'point', p2.id );	
	
	if(point1 == null) { point1 = fname_s_0207( p1.pos, p1.id ); }
	if(point2 == null) { point2 = fname_s_0207( p2.pos, p2.id ); }		
	
	
	var wall_1 = fname_s_0208({ p: [point1, point], width: width, offsetZ : offsetZ, height : height });	 			
	var wall_2 = fname_s_0208({ p: [point, point2], width: width, offsetZ : offsetZ, height : height });

	
	wall_1.material = [ material[0].clone(), material[1].clone(), material[2].clone(), material[3].clone() ];  
	wall_2.material = [ material[0].clone(), material[1].clone(), material[2].clone(), material[3].clone() ];
	wall_1.userData.material = userData.material; 
	wall_2.userData.material = userData.material; 
	
	for ( var i = 0; i < v2.length/2; i++ ) { wall_1.userData.wall.v[i] = v2[i].clone(); wall_1.geometry.vertices[i] = v2[i].clone(); }
	
	var sub = v2[8].x - wall_2.userData.wall.v[8].x;
	for ( var i = v2.length/2; i < v2.length; i++ ) { v2[i].x -= sub; } 
	for ( var i = v2.length/2; i < v2.length; i++ ) { wall_2.userData.wall.v[i] = v2[i].clone(); wall_2.geometry.vertices[i] = v2[i].clone(); }
	
	var arrW = (point.userData.point.last.cdm == 'add_point') ? [wall_1, wall_2] : fname_s_0105(wallC);
	
	if(point.userData.point.last.cdm == 'add_point')
	{
		fname_s_0107(point);
	}
	else
	{
		fname_s_0107(point);
		fname_s_0107(point_0);
	}
	
	fname_s_040(arrW); 	
	fname_s_038( arrW );
	
	var newZones = fname_s_0150();		
	
	
	var flag = false;
	if(point.userData.point.last.cdm == 'new_point_2' || point.userData.point.last.cdm == 'new_point') { if(zone) { flag = true; } }	
	
	if(flag) { fname_s_0166(newZones, oldZ_1[0], true); } 
	else { fname_s_0164(oldZ, newZones, 'add'); }		
	
	
	
	for ( var i = 0; i < wd.wall_1.length; i++ ) 
	{ 
		var obj = wd.wall_1[i];
		
		obj.userData.door.wall = wall_1;
		wall_1.userData.wall.arrO[wall_1.userData.wall.arrO.length] = obj; 
		
		objsBSP = { wall : wall_1, wd : fname_s_035( obj ) };				
		fname_s_036( obj, objsBSP ); 		
	} 
	
	for ( var i = 0; i < wd.wall_2.length; i++ ) 
	{ 
		var obj = wd.wall_2[i];
		
		obj.userData.door.wall = wall_2;
		wall_2.userData.wall.arrO[wall_2.userData.wall.arrO.length] = obj; 
		
		objsBSP = { wall : wall_2, wd : fname_s_035( obj ) };				
		fname_s_036( obj, objsBSP ); 	
	} 	
	
	
	return [wall_1, wall_2];
}









function fname_s_053( point )
{ 	
	if(Math.abs(point.position.y - point.userData.point.cross.position.y) > 0.3) { fname_s_046(point); return; }
	
	if(point.userData.point.type == 'create_wall')			
	{		 	
		var wall = fname_s_0208({ p: [point, point.userData.point.cross] }); 		 
		point.userData.point.type = 'continue_create_wall';
		point.userData.point.cross.userData.point.last.cdm = 'new_wall_from_point';
		clickO.move = point;
		fname_s_037( point.userData.point.cross.w );	
		
	}
	else if(point.userData.point.type == 'continue_create_wall') 
	{ 
		if(point.userData.point.cross == planeMath)		
		{	
			if(fname_s_07(point)) return; 	
			
			point.userData.point.type = null; 			
			var point2 = fname_s_0207( point.position, 0 );			
			var wall = fname_s_0208({ p: [point, point2] }); 			
			clickO.move = point2;
			fname_s_040( point.p[0].w );			
			point2.userData.point.type = 'continue_create_wall'; 

			if(point.p[0].userData.point.last.cdm == 'new_point_1' || point.p[0].userData.point.last.cdm == 'new_wall_from_point')
			{
				fname_s_038( point.p[0].w );				
			}			
			fname_s_0219( point.p[0].w[0] );
			
		} 
		else if(point.userData.point.cross.userData.tag == 'point')		
		{			
			if(point.userData.point.cross.userData.point.last.cdm == 'new_point_1' && clickO.move.userData.point.cross == point || point.userData.point.cross == point.p[0])
			{ 
				fname_s_0135({wall: point.w[0]});
				clickO.move = null;
				clickO = resetPop.clickO();
			}						
			else
			{
				fname_s_054(point);
			}			
		}
	} 
	else if(!point.userData.point.type) 	
	{ 	
		fname_s_054(point);		
	}

	param_wall.wallR = point.w;
}


function fname_s_054(point)
{	
	if(fname_s_047(point)) { return; }		

	fname_s_037( point.userData.point.cross.w );
	
	var wall = point.w[0];
	var point1 = point.userData.point.cross;
	var point2 = point.p[0];								

	var m = point1.p.length; 
	point1.p[m] = point2;
	point1.w[m] = wall;
	point1.start[m] = point.start[0];
	
	var m = point2.p.length; 
	point2.p[m] = point1;
	point2.w[m] = wall;
	point2.start[m] = (point.start[0] == 0) ? 1 : 0;
			
	var m = (wall.userData.wall.p[0] == point) ? 0 : 1;	
	wall.userData.wall.p[m] = point1;
	
	fname_s_0141(point2, wall);			
	fname_s_0142(point);
	scene.remove(point);

	fname_s_0107(point1);
	fname_s_040( point1.w ); 

	fname_s_0165(wall);   
	
	if(!point.userData.point.type) 
	{ 
		 		
		
		if(wall.userData.wall.p[0] == point1) { var p1 = [point1, point2]; var p2 = [point, point2]; }
		else { var p1 = [point2, point1]; var p2 = [point2, point]; }							 
	} 
	else if(point.userData.point.cross.userData.tag == 'point') 
	{ 
		 
	}	
	
	var arrW = [];
	for ( var i = 0; i < point1.w.length; i++ ) { arrW[arrW.length] = point1.w[i]; }
	
	
	if(1==1)	
	{
		for ( var i = 0; i < point2.w.length; i++ ) 
		{ 
			var flag = true;
			
			for ( var i2 = 0; i2 < arrW.length; i2++ ) 
			{
				if(point2.w[i] == arrW[i2]) { flag = false; break; }
			}
			
			if(flag) arrW[arrW.length] = point2.w[i];
		}		
	}
	
	fname_s_038( arrW );
	
	clickO.move = null;
}


 






function fname_s_055( wall, point )
{ 
	if(Math.abs(point.position.y - point.userData.point.cross.position.y) > 0.3) { fname_s_046(point); return; }
	
	if(point.userData.point.type == 'add_point')			
	{    
		fname_s_050( wall, point ); 
		
	}
	else if(point.userData.point.type == 'continue_create_wall')			
	{
						 

		point.userData.point.last.cdm = 'new_point_2'; 
		
		var arrW = fname_s_052( wall, point );
		
		
		point.userData.point.last.cross = 
		{ 
			walls : 
			{ 
				old : wall.userData.id,  
				new : 
				[ 
					{ id : arrW[0].userData.id, p2 : { id : arrW[0].userData.wall.p[0].userData.id } }, 
					{ id : arrW[1].userData.id, p2 : { id : arrW[1].userData.wall.p[1].userData.id }  } 
				] 
			} 
		};			
		
		point.userData.point.type = null; 		
		
		clickO.move = null; 		
	}
	else if(point.userData.point.type == 'create_wall')		
	{	
		
		point.userData.point.type = null;
		point.userData.point.last.cdm = 'new_point_1'; 
		var point1 = point;		
		var point2 = fname_s_0207( point.position.clone(), 0 );			 							
		
		point2.userData.point.cross = point1;
		
		var newWall = fname_s_0208({p: [point1, point2] }); 
		var arrW = fname_s_052( wall, point1 );
		
		
		point.userData.point.last.cross = 
		{ 
			walls : 
			{ 
				old : wall.userData.id,  
				new : 
				[ 
					{ id : arrW[0].userData.id, p2 : { id : arrW[0].userData.wall.p[0].userData.id } }, 
					{ id : arrW[1].userData.id, p2 : { id : arrW[1].userData.wall.p[1].userData.id }  } 
				] 
			} 
		};			
		
		fname_s_037( point1.w );

		clickO.move = point2;
		point2.userData.point.type = 'continue_create_wall'; 				 
	}
	else if(!point.userData.point.type)		
	{		
		 			
		
		var p1 = point.p[0];
		var selectWall = point.w[0];
		
		point.userData.point.last.cdm = 'new_point';
		
		var arrW = fname_s_052( wall, point );		 
		
		var arrW2 = p1.w;
		
		for ( var i = 0; i < p1.w.length; i++ ) 
		{ 
			var flag = true;
			
			for ( var i2 = 0; i2 < arrW2.length; i2++ ) 
			{
				if(p1.w[i] == arrW2[i2]) { flag = false; break; }
			}
			
			if(flag) arrW2[arrW2.length] = p1.w[i];
		}
		
		fname_s_038( arrW2 );	

		
		point.userData.point.last.cross = 
		{ 
			walls : 
			{ 
				old : wall.userData.id,  
				new : 
				[ 
					{ id : arrW[0].userData.id, p2 : { id : arrW[0].userData.wall.p[0].userData.id } }, 
					{ id : arrW[1].userData.id, p2 : { id : arrW[1].userData.wall.p[1].userData.id }  } 
				] 
			} 
		};		  	  
		
		clickO.move = null;
	}

	param_wall.wallR = point.w;
}






function fname_s_056( point1 )
{  		
	point1.userData.point.type = null;		
	var point2 = fname_s_0207( point1.position.clone(), 0 );			
	point2.userData.point.type = 'continue_create_wall';
	
	var wall = fname_s_0208({ p: [point1, point2] });		
	
	clickO.move = point2; 
	
	param_wall.wallR = [wall];
}





 






function fname_s_057(cdm)
{
	if(!cdm) { cdm = {} };
	
	var type = (cdm.type) ? cdm.type : 'door';
	
	var color = infProject.listColor.door2D;
	
	if(type == 'window'){ color = infProject.listColor.window2D; }
	else if(type == 'door'){ color = infProject.listColor.door2D; }
	
	var material = new THREE.MeshStandardMaterial({ color: color, transparent: true, opacity: 1.0, depthTest: false });
	
	
	if(myCameraOrbit.activeCam.userData.isCam2D)
	{ 
		material.depthTest = false;		
		material.opacity = 1.0; 	
	}
	else if(1 == 2)
	{ 		
		material.depthTest = true;
		material.opacity = 0;					
	}	
	
	var spline = [];			
	
	if(cdm.size)
	{
		var x = cdm.size.x/2;
		var y = cdm.size.y/2;
		
		spline[0] = new THREE.Vector2( -x, -y );	
		spline[1] = new THREE.Vector2( x, -y );
		spline[2] = new THREE.Vector2( x, y );
		spline[3] = new THREE.Vector2( -x, y );			
	}
	else if(type == 'window')
	{
		var x = infProject.settings.wind.width / 2;
		var y = infProject.settings.wind.height / 2;
		
		spline[0] = new THREE.Vector2( -x, -y );	
		spline[1] = new THREE.Vector2( x, -y );
		spline[2] = new THREE.Vector2( x, y );
		spline[3] = new THREE.Vector2( -x, y );		
	}
	else if(type == 'door')
	{  
		var x = infProject.settings.door.width / 2;
		var y = infProject.settings.door.height / 2;
		
		if(cdm.lotid === -2)
		{
			x = infProject.settings.gate.width / 2;
			y = infProject.settings.gate.height / 2;			
		}
		
		spline[0] = new THREE.Vector2( -x, -y );	
		spline[1] = new THREE.Vector2( x, -y );
		spline[2] = new THREE.Vector2( x, y );
		spline[3] = new THREE.Vector2( -x, y );		
	}
	else
	{
		return;
	}
	
	var shape = new THREE.Shape( spline );
	var obj = new THREE.Mesh( new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, depth: 0.2 } ), material );	
	
	var v = obj.geometry.vertices;
	
	var minX = [], maxX = [], minY = [], maxY = [], minZ = [], maxZ = [];
	
	for ( var i = 0; i < v.length; i++ )
	{
		v[i].z = Math.round(v[i].z * 100) / 100;
		if(v[i].z == 0) { minZ[minZ.length] = i; v[i].z = -0.1; }
		if(v[i].z == 0.2) { maxZ[maxZ.length] = i; v[i].z = 0.1; } 
	}
	
	obj.geometry.computeBoundingBox();	
	
	for ( var i = 0; i < v.length; i++ )
	{
		if(obj.geometry.boundingBox.min.x + 0.05 > v[i].x) { minX[minX.length] = i; }
		if(obj.geometry.boundingBox.max.x - 0.05 < v[i].x) { maxX[maxX.length] = i; }
		if(obj.geometry.boundingBox.min.y + 0.05 > v[i].y) { minY[minY.length] = i; }
		if(obj.geometry.boundingBox.max.y - 0.05 < v[i].y) { maxY[maxY.length] = i; }
	}
	
	
	var arr = { minX : minX, maxX : maxX, minY : minY, maxY : maxY, minZ : minZ, maxZ : maxZ };
	
	var form = { type : '' , v : arr };	
	
	obj.userData.tag = 'free_dw';
	obj.userData.door = {};
	obj.userData.door.type = type;
	obj.userData.door.size = new THREE.Vector3();
	obj.userData.door.form = form;
	obj.userData.door.bound = {}; 
	obj.userData.door.width = 0.2;
	obj.userData.door.h1 = 0;		
	obj.userData.door.color = obj.material.color; 
	obj.userData.door.wall = null;
	obj.userData.door.controll = {};
	obj.userData.door.ruler = {};
	obj.userData.door.last = { pos : new THREE.Vector3(), rot : new THREE.Vector3(), x : 0, y : 0 };
	obj.userData.door.topMenu = true;
	obj.userData.door.lotid = (cdm.lotid)? cdm.lotid : null;
	obj.userData.door.obj3D = null;
	obj.userData.door.openId = (cdm.openId !== undefined) ? cdm.openId : 0;
	obj.userData.door.svg = {};
	obj.userData.door.svg.el = fname_s_0298({count: 1, color: infProject.settings.svg.scaleBox.color, fill: '#ffffff', stroke_width: "1px"})[0];
	obj.userData.door.nameRus = (type === 'door') ? 'дверь' : 'окно';
	
	var fillColor = (type == 'door') ? '#e0e0e0' : '#ffffff';	
	if(cdm.lotid > 0) obj.userData.door.svg.path = fname_s_0298({count: 1, color: infProject.settings.svg.scaleBox.color, fill: fillColor, stroke_width: "1px"})[0];
	
	if(type == 'door' && cdm.lotid > 0)
	{
		obj.userData.door.svg.arc = fname_s_0299({count: 1, color: infProject.settings.svg.scaleBox.color})[0];
	}
	
	
	
	
	
	fname_s_062({obj: obj});
	
	
	
	if(1==1)
	{
		obj.geometry.computeBoundingBox();		
		var dX = obj.geometry.boundingBox.max.x - obj.geometry.boundingBox.min.x;
		var dY = obj.geometry.boundingBox.max.y - obj.geometry.boundingBox.min.y;			
		
		obj.userData.door.form.size = new THREE.Vector3(dX, dY, 1);
		
		var h1 = (type == 'window') ? infProject.settings.wind.h1 : 0;
		 
		obj.userData.door.h1 = h1 - obj.geometry.boundingBox.min.y; 

		
	}
		
	
	if(1==1)
	{
		var v2 = [];
		var v = obj.geometry.vertices;
		for ( var i = 0; i < v.length; i++ ) { v2[i] = v[i].clone(); }
		obj.userData.door.form.v2 = v2;		
	}
	
	fname_s_0206( obj );
	
	scene.add( obj );
	
	
	if(cdm.status)
	{
		obj.userData.id = cdm.id;
		obj.position.copy(cdm.pos);
		
		obj.position.y += (obj.geometry.boundingBox.max.y - obj.geometry.boundingBox.min.y) / 2; 	
		
		fname_s_065(obj, cdm.wall);		
		fname_s_060({ obj: obj });
	}
	else
	{
		clickO.move = obj; 
		clickO.last_obj = obj;		
	}
}



function fname_s_058( event, obj ) 
{ 
	var arrDp = [];
	
	var wall = infProject.scene.array.wall;
	var window = infProject.scene.array.window;
	var door = infProject.scene.array.door;
	
	for ( var i = 0; i < wall.length; i++ ){ arrDp[arrDp.length] = wall[i]; } 
	for ( var i = 0; i < window.length; i++ ){ arrDp[arrDp.length] = window[i]; } 
	for ( var i = 0; i < door.length; i++ ){ arrDp[arrDp.length] = door[i]; } 
	arrDp[arrDp.length] = planeMath; 

	var intersects = fname_s_0213( event, arrDp, 'arr' );
	
	var wall = null;
	
	var pos = new THREE.Vector3();
	obj.material.color = obj.userData.door.color;
	
	for ( var i = 0; i < intersects.length; i++ )
	{
		if (intersects[ i ].face != null) 
		{
			var object = intersects[ i ].object;
			
			if(object.userData.tag == 'planeMath'){ obj.position.copy( intersects[i].point ); } 			
			else if(object.userData.tag == 'wall')
			{ 
				wall = object; 
				obj.rotation.copy( wall.rotation ); 
				pos = intersects[i].point; 
			}
			else if(object.userData.tag == 'window' || object.userData.tag == 'door'){ obj.material.color = new THREE.Color(infProject.listColor.active2D); } 
		}
	}

	if(obj.material.color == new THREE.Color(infProject.listColor.active2D)) { obj.userData.door.wall = null; fname_s_062({obj: obj}); return; }
	if(!wall) { obj.userData.door.wall = null; fname_s_062({obj: obj}); return; }

	

	wall.updateMatrixWorld();			
	var pos = wall.worldToLocal( pos.clone() );	
	var pos = wall.localToWorld( new THREE.Vector3(pos.x, pos.y, 0 ) ); 	
	
	  
	if(myCameraOrbit.activeCam.userData.isCam3D) 
	{ 
		obj.position.set( pos.x, pos.y, pos.z ); 
	}
	else 
	{ 
		obj.position.set( pos.x, obj.userData.door.h1, pos.z ); 
	}		

	fname_s_065(obj, wall);

	fname_s_062({obj: obj});
}



function fname_s_059(obj)
{ 
	  
	if(obj)
	{    
		
		if(obj.userData.tag == 'free_dw') 
		{ 
			clickO.obj = obj;
			if(!obj.userData.door.wall) { return true; }
			
			clickO.last_obj = null;
			fname_s_060({ obj : obj });  
			return true; 
		}
	}

	return false;
}






async function fname_s_060({ obj })
{	
	var wall = obj.userData.door.wall;
	var pos = obj.position;
	obj.userData.tag = obj.userData.door.type;
	
	
	obj.position.copy( pos );
	obj.rotation.copy( wall.rotation ); 
	obj.material.transparent = false;
	
	
	if(myCameraOrbit.activeCam.userData.isCam2D)
	{ 
		obj.material.depthTest = false;
		obj.material.transparent = true;
		obj.material.opacity = 1.0; 		 	
	}
	else
	{ 		
		obj.material.depthTest = true;
		obj.material.transparent = true;
		obj.material.opacity = 0;					
	}	
	
	
	
	
	obj.geometry.computeBoundingBox(); 	
	obj.geometry.computeBoundingSphere();
  
	
	if(!obj.userData.id) { obj.userData.id = countId; countId++; }  
	
	if(obj.userData.tag == 'window') { infProject.scene.array.window[infProject.scene.array.window.length] = obj; }
	else if(obj.userData.tag == 'door') { infProject.scene.array.door[infProject.scene.array.door.length] = obj; }

	
	
	
	obj.updateMatrixWorld();
	
	wall.userData.wall.arrO[wall.userData.wall.arrO.length] = obj;
	
	obj.geometry.computeBoundingBox();
	obj.geometry.computeBoundingSphere();
	
	
	if(obj.userData.door.lotid > 0)
	{
		await fname_s_0256({type: 'wd', wd: obj, lotid: obj.userData.door.lotid});
	}
	else if(obj.userData.door.lotid === -2)
	{
		obj.userData.door.nameRus = 'гаражные ворота';
		let mat2 = new THREE.MeshStandardMaterial({ color: 0x000000, lightMap : lightMap_1 });
		let obj2 = new THREE.Mesh( obj.geometry.clone(), mat2 );
		
		for ( let i = 0; i < obj2.geometry.vertices.length; i++ )
		{
			let z = obj2.geometry.vertices[i].z;
			obj2.geometry.vertices[i].z = (z < 0) ? -0.01 : 0.01;
		}
		obj2.geometry.verticesNeedUpdate = true;
		fname_s_0214({obj: obj2, material: { img: "img/load/proflist_1.jpg" } });
		
		fname_s_064({obj: obj2}, {wd: obj});
		mat2.visible = true;	
	}
	else
	{
		obj.userData.door.nameRus = 'проем';
	}
	
	
	fname_s_062({obj: obj});	
 	
	clickO.obj = null;
	clickO.last_obj = null;
	clickO.move = null;
	
	
	
	if(1==1)
	{  
		let objsBSP = { wall: wall, wd: fname_s_035( obj ) };		
		fname_s_036( obj, objsBSP ); 
	}	
	
	renderCamera();
}




function fname_s_061(cdm)
{
	var obj = cdm.obj;
	var type = cdm.type;
	
	if(!obj.userData.door) return;
	
	if(type == 'r-l')
	{		
		if(obj.userData.door.openId == 0 || obj.userData.door.openId == 1)
		{
			obj.userData.door.openId = (obj.userData.door.openId == 0) ? 1 : 0;
		}
		else if(obj.userData.door.openId == 2 || obj.userData.door.openId == 3)
		{
			obj.userData.door.openId = (obj.userData.door.openId == 3) ? 2 : 3;
		}		
	}
	else if(type == 't-b')
	{
		if(obj.userData.door.openId == 2 || obj.userData.door.openId == 3)
		{
			obj.userData.door.openId = (obj.userData.door.openId == 2) ? 0 : 1;
		}
		else if(obj.userData.door.openId == 0 || obj.userData.door.openId == 1)
		{
			obj.userData.door.openId = (obj.userData.door.openId == 0) ? 2 : 3;
		}		
	}
	
	fname_s_062({obj: obj});
	fname_s_063({wd: obj});
	
	
	if(obj.children.length > 0 && obj.children[0].userData.contour && obj.children[0].userData.contour.length > 0)
	{	
		const wallClone = new THREE.Mesh();
		wallClone.geometry = fname_s_034( obj ).geometry.clone(); 
		wallClone.position.copy( obj.userData.door.wall.position ); 
		wallClone.rotation.copy( obj.userData.door.wall.rotation );

		const objsBSP = { wall: wallClone, wd: fname_s_035( obj ) };		
		fname_s_036( obj, objsBSP ); 
	}
	
	renderCamera();
}





function fname_s_062(cdm)
{
	if(!myCameraOrbit.activeCam.userData.isCam2D) return;
	
	var obj = cdm.obj;
	var openId = obj.userData.door.openId;	
	
	obj.updateMatrixWorld();
	
	
	{
		var v = [];
		var bound = obj.geometry.boundingBox;
		
		v[0] = obj.localToWorld( new THREE.Vector3(bound.min.x, 0, bound.max.z) );	
		v[1] = obj.localToWorld( new THREE.Vector3(bound.max.x, 0, bound.max.z) );	
		v[2] = obj.localToWorld( new THREE.Vector3(bound.min.x, 0, bound.min.z) );	
		v[3] = obj.localToWorld( new THREE.Vector3(bound.max.x, 0, bound.min.z) );	
		 
		fname_s_0306([obj.userData.door.svg.el]);	
		fname_s_0302({el: obj.userData.door.svg.el, arrP: [v[0], v[1], v[3], v[2], v[0]]}); 
	}

	
	if(obj.userData.door.svg.arc)
	{
		var posArcStart = new THREE.Vector3().subVectors( v[0], v[2] ).divideScalar( 2 ).add(v[2]);
		
		if(openId == 2 || openId == 3)
		{
			var posArcStart = new THREE.Vector3().subVectors( v[1], v[3] ).divideScalar( 2 ).add(v[3]);
		}
	}

	
	if(obj.userData.door.svg.path)
	{
		var minZ = (bound.min.z < -0.05) ? -0.05 : bound.min.z;
		var maxZ = (bound.max.z > 0.05) ? 0.05 : bound.max.z;
		
		v[0] = new THREE.Vector3(bound.min.x, 0, maxZ);	
		v[1] = new THREE.Vector3(bound.max.x, 0, maxZ);	
		v[2] = new THREE.Vector3(bound.min.x, 0, minZ);	
		v[3] = new THREE.Vector3(bound.max.x, 0, minZ); 
		
		
		if(obj.userData.tag == 'door')
		{
			var dist = [];
			dist[0] = bound.max.x - bound.min.x;
			dist[1] = (maxZ - minZ)/2;
			dist[2] = bound.max.x - bound.min.x;
			dist[3] = (maxZ - minZ)/2;
			
			var v0 = new THREE.Vector3((bound.max.x - bound.min.x)/2, 0, (maxZ - minZ)/2 + minZ);
			var v1 = (maxZ - minZ)/2;
			var offX = 0;
			
			if(openId == 2 || openId == 3)
			{
				var v0 = new THREE.Vector3((bound.max.x - bound.min.x)/2, 0, (maxZ - minZ)/2 + minZ);
				var v1 = -(maxZ - minZ)/2;
				var offX = bound.min.x * 2;
			}
			
			
			for(var i = 0; i < v.length; i++)
			{				
				var radXZ = Math.atan2(v[i].x - v0.x, v[i].z - v0.z);
				
				if(openId == 0) { radXZ += Math.PI/2; }
				else if(openId == 1) { radXZ -= Math.PI/2; }
				else if(openId == 2) { radXZ += Math.PI/2; }
				else if(openId == 3) { radXZ -= Math.PI/2; }
				
				v[i].x = Math.sin(radXZ)*dist[i] + v0.x - v1 + offX;
				v[i].z = Math.cos(radXZ)*dist[i] + v0.z;
			}
		}
		
		for(var i = 0; i < v.length; i++)
		{
			v[i] = obj.localToWorld( v[i].clone() );
		}				
		
		fname_s_0306([obj.userData.door.svg.path]); 		
		fname_s_0302({el: obj.userData.door.svg.path, arrP: [v[0], v[1], v[3], v[2], v[0]]});
		
		
		var posArcEnd = v[2].clone();
		
		if(openId == 1 || openId == 2)
		{
			var posArcEnd = v[0].clone();
		}
	}
	
	
	if(obj.userData.door.svg.arc)
	{
		var param = {p2: posArcEnd, p1: posArcStart};
		
		if(openId == 0 || openId == 3) { var param = {p2: posArcEnd, p1: posArcStart}; }
		else if(openId == 1 || openId == 2) { var param = {p2: posArcStart, p1: posArcEnd}; }
		
		fname_s_0306([obj.userData.door.svg.arc]);
		fname_s_0303({el: obj.userData.door.svg.arc, param: param});
	}
	
	
}




function fname_s_063(cdm)
{
	var wd = cdm.wd;		
	var obj3D = wd.userData.door.obj3D;
	
	if(!obj3D) return;
		
	
	var openId = wd.userData.door.openId;	
	
	
	

	
	if(openId == 0)
	{
		obj3D.scale.set(Math.abs(obj3D.scale.x), obj3D.scale.y, Math.abs(obj3D.scale.z)); 
	}
	else if(openId == 1) 
	{ 
		obj3D.scale.set(Math.abs(obj3D.scale.x), obj3D.scale.y, -Math.abs(obj3D.scale.z)); 
	}
	else if(openId == 2) 
	{ 
		obj3D.scale.set(-Math.abs(obj3D.scale.x), obj3D.scale.y, Math.abs(obj3D.scale.z)); 
	}
	else if(openId == 3) 
	{ 
		obj3D.scale.set(-Math.abs(obj3D.scale.x), obj3D.scale.y, -Math.abs(obj3D.scale.z)); 
	}
}




function fname_s_064(inf, cdm)
{
	var wd = cdm.wd;
	var obj3D = inf.obj;
	
	obj3D.material.visible = false;
	
	wd.add( obj3D );
	
	
	fname_s_0261({obj: wd});	
	
	wd.userData.door.obj3D = obj3D;
	
	wd.updateMatrixWorld();
	var centerWD = wd.geometry.boundingSphere.center.clone();	

	obj3D.updateMatrixWorld();
	obj3D.geometry.computeBoundingBox();
	obj3D.geometry.computeBoundingSphere();
	
	var center = obj3D.geometry.boundingSphere.center;	
	
	obj3D.position.set(0,0,0);
	obj3D.rotation.set(0,0,0);
	
	
	
	if(myCameraOrbit.activeCam.userData.isCam2D)
	{
		obj3D.visible = false;
	}

	
	if(1==1)
	{
		wd.updateMatrixWorld();
		wd.geometry.computeBoundingBox();
		wd.geometry.computeBoundingSphere();
		var x = wd.geometry.boundingBox.max.x - wd.geometry.boundingBox.min.x;
		var y = wd.geometry.boundingBox.max.y - wd.geometry.boundingBox.min.y;		
		
		obj3D.geometry.computeBoundingBox();		
		var dX = obj3D.geometry.boundingBox.max.x - obj3D.geometry.boundingBox.min.x;
		var dY = obj3D.geometry.boundingBox.max.y - obj3D.geometry.boundingBox.min.y;				
		
		obj3D.scale.set(x/dX, y/dY, 1);			
	}
	
	fname_s_063({wd: wd});
}




function fname_s_065(obj, wall)
{
	if(obj.userData.door.wall == wall) return;
	
	
	var v = obj.geometry.vertices;
	var minZ = obj.userData.door.form.v.minZ; 
	var maxZ = obj.userData.door.form.v.maxZ;
	
	var width = wall.userData.wall.width; 
	wall.geometry.computeBoundingBox();
	
	for ( var i = 0; i < minZ.length; i++ ) { v[minZ[i]].z = wall.geometry.boundingBox.min.z; }
	for ( var i = 0; i < maxZ.length; i++ ) { v[maxZ[i]].z = wall.geometry.boundingBox.max.z; }
	
	obj.geometry.verticesNeedUpdate = true; 
	obj.geometry.elementsNeedUpdate = true;
	obj.geometry.computeBoundingSphere();
	obj.geometry.computeBoundingBox();	
	obj.geometry.computeFaceNormals();		
	
	obj.userData.door.width = width;
	obj.userData.door.wall = wall;	
} 
 


 



function fname_s_066(cdm)
{
	var event = cdm.event;
	var elem = cdm.elem;
	
	var pos = fname_s_0212(event);
	
	clickO.elem = elem;
	
	var circle = infProject.svg.furn.boxCircle.elem;
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	var inf = { };
	
	if(elem == circle[0])
	{
		inf.start = circle[5];
		inf.x = { o2: circle[3], o1: circle[5] };
		inf.z = { o2: circle[2], o1: circle[5] };
		
		inf.half = [];		
		inf.half[0] = {el: circle[1], p:[circle[0], circle[2]]};
		inf.half[1] = {el: circle[4], p:[circle[3], circle[5]]};
		inf.half[2] = {el: circle[6], p:[circle[0], circle[3]]};
		inf.half[3] = {el: circle[7], p:[circle[2], circle[5]]};
	}
	else if(elem == circle[1])
	{
		inf.start = circle[4];
		inf.x = { o2: circle[0], o1: circle[3] };
		inf.z = { o2: circle[2], o1: circle[5] };
		
		inf.half = [];		
		inf.half[0] = {el: circle[6], p:[circle[0], circle[3]]};
		inf.half[1] = {el: circle[7], p:[circle[2], circle[5]]};		
	}
	else if(elem == circle[2])
	{
		inf.start = circle[3];
		inf.x = { o2: circle[0], o1: circle[3] };
		inf.z = { o2: circle[5], o1: circle[3] };
		
		inf.half = [];		
		inf.half[0] = {el: circle[1], p:[circle[0], circle[2]]};
		inf.half[1] = {el: circle[4], p:[circle[3], circle[5]]};
		inf.half[2] = {el: circle[6], p:[circle[0], circle[3]]};
		inf.half[3] = {el: circle[7], p:[circle[2], circle[5]]};		
	}
	else if(elem == circle[3])
	{
		inf.start = circle[2];
		inf.x = { o2: circle[0], o1: circle[2] };
		inf.z = { o2: circle[5], o1: circle[2] };
		
		inf.half = [];		
		inf.half[0] = {el: circle[1], p:[circle[0], circle[2]]};
		inf.half[1] = {el: circle[4], p:[circle[3], circle[5]]};
		inf.half[2] = {el: circle[6], p:[circle[0], circle[3]]};
		inf.half[3] = {el: circle[7], p:[circle[2], circle[5]]};		
	}
	else if(elem == circle[4])
	{
		inf.start = circle[1];
		inf.x = { o2: circle[3], o1: circle[0] };
		inf.z = { o2: circle[5], o1: circle[2] };
		
		inf.half = [];		
		inf.half[0] = {el: circle[6], p:[circle[0], circle[3]]};
		inf.half[1] = {el: circle[7], p:[circle[2], circle[5]]};			
	}
	else if(elem == circle[5])
	{
		inf.start = circle[0];
		inf.x = { o2: circle[2], o1: circle[0] };
		inf.z = { o2: circle[3], o1: circle[0] };
		
		inf.half = [];		
		inf.half[0] = {el: circle[1], p:[circle[0], circle[2]]};
		inf.half[1] = {el: circle[4], p:[circle[3], circle[5]]};
		inf.half[2] = {el: circle[6], p:[circle[0], circle[3]]};
		inf.half[3] = {el: circle[7], p:[circle[2], circle[5]]};		
	}
	else if(elem == circle[6])
	{
		inf.start = circle[7];
		inf.x = { o2: circle[0], o1: circle[2] };
		inf.z = { o2: circle[3], o1: circle[5] };
		
		inf.half = [];		
		inf.half[0] = {el: circle[1], p:[circle[0], circle[2]]};
		inf.half[1] = {el: circle[4], p:[circle[3], circle[5]]};		
	}
	else if(elem == circle[7])
	{
		inf.start = circle[6];
		inf.x = { o2: circle[2], o1: circle[0] };
		inf.z = { o2: circle[5], o1: circle[3] };
		
		inf.half = [];		
		inf.half[0] = {el: circle[1], p:[circle[0], circle[2]]};
		inf.half[1] = {el: circle[4], p:[circle[3], circle[5]]};		
	}
	

	
	
	
	elem.userData.svg.circle.inf = {x: {}, z: {}, start: {}};
	
	elem.userData.svg.circle.inf.start.el = inf.start;
	elem.userData.svg.circle.inf.start.dir = new THREE.Vector2(elem.cx.baseVal.value - inf.start.cx.baseVal.value, elem.cy.baseVal.value - inf.start.cy.baseVal.value).normalize();
	
	elem.userData.svg.circle.inf.x.el = inf.x.o2;
	elem.userData.svg.circle.inf.x.dir = new THREE.Vector2(inf.x.o2.cx.baseVal.value - inf.x.o1.cx.baseVal.value, inf.x.o2.cy.baseVal.value - inf.x.o1.cy.baseVal.value).normalize();
	
	elem.userData.svg.circle.inf.z.el = inf.z.o2;
	elem.userData.svg.circle.inf.z.dir = new THREE.Vector2(inf.z.o2.cx.baseVal.value - inf.z.o1.cx.baseVal.value, inf.z.o2.cy.baseVal.value - inf.z.o1.cy.baseVal.value).normalize();

	elem.userData.svg.circle.inf.half = inf.half;
}





function fname_s_067(e)
{
	var elem = clickO.elem;
	var pos = fname_s_0212(e);
	
	var inf = elem.userData.svg.circle.inf;
	
	
	if(1==1)
	{
		var el = inf.start.el;
		var dir = inf.start.dir; 		
		
		var A = new THREE.Vector3(el.cx.baseVal.value, 0, el.cy.baseVal.value);
		var B = new THREE.Vector3(dir.x + el.cx.baseVal.value, 0, dir.y + el.cy.baseVal.value);
		var C = new THREE.Vector3(pos.x, 0, pos.y);
		
		var pos = fname_s_017(A,B,C);
		
		
		
		elem.setAttributeNS(null, "cx", pos.x);
		elem.setAttributeNS(null, "cy", pos.z);						
	}

	
	if(inf.x)
	{
		var el = inf.x.el;
		var dir = inf.x.dir;
		
		var A = new THREE.Vector3(el.cx.baseVal.value, 0, el.cy.baseVal.value);
		var B = new THREE.Vector3(dir.x + el.cx.baseVal.value, 0, dir.y + el.cy.baseVal.value);
		var C = pos;
		
		var pos2 = fname_s_017(A,B,C);	

		el.setAttributeNS(null, "cx", pos2.x);
		el.setAttributeNS(null, "cy", pos2.z);
	}

	
	if(inf.z)
	{
		var el = inf.z.el;
		var dir = inf.z.dir;
		
		var A = new THREE.Vector3(el.cx.baseVal.value, 0, el.cy.baseVal.value);
		var B = new THREE.Vector3(dir.x + el.cx.baseVal.value, 0, dir.y + el.cy.baseVal.value);
		var C = pos;
		
		var pos2 = fname_s_017(A,B,C);	

		el.setAttributeNS(null, "cx", pos2.x);
		el.setAttributeNS(null, "cy", pos2.z);
	}

	
	if(inf.half)
	{
		for ( var i = 0; i < inf.half.length; i++ )
		{
			var el = inf.half[i].el;
			
			var A = new THREE.Vector2(inf.half[i].p[0].cx.baseVal.value, inf.half[i].p[0].cy.baseVal.value);
			var B = new THREE.Vector2(inf.half[i].p[1].cx.baseVal.value, inf.half[i].p[1].cy.baseVal.value);
			
			var pos2 = new THREE.Vector2().subVectors( B, A ).divideScalar( 2 ).add(A);
			
			el.setAttributeNS(null, "cx", pos2.x);
			el.setAttributeNS(null, "cy", pos2.y);			
		}
	}
	
	
	
	{
		var circle = infProject.svg.furn.boxCircle.elem;	

		var x = ( ( circle[2].cx.baseVal.value - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
		var y = - ( ( circle[2].cy.baseVal.value - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
		var A = new THREE.Vector3(x, y, -1);
		
		var x = ( ( circle[3].cx.baseVal.value - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
		var y = - ( ( circle[3].cy.baseVal.value - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
		var B = new THREE.Vector3(x, y, -1);
		
		var x = ( ( circle[5].cx.baseVal.value - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
		var y = - ( ( circle[5].cy.baseVal.value - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
		var C = new THREE.Vector3(x, y, -1);	
		
		
		const cam2D = myCameraOrbit.activeCam;
		A.unproject(cam2D);
		B.unproject(cam2D);
		C.unproject(cam2D);
		
		var z = A.distanceTo( C );
		var x = B.distanceTo( C );
		
		
		var obj = clickO.last_obj;
		if(obj.userData.tag === 'obj') box = obj.userData.obj3D.box;
		if(obj.userData.tag === 'roof') box = obj.userData.roof.box;
		
		obj.scale.x = x/box.x;
		obj.scale.z = z/box.z;		
	}
	
	
	
	{
		var posCenter = new THREE.Vector3().subVectors( B, A ).divideScalar( 2 ).add(A);
		
		obj.position.x = posCenter.x;
		obj.position.z = posCenter.z;			
	}
	
	
	
	var pos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );
	infProject.tools.pivot.position.copy(pos);
	infProject.tools.gizmo.position.copy(pos);
	
	fname_s_069({obj: obj});
	
	fname_s_0239({obj: obj});
	
	e.stopPropagation();	
}





function fname_s_068() 
{
	var obj = clickO.last_obj;
	
	if(!obj) return;
	
	if(obj.userData.tag === 'obj')
	{
		fname_s_0260({obj})
	}
	
	if(obj.userData.tag === 'roof')
	{
		myRoof.upDateTextureRoof({obj})
	}	
	
	fname_s_069({obj: obj, boxCircle: true});
	
	clickO.elem = null;
}






function fname_s_069(cdm)
{
	
	
	var obj = cdm.obj;
		
	let tag = obj.userData.tag;
	
	if(cdm.resetPos)
	{
		infProject.calc.boxScale2D.pos2D = null;
		infProject.calc.boxScale2D.pos3D = null;		
	}
	
	if(cdm.setPos && 1==2)
	{
		fname_s_070(cdm);
		
		return;
	}

	obj.updateMatrixWorld();
	obj.geometry.computeBoundingBox();	
	
	
	
	{
		var html = infProject.html.furn.size;
		
		if(infProject.svg.furn.size.show && myCameraOrbit.activeCam.userData.isCam2D)
		{
			fname_s_0309(html);
			fname_s_0306(infProject.svg.furn.size.elem);
		}
		
		var x1 = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.min.x, 0, obj.geometry.boundingBox.max.z + 0.14 / obj.scale.z) );
		var x2 = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.max.x, 0, obj.geometry.boundingBox.max.z + 0.14 / obj.scale.z) );
		var z1 = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.min.x - 0.14 / obj.scale.x, 0, obj.geometry.boundingBox.min.z) );
		var z2 = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.min.x - 0.14 / obj.scale.x, 0, obj.geometry.boundingBox.max.z) );	
		
		var sizeX = x1.distanceTo( x2 );
		var sizeZ = z1.distanceTo( z2 );
		
		fname_s_0300({el: infProject.svg.furn.size.elem[0], point: [x1, x2]});
		fname_s_0300({el: infProject.svg.furn.size.elem[1], point: [z1, z2]});
		
		
		var dir = new THREE.Vector3().subVectors( x2, x1 );
		var rotY = Math.atan2(dir.x, dir.z);		
		if(rotY <= 0.001){ rotY += Math.PI / 2;  }
		else { rotY -= Math.PI / 2; }		
		
		var posLabel = new THREE.Vector3().subVectors( x2, x1 ).divideScalar( 2 ).add(x1); 
		html[0].userData.elem.pos = posLabel;	
		html[0].style.transform = 'translate(-50%, -50%) rotate('+THREE.Math.radToDeg(-rotY)+'deg)';
		html[0].textContent = Math.round(sizeX * 100) / 100 + '';
		html[0].userData.elem.rot = -rotY;
		fname_s_0194({elem: html[0]});


		var dir = new THREE.Vector3().subVectors( z2, z1 );
		var rotY = Math.atan2(dir.x, dir.z);		
		if(rotY <= 0.001){ rotY += Math.PI / 2;  }
		else { rotY -= Math.PI / 2; }
		
		var posLabel = new THREE.Vector3().subVectors( z2, z1 ).divideScalar( 2 ).add(z1); 
		html[1].userData.elem.pos = posLabel;	
		html[1].style.transform = 'translate(-50%, -50%) rotate('+THREE.Math.radToDeg(-rotY)+'deg)';
		html[1].textContent = Math.round(sizeZ * 100) / 100 + '';
		html[1].userData.elem.rot = -rotY;
		fname_s_0194({elem: html[1]});		
	}
	
	
	
	{
		var v = [];
		v[0] = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.min.x, 0, obj.geometry.boundingBox.max.z) );	
		v[1] = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.max.x, 0, obj.geometry.boundingBox.max.z) );	
		v[2] = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.min.x, 0, obj.geometry.boundingBox.min.z) );	
		v[3] = obj.localToWorld( new THREE.Vector3(obj.geometry.boundingBox.max.x, 0, obj.geometry.boundingBox.min.z) );	
		
		var box1 = infProject.svg.furn.box1;
		
		if(myCameraOrbit.activeCam.userData.isCam2D) { fname_s_0306([box1]); }	
		
		fname_s_0302({el: box1, arrP: [v[0], v[1], v[3], v[2], v[0]]});		
	}
	
	
	
	
	if(cdm.boxCircle)
	{
		var circle = infProject.svg.furn.boxCircle.elem;
		
		if(infProject.svg.furn.boxCircle.show && myCameraOrbit.activeCam.userData.isCam2D) { fname_s_0306(circle); }
		
		
		
		
		
		
		
		
		
		
		
		
		
		fname_s_0301({el: circle[0], pos: v[2]});
		fname_s_0301({el: circle[1], pos: new THREE.Vector3().subVectors( v[3], v[2] ).divideScalar( 2 ).add(v[2])});
		fname_s_0301({el: circle[2], pos: v[3]});
		
		
		fname_s_0301({el: circle[3], pos: v[0]});
		fname_s_0301({el: circle[4], pos: new THREE.Vector3().subVectors( v[1], v[0] ).divideScalar( 2 ).add(v[0])});
		fname_s_0301({el: circle[5], pos: v[1]});		
		
		
		fname_s_0301({el: circle[6], pos: new THREE.Vector3().subVectors( v[2], v[0] ).divideScalar( 2 ).add(v[0])});
		
		
		fname_s_0301({el: circle[7], pos: new THREE.Vector3().subVectors( v[3], v[1] ).divideScalar( 2 ).add(v[1])});		
	}	

	let svgBox2 = (tag === 'roof') ? false : true;
	
	
	{
		var bound = { min : { x : 999999, z : 999999 }, max : { x : -999999, z : -999999 } };
		
		for(var i = 0; i < v.length; i++)
		{
			if(v[i].x < bound.min.x) { bound.min.x = v[i].x; }
			if(v[i].x > bound.max.x) { bound.max.x = v[i].x; }
			if(v[i].z < bound.min.z) { bound.min.z = v[i].z; }
			if(v[i].z > bound.max.z) { bound.max.z = v[i].z; }		
		}			
		
		
		var box2 = infProject.svg.furn.box2;
		
		var p1 = new THREE.Vector3(bound.min.x, 0, bound.min.z);	
		var p2 = new THREE.Vector3(bound.max.x, 0, bound.min.z);	
		var p3 = new THREE.Vector3(bound.max.x, 0, bound.max.z);	
		var p4 = new THREE.Vector3(bound.min.x, 0, bound.max.z);	
		
		if(myCameraOrbit.activeCam.userData.isCam2D && svgBox2) 
		{ 
			fname_s_0306([box2]); 
			fname_s_0302({el: box2, arrP: [p1, p2, p3, p4, p1]});
		}	
	}
	
	let svgRoulette = (tag === 'roof') ? false : true;
	
	
	if(svgRoulette)
	{
		var floor = null;
		
		for ( var i = 0; i < infProject.scene.array.floor.length; i++ )
		{
			var ray = new THREE.Raycaster();
			ray.set( new THREE.Vector3(obj.position.x, 1, obj.position.z), new THREE.Vector3(0, -1, 0) );
			
			var intersects = ray.intersectObject( infProject.scene.array.floor[i] );	
			
			if(intersects[0]) { floor = intersects[0].object; break; }							
		}
		
	
		
		if(floor)
		{	
			if(cdm.getObjRoom)
			{
				var arrO = fname_s_071({ignoreObj: obj, floor: floor});		
				infProject.calc.boxScale2D.arrO = arrO;				
			}
			else
			{
				var arrO = infProject.calc.boxScale2D.arrO;
			}
			
			var arrN = [];
			
			var p1 = new THREE.Vector3(bound.min.x, 0, bound.min.z);	
			var p2 = new THREE.Vector3(bound.max.x, 0, bound.min.z);	
			var p3 = new THREE.Vector3(bound.max.x, 0, bound.max.z);	
			var p4 = new THREE.Vector3(bound.min.x, 0, bound.max.z);	

			
			var posTop = new THREE.Vector3().subVectors( p2, p1 ).divideScalar( 2 ).add(p1); 
			var posBottom = new THREE.Vector3().subVectors( p3, p4 ).divideScalar( 2 ).add(p4);
			var posLeft = new THREE.Vector3().subVectors( p1, p4 ).divideScalar( 2 ).add(p4);
			var posRight = new THREE.Vector3().subVectors( p2, p3 ).divideScalar( 2 ).add(p3);
			
			var offsetLine = infProject.svg.furn.offset.elem;
			var offsetLabel = infProject.html.furn.offset;
			
			var contour = floor.userData.room.contour;
			
			var arr = [];
			
			arr[0] = {line: offsetLine[0], posStart: posTop, dir: new THREE.Vector3(0,0,-1), html: offsetLabel[0]};
			arr[1] = {line: offsetLine[1], posStart: posBottom, dir: new THREE.Vector3(0,0,1), html: offsetLabel[1]};
			arr[2] = {line: offsetLine[2], posStart: posLeft, dir: new THREE.Vector3(-1,0,0), html: offsetLabel[2]};
			arr[3] = {line: offsetLine[3], posStart: posRight, dir: new THREE.Vector3(1,0,0), html: offsetLabel[3]};
			
			var pos3 = new THREE.Vector3();
			
			for ( var n = 0; n < arr.length; n++ )
			{
				
				var dir = arr[n].dir;
				var posStart = arr[n].posStart;
				var line = arr[n].line;
				var html = arr[n].html;
				
				fname_s_0307([line]);
				fname_s_0310([html]);
				
				
				var min = 9999999;
				var pos2 = null;
				var posIntr = null;
				
				for ( var i = 0; i < contour.length; i++ )
				{
					var i2 = (contour.length - 1 == i) ? 0 : i+1;

					
					var res = fname_s_010(posStart, posStart.clone().add(dir), contour[i], contour[i2]);								
					
					if(!res[1])	
					{
						var posEnd = res[0].clone().add( new THREE.Vector3().addScaledVector(dir, 0.1) );
						
						
						if(fname_s_013(posStart, posEnd, contour[i], contour[i2])) 
						{	
							var dist = res[0].distanceTo(posStart);
							
							if(min > dist)
							{
								pos2 = res[0];
								
								min = dist;
							}
						}
					}				
				}
				
				
				
				if(!pos2)
				{
					for ( var i = 0; i < contour.length; i++ )
					{
						var i2 = (contour.length - 1 == i) ? 0 : i+1;

						
						var res = fname_s_010(posStart, posStart.clone().add(dir), contour[i], contour[i2]);								
						
						if(!res[1])	
						{
							var posEnd = res[0].clone().add( new THREE.Vector3().addScaledVector(dir, -0.1) );
							
							
							if(fname_s_013(posStart, posEnd, contour[i], contour[i2])) 
							{	
								var dist = res[0].distanceTo(posStart);
								
								if(min > dist)
								{
									pos2 = res[0];
									
									min = dist;
								}
							}
						}				
					}

				}
				
				
				for ( var i = 0; i < arrO.length; i++ )
				{
					var v = arrO[i].v;
					
					for ( var i2 = 0; i2 < v.length; i2++ )
					{
						var i3 = (v.length - 1 == i2) ? 0 : i2+1;
						
						
						
						var res = fname_s_010(posStart, posStart.clone().add(dir), v[i2], v[i3]);								
						
						if(!res[1])	
						{
							var posEnd = res[0].clone().add( new THREE.Vector3().addScaledVector(dir, 0.1) );
	
							
							if(fname_s_013(posStart, posEnd, v[i2], v[i3])) 
							{	
								var dist = res[0].distanceTo(posStart);
								
								if(min > dist)
								{
									pos2 = res[0];
									
									min = dist;
								}
							}
						}				
						
					}
				}


				
				if(pos2)
				{
					if(infProject.svg.furn.offset.show && myCameraOrbit.activeCam.userData.isCam2D)
					{
						fname_s_0306([line]);					
						fname_s_0309([html]);
					}
					fname_s_0300({el: line, point: [posStart, pos2]});
					
					var posLabel = new THREE.Vector3().subVectors( pos2, posStart ).divideScalar( 2 ).add(posStart); 
					html.userData.elem.pos = posLabel;					
					
					var dist = pos2.distanceTo(posStart);
					html.style.transform = 'translate(-50%, -50%)';
					html.textContent = Math.round(dist * 100) / 100 + '';
					
					fname_s_0194({elem: html});
					
					
					
					if(dist < 0.1)
					{   
						pos3.add(pos2.clone().sub(posStart));
						arrN[arrN.length] = n;						
					}
					
				}
			}
			
			
			if(arrN.length > 0)
			{ 
					
				for ( var j = 0; j < arrN.length; j++ )
				{
					var num = arrN[j]; 
					
					
					var x1 = 0;
					var y1 = 0;
					
					var offsetLine = infProject.svg.furn.offset.elem;
		
					if(num==0 || num==1) 
					{
						var y1 = offsetLine[num].y2.baseVal.value - offsetLine[num].y1.baseVal.value;
						
						offsetLine[0].y1.baseVal.value += y1;
						offsetLine[1].y1.baseVal.value += y1;
						
						offsetLine[2].y1.baseVal.value += y1;
						offsetLine[2].y2.baseVal.value += y1;

						offsetLine[3].y1.baseVal.value += y1;
						offsetLine[3].y2.baseVal.value += y1;							
					}						
					else if(num==2 || num==3) 
					{
						var x1 = offsetLine[num].x2.baseVal.value - offsetLine[num].x1.baseVal.value;
						
						offsetLine[0].x1.baseVal.value += x1;
						offsetLine[0].x2.baseVal.value += x1;
						
						offsetLine[1].x1.baseVal.value += x1;
						offsetLine[1].x2.baseVal.value += x1;							

						offsetLine[2].x1.baseVal.value += x1;
						offsetLine[3].x1.baseVal.value += x1;
					}
					
					var lineSize = infProject.svg.furn.size.elem;
					lineSize[0].x1.baseVal.value += x1;
					lineSize[0].y1.baseVal.value += y1;					
					lineSize[0].x2.baseVal.value += x1;
					lineSize[0].y2.baseVal.value += y1;
					
					lineSize[1].x1.baseVal.value += x1;
					lineSize[1].y1.baseVal.value += y1;					
					lineSize[1].x2.baseVal.value += x1;
					lineSize[1].y2.baseVal.value += y1;					
						
					var circle = infProject.svg.furn.boxCircle.elem;
					
					for ( var i = 0; i < circle.length; i++ )
					{
						circle[i].cx.baseVal.value += x1;
						circle[i].cy.baseVal.value += y1;
					}					
					
					var box1 = infProject.svg.furn.box1;
					
					var path = 'M';
					for ( var i = 0; i < box1.userData.svg.path.arrS.length; i++ )
					{
						var arrS = box1.userData.svg.path.arrS[i];
						
						path += (arrS.x + x1)+' '+(arrS.y + y1)+',';
						
						arrS.x += x1;
						arrS.y += y1;
					}

					box1.setAttribute("d", path);
					
					
					var box2 = infProject.svg.furn.box2;
					
					var path = 'M';
					for ( var i = 0; i < box2.userData.svg.path.arrS.length; i++ )
					{
						var arrS = box2.userData.svg.path.arrS[i];
						
						path += (arrS.x + x1)+' '+(arrS.y + y1)+', ';
						
						arrS.x += x1;
						arrS.y += y1;
					}

					box2.setAttribute("d", path);						
				}
				
				
				
				{
					fname_s_0304({el: infProject.svg.furn.size.elem});
					
					var sizeLine = infProject.svg.furn.size.elem;
					var sizeLabel = infProject.html.furn.size;					
					
					for ( var i = 0; i < sizeLabel.length; i++ )
					{
						var p = sizeLine[i].userData.svg.line.p;
						
						var posLabel = new THREE.Vector3().subVectors( p[1], p[0] ).divideScalar( 2 ).add(p[0]); 
						sizeLabel[i].userData.elem.pos = posLabel;					
						
						var dist = p[0].distanceTo(p[1]);
						sizeLabel[i].style.transform = 'translate(-50%, -50%)';
						sizeLabel[i].textContent = Math.round(dist * 100) / 100 + '';
						
						fname_s_0194({elem: sizeLabel[i]});

						if(dist < 0.01)
						{
							fname_s_0310([sizeLabel[i]]);
						}
					}									
				}
				
				
				
				{
					fname_s_0304({el: infProject.svg.furn.offset.elem});
					
					var offsetLine = infProject.svg.furn.offset.elem;
					var offsetLabel = infProject.html.furn.offset;
					
					for ( var i = 0; i < offsetLabel.length; i++ )
					{
						var p = offsetLine[i].userData.svg.line.p;
						
						var posLabel = new THREE.Vector3().subVectors( p[1], p[0] ).divideScalar( 2 ).add(p[0]); 
						offsetLabel[i].userData.elem.pos = posLabel;					
						
						var dist = p[0].distanceTo(p[1]);
						offsetLabel[i].style.transform = 'translate(-50%, -50%)';
						offsetLabel[i].textContent = Math.round(dist * 100) / 100 + '';
						
						fname_s_0194({elem: offsetLabel[i]});

						if(dist < 0.01)
						{
							fname_s_0310([offsetLabel[i]]);
						}
					}
				}
				
				
				{
					
					
					obj.position.x += pos3.x;
					obj.position.z += pos3.z;
		

					infProject.tools.pivot.position.x += pos3.x;
					infProject.tools.pivot.position.z += pos3.z;					
					infProject.tools.gizmo.position.x += pos3.x;
					infProject.tools.gizmo.position.z += pos3.z;
				}
				
			}							
		}
		else
		{
			fname_s_0307(infProject.svg.furn.offset.elem);
			fname_s_0310(infProject.html.furn.offset);
		}
		
	}
}




function fname_s_070(cdm)
{
	var offset_2D = new THREE.Vector2();
	var offset_3D = new THREE.Vector3();
	
	if(infProject.calc.boxScale2D.pos2D)
	{
		offset_2D = new THREE.Vector2().subVectors( cdm.setPos.pos2D, infProject.calc.boxScale2D.pos2D );
		offset_3D = new THREE.Vector3().subVectors( cdm.setPos.pos3D, infProject.calc.boxScale2D.pos3D );
	}
	
	infProject.calc.boxScale2D.pos2D = cdm.setPos.pos2D;
	infProject.calc.boxScale2D.pos3D = cdm.setPos.pos3D;
			
	
	{					
		var x1 = offset_2D.x;
		var y1 = offset_2D.y;
		
		
		
		var offsetLine = infProject.svg.furn.offset.elem;

		for ( var i = 0; i < offsetLine.length; i++ )
		{
			offsetLine[i].x1.baseVal.value += x1;
			offsetLine[i].x2.baseVal.value += x1;				
			offsetLine[i].y1.baseVal.value += y1;
			offsetLine[i].y2.baseVal.value += y1;						
		}

		
		var lineSize = infProject.svg.furn.size.elem;
		
		for ( var i = 0; i < lineSize.length; i++ )
		{
			lineSize[i].x1.baseVal.value += x1;
			lineSize[i].y1.baseVal.value += y1;					
			lineSize[i].x2.baseVal.value += x1;
			lineSize[i].y2.baseVal.value += y1;				
		}							
			
		var circle = infProject.svg.furn.boxCircle.elem;
		
		for ( var i = 0; i < circle.length; i++ )
		{
			circle[i].cx.baseVal.value += x1;
			circle[i].cy.baseVal.value += y1;
		}
		
		var box1 = infProject.svg.furn.box1;
		
		for ( var i = 0; i < box1.pathSegList.length; i++ )
		{
			box1.pathSegList[i].x += x1;
			box1.pathSegList[i].y += y1;
		}						
		
		var box2 = infProject.svg.furn.box2;
		
		for ( var i = 0; i < box2.pathSegList.length; i++ )
		{
			box2.pathSegList[i].x += x1;
			box2.pathSegList[i].y += y1;
		}


		var offsetLabel = infProject.html.furn.offset;			
		
		for ( var i = 0; i < offsetLabel.length; i++ )
		{
			offsetLabel[i].style.left = offsetLabel[i].offsetLeft + x1 + "px";
			offsetLabel[i].style.top = offsetLabel[i].offsetTop + y1 + "px";
		}

		var sizeLabel = infProject.html.furn.size;			
		
		for ( var i = 0; i < sizeLabel.length; i++ )
		{
			sizeLabel[i].style.left = sizeLabel[i].offsetLeft + x1 + "px";
			sizeLabel[i].style.top = sizeLabel[i].offsetTop + y1 + "px";
		}			
	}		
	
}




function fname_s_071(cdm)
{
	
	
	var arr = [];	
	
	var floor = cdm.floor;		
	var obj = (cdm.ignoreObj) ? cdm.ignoreObj : null;	

	
	for ( var i = 0; i < infProject.scene.array.obj.length; i++ )
	{				
		var obj_2 = infProject.scene.array.obj[i];
		
		if(obj_2 == obj) continue;
		
		var ray = new THREE.Raycaster();
		ray.set( new THREE.Vector3(obj_2.position.x, 1, obj_2.position.z), new THREE.Vector3(0, -1, 0) );
		
		var intersects = ray.intersectObject( floor );	
		
		if(intersects[0]) 
		{
			
			{
				var v = [];
				v[0] = obj_2.localToWorld( new THREE.Vector3(obj_2.geometry.boundingBox.min.x, 0, obj_2.geometry.boundingBox.max.z) );	
				v[1] = obj_2.localToWorld( new THREE.Vector3(obj_2.geometry.boundingBox.max.x, 0, obj_2.geometry.boundingBox.max.z) );	
				
				v[2] = obj_2.localToWorld( new THREE.Vector3(obj_2.geometry.boundingBox.max.x, 0, obj_2.geometry.boundingBox.min.z) );	
				v[3] = obj_2.localToWorld( new THREE.Vector3(obj_2.geometry.boundingBox.min.x, 0, obj_2.geometry.boundingBox.min.z) );	
			}

			arr[arr.length] = { o: obj_2, v: v };
		}					
	}


	return arr;
}




function fname_s_072(cdm)
{
	var obj = cdm.obj;
	
	if(!obj) return; 
	
 	
	obj.geometry.computeBoundingBox();
	var x = (Math.abs(obj.geometry.boundingBox.max.x) + Math.abs(obj.geometry.boundingBox.min.x));
	var y = (Math.abs(obj.geometry.boundingBox.max.y) + Math.abs(obj.geometry.boundingBox.min.y));
	var z = (Math.abs(obj.geometry.boundingBox.max.z) + Math.abs(obj.geometry.boundingBox.min.z));
	
	x *= obj.scale.x;
	y *= obj.scale.y;
	z *= obj.scale.z;		

	var x2 = undefined;
	var y2 = undefined;
	var z2 = undefined; 
	
	if(obj.userData.tag === 'obj')
	{
		x2 = $('[nameId="size-obj-length"]').val();
		y2 = $('[nameId="size-obj-height"]').val();
		z2 = $('[nameId="size-obj-width"]').val(); 		
	}
	if(obj.userData.tag === 'roof')
	{
		x2 = $('[nameId="size-roof-length"]').val();
		y2 = $('[nameId="size-roof-height"]').val();
		z2 = $('[nameId="size-roof-width"]').val(); 		
	}	

	x2 = x2.replace(",", ".");
	y2 = y2.replace(",", ".");
	z2 = z2.replace(",", ".");	
	
	x2 = (!fname_s_06(x2)) ? x : Number(x2);
	y2 = (!fname_s_06(y2)) ? y : Number(y2);
	z2 = (!fname_s_06(z2)) ? z : Number(z2);		

	
	
	
	if(!limit)
	{		
		var limit = { x_min : 0.01, x_max : 100, y_min : 0.01, y_max : 100, z_min : 0.01, z_max : 100 };				
	}
	
	if(x2 < limit.x_min) { x2 = limit.x_min; }
	else if(x2 > limit.x_max) { x2 = limit.x_max; }
	
	if(y2 < limit.y_min) { y2 = limit.y_min; }
	else if(y2 > limit.y_max) { y2 = limit.y_max; }

	if(z2 < limit.z_min) { z2 = limit.z_min; }
	else if(z2 > limit.z_max) { z2 = limit.z_max; }			
	
	
	let box = new THREE.Vector3(1, 1, 1);  
	if(obj.userData.tag === 'obj') box = obj.userData.obj3D.box;
	if(obj.userData.tag === 'roof') box = obj.userData.roof.box;
	 
	obj.scale.set(x2/box.x, y2/box.y, z2/box.z);	
	obj.updateMatrixWorld();
	
	if(obj.userData.tag === 'roof')
	{
		clRoof.updateCgsRoof();
		myRoof.upDateTextureRoof({obj})
	}

	if(obj.userData.tag === 'obj')
	{
		fname_s_0260({obj})
	}
	
	if(myCameraOrbit.activeCam.userData.isCam2D)
	{
		fname_s_069({obj: obj, boxCircle: true, getObjRoom: true, resetPos: true});
	}
	
	fname_s_0239({obj: obj});
	
	renderCamera();
}



var isMouseDown1 = false;
var isMouseRight1 = false;
var isMouseDown2 = false;
var isMouseDown3 = false;
var onMouseDownPosition = new THREE.Vector2();
var long_click = false;
var lastClickTime = 0;
var catchTime = 0.30;
var vk_click = '';

var onfM = {};
onfM.stop = false;
onfM.rayhitStop = false;

function fname_s_073(value) 
{
	onfM.stop = value;
	myCameraOrbit.stopMove = value;
}



function fname_s_074()
{
	
	clickO.buttonAct = null;
	clickO.button = null; 
	
	var obj = clickO.move;
	
	if(obj)
	{
		if(obj.userData.tag == 'free_dw') 
		{ 
			fname_s_0138({wd: obj, upWall: false}); 
		}		
		else if(obj.userData.tag == 'point') 
		{ 	
			if(obj.w.length == 0){ fname_s_0136(obj); }  
			else 
			{ 
				if(obj.userData.point.type == 'continue_create_wall')
				{
					var point = obj.p[0]; 
					fname_s_0135({wall: obj.w[0]}); 
					
				}
				
				if(point.userData.point.last.cdm == 'new_point_1') { fname_s_0137( point ).wall.userData.id = point.userData.point.last.cross.walls.old; }
			}
		}
		else if(obj.userData.tag == 'obj')
		{
			fname_s_0243({obj: obj, undoRedo: false}); 
		}		

		clickO = resetPop.clickO();
	}	
	
	clickO.move = null;	
}



function fname_s_075( event ) 
{
	

	if (window.location.hostname == 'ocsg-1'){} 
	else if (window.location.hostname == 'engineering-plan.ru'){}
	else if (window.location.hostname == 'engineering-plan-test'){} 
	else if (window.location.hostname == 'engineering-plan-new'){} 
	else if (window.location.hostname == 'room-3d'){} 
	else if (window.location.hostname == 'room-3d.ru'){} 	
	else { return; }
 
	long_click = false;
	lastClickTime = new Date().getTime();

	if(fname_s_0313(event)) { return; }		
	
	if(event.changedTouches)
	{
		event.clientX = event.changedTouches[0].clientX;
		event.clientY = event.changedTouches[0].clientY;
		vk_click = 'left';
	}	

	switch ( event.button ) 
	{
		case 0: vk_click = 'left'; break;
		case 1: vk_click = 'right';  break;
		case 2: vk_click = 'right'; break;
	}


	infProject.tools.axis[0].visible = false;
	infProject.tools.axis[1].visible = false;


	if ( vk_click == 'right' ) { fname_s_074( event ); return; } 


	if(clickO.move)
	{
		if(clickO.move.userData.tag == 'point') 
		{			
			if(clickO.move.userData.point.type) { fname_s_045( clickO.move ); return; }  
		}
	}
	 
	clickO.obj = null; 	
	clickO.actMove = false;	
	clickO.selectBox.drag = false;
	clickO.rayhit = fname_s_076(event); 
	
	fname_s_078({type: 'down'});
	
	renderCamera();
}





function fname_s_076(event)
{ 
	var rayhit = null;	
				
	
	if(infProject.tools.pivot.visible)
	{
		var ray = fname_s_0213( event, infProject.tools.pivot.children, 'arr' );
		if(ray.length > 0) { rayhit = ray[0]; return rayhit; }		
	}
	
	if(infProject.tools.gizmo.visible)
	{
		var arr = [];
		for ( var i = 0; i < infProject.tools.gizmo.children.length; i++ ){ arr[i] = infProject.tools.gizmo.children[i]; }
		
		var ray = fname_s_0213( event, arr, 'arr' );
		if(ray.length > 0) { rayhit = ray[0]; return rayhit; }		
	}

	if(!rayhit && myCameraOrbit.activeCam.userData.isCam3D)
	{
		rayhit = clRoof.getRayIntersect();		
	}	

	if(!infProject.scene.block.click.controll_wd)
	{
		var ray = fname_s_0213( event, [infProject.tools.controllWD[0], infProject.tools.controllWD[1]], 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}
	
	if(!infProject.scene.block.click.door)
	{
		var ray = fname_s_0213( event, infProject.scene.array.door, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}
	
	if(!infProject.scene.block.click.window)
	{
		var ray = fname_s_0213( event, infProject.scene.array.window, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}
	
	if(!infProject.scene.block.click.point)
	{
		var ray = fname_s_0213( event, infProject.scene.array.point, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}

	if(!infProject.scene.block.click.wall)
	{
		var arr = [];
		for ( var i = 0; i < infProject.scene.array.wall.length; i++ )
		{ 
			if(!infProject.scene.array.wall[i].userData.wall.show) continue;
			arr[arr.length] = infProject.scene.array.wall[i]; 
		}		
		
		var ray = fname_s_0213( event, arr, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}

	
	if(!infProject.scene.block.click.obj)
	{
		var ray = fname_s_0213( event, infProject.scene.array.obj, 'arr', true );
		
		if(ray.length > 0)
		{   	
			rayhit = null;
			
			for (var i = 0; i < ray.length; i++)
			{
				if(ray[i].object.userData.obj3D) continue;
				
				rayhit = ray[i]; 
				break;
			}
			
			var object = null; 
			
			if(rayhit) { object = fname_s_077({obj: rayhit.object}); }
			
			if(!object) { rayhit = null; }
			else { rayhit.object = object; }
		}			
	}

	if(!rayhit && myCameraOrbit.activeCam.userData.isCam2D)
	{
		rayhit = clRoof.getRayIntersect();		
	}
	
	if(!rayhit)
	{
		var ray = fname_s_0213( event, infProject.scene.array.floor, 'arr' );
		if(ray.length > 0) { rayhit = ray[0]; }			
	}	
	
	
	return rayhit;
}




function fname_s_077(cdm)
{
	var obj = cdm.obj;	
	var next = true;
	
	while(next) 
	{
		if(obj.userData)
		{
			if(obj.userData.tag)
			{
				if(obj.userData.tag == 'obj' || obj.userData.tag == 'roof')
				{
					next = false;
					return obj;					
				}
				else
				{
					if(obj.parent)
					{
						obj = obj.parent;
					}
					else
					{
						next = false;
						return null;
					}
				}
			}
			else if(obj.parent)
			{ 
				obj = obj.parent;
			}
			else
			{
				next = false;
				return null;
			}
			
		}
		else if(obj.parent)
		{ 
			obj = obj.parent;
		}
		else
		{
			next = false;
			return null;
		}
	}
}


function fname_s_078(cdm)
{ 
	if(!clickO.rayhit) { fname_s_081(cdm); return; }

	var obj = clickO.obj = clickO.rayhit.object;
	fname_s_081(cdm);
	
	
	var tag = obj.userData.tag;
	var rayhit = clickO.rayhit;
	var flag = true;
	
	const isCam2D = myCameraOrbit.activeCam.userData.isCam2D;
	const isCam3D = myCameraOrbit.activeCam.userData.isCam3D;
	
	if(cdm.type == 'down')
	{  
		if(fname_s_059(clickO.move)) { flag = false; }
		else if( tag == 'pivot' ) { fname_s_0234( rayhit ); }
		else if( tag == 'gizmo' ) { fname_s_0249( rayhit ); } 
		else if( tag == 'wall' && isCam2D ) { fname_s_0113( rayhit ); }
		else if( tag == 'point' ) { fname_s_096( rayhit ); }
		else if( tag == 'window' && isCam2D ) { fname_s_0123( rayhit ); }
		else if( tag == 'door' && isCam2D ) { fname_s_0123( rayhit ); }
		else if( tag == 'controll_wd' ) { fname_s_092( rayhit ); }
		else if( tag == 'obj' && isCam2D ) { fname_s_0238({obj: obj, rayhit: rayhit}); }
		else if( tag == 'obj' && isCam3D && infProject.tools.pivot.userData.pivot.obj == obj) { fname_s_0238({obj: obj, rayhit: rayhit}); }
		else if( tag == 'roof' && isCam2D ) { clRoof.clickRoof({obj: obj, rayhit: rayhit}); }
		else if( tag == 'roof' && isCam3D && infProject.tools.pivot.userData.pivot.obj == obj) { clRoof.clickRoof({obj: obj, rayhit: rayhit}); }		
		else { flag = false; }
	}
	else if(cdm.type == 'up')
	{	
		if( tag == 'wall' && isCam3D ) { fname_s_0114({obj: obj, rayhit: rayhit}); }
		else if( tag == 'obj' && isCam3D && infProject.tools.pivot.userData.pivot.obj !== obj ) { fname_s_0238({obj: obj, rayhit: rayhit}); }
		else if( tag == 'room' && isCam3D ) { fname_s_0149({obj: obj}); }
		else if( tag == 'room' && isCam3D ) { fname_s_0149({obj: obj}); }
		else if( tag == 'roof' && isCam3D && infProject.tools.pivot.userData.pivot.obj !== obj ) { clRoof.clickRoof({obj: obj, rayhit: rayhit}); }
		else if( tag == 'window' && isCam3D) { fname_s_0123( rayhit ); }
		else if( tag == 'door' && isCam3D) { fname_s_0123( rayhit ); }		
		else { flag = false; }
	}	

	
	if(flag) 
	{
		fname_s_073(true);
		
		if(isCam2D)
		{
			fname_s_0170(obj);
		}		

		if(tag == 'pivot') { obj = infProject.tools.pivot.userData.pivot.obj; }
		else if(tag == 'gizmo') { obj = infProject.tools.gizmo.userData.gizmo.obj; }		
		
		clickO.last_obj = obj;
		
		fname_s_083( obj );
	}
}


function fname_s_079( event ) 
{ 
	
	
	if(event.changedTouches)
	{
		event.clientX = event.changedTouches[0].clientX;
		event.clientY = event.changedTouches[0].clientY;
		isMouseDown2 = true;
	}
	
	if(fname_s_0314(event)) { return; }		
	
	if(clickO.elem) { fname_s_067(event); }

	fname_s_0215( event );
		

	if ( !long_click ) { long_click = ( lastClickTime - new Date().getTime() < catchTime ) ? true : false; }

	const isCam2D = myCameraOrbit.activeCam.userData.isCam2D;
	
	var obj = clickO.move;
	
	if ( obj ) 
	{
		var tag = obj.userData.tag;
			
		if ( tag == 'pivot' ) { fname_s_0235( event ); }
		else if ( tag == 'gizmo' ) { fname_s_0251( event ); }
		else if ( tag == 'wall' ) { fname_s_0117( event, obj ); }
		else if ( tag == 'window' ) { fname_s_0127( event, obj ); }
		else if ( tag == 'door' ) { fname_s_0127( event, obj ); }
		else if ( tag == 'controll_wd' ) { fname_s_093( event, obj ); }
		else if ( tag == 'point' ) { fname_s_098( event, obj ); }
		else if ( tag == 'room' ) {  }		
		else if ( tag == 'free_dw' ) { fname_s_058( event, obj ); }
		else if ( tag == 'obj' ) { fname_s_0241( event ); }
		else if ( tag == 'obj_spot' ) { fname_s_0241( event ); }
		else if ( tag == 'roof' ) { clRoof.moveRoof( event ); }
	}
	else if(isCam2D && clickO.selectBox.drag) 
	{		
		fname_s_0319(event); 
	}
	
	fname_s_0168( event );

	renderCamera();
}


function fname_s_080( event )  
{
	
	
	if(fname_s_0315(event)) { return; }		
	
	if(!long_click) 
	{ 
		fname_s_078({type: 'up'}); 
	}	
	
	var obj = clickO.move;		
	
	
	if(clickO.elem)
	{
		fname_s_068();
	}
	
	if(obj)  
	{
		var tag = obj.userData.tag;
		
		if(tag == 'point') 
		{  		
			var point = clickO.move;
			fname_s_0112(point); 
			if(!clickO.move.userData.point.type) { fname_s_045(clickO.move); }						
		}
		else if(tag == 'wall') { fname_s_0122(obj); }
		else if(tag == 'window' || obj.userData.tag == 'door') { fname_s_0132(obj); }	
		else if(tag == 'controll_wd') { fname_s_095(obj); } 
		else if(tag == 'obj') { fname_s_0242(obj); }
		else if(tag == 'pivot') { fname_s_0237(); }
		else if(tag == 'gizmo') { fname_s_0253(); }
		else if ( tag == 'roof' ) { clRoof.moveRoof( event ); clRoof.clickUpRoof(obj); }
		
		if(tag == 'free_dw') {  }
		else if (tag == 'point') 
		{
			if(obj.userData.point.type) {  } 
			else { clickO.move = null; }
		}		
		else { clickO.move = null; }
	}
	else if(clickO.selectBox.drag)
	{		
		fname_s_0320();
	}	
	
	if(clickO.move === null) fname_s_073(false);
	param_win.click = false;
	isMouseDown1 = false;
	isMouseRight1 = false;
	isMouseDown2 = false;
	isMouseDown3 = false;
	clickO.elem = null;
	
	infProject.tools.axis[0].visible = false;
	infProject.tools.axis[1].visible = false;	
	
	clickO.offset = new THREE.Vector3();
	
	renderCamera();
}





function fname_s_081(cdm)
{
	if(fname_s_0321(clickO.obj)) { return; }
	
	var obj = clickO.last_obj;
	if(!cdm) { cdm = {type: ''}; }
	
	var flag = true;
	
	const isCam2D = myCameraOrbit.activeCam.userData.isCam2D;
	const isCam3D = myCameraOrbit.activeCam.userData.isCam3D;

	if(obj)
	{ 
		fname_s_0171(); 
		

		var tag = obj.userData.tag;
		
		if(cdm.type == 'down')
		{
			if(tag == 'wall' && isCam2D) { fname_s_082(obj); }
			else if(tag == 'point' && isCam2D) { fname_s_082(obj); }
			else if(tag == 'window' && isCam2D) { fname_s_0129(obj); fname_s_082(obj); }
			else if(tag == 'door' && isCam2D) { fname_s_0129(obj); fname_s_082(obj); }
			else if(tag == 'obj' && isCam2D) { fname_s_0244(obj); }
			else if(tag == 'roof' && isCam2D) { fname_s_0244(obj); }
			else { flag = false; }
		}
		else if(cdm.type == 'up')
		{
			if(tag == 'wall' && isCam3D) { fname_s_082(obj); myComposerRenderer.outlineRemoveObj(); }
			else if(tag == 'room' && isCam2D) { fname_s_082(obj); myComposerRenderer.outlineRemoveObj(); }
			else if(tag == 'room' && isCam3D) { fname_s_082(obj); myComposerRenderer.outlineRemoveObj(); }
			else if(tag == 'obj' && isCam3D) { fname_s_0244(obj); }
			else if(tag == 'roof' && isCam3D) { fname_s_0244(obj); }
			else if(tag == 'window' && isCam3D) { fname_s_0244(obj); }
			else if(tag == 'door' && isCam3D) { fname_s_0244(obj); }
			else { flag = false; }
		}
		else
		{
			if(tag == 'wall') { fname_s_082(obj); }
			else if(tag == 'point') { fname_s_082(obj); }
			else if(tag == 'window') { fname_s_0129(obj); fname_s_082(obj); }
			else if(tag == 'door') { fname_s_0129(obj); fname_s_082(obj); }
			else if(tag == 'room') { fname_s_082(obj); }
			else if(tag == 'obj') { fname_s_0244(obj); }
			else if(tag == 'roof') { fname_s_0244(obj); }
			else { flag = false; }
		}
	}
	
	if(flag) 
	{		
		clickO.last_obj = null;
	}
}




function fname_s_082(obj) 
{
	if(!obj) return;  
	if(!obj.userData) return;
	if(!obj.userData.tag) return;
	
	var tag = obj.userData.tag;
	
	if(tag == 'wall') { tabObject.activeObjRightPanelUI_1(); }
	else if(tag == 'point') { tabObject.activeObjRightPanelUI_1(); }
	else if(tag == 'window') { tabObject.activeObjRightPanelUI_1(); }
	else if(tag == 'door') { tabObject.activeObjRightPanelUI_1(); }
	else if(tag == 'room') { tabObject.activeObjRightPanelUI_1(); }
}





function fname_s_083( obj )
{
	
	if(!obj) return;
	if(!obj.userData.tag) return;
	
	var tag = obj.userData.tag;
	
	if ( tag == 'room' ) 
	{
		var txt = '';
		
		for ( var i = 0; i < obj.p.length - 1; i++ ) { txt += '| ' + obj.p[i].userData.id; }
		
		
	}
	else if( tag == 'wall' )
	{ 
		
		 
	}
	else if( tag == 'point' )
	{ 
		 
	}
	else if( tag == 'window' || tag == 'door' )
	{ 
		var txt = {};		
		 
	}
	else if ( tag == 'controll_wd' ) 
	{
		
	}
	else if ( tag == 'obj' ) 
	{
		
	}		
	else 
	{
		
	}	
}



    



function fname_s_084()
{  
	fname_s_085();		


	if(myCameraOrbit.activeCam.userData.isCam2D)
	{	
		ghostLevel.createLevel();	
		
		fname_s_087({visible_1: false, visible_2: false});

		fname_s_0270();	
		
		clRoof.resetWall();
	}
	else if(myCameraOrbit.activeCam.userData.isCam3D)
	{	
		ghostLevel.deleteLevel();	
		
		fname_s_087({visible_1: true, visible_2: true});			
		
		
		fname_s_0268();
		if(divLevelVisible.wallTransparent && myCameraOrbit.cam3D.userData.type === 'fly') fname_s_0269();	
		else fname_s_0270();
		
		clRoof.cgs();
	}
	
	clRoof.changeMaterialTransparent();
	
	infProject.tools.axis[0].visible = false;
	infProject.tools.axis[1].visible = false;	

	clickO = resetPop.clickO();
	
	myLevels.changeVisibleLevels();
	
	if(myCameraOrbit.activeCam.userData.isCam2D)
	{
		myCameraOrbit.cam2D.updateMatrixWorld();
		fname_s_0193({resize: true});		
	}
}







function fname_s_085()
{
	if(myCameraOrbit.activeCam.userData.isCam2D)
	{
		var depthTest = false;
		var w2 = 1;
		var visible = true;
		var visible_2 = true;
		var visible_3 = false;
	}
	else if(myCameraOrbit.activeCam.userData.isCam3D)
	{
		var depthTest = true;
		var w2 = 0.0;
		var visible = false;
		var visible_2 = false;
		var visible_3 = true;
	}
	else { return; } 
	
	var point = infProject.scene.array.point;
	var wall = infProject.scene.array.wall;
	var window = infProject.scene.array.window;
	var door = infProject.scene.array.door;	
	var floor = infProject.scene.array.floor;
	
	
	
	
	var label = [];
	for ( var i = 0; i < wall.length; i++ )
	{
		if(!wall[i].userData.wall.html.label) continue;
		
		for ( var i2 = 0; i2 <  wall[i].userData.wall.html.label.length; i2++ )
		{
			label[label.length] = wall[i].userData.wall.html.label[i2];  
		}
	}		

	if(infProject.settings.floor.label.visible)
	{
		for ( var i = 0; i < floor.length; i++ )
		{ 
			if(visible)
			{
				if(floor[i].userData.room.zone.id !== undefined)
				{
					label[label.length] = floor[i].userData.room.html.label; 
				}
			}
			else
			{
				label[label.length] = floor[i].userData.room.html.label;
			}			 
		}		
	}
	
	if(visible) { fname_s_0309(label); }
	else 
	{ 
		fname_s_0310(label); 
		fname_s_0310(infProject.html.furn.size);
		fname_s_0310(infProject.html.furn.offset);		
	}

	
	
	
	for ( var i = 0; i < point.length; i++ )
	{ 
		point[i].visible = visible; 
	}		

	var svg = [];
	
	for ( var i = 0; i < door.length; i++ )
	{  
		svg[svg.length] = door[i].userData.door.svg.el;
		
		if(door[i].userData.door.svg.path) { svg[svg.length] = door[i].userData.door.svg.path; }
		if(door[i].userData.door.svg.arc) { svg[svg.length] = door[i].userData.door.svg.arc; }
		
		if(!door[i].userData.door.obj3D) continue;
		door[i].userData.door.obj3D.visible = visible_3;		
	}	

	for ( var i = 0; i < window.length; i++ )
	{ 
		svg[svg.length] = window[i].userData.door.svg.el;
		
		if(window[i].userData.door.svg.path) { svg[svg.length] = window[i].userData.door.svg.path; }
		
		if(!window[i].userData.door.obj3D) continue;
		window[i].userData.door.obj3D.visible = visible_3;		
	}
	
	if(myCameraOrbit.activeCam.userData.isCam2D)
	{
		fname_s_0306(svg);
	}
	else if(myCameraOrbit.activeCam.userData.isCam3D)
	{
		fname_s_0307(svg);
	}	
	
	fname_s_086(window, visible_2);
	fname_s_086(door, visible_2);
	
}



function fname_s_086(arr, visible)
{	
	if(arr.length == 0) return;
	
	for ( var i = 0; i < arr.length; i++ ) { arr[i].material.visible = visible; }				
}












function fname_s_087(cdm)
{
	var visible_1 = cdm.visible_1;
	var visible_2 = cdm.visible_2;
	
	
	

	infProject.scene.block.click.point = visible_1;
	infProject.scene.block.hover.point = visible_1;

	
	

	
	

	infProject.scene.block.click.room = visible_1;
	infProject.scene.block.hover.room = visible_1;

	infProject.scene.block.click.controll_wd = visible_1;
	infProject.scene.block.hover.controll_wd = visible_1;	
}








function fname_s_088() 
{
	var arr = []; 
	
	var geometry1 = new THREE.SphereGeometry( 0.07, 16, 16 );
	var geometry2 = new THREE.SphereGeometry( 0.05, 16, 16 );
	
	for ( var i = 0; i < 4; i++ )
	{
		var obj = new THREE.Mesh( geometry1, new THREE.MeshLambertMaterial( { transparent: true, opacity: 0 } ) );
		
		obj.userData.tag = 'controll_wd';
		obj.userData.controll_wd = { id : i, obj : null };		
		obj.visible = false;
		
		
		var child = new THREE.Mesh( geometry2, new THREE.MeshLambertMaterial( { color : 0xcccccc, transparent: true, opacity: 1, depthTest: false, lightMap : lightMap_1 } ) );
		child.renderOrder = 2;
		obj.add( child );
		 
		arr[i] = obj;
		scene.add( arr[i] );
	}		
	
	return arr;
}






function fname_s_089( wall, obj )
{	
	var p = [];	
	
	obj.geometry.computeBoundingBox(); 
	obj.geometry.computeBoundingSphere(); 	
	
	var bound = obj.geometry.boundingBox;
	var center = obj.geometry.boundingSphere.center; 


	var arrVisible = [true, true, true, true];
	
	if(myCameraOrbit.activeCam.userData.isCam2D) { arrVisible = [true, true, false, false]; }
	else if(myCameraOrbit.activeCam.userData.isCam3D) { arrVisible = [false, false, false, false]; }
	
	if(obj.userData.tag == 'door' || obj.userData.tag == 'window')
	{
		if(!obj.userData.door.topMenu) { arrVisible = [false, false, false, false]; }
		
		
		p[0] = obj.localToWorld( new THREE.Vector3(bound.min.x, center.y, center.z) );
		p[1] = obj.localToWorld( new THREE.Vector3(bound.max.x, center.y, center.z) );
		p[2] = obj.localToWorld( new THREE.Vector3(center.x, bound.min.y, center.z) );
		p[3] = obj.localToWorld( new THREE.Vector3(center.x, bound.max.y, center.z) );		
	}
	else
	{
		arrVisible = [false, false, false, false];
		
		
		var p3 = [];
		p3[0] = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(bound.min.x, center.y, bound.min.z)) );	
		p3[1] = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(bound.min.x, center.y, bound.max.z)) );		
		p3[2] = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(bound.max.x, center.y, bound.min.z)) );
		p3[3] = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(bound.max.x, center.y, bound.max.z)) );

		var min = { vx: p3[0].x, vz: p3[0].z };
		var max = { vx: p3[0].x, vz: p3[0].z };
		
		for ( var i = 0; i < p3.length; i++ )
		{
			if(min.vx > p3[i].x) { min.vx = p3[i].x; }
			if(max.vx < p3[i].x) { max.vx = p3[i].x; }
			if(min.vz > p3[i].z) { min.vz = p3[i].z; }
			if(max.vz < p3[i].z) { max.vz = p3[i].z; }			
		}
		
		p[0] = wall.localToWorld( new THREE.Vector3(min.vx, p3[0].y, (min.vz - max.vz)/2 + max.vz) );
		p[1] = wall.localToWorld( new THREE.Vector3(max.vx, p3[0].y, (min.vz - max.vz)/2 + max.vz) );
		
		p[2] = obj.localToWorld( new THREE.Vector3(center.x, bound.min.y, center.z) );
		p[3] = obj.localToWorld( new THREE.Vector3(center.x, bound.max.y, center.z) );		
	}

	var arr = infProject.tools.controllWD;
	for ( var i = 0; i < arr.length; i++ )
	{		
		arr[i].position.copy( p[i] );	
		arr[i].rotation.copy( wall.rotation );
		arr[i].visible = arrVisible[i];
		arr[i].obj = obj; 
		arr[i].userData.controll_wd.obj = obj;
	}
}


		
		


function fname_s_090(obj)
{
	if(!myCameraOrbit.activeCam.userData.isCam2D) return;
	
	var wall = obj.userData.door.wall;   

	fname_s_089( wall, obj );		
	
	
	var boundPos = [];
	
/* 	if(camera == cameraWall)
	{
		var arr = fname_s_0119(wall, arrWallFront.wall[0].index, fname_s_0121(wall, (arrWallFront.wall[0].index == 1) ? 1 : 0));
		boundPos[0] = arr[0].clone();
		boundPos[1] = arr[2].clone();		
	} 
	else*/	
	{
		
		var arr = fname_s_0119(wall, 1, fname_s_0121(wall, 1));	
		boundPos[0] = arr[0].clone();
		boundPos[1] = arr[2].clone();
		
		var arr = fname_s_0119(wall, 2, fname_s_0121(wall, 0));
		boundPos[2] = arr[0].clone();
		boundPos[3] = arr[2].clone();  		
	}	
	
	
	for ( var i = 0; i < arrWallFront.wall.length; i++ )
	{
		if(!arrWallFront.wall[i].obj.userData.wall.html.label) continue;
		
		arrWallFront.wall[i].obj.userData.wall.html.label[0].style.display = 'none';
		arrWallFront.wall[i].obj.userData.wall.html.label[1].style.display = 'none';
		
		arrWallFront.wall[i].obj.userData.wall.html.label[0].userData.elem.show = false;
		arrWallFront.wall[i].obj.userData.wall.html.label[1].userData.elem.show = false;
	}
	
	var v = wall.userData.wall.v;
	var vZ = v[0].z + (v[4].z - v[0].z) / 2; 
	
	for ( var i = 0; i < boundPos.length; i++ ){ boundPos[i].z = vZ; boundPos[i].y = 0; wall.localToWorld( boundPos[i] ); } 

	
	obj.userData.door.ruler.boundPos = boundPos;	
	
	
	if(clickO.rayhit.object.userData.tag == 'window' || clickO.rayhit.object.userData.tag == 'door') 
	{ 
		
		obj.userData.door.ruler.faceIndex = clickO.rayhit.face.normal.z;
	}	 
	
	fname_s_091(obj);  
}




function fname_s_091(wd)
{
	if(!myCameraOrbit.activeCam.userData.isCam2D) return;
	
	var wall = wd.userData.door.wall;
	
	var line = infProject.scene.size.wd_1.line;	
	var label_2 = infProject.html.wd;
	
	var p1 = wall.userData.wall.p[0].position;
	var p2 = wall.userData.wall.p[1].position;
	
	
	var dirW = new THREE.Vector3().subVectors( p1, p2 ).normalize();
	var ang2 = Math.atan2(dirW.x, dirW.z);
	if(ang2 <= 0.001){ ang2 += Math.PI / 2;  }
	else { ang2 -= Math.PI / 2; }	
	
	
	
	var b2 = [];
	wd.updateMatrixWorld();
	var bound = wd.geometry.boundingBox;
	b2[0] = wd.localToWorld( new THREE.Vector3(bound.min.x, 0, 0) ); 
	b2[1] = wd.localToWorld( new THREE.Vector3(bound.max.x, 0, 0) );	
	b2[0].y = b2[1].y = p1.y;
	
	
	
	var pw = [];
	
	if(1==2)	
	{
		pw[0] = wd.userData.door.ruler.boundPos[0]; 	
		pw[1] = wd.userData.door.ruler.boundPos[1]; 	
		pw[2] = wd.userData.door.ruler.boundPos[2]; 	
		pw[3] = wd.userData.door.ruler.boundPos[3]; 	
	}
	else
	{
		pw[0] = wall.localToWorld( new THREE.Vector3(wall.userData.wall.v[0].x, 0, 0) ); 
		pw[1] = wall.localToWorld( new THREE.Vector3(wall.userData.wall.v[6].x, 0, 0) ); 
		pw[2] = wall.localToWorld( new THREE.Vector3(wall.userData.wall.v[4].x, 0, 0) ); 
		pw[3] = wall.localToWorld( new THREE.Vector3(wall.userData.wall.v[10].x, 0, 0) );		
	}		 	
	
	
	var dirW = wall.getWorldDirection(new THREE.Vector3());
	var offset_1 = new THREE.Vector3().addScaledVector( dirW, wall.userData.wall.v[0].z ).multiplyScalar( 1.3 );
	var offset_2 = new THREE.Vector3().addScaledVector( dirW, wall.userData.wall.v[4].z ).multiplyScalar( 1.3 );


	var dir = [];
	dir[0] = new THREE.Vector3().subVectors( p2, p1 ).normalize();
	dir[1] = new THREE.Vector3().subVectors( p1, p2 ).normalize();
	
	
	var arrP = [];
	arrP[0] = {p1: b2[0], p2: pw[0], offset: offset_1, dir: dir[0]};
	arrP[1] = {p1: b2[1], p2: pw[1], offset: offset_1, dir: dir[1]};
	arrP[2] = {p1: b2[0], p2: pw[2], offset: offset_2, dir: dir[0]};
	arrP[3] = {p1: b2[1], p2: pw[3], offset: offset_2, dir: dir[1]};			
	arrP[4] = {p1: b2[0], p2: b2[1], offset: offset_1, dir: dir[1]};
	arrP[5] = {p1: b2[0], p2: b2[1], offset: offset_2, dir: dir[1]};
	
	
	for ( var i = 0; i < arrP.length; i++ )
	{
		var d = arrP[i].p1.distanceTo( arrP[i].p2 );	
		
		var v = line[i].geometry.vertices;
		v[0].x = v[1].x = v[6].x = v[7].x = -d/2;
		v[3].x = v[2].x = v[5].x = v[4].x = d/2;		
		line[i].geometry.verticesNeedUpdate = true;			
		
		var pos = new THREE.Vector3().subVectors( arrP[i].p1, arrP[i].p2 ).divideScalar( 2 ).add(arrP[i].p2);	
		
		
		if(1==1)
		{
			var dir = new THREE.Vector3().subVectors( arrP[i].p1, arrP[i].p2 ).normalize();			
			d = (dir.dot(arrP[i].dir) < - 0.99) ? -d : d;
		}
		
		line[i].position.copy(pos).add(arrP[i].offset);
		line[i].rotation.copy(wall.rotation);		
					
		label_2[i].textContent = Math.round(d * 100) / 100;
		label_2[i].userData.elem.pos = pos.clone().add(arrP[i].offset.clone().multiplyScalar( 2 ));		
		label_2[i].style.transform = 'translate(-50%, -50%) rotate('+THREE.Math.radToDeg(-ang2)+'deg)';
		label_2[i].style.display = 'block';
		label_2[i].userData.elem.show = true;
		
		fname_s_0194({elem: label_2[i]});		
		
		line[i].visible = true;			
		line[i].updateMatrixWorld();
		
		for ( var i2 = 0; i2 < line[i].userData.rulerwd.cone.length; i2++ )
		{
			var cone = line[i].userData.rulerwd.cone[i2];
			
			var xp = v[0].x;
			var zr = -Math.PI/2;
			
			if(i2 == 1) { xp = v[3].x; zr = Math.PI/2; }
			
			var pos = line[i].localToWorld( new THREE.Vector3(xp, 0, 0) );
			cone.position.copy(pos);
			cone.rotation.set(-Math.PI/2, 0, wall.rotation.y-zr);
			
			cone.visible = true;
		}
	}
		
}









function fname_s_092( intersect, cdm )
{
	clickO.move = intersect.object; 
	var controll = intersect.object;	
	var wd = controll.userData.controll_wd.obj;
	var wall = wd.userData.door.wall;
	var pos2 = new THREE.Vector3();
	
	
	var m = controll.userData.controll_wd.id;
	
	if(myCameraOrbit.activeCam.userData.isCam2D)
	{
		planeMath.position.set( 0, intersect.point.y, 0 );
		planeMath.rotation.set(-Math.PI/2, 0, 0);
		
		var v = wall.userData.wall.v;
		var z = v[0].z + (v[4].z - v[0].z) / 2;
	
		if(m == 0) { pos2 = wall.localToWorld( new THREE.Vector3(wd.userData.door.bound.min.x, controll.position.y, z) ); }
		else if(m == 1) { pos2 = wall.localToWorld( new THREE.Vector3(wd.userData.door.bound.max.x, controll.position.y, z) ); }				
	}
/* 	else if(camera == cameraWall)
	{
		
		planeMath.position.copy( intersect.point );
		planeMath.rotation.set( 0, controll.rotation.y, 0 );
		
		var dir = new THREE.Vector3().subVectors( wall.userData.wall.p[1].position, wall.userData.wall.p[0].position ).normalize();
		
		if(m == 0) { pos2 = new THREE.Vector3().addVectors( controll.position, dir ); }
		else if(m == 1) { pos2 = new THREE.Vector3().subVectors( controll.position, dir ); }	
		else if(m == 2) { pos2 = controll.position.clone(); pos2.y = -9999; }
		else if(m == 3) { pos2 = controll.position.clone(); pos2.y = 9999; }
	} */

	
	var offset = new THREE.Vector3().subVectors( intersect.object.position, intersect.point ); 
	var dir = new THREE.Vector3().subVectors( controll.position, pos2 ).normalize();  
	var qt = fname_s_0222( dir );

	
	wd.userData.door.wall.controll = {  }; 
	wd.userData.door.wall.controll.obj = controll;
	wd.userData.door.wall.controll.pos = controll.position.clone();
	wd.userData.door.wall.controll.dir = dir;
	wd.userData.door.wall.controll.qt = qt;
	wd.userData.door.wall.controll.offset = offset;
	
	var ps = [];
	var arr = infProject.tools.controllWD;
	ps[ps.length] = wall.worldToLocal( arr[0].position.clone() );
	ps[ps.length] = wall.worldToLocal( arr[1].position.clone() );
	ps[ps.length] = wall.worldToLocal( arr[2].position.clone() );
	ps[ps.length] = wall.worldToLocal( arr[3].position.clone() );
	
	wd.userData.door.wall.controll.arrPos = ps;
	
	wd.updateMatrixWorld();	
	wall.updateMatrixWorld();
	
	param_win.click = true;
}

 

 

function fname_s_093( event, controll )
{	
	var intersects = fname_s_0213( event, planeMath, 'one' ); 	
	if ( intersects.length < 1 ) return; 
	
	var wd = controll.userData.controll_wd.obj;
	var wall = wd.userData.door.wall;

	
	if(param_win.click) 
	{ 
		param_win.click = false; 

		wallClone.geometry = fname_s_034( wd ).geometry.clone(); 
		wallClone.position.copy( wd.userData.door.wall.position ); 
		wallClone.rotation.copy( wd.userData.door.wall.rotation );
		
		objsBSP = { wall : wallClone, wd : fname_s_035( wd ) };
		
		
		wd.material.depthTest = false;  
		wd.material.opacity = 1.0; 		
	}	
	
	var pos = new THREE.Vector3().addVectors( wd.userData.door.wall.controll.offset, intersects[ 0 ].point );	
	var v1 = fname_s_0220( new THREE.Vector3().subVectors( pos, wd.userData.door.wall.controll.pos ), wd.userData.door.wall.controll.qt );
	v1 = new THREE.Vector3().addScaledVector( wd.userData.door.wall.controll.dir, v1.z );  
	v1 = new THREE.Vector3().addVectors( wd.userData.door.wall.controll.pos, v1 );	


	
	if(1==2)
	{		
		var pos2 = wall.worldToLocal( v1.clone() );	

		function fname_s_094(pos, pos2)
		{
			var res = Math.floor((pos2 - pos) * 10)/10;
			
			return pos2 - res;
		}		
 
		if(controll.userData.controll_wd.id == 0)
		{  
			pos2.x = fname_s_094(pos2.x, wd.userData.door.wall.controll.arrPos[1].x);
			
			var x_min = wd.userData.door.bound.min.x;  
			if(pos2.x < x_min){ pos2.x = x_min; } 	
			else if(pos2.x > wd.userData.door.wall.controll.arrPos[1].x - 0.2){ pos2.x = wd.userData.door.wall.controll.arrPos[1].x - 0.2; }		
		}		
		else if(controll.userData.controll_wd.id == 1)
		{
			pos2.x = fname_s_094(pos2.x, wd.userData.door.wall.controll.arrPos[0].x);
			
			var x_max = wd.userData.door.bound.max.x;
			if(pos2.x > x_max){ pos2.x = x_max; }
			else if(pos2.x < wd.userData.door.wall.controll.arrPos[0].x + 0.2){ pos2.x = wd.userData.door.wall.controll.arrPos[0].x + 0.2; }							
		}
		else if(controll.userData.controll_wd.id == 2)
		{
			pos2.y = fname_s_094(pos2.y, wd.userData.door.wall.controll.arrPos[3].y);
			
			var y_min = wd.userData.door.bound.min.y + 0.1;
			if(pos2.y < y_min){ pos2.y = y_min; }
			else if(pos2.y > wd.userData.door.wall.controll.arrPos[3].y - 0.2){ pos2.y = wd.userData.door.wall.controll.arrPos[3].y - 0.2; }		
		}		
		else if(controll.userData.controll_wd.id == 3)
		{
			pos2.y = fname_s_094(pos2.y, wd.userData.door.wall.controll.arrPos[2].y);
			
			var y_max = wd.userData.door.bound.max.y;
			if(pos2.y > y_max){ pos2.y = y_max; }
			else if(pos2.y < wd.userData.door.wall.controll.arrPos[2].y + 0.2){ pos2.y = wd.userData.door.wall.controll.arrPos[2].y + 0.2; }					
		}		
		
		v1 = wall.localToWorld( pos2 );			
	}
	
	var pos2 = new THREE.Vector3().subVectors( v1, controll.position );  
	controll.position.copy( v1 ); 	

	
	{
		var arr = infProject.tools.controllWD;
		
		var x = arr[0].position.distanceTo(arr[1].position);
		var y = arr[2].position.distanceTo(arr[3].position);
		
		var pos = pos2.clone().divideScalar( 2 ).add( wd.position.clone() );
		
		сhangeSizePosWD( wd, pos, x, y );
	}
	
	
	var arr = infProject.tools.controllWD;	
	if(controll.userData.controll_wd.id == 0 || controll.userData.controll_wd.id == 1)
	{ 
		arr[2].position.add( pos2.clone().divideScalar( 2 ) );
		arr[3].position.add( pos2.clone().divideScalar( 2 ) );
	}
	else if(controll.userData.controll_wd.id == 2 || controll.userData.controll_wd.id == 3)
	{ 
		arr[0].position.add( pos2.clone().divideScalar( 2 ) );
		arr[1].position.add( pos2.clone().divideScalar( 2 ) );
	}	
	
	 
	fname_s_0130(wd);
	
	fname_s_091(wd);
	
	fname_s_062({obj: wd});
}




function fname_s_095( controll )
{
	if(param_win.click) { param_win.click = false; return; }
	
	var wd = controll.userData.controll_wd.obj;
	
	objsBSP.wd = fname_s_035( wd );
	
	fname_s_036( wd, objsBSP );
	
	if(myCameraOrbit.activeCam.userData.isCam2D)
	{ 
		wd.material.depthTest = false;  
		wd.material.opacity = 1.0; 		 	
	}
	else
	{ 		
		wd.material.depthTest = true;
		wd.material.transparent = true;
		wd.material.opacity = 0;					
	}
	
	fname_s_062({obj: wd});
	
	clickO.last_obj = wd;
}





function fname_s_096( intersect )
{
	if(clickO.move)
	{
		if(clickO.move.userData.tag == 'free_dw') { return; }	
	}	 
	
	var obj = intersect.object;	
	clickO.move = obj;
	

	offset = new THREE.Vector3().subVectors( intersect.object.position, intersect.point );
	planeMath.position.set( 0, intersect.point.y, 0 );
	planeMath.rotation.set(-Math.PI/2, 0, 0);	

	param_win.click = true;	
	param_wall.wallR = fname_s_0103([], clickO.move);

	
	if(1==1)
	{  
		obj.userData.point.last.pos = obj.position.clone(); 		
		
		for ( var i = 0; i < param_wall.wallR.length; i++ )
		{						
			for ( var i2 = 0; i2 < param_wall.wallR[i].userData.wall.arrO.length; i2++ )
			{
				var wd = param_wall.wallR[i].userData.wall.arrO[i2];
				 
				wd.userData.door.last.pos = wd.position.clone();
				wd.userData.door.last.rot = wd.rotation.clone(); 
			}
		}		 			
	}

	tabObject.activeObjRightPanelUI_1({obj: obj}); 	
}



function fname_s_097()
{
	var arr = [];
	
	for ( var i = 0; i < clickO.move.w.length; i++ )
	{
		arr[i] = { id : clickO.move.w[i].userData.id, arrO : [] };
		
		for ( var i2 = 0; i2 < clickO.move.w[i].userData.wall.arrO.length; i2++ )
		{
			arr[i].arrO[i2] = { pos : '', rot : '' };
			arr[i].arrO[i2].pos = clickO.move.w[i].userData.wall.arrO[i2].position.clone();
			arr[i].arrO[i2].rot = clickO.move.w[i].userData.wall.arrO[i2].rotation.clone();			 
		}
	}

	return arr;
}





function fname_s_098( event, obj )
{
	if(obj.userData.point.type) 
	{ 
		if(obj.userData.point.type == 'continue_create_wall') {  } 
		else { fname_s_0100( event, obj ); return; } 
	}	
	
	if(param_win.click) 
	{
		fname_s_037(param_wall.wallR);
		param_win.click = false;
	}	
	
	var intersects = fname_s_0213( event, planeMath, 'one' ); 
	
	if ( intersects.length > 0 ) 
	{
		var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, offset );				
		pos.y = obj.position.y; 
		
		var pos2 = new THREE.Vector3().subVectors( pos, obj.position );
		
		obj.position.copy( pos );				
		fname_s_0100( event, obj );	
				
		 
		for ( var i = 0; i < obj.w.length; i++ )
		{			
			fname_s_03(obj.w[i]);	
		}		
	
		fname_s_0106(obj);			
		
		
		
		let arrW = [];
		for ( let i = 0; i < obj.p.length; i++ )
		{
			arrW.push(...obj.p[i].w);		
		}		
		arrW = [...new Set(arrW)];
		fname_s_040(arrW);
	}
	
}


function fname_s_099(point, point2, wall, side, pos2)
{
	var v = wall.userData.wall.v;
	
	var offX = 0; 
	
	if(side == 0)
	{
		var x1 = v[6].x - (v[0].x + offX);
		var x2 = v[10].x - (v[4].x + offX);	
		var xmin = (x1 < x2) ? x1 : x2;		
	}
	if(side == 1)
	{
		var n = v.length;
		var x1 = (v[n - 6].x - offX) - v[n - 12].x;
		var x2 = (v[n - 2].x - offX) - v[n - 8].x;	
		var xmin = (x1 < x2) ? x1 : x2;			
	}

	
	
	if(xmin <= 0.1)
	{		
		var dir = new THREE.Vector3().subVectors( point.position, point2.position ).normalize();
		var v1 = new THREE.Vector3().addScaledVector( dir, Math.abs(xmin - 0.1) + 0.1 );		
		point.position.add( v1 );
	}
	
	return point.position;
}




function fname_s_0100( event, obj )
{	
	var arrDp = [];
	var wall = infProject.scene.array.wall;
	var window = infProject.scene.array.window;
	var door = infProject.scene.array.door;
	
	for ( var i = 0; i < wall.length; i++ ){ arrDp[arrDp.length] = wall[i]; } 
	for ( var i = 0; i < window.length; i++ ){ arrDp[arrDp.length] = window[i]; } 
	for ( var i = 0; i < door.length; i++ ){ arrDp[arrDp.length] = door[i]; }  
	arrDp[arrDp.length] = planeMath;
	
	var intersects = fname_s_0213( event, arrDp, 'arr' );
	
	var plane = null;
	var point = null;
	var wall = null;	
	var dw = null;
	var pos = new THREE.Vector3();	
	
	for ( var i = 0; i < intersects.length; i++ ) 
	{
		var object = intersects[ i ].object;
		
		if(object.userData.tag == 'planeMath')
		{ 
			pos = intersects[i].point; 
			obj.position.set( pos.x, obj.position.y, pos.z ); 
			plane = object; 
		} 			
		else if(object.userData.tag == 'wall')
		{ 			
			var flag = true;
			for ( var i2 = 0; i2 < object.userData.wall.p.length; i2++ ) 
			{				
				if(object.userData.wall.p[i2].userData.id == obj.userData.id) { flag = false; break; }									
			}
			if(flag) { wall = object; }			
		}
		else if(object.userData.tag == 'window' || object.userData.tag == 'door'){ dw = object; } 
	}
	
	let glued = false;
	const cam2D = myCameraOrbit.activeCam;	
	const p1 = new THREE.Vector3( obj.position.x, 0, obj.position.z );
	
	for ( var i = 0; i < obj_point.length; i++ )
	{
		if(obj_point[i] === obj) { continue; }		
		 
		const p2 = new THREE.Vector3( obj_point[i].position.x, 0, obj_point[i].position.z ); 
		
		if(p1.distanceTo( p2 ) < 0.2 / cam2D.zoom)
		{ 		
			obj.position.set( obj_point[i].position.x, obj.position.y, obj_point[i].position.z );
			obj.userData.point.cross = point = obj_point[i];
			glued = true;
			break;
		}	
	}	

	
	if(!glued)
	{
		let arrP = ghostLevel.arr.point;
		const cam2D = myCameraOrbit.activeCam;
		
		for ( var i = 0; i < arrP.length; i++ )
		{
			const p2 = new THREE.Vector3( arrP[i].position.x, 0, arrP[i].position.z ); 			
			
			if(p1.distanceTo( p2 ) < 0.1 / cam2D.zoom)
			{ 		
				obj.position.set( arrP[i].position.x, obj.position.y, arrP[i].position.z );
				point = arrP[i];
				break;
			}	
		} 		
	}
	  
	if(point) 
	{
		infProject.tools.axis[0].visible = false;
		infProject.tools.axis[1].visible = false;		
	} 
	else if(dw)
	{
		obj.userData.point.cross = null; 
	}
	else if(!wall) 
	{ 
		obj.userData.point.cross = plane;
		
		fname_s_0101( obj );		
	}
	else
	{ 
		wall.updateMatrixWorld();			
		var pos = wall.worldToLocal( pos.clone() );	
		var pos = wall.localToWorld( new THREE.Vector3(pos.x, 0, 0 ) );

		if(p1.distanceTo( new THREE.Vector3(pos.x, 0, pos.z) ) < 0.2 / cam2D.zoom)
		{
			obj.position.set( pos.x, obj.position.y, pos.z ); 
			obj.userData.point.cross = wall; 			
		}
		
		infProject.tools.axis[0].visible = false;
		infProject.tools.axis[1].visible = false;

		fname_s_0101( obj );
	}
}

  




function fname_s_0101( point )
{ 
	if(!myCameraOrbit.activeCam.userData.isCam2D) return;
	const cam2D = myCameraOrbit.activeCam;
	
	var pX = [];
	var pZ = [];
	
	for ( var i = 0; i < obj_point.length; i++ )
	{
		if(obj_point[i] == point) { continue; }		

		var p1 = fname_s_017(obj_point[i].position, new THREE.Vector3().addVectors(obj_point[i].position, new THREE.Vector3(10,0,0)), point.position);	
		var p2 = fname_s_017(obj_point[i].position, new THREE.Vector3().addVectors(obj_point[i].position, new THREE.Vector3(0,0,10)), point.position);
		
		var x = Math.abs( obj_point[i].position.x - p1.x );
		var z = Math.abs( obj_point[i].position.z - p2.z );
		
		if(x < 0.06 / cam2D.zoom){ pX[pX.length] = i; }
		if(z < 0.06 / cam2D.zoom){ pZ[pZ.length] = i; }			
	}
	
	
	if(pX.length > 0)
	{
		var v = [];
		for ( var i = 0; i < pX.length; i++ ){ v[i] = obj_point[pX[i]].position; }
		var n1 = pX[fname_s_0126(v, point.position)];		 
	} 
	
	if(pZ.length > 0)
	{
		var v = [];
		for ( var i = 0; i < pZ.length; i++ ){ v[i] = obj_point[pZ[i]].position; }
		var n2 = pZ[fname_s_0126(v, point.position)]; 		
	}	
	
	
	if(pX.length > 0 && pZ.length > 0) 
	{ 
		point.position.x = obj_point[n1].position.x; 
		point.position.z = obj_point[n2].position.z; 		
		fname_s_0102(point, obj_point[n1].position, infProject.tools.axis[0], 'xz'); 
		fname_s_0102(point, obj_point[n2].position, infProject.tools.axis[1], 'xz'); 
	}
	else
	{
		(pX.length > 0) ? fname_s_0102(point, obj_point[n1].position, infProject.tools.axis[0], 'x') : infProject.tools.axis[0].visible = false;
		(pZ.length > 0) ? fname_s_0102(point, obj_point[n2].position, infProject.tools.axis[1], 'z') : infProject.tools.axis[1].visible = false;
	}
}

 



function fname_s_0102(point, pos2, lineAxis, axis)
{
	
	if(axis == 'x') { point.position.x = pos2.x; }
	if(axis == 'z') { point.position.z = pos2.z; } 
	
	var pos2 = new THREE.Vector3(pos2.x, point.position.y, pos2.z);

	var dir = new THREE.Vector3().subVectors( point.position, pos2 ).normalize();
	var angleDeg = Math.atan2(dir.x, dir.z);
	lineAxis.rotation.set(0, angleDeg + Math.PI / 2, 0);		
	lineAxis.position.copy( point.position );
	lineAxis.visible = true;	
}


 



function fname_s_0103(arr, point) 
{	
	for ( var i = 0; i < point.p.length; i++ )
	{				
		for ( var j = 0; j < point.p[i].w.length; j++ )
		{
			var flag = false;
			for ( var i2 = 0; i2 < arr.length; i2++ )
			{
				if(point.p[i].w[j] == arr[i2]){ flag = true; break; }
			}
			
			if(flag){ continue; }				

			arr[arr.length] = point.p[i].w[j];
		}		
	}
	
	return arr;	
}



function fname_s_0104(wall) 
{	
	var arr = [];

	for ( var j = 0; j < wall.userData.wall.p.length; j++ )
	{
		for ( var i = 0; i < wall.userData.wall.p[j].p.length; i++ )
		{ 
			for ( var i2 = 0; i2 < wall.userData.wall.p[j].p[i].w.length; i2++ ) 
			{ 	
				var flag = true;
				for ( var i3 = 0; i3 < arr.length; i3++ )
				{
					if(arr[i3] == wall.userData.wall.p[j].p[i].w[i2]) { flag = false; }
				}

				if(flag) { arr[arr.length] = wall.userData.wall.p[j].p[i].w[i2]; }
			} 
		}		
	}
	
	return arr;	
}




function fname_s_0105(wall) 
{	
	var arr = [];

	for ( var i = 0; i < wall.userData.wall.p.length; i++ )
	{
		for ( var i2 = 0; i2 < wall.userData.wall.p[i].w.length; i2++ )
		{ 
			var flag = true;
			for ( var i3 = 0; i3 < arr.length; i3++ )
			{
				if(arr[i3] == wall.userData.wall.p[i].w[i2]) { flag = false; }
			}

			if(flag) { arr[arr.length] = wall.userData.wall.p[i].w[i2]; } 
		}		
	}
	
	return arr;	
}




function fname_s_0106(point)
{		
	
	fname_s_0107(point);	

	
	
	var arrP = point.p;
	for ( var j = 0; j < arrP.length; j++ )
	{
		
		if(arrP[j].p.length > 1) { fname_s_0107(arrP[j]); }		
	}
	
}


function fname_s_0107(point)
{
	var arrP = point.p;
	var arrW = point.w;
	var arrS = point.start;
	
	var arrD = [];
	
	var n = 0;
	for ( var i = 0; i < arrP.length; i++ )
	{
		if(point.position.distanceTo(arrP[i].position) < 0.01)
		{ 
			for ( var i2 = 0; i2 < arrW[i].geometry.vertices.length; i2++ )
			{
				arrW[i].geometry.vertices[i2].x = 0;
			}	
			continue; 
		}
		
		arrD[n] = {id: i};
		
		var dir = new THREE.Vector3().subVectors( point.position, arrP[i].position ).normalize();
		arrD[n].angel = Math.atan2(dir.x, dir.z);
		
		if(arrD[n].angel < 0){ arrD[n].angel += Math.PI * 2; }		
		n++;
	}
	
	arrD.sort(function (a, b) { return a.angel - b.angel; });
	
	for ( var i = 0; i < arrD.length; i++ )
	{ 
		var i2 = (i == arrD.length - 1) ? 0 : (i + 1);
		
		fname_s_0108(arrW[arrD[i].id], arrW[arrD[i2].id], arrS[arrD[i].id], arrS[arrD[i2].id], point.position); 
	}	

}



function fname_s_0108(line1, line2, s1, s2, pointC)
{
	var v1 = line1.geometry.vertices;
	var v2 = line2.geometry.vertices;
	
	if(s1 == 1){ var n1 = 0; var n2 = 6; var n3 = 7; var n4 = 8; var n5 = 9; }
	else { var n1 = 10; var n2 = 4; var n3 = 5; var n4 = 2; var n5 = 3; }
	
	if(s2 == 1){ var f1 = 4; var f2 = 10; var f3 = 11; var f4 = 8; var f5 = 9; }
	else { var f1 = 6; var f2 = 0; var f3 = 1; var f4 = 2; var f5 = 3; }


	
	
	line1.updateMatrixWorld();
	var m1a = line1.localToWorld( v1[n1].clone() );
	var m1b = line1.localToWorld( v1[n2].clone() );

	line2.updateMatrixWorld();
	var m2a = line2.localToWorld( v2[f1].clone() );
	var m2b = line2.localToWorld( v2[f2].clone() );


	
	var crossP = fname_s_09(m1a, m1b, m2a, m2b);

	var cross = false;
	
	if(!crossP[1]) { if(fname_s_0109(m1a, m1b, m2a, m2b)) { cross = true; } }	
	
	if(cross)
	{		
		var per1 = line1.worldToLocal( crossP[0].clone() ).x;
		var per2 = line2.worldToLocal( crossP[0].clone() ).x;
		var per3 = line1.worldToLocal( pointC.clone() ).x;
		var per4 = line2.worldToLocal( pointC.clone() ).x;
	}
	else
	{		
		var per1 = line1.worldToLocal( pointC.clone() ).x; 
		var per2 = line2.worldToLocal( pointC.clone() ).x;		
		
		var per3 = line1.worldToLocal( pointC.clone() ).x;
		var per4 = line2.worldToLocal( pointC.clone() ).x;	
	}


	v1[n2].x = v1[n3].x = per1;
	v2[f2].x = v2[f3].x = per2;
	
	v1[n4].x = v1[n5].x = per3;
	v2[f4].x = v2[f5].x = per4;	

	line1.geometry.verticesNeedUpdate = true;	
	line2.geometry.verticesNeedUpdate = true;
	
	line1.geometry.computeBoundingBox(); 	
	line1.geometry.computeBoundingSphere();	
	
	line2.geometry.computeBoundingBox(); 	
	line2.geometry.computeBoundingSphere();	
	
	
	if(line1.userData.wall.svg.lineW)
	{
		line1.updateMatrixWorld();
		var m1a = line1.localToWorld( v1[n1].clone() );
		var m1b = line1.localToWorld( v1[n2].clone() );		
		
		if(s1 == 1) { fname_s_0300({el: line1.userData.wall.svg.lineW[0], point: [m1a, m1b]}); }
		else { fname_s_0300({el: line1.userData.wall.svg.lineW[1], point: [m1a, m1b]}); }
	}

	if(line2.userData.wall.svg.lineW && 1==1)
	{
		line2.updateMatrixWorld();
		var m1a = line2.localToWorld( v2[f1].clone() );
		var m1b = line2.localToWorld( v2[f2].clone() );		
		
		if(s1 == 1) { fname_s_0300({el: line2.userData.wall.svg.lineW[0], point: [m1a, m1b]}); }
		else { fname_s_0300({el: line2.userData.wall.svg.lineW[1], point: [m1a, m1b]}); }
	}	
}






 
 
function fname_s_0109(p0, p1, p2, p3)
{			
	var dir = new THREE.Vector3().subVectors( p1, p0 ).normalize();
	var v1 = new THREE.Vector3().addScaledVector( dir, 0.5 );
	var p1 = new THREE.Vector3().addVectors( p1, v1 );		
		
	var dir = new THREE.Vector3().subVectors( p3, p2 ).normalize();
	var v1 = new THREE.Vector3().addScaledVector( dir, 0.5 );
	var p3 = new THREE.Vector3().addVectors( p3, v1 );	
	
	if( !fname_s_013(p0, p1, p2, p3) ) {  return false; }		
	
	return true;
}



 
function fname_s_0110(p0, p1, p2, p3) 
{			
	var dir = new THREE.Vector3().subVectors( p1, p0 ).normalize();
	var v1 = new THREE.Vector3().addScaledVector( dir, 0.01 );
	var p0 = new THREE.Vector3().addVectors( p0, v1 );		
	var p1 = new THREE.Vector3().subVectors( p1, v1 );
	
	if( !fname_s_013(p0, p1, p2, p3) ) {  return false; }		
	
	return true;
}





function fname_s_0111( point, walls )
{
	point.position.copy( point.userData.point.last.pos );
	
	for ( var i = 0; i < point.p.length; i++ )
	{
		fname_s_03(point.w[i], {point:point});		
	}		
	
	fname_s_0106(point);  
	fname_s_040(walls);
	fname_s_0146(point.zone); 
	
	fname_s_038(walls);
	
	infProject.tools.axis[0].visible = false;
	infProject.tools.axis[1].visible = false;		
}


function fname_s_0112(obj)
{  	
	if(fname_s_021(obj.userData.point.last.pos, obj.position)) { return; }		
	
	obj.userData.point.last.pos = obj.position.clone();
	
	fname_s_0106(obj);			
	
	fname_s_040(param_wall.wallR);	 
}







var param_wall = { click : false, wallR : [], posS : 0, qt_1 : [], qt_2 : [], arrZone : [] };


function fname_s_0113( intersect )
{
	var obj = intersect.object;
	
	clickO.move = obj;
	
	offset = new THREE.Vector3().subVectors( obj.position, intersect.point );
	planeMath.position.set( 0, intersect.point.y, 0 );	
	planeMath.rotation.set(-Math.PI/2, 0, 0);	

	param_win.click = true;	
	param_wall.posS = new THREE.Vector3().addVectors( intersect.point, offset );	
	  
	param_wall.wallR = fname_s_0104(obj);

	var p = obj.userData.wall.p;
	
	for ( var i = 0; i < p[0].w.length; i++ )
	{  
		var dir = new THREE.Vector3().subVectors( p[0].position, p[0].p[i].position ).normalize();	
		param_wall.qt_1[i] = fname_s_0222(dir);
	}
	
	for ( var i = 0; i < p[1].w.length; i++ )
	{ 
		var dir = new THREE.Vector3().subVectors( p[1].position, p[1].p[i].position ).normalize();
		param_wall.qt_2[i] = fname_s_0222(dir);
	}
	
	param_wall.arrZone = fname_s_0116(obj);

	clickO.click.wall = [...new Set([...p[0].w, ...p[1].w])];  
	
	fname_s_0115(obj);
	
	if(myCameraOrbit.activeCam.userData.isCam2D)
	{
		tabObject.activeObjRightPanelUI_1({obj: obj}); 	
	}
}


function fname_s_0114(cdm)
{
	var intersect = cdm.rayhit;
	
	
	if(!intersect) return;
	if(!intersect.face) return;
	var index = intersect.face.materialIndex;	
	
	if(index == 1 || index == 2) { } 
	else { return; }
	
	var obj = intersect.object;	
	
	clickO.obj = obj;
	clickO.index = index;  	

	myComposerRenderer.outlineAddObj({arr: [obj]});
	tabObject.activeObjRightPanelUI_1({obj: obj, side: index});
}



function fname_s_0115(wall)
{
	wall.userData.wall.p[0].userData.point.last.pos = wall.userData.wall.p[0].position.clone();
	wall.userData.wall.p[1].userData.point.last.pos = wall.userData.wall.p[1].position.clone();
	
	var walls = fname_s_0104(wall);
	
	for ( var i = 0; i < walls.length; i++ )
	{		
		walls[i].userData.wall.last.pos = walls[i].position.clone();
		walls[i].userData.wall.last.rot = walls[i].rotation.clone();
		
		for ( var i2 = 0; i2 < walls[i].userData.wall.arrO.length; i2++ )
		{
			var wd = walls[i].userData.wall.arrO[i2];
			 
			wd.userData.door.last.pos = wd.position.clone();
			wd.userData.door.last.rot = wd.rotation.clone(); 
		}
	}		 				
}
	




function fname_s_0116( wall )
{
	var m = 0;
	arr = [];
	
	for ( var i = 0; i < wall.userData.wall.p[0].zone.length; i++ ) { arr[m] = wall.userData.wall.p[0].zone[i]; m++; } 
	for ( var i = 0; i < wall.userData.wall.p[1].zone.length; i++ )
	{
		var flag = true;
		for ( var i2 = 0; i2 < arr.length; i2++ )
		{
			if(wall.userData.wall.p[1].zone[i] == arr[i2]) { flag = false; break; }
		}
		
		if(flag) { arr[m] = wall.userData.wall.p[1].zone[i]; m++; }
	}

	return arr;	
}







function fname_s_0117( event, obj ) 
{		
	
	if(myCameraOrbit.activeCam.userData.isCam3D) { return; }
	
	if(param_win.click) 
	{
		fname_s_037(param_wall.wallR);
		param_win.click = false;
	}	
	
	var intersects = fname_s_0213( event, planeMath, 'one' );
	
	if ( intersects.length > 0 ) 
	{
		var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, offset );	
		
		
		
		var x1 = obj.userData.wall.p[1].position.z - obj.userData.wall.p[0].position.z;
		var z1 = obj.userData.wall.p[0].position.x - obj.userData.wall.p[1].position.x;	
		var dir = new THREE.Vector3(x1, 0, z1).normalize();						
		
		var qt1 = fname_s_0222(dir);
		var v1 = fname_s_0220( new THREE.Vector3().subVectors( pos, param_wall.posS ), qt1 );	
		v1 = new THREE.Vector3().addScaledVector( dir, v1.z );
		pos = new THREE.Vector3().addVectors( param_wall.posS, v1 );

		var pos3 = obj.position.clone();
		var pos2 = new THREE.Vector3().subVectors( pos, obj.position );			
		
		
		
		pos2 = new THREE.Vector3().subVectors ( fname_s_0118(obj.userData.wall.p[0], pos2, param_wall.qt_1, dir), obj.userData.wall.p[0].position ); 
		pos2 = new THREE.Vector3().subVectors ( fname_s_0118(obj.userData.wall.p[1], pos2, param_wall.qt_2, dir), obj.userData.wall.p[1].position );
		
		
		pos2 = new THREE.Vector3(pos2.x, 0, pos2.z);
						
		obj.userData.wall.p[0].position.add( pos2 );
		obj.userData.wall.p[1].position.add( pos2 );		
		
		
		for ( var i = 0; i < clickO.click.wall.length; i++ )
		{ 
			fname_s_03(clickO.click.wall[i]);		
		}
		
		fname_s_0106(obj.userData.wall.p[0]);
		fname_s_0106(obj.userData.wall.p[1]);
		
		fname_s_040(obj.userData.wall.p[0].w);
		fname_s_040(obj.userData.wall.p[1].w);
	}	
}







function fname_s_0118(point, pos2, qt, dir2)
{
	var pos = new THREE.Vector3().addVectors ( point.position, pos2 );	
	
	for ( var i = 0; i < point.p.length; i++ )
	{
		if(point.w[i] == clickO.move){ continue; }
		
		var v = point.w[i].userData.wall.v;
		
		
		if(point.start[i] == 0)
		{
			var x1_a = v[0].x;
			var x1_b = v[4].x;				
			var x2_a = v[6].x;
			var x2_b = v[10].x;
			

			var v2 = fname_s_0220( new THREE.Vector3().subVectors( new THREE.Vector3(0,0,0), pos2 ), qt[i] );
			
			var fg1 = false;
			var fg2 = false;
			if(x2_a - (x1_a + v2.z) <= 0.05){ fg1 = true; }
			if(x2_b - (x1_b + v2.z) <= 0.05){ fg2 = true; } 
			if(fg1 & fg2)
			{ 
				if(x2_a - (x1_a + v2.z) < x2_b - (x1_b + v2.z) ){ fg2 = false; } 
				else{ fg1 = false; }
			}
			
						
			if(fg1)
			{				
				var zx1 = v[6].clone();	
				zx1.x -= 0.05;						
				
				var zx2 = new THREE.Vector3().subVectors( v[4], v[0] );	
				zx2.add( zx1 );		
				
				var ps3 = new THREE.Vector3().subVectors( zx2, zx1 ).divideScalar ( 2 );
				ps3.add( zx1 );				
				pos = point.w[i].localToWorld( ps3.clone() );
			}			
			else if(fg2)
			{	
				var zx1 = v[10].clone();	
				zx1.x -= 0.05;						
				
				var zx2 = new THREE.Vector3().subVectors( v[0], v[4] );	
				zx2.add( zx1 );		
				
				var ps3 = new THREE.Vector3().subVectors( zx2, zx1 ).divideScalar ( 2 );
				ps3.add( zx1 );			
				pos = point.w[i].localToWorld( ps3.clone() );	
			}
			
			
			if(fg1 | fg2)
			{
				var x1 = point.p[i].position.z - pos.z;
				var z1 = pos.x - point.p[i].position.x;			
				var dir = new THREE.Vector3(x1, 0, z1).normalize();						
				var ps = new THREE.Vector3().addVectors( pos, dir );
				pos = fname_s_08(ps, pos, point.position, new THREE.Vector3().addVectors( point.position, pos2 ));
			}
		}
		else if(point.start[i] == 1)
		{
			var v2 = fname_s_0220( new THREE.Vector3().subVectors( pos2, new THREE.Vector3(0,0,0) ), qt[i] );
			
			var n = v.length;				
			var x1_a = v[n - 12].x;
			var x1_b = v[n - 8].x;				
			var x2_a = v[n - 6].x;
			var x2_b = v[n - 2].x;	

			
			var fg1 = false;
			var fg2 = false;
			if((x2_a + v2.z) - x1_a < 0.05){ fg1 = true; }
			if((x2_b + v2.z) - x1_b < 0.05){ fg2 = true; }
			if(fg1 & fg2)
			{ 
				if((x2_a + v2.z) - x1_a < (x2_b + v2.z) - x1_b){ fg2 = false; } 
				else{ fg1 = false; }
			}			

			
			if(fg1)
			{
				var zx1 = v[v.length - 12].clone();	
				zx1.x += 0.05;						
				
				var zx2 = new THREE.Vector3().subVectors( v[v.length - 2], v[v.length - 6] );	
				zx2.add( zx1 );		
				
				var ps3 = new THREE.Vector3().subVectors( zx2, zx1 ).divideScalar ( 2 );
				ps3.add( zx1 );				
				pos = point.w[i].localToWorld( ps3.clone() );
			}			
			else if(fg2)
			{			
				var zx1 = v[v.length - 8].clone();	
				zx1.x += 0.05;						
				
				var zx2 = new THREE.Vector3().subVectors( v[v.length - 6], v[v.length - 2] );	
				zx2.add( zx1 );		
				
				var ps3 = new THREE.Vector3().subVectors( zx2, zx1 ).divideScalar ( 2 );
				ps3.add( zx1 );		
				pos = point.w[i].localToWorld( ps3.clone() );	
			}
			
			
			if(fg1 | fg2)
			{
				var x1 = point.p[i].position.z - pos.z;
				var z1 = pos.x - point.p[i].position.x;			
				var dir = new THREE.Vector3(x1, 0, z1).normalize();						
				var ps = new THREE.Vector3().addVectors( pos, dir );
				pos = fname_s_08(ps, pos, point.position, new THREE.Vector3().addVectors( point.position, pos2 ));
			}			
		}	

				
	}
	
	return pos;
}









function fname_s_0119(wall, index, room) 
{
	var p = wall.userData.wall.p;
	var dir1 = new THREE.Vector3().subVectors( p[1].position, p[0].position ).normalize();						
	var unique = fname_s_0120([{ obj : wall, dir : 'forward' }], p, dir1);	
	
	var arrW = [];
	var arrS = [];
	for (i = 0; i < unique.length; i++) 
	{  
		arrW[i] = unique[i].obj; 
		arrS[i] = (unique[i].dir == 'forward') ? index : (index == 1) ? 2 : 1; 	
	}
	
		
	arrWallFront.index = index;  
	arrWallFront.room = room;
	arrWallFront.wall = [];	  
	arrWallFront.wall_2 = [];	
	
	
	
	if(room)
	{
		for (var i = arrW.length - 1; i >= 0; i--) 
		{ 
			var flag = true;
			
			for (var i2 = 0; i2 < room.w.length; i2++)  
			{
				if(arrW[i] == room.w[i2]) { flag = false; break; }
			}	

			if(flag) { arrW.splice(i, 1); arrS.splice(i, 1); }
		}

		
		var arrW2 = [];
		for (var i = 0; i < arrW.length; i++)
		{
			var p = arrW[i].userData.wall.p;
			
			for (var i2 = 0; i2 < p.length; i2++)
			{
				for (var i3 = 0; i3 < p[i2].w.length; i3++)
				{
					if(p[i2].w[i3] == arrW[i]) continue;		
					
					var flag = false;					
					for (var i4 = 0; i4 < arrW.length; i4++)  
					{
						if(p[i2].w[i3] == arrW[i4]) { flag = true; break; }		
					}										
					if(flag) { continue; }
				
					
					for (var i4 = 0; i4 < room.w.length; i4++)  
					{
						
						if(p[i2].w[i3] == room.w[i4]) 
						{ 
							var dir2 = new THREE.Vector3().subVectors( p[i2].w[i3].userData.wall.p[1].position, p[i2].w[i3].userData.wall.p[0].position ).normalize();
							var rad = new THREE.Vector3(dir1.z, 0, dir1.x).angleTo(new THREE.Vector3(dir2.z, 0, dir2.x));
							
							if(index == 2) if(Math.round(THREE.Math.radToDeg(rad)) > 90) continue;		
							if(index == 1) if(Math.round(THREE.Math.radToDeg(rad)) < 90) continue; 
							
							
							arrW2.push(p[i2].w[i3]); 
							break; 
						}	
					}					
				}
			}			
		}
		
		arrWallFront.wall_2 = arrW2; 	
	}
	

	
	for (i = 0; i < arrW.length; i++) 
	{ 
		arrWallFront.wall[i] = { obj : arrW[i], index : arrS[i] };  
	}


	
	var arrV2 = [];
	for (i = 0; i < arrW.length; i++)
	{
		arrW[i].updateMatrixWorld();
		var v = arrW[i].userData.wall.v;			
		
		var arrN = (arrS[i] == 2) ? [4,5,11,10] : [0,1,7,6];

		for (i2 = 0; i2 < arrN.length; i2++)
		{ 
			if(i == 0) { arrV2[arrV2.length] = v[arrN[i2]].clone(); }
			else 
			{ 
				var worldV = arrW[i].localToWorld( v[arrN[i2]].clone() ); 
				arrV2[arrV2.length] = arrW[0].worldToLocal( worldV );  
			}
		}
		
	}
	
	
	var box = { min : { x : arrV2[0].x, y : arrV2[0].y }, max : { x : arrV2[0].x, y : arrV2[0].y } };
	
	for (i = 0; i < arrV2.length; i++)
	{
		if(arrV2[i].x < box.min.x) { box.min.x = arrV2[i].x; }
		else if(arrV2[i].x > box.max.x) { box.max.x = arrV2[i].x; }
		
		if(arrV2[i].y < box.min.y) { box.min.y = arrV2[i].y; }
		else if(arrV2[i].y > box.max.y) { box.max.y = arrV2[i].y; }			
	}
	
	
	var arrV3 = 
	[
		new THREE.Vector3(box.min.x, box.min.y, 0), 
		new THREE.Vector3(box.min.x, box.max.y, 0),
		new THREE.Vector3(box.max.x, box.max.y, 0),
		new THREE.Vector3(box.max.x, box.min.y, 0), 
	];
	
	
	
	var arrV = [];
	
	for (i = 0; i < arrV3.length; i++)
	{
		var min = 99999;
		var n = 0;
		
		for (i2 = 0; i2 < arrV2.length; i2++)
		{
			var d = arrV3[i].distanceTo(arrV2[i2]); 
			
			if(min > d) { n = i2; min = d; }
		}
		
		arrV[i] = arrV2[n];
	}	
	
	arrV[arrV.length] = arrV[0].clone();
	
	var vZ = (index == 2) ? v[4].z : v[0].z;
	for (i = 0; i < arrV.length; i++) { arrV[i].z = vZ; }


	
	
	arrWallFront.bounds = { min : { x : 0, y : 0 }, max : { x : 0, y : 0 } };
	
	var xC = (box.max.x - box.min.x)/2 + box.min.x;
	var yC = (box.max.y - box.min.y)/2 + box.min.y;
	
	arrWallFront.bounds.min.x = wall.localToWorld( new THREE.Vector3(box.min.x, yC, vZ) );	 
	arrWallFront.bounds.max.x = wall.localToWorld( new THREE.Vector3(box.max.x, yC, vZ) );
	arrWallFront.bounds.min.y = wall.localToWorld( new THREE.Vector3(xC, box.min.y, vZ) );
	arrWallFront.bounds.max.y = wall.localToWorld( new THREE.Vector3(xC, box.max.y, vZ) );	
	
	return arrV;
}





function fname_s_0120(arr, p, dir1)
{
	
	var arrW = [...new Set([...p[0].w, ...p[1].w])];		
	
	
	for (var i = 0; i < arrW.length; i++)
	{ 	
		var flag = false;
		for (i2 = 0; i2 < arr.length; i2++) { if(arrW[i] == arr[i2].obj) { flag = true; break; } }
		if(flag) continue;
		
		var dir2 = new THREE.Vector3().subVectors( arrW[i].userData.wall.p[1].position, arrW[i].userData.wall.p[0].position ).normalize();
		
		var str = null;
		
		if(fname_s_021(dir1, dir2)) { str = 'forward'; }
		else if(fname_s_021(dir1, new THREE.Vector3(-dir2.x,-dir2.y,-dir2.z))) { str = 'back'; }
		
		if(str) 
		{ 	
			arr[arr.length] = { obj : arrW[i], dir : str }; 
			arr = fname_s_0120(arr, arrW[i].userData.wall.p, dir1); 
		}
	}		

	
	return arr;
}



function fname_s_0121(wall, index)
{
	var num = -1;
	
	for ( var i = 0; i < room.length; i++ ) 
	{  
		for ( var i2 = 0; i2 < room[i].w.length; i2++ )
		{
			if(wall == room[i].w[i2])
			{
				var side = (index == 1) ? 1 : 0;
				
				if(side == room[i].s[i2]) { num = i; }
				
				break;
			} 
		}	
	}

	if(num == -1) { return null;  };

	return room[num];
}




function fname_s_0122(wall)
{
	if(fname_s_021(wall.userData.wall.last.pos, wall.position)) { return; }		
	
	fname_s_0106( wall.userData.wall.p[ 0 ] );
	fname_s_0106( wall.userData.wall.p[ 1 ] );
	fname_s_040( param_wall.wallR ); 
	fname_s_0146( param_wall.arrZone ); 		
	
	fname_s_038(param_wall.wallR);
}




var param_win = { click : false };


function fname_s_0123( intersect )
{	
	var obj = intersect.object;

	clickO.move = obj;
	
	var pos = intersect.point;
	
	pos.y = obj.position.y;
	
	if(myCameraOrbit.activeCam.userData.isCam2D) 
	{
		planeMath.position.set( 0, pos.y, 0 );
		planeMath.rotation.set(-Math.PI/2, 0, 0);			
	}
	else
	{
		planeMath.position.copy( pos );
		planeMath.rotation.set( 0, obj.rotation.y, 0 );					
	}	
	
	planeMath.updateMatrixWorld();  

	param_win.click = true;

	obj.userData.door.offset = new THREE.Vector3().subVectors( obj.position, pos );	
	
	fname_s_0124(obj);	
	
	if(myCameraOrbit.activeCam.userData.isCam2D)
	{
		fname_s_090( obj ); 	
	}
	
	fname_s_0130( obj );		
	tabObject.activeObjRightPanelUI_1({obj: obj}); 	
	
	myComposerRenderer.outlineAddObj({arr: [obj]});
}






function fname_s_0124(wd)
{
	wd.geometry.computeBoundingBox();
	
	var wall = wd.userData.door.wall;
	wall.geometry.computeBoundingBox();	
	
	var off = 0.0;	
	var off_2 = 0.0;
	
	wd.userData.door.bound = { min : { x : wall.geometry.boundingBox.min.x + off, y : wall.geometry.boundingBox.min.y + off_2 }, max : { x : wall.geometry.boundingBox.max.x - off, y : wall.geometry.boundingBox.max.y - off } };
	
	
	var arrWD = {};
	if(arrWD.left && 1==2)
	{
		arrWD.left.updateMatrixWorld();
		var pos = arrWD.left.worldToLocal( wd.position.clone() );	 	
		var n = fname_s_0126(arrWD.left.geometry.vertices, pos);
		
		var pos = arrWD.left.localToWorld( arrWD.left.geometry.vertices[n].clone() );		
		
		wd.userData.door.bound.min.x = wall.worldToLocal( pos.clone() ).x + off;
	}
	

	if(arrWD.right && 1==2)
	{
		arrWD.right.updateMatrixWorld();
		var pos = arrWD.right.worldToLocal( wd.position.clone() );	 	
		var n = fname_s_0126(arrWD.right.geometry.vertices, pos);
		
		var pos = arrWD.right.localToWorld( arrWD.right.geometry.vertices[n].clone() );
		
		wd.userData.door.bound.max.x = wall.worldToLocal( pos.clone() ).x - off;
	}		
	
	wd.userData.door.last.pos = wd.position.clone();	
}





function fname_s_0125(wd)
{	
	var wall = wd.userData.door.wall;

	wall.updateMatrixWorld();
	
	var posC = wall.worldToLocal( wd.position.clone() );	
	
	var arrL = { x : 99999, o : null }, arrR = { x : 99999, o : null };
	
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{		
		if(wall.userData.wall.arrO[i] == wd) continue;
		
		var v = wall.worldToLocal( wall.userData.wall.arrO[i].position.clone() );
		
		var x = Math.abs(v.x - posC.x); 
		
		if (v.x <= posC.x) { if(x < arrL.x) { arrL.x = x; arrL.o = wall.userData.wall.arrO[i]; } }
		else { if(x < arrR.x) { arrR.x = x; arrR.o = wall.userData.wall.arrO[i]; } }		
	}	
	
	return { left : arrL.o, right : arrR.o };
}





function fname_s_0126(v, pos)
{
	var minDist = 99999;
	var hit = 0;

	for ( var i = 0; i < v.length; i++ )
	{
		var dist = pos.distanceTo(v[i]);
		if (dist <= minDist)
		{
			minDist = dist;
			hit = i;
		}
	}	

	return hit;
}


 

function fname_s_0127( event, wd ) 
{
	if(myCameraOrbit.activeCam.userData.isCam3D) { return; }
	
	var intersects = fname_s_0213( event, planeMath, 'one' ); 	
	if ( intersects.length > 0 ) { fname_s_0128( wd, intersects[ 0 ].point ); }	
}


var objsBSP = null;
var objClone = new THREE.Mesh();
var wallClone = new THREE.Mesh();

function fname_s_0128( wd, pos )
{
	var wall = wd.userData.door.wall;
	
	if(param_win.click)  
	{ 
		param_win.click = false; 

		wallClone.geometry = fname_s_034( wd ).geometry.clone(); 
		wallClone.position.copy( wd.userData.door.wall.position ); 
		wallClone.rotation.copy( wd.userData.door.wall.rotation );
		
		objsBSP = { wall : wallClone, wd : fname_s_035( wd ) };
		
		
		wd.material.depthTest = false;  
		wd.material.opacity = 1.0; 		 			
	}
	
	pos = new THREE.Vector3().addVectors( wd.userData.door.offset, pos );			
	pos = wall.worldToLocal( pos.clone() );
	
	var x_min = wd.geometry.boundingBox.min.x;
	var x_max = wd.geometry.boundingBox.max.x;
	var y_min = wd.geometry.boundingBox.min.y;
	var y_max = wd.geometry.boundingBox.max.y;
	
	var bound = wd.userData.door.bound;
	
	if(pos.x + x_min < bound.min.x){ pos.x = bound.min.x - x_min; }
	else if(pos.x + x_max > bound.max.x){ pos.x = bound.max.x - x_max; }	
	
	
	if(!myCameraOrbit.activeCam.userData.isCam2D)
	{
		if(pos.y + y_min < bound.min.y){ pos.y = bound.min.y - y_min; }
		else if(pos.y + y_max > bound.max.y){ pos.y = bound.max.y - y_max; }
	}	
	
	if(myCameraOrbit.activeCam.userData.isCam2D){ pos.z = 0; }	
	
	var pos = wall.localToWorld( pos.clone() );
	
	var pos2 = new THREE.Vector3().subVectors( pos, wd.position );
	
	wd.position.copy( pos );	

	wd.userData.door.h1 += pos2.y;
	
	for ( var i = 0; i < infProject.tools.controllWD.length; i++ ) { infProject.tools.controllWD[i].position.add( pos2 ); } 	
	
	fname_s_091(wd); 	
	
	fname_s_062({obj: wd});
}





function fname_s_0129( obj )
{	
	
	if(clickO.rayhit) 
	{
		if(clickO.rayhit.object == obj) return;	
		
		if(clickO.rayhit.object.userData.tag == 'controll_wd')
		{
			if(clickO.rayhit.object.userData.controll_wd.obj == obj) { return; }
		}		
	}		
		
	if(obj && myCameraOrbit.activeCam.userData.isCam2D)
	{
		if(obj.userData.tag == 'door' || obj.userData.tag == 'window')
		{
			for ( var i = 0; i < arrWallFront.wall.length; i++ )
			{
				if(!arrWallFront.wall[i].obj.userData.wall.html.label) continue;
				
				arrWallFront.wall[i].obj.userData.wall.html.label[0].style.display = 'block';
				arrWallFront.wall[i].obj.userData.wall.html.label[1].style.display = 'block';
				 
				arrWallFront.wall[i].obj.userData.wall.html.label[0].userData.elem.show = true;
				arrWallFront.wall[i].obj.userData.wall.html.label[1].userData.elem.show = true;	

				fname_s_0194({elem: arrWallFront.wall[i].obj.userData.wall.html.label[0]});
				fname_s_0194({elem: arrWallFront.wall[i].obj.userData.wall.html.label[1]});
			}					
		}			
	}
	
	for ( var i = 0; i < infProject.tools.controllWD.length; i++ ) { infProject.tools.controllWD[i].visible = false; }
	for ( var i = 0; i < infProject.scene.size.wd_1.line.length; i++ ) 
	{ 
		var line = infProject.scene.size.wd_1.line[i];
		line.visible = false; 
		for ( var i2 = 0; i2 < line.userData.rulerwd.cone.length; i2++ )
		{
			line.userData.rulerwd.cone[i2].visible = false; 
		}	
	}
	
	for ( var i = 0; i < infProject.html.wd.length; i++ )
	{ 
		infProject.html.wd[i].style.display = 'none'; 
		infProject.html.wd[i].userData.elem.show = false;
	}
}



function fname_s_0130(wd)
{			
	wd.geometry.computeBoundingBox();
	
	var minX = wd.geometry.boundingBox.min.x;
	var maxX = wd.geometry.boundingBox.max.x;
	var minY = wd.geometry.boundingBox.min.y;
	var maxY = wd.geometry.boundingBox.max.y;

	var d1 = Math.abs( maxX - minX );		
	var d2 = Math.abs( maxY - minY );			
	
	$('[nameId="size-wd-length"]').val(Math.round(d1 * 100) / 100);
	$('[nameId="size-wd-height"]').val(Math.round(d2 * 100) / 100);
	$('[nameId="rp_wd_h1"]').val(Math.round((wd.userData.door.h1 + minY) * 100) / 100);
}




function fname_s_0131(wd)
{  
	if(!wd) return;
	if(wd.userData.tag == 'window' || wd.userData.tag == 'door'){}
	else { return; }
	
	var wall = wd.userData.door.wall;
	
	var x = $('[nameId="size-wd-length"]').val();		
	var y = $('[nameId="size-wd-height"]').val();		
	var h = $('[nameId="rp_wd_h1"]').val();				
	
	
	
	wd.geometry.computeBoundingBox();
	var x2 = (Math.abs(wd.geometry.boundingBox.max.x) + Math.abs(wd.geometry.boundingBox.min.x));
	var y2 = (Math.abs(wd.geometry.boundingBox.max.y) + Math.abs(wd.geometry.boundingBox.min.y));
	var h2 = wd.userData.door.h1 + wd.geometry.boundingBox.min.y;	
		
	var resX = fname_s_0227({ value: x, unit: 1, limit: {min: 0.1, max: 5} });
	var resY = fname_s_0227({ value: y, unit: 1, limit: {min: 0.1, max: 5} });
	var resH = fname_s_0227({ value: h, unit: 1, limit: {min: 0, max: 5} });
	
	x = (!resX) ? x2 : resX.num;
	y = (!resY) ? y2 : resY.num;	 
	h = (!resH) ? h2 : resH.num;
	
	
	wd.userData.door.h1 = h - wd.geometry.boundingBox.min.y - (y2 - y)/2;    
	
	var pos = wd.position.clone(); 
	pos.y = wd.userData.door.h1; 
	
	сhangeSizePosWD( wd, pos, x, y );	
	
	wallClone.geometry = fname_s_034( wd ).geometry.clone(); 
	wallClone.position.copy( wd.userData.door.wall.position ); 
	wallClone.rotation.copy( wd.userData.door.wall.rotation );	 	

	fname_s_036( wd, { wall : wallClone, wd : fname_s_035( wd ) } ); 	
	
	wd.updateMatrixWorld();
	
	fname_s_090(wd);	
	fname_s_0130(wd);	
	
	fname_s_062({obj: wd});
	
	renderCamera();
}





function сhangeSizePosWD( wd, pos, x, y )
{	
	var v = wd.geometry.vertices;
	var v2 = wd.userData.door.form.v2;
	var size = wd.userData.door.form.size;
	
	var scale = new THREE.Vector3(x/size.x, y/size.y, 1);	
	
	for ( var i = 0; i < v2.length; i++ )
	{
		v[i].x = v2[i].x * scale.x;
		v[i].y = v2[i].y * scale.y;
		
	}		

	wd.geometry.verticesNeedUpdate = true;
	wd.geometry.elementsNeedUpdate = true;	
	wd.geometry.computeBoundingSphere();

	wd.position.copy( pos );
	
	 
	
	if(wd.userData.door.obj3D)
	{
		wd.updateMatrixWorld();
		wd.geometry.computeBoundingBox();
		wd.geometry.computeBoundingSphere();
		var x = wd.geometry.boundingBox.max.x - wd.geometry.boundingBox.min.x;
		var y = wd.geometry.boundingBox.max.y - wd.geometry.boundingBox.min.y;		
		
		var obj3D = wd.userData.door.obj3D;
		
		obj3D.geometry.computeBoundingBox();		
		var dX = obj3D.geometry.boundingBox.max.x - obj3D.geometry.boundingBox.min.x;
		var dY = obj3D.geometry.boundingBox.max.y - obj3D.geometry.boundingBox.min.y;				
		
		obj3D.scale.set(x/dX, y/dY, 1);	

		fname_s_063({wd});
	}	
}





function fname_s_0132(wd)
{
	if(param_win.click) { param_win.click = false; return; }
	
	fname_s_036( wd, objsBSP );
	 
	if(myCameraOrbit.activeCam.userData.isCam2D)
	{ 
		wd.material.depthTest = false;  
		wd.material.opacity = 1.0; 		 	
	}
	else
	{ 		
		wd.material.depthTest = true;
		wd.material.transparent = true;
		wd.material.opacity = 0;					
	}	

	fname_s_062({obj: wd});
	
}




function fname_s_0133()
{
	if ( clickO.selectBox.arr.length > 0 ) 
	{ 
		fname_s_0243(); 
	}
	
	var obj = clickO.last_obj;
	
	if(!obj) return;
	if(!obj.userData.tag) return;
	
	var tag = obj.userData.tag;
	
	if(myCameraOrbit.activeCam.userData.isCam3D)
	{
		if ( tag == 'wall' ) return;
	}
		
	if ( tag == 'wall' ) { fname_s_0134( obj ).room; }
	else if ( tag == 'point' ) { if(obj.p.length == 2) { fname_s_0137( obj ); } }
	else if ( tag == 'window' || tag == 'door' ) { fname_s_0138({wd: obj}); }
	else if ( tag == 'obj' ) { fname_s_0243({obj: obj}); }
	else if ( tag == 'roof' ) { fname_s_0243({obj: obj}); }
	
	renderCamera();
}


function fname_s_0134( wall )
{	
	fname_s_082(wall);
	
	var points = wall.userData.wall.p;

	var arrZone = fname_s_0167( wall );
	var oldZ = fname_s_0147(arrZone);
	fname_s_0160(arrZone); 
	
	var zone = (arrZone.length == 0) ? fname_s_044( wall ).obj : null; 
	
	fname_s_0135({wall: wall});
	
	var newZones = [];
	
	
	if(oldZ.length > 0) 
	{ 
		var area = oldZ[0].floor.userData.room.areaTxt;
		var n = 0;
		for ( var i = 0; i < oldZ.length; i++ ) { if(oldZ[i].floor.userData.room.areaTxt > area) { n = i; } }
		
		newZones = fname_s_0150();

		if(newZones.length > 0) { fname_s_0166([newZones[0]], oldZ[n], false); } 
	}
	else
	{	
		if(zone) { fname_s_042([zone]); }				
	}

	return { room : newZones }; 
}




function fname_s_0135(cdm)
{
	var wall = cdm.wall;
	
	fname_s_0171();	
	
	var delWD = true;	
	if(cdm.delWD !== undefined) { delWD = cdm.delWD; }	
	
	
	if(delWD)
	{
		var arr = wall.userData.wall.arrO;
		
		for(var i = 0; i < arr.length; i++)
		{
			fname_s_0138({wd: arr[i], upWall: false}); 
		}		
	}

	var p0 = wall.userData.wall.p[0];
	var p1 = wall.userData.wall.p[1]; 
	fname_s_0141(p0, wall);
	fname_s_0141(p1, wall);
	fname_s_0140({arr: infProject.scene.array.wall, o: wall});
	
	if(wall.userData.wall.html.label)
	{
		for ( var i = 0; i < wall.userData.wall.html.label.length; i++ )
		{
			fname_s_0140({arr: infProject.html.label, o: wall.userData.wall.html.label[i]});
			wall.userData.wall.html.label[i].remove();
		}	
	}
	
	fname_s_0175({obj: wall});
	scene.remove( wall );
	
	if(p0.w.length == 0){ fname_s_0136( p0 ); }
	if(p1.w.length == 0){ fname_s_0136( p1 ); }
	
	
	var upWall = true;	
	if(cdm.upWall !== undefined) { upWall = cdm.upWall; }	
	
	
	if(upWall)
	{
		var arrW = [];
		for ( var i = 0; i < p0.w.length; i++ ) { arrW[arrW.length] = p0.w[i]; }
		for ( var i = 0; i < p1.w.length; i++ ) { arrW[arrW.length] = p1.w[i]; }  
		fname_s_037( arrW );	
		
		if(p0.w.length > 0){ fname_s_0107(p0); }
		if(p1.w.length > 0){ fname_s_0107(p1); }

		fname_s_040(arrW);
		
		fname_s_038( arrW );
	}	
}



function fname_s_0136( point )
{
	fname_s_0142(point); 
	fname_s_0175({obj: point});
	scene.remove(point);
}


function fname_s_0137( point )
{
	if(!point){ return [ null, null ]; }
	if(point.p.length != 2){ return [ null, null ]; }
	
	fname_s_082(point);
	
	var wall_1 = point.w[0];
	var wall_2 = point.w[1];
		
	var arrW_2 = fname_s_0103([], point);
	
	fname_s_037( arrW_2 );
	 
	var point1 = point.p[0];
	var point2 = point.p[1];
	
	var p1 = { id : point1.userData.id, pos : point1.position.clone() };
	var p2 = { id : point2.userData.id, pos : point2.position.clone() };	

	var dir1 = new THREE.Vector3().subVectors( point.position, point1.position ).normalize();
	var dir2 = new THREE.Vector3().subVectors( point2.position, point.position ).normalize();
	
	var d1 = wall_1.userData.wall.p[0].position.distanceTo( wall_1.userData.wall.p[1].position );
	var d2 = wall_2.userData.wall.p[0].position.distanceTo( wall_2.userData.wall.p[1].position );
	
	var wall = (d1 > d2) ? wall_1 : wall_2;	
	var res = (d1 > d2) ? 1 : 2;
	
	
	
	var width = wall.userData.wall.width;
	var height = wall.userData.wall.height_1;
	var offsetZ = wall.userData.wall.offsetZ;
	var material = wall.material;
	var userData_material = wall.userData.material;
	
	
	if(res == 1)
	{
		if(point.start[0] != 1)		
		{
			material = [wall.material[0], wall.material[2], wall.material[1], wall.material[3]];
			userData_material = [wall.userData.material[0], wall.userData.material[2], wall.userData.material[1], wall.userData.material[3]];			
		}
	}
	if(res == 2)
	{
		if(point.start[1] != 0)
		{
			material = [wall.material[0], wall.material[2], wall.material[1], wall.material[3]];
			userData_material = [wall.userData.material[0], wall.userData.material[2], wall.userData.material[1], wall.userData.material[3]];			
		}
	}	
	
	
	var arrO = [];
	for ( var i = 0; i < wall_1.userData.wall.arrO.length; i++ )
	{
		var n = arrO.length;
		var wd = wall_1.userData.wall.arrO[i];
		arrO[n] = { id : wd.userData.id, lotid: wd.userData.door.lotid, pos : wd.position.clone(), wall : null };
		arrO[n].size = wd.userData.door.size;
		if(wd.userData.door.open_type) { arrO[n].open_type = wd.userData.door.open_type; }
	}

	for ( var i = 0; i < wall_2.userData.wall.arrO.length; i++ )
	{
		var n = arrO.length;
		var wd = wall_2.userData.wall.arrO[i];
		arrO[n] = { id : wd.userData.id, lotid: wd.userData.door.lotid, pos : wd.position.clone(), wall : null };
		arrO[n].size = wd.userData.door.size;
		if(wd.userData.door.open_type) { arrO[n].open_type = wd.userData.door.open_type; }
	}
	
	var oldZones = fname_s_0167( wall_1 );   	
	var oldZ = fname_s_0147( oldZones );
	fname_s_0160( oldZones );						

	
	fname_s_0135({wall: wall_1, upWall: false});		
	fname_s_0135({wall: wall_2, upWall: false});		
	 

	
	var point1 = fname_s_0224( 'point', p1.id );
	var point2 = fname_s_0224( 'point', p2.id );	
	
	if(point1 == null) { point1 = fname_s_0207( p1.pos, p1.id ); }
	if(point2 == null) { point2 = fname_s_0207( p2.pos, p2.id ); }	
	
	var wall = fname_s_0208({ p: [point1, point2], width: width, offsetZ : offsetZ, height : height }); 

	fname_s_0107(point1);
	fname_s_0107(point2);
	
	var arrW = [];
	for ( var i = 0; i < arrW_2.length; i++ ) { arrW[arrW.length] = arrW_2[i]; }
	arrW[arrW.length] = wall;
	
	fname_s_040( arrW );	
	
	var newZones = fname_s_0150();		
	fname_s_0164(oldZ, newZones, 'delete');		
	
	
	
	if(fname_s_021(dir1, dir2)) 
	{
		for ( var i = 0; i < arrO.length; i++ ) { arrO[i].wall = wall; } 
	}
	
	
	wall.material = [ material[0].clone(), material[1].clone(), material[2].clone(), material[3].clone() ]; 
	wall.userData.material = userData_material; 
	
	fname_s_038( arrW );
	
	infProject.tools.axis[0].visible = false;
	infProject.tools.axis[1].visible = false; 
	
	return { point : { id : point.userData.id }, wall : wall }; 
} 




function fname_s_0138(cdm)
{	
	var wd = cdm.wd;	
	
	var upWall = true;	
	if(cdm.upWall !== undefined) { upWall = cdm.upWall; }	
	
	if(upWall)
	{
		if(wd.userData.door.wall)
		{
			var wall = wd.userData.door.wall; 			
			fname_s_034( wd );				
			fname_s_0140({arr: wall.userData.wall.arrO, o: wd});
		}	
		
		if(wd.userData.tag == 'window') { fname_s_082(wd); }
		if(wd.userData.tag == 'door') { fname_s_082(wd); }
		
		clickO = resetPop.clickO();
		fname_s_0129( wd ); 
	}
	
	if(wd.userData.cubeCam)
	{
		fname_s_0140({arr: infProject.scene.array.cubeCam, o: wd.userData.cubeCam});
		fname_s_0175({obj: wd.userData.cubeCam});
		scene.remove( wd.userData.cubeCam );			
	}

	fname_s_0139({obj: wd});
	 
	if(wd.userData.tag == 'window') { fname_s_0140({arr: infProject.scene.array.window, o: wd}); }
	if(wd.userData.tag == 'door') { fname_s_0140({arr: infProject.scene.array.door, o: wd}); }
	
	fname_s_0175({obj: wd}); 
	scene.remove( wd );	
}





function fname_s_0139(cdm)
{
	var obj = cdm.obj;
	
	if(obj.userData.door.svg.el) 
	{
		fname_s_0140({arr: infProject.svg.arr, o: obj.userData.door.svg.el});
		obj.userData.door.svg.el.remove();
	}

	if(obj.userData.door.svg.path) 
	{ 
		fname_s_0140({arr: infProject.svg.arr, o: obj.userData.door.svg.path});
		obj.userData.door.svg.path.remove();		
	}
	
	if(obj.userData.door.svg.arc) 
	{ 
		fname_s_0140({arr: infProject.svg.arr, o: obj.userData.door.svg.arc});
		obj.userData.door.svg.arc.remove();			
	}	
}






function fname_s_0140(cdm)
{
	var arr = cdm.arr;
	var o = cdm.o;
	
	for(var i = arr.length - 1; i > -1; i--) { if(arr[i] == o) { arr.splice(i, 1); break; } }
}



function fname_s_0141(point, wall)
{
	var n = -1;
	for ( var i = 0; i < point.w.length; i++ ){ if(point.w[i].userData.id == wall.userData.id) { n = i; break; } }
	
	point.p.splice(n, 1);
	point.w.splice(n, 1);
	point.start.splice(n, 1);	
}





function fname_s_0142(point)
{
	var n = -1;
	for ( var i = 0; i < obj_point.length; i++ ){ if(obj_point[i].userData.id == point.userData.id) { n = i; break; } }
		
	obj_point.splice(n, 1);	
}







function fname_s_0143(cdm)
{	
	var arrP = cdm.point;
	var arrW = cdm.wall;
	var arrS = cdm.side;
	var id = (cdm.id) ? cdm.id : null;
	var material = (cdm.material) ? cdm.material : null;
	
	var point_room = [];
	for ( var i = 0; i < arrP.length - 1; i++ ) 
	{  
		point_room[i] = new THREE.Vector2 ( arrP[i].position.x, arrP[i].position.z );		
	}	 
	
	var shape = new THREE.Shape( point_room );
	var geometry = new THREE.ShapeGeometry( shape );
	
	var n = room.length;	
	
	var color = 0xe3e3e5;
	
	if(infProject.settings.floor.color){ color = infProject.settings.floor.color; }
	
	var material = new THREE.MeshStandardMaterial({ color: color, dithering: true });
	
	var floor = new THREE.Mesh( new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, depth: infProject.settings.floor.height } ), material ); 
	room[n] = floor;
	
	
	floor.position.set( 0, arrP[0].position.y + infProject.settings.floor.height, 0 );
	floor.rotation.set( Math.PI / 2, 0, 0 );	
	floor.p = arrP;
	floor.w = arrW; 
	floor.s = arrS;	
	
	
	if(!id) { id = countId; countId++; }  
	 
	floor.userData.tag = 'room';
	floor.userData.id = id;
	floor.userData.room = {};
	floor.userData.room.areaTxt = 0;
	floor.userData.room.p = floor.p;
	floor.userData.room.w = floor.w;
	floor.userData.room.s = floor.s;
	floor.userData.room.zone = { id: undefined, name: '' };
	floor.userData.room.zone.id = -1;
	floor.userData.room.contour = [];
	floor.userData.room.height = infProject.settings.floor.height;
	floor.userData.room.html = {};
	floor.userData.room.html.label = null; 
	floor.userData.material = { tag: 'room', color: floor.material.color, img: null };	
	
	var ceil = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial({ color: 0xffffff, dithering: true }) );
	ceiling[n] = ceil;
	
	ceil.position.set( 0, arrP[0].position.y + infProject.settings.height, 0 );  
	ceil.rotation.set( Math.PI / 2, 0, 0 );		
	ceil.userData.tag = 'ceiling';
	ceil.userData.id = id;
	ceil.userData.material = { tag: 'ceiling', color: ceil.material.color, img: null };
	ceil.visible = false;

	
	cdm.material = { img: "img/load/floor_1.jpg" };
	
	if(cdm.material)
	{  
		fname_s_0214({obj: floor, material: cdm.material});	
	}
	
	if(infProject.settings.floor.o)
	{ 	
		floor.userData.room.html.label = fname_s_0311({count: 1, display: 'none', tag: 'elem_type_room'})[0]; 
		
		if(infProject.settings.floor.label.visible) 
		{ 
			fname_s_029({id: floor.userData.room.zone.id, obj: floor});			 
		} 
			
		fname_s_042([floor]); 
		scene.add(floor); 
		
	}
	else
	{
		fname_s_040(arrW); 
	}

	
	for ( var i = 0; i < arrW.length; i++ ) 
	{ 
		var ind = (arrS[i] == 0) ? 2 : 1; 
		arrW[i].userData.wall.room.side2[ind] = floor; 
	}	
	
	fname_s_0144(arrP, floor);
	
	floor.castShadow = true; 
	floor.receiveShadow = true;
	ceil.castShadow = true; 
	ceil.receiveShadow = true;	
	
	return floor;
}






function fname_s_0144(arrP, zone)
{
	for ( var i = 0; i < arrP.length - 1; i++ ) 
	{  
		var k1 = (i == 0) ? arrP.length - 2 : i - 1;				
		var f = arrP[i].zone.length;
		arrP[i].zone[f] = zone; 
		arrP[i].zoneP[f] = arrP[k1]; 		
	}		
}




function fname_s_0145(zone, newPoint, replacePoint)
{
	for ( var i = 0; i < zone.length; i++ )  
	{  		
		for ( var i2 = 0; i2 < zone[i].p.length; i2++ )
		{
			if(zone[i].p[i2] == replacePoint) { zone[i].p[i2] = newPoint; }
		}			
	}			
}





function fname_s_0146(arrRoom)
{  
	if(!infProject.settings.floor.o) { return; }
	
	for ( var i = 0; i < arrRoom.length; i++ ) 
	{	 
		var point = [];
		for ( var i2 = 0; i2 < arrRoom[i].p.length - 1; i2++ ) { point[i2] = new THREE.Vector2 ( arrRoom[i].p[i2].position.x, arrRoom[i].p[i2].position.z ); }				
		
		var shape = new THREE.Shape( point );				

		var geometry = new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, depth: infProject.settings.floor.height } ); 
				
		arrRoom[i].geometry.vertices = geometry.vertices;
		arrRoom[i].geometry.faces = geometry.faces;		
		arrRoom[i].geometry.verticesNeedUpdate = true;
		arrRoom[i].geometry.elementsNeedUpdate = true;
		
		arrRoom[i].geometry.computeBoundingSphere();
		arrRoom[i].geometry.computeBoundingBox();
		arrRoom[i].geometry.computeFaceNormals();
		
		geometry.dispose();
		
		
		
		fname_s_0219( arrRoom[i] );
		fname_s_042([arrRoom[i]]); 

		
		var num = 0;		
		for ( var i2 = 0; i2 < room.length; i2++ ) { if(room[i2].userData.id == arrRoom[i].userData.id) { num = i2; break; } }	
		
		var geometry = new THREE.ShapeGeometry( shape );
		
		ceiling[num].geometry.vertices = geometry.vertices;
		ceiling[num].geometry.faces = geometry.faces;			
		ceiling[num].geometry.verticesNeedUpdate = true;
		ceiling[num].geometry.elementsNeedUpdate = true;
		
		ceiling[num].geometry.computeBoundingSphere();
		ceiling[num].geometry.computeBoundingBox();
		ceiling[num].geometry.computeFaceNormals();

		geometry.dispose();
	}
}




function fname_s_0147(arr) 
{
	var arrN = [];
	if(!Array.isArray(arr)) { var res = arr; var arr = [res]; }
	
	for ( var i = 0; i < arr.length; i++ )
	{
		for ( var i2 = 0; i2 < room.length; i2++ )
		{
			if(room[i2] == arr[i]) { arrN[i] = { floor : room[i2], ceiling : ceiling[i2] }; break; }
		}		
	}	
	
	return arrN;
}





function fname_s_0148()
{
	var shape = new THREE.Shape( [new THREE.Vector2(-2, 1), new THREE.Vector2(2, 1), new THREE.Vector2(2, -1), new THREE.Vector2(-2, -1)] );
	var geometry = new THREE.ShapeGeometry( shape );

	var plane = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial( { color: 0x0000ff, transparent: true, opacity: 0 } ) );
	plane.position.set( 0, infProject.settings.floor.posY, 0 );
	plane.rotation.set( -Math.PI / 2, 0, 0 );
	scene.add(plane);

	return plane;
}


function fname_s_0149({obj})
{	
	const contour = obj.userData.room.contour;
	const contour2 = [];
	
	for(let i = 0; i < contour.length; i++)
	{
		contour2[i] = new THREE.Vector2(contour[i].x, -contour[i].z);
	}

	
	const plane = infProject.tools.floorPl;	
	plane.geometry.dispose();
	plane.geometry = new THREE.ShapeGeometry( new THREE.Shape(contour2) );	
	
	
	
	
	
	plane.visible = false;	
	myComposerRenderer.outlineAddObj({arr: [obj]});
	plane.userData.floorId = obj.userData.id;	
	
	tabObject.activeObjRightPanelUI_1({obj});
}









function fname_s_0150()
{		
	var arrRoom = [];
	
	for ( var i = 0; i < obj_point.length; i++ )
	{			
		if(obj_point[i].p.length < 2){ continue; }

		for ( var i2 = 0; i2 < obj_point[i].p.length; i2++ )
		{
			if(obj_point[i].p[i2].p.length < 2){ continue; }									
			
			

			var p = fname_s_0153([obj_point[i]], obj_point[i].p[i2]); 		
			 
			
			if(p[0] != p[p.length - 1]){ continue; }	
			if(p.length > 5){ if(p[1] == p[p.length - 2]) continue; }
			if(fname_s_043(p) <= 0){ continue; }		
			if(fname_s_0151( obj_point[i].zone, p )){ continue; }
								
			 
			var arr = fname_s_0154(p);						
			
			arrRoom[arrRoom.length] = fname_s_0143({point : p, wall : arr[0], side : arr[1]});			
			break; 
		}
	}

	return arrRoom;
}







function fname_s_0151( arrRoom, arrP )
{
	var flag = false;
	
	for ( var i = 0; i < arrRoom.length; i++ )
	{
		var ln = 0;
		
		if(arrRoom[i].p.length != arrP.length) { continue; }
			
		for ( var i2 = 0; i2 < arrRoom[i].p.length - 1; i2++ )
		{
			for ( var i3 = 0; i3 < arrP.length - 1; i3++ )
			{
				if(arrRoom[i].p[i2] == arrP[i3]) { ln++; }
			}
		}
		
		if(ln == arrP.length - 1) 
		{ 
			
			
			
			flag = true; 
			break; 
		}
	}
	
	return flag;
}





 


function fname_s_0152(p1, p2)
{
	for ( var i = 0; i < p1.zone.length; i++ )
	{
		for ( var i2 = 0; i2 < p2.zone.length; i2++ )
		{
			if(p1.zone[i] == p2.zone[i2]) 
			{ 
				if(p1 == p2.zoneP[i2]){ return true; } 
				if(p1.zoneP[i] == p2){ return true; }
			}
		}
	}
	
	return false;	
}






function fname_s_0153(arr, point)
{
	var p2 = arr[arr.length - 1];
	arr[arr.length] = point;
	
	
	var dir1 = new THREE.Vector3().subVectors( point.position, p2.position ).normalize();	
	
	var arrD = [];
	var n = 0;
	for ( var i = 0; i < point.p.length; i++ )
	{
		if(point.p[i] == p2){ continue; }		
		if(point.p[i].p.length < 2){ continue; }
		
		var dir2 = new THREE.Vector3().subVectors( point.p[i].position, point.position ).normalize();
		
		arrD[n] = [];
		arrD[n][1] = point.p[i];
		
		var d = (point.p[i].position.x - p2.position.x) * (point.position.z - p2.position.z) - (point.p[i].position.z - p2.position.z) * (point.position.x - p2.position.x);
		
		var angle = dir1.angleTo( dir2 );
		
		if(d > 0){ angle *= -1; }
		
		arrD[n][0] = angle;
		if(!fname_s_06(angle)) { return arr; }
		
		
		n++;
	}	
	
	
	if(arrD.length > 0)
	{ 
		arrD.sort(function (a, b) { return a[0] - b[0]; });
		
		for ( var i = 0; i < arrD.length; i++ )
		{			
			if(arr[0] != arrD[i][1]) { return fname_s_0153(arr, arrD[i][1]); }
			else { arr[arr.length] = arrD[i][1]; break; }						
		}
	}
	
	return arr;
}




 

function fname_s_0154(p)
{
	var w = [];  
	var s = [];
	
	for ( var i = 0; i < p.length - 1; i++ )
	{ 		
		for ( var y1 = 0; y1 < p[i].w.length; y1++ )
		{
			for ( var y2 = 0; y2 < p[i + 1].w.length; y2++ )
			{
				if(p[i].w[y1] == p[i + 1].w[y2])
				{
					w[i] = p[i].w[y1];
					s[i] = p[i].start[y1];
					continue;
				}
			}
		}
	}	
	
	return [w, s];			
}









function fname_s_0155( point, obj, arrRoom, num, cdm )
{
	fname_s_0161(arrRoom);		
	fname_s_0156(cdm, arrRoom, num, point); 				
	
	for ( var i = 0; i < arrRoom.length; i++ ) { fname_s_0157(arrRoom[i], num[i], point, cdm); }	
	
	if(obj.userData.tag == 'wall'){ var arr = fname_s_0104(obj); }
	else if(obj.userData.tag == 'point'){ var arr = fname_s_0103([], obj); }

	fname_s_040(arr);				
	fname_s_0146(arrRoom);		
}

 



function fname_s_0156(cdm, arrRoom, numS, point)
{
	var zone = arrRoom;
	var num = numS;
	
	if(cdm.name == 'join')
	{
		zone = cdm.zone;
		num = cdm.num; 
		cdm = 'del';
	}
	
	for ( var i = 0; i < zone.length; i++ )
	{
		if(cdm == 'add') 			
		{ 
			zone[i].p.splice(num[i], 0, point); 
		}		
		else if(cdm == 'del') 		
		{ 				
			if(num[i] == 0 || num[i] == zone[i].p.length - 1)	
			{
				zone[i].p.splice(0, 1);	
				zone[i].p.splice(zone[i].p.length - 1, 1);			
				zone[i].p[zone[i].p.length] = zone[i].p[0];
			}
			else { zone[i].p.splice(num[i], 1); }		
		}		
	}
}






function fname_s_0157(zoneIndex, num, point, cdm)
{		
	var arr = fname_s_0154(zoneIndex.p);	
	
	fname_s_0144(zoneIndex.p, zoneIndex);	
				
	zoneIndex.w = arr[0]; 		
	zoneIndex.s = arr[1];	
}





function fname_s_0158(point1, point2)
{
	for ( var i = 0; i < point2.zone.length; i++ )
	{ 
		var flag = false;
		for ( var i2 = 0; i2 < point1.zone.length; i2++ )
		{			
			if(point2.zone[i] == point1.zone[i2]) { flag = true; break; }
		}
		if(!flag) { return true; }
	}
	
	return false;
}


function fname_s_0159(point1, point2) 
{
	var arr = [];
	
	for ( var i = 0; i < point2.zone.length; i++ )
	{ 
		var flag = false;
		for ( var i2 = 0; i2 < point1.zone.length; i2++ )
		{			
			if(point2.zone[i] == point1.zone[i2]) { flag = true; break; }
		}
		if(!flag) { arr[arr.length] = point2.zone[i]; }
	}
	
	return arr;
}

 

function fname_s_0160(arrRoom)
{
	var roomType = [];
	var arrN = [];
	
	
	
	for(var i = 0; i < arrRoom.length; i++)
	{
		for(var i2 = 0; i2 < arrRoom[i].userData.room.w.length; i2++)
		{
			var wall = arrRoom[i].userData.room.w[i2];
			
			if(wall.userData.wall.room.side2[1] == arrRoom[i]){ wall.userData.wall.room.side2[1] = null; }
			else if(wall.userData.wall.room.side2[2] == arrRoom[i]){ wall.userData.wall.room.side2[2] = null; }
		}
	}
	
	
	
	for ( var i = 0; i < room.length; i++ ) 
	{
		for ( var i2 = 0; i2 < arrRoom.length; i2++ ) 
		{ 
			if(room[i] == arrRoom[i2])
			{  				 
				arrN[arrN.length] = i; break;
			}
		}
	}

	fname_s_0161(arrRoom);
	
	for ( var i = arrN.length - 1; i >= 0; i-- )
	{
		roomType[roomType.length] = 
		{ 
			nameTxt : room[arrN[i]].userData.room.roomType,  
			material : room[arrN[i]].material, 
			userData : room[arrN[i]].userData, 
			area : Number(room[arrN[i]].userData.room.areaTxt), 
		}; 
		
		var floor = room[arrN[i]];    			
		room.splice(arrN[i], 1); 
		
		var ceil = ceiling[arrN[i]];
		ceiling.splice(arrN[i], 1);	 
		
		
		fname_s_0140({arr: infProject.html.label, o: floor.userData.room.html.label});
		floor.userData.room.html.label.remove();
	
		fname_s_0176( floor );
		fname_s_0176( ceil );		
		
		scene.remove( floor );
		scene.remove( ceil );		
	}
	
	return roomType;
}




function fname_s_0161(arrRoom)
{
	for ( var i = 0; i < arrRoom.length; i++ )
	{
		for ( var i2 = 0; i2 < arrRoom[i].p.length; i2++ )
		{
			for ( var i3 = 0; i3 < arrRoom[i].p[i2].zone.length; i3++ )
			{
				if(arrRoom[i].p[i2].zone[i3] == arrRoom[i])
				{ 
					arrRoom[i].p[i2].zone.splice(i3, 1);
					arrRoom[i].p[i2].zoneP.splice(i3, 1); 
					break;
				}							
			}
		}
	}
}




function fname_s_0162( arrRoom, arrP )
{
	var flag = false;
	var ln = 0;
	
	if(arrRoom.p.length - 1 != arrP.length) { return flag; }
		
	for ( var i2 = 0; i2 < arrRoom.p.length - 1; i2++ )
	{
		for ( var i3 = 0; i3 < arrP.length; i3++ )
		{
			if(arrRoom.p[i2].userData.id == arrP[i3]) { ln++; }
		}
	}
	
	if(arrRoom.p.length - 1 == ln) 
	{ 
		
		
		
		flag = true; 
	}
	
	return flag;
}





function fname_s_0163(cdm) 
{	
	var ray = new THREE.Raycaster();
	ray.set( new THREE.Vector3(cdm.pos.x, 1, cdm.pos.z), new THREE.Vector3(0, -1, 0) );
	
	var intersects = ray.intersectObject( cdm.obj );	
	
	var floor = (!intersects[0]) ? null : intersects[0].object;				
	
	return { o: floor };
}





function fname_s_0164( oldZ, newZones, cdm ) 
{
	
	for ( var i = 0; i < newZones.length; i++ ) 
	{
		for ( var i2 = 0; i2 < oldZ.length; i2++ ) 
		{ 			
			var oldZones = oldZ[i2].floor; 
			var count = 0;
			
			for ( var i3 = 0; i3 < newZones[i].p.length - 1; i3++ )
			{
				for ( var i4 = 0; i4 < oldZones.p.length - 1; i4++ )
				{
					if(newZones[i].p[i3].userData.id == oldZones.p[i4].userData.id) { count++; break; };
				}				
			}

			
			if(cdm == 'add') { var countNew = newZones[i].p.length - 2; }
			else if(cdm == 'delete') { var countNew = newZones[i].p.length - 1; }
			else if(cdm == 'copy') { var countNew = newZones[i].p.length - 1; }
			
			if(countNew == count)
			{
				fname_s_0166([newZones[i]], oldZ[i2], false);				
				break;
			}			
		}
	}

}






function fname_s_0165(wall) 
{
	var oldZone = fname_s_044( wall ).obj;
	var oldZ = fname_s_0147(oldZone);
	
	if(oldZone) { fname_s_0160( [oldZone] ); }			
		
	var newZones = fname_s_0150();			
	 
	if(oldZone) { fname_s_0166(newZones, oldZ[0], true); } 
}



function fname_s_0166(newZones, oldZ, addId)
{
	var newZ = fname_s_0147(newZones);
	
	for ( var i = 0; i < newZ.length; i++ )
	{	 
		var floor = newZ[i].floor;		
		var ceiling = newZ[i].ceiling;
		
		floor.userData.id = oldZ.floor.userData.id;	
		floor.userData.material = Object.assign({}, oldZ.floor.userData.material);		
		floor.material = oldZ.floor.material.clone();
		

		ceiling.userData.id = oldZ.ceiling.userData.id;	
		ceiling.userData.material = Object.assign({}, oldZ.ceiling.userData.material);
		ceiling.material = oldZ.ceiling.material.clone();
		
		if(addId) 
		{ 
			floor.userData.id = countId; countId++; 
			ceiling.userData.id = countId; countId++;
		}  
		fname_s_042( [floor] );
	}
}





function fname_s_0167( wall )
{
	var arrRoom = [];	
	for ( var i = 0; i < wall.userData.wall.p[0].zone.length; i++ ) 
	{
		for ( var i2 = 0; i2 < wall.userData.wall.p[1].zone.length; i2++ )
		{
			if(wall.userData.wall.p[0].zone[i] == wall.userData.wall.p[1].zone[i2])
			{
				arrRoom[arrRoom.length] = wall.userData.wall.p[0].zone[i]; 
			}
		}
	}

	return arrRoom;
}









function fname_s_0168( event )
{
	if (!myCameraOrbit.activeCam.userData.isCam2D) { return; }
	if (isMouseDown1) { return; }

	if ( clickO.move ) 
	{
		var tag = clickO.move.userData.tag;
		
		if (tag == 'free_dw') { return; }
		if (tag == 'point') { if (clickO.move.userData.point.type) return; }		
	}
	
	var rayhit = null;
		
	

	if(!infProject.scene.block.hover.point)
	{
		var ray = fname_s_0213( event, infProject.scene.array.point, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}
	

	if ( rayhit ) 
	{
		
		var object = rayhit.object;
		var tag = object.userData.tag; 				

		
		if ( clickO.hover == object ) { return; }				


		if ( tag == 'point' ) 
		{ 
			
			object.material.opacity = 1;
			$('html,body').css('cursor', 'move');
		}

		
		fname_s_0169();

		clickO.hover = object;
	}
	else
	{
		fname_s_0169();
	}
}




function fname_s_0169()
{
	if ( !clickO.hover ) { return; }

	var object = clickO.hover;
	var tag = object.userData.tag;  	
	
	if( tag == 'point' ) 
	{ 
		
		object.material.opacity = 0.75;
		$('html,body').css('cursor', 'default');
	}
	
	clickO.hover = null;
}







function fname_s_0170(obj)
{ 
	if(!myCameraOrbit.activeCam.userData.isCam2D) return;
	if(!obj) { return; }   
	if(clickO.last_obj == obj) { return; }
			
	var tag = obj.userData.tag;
	
	if(tag == 'point'){ myComposerRenderer.outlineAddObj({arr: [obj]}); }	 
	else if(tag == 'wall'){ myComposerRenderer.outlineAddObj({arr: [obj]}); } 	
}
 

	
 

function fname_s_0171() 
{	
	if(!myCameraOrbit.activeCam.userData.isCam2D) return;
	if(!clickO.last_obj){ return; }
	if(clickO.last_obj == clickO.obj){ return; }
	
	var o = clickO.last_obj;	

	if(clickO.rayhit)
	{    
		if(clickO.rayhit.object.userData.tag == 'controll_wd'){ if(clickO.rayhit.object.userData.controll_wd.obj == o) { return; } }      		
	}
	 
	if(o.userData.tag == 'wall'){ myComposerRenderer.outlineRemoveObj(); fname_s_041({wall: o}); }	
	else if(o.userData.tag == 'point'){ myComposerRenderer.outlineRemoveObj(); }	
	else if(o.userData.tag == 'window'){ myComposerRenderer.outlineRemoveObj(); }
	else if(o.userData.tag == 'door'){ myComposerRenderer.outlineRemoveObj(); }	
	
	if(clickO.hover == clickO.last_obj) { clickO.hover = null; }
} 













function fname_s_0172(href) 
{
	var url = new URL(href); 
	var url = url.searchParams.get('file');  
	if(url) { fname_s_0182(url); }
}



var resetPop =
{


	fileInfo : function()
	{
		return { last : {cam : { obj : camera, type : '', pos : new THREE.Vector3(), rot : new THREE.Vector3() }} };
	},
	
	infProjectSceneArray : function()
	{
		var array = { point: obj_point, wall: [], window: [], door: [], floor: room, ceiling: ceiling, obj: [], roof: [], objSpot: [] };
		array.cubeCam = [];
		array.base = (infProject.start)? infProject.scene.array.base : [];	
		
		return array;
	},

	infProjectMySceneArray : function()
	{
		var array = { point: obj_point, wall: [], window: [], door: [], floor: room, ceiling: ceiling, obj: [], roof: [], objSpot: [] };
		array.cubeCam = [];
		array.base = infProject.scene.array.base;	
		
		return array;
	},
	
	listColor : function()
	{	
		var array = {};
		
		array.door2D = 'rgb(224, 224, 224)';
		array.window2D = 'rgb(224, 224, 224)';
		array.active2D = 'rgb(255, 162, 23)';
		array.hover2D = 'rgb(69, 165, 58)';

		return array;
	},
	
	clickO : function()
	{
		var inf = { obj: null, last_obj: null, hover: null, rayhit : null, button : null, buttonAct : null };
		inf.down = null;
		inf.move = null;
		inf.up = null;
		inf.offset = new THREE.Vector3();
		inf.actMove = false;
		inf.pos = { clickDown : new THREE.Vector3() };
		inf.click = { wall : [], point : [], side_wall: 0 };
		inf.selectBox = { arr : [], drag : false, move : false };
		inf.keys = [];
		inf.options = null;
		inf.elem = null;
		
		return inf;
	},
	
	active : function()
	{
		var inf = { create : true, delete : true, click2D : true, click3D : true, move : true, replace : true, unlock : true };
		
		return inf;
	}	
};



function fname_s_0173() 
{
	fname_s_0217();
	
	
	myLevels.deleteOneLevel(myLevels.activeId);
	
	var cubeCam = infProject.scene.array.cubeCam;
	
	for ( var i = 0; i < cubeCam.length; i++ )
	{
		fname_s_0175({obj: cubeCam[i]});
		scene.remove( cubeCam[i] );		
	}		
	
	obj_point = [];
	room = [];
	ceiling = [];
	arrWallFront = [];
	

	countId = 2;
	
	
	var cube = infProject.tools.controllWD;
	
	
	var line = infProject.scene.size.wd_1.line;
	
	for ( var i = 0; i < line.length; i++ ) 
	{ 
		line[i].visible = false; 
		for ( var i2 = 0; i2 < line[i].userData.rulerwd.cone.length; i2++ )
		{
			line[i].userData.rulerwd.cone[i2].visible = false; 
		}
	}
		
	for ( var i = 0; i < infProject.html.wd.length; i++ ) 
	{ 
		infProject.html.wd[i].style.display = 'none'; 
		infProject.html.wd[i].userData.elem.show = false;
	}
	

	
	clickO = resetPop.clickO();
	infProject.project = null;
	infProject.scene.array = resetPop.infProjectSceneArray();
	infProject.scene.light.lamp = [];
	
	myLevels.deleteAllLevels();
	
	
	
	
}



function fname_s_0174()
{	
	
	
		
}







function fname_s_0175(cdm) 
{
	var obj = cdm.obj;	
	
	obj.traverse(function(child) 
	{
		fname_s_0176(child);
	});	
}



function fname_s_0176(node) 
{
	if (node instanceof THREE.Mesh || node instanceof THREE.Line) 
	{ 
		if (node.geometry) { node.geometry.dispose(); }
		
		if (node.material) 
		{
			var materialArray = [];
			
			if(node.material instanceof Array) { materialArray = node.material; }
			else { materialArray = [node.material]; }
			
			if(materialArray) 
			{
				materialArray.forEach(function (mtrl, idx) 
				{
					if (mtrl.map) mtrl.map.dispose();
					if (mtrl.lightMap) mtrl.lightMap.dispose();
					if (mtrl.bumpMap) mtrl.bumpMap.dispose();
					if (mtrl.normalMap) mtrl.normalMap.dispose();
					if (mtrl.specularMap) mtrl.specularMap.dispose();
					if (mtrl.envMap) mtrl.envMap.dispose();
					mtrl.dispose();
				});
			}
		}
	}
}


function fname_s_0177()
{
	myLevels.updateArrLevel();
	
	const id = myLevels.activeId;
	const level = [];

	const posY = myLevels.getLevelPos0({lastId: id, newId: 0});
	
	for ( let i = 0; i < myLevels.levels.length; i++ )
	{		
		level[level.length] = fname_s_0178(myLevels.levels[i], posY);
	}
	
	const json = {level: level};
	
	return json;
}


function fname_s_0178(array, posY)
{
	let json = {level: []};
	
	json.level[0] = 
	{
		version: {},
		points: [],
		walls: [],	
		rooms: [],
		object: [],
		roofs: [],
		height: array.height,		
	};
	
	let points = [];
	let walls = [];
	let rooms = [];
	let object = [];
	let roofs = [];
	
	let wall = array.wall;
	
	
	for ( var i = 0; i < wall.length; i++ )
	{			
		var p = wall[i].userData.wall.p;
		
		for ( var i2 = 0; i2 < p.length; i2++ )  
		{
			var flag = true;
			for ( var i3 = 0; i3 < points.length; i3++ ) { if(p[i2].userData.id == points[i3].id){ flag = false; break; } }
			
			if(flag) 
			{  
				var m = points.length;
				points[m] = {};
				points[m].id = p[i2].userData.id;
				points[m].pos = new THREE.Vector3(p[i2].position.x, p[i2].position.y - posY, p[i2].position.z);
				points[m].type = 'w';
			}
		}
	}	
	
	
	
	for ( var i = 0; i < wall.length; i++ )
	{ 
		var p = wall[i].userData.wall.p;
		
		walls[i] = { }; 
		
		walls[i].id = wall[i].userData.id;
		walls[i].p = { id: [p[0].userData.id, p[1].userData.id] };
		
		
		walls[i].size = {y: wall[i].userData.wall.height_1, z: wall[i].userData.wall.width};

		
		if(1==2)
		{
			var x1 = p[1].position.z - p[0].position.z;
			var z1 = p[0].position.x - p[1].position.x;	
			var dir = new THREE.Vector3(z1, 0, -x1).normalize();						
			dir.multiplyScalar( wall[i].userData.wall.offsetZ );
			walls[i].startShift = new THREE.Vector3(dir.z, 0, dir.x);			
		}
				
		var wd = fname_s_0179(wall[i]);		
		walls[i].windows = wd.windows;
		walls[i].doors = wd.doors;

		
		walls[i].material = [wall[i].userData.material[1], wall[i].userData.material[2]];						
	}	

	var floor = array.floor;
	var ceiling = array.ceiling;
	
	for ( var i = 0; i < floor.length; i++ )
	{
		rooms[i] = { contour : [] };
		
		rooms[i].id = floor[i].userData.id;  
		
		rooms[i].contour = [];
		var s = 0; for ( var i2 = floor[i].p.length - 1; i2 >= 1; i2-- ) { rooms[i].contour[s] = floor[i].p[i2].userData.id; s++; } 
		
		rooms[i].material = [floor[i].userData.material, ceiling[i].userData.material];	

		rooms[i].zone = (floor[i].userData.room.zone.id == -1) ? null : floor[i].userData.room.zone.id;
	}
	

	
	for ( var i = 0; i < array.obj.length; i++ )
	{
		var obj = array.obj[i];		
			
		var m = object.length;
		object[m] = {};
		object[m].id = Number(obj.userData.id);
		object[m].lotid = Number(obj.userData.obj3D.lotid);
		object[m].pos = new THREE.Vector3(obj.position.x, obj.position.y - posY, obj.position.z);
		
		object[m].q = {x: obj.quaternion.x, y: obj.quaternion.y, z: obj.quaternion.z, w: obj.quaternion.w};
		object[m].scale = obj.scale;
		object[m].typeGroup = obj.userData.obj3D.typeGroup;
		object[m].material = obj.userData.material;
	}	
	
	let roof = array.roof;
	
	for ( var i = 0; i < roof.length; i++ )
	{
		var obj = roof[i];		
			
		var m = roofs.length;
		roofs[m] = {};
		roofs[m].id = Number(obj.userData.id);
		roofs[m].lotid = Number(obj.userData.roof.lotid);
		roofs[m].pos = new THREE.Vector3(obj.position.x, obj.position.y - posY, obj.position.z);
		
		roofs[m].q = {x: obj.quaternion.x, y: obj.quaternion.y, z: obj.quaternion.z, w: obj.quaternion.w};
		roofs[m].scale = obj.scale;
		roofs[m].material = {};
		roofs[m].material.color = obj.children[0].material.color;
		
	}	
		
	json.level[0].points = points;
	json.level[0].walls = walls;
	json.level[0].rooms = rooms;
	json.level[0].object = object;
	json.level[0].roofs = roofs;
	
	
	json.level[0].version.id = 2;
	
	
	return json.level[0];
}






function fname_s_0179(wall)
{
	var windows = [], doors = [];
	
	var arrO = wall.userData.wall.arrO;

	var o = [[], []];

	for ( var i2 = 0; i2 < arrO.length; i2++ ) 
	{
		if(arrO[i2].userData.tag == 'window') { o[0][o[0].length] = arrO[i2]; }
		else if(arrO[i2].userData.tag == 'door') { o[1][o[1].length] = arrO[i2]; }		
	}

	var p = wall.userData.wall.p;

	for ( var i = 0; i < o.length; i++ )
	{
		for ( var i2 = 0; i2 < o[i].length; i2++ )
		{ 
			var wd = o[i][i2];
			var v = wd.geometry.vertices; 

			wd.updateMatrixWorld();
			wd.geometry.computeBoundingBox();
			wd.geometry.computeBoundingSphere();
			var dX = wd.geometry.boundingBox.max.x - wd.geometry.boundingBox.min.x;
			var dY = wd.geometry.boundingBox.max.y - wd.geometry.boundingBox.min.y;
			var center = wd.geometry.boundingSphere.center;
		
		
			var v7 = wd.localToWorld( center.clone() );			
			var qt1 = fname_s_0222( new THREE.Vector3().subVectors( p[1].position, p[0].position ).normalize() );
			var x = fname_s_0220(new THREE.Vector3().subVectors( v7, p[0].position ), qt1).z; 
			
			x = x / p[1].position.distanceTo( p[0].position );		
			var y = wall.worldToLocal( wd.localToWorld(new THREE.Vector3(0, wd.geometry.boundingBox.min.y, 0)) ).y;
			
			
			var arr = {};
			
			arr.id = wd.userData.id;							
			arr.lotid  = wd.userData.door.lotid;				  
			arr.size = {x: dX, y: dY};									
			arr.pos = {x: x, y: y};
			arr.openId = wd.userData.door.openId;
			
			if(wd.userData.tag == 'window') { windows[windows.length] = arr; }
			else if(wd.userData.tag == 'door') { doors[doors.length] = arr; }			
		}		
	}

	return { windows : windows, doors : doors };
}



function fname_s_get_json()
{
	return JSON.stringify( fname_s_0177() );
}



function fname_s_0181(cdm) 
{ 
	
	var json = JSON.stringify( fname_s_0177() );
	
	if(cdm.json)
	{
		
		$.ajax
		({
			url: infProject.path+'saveJson.php',
			type: 'POST',
			data: {myarray: json, nameFile: infProject.settings.save.file},		
			dataType: 'json',
			success: function(json)
			{ 			
				 
			},
			error: function(json){   }
		});			
	}
	
	
	if(cdm.id)
	{
		
		
		$.ajax
		({
			url: infProject.path+'components/saveSql.php',
			type: 'POST',
			data: {json: json, id: cdm.id, user_id: infProject.user.id},
			dataType: 'json',
			success: function(json)
			{ 			
				
			},
			error: function(json){  }
		});			
	}
	
	if(cdm.txt)
	{	
		var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(json);	
		
		var link = document.createElement('a');
		document.body.appendChild(link);
		link.href = csvData;
		link.target = '_blank';
		link.download = 'file.json';
		link.click();			
	}	
}





function fname_s_0182(cdm) 
{
	if(cdm.id == 0) 
	{ 
		fname_s_load_f({level: []});
		return; 
	}	 
	
	
	if(cdm.json)	
	{
		$.ajax
		({
			url: infProject.path + cdm.json, 	
			type: 'POST',
			dataType: 'json',
			success: function(json)
			{ 
				
				fname_s_load_f(json); 	
			},
		});			
	}
	else	
	{
		$.ajax
		({
			url: infProject.path+'components/loadSql.php',
			type: 'POST',
			data: {id: cdm.id},
			dataType: 'json',
			success: function(json)
			{ 
				
				fname_s_load_f(json); 	
			},
		});		
		
	}

	
}






async function fname_s_load_f(json) 
{
	fname_s_0173();
	
	let inf = await fname_s_0255({lotid: 10});
	if(inf.model) fname_s_0257(inf, new THREE.ObjectLoader().parse( inf.model ));
	inf = await fname_s_0255({lotid: 11});
	if(inf.model) fname_s_0257(inf, new THREE.ObjectLoader().parse( inf.model ));
	
	
	

	
	await fname_s_031();		
	 
	
	for ( var i = 0; i < json.level.length; i++ )
	{
		await fname_s_0184(json.level[i]);
		fname_s_0337(i);
		myLevels.visibleLevelCam2D(i, false);
	}	
	
	tabLevel.setStartInputValue();
	
	myLevels.activateLevel(0);
	myLevels.visibleLevelCam2D(0, true);
	myLevels.switchLevel(0);
	
	fname_s_0188(); 
}


async function fname_s_0184(json)
{
	let arr = json;
	
	if(!arr.points) { arr.points = []; }
	if(!arr.walls) { arr.walls = []; }
	if(!arr.rooms) { arr.rooms = []; }
	if(!arr.object) { arr.object = []; }
	if(arr.height) { infProject.settings.height = arr.height; }
	
	infProject.project = { file: arr, load: { furn: [] } };
		
	var point = arr.points;
	var walls = arr.walls;
	var rooms = arr.rooms;
	var furn = (arr.object) ? arr.object : [];
	var roofs = (arr.roofs) ? arr.roofs : [];
	
	
			
	var wall = [];
	
	for ( var i = 0; i < walls.length; i++ )
	{
		wall[i] = { };
		
		
		wall[i].id = walls[i].id;		
		
		
		wall[i].width = walls[i].size.z;
		wall[i].height = walls[i].size.y;		
		
		wall[i].points = [];
		wall[i].points[0] = { id : walls[i].p.id[0], pos : new THREE.Vector3() };
		wall[i].points[1] = { id : walls[i].p.id[1], pos : new THREE.Vector3() };
								
		for ( var i2 = 0; i2 < point.length; i2++ ) 			 
		{  	
			if(wall[i].points[0].id == point[i2].id) { wall[i].points[0].pos = new THREE.Vector3(point[i2].pos.x, point[i2].pos.y, point[i2].pos.z); }
			if(wall[i].points[1].id == point[i2].id) { wall[i].points[1].pos = new THREE.Vector3(point[i2].pos.x, point[i2].pos.y, point[i2].pos.z); }
		}
		
		wall[i].material = walls[i].material;
		
		var arrO = [];
		
		if(walls[i].doors) for ( var i2 = 0; i2 < walls[i].doors.length; i2++ ) { arrO[arrO.length] = walls[i].doors[i2]; arrO[arrO.length - 1].type = 'door'; }
		if(walls[i].windows) for ( var i2 = 0; i2 < walls[i].windows.length; i2++ ) { arrO[arrO.length] = walls[i].windows[i2]; arrO[arrO.length - 1].type = 'window'; }
		
		wall[i].arrO = [];
		
		
		for ( var i2 = 0; i2 < arrO.length; i2++ )
		{					
			wall[i].arrO[i2] = {  };
			
			wall[i].arrO[i2].id = arrO[i2].id;
			wall[i].arrO[i2].lotid = arrO[i2].lotid;
			wall[i].arrO[i2].pos = new THREE.Vector3(arrO[i2].pos.x, arrO[i2].pos.y, 0);
			wall[i].arrO[i2].size = new THREE.Vector2(arrO[i2].size.x, arrO[i2].size.y);
			wall[i].arrO[i2].type = arrO[i2].type;
			wall[i].arrO[i2].openId = (arrO[i2].openId !== undefined) ? arrO[i2].openId : 0;
		} 	
	}
		

	
	 
	
	var arrW = [];
	
	for ( var i = 0; i < wall.length; i++ )
	{ 
		var point1 = fname_s_0224( 'point', wall[i].points[0].id );
		var point2 = fname_s_0224( 'point', wall[i].points[1].id );	
		
		if(point1 == null) { point1 = fname_s_0207( wall[i].points[0].pos, wall[i].points[0].id ); }
		if(point2 == null) { point2 = fname_s_0207( wall[i].points[1].pos, wall[i].points[1].id ); }
	

		
		
		var offsetZ = 0;
		var inf = { id: wall[i].id, p: [point1, point2], width: wall[i].width, offsetZ: -offsetZ, height: wall[i].height, load: true };
		
		
		var obj = fname_s_0208(inf); 		
		
		obj.updateMatrixWorld();
		arrW[arrW.length] = obj;
	}	
	 
	
	for ( var i = 0; i < obj_point.length; i++ ) { fname_s_0107(obj_point[i]); }
	
	fname_s_040(infProject.scene.array.wall);	

	fname_s_0150();
	
	
	for ( var n = 0; n < infProject.scene.array.floor.length; n++ )
	{
		for ( var i = 0; i < rooms.length; i++ )
		{
			if(rooms[i].reference)
			{
				var floor = fname_s_0163({pos: rooms[i].reference, obj: infProject.scene.array.floor[n]});
				
				if(floor.o == infProject.scene.array.floor[n])
				{
					infProject.scene.array.floor[n].userData.id = rooms[i].id;
					infProject.scene.array.ceiling[n].userData.id = rooms[i].id;
					
					break;
				}
			}
			else if(rooms[i].contour)
			{
				if(!fname_s_0162( infProject.scene.array.floor[n], rooms[i].contour )) continue;
				
				infProject.scene.array.floor[n].userData.id = rooms[i].id;
				infProject.scene.array.ceiling[n].userData.id = rooms[i].id;
				
				break;				
			}
		}
	}		
	
	
	
	for ( var i = 0; i < wall.length; i++ )
	{ 
		var obj = arrW[i];
		
		var point1 = obj.userData.wall.p[0];
		var point2 = obj.userData.wall.p[1];		
		
		for ( var i2 = 0; i2 < wall[i].arrO.length; i2++ )
		{			
			wall[i].arrO[i2].pos.x = point1.position.distanceTo( point2.position ) * wall[i].arrO[i2].pos.x;
			
			var intP = obj.localToWorld( wall[i].arrO[i2].pos.clone() );  						

			var inf = { status: 'load', id: wall[i].arrO[i2].id, pos: intP, wall: obj, type: wall[i].arrO[i2].type, openId: wall[i].arrO[i2].openId };
			inf.lotid = wall[i].arrO[i2].lotid;
			if(wall[i].arrO[i2].size) { inf.size = wall[i].arrO[i2].size; }				
						
			fname_s_057(inf);
		}		
	}
	
	

	
	{
		var arrTexture = [];
		for ( var i = 0; i < walls.length; i++ )
		{
			arrTexture[arrTexture.length] = { objId: walls[i].id, img: walls[i].material[0].img, index: walls[i].material[0].index };
			arrTexture[arrTexture.length] = { objId: walls[i].id, img: walls[i].material[1].img, index: walls[i].material[1].index };
		}
		for ( var i = 0; i < rooms.length; i++ )
		{
			arrTexture[arrTexture.length] = { objId: rooms[i].id, img: rooms[i].material[0].img, tag: rooms[i].material[0].tag };
			arrTexture[arrTexture.length] = { objId: rooms[i].id, img: rooms[i].material[1].img, tag: rooms[i].material[1].tag };
		}
		
		arrTexture = [...new Set(arrTexture)];	
		
		
		fname_s_0186({arr: arrTexture});
	}
	
	for ( var i = 0; i < roofs.length; i++ )
	{		
		roofs[i].roof = true;
		await fname_s_0256(roofs[i]); 
	}
	  
	fname_s_028({arr: rooms});	
	
	await fname_s_0187({furn: furn});	
}



async function fname_s_0185()
{
	var url = infProject.settings.api.type.room; 
	

	var response = await fetch(url, { method: 'GET' });
	var json = await response.json();
	json.unshift({id: -1, title: "Без функции"});

	infProject.settings.room.type = json;	
	
	var json = infProject.settings.room.type;
	
	for(var i = 0; i < json.length; i++)
	{		
		var str = 
		'<div class="right_panel_1_1_list_item" type_room="'+json[i].id+'">\
			<div class="right_panel_1_1_list_item_text">'
			+json[i].title+
			'</div>\
		</div>';
		
		
		var el = $(str).appendTo('[list_ui="room_type"]');
		var id = json[i].id;
		(function(id) 
		{
			el.on('mousedown', function(){ fname_s_029({button: true, id: id}); });	
		}(id));		
	}	
}



function fname_s_0186(cdm)
{
	
	
	var wall = infProject.scene.array.wall;
	
	for ( var i = 0; i < cdm.arr.length; i++ )
	{
		for ( var i2 = 0; i2 < wall.length; i2++ )
		{
			if(cdm.arr[i].objId == wall[i2].userData.id)
			{ 
				fname_s_0214({obj: wall[i2], material: cdm.arr[i]});
			}			
		}
		for ( var i2 = 0; i2 < room.length; i2++ )
		{
			if(cdm.arr[i].objId == room[i2].userData.id && cdm.arr[i].tag == 'room')
			{ 
				fname_s_0214({obj: room[i2], material: cdm.arr[i]});
			}			
		}	
		for ( var i2 = 0; i2 < ceiling.length; i2++ )
		{
			if(cdm.arr[i].objId == ceiling[i2].userData.id && cdm.arr[i].tag == 'ceiling')
			{ 
				fname_s_0214({obj: ceiling[i2], material: cdm.arr[i]});
			}			
		}			
	}
}



async function fname_s_0187(cdm)
{
	var furn = cdm.furn;
	var lotid = [];
	
	for ( var i = 0; i < furn.length; i++ )
	{
		lotid[lotid.length] = Number(furn[i].lotid);

		
	}
	
	lotid = [...new Set(lotid)];  
	
	var strId = '';
	
	for ( var i = 0; i < lotid.length; i++ )
	{
		strId += '&id['+i+']='+lotid[i];
	}

	var url = infProject.path+'components_2/getListObjSql.php';		
	var response = await fetch(url, 
	{
		method: 'POST',
		body: 'select_list=id, name, size'+strId ,
		headers: 
		{
			'Content-Type': 'application/x-www-form-urlencoded'
		},		
		
	});
	var json = await response.json();

	
	for ( var i = 0; i < json.length; i++ )
	{		
		for ( var i2 = 0; i2 < furn.length; i2++ )
		{
			if(furn[i2].lotid == json[i].id) 
			{ 
				await fname_s_0256(furn[i2]);

				infProject.project.load.furn[infProject.project.load.furn.length] = furn[i2].lotid;				
				
				var rat = (Math.round((infProject.project.load.furn.length/infProject.project.file.object.length)*100)) + '%';
				$('[nameId="txt_loader_slider_UI"]').text(rat);
			}
		}
	}
}





function fname_s_0188(cdm)
{
	
	
	for ( var i = 0; i < scene.children.length; i++ ) 
	{ 
		if(scene.children[i].userData.id) 
		{ 
			var index = parseInt(scene.children[i].userData.id);
			if(index > countId) { countId = index; }
		} 
	}	
	countId++; 
	
	
	
	
	$('[nameId="menu_loader_slider_UI"]').hide();
	
	startProject.setCamera();	
}



function fname_s_0189()
{
		var depthTest = true;
		var w2 = 0.0;
		var visible = false;
		var visible_2 = false;
		var visible_3 = true;
	
	var point = infProject.scene.array.point;
	var wall = infProject.scene.array.wall;
	var window = infProject.scene.array.window;
	var door = infProject.scene.array.door;	
	var floor = infProject.scene.array.floor;
	
	
	
	
	var label = [];
	for ( var i = 0; i < wall.length; i++ )
	{
		if(!wall[i].userData.wall.html.label) continue;
		
		for ( var i2 = 0; i2 <  wall[i].userData.wall.html.label.length; i2++ )
		{
			label[label.length] = wall[i].userData.wall.html.label[i2];  
		}
	}		

	if(infProject.settings.floor.label.visible)
	{
		for ( var i = 0; i < floor.length; i++ )
		{ 
			if(visible)
			{
				if(floor[i].userData.room.zone.id !== undefined)
				{
					label[label.length] = floor[i].userData.room.html.label; 
				}
			}
			else
			{
				label[label.length] = floor[i].userData.room.html.label;
			}			 
		}		
	}
	
	if(visible) { fname_s_0309(label); }
	else 
	{ 
		fname_s_0310(label); 
		fname_s_0310(infProject.html.furn.size);
		fname_s_0310(infProject.html.furn.offset);		
	}

	
	
	
	for ( var i = 0; i < point.length; i++ )
	{ 
		point[i].visible = visible; 
	}		

	var svg = [];
	
	for ( var i = 0; i < door.length; i++ )
	{  
		svg[svg.length] = door[i].userData.door.svg.el;
		
		if(door[i].userData.door.svg.path) { svg[svg.length] = door[i].userData.door.svg.path; }
		if(door[i].userData.door.svg.arc) { svg[svg.length] = door[i].userData.door.svg.arc; }
		
		if(!door[i].userData.door.obj3D) continue;
		door[i].userData.door.obj3D.visible = visible_3;		
	}	

	for ( var i = 0; i < window.length; i++ )
	{ 
		svg[svg.length] = window[i].userData.door.svg.el;
		
		if(window[i].userData.door.svg.path) { svg[svg.length] = window[i].userData.door.svg.path; }
		
		if(!window[i].userData.door.obj3D) continue;
		window[i].userData.door.obj3D.visible = visible_3;		
	}
	
	fname_s_0307(svg);	
	
	fname_s_086(window, visible_2);
	fname_s_086(door, visible_2);
	
}




var containerF = document.getElementById( 'canvasFrame' );
var canvas = document.createElement( 'canvas' );
var context = canvas.getContext( 'webgl2' );
var renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context, preserveDrawingBuffer: true, } );
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.localClippingEnabled = true;
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( containerF.clientWidth, containerF.clientHeight );
containerF.appendChild( renderer.domElement );

var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );








function fname_s_0190() 
{
	requestAnimationFrame( fname_s_0190 );	
	
	myCameraMoveKey.updateKeyDown();
}



function renderCamera()
{
	
	
	
	
	
	
	if(myCameraOrbit) myCameraOrbit.render();	
}









var kof_rd = 1;

var countId = 2;

var obj_point = [];
var room = [];
var ceiling = [];
var arrWallFront = [];

var lightMap_1 = null;

var clickO = resetPop.clickO();
infProject.project = null;

infProject.settings.active = { pg: 'pivot' };
infProject.settings.door = { width: 0.85, height: 2.1 };
infProject.settings.wind = { width: 1.5, height: 1.5, h1: 0.8 };
infProject.settings.gate = { width: 2.5, height: 2.1 };
infProject.settings.roof = { width: 4, length: 6 };
infProject.settings.room = { type: [] };
infProject.settings.blockKeyCode = false;
infProject.scene.grid = fname_s_0195();
infProject.scene.light = {global: {}, lamp: []}; 
infProject.scene.array = resetPop.infProjectSceneArray();
infProject.scene.block = { key : { scroll : false } };		
infProject.scene.block.click = {wall: false, point: false, door: false, window: false, room: false, tube: false, controll_wd: false, obj: false};
infProject.scene.block.hover = {wall: false, point: false, door: false, window: false, room: false, tube: false, controll_wd: false, obj: false};
infProject.geometry = { circle : fname_s_0203() };
infProject.geometry.cone = [fname_s_0204({r1: 0.003, r2: 0.03, h: 0.25}), fname_s_0204({r1: 0.001, r2: 0.04, h: 0.1})];
infProject.scene.size = { wd_1: {} };	
infProject.scene.size.wd_1.line = fname_s_0202({count : 6, color : 0x616161});	
infProject.html = {};
infProject.html.label = [];	
infProject.html.wd = fname_s_0311({count: 6, display: 'none', tag: 'elem_wd_size'});
infProject.html.furn = {};
infProject.html.furn.size = fname_s_0311({count: 2, display: 'none', tag: 'elem_furn_size', style: 'border: 1px solid #646464; padding: 2px 5px; background: #fff;'});
infProject.html.furn.offset = fname_s_0311({count: 4, display: 'none', tag: 'elem_furn_offset', style: 'border: 1px solid #646464; padding: 2px 5px; background: #fff;'});
infProject.svg = {furn: {}};
infProject.svg.arr = []; 	
infProject.svg.furn.size = {};
infProject.svg.furn.size.elem = fname_s_0296({count: 2, color: infProject.settings.svg.scaleBox.color});
infProject.svg.furn.size.show = infProject.settings.obj.cam2D.show.size;
infProject.svg.furn.offset = {};
infProject.svg.furn.offset.elem = fname_s_0296({count: 4, color: infProject.settings.svg.scaleBox.color});
infProject.svg.furn.offset.show = infProject.settings.obj.cam2D.show.offset;
infProject.svg.furn.box2 = fname_s_0298({count: 1, color: infProject.settings.svg.scaleBox.color, dasharray: true})[0];
infProject.svg.furn.box1 = fname_s_0298({count: 1, color: infProject.settings.svg.scaleBox.color})[0];
infProject.svg.furn.boxCircle = {};
infProject.svg.furn.boxCircle.elem = fname_s_0297({count: 8, color: infProject.settings.svg.scaleBox.color});
infProject.svg.furn.boxCircle.show = infProject.settings.obj.cam2D.show.scale; 


infProject.tools = { pivot: fname_s_0232(), gizmo: fname_s_0248(), cutWall: [], point: fname_s_0205(), axis: fname_s_0200(), controllWD: fname_s_088() }; 
infProject.tools.floorPl = fname_s_0148();
infProject.catalog = { texture: fname_s_0254() }; 
infProject.listColor = resetPop.listColor(); 
infProject.start = true; 


infProject.calc = {};
infProject.calc.boxScale2D = {sizeLine: null, boxCircle: null, box1: null, box2: null, offsetLine: null};
infProject.calc.boxScale2D.pos2D = new THREE.Vector2();
infProject.calc.boxScale2D.pos3D = new THREE.Vector3();
infProject.calc.boxScale2D.arrO = [];

infProject.ur = {};
infProject.ur.count = -1; 
infProject.ur.back = [];
infProject.ur.forward = [];


infProject.tools.selectionBox = { msdown : false, fname_s_0312 : new THREE.Vector2(), mStart : new THREE.Vector2(), mEnd : new THREE.Vector2(), button : false };
	

 
 


var planeMath = fname_s_0196();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var offset = new THREE.Vector3();
  
  


{
	var lights = [];
	lights[ 0 ] = new THREE.PointLight( 0x222222, 0.7, 0 );
	lights[ 1 ] = new THREE.PointLight( 0x222222, 0.5, 0 );
	lights[ 2 ] = new THREE.PointLight( 0x222222, 0.8, 0 );
	lights[ 3 ] = new THREE.PointLight( 0x222222, 0.2, 0 );
	
	lights[ 0 ].position.set( -1000, 200, 1000 );
	lights[ 1 ].position.set( -1000, 200, -1000 );
	lights[ 2 ].position.set( 1000, 200, -1000 );
	lights[ 3 ].position.set( 1000, 200, 1000 );
	
	scene.add( lights[ 0 ] );
	scene.add( lights[ 1 ] );
	scene.add( lights[ 2 ] );
	scene.add( lights[ 3 ] );
	

	var light = new THREE.AmbientLight( 0xffffff, 0.93 );
	scene.add( light );
	
	infProject.scene.light.global = {ambient: light, point: lights};
}




{	
	
	fname_s_022();		
	fname_s_023();
	fname_s_024();		
	
	
	
	fname_s_0308({el: infProject.svg.furn.boxCircle.elem}); 
}






if(1==2)
{
	var svgline = fname_s_0296({count: 1, x1: 400, y1: 700, x2: 800, y2: 700, display: "block"})[0]; 
	fname_s_0304({el: [svgline]});
	fname_s_0300({el: svgline});

	var svgline2 = fname_s_0298({count: 1, arrS: [new THREE.Vector2(420, 710), new THREE.Vector2(400, 700), new THREE.Vector2(420, 690)], stroke_width: "2px", display: "block"})[0];
	fname_s_0305({el: [svgline2]});  

	
	 
}



function fname_s_0192()
{
	var n = 0;
	var v = [];
	var circle = infProject.geometry.circle;
	
	for ( var i = 0; i < circle.length; i++ )
	{
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.0 );
		v[n].y = 0.01;		
		n++;		
		
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.25 );
		v[n].y = 0.01;
		n++;
		
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.0 );
		v[n].y = 0.0;
		n++;	
		
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.25 );
		v[n].y = 0.0;
		n++;		
	}	


	
	var material = new THREE.MeshPhongMaterial({ color: 0xcccccc, transparent: true, opacity: 1, depthTest: false });	
	var obj = new THREE.Mesh( fname_s_0201(v), material ); 
	obj.userData.tag = '';
	obj.renderOrder = 2;
	obj.visible = false;
	
	var n = 0;
	var v2 = [];
	var circle = infProject.geometry.circle;
	
	for ( var i = 0; i < circle.length; i++ )
	{
		v2[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.25 );
		v2[n].y = 0.01;		
		n++;		
		
		v2[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.26 );
		v2[n].y = 0.01;
		n++;
		
		v2[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.25 );
		v2[n].y = 0.0;
		n++;	
		
		v2[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.26 );
		v2[n].y = 0.0;
		n++;		
	}	
	
	var material = new THREE.MeshPhongMaterial({ color: 0xcccccc, transparent: true, opacity: 1, depthTest: false });
	var obj_2 = new THREE.Mesh( fname_s_0201(v2), material );
	obj_2.renderOrder = 2;
	
	obj.add( obj_2 );
	scene.add( obj );
	
	fname_s_0206( obj );
	
	fname_s_0214({obj: obj, material: { img: "img/walk_1.png" }, repeat: {x: 1.9, y: 1.9}, offset: {x: 0.5, y: 0.5} });	
	
	return obj;
}



function fname_s_0193(cdm)
{
	
	if(!myCameraOrbit.activeCam.userData.isCam2D) return;
	
	if(!cdm) cdm = {};
	
	const cam2D = myCameraOrbit.cam2D;
	
	var stop = true;
	if(cam2D.userData.zoom - cam2D.zoom !== 0) { stop = false; }
	if(cam2D.userData.pos.x - cam2D.position.x !== 0) { stop = false; }
	else if(cam2D.userData.pos.z - cam2D.position.z !== 0) { stop = false; }
	else if(cdm.resize) { stop = false; }
	
	if(stop) return;
	
	cam2D.userData.pos = cam2D.position.clone();
	cam2D.userData.zoom = cam2D.zoom;
	
	
	for ( var i = 0; i < infProject.html.label.length; i++ )
	{
		var elem = infProject.html.label[i];
		
		if(elem.userData.elem.show)
		{
			if(cam2D.zoom < 0.7) { elem.style.display = 'none'; }
			else { elem.style.display = 'block'; }			
		}
		else
		{
			continue;
		}
				
		fname_s_0194({elem: elem});
	}	
	

	for ( var i = 0; i < infProject.svg.arr.length; i++ )
	{
		var svg = infProject.svg.arr[i];
		
		
		
		if(svg.userData.svg.line)
		{
			fname_s_0300({el: svg});
		}
		else if(svg.userData.svg.circle)
		{
			fname_s_0301({el: svg});
		}
		else if(svg.userData.svg.path)
		{
			fname_s_0302({el: svg});
		}
		else if(svg.userData.svg.arc)
		{
			fname_s_0303({el: svg});
		}		
	}	
}


function fname_s_0194(cdm) 
{
	var elem = cdm.elem;
	const cam2D = myCameraOrbit.cam2D;
	
	if(elem.style.display == 'none') return;
	
	
	
	var tempV = elem.userData.elem.pos.clone().project(cam2D);

	var x = (tempV.x *  .5 + .5) * canvas.clientWidth;
	var y = (tempV.y * -.5 + .5) * canvas.clientHeight;

	
	
	
	
	elem.style.top = `${y}px`;
	elem.style.left = `${x}px`;

	elem.userData.elem.x = x;
	elem.userData.elem.y = y;	
}


  


function fname_s_0195()
{
	var geometry = new THREE.PlaneGeometry( 1000, 1000 );
	var material = new THREE.MeshLambertMaterial( {color: 0xffffff, polygonOffset: true, polygonOffsetFactor: 10.0, polygonOffsetUnits: 4.0 } );
	
	var planeMath = new THREE.Mesh( geometry, material );
	planeMath.position.y = -0.02;
	planeMath.rotation.set(-Math.PI/2, 0, 0);
	scene.add( planeMath );	
	
	
	var cdm = {};
	var img = infProject.path+'img/f1.png';
	
	new THREE.TextureLoader().load(img, function ( image )  
	{
		material.color = new THREE.Color( 0xffffff );
		var texture = image;			
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
		
		if(cdm.repeat)
		{
			texture.repeat.x = cdm.repeat.x;
			texture.repeat.y = cdm.repeat.y;			
		}
		else
		{
			texture.repeat.x = 1000;
			texture.repeat.y = 1000;			
		}
		
		texture.needsUpdate = true;
		
		material.map = texture; 
		material.lightMap = lightMap_1;
		material.needsUpdate = true; 					
		
		renderCamera();
	});		
	
	return planeMath;
}



function fname_s_0196()
{
	var geometry = new THREE.PlaneGeometry( 10000, 10000 );
	
	var material = new THREE.MeshLambertMaterial( {color: 0xffff00, transparent: true, opacity: 0.5, side: THREE.DoubleSide } );
	material.visible = false; 
	var planeMath = new THREE.Mesh( geometry, material );
	planeMath.rotation.set(-Math.PI/2, 0, 0);
	planeMath.userData.tag = 'planeMath';	
	scene.add( planeMath );	
	
	return planeMath;
}





function fname_s_0197(x, y, z, cdm)
{
	var geometry = new THREE.Geometry();
	x /= 2;
	z /= 2;
	var vertices = [
				new THREE.Vector3(-x,0,z),
				new THREE.Vector3(-x,y,z),
				new THREE.Vector3(x,y,z),
				new THREE.Vector3(x,0,z),
				new THREE.Vector3(x,0,-z),
				new THREE.Vector3(x,y,-z),
				new THREE.Vector3(-x,y,-z),
				new THREE.Vector3(-x,0,-z),
			];	
			
	var faces = [
				new THREE.Face3(0,3,2),
				new THREE.Face3(2,1,0),
				new THREE.Face3(4,7,6),
				new THREE.Face3(6,5,4),				
				new THREE.Face3(0,1,6),
				new THREE.Face3(6,7,0),					
				new THREE.Face3(1,2,5),
				new THREE.Face3(5,6,1),				
				new THREE.Face3(2,3,4),
				new THREE.Face3(4,5,2),				
				new THREE.Face3(3,0,7),
				new THREE.Face3(7,4,3),
			];
	
	var uvs3 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(1,1),
			];
	var uvs4 = [
				new THREE.Vector2(1,1),
				new THREE.Vector2(0,1),
				new THREE.Vector2(0,0),
			];	

	var uvs1 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(0.95,1),
			];
	var uvs2 = [
				new THREE.Vector2(0.95,1),
				new THREE.Vector2(1-0.95,1),
				new THREE.Vector2(0,0),
			];				


			
	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.faceVertexUvs[0] = [uvs3, uvs4, uvs3, uvs4, uvs3, uvs4, uvs1, uvs2, uvs3, uvs4, uvs3, uvs4];
	geometry.computeFaceNormals();	
	geometry.uvsNeedUpdate = true;	

	if(cdm)
	{
		if(cdm.material)
		{
			geometry.faces[0].materialIndex = 1;
			geometry.faces[1].materialIndex = 1;	
			geometry.faces[2].materialIndex = 2;
			geometry.faces[3].materialIndex = 2;	
			geometry.faces[6].materialIndex = 3;
			geometry.faces[7].materialIndex = 3;				
		}
	}
	
	return geometry;
}




function fname_s_0198(cdm)  
{
	var x = cdm.x;
	var y = cdm.y;
	var z = cdm.z;
	var zC = 0;
	
	var geometry = new THREE.Geometry();
	x /= 2;
	y /= 2;
	z /= 2;
	var f = 0.9;
	
	var vertices = [
				new THREE.Vector3(-x,-y,z),
				new THREE.Vector3(-x*f,y,z*f),
				new THREE.Vector3(x*f,y,zC*f),
				new THREE.Vector3(x,-y,zC),
				new THREE.Vector3(x,-y,-zC),
				new THREE.Vector3(x*f,y,-zC*f),
				new THREE.Vector3(-x*f,y,-z*f),
				new THREE.Vector3(-x,-y,-z),
			];	
			
	var faces = [
				new THREE.Face3(0,3,2),
				new THREE.Face3(2,1,0),
				new THREE.Face3(4,7,6),
				new THREE.Face3(6,5,4),				
				new THREE.Face3(0,1,6),
				new THREE.Face3(6,7,0),					
				new THREE.Face3(1,2,5),
				new THREE.Face3(5,6,1),				
				new THREE.Face3(2,3,4),
				new THREE.Face3(4,5,2),				
				new THREE.Face3(3,0,7),
				new THREE.Face3(7,4,3),
			];
	
	var uvs3 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(1,1),
			];
	var uvs4 = [
				new THREE.Vector2(1,1),
				new THREE.Vector2(0,1),
				new THREE.Vector2(0,0),
			];	

	var uvs1 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(0.95,1),
			];
	var uvs2 = [
				new THREE.Vector2(0.95,1),
				new THREE.Vector2(1-0.95,1),
				new THREE.Vector2(0,0),
			];				


			
	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.faceVertexUvs[0] = [uvs3, uvs4, uvs3, uvs4, uvs3, uvs4, uvs1, uvs2, uvs3, uvs4, uvs3, uvs4];
	geometry.computeFaceNormals();	
	geometry.uvsNeedUpdate = true;		
	
	return geometry;
}


function fname_s_0199(x, y, z, pr_offsetZ)
{
	var geometry = new THREE.Geometry();
	
	var h1 = 0;
	
	if(1==1)
	{
		var z1 = z / 2 + pr_offsetZ / 2;
		var z2 = -z / 2 + pr_offsetZ / 2;  		
	}
	else
	{
		var z1 = z / 2 + pr_offsetZ;
		var z2 = -z / 2 + pr_offsetZ;  		
	}
		
	var vertices = [
				new THREE.Vector3(0,h1,z1),
				new THREE.Vector3(0,y,z1),
				new THREE.Vector3(0,h1,0),
				new THREE.Vector3(0,y,0),
				new THREE.Vector3(0,h1,z2),
				new THREE.Vector3(0,y,z2),								
								
				new THREE.Vector3(x,h1,z1),
				new THREE.Vector3(x,y,z1),
				new THREE.Vector3(x,h1,0),
				new THREE.Vector3(x,y,0),
				new THREE.Vector3(x,h1,z2),
				new THREE.Vector3(x,y,z2),						
			];	
			
	var faces = [
				new THREE.Face3(0,6,7),
				new THREE.Face3(7,1,0),
				new THREE.Face3(4,5,11),
				new THREE.Face3(11,10,4),				
				new THREE.Face3(1,7,9),
				new THREE.Face3(9,3,1),					
				new THREE.Face3(9,11,5),
				new THREE.Face3(5,3,9),				
				new THREE.Face3(6,8,9),
				new THREE.Face3(9,7,6),				
				new THREE.Face3(8,10,11),
				new THREE.Face3(11,9,8),
				
				new THREE.Face3(0,1,3),
				new THREE.Face3(3,2,0),	

				new THREE.Face3(2,3,5),
				new THREE.Face3(5,4,2),	

				new THREE.Face3(0,2,8),
				new THREE.Face3(8,6,0),

				new THREE.Face3(2,4,10),
				new THREE.Face3(10,8,2),					
			];
	
	var uvs1 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(1,1),
			];
	var uvs2 = [
				new THREE.Vector2(1,1),
				new THREE.Vector2(0,1),
				new THREE.Vector2(0,0),
			];					


			
	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.faceVertexUvs[0] = [uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2];
	geometry.computeFaceNormals();	
	geometry.uvsNeedUpdate = true;	
	
	geometry.faces[0].materialIndex = 1;
	geometry.faces[1].materialIndex = 1;	
	geometry.faces[2].materialIndex = 2;
	geometry.faces[3].materialIndex = 2;	
	geometry.faces[4].materialIndex = 3;
	geometry.faces[5].materialIndex = 3;
	geometry.faces[6].materialIndex = 3;
	geometry.faces[7].materialIndex = 3;
	
	return geometry;
}



function fname_s_0200() 
{
	var axis = [];
	
	var geometry = fname_s_0197(0.5, 0.02, 0.02);		
	var v = geometry.vertices;	
	v[3].x = v[2].x = v[5].x = v[4].x = 500;
	v[0].x = v[1].x = v[6].x = v[7].x = -500;	
	
	var material = new THREE.MeshLambertMaterial( { color : 0xcccccc, transparent: true, depthTest: false, lightMap : lightMap_1 } );
	
	for(var i = 0; i < 2; i++)
	{
		axis[i] = new THREE.Mesh( geometry, material );
		axis[i].renderOrder = 2;
		axis[i].visible = false;
		scene.add( axis[i] );				
	}		
	
	return axis;
}


function fname_s_0201( vertices )
{
	var geometry = new THREE.Geometry();

	var faces = [];

	var n = 0;
	for ( var i = 0; i < vertices.length - 4; i += 4 )
	{
		faces[ n ] = new THREE.Face3( i + 0, i + 4, i + 6 ); n++;
		faces[ n ] = new THREE.Face3( i + 6, i + 2, i + 0 ); n++;

		faces[ n ] = new THREE.Face3( i + 2, i + 6, i + 7 ); n++;
		faces[ n ] = new THREE.Face3( i + 7, i + 3, i + 2 ); n++;

		faces[ n ] = new THREE.Face3( i + 3, i + 7, i + 5 ); n++;
		faces[ n ] = new THREE.Face3( i + 5, i + 1, i + 3 ); n++;

		faces[ n ] = new THREE.Face3( i + 0, i + 1, i + 5 ); n++;
		faces[ n ] = new THREE.Face3( i + 5, i + 4, i + 0 ); n++;
	}


	faces[ n ] = new THREE.Face3( i + 0, 0, 2 ); n++;
	faces[ n ] = new THREE.Face3( 2, i + 2, i + 0 ); n++;

	faces[ n ] = new THREE.Face3( i + 2, 2, 3 ); n++;
	faces[ n ] = new THREE.Face3( 3, i + 3, i + 2 ); n++;

	faces[ n ] = new THREE.Face3( i + 3, 3, 1 ); n++;
	faces[ n ] = new THREE.Face3( 1, i + 1, i + 3 ); n++;

	faces[ n ] = new THREE.Face3( i + 0, i + 1, 1 ); n++;
	faces[ n ] = new THREE.Face3( 1, 0, i + 0 ); n++;



	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.computeFaceNormals();
	geometry.uvsNeedUpdate = true;

	return geometry;
}




function fname_s_0202(cdm)
{
	var arr = [];
	
	if(cdm.material == 'standart') { var mat = { color: cdm.color }; }
	else { var mat = { color: cdm.color, transparent: true, depthTest : false }; }
	
	var material = new THREE.LineBasicMaterial( mat );
	
	
	for ( var i = 0; i < cdm.count; i++ )
	{
		arr[i] = new THREE.Mesh( fname_s_0197(1, 0.025, 0.025), material );
		var v = arr[i].geometry.vertices; 
		v[0].x = v[1].x = v[6].x = v[7].x = -0.5;
		v[3].x = v[2].x = v[5].x = v[4].x = 0.5;
		
		v[0].y = v[3].y = v[4].y = v[7].y = -0.025/2;
		v[1].y = v[2].y = v[5].y = v[6].y = 0.025/2;
		
		arr[i].geometry.verticesNeedUpdate = true;			
		arr[i].visible = false;	 
		arr[i].renderOrder = 1;
		arr[i].userData = {rulerwd: {cone:[]}};
		scene.add( arr[i] );
		
		for ( var i2 = 0; i2 < cdm.count; i2++ )
		{
			var cone = new THREE.Mesh(infProject.geometry.cone[1], material); 
			cone.visible = false;
			scene.add( cone );	
			
			arr[i].userData.rulerwd.cone[i2] = cone;			
		}
	}
	
	return arr;
}





function fname_s_0203()
{
	var count = 48;
	var circle = [];
	var g = (Math.PI * 2) / count;
	
	for ( var i = 0; i < count; i++ )
	{
		var angle = g * i;
		circle[i] = new THREE.Vector3();
		circle[i].x = Math.sin(angle);
		circle[i].z = Math.cos(angle);
		
	}

	return circle;
}



function fname_s_0204(cdm)
{	
	var n = 0;
	var v = [];
	var circle = infProject.geometry.circle;
	
	var r2 = cdm.r2;
	var h = cdm.h;
	var r1 = cdm.r1;
	
	for ( var i = 0; i < circle.length; i++ )
	{
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), r2 );
		v[n].y = -h;		
		n++;		
		
		v[n] = new THREE.Vector3();
		v[n].y = -h;
		n++;
		
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), r1 );
		v[n].y = 0.001;
		n++;	
		
		v[n] = new THREE.Vector3();
		v[n].y = 0.001;
		n++;		
	}	 
	
	return fname_s_0201(v);
}


function fname_s_0205()
{	
	var n = 0;
	var v = [];
	
	var geometry = new THREE.SphereGeometry( 0.1, 16, 16 );
	
	var obj = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color : 0xcccccc, transparent: true, opacity: 0.5, depthTest: false } ) );
	obj.userData.tag = 'tool_point';
	obj.userData.tool_point = {};
	obj.renderOrder = 1;
	obj.position.set(0,0,0);
	obj.visible = false;	
	scene.add( obj );
	
	
	if(1==1)
	{
		var v2 = [];
		var v = obj.geometry.vertices;
		for ( var i = 0; i < v.length; i++ ) { v2[i] = v[i].clone(); }
		obj.userData.tool_point.v2 = v2;		
	}	
	
	
	return obj;
}




function fname_s_0206( obj )
{
	obj.updateMatrixWorld();
	var geometry = obj.geometry;
	
    geometry.faceVertexUvs[0] = [];
	var faces = geometry.faces;
	
    for (var i = 0; i < faces.length; i++) 
	{		
		var components = ['x', 'y', 'z'].sort(function(a, b) {			
			return Math.abs(faces[i].normal[a]) - Math.abs(faces[i].normal[b]);
		});	


        var v1 = geometry.vertices[faces[i].a];
        var v2 = geometry.vertices[faces[i].b];
        var v3 = geometry.vertices[faces[i].c];				

        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(v1[components[0]], v1[components[1]]),
            new THREE.Vector2(v2[components[0]], v2[components[1]]),
            new THREE.Vector2(v3[components[0]], v3[components[1]])
        ]);
    }

    geometry.uvsNeedUpdate = true;
	geometry.elementsNeedUpdate = true; 
}




function fname_s_0207( pos, id )
{
	var point = obj_point[obj_point.length] = new THREE.Mesh( infProject.tools.point.geometry, infProject.tools.point.material.clone() );
	point.position.copy( pos );		

	point.renderOrder = 1;
	 
	point.w = [];
	point.p = [];
	point.start = [];		
	point.zone = [];
	point.zoneP = [];
	
	
	if(id == 0) { id = countId; countId++; }	
	point.userData.id = id;	
	point.userData.tag = 'point';
	point.userData.point = {};
	point.userData.point.color = point.material.color.clone();
	point.userData.point.cross = null;
	point.userData.point.type = null;
	point.userData.point.last = { pos : pos.clone(), cdm : '', cross : null };
	
	
	point.visible = (myCameraOrbit.activeCam.userData.isCam2D) ? true : false;	
	
	scene.add( point );	
	
	return point;
}


  



function fname_s_0208( cdm ) 
{
	var point1 = cdm.p[0];
	var point2 = cdm.p[1];
	var width = (cdm.width) ? cdm.width : infProject.settings.wall.width;
	var offsetZ = (cdm.offsetZ) ? cdm.offsetZ : 0;  
	var height = (cdm.height) ? cdm.height : infProject.settings.height; 
	
	var p1 = point1.position;
	var p2 = point2.position;	
	var d = p1.distanceTo( p2 );
	
	
	{
		var color = [0x7d7d7d, 0x696969]; 	
		
		if(infProject.settings.wall.color) 
		{  
			if(infProject.settings.wall.color.front) color[0] = infProject.settings.wall.color.front; 
			if(infProject.settings.wall.color.top) color[1] = infProject.settings.wall.color.top; 
		}	
		
		var material = new THREE.MeshPhongMaterial({ color : color[0], transparent: true, opacity: 1, lightMap : lightMap_1, dithering: true, precision: 'highp' });
		var materialTop = new THREE.MeshPhongMaterial({ color: color[1], transparent: true, opacity: 1, lightMap : lightMap_1, dithering: true, precision: 'highp' });
		
		var material = new THREE.MeshStandardMaterial({ color : color[0], transparent: true, opacity: 1 });
		var materialTop = new THREE.MeshStandardMaterial({ color : color[1], transparent: true, opacity: 1 });
		var materials = [ material.clone(), material.clone(), material.clone(), materialTop ];	
	}
	
	
	var geometry = fname_s_0199(d, height, width, offsetZ);	
	var wall = new THREE.Mesh( geometry, materials ); 
 	infProject.scene.array.wall[infProject.scene.array.wall.length] = wall;		
	
	wall.position.copy( p1 );
	
	
	if(!cdm.id) { cdm.id = countId; countId++; }
	
	wall.userData.tag = 'wall';
	wall.userData.id = cdm.id;
	
	wall.userData.wall = {};				
	wall.userData.wall.p = [];
	wall.userData.wall.p[0] = point1;
	wall.userData.wall.p[1] = point2;	
	wall.userData.wall.width = Math.round(width * 100) / 100;
	wall.userData.wall.height_0 = 0;
	wall.userData.wall.height_1 = Math.round(height * 100) / 100;		
	wall.userData.wall.offsetZ = Math.round(offsetZ * 100) / 100;
	wall.userData.wall.arrO = [];
	wall.userData.wall.last = { pos : new THREE.Vector3(), rot : new THREE.Vector3() }; 
	wall.userData.wall.area = { top : 0 }; 
	
	wall.userData.wall.room = { side : 0, side2 : [null,null,null] };
	wall.userData.wall.html = {};
	
	
	if(infProject.settings.html.fonts.wall.show)
	{
		wall.userData.wall.html.label = fname_s_0311({count: 2, tag: 'elem_wall_size'});
	}
	
	wall.userData.wall.svg = {};
	wall.userData.wall.svg.lineW = null;
	
	
	wall.userData.wall.show = true;
	
	var v = wall.geometry.vertices;
	wall.userData.wall.v = [];
	
	for ( var i = 0; i < v.length; i++ ) { wall.userData.wall.v[i] = v[i].clone(); }
	
	wall.userData.material = [];
	wall.userData.material[0] = { index: 0, color: wall.material[0].color, img: null };	
	wall.userData.material[1] = { index: 1, color: wall.material[1].color, img: null };	
	wall.userData.material[2] = { index: 2, color: wall.material[2].color, img: null };	
	wall.userData.material[3] = { index: 3, color: wall.material[3].color, img: null };
	

	wall.castShadow = true;	
	wall.receiveShadow = true;
	
	fname_s_0219( wall );
	
	cdm.material = [];
	cdm.material[0] = { img: "img/load/beton.jpg", index:1 };
	cdm.material[1] = { img: "img/load/beton.jpg", index:2 };
	
	if(cdm.material)
	{  
		for ( var i = 0; i < cdm.material.length; i++ )
		{			
			fname_s_0214({obj: wall, material: cdm.material[i]});
		}	
	}
	
	
	
	var dir = new THREE.Vector3().subVectors( p1, p2 ).normalize();
	var angleDeg = Math.atan2(dir.x, dir.z);
	wall.rotation.set(0, angleDeg + Math.PI / 2, 0);
	
	
	var n = point1.w.length;		
	point1.w[n] = wall;
	point1.p[n] = point2;
	point1.start[n] = 0;	
	
	var n = point2.w.length;		
	point2.w[n] = wall;
	point2.p[n] = point1;
	point2.start[n] = 1;		
	
	scene.add( wall );
		
	return wall;
}




function showHideLabelSizeWall(cdm) 
{
	if(!cdm) { cdm = {}; }
	
	if(cdm.switch)
	{
		infProject.settings.html.fonts.wall.show = !infProject.settings.html.fonts.wall.show;		
	}
	else if(cdm.show)
	{
		infProject.settings.html.fonts.wall.show = true;
	}
	else if(cdm.hide)
	{
		infProject.settings.html.fonts.wall.show = false;
	}
	else 
	{
		return;
	}
	
	
	var wall = infProject.scene.array.wall;
	
	
	for ( var i = 0; i < wall.length; i++ )
	{ 		
		if(wall[i].userData.wall.html.label)
		{
			for ( var i2 = 0; i2 < wall[i].userData.wall.html.label.length; i2++ )
			{
				
				fname_s_0140({arr: infProject.html.label, o: wall[i].userData.wall.html.label[i2]});
				wall[i].userData.wall.html.label[i2].remove();
			}
		}					 
	}


	
	if(infProject.settings.html.fonts.wall.show)
	{
		
		for ( var i = 0; i < wall.length; i++ )
		{ 		
			wall[i].userData.wall.html.label = fname_s_0311({count: 2, tag: 'elem_wall_size'});				
		}
		
		var label = [];
		for ( var i = 0; i < wall.length; i++ )
		{ 		
			if(!wall[i].userData.wall.html.label) continue;
			
			for ( var i2 = 0; i2 <  wall[i].userData.wall.html.label.length; i2++ )
			{
				label[label.length] = wall[i].userData.wall.html.label[i2];  
			}					 
		}
		 
		fname_s_0309(label);
		fname_s_040(wall, true);
	}
}



function blockKeyCode(cdm)
{	
	if(!cdm) { cdm = {}; }
	
	if(cdm.block !== undefined)
	{
		infProject.settings.blockKeyCode = cdm.block;
	}	
}


function fname_s_0211( event )
{
	var x = ( ( event.clientX - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
	var y = - ( ( event.clientY - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
	
	return new THREE.Vector2(x, y);
}


function fname_s_0212( event )
{
	var x = ( ( event.clientX - containerF.offsetLeft ) );
	var y = ( ( event.clientY - containerF.offsetTop ) );	
	
	return new THREE.Vector2(x, y);
}	
	

function fname_s_0213( event, obj, t, recursive ) 
{
	mouse = fname_s_0211( event );
	
	raycaster.setFromCamera( mouse, myCameraOrbit.activeCam );
	
	var intersects = null;
	if(t == 'one'){ intersects = raycaster.intersectObject( obj ); } 
	else if(t == 'arr'){ intersects = raycaster.intersectObjects( obj, recursive ); }
	
	return intersects;
}





function fname_s_0214(cdm)
{
	
	
	var img = cdm.material.img;
	
	if(!img) return;
	
	var material = (cdm.obj.userData.tag == "wall") ? cdm.obj.material[cdm.material.index] : cdm.obj.material;
	
	new THREE.TextureLoader().load(infProject.path+img, function ( image )  
	{
		material.color = new THREE.Color( 0xffffff );
		var texture = image;			
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
		
		if(cdm.repeat)
		{
			texture.repeat.x = cdm.repeat.x;
			texture.repeat.y = cdm.repeat.y;			
		}
		else
		{
			texture.repeat.x = 1.0;
			texture.repeat.y = 1.0;	
		}
		
		if(cdm.offset)
		{
			texture.offset.x = cdm.offset.x;
			texture.offset.y = cdm.offset.y;				
		}
		
		if(cdm.rotation)
		{
			texture.rotation = cdm.rotation;				
		}

		if(cdm.color)
		{
			material.color = new THREE.Color( cdm.color );
		}
		
		texture.needsUpdate = true;
		
		material.map = texture; 
		
		material.needsUpdate = true; 


		if(cdm.obj.userData.tag == "wall")
		{
			cdm.obj.userData.material[cdm.material.index].img = img;
			
			if(cdm.ui)
			{
				fname_s_027({obj: cdm.obj});
			}
		}
		
		if(cdm.obj.userData.tag === "room" || cdm.obj.userData.tag === "ceiling")
		{
			cdm.obj.userData.material.img = img;
		}		

		if(cdm.obj.parent.userData.tag === "obj")
		{ 						
			fname_s_0260({obj: cdm.obj.parent});
			cdm.obj.parent.userData.material.img = img;
		}
		
		if(cdm.obj.parent.userData.tag === "roof")
		{ 			
			myRoof.upDateTextureRoof({obj: cdm.obj.parent})
		}
		
		
		renderCamera();
	});			
}






function fname_s_0215( event )
{
	if(!clickO.button) return;	
	
	if(myCameraOrbit.activeCam.userData.isCam2D)
	{
		planeMath.position.set(0, 0, 0);
		planeMath.rotation.set(-Math.PI/2, 0, 0);
	}
	
	planeMath.updateMatrixWorld();

	var intersects = fname_s_0213( event, planeMath, 'one' );
	
	if(intersects.length == 0) return;	
	
	if(myCameraOrbit.activeCam.userData.isCam2D)
	{ 
		if(clickO.button == 'create_wall')
		{
			clickO.obj = null; 
			clickO.last_obj = null;
			
			var point = fname_s_0207( intersects[0].point, 0 );
			point.position.y = 0;
			point.userData.point.type = clickO.button; 
			clickO.move = point;				
		}
		else if(clickO.button == 'create_wd_1')
		{
			fname_s_057({type:'door', lotid: null});
		}		
		else if(clickO.button == 'create_wd_2')
		{
			fname_s_057({type:'door', lotid: 10});
		}
		else if(clickO.button == 'add_wind')
		{
			fname_s_057({type:'window', lotid: clickO.options});
		}
		else if(clickO.button == 'create_gate_1')
		{
			fname_s_057({type:'door', lotid: -2});
		}			
		else if(clickO.button == 'add_roof')
		{
			fname_s_0256({lotid: clickO.options, roof: true, cursor: true});
		}		
		else if(clickO.button == 'add_lotid')
		{
			fname_s_0256({lotid: clickO.options, cursor: true});
		}		
	}
	else if(myCameraOrbit.activeCam.userData.isCam3D)
	{
		if(clickO.button == 'add_lotid')
		{
			fname_s_0256({lotid: clickO.options, cursor: true});
		}		
	}
	
	clickO.buttonAct = clickO.button;
	clickO.button = null;
}	
	

function fname_s_active_int(cdm)
{
	if(clickO.move)
	{
		fname_s_0217();
		fname_s_074();
	}

	
	if(cdm)
	{		
		fname_s_0217();	
		
		if(cdm.button == 'point_1')
		{
			clickO.button = 'create_wall';
		}
		else if(cdm.button == 'create_wd_1')
		{
			clickO.button = 'create_wd_1';
		}		
		else if(cdm.button == 'create_wd_2')
		{
			clickO.button = 'create_wd_2';
		}
		else if(cdm.button == 'add_wind')
		{
			clickO.button = 'add_wind';
			clickO.options = cdm.id;
		}
		else if(cdm.button == 'create_gate_1')
		{
			clickO.button = 'create_gate_1';
		}		
		else if(cdm.button == 'add_roof')
		{
			clickO.button = 'add_roof';
			clickO.options = cdm.lotid;
		}		
		else if(cdm.button == 'add_lotid')
		{
			clickO.button = 'add_lotid';
			clickO.options = cdm.value;
		}					
	}

}	




function fname_s_0217()
{
	clickO.obj = null;
	clickO.rayhit = null;
	
	fname_s_081();		
}


function fname_s_0218(geometry, scale = new THREE.Vector3(1, 1, 1)) {
    for (var i = 0; i < geometry.faces.length; i++) {
        var face = geometry.faces[i];
        var faceUVs = geometry.faceVertexUvs[0][i]
        var va = geometry.vertices[geometry.faces[i].a].clone();
        var vb = geometry.vertices[geometry.faces[i].b].clone();
        var vc = geometry.vertices[geometry.faces[i].c].clone();
		
		if(1===1)
		{
			va.x *= scale.x; va.y *= scale.y; va.z *= scale.z;
			vb.x *= scale.x; vb.y *= scale.y; vb.z *= scale.z;
			vc.x *= scale.x; vc.y *= scale.y; vc.z *= scale.z;
		}
		
        var vab = new THREE.Vector3().copy(vb).sub(va)
        var vac = new THREE.Vector3().copy(vc).sub(va)
        
        var vcross = new THREE.Vector3().copy(vab).cross(vac);
        
        vcross.set(Math.abs(vcross.x), Math.abs(vcross.y), Math.abs(vcross.z))
        var majorAxis = vcross.x > vcross.y ? (vcross.x > vcross.z ? 'x' : vcross.y > vcross.z ? 'y' : vcross.y > vcross.z) : vcross.y > vcross.z ? 'y' : 'z'
        
        var uAxis = majorAxis == 'x' ? 'y' : majorAxis == 'y' ? 'x' : 'x';
        var vAxis = majorAxis == 'x' ? 'z' : majorAxis == 'y' ? 'z' : 'y';
        faceUVs[0].set(va[uAxis], va[vAxis])
        faceUVs[1].set(vb[uAxis], vb[vAxis])
        faceUVs[2].set(vc[uAxis], vc[vAxis])
    }
    geometry.elementsNeedUpdate = geometry.verticesNeedUpdate = true;
}

function fname_s_0219( obj )
{ 
	obj.updateMatrixWorld();
	var geometry = obj.geometry;
	
    geometry.faceVertexUvs[0] = [];
	var faces = geometry.faces;
	var n = 1;
	
	
    for (var i = 0; i < faces.length; i++) 
	{		
		var components = ['x', 'y', 'z'].sort(function(a, b) {
			return Math.abs(faces[i].normal[a]) > Math.abs(faces[i].normal[b]);
		});	


        var v1 = geometry.vertices[faces[i].a];
        var v2 = geometry.vertices[faces[i].b];
        var v3 = geometry.vertices[faces[i].c];				

        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(v1[components[0]], v1[components[1]]),
            new THREE.Vector2(v2[components[0]], v2[components[1]]),
            new THREE.Vector2(v3[components[0]], v3[components[1]])
        ]);
    }

    geometry.uvsNeedUpdate = true;
	geometry.elementsNeedUpdate = true;	
}






function fname_s_0220(dir1, qt)
{	
	return dir1.clone().applyQuaternion( qt.clone().inverse() );
}


function fname_s_0221(dir1, dir_local)
{	
	var qt = fname_s_0222(dir1);			
	return dir_local.applyQuaternion( qt );
}


function fname_s_0222(dir1)
{
	var mx = new THREE.Matrix4().lookAt( dir1, new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0) );
	return new THREE.Quaternion().setFromRotationMatrix(mx);	
}

 


	
	
 
function fname_s_0223()
{
	 
}




function fname_s_0224( cdm, id )
{
	var point = infProject.scene.array.point;
	var wall = infProject.scene.array.wall;
	var window = infProject.scene.array.window;
	var door = infProject.scene.array.door;	
	var floor = infProject.scene.array.floor;
	var obj = infProject.scene.array.obj; 
	
	
	if(cdm == 'wall')
	{
		for ( var i = 0; i < wall.length; i++ ){ if(wall[i].userData.id == id){ return wall[i]; } }			
	}
	else if(cdm == 'point')
	{
		for ( var i = 0; i < point.length; i++ ){ if(point[i].userData.id == id){ return point[i]; } }
	}
	else if(cdm == 'wd')
	{
		for ( var i = 0; i < window.length; i++ ){ if(window[i].userData.id == id){ return window[i]; } }
		for ( var i = 0; i < door.length; i++ ){ if(door[i].userData.id == id){ return door[i]; } }
	}
	else if(cdm == 'window')
	{
		for ( var i = 0; i < window.length; i++ ){ if(window[i].userData.id == id){ return window[i]; } }
	}
	else if(cdm == 'door')
	{
		for ( var i = 0; i < door.length; i++ ){ if(door[i].userData.id == id){ return door[i]; } }
	}
	else if(cdm == 'room')
	{
		for ( var i = 0; i < floor.length; i++ ){ if(floor[i].userData.id == id){ return floor[i]; } }
	}
	else if(cdm == 'obj')
	{
		for ( var i = 0; i < obj.length; i++ ){ if(obj[i].userData.id == id){ return obj[i]; } }
	}
	
	return null;
}











document.addEventListener("keydown", function (e) 
{ 
	if(infProject.settings.blockKeyCode) return;
	if(clickO.keys[e.keyCode]) return;
	
	if(infProject.activeInput) 
	{ 
		if(e.keyCode == 13)
		{ 
			
			
			if(infProject.activeInput == 'input-height') { changeHeightWall(); } 
			if(infProject.activeInput == 'wall_1') { fname_s_01({}); }	 		
			if(infProject.activeInput == 'size-wd-length') { fname_s_0131(clickO.last_obj); }
			if(infProject.activeInput == 'size-wd-height') { fname_s_0131(clickO.last_obj); }
			if(infProject.activeInput == 'rp_wd_h1') { fname_s_0131(clickO.last_obj); }
			if(infProject.activeInput == 'size_wall_width_1') 
			{ 
				var width = $('[nameid="size_wall_width_1"]').val();
				
				fname_s_04({wall:clickO.last_obj, width:{value: width}, offset:'wallRedBlueArrow'}); 
			}
			if(infProject.activeInput == 'size-obj-length') { fname_s_072({obj: clickO.last_obj}); }
			if(infProject.activeInput == 'size-obj-height') { fname_s_072({obj: clickO.last_obj}); }
			if(infProject.activeInput == 'size-obj-width') { fname_s_072({obj: clickO.last_obj}); }
			if(infProject.activeInput == 'size-roof-length') { fname_s_072({obj: clickO.last_obj}); }
			if(infProject.activeInput == 'size-roof-height') { fname_s_072({obj: clickO.last_obj}); }
			if(infProject.activeInput == 'size-roof-width') { fname_s_072({obj: clickO.last_obj}); }			
		}		
		 
		return; 
	}
	


	if(e.keyCode == 46) { fname_s_0133(); }
	
	if(e.keyCode == 90 && e.ctrlKey || e.keyCode == 90 && e.keyCode == 91) { fname_s_0326( 'undo' ); }	
	if(e.keyCode == 89 && e.ctrlKey || e.keyCode == 89 && e.keyCode == 91) { fname_s_0326( 'redo' ); }	
	
	if(clickO.keys[18] && e.keyCode == 90) { fname_s_0182({json: true}); }		
	if(clickO.keys[18] && e.keyCode == 72) { fname_s_0175({obj: scene}); fname_s_0174(); }		
	if(clickO.keys[18] && e.keyCode == 77) { fname_s_0182({id: 0}); }				
	if(clickO.keys[18] && e.keyCode == 84) { fname_s_0181({json: true}); }			
	if(clickO.keys[18] && e.keyCode == 86) {  }
	if(clickO.keys[18] && e.keyCode == 86) {  }  		
	if(clickO.keys[18] && e.keyCode == 86) {  }	
	if(clickO.keys[18] && e.keyCode == 66) 	
	{ 
		if(infProject.settings.shader.saoPass)
		{
			saoPass['params']['output'] = (saoPass['params']['output']==THREE.SAOPass.OUTPUT.Default)? THREE.SAOPass.OUTPUT.Beauty : THREE.SAOPass.OUTPUT.Default;
			
			renderCamera();			
		}
	}  
	
	
	
	
	if(e.keyCode == 89 && !e.ctrlKey) { fname_s_0181({txt: true}); } 			
	
	
	if(!infProject.settings.blockKeyCode) clickO.keys[e.keyCode] = true;
	
} );



document.addEventListener("keyup", function (e) 
{ 
	if(infProject.settings.blockKeyCode) return;
	clickO.keys[e.keyCode] = false;
	
	if(myCameraOrbit.activeCam.userData.isCam2D)
	{
		if(e.keyCode == 16){ fname_s_0316(); } 
	}
	
});







function fname_s_0225(cdm)
{
	if(!cdm) return;	
	if(infProject.settings.shader.fxaaPass == undefined) return;
	
	if(cdm.switch)
	{
		var visible = (fxaaPass.enabled) ? false : true;
	}

	if(cdm.visible !== undefined)
	{
		var visible = cdm.visible;
	}		
	
	fxaaPass.enabled = visible;		


	renderCamera();
}



function fname_s_0226(cdm)
{  
	if(!cdm) return;
	
	if(cdm.switch)
	{
		var type = infProject.settings.light.type;
		type = (type == 'global') ? 'lamp' : 'global';
		infProject.settings.light.type = type;
	}
	
	if(cdm.visible !== undefined)
	{
		var type = (cdm.visible) ? 'global' : 'lamp';
		infProject.settings.light.type = type;
	}	
	
	if(infProject.settings.light.type == 'global')
	{
		var global_intensity = 0.93;
		var global_visible = true;
		var lamp_visible = false;
	}
	else
	{
		var global_intensity = 0.5;
		var global_visible = false;
		var lamp_visible = true;			
	}
	
	for ( var i = 0; i < infProject.scene.light.lamp.length; i++ )
	{
		infProject.scene.light.lamp[i].visible = lamp_visible;
	}
	
	for ( var i = 0; i < infProject.scene.light.global.point.length; i++ )
	{
		infProject.scene.light.global.point[i].visible = global_visible;
	}		
	
	infProject.scene.light.global.ambient.intensity = global_intensity;
	
	renderCamera();
}






function fname_s_0227(cdm)
{	
	var value = cdm.value; 
	
	
	if((/,/i).test( value )) { value = value.replace(",", "."); }
	
	if(!fname_s_06(value)) return null; 
	
	value = Number(value);
	
	if(cdm.abs)
	{
		value = Math.abs(value);
	}
	
	if(cdm.int)
	{ 
		value = Math.round(value);  
	}	
	
	if(cdm.unit)
	{
		if(cdm.unit == 0.01) { value /= 100; } 
		else if(cdm.unit == 0.001) { value /= 1000; } 
	}		

	if(cdm.limit)
	{
		if(cdm.limit.max < value) { value = cdm.limit.max; }
		if(cdm.limit.min > value) { value = cdm.limit.min; }
	}

	return {num: value};	
}



function fname_s_0228(functionToCheck)  
{
    var getType = {};
	
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]' || functionToCheck && getType.toString.call(functionToCheck) === '[object AsyncFunction]';
}



let docReady = false;
let tabs;
let tabLevel;
let divLevelVisible;
let tabPlan;
let tabObject;
let switchCamera;

let myMouse;
let myCameraOrbit;
let myCameraMoveKey;
let myComposerRenderer;
let myLevels;
let myToolPG;
let startProject;



document.addEventListener("DOMContentLoaded", ()=>
{
	docReady = true; 	
	
	myMouse = new MyMouse({container: containerF, scene});
	myCameraOrbit = new MyCameraOrbit({container: containerF, renderer, scene});
	myCameraMoveKey = new MyCameraMoveKey();
	
	myComposerRenderer = new MyComposerRenderer({container: containerF, renderer, scene, camera: myCameraOrbit.activeCam});
	
	myLevels = new MyLevels();

	tabs = new Tabs();
	tabLevel = new TabLevel();
	divLevelVisible = new DivLevelVisible({showAllLevel: true, wallTransparent: false});
	divLevelVisible.init();
	tabPlan = new TabPlan();
	tabObject = new TabObject();
	switchCamera = new SwitchCamera();
	
	
	myToolPG = new MyToolPG();
	
	startProject = new StartProject();
	startProject.init();

	fname_s_0190();
	renderCamera();	
});










$(document).ready(function(){

$('[data-action="top_panel_1"]').on('mousedown wheel DOMMouseScroll mousewheel mousemove touchstart touchend touchmove', function (e) { e.stopPropagation(); });
$('[ui_1=""]').on('mousedown wheel DOMMouseScroll mousewheel mousemove touchstart touchend touchmove', function (e) { e.stopPropagation(); });
		
$('[data-action="top_panel_1"]').mousedown(function () { fname_s_active_int(); });
$('[data-action="left_panel_1"]').mousedown(function () { fname_s_active_int(); });



$('[nameId="sw_dw_1"]').mousedown(function () { fname_s_061({obj: clickO.last_obj, type: 'r-l'}); }); 
$('[nameId="sw_dw_2"]').mousedown(function () { fname_s_061({obj: clickO.last_obj, type: 't-b'}); });	

$('[nameId="obj_rotate_reset"]').mousedown(function () { fname_s_0247(); });	
$('[nameId="button_copy_obj"]').mousedown(function () { fname_s_0246(); });


$('[data-action="wall"]').mousedown(function () { fname_s_active_int({button:'point_1'}); });
$('[data-action="create_gate_1"]').mousedown(function () { fname_s_active_int({button:'create_gate_1'}); });
$('[nameId="screenshot"]').mousedown(function () { fname_s_0333(); fname_s_0330(); }); 				




$('input').on('focus', function () { fname_s_0229({el: $(this), act: 'down'}); });
$('input').on('change', function () { fname_s_0229({el: $(this), act: 'up'}); });
$('input').on('keyup', function () {  });

function fname_s_0229(cdm)
{
	var el = cdm.el;
	
	infProject.activeInput = el.data('action');
	if(el.data('action') == undefined) { infProject.activeInput = el.data('input'); }
	if(infProject.activeInput == undefined) { infProject.activeInput = el.attr('nameId'); }
	
	infProject.activeInput_2 = {el: el, act: cdm.act};
	
	if(cdm.act == 'down' || cdm.act == 'up')
	{
		
	}
	
	if(cdm.act == 'up')
	{
		fname_s_0230();
	}
		
}


function fname_s_0230(cdm)
{
	if(infProject.activeInput == 'rp_wall_width_1')
	{
		fname_s_026({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_door_length_1')
	{
		fname_s_026({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_door_height_1')
	{
		fname_s_026({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_wind_length_1')
	{
		fname_s_026({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_wind_height_1')
	{
		fname_s_026({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_wind_above_floor_1')
	{
		fname_s_026({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_gate_length_1')
	{
		fname_s_026({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_gate_height_1')
	{
		fname_s_026({ el: infProject.activeInput_2.el });
	}	
}


$('input').blur(function () 
{ 
	infProject.activeInput = '';
	infProject.activeInput_2 = null;
});	


$('[nameId="rp_button_wall_texture_1"]').mousedown(function () 
{ 
	clickO.click.side_wall = 1; 
	fname_s_025({type: 2});
});

$('[nameId="rp_button_wall_texture_2"]').mousedown(function () 
{ 
	clickO.click.side_wall = 2; 
	fname_s_025({type: 2});
});



$('[nameId="but_back_catalog_texture_1"]').mousedown(function () 
{ 
	fname_s_025({type: 1});
});



$('[add_texture]').mousedown(function () 
{ 
	var inf = {obj: clickO.last_obj, material: {img: this.attributes.add_texture.value, index: clickO.click.side_wall}, ui: true};
	if(myCameraOrbit.activeCam.userData.isCam3D)
	{ 
		if(clickO.index) 
		{ 
			inf.obj = clickO.last_obj;
			inf.material.index = clickO.index; 
		};
	}
	
	fname_s_0214(inf); 
}); 




$('[data-action="modal_window"]').mousedown(function (e) { e.stopPropagation(); });		


$('[data-action="modal"]').mousedown(function () 
{			
	fname_s_active_int(); 
	$('[data-action="modal"]').css({"display":"none"}); 
});

			
$('[data-action="modal_window_close"]').mousedown(function () 
{  
	$('[data-action="modal"]').css({"display":"none"}); 
});



$('[data-action="modal_1"]').mousedown(function () 
{	 
	$('[data-action="modal_1"]').css({"display":"none"}); 
});

			
$('[data-action="modal_window_close_1"]').mousedown(function () 
{  
	$('[data-action="modal_1"]').css({"display":"none"}); 
});


$('[nameId="butt_main_sett"]').mousedown(function () { $('[nameId="window_main_sett"]').css({"display":"block"}); });

$('[nameId="button_close_main_sett"]').mousedown(function () 
{  
	$('[nameId="window_main_sett"]').css({"display":"none"}); 
});

$('[nameId="checkbox_light_global"]').change(function() { fname_s_0226({visible: this.checked}); });
$('[nameId="checkbox_fxaaPass"]').change(function() { fname_s_0225({visible: this.checked}); });



$('[nameId="background_main_menu"]').mousedown(function () 
{	 
	$('[nameId="background_main_menu"]').css({"display":"none"}); 
});

			
$('[nameId="button_close_main_menu"]').mousedown(function () 
{  
	$('[nameId="background_main_menu"]').css({"display":"none"}); 
});

$('[nameId="window_main_menu"]').mousedown(function (e) { e.stopPropagation(); });
	






$('[nameId="button_show_panel_catalog"]').mousedown(function () { fname_s_0231({show: true}); });
$('[nameId="button_catalog_close"]').mousedown(function () { fname_s_0231({show: false}); });











});




function fname_s_0231(cdm)
{
	var show = cdm.show;
	
	var block = $('[nameId="panel_catalog_1"]');
	var button = $('[nameId="button_show_panel_catalog"]');
	
	if(show) { block.show(); button.hide(); }
	else { block.hide(); button.show(); }
}






function fname_s_0232()
{
	var pivot = new THREE.Object3D();
	pivot.userData.pivot = {};
	pivot.userData.pivot.active = { axis: '', startPos: new THREE.Vector3(), dir: new THREE.Vector3(), qt: new THREE.Quaternion() };
	pivot.userData.pivot.obj = null;
	pivot.userData.pivot.axs = [];
	
	var param = [];
	param[0] = {axis: 'x', pos: new THREE.Vector3(0.6, 0.0, 0.0), rot: new THREE.Vector3(0, 0, 0)};
	param[1] = {axis: 'x', pos: new THREE.Vector3(-0.6, 0.0, 0.0), rot: new THREE.Vector3(0, Math.PI, 0)};
	param[2] = {axis: 'z', pos: new THREE.Vector3(0.0, 0.0, -0.6), rot: new THREE.Vector3(0, Math.PI/2, 0)};
	param[3] = {axis: 'z', pos: new THREE.Vector3(0.0, 0.0, 0.6), rot: new THREE.Vector3(0, -Math.PI/2, 0)};
	
	var geometry = fname_s_0198({x: 0.35, y: 0.01, z: 0.35});
	var material = new THREE.MeshPhongMaterial({ color: 0xcccccc, transparent: true, opacity: 1, depthTest: false });
	
	for ( var i = 0; i < param.length; i++ )
	{
		var obj = new THREE.Mesh( geometry, material );
		obj.userData.tag = 'pivot';
		obj.userData.axis = param[i].axis;	
		obj.renderOrder = 2;
		
		if(param[i].pos) obj.position.set( param[i].pos.x, param[i].pos.y, param[i].pos.z );
		if(param[i].rot) obj.rotation.set( param[i].rot.x, param[i].rot.y, param[i].rot.z );
		
		param[i].o = obj;
		
		pivot.add( obj );
	}
	
	var y = fname_s_0233({axis: 'y', pos: new THREE.Vector3(0,0.1,0), rot: new THREE.Vector3(0,0,0), color: 0xcccccc});
	pivot.add( y );
	
	pivot.visible = false;
	scene.add( pivot );
	
	
	pivot.userData.pivot.axs.x = param[0].o;
	pivot.userData.pivot.axs.y = y;
	pivot.userData.pivot.axs.z = param[2].o;	
		
	
	
	return pivot;
}





function fname_s_0233(cdm)
{	
	var n = 0;
	var v = [];
	var circle = infProject.geometry.circle;
	
	for ( var i = 0; i < circle.length; i++ )
	{
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.06 );
		v[n].y = 0;		
		n++;		
		
		v[n] = new THREE.Vector3();
		v[n].y = 0;
		n++;
		
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.003 );
		v[n].y = 0.25;
		n++;	
		
		v[n] = new THREE.Vector3();
		v[n].y = 0.25;
		n++;		
	}	

	
	var obj = new THREE.Mesh( fname_s_0201(v), new THREE.MeshPhongMaterial( { color : cdm.color, depthTest: false, transparent: true, lightMap: lightMap_1 } ) ); 
	obj.userData.tag = 'pivot';
	obj.userData.axis = cdm.axis;
	obj.renderOrder = 2;
	obj.position.copy(cdm.pos);
	obj.rotation.set(cdm.rot.x, cdm.rot.y, cdm.rot.z);
	
	scene.add( obj );
	
	return obj;
}




function fname_s_0234( intersect )
{
	var obj = clickO.move = intersect.object;  
	
	var pivot = infProject.tools.pivot;
	
	var pos = pivot.position.clone();
	
	pivot.userData.pivot.active.startPos = pos;
	
	clickO.offset = new THREE.Vector3().subVectors( pos, intersect.point );
	
	var axis = obj.userData.axis;
	pivot.userData.pivot.active.axis = axis;	
	pivot.updateMatrixWorld();	
	
	
	if(axis == 'x')
	{ 
		var axisO = pivot.userData.pivot.axs.x; 	
	}
	else if(axis == 'z')
	{ 
		var axisO = pivot.userData.pivot.axs.z; 	
	}
	else if(axis == 'y')
	{ 
		var axisO = pivot.userData.pivot.axs.y;	
	}	
		
	
	if(axis == 'xz' || axis == 'center')
	{ 
		planeMath.rotation.set( Math.PI/2, 0, 0 ); 
	}		 
	else
	{
		axisO.updateMatrixWorld();
		pivot.userData.pivot.active.dir = new THREE.Vector3().subVectors( pivot.position, axisO.getWorldPosition(new THREE.Vector3()) ).normalize();	
		pivot.userData.pivot.active.qt = fname_s_0222( pivot.userData.pivot.active.dir );	
		
		planeMath.quaternion.copy( pivot.userData.pivot.active.qt ); 
		planeMath.quaternion.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/2, 0, 0)));
	}
	
	planeMath.position.copy( intersect.point );
	
	if(pivot.userData.pivot.obj.userData.tag === 'obj') fname_s_0240({obj: pivot.userData.pivot.obj});
} 





function fname_s_0235( event )
{	
	var intersects = fname_s_0213( event, planeMath, 'one' ); 
	
	if(intersects.length == 0) return;
	
	if(!clickO.actMove)
	{
		clickO.actMove = true;
	}		
	
	var pivot = infProject.tools.pivot;
	var gizmo = infProject.tools.gizmo;
	
	var obj = pivot.userData.pivot.obj;
	var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, clickO.offset );

	if(pivot.userData.pivot.active.axis == 'xz')
	{
		
	}		
	else
	{
		var subV = new THREE.Vector3().subVectors( pos, pivot.userData.pivot.active.startPos );
		var locD = fname_s_0220(subV, pivot.userData.pivot.active.qt);						
		
		var v1 = new THREE.Vector3().addScaledVector( pivot.userData.pivot.active.dir, locD.z );
		pos = new THREE.Vector3().addVectors( pivot.userData.pivot.active.startPos, v1 );			
	}
	
	
	var pos2 = new THREE.Vector3().subVectors( pos, pivot.position );
	pivot.position.add( pos2 );
	gizmo.position.add( pos2 );
	
	obj.position.add( pos2 );
	
	fname_s_0236();
}




function fname_s_0236()
{
	var pivot = infProject.tools.pivot;
	var gizmo = infProject.tools.gizmo;
	
	var pVis = false;
	
	if(gizmo.visible) { pVis = true; }
	if(!pVis) { return; }
	
	var obj = null;
	
	if(pVis) obj = pivot.userData.pivot.obj;
	if(!obj) return;
	
	if(myCameraOrbit.activeCam.userData.isCam2D)
	{
		const cam2D = myCameraOrbit.activeCam;
		var scale = 1/cam2D.zoom+0.0;	
		
		pivot.scale.set( scale,scale,scale );
		gizmo.scale.set( scale,scale,scale );
	}
	
	if(myCameraOrbit.activeCam.userData.isCam3D)
	{
		const cam3D = myCameraOrbit.activeCam;
		var dist = cam3D.position.distanceTo(obj.position); 					
		var scale = dist/6;	
		
		pivot.scale.set( scale,scale,scale );
		gizmo.scale.set( scale,scale,scale );		
	}
}




function fname_s_0237(cdm)
{	
	if(clickO.actMove && infProject.tools.pivot.userData.pivot.obj.userData.tag === 'obj')
	{	
		fname_s_0323({obj: infProject.tools.pivot.userData.pivot.obj, type: 'move'});
	}

	if(clickO.actMove && infProject.tools.pivot.userData.pivot.obj.userData.tag === 'roof')
	{
		clRoof.updateCgsRoof();
	}
}






function fname_s_0238(cdm)
{
	var obj = cdm.obj;
	var rayhit = cdm.rayhit;
	
	if(fname_s_0318( rayhit )) { return; }
	
	obj.updateMatrixWorld();
	var pos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );			 
	
	
	
	if(1==2)	
	{
		var qt = new THREE.Quaternion();
	}
	else		
	{					
		var qt = obj.quaternion.clone();	 		
	}		
	
 
	
	if(infProject.tools.pivot.userData.pivot.obj == obj)
	{
		clickO.move = obj;		
		clickO.offset = new THREE.Vector3().subVectors( obj.position, rayhit.point );
	
		planeMath.position.copy( rayhit.point );
		planeMath.rotation.set( Math.PI/2, 0, 0 );
	}
	
	var pivot = infProject.tools.pivot;	
	pivot.visible = true;	
	pivot.userData.pivot.obj = obj;
	pivot.position.copy(pos);
	pivot.quaternion.copy(qt);
	
	if(myCameraOrbit.activeCam.userData.isCam2D)
	{
		
		pivot.visible = false;
	}
	else
	{
		pivot.userData.pivot.axs.y.visible = true;
	}	
	
	var gizmo = infProject.tools.gizmo;					
	gizmo.position.copy( pos );		
	gizmo.visible = true;
	gizmo.userData.gizmo.obj = obj;
	gizmo.quaternion.copy( qt );			
	
	fname_s_0236();
	
	if(myCameraOrbit.activeCam.userData.isCam2D) { myComposerRenderer.outlineRemoveObj(); }
	if(myCameraOrbit.activeCam.userData.isCam3D) { myComposerRenderer.outlineAddObj({arr: [obj]}); }
	
	tabObject.activeObjRightPanelUI_1({obj: obj});	

	fname_s_069({obj: obj, boxCircle: true, getObjRoom: true, resetPos: true});
	
	
	fname_s_0240({obj: obj});
	
	
	if(obj.userData.obj3D.newO)
	{
		delete obj.userData.obj3D.newO;
		
		fname_s_0325({obj: obj});		
	}
	
	fname_s_0239({obj: obj});
}




function fname_s_0239({obj})
{	
	if(obj.userData.tag === 'roof') 
	{
		clRoof.upInputUI({obj});
		return;
	}
	
	obj.geometry.computeBoundingBox();
	
	var minX = obj.geometry.boundingBox.min.x;
	var maxX = obj.geometry.boundingBox.max.x;
	var minY = obj.geometry.boundingBox.min.y;
	var maxY = obj.geometry.boundingBox.max.y;	
	var minZ = obj.geometry.boundingBox.min.z;
	var maxZ = obj.geometry.boundingBox.max.z;

	var x = Math.abs( (maxX - minX) * obj.scale.x );
	var y = Math.abs( (maxY - minY) * obj.scale.y );
	var z = Math.abs( (maxZ - minZ) * obj.scale.z );			
	
	$('[nameId="size-obj-length"]').val(Math.round(x * 100) / 100);
	$('[nameId="size-obj-height"]').val(Math.round(y * 100) / 100);
	$('[nameId="size-obj-width"]').val(Math.round(z * 100) / 100);	
}





function fname_s_0240(cdm)
{
	var obj = cdm.obj;
	
	obj.userData.obj3D.ur.pos = obj.position.clone();
	obj.userData.obj3D.ur.q = obj.quaternion.clone(); 	
}





function fname_s_0241( event )
{	
	var intersects = fname_s_0213( event, planeMath, 'one' ); 
	
	if(intersects.length == 0) return;
	
	var obj = clickO.move;
	
	if(!clickO.actMove)
	{
		clickO.actMove = true;
	}		
	
	var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, clickO.offset );	
	
	var pos2 = new THREE.Vector3().subVectors( pos, obj.position );
	obj.position.add( pos2 );

	infProject.tools.pivot.position.add( pos2 );
	infProject.tools.gizmo.position.add( pos2 );

	fname_s_0236();
	
	fname_s_069({obj: obj, boxCircle: true, setPos: { pos2D: new THREE.Vector2(event.clientX, event.clientY), pos3D: intersects[ 0 ].point }});
}



function fname_s_0242(obj)
{ 
	if(clickO.actMove)
	{		 

		fname_s_0323({obj: obj, type: 'move'}); 
		
		if(myCameraOrbit.activeCam.userData.isCam2D)
		{	
			const cam2D = myCameraOrbit.activeCam;
			
			
			if(1==1)
			{
				var circle = infProject.svg.furn.boxCircle.elem;	

				for ( var i = 0; i < circle.length; i++ )
				{
					var x = ( ( circle[i].cx.baseVal.value - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
					var y = - ( ( circle[i].cy.baseVal.value - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
					var A = new THREE.Vector3(x, y, -1);
					A.unproject(cam2D);
					
					circle[i].userData.svg.circle.pos = A;
					
					
				}
				
				
				{	
					var arrP = [];
					var box1 = infProject.svg.furn.box1; 			
						
					for ( var i = 0; i < box1.userData.svg.path.arrS.length; i++ )
					{
						var arrS = box1.userData.svg.path.arrS[i];
						
						var x = ( ( arrS.x - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
						var y = - ( ( arrS.y - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
						var A = new THREE.Vector3(x, y, -1);
						A.unproject(cam2D);

						arrP[arrP.length] = A;
					}	
							
					arrP[arrP.length] = arrP[0];
					
					box1.userData.svg.path.arrP = arrP;
					
				}
				
				
				{	
					var arrP = [];
					var box2 = infProject.svg.furn.box2; 
					
					for ( var i = 0; i < box2.userData.svg.path.arrS.length; i++ )
					{
						var arrS = box2.userData.svg.path.arrS[i];
						
						var x = ( ( arrS.x - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
						var y = - ( ( arrS.y - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
						var A = new THREE.Vector3(x, y, -1);
						A.unproject(cam2D);

						arrP[arrP.length] = A;
					}	
							
					arrP[arrP.length] = arrP[0];
					
					box2.userData.svg.path.arrP = arrP;
					
				}


				
				fname_s_0304({el: infProject.svg.furn.offset.elem});
				fname_s_0304({el: infProject.svg.furn.size.elem});
			}
		}
	}	
}


	


function fname_s_0243(cdm)
{ 
	if(!cdm) { cdm = {}; }
	
	var arr = [];
	
	if(cdm.obj && cdm.obj.userData.tag === 'roof' || clickO.last_obj && clickO.last_obj.userData.tag === 'roof')
	{
		let o2 = (cdm.obj) ? cdm.obj : clickO.last_obj;
		clRoof.deleteRoof(o2);
		return;
	}
	
	if(cdm.obj)
	{
		if(cdm.obj.userData.tag == 'obj') { arr[0] = cdm.obj; }
	}
	else
	{
		if(clickO.selectBox.arr.length > 0)
		{
			for(var i = 0; i < clickO.selectBox.arr.length; i++)
			{
				if(clickO.selectBox.arr[i].userData.tag != 'obj') continue;
				
				arr[arr.length] = clickO.selectBox.arr[i];
			}
		}
		else
		{
			if(clickO.last_obj.userData.tag == 'obj') { arr[0] = clickO.last_obj; }
		}
	}	
	
	if(arr.length == 0) return;	
		
	
	var undoRedo = true;
	if(cdm.undoRedo !== undefined) { undoRedo = cdm.undoRedo; }	
	if(undoRedo) { fname_s_0324({arr: arr}); }	
	
	clickO = resetPop.clickO(); 
	
	fname_s_0244(arr[0]);
	
	for(var i = 0; i < arr.length; i++)
	{	
		if(arr[i].userData.cubeCam)
		{
			fname_s_0140({arr : infProject.scene.array.cubeCam, o : arr[i].userData.cubeCam});
			fname_s_0176( arr[i].userData.cubeCam );
			scene.remove( arr[i].userData.cubeCam );
		}
		fname_s_0140({arr : infProject.scene.array.obj, o : arr[i]});		
		fname_s_0175({obj: arr[i]}); 
		scene.remove(arr[i]); 
	}
	
	myComposerRenderer.outlineRemoveObj();
	
	renderCamera();
}




function fname_s_0244(obj)
{
	if(!obj) return;
	if(!obj.userData.tag) return;	
	
	
	var pivot = infProject.tools.pivot;
	var gizmo = infProject.tools.gizmo;
				
	
	if(clickO.rayhit)
	{
		if(pivot.userData.pivot.obj == clickO.rayhit.object) return;		
		if(clickO.rayhit.object.userData.tag == 'pivot') return;
		
		if(gizmo.userData.gizmo.obj == clickO.rayhit.object) return;		
		if(clickO.rayhit.object.userData.tag == 'gizmo') return;
	}	
	
	
	
	pivot.visible = false;
	gizmo.visible = false;
	
	pivot.userData.pivot.obj = null;
	gizmo.userData.gizmo.obj = null;

	fname_s_0307(infProject.svg.furn.boxCircle.elem);
	fname_s_0307([infProject.svg.furn.box1]);
	fname_s_0307([infProject.svg.furn.box2]);
	fname_s_0307(infProject.svg.furn.size.elem);
	fname_s_0307(infProject.svg.furn.offset.elem);
	
	fname_s_0310(infProject.html.furn.size);
	fname_s_0310(infProject.html.furn.offset);
	
	
	clickO.last_obj = null;
	
	tabObject.activeObjRightPanelUI_1(); 	
	
	myComposerRenderer.outlineRemoveObj();
}



 




function fname_s_0245(cdm)
{
	var obj = null;
	var pivot = infProject.tools.pivot;
	var gizmo = infProject.tools.gizmo;	
	
	if(infProject.settings.active.pg == 'pivot'){ obj = pivot.userData.pivot.obj; }	
	if(infProject.settings.active.pg == 'gizmo'){ obj = gizmo.userData.gizmo.obj; }
	
	return obj;	
}






function fname_s_0246(cdm) 
{
	var obj = fname_s_0245();
	
	if(!obj) return;	
	
	if(obj.userData.tag == 'roof') 
	{
		clRoof.copyRoof();
		return;
	}
		
	var cubeCam = null;
	if(obj.userData.cubeCam) 
	{ 
		cubeCam = obj.userData.cubeCam;
		obj.userData.cubeCam = null;
	}
	
	var clone = obj.clone();
	
	if(cubeCam)
	{
		obj.userData.cubeCam = cubeCam;
	}

	clone.userData.id = countId; countId++;
	
	infProject.scene.array.obj[infProject.scene.array.obj.length] = clone; 
	scene.add( clone );	
	 
	
	
	
	
}




function fname_s_0247(cdm)
{
	var obj = fname_s_0245();
	
	if(!obj) return;


	var obj_1 = obj;		
	var diff_2 = obj_1.quaternion.clone().inverse();					
	var arr_2 = [obj_1];
	
	
	
	for(var i = 0; i < arr_2.length; i++)
	{
		arr_2[i].quaternion.premultiply(diff_2);		
		arr_2[i].updateMatrixWorld();		
	}
	
	
	var centerObj = obj_1.position.clone();
	

	
	for(var i = 0; i < arr_2.length; i++)
	{
		arr_2[i].position.sub(centerObj);
		arr_2[i].position.applyQuaternion(diff_2); 	
		arr_2[i].position.add(centerObj);
	}
	

	
	if(infProject.settings.active.pg == 'pivot'){ var tools = infProject.tools.pivot; }	
	if(infProject.settings.active.pg == 'gizmo'){ var tools = infProject.tools.gizmo; }	
}






function fname_s_0248()
{
	var n = 0;
	var v = [];
	var circle = infProject.geometry.circle;
	
	for ( var i = 0; i < circle.length; i++ )
	{
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 1 );
		v[n].y = 0;		
		n++;		
		
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.9 );
		v[n].y = 0;
		n++;
		
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.99 );
		v[n].y = 0.01;
		n++;	
		
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.9 );
		v[n].y = 0.01;
		n++;		
	}	

	var gizmo = new THREE.Object3D();
	gizmo.userData.gizmo = {};
	gizmo.userData.gizmo.obj = null;
	gizmo.userData.gizmo.active = { axis: '', startPos: new THREE.Vector3(), rotY: 0 };
	
	var material = new THREE.MeshPhongMaterial({ color: 0xcccccc, transparent: true, opacity: 1, depthTest: false });
	var cdm = {axis: 'x', pos: new THREE.Vector3(0,0.0,0), rot: new THREE.Vector3(0,0,0), color: 0x00ff00};
	
	var obj = new THREE.Mesh( fname_s_0201(v), material ); 
	obj.userData.tag = 'gizmo';
	obj.userData.axis = cdm.axis;
	obj.renderOrder = 2;
	obj.position.copy(cdm.pos);
	obj.rotation.set(cdm.rot.x, cdm.rot.y, cdm.rot.z);		
	gizmo.add( obj );
	
	gizmo.visible = false;
	scene.add( gizmo );
	
	return gizmo;
}	




function fname_s_0249( intersect )
{			
	var gizmo = infProject.tools.gizmo;
	
	clickO.move = intersect.object; 	

	var obj = gizmo.userData.gizmo.obj;			
	var axis = intersect.object.userData.axis;
	gizmo.userData.gizmo.active.axis = axis;
	
	
	
	obj.updateMatrixWorld();
	gizmo.userData.gizmo.active.startPos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );			

	
	if(axis == 'y')
	{
		var dr = new THREE.Vector3( 0, 1, 0 );
		var rotY = -Math.PI/2;
	}	
	else if(axis == 'z')
	{	
		var dr = new THREE.Vector3( 0, 1, 0 );
		var rotY = Math.PI;
	}
	else if(axis == 'x')
	{
		var dr = new THREE.Vector3( 1, 0, 0 );
		var rotY = Math.PI/2;
	}

	
	planeMath.position.copy( gizmo.position );		
	
	if(myCameraOrbit.activeCam.userData.isCam2D)
	{
		planeMath.rotation.set(Math.PI/2, 0, 0);
	}
	else
	{
		fname_s_0250(obj, dr, rotY, false);
	}
	
	
	function fname_s_0250(obj, dr, rotY, global)
	{
		if(global)	
		{
			planeMath.quaternion.copy( new THREE.Quaternion().setFromAxisAngle( dr, rotY ) );
		}
		else		
		{
			var quaternion = new THREE.Quaternion().setFromAxisAngle( dr, rotY );							
			var q2 = obj.getWorldQuaternion(new THREE.Quaternion()).clone().multiply( quaternion );			
			planeMath.quaternion.copy( q2 );																		
		}
	}

	
	planeMath.updateMatrixWorld();
	var dir = planeMath.worldToLocal( intersect.point.clone() );	
	gizmo.userData.gizmo.active.rotY = Math.atan2(dir.x, dir.y);

	if(obj.userData.tag === 'obj') fname_s_0240({obj: gizmo.userData.gizmo.obj});
}




function fname_s_0251( event )
{	
	var intersects = fname_s_0213( event, planeMath, 'one' );	 	 
	if(intersects.length == 0) return;
	
	if(!clickO.actMove)
	{
		clickO.actMove = true;
	}	
	
	
	var gizmo = infProject.tools.gizmo;
	var pivot = infProject.tools.pivot;
	
	var obj = gizmo.userData.gizmo.obj;  
	var axis = gizmo.userData.gizmo.active.axis;
	
	if(axis == 'x'){ var dr = new THREE.Vector3( 0, 1, 0 ); }
	else if(axis == 'y'){ var dr = new THREE.Vector3( 1, 0, 0 ); }
	else if(axis == 'z'){ var dr = new THREE.Vector3( 0, 0, 1 ); }
	
	
	
	var dir = planeMath.worldToLocal( intersects[ 0 ].point.clone() );	
	var rotY = Math.atan2(dir.x, dir.y);
	
	
	
	if(myCameraOrbit.activeCam.userData.isCam2D) 
	{ 
		obj.rotateOnWorldAxis(new THREE.Vector3(0,1,0), rotY - gizmo.userData.gizmo.active.rotY);

		fname_s_069({obj: obj, boxCircle: true});
	}
	else 
	{ 		
		fname_s_0252({obj: [obj], dr: dr, rotY: rotY, centerO: obj});		 
	}		
	
	
	function fname_s_0252(cdm)
	{
		var centerO = cdm.centerO;
		var arr = cdm.obj;
		var dr = cdm.dr;
		var rotY = cdm.rotY;		
		
		centerO.updateMatrixWorld();		
		var v1 = centerO.localToWorld( dr.clone() );
		var v2 = centerO.getWorldPosition(new THREE.Vector3());
		var dir = new THREE.Vector3().subVectors(v1, v2).normalize();	

		for(var i = 0; i < arr.length; i++)
		{
			arr[i].position.sub(gizmo.userData.gizmo.active.startPos);
			arr[i].position.applyAxisAngle(dir, rotY - gizmo.userData.gizmo.active.rotY); 
			arr[i].position.add(gizmo.userData.gizmo.active.startPos);				
			
			arr[i].rotateOnWorldAxis(dir, rotY - gizmo.userData.gizmo.active.rotY);								
		}		
	}
	
			
	
	gizmo.userData.gizmo.active.rotY = rotY; 
	
	gizmo.rotation.copy( obj.rotation );
	pivot.rotation.copy( obj.rotation );

	
}



function fname_s_0253(cdm)
{	
	if(clickO.actMove && infProject.tools.gizmo.userData.gizmo.obj.userData.tag === 'obj')
	{	
		fname_s_0323({obj: infProject.tools.gizmo.userData.gizmo.obj, type: 'move'});
	}

	if(clickO.actMove && infProject.tools.pivot.userData.pivot.obj.userData.tag === 'roof')
	{
		clRoof.updateCgsRoof();
	}	
}







function fname_s_0254()
{
	var arr = [];	 	
	
	arr[0] =
	{
		url : 'img/load/floor_1.jpg', 
	};
	
	arr[1] =
	{
		url : 'img/load/w1.jpg', 
	};

	arr[2] =
	{
		url : 'img/load/kirpich.jpg', 
	};

	arr[3] =
	{
		url : 'img/load/beton.jpg', 
	};	

	arr[4] =
	{
		url : 'img/load/w2.jpg', 
	};

	arr[5] =
	{
		url : 'img/load/f1.jpg', 
	};

	arr[6] =
	{
		url : 'img/load/f2.jpeg', 
	};

	arr[7] =
	{
		url : 'img/load/f3.jpg', 
	};	

	arr[8] = { url : 'img/load/gazbeton.jpg' }
	arr[9] = { url : 'img/load/proflist_1.jpg' }
	arr[10] = { url : 'img/load/roof_1.jpg' }
	
	return arr;
}



async function fname_s_0255({lotid})
{
	let base = infProject.scene.array.base;			
	for(let i = 0; i < base.length; i++)
	{
		if(base[i].id == lotid)
		{
			return base[i];				}
	}

	let inf = {};
	
	if(lotid === 1)
	{
		inf.name = 'куб';
		inf.obj = myObj.crBox();
		inf.planeMath = 0.5;
	}
	
	if(lotid === 2)
	{
		inf.name = 'сфера';
		inf.obj = myObj.crSphere();
		inf.planeMath = 0.5;
	}

	if(lotid === 3)
	{
		inf.name = 'цилиндр';
		inf.obj = myObj.crCylinder();
		inf.planeMath = 0.5;
	}


	if(lotid === 5)
	{
		inf.name = 'окно глухое';
		inf.obj = myWindows.createWind({id: 1});
		inf.planeMath = 0.0;
	}

	if(lotid === 6)
	{
		inf.name = 'окно двухстворчатое';
		inf.obj = myWindows.createWind({id: 2});
		inf.planeMath = 0.0;
	}

	if(lotid === 7)
	{
		inf.name = 'окно трехстворчатое';
		inf.obj = myWindows.createWind({id: 3});
		inf.planeMath = 0.0;
	}	

	if(lotid === 8)
	{
		inf.name = 'окно треугольное';
		inf.obj = myWindows.createWind({id: 4});
		inf.planeMath = 0.0;
	}	

	if(lotid === 9)
	{
		inf.name = 'окно треугольное';
		inf.obj = myWindows.createWind({id: 5});
		inf.planeMath = 0.0;
	}	

	if(lotid === 17)		{
		inf.name = 'крыша односкатная';
		inf.obj = myRoof.initRoof_1();
	}

	if(lotid === 18)		{
		inf.name = 'крыша двухскатная';
		inf.obj = myRoof.initRoof_2();
	}
	
	if(lotid === 19)		{
		inf.id = lotid;					inf.name = 'крыша четырехскатная';
		inf.obj = myRoof.initRoof_3();
		inf.model = null;				inf.preview = null;				inf.planeMath = 0.0;			inf.size = new THREE.Vector3();		}


	
		if(inf.obj !== undefined) 
	{
		fname_s_0257(inf, inf.obj);			return inf;
	}		
	
	let url = infProject.path+'components_2/getObjSql.php?id='+lotid;  	
	let response = await fetch(url, { method: 'GET' });	
	let json = await response.json();
	
	if(!json.error)
	{
		inf = json;
		inf.planeMath = 0.0;
		
		return inf;
	}	
	
	return null;
}




async function fname_s_0256(cdm)
{ 	
	if(!cdm.lotid) return;
	
	var lotid = cdm.lotid;	
	
	var inf = await fname_s_0255({lotid: lotid}); 
	if(!inf) return;			
	if(inf.obj)			{ 
		
	}
	else if(inf.model)			{	
		var obj = new THREE.ObjectLoader().parse( inf.model );			
		fname_s_0257(inf, obj);		
	}	
	
	fname_s_0259(inf, cdm);
}








function fname_s_0257(inf, obj)
{
	obj.geometry.computeBoundingBox();	
	
		obj.traverse(function(child) 
	{
		if(child.isMesh && child.material.visible) 
		{ 
			
		}
	});

		inf.model = null;
	inf.obj = obj;	
	
	infProject.scene.array.base[infProject.scene.array.base.length] = inf;
}




function fname_s_0258(cdm)
{ 
	var obj = null;	
	
	if(cdm.obj)
	{ 
		obj = cdm.obj; 
	}
	else if(cdm.id)
	{
		var arr = infProject.scene.array.objSpot;
		
		for ( var i = 0; i < arr.length; i++ )
		{
			if(arr[i].userData.objSpot.id == cdm.id)
			{
				obj = arr[i];
				break;
			}
		}
	}
	
	if(!obj) return;
	if(obj.userData.tag != 'obj_spot') return;
	
	fname_s_0140({arr: infProject.scene.array.objSpot, o: obj});
	fname_s_0176(obj);
	scene.remove(obj); 
}



function fname_s_0259(inf, cdm)
{  
	var obj = inf.obj.clone();
	
	var inf = JSON.parse( JSON.stringify( inf ) );	
	inf.obj = obj;
	
	
		if(cdm.wd)
	{  
		fname_s_064(inf, cdm);
		return;
	}
	
	if(cdm.roof)
	{
		clRoof.initRoof(inf, cdm);
		
		return;
	}
	
	var obj = inf.obj;
	
	if(cdm.pos){ obj.position.copy(cdm.pos); }
	else if(inf.planeMath)
	{ 
		obj.position.y = inf.planeMath;
		planeMath.position.y = inf.planeMath; 
		planeMath.rotation.set(-Math.PI/2, 0, 0);
		planeMath.updateMatrixWorld(); 
	}
	
		if(cdm.q){ obj.quaternion.set(cdm.q.x, cdm.q.y, cdm.q.z, cdm.q.w); }
	

	if(cdm.id){ obj.userData.id = cdm.id; }
	else { obj.userData.id = countId; countId++; }
	
	obj.userData.tag = 'obj';
	obj.userData.obj3D = {};
	obj.userData.obj3D.lotid = cdm.lotid;
	obj.userData.obj3D.nameRus = (inf.name) ? inf.name : 'объект';
	obj.userData.obj3D.typeGroup = '';
	obj.userData.obj3D.helper = null;
	
	obj.userData.material = {};
	obj.userData.material.img = null;
	
	obj.userData.obj3D.ur = {};
	obj.userData.obj3D.ur.pos = new THREE.Vector3();
	obj.userData.obj3D.ur.q = new THREE.Quaternion();
	
	if(!cdm.id){ obj.userData.obj3D.newO = true; }
	
		
	
		if(1==1)
	{
		obj.geometry.computeBoundingBox();
		var x = obj.geometry.boundingBox.max.x - obj.geometry.boundingBox.min.x;
		var y = obj.geometry.boundingBox.max.y - obj.geometry.boundingBox.min.y;
		var z = obj.geometry.boundingBox.max.z - obj.geometry.boundingBox.min.z;	
		obj.userData.obj3D.box = new THREE.Vector3(x, y, z);
	}

	
	
	if(cdm.scale)
	{ 
		obj.scale.set(cdm.scale.x, cdm.scale.y, cdm.scale.z);
		fname_s_0260({obj, force: true});
	}
	
	if(cdm.material && cdm.material.img)
	{
		fname_s_0214({obj: obj.children[0], material: { img: cdm.material.img } });
	}
	
	obj.material.visible = false;

	
			
	infProject.scene.array.obj[infProject.scene.array.obj.length] = obj;

	scene.add( obj );		
	
	if(cdm.cursor) 		{ 
		fname_s_0258({obj: clickO.move});
		clickO.move = obj; 
	} 
	else		{
		fname_s_0258({id: obj.userData.id});
	}
	
	renderCamera();
}


function fname_s_0260({obj, force = false})
{	
	if(obj.userData.tag !== 'obj') return;
	
	const scaW = obj.getWorldScale(new THREE.Vector3());
	
	obj.children[0].traverse(function(child) 
	{
		if(child.isMesh && (child.material.map || force)) 
		{ 
			fname_s_0218(child.geometry, obj.scale)				
		}
	});	
}





function fname_s_0261(cdm)
{
	var obj = cdm.obj;
	var arrCubeO = [];
	
	obj.traverse(function(child) 
	{
		if(child.isMesh && child.material) 
		{ 
			if(new RegExp('mirror','i').test( child.material.name )) 
			{  								
				child.material.userData.type = 'mirror';			
				arrCubeO[arrCubeO.length] = child;		 									
			}
			else if(new RegExp('glass','i').test( child.material.name )) 
			{  								
				child.material.userData.type = 'glass';			
				child.material.opacity = 0.1;	
				child.material.transparent = true;
				child.material.side = THREE.DoubleSide;	
			}			
		}
	});

		
}


function fname_s_0262(cdm)
{
	var obj = cdm.obj;
	var arrO = cdm.arrO;
	
	var cubeCam = new THREE.CubeCamera(0.1, 100, 1024);					
	scene.add(cubeCam); 

	infProject.scene.array.cubeCam[infProject.scene.array.cubeCam.length] = obj;
	obj.userData.cubeCam = cubeCam;

	 
	obj.traverse(function(child) 
	{
		if(child.isMesh) 
		{ 
			if(child.material)
			{
				if(child.material.userData.type == 'mirror')
				{
					child.material.envMap = cubeCam.renderTarget.texture;
																									child.material.metalness = 1;
					child.material.roughness = 0;
									}								
			}				
		}
	});	
	
	fname_s_0263({obj: obj});
}


function fname_s_0263(cdm)
{
	var obj = cdm.obj;
	if(!obj) return;
	if(!obj.userData.cubeCam) return;
	
	var cubeCam = obj.userData.cubeCam;					
				
	obj.updateMatrixWorld();
	obj.geometry.computeBoundingSphere();
	var pos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );	
	cubeCam.position.copy(pos);
	
	obj.visible = false;
	cubeCam.update( renderer, scene );			
	obj.visible = true;
}




function fname_s_0264(cdm)
{

	if(1==1)		{
		var loader = new THREE.GLTFLoader();
		loader.parse( cdm.data, '', function ( obj ) 						
		{ 
						fname_s_0266({obj: obj.scene});
		});
		
	}
	else		{
		var loader = new THREE.FBXLoader();
		var obj = loader.parse( cdm.data );		
		fname_s_0266({obj: obj});			
	}

	$('[nameId="window_main_load_obj"]').css({"display":"none"});
}


function fname_s_0265()
{	
	var url = $('[nameId="input_link_obj_1"]').val(); 
	var url = url.trim();
	
				
	var json = true;
	var glb = false;
	var fbx = false;
	
	if(json)
	{
								
		var loader = new THREE.ObjectLoader();
		loader.load( url, function ( obj ) 						
		{ 			
			var box = fname_s_0267({obj: obj});
			box.add(obj);
			
			fname_s_0266({obj: box})
		});			
	}

	if(glb)		{
		url = infProject.path+'import/glb/wd/okno1x1.glb';
		
		var loader = new THREE.GLTFLoader();
		loader.load( url, function ( obj ) 						
		{ 
						fname_s_0266({obj: obj.scene});
		});			
	}
	
	if(fbx)		{
		var loader = new THREE.FBXLoader();
		loader.load( url, function ( obj ) 						
		{ 			
			fname_s_0266({obj: obj});
		});			
	}

	$('[nameId="window_main_load_obj"]').css({"display":"none"});
}





function fname_s_0266(cdm)
{	
	var obj = cdm.obj;
	
		obj.position.y = 0;	

	planeMath.position.y = 0; 
	planeMath.rotation.set(-Math.PI/2, 0, 0);
	planeMath.updateMatrixWorld(); 	
 
	obj.userData.tag = 'obj';
	obj.userData.obj3D = {};
	obj.userData.obj3D.lotid = 0;
	obj.userData.obj3D.nameRus = 'неизвестный объект';
	obj.userData.obj3D.typeGroup = '';
	obj.userData.obj3D.helper = null;
	
	obj.userData.obj3D.ur = {};
	obj.userData.obj3D.ur.pos = new THREE.Vector3();
	obj.userData.obj3D.ur.q = new THREE.Quaternion();	
			

		
	infProject.scene.array.obj[infProject.scene.array.obj.length] = obj;

	scene.add( obj );	
	
	clickO.move = obj;
	
	renderCamera();	
}








function fname_s_0267(cdm)
{
	var obj = cdm.obj;
	
	if(!obj) return;
	
	var arr = [];
	
	obj.traverse(function(child) 
	{
		if (child instanceof THREE.Mesh)
		{
			if(child.geometry) { arr[arr.length] = child; }
		}
	});	

		
	var v = [];
	
	for ( var i = 0; i < arr.length; i++ )
	{
		arr[i].updateMatrixWorld();
		arr[i].geometry.computeBoundingBox();	
		arr[i].geometry.computeBoundingSphere();

		var bound = arr[i].geometry.boundingBox;
		
		
		v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
		v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );

		v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
		v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );		
	}
	
	var bound = { min : { x : 999999, y : 999999, z : 999999 }, max : { x : -999999, y : -999999, z : -999999 } };
	
	for(var i = 0; i < v.length; i++)
	{
		if(v[i].x < bound.min.x) { bound.min.x = v[i].x; }
		if(v[i].x > bound.max.x) { bound.max.x = v[i].x; }
		if(v[i].y < bound.min.y) { bound.min.y = v[i].y; }
		if(v[i].y > bound.max.y) { bound.max.y = v[i].y; }			
		if(v[i].z < bound.min.z) { bound.min.z = v[i].z; }
		if(v[i].z > bound.max.z) { bound.max.z = v[i].z; }		
	}

	var x = (bound.max.x - bound.min.x);
	var y = (bound.max.y - bound.min.y);
	var z = (bound.max.z - bound.min.z);	
	
	var material = new THREE.MeshStandardMaterial({ color: 0xcccccc, transparent: true, opacity: 0.7, depthTest: false });
	var geometry = fname_s_0197(x, y, z);	
	
	var v = geometry.vertices;
	v[0].x = v[1].x = v[6].x = v[7].x = bound.min.x;
	v[3].x = v[2].x = v[5].x = v[4].x = bound.max.x;

	v[0].y = v[3].y = v[4].y = v[7].y = bound.min.y;
	v[1].y = v[2].y = v[5].y = v[6].y = bound.max.y;
	
	v[0].z = v[1].z = v[2].z = v[3].z = bound.max.z;
	v[4].z = v[5].z = v[6].z = v[7].z = bound.min.z;	
		
	var box = new THREE.Mesh( geometry, material ); 	
		scene.add(box);
	
	box.position.copy(obj.position);
	box.rotation.copy(obj.rotation);
	
	box.updateMatrixWorld();
	box.geometry.computeBoundingBox();	
	box.geometry.computeBoundingSphere();			
	  

	return box;
}









var wallVisible = [];


function fname_s_0268()
{
	wallVisible = [];
	var wall = infProject.scene.array.wall;
	
	for ( var i = 0; i < wall.length; i++ )
	{	
		var room = fname_s_0167( wall[i] );
		if(room.length == 1) 
		{ 	
			var side = 0;
			for ( var i2 = 0; i2 < room[0].w.length; i2++ ) { if(room[0].w[i2] == wall[i]) { side = room[0].s[i2]; break; } }
			
			if(side == 0) { var n1 = 0; var n2 = 1; }
			else { var n1 = 1; var n2 = 0; }
			
			var x1 = wall[i].userData.wall.p[n2].position.z - wall[i].userData.wall.p[n1].position.z;
			var z1 = wall[i].userData.wall.p[n1].position.x - wall[i].userData.wall.p[n2].position.x;	
			var dir = new THREE.Vector3(x1, 0, z1).normalize();									
			wallVisible[wallVisible.length] = { wall : wall[i], normal : dir };  
		}
	}	
}



function fname_s_0269()
{ 	const cam3D = myCameraOrbit.cam3D;
	
	var camPos = cam3D.getWorldDirection(new THREE.Vector3());
	
	camPos = new THREE.Vector3(camPos.x, 0, camPos.z).normalize();
	
	for ( var i = 0; i < wallVisible.length; i++ )
	{
		var wall = wallVisible[ i ].wall;		
		
		var res = camPos.dot( wallVisible[ i ].normal.clone() );
		
						
		if ( res > 0.5 )  
		{ 	
			wall.renderOrder = Math.abs(res);
			wall.userData.wall.show = false;
			fname_s_0271({obj: wall, value: 1 - Math.abs(res)});
			
			for ( var i2 = 0; i2 < wall.userData.wall.arrO.length; i2++ ) 
			{
				wall.userData.wall.arrO[i2].visible = false;				
			}
		}
		else
		{
			wall.renderOrder = 0;
			wall.userData.wall.show = true;
			fname_s_0271({obj: wall, value: 1});
			
			for ( var i2 = 0; i2 < wall.userData.wall.arrO.length; i2++ ) 
			{
				wall.userData.wall.arrO[i2].visible = true;
			}
		}
	}
}


function fname_s_0270()
{		
	for ( var i = 0; i < wallVisible.length; i++ ) 
	{ 
		var wall = wallVisible[i].wall;

		wall.renderOrder = 0;
		wall.userData.wall.show = true;
		fname_s_0271({obj: wall, value: 1});
		
		for ( var i2 = 0; i2 < wall.userData.wall.arrO.length; i2++ ) 
		{
			wall.userData.wall.arrO[i2].visible = true;
		}		
	}
}


function fname_s_0271(cdm)
{
	var obj = cdm.obj;
	
	if(!Array.isArray(obj.material)) { var arrM = [obj.material]; }
	else { var arrM = obj.material; }
	
	for( var i = 0; i < arrM.length; i++ ) 
	{
				if(cdm.value)
		{
			var value = (arrM[i].userData.opacity < cdm.value) ? arrM[i].userData.opacity : cdm.value;
			
			arrM[i].opacity = value;
		}
		
				if(cdm.default)
		{
			arrM[i].opacity = arrM[i].userData.opacity;
		}		
	}
	
}











function fname_s_0272()
{	
	var ruler = [];
	
	var material = new THREE.MeshPhongMaterial( { color : 0x00ff00, transparent: true, opacity: 1, lightMap : lightMap_1 } );
	
	ruler[0] = new THREE.Mesh(infProject.geometry.cone[0], material);
	ruler[0].rotation.set(-Math.PI/2,0,0);
	ruler[0].userData.tag = "substrate_tool";
	ruler[0].userData.subtool = {};
	ruler[0].userData.subtool.num = 1;
	ruler[0].userData.subtool.line = null;
	ruler[0].visible = false;
	scene.add( ruler[0] );
	ruler[0].position.y = 0.01;	

	
	ruler[1] = new THREE.Mesh(infProject.geometry.cone[0], material);
	ruler[1].rotation.set(-Math.PI/2,0,Math.PI);
	ruler[1].userData.tag = "substrate_tool";
	ruler[1].userData.subtool = {};
	ruler[1].userData.subtool.num = 2;
	ruler[1].userData.subtool.line = null;
	ruler[1].visible = false;
	scene.add( ruler[1] );
	ruler[1].position.y = 0.01;
	ruler[1].position.x = 1;	


	
	var line = new THREE.Mesh( fname_s_0197(1, 0.01, 0.01), new THREE.MeshPhongMaterial( { color : 0x00ff00, lightMap : lightMap_1 } ) );
	var v = line.geometry.vertices; 
	v[0].y = v[3].y = v[4].y = v[7].y = -0.005;
	v[1].y = v[2].y = v[5].y = v[6].y = 0.005;			
	line.geometry.verticesNeedUpdate = true;	
	line.visible = false;
	scene.add( line );	
	
	ruler[0].userData.subtool.line = line;
	ruler[1].userData.subtool.line = line;
	 	 
	
	fname_s_0273({ruler: ruler});

	return ruler;
}




function fname_s_0273(cdm)
{
	var ruler = cdm.ruler;
	var line = ruler[0].userData.subtool.line;
	
	var dist = ruler[0].position.distanceTo( ruler[1].position );
	
	var v = line.geometry.vertices;
	v[3].x = v[2].x = v[5].x = v[4].x = dist;
	v[0].x = v[1].x = v[6].x = v[7].x = 0;
	line.geometry.verticesNeedUpdate = true; 
	line.geometry.elementsNeedUpdate = true;
	line.geometry.computeBoundingBox();
	line.geometry.computeBoundingSphere();	
	
	line.position.copy(ruler[0].position);
	
	
	var dir = new THREE.Vector3().subVectors( ruler[0].position, ruler[1].position ).normalize();
	var angleDeg = Math.atan2(dir.x, dir.z);
	line.rotation.set(0, angleDeg + Math.PI / 2, 0);
	
	ruler[0].rotation.set(-Math.PI/2, 0, angleDeg + Math.PI);
	ruler[1].rotation.set(-Math.PI/2, 0, angleDeg);
	
	$('[nameId="input_size_substrate"]').val( Math.round(dist*100)/100 );
}



function fname_s_0274()
{
	var plane = infProject.scene.substrate.active;
	if(!plane) return;
	
	var ruler = infProject.scene.substrate.ruler;
	ruler[0].position.set(plane.position.x + 0.5, plane.position.y + 0.01, plane.position.z);
	ruler[1].position.set(plane.position.x - 0.5, plane.position.y + 0.01, plane.position.z);

	fname_s_0273({ruler: ruler});	
}



function fname_s_0275(cdm)
{
	if(!cdm) { cdm = {}; }
	
	var obj = new THREE.Mesh( fname_s_0197(5, 0.005, 5), new THREE.MeshPhongMaterial( { color : 0xcccccc, transparent: true, opacity: 1, lightMap : lightMap_1 } ) );
	obj.position.y = 0.01;
	obj.rotation.y = 0.0;
	obj.userData.tag = "substrate";
	obj.userData.substrate = { p: [], active: false, img: false };
	obj.visible = false;
	fname_s_0282({obj: obj, img: 'img/UV_Grid_Sm.jpg'}); 
	scene.add( obj );	
	
	if(cdm.pos)
	{
		if(cdm.pos.x) obj.position.x = cdm.pos.x;
		if(cdm.pos.y) obj.position.y = cdm.pos.y;
		if(cdm.pos.z) obj.position.z = cdm.pos.z;
	}
		
	var p = fname_s_0276({plane: obj});
	
	p[0].userData.subpoint = {plane: obj, x: p[1], z: p[3], p2: p[2], dir: new THREE.Vector3(), qt: new THREE.Quaternion()};
	p[1].userData.subpoint = {plane: obj, x: p[0], z: p[2], p2: p[3], dir: new THREE.Vector3(), qt: new THREE.Quaternion()};
	p[2].userData.subpoint = {plane: obj, x: p[3], z: p[1], p2: p[0], dir: new THREE.Vector3(), qt: new THREE.Quaternion()};
	p[3].userData.subpoint = {plane: obj, x: p[2], z: p[0], p2: p[1], dir: new THREE.Vector3(), qt: new THREE.Quaternion()};
	
	obj.userData.substrate.p = p;
	
	var n = infProject.scene.substrate.floor.length;
	infProject.scene.substrate.floor[n] = {plane: obj, point: p};
	infProject.scene.substrate.active = null;  
}





function fname_s_0276(cdm)
{	
	var plane = cdm.plane;
	
	function fname_s_0277()
	{
		var count = 48;
		var circle = [];
		var g = (Math.PI * 2) / count;
		
		for ( var i = 0; i < count; i++ )
		{
			var angle = g * i;
			circle[i] = new THREE.Vector3();
			circle[i].x = Math.sin(angle);
			circle[i].z = Math.cos(angle);
			
		}

		return circle;
	}
	
	var circle = fname_s_0277();
	
	var n = 0;
	var v = [];
	for ( var i = 0; i < circle.length; i++ )
	{
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.1 );
		v[n].y = 0;		
		n++;		
		
		v[n] = new THREE.Vector3();
		v[n].y = 0;
		n++;
		
		v[n] = v[n - 2].clone();
		v[n].y = 0.01;
		n++;	
		
		v[n] = new THREE.Vector3();
		v[n].y = 0.01;
		n++;		
	}	

	var arr = [];
	var geometry = fname_s_0201(v);
	var material = new THREE.MeshLambertMaterial( { color : 0x333333, transparent: true, opacity: 1, lightMap : lightMap_1 } );
	
	
	for ( var i = 0; i < 4; i++ )
	{
		var obj = new THREE.Mesh( geometry, material ); 
		obj.userData.tag = "substrate_point";
		obj.position.set(0, plane.position.y, 0);
		obj.userData.subpoint = {};
		
		obj.visible = false;	
		scene.add( obj );		
		
		arr[i] = obj;
	}		
	
	return arr;
}




function fname_s_0278(cdm)
{
	var plane = cdm.plane;
	var point = plane.userData.substrate.p;
	
	plane.geometry.computeBoundingBox();
	var pos1 = new THREE.Vector3(plane.geometry.boundingBox.min.x, plane.geometry.boundingBox.min.y, plane.geometry.boundingBox.min.z);
	var pos2 = new THREE.Vector3(plane.geometry.boundingBox.min.x, plane.geometry.boundingBox.min.y, plane.geometry.boundingBox.max.z);
	var pos3 = new THREE.Vector3(plane.geometry.boundingBox.max.x, plane.geometry.boundingBox.min.y, plane.geometry.boundingBox.max.z);
	var pos4 = new THREE.Vector3(plane.geometry.boundingBox.max.x, plane.geometry.boundingBox.min.y, plane.geometry.boundingBox.min.z);
	
	plane.updateMatrixWorld();			
	var pos1 = plane.localToWorld( pos1 );
	var pos2 = plane.localToWorld( pos2 );
	var pos3 = plane.localToWorld( pos3 );
	var pos4 = plane.localToWorld( pos4 );
	
	point[0].position.copy(pos1);
	point[1].position.copy(pos2);
	point[2].position.copy(pos3);
	point[3].position.copy(pos4);
	
	point[0].rotation.copy(plane.rotation);
	point[1].rotation.copy(plane.rotation);
	point[2].rotation.copy(plane.rotation);
	point[3].rotation.copy(plane.rotation);	
	
	
	for (var i = 0; i < point.length; i++)
	{
		var dir = new THREE.Vector3().subVectors( point[i].userData.subpoint.p2.position, point[i].position ).normalize(); 
		var qt = fname_s_0222( dir.clone() );
		
		point[i].userData.subpoint.dir = dir;
		point[i].userData.subpoint.qt = qt;
	}		
}






function fname_s_0279(cdm)
{
	if(!infProject.scene.substrate.active) return;
	 	
	var plane = infProject.scene.substrate.active;
	var point = plane.userData.substrate.p;	


	if(cdm.visible !== undefined)
	{
		var visible = cdm.visible;
	}			
	
	for (var i = 0; i < point.length; i++)
	{
		
	}
	
	plane.visible = visible;
	
	fname_s_0280({visible: visible});
	
	renderCamera();
}



function fname_s_0280(cdm)
{
	var visible = cdm.visible;
	var plane = infProject.scene.substrate.active;
	var ruler = infProject.scene.substrate.ruler;
	
	if(visible)	
	{
		if(!plane.userData.substrate.img) { visible = false; }	
	}
	
	ruler[0].visible = visible;
	ruler[1].visible = visible;
	ruler[0].userData.subtool.line.visible = visible;	
}




function fname_s_0281(cdm)
{
	if(!cdm) return;

	var plane = infProject.scene.substrate.active;	
	if(!plane) return;
	
	var value = fname_s_0227({ value: cdm.value, unit: 1 });
	 
	if(!value) 
	{
		$('[nameId="rp_height_plane"]').val( plane.position.y );
		
		return;
	}	
	
	plane.position.y = value.num;	

	$('[nameId="rp_height_plane"]').val( value.num );
	
	var ruler = infProject.scene.substrate.ruler;
	ruler[0].position.y = plane.position.y + 0.01;
	ruler[1].position.y = plane.position.y + 0.01;

	fname_s_0273({ruler: ruler});
	fname_s_0278({plane: plane});
	
	renderCamera();	
}




function fname_s_0282(cdm)
{
	
	
	var obj = cdm.obj;
	var img = cdm.img;
	
	if(cdm.pos)
	{
		obj.position.x = cdm.pos.x;
		obj.position.z = cdm.pos.z;
	}
	
	new THREE.TextureLoader().load(infProject.path+'/'+img, function ( image )  
	{
		var material = obj.material;
		material.color = new THREE.Color( 0xffffff );
		var texture = image;			
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
		
		var ratioImg = texture.image.width/texture.image.height;
		
		if(cdm.scale)
		{
			fname_s_0291({obj: obj, size: {x: cdm.scale/2 * ratioImg, z: cdm.scale/2}});
		}
		else
		{
			fname_s_0291({obj: obj, size: {x: ratioImg * 2.5, z: 2.5}});
		}		
				
		var x = (Math.abs(obj.geometry.boundingBox.max.x) + Math.abs(obj.geometry.boundingBox.min.x));
		
		var z = (Math.abs(obj.geometry.boundingBox.max.z) + Math.abs(obj.geometry.boundingBox.min.z));		
		
		fname_s_0278({plane: obj});
		
		fname_s_0206( obj );		
		
		texture.repeat.x = 1/x; 
		texture.repeat.y = -1/z;			
		
		texture.offset.x += 0.5;
		texture.offset.y += 0.5;

		
		texture.needsUpdate = true;
		
		material.map = texture; 
		material.lightMap = lightMap_1;
		material.needsUpdate = true; 					
		
		renderCamera();
	});			
}



function fname_s_0283(cdm)
{
	
	
	var image = new Image();
	image.src = cdm.image;
	
	var obj = infProject.scene.substrate.floor[0].plane;	
	if(!obj) return;
	
	infProject.scene.substrate.active = obj;
	
	image.onload = function() 
	{
		obj.userData.substrate.img = true;
		var material = obj.material;
		var texture = new THREE.Texture();
		texture.image = image;
		
		material.color = new THREE.Color( 0xffffff );
					
		texture.wrapS = THREE.MirroredRepeat;
		texture.wrapT = THREE.MirroredRepeat;
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();		
		
		var ratioImg = texture.image.width/texture.image.height;

		fname_s_0291({obj: obj, size: {x: ratioImg * 2.5, z: 2.5}});
		
		var x = (Math.abs(obj.geometry.boundingBox.max.x) + Math.abs(obj.geometry.boundingBox.min.x));
		
		var z = (Math.abs(obj.geometry.boundingBox.max.z) + Math.abs(obj.geometry.boundingBox.min.z));		
				
		
		if(myCameraOrbit.activeCam.userData.isCam2D)
		{
			fname_s_0274();			
		}

		fname_s_0278({plane: obj});	
		
		fname_s_0206( obj );
		
		texture.repeat.x = 1/x; 
		texture.repeat.y = -1/z;			
		
		texture.offset.x += 0.5;
		texture.offset.y += 0.5;		
		
		texture.needsUpdate = true;
		
		material.map = texture; 
		material.lightMap = lightMap_1;
		material.needsUpdate = true; 					
		
		fname_s_0294({value: 100});
		
		fname_s_0279({visible: true});
		
		renderCamera();
	};
		
}



function fname_s_0206( obj )
{
	obj.updateMatrixWorld();
	var geometry = obj.geometry;
	
    geometry.faceVertexUvs[0] = [];
	var faces = geometry.faces;
	
    for (var i = 0; i < faces.length; i++) 
	{		
		var components = ['x', 'y', 'z'].sort(function(a, b) {			
			return Math.abs(faces[i].normal[a]) - Math.abs(faces[i].normal[b]);
		});	


        var v1 = geometry.vertices[faces[i].a];
        var v2 = geometry.vertices[faces[i].b];
        var v3 = geometry.vertices[faces[i].c];				

        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(v1[components[0]], v1[components[1]]),
            new THREE.Vector2(v2[components[0]], v2[components[1]]),
            new THREE.Vector2(v3[components[0]], v3[components[1]])
        ]);
    }

    geometry.uvsNeedUpdate = true;
	geometry.elementsNeedUpdate = true; 
}





function fname_s_0285(cdm)
{	
	var intersect = cdm.intersect;
	var obj = clickO.move = cdm.intersect.object;  
	
	clickO.offset = new THREE.Vector3().subVectors( obj.position, intersect.point );	
	
	planeMath.position.copy( intersect.point );  
	planeMath.rotation.set( Math.PI/2, 0, 0 );
}




function fname_s_0286( event ) 
{	
	var intersects = fname_s_0213( event, planeMath, 'one' ); 
	
	if(intersects.length == 0) return;
	
	var obj = clickO.move;	
	
	var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, clickO.offset );	
	
	var pos2 = new THREE.Vector3().subVectors( pos, obj.position );
	obj.position.add( pos2 );


	
	if(1==1)
	{
		fname_s_0273({ruler: infProject.scene.substrate.ruler});	
	}
}




function fname_s_0287(cdm)
{	
	var intersect = cdm.intersect;
	var obj = clickO.move = cdm.intersect.object;  
	
	clickO.offset = new THREE.Vector3().subVectors( obj.position, intersect.point );	
	
	planeMath.position.copy( intersect.point );  
	planeMath.rotation.set( Math.PI/2, 0, 0 );
}




function fname_s_0288( event ) 
{	
	var intersects = fname_s_0213( event, planeMath, 'one' ); 
	
	if(intersects.length == 0) return;
	
	var obj = clickO.move;	
	
	var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, clickO.offset );	
	
	var pos2 = new THREE.Vector3().subVectors( pos, obj.position );
	obj.position.add( pos2 );


	
	if(1==1)
	{
		for (var i = 0; i < obj.userData.substrate.p.length; i++)
		{
			obj.userData.substrate.p[i].position.add( pos2 );
		}

		infProject.scene.substrate.ruler[0].position.add( pos2 );
		infProject.scene.substrate.ruler[1].position.add( pos2 );
		infProject.scene.substrate.ruler[0].userData.subtool.line.position.add( pos2 );		
	}
}





function fname_s_0289(cdm)
{	
	var intersect = cdm.intersect;
	var obj = clickO.move = cdm.intersect.object;  
	
	clickO.offset = new THREE.Vector3().subVectors( obj.position, intersect.point );

	planeMath.position.copy( intersect.point );  
	planeMath.rotation.set( Math.PI/2, 0, 0 );
}




function fname_s_0290( event ) 
{	
	var intersects = fname_s_0213( event, planeMath, 'one' ); 
	
	if(intersects.length == 0) return;
	
	var obj = clickO.move;	
	
	var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, clickO.offset );	
	
	
	if(1==1)
	{
		var ps = obj.userData.subpoint.p2.position;
		var dir = obj.userData.subpoint.dir;
		var qt = obj.userData.subpoint.qt;  
		
		var v1 = fname_s_0220( new THREE.Vector3().subVectors( ps, pos ), qt ); 
		if(v1.z < 0.5) { v1.z = 0.5; }   
		var v1 = new THREE.Vector3().addScaledVector( dir, -v1.z );
		pos = new THREE.Vector3().addVectors( ps, v1 );		
	}
	
	
	if(1 == 1)
	{
		obj.updateMatrixWorld();
		var posLoc = obj.worldToLocal( pos.clone() );	
		var posX = obj.localToWorld( new THREE.Vector3(posLoc.x, 0, 0) );
		var posX = new THREE.Vector3().subVectors( posX, obj.position );
		
		var posZ = obj.localToWorld( new THREE.Vector3(0, 0, posLoc.z) );
		var posZ = new THREE.Vector3().subVectors( posZ, obj.position );	

		obj.userData.subpoint.x.position.add( posX );
		obj.userData.subpoint.z.position.add( posZ );
	}		
	
	var pos2 = new THREE.Vector3().subVectors( pos, obj.position );
	obj.position.add( pos2 );

	
	
	if(1 == 1)
	{
		var plane = obj.userData.subpoint.plane;		
		var point = plane.userData.substrate.p;
		
		plane.updateMatrixWorld();			
		var ps1 = plane.worldToLocal( point[0].position.clone() );
		var ps2 = plane.worldToLocal( point[1].position.clone() );
		var ps3 = plane.worldToLocal( point[2].position.clone() );
		var ps4 = plane.worldToLocal( point[3].position.clone() );
		
		var x = new THREE.Vector3().subVectors( ps3, ps1 ).x;
		var z = new THREE.Vector3().subVectors( ps2, ps1 ).z;
		
		fname_s_0291({obj: plane, size: {x: x/2, z: z/2}});
		
		plane.position.add( pos2.clone().divideScalar( 2 ) );
	}
}






function fname_s_0291(cdm)
{
	var obj = cdm.obj; 
	var size = cdm.size;
	
	var v = obj.geometry.vertices; 		
	v[0].x = v[1].x = v[6].x = v[7].x = -size.x;
	v[3].x = v[2].x = v[5].x = v[4].x = size.x;

	v[0].y = v[3].y = v[4].y = v[7].y = -0.0025;
	v[1].y = v[2].y = v[5].y = v[6].y = 0.0025;
	
	v[0].z = v[1].z = v[2].z = v[3].z = size.z;
	v[4].z = v[5].z = v[6].z = v[7].z = -size.z;		

	obj.geometry.verticesNeedUpdate = true; 
	obj.geometry.elementsNeedUpdate = true;

	obj.geometry.computeBoundingBox();
	obj.geometry.computeBoundingSphere();
}





function fname_s_0292()
{
	var size = $('[nameId="input_size_substrate"]').val();
	var value = fname_s_0227({ value: size, unit: 1, abs: true, limit: {min: 0.01, max: 1000} });
	
	if(!value) 
	{
		$('[nameid="input_size_substrate"]').val(1);
		
		return;
	}	
	
	var plane = infProject.scene.substrate.active;	
	if(!plane) return;
	
	var ruler = infProject.scene.substrate.ruler;	
	var dist = ruler[0].position.distanceTo( ruler[1].position );
	var ratio = value.num/dist;  
	
	
	
	plane.geometry.computeBoundingBox();	
	var x = (Math.abs(plane.geometry.boundingBox.max.x) + Math.abs(plane.geometry.boundingBox.min.x));
	var z = (Math.abs(plane.geometry.boundingBox.max.z) + Math.abs(plane.geometry.boundingBox.min.z));

	x /= 2;
	z /= 2;
	
	fname_s_0291({obj: plane, size: {x: x*ratio, z: z*ratio}});
		
	
	if(1==1)
	{	
		var v1 = plane.worldToLocal( ruler[0].position.clone() );
		var v2 = plane.worldToLocal( ruler[1].position.clone() );		
		
		var v1 = new THREE.Vector3().addScaledVector( v1, ratio );
		var v2 = new THREE.Vector3().addScaledVector( v2, ratio );
		
		var v1 = plane.localToWorld( v1.clone() ); 
		var v2 = plane.localToWorld( v2.clone() ); 
		
		ruler[0].position.x = v1.x;
		ruler[0].position.z = v1.z; 	
		ruler[1].position.x = v2.x;
		ruler[1].position.z = v2.z;	

		fname_s_0273({ruler: ruler});
	}
	
	$('[nameId="input_size_substrate"]').val( value.num );
	
	fname_s_0278({plane: plane});
	
	renderCamera();
}




function fname_s_0293(cdm)
{
	if(!cdm) return;

	var plane = infProject.scene.substrate.active;	
	if(!plane) return;
	
	var value = fname_s_0227({ value: cdm.angle, unit: 1 });
	 
	if(!value) 
	{
		var rot = Math.abs(Math.round( THREE.Math.radToDeg(plane.rotation.y) ));
		$('[nameId="input_rotate_substrate"]').val( rot );
		
		return;
	}	
	
	if(cdm.set)
	{
		plane.rotation.y = THREE.Math.degToRad(value.num * -1);
	}
	else
	{
		plane.rotation.y -= THREE.Math.degToRad(value.num);
	}	
	
	
	var rot = Math.abs(Math.round( THREE.Math.radToDeg(plane.rotation.y) ));

	$('[nameId="input_rotate_substrate"]').val( rot );
	
	fname_s_0278({plane: plane});
	
	renderCamera();
}





function fname_s_0294(cdm)
{
	var value = cdm.value;
	
	var plane = infProject.scene.substrate.active;	
	if(!plane) return;
	
	plane.material.opacity = value/100;
	plane.material.needsUpdate = true; 					
	
	$('[nameId="input_transparency_substrate"]').val(value);
	
	renderCamera();	
}




function fname_s_0295(cdm)
{
	if(!cdm) cdm = {}; 
	
	
	var plane = infProject.scene.substrate.active;	
	if(!plane) return;		
	
	fname_s_0279({visible: false});	
	
	
	plane.userData.substrate.img = false;
	
	$('#substrate_img').attr('src', 'img/f0.png');
	$('[nameid="input_size_substrate"]').val(1);
}









function fname_s_0296(cdm)
{
	if(!cdm) { cdm = {}; }
	
	var arr = [];
	
	var svg = document.querySelector('#svgFrame');
	
	var x1 = (cdm.x1) ? cdm.x1 : 100;
	var y1 = (cdm.y1) ? cdm.y1 : 300;
	var x2 = (cdm.x2) ? cdm.x2 : 600;
	var y2 = (cdm.y2) ? cdm.y2 : 300;	
	
	for ( var i = 0; i < cdm.count; i++ )
	{
		var line  = document.createElementNS(infProject.settings.svg.tag, "line");

		line.setAttribute("x1", x1);
		line.setAttribute("y1", y1);

		line.setAttribute("x2", x2);
		line.setAttribute("y2", y2);
		line.setAttribute("stroke-width", "2px");
		line.setAttribute("stroke", "rgb(255, 162, 23)");
		line.setAttribute("display", "none");
		
		if(cdm.dasharray)
		{
			line.setAttribute("stroke-dasharray", "20 10");
		}		
		
		if(cdm.color)
		{ 
			line.setAttribute("stroke", cdm.color); 
		}	
		
		if(cdm.display)
		{
			line.setAttribute("display", cdm.display);
		}
		
		line.userData = {};
		line.userData.svg = {};
		line.userData.svg.line = {};
		line.userData.svg.line.p = [new THREE.Vector3(), new THREE.Vector3()];		
		
		svg.appendChild(line);
		
		infProject.svg.arr[infProject.svg.arr.length] = line;
		arr[arr.length] = line;
	}
	
	return arr;
}



function fname_s_0297(cdm)
{
	if(!cdm) { cdm = {}; }
	
	var arr = [];
	
	var svg = document.querySelector('#svgFrame');
	
	for ( var i = 0; i < cdm.count; i++ )
	{
		var circle = document.createElementNS(infProject.settings.svg.tag, "circle");

		circle.setAttribute("cx", 600);
		circle.setAttribute("cy", 600);

		circle.setAttribute("r", 4.2);
		circle.setAttribute("stroke-width", "2px");
		
		if(cdm.color){ circle.setAttribute("stroke", cdm.color); }
		else { circle.setAttribute("stroke", "rgb(255, 162, 23)"); }	
		
		circle.setAttribute("fill", "#fff");
		
		
		circle.setAttribute("display", "none");
		
		circle.userData = {};
		circle.userData.svg = {};
		circle.userData.svg.circle = {};
		
		circle.userData.svg.circle.pos = new THREE.Vector3();		

		svg.appendChild(circle);
		
		infProject.svg.arr[infProject.svg.arr.length] = circle;
		arr[arr.length] = circle;		
	}
	
	return arr;		
}




function fname_s_0298(cdm)
{
	if(!cdm) { cdm = {}; }
	
	var arr = [];
	
	var svg = document.querySelector('#svgFrame');
	
	for ( var i = 0; i < cdm.count; i++ )
	{
		var el  = document.createElementNS(infProject.settings.svg.tag, "path");

		el.setAttribute("d", 'M100 100, 300 100, 300 600, 200 600');
		el.setAttribute("stroke-width", "2px");		
		el.setAttribute("fill", "none");
		el.setAttribute("stroke", "rgb(255, 162, 23)");
		el.setAttribute("display", "none");
		
		
		if(cdm.arrS)
		{
			var path = 'M';
			
			for ( var i2 = 0; i2 < cdm.arrS.length; i2++ )
			{
				path += cdm.arrS[i2].x+' '+cdm.arrS[i2].y+','; 
			}

			el.setAttribute("d", path);
		}
		
		if(cdm.dasharray)
		{
			el.setAttribute("stroke-dasharray", "20 10");
		}
		
		if(cdm.stroke_width)
		{
			el.setAttribute("stroke-width", cdm.stroke_width);
		}		

		if(cdm.fill)
		{
			el.setAttribute("fill", cdm.fill); 
		}
		
		if(cdm.color)
		{ 
			el.setAttribute("stroke", cdm.color); 
		}	
		
		if(cdm.display)
		{
			el.setAttribute("display", cdm.display);
		}		
		
		el.userData = {};
		el.userData.svg = {};
		el.userData.svg.path = {};
		el.userData.svg.path.arrP = [];		
		el.userData.svg.path.arrS = (cdm.arrS) ? cdm.arrS : [];
		
		svg.appendChild(el);
		
		infProject.svg.arr[infProject.svg.arr.length] = el;
		arr[arr.length] = el;
	}
	
	return arr;
}




function fname_s_0299(cdm)
{
	if(!cdm) { cdm = {}; }
	
	var arr = [];
	
	var svg = document.querySelector('#svgFrame');
	
	for ( var i = 0; i < cdm.count; i++ )
	{
		var el  = document.createElementNS(infProject.settings.svg.tag, "path");

		
		var p1 = new THREE.Vector2(0, 0);
		var p2 = new THREE.Vector2(0, 0);
		var r = 0;
		el.setAttribute("d", 'M'+p1.x+','+p1.y+'A'+r+','+r+' 0 0,0 '+p2.x+','+p2.y);
		el.setAttribute("stroke-width", "1px");		
		el.setAttribute("fill", "none");
		el.setAttribute("stroke", "rgb(255, 162, 23)");
		
		if(cdm.dasharray)
		{
			el.setAttribute("stroke-dasharray", "20 10");
		}
		
		if(cdm.stroke_width)
		{
			el.setAttribute("stroke-width", cdm.stroke_width);
		}		

		if(cdm.fill)
		{
			el.setAttribute("fill", cdm.fill); 
		}
		
		if(cdm.color){ el.setAttribute("stroke", cdm.color); }	
		
		el.setAttribute("display", "none");
		
		el.userData = {};
		el.userData.svg = {};
		el.userData.svg.arc = {};
		el.userData.svg.arc.param = {};
		el.userData.svg.arc.param.p1 = p1;
		el.userData.svg.arc.param.p2 = p2;
		el.userData.svg.arc.param.r = r;		
		
		svg.appendChild(el);
		
		infProject.svg.arr[infProject.svg.arr.length] = el;
		arr[arr.length] = el;
	}
	
	return arr;	
}




function fname_s_0300(cdm)
{
	var el = cdm.el;	
	
	if(el.getAttribute("display") == 'none') return;
	
	if(cdm.point)
	{
		el.userData.svg.line.p = cdm.point;
	}
	
	var p = el.userData.svg.line.p;
	
	const cam2D = myCameraOrbit.cam2D;
	
	var tempV = p[0].clone().project(cam2D);

	var x = (tempV.x *  .5 + .5) * canvas.clientWidth;
	var y = (tempV.y * -.5 + .5) * canvas.clientHeight;

	el.setAttribute("x1", x);
	el.setAttribute("y1", y);
	
	var tempV = p[1].clone().project(cam2D);

	var x = (tempV.x *  .5 + .5) * canvas.clientWidth;
	var y = (tempV.y * -.5 + .5) * canvas.clientHeight;

	el.setAttribute("x2", x);
	el.setAttribute("y2", y);		
	
}




function fname_s_0301(cdm)
{
	var el = cdm.el;
	
	if(el.getAttribute("display") == 'none') return;
	
	if(cdm.pos)
	{
		el.userData.svg.circle.pos = cdm.pos;
	}
	
	const cam2D = myCameraOrbit.cam2D;
	var pos = el.userData.svg.circle.pos;
	
	var tempV = pos.clone().project(cam2D);
	var x = (tempV.x *  .5 + .5) * canvas.clientWidth;
	var y = (tempV.y * -.5 + .5) * canvas.clientHeight;

	el.setAttribute("cx", x);
	el.setAttribute("cy", y);			
}




function fname_s_0302(cdm)
{
	var el = cdm.el;
	
	if(el.getAttribute("display") == 'none') return;
	
	if(cdm.arrP)
	{
		el.userData.svg.path.arrP = cdm.arrP;
	}
	
	var path = 'M';
	var arrP = el.userData.svg.path.arrP;
	var arrS = [];
	
	if(arrP.length == 0) return;
	
	const cam2D = myCameraOrbit.cam2D;
	
	for ( var i = 0; i < arrP.length; i++ )
	{
		var tempV = arrP[i].clone().project(cam2D);
		var x = (tempV.x *  .5 + .5) * canvas.clientWidth;
		var y = (tempV.y * -.5 + .5) * canvas.clientHeight;
		
		path += x+' '+y+',';
		
		arrS[arrS.length] = new THREE.Vector2(x, y);
	}
	
	el.userData.svg.path.arrS = arrS;

	el.setAttribute("d", path);			
}






function fname_s_0303(cdm)
{
	var el = cdm.el;
	
	if(el.getAttribute("display") == 'none') return;
	
	
	if(cdm.param)
	{
		el.userData.svg.arc.param = cdm.param;
	}
	
	var p1 = el.userData.svg.arc.param.p1;
	var p2 = el.userData.svg.arc.param.p2;
	
	
	const cam2D = myCameraOrbit.cam2D;
	
	var tempV = p1.clone().project(cam2D);
	var x1 = (tempV.x *  .5 + .5) * canvas.clientWidth;
	var y1 = (tempV.y * -.5 + .5) * canvas.clientHeight;

	
	var tempV = p2.clone().project(cam2D);
	var x2 = (tempV.x *  .5 + .5) * canvas.clientWidth;
	var y2 = (tempV.y * -.5 + .5) * canvas.clientHeight;	

	var r = new THREE.Vector2(x1, y1).distanceTo( new THREE.Vector2(x2, y2) );

	el.setAttribute("d", 'M'+x1+','+y1+'A'+r+','+r+' 0 0,0 '+x2+','+y2);		
}



 


function fname_s_0304(cdm)
{
	var el = cdm.el;
	const cam2D = myCameraOrbit.cam2D;
	
	for ( var i = 0; i < el.length; i++ )
	{
		var x = ( ( el[i].x1.baseVal.value - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
		var y = - ( ( el[i].y1.baseVal.value - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
		var A = new THREE.Vector3(x, y, -1);
		A.unproject(cam2D);
		
		var x = ( ( el[i].x2.baseVal.value - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
		var y = - ( ( el[i].y2.baseVal.value - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
		var B = new THREE.Vector3(x, y, -1);
		B.unproject(cam2D);					
		
		el[i].userData.svg.line.p = [A, B];
	}				
}




function fname_s_0305(cdm)
{
	var el = cdm.el;
	const cam2D = myCameraOrbit.cam2D;
	
	for ( var i = 0; i < el.length; i++ )
	{
		var arrP = [];
		
		for ( var i2 = 0; i2 < el[i].userData.svg.path.arrS.length; i2++ )
		{
			var arrS = el[i].userData.svg.path.arrS[i2];
			
			var x = ( ( arrS.x - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
			var y = - ( ( arrS.y - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
			var A = new THREE.Vector3(x, y, -1);
			A.unproject(cam2D);

			arrP[arrP.length] = A;
		}	
				
		
		
		el[i].userData.svg.path.arrP = arrP;	 
	}

}





function fname_s_0306(arr)
{
	for ( var i = 0; i < arr.length; i++ )
	{
		arr[i].setAttribute("display", "block");
	}	
}



function fname_s_0307(arr)
{
	for ( var i = 0; i < arr.length; i++ )
	{
		arr[i].setAttribute("display", "none");
	}	
}







function fname_s_0308(cdm)
{
	var el = cdm.el;
	
	for ( var i = 0; i < el.length; i++ )
	{
		
		el[i].addEventListener('mouseover', 		
			function() 
			{ 
				this.setAttribute("r", 6);				
			}
		);
		
		el[i].addEventListener('mouseout', 		
			function() 
			{ 
				this.setAttribute("r", 4.2);
			}
		);
		
		el[i].addEventListener('mousedown', 		
			function(event) 
			{ 
				fname_s_066({event: event, elem: this});
				event.stopPropagation();
			}
		);			
	}
 
}




















function fname_s_0309(arr)
{
	for ( var i = 0; i < arr.length; i++ )
	{
		arr[i].style.display = 'block'; 
		arr[i].userData.elem.show = true;		
	}	
}



function fname_s_0310(arr)
{
	for ( var i = 0; i < arr.length; i++ )
	{
		arr[i].style.display = 'none'; 
		arr[i].userData.elem.show = false; 
	}	
}





function fname_s_0311(cdm)
{
	var arr = [];
	
	for ( var i = 0; i < cdm.count; i++ )
	{
		var labelContainerElem = document.querySelector('#htmlBlock');
		var elem = document.createElement('div');
		elem.textContent = '';
		elem.style.cssText = 'position: absolute; text-align: center;';
		elem.style.cssText += infProject.settings.html.fonts.wall.size; 
		elem.style.cssText += infProject.settings.html.fonts.wall.type;
		elem.style.cssText += infProject.settings.html.fonts.wall.color;
		elem.style.cssText += 'z-index: 1;';
		if(cdm.style) { elem.style.cssText += (cdm.style); }
		
		labelContainerElem.appendChild(elem); 
		
		elem.userData = {};
		elem.userData.tag = cdm.tag;
		elem.userData.elem = {};
		elem.userData.elem.pos = new THREE.Vector3();
		elem.userData.elem.rot = 0;
		elem.userData.elem.show = true;
		
		infProject.html.label[infProject.html.label.length] = elem;	

		arr[arr.length] = elem;
		
		if(cdm.display)
		{
			elem.style.display = cdm.display;
			elem.userData.elem.show = false;
		}
	}
	
	return arr;
}
























function fname_s_0312(e)
{
    var posx = 0;
    var posy = 0;
    if (e.pageX || e.pageY)     
	{
        posx = e.pageX;
        posy = e.pageY;
    }
    else if (e.clientX || e.clientY)    
	{
        posx = e.clientX + containerF.scrollLeft + containerF.documentElement.scrollLeft;
        posy = e.clientY + containerF.scrollTop + containerF.documentElement.scrollTop;
    }

    return {x: posx, y : posy};
}


function fname_s_0313(event) 
{ 
	if(myCameraOrbit.activeCam.userData.isCam2D && clickO.keys[16]){} 
	else { return false; }

	clickO.rayhit = null;
	fname_s_081();
	
	infProject.tools.selectionBox.msdown = true;
	infProject.tools.selectionBox.fname_s_0312 = fname_s_0312(event);

	infProject.tools.selectionBox.mStart.x = ( ( event.clientX - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
	infProject.tools.selectionBox.mStart.y = - ( ( event.clientY - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
	
	return true;
}
 
function fname_s_0314(event)
{
	if(myCameraOrbit.activeCam.userData.isCam2D && clickO.keys[16] && infProject.tools.selectionBox.msdown){}
	else { return false; }
	
	var x1=0;
	var x2=0;
	var y1=0;
	var y2=0;
	var mousexy = fname_s_0312(event);  
	x1 = infProject.tools.selectionBox.fname_s_0312.x;
	y1 = infProject.tools.selectionBox.fname_s_0312.y;
	x2 = mousexy.x;
	y2 = mousexy.y;
	if (x1==x2){return;}
	if (y1==y2){return;}
	if (x1>x2){
		x1 = x1+x2;
		x2 = x1-x2;
		x1 = x1-x2;
	}
	if (y1>y2){
		y1 = y1+y2;
		y2 = y1-y2;
		y1 = y1-y2;
	}
	var sframe = document.getElementById('selectBoxFrame'); 
	sframe.style.top = y1+'px';
	sframe.style.left = x1+'px';
	sframe.style.width = x2-x1+'px';
	sframe.style.height = y2-y1+'px'; 
	sframe.style.visibility = infProject.tools.selectionBox.msdown?'visible':'hidden';		
	
	return true;
}



function fname_s_0315(event)
{ 
	if(myCameraOrbit.activeCam.userData.isCam2D && clickO.keys[16] && infProject.tools.selectionBox.msdown){}
	else { return false; }
	
	infProject.tools.selectionBox.msdown = false; 
	document.getElementById('selectBoxFrame').style.visibility = infProject.tools.selectionBox.msdown?'visible':'hidden';

	infProject.tools.selectionBox.mEnd.x = ( ( event.clientX - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
	infProject.tools.selectionBox.mEnd.y = - ( ( event.clientY - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	

	fname_s_0317();
	
	
	renderCamera();
	
	return true;
}


function fname_s_0316() 
{  
	infProject.tools.selectionBox.msdown = false; 
	document.getElementById('selectBoxFrame').style.visibility = infProject.tools.selectionBox.msdown?'visible':'hidden'; 
}	






function fname_s_0317()
{
	var pos1 = new THREE.Vector3( infProject.tools.selectionBox.mStart.x, infProject.tools.selectionBox.mStart.y, -1 ).unproject( camera ); 	
	var pos2 = new THREE.Vector3( infProject.tools.selectionBox.mEnd.x, infProject.tools.selectionBox.mEnd.y, -1 ).unproject( camera ); 		
	
	var bound = { min : {x:0,z:0}, max : {x:0,z:0} };
	
	if(pos1.x < pos2.x) { bound.min.x = pos1.x; bound.max.x = pos2.x; }
	else { bound.min.x = pos2.x; bound.max.x = pos1.x; }
	
	if(pos1.z < pos2.z) { bound.min.z = pos1.z; bound.max.z = pos2.z; }
	else { bound.min.z = pos2.z; bound.max.z = pos1.z; }


	
	clickO.obj = null;
	
	var arr = [];
	
	
	for(var i = 0; i < infProject.scene.array.obj.length; i++)
	{
		var obj = infProject.scene.array.obj[i];

		if(bound.min.x < obj.position.x && bound.max.x > obj.position.x)
		{
			if(bound.min.z < obj.position.z && bound.max.z > obj.position.z)
			{
				arr[arr.length] = obj;
			}
		}
	}	
	
	clickO.selectBox.arr = arr;
	
	myComposerRenderer.outlineAddObj({arr: arr});	
}




function fname_s_0318( intersect )
{
	var arr = clickO.selectBox.arr;
	
	if(arr.length > 0) {}
	else { return false; }
	
	planeMath.position.set( 0, intersect.point.y, 0 );	
	planeMath.rotation.set(-Math.PI/2, 0, 0);

	var obj = intersect.object;	 
	clickO.pos.clickDown = intersect.point.clone();		

	
	
	var flag = false;
	
	for ( var i = 0; i < arr.length; i++ )
	{
		if(obj == arr[i]) 
		{ 
			flag = true; 
			clickO.selectBox.drag = true;
			clickO.selectBox.move = false;
			break; 
		}	
	}
	
	myComposerRenderer.outlineAddObj({arr: arr});
	
	return flag;
}





function fname_s_0319(event) 
{
	if(!clickO.selectBox.move) 
	{
		clickO.selectBox.move = true;
	}	
	
	var intersect = fname_s_0213( event, planeMath, 'one' );
	var pos2 = new THREE.Vector3().subVectors( intersect[0].point, clickO.pos.clickDown );		
	
	
	for ( var i = 0; i < clickO.selectBox.arr.length; i++ ){ clickO.selectBox.arr[i].position.add(pos2); }	
	
	
	clickO.pos.clickDown = intersect[0].point.clone();
}
 



function fname_s_0320(cdm) 
{
	clickO.selectBox.drag = false;
	
	if(!clickO.selectBox.move) return;	
		
	clickO.selectBox.move = false;	
}





function fname_s_0321(obj)  
{
	var arr = clickO.selectBox.arr;
	
	if(arr.length > 0) {}
	else { return false; }
	
	if(obj)
	{
		for ( var i = 0; i < arr.length; i++ )
		{
			if(obj == arr[i]) { return true; }	
		}		
	}
	 

	myComposerRenderer.outlineRemoveObj();
	clickO.selectBox.arr = [];
	
	return false;
}











 

function fname_s_0322( o, ur )
{
	
	if(ur == 'down')
	{
		if(infProject.ur.back.length - 1 > infProject.ur.count)
		{
			var d = infProject.ur.back.length - (infProject.ur.count + 1);  
			infProject.ur.back.splice(infProject.ur.count + 1, d);  		
		}		
		
		infProject.ur.count += 1; 
		infProject.ur.back[infProject.ur.count] = o; 
		
	}
	else if(ur == 'up')
	{ 
		infProject.ur.forward[infProject.ur.count] = o;
		
	}		
}




function fname_s_0323(cdm)
{
	var obj = cdm.obj;
	
	var ar = { cdm : 'objPop_move' };

	ar.id = obj.userData.id;
	ar.pos = obj.userData.obj3D.ur.pos.clone();
	ar.q = obj.userData.obj3D.ur.q.clone();
	
	fname_s_0322( ar, 'down' );
	
	
	var ar = { cdm : 'objPop_move' };
	
	ar.id = obj.userData.id;
	ar.pos = obj.position.clone();
	ar.q = obj.quaternion.clone(); 

	fname_s_0322( ar, 'up' );
}




function fname_s_0324(cdm)
{
	var arr = cdm.arr;
	
	var inf = { cdm: 'delete_obj', arr: [] };

	for(var i = 0; i < arr.length; i++)
	{
		inf.arr[i] = {};
		inf.arr[i].id = arr[i].userData.id;
		inf.arr[i].lotid = arr[i].userData.obj3D.lotid;
		inf.arr[i].pos = arr[i].position.clone();
		inf.arr[i].q = arr[i].quaternion.clone(); 	
	}
	
	fname_s_0322( inf, 'down' );
	
	
	var inf = { cdm: 'delete_obj', arr: [] };

	for(var i = 0; i < arr.length; i++)
	{
		inf.arr[i] = {};
		inf.arr[i].id = arr[i].userData.id; 
	}
	
	fname_s_0322( inf, 'up' );
}




function fname_s_0325(cdm)
{
	var obj = cdm.obj;
	
	var ar = { cdm : 'add_objPop' };
	
	ar.id = obj.userData.id;

	fname_s_0322( ar, 'down' );
	
	
	
	var ar = { cdm : 'add_objPop' };

	ar.id = obj.userData.id;
	ar.lotid = obj.userData.obj3D.lotid;
	ar.pos = obj.userData.obj3D.ur.pos.clone();
	ar.q = obj.userData.obj3D.ur.q.clone(); 
	
	fname_s_0322( ar, 'up' );
}







function fname_s_0326( cdm )
{		  
	var n = (cdm == 'redo') ? infProject.ur.count + 1 : infProject.ur.count;	
	
	if(n < 0 | n > (infProject.ur.back.length - 1)){ return; }
	
	infProject.ur.count = n; 
	
	fname_s_0217();
	
	
	if(infProject.ur.back[n].cdm == 'objPop_move'){ fname_s_0327(cdm); }
	else if(infProject.ur.back[n].cdm == 'delete_obj'){ fname_s_0328(cdm); }
	else if(infProject.ur.back[n].cdm == 'add_objPop'){ fname_s_0329(cdm); }
	
		
	if(cdm == 'undo') {  }			
	else if(cdm == 'redo') {  }		
	
	if(cdm == 'undo'){ infProject.ur.count -= 1; }		
}





function fname_s_0327(cdm)
{
	var n = infProject.ur.count;
	
	if(cdm == 'undo') { var ar = infProject.ur.back[n]; }			
	else if(cdm == 'redo') { var ar = infProject.ur.forward[n]; }		
	
	var obj = fname_s_0224( 'obj', ar.id ); 		
	
	obj.userData.obj3D.ur.pos = ar.pos;
	obj.userData.obj3D.ur.q = ar.q;
	
	obj.position.copy(ar.pos);
	obj.quaternion.copy(ar.q);
	
	renderCamera();
}




function fname_s_0328(cdm)
{
	var n = infProject.ur.count;
	
	if(cdm == 'undo') { var inf = infProject.ur.back[n]; }				
	else if(cdm == 'redo') { var inf = infProject.ur.forward[n]; }		
	
	
	if(cdm == 'undo')	
	{ 		
		for(var i = 0; i < inf.arr.length; i++)
		{
			fname_s_0256({id: inf.arr[i].id, lotid: inf.arr[i].lotid, pos: inf.arr[i].pos, q: inf.arr[i].q});
		}
	}
	else if(cdm == 'redo')	
	{ 
		for(var i = 0; i < inf.arr.length; i++)
		{
			fname_s_0243({obj: fname_s_0224( 'obj', inf.arr[i].id ), undoRedo: false});
		}		
	}	
	
	renderCamera();
}




function fname_s_0329(cdm)
{
	var n = infProject.ur.count;
	
	if(cdm == 'undo') { var ar = infProject.ur.back[n]; }				
	else if(cdm == 'redo') { var ar = infProject.ur.forward[n]; }		
	
	
	if(cdm == 'undo')	
	{ 				
		fname_s_0243({obj: fname_s_0224( 'obj', ar.id ), undoRedo: false});
	}
	else if(cdm == 'redo')	
	{ 
		fname_s_0256({id: ar.id, lotid: ar.lotid, pos: ar.pos, q: ar.q});
	}
	
	renderCamera();
}









var arrImg_1 = null;
var arrImg_2 = null;




function fname_s_0330() 
{ 

	try 
	{	
		fname_s_0331({visible: false});
		var background = scene.background.clone();
		scene.background = new THREE.Color( 0xffffff );
		infProject.scene.grid.visible = false;
		infProject.settings.shader.fxaaPass.enabled = true;
		renderer.render( scene, myCameraOrbit.activeCam );
		
		var strMime = "image/png";
		var imgData = renderer.domElement.toDataURL(strMime);	

		fname_s_0331({visible: true});
		scene.background = background;
		infProject.scene.grid.visible = true;
		infProject.settings.shader.fxaaPass.enabled = false;
		renderer.render( scene, myCameraOrbit.activeCam );
 
				
		if(myCameraOrbit.activeCam.userData.isCam3D)
		{
			openFileImage(imgData.replace(strMime, "image/octet-stream"), "screenshot.png");
		}
		else
		{	
			var svg = document.querySelector('#svgFrame');
			var canvas = document.createElement("canvas");
			canvas.width = svg.clientWidth;
			canvas.height = svg.clientHeight;
			var ctx = canvas.getContext("2d");
			var DOMURL = self.URL || self.webkitURL || self;
			var img = new Image(); 

			img.onload = function() 
			{
				arrImg_1 = img;
				fname_s_0334();
			};
			img.src = imgData;
		}		
	} 
	catch (e) 
	{
		
		return;
	}
}



function fname_s_0331(cdm)
{
	if(myCameraOrbit.activeCam.userData.isCam3D) return;
	
	var point = infProject.scene.array.point;
	
	for( var i = 0; i < point.length; i++ )
	{
		point[i].visible = cdm.visible;
	}
}






var openFileImage = function (strData, filename) 
{
	var link = document.createElement('a');
	
	if(typeof link.download === 'string') 
	{		
		document.body.appendChild(link); 
		link.download = filename;
		link.href = strData;
		link.click();
		document.body.removeChild(link); 
	} 
	else 
	{
		location.replace(uri);
	}
}; 






function fname_s_0332(src, callback) 
{
	var image = new Image();
	image.crossOrigin = 'Anonymous';
 
	image.onload = function() {
		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		canvas.height = this.naturalHeight;
		canvas.width = this.naturalWidth;		
		context.fillStyle = '#fff';  
		context.fillRect(0, 0, canvas.width, canvas.height);		
		context.drawImage(this, 0, 0);
		var dataURL = canvas.toDataURL('image/jpeg', 0.7);	 	
		callback(dataURL);
	};

	image.src = src;
}




function fname_s_0333() 
{
	if(myCameraOrbit.activeCam.userData.isCam3D) return;
		
	var arr_2 = [];
	var svg = document.querySelector('#svgFrame');

	var wall = infProject.scene.array.wall;
	var floor = infProject.scene.array.floor;
	
	{
		var arr = [];
		for ( var i = 0; i < wall.length; i++ )
		{ 		
			if(wall[i].userData.wall.html.label)
			{
				for ( var i2 = 0; i2 < wall[i].userData.wall.html.label.length; i2++ )
				{
					arr[arr.length] = wall[i].userData.wall.html.label[i2];
				}
			}					
		}
		
		for ( var i = 0; i < floor.length; i++ )
		{
			arr[arr.length] = floor[i].userData.room.html.label;
		}
		

		
		for ( var i = 0; i < arr.length; i++ )
		{
			var label = arr[i];
			
			var txt = document.createElementNS(infProject.settings.svg.tag, "text");								
			
			var x = label.userData.elem.x;
			var y = label.userData.elem.y;				
			
			
			var rotate = 'rotate('+THREE.Math.radToDeg(label.userData.elem.rot)+','+x+','+y+')';
			
			txt.setAttribute('x', x);
			txt.setAttribute('y', y);
			
			
			
			txt.setAttribute('fill', 'rgba(0,0,0,0.4)');
			txt.setAttribute('transform', rotate);
			txt.setAttribute('dominant-baseline', 'middle');
			txt.setAttribute('text-anchor', 'middle');

			txt.style.cssText += infProject.settings.html.fonts.wall.size; 
			txt.style.cssText += infProject.settings.html.fonts.wall.type;
			
			txt.textContent = label.innerText;

			svg.appendChild(txt);
			
			arr_2[arr_2.length] = txt;
		}	
	}

	{
		var arr = [];
		
		var size = infProject.html.furn.size;
		var offset = infProject.html.furn.offset;
		
		for ( var i = 0; i < size.length; i++ )
		{
			arr[arr.length] = size[i];
		}
		
		for ( var i = 0; i < offset.length; i++ )
		{
			arr[arr.length] = offset[i];
		}

		for ( var i = 0; i < arr.length; i++ )
		{
			var label = arr[i];
			var x = label.userData.elem.x;
			var y = label.userData.elem.y;			
			
			
			if(1==2)
			{
				
				
				var txt = document.createElementNS(infProject.settings.svg.tag, "rect");
				
				var translate = 'translate('+ ((label.clientWidth/2)*-1) +','+ ((label.clientHeight/2)*-1) +')';
				var rotate = 'rotate('+THREE.Math.radToDeg(label.userData.elem.rot)+','+(x)+','+(y)+')';
				
				txt.setAttribute('x', x);
				txt.setAttribute('y', y);
				txt.setAttribute('transform', translate+rotate);				
				txt.setAttribute('width', label.clientWidth);
				txt.setAttribute('height', label.clientHeight);
				txt.setAttribute('stroke', '#ff0000');
				txt.setAttribute('fill', '#ffffff');
				
				
				
				
				
				
				svg.appendChild(txt); 
				arr_2[arr_2.length] = txt;
			}
			
			var txt = document.createElementNS(infProject.settings.svg.tag, "text");															
			
			
			var rotate = 'rotate('+THREE.Math.radToDeg(label.userData.elem.rot)+','+x+','+y+')';
			
			txt.setAttribute('x', x);
			txt.setAttribute('y', y);
			
			
			
			txt.setAttribute('fill', 'rgba(0,0,0,0.4)');
			txt.setAttribute('transform', rotate);
			txt.setAttribute('dominant-baseline', 'middle');
			txt.setAttribute('text-anchor', 'middle');

			txt.style.cssText += infProject.settings.html.fonts.wall.size; 
			txt.style.cssText += infProject.settings.html.fonts.wall.type;
			
			txt.textContent = label.innerText;

			svg.appendChild(txt);
			
			arr_2[arr_2.length] = txt;
		}		
	}
	

	
	

 
	
	svg.setAttribute('width', svg.clientWidth);
	svg.setAttribute('height', svg.clientHeight);
	var svgString = new XMLSerializer().serializeToString(svg);

	

	var canvas = document.createElement("canvas");
	canvas.width = svg.clientWidth;
	canvas.height = svg.clientHeight;
	var ctx = canvas.getContext("2d");
	var DOMURL = self.URL || self.webkitURL || self;
	var img = new Image();
	var svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
	var url = DOMURL.createObjectURL(svg);

	img.onload = function() 
	{				
		if(1==2)
		{
			ctx.drawImage(img, 0, 0);
			
			var strMime = "image/png";
			var imgData = canvas.toDataURL(strMime);	
			

			openFileImage(imgData.replace(strMime, "image/octet-stream"), "screenshot.png");	

			DOMURL.revokeObjectURL(imgData);
		}
		else
		{
			arrImg_2 = img;
			fname_s_0334();			
		}
	};
	img.src = url;	
	

	for ( var i = 0; i < arr_2.length; i++ )
	{
		arr_2[i].remove();
	}	
}



function fname_s_0334() 
{	
	if(arrImg_1 && arrImg_2)
	{
		
		
		
		var svg = document.querySelector('#svgFrame');
		var canvas = document.createElement("canvas");
		canvas.width = svg.clientWidth;
		canvas.height = svg.clientHeight;
		var ctx = canvas.getContext("2d");

		ctx.drawImage(arrImg_1, 0, 0);
		ctx.drawImage(arrImg_2, 0, 0);

		var strMime = "image/png";
		var imgData = canvas.toDataURL(strMime);	

		openFileImage(imgData.replace(strMime, "image/octet-stream"), "screenshot.png");	

		var DOMURL = self.URL || self.webkitURL || self;
		DOMURL.revokeObjectURL(imgData);

		arrImg_1 = null;
		arrImg_2 = null;
	}
}




function fname_s_0335() 
{

	var svg = document.querySelector('#svgFrame');
	svg.setAttribute('width', svg.clientWidth);
	svg.setAttribute('height', svg.clientHeight);
	var svgString = new XMLSerializer().serializeToString(svg);

	

	var canvas = document.createElement("canvas");
	canvas.width = svg.clientWidth;
	canvas.height = svg.clientHeight;
	var ctx = canvas.getContext("2d");
	var DOMURL = self.URL || self.webkitURL || self;
	var img = new Image();
	var svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
	var url = DOMURL.createObjectURL(svg);

	img.onload = function() 
	{
		ctx.drawImage(img, 0, 0);
		
		var strMime = "image/png";
		var imgData = canvas.toDataURL(strMime);	
		

		openFileImage(imgData.replace(strMime, "image/octet-stream"), "screenshot.png");	

		DOMURL.revokeObjectURL(imgData);
	};
	img.src = url;	

}










class BtnDropList 
{
	wrapDiv = null;
	wrapModal = null;
	modalList = null;
	btnItem = null;
	
	constructor({containerId, name, data})
	{
		this.initBtn({containerId, name, data});
	}
	
	initBtn({containerId, name, data})
	{
		const container = document.querySelector('[nameId="'+containerId+'"]');
		
		const div = document.createElement('div');
		div.innerHTML = this.html({name});
		const elem = div.children[0];
		container.append(elem);	
		
		this.wrapDiv = document.querySelector('[nameId="wrapDiv"]');
		
		this.wrapModal = this.initModal({name});
		this.wrapModal.style.display = 'none';
		
		this.modalList = this.wrapModal.querySelector('[nameId="modal_list"]');
		this.initList({data});
		
		this.btnItem = container.querySelector('[nameId="btn_obj_item"]');
		this.initEventClickBtn({name: data[0].name, src: data[0].src, func: data[0].func});
		
		const btnDrop = container.querySelector('[nameId="btn_drop_item"]');
		btnDrop.onmousedown = () => 
		{ 
			if(this.isActive())
			{
				this.showModal({el: btnDrop});
				this.initEventModal();				
			}
		}
	}
	
	
		html({name})
	{
		const html = `
		<div>
			<div style="margin-bottom: 5px; font-size: 14px; color: #737373; text-align: center;">${name}</div>
			<div class="wrap_btn_drop_down_list_1">			
				<div nameId="btn_obj_item" class="item_1"></div>
				<div nameId="btn_drop_item" class="item_2">
					<div style="display: flex; justify-content: center; align-items: center; width: 16px; height: 16px; margin: 3px 3px 3px 0;">
						<img src="${infProject.path}img/svg/input_dropdown.svg" style="width: 16px; height: 16px;">
					</div>							
				</div>
			</div>
		</div>`;

		return html;
	}
	
		initModal({name})
	{
		const div = document.createElement('div');
		div.innerHTML = `
		<div class="div_drop_down_modal">
			<div style="margin: 10px auto; text-align: center; font-size: 18px;">${name}</div>
			<div class="div_drop_down_list" nameId="modal_list"></div>
			<div style="margin: 20px;"></div>
		</div>`;
		const elem = div.children[0];
		
		this.wrapDiv.append(elem);

		return elem;
	}
	
		initList({data})
	{
		const style = `
		margin: 10px;
		cursor: pointer;
		width: 100px;`;
		
		const style2 = `
		width: 100px;
		height: 100px;
		background: #fff;
		border-radius: 4px;
		border: 1px solid #D1D1D1;`;
		
		const styleImg = `
		display: block;
		width: 95%;
		margin: auto;
		object-fit: contain;`;		

		const styleTxt = `
		margin: 10px auto;`;
		
		for ( let i = 0; i < data.length; i++ )
		{
			const div = document.createElement('div');
			div.innerHTML = `
			<div style="${style}">
				<div style="${style2}">
					<img src="${infProject.path+data[i].src}" style="${styleImg}">
				</div>
				<div style="${styleTxt}">${data[i].name}</div>
			</div>`;
			const elem = div.children[0];
			
			this.modalList.append(elem);

			elem.onmousedown = (event) => 
			{
				if(this.isActive())
				{
					data[i].func();
					this.initEventClickBtn({name: data[i].name, src: data[i].src, func: data[i].func});				
				}

				
				document.removeEventListener('mousedown', this.closeModal);
				this.wrapModal.style.display = 'none';
				this.wrapDiv.style.display = 'none';				
			}				
		}
		
	}
	
		showModal({el})
	{
		this.wrapDiv.style.display = 'block';
		
		let rect = el.getBoundingClientRect();
		
		this.wrapModal.style.display = '';
		
		let top = (rect.top + rect.height/2 - this.wrapModal.clientHeight);		
		if(top < 10) { top = 10; }
		this.wrapModal.style.top = top+'px';
		this.wrapModal.style.left = (rect.left + rect.width/2 - this.wrapModal.clientWidth)+'px';		
	}



	closeModal = (event) =>
	{ 
		if (!this.wrapModal.contains(event.target)) 
		{ 			 
			document.removeEventListener('mousedown', this.closeModal);
			this.wrapModal.style.display = 'none';
			this.wrapDiv.style.display = 'none';
		}
	}
	
		initEventModal()
	{ 		
		document.addEventListener('mousedown', this.closeModal);		
	}	
	
		initEventClickBtn({src, func})
	{
		const styleImg = `
		display: block;
		height: 95%;
		margin: auto;
		object-fit: contain;`;
		
		this.btnItem.innerHTML = `<img src="${infProject.path+src}" style="${styleImg}">`;
		this.btnItem.onmousedown = () => 
		{ 		
			if(this.isActive()) func();
		}
	}
	
		isActive()
	{
		return (myCameraOrbit.activeCam.userData.isCam2D) ? true : false;
	}
}
















class MyLevels 
{
	levels = [];
	activeId = 0;
	activeLevel = null;
	
	constructor()
	{
		this.initLevels();
		this.activeId = 0;
		this.activeLevel = this.levels[this.activeId];
	}
	
	initLevels()
	{
		const count = 4;
		
		for ( let i = 0; i < count; i++ )
		{
			this.levels[i] = {};
			this.levels[i].wall = [];
			this.levels[i].point = [];
			this.levels[i].window = [];
			this.levels[i].door = [];		
			this.levels[i].floor = [];
			this.levels[i].ceiling = [];
			this.levels[i].obj = [];
			this.levels[i].roof = [];
			this.levels[i].height = 2.8;		
		}
	}
	
		activateLevel(id)
	{
		this.activeId = id;
		
		this.updateArrScene(id);

		fname_s_0268();
		if(myCameraOrbit.activeCam.userData.isCam2D)  
		{
			fname_s_0270();
		}
		else if(myCameraOrbit.activeCam.userData.isCam3D)
		{
			if(divLevelVisible.wallTransparent && myCameraOrbit.activeCam.userData.type === 'fly') fname_s_0269();
			else fname_s_0270();
		}
		
		if(myCameraOrbit.activeCam.userData.isCam2D) fname_s_0193({resize: true});

		tabLevel.levelBackground_UI({id});		}
	
		updateArrLevel()
	{
		const arr = {};
		arr.wall = infProject.scene.array.wall;
		arr.point = infProject.scene.array.point;
		arr.window = infProject.scene.array.window;
		arr.door = infProject.scene.array.door;
		arr.obj = infProject.scene.array.obj;
		arr.floor = infProject.scene.array.floor;
		arr.ceiling = infProject.scene.array.ceiling;
		arr.roof = infProject.scene.array.roof;	
		arr.height = infProject.settings.height;
		
		this.levels[this.activeId] = arr;	
	}

		updateArrScene(id)
	{
		const arr = this.levels[id];
		
		obj_point = arr.point;
		room = arr.floor;
		ceiling = arr.ceiling;

		infProject.scene.array.wall = arr.wall;
		infProject.scene.array.point = arr.point;
		infProject.scene.array.window = arr.window;
		infProject.scene.array.door = arr.door;	
		infProject.scene.array.floor = arr.floor;
		infProject.scene.array.ceiling = arr.ceiling;
		infProject.scene.array.obj = arr.obj;
		infProject.scene.array.roof = arr.roof;
		infProject.settings.height = arr.height;	
	}

		deactiveLevel()
	{
		fname_s_0268();
		fname_s_0270();
		fname_s_0189();
		
		this.updateArrLevel();
		
		fname_s_0336()
	}


		switchLevel(id)
	{	
		if(this.activeId === id) return;
		
		myComposerRenderer.outlineRemoveObj();
		fname_s_0217();
		
		const posY = this.getLevelPos0({lastId: this.activeId, newId: id});
		
		this.deactiveLevel();
		
		this.activateLevel(id);
		
		for ( let i = 0; i < this.levels.length; i++ )
		{
			this.changePosYLevel(posY, i);
		}
		
		fname_s_085();	
		
		this.changeVisibleLevels();
		
		if(myCameraOrbit.activeCam.userData.isCam2D) 
		{
			ghostLevel.createLevel();				this.visibleLevelCam2D(id, true);
		}
		
		if(myCameraOrbit.activeCam.userData.isCam3D)
		{
			this.visibleLevelCam3D(id, true);
		}		
	}


		setHeightWallLevel({value, id}) 
	{	
		const level = this.levels;
		const posY = level[id].height - value; 

		level[id].height = value;
		
		if(this.activeId === id) infProject.settings.height = value;
		
				if(1===1)
		{
			fname_s_037( level[id].wall );
			
			for ( let i = 0; i < level[id].wall.length; i++ )
			{
				let v = level[id].wall[i].geometry.vertices;
				
				v[1].y = value;
				v[3].y = value;
				v[5].y = value;
				v[7].y = value;
				v[9].y = value;
				v[11].y = value;
				level[id].wall[i].geometry.verticesNeedUpdate = true;
				level[id].wall[i].geometry.elementsNeedUpdate = true;
				
				level[id].wall[i].userData.wall.height_1 = value;
			}
			
			fname_s_040( level[id].wall );
			fname_s_038( level[id].wall );

			const floor = level[id].floor;
			const ceiling = level[id].ceiling;
			const roof = level[id].roof;
			
			for ( let i = 0; i < floor.length; i++ ) ceiling[i].position.set( 0, floor[i].position.y + value, 0 );
					}
		
		if(this.activeId > id)
		{
			for ( let i = 0; i < level.length; i++ )
			{
				if(i > id) continue;					
				this.changePosYLevel(-posY, i);
			}		
		}
		else
		{
			for ( let i = 0; i < level.length; i++ )
			{
				if(i <= id) continue;			
				this.changePosYLevel(posY, i);
			}				
		}
		
		renderCamera();
	}


		getLevelPos0({lastId, newId})
	{
		const level = this.levels;
		let sumY1 = 0;
		let sumY2 = 0;
		
		for ( let i = 0; i < level.length; i++ )
		{
			if(i === lastId) break;
			sumY1 += level[i].height;		
		}
		
		for ( let i = 0; i < level.length; i++ )
		{
			if(i === newId) break;
			sumY2 += level[i].height;		
		}
		
		const posY = sumY2 - sumY1;

		return posY;
	}


		changePosYLevel(posY, id)
	{
		const { walls, points, floors, ceilings, objs, roofs } = this.getDestructObject(id);

		for ( let i = 0; i < walls.length; i++ )
		{		
			walls[i].position.y = walls[i].position.y - posY;
			
			for ( var i2 = 0; i2 < walls[i].userData.wall.arrO.length; i2++ )
			{
				walls[i].userData.wall.arrO[i2].position.y = walls[i].userData.wall.arrO[i2].position.y - posY;
			}
		}
		if(id === 0) infProject.scene.grid.position.y = infProject.scene.grid.position.y - posY;
		for ( let i = 0; i < points.length; i++ ) points[i].position.y = points[i].position.y - posY;	
		for ( let i = 0; i < floors.length; i++ ) floors[i].position.y = floors[i].position.y - posY;
		for ( let i = 0; i < ceilings.length; i++ ) ceilings[i].position.y = ceilings[i].position.y - posY;
		for ( let i = 0; i < objs.length; i++ ) objs[i].position.y = objs[i].position.y - posY;
		for ( let i = 0; i < roofs.length; i++ ) roofs[i].position.y = roofs[i].position.y - posY;
	}


		changeVisibleLevels()
	{
		for ( let i = 0; i < this.levels.length; i++ )
		{		
			if(myCameraOrbit.activeCam.userData.isCam3D && this.activeId !== i) 
			{
				this.visibleLevelCam3D(i, divLevelVisible.showAllLevel);
			}
			if(myCameraOrbit.activeCam.userData.isCam2D && this.activeId !== i) 
			{
				this.visibleLevelCam2D(i, false);
			}		
		}
		if(myCameraOrbit.activeCam.userData.isCam2D) fname_s_0193({resize: true});		}


	visibleLevelCam2D(id, visible)
	{
		const { walls, points, doors, windows, floors, ceilings, objs, roofs } = this.getDestructObject(id);
		
		for ( let i = 0; i < points.length; i++ ) points[i].visible = visible;		
		for ( let i = 0; i < walls.length; i++ ) walls[i].visible = visible;	
		
		for ( let i = 0; i < doors.length; i++ )
		{  
			if(!doors[i].userData.door.obj3D) continue;
			doors[i].userData.door.obj3D.visible = visible;		
		}	

		for ( let i = 0; i < windows.length; i++ )
		{ 
			if(!windows[i].userData.door.obj3D) continue;
			windows[i].userData.door.obj3D.visible = visible;		
		}
		
		fname_s_086(doors, visible);		
		fname_s_086(windows, visible);		
			
		for ( let i = 0; i < floors.length; i++ ) floors[i].visible = visible;
		for ( let i = 0; i < ceilings.length; i++ ) ceilings[i].visible = visible;
		for ( let i = 0; i < objs.length; i++ ) objs[i].visible = visible;
		for ( let i = 0; i < roofs.length; i++ ) roofs[i].visible = visible;
	}
	
	visibleLevelCam3D(id, visible)
	{
		const { walls, points, doors, windows, floors, ceilings, objs, roofs } = this.getDestructObject(id);
		
		for ( let i = 0; i < points.length; i++ ) points[i].visible = false;		
		for ( let i = 0; i < walls.length; i++ ) walls[i].visible = visible;	
		
		for ( let i = 0; i < doors.length; i++ )
		{  
			if(!doors[i].userData.door.obj3D) continue;
			doors[i].userData.door.obj3D.visible = visible;		
		}	

		for ( let i = 0; i < windows.length; i++ )
		{ 
			if(!windows[i].userData.door.obj3D) continue;
			windows[i].userData.door.obj3D.visible = visible;		
		}
		
		
		fname_s_086(doors, false);		
		fname_s_086(windows, false);
			
		for ( let i = 0; i < floors.length; i++ ) floors[i].visible = visible;
		for ( let i = 0; i < ceilings.length; i++ ) ceilings[i].visible = visible;
		for ( let i = 0; i < objs.length; i++ ) objs[i].visible = visible;
		for ( let i = 0; i < roofs.length; i++ ) roofs[i].visible = visible;
	}
	

	getDestructObject(id)
	{
		const level = this.levels;
		
		const walls = level[id].wall;
		const points = level[id].point;
		const doors = level[id].door;
		const windows = level[id].window;
		const floors = level[id].floor;
		const ceilings = level[id].ceiling;
		const objs = level[id].obj;
		const roofs = level[id].roof;

		return { walls, points, doors, windows, floors, ceilings, objs, roofs };
	}
	
	
		deleteAllLevels()
	{
		for ( let i = 0; i < this.levels.length; i++ )
		{
			this.deleteOneLevel(i);
		}	
	}
	

		deleteOneLevel(id)
	{
		fname_s_0217();
		
		let { walls: wall, points: point, doors: door, windows: window, floors: floor, ceilings: ceiling, objs: obj, roofs: roof } = this.getDestructObject(id);
		
		for ( let i = 0; i < wall.length; i++ )
		{ 		
			if(wall[i].userData.wall.html.label)
			{
				for ( let i2 = 0; i2 < wall[i].userData.wall.html.label.length; i2++ )
				{
					fname_s_0140({arr: infProject.html.label, o: wall[i].userData.wall.html.label[i2]});
					wall[i].userData.wall.html.label[i2].remove();
				}
			}					
			
			wall[i].userData.wall.p = [];
			
			fname_s_0175({obj: wall[i]});
			scene.remove(wall[i]); 
		}
		
		for ( let i = 0; i < point.length; i++ )
		{ 
			fname_s_0175({obj: point[i]});
			scene.remove(point[i]); 
		}	
		
		for ( let i = 0; i < window.length; i++ )
		{ 
			fname_s_0139({obj: window[i]});	
			fname_s_0175({obj: window[i]});   
			scene.remove(window[i]); 
		}
		
		for ( let i = 0; i < door.length; i++ )
		{ 
			fname_s_0139({obj: door[i]});
			fname_s_0175({obj: door[i]}); 
			scene.remove(door[i]); 
		}	
		
		
		for ( let i = 0; i < floor.length; i++ )
		{		
			fname_s_0175({obj: floor[i]});
			fname_s_0175({obj: ceiling[i]});
			
			fname_s_0140({arr: infProject.html.label, o: floor[i].userData.room.html.label});
			floor[i].userData.room.html.label.remove(); 
			
			scene.remove(floor[i]); 
			scene.remove(ceiling[i]);	
		}
		
		for ( let i = 0; i < obj.length; i++ )
		{ 
			fname_s_0175({obj: obj[i]});
			scene.remove(obj[i]);
		}

		for ( let i = 0; i < roof.length; i++ )
		{ 
			fname_s_0175({obj: roof[i]});
			scene.remove(roof[i]);
		}
		
		this.clearLevel(id)	
	}

	
		clearLevel(id)
	{
		const level = this.levels;
		
		level[id].wall = [];
		level[id].point = [];
		level[id].door = [];
		level[id].window = [];
		level[id].floor = [];
		level[id].ceiling = [];
		level[id].obj = [];
		level[id].roof = [];
			}
}




function fname_s_0336()
{
	obj_point = [];
	room = [];
	ceiling = [];
	
	infProject.scene.array.wall = [];
	infProject.scene.array.point = [];
	infProject.scene.array.window = [];
	infProject.scene.array.door = [];	
	infProject.scene.array.floor = [];
	infProject.scene.array.ceiling = [];
	infProject.scene.array.obj = [];
	infProject.scene.array.roof = [];
	
	infProject.scene.array = resetPop.infProjectMySceneArray();	
}




function fname_s_0337(id)
{
	
	myLevels.activeId = id;
	myLevels.updateArrLevel();	
	
 	fname_s_0189();
	fname_s_0336();
}










class GhostLevel 
{
	constructor()
	{
		this.arr = {point: [], wall: [], window: [], door: []};
		this.material = {};
		this.material.point = new THREE.MeshStandardMaterial( { color : 0xcccccc } );
		let m = new THREE.MeshStandardMaterial( { color : 0xe3e3e5 } );
		this.material.wall = [m, m, m, m];
		this.material.dw = new THREE.MeshStandardMaterial( { color : 0xd1d1d1 } );
	}
	
		createLevel()
	{
		this.deleteLevel();
		
		let result = this.getLevel();
		if(result === undefined) return;
		
		let point = result.point;
		let wall = result.wall;
		let window = result.window;
		let door = result.door;

		let point2 = [];
		let wall2 = [];
		let window2 = [];
		let door2 = [];
		
		for ( let i = 0; i < point.length; i++ )
		{ 
			let p = new THREE.Mesh( infProject.tools.point.geometry, this.material.point );
			p.position.set( point[i].position.x, 0, point[i].position.z );
			scene.add(p);
			point2[point2.length] = p;
		}		
		
		for ( let i = 0; i < wall.length; i++ )
		{ 				
			wall[i].updateMatrixWorld();
			let pw = [];
			pw[0] = wall[i].localToWorld( wall[i].userData.wall.v[0].clone() ); 
			pw[1] = wall[i].localToWorld( wall[i].userData.wall.v[2].clone() ); 
			pw[2] = wall[i].localToWorld( wall[i].userData.wall.v[4].clone() ); 
			pw[3] = wall[i].localToWorld( wall[i].userData.wall.v[10].clone() ); 
			pw[4] = wall[i].localToWorld( wall[i].userData.wall.v[8].clone() ); 
			pw[5] = wall[i].localToWorld( wall[i].userData.wall.v[6].clone() );

			wall2[wall2.length] = this.crForm({arrP: pw, y: 0.02, material: this.material.wall});
		}
		
		for ( let i = 0; i < window.length; i++ )
		{ 	
			window[i].updateMatrixWorld();
			let pw = [];
			pw[0] = window[i].localToWorld( window[i].geometry.vertices[0].clone() ); 
			pw[1] = window[i].localToWorld( window[i].geometry.vertices[3].clone() ); 
			pw[2] = window[i].localToWorld( window[i].geometry.vertices[7].clone() ); 
			pw[3] = window[i].localToWorld( window[i].geometry.vertices[6].clone() );
			
			window2[window2.length] = this.crForm({arrP: pw, y: 0.03, material: this.material.dw});
		}
		
		this.arr = {wall: wall2, point: point2, window: window2, door: door2};
		
		renderCamera();		
	}
	
		getLevel()
	{
		const id = myLevels.activeId - 1;
		const level = myLevels.levels;
		
		if(id < 0) return;

		const wall = level[id].wall;
		const point = level[id].point;
		const window = level[id].window;
		const door = level[id].door;
		const height = level[id].height;
		
		return {wall, point, window, door};
	}

		crForm({arrP, y, material})
	{
		let t = [];
		for ( let i = 0; i < arrP.length; i++ ) t[i] = new THREE.Vector2 ( arrP[i].x, arrP[i].z );	 

		let geometry = new THREE.ExtrudeGeometry( new THREE.Shape( t ), { bevelEnabled: false, depth: 0.01 } )
		geometry.rotateX(Math.PI / 2);
		
		let obj = new THREE.Mesh( geometry, material );
		obj.position.y = y;
		scene.add(obj);
		
		return obj;
	}
	
		deleteLevel()
	{
		this.deleteObjs(this.arr.point);
		this.deleteObjs(this.arr.wall);
		this.deleteObjs(this.arr.window);
		this.deleteObjs(this.arr.door);

		this.arr.point = [];
		this.arr.wall = [];
		this.arr.window = [];
		this.arr.door = [];
	}
	
	deleteObjs(arrO)
	{
		for ( let i = 0; i < arrO.length; i++ )
		{			
			scene.remove( arrO[i] );
			arrO[i].geometry.dispose();
		}		
	}
}

let ghostLevel = new GhostLevel();














class Roof 
{
	constructor()
	{
		this.obj = [];
		this.material = new THREE.MeshStandardMaterial( { color : 0xff0000 } );			this.material2 = new THREE.MeshStandardMaterial( { color : 0x0000ff } );
		this.initBtn();
		this.initListColor();
	}
	
		initBtn()
	{
		const data = 
		[
			{name: 'односкатная', src: 'img/icon/roof/1.png', func: () => { fname_s_active_int({button:'add_roof', lotid: 17}) } },
			{name: 'двухскатная', src: 'img/icon/roof/2.png', func: () => { fname_s_active_int({button:'add_roof', lotid: 18}) } },
			{name: 'четырехскатная', src: 'img/icon/roof/3.png', func: () => { fname_s_active_int({button:'add_roof', lotid: 19}) } },
		];
		
				const btnDropList = new BtnDropList({containerId: 'list_btn_roof', name: 'крыша', data});		
	}
	
		initListColor()
	{
		let html = '';
		let arr = ['223594', '942a22', '947b22', '539422', '706758', 'ffffff', '8a8a8a', '292929'];
		
		let container = document.querySelector('[nameId="color_roof_1"]');
		
		for(let i = 0; i < arr.length; i++)
		{
			let div = document.createElement('div');
			div.innerHTML = `<div class="right_panel_1_1_list_item rp_list_item_texture" style="background: #${arr[i]};"></div>`;
			let elem = div.children[0];
			container.append(elem);	
			
			elem.onmousedown = () => { this.setColor({color: '0x'+arr[i]}); }
		}		
	}
	
	initRoof(inf, cdm)
	{
		let obj = inf.obj; 
		
		if(cdm.pos){ obj.position.copy(cdm.pos); }
		else
		{
			obj.position.y = 0;
			planeMath.position.y = 0; 
			planeMath.rotation.set(-Math.PI/2, 0, 0);
			planeMath.updateMatrixWorld();			
		}
		
		if(cdm.q){ obj.quaternion.set(cdm.q.x, cdm.q.y, cdm.q.z, cdm.q.w); }
		
		if(cdm.id){ obj.userData.id = cdm.id; }
		else { obj.userData.id = countId; countId++; }
		
		obj.userData.tag = 'roof';
		obj.userData.roof = {};
		obj.userData.roof.lotid = cdm.lotid;
		obj.userData.roof.nameRus = (inf.name) ? inf.name : 'крыша 1';
		obj.userData.roof.typeGroup = '';
		obj.userData.roof.helper = null;
		obj.userData.roof.box = new THREE.Vector3();
		
				obj.geometry.computeBoundingBox();
		let x = obj.geometry.boundingBox.max.x - obj.geometry.boundingBox.min.x;
		let y = obj.geometry.boundingBox.max.y - obj.geometry.boundingBox.min.y;
		let z = obj.geometry.boundingBox.max.z - obj.geometry.boundingBox.min.z;	
		obj.userData.roof.box = new THREE.Vector3(x, y, z);

		if(cdm.scale){ obj.scale.set(cdm.scale.x, cdm.scale.y, cdm.scale.z); }
		else if(!cdm.id)
		{
			let x = infProject.settings.roof.length;
			let z = infProject.settings.roof.width;
			
			obj.scale.set(x/obj.userData.roof.box.x, obj.scale.y, z/obj.userData.roof.box.z);
		}
		
		if(cdm.material)
		{
			if(cdm.material.color) this.setColor({obj, color: cdm.material.color});
		}
		
		obj.material.visible = false;
		
		infProject.scene.array.roof.push(obj);

		scene.add( obj );	
		
				let matClone = obj.children[0].material.clone();		
		obj.traverse(function(child) 
		{
			if(child.isMesh && child.userData.tag !== 'roof') 
			{ 
				child.material = matClone; 
			}
		});			
		fname_s_0214({obj: obj.children[0], material: { img: "img/load/roof_1.jpg" }, repeat: {x: 0.5, y: 0.5}, rotation: Math.PI/2, color: matClone.color });
		
		if(cdm.cursor) clickO.move = obj; 			
		renderCamera();		
	}

		clickRoof(cdm)
	{
		let obj = cdm.obj;
		let rayhit = cdm.rayhit;
		
		if(fname_s_0318( rayhit )) { return; }
		
		obj.updateMatrixWorld();
		let pos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );			 
		
		let qt = obj.quaternion.clone();		
		
	 
				if(infProject.tools.pivot.userData.pivot.obj == obj)
		{
			clickO.move = obj;		
			clickO.offset = new THREE.Vector3().subVectors( obj.position, rayhit.point );
		
			planeMath.position.copy( rayhit.point );
			planeMath.rotation.set( Math.PI/2, 0, 0 );
		}
		
		let pivot = infProject.tools.pivot;	
		pivot.visible = true;	
		pivot.userData.pivot.obj = obj;
		pivot.position.copy(pos);
		pivot.quaternion.copy(qt);
		
		if(myCameraOrbit.activeCam.userData.isCam2D) pivot.visible = false;
		else pivot.userData.pivot.axs.y.visible = true;	
		
		let gizmo = infProject.tools.gizmo;					
		gizmo.position.copy( pos );		
		gizmo.visible = true;
		gizmo.userData.gizmo.obj = obj;
		gizmo.quaternion.copy( qt );			
		
		fname_s_0236();
		
		if(myCameraOrbit.activeCam.userData.isCam2D) { myComposerRenderer.outlineRemoveObj(); }
		if(myCameraOrbit.activeCam.userData.isCam3D) { myComposerRenderer.outlineAddObj({arr: [obj]}); }
		
		tabObject.activeObjRightPanelUI_1({obj: obj});	
		fname_s_069({obj: obj, boxCircle: true, getObjRoom: true, resetPos: true});
		
		fname_s_0239({obj});
	}

		moveRoof( event )
	{	
		let intersects = fname_s_0213( event, planeMath, 'one' ); 
		
		if(intersects.length == 0) return;
		
		let obj = clickO.move;
		
		if(!clickO.actMove) clickO.actMove = true;		
		
		let pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, clickO.offset );	
		
		let pos2 = new THREE.Vector3().subVectors( pos, obj.position );
		obj.position.add( pos2 );

		infProject.tools.pivot.position.add( pos2 );
		infProject.tools.gizmo.position.add( pos2 );

		fname_s_0236();
		
		fname_s_069({obj: obj, boxCircle: true, setPos: { pos2D: new THREE.Vector2(event.clientX, event.clientY), pos3D: intersects[ 0 ].point }});
	}

	clickUpRoof(obj)
	{ 
		if(!clickO.actMove) return;

		if(myCameraOrbit.activeCam.userData.isCam3D) 
		{
			this.updateCgsRoof();			
		}				
	}
	
	cutWalls()
	{		
		let roofs = infProject.scene.array.roof;
		
		for (let i = 0; i < roofs.length; i++)
		{
			let roofMod = this.crRoofMod( roofs[i] );		
			
			this.meshBSP(roofMod);			
		}		
		
		renderCamera();			
	}


		crRoofMod( obj )
	{ 		
		obj.updateMatrixWorld(true);
		let g = obj.children[0].children[0].geometry;
		
		let geometry = new THREE.Geometry().fromBufferGeometry(g);
		
		geometry.computeFaceNormals();		
		
		var faces = geometry.faces;		
		
		let arrV = [];
		for (var i = 0; i < faces.length; i++) 
		{		
			if(faces[i].normal.z < 0.8) continue;

			var v1 = geometry.vertices[faces[i].a];
			var v2 = geometry.vertices[faces[i].b];
			var v3 = geometry.vertices[faces[i].c];							
			
			arrV[faces[i].a] = v1;
			arrV[faces[i].b] = v2;
			arrV[faces[i].c] = v3;
		}
		
		let n = arrV.length;
		
		for (var i = 0; i < geometry.vertices.length; i++)
		{
			for (var i2 = 0; i2 < arrV.length; i2++)
			{
				if(!arrV[i2]) continue;				
				if(i2 === i) continue;
				
				if(geometry.vertices[i].distanceTo( arrV[i2] ) < 0.001)
				{
					arrV[i] = geometry.vertices[i];
				}
			}			
		}		
		
		for (var i = 0; i < arrV.length; i++)
		{
			if(!arrV[i]) continue;
			arrV[i].z += 5; 		
		}
		
				geometry.verticesNeedUpdate = true; 
		geometry.elementsNeedUpdate = true;	

		let obj2 = new THREE.Mesh( geometry, this.material2 );
		obj2.position.copy(obj.position);
		obj2.rotation.copy(obj.children[0].children[0].rotation);
				obj2.scale.set(obj.scale.x, obj.scale.z, obj.scale.y);			scene.add( obj2 );

		return obj2;
	}	

	copyRoof() 
	{
		let obj = fname_s_0245();		
		if(!obj) return;	
		
		let clone = obj.clone();

		clone.userData.id = countId; countId++;
		infProject.scene.array.roof[infProject.scene.array.roof.length] = clone; 
		scene.add( clone );	
	}
	
	setColor({obj, color})
	{
		if(!obj) obj = clickO.last_obj;
		if(obj.userData.tag !== 'roof') return;
		
		for(let i = 0; i < obj.children.length; i++)
		{
			obj.children[i].material.color = new THREE.Color( Number(color) );
			obj.children[i].material.needsUpdate = true;			
		}
	}

		deleteRoof(obj)
	{ 		
		clickO = resetPop.clickO(); 
		
		fname_s_0244(obj);
		
		fname_s_0140({arr: infProject.scene.array.roof, o: obj});		
		fname_s_0175({obj: obj}); 
		scene.remove(obj); 
		
		myLevels.updateArrLevel();
	
		myComposerRenderer.outlineRemoveObj();

		this.updateCgsRoof()
	
		renderCamera();
	}

		getRayIntersect()
	{
		let ray = fname_s_0213( event, infProject.scene.array.roof, 'arr', true );	

		let rayhit = null;
		
		if(ray.length > 0)
		{   	
			for (let i = 0; i < ray.length; i++)
			{
				if(ray[i].object.userData.roof) continue;
				
				rayhit = ray[i];
				break;
			}
			
			let object = null; 
			
			if(rayhit) { object = fname_s_077({obj: rayhit.object}); }
			
			if(!object) { rayhit = null; }
			else { rayhit.object = object;  }
		}

		return rayhit;
	}
	
		upInputUI({obj})
	{			
		obj.geometry.computeBoundingBox();
		
		let minX = obj.geometry.boundingBox.min.x;
		let maxX = obj.geometry.boundingBox.max.x;
		let minY = obj.geometry.boundingBox.min.y;
		let maxY = obj.geometry.boundingBox.max.y;	
		let minZ = obj.geometry.boundingBox.min.z;
		let maxZ = obj.geometry.boundingBox.max.z;

		let x = Math.abs( (maxX - minX) * obj.scale.x );
		let y = Math.abs( (maxY - minY) * obj.scale.y );
		let z = Math.abs( (maxZ - minZ) * obj.scale.z );			
		
		$('[nameId="size-roof-length"]').val(Math.round(x * 100) / 100);
		$('[nameId="size-roof-height"]').val(Math.round(y * 100) / 100);
		$('[nameId="size-roof-width"]').val(Math.round(z * 100) / 100);	
	}	
	
	
		updateCgsRoof()
	{
		if(!myCameraOrbit.activeCam.userData.isCam3D) return;
		
		clRoof.resetWall({force: true});
		clRoof.cgs();
	}
	
		cgs()
	{
		let level = myLevels.levels;
		let arr = [];
		
		for(let i = 0; i < level.length; i++)
		{
			for(let i2 = 0; i2 < level[i].roof.length; i2++)
			{
				this.cgs_2(level[i].roof[i2]);
			}
		}
	}
	
	cgs_2(roof)
	{		
		
		
		let group = [];
		for(let i = 0; i < roof.children.length; i++)
		{
			let child = roof.children[i];
			
			let posW = child.getWorldPosition(new THREE.Vector3());
			let quaW = child.getWorldQuaternion(new THREE.Quaternion());							
			let scaW = child.getWorldScale(new THREE.Vector3());
			
			let roofClone = new THREE.Mesh(child.geometry.clone(), child.material);
			
			roofClone.position.copy( posW );
			roofClone.quaternion.copy( quaW );
			roofClone.scale.copy( scaW );
			
			this.crRoofMod_2( roofClone );
			
			group.push(roofClone);
		}
		
		for(let i = 0; i < group.length; i++)
		{
									this.cutMeshBSP(group[i]);
			group[i].geometry.dispose();
		}		
	}

	
		crRoofMod_2( obj )
	{ 		
		obj.updateMatrixWorld();
		
		let geometry = obj.geometry;
		
				geometry.computeVertexNormals();			
		let faces = geometry.faces;		
		
		let arrV = [];
		for (let i = 0; i < faces.length; i++) 
		{		
			if(faces[i].normal.y < 0.8) continue;

			let v1 = geometry.vertices[faces[i].a];
			let v2 = geometry.vertices[faces[i].b];
			let v3 = geometry.vertices[faces[i].c];							
			
			arrV[faces[i].a] = v1;
			arrV[faces[i].b] = v2;
			arrV[faces[i].c] = v3;
			
			let helperDir = false;
			if(helperDir)
			{
				let origin = v1.clone().applyMatrix4( obj.matrixWorld );
				let helper = new THREE.ArrowHelper(faces[i].normal, origin, 2, 0xff0000);
				helper.position.copy(origin);
				scene.add(helper);							
			}
		}
		

		for (let i = 0; i < geometry.vertices.length; i++)
		{
			for (let i2 = 0; i2 < arrV.length; i2++)
			{
				if(!arrV[i2]) continue;				
				if(i2 === i) continue;
				
				if(geometry.vertices[i].distanceTo( arrV[i2] ) < 0.001)
				{
					arrV[i] = geometry.vertices[i];
				}
			}			
		}		
		
		for (let i = 0; i < arrV.length; i++)
		{
			if(!arrV[i]) continue;
			arrV[i].y += 15; 		
		}
		
		geometry.verticesNeedUpdate = true; 
		geometry.elementsNeedUpdate = true;	
	}	


		cutMeshBSP(obj)
	{  
		const level = myLevels.levels;
		const w = [];
		const f = [];
		
		for(let i = 0; i < level.length; i++)
		{
			for(let i2 = 0; i2 < level[i].wall.length; i2++)
			{
				w.push(level[i].wall[i2]);
			}
			
			for(let i2 = 0; i2 < level[i].floor.length; i2++)
			{
				f.push(level[i].floor[i2]);
			}			
		}		
		
		obj.updateMatrixWorld();
		let objBSP = new ThreeBSP( obj );
		
		for ( let i = 0; i < w.length; i++ )
		{
			if(w[i].geometry.vertices.length === 0) continue;
			
			w[i].updateMatrixWorld();
			let wBSP = new ThreeBSP( w[i] );
			
			let newBSP = wBSP.subtract( objBSP );					
			w[i].geometry.dispose();				
			w[i].geometry = newBSP.toGeometry();
			
						w[i].geometry.computeFaceNormals();	
			fname_s_0218(w[i].geometry);
			for ( let i2 = 0; i2 < w[i].geometry.faces.length; i2++ )
			{
				w[i].geometry.faces[i2].normal.normalize();
				if(w[i].geometry.faces[i2].normal.z == 1) { w[i].geometry.faces[i2].materialIndex = 1; }
				else if(w[i].geometry.faces[i2].normal.z == -1) { w[i].geometry.faces[i2].materialIndex = 2; }
				else if(w[i].geometry.faces[i2].normal.x == 1) { w[i].geometry.faces[i2].materialIndex = 0; }
				else if(w[i].geometry.faces[i2].normal.x == -1) { w[i].geometry.faces[i2].materialIndex = 0; }
				else { w[i].geometry.faces[i2].materialIndex = 3; }
			}
		}
		
		for ( let i = 0; i < f.length; i++ )
		{
			if(f[i].geometry.vertices.length === 0) continue;
			
			f[i].updateMatrixWorld();
			let wBSP = new ThreeBSP( f[i] );
			
			let newBSP = wBSP.subtract( objBSP );	
			
			f[i].geometry.dispose();				
			f[i].geometry = newBSP.toGeometry();

			/*if(infProject.tools.floorPl.userData.floorId && f[i].userData.id === infProject.tools.floorPl.userData.floorId)
			{
				infProject.tools.floorPl.geometry.dispose();				
				infProject.tools.floorPl.geometry = f[i].geometry.clone();				
			}*/			
		}
	}


		resetWall({force = false} = {})   
	{
		const level = myLevels.levels;
		let count = 0;
		
		for(let i = 0; i < level.length; i++)
		{
			for(let i2 = 0; i2 < level[i].roof.length; i2++)
			{
				count++;
			}
		}	

		if(!force && count === 0) return;
		
		

		
		const arrW = [];
		const f = [];
		
		for(let i = 0; i < level.length; i++)
		{
			for(let i2 = 0; i2 < level[i].wall.length; i2++)
			{
				arrW.push(level[i].wall[i2]);
			}
			
			for(let i2 = 0; i2 < level[i].floor.length; i2++)
			{
				f.push(level[i].floor[i2]);
			}			
		}
		
		for (let i = 0; i < arrW.length; i++)
		{
			var wall = arrW[i]; 
			
						
			var p1 = wall.userData.wall.p[0].position;
			var p2 = wall.userData.wall.p[1].position;	
			var d = p1.distanceTo( p2 );		
			
			wall.geometry.dispose();
			wall.geometry = fname_s_0199(d, wall.userData.wall.height_1, wall.userData.wall.width, wall.userData.wall.offsetZ);				 
						var v = wall.geometry.vertices;
			for ( var i2 = 0; i2 < v.length; i2++ ) { v[i2] = wall.userData.wall.v[i2].clone(); }	
			wall.geometry.verticesNeedUpdate = true;
			wall.geometry.elementsNeedUpdate = true;	
			wall.geometry.computeBoundingSphere();
			fname_s_0219( wall ); 			}
	
		for ( var i = 0; i < arrW.length; i++ )
		{
			var wall = arrW[i];
			
			for ( var i2 = 0; i2 < wall.userData.wall.arrO.length; i2++ )
			{
				var wd = wall.userData.wall.arrO[i2];
				
				var wdClone = fname_s_035( wd );
				
				objsBSP = { wall : wall, wd : wdClone };		
				
				fname_s_036( wd, objsBSP );					
			}
			
			fname_s_0218(wall.geometry);
		}
		
		for ( let i = 0; i < f.length; i++ )
		{
			const p2 = [];
			for ( let i2 = 0; i2 < f[i].userData.room.p.length - 1; i2++ ) 
			{  
				const p = f[i].userData.room.p[i2];
				p2.push(new THREE.Vector2( p.position.x, p.position.z ));		
			}	 
			
			const shape = new THREE.Shape( p2 );
			const geometry = new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, depth: f[i].userData.room.height } );
			
			f[i].geometry.dispose();				
			f[i].geometry = geometry;	
		}		
	} 	
	
		changeMaterialTransparent()
	{
		let opacity = (myCameraOrbit.activeCam.userData.isCam2D) ? 0.3 : 1;
		
		let levels = myLevels.levels;
				
		for (let i = 0; i < levels.length; i++)
		{
			let roofs = levels[i].roof;
			
			for (let i2 = 0; i2 < roofs.length; i2++)
			{
				for (let i3 = 0; i3 < roofs[i2].children.length; i3++)
				{
					roofs[i2].children[i3].material.opacity = opacity;
				}			
			}					
		}
	}
}

let clRoof = new Roof();










class MyRoof 
{	
	getGeometry({x, y, z, h, x2, z2})
	{
								
		let hY = 0;				
		let g = fname_s_0197(x, y, z);
		
		let vertices = 
		[
			new THREE.Vector3(-x-x, 0, z),
			new THREE.Vector3(-x-x, y + hY, z),
			new THREE.Vector3(x-x - x2, y + h + hY, z - z2),
			new THREE.Vector3(x-x - x2, 0 + h, z - z2),
			new THREE.Vector3(x-x - x2, 0 + h, -z + z2),
			new THREE.Vector3(x-x - x2, y + h + hY, -z + z2),
			new THREE.Vector3(-x-x, y + hY, -z),
			new THREE.Vector3(-x-x, 0, -z),
		];		
		
		g.vertices = vertices;
		g.verticesNeedUpdate = true;
		this.upUvsRoof( g );

		return g;
	}

		initRoof_1()
	{
		let x = 2.5;
		let y = 0.07;
		let z = 5;
		
		let g = fname_s_0197(x, y, z);

		let hY = 0;				let h = 3;
		
		let vertices = 
		[
			new THREE.Vector3(-x, 0, z),
			new THREE.Vector3(-x, y + hY, z),
			new THREE.Vector3(x, y + h + hY, z),
			new THREE.Vector3(x, 0 + h, z),
			new THREE.Vector3(x, 0 + h, -z),
			new THREE.Vector3(x, y + h + hY, -z),
			new THREE.Vector3(-x, y + hY, -z),
			new THREE.Vector3(-x, 0, -z),
		];		
		
		g.vertices = vertices;
		g.verticesNeedUpdate = true;
		fname_s_0218(g);
		let material = new THREE.MeshStandardMaterial( { color : 0x736a5a, lightMap : lightMap_1, transparent: true, opacity: 0.3 } );
		
		let obj1 = new THREE.Mesh( g, material );		
		fname_s_0214({obj: obj1, material: { img: "img/load/roof_1.jpg" }, repeat: {x: 0.5, y: 0.5}, rotation: Math.PI/2, color: 0x3f7337 });
		
		let roof = this.getBoxRoof([obj1]);
		
		return roof;
	}


		initRoof_2()
	{
		let x = 2.5;
		let y = 0.07;
		let z = 5;
		
		let g = fname_s_0197(x, y, z);

		let hY = 0;				let h = 3;
		
		let vertices = 
		[
			new THREE.Vector3(-x-x, 0, z),
			new THREE.Vector3(-x-x, y + hY, z),
			new THREE.Vector3(x-x, y + h + hY, z),
			new THREE.Vector3(x-x, 0 + h, z),
			new THREE.Vector3(x-x, 0 + h, -z),
			new THREE.Vector3(x-x, y + h + hY, -z),
			new THREE.Vector3(-x-x, y + hY, -z),
			new THREE.Vector3(-x-x, 0, -z),
		];		
		
		g.vertices = vertices;
		g.verticesNeedUpdate = true;
				fname_s_0218(g);
		
		let material = new THREE.MeshStandardMaterial( { color : 0x736a5a, lightMap : lightMap_1, transparent: true, opacity: 0.3 } );
		
		let obj1 = new THREE.Mesh( g, material );
		
		let obj2 = new THREE.Mesh( g, material );
		obj2.rotation.y = Math.PI;				
		fname_s_0214({obj: obj1, material: { img: "img/load/roof_1.jpg" }, repeat: {x: 0.5, y: 0.5}, rotation: Math.PI/2, color: 0x3f7337 });
		
		let roof = this.getBoxRoof([obj1, obj2]);
		
		return roof;
	}

	
		initRoof_3()
	{
		const material = new THREE.MeshStandardMaterial( { color : 0x706758, lightMap : lightMap_1, transparent: true, opacity: 0.3 } );			
		const g1 = this.getGeometry({x: 2.5, y: 0.07, z: 5, h: 3, z2: 3, x2: 0});
		
		const obj1 = new THREE.Mesh( g1, material );		
		
		const obj2 = new THREE.Mesh( g1, material );
		obj2.rotation.y = Math.PI;		
		fname_s_0218(g1);
		
		const g2 = this.getGeometry({x: 2.5, y: 0.07, z: 5, h: 3, z2: 5, x2: 5 - 3});
		
		const obj3 = new THREE.Mesh( g2, material );
		
		obj3.rotation.y = Math.PI/2;		
		
		const obj4 = new THREE.Mesh( g2, material );
		obj4.rotation.y = -Math.PI/2;
		fname_s_0218(g2);
		
		fname_s_0214({obj: obj1, material: { img: "img/load/roof_1.jpg" }, repeat: {x: 0.5, y: 0.5}, rotation: Math.PI/2, color: 0x3f7337 });
		
		const roof = this.getBoxRoof([obj1, obj2, obj3, obj4]);
		
		return roof;
	}
	


		upUvsRoof( geometry )
	{ 
		geometry.faceVertexUvs[0] = [];
		let faces = geometry.faces;
		
		for (let i = 0; i < faces.length; i++) 
		{		
			let components = ['x', 'y', 'z'].sort(function(a, b) {
				return Math.abs(faces[i].normal[a]) > Math.abs(faces[i].normal[b]);
			});	


			let v1 = geometry.vertices[faces[i].a];
			let v2 = geometry.vertices[faces[i].b];
			let v3 = geometry.vertices[faces[i].c];				

			geometry.faceVertexUvs[0].push([
				new THREE.Vector2(v1[components[0]], v1[components[1]]),
				new THREE.Vector2(v2[components[0]], v2[components[1]]),
				new THREE.Vector2(v3[components[0]], v3[components[1]])
			]);
		}

		geometry.uvsNeedUpdate = true;
		geometry.elementsNeedUpdate = true;	
	}

		upDateTextureRoof({obj})
	{
		if(obj.userData.tag !== 'roof') return;
		
		const scaW = obj.getWorldScale(new THREE.Vector3());
		
		obj.children[0].traverse(function(child) 
		{
			if(child.isMesh && child.material.map) 
			{ 
				fname_s_0218(child.geometry, obj.scale)				
			}
		});		
	}
	
		getBoxRoof(arr)
	{		
		var v = [];
		
		for ( var i = 0; i < arr.length; i++ )
		{
			arr[i].updateMatrixWorld();
			arr[i].geometry.computeBoundingBox();	
			arr[i].geometry.computeBoundingSphere();

			var bound = arr[i].geometry.boundingBox;
			
			
			v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
			v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
			v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );
			v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );

			v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
			v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
			v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );
			v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );		
		}
		
		var bound = { min : { x : 999999, y : 999999, z : 999999 }, max : { x : -999999, y : -999999, z : -999999 } };
		
		for(var i = 0; i < v.length; i++)
		{
			if(v[i].x < bound.min.x) { bound.min.x = v[i].x; }
			if(v[i].x > bound.max.x) { bound.max.x = v[i].x; }
			if(v[i].y < bound.min.y) { bound.min.y = v[i].y; }
			if(v[i].y > bound.max.y) { bound.max.y = v[i].y; }			
			if(v[i].z < bound.min.z) { bound.min.z = v[i].z; }
			if(v[i].z > bound.max.z) { bound.max.z = v[i].z; }		
		}

		var x = (bound.max.x - bound.min.x);
		var y = (bound.max.y - bound.min.y);
		var z = (bound.max.z - bound.min.z);	
		
		var material = new THREE.MeshStandardMaterial({ color: 0xcccccc, transparent: true, opacity: 0.7, depthTest: false });
		var geometry = fname_s_0197(x, y, z);	
		
		var v = geometry.vertices;
		v[0].x = v[1].x = v[6].x = v[7].x = bound.min.x;
		v[3].x = v[2].x = v[5].x = v[4].x = bound.max.x;

		v[0].y = v[3].y = v[4].y = v[7].y = bound.min.y;
		v[1].y = v[2].y = v[5].y = v[6].y = bound.max.y;
		
		v[0].z = v[1].z = v[2].z = v[3].z = bound.max.z;
		v[4].z = v[5].z = v[6].z = v[7].z = bound.min.z;		
			
		geometry = new THREE.BufferGeometry().fromGeometry(geometry);	 
		var box = new THREE.Mesh( geometry, material ); 	
		
		box.updateMatrixWorld();
		box.geometry.computeBoundingBox();	
		box.geometry.computeBoundingSphere();

		for ( var i = 0; i < arr.length; i++ )
		{
			box.add(arr[i]);
		}
		
		
		return box;
	}
	

}

let myRoof = new MyRoof();











class StartProject
{
	name = 'new';
	
	constructor()
	{

	}
	
	
	init()
	{
		let paramsString = document.location.search; 		let searchParams = new URLSearchParams(paramsString);	
		let demo = searchParams.get('demo');
			
		divLevelVisible.switchShowAllLevel({value: true});
		divLevelVisible.switchWallTransparent({value: true});			
			
		if(demo)
		{
			if(demo && Number(demo) === 1) this.name = 'demo 1';
			if(demo && Number(demo) === 2) this.name = 'demo 2';
			if(demo && Number(demo) === 3) this.name = 'demo 3';
			if(demo && Number(demo) === 4) this.name = 'demo 4';
			
			
		}
		
		if(this.name === 'demo 1' || this.name === 'demo 2' || this.name === 'demo 3' || this.name === 'demo 4')
		{
			divLevelVisible.switchShowAllLevel({value: true});
			divLevelVisible.switchWallTransparent({value: false});

			let nameFile = '1.json';
			if(this.name === 'demo 1') nameFile = '1.json';
			if(this.name === 'demo 2') nameFile = '2.json';
			if(this.name === 'demo 3') nameFile = '3.json';
			if(this.name === 'demo 4') nameFile = '4.json';
			
			infProject.settings.load.file = 'demo/' + nameFile;
			infProject.settings.save.file = 'demo/' + nameFile;
			
			fname_s_0231({show: false});			
		}

		if(this.name === 'new') fname_s_0182({id: 0});
		else fname_s_0182({json: infProject.settings.load.file});
		
					}
	
	setCamera()
	{
		myCameraOrbit.centerCamera2D({arr: obj_point});
		
			
		if(this.name === 'demo 1' || this.name === 'demo 2' || this.name === 'demo 3' || this.name === 'demo 4')
		{
			if(this.name === 'demo 1')
			{
				const posCam = new THREE.Vector3(-7.439878890213777, 3.3154713496334285, 5.463682482175339);
				const posTarget = new THREE.Vector3(-0.7369679466168795, 0, 0.31786061162317836);
				myCameraOrbit.setStartPosRot3D({posCam, posTarget});											
			}
			
			if(this.name === 'demo 2')
			{
				const posCam = new THREE.Vector3(2.2750910805777775, 2.8388647719569255, 12.403319798672216);
				const posTarget = new THREE.Vector3(2.1057556450078354, 0, -0.3621427765237808);
				myCameraOrbit.setStartPosRot3D({posCam, posTarget});								
			}						
			
			if(this.name === 'demo 3')
			{
				const posCam = new THREE.Vector3(-12.980195647195652, 4.725726151717402, -12.990587090348361);
				const posTarget = new THREE.Vector3(-2.039031079023262, 0, 0.5941402268183111);
				myCameraOrbit.setStartPosRot3D({posCam, posTarget});							
			}

			if(this.name === 'demo 4')
			{
				const posCam = new THREE.Vector3(-10.150758808809238, 7.476452542725171, -9.096691766295946);
				const posTarget = new THREE.Vector3(2.0579833473162843, 0, 3.485431627682769);
				myCameraOrbit.setStartPosRot3D({posCam, posTarget});									
			}			
			
			switchCamera.clickOnBtn2D3D('3D');				
		}
		else
		{
			switchCamera.clickOnBtn2D3D('2D');
		}		
	}
}
















class MyObj 
{
	crBox()
	{
		let g = new THREE.BoxGeometry( 1, 1, 1 );
		let material = new THREE.MeshStandardMaterial( { color : 0xffffff, lightMap : lightMap_1 } );			
		let mesh = new THREE.Mesh( g, this.material2 );
		fname_s_0214({obj: mesh, material: { img: 'img/load/beton.jpg' } });				
		
		let obj = this.getBox([mesh]);
		
		return obj;
	}
	
	crSphere()
	{
		let g = new THREE.SphereGeometry( 0.5, 16, 16 );
		let material = new THREE.MeshStandardMaterial( { color : 0xffffff, lightMap : lightMap_1 } );	

		let mesh = new THREE.Mesh( g, this.material2 );
		fname_s_0214({obj: mesh, material: { img: 'img/load/beton.jpg' } });				
		
		let obj = this.getBox([mesh]);
		
		return obj;
	}
	
	crCylinder()
	{
		let g = new THREE.CylinderGeometry( 0.5, 0.5, 1, 16 );
		let material = new THREE.MeshStandardMaterial( { color : 0xffffff, lightMap : lightMap_1 } );	

		let mesh = new THREE.Mesh( g, this.material2 );
		fname_s_0214({obj: mesh, material: { img: 'img/load/beton.jpg' } });				
		
		let obj = this.getBox([mesh]);
		
		return obj;
	}	

		getBox(arr)
	{		
		var v = [];
		
		for ( var i = 0; i < arr.length; i++ )
		{
			arr[i].updateMatrixWorld();
			arr[i].geometry.computeBoundingBox();	
			arr[i].geometry.computeBoundingSphere();

			var bound = arr[i].geometry.boundingBox;
			
			
			v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
			v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
			v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );
			v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );

			v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
			v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
			v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );
			v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );		
		}
		
		var bound = { min : { x : 999999, y : 999999, z : 999999 }, max : { x : -999999, y : -999999, z : -999999 } };
		
		for(var i = 0; i < v.length; i++)
		{
			if(v[i].x < bound.min.x) { bound.min.x = v[i].x; }
			if(v[i].x > bound.max.x) { bound.max.x = v[i].x; }
			if(v[i].y < bound.min.y) { bound.min.y = v[i].y; }
			if(v[i].y > bound.max.y) { bound.max.y = v[i].y; }			
			if(v[i].z < bound.min.z) { bound.min.z = v[i].z; }
			if(v[i].z > bound.max.z) { bound.max.z = v[i].z; }		
		}

		var x = (bound.max.x - bound.min.x);
		var y = (bound.max.y - bound.min.y);
		var z = (bound.max.z - bound.min.z);	
		
		var material = new THREE.MeshStandardMaterial({ color: 0xcccccc, transparent: true, opacity: 0.7, depthTest: false });
		var geometry = fname_s_0197(x, y, z);	
		
		var v = geometry.vertices;
		v[0].x = v[1].x = v[6].x = v[7].x = bound.min.x;
		v[3].x = v[2].x = v[5].x = v[4].x = bound.max.x;

		v[0].y = v[3].y = v[4].y = v[7].y = bound.min.y;
		v[1].y = v[2].y = v[5].y = v[6].y = bound.max.y;
		
		v[0].z = v[1].z = v[2].z = v[3].z = bound.max.z;
		v[4].z = v[5].z = v[6].z = v[7].z = bound.min.z;		
			
		geometry = new THREE.BufferGeometry().fromGeometry(geometry);	 
		var box = new THREE.Mesh( geometry, material ); 	
		
		box.updateMatrixWorld();
		box.geometry.computeBoundingBox();	
		box.geometry.computeBoundingSphere();

		for ( var i = 0; i < arr.length; i++ )
		{
			box.add(arr[i]);
		}
		
		
		return box;
	}
	

		clickBtnChangeTextureObj3D({url})
	{	
		const obj = clickO.last_obj;
		
		if(!obj) return;
		if(obj.userData.tag !== 'obj') return;	
		
		fname_s_0214({obj: obj.children[0], material: { img: url } }); 	
	}
}

let myObj = new MyObj();














class MyCsgBox
{
	
	init()
	{
		let arrW = [];
		let level = myLevels.levels;
		
		for(let i = 0; i < level.length; i++)
		{
			let arr = level[i].wall.map((w) => w);
			arrW.push(...arr);
		}
		
		
		this.calc(arrW);
	}
	
	
	calc(arrW)
	{
		let material = new THREE.MeshStandardMaterial({ color: 0x0000ff, transparent: true, opacity: 1, depthTest: false });
		let geometry = fname_s_0197(0.5, 0.5, 0.5);		
		geometry = new THREE.BufferGeometry().fromGeometry(geometry);	 
		let cube = new THREE.Mesh( geometry, material ); 
		cube.position.set(2.710081044870349, 1, 1.9361552454651165);
		scene.add(cube);
		
		for(let i = 0; i < arrW.length; i++)
		{
			let box = this.getBox(arrW[i]);
			scene.add(box);
						this.containsPoint( cube.position, box );
		}
		
		renderCamera();
	}
	
		getBox(obj)
	{		
		let v = [];
		
		obj.updateMatrixWorld();
		obj.geometry.computeBoundingBox();	

		let bound = obj.geometry.boundingBox;

		v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.max.z).applyMatrix4( obj.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.max.z).applyMatrix4( obj.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.min.z).applyMatrix4( obj.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.min.z).applyMatrix4( obj.matrixWorld );

		v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.max.z).applyMatrix4( obj.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.max.z).applyMatrix4( obj.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.min.z).applyMatrix4( obj.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.min.z).applyMatrix4( obj.matrixWorld );		

		
		bound = { min : { x : Infinity, y : Infinity, z : Infinity }, max : { x : -Infinity, y : -Infinity, z : -Infinity } };
		
		for(let i = 0; i < v.length; i++)
		{
			if(v[i].x < bound.min.x) { bound.min.x = v[i].x; }
			if(v[i].x > bound.max.x) { bound.max.x = v[i].x; }
			if(v[i].y < bound.min.y) { bound.min.y = v[i].y; }
			if(v[i].y > bound.max.y) { bound.max.y = v[i].y; }			
			if(v[i].z < bound.min.z) { bound.min.z = v[i].z; }
			if(v[i].z > bound.max.z) { bound.max.z = v[i].z; }		
		}

		let x = (bound.max.x - bound.min.x);
		let y = (bound.max.y - bound.min.y);
		let z = (bound.max.z - bound.min.z);	
		
		let material = new THREE.MeshStandardMaterial({ color: 0xff0000, transparent: true, opacity: 1, depthTest: false, wireframe: true });
		let geometry = fname_s_0197(x, y, z);	
		
		v = geometry.vertices;
		v[0].x = v[1].x = v[6].x = v[7].x = bound.min.x;
		v[3].x = v[2].x = v[5].x = v[4].x = bound.max.x;

		v[0].y = v[3].y = v[4].y = v[7].y = bound.min.y;
		v[1].y = v[2].y = v[5].y = v[6].y = bound.max.y;
		
		v[0].z = v[1].z = v[2].z = v[3].z = bound.max.z;
		v[4].z = v[5].z = v[6].z = v[7].z = bound.min.z;		
			
		geometry = new THREE.BufferGeometry().fromGeometry(geometry);	 
		let box = new THREE.Mesh( geometry, material ); 	
		
		box.updateMatrixWorld();
		box.geometry.computeBoundingBox();	

		return box;
	}


	containsPoint( point, box ) 
	{
		let bound = box.geometry.boundingBox;
		
		let result = point.x < bound.min.x || point.x > bound.max.x ||
			point.y < bound.min.y || point.y > bound.max.y ||
			point.z < bound.min.z || point.z > bound.max.z ? false : true;
			
		if(result) box.material = new THREE.MeshStandardMaterial({ color: 0x00ff00, transparent: true, opacity: 1, depthTest: false, wireframe: true });	
	}		
}

let myCsgBox = new MyCsgBox();	











class MyWindows 
{
	constructor()
	{
		this.initBtn();
	}
	
	initBtn()
	{
		const data = 
		[
			{name: 'одностворчатое', src: 'img/icon/wind/1.png', func: () => { fname_s_active_int({button:'add_wind', id: 5}) } },
			{name: 'двустворчатое', src: 'img/icon/wind/2.png', func: () => { fname_s_active_int({button:'add_wind', id: 6}) } },
			{name: 'трехстворчатое', src: 'img/icon/wind/3.png', func: () => { fname_s_active_int({button:'add_wind', id: 7}) } },
			{name: 'треугольное', src: 'img/icon/wind/4.png', func: () => { fname_s_active_int({button:'add_wind', id: 8}) } },
			{name: 'треугольное', src: 'img/icon/wind/5.png', func: () => { fname_s_active_int({button:'add_wind', id: 9}) } },
		];
		
				const btnDropList = new BtnDropList({containerId: 'list_btn_wind', name: 'окно', data});	
	}
		
	createWind({id})
	{
		return this.myCrWind({id});
	}
	
	
		formaWind()
	{
		return '{"id":0, "points":[{"id":70, "pos":{"x":-0.5, "y":-0.5, "z":0}}, {"id":71, "pos":{"x":-0.5, "y":1.242102, "z":0}}, {"id":72, "pos":{"x":1.892359, "y":1.242102, "z":0}}, {"id":73, "pos":{"x":1.892359, "y":-0.5, "z":0}}, {"id":79, "pos":{"x":0.2975754, "y":1.242102, "z":0}}, {"id":81, "pos":{"x":0.2975754, "y":-0.5, "z":0}}, {"id":87, "pos":{"x":1.098457, "y":1.242102, "z":0}}, {"id":89, "pos":{"x":1.098457, "y":-0.4999999, "z":0}}], "profileAlias":"sib", "lines":[{"sID":70, "type":0, "radius":0, "id":74, "eID":71}, {"sID":71, "type":1, "radius":0, "id":75, "eID":79}, {"sID":72, "type":0, "radius":0, "id":76, "eID":73}, {"sID":73, "type":1, "radius":0, "id":77, "eID":89}, {"sID":79, "type":1, "radius":0, "id":80, "eID":87}, {"sID":81, "type":1, "radius":0, "id":82, "eID":70}, {"sID":79, "type":0, "radius":0, "id":83, "eID":81}, {"sID":87, "type":1, "radius":0, "id":88, "eID":72}, {"sID":89, "type":1, "radius":0, "id":90, "eID":81}, {"sID":87, "type":0, "radius":0, "id":91, "eID":89}], "sections":[{"id":84, "type":0, "moldingType":0, "lids":[74, 75, 83, 82], "isUnion":false, "pids":[70, 71, 79, 81], "openType":5, "parentId":0}, {"id":93, "type":0, "moldingType":0, "lids":[76, 77, 91, 88], "isUnion":false, "pids":[72, 73, 89, 87], "openType":4, "parentId":0}, {"id":94, "type":0, "moldingType":0, "lids":[80, 91, 90, 83], "isUnion":false, "pids":[79, 87, 89, 81], "openType":4, "parentId":0}], "unions":[], "outContourIDS":[79, 87, 72, 73, 89, 81, 70, 71], "version":2}';		
	}
	
		myFormaWind(type)
	{
		let arr = [];
		let contour = [];
		
				if(type === 1)
		{
			arr = [[new THREE.Vector2(-0.5,-0.5),new THREE.Vector2(-0.5,0.5),new THREE.Vector2(0.5,0.5),new THREE.Vector2(0.5,-0.5)]];
			contour = [...arr[0]];
		}
		
				if(type === 2)
		{
			arr = [
			[new THREE.Vector2(-0.5,-0.5),new THREE.Vector2(-0.5,0.5),new THREE.Vector2(0,0.5),new THREE.Vector2(0,-0.5)],
			[new THREE.Vector2(0,0.5),new THREE.Vector2(0.5,0.5),new THREE.Vector2(0.5,-0.5),new THREE.Vector2(0,-0.5)]
			];

			contour = [new THREE.Vector2(-0.5,-0.5), new THREE.Vector2(-0.5,0.5), new THREE.Vector2(0.5,0.5), new THREE.Vector2(0.5,-0.5)];
		}		
		
				if(type === 3)
		{
			arr = [
			[new THREE.Vector2(-0.75,-0.5),new THREE.Vector2(-0.75,0.5),new THREE.Vector2(-0.25,0.5),new THREE.Vector2(-0.25,-0.5)],			
			[new THREE.Vector2(-0.25,-0.5),new THREE.Vector2(-0.25,0.5),new THREE.Vector2(0.25,0.5),new THREE.Vector2(0.25,-0.5)],
			[new THREE.Vector2(-0.25,-0.5),new THREE.Vector2(-0.25,0.5),new THREE.Vector2(0.75,0.5),new THREE.Vector2(0.75,-0.5)],
			];

			contour = [new THREE.Vector2(-0.75,-0.5), new THREE.Vector2(-0.75,0.5), new THREE.Vector2(0.75,0.5), new THREE.Vector2(0.75,-0.5)];
		}
		
				if(type === 4)
		{
			arr = [[new THREE.Vector2(-0.5,-0.5),new THREE.Vector2(0.0,0.5),new THREE.Vector2(0.5,-0.5)]];
			contour = [...arr[0]];
		}

				if(type === 5)
		{
			arr = [[new THREE.Vector2(-0.5,-0.5),new THREE.Vector2(0.5,0.5),new THREE.Vector2(0.5,-0.5)]];
			contour = [...arr[0]];
		}			

		let sections = [];

		for ( let i = 0; i < arr.length; i++ )
		{
			sections.push({ userData: {p: arr[i]} });
		}

		return { sections, contour };
	}

	
		profileWind()
	{
		return  {"close":[{"matId":"in", "matType":"matte", "backGlassIndex":-1, "points":[{"y":0.028, "x":0.05447824}, {"y":0.03784855, "x":0.05447824}, {"y":0.03332422, "x":0.06753223}, {"y":0.03312475, "x":0.06788322}, {"y":0.03249204, "x":0.06863455}, {"y":0.03144919, "x":0.06890834}, {"y":0.03104536, "x":0.06896047}, {"y":0.02009192, "x":0.06896051}, {"y":0.0198582, "x":0.06896055}, {"y":0.01976655, "x":0.06941883}, {"y":0.01951668, "x":0.06979332}, {"y":0.01914626, "x":0.07004587}, {"y":0.01869293, "x":0.07013852}, {"y":-5.587935E-09, "x":0.07013852}, {"y":-2.04891E-08, "x":7.450581E-09}], "frontGlassIndex":-1}, {"matId":"out", "matType":"matte", "backGlassIndex":-1, "points":[{"y":-2.04891E-08, "x":7.450581E-09}, {"y":0.03326762, "x":0}, {"y":0.03419795, "x":0.0002924651}, {"y":0.03506099, "x":0.0008943528}, {"y":0.03565692, "x":0.001666315}, {"y":0.03983337, "x":0.01300793}, {"y":0.03983337, "x":0.01606972}], "frontGlassIndex":-1}, {"matId":"chrome", "matType":"chrome", "backGlassIndex":-1, "points":[{"y":0.03201757, "x":0.05170456}, {"y":0.03, "x":0.05170456}, {"y":0.03, "x":0.01995445}, {"y":0.03201757, "x":0.01995445}], "frontGlassIndex":-1}, {"matId":"rubber", "matType":"rubber", "backGlassIndex":1, "points":[{"y":0.03201757, "x":0.05170456}, {"y":0.04139249, "x":0.05170456}, {"y":0.04179388, "x":0.05170456}, {"y":0.04179388, "x":0.05273088}, {"y":0.0415984, "x":0.05274985}, {"y":0.04063427, "x":0.052815}, {"y":0.0395487, "x":0.05311083}, {"y":0.03849942, "x":0.05376705}, {"y":0.03826987, "x":0.05395924}, {"y":0.03812422, "x":0.05413867}, {"y":0.03784855, "x":0.05447824}], "frontGlassIndex":-1}, {"matId":"rubber", "matType":"rubber", "backGlassIndex":-1, "points":[{"y":0.03983337, "x":0.01606972}, {"y":0.03989092, "x":0.01624649}, {"y":0.03996658, "x":0.01643684}, {"y":0.04022957, "x":0.01699261}, {"y":0.0405803, "x":0.01793481}, {"y":0.04084247, "x":0.01918744}, {"y":0.04096339, "x":0.01995447}, {"y":0.04072054, "x":0.01995447}, {"y":0.03201757, "x":0.01995445}], "frontGlassIndex":7}], "handlePivot":{"y":0.044, "x":0.089}, "openbase":[{"matId":"in", "matType":"matte", "backGlassIndex":-1, "points":[{"y":0.03325864, "x":0.0189605}, {"y":0.01477454, "x":0.0189605}, {"y":0.01477454, "x":0.05840465}, {"y":0.01736655, "x":0.05840465}, {"y":0.01736655, "x":0.06881266}, {"y":0.01717211, "x":0.06928166}, {"y":0.01663017, "x":0.0698236}, {"y":0.01616117, "x":0.07001805}, {"y":-1.862645E-09, "x":0.07001805}, {"y":-1.862645E-09, "x":4.898587E-18}], "frontGlassIndex":-1}, {"matId":"out", "matType":"matte", "backGlassIndex":-1, "points":[{"y":-1.862645E-09, "x":4.898587E-18}, {"y":0.03058747, "x":-4.618575E-09}, {"y":0.03162217, "x":0.0003262545}, {"y":0.03259628, "x":0.001008116}, {"y":0.033257, "x":0.001868631}, {"y":0.03729935, "x":0.0129647}, {"y":0.03729935, "x":0.01597813}], "frontGlassIndex":-1}, {"matId":"rubber", "matType":"rubber", "backGlassIndex":-1, "points":[{"y":0.03729935, "x":0.01597813}, {"y":0.03726458, "x":0.01629467}, {"y":0.03699952, "x":0.01722378}, {"y":0.03621709, "x":0.01816234}, {"y":0.03512766, "x":0.01875439}, {"y":0.03390681, "x":0.0189605}, {"y":0.03325864, "x":0.0189605}], "frontGlassIndex":-1}], "rotatePivot":{"y":0.004, "x":0.075}, "alias":"sib", "open":[{"matId":"out", "matType":"matte", "backGlassIndex":-1, "points":[{"y":0.02931766, "x":0.07001805}, {"y":0.02931765, "x":0.01896051}, {"y":0.03303936, "x":0.01896051}, {"y":0.03769927, "x":0.01896051}, {"y":0.08259266, "x":0.01896051}, {"y":0.08352298, "x":0.01925298}, {"y":0.08438603, "x":0.01985487}, {"y":0.08498196, "x":0.02062683}, {"y":0.0891584, "x":0.03196844}, {"y":0.0891584, "x":0.03503023}, {"y":0.08921596, "x":0.035207}, {"y":0.08929162, "x":0.03539735}, {"y":0.0895546, "x":0.03595312}, {"y":0.08990533, "x":0.03689532}, {"y":0.0901675, "x":0.03814796}, {"y":0.09028842, "x":0.03891498}, {"y":0.09004557, "x":0.03891498}, {"y":0.0813426, "x":0.03891496}], "frontGlassIndex":-1}, {"matId":"in", "matType":"matte", "backGlassIndex":-1, "points":[{"y":0.08134261, "x":0.07066508}, {"y":0.09071752, "x":0.07066508}, {"y":0.09111892, "x":0.07066508}, {"y":0.09111891, "x":0.07169139}, {"y":0.09092344, "x":0.07171036}, {"y":0.0899593, "x":0.07177551}, {"y":0.08887374, "x":0.07207134}, {"y":0.08782446, "x":0.07272756}, {"y":0.0875949, "x":0.07291976}, {"y":0.08744925, "x":0.07309918}, {"y":0.08717359, "x":0.07343875}, {"y":0.08264925, "x":0.08649275}, {"y":0.08244979, "x":0.08684373}, {"y":0.08181708, "x":0.08759506}, {"y":0.08077423, "x":0.08786885}, {"y":0.0803704, "x":0.08792098}, {"y":0.06941695, "x":0.08792102}, {"y":0.06918323, "x":0.08792107}, {"y":0.06909159, "x":0.08837934}, {"y":0.06884172, "x":0.08875383}, {"y":0.0684713, "x":0.08900638}, {"y":0.06801796, "x":0.08909903}, {"y":0.02931767, "x":0.08909903}, {"y":0.01378862, "x":0.08909903}, {"y":0.01207542, "x":0.08875267}, {"y":0.01067554, "x":0.08780839}, {"y":0.009731265, "x":0.08640848}, {"y":0.009384886, "x":0.08469532}, {"y":0.00938489, "x":0.07296573}, {"y":0.009616737, "x":0.07181899}, {"y":0.01024879, "x":0.07088195}, {"y":0.01118581, "x":0.0702499}, {"y":0.01233255, "x":0.07001804}, {"y":0.02931766, "x":0.07001805}], "frontGlassIndex":-1}, {"matId":"chrome", "matType":"chrome", "backGlassIndex":-1, "points":[{"y":0.0813426, "x":0.07066508}, {"y":0.08, "x":0.07066508}, {"y":0.08, "x":0.03891496}, {"y":0.0813426, "x":0.03891496}], "frontGlassIndex":-1}, {"matId":"rubber", "matType":"rubber", "backGlassIndex":-1, "points":[{"y":0.0891584, "x":0.03503023}, {"y":0.08921596, "x":0.035207}, {"y":0.08929162, "x":0.03539735}, {"y":0.0895546, "x":0.03595312}, {"y":0.08990533, "x":0.03689532}, {"y":0.0901675, "x":0.03814796}, {"y":0.09028842, "x":0.03891498}, {"y":0.09004557, "x":0.03891498}, {"y":0.0813426, "x":0.03891496}], "frontGlassIndex":7}, {"matId":"rubber", "matType":"rubber", "backGlassIndex":1, "points":[{"y":0.08134261, "x":0.07066508}, {"y":0.09071752, "x":0.07066508}, {"y":0.09111892, "x":0.07066508}, {"y":0.09111891, "x":0.07169139}, {"y":0.09092344, "x":0.07171036}, {"y":0.0899593, "x":0.07177551}, {"y":0.08887374, "x":0.07207134}, {"y":0.08782446, "x":0.07272756}, {"y":0.0875949, "x":0.07291976}, {"y":0.08744925, "x":0.07309918}, {"y":0.08717359, "x":0.07343875}], "frontGlassIndex":-1}], "caption":"SibDesign", "outbase":[{"matId":"in", "matType":"matte", "backGlassIndex":-1, "points":[{"y":0, "x":0.07013854}, {"y":-0.03058747, "x":0.07013854}, {"y":-0.03058747, "x":0}], "frontGlassIndex":-1}, {"matId":"out", "matType":"matte", "backGlassIndex":-1, "points":[{"y":-0.03058747, "x":0}, {"y":0, "x":0}, {"y":0, "x":0.07013854}], "frontGlassIndex":-1}]};		
	}

	
		myCrWind({id})
	{
		const setXJ = this.profileWind();
		const js_1 = this.myFormaWind(id);
				
						
		var group = new THREE.Group();			
				for ( var i = 0; i < setXJ.close.length; i++ )
		{ 
			var point_room = [];
			
			for ( var i2 = 0; i2 < setXJ.close[i].points.length; i2++ ) 
			{
				point_room[i2] = new THREE.Vector2 ( -setXJ.close[i].points[i2].y, setXJ.close[i].points[i2].x );	
			}
			
			var shape = new THREE.Shape( point_room );				
			shape.autoClose = true;
			
						if(1==2)
			{
				var points = shape.getPoints();
				var geometryPoints = new THREE.BufferGeometry().setFromPoints( points );
				var line = new THREE.Line( geometryPoints, new THREE.LineBasicMaterial({color: 0x222222}) );	
				scene.add( line );					
			}

			var colorWD = this.getMaterialParamWindow(setXJ.close[i].matType);
			
			for ( var i2 = 0; i2 < js_1.sections.length; i2++ ) 
			{		
								
				if(setXJ.close[i].matType == 'chrome')
				{
					group.add(this.crGlassParamWindow(js_1.sections[i2].userData.p, setXJ.close[i].points));
				}
		
				var o = new THREE.Mesh(this.profiledContourGeometry(shape, js_1.sections[i2].userData.p, true), new THREE.MeshStandardMaterial( colorWD ) );
				group.add(o);
				
				o.geometry = new THREE.Geometry().fromBufferGeometry( o.geometry.clone() );
				o.geometry.mergeVertices();
																			}		
		}
	


		const box = this.getBox(group.children);
		box.add(group);
						box.userData.contour = js_1.contour;
				
		return box;
	}

		calcContourCSG(box)
	{
		const posW = box.getWorldPosition(new THREE.Vector3());
		const quaW = box.getWorldQuaternion(new THREE.Quaternion());							
		const scaW = box.getWorldScale(new THREE.Vector3());

				const points = [];
		const contourPoints = box.userData.contour;
		for ( let i = 0; i < contourPoints.length; i++ ) 
		{ 
			points.push(new THREE.Vector2(contourPoints[i].x * scaW.x, contourPoints[i].y * scaW.y));
		}
		
		const shape = new THREE.Shape( points );
		const geometry = new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, depth: 3 } );
		const material = new THREE.MeshStandardMaterial({ color: 0x0000ff, transparent: true, opacity: 0.3, depthTest: false });		
		const obj = new THREE.Mesh( geometry, material );

		if(!obj.geometry.boundingSphere) obj.geometry.computeBoundingSphere();
		const posCenter = obj.geometry.boundingSphere.center.clone();
		
		obj.position.copy(posW);
		obj.quaternion.copy(quaW);		
		
		let v = obj.geometry.vertices;
				for ( let i = 0; i < v.length; i++ ) { v[i].sub(posCenter); }
						obj.geometry.verticesNeedUpdate = true;
		obj.geometry.elementsNeedUpdate = true;		
		
				
		return obj;
	}
	
	
		popCrWind()
	{
		const setXJ = this.profileWind();
		const js_1 = JSON.parse(this.popFormaWind());
		
		this.getContourPointParamWindow(js_1);
		this.getSectionPointParamWindow(js_1);
		
		
		
		
		var group = new THREE.Group();			
				for ( var i = 0; i < setXJ.close.length; i++ )
		{ 
			var point_room = [];
			
			for ( var i2 = 0; i2 < setXJ.close[i].points.length; i2++ ) 
			{
				point_room[i2] = new THREE.Vector2 ( -setXJ.close[i].points[i2].y, setXJ.close[i].points[i2].x );	
			}
			
			var shape = new THREE.Shape( point_room );				
			shape.autoClose = true;
			
						if(1==1)
			{
				var points = shape.getPoints();
				var geometryPoints = new THREE.BufferGeometry().setFromPoints( points );
				var line = new THREE.Line( geometryPoints, new THREE.LineBasicMaterial({color: 0x222222}) );	
				scene.add( line );					
			}

			var colorWD = this.getMaterialParamWindow(setXJ.close[i].matType);
			
			for ( var i2 = 0; i2 < js_1.sections.length; i2++ ) 
			{		
								
				if(setXJ.close[i].matType == 'chrome')
				{
					group.add(this.crGlassParamWindow(js_1.sections[i2].userDate.p, setXJ.close[i].points));
				}
		
				var o = new THREE.Mesh(this.profiledContourGeometry(shape, js_1.sections[i2].userDate.p, true), new THREE.MeshStandardMaterial( colorWD ) );
				group.add(o);
				
				o.geometry = new THREE.Geometry().fromBufferGeometry( o.geometry.clone() );
				o.geometry.mergeVertices();
				o.geometry.computeFaceNormals();
				o.geometry.computeVertexNormals();
											}		
		}
		
		for ( var i = 0; i < setXJ.open.length; i++ )
		{ 
			var point_room = [];
			
			for ( var i2 = 0; i2 < setXJ.open[i].points.length; i2++ ) 
			{
				point_room[i2] = new THREE.Vector2 ( -setXJ.open[i].points[i2].y, setXJ.open[i].points[i2].x );	
			}
			
			var shape = new THREE.Shape( point_room );
			shape.autoClose = true;
			
						if(1==1)
			{
				var points = shape.getPoints();
				var geometryPoints = new THREE.BufferGeometry().setFromPoints( points );
				var line = new THREE.Line( geometryPoints, new THREE.LineBasicMaterial({color: 0x00ff00}) );	
				scene.add( line );					
			}	
							
		}

		for ( var i = 0; i < setXJ.openbase.length; i++ )
		{
			var point_room = [];
			
			for ( var i2 = 0; i2 < setXJ.openbase[i].points.length; i2++ ) 
			{
				point_room[i2] = new THREE.Vector2 ( -setXJ.openbase[i].points[i2].y, setXJ.openbase[i].points[i2].x );	
			}
			
			var shape = new THREE.Shape( point_room );
			shape.autoClose = true;
			
						if(1==1)
			{
				var points = shape.getPoints();
				var geometryPoints = new THREE.BufferGeometry().setFromPoints( points );
				var line = new THREE.Line( geometryPoints, new THREE.LineBasicMaterial({color: 0x0000ff}) );	
				scene.add( line );					
			}					
		}

		
				for ( var i = 0; i < setXJ.outbase.length; i++ )
		{
			var point_room = [];
			
			for ( var i2 = 0; i2 < setXJ.outbase[i].points.length; i2++ ) 
			{
				point_room[i2] = new THREE.Vector2 ( -setXJ.outbase[i].points[i2].y, setXJ.outbase[i].points[i2].x );	
			}
			
			var shape = new THREE.Shape( point_room );
			shape.autoClose = true;
			
						if(1==1)
			{
				var points = shape.getPoints();
				var geometryPoints = new THREE.BufferGeometry().setFromPoints( points );
				var line = new THREE.Line( geometryPoints, new THREE.LineBasicMaterial({color: 0xff0000}) );	
				scene.add( line );					
			}

			/*colorWD = getMaterialParamWindow(setXJ.outbase[i].matType);
			var o = new THREE.Mesh(ProfiledContourGeometry(shape, pathV, true), new THREE.MeshStandardMaterial( colorWD ) );
			group.add(o);
		
			o.geometry = new THREE.Geometry().fromBufferGeometry( o.geometry.clone() );
			o.geometry.mergeVertices();
			upUvs_3( o );	*/
			
					}

		scene.add(group);
	}


		getContourPointParamWindow(js_1)
	{
		var arr = [];
		
		for ( var i = 0; i < js_1.outContourIDS.length; i++ )
		{
			for ( var i2 = 0; i2 < js_1.points.length; i2++ ) 
			{  
				if(js_1.outContourIDS[i] == js_1.points[i2].id)
				{
					var n = arr.length;				
					arr[n] = {};
					arr[n].pos = new THREE.Vector2( js_1.points[i2].pos.x, js_1.points[i2].pos.y);
					arr[n].id = js_1.outContourIDS[i];
					
					
					
					break;
				}				
			}						
		}
		
		
		var point = [];
		
		for ( var i = 0; i < arr.length; i++ )
		{
			point[point.length] = arr[i].pos;
		}

				if(1==1)
		{
			var shape = new THREE.Shape( point );
			shape.autoClose = true;
			var geometryPoints = new THREE.BufferGeometry().setFromPoints( shape.getPoints() );
			var line = new THREE.Line( geometryPoints, new THREE.LineBasicMaterial( { color : 0xff0000, transparent: true, opacity: 1, depthTest: false } ) );	
			scene.add( line );		
		}
		
		
				
		return point;
	}


		getSectionPointParamWindow(js_1)
	{
		
		var pathV_2 = [];				var colorLine = { color : 0xff0000, transparent: true, opacity: 1, depthTest: false };
		
		for ( var i = 0; i < js_1.sections.length; i++ ) 
		{  
			pathV_2[i] = [];		
			
			for ( var i2 = 0; i2 < js_1.sections[i].pids.length; i2++ )
			{
				for ( var i3 = 0; i3 < js_1.points.length; i3++ ) 
				{  
					if(js_1.sections[i].pids[i2] == js_1.points[i3].id)
					{
						pathV_2[i][i2] = {};
						pathV_2[i][i2].pos = new THREE.Vector2( js_1.points[i3].pos.x, js_1.points[i3].pos.y);
						pathV_2[i][i2].id = js_1.points[i3].id;
						
												
						break;
					}				
				}						
			}							
					
		}
		
		
		for ( var i = 0; i < pathV_2.length; i++ )
		{
						
			var point = [];
			
			for ( var i2 = 0; i2 < pathV_2[i].length; i2++ )
			{
				point[point.length] = pathV_2[i][i2].pos;
			}

			js_1.sections[i].userDate = {p: point};
			
						if(1==1)
			{
				var shape = new THREE.Shape( point );
				shape.autoClose = true;
				var points = shape.getPoints();
				var geometryPoints = new THREE.BufferGeometry().setFromPoints( points );
				var line = new THREE.Line( geometryPoints, new THREE.LineBasicMaterial( colorLine ) );	
				scene.add( line );	
			}			
		}
		
		
		return pathV_2;
	}


		getMaterialParamWindow(matType)
	{
		var colorWD = { color : 0xffffff, lightMap : lightMap_1 };
		
		if(matType == 'matte'){}
		else if(matType == 'chrome'){ colorWD.color = 0xcccccc; }
		else if(matType == 'rubber'){ colorWD.color = 0x222222; }
		
		return colorWD;
	}


		profiledContourGeometry(profileShape, contour, contourClosed) 
	{
		contourClosed = contourClosed !== undefined ? contourClosed : true;

		let profileGeometry = new THREE.ShapeBufferGeometry(profileShape);
		profileGeometry.rotateX(Math.PI * .5);
		let profile = profileGeometry.attributes.position;

		let profilePoints = new Float32Array(profile.count * contour.length * 3);

		for (let i = 0; i < contour.length; i++) 
		{
			let v1 = new THREE.Vector2().subVectors(contour[i - 1 < 0 ? contour.length - 1 : i - 1], contour[i]);
			let v2 = new THREE.Vector2().subVectors(contour[i + 1 == contour.length ? 0 : i + 1], contour[i]);
			let angle = v2.angle() - v1.angle();
			let halfAngle = angle * .5;

			let hA = halfAngle;
			let tA = v2.angle() + Math.PI * .5;
			if (!contourClosed)
			{
				if (i == 0 || i == contour.length - 1) {hA = Math.PI * .5;}
				if (i == contour.length - 1) {tA = v1.angle() - Math.PI * .5;}
			}

			let shift = Math.tan(hA - Math.PI * .5);
						let shiftMatrix = new THREE.Matrix4().set(
				1, 0, 0, 0, -shift, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1
			);


			let tempAngle = tA;
			let rotationMatrix = new THREE.Matrix4().set(
				Math.cos(tempAngle), -Math.sin(tempAngle), 0, 0,
				Math.sin(tempAngle), Math.cos(tempAngle), 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1
			);

			let translationMatrix = new THREE.Matrix4().set(
				1, 0, 0, contour[i].x,
				0, 1, 0, contour[i].y,
				0, 0, 1, 0,
				0, 0, 0, 1,
			);

			let cloneProfile = profile.clone();
			shiftMatrix.applyToBufferAttribute(cloneProfile);
			rotationMatrix.applyToBufferAttribute(cloneProfile);
			translationMatrix.applyToBufferAttribute(cloneProfile);

			profilePoints.set(cloneProfile.array, cloneProfile.count * i * 3);
		}

		let fullProfileGeometry = new THREE.BufferGeometry();
		fullProfileGeometry.addAttribute("position", new THREE.BufferAttribute(profilePoints, 3));
		let index = [];
		
		let lastCorner = contourClosed == false ? contour.length - 1: contour.length;
		for (let i = 0; i < lastCorner; i++) 
		{
			for (let j = 0; j < profile.count; j++) 
			{
				let currCorner = i;
				let nextCorner = i + 1 == contour.length ? 0 : i + 1;
				let currPoint = j;
				let nextPoint = j + 1 == profile.count ? 0 : j + 1;

				let a = nextPoint + profile.count * currCorner;
				let b = currPoint + profile.count * currCorner;
				let c = currPoint + profile.count * nextCorner;
				let d = nextPoint + profile.count * nextCorner;

				index.push(a, b, d);
				index.push(b, c, d);
			}
		}

				fullProfileGeometry.setIndex(index);
		fullProfileGeometry.computeVertexNormals();

		return fullProfileGeometry;
	}


		crGlassParamWindow(arrP, offset)
	{
		var glass = new THREE.Group();
		
		var colorLine = { color : 0xff0000, transparent: true, opacity: 1, depthTest: false };
		var mLine = []; 
		
		for ( var i2 = 0; i2 < arrP.length; i2++ )
		{
			var s1 = (i2 == 0) ? arrP.length - 1 : i2 - 1;		
			
			var x1 = arrP[s1].y - arrP[i2].y;
			var z1 = arrP[i2].x - arrP[s1].x;	
			var dir = new THREE.Vector3(x1, z1).normalize();									dir = new THREE.Vector2().addScaledVector( dir, -offset[0].x );
			
			var pos1 = arrP[i2].clone();
			var pos2 = arrP[s1].clone();
			pos1.add( dir );
			pos2.add( dir );

			mLine[mLine.length] = { p1 : new THREE.Vector3(pos1.x, 0, pos1.y), p2 : new THREE.Vector3(pos2.x, 0, pos2.y) };
		}

		
				var arrP = [];	
		for ( var i2 = 0; i2 < mLine.length; i2++ )
		{
			var i3 = (i2 == mLine.length - 1) ? 0 : i2 + 1;					
			
			var p = fname_s_08(mLine[i2].p1, mLine[i2].p2, mLine[i3].p1, mLine[i3].p2);
			
			arrP[arrP.length] = new THREE.Vector2(p.x, p.z);
		}

		
				if(1==2)
		{
			for ( var i2 = 0; i2 < arrP.length; i2++ )
			{
				var i3 = (i2 == mLine.length - 1) ? 0 : i2 + 1;	
				
				var geometry = new THREE.Geometry();
				geometry.vertices.push( new THREE.Vector3(arrP[i2].x, arrP[i2].y, 0), new THREE.Vector3(arrP[i3].x, arrP[i3].y, 0) );
				
				var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( colorLine ) );	
				scene.add( line );
			}		
		}
		
		var depth = Math.abs(offset[0].y - offset[1].y);
		if(depth < 0.001) { depth = 0.001; }
		
		var shape = new THREE.Shape( arrP );	
		glass = new THREE.Mesh( new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, depth: depth } ), new THREE.MeshStandardMaterial( {color: 0xcccccc, transparent: true, opacity: 0.1, side: THREE.DoubleSide }  ) );

		glass.position.z = offset[0].y;
		
		return glass;
	}	


		getBox(arr)
	{		
		var v = [];
		
		for ( var i = 0; i < arr.length; i++ )
		{
			arr[i].updateMatrixWorld();
			arr[i].geometry.computeBoundingBox();	
			arr[i].geometry.computeBoundingSphere();

			var bound = arr[i].geometry.boundingBox;
			
			
			v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
			v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
			v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );
			v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );

			v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
			v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
			v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );
			v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );		
		}
		
		var bound = { min : { x : 999999, y : 999999, z : 999999 }, max : { x : -999999, y : -999999, z : -999999 } };
		
		for(var i = 0; i < v.length; i++)
		{
			if(v[i].x < bound.min.x) { bound.min.x = v[i].x; }
			if(v[i].x > bound.max.x) { bound.max.x = v[i].x; }
			if(v[i].y < bound.min.y) { bound.min.y = v[i].y; }
			if(v[i].y > bound.max.y) { bound.max.y = v[i].y; }			
			if(v[i].z < bound.min.z) { bound.min.z = v[i].z; }
			if(v[i].z > bound.max.z) { bound.max.z = v[i].z; }		
		}

		var x = (bound.max.x - bound.min.x);
		var y = (bound.max.y - bound.min.y);
		var z = (bound.max.z - bound.min.z);	
		
		var material = new THREE.MeshStandardMaterial({ color: 0xcccccc, transparent: true, opacity: 0.0, depthTest: false });
		var geometry = fname_s_0197(x, y, z);	
		
		var v = geometry.vertices;
		v[0].x = v[1].x = v[6].x = v[7].x = bound.min.x;
		v[3].x = v[2].x = v[5].x = v[4].x = bound.max.x;

		v[0].y = v[3].y = v[4].y = v[7].y = bound.min.y;
		v[1].y = v[2].y = v[5].y = v[6].y = bound.max.y;
		
		v[0].z = v[1].z = v[2].z = v[3].z = bound.max.z;
		v[4].z = v[5].z = v[6].z = v[7].z = bound.min.z;		
			
		geometry = new THREE.BufferGeometry().fromGeometry(geometry);	 
		var box = new THREE.Mesh( geometry, material ); 	
		
		box.updateMatrixWorld();
		box.geometry.computeBoundingBox();	
		box.geometry.computeBoundingSphere();

		for ( var i = 0; i < arr.length; i++ )
		{
			box.add(arr[i]);
		}
		
		
		return box;
	}
	

}

const myWindows = new MyWindows()







class MyDoors 
{
	constructor()
	{
		this.initBtn();
	}
	
	initBtn()
	{
		const data = 
		[
			{name: 'дверь', src: 'img/icon/door/1.png', func: () => { fname_s_active_int({button:'create_wd_2'}) } },
			{name: 'проем', src: 'img/icon/door/2.png', func: () => { fname_s_active_int({button:'create_wd_1'}) } },
		];
		
				const btnDropList = new BtnDropList({containerId: 'list_btn_door', name: 'дверь/проём', data});	
	}
		

}

const myDoors = new MyDoors()







class SwitchCamera 
{
	btnCam2D;
	btnCam3D;
	btnCamFirst;
	divLevelVis;
	
	constructor()
	{
		this.btnCam2D = document.querySelector('[nameId="butt_camera_2D"]');
		this.btnCam3D = document.querySelector('[nameId="butt_camera_3D"]');
		this.btnCamFirst = document.querySelector('[nameId="butt_cam_walk"]');
		
		this.initBtnEvent();
		
		this.divLevelVis = divLevelVisible.container;	 	
	}
	
	initBtnEvent()
	{
		this.btnCam2D.onmousedown = () => { this.clickOnBtn2D3D('2D'); }
		this.btnCam3D.onmousedown = () => { this.clickOnBtn2D3D('3D'); }
		this.btnCamFirst.onmousedown = () => { myCameraOrbit.switchFlyFirst(); }
	}
		
		clickOnBtn2D3D(cam)
	{
		this.btnCam2D.style.display = 'none';
		this.btnCam3D.style.display = 'none';

		if(cam === '2D') 
		{
			this.btnCam3D.style.display = '';
			this.btnCamFirst.style.display = 'none';
		}	
		
		if(cam === '3D') 
		{
			this.btnCam2D.style.display = '';
			this.btnCamFirst.style.display = '';
		}
		
		
		myCameraOrbit.setActiveCam({cam});		
		
		tabs.upCurrentTab();			this.showHideDivTypeCam();	
	}
	
		showHideDivTypeCam()
	{
		if(myCameraOrbit.activeCam.userData.isCam2D) this.divLevelVis.style.display = 'none';
		if(myCameraOrbit.activeCam.userData.isCam3D) this.divLevelVis.style.display = '';
	}	
}









class Tabs 
{
	currentTabId = -1;
	items = [];
	
	constructor()
	{
		const container = document.querySelector('[nameId="panel_catalog_1"]');
		
				const btn1 = container.querySelector('[nameId="button_wrap_level"]');
		const btn2 = container.querySelector('[nameId="button_wrap_plan"]');
		const btn3 = container.querySelector('[nameId="button_wrap_object"]');
		const btn4 = container.querySelector('[nameId="button_wrap_catalog"]');
		
				const div1 = container.querySelector('[nameId="wrap_level"]');
		const div2 = container.querySelector('[nameId="wrap_plan"]');		
		const div3 = container.querySelector('[nameId="wrap_object"]');
		const div4 = container.querySelector('[nameId="wrap_catalog"]');
		
				const div2_3d = container.querySelector('[nameId="wrap_plan_3d"]');
		
		this.items[0] = { btn: btn1, div: div1 };
		this.items[1] = { btn: btn2, div: div2, div3D: div2_3d };
		this.items[2] = { btn: btn3, div: div3 };
		this.items[3] = { btn: btn4, div: div4 };
		
		this.initEvent();
		this.activeTab({id: 0});
	}
	
	initEvent()
	{
		this.items[0].btn.onmousedown = () => { this.activeTab({id: 0}); };
		this.items[1].btn.onmousedown = () => { this.activeTab({id: 1}); };
		this.items[2].btn.onmousedown = () => { this.activeTab({id: 2}); };
		this.items[3].btn.onmousedown = () => { this.activeTab({id: 3}); };		
	}
	
		activeTab({id})
	{
		this.currentTabId = id;
		
		for ( let i = 0; i < this.items.length; i++ )
		{
			this.items[i].div.style.display = 'none';
			if(this.items[i].div3D) this.items[i].div3D.style.display = 'none';
		}					 
		
				if(this.items[id].div3D)
		{
			if(myCameraOrbit.activeCam.userData.isCam3D) { this.items[id].div3D.style.display = ''; }
			else { this.items[id].div.style.display = ''; }
		}
		else
		{
			this.items[id].div.style.display = '';
		}		
	}

	
		upCurrentTab()
	{
		if(this.currentTabId === -1) return;
		
		this.activeTab({id: this.currentTabId});
	}
}








class TabLevel 
{
	itemsLevel = [];
	
	constructor()
	{
		const elBlock = document.querySelector('[nameId="wrap_level"]');

				const div1 = elBlock.querySelector('[nameId="div_level_1"]');
		const div2 = elBlock.querySelector('[nameId="div_level_2"]');
		const div3 = elBlock.querySelector('[nameId="div_level_3"]');
		const div4 = elBlock.querySelector('[nameId="div_level_4"]');
		
				const btn1 = elBlock.querySelector('[nameId="btn_level_1"]');
		const btn2 = elBlock.querySelector('[nameId="btn_level_2"]');
		const btn3 = elBlock.querySelector('[nameId="btn_level_3"]');
		const btn4 = elBlock.querySelector('[nameId="btn_level_4"]');

				const input1 = elBlock.querySelector('[nameId="rp_level_1_h2"]');
		const input2 = elBlock.querySelector('[nameId="rp_level_2_h2"]');
		const input3 = elBlock.querySelector('[nameId="rp_level_3_h2"]');
		const input4 = elBlock.querySelector('[nameId="rp_level_4_h2"]');	
	
		this.itemsLevel[0] = { div: div1, btn: btn1, input: input1 };
		this.itemsLevel[1] = { div: div2, btn: btn2, input: input2 };
		this.itemsLevel[2] = { div: div3, btn: btn3, input: input3 };
		this.itemsLevel[3] = { div: div4, btn: btn4, input: input4 };
		
		this.setStartInputValue();
		this.initElemsEvent();
	}
	
	initElemsEvent()
	{
		for ( let i = 0; i < this.itemsLevel.length; i++ )
		{
			this.itemsLevel[i].btn.onmousedown = () => { myLevels.switchLevel(i); }
			this.itemsLevel[i].input.onkeyup = (event) => this.changeInputHeight(event, i);
		}		
	}
	
		setStartInputValue()
	{
		const level = myLevels.levels;		

		for ( let i = 0; i < this.itemsLevel.length; i++ )
		{
			this.itemsLevel[i].input.value = level[i].height;
		}
	}
	
		levelBackground_UI({id}) 
	{
		for ( let i = 0; i < this.itemsLevel.length; i++ )
		{
			this.itemsLevel[i].div.style.background = 'none';
			if(i === id) this.itemsLevel[i].div.style.background = '#d5d5d5';
		}
	}
	
		changeInputHeight(event, id) 
	{
		if (event.keyCode !== 13) return;
		
		const level = myLevels.levels[id];
		
		const value = fname_s_0227({ value: event.target.value, unit: 1, limit: {min: 0.1, max: 5} });

		if(!value) 
		{
			event.target.value = Math.round(level.height * 100) / 100;
			return;
		}	
		
		event.target.value = value.num; 
		
		myLevels.setHeightWallLevel({value: value.num, id});  
	}	
}









class DivLevelVisible 
{
	showAllLevel;
	wallTransparent;
	container;
	checkBox1;		checkBox2;		
	constructor({showAllLevel = false, wallTransparent = true})
	{
		this.showAllLevel = showAllLevel;
		this.wallTransparent = wallTransparent;
		
		const elBlock = document.querySelector('[nameId="wrap_level"]');
		this.container = elBlock.querySelector('[nameId="div_type_cam_vis"]');
		
		this.checkBox1 = this.container.querySelector('[nameId="type_cam_vis_1"]');
		this.checkBox2 = this.container.querySelector('[nameId="type_cam_vis_2"]');

				this.initEvent();
	}
	
	init()
	{
		this.setCheckBox({type: 'allLevel'});
		this.setCheckBox({type: 'wallTransparent'});
	}
	
		initEvent()
	{
		this.checkBox1.onmousedown = () => { this.switchShowAllLevel(); }
		this.checkBox2.onmousedown = () => { this.switchWallTransparent(); }	
	}
	
	switchShowAllLevel({value} = {value: undefined})
	{
		this.showAllLevel = (value !== undefined) ? value : !this.showAllLevel;
		this.setCheckBox({type: 'allLevel'});		
	}

	switchWallTransparent({value} = {value: undefined})
	{
		this.wallTransparent = (value !== undefined) ? value : !this.wallTransparent;
		this.setCheckBox({type: 'wallTransparent'});
	}
	
	setCheckBox({type})
	{
		if(type === 'allLevel')
		{
			const elem = this.checkBox1;
			elem.children[0].style.background = (this.showAllLevel) ? 'rgb(213, 213, 213)' : 'none';
			
			myLevels.changeVisibleLevels();		
		}
		
		if(type === 'wallTransparent')
		{
			const elem = this.checkBox2;
			elem.children[0].style.background = (this.wallTransparent) ? 'rgb(213, 213, 213)' : 'none';
			
			if(myCameraOrbit.activeCam.userData.isCam3D)
			{
				fname_s_0268();
				if(this.wallTransparent && myCameraOrbit.cam3D.userData.type === 'fly') fname_s_0269();
				else fname_s_0270();						
			}
		}
	}	
}








class TabPlan
{
	container;
	inputs = {};
	
	constructor()
	{
		this.init();
		
		this.startSetInputValue();
	}
	
	init()
	{
		this.container = document.querySelector('[nameId="wrap_plan"]');
		
				this.inputs.wall = {z: null};
		this.inputs.door = {x: null, y: null};
		this.inputs.wind = {x: null, y: null, h1: null};
		this.inputs.gate = {x: null, y: null};
		this.inputs.roof = {x: null, z: null};
		
		this.inputs.wall.z = this.container.querySelector('[nameId="rp_wall_width_1"]');
		
		this.inputs.door.x = this.container.querySelector('[nameId="rp_door_length_1"]');
		this.inputs.door.y = this.container.querySelector('[nameId="rp_door_height_1"]');
		
		this.inputs.wind.x = this.container.querySelector('[nameId="rp_wind_length_1"]');
		this.inputs.wind.y = this.container.querySelector('[nameId="rp_wind_height_1"]');
		this.inputs.wind.h1 = this.container.querySelector('[nameId="rp_wind_above_floor_1"]');
		
		this.inputs.gate.x = this.container.querySelector('[nameId="rp_gate_length_1"]');
		this.inputs.gate.y = this.container.querySelector('[nameId="rp_gate_height_1"]');
		
		this.inputs.roof.x = this.container.querySelector('[nameId="rp_roof_length_1"]');
		this.inputs.roof.z = this.container.querySelector('[nameId="rp_roof_width_1"]');				
	}
	
	initEvent()
	{
				
	}

		startSetInputValue()
	{		
		this.inputs.wall.z.value = infProject.settings.wall.width;
		
		this.inputs.door.x.value = infProject.settings.door.width;
		this.inputs.door.y.value = infProject.settings.door.height;
		
		this.inputs.wind.x.value = infProject.settings.wind.width;
		this.inputs.wind.y.value = infProject.settings.wind.height;
		this.inputs.wind.h1.value = infProject.settings.wind.h1;
		
		this.inputs.gate.x.value = infProject.settings.gate.width;
		this.inputs.gate.y.value = infProject.settings.gate.height;

		this.inputs.roof.x.value = infProject.settings.roof.width;
		this.inputs.roof.z.value = infProject.settings.roof.length;	
	}


}









class TabObject
{
	container;
	inputName;
	divs = {};
	
	constructor()
	{
		this.init();
	}
	
	init()
	{
		this.container = document.querySelector('[nameId="wrap_object_1"]');
		
		this.divs.wall = this.container.querySelector('[nameId="rp_menu_wall"]');
		this.divs.wd = this.container.querySelector('[nameId="rp_menu_wd"]');
		this.divs.floor = this.container.querySelector('[nameId="rp_menu_room"]');
		this.divs.roof = this.container.querySelector('[nameId="bl_roof_3d"]');
		this.divs.obj = this.container.querySelector('[nameId="bl_object_3d"]');

		this.inputName = this.container.querySelector('[nameId="rp_obj_name"]');
	}
	
	initEvent()
	{
				
	}

		activeObjRightPanelUI_1({obj, side} = {}) 
	{
		this.container.style.display = 'none'; 
		
		this.inputName.value = '';
		
		this.divs.wall.style.display = 'none';
		this.divs.wd.style.display = 'none';
		this.divs.floor.style.display = 'none';
		this.divs.roof.style.display = 'none';
		this.divs.obj.style.display = 'none';
		
		
		if(!obj) return;
		
		let txtName = '';
		
		if(obj.userData.tag === 'point')
		{
			txtName = 'точка';
		}	
		else if(obj.userData.tag === 'wall')
		{
			txtName = 'стена';
			
			this.divs.wall.querySelector('[nameId="rp_button_side_texture_1"]').style.display = 'none';
			this.divs.wall.querySelector('[nameId="but_back_catalog_texture_1"]').style.display = 'none';
			this.divs.wall.querySelector('[nameId="rp_catalog_texture_1"]').style.display = 'none';
			
			if(side)
			{
				this.divs.wall.querySelector('[nameId="rp_catalog_texture_1"]').style.display = '';
			}
			else
			{
				this.divs.wall.querySelector('[nameId="rp_button_side_texture_1"]').style.display = '';
				this.divs.wall.querySelector('[nameId="but_back_catalog_texture_1"]').style.display = '';
				
				fname_s_025({type: 1});
				
				fname_s_027({obj: obj});			

				if(obj.userData.wall.html.label)
				{
					obj.userData.wall.html.label[0].textContent = 'A';
					obj.userData.wall.html.label[1].textContent = 'B';
								
					fname_s_0194({elem: obj.userData.wall.html.label[0]});
					fname_s_0194({elem: obj.userData.wall.html.label[1]});
				}			
			}
			
			this.divs.wall.style.display = '';
			this.divs.wall.querySelector('[nameId="size_wall_width_1"]').value = obj.userData.wall.width;			
		}
		else if(obj.userData.tag === 'door')
		{
			txtName = obj.userData.door.nameRus;
			this.divs.wd.style.display = '';
		}
		else if(obj.userData.tag === 'window')
		{
			txtName = obj.userData.door.nameRus;
			this.divs.wd.style.display = '';
		}	
		else if(obj.userData.tag === 'room')
		{
			txtName = 'пол';
			this.divs.floor.style.display = '';
		}
		else if(obj.userData.tag === 'roof')
		{		
			txtName = obj.userData.roof.nameRus;		
			this.divs.roof.style.display = '';
		}		
		else if(obj.userData.tag === 'obj')
		{			
			txtName = obj.userData.obj3D.nameRus;		
			this.divs.obj.style.display = '';
			
			if( fname_s_0228(window['getInfObjFromBD']) ) { getInfObjFromBD({obj: obj}); };
		}

		this.inputName.value = txtName;
		
		this.container.style.display = ''; 			
	}
}










class MyToolPG 
{
	pivot = null;
	gizmo = null;
	type = 'pivot';
	obj = null;
	arrO = [];
	pos = new THREE.Vector3();
	qt = new THREE.Quaternion();

	ui_menu = null;
	ui = {};
	
	
	

	constructor({type = 'pivot', nameAttr}={}) 
	{
				
				
				
		this.pivot = new MyPivot();
				
							}
	
		initButton()
	{
		this.ui_menu.el.querySelector('[nameId="select_pivot"]').onmousedown = (e) => { this.toggleTool({type:'pivot'}); e.stopPropagation(); };
		this.ui_menu.el.querySelector('[nameId="select_gizmo"]').onmousedown = (e) => { this.toggleTool({type:'gizmo'}); e.stopPropagation(); };

		this.ui_menu.el.querySelector('[nameId="obj_rotate_X_90"]').onmousedown = (e) => { this.setAngleRotUI({axis: 'x', angle: -45}); e.stopPropagation(); };
		this.ui_menu.el.querySelector('[nameId="obj_rotate_X_90m"]').onmousedown = (e) => { this.setAngleRotUI({axis: 'x', angle: 45}); e.stopPropagation(); };
		this.ui_menu.el.querySelector('[nameId="obj_rotate_Y_90"]').onmousedown = (e) => { this.setAngleRotUI({axis: 'y', angle: -45}); e.stopPropagation(); };
		this.ui_menu.el.querySelector('[nameId="obj_rotate_Y_90m"]').onmousedown = (e) => { this.setAngleRotUI({axis: 'y', angle: 45}); e.stopPropagation(); };
		this.ui_menu.el.querySelector('[nameId="obj_rotate_Z_90"]').onmousedown = (e) => { this.setAngleRotUI({axis: 'z', angle: -45}); e.stopPropagation(); };
		this.ui_menu.el.querySelector('[nameId="obj_rotate_Z_90m"]').onmousedown = (e) => { this.setAngleRotUI({axis: 'z', angle: 45}); e.stopPropagation(); };
		
		this.ui_menu.el.querySelector('[nameId="obj_rotate_reset"]').onmousedown = (e) => { this.resetRot(); e.stopPropagation(); };
	}
	
	getPosRotUI()
	{
		this.ui.menu = document.querySelector('[nameId="block_pos"]');
		
		this.ui.pos = {};
		this.ui.pos.x = document.querySelector('[nameId="object_pos_X"]');
		this.ui.pos.y = document.querySelector('[nameId="object_pos_Y"]');
		this.ui.pos.z = document.querySelector('[nameId="object_pos_Z"]');
		
		this.ui.rot = {};
		this.ui.rot.x = document.querySelector('[nameId="object_rotate_X"]');
		this.ui.rot.y = document.querySelector('[nameId="object_rotate_Y"]');
		this.ui.rot.z = document.querySelector('[nameId="object_rotate_Z"]');		
	}

	calcPos(params) 
	{
		let obj = params.obj;
		let pos = new THREE.Vector3();
		
		if(obj.userData.tag == 'obj')				{ 
			obj.updateMatrixWorld();
			pos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );	
		}		
		else if(obj.userData.tag == 'joinPoint')				{ 
			pos = obj.getWorldPosition(new THREE.Vector3());  
			console.trace(7777)
		}		
		else if(obj.userData.tag == 'wtGrid')				{ 
			pos = obj.position;  
		}

		return pos;
	}
	
	calcRot(params) 
	{
		let obj = params.obj;
		let qt = new THREE.Quaternion();
		
		if(camOrbit.activeCam.userData.isCam2D)	
		{		
			if(!obj.geometry.boundingBox) obj.geometry.computeBoundingBox();
			let bound = obj.geometry.boundingBox;
			
			obj.updateMatrixWorld();
			let v1 = new THREE.Vector3(bound.min.x, 0, 0).applyMatrix4( obj.matrixWorld );
			let v2 = new THREE.Vector3(bound.max.x, 0, 0).applyMatrix4( obj.matrixWorld );
			
			let dir = v2.clone().sub(v1).normalize();
			let rotY = Math.atan2(dir.x, dir.z);
			
			qt = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotY - Math.PI/2);
		}
		
		if(camOrbit.activeCam.userData.isCam3D) qt = obj.getWorldQuaternion(new THREE.Quaternion());	

		return qt;
	}

		activeTool(params)
	{
		let obj = params.obj;
		let arrO = params.arrO;
		let pos = params.pos;
		
		this.hide();
		
		this.obj = obj;
		this.arrO = (arrO) ? arrO : ddGetGroup({obj, tubePoint: true});
		
		this.pos = (pos) ? pos : this.calcPos({obj: obj});		
		this.qt = this.calcRot({obj: obj});
		
		
		this.setPosUI();
		this.setRotUI();
		this.displayMenuUI({visible: ''});
		

		if(this.type == 'pivot') this.pivot.userData.fname_s_0350({type: 'fname_s_0351', obj: obj, arrO: this.arrO, pos: this.pos, qt: this.qt});		
		if(this.type == 'gizmo') this.gizmo.userData.propGizmo({type: 'setGizmo', obj: obj, arrO: this.arrO, pos: this.pos, qt: this.qt});

		setClickLastObj({obj});
		
		this.render();	
	}
	
		toggleTool({type})
	{
		let obj = this.obj;
		let arrO = this.arrO;
		
		if(!obj) return;
		
		this.hide();
				
		this.type = type;	
		this.obj = obj;
		this.arrO = arrO;
		
		
		if(this.type == 'pivot') this.pivot.userData.fname_s_0350({type: 'fname_s_0351', obj: obj, arrO: this.arrO, pos: this.pos, qt: this.qt});		
		if(this.type == 'gizmo') this.gizmo.userData.propGizmo({type: 'setGizmo', obj: obj, arrO: this.arrO, pos: this.pos, qt: this.qt});
		
		this.displayMenuUI({visible: ''});
		
		this.render();
	}
	

		setPosPivotGizmo({pos})
	{
		this.pos = pos;
		this.setPosUI();
		this.pivot.position.copy(pos);
		this.gizmo.position.copy(pos);
	}
	
	
		setRotPivotGizmo({qt})
	{
		this.qt = qt;
		this.setRotUI();
		this.pivot.quaternion.copy(qt);
		this.gizmo.quaternion.copy(qt);
	}
		
		
	
		applyPosUI()
	{
		let x = this.ui.pos.x.value;
		let y = this.ui.pos.y.value;
		let z = this.ui.pos.z.value;

		x = fname_s_0227({ value: x, unit: 1 });
		y = fname_s_0227({ value: y, unit: 1 });
		z = fname_s_0227({ value: z, unit: 1 });
		
				if(!x || !y || !z)
		{		
			this.setPosUI();
			return;
		}
			
		let pos = new THREE.Vector3(x.num, y.num, z.num);
		let offset = pos.clone().sub(this.pos);
		
		this.pivot.userData.fname_s_0350({type: 'fname_s_0358', pos: pos});
		this.gizmo.userData.propGizmo({type: 'setPosGizmo', pos: pos});
		this.pivot.userData.fname_s_0350({type: 'fname_s_0356', obj: this.obj, arrO: this.arrO, offset: offset});		
		
		this.pos = pos;		
		
		this.setPosUI();
		
		this.render();
	}
	
	
		applyRotUI()
	{
		let x = this.ui.rot.x.value;
		let y = this.ui.rot.y.value;
		let z = this.ui.rot.z.value;

		x = fname_s_0227({ value: x, unit: 1 });
		y = fname_s_0227({ value: y, unit: 1 });
		z = fname_s_0227({ value: z, unit: 1 });
		
				if(!x || !y || !z)
		{		
			this.setRotUI();
			return;
		}
		
		if(x.num == 180 && z.num == 180) { x.num = 0; z.num = 0;  }
		if(x.num == -180 && z.num == -180) { x.num = 0; z.num = 0;  }
		
		x = THREE.Math.degToRad(x.num);
		y = THREE.Math.degToRad(y.num);
		z = THREE.Math.degToRad(z.num);		
		
		
		let q_New = new THREE.Quaternion().setFromEuler(new THREE.Euler().set(x, y, z))
		let q_Offset = q_New.clone().multiply(this.qt.clone().inverse());		
				
		this.pivot.userData.fname_s_0350({type: 'fname_s_0359', qt: q_New});
		this.gizmo.userData.propGizmo({type: 'setRotGizmo', qt: q_New});
		this.gizmo.userData.propGizmo({type: 'rotObjs', pos: this.pos, arrO: this.arrO, q_Offset: q_Offset});	
		
		this.qt = q_New;

		this.setRotUI();	
		
		this.render();
	}
	
	
		setPosUI()
	{
		let pos = this.pos;
		
		this.ui.pos.x.value = Math.round(pos.x * 100) / 100;
		this.ui.pos.y.value = Math.round(pos.y * 100) / 100;
		this.ui.pos.z.value = Math.round(pos.z * 100) / 100;			
	}	
	
		setRotUI()
	{
		let qt = this.qt;
		let rot = new THREE.Euler().setFromQuaternion(qt);
		
		this.ui.rot.x.value = Math.round(THREE.Math.radToDeg(rot.x));
		this.ui.rot.y.value = Math.round(THREE.Math.radToDeg(rot.y));
		this.ui.rot.z.value = Math.round(THREE.Math.radToDeg(rot.z));		
	}
	
	
		setAngleRotUI(params)
	{
		let angle = params.angle;
		let axis = params.axis;
		
		this.ui.rot[axis].value = Number(this.ui.rot[axis].value) + angle;		
		
		this.applyRotUI();
	}
	
	resetRot()
	{
		this.ui.rot.x.value = 0;
		this.ui.rot.y.value = 0;
		this.ui.rot.z.value = 0;
		
		this.applyRotUI();
	}


		visible({value})
	{
		let obj = null;
		if(this.type == 'pivot') obj = this.pivot;
		if(this.type == 'gizmo') obj = this.gizmo;
		
		obj.visible = value;
	}
	
	
		hide()
	{
		this.obj = null;
		this.arrO = [];
		this.pivot.userData.fname_s_0350({type: 'hide'});
		this.gizmo.userData.propGizmo({type: 'hide'});
		
		this.displayMenuUI({visible: 'none'});
		
		resetClickLastObj({});
		
		this.render();		
	}
	
	displayMenuUI(params)
	{
		let visible = params.visible;
		
		this.ui.menu.style.display = visible;
	}
	
	render()
	{
		camOrbit.render();
	}
}








class MyPivot
{
	obj;
	
	constructor()
	{
		this.obj = this.createObj()
	}
	
	createObj() 
	{
		const pivot = new THREE.Group();
		pivot.userData = {};
		pivot.userData.startPos = new THREE.Vector3();
		pivot.userData.dir = new THREE.Vector3();	
		
		
		
		const arr = [];
		arr[0] = {axis: 'x', size: {x: 0.6, y: 0.1, z: 0.1}, pos: {x: 0.6, y: 0, z: 0}, clone: true, rot: {x: 0, y: Math.PI, z: 0}, color: 'rgb(247, 72, 72)', opacity: 0};
		arr[1] = {axis: 'y', size: {x: 0.6, y: 0.1, z: 0.1}, pos: {x: 0, y: 0.6, z: 0}, clone: true, rot: {x: 0, y: 0, z: -Math.PI/2}, color: 'rgb(17, 255, 0)', opacity: 0};
		arr[2] = {axis: 'z', size: {x: 0.6, y: 0.1, z: 0.1}, pos: {x: 0, y: 0, z: -0.6}, clone: true, rot: {x: 0, y: -Math.PI/2, z: 0}, color: 'rgb(72, 116, 247)', opacity: 0};
		arr[3] = {axis: 'xz', size: new THREE.Vector3(0.3, 0.001, 0.3), pos: new THREE.Vector3(0.01, 0.0, -0.16), color: 'rgb(194, 194, 194)', opacity: 0.4};
		arr[4] = {axis: 'center', size: new THREE.Vector3(0.03, 0.03, 0.03), pos: new THREE.Vector3(-0.015, 0.0, 0.0), color: 'rgb(102, 102, 102)', opacity: 1};


		const geometry = this.fname_s_0345({x: 1, y: 1, z: 1});
		const geomCone = this.fname_s_0346();
		
		
		for ( let i = 0; i < arr.length; i++ )
		{
			const material = new THREE.MeshStandardMaterial({ color: arr[i].color, transparent: true, opacity: arr[i].opacity, depthTest: false, lightMap: lightMap_1 });
			if(material.opacity == 0) material.visible = false;
			
			const obj = new THREE.Mesh( geometry, material );
			obj.scale.set(arr[i].size.x, arr[i].size.y, arr[i].size.z);
			obj.userData.tag = 'pivot';
			obj.userData.axis = arr[i].axis;	
			obj.renderOrder = 2;
			
			if(arr[i].pos) obj.position.set( arr[i].pos.x, arr[i].pos.y, arr[i].pos.z );
			if(arr[i].rot) obj.rotation.set( arr[i].rot.x, arr[i].rot.y, arr[i].rot.z );
			
			pivot.add( obj );
			
			if(arr[i].clone)
			{
				const material = new THREE.MeshStandardMaterial({ color: arr[i].color, transparent: true, opacity: 1, depthTest: false, lightMap: lightMap_1 });
				
				const obj = new THREE.Mesh( geometry, material );
				obj.scale.set(arr[i].size.x, arr[i].size.y / 5, arr[i].size.z / 5);
				obj.position.set( arr[i].pos.x, arr[i].pos.y, arr[i].pos.z );				
				obj.rotation.set( arr[i].rot.x, arr[i].rot.y, arr[i].rot.z );	
				obj.renderOrder = 2;
				
				pivot.add( obj );					
			}
		}
			
		
		fname_s_0233({ind: 'x'});
		fname_s_0233({ind: 'y'});
		fname_s_0233({ind: 'z'});
		
		
		function fname_s_0233({ind})
		{
			let arr = [];
			arr['x'] = {axis: 'x', pos: new THREE.Vector3(0.6,0,0), rot: new THREE.Vector3(0,0,-Math.PI/2), color: 0xff0000};
			arr['y'] = {axis: 'y', pos: new THREE.Vector3(0,0.6,0), rot: new THREE.Vector3(0,0,0), color: 0x00ff00};
			arr['z'] = {axis: 'z', pos: new THREE.Vector3(0,0,-0.6), rot: new THREE.Vector3(-Math.PI/2,0,0), color: 0x0000ff};			
			
			let material = new THREE.MeshStandardMaterial({ color : arr[ind].color, depthTest: false, transparent: true, lightMap: lightMap_1 });
			
			let obj = new THREE.Mesh( geomCone, material ); 
			obj.userData.tag = 'pivot';
			obj.userData.axis = arr[ind].axis;
			obj.renderOrder = 2;
			obj.position.copy(arr[ind].pos);
			obj.rotation.set(arr[ind].rot.x, arr[ind].rot.y, arr[ind].rot.z);
			pivot.add( obj );
			
			return obj;
		}
		
		
		
		scene.add( pivot );


		return pivot;
	}
	
	
	fname_s_0345(params)
	{
		let x = params.x;
		let y = params.y;
		let z = params.z;
		
		let geometry = new THREE.Geometry();
		y /= 2;
		z /= 2;
		let vertices = [
					new THREE.Vector3(0,-y,z),
					new THREE.Vector3(0,y,z),
					new THREE.Vector3(x,y,z),
					new THREE.Vector3(x,-y,z),
					new THREE.Vector3(x,-y,-z),
					new THREE.Vector3(x,y,-z),
					new THREE.Vector3(0,y,-z),
					new THREE.Vector3(0,-y,-z),
				];	
				
		let faces = [
					new THREE.Face3(0,3,2),
					new THREE.Face3(2,1,0),
					new THREE.Face3(4,7,6),
					new THREE.Face3(6,5,4),				
					new THREE.Face3(0,1,6),
					new THREE.Face3(6,7,0),					
					new THREE.Face3(1,2,5),
					new THREE.Face3(5,6,1),				
					new THREE.Face3(2,3,4),
					new THREE.Face3(4,5,2),				
					new THREE.Face3(3,0,7),
					new THREE.Face3(7,4,3),
				];
		
		let uvs1 = [
					new THREE.Vector2(0,0),
					new THREE.Vector2(1,0),
					new THREE.Vector2(1,1),
				];
		let uvs2 = [
					new THREE.Vector2(1,1),
					new THREE.Vector2(0,1),
					new THREE.Vector2(0,0),
				];	

				
		geometry.vertices = vertices;
		geometry.faces = faces;
		geometry.faceVertexUvs[0] = [uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2];
		geometry.computeFaceNormals();	
		geometry.uvsNeedUpdate = true;		
		
		return geometry;		
	}


	
	fname_s_0346()
	{
		let circle = fname_s_0339();
		let vertices = fname_s_0340();
		let geometry = fname_s_0341(vertices);
		
		function fname_s_0339()
		{
			let count = 48;
			let circle = [];
			let g = (Math.PI * 2) / count;
			
			for ( let i = 0; i < count; i++ )
			{
				let angle = g * i;
				circle[i] = new THREE.Vector3();
				circle[i].x = Math.sin(angle);
				circle[i].z = Math.cos(angle);
				
			}

			return circle;
		}		
		
		function fname_s_0340()
		{
			let n = 0;
			let v = [];
			
			for ( let i = 0; i < circle.length; i++ )
			{
				v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.06 );
				v[n].y = 0;		
				n++;		
				
				v[n] = new THREE.Vector3();
				v[n].y = 0;
				n++;
				
				v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.003 );
				v[n].y = 0.25;
				n++;	
				
				v[n] = new THREE.Vector3();
				v[n].y = 0.25;
				n++;		
			}	
			
			return v;
		}

		function fname_s_0341( vertices )
		{
			var geometry = new THREE.Geometry();

			var faces = [];

			var n = 0;
			for ( var i = 0; i < vertices.length - 4; i += 4 )
			{
				faces[ n ] = new THREE.Face3( i + 0, i + 4, i + 6 ); n++;
				faces[ n ] = new THREE.Face3( i + 6, i + 2, i + 0 ); n++;

				faces[ n ] = new THREE.Face3( i + 2, i + 6, i + 7 ); n++;
				faces[ n ] = new THREE.Face3( i + 7, i + 3, i + 2 ); n++;

				faces[ n ] = new THREE.Face3( i + 3, i + 7, i + 5 ); n++;
				faces[ n ] = new THREE.Face3( i + 5, i + 1, i + 3 ); n++;

				faces[ n ] = new THREE.Face3( i + 0, i + 1, i + 5 ); n++;
				faces[ n ] = new THREE.Face3( i + 5, i + 4, i + 0 ); n++;
			}


			faces[ n ] = new THREE.Face3( i + 0, 0, 2 ); n++;
			faces[ n ] = new THREE.Face3( 2, i + 2, i + 0 ); n++;

			faces[ n ] = new THREE.Face3( i + 2, 2, 3 ); n++;
			faces[ n ] = new THREE.Face3( 3, i + 3, i + 2 ); n++;

			faces[ n ] = new THREE.Face3( i + 3, 3, 1 ); n++;
			faces[ n ] = new THREE.Face3( 1, i + 1, i + 3 ); n++;

			faces[ n ] = new THREE.Face3( i + 0, i + 1, 1 ); n++;
			faces[ n ] = new THREE.Face3( 1, 0, i + 0 ); n++;


			geometry.vertices = vertices;
			geometry.faces = faces;
			geometry.computeFaceNormals();
			geometry.uvsNeedUpdate = true;

			return geometry;
		}
		
		return geometry;		
	}
				
}

function fname_s_0342(params) 
{
	let container = params.container;
	
	let pivot = fname_s_0343();


	function fname_s_0343() 
	{
		let pivot = new THREE.Group();
		pivot.userData.startPos = new THREE.Vector3();
		pivot.userData.dir = new THREE.Vector3();	
		pivot.userData.fname_s_0350 = fname_s_0350;
		
		
		let arr = [];
		arr[0] = {axis: 'x', size: {x: 0.6, y: 0.1, z: 0.1}, pos: {x: 0.6, y: 0, z: 0}, clone: true, rot: {x: 0, y: Math.PI, z: 0}, color: 'rgb(247, 72, 72)', opacity: 0};
		arr[1] = {axis: 'y', size: {x: 0.6, y: 0.1, z: 0.1}, pos: {x: 0, y: 0.6, z: 0}, clone: true, rot: {x: 0, y: 0, z: -Math.PI/2}, color: 'rgb(17, 255, 0)', opacity: 0};
		arr[2] = {axis: 'z', size: {x: 0.6, y: 0.1, z: 0.1}, pos: {x: 0, y: 0, z: -0.6}, clone: true, rot: {x: 0, y: -Math.PI/2, z: 0}, color: 'rgb(72, 116, 247)', opacity: 0};
		arr[3] = {axis: 'xz', size: new THREE.Vector3(0.3, 0.001, 0.3), pos: new THREE.Vector3(0.01, 0.0, -0.16), color: 'rgb(194, 194, 194)', opacity: 0.4};
		arr[4] = {axis: 'center', size: new THREE.Vector3(0.03, 0.03, 0.03), pos: new THREE.Vector3(-0.015, 0.0, 0.0), color: 'rgb(102, 102, 102)', opacity: 1};


		let geometry = fname_s_0345({x: 1, y: 1, z: 1});
		let geomCone = fname_s_0346();
		
		
		for ( let i = 0; i < arr.length; i++ )
		{
			let material = new THREE.MeshStandardMaterial({ color: arr[i].color, transparent: true, opacity: arr[i].opacity, depthTest: false, lightMap: lightMap_1 });
			if(material.opacity == 0) material.visible = false;
			
			let obj = new THREE.Mesh( geometry, material );
			obj.scale.set(arr[i].size.x, arr[i].size.y, arr[i].size.z);
			obj.userData.tag = 'pivot';
			obj.userData.axis = arr[i].axis;	
			obj.renderOrder = 2;
			
			if(arr[i].pos) obj.position.set( arr[i].pos.x, arr[i].pos.y, arr[i].pos.z );
			if(arr[i].rot) obj.rotation.set( arr[i].rot.x, arr[i].rot.y, arr[i].rot.z );
			
			pivot.add( obj );
			
			if(arr[i].clone)
			{
				let material = new THREE.MeshStandardMaterial({ color: arr[i].color, transparent: true, opacity: 1, depthTest: false, lightMap: lightMap_1 });
				
				let obj = new THREE.Mesh( geometry, material );
				obj.scale.set(arr[i].size.x, arr[i].size.y / 5, arr[i].size.z / 5);
				obj.position.set( arr[i].pos.x, arr[i].pos.y, arr[i].pos.z );				
				obj.rotation.set( arr[i].rot.x, arr[i].rot.y, arr[i].rot.z );	
				obj.renderOrder = 2;
				
				pivot.add( obj );					
			}
		}
			
		
		fname_s_0233({ind: 'x'});
		fname_s_0233({ind: 'y'});
		fname_s_0233({ind: 'z'});
		
		
		function fname_s_0233(params)
		{
			let arr = [];
			arr['x'] = {axis: 'x', pos: new THREE.Vector3(0.6,0,0), rot: new THREE.Vector3(0,0,-Math.PI/2), color: 0xff0000};
			arr['y'] = {axis: 'y', pos: new THREE.Vector3(0,0.6,0), rot: new THREE.Vector3(0,0,0), color: 0x00ff00};
			arr['z'] = {axis: 'z', pos: new THREE.Vector3(0,0,-0.6), rot: new THREE.Vector3(-Math.PI/2,0,0), color: 0x0000ff};			
			
			let material = new THREE.MeshStandardMaterial({ color : arr[params.ind].color, depthTest: false, transparent: true, lightMap: lightMap_1 });
			
			let obj = new THREE.Mesh( geomCone, material ); 
			obj.userData.tag = 'pivot';
			obj.userData.axis = arr[params.ind].axis;
			obj.renderOrder = 2;
			obj.position.copy(arr[params.ind].pos);
			obj.rotation.set(arr[params.ind].rot.x, arr[params.ind].rot.y, arr[params.ind].rot.z);
			pivot.add( obj );
			
			return obj;
		}
		
		infProject.tools.pivot = pivot;
		pivot.visible = false;
		scene.add( pivot );

		return pivot;
	}
	
	
	
	function fname_s_0345(params)
	{
		let x = params.x;
		let y = params.y;
		let z = params.z;
		
		let geometry = new THREE.Geometry();
		y /= 2;
		z /= 2;
		let vertices = [
					new THREE.Vector3(0,-y,z),
					new THREE.Vector3(0,y,z),
					new THREE.Vector3(x,y,z),
					new THREE.Vector3(x,-y,z),
					new THREE.Vector3(x,-y,-z),
					new THREE.Vector3(x,y,-z),
					new THREE.Vector3(0,y,-z),
					new THREE.Vector3(0,-y,-z),
				];	
				
		let faces = [
					new THREE.Face3(0,3,2),
					new THREE.Face3(2,1,0),
					new THREE.Face3(4,7,6),
					new THREE.Face3(6,5,4),				
					new THREE.Face3(0,1,6),
					new THREE.Face3(6,7,0),					
					new THREE.Face3(1,2,5),
					new THREE.Face3(5,6,1),				
					new THREE.Face3(2,3,4),
					new THREE.Face3(4,5,2),				
					new THREE.Face3(3,0,7),
					new THREE.Face3(7,4,3),
				];
		
		let uvs1 = [
					new THREE.Vector2(0,0),
					new THREE.Vector2(1,0),
					new THREE.Vector2(1,1),
				];
		let uvs2 = [
					new THREE.Vector2(1,1),
					new THREE.Vector2(0,1),
					new THREE.Vector2(0,0),
				];	

				
		geometry.vertices = vertices;
		geometry.faces = faces;
		geometry.faceVertexUvs[0] = [uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2];
		geometry.computeFaceNormals();	
		geometry.uvsNeedUpdate = true;		
		
		return geometry;		
	}

	
	
	function fname_s_0346()
	{
		let circle = fname_s_0339();
		let vertices = fname_s_0340();
		let geometry = fname_s_0341(vertices);
		
		function fname_s_0339()
		{
			let count = 48;
			let circle = [];
			let g = (Math.PI * 2) / count;
			
			for ( let i = 0; i < count; i++ )
			{
				let angle = g * i;
				circle[i] = new THREE.Vector3();
				circle[i].x = Math.sin(angle);
				circle[i].z = Math.cos(angle);
				
			}

			return circle;
		}		
		
		function fname_s_0340()
		{
			let n = 0;
			let v = [];
			
			for ( let i = 0; i < circle.length; i++ )
			{
				v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.06 );
				v[n].y = 0;		
				n++;		
				
				v[n] = new THREE.Vector3();
				v[n].y = 0;
				n++;
				
				v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.003 );
				v[n].y = 0.25;
				n++;	
				
				v[n] = new THREE.Vector3();
				v[n].y = 0.25;
				n++;		
			}	
			
			return v;
		}

		function fname_s_0341( vertices )
		{
			var geometry = new THREE.Geometry();

			var faces = [];

			var n = 0;
			for ( var i = 0; i < vertices.length - 4; i += 4 )
			{
				faces[ n ] = new THREE.Face3( i + 0, i + 4, i + 6 ); n++;
				faces[ n ] = new THREE.Face3( i + 6, i + 2, i + 0 ); n++;

				faces[ n ] = new THREE.Face3( i + 2, i + 6, i + 7 ); n++;
				faces[ n ] = new THREE.Face3( i + 7, i + 3, i + 2 ); n++;

				faces[ n ] = new THREE.Face3( i + 3, i + 7, i + 5 ); n++;
				faces[ n ] = new THREE.Face3( i + 5, i + 1, i + 3 ); n++;

				faces[ n ] = new THREE.Face3( i + 0, i + 1, i + 5 ); n++;
				faces[ n ] = new THREE.Face3( i + 5, i + 4, i + 0 ); n++;
			}


			faces[ n ] = new THREE.Face3( i + 0, 0, 2 ); n++;
			faces[ n ] = new THREE.Face3( 2, i + 2, i + 0 ); n++;

			faces[ n ] = new THREE.Face3( i + 2, 2, 3 ); n++;
			faces[ n ] = new THREE.Face3( 3, i + 3, i + 2 ); n++;

			faces[ n ] = new THREE.Face3( i + 3, 3, 1 ); n++;
			faces[ n ] = new THREE.Face3( 1, i + 1, i + 3 ); n++;

			faces[ n ] = new THREE.Face3( i + 0, i + 1, 1 ); n++;
			faces[ n ] = new THREE.Face3( 1, 0, i + 0 ); n++;


			geometry.vertices = vertices;
			geometry.faces = faces;
			geometry.computeFaceNormals();
			geometry.uvsNeedUpdate = true;

			return geometry;
		}
		
		return geometry;		
	}
	
	
	
	function fname_s_0350(params)
	{
		let type = params.type;			
		
		if(type == 'fname_s_0351') { fname_s_0351({obj: params.obj, arrO: params.arrO, pos: params.pos, qt: params.qt}); }
		if(type == 'fname_s_0352') { fname_s_0352({rayhit: params.rayhit}); }
		if(type == 'fname_s_0356') { fname_s_0356({obj: params.obj, arrO: params.arrO, offset: params.offset}); }		
		if(type == 'fname_s_0355') { fname_s_0355({offset: params.offset}); }
		if(type == 'fname_s_0358') { fname_s_0358({pos: params.pos}); }
		if(type == 'fname_s_0359') { fname_s_0359({qt: params.qt}); }
		if(type == 'fname_s_0360') { fname_s_0360(); }
		if(type == 'hide') { hide(); }
		

		
		function fname_s_0351(params)
		{
			let obj = params.obj;
			let arrO = params.arrO;
			let pos = params.pos;
			let qt = params.qt;
			
			pivot.visible = true;	
			pivot.position.copy(pos);
			pivot.quaternion.copy(qt);
			
			for ( let i = 0; i < pivot.children.length; i++ )
			{
				if(pivot.children[i].userData.axis == 'y') pivot.children[i].visible = (camOrbit.activeCam.userData.isCam2D) ? false : true;
			}
			
			pivot.userData.fname_s_0350({type: 'fname_s_0360'});
		}

		
		function fname_s_0352(params)
		{
			fname_s_0353(params);
			
			camOrbit.stopMove = true;
			fname_s_073(true);
			
			container.onmousemove = (e) => 
			{
				fname_s_0235({event: e});		
				
				camOrbit.render();
			};

			container.onmouseup = (e) => 
			{
				container.onmousemove = null;
				container.onmouseup = null;
				
				camOrbit.stopMove = false;
				fname_s_073(false);

				camOrbit.render();
			};			
		}

		
		function fname_s_0353(params)
		{
			let rayhit = params.rayhit;
			
			let obj = rayhit.object;  			
			
			let axis = obj.userData.axis;	
			
			
			pivot.userData.startPos = rayhit.point.clone();
			pivot.userData.dir = null;				
				
			
			if(axis == 'xz' || axis == 'center')
			{ 
				planeMath.rotation.set( Math.PI/2, 0, 0 ); 
			}		 
			else
			{				
				pivot.userData.dir = new THREE.Vector3().subVectors(pivot.position, obj.getWorldPosition(new THREE.Vector3())).normalize();
				planeMath.quaternion.copy( fname_s_0222( pivot.userData.dir ) ); 
				planeMath.quaternion.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/2, 0, 0)));
			}			
			
			planeMath.position.copy( rayhit.point );
		} 		
	
	
		
		function fname_s_0235({event})
		{
			let rayhit = fname_s_0213( event, planeMath, 'one' ); 			
			if(rayhit.length == 0) return;
			
			let pos = rayhit[0].point;					
			
			if(pivot.userData.dir)
			{
				let dist = pivot.userData.dir.dot(new THREE.Vector3().subVectors(pos, pivot.userData.startPos));
				pos = pivot.userData.startPos.clone().add(new THREE.Vector3().addScaledVector(pivot.userData.dir, dist));				
			}		

			
			let offset = new THREE.Vector3().subVectors( pos, pivot.userData.startPos );
			
			pivot.userData.fname_s_0350({type: 'fname_s_0355', offset: offset});			
			pivot.userData.fname_s_0350({type: 'fname_s_0356', obj: infProject.tools.pg.obj, arrO: infProject.tools.pg.arrO, offset: offset});
			
			infProject.tools.pg.setPosPivotGizmo({pos: pivot.position});
		}
		
		
		function fname_s_0355(params)
		{ 
			let offset = params.offset;
			pivot.position.add( offset );
			pivot.userData.startPos.add( offset );
			
			pivot.userData.fname_s_0350({type: 'fname_s_0360'});
		}			


		
		function fname_s_0356(params)
		{
			let obj = params.obj;
			let arrO = params.arrO;			
			let offset = params.offset;
			

			if(obj && obj.userData.tag == 'new_point')		
			{
				obj.movePointTube({offset: offset});	
			}			 
			else if(obj && obj.userData.tag == 'wtGrid') 
			{ 
				obj.userData.propObj({type: 'moveObj', obj: obj, offset: offset}); 
			}
			else 
			{
				for(let i = 0; i < arrO.length; i++)
				{
					arrO[i].position.add(offset);		
				}				
			}	
		}

		
		
		function fname_s_0357(params)
		{
			
		}


		
		function fname_s_0358(params)
		{
			if (!pivot.visible) return;
			
			let pos = params.pos;
			
			pivot.position.copy(pos);			
			pivot.userData.fname_s_0350({type: 'fname_s_0360'});
		}
		
		
		function fname_s_0359(params)
		{
			if (!pivot.visible) return;
			
			let qt = params.qt;
			
			pivot.quaternion.copy(qt);			
		}

		
		function fname_s_0360() 
		{
			if (!pivot.visible) return;
			
			let scale = 1;
			
			if(camOrbit.activeCam.userData.isCam2D) { scale = 1 / camOrbit.activeCam.zoom; }
			if(camOrbit.activeCam.userData.isCam3D) { scale = camOrbit.activeCam.position.distanceTo(pivot.position) / 6; }			
			
			pivot.scale.set(scale, scale, scale);
		}


		function hide() 
		{
			pivot.visible = false;
		}
				
	}
	
	 

}










class MyCameraOrbit
{
	constructor({container, renderer, scene})
	{
		this.renderer = renderer;
		this.canvas = renderer.domElement;
		this.container = container;
		this.scene = scene;
		this.cam2D = this.initCam2D();
		this.cam3D = this.initCam3D();
		this.planeMath = this.initPlaneMath();
		this.activeCam = this.cam2D;		
		
		this.detectBrowser = this.detectBrowser();
		
		this.stopMove = false;
		
		this.mouse = {};
		this.mouse.button = '';
		this.mouse.down = false;
		this.mouse.move = false;		
		this.mouse.pos = {};
		this.mouse.pos.x = 0;
		this.mouse.pos.y = 0;
		
		this.api = new EventMyCamera();			
		this.initEvent();	
	}
	
	initEvent()
	{
		const container = this.container;
		
		container.addEventListener( 'mousedown', this.mouseDown, false );
		container.addEventListener( 'mousemove', this.mouseMove, false );
		container.addEventListener( 'mouseup', this.mouseUp, false );	
		
		container.addEventListener( 'touchstart', this.mouseDown, false );
		container.addEventListener( 'touchmove', this.mouseMove, false );
		container.addEventListener( 'touchend', this.mouseUp, false );
		
		container.addEventListener('wheel', this.mouseWheel, false);			

		window.addEventListener( 'resize', this.windowResize, false );
	}
	
	initCam2D()
	{
		const canvas = this.canvas;
		
		const aspect = canvas.clientWidth / canvas.clientHeight;
		const d = 5;
		const camera2D = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );
		camera2D.userData.isCam2D = true;
		camera2D.position.set(0, 15, 0);
		camera2D.lookAt(new THREE.Vector3());
		camera2D.zoom = 1;
		camera2D.updateMatrixWorld();
		camera2D.updateProjectionMatrix();	

		camera2D.userData.pos = camera2D.position.clone();
		camera2D.userData.zoom = camera2D.zoom;
	
		return camera2D;
	}

	initCam3D()
	{
		const canvas = this.canvas;		
		const camera3D = new MyCameraPerspective({fov: 65, aspect: canvas.clientWidth / canvas.clientHeight, near: 0.01, far: 1000});  		
		
		return camera3D;
	}
	
	
	initPlaneMath()
	{
		const geometry = new THREE.PlaneGeometry( 10000, 10000 );		
		const material = new THREE.MeshPhongMaterial( {color: 0xffff00, transparent: true, opacity: 0.5, side: THREE.DoubleSide } );
		material.visible = false; 
		const planeMath = new THREE.Mesh( geometry, material );
		planeMath.rotation.set(-Math.PI/2, 0, 0);	
		this.scene.add( planeMath );	
		
		return planeMath;
	}	
	
	setActiveCam({cam})
	{
		const camera = (cam === '2D') ? this.cam2D : this.cam3D;
		
		this.activeCam = camera;
		
		this.cam3D.userData.targetO.visible = (cam === '2D') ? false : true;
		
		this.api.setActiveCam({camera})
		
		this.render();
	}
	
	switchFlyFirst()
	{		
		if(!this.activeCam.userData.isCam3D) return;
		
		this.cam3D.switchType();
		this.render();
	}

	mouseDown = (event) =>
	{
		if(this.stopMove) return;
		this.mouse.down = true;
		this.mouse.move = false;
	
		switch ( event.button ) 
		{
			case 0: this.mouse.button = 'left'; break;
			case 1: this.mouse.button = 'right'; break;
			case 2: this.mouse.button = 'right'; break;
		}	
		
		if(event.changedTouches)
		{
			event.clientX = event.targetTouches[0].clientX;
			event.clientY = event.targetTouches[0].clientY;
			this.mouse.button = 'left';	
		}

		this.startCam2D({camera2D: this.cam2D, event: event, button: this.mouse.button});
		this.startCam3D({camera3D: this.cam3D, event: event, button: this.mouse.button});
	
		this.render();
	}

	mouseMove = (event) =>
	{
		if(this.stopMove) return;
		if(!this.mouse.down) return;		
		
		if(event.changedTouches)
		{
			event.clientX = event.targetTouches[0].clientX;
			event.clientY = event.targetTouches[0].clientY;
		}

		if(this.mouse.down && !this.mouse.move)
		{
			this.mouse.move = true;
		}

		this.moveCam2D( event );
		this.moveCam3D( event );
			
				
		this.render();
	}

	mouseUp = (event) =>
	{
		this.mouse.button = '';
		this.mouse.down = false;
		this.mouse.move = false;		
	}
	
	
	windowResize = () => 
	{
		const canvas = this.canvas;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
				
		this.renderer.setSize(width, height, false);
		
		const aspect = width / height;
		const d = 5;
		
		this.cam2D.left = -d * aspect;
		this.cam2D.right = d * aspect;
		this.cam2D.top = d;
		this.cam2D.bottom = -d;
		this.cam2D.updateMatrixWorld();
		this.cam2D.updateProjectionMatrix();

		 
		this.cam3D.aspect = aspect;
		this.cam3D.updateMatrixWorld();
		this.cam3D.updateProjectionMatrix();	
		
		canvas.style.width = '100%';
		canvas.style.height = '100%';
		
		this.render();

	}	


		setStartPosRot3D({posCam, rot, posTarget})
	{
		const camera3D = this.cam3D;
		
		camera3D.position.copy(posCam);	
		camera3D.lookAt(posTarget);
				camera3D.userData.targetO.position.copy(posTarget);
		camera3D.userData.targetO.rotation.set(0, camera3D.rotation.y, 0);
		
		camera3D.userData.pos = camera3D.position.clone();
		camera3D.userData.radius = camera3D.userData.targetO.position.distanceTo(camera3D.position);			
	}

	startCam2D({camera2D, event, button})
	{
		if(!this.activeCam.userData.isCam2D) return;

		const planeMath = this.planeMath;
		
		planeMath.position.set(camera2D.position.x, 0, camera2D.position.z);
		planeMath.rotation.set(-Math.PI/2,0,0);  
		planeMath.updateMatrixWorld();
		
		const intersects = this.fname_s_0213( event, planeMath, 'one' );
		
		this.mouse.pos.x = intersects[0].point.x;
		this.mouse.pos.y = intersects[0].point.z;	 		
	}


	startCam3D({camera3D, event, button})
	{
		if(!this.activeCam.userData.isCam3D) return;
		
		this.mouse.pos.x = event.clientX;
		this.mouse.pos.y = event.clientY;
		
		if(button === 'left')				
		{
						let dir = new THREE.Vector3().subVectors( camera3D.userData.targetO.position, camera3D.position ).normalize();
			
						let dergree = THREE.Math.radToDeg( dir.angleTo(new THREE.Vector3(dir.x, 0, dir.z)) ) * 2;	
			if(dir.y > 0) { dergree *= -1; } 			
			
						dir.y = 0; 
			dir.normalize();    						
			
			camera3D.userData.theta = THREE.Math.radToDeg( Math.atan2(dir.x, dir.z) - Math.PI ) * 2;
			camera3D.userData.phi = dergree; 
		}
		else if(button === 'right')		
		{
			const planeMath = this.planeMath;
			
			planeMath.position.copy( camera3D.userData.targetO.position );
			
			planeMath.rotation.copy( camera3D.rotation );
						planeMath.updateMatrixWorld();

			const intersects = this.fname_s_0213( event, planeMath, 'one' );
			if(!intersects[0]) return;
			camera3D.userData.clickPos = intersects[0].point; 		
		}	
	}


	moveCam2D( event ) 
	{
		if(!this.activeCam.userData.isCam2D) return;
		if(this.mouse.button === '') return;
						
		const intersects = this.fname_s_0213( event, this.planeMath, 'one' );
		
		const camera2D = this.activeCam;
		camera2D.position.x += this.mouse.pos.x - intersects[0].point.x;
		camera2D.position.z += this.mouse.pos.y - intersects[0].point.z;

		camera2D.updateMatrixWorld();
		this.api.moveCam2D();
	}


	moveCam3D( event )
	{ 
		if(!this.activeCam.userData.isCam3D) return;
		if(this.mouse.button === '') return;
		
		const type = this.activeCam.userData.type;
		
		if(type === 'fly') this.moveCamFly3D(); 
		if(type === 'first') this.moveCamFirst3D();
	}
	

	moveCamFly3D()
	{
		const camera3D = this.activeCam;
		
		if(this.mouse.button === 'left') 
		{  
			const radious = camera3D.userData.targetO.position.distanceTo( camera3D.position );
			
			const theta = - ( ( event.clientX - this.mouse.pos.x ) * 0.5 ) + camera3D.userData.theta;
			let phi = ( ( event.clientY - this.mouse.pos.y ) * 0.5 ) + camera3D.userData.phi;
			phi = Math.min( 170, Math.max( -60, phi ) );

			camera3D.position.x = radious * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
			camera3D.position.y = radious * Math.sin( phi * Math.PI / 360 );
			camera3D.position.z = radious * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );

			camera3D.position.add( camera3D.userData.targetO.position );  
			camera3D.lookAt( camera3D.userData.targetO.position );			
			
			camera3D.userData.targetO.rotation.set( 0, camera3D.rotation.y, 0 );		
		}
		
		if(this.mouse.button === 'right')    
		{
			const intersects = this.fname_s_0213( event, this.planeMath, 'one' );
			if(!intersects[0]) return;
			const offset = new THREE.Vector3().subVectors( camera3D.userData.clickPos, intersects[0].point );
			offset.y = 0;
			camera3D.position.add( offset );
			camera3D.userData.targetO.position.add( offset );			
		}

		this.api.moveCamFly3D()
	}
	
	moveCamFirst3D()
	{
		const camera3D = this.activeCam;
		
				if(this.mouse.button === 'left') 
		{
			const y = ( ( event.clientX - this.mouse.pos.x ) * 0.002 );
			const x = ( ( event.clientY - this.mouse.pos.y ) * 0.002 );

			camera3D.rotation.x -= x;
			camera3D.rotation.y -= y;
			this.mouse.pos.x = event.clientX;
			this.mouse.pos.y = event.clientY;
			
			camera3D.userData.targetO.position.set( camera3D.position.x, camera3D.userData.targetO.position.y, camera3D.position.z );
			camera3D.userData.targetO.rotation.set( 0, camera3D.rotation.y, 0 );			
		}
		
				if(this.mouse.button === 'right')    
		{
			const y = ( ( event.clientX - this.mouse.pos.x ) * 0.005 );
			const x = ( ( event.clientY - this.mouse.pos.y ) * 0.005 );
			
			this.mouse.pos.x = event.clientX;
			this.mouse.pos.y = event.clientY;
			
			const dir = camera3D.getWorldDirection(new THREE.Vector3());
			dir.y = 0;
			dir.normalize();
			
			const offset = new THREE.Vector3().addScaledVector(dir, x);
			
			const dir2 = new THREE.Vector3(-dir.z, 0, dir.x);				const offset2 = new THREE.Vector3().addScaledVector(dir2, -y / 2);
			offset.add(offset2);
			
			camera3D.position.add( offset );
			camera3D.userData.targetO.position.add( offset );			
		}		
	}	
	
	fname_s_0213( event, obj, t ) 
	{		
		const canvas = this.canvas;
		const mouse = fname_s_0211( event );
		
		function fname_s_0211( event )
		{
			const rect = canvas.getBoundingClientRect();

			const x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
			const y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;	
			
			return new THREE.Vector2(x, y);
		}		
		
		const raycaster = new THREE.Raycaster()
		raycaster.setFromCamera( mouse, this.activeCam );
		
		let intersects = null;
		if(t == 'one'){ intersects = raycaster.intersectObject( obj ); } 
		else if(t == 'arr'){ intersects = raycaster.intersectObjects( obj, true ); }
		
		return intersects;
	}


	mouseWheel = (event) =>
	{		
		let delta = -event.wheelDelta / 120;	
		
		this.cameraZoom2D({delta, event});
		this.cameraZoom3D({delta});
		
				
		this.render();
	}
	
	

	cameraZoom2D({delta, event})
	{
		if(!this.activeCam.userData.isCam2D) return;
		const camera = this.activeCam;
		
		const zoomOld = camera.zoom;
		
		camera.zoom -= ( delta * 0.3 * ( camera.zoom / 2 ) );

				const zoomOnTarget = ({event, zoomOld}) =>
		{ 
			this.planeMath.position.set(camera.position.x, 0, camera.position.z);
			this.planeMath.rotation.set(-Math.PI/2,0,0);  
			this.planeMath.updateMatrixWorld();
				
			const intersects = this.fname_s_0213( event, this.planeMath, 'one' );	
			if(intersects.length == 0) return;
			
			const pos = intersects[0].point;

			const xNew = pos.x + (((camera.position.x - pos.x) * camera.zoom) /zoomOld);
			const yNew = pos.z + (((camera.position.z - pos.z) * camera.zoom) /zoomOld);

			camera.position.x += camera.position.x - xNew;
			camera.position.z += camera.position.z - yNew;

			camera.updateMatrixWorld();
		}

		zoomOnTarget({event, zoomOld});
		camera.updateProjectionMatrix();
		
		this.api.cameraZoom2D();		
	}


	cameraZoom3D({delta})
	{
		if(!this.activeCam.userData.isCam3D) return;
		if(this.activeCam.userData.type !== 'fly') return;
		
		const camera3D = this.activeCam;
		
		let movement = ( delta < 0 ) ? 1 : -1;
		movement *= 1.2;
		
		let pos1 = camera3D.userData.targetO.position;
		let pos2 = camera3D.position.clone();
				
		
		const dir = camera3D.getWorldDirection(new THREE.Vector3());
		let offset = new THREE.Vector3().addScaledVector( dir, movement );
		
		pos1 = fname_s_0363({posCenter: pos1, dir: dir, dist: 0.1});
		offset = fname_s_0364({posCenter: pos1, posCam: pos2, offset: offset});
		
		
				function fname_s_0363(params)
		{
			let dir = params.dir;
			let dist = params.dist;
			let posCenter = params.posCenter;
			
			let dirInvers = new THREE.Vector3(-dir.x, -dir.y, -dir.z);		
			let offset = new THREE.Vector3().addScaledVector( dirInvers, dist );
			
			let newPos = new THREE.Vector3().addVectors( posCenter, offset );
			
			return newPos;
		}	
		
		
				function fname_s_0364(params)
		{	
			let offset = params.offset;
			let posCam = params.posCam;
			let posCenter = params.posCenter;
			
			let newPos = new THREE.Vector3().addVectors( posCam, offset );
			let dir2 = new THREE.Vector3().subVectors( posCenter, newPos ).normalize();		
			
			let dot = dir.dot(dir2);

			if(dot < 0) 
			{
				offset = new THREE.Vector3().subVectors( posCenter, posCam )
			}
			
			return offset;
		}	

		camera3D.position.add( offset );			
	}


		fitCamera({obj, rot = true})
	{
		let camera = this.activeCam;

		let v = [];
		
		obj.updateMatrixWorld();
		obj.geometry.computeBoundingBox();	

		let bound = obj.geometry.boundingBox;
		
		v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.max.z).applyMatrix4( obj.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.max.z).applyMatrix4( obj.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.min.z).applyMatrix4( obj.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.min.z).applyMatrix4( obj.matrixWorld );

		v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.max.z).applyMatrix4( obj.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.max.z).applyMatrix4( obj.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.min.z).applyMatrix4( obj.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.min.z).applyMatrix4( obj.matrixWorld );			


		if(camera.userData.isCam3D)
		{
			bound = { min : { x : Infinity, y : Infinity, z : Infinity }, max : { x : -Infinity, y : -Infinity, z : -Infinity } };
			
			for(let i = 0; i < v.length; i++)
			{
				if(v[i].x < bound.min.x) { bound.min.x = v[i].x; }
				if(v[i].x > bound.max.x) { bound.max.x = v[i].x; }
				if(v[i].y < bound.min.y) { bound.min.y = v[i].y; }
				if(v[i].y > bound.max.y) { bound.max.y = v[i].y; }			
				if(v[i].z < bound.min.z) { bound.min.z = v[i].z; }
				if(v[i].z > bound.max.z) { bound.max.z = v[i].z; }		
			}		
			
			
			let center = new THREE.Vector3((bound.max.x - bound.min.x)/2 + bound.min.x, (bound.max.y - bound.min.y)/2 + bound.min.y, (bound.max.z - bound.min.z)/2 + bound.min.z);
			
						if(1==2)
			{
				let g = fname_s_0197(0.01, 0.01, 0.01);
				let material = new THREE.MeshLambertMaterial( { color : 0x030202, transparent: true, opacity: 1, depthTest: false } );

				let cube = [];
				for(let i = 0; i < 6; i++)
				{
					cube[i] = new THREE.Mesh( g, material );
					scene.add( cube[i] );	
				}
				cube[0].position.set(bound.min.x, center.y, center.z); 
				cube[1].position.set(bound.max.x, center.y, center.z); 
				cube[2].position.set(center.x, bound.min.y, center.z); 
				cube[3].position.set(center.x, bound.max.y, center.z); 
				cube[4].position.set(center.x, center.y, bound.min.z); 
				cube[5].position.set(center.x, center.y, bound.max.z);		
			}
			
			let fitOffset = 5.1;
			let maxSize = Math.max( bound.max.x - bound.min.x, bound.max.y - bound.min.y, bound.max.z - bound.min.z );  
												
			
			if(rot)
			{
				camera.lookAt(center);		
				let dir = center.clone().sub( camera.position ).normalize().multiplyScalar( maxSize + 0.25 );	
				camera.position.copy(center).sub(dir);			
			}
			else
			{	
								let dir = obj.getWorldDirection().multiplyScalar( maxSize * 2 );	
				camera.position.copy(center).add(dir);
				camera.lookAt(center);			
			}		
			
			camera.userData.targetO.position.copy( center );
		}
		
		
		if(camera.userData.isCam2D)
		{
			bound = { min : { x : Infinity, z : Infinity }, max : { x : -Infinity, z : -Infinity } };
			
			for(let i = 0; i < v.length; i++)
			{
				if(v[i].x < bound.min.x) { bound.min.x = v[i].x; }
				if(v[i].x > bound.max.x) { bound.max.x = v[i].x; }
				if(v[i].z < bound.min.z) { bound.min.z = v[i].z; }
				if(v[i].z > bound.max.z) { bound.max.z = v[i].z; }		
			}					

			let aspect = ( bound.max.x - bound.min.x )/( bound.max.z - bound.min.z );		
			
			if( aspect > 1.0 )				{
				let x = ( bound.max.x - bound.min.x < 0.1) ? 0.1 : bound.max.x - bound.min.x;
				camera.zoom = camera.right / (x/0.5);
			}
			else
			{
				let z = ( bound.max.z - bound.min.z < 0.1) ? 0.1 : bound.max.z - bound.min.z;
				camera.zoom = camera.top / (z/0.5);
			}
			
			

						let pos = new THREE.Vector3((bound.max.x - bound.min.x)/2 + bound.min.x, 0, (bound.max.z - bound.min.z)/2 + bound.min.z);		
			camera.position.x = pos.x;
			camera.position.z = pos.z;	
		}
		
		camera.updateProjectionMatrix();
		
				
		this.render();
	}
	

		centerCamera2D({arr}={})
	{
		if(!arr) return;
		if(arr.length === 0) return;
		
		let pos = new THREE.Vector3();

		let minX = Infinity; 
		let maxX = -Infinity;
		let minZ = Infinity; 
		let maxZ = -Infinity;		
		
		for ( let i = 0; i < arr.length; i++ )
		{
			if(arr[i].position.x < minX) { minX = arr[i].position.x; }
			if(arr[i].position.x > maxX) { maxX = arr[i].position.x; }
			if(arr[i].position.z < minZ) { minZ = arr[i].position.z; }
			if(arr[i].position.z > maxZ) { maxZ = arr[i].position.z; }
		}				
		
		pos = new THREE.Vector3((maxX - minX)/2 + minX, 0, (maxZ - minZ)/2 + minZ);		
				
		this.cam2D.position.x = pos.x;
		this.cam2D.position.z = pos.z;
	}	
	
	detectBrowser()
	{
		let ua = navigator.userAgent;

		if ( ua.search( /MSIE/ ) > 0 ) return 'Explorer';
		if ( ua.search( /Firefox/ ) > 0 ) return 'Firefox';
		if ( ua.search( /Opera/ ) > 0 ) return 'Opera';
		if ( ua.search( /Chrome/ ) > 0 ) return 'Chrome';
		if ( ua.search( /Safari/ ) > 0 ) return 'Safari';
		if ( ua.search( /Konqueror/ ) > 0 ) return 'Konqueror';
		if ( ua.search( /Iceweasel/ ) > 0 ) return 'Debian';
		if ( ua.search( /SeaMonkey/ ) > 0 ) return 'SeaMonkey';

				if ( ua.search( /Gecko/ ) > 0 ) return 'Gecko';

				return 'Search Bot';
	}	

	render() 
	{
		if (myComposerRenderer) { myComposerRenderer.composer.render(); } 
		else { this.renderer.render( this.scene, this.activeCam ); }
	}
	
}









class MyCameraPerspective extends THREE.PerspectiveCamera 
{
	constructor({fov, aspect, near, far})
	{
		super(fov, aspect, near, far);
		
		this.rotation.order = 'YZX';		
		this.position.set(5, 7, 5);	
		this.lookAt( new THREE.Vector3() );

		this.init();
	}
	
	init()
	{
		this.userData.isCam3D = true;
		this.userData.type = 'fly';			
		this.userData.theta = 0;
		this.userData.phi = 0;		
		this.userData.pos = new THREE.Vector3();
		this.userData.fov = {};
		this.userData.fov.fly = 65;
		this.userData.fov.first = 85;
		this.userData.radius = 0;
		this.userData.clickPos = new THREE.Vector3();
		
		this.userData.targetO = fname_s_0192();	
	}
	
	
	targetO()
	{
		const material = new THREE.MeshStandardMaterial({ color: 0x0000ff, transparent: true, opacity: 1, depthTest: false });
		const obj = new THREE.Mesh( new THREE.BoxGeometry(0.07, 0.07, 0.07), material );
		obj.renderOrder = 2;
		
		this.scene.add( obj );
		
		return obj;
	}


	
	switchType()
	{
		this.userData.type = (this.userData.type === 'fly') ? 'first' : 'fly';
		
		const posCenter = this.userData.targetO.position;
		
		const camera = this;
		
		if(this.userData.type === 'first')
		{		
			this.userData.pos = camera.position.clone();
			this.userData.radius = posCenter.distanceTo(camera.position);		
			
			
			
			
			let dir1 = camera.getWorldDirection(new THREE.Vector3());
			dir1 = new THREE.Vector3().addScaledVector( dir1, 3 );
			const dir2 = new THREE.Vector3(dir1.x, 0, dir1.z).normalize();
			
			const startPos1 = camera.position;
			const endPos1 = new THREE.Vector3(posCenter.x, 1.7, posCenter.z);
			const startPos2 = camera.position.clone().add(dir1);
			const endPos2 = new THREE.Vector3(posCenter.x, 1.7, posCenter.z).add(dir2);
			
			const path_1 = this.pathCamera({startPos: startPos1, endPos: endPos1 });
			const path_2 = this.pathCamera({startPos: startPos2, endPos: endPos2 });			
			this.movePathCam(path_1, path_2);
		
			
			fname_s_0270();	
		}
		
		if(this.userData.type === 'fly')
		{
			const pos = new THREE.Vector3();
			const radius = this.userData.radius;					
			
			const radH = Math.acos(this.userData.pos.y/radius);
			
			this.updateMatrixWorld();
			let dir = this.getWorldDirection(new THREE.Vector3());
			dir = new THREE.Vector3(dir.x, 0, dir.z).normalize();
			
			const radXZ = Math.atan2(dir.z, dir.x);		
		
			pos.x = -radius * Math.sin(radH) * Math.cos(radXZ) + posCenter.x; 
			pos.z = -radius * Math.sin(radH) * Math.sin(radXZ) + posCenter.z;
			pos.y = radius * Math.cos(radH);					
			
			
			
			
			
			let dir1 = camera.getWorldDirection(new THREE.Vector3());
			dir1 = new THREE.Vector3().addScaledVector( dir1, 3 );

			const path_1 = this.pathCamera({startPos: camera.position, endPos: pos });
			const path_2 = this.pathCamera({startPos: camera.position.clone().add(dir1), endPos: posCenter });			
			this.movePathCam(path_1, path_2);			
			
			
			fname_s_0268();
			if(divLevelVisible.wallTransparent && this.userData.type === 'fly') fname_s_0269();	
			else fname_s_0270();
		}
	}

	
	moveCameraToNewPosition()
	{

		if ( !newCameraPosition ) return;
		
		if ( camera == camera3D && newCameraPosition.positionFirst || camera == camera3D && newCameraPosition.positionFly )
		{
			var pos = (newCameraPosition.positionFirst) ? newCameraPosition.positionFirst : newCameraPosition.positionFly;
			
			camera.position.lerp( pos, 0.1 );
			
			
			if(newCameraPosition.positionFirst)
			{
				var dir = camera.getWorldDirection(new THREE.Vector3()); 			
				dir.y = 0; 
				dir.normalize();
				dir.add( newCameraPosition.positionFirst );	
				camera.lookAt( dir );
			}
			if(newCameraPosition.positionFly)
			{
				var radius_1 = camera3D.userData.camera.save.radius;
				var radius_2 = infProject.camera.d3.targetO.position.distanceTo(camera.position);
				
				var k = Math.abs((radius_2/radius_1) - 1);
				
				var dir = camera.getWorldDirection(new THREE.Vector3()); 			
				dir.y = 0; 
				dir.normalize();
				dir.x *= 15*k;
				dir.z *= 15*k;
				dir.add( infProject.camera.d3.targetO.position );	
				
				camera.lookAt( dir ); 
			}		
			
			
			if(fname_s_021(camera.position, pos)) 
			{ 	
				newCameraPosition = null; 
			};		
		}
		else
		{
			newCameraPosition = null;
		}
		
		renderCamera();
	}

	
	
	movePathCam(path, path_2) 
	{
		const camera = this;

		const length = path.points.length;
		const t2 = (path.p1 + path.pi) / length;
		const p1 = Math.floor(path.p1 + path.pi) % length;
		const p2 = (p1 + 1) % length;

		if (path.pi >= 1) path.pi = 0;

		const points = path.points;

		let pos = new THREE.Vector3();
		pos = new THREE.Vector3().subVectors(points[p2], points[p1]);
		pos = new THREE.Vector3().addScaledVector(pos, path.pi);
		pos.add(points[p1]);

		camera.position.copy(pos);

		if (path_2) 
		{
			const points_2 = path_2.points;

			let pos_2 = new THREE.Vector3();
			pos_2 = new THREE.Vector3().subVectors(points_2[p2], points_2[p1]);
			pos_2 = new THREE.Vector3().addScaledVector(pos_2, path.pi);
			pos_2.add(points_2[p1]);

			camera.lookAt(pos_2);
		}

		path.p1 = p1;
		path.p2 = p2;
		path.pi += 0.25 + 0.003;
		
		
		if(camera.userData.type === 'fly') { camera.fov += (camera.userData.fov.fly - camera.fov) * t2; }
		if(camera.userData.type === 'first') { camera.fov += (camera.userData.fov.first - camera.fov) * t2; }
		camera.updateProjectionMatrix();
	
		renderCamera();
		
		if (p1 + 1 < length) 
		{
			requestAnimationFrame(() => {this.movePathCam(path, path_2);});
		}
	}
  
	
	pathCamera({startPos, endPos}) 
	{
		const helpTool = false;

		const count = 21;
		const dist = startPos.distanceTo(endPos);
		const dir = new THREE.Vector3().subVectors(endPos, startPos).normalize();
		const unit = new THREE.Vector3().addScaledVector(dir, dist / (count - 1));

		const points = [];

		for (let i = 0; i < count; i++) 
		{
			points[i] = new THREE.Vector3().addScaledVector(unit, i);
			points[i].add(startPos);
		}

		const path = { p1: 0, p2: 1, pi: 0, points };

		if (helpTool) 
		{
			const geometry = new THREE.BufferGeometry().setFromPoints(points);
			const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
			const line = new THREE.Line(geometry, material);
			scene.add(line);

			for (let i = 0; i < points.length; i++) 
			{
				const o = new THREE.Mesh( new THREE.SphereGeometry(0.02, 16, 16), new THREE.MeshBasicMaterial({ color: 0x0000ff }) );
				o.position.copy(points[i]);
				scene.add(o);
			}
		}

		return path;
	}	
}


class MyCameraMoveKey
{
	constructor()
	{
		
	}

	updateKeyDown()
	{  
		if(!docReady) return;
		if(infProject.settings.blockKeyCode) return;
		
		const keys = clickO.keys;  		
		if(keys.length === 0) return;

		if (myCameraOrbit.activeCam.userData.isCam2D) this.moveCam2D(keys);
		if (myCameraOrbit.activeCam.userData.isCam3D) this.moveCam3D(keys);
	}
	
	moveCam2D(keys)
	{
		const cam2D = myCameraOrbit.activeCam;
		let x = 0;
		let z = 0;
		const kof = 0.05;
		
		if ( keys[ 87 ] || keys[ 38 ] ) z -= kof;
		else if ( keys[ 83 ] || keys[ 40 ] ) z += kof;
		
		if ( keys[ 65 ] || keys[ 37 ] ) x -= kof;
		else if ( keys[ 68 ] || keys[ 39 ] ) x += kof;
		
		if(x !== 0 || z !== 0)
		{			
			cam2D.position.x += x;
			cam2D.position.z += z;
			
			myCameraOrbit.cam2D.updateMatrixWorld();
			
			fname_s_0193();
			
			this.render()
		}		
	}
	
	moveCam3D(keys)
	{
		const cam3D = myCameraOrbit.activeCam;
		
		const kof = (cam3D.userData.type === 'fly') ? 0.1 : 0.05;
		let dirX = new THREE.Vector3();
		let dirZ = new THREE.Vector3();
		
		if ( keys[ 87 ] || keys[ 38 ] ) 
		{
			const x = Math.sin( cam3D.rotation.y );
			const z = Math.cos( cam3D.rotation.y );
			dirX = new THREE.Vector3( -x, 0, -z );
			dirX = new THREE.Vector3().addScaledVector( dirX, kof );
		}
		else if ( keys[ 83 ] || keys[ 40 ] ) 
		{
			const x = Math.sin( cam3D.rotation.y );
			const z = Math.cos( cam3D.rotation.y );
			dirX = new THREE.Vector3( x, 0, z );
			dirX = new THREE.Vector3().addScaledVector( dirX, kof );
		}
		if ( keys[ 65 ] || keys[ 37 ] ) 
		{
			const x = Math.sin( cam3D.rotation.y - 1.5707963267948966 );
			const z = Math.cos( cam3D.rotation.y - 1.5707963267948966 );
			dirZ = new THREE.Vector3( x, 0, z );
			dirZ = new THREE.Vector3().addScaledVector( dirZ, kof );
		}
		else if ( keys[ 68 ] || keys[ 39 ] ) 
		{
			const x = Math.sin( cam3D.rotation.y + 1.5707963267948966 );
			const z = Math.cos( cam3D.rotation.y + 1.5707963267948966 );
			dirZ = new THREE.Vector3( x, 0, z );
			dirZ = new THREE.Vector3().addScaledVector( dirZ, kof );
		}
		if ( keys[ 88 ] && 1==2 ) 
		{
			dir = new THREE.Vector3( 0, 1, 0 );
			dir = new THREE.Vector3().addScaledVector( dir, -kof );
		}
		else if ( keys[ 67 ] && 1==2 ) 
		{
			dir = new THREE.Vector3( 0, 1, 0 );
			dir = new THREE.Vector3().addScaledVector( dir, kof );
		}
		
		if(dirX.length() > 0 || dirZ.length() > 0) 
		{					
			if(dirX.length() > 0 && dirZ.length() > 0)
			{
				dirX = new THREE.Vector3().addScaledVector( dirX, 0.75 );
				dirZ = new THREE.Vector3().addScaledVector( dirZ, 0.75 );
			}
			
			cam3D.position.add( dirX );
			cam3D.position.add( dirZ );
			
			cam3D.userData.targetO.position.add( dirX );
			cam3D.userData.targetO.position.add( dirZ );
			
			this.render();
		}		
	}	

	render()
	{
		renderCamera(); 
	}
}


















class EventMyCamera
{
	constructor()
	{
		
	}
	
	setActiveCam({camera})
	{
		fname_s_0217();
		myComposerRenderer.outlineRemoveObj();	
		if(myComposerRenderer) myComposerRenderer.fname_s_084({camera});

		fname_s_084();
	}
		
	moveCam2D()
	{  
		fname_s_0193();
	}
		
	moveCamFly3D()
	{
		if(divLevelVisible.wallTransparent) fname_s_0269();
	}
	
	cameraZoom2D()
	{
		fname_s_0193();
		
		const delta = myCameraOrbit.cam2D.zoom;
		
		infProject.tools.axis[0].scale.set(1,1/delta,1/delta);
		infProject.tools.axis[1].scale.set(1,1/delta,1/delta);
		
		
		const k = 1 / delta;
		if(k <= infProject.settings.camera.limitZoom) 
		{		
			
			const point = infProject.tools.point;	
			const v = point.geometry.vertices;
			const v2 = point.userData.tool_point.v2;
				
			for ( let i = 0; i < v2.length; i++ )
			{
				v[i].x = v2[i].x * 1/delta;
				v[i].z = v2[i].z * 1/delta;
			}	

			infProject.tools.point.geometry.verticesNeedUpdate = true;
			infProject.tools.point.geometry.elementsNeedUpdate = true;


			
			for ( let i = 0; i < infProject.scene.size.wd_1.line.length; i++ ){ infProject.scene.size.wd_1.line[i].scale.set(1,1/delta,1/delta); }			
		}		
	}
	
	camFit()
	{
		
	}	
}










class MyComposerRenderer
{
	renderer;
	scene;
	container;
	camera;
	
	composer;
	renderPass;
	outlinePass;	
	fxaaPass;
	saoPass;
	
	constructor({container, renderer, scene, camera})
	{
		this.container = container;
		this.renderer = renderer;
		this.scene = scene;
		this.camera = camera;
		
		this.init();
	}
	
	init()
	{
		this.composer = new THREE.EffectComposer( this.renderer );
		this.composer.setSize( this.container.clientWidth, this.container.clientHeight );
		
		this.renderPass = new THREE.RenderPass( this.scene, this.camera );
		this.composer.addPass( this.renderPass );
		
		this.initOutline();
		this.initFxaa();
		
	}

	
	initOutline()
	{
		const ccc = new THREE.Color().setHex( '0x'+infProject.settings.profile.color );
		
		this.outlinePass = new THREE.OutlinePass( new THREE.Vector2( this.container.clientWidth, this.container.clientHeight ), this.scene, this.camera );
		this.outlinePass.visibleEdgeColor.set( ccc );
		this.outlinePass.hiddenEdgeColor.set( ccc );
		this.outlinePass.edgeStrength = Number( 5 );		
		this.outlinePass.edgeThickness = Number( 0.01 );	

		this.outlinePass.selectedObjects = [];

		this.composer.addPass( this.outlinePass );
	}
	
	initFxaa()	
	{
		this.fxaaPass = new THREE.ShaderPass( THREE.FXAAShader );	
		this.fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( containerF.clientWidth * window.devicePixelRatio );
		this.fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( containerF.clientHeight * window.devicePixelRatio );	
		this.fxaaPass.enabled = false;
		
		this.composer.addPass( this.fxaaPass ); 	
	}	
	
	
	initSao()
	{
		this.saoPass = new THREE.SAOPass(this.scene, this.camera, true, true);	
		
		this.saoPass['params']['output'] = THREE.SAOPass.OUTPUT.Default;
		this.saoPass['params']['saoBias'] = 1;
		this.saoPass['params']['saoIntensity'] = .05;
		this.saoPass['params']['saoScale'] = 100;
		this.saoPass['params']['saoKernelRadius'] = 5;
		this.saoPass['params']['saoMinResolution'] = 0;
		this.saoPass['params']['saoBlur'] = true;
		this.saoPass['params']['saoBlurRadius'] = 8;
		this.saoPass['params']['saoBlurStdDev'] = 4;
		this.saoPass['params']['saoBlurDepthCutoff'] = .01;
		
		this.composer.addPass( this.saoPass );		
	}
	
	fname_s_084({camera})
	{
		this.renderPass.camera = camera;
		this.outlinePass.renderCamera = camera;
		if(this.saoPass) this.saoPass.camera = camera;		
	}

	outlineAddObj({arr})
	{			
		this.outlinePass.selectedObjects = arr;  
	}

	outlineRemoveObj()
	{
		this.outlinePass.selectedObjects = [];
	}	
}



class MyMouse
{
	scene;
	container;
	
	constructor({container, renderer, scene, camera})
	{
		this.container = container;
		this.scene = scene;
		
		this.initEvent();
	}
	
	initEvent()
	{
		this.container.addEventListener('contextmenu', function(event) { event.preventDefault() });
		this.container.addEventListener( 'mousedown', fname_s_075, false );
		this.container.addEventListener( 'mousemove', fname_s_079, false );
		this.container.addEventListener( 'mouseup', fname_s_080, false );


		this.container.addEventListener( 'touchstart', fname_s_075, false );
		this.container.addEventListener( 'touchmove', fname_s_079, false );
		this.container.addEventListener( 'touchend', fname_s_080, false );				
	}

	
	initOutline()
	{
		const ccc = new THREE.Color().setHex( '0x'+infProject.settings.profile.color );
		
		this.outlinePass = new THREE.OutlinePass( new THREE.Vector2( this.container.clientWidth, this.container.clientHeight ), this.scene, this.camera );
		this.outlinePass.visibleEdgeColor.set( ccc );
		this.outlinePass.hiddenEdgeColor.set( ccc );
		this.outlinePass.edgeStrength = Number( 5 );		
		this.outlinePass.edgeThickness = Number( 0.01 );	

		this.outlinePass.selectedObjects = [];

		this.composer.addPass( this.outlinePass );
	}
	
	initFxaa()	
	{
		this.fxaaPass = new THREE.ShaderPass( THREE.FXAAShader );	
		this.fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( containerF.clientWidth * window.devicePixelRatio );
		this.fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( containerF.clientHeight * window.devicePixelRatio );	
		this.fxaaPass.enabled = false;
		
		this.composer.addPass( this.fxaaPass ); 	
	}	
	
	
	initSao()
	{
		this.saoPass = new THREE.SAOPass(this.scene, this.camera, true, true);	
		
		this.saoPass['params']['output'] = THREE.SAOPass.OUTPUT.Default;
		this.saoPass['params']['saoBias'] = 1;
		this.saoPass['params']['saoIntensity'] = .05;
		this.saoPass['params']['saoScale'] = 100;
		this.saoPass['params']['saoKernelRadius'] = 5;
		this.saoPass['params']['saoMinResolution'] = 0;
		this.saoPass['params']['saoBlur'] = true;
		this.saoPass['params']['saoBlurRadius'] = 8;
		this.saoPass['params']['saoBlurStdDev'] = 4;
		this.saoPass['params']['saoBlurDepthCutoff'] = .01;
		
		this.composer.addPass( this.saoPass );		
	}
	
	fname_s_084({camera})
	{
		this.renderPass.camera = camera;
		this.outlinePass.renderCamera = camera;
		if(this.saoPass) this.saoPass.camera = camera;		
	}

	outlineAddObj({arr})
	{			
		this.outlinePass.selectedObjects = arr;  
	}

	outlineRemoveObj()
	{
		this.outlinePass.selectedObjects = [];
	}	
}

