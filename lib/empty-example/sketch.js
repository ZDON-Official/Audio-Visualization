var pieces, radius, fft, analyzer, mapMouseX, mapMouseY, audio, toggleBtn, uploadBtn, uploadedAudio, uploadAnim;

/* 
order of colors: 
white ffffff, red ff0000, dark purple 330099, 
dark blue 0000ff, light blue 33ffff, dark green 006633,
light green 00ff00, yellow green 99ff66, yellow ffff00
*/
var colorPalette = ["ffffff", "#ff0000", "330099", "0000ff", "33ffff", "006633", "00ff00", "99ff66", "ffff00"];

var uploadLoading = false;
let ampHistory = []

/*=============================================
  SETUP
=============================================*/

function preload() {
	audio = loadSound("/audio1.wav");
}

// function uploaded(file) {
// 	uploadLoading = true;
// 	uploadedAudio = loadSound(file.data, uploadedAudioPlay);
// }


// function uploadedAudioPlay(audioFile) {

// 	uploadLoading = false;

// 	if (audio.isPlaying()) {
// 		audio.pause();
// 	}

// 	audio = audioFile;
// 	audio.loop();
// }

function setup() {

	// uploadAnim = select('#uploading-animation');

	createCanvas(windowWidth, windowHeight-50);

	angleMode(DEGREES)

	toggleBtn = createButton("Play / Pause");

	// uploadBtn = createFileInput(uploaded);

	// uploadBtn.addClass("upload-btn");

	toggleBtn.addClass("toggle-btn");

	toggleBtn.mousePressed(toggleAudio);

	// Amplitude measures volume between 0.0 and 1.0
	analyzer = new p5.Amplitude();
	fft = new p5.FFT();

	audio.loop();

}



/*=============================================
  DRAW
=============================================*/
function draw() {

	// Add a loading animation for the uploaded track
	// -----------------------------------------------
	// if (uploadLoading) {
	// 	uploadAnim.addClass('is-visible');
	// } else {
	// 	uploadAnim.removeClass('is-visible');
	// }

	background(colorPalette[0]);
	// background(0)

	translate(windowWidth / 2, windowHeight / 2);

	level = analyzer.getLevel(); //Returns a single Amplitude, called continously in draw()
	ampHistory.push(level)

	var analysis = fft.analyze()

	// Decibel values of the amplitude
	var decibel = 20*Math.log10(level)


	// var decibels = fft.analyze(scale = "dB") // this does not stay within a decent range

	console.log(`analysis - ${analysis}`)

	var bass = fft.getEnergy(100, 150);
	var treble = fft.getEnergy(150, 250);
	var mid = fft.getEnergy("mid");

	// console.log(`bass is ${bass}, mid - ${mid}, treble - ${treble}`)

	// var mapMid = map(mid, 0, 255, -100, 200);
	// var scaleMid = map(mid, 0, 255, 1, 1.5);

	// var mapTreble = map(treble, 0, 255, 200, 350);
	// var scaleTreble = map(treble, 0, 255, 0, 1);

	// var mapbass = map(bass, 0, 255, 50, 200);
	// var scalebass = map(bass, 0, 255, 0.05, 1.2);

	pieces = 300;
	radius = 250;

  	// stroke( 235, 0, 255 ) // the color of the eclipse
  	// ellipse( 0, 0, radius )
	noFill()

	//! ==========================================================
	//! CODE FOR DECIBEL AND COLOR STUFF - RINKI

	console.log(`decibel value - ${decibel}`)

	// map decibel values by increments of 20, where decibel ranges from -140 to 40
	var color_index = -100; 

	if (decibel <= -140 || ( decibel >= -140 && decibel < -120)){
		color_index = 0;
	}
	else if (decibel >= -120 && decibel < -100){
		color_index = 1;
	}
	else if (decibel >= -100 && decibel < -80){
		color_index = 2;
	}
	else if (decibel >= -80 && decibel < -60){
		color_index = 3;
	}
	else if (decibel >= -60 && decibel < -40){
		color_index = 4;
	}
	else if (decibel >= -40 && decibel < -20){
		color_index = 5;
	}
	else if (decibel >= -20 && decibel < 0){
		color_index = 6;
	}
	else if (decibel >= 0 && decibel < 20){
		color_index = 7;
	}
	else if (decibel >= 40 || (decibel < 40 && decibel >= 20)){
		color_index = 8;
	}

	//! ==========================================================


	// console.log(height)
	// ! ------------------ drawing amplitude
	// console.log(level)
	beginShape()
	for (let i = 0; i < 360; i++) {
		// stroke(bass, mid, treble)
		stroke(255)
		// fill(bass, mid, treble)
		let r = map(ampHistory[i], 0, 1, 15, 300); // ! CHANGE Val of 400
		let x = r*cos(i)
		let y = r*sin(i)
		// console.log(x, y)
		vertex(x, y);
	}
	endShape()

	if(ampHistory.length > width) {
		ampHistory.splice(0,1);
	}


	// for (i = 0; i < pieces; i += 0.1) {

	// 	rotate(TWO_PI / (pieces / 2));

	// 	noFill();

	// 	/*----------  BASS  ----------*/
	// 	push();
	// 	stroke(colorPalette[1]);
    // 	stroke(bass, treble, mid)
	// 	rotate(frameCount * 0.002);
	// 	strokeWeight(4);
	// 	// polygon(mapbass + i, mapbass - i,  i, 3);
	// 	// x1, y1, x2, y2
	// 	line(0, radius/2, 0, 0.012*radius*mapbass)
	// 	pop();


	// 	/*----------  MID  ----------*/
	// 	push();
	// 	stroke(colorPalette[2]);
	// 	strokeWeight(0.2);
	// 	// polygon(mapMid + i / 2, mapMid - i * 2,  i, 7);
    // 	// line(mapMid, radius/2, 0, radius)
	// 	pop();


	// 	/*----------  TREMBLE  ----------*/
	// 	push();
	// 	stroke(colorPalette[3]);
	// 	strokeWeight(0.3);
	// 	scale(0.8);
	// 	rotate((frameCount * -0.005));
	// 	// polygon(mapTreble + i / 2, mapTreble - i / 2, i / 2, 3);
    // 	// line(mapTreble, radius/2, 0, )
	// 	pop();

	// }


}


function toggleAudio() {
	if (audio.isPlaying()) {
		audio.pause();
	} else {
		audio.play();
	}
}


function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function polygon(x, y, radius, npoints) {
	var angle = TWO_PI / npoints;
	beginShape();
	for (var a = 0; a < TWO_PI; a += angle) {
		var sx = x + cos(a) * radius;
		var sy = y + sin(a) * radius;
		vertex(sx, sy);
	}
	endShape(CLOSE);
}
