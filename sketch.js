/*
 * Terra
 * Shivam Sh | https://github.com/shivam-sh
 *
 * A terrain generator/3D world
 * made using WEBGL and p5.js
 */

// Camera Options
let cHeight = 250;
let cSpeed = 0.25;

// Terrain Options
let scale = 500;
let smoothness = 20;
let tSpan = 40;
let tDepth = 40;
let tHeight = 25;

// Global Variables
let pos;
let camera;

function setup() {
	// Create the canvas to enable output to the webpage
	createCanvas(windowWidth, windowHeight, WEBGL);

	// Create a position vector and a camera to keep track of the person's location and view
	pos = createVector(0, 0, 0);
	camera = createCamera();
}

function draw() {
	// Draw a dark background
	background(100);
	// Place tha camera at the current location with an appropriate height
	camera.setPosition(
		pos.x * scale,
		heightAt(pos.x, pos.z) - cHeight,
		pos.z * scale
	);

	// Draw the terrain
	// Start from the back and draw each row moving forwards
	for (let z = floor(pos.z) + tSpan / 2; z > floor(pos.z) - tSpan / 2; z--) {
		// Make a triangle strip across the whole row
		beginShape(TRIANGLE_STRIP);
		for (
			let x = floor(pos.x) - tDepth / 2;
			x < floor(pos.x) + tDepth / 2;
			x++
		) {
			/*
			 * Draw each vertex in this order to make a triangle strip
			 *
			 * 	3-------4 7-------8
			 *  | \		| |	\	  |
			 *  |   \	| |	  \	  |	
			 *  |	  \ | |		\ |
			 *  1-------2 5-------6	...
			 */
			vertex(x * scale, heightAt(x, z), z * scale);
			vertex((x + 1) * scale, heightAt(x + 1, z), z * scale);
			vertex(x * scale, heightAt(x, z - 1), (z - 1) * scale);
			vertex((x + 1) * scale, heightAt(x + 1, z - 1), (z - 1) * scale);
		}
		endShape();
	}

	// Check to see if any keys were pressed
	keyCheck();
}

// Check for what the height at any (x, z) value should be (across the horizontal plane)
function heightAt(x, z) {
	// Map the (x,z) coordinates to the much more dense perlin noise space
	return (
		tHeight *
		scale *
		noise((x + 10000) / smoothness, (z + 10000) / smoothness)
	);
}

// Check if any of the movement/ camera keys are pressed
function keyCheck() {
	// Check if the W A S D keys are pressed, and move the person accordingly
	if (keyIsDown(87)) pos.z -= cSpeed;
	if (keyIsDown(65)) pos.x -= cSpeed;
	if (keyIsDown(83)) pos.z += cSpeed;
	if (keyIsDown(68)) pos.x += cSpeed;

	// Check if the ↑ ↓ ← → keys are pressed, and move the camera accordingly
	if (keyIsDown(38)) camera.tilt(-PI / 60);
	if (keyIsDown(37)) camera.pan(PI / 60);
	if (keyIsDown(40)) camera.tilt(PI / 60);
	if (keyIsDown(39)) camera.pan(-PI / 60);
	
}
