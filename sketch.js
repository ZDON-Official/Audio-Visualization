var pieces, radius, fft, analyzer, mapMouseX, mapMouseY, audio, toggleBtn, uploadBtn, uploadedAudio, uploadAnim;
var color_index = 0
var spect_speed = 0.02
var height_change = 0
var mid_rot = -1
var speed = 0.002

/*
order of colors:
white ffffff, red ff0000, dark purple 330099,
dark blue 0000ff, light blue 33ffff, dark green 006633,
light green 00ff00, yellow green 99ff66, yellow ffff00,
light pink ff69b4, dark pink 990066, orange ffa500,
brown  663300
*/
var colorPalette = [
	'#ffffff', '#ff0040', '#eb1ac8',
	'#21AFFF', '#ff0000', '#F1002C',
	'#00B5F2', '#F2EB30', '#ffff00',
	'#0CE87D', '#d454f7', '#e8620e',
	'#FF21AB'
];

var uploadLoading = false;
let ampHistory = []

/*=============================================
  SETUP
=============================================*/

function preload() {
	audio = loadSound("Audio/Bruno Mars.wav");
}

function uploaded(file) {
	uploadLoading = true;
	uploadedAudio = loadSound(file.data, uploadedAudioPlay);
}


function uploadedAudioPlay(audioFile) {

	uploadLoading = false;

	if (audio.isPlaying()) {
		audio.pause();
	}

	audio = audioFile;
	audio.play();
}

function setup() {

	uploadAnim = select('#uploading-animation');

	createCanvas(windowWidth, windowHeight-50);

	frameRate(30)
	// angleMode(DEGREES)

	toggleBtn = createButton("Play / Pause");

	uploadBtn = createFileInput(uploaded);

	uploadBtn.addClass("upload-btn");

	toggleBtn.addClass("toggle-btn");

	toggleBtn.mousePressed(toggleAudio);

	// Amplitude measures volume between 0.0 and 1.0
	analyzer = new p5.Amplitude();
	fft = new p5.FFT(0.9, 1024)

	audio.play();
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



	translate(windowWidth / 2, windowHeight / 2);

	// Middle circle spectrogram
	let spectrogram = fft.analyze()
	// console.log(`length is ${spectrogram.length}`)

	level = analyzer.getLevel(); //Returns a single Amplitude, called continuously in draw()
	ampHistory.push(level)

	fft.analyze()

	// Decibel values of the amplitude
	var decibel = parseInt(20*Math.log10(level))

	// var decibels = fft.analyze(scale = "dB") // this does not stay within a decent range

	// console.log(`analysis - ${analysis}`)

	var bass = fft.getEnergy(100, 150);
	// var bass = fft.getEnergy('bass');
	var treble = fft.getEnergy(150, 250);
	var mid = fft.getEnergy("mid");


	var mapMid = map(mid, 0, 255, -100, 100);
	var scaleMid = map(mid, 0, 255, 0.005, 0.03);

	var mapTreble = map(treble, 0, 255, 200, 350);
	var scaleTreble = map(treble, 0, 255, 1, 3);
	var moveTreble = map(treble, 0, 255, 0, 50);

	var mapbass = map(bass, 0, 255, 50, 200);
	var scalebass = map(bass, 0, 255, 0.05, 1.2);
	var shapebass = map(bass, 0, 255, 0, 5);

	pieces = 2*spectrogram.length;
	radius = 100;

	noFill()

	// map decibel values
	// if color_index < 0  or is NaN (Not a Number), then color_index = 0, else map to decibel val
	color_index =
	(isNaN(parseInt(decibel)) || (decibel < -60))
	? (color_index = 0) : (parseInt(map(decibel, -60, 0, 0, colorPalette.length-1)))

	var rev_color_index = map(color_index, 0, colorPalette.length-1, colorPalette.length-1, 0)



	// background("#02073c");
	// background('rgba(0,255,0, 0.25)')
	background(20)
	// background(mapbass, mapMid/3, mapTreble/3)
	// background(colorPalette[rev_color_index], 20)



	// Draw the spectrogram
	for(i=0; i<spectrogram.length; i += 1){
		rotate(TWO_PI / (pieces / 2))

		push()
		height_change = (isNaN(spectrogram[i])) ? (height_change = 1) : (map(spectrogram[i], 0, 255, 10, 80))
		rotate(frameCount * -0.005); // TODO - change the speed based on decibel or something
		strokeWeight(1)
		stroke(colorPalette[color_index])

		var height = radius * height_change * scaleMid

		fill(colorPalette[color_index])
		rect(0, radius/2, 1,  height)
		pop()
	}


	pieces = 20
	s = 200
	for (i = 0; i < 20; i += 0.1) {

		rotate(TWO_PI/ (pieces/2));

		noFill();


		/*----------  BASS  ----------*/
		push();
		stroke(colorPalette[rev_color_index]);
		rotate(frameCount * 0.01 * mid_rot);
		scale(scalebass/2 + 0.4)
		strokeWeight(0.5);
		polygon(mapbass + i/2, mapbass - i/2,  i*scalebass, 3+shapebass);
		pop();


		// /*----------  MID  ----------*/
		push();
		stroke(colorPalette[rev_color_index])
		strokeWeight(0.3);
		rotate(frameCount * 0.05)
		polygon(mapMid + i / 2, mapMid - i * 2,  i, 7);
		pop();


		/*----------  TREMBLE  ----------*/
		push();
		stroke(colorPalette[color_index])
		strokeWeight(1);
		scale(0.8);
		rotate((frameCount * -0.005));
		// polygon(mapTreble + (i/2), (mapTreble/1.3) - (i/2), i / 2, 5);
		heart(mapTreble - (s/2) + moveTreble, mapTreble - (s/2) + moveTreble, (i / 2) * scaleTreble)
		pop();
	}


}


function toggleAudio() {
	if (audio.isPlaying()) {
		audio.pause();
		mid_rot = -1
	} else {
		audio.play();
		mid_rot = 1
	}
}


function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

// code from P5.js
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

function heart(x, y, size) {
	beginShape();
	vertex(x, y);
	bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
	bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
	endShape(CLOSE);
  }
