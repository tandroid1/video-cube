// Create Video element
video = document.createElement('video');
video.width = 320;
video.height = 240;
video.autoplay = true;


/**************************
 * Get Webcam stream (getUserMedia)
 **************************/

function successCallback(stream) {
    if (video.mozSrcObject !== undefined) {
        video.mozSrcObject = stream;
    } else {
        video.src = webkitURL.createObjectURL(stream);
    }

}

function errorCallback(error) {
    console.error('An error occurred: [CODE ' + error.code + ']');
}

// getUserMedia cross browser stuff
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

if (navigator.getUserMedia) {
    navigator.getUserMedia({
        video: true
    }, successCallback, errorCallback);
} else {
    console.log("Failed to get a stream due to", error);
}


/**************************
 * threejs
 **************************/

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.z = 500;
scene.add(camera);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor( 0xffffff, 1);
document.body.appendChild(renderer.domElement);


var videoTexture = new THREE.Texture(video);
var material = new THREE.MeshLambertMaterial({
    map: videoTexture
});

var cube = new THREE.Mesh(new THREE.CubeGeometry(320, 240, 240), material);
scene.add(cube);


// add subtle ambient lighting
var ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

// white spotlight shining from the side, casting shadow

var spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( 100, 1000, 100 );

spotLight.castShadow = true;

spotLight.shadowMapWidth = 1024;
spotLight.shadowMapHeight = 1024;

spotLight.shadowCameraNear = 500;
spotLight.shadowCameraFar = 4000;
spotLight.shadowCameraFov = 30;

scene.add( spotLight );

// Add OrbitControls so that we can pan around with the mouse.
controls = new THREE.OrbitControls(camera, renderer.domElement);

function render() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        videoTexture.needsUpdate = true;
    }
    // var angle = getElapsedTime() * 10; // 10° per second
    
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update();  
    console.log("Frame");    
}
render();