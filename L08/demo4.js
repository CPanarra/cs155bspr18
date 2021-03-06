
/*
 This is our final version of the initial animation demo.
 We use javascript functions to simplify the code a bit

*/


	console.log("In demo4!");

	// First we declare the variables that hold the objects we need
	// in the animation code
	var scene, camera, renderer;  // all threejs programs need these
	var textMesh, cubeMesh, coneMesh, planeMesh; // we have 4 mesh objects
	var light1,light2;  // we have two lights

	init(); // initialize these 9 variables
	animate();  // start the animation loop!

	/**
	  To initialize the scene, we initialize each of its components
	*/
	function init(){
			initScene();
			initRenderer();
			initTextMesh();
			initCubeMesh();
			initConeMesh();
			initPlaneMesh();
			initLight1();
			initLight2();
			initCamera();
	}

	/* We don't do much here, but we could do more!
	*/
	function initScene(){
		scene = new THREE.Scene();
	}

	/*
		The renderer needs a size and the actual canvas we draw on
		needs to be added to the body of the webpage. We also specify
		that the renderer will be computing soft shadows
	*/
	function initRenderer(){
		renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	}

	/*
		We use a perspective camera raised 4 units and set back 20, looking at (0,0,0)
	*/
	function initCamera(){
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		camera.position.z = 20;
		camera.position.y=4;
		camera.lookAt(0,0,0);
	}


	/*
		To create a text mesh we first need load a font, then pass that font
		to the createTextMesh...  This is an example of a CallBack which is very
		common in Javascript programming. The idea is that after the font, f, is loaded
		(which might take a few milliseconds for a big font), we then call the function
		createTextMseh(f).  Note that the next java
	*/
	function initTextMesh(){
		var loader = new THREE.FontLoader();
		loader.load( '/fonts/helvetiker_regular.typeface.json',
								 createTextMesh);
		console.log("preparing to load the font");

	}

	/*
	  once the font has been loaded, this uses it to create a textGeometry
		object, and then uses that to make the textMesh which it can add to
		the scene.
	*/
	function createTextMesh(font) {
		var textGeometry =
			new THREE.TextGeometry( 'Hello World !',
					{
						font: font,
						size: 1,
						height: 0.2,
						curveSegments: 12,
						bevelEnabled: true,
						bevelThickness: 0.01,
						bevelSize: 0.08,
						bevelSegments: 5
					}
				);

		var textMaterial =
			new THREE.MeshLambertMaterial( { color: 0xaaaaff } );

		textMesh =
			new THREE.Mesh( textGeometry, textMaterial );

		// center the text mesh
		textMesh.translateX(-4);

		scene.add(textMesh);

		console.log("added textMesh to scene");
	}



	function initCubeMesh(){
		var cubeGeometry = new THREE.BoxGeometry( 0.5, 1.5, 3 );
		var cubeMaterial = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
		cubeMesh = new THREE.Mesh( cubeGeometry, cubeMaterial );
		cubeMesh.position.x = -2;
		cubeMesh.position.y = 3;
		cubeMesh.castShadow = true;
		scene.add( cubeMesh );
	}


	function initConeMesh(){
		var coneGeometry = new THREE.ConeGeometry( 1,2, 32 );
		var coneMaterial = new THREE.MeshLambertMaterial( { color: 0xff0000} );
		coneMesh = new THREE.Mesh( coneGeometry, coneMaterial );

		coneMesh.translateX(0);
		coneMesh.translateY(-1);
		coneMesh.translateZ(0);

		coneMesh.castShadow = true;
		scene.add( coneMesh );
	}


	function initPlaneMesh(){
		// creating a textured plane which receives shadows
		var planeGeometry = new THREE.PlaneGeometry( 20, 20, 128 );
		var texture = new THREE.TextureLoader().load( '../images/dogs.jpg' );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 4, 4 );
		var planeMaterial = new THREE.MeshLambertMaterial( { color: 0xaaaaaa,  map: texture ,side:THREE.DoubleSide} );
		planeMesh = new THREE.Mesh( planeGeometry, planeMaterial );
		planeMesh.position.y = -2;
		scene.add(planeMesh);
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical
		planeMesh.rotation.x = -Math.PI/2;
		planeMesh.receiveShadow = true;
	}


	function initLight1(){
		light1 = new THREE.SpotLight( 0xaaaaff );
		light1.position.set( 0, 10, 0 );
		light1.castShadow = true;
		//Set up shadow properties for the light
		light1.shadow.mapSize.width = 2048;  // default
		light1.shadow.mapSize.height = 2048; // default
		light1.shadow.camera.near = 0.5;       // default
		light1.shadow.camera.far = 500      // default
		// add it to the scenes
		scene.add( light1 );
	}


	function initLight2(){
		var light2 = new THREE.SpotLight( 0xffaaaa );
		light2.position.set( -100, 100, 100 );
		light2.castShadow = true;
		//Set up shadow properties for the light
		light2.shadow.mapSize.width = 2048;  // default
		light2.shadow.mapSize.height = 2048; // default
		light2.shadow.camera.near = 0.5;       // default
		light2.shadow.camera.far = 500      // default
		// add it to the scene
		scene.add( light2 );
	}




	function animate() {
		requestAnimationFrame( animate );
		var currentTime = (new Date()).getTime();

		// we make the cube rotate around two axes
		cubeMesh.rotation.x += 0.01;
		cubeMesh.rotation.z += 0.1;

		// when the textMesh is added to the scene
		// we rotate it around its middle
		if (textMesh){
			textMesh.translateX(4);
			textMesh.rotateY(-0.01);
			textMesh.translateX(-4);
		}



		//camera.rotation.z = p*0.1;
		var angle = currentTime*0.001;
		//revolveCamera(angle);
		setCameraAngle1();


		// reset the camera to look straight down


		renderer.render( scene, camera );
	}



	/* here we make the camera move in a circle of radius 20
		around the scene looking always at the coneMesh object
		We also have it oscillate higher and lower
	*/
	function revolveCamera(angle){
		camera.position.x = 20*Math.sin(angle);
		camera.position.z = 20*Math.cos(angle);
		camera.position.y = 10*(1+Math.cos(angle));
		camera.lookAt(coneMesh.position);
	}


	function setCameraAngle1(){
		camera.position.x=0;
		camera.position.y=1;
		camera.position.z=10;
		camera.lookAt(0,0,0);
	}

	function setCameraAngle2(){
		camera.position.x=0;
		camera.position.y=10;
		camera.position.z=0;
		camera.lookAt(0,0,0);
	}

	function setCameraAngle3(){
		camera.position.x=0;
		camera.position.y=4;
		camera.position.z=30;
		camera.lookAt(0,4,0);
	}
