


var w_w = window.innerWidth;
var w_h = window.innerHeight;
var aspect = w_w/w_h;
var d = 5;

var renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true, /*antialias : true*/});
renderer.localClippingEnabled = true;
//renderer.autoClear = false;
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( w_w, w_h );
//renderer.setClearColor (0xffffff, 1);
//renderer.setClearColor (0x9c9c9c, 1);
document.body.appendChild( renderer.domElement );

var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );

//----------- cameraTop
var cameraTop = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );
cameraTop.position.set(0, 10, 0);
cameraTop.lookAt(scene.position);
cameraTop.zoom = infProject.settings.camera.zoom;
cameraTop.updateMatrixWorld();
cameraTop.updateProjectionMatrix();
//----------- cameraTop


//----------- camera3D
var camera3D = new THREE.PerspectiveCamera( 65, w_w / w_h, 0.2, 1000 );  
camera3D.rotation.order = 'YZX';		//'ZYX'
camera3D.position.set(5, 7, 5);
camera3D.lookAt(scene.position);
camera3D.rotation.z = 0;
camera3D.userData.camera = { type : 'fly', height : camera3D.position.y, startProject : true };
camera3D.userData.camera.click = { pos : new THREE.Vector3() }; 
//----------- camera3D




//----------- cameraWall
var cameraWall = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );
cameraWall.zoom = 2
//----------- cameraWall


//----------- Light 
scene.add( new THREE.AmbientLight( 0xffffff, 0.6 ) ); 

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
//----------- Light



var cube = new THREE.Mesh( createGeometryCube(0.07, 0.07, 0.07), new THREE.MeshLambertMaterial( { color : 0x030202, transparent: true, opacity: 1, depthTest: false } ) );
//scene.add( cube ); 


// показать все переменные
if(1==2)
{	
	for (var prop in window) 
	{
		if (window.hasOwnProperty(prop)) { console.log(prop, window[prop]); }
	}
} 

if(1==2)
{
	var cube2 = new THREE.Mesh( createGeometryCube(1.2, 1.2, 1.2), new THREE.MeshLambertMaterial( { color : 0xffff00 } ) );

	for ( var i = 0; i < cube2.geometry.faces.length; i++ ) 
	{	
		var color = new THREE.Color( 0xffffff ).setHSL( Math.random(), 0.5, 0.5 );
		cube2.geometry.faces[ i ].vertexColors[0] = color;	
		cube2.geometry.faces[ i ].vertexColors[1] = color;
		cube2.geometry.faces[ i ].vertexColors[2] = color;		
	}

	//console.log(cube2.geometry.faces);
	//geometry.colorsNeedUpdate = true;
	scene.add( cube2 ); 	
}



//----------- render
function animate() 
{
	requestAnimationFrame( animate );	

	cameraZoomTopLoop();	
	moveCameraToNewPosition();
	
	updateKeyDown();
}



function renderCamera()
{
	drawRender();
}



var moveTexture = { };

function drawRender()
{
	camera.updateMatrixWorld();			
	
	renderer.autoClear = true;
	renderer.clear();
	renderer.render(scene, camera);
}


//----------- render


//----------- onWindowResize
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize() 
{ 
	var aspect = window.innerWidth / window.innerHeight;
	var d = 5;
	
	cameraTop.left = -d * aspect;
	cameraTop.right = d * aspect;
	cameraTop.top = d;
	cameraTop.bottom = -d;
	cameraTop.updateProjectionMatrix();

	 
	camera3D.aspect = aspect;
	camera3D.updateProjectionMatrix();
	
	cameraWall.left = -d * aspect;
	cameraWall.right = d * aspect;
	cameraWall.top = d;
	cameraWall.bottom = -d;
	cameraWall.updateProjectionMatrix();
	
	renderer.setSize(window.innerWidth, window.innerHeight);
	
	renderCamera();
}
//----------- onWindowResize






var abo = { wall : {}, window : {}, door : {}, point : {}, room : {}, objPop : {} };

abo.wall = { create : true, delete : true, click2D : true, click3D : true, move : true, replace : true };
abo.window = { create : true, delete : true, click2D : true, click3D : true, move : true, replace : true };
abo.door = { create : true, delete : true, click2D : true, click3D : true, move : true, replace : true };
abo.point = { create : true, delete : true, click2D : true, click3D : true, move : true, replace : true };
abo.objPop = { create : true, delete : true, click2D : true, click3D : true, move : true, replace : true };


// включаем параметры блокировки различных действий
function assignBlockParam(value)
{
	if(!value) return;
	
	var flag = (value == 0) ? true : false;
	
	abo.wall.click2D = flag;

	abo.point.click2D = flag; 
	abo.point.click3D = flag;

	abo.window.click2D = flag; 
	abo.window.click3D = flag; 

	abo.door.move = flag; 
	abo.door.delete = flag; 	
}


//----------- start


var resolutionD_w = window.screen.availWidth;
var resolutionD_h = window.screen.availHeight;

var kof_rd = 1;

var countId = 2;
var levelFloor = 1;
var projName = 'Новый проект';
var projVersion = '1';
var keys = [];
var camera = cameraTop;
var height_wall = infProject.settings.height;
var width_wall = infProject.settings.wall.width;
var obj_point = [];
var obj_line = [];
var arr_window = [];
var arr_door = [];
var arr_obj = [];
var room = [];
var ceiling = [];
var arrWallFront = [];

var clickO = resetPop.clickO();
infProject.scene.array = resetPop.infProjectSceneArray();
infProject.scene.grid = { obj : createGrid(infProject.settings.grid).obj };
infProject.scene.block = { key : { scroll : false } };		// блокировка действий/клавишь 
infProject.tools = { cutWall : [] } 

var actColorWin = new THREE.Color('rgb(255,0,0)');
var colorHover = new THREE.Color('rgb(55, 125, 61)');
var colDoor = 'rgb(166, 151, 99)';
var colWin = 'rgb(122, 160, 195)';


// cutoff боковые отсечки для линеек
// format_1 линейки для отображения длины/высоты стены в режиме cameraWall
// format_2 линейки для окон/мебели
// format_3 нижние размеры между мебелью в режиме cameraWall 
// cube контроллеры для изменения ширины/длины wd
var arrSize = { cutoff : createRulerCutoff(), format_1 : {}, format_2 : {}, format_3 : {line : [], label : []}, cube : createControllWD() };
var labelGeometry_1 = createGeometryPlan2(0.25 * kof_rd, 0.125 * kof_rd); 
arrSize.format_1 = { line : createRulerWin({count : 6, color : 0xcccccc, material : 'standart'}), label : createLabelCameraWall({ count : 2, text : 0, size : 50, ratio : {x:256*2, y:256}, border : 'white', geometry : labelGeometry_1 }) };
arrSize.format_2 = { line : createRulerWin({count : 6, color : 0x000000}), label : createLabelCameraWall({ count : 6, text : 0, size : 50, ratio : {x:256*2, y:256}, border : 'border line', geometry : labelGeometry_1 }) };
arrSize.numberTexture = { line : createRulerWin({count : 6, color : 0x000000, material : 'standart'}), label : createLabelCameraWall({ count : 6, text : [1,2,3,4,5,6], materialTop : 'no', size : 85, ratio : {x:256, y:256}, geometry : createGeometryPlan(0.25, 0.25) }) };


var wallVisible = [];
var circle = createCircleSpline();
var p_tool = createToolPoint();
var d_tool = createToolDoorPoint();

//var pointGrid = createPointGrid(100);
var pointGrid = { visible : true }


var planeMath = createPlaneMath();
var planeMath2 = createPlaneMath2();

var geometryLabelWall = createGeometryPlan(0.25 * 2, 0.125 * 2);
var geometryLabelFloor = createGeometryPlan(1.0 * kof_rd, 0.25 * kof_rd);



var nameRoomDef = 'Гостиная';
var param_ugol = { file : '', hash : '', key : '', link_render : '', link_save : '' };

var lineAxis_1 = createLineAxis( new THREE.Vector3(0,0,0), new THREE.Vector3(1,0,0) );
var lineAxis_2 = createLineAxis( new THREE.Vector3(0,0,0), new THREE.Vector3(1,0,0) );
lineAxis_1.visible = false;
lineAxis_2.visible = false;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var offset = new THREE.Vector3();
  
  
 
 
if(infProject.settings.calc.fundament == 'svai') 
{
	infProject.scene.tool.pillar = createPillar();
}


camera3D.position.x = radious * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
camera3D.position.y = radious * Math.sin( phi * Math.PI / 360 );
camera3D.position.z = radious * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
	
camera3D.position.add(centerCam);	
camera3D.lookAt(centerCam);


//----------- start




function createPillar()
{	
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
		v[n].y = -1;
		n++;	
		
		v[n] = new THREE.Vector3();
		v[n].y = -1;
		n++;		
	}	

	
	var obj = new THREE.Mesh( createGeometryCircle(v), new THREE.MeshLambertMaterial( { color : 0x333333, wireframe:false } ) ); 
	obj.userData.tag = 'pillar';
	obj.renderOrder = 1;
	obj.position.set(0,0,0);
	
	return obj;
}



function createGrid(cdm)
{
	var lineGrid = new THREE.Group();
	
	var offset = (cdm.offset) ? cdm.offset : 1;
	
	var geom_line = new THREE.Geometry();
	var count_grid1 = cdm.value;
	var count_grid2 = (count_grid1 * offset) / 2; 
	geom_line.vertices.push(new THREE.Vector3( - count_grid2, 0, 0 ) );
	geom_line.vertices.push(new THREE.Vector3( count_grid2, 0, 0 ) );
	
	var linesMaterial = new THREE.LineBasicMaterial( { color: 0xd6d6d6, opacity: 1, linewidth: .1 } );

	for ( var i = 0; i <= count_grid1; i ++ ) 
	{
		var line = new THREE.Line( geom_line, linesMaterial );
		line.position.z = ( i * offset ) - count_grid2;
		line.position.y = -0.01;
		lineGrid.add( line );

		var line = new THREE.Line( geom_line, linesMaterial );
		line.position.x = ( i * offset ) - count_grid2;
		line.position.y = -0.01;
		line.rotation.y = 90 * Math.PI / 180;
		lineGrid.add( line );
	}
	
	scene.add( lineGrid );	

	var x = count_grid1/2;
	var y = count_grid1/2;

	var limit = (cdm.limit) ? cdm.limit : false;
	
	return { limit : limit, obj : lineGrid, bound : { min : {x:-x, y:-y}, max : {x:x, y:y} } };
}


function createPointGrid(size) {
  var pointMaterial = new THREE.PointsMaterial({ size: 0.04, color: 0xafafaf });
  var pointGeometry = new THREE.Geometry();
  var x = y = z = 0;
  for (var i = -size; i < size; i++) {
    for (var k = -size; k < size; k++) {
      
      var point = new THREE.Vector3();
      point.x = x + i * 0.5;
      point.y = -0.05;
      point.z = z + k * 0.5;
      
      // pointMaterial.sizeAttenuation = false;
      pointGeometry.vertices.push(point);
    }
  }
  
  var pointGrid = new THREE.Points(pointGeometry, pointMaterial);

  scene.add(pointGrid);
  
  return pointGrid;
}


function createPlaneMath()
{
	var geometry = new THREE.PlaneGeometry( 10000, 10000 );
	var mat_pm = new THREE.MeshLambertMaterial( {color: 0xffff00, transparent: true, opacity: 0.0, side: THREE.DoubleSide } );
	mat_pm.visible = false; 
	var planeMath = new THREE.Mesh( geometry, mat_pm );
	planeMath.rotation.set(-Math.PI/2, 0, 0);
	planeMath.userData.tag = 'planeMath';	
	scene.add( planeMath );	
	
	return planeMath;
}



function createPlaneMath2()
{
	var geometry = createGeometryCube(10000, 0.0001, 10000);
	var mat_pm = new THREE.MeshLambertMaterial( {color: 0xffff00, transparent: true, opacity: 0.0, side: THREE.DoubleSide } );
	mat_pm.visible = false;
	var planeMath = new THREE.Mesh( geometry, mat_pm );
	planeMath.rotation.set(0, 0, 0);
	planeMath.userData.tag = 'planeMath3';	
	scene.add( planeMath );	
	
	return planeMath;
}
 



function createGeometryPlan(x, y)
{
	var geometry = new THREE.Geometry();
	var vertices = [
				new THREE.Vector3(-x,0,-y),
				new THREE.Vector3(-x,0,y),
				new THREE.Vector3(x,0,y),
				new THREE.Vector3(x,0,-y),
			];

	var faces = [
				new THREE.Face3(0,1,2),
				new THREE.Face3(2,3,0),
			];
	var uvs1 = [
				new THREE.Vector2(0,1),
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
			];
	var uvs2 = [
				new THREE.Vector2(1,0),
				new THREE.Vector2(1,1),
				new THREE.Vector2(0,1),
			];			
	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.faceVertexUvs[0] = [uvs1, uvs2];
	geometry.computeFaceNormals();
	
	geometry.uvsNeedUpdate = true;
	
	return geometry;
}



function createGeometryPlan2(x, y)
{
	var geometry = new THREE.Geometry();
	var vertices = [
				new THREE.Vector3(-x,-y,0),
				new THREE.Vector3(-x,y,0),
				new THREE.Vector3(x,y,0),
				new THREE.Vector3(x,-y,0),
			];

	var faces = [
				new THREE.Face3(0,3,2),
				new THREE.Face3(2,1,0),
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
	geometry.faceVertexUvs[0] = [uvs1, uvs2];
	geometry.computeFaceNormals();
	
	geometry.uvsNeedUpdate = true;
	
	return geometry;
}



function createGeometryCube(x, y, z, cdm)
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



function createGeometryWD(x, y, z) 
{
	var geometry = new THREE.Geometry();
	x /= 2;
	y /= 2;
	z /= 2;
	var vertices = [
				new THREE.Vector3(-x,-y,z),
				new THREE.Vector3(-x,y,z),
				new THREE.Vector3(x,y,z),
				new THREE.Vector3(x,-y,z),
				new THREE.Vector3(x,-y,-z),
				new THREE.Vector3(x,y,-z),
				new THREE.Vector3(-x,y,-z),
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



function createGeometryWall(x, y, z, pr_offsetZ)
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



function createLineAxis( p1, p2 ) 
{
	var geometry = createGeometryCube(0.5, 0.01, 0.01);
	
	var d = p1.distanceTo( p2 );	
	var v = geometry.vertices;
	
	v[3].x = v[2].x = v[5].x = v[4].x = d;
	v[0].x = v[1].x = v[6].x = v[7].x = 0;
	
	
	var wall = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color : 0xff0000, transparent: true, depthTest: false } ) );
	wall.position.copy( p1 );
	wall.renderOrder = 2;
	scene.add( wall );		

	
	var dir = new THREE.Vector3().subVectors( p1, p2 ).normalize();
	var angleDeg = Math.atan2(dir.x, dir.z);
	wall.rotation.set(0, angleDeg + Math.PI / 2, 0);			
	
	wall.position.y = 3;
	
	return wall;
}

// vertex для Gizmo
function createGeometryCircle( vertices )
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


function createGeometryPivot(x, y, z)
{
	var geometry = new THREE.Geometry();
	y /= 2;
	z /= 2;
	var vertices = [
				new THREE.Vector3(0,-y,z),
				new THREE.Vector3(0,y,z),
				new THREE.Vector3(x,y,z),
				new THREE.Vector3(x,-y,z),
				new THREE.Vector3(x,-y,-z),
				new THREE.Vector3(x,y,-z),
				new THREE.Vector3(0,y,-z),
				new THREE.Vector3(0,-y,-z),
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
	geometry.faceVertexUvs[0] = [uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2];
	geometry.computeFaceNormals();	
	geometry.uvsNeedUpdate = true;		
	
	return geometry;
}



function createCircleSpline()
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
		//circle[i].y = 0;
	}

	return circle;
}


function createToolPoint()
{	
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
		v[n].y = height_wall + 0.01;
		n++;	
		
		v[n] = new THREE.Vector3();
		v[n].y = height_wall + 0.01;
		n++;		
	}	

	
	var obj = new THREE.Mesh( createGeometryCircle(v), new THREE.MeshLambertMaterial( { color : 0x333333, wireframe:false } ) ); 
	obj.userData.tag = 'tool_point';
	obj.renderOrder = 1;
	obj.position.set(0,0,0);
	obj.visible = false;	
	scene.add( obj );
	
	return obj;
}



function createToolDoorPoint()
{
	var mat = new THREE.MeshLambertMaterial( { color : 0x222222 } );	
	var geom = createGeometryCube(0.12, 0.01, 0.12);
	obj = new THREE.Mesh( geom, mat );
	obj.userData.tag = 'd_tool';
	obj.door = null;
	obj.position.set(0,0,0);
	obj.visible = false;
	obj.renderOrder = 1.1;
	scene.add( obj );
	
	return obj;
}





function createForm(cdm) 
{
	var form = cdm.form;
	
	var arrP = [];
	resetScene();
	console.log(form);
	
	if(form == 'plan_area') { var arrP = [new THREE.Vector3(-3,0,-2), new THREE.Vector3(-3,0,2), new THREE.Vector3(0,0,2), new THREE.Vector3(0,0,0), new THREE.Vector3(3,0,0), new THREE.Vector3(3,0,-2)]; }	
	else if(form == 'shape1') { var arrP = [new THREE.Vector3(-3,0,-3), new THREE.Vector3(-3,0,3), new THREE.Vector3(3,0,3), new THREE.Vector3(3,0,-3)]; }
	else if(form == 'shape2') { var arrP = [new THREE.Vector3(0,0,-2), new THREE.Vector3(-3,0,2), new THREE.Vector3(3,0,2)]; }
	else if(form == 'shape3') { var arrP = [new THREE.Vector3(-3,0,-2), new THREE.Vector3(-3,0,2), new THREE.Vector3(0,0,2), new THREE.Vector3(0,0,0), new THREE.Vector3(3,0,0), new THREE.Vector3(3,0,-2)]; }
	else if(form == 'shape4') { var arrP = [new THREE.Vector3(-3,0,0), new THREE.Vector3(-3,0,3), new THREE.Vector3(3,0,3), new THREE.Vector3(3,0,-3), new THREE.Vector3(0,0,-3), new THREE.Vector3(0,0,0)]; }	
	else if(form == 'shape5') { var arrP = [new THREE.Vector3(-4,0,-1.5), new THREE.Vector3(-4,0,3), new THREE.Vector3(0,0,3), new THREE.Vector3(4,0,3), new THREE.Vector3(4,0,-1.5), new THREE.Vector3(2,0,-1.5), new THREE.Vector3(1,0,-3), new THREE.Vector3(-1,0,-3), new THREE.Vector3(-2,0,-1.5)]; }
	else if(form == 'shape6') { var arrP = [new THREE.Vector3(-3,0,-3), new THREE.Vector3(-3,0,0), new THREE.Vector3(0,0,3), new THREE.Vector3(3,0,3), new THREE.Vector3(3,0,-3)]; }
	else if(form == 'shape7') { var arrP = [new THREE.Vector3(-3,0,-2), new THREE.Vector3(-3,0,2), new THREE.Vector3(0,0,2), new THREE.Vector3(3,0,2), new THREE.Vector3(3,0,-2), new THREE.Vector3(0,0,-2)]; }		
	else if(form == 'shape8') { var arrP = [new THREE.Vector3(-3,0,-2), new THREE.Vector3(-3,0,2), new THREE.Vector3(-1,0,2), new THREE.Vector3(1,0,2), new THREE.Vector3(3,0,2), new THREE.Vector3(3,0,-2), new THREE.Vector3(1,0,-2), new THREE.Vector3(-1,0,-2)]; }	
	else if(form == 'shape9') { var arrP = [new THREE.Vector3(-3,0,-2), new THREE.Vector3(-3,0,0), new THREE.Vector3(-3,0,2), new THREE.Vector3(-1,0,2), new THREE.Vector3(1,0,2), new THREE.Vector3(3,0,2), new THREE.Vector3(3,0,0), new THREE.Vector3(3,0,-2), new THREE.Vector3(1,0,-2), new THREE.Vector3(-1,0,-2)]; }
	else if(form == 'shape10') { var arrP = [new THREE.Vector3(-3,0,-2), new THREE.Vector3(-3,0,0), new THREE.Vector3(-3,0,2), new THREE.Vector3(0,0,2), new THREE.Vector3(0,0,0), new THREE.Vector3(3,0,0), new THREE.Vector3(3,0,-2), new THREE.Vector3(0,0,-2)]; }
	else if(form == 'shape11') { var arrP = [new THREE.Vector3(-2,0,-1), new THREE.Vector3(-2,0,1), new THREE.Vector3(0,0,2), new THREE.Vector3(2,0,1), new THREE.Vector3(2,0,-1), new THREE.Vector3(0,0,-2)]; }
	else if(form == 'shape12') { var arrP = [new THREE.Vector3(-1,0,-2), new THREE.Vector3(-1,0,-1), new THREE.Vector3(-3,0,-1), new THREE.Vector3(-3,0,1), new THREE.Vector3(-1,0,1), new THREE.Vector3(-1,0,2), new THREE.Vector3(1,0,2), new THREE.Vector3(1,0,1), new THREE.Vector3(3,0,1), new THREE.Vector3(3,0,-1), new THREE.Vector3(1,0,-1), new THREE.Vector3(1,0,-2)]; }
	else if(form == 'shape13') { var arrP = [new THREE.Vector3(-1,0,-2), new THREE.Vector3(-1,0,-1), new THREE.Vector3(-3,0,-1), new THREE.Vector3(-3,0,1), new THREE.Vector3(-1,0,1), new THREE.Vector3(-1,0,2), new THREE.Vector3(1,0,2), new THREE.Vector3(1,0,1), new THREE.Vector3(3,0,1), new THREE.Vector3(3,0,-1), new THREE.Vector3(1,0,-1), new THREE.Vector3(1,0,-2)]; }
	else if(form == 'shape14') { var arrP = [new THREE.Vector3(-2,0,-1), new THREE.Vector3(-2,0,0), new THREE.Vector3(-2,0,1), new THREE.Vector3(0,0,1.5), new THREE.Vector3(2,0,1), new THREE.Vector3(2,0,0), new THREE.Vector3(2,0,-1), new THREE.Vector3(0,0,-1.5)]; }	
	else if(form == 'shape15') { var arrP = [new THREE.Vector3(-2,0,-1), new THREE.Vector3(-2,0,1), new THREE.Vector3(0,0,2), new THREE.Vector3(2,0,1), new THREE.Vector3(2,0,-1), new THREE.Vector3(0,0,-2)]; }
	
	if(form == 'land') 
	{ 
		var arrP = [];
		arrP[0] = new THREE.Vector3(-15.3,0,-6.7);
		arrP[1] = new THREE.Vector3(-15.3,0,8.95);
		arrP[2] = new THREE.Vector3(-0.73,0,10.79);
		arrP[3] = new THREE.Vector3(19.51,0,9.63);
		arrP[4] = new THREE.Vector3(19.51,0,-7.35);
		arrP[5] = new THREE.Vector3(0,0,-7.95);
	}
	
	
	for ( var i = 0; i < arrP.length; i++ ) { createPoint( arrP[i], 0 ); }
	
	
	var inf = {};
	
	if(infProject.settings.project == 'plan_area' || infProject.settings.project == 'wall_kirpich')
	{
		inf = { texture : infProject.settings.wall.material };
	}
	
	if(infProject.settings.wall.color)
	{
		inf.color = infProject.settings.wall.color;
	}	
	
	if(form == 'shape1' || form == 'shape2' || form == 'shape3' || form == 'shape4' || form == 'shape5' || form == 'shape6' || form == 'shape7' || form == 'shape8' || form == 'shape9' || form == 'shape10' || form == 'shape11' || form == 'shape12' || form == 'shape13' || form == 'shape14' || form == 'shape15' || form == 'land' || form == 'plan_area')
	{
		for ( var i = 0; i < obj_point.length; i++ )
		{
			var i2 = (i == obj_point.length - 1) ? 0 : i + 1;	console.log(inf);	
			createOneWall3( obj_point[i], obj_point[i2], width_wall, JSON.parse( JSON.stringify( inf ) ) );
		}		
	}
	
	if(form == 'shape7')
	{
		createOneWall3( obj_point[2], obj_point[5], width_wall, JSON.parse( JSON.stringify( inf ) ) );
	}	
	else if(form == 'shape8')
	{
		createOneWall3( obj_point[3], obj_point[6], width_wall, JSON.parse( JSON.stringify( inf ) ) );
		createOneWall3( obj_point[2], obj_point[7], width_wall, JSON.parse( JSON.stringify( inf ) ) );
	}	
	else if(form == 'shape9')
	{
		createPoint( new THREE.Vector3(-1,0,0), 0 );
		createPoint( new THREE.Vector3(1,0,0), 0 );
		createOneWall3( obj_point[1], obj_point[10], width_wall, JSON.parse( JSON.stringify( inf ) ) );
		createOneWall3( obj_point[3], obj_point[10], width_wall, JSON.parse( JSON.stringify( inf ) ) );
		createOneWall3( obj_point[10], obj_point[9], width_wall, JSON.parse( JSON.stringify( inf ) ) );
		createOneWall3( obj_point[4], obj_point[11], width_wall, JSON.parse( JSON.stringify( inf ) ) );
		createOneWall3( obj_point[11], obj_point[8], width_wall, JSON.parse( JSON.stringify( inf ) ) );
		createOneWall3( obj_point[10], obj_point[11], width_wall, JSON.parse( JSON.stringify( inf ) ) );
		createOneWall3( obj_point[11], obj_point[6], width_wall, JSON.parse( JSON.stringify( inf ) ) );
	}
	else if(form == 'shape10')
	{
		createOneWall3( obj_point[1], obj_point[4], width_wall, JSON.parse( JSON.stringify( inf ) ) );
		createOneWall3( obj_point[4], obj_point[7], width_wall, JSON.parse( JSON.stringify( inf ) ) );
	}	
	else if(form == 'shape13')
	{
		createOneWall3( obj_point[4], obj_point[7], width_wall, JSON.parse( JSON.stringify( inf ) ) );
		createOneWall3( obj_point[4], obj_point[1], width_wall, JSON.parse( JSON.stringify( inf ) ) );
		createOneWall3( obj_point[7], obj_point[10], width_wall, JSON.parse( JSON.stringify( inf ) ) );
		createOneWall3( obj_point[1], obj_point[10], width_wall, JSON.parse( JSON.stringify( inf ) ) );
	}	
	else if(form == 'shape14')
	{
		createPoint( new THREE.Vector3(0,0,0), 0 );
		createOneWall3( obj_point[1], obj_point[8], width_wall, JSON.parse( JSON.stringify( inf ) ) );
		createOneWall3( obj_point[3], obj_point[8], width_wall, JSON.parse( JSON.stringify( inf ) ) );
		createOneWall3( obj_point[5], obj_point[8], width_wall, JSON.parse( JSON.stringify( inf ) ) );
		createOneWall3( obj_point[7], obj_point[8], width_wall, JSON.parse( JSON.stringify( inf ) ) );
	}	
	else if(form == 'shape15')
	{
		createPoint( new THREE.Vector3(0,0,0), 0 );
		createOneWall3( obj_point[0], obj_point[6], width_wall, JSON.parse( JSON.stringify( inf ) ) );
		createOneWall3( obj_point[1], obj_point[6], width_wall, JSON.parse( JSON.stringify( inf ) ) );
		createOneWall3( obj_point[2], obj_point[6], width_wall, JSON.parse( JSON.stringify( inf ) ) );
		createOneWall3( obj_point[3], obj_point[6], width_wall, JSON.parse( JSON.stringify( inf ) ) );
		createOneWall3( obj_point[4], obj_point[6], width_wall, JSON.parse( JSON.stringify( inf ) ) );
		createOneWall3( obj_point[5], obj_point[6], width_wall, JSON.parse( JSON.stringify( inf ) ) );
	}	
	
	
	if(form == 'level_2')
	{
		var arrP1 = [new THREE.Vector3(-3,0,-3), new THREE.Vector3(-3,0,0), new THREE.Vector3(0,0,3), new THREE.Vector3(3,0,3), new THREE.Vector3(3,0,-3),];
		
		var h2 = height_wall + 0.1;
		var arrP2 = [new THREE.Vector3(0,h2,0), new THREE.Vector3(0,h2,3), new THREE.Vector3(3,h2,6), new THREE.Vector3(6,h2,6), new THREE.Vector3(6,h2,0)]; 

		var arrPo1 = [];
		var arrPo2 = [];
		for ( var i = 0; i < arrP1.length; i++ ) { arrPo1[arrPo1.length] = createPoint( arrP1[i], 0 ); }
		for ( var i = 0; i < arrP2.length; i++ ) { arrPo2[arrPo2.length] = createPoint( arrP2[i], 0 ); }
		
		for ( var i = 0; i < arrPo1.length; i++ )
		{
			var i2 = (i == arrPo1.length - 1) ? 0 : i + 1;		
			createOneWall3( arrPo1[i], arrPo1[i2], width_wall, JSON.parse( JSON.stringify( inf ) ) );
		}	

		for ( var i = 0; i < arrPo2.length; i++ )
		{
			var i2 = (i == arrPo2.length - 1) ? 0 : i + 1;		
			createOneWall3( arrPo2[i], arrPo2[i2], width_wall, JSON.parse( JSON.stringify( inf ) ) );
		}			
	}
	
	if(1==2)
	{
		var roofB = new THREE.Mesh( new THREE.PlaneGeometry( 10, 10 ), new THREE.MeshLambertMaterial( {color: 0xff0000, transparent: true, opacity: 1, side: THREE.DoubleSide } ) );
		roofB.rotation.set(-Math.PI/4, 0, 0);
		roofB.position.set(0, 6, 0);
		//roofB.userData.tag = 'planeMath';	
		scene.add( roofB );
		
		var roofB = new THREE.Mesh( new THREE.PlaneGeometry( 10, 10 ), new THREE.MeshLambertMaterial( {color: 0xff0000, transparent: true, opacity: 1, side: THREE.DoubleSide } ) );
		roofB.rotation.set(Math.PI/4, 0, 0);
		roofB.position.set(0, 6, 0);	
		scene.add( roofB );			
	}
	
	
	
	for ( var i = 0; i < obj_point.length; i++ ) { upLineYY(obj_point[i]); }	
	if(obj_line.length > 0) detectRoomZone(nameRoomDef);
	if(obj_line.length > 0) upLabelPlan_1(obj_line);
	if(obj_line.length > 0) createWallZone(obj_line[0])
	
	//width_wall = 0.3;
	
	if(form == 'wall_kirpich' || form == 'wall_block') 
	{ 
		getFormWallR_1(); 	// получаем параметры стены из input 
		createFormWallR(); 
	}  
	if(form == 'wall_plaster') 
	{ 
		createWallPlaster();
	} 
	
	if(infProject.settings.camera.zoom != 1) { cameraZoomTop( infProject.settings.camera.zoom ); }
	
	centerCamera2D();
	renderCamera();
}





function createPoint( pos, id )
{
	var point = obj_point[obj_point.length] = new THREE.Mesh( p_tool.geometry, new THREE.MeshLambertMaterial( { color : 0x333333, transparent: true, opacity: 0.6, depthTest: false } ) ); 
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
	point.userData.point.actList = abo.point;
	point.userData.point.actList = abo.point;

	if(!abo.point.click2D) { point.visible = false; }
	
	point.visible = (camera == cameraTop) ? true : false;
	
	if(infProject.scene.tool.pillar)
	{
		var pillar = infProject.scene.tool.pillar.clone();
		pillar.position.copy(point.position);
		point.userData.point.pillar = pillar;
		pillar.visible = (camera == camera3D) ? true : false;
		scene.add( pillar );
	}
	
	scene.add( point );	
	
	return point;
}



var clippingMaskWall = new THREE.Plane( new THREE.Vector3( 0, 1, 0 ), 1 );	// маска для стены   
var lightMap_1 = new THREE.TextureLoader().load(infProject.path+'/img/lightMap_1.png');
//renderer.clippingPlanes = [ clippingMaskWall ];



var RD = (function ()  
{ return {
	create : function (cdm)
	{
		if(cdm.str == 'wall') { return wall(cdm); }

		function wall(cdm)
		{
			return RD;
		}		
	}
}
})();




function listCommand(name, value) 
{
	if(typeof RD[name] == 'function') { RD[name](value); }
}

console.log(RD.create({str : 'wall'}));



function createOneWall3( point1, point2, width, cdm ) 
{
	var offsetZ = (cdm.offsetZ) ? cdm.offsetZ : 0;  
	var height = (cdm.height) ? cdm.height : height_wall; 
	
	var p1 = point1.position;
	var p2 = point2.position;	
	var d = p1.distanceTo( p2 );
	
	var color = [0x7d7d7d, 0x696969]; 
	
	var material = new THREE.MeshLambertMaterial({ color : color[0], lightMap : lightMap_1 });
	
	var materials = [ material.clone(), material.clone(), material.clone(), new THREE.MeshLambertMaterial( { color: color[1], lightMap : lightMap_1 } ) ];

	if(cdm.color)
	{
		for( var i = 0; i < cdm.color.length; i++ )
		{
			console.log(cdm.color[i]);
			for( var i2 = 0; i2 < materials.length; i2++ )
			{
				if(cdm.color[i].index == i2) { materials[i2].color = new THREE.Color( cdm.color[i].o ); break; }
			}
		}
	}

	
	var geometry = createGeometryWall(d, height, width, offsetZ);	
	var wall = obj_line[obj_line.length] = new THREE.Mesh( geometry, materials ); 
 	
	
	wall.label = [];
	wall.label[0] = createLabelCameraWall({ count : 1, text : 0, size : 85, ratio : {x:256*2, y:256}, geometry : geometryLabelWall, opacity : 0.5 })[0];	
	wall.label[0].visible = false;
	
	wall.label[1] = createLabelCameraWall({ count : 1, text : 0, size : 85, ratio : {x:256*2, y:256}, geometry : geometryLabelWall, opacity : 0.5 })[0]; 
	wall.label[1].visible = false;
	
	if(infProject.settings.wall.label == 'outside' || infProject.settings.wall.label == 'inside') 
	{
		wall.label[0].visible = true;
	}
	else if(infProject.settings.wall.label == 'double') 
	{
		wall.label[0].visible = true;
		wall.label[1].visible = true;
	}
	
	
	wall.position.copy( p1 );
	
	// --------------
	if(!cdm.id) { cdm.id = countId; countId++; }
	
	wall.userData.tag = 'wall';
	wall.userData.id = cdm.id;
	
	wall.userData.wall = {};				
	wall.userData.wall.p = [];
	wall.userData.wall.p[0] = point1;
	wall.userData.wall.p[1] = point2;	
	wall.userData.wall.width = Math.round(width * 100) / 100;
	wall.userData.wall.height_0 = -0.1;
	wall.userData.wall.height_1 = Math.round(height * 100) / 100;		
	wall.userData.wall.offsetZ = Math.round(offsetZ * 100) / 100;
	wall.userData.wall.outline = null;
	wall.userData.wall.zone = null; 
	wall.userData.wall.arrO = [];
	wall.userData.wall.last = { pos : new THREE.Vector3(), rot : new THREE.Vector3() }; 
	wall.userData.wall.area = { top : 0 }; 
	
	wall.userData.wall.block = { arr : [] };
	wall.userData.wall.plaster = { o : null };
	wall.userData.wall.room = { side : 0, side2 : [null,null,null] };
	
	var v = wall.geometry.vertices;
	wall.userData.wall.v = [];
	
	for ( var i = 0; i < v.length; i++ ) { wall.userData.wall.v[i] = v[i].clone(); }
	
	wall.userData.material = [];
	wall.userData.material[0] = { color : wall.material[0].color, scale : new THREE.Vector2(1,1), };	// top
	wall.userData.material[1] = { color : wall.material[1].color, scale : new THREE.Vector2(1,1), };	// left
	wall.userData.material[2] = { color : wall.material[2].color, scale : new THREE.Vector2(1,1), };	// right
	wall.userData.material[3] = { color : wall.material[3].color, scale : new THREE.Vector2(1,1), };
	// --------------
	
	 
	wall.userData.wall.actList = abo.wall;
	
	upUvs_1( wall );
	
	if(cdm.texture)
	{ 
		var m = cdm.texture;
		
		for ( var i = 0; i < m.length; i++ )
		{
			setTexture({obj:wall, material:m[i]});
		}	
	}
	
	//console.log(wall);
	
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
	
	
	// невидемая стена
	var material = new THREE.MeshLambertMaterial( { color : 0x7d7d7d, transparent: true, opacity: 0.0 } );
	var geometry = createGeometryCube(1, height, 0.2);
	var v = geometry.vertices;
	v[0].x = v[1].x = v[6].x = v[7].x = 0;
	v[2].x = v[3].x = v[4].x = v[5].x = d;
	var wallMesh = new THREE.Mesh( geometry, material ); 
	wallMesh.userData.tag = 'wall';
	wallMesh.userData.tag_2 = 'child_wall';
	wallMesh.userData.parent = wall;
	if(camera == camera3D) { wallMesh.visible = false; }
	wall.add( wallMesh );
	
	
	
	// штукатурная стена
	if(cdm.plaster)
	{
		var index = 1;
		
		wall.updateMatrixWorld();
		
		var v = wall.userData.wall.v;		
		
		if(index == 1) { var x = v[v.length - 6].x - v[0].x; }
		else if(index == 2) { var x = v[v.length - 2].x - v[4].x; }	

		var width = cdm.plaster.width;
		
		var geometry = createGeometryCube(1, height, 1, {material:true});
		var v = geometry.vertices;
		v[0].x = v[1].x = v[6].x = v[7].x = 0;
		v[2].x = v[3].x = v[4].x = v[5].x = x;
		v[0].z = v[1].z = v[2].z = v[3].z = width;	// index 1
		v[4].z = v[5].z = v[6].z = v[7].z = 0;			
		
		
		var color = [0x7d7d7d, 0x696969]; 		
		var material = new THREE.MeshLambertMaterial({ color : 0xc4c4c4, lightMap : lightMap_1 });
		var material_1 = new THREE.MeshLambertMaterial({ color : color[0], lightMap : lightMap_1 });
		
		var materials = [ material.clone(), material_1.clone(), material_1.clone(), new THREE.MeshLambertMaterial( { color: 0xa1a1a1, lightMap : lightMap_1 } ) ];
	
		var wall_2 = new THREE.Mesh( geometry, materials );
		
		
		var num = (index == 1) ? 0 : 4;

		var pos = wall.localToWorld( wall.userData.wall.v[ num ].clone() );
		
		wall_2.position.copy(pos);
		wall_2.rotation.copy(wall.rotation);
		
		upUvs_1( wall_2 );
		
		var texture = [{index:1, img:infProject.load.img[1], repeat:{x:0.6, y:0.6}}, {index:2, img:infProject.load.img[1], repeat:{x:0.6, y:0.6}}];
		
		for ( var i = 0; i < texture.length; i++ )
		{
			setTexture({obj:wall_2, material:texture[i]});
		}

		wall_2.userData.wall_2 = {};		
		wall_2.userData.wall_2.height_1 = Math.round(height * 100) / 100;
		wall_2.userData.wall_2.width = Math.round(width * 1000) / 1000;
		
		scene.add( wall_2 );
		
		wall.userData.wall.plaster.o = wall_2;
	}
	
	
	scene.add( wall );
		
	return wall;
}


 

function rayIntersect( event, obj, t ) 
{
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );
	
	var intersects = null;
	if(t == 'one'){ intersects = raycaster.intersectObject( obj ); }
	else if(t == 'arr'){ intersects = raycaster.intersectObjects( obj, true ); }	
	
	return intersects;
}



// устанавливаем текстуру
function setTexture(cdm)
{
	//if(!cdm.img) return;
	
	var img = infProject.path+cdm.material.img;
	var material = (cdm.material.index) ? cdm.obj.material[cdm.material.index] : cdm.obj.material;
	
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
			texture.repeat.x = 1;
			texture.repeat.y = 1;			
		}
		
		texture.needsUpdate = true;
		
		material.map = texture; 
		material.lightMap = lightMap_1;
		material.needsUpdate = true; 					
		
		renderCamera();
	});			
}


function showObjTool( tag )
{			
	if(camera == cameraWall)
	{
		planeMath.position.copy( clickO.last_obj.position );
		planeMath.rotation.copy( clickO.last_obj.rotation );  		
		hideSizeWD(clickO.obj); 		
	}
	else
	{
		planeMath.position.set( 0, hp, 0 );
		planeMath.rotation.set(-Math.PI/2, 0, 0);			
	}
	
	if(camera == cameraTop) { clickO.obj = null; objDeActiveColor_2D(); } 
}




// изменение высоты стен
function changeHeightWall()
{  
	if(infProject.activeInput == 'input-height')
	{
		var h2 = $('input[data-action="input-height"]').val();
		h2 /= 100;   
	}	
	else if(infProject.activeInput == 'size-wall-height')
	{
		var h2 = $('input[data-action="size-wall-height"]').val();
	}	
	
	if(!isNumeric(h2)) return;	
	h2 = Number(h2);
	
	
	if(h2 < 0.01) { h2 = 0.01; }
	if(h2 > 3) { h2 = 3; }
		
	height_wall = h2;	
	if(infProject.settings.floor.changeY) { infProject.settings.floor.height = infProject.settings.floor.posY = h2; }		
	
	clickMovePoint_BSP( obj_line );
	
	for ( var i = 0; i < obj_line.length; i++ )
	{
		var v = obj_line[i].geometry.vertices;
		
		v[1].y = h2;
		v[3].y = h2;
		v[5].y = h2;
		v[7].y = h2;
		v[9].y = h2;
		v[11].y = h2;
		obj_line[i].geometry.verticesNeedUpdate = true;
		obj_line[i].geometry.elementsNeedUpdate = true;
		
		obj_line[i].userData.wall.height_1 = Math.round(h2 * 100) / 100;
	}
	
	upLabelPlan_1( obj_line );
	clickPointUP_BSP( obj_line );
	
	var v = p_tool.geometry.vertices;	
	var n = 0;
	for ( var i = 0; i < circle.length; i++ )
	{		
		v[ n ] = new THREE.Vector3().addScaledVector( circle[ i ].clone().normalize(), 0.1 / camera.zoom );
		v[ n ].y = 0;
		n++;

		v[ n ] = new THREE.Vector3();
		v[ n ].y = 0;
		n++;
		
		v[ n ] = v[ n - 2 ].clone();
		v[ n ].y = h2 + 0.01;
		n++;

		v[ n ] = new THREE.Vector3();
		v[ n ].y = h2 + 0.01;
		n++; 		
	}	
	p_tool.geometry.verticesNeedUpdate = true;
	p_tool.geometry.elementsNeedUpdate = true;
	
	
	
	//h2 = Math.round(h2 * 10) / 100;
	console.log(h2);
	
	if(infProject.activeInput == 'input-height')
	{
		$('input[data-action="input-height"]').val(h2*100);
	}	
	else if(infProject.activeInput == 'size-wall-height')
	{
		$('input[data-action="size-wall-height"]').val(h2);
	}	
	
	updateShapeFloor(room);
	calculationAreaFundament_2();
	
	if(infProject.scene.array.wall.length > 0) { showRuleCameraWall(); }	// обновляем размеры стены
	
	renderCamera();
}
	
	

	




// нажали на кнопку интерфейса, загружаем объект	
function clickButton( event )
{
	if(!clickO.button) return;
	
	if(camera == cameraTop)
	{
		planeMath.position.set(0, 0, 0);
		planeMath.rotation.set(-Math.PI/2, 0, 0);
	}
	if(camera == cameraWall)
	{
		var dir = camera.getWorldDirection();
		dir.addScalar(-10);
		planeMath.position.copy(camera.position);
		planeMath.position.add(dir);  
		planeMath.rotation.copy( camera.rotation ); 
		planeMath.updateMatrixWorld();		
	}
	
	var intersects = rayIntersect( event, planeMath, 'one' );
	
	
	if ( intersects.length > 0 )
	{		
		if(camera == cameraTop)
		{ 
			if(clickO.button == 'create_wall')
			{
				clickO.obj = null; 
				clickO.last_obj = null;
				
				var point = createPoint( intersects[0].point, 0 );
				point.position.y = 0;
				point.userData.point.type = clickO.button; 
				obj_selected = point;

				if(point.userData.point.type == 'create_zone') { point.userData.point.type = 'create_wall'; }				
			}
			if(clickO.button == 'create_wd_1')
			{
				createEmptyFormWD_1();
			}
		}
		if(camera == cameraWall)
		{
			if(clickO.button == 'create_wd_1')
			{
				createEmptyFormWD_1();
			}
		}
		
		clickO.buttonAct = clickO.button;
		clickO.button = null;
	}
	
}	
	

function clickInterface(cdm)
{
	if(obj_selected)
	{
		deActiveSelected();
		mouseDownRight();
	}

	
	if(cdm)
	{
		if(cdm.button == '2D')
		{
			if(infProject.settings.interface.button.cam2d == 'front') { changeCamera(cameraWall); }
			else { changeCamera(cameraTop); } 
		}
		else if(cdm.button == '3D')
		{
			changeCamera(camera3D);
		}	
		else if(cdm.button == 'point_1')
		{
			deActiveSelected();
			clickO.button = 'create_wall';
		}
		else if(cdm.button == 'wd_1')
		{
			deActiveSelected();
			clickO.button = 'create_wd_1';
		}		
	}
	
	return false;
}	



// декативируем старое выделение (объект и меню)
function deActiveSelected()
{
	if ( camera == cameraTop ) { objDeActiveColor_2D(); }
	else if ( camera == camera3D ) {  }
	else if ( camera == cameraWall ) { hideMenuObjUI_Wall(clickO.last_obj); }		
}


var dir_y = new THREE.Vector3(0, 1, 0);
var qt_plus_y = quaternionDirection( new THREE.Vector3(0, 1, 0) );



//----------- Math			
function localTransformPoint(dir1, qt)
{	
	return dir1.clone().applyQuaternion( qt.clone().inverse() );
}


function worldTransformPoint(dir1, dir_local)
{	
	var qt = quaternionDirection(dir1);			
	return dir_local.applyQuaternion( qt );
}


function quaternionDirection(dir1)
{
	var mx = new THREE.Matrix4().lookAt( dir1, new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0) );
	return new THREE.Quaternion().setFromRotationMatrix(mx);	
}
//----------- Math
 

 
 

// screenshot
function saveAsImage() 
{ 
	try 
	{		
		renderer.antialias = true;
		renderer.render( scene, camera );
		
		var strMime = "image/jpeg";
		var imgData = renderer.domElement.toDataURL(strMime, 0.7);	

		renderer.antialias = false;
		renderer.render( scene, camera );
 
		openFileImage(imgData.replace(strMime, "image/octet-stream"), "screenshot.jpg");
	} 
	catch (e) 
	{
		console.log(e);
		return;
	}
}

// открыть или сохранить screenshot
var openFileImage = function (strData, filename) 
{
	var link = document.createElement('a');
	
	if(typeof link.download === 'string') 
	{
		document.body.appendChild(link); //Firefox requires the link to be in the body
		link.download = filename;
		link.href = strData;
		link.click();
		document.body.removeChild(link); //remove the link when done
	} 
	else 
	{
		location.replace(uri);
	}
} 
  
 


function createEstimateJson()
{
	var arr = [];
	
	var inf = infProject.settings.calc.fundament;
	if(inf == 'lent' || inf == 'svai') 
	{
		var fundament = infProject.scene.array.fundament;		
		
		for ( var i = 0; i < fundament.length; i++ )
		{
			
			var points = fundament[i].points;
			var walls = fundament[i].walls;
			
			var sum = 0;
			for ( var i2 = 0; i2 < walls.length; i2++ )
			{
				sum += walls[i2].userData.wall.area.top;
			}
			
			sum = Math.round(sum * 100)/100;
			
			console.log(infProject.nameId);
			console.log('площадь :' + sum + 'm2');
			console.log('высота :' + height_wall + 'cm');
			console.log('объем : '+Math.round((sum * height_wall) * 100) / 100 +' m3');	

			var cdm = {};
			cdm.name = infProject.nameId;	// название
			cdm.area = sum;		// площадь
			cdm.height = height_wall * 100;		// высота
			cdm.space = Math.round((sum * height_wall) * 100) / 100;	// объем
			
			arr[arr.length] = cdm;
		}		
	}	
	else
	{
		
		for (var u = 0; u < room.length; u++)
		{
			var cdm = {};
			cdm.name = infProject.nameId;	// название
			cdm.area = room[u].userData.room.areaTxt;		// площадь
			cdm.height = height_wall * 100;		// высота
			cdm.space = Math.round((room[u].userData.room.areaTxt * height_wall) * 100) / 100;	// объем
			
			arr[arr.length] = cdm;			
		}
	}

	if(arr.length > 0)
	{
		var html = '';
		
		for (var i = 0; i < arr.length; i++)
		{
			html += '<div class="modal_body_content_estimate">';
			
			html += '<div class="block_form_1">';
			html += '<div class="block_form_1_h1">Площадь</div>';
			html += '<div class="block_form_1_desc" area_1="">'+arr[i].area+' м2</div>';
			html += '</div>';

			html += '<div class="block_form_1">';
			html += '<div class="block_form_1_h1">Высота</div>';
			html += '<div class="block_form_1_desc" area_1="">'+arr[i].height+' cм</div>';
			html += '</div>';	

			html += '<div class="block_form_1">';
			html += '<div class="block_form_1_h1">Объем бетона</div>';
			html += '<div class="block_form_1_desc" area_1="">'+arr[i].space+' м3</div>';
			html += '</div>';	
			
			html += '<div class="block_form_1">';
			html += '<div class="block_form_1_h1">Вес бетона</div>';
			html += '<div class="block_form_1_desc" area_1="">'+Math.round(arr[i].space * 2350/10)/100+' т</div>';
			html += '</div>';

			html += '<div class="block_form_1">';
			html += '<div class="block_form_1_h1">Опалубка</div>';
			html += '<div class="block_form_1_desc" area_1="">24 м</div>';
			html += '</div>';
			
			html += '<div class="block_form_1">';
			html += '<div class="block_form_1_h1">Периметр плиты</div>';
			html += '<div class="block_form_1_desc" area_1="">24 м</div>';
			html += '</div>';		
			
			html += '</div>';

			if(i < arr.length - 1)
			{
				html += '<div style="background: #444; height: 1px; width: 90%; margin: auto; box-shadow:0px 0px 2px #bababa;"></div>';
			}				
		}
		
		
		$('[modal_body="estimate"]').html(html);
	}
	else
	{
		var html = '<div class="modal_body_content_estimate_error">';
		html += '<br><br>нет данных<br><br>';
		html += 'постройте фундамент';
		html += '</div>';
		
		$('[modal_body="estimate"]').html(html);
	}
}

		
// определение размера Json файла
function roughSizeOfObject( object ) {

    var objectList = [];
    var stack = [ object ];
    var bytes = 0;

    while ( stack.length ) {
        var value = stack.pop();

        if ( typeof value === 'boolean' ) {
            bytes += 4;
        }
        else if ( typeof value === 'string' ) {
            bytes += value.length * 2;
        }
        else if ( typeof value === 'number' ) {
            bytes += 8;
        }
        else if
        (
            typeof value === 'object'
            && objectList.indexOf( value ) === -1
        )
        {
            objectList.push( value );

            for( var i in value ) {
                stack.push( value[ i ] );
            }
        }
    }
    return bytes;
}


// конвертация bytes в KB/MB
function formatSizeUnits(bytes){
      if      (bytes>=1073741824) {bytes=(bytes/1073741824).toFixed(2)+' GB';}
      else if (bytes>=1048576)    {bytes=(bytes/1048576).toFixed(2)+' MB';}
      else if (bytes>=1024)       {bytes=(bytes/1024).toFixed(2)+' KB';}
      else if (bytes>1)           {bytes=bytes+' bytes';}
      else if (bytes==1)          {bytes=bytes+' byte';}
      else                        {bytes='0 byte';}
      return bytes;
}

		
 
function setUnits()
{
	 
}


animate();
renderCamera();


var docReady = false;

$(document).ready(function () 
{ 
	docReady = true; 
	//loadFile('');
	if(infProject.settings.project != '') { createForm({form:infProject.settings.project}); }

	if(infProject.settings.camera.type == '3d') { changeCamera(camera3D); }
	if(infProject.settings.camera.type == 'front') { changeCamera(cameraWall); }
});


