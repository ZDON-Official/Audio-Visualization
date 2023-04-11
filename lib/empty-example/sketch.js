var pieces, radius, fft, analyzer, mapMouseX, mapMouseY, audio, toggleBtn, uploadBtn, uploadedAudio, uploadAnim;
var color_index = 0
/*
order of colors:
white ffffff, red ff0000, dark purple 330099,
dark blue 0000ff, light blue 33ffff, dark green 006633,
light green 00ff00, yellow green 99ff66, yellow ffff00,
light pink ff69b4, dark pink 990066, orange ffa500,
brown  663300
*/
var colorPalette = ['#ffffff', '#ff0000', '#330099',
'#0000ff', '#33ffff', '#006633',
'#00ff00', '#99ff66', '#ffff00',
'#ff69b4', '#990066', '#ffa500',
'#663300'];

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

	// console.log(map(0, -60, 0, 0, colorPalette.length))

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

	background("#02073c");
	// background(0)

	translate(windowWidth / 2, windowHeight / 2);
	level = analyzer.getLevel(); //Returns a single Amplitude, called continuously in draw()
	ampHistory.push(level)

	var analysis = fft.analyze()

	// Decibel values of the amplitude
	var decibel = parseInt(20*Math.log10(level))


	// var decibels = fft.analyze(scale = "dB") // this does not stay within a decent range

	// console.log(`analysis - ${analysis}`)

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

	// console.log(`decibel value - ${decibel}`)

	// map decibel values by increments of 5, where decibel ranges from -60 to 0
	color_index = 0; //? should this start at 0 or -100?

	// if(decibel > 0 || decibel < -60){
	// 	console.log(decibel)
	// }

	// color_index = parseInt(map(decibel, -60, 0, 0, colorPalette.length)) // Need to test this

	color_index = (isNaN(parseInt(map(decibel, -60, 0, 0, colorPalette.length)))) ? (color_index = 0) : (parseInt(map(decibel, -60, 0, 0, colorPalette.length)))

	// if(isNaN(color_index)){
	// 	color_index = 0
	// }

	// console.log(`color index is ${color_index}`)


	// if (decibel <= -60 || (decibel >= -60 && decibel < -55)){
	// 	color_index = 0;
	// }
	// else if (decibel >= -55 && decibel < -50){
	// 	color_index = 1;
	// }
	// else if (decibel >= -50 && decibel < -45){
	// 	color_index = 2;
	// }
	// else if (decibel >= -45 && decibel < -40){
	// 	color_index = 3;
	// }
	// else if (decibel >= -40 && decibel < -35){
	// 	color_index = 4;
	// }
	// else if (decibel >= -35 && decibel < -30){
	// 	color_index = 5;
	// }
	// else if (decibel >= -30 && decibel < -25){
	// 	color_index = 6;
	// }
	// else if (decibel >= -25 && decibel < -20){
	// 	color_index = 7;
	// }
	// else if (decibel >= -20 && decibel < -15){
	// 	color_index = 8;
	// }
	// else if (decibel >= -15 && decibel < -10){
	// 	color_index = 9;
	// }
	// else if (decibel >= -10 && decibel < -5){
	// 	color_index = 10;
	// }
	// else if (decibel >= -5 && decibel < -0){
	// 	color_index = 11;
	// }
	// else if (decibel >= 0 || (decibel <= 0 && decibel > -10)){
	// 	color_index = 12;
	// }

	// console.log(`color index is ${color_index}`)

	//! ==========================================================
	//! ==========================================================




	// console.log(height)
	// ! ------------------ drawing amplitude
	// console.log(level)

	beginShape()
	for (let i = 0; i < 360; i++) {
		// stroke(bass, mid, treble)
		stroke(colorPalette[color_index]);
		// stroke(255)
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
