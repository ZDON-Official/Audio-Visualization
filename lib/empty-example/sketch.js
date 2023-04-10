var pieces, radius, fft, analyzer, mapMouseX, mapMouseY, audio, toggleBtn, uploadBtn, uploadedAudio, uploadAnim;
var colorPalette = ["#02073c", "#5b0ff5", "#f50fac", "#f50fac"];
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

	level = analyzer.getLevel();
	ampHistory.push(level)

	var analysis = fft.analyze()

	// Decibel values of the STFT result
	var decibels = 20*Math.log10(level)
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

	//console.log(dec) // <-- value stored by 20*Mathlog10(fft.analysis())
	console.log(`decibel value - ${decibels}`)



	//?
	var deci = 0
	// TODO - change theses
	min = 0
	max = 100

	//var color_index = map(decibels, min, max, 0, colorPalette.length())

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
