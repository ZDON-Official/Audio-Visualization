var pieces, radius, fft, analyzer, audio, toggleBtn, uploadBtn, uploadedAudio;
var color_index, height_change = 0
var mid_rot = -1
var font,
fontsize = 320

var colorPalette = [
	'#ffffff', '#ff0040',
	'#21AFFF', '#ff0000', '#F1002C',
	'#00B5F2', '#F2EB30', '#ffff00',
	'#0CE87D', '#d454f7', '#e8620e',
	'#FF21AB'
];

var uploadLoading = false;
let ampHistory = []

/*=============================================
  PRE-LOAD
=============================================*/
function preload() {
	audio = loadSound("Audio/Zaalima.wav");
	font = loadFont('Assets/Snell Roundhand Script.ttf')

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


/*=============================================
  SET UP
=============================================*/
function setup() {

	textFont(font);
  	textSize(fontsize);

	createCanvas(windowWidth, windowHeight);

	frameRate(30)

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
	translate(windowWidth / 2, windowHeight / 2);

	// Middle circle spectrogram
	let spectrogram = fft.analyze()

	level = analyzer.getLevel(); //Returns a single Amplitude, called continuously in draw()

	fft.analyze()

	// Decibel values of the amplitude
	var decibel = parseInt(20*Math.log10(level))

	var bass = fft.getEnergy(100, 150);
	// var bass = fft.getEnergy('bass');
	var treble = fft.getEnergy(150, 250);
	var mid = fft.getEnergy("mid");


	var mapMid = map(mid, 0, 255, -100, 100);
	var scaleMid = map(mid, 0, 255, 0.005, 0.02);
	var speedMid = map(mid, 0, 255, 0.005, 0.1);

	var mapTreble = map(treble, 0, 255, 200, 350);
	var scaleTreble = map(treble, 0, 255, 1, 5);
	var moveTreble = map(treble, 0, 255, 0, 80);

	var mapbass = map(bass, 0, 255, 50, 200);
	var scalebass = map(bass, 0, 255, 0.005, 1.1);
	var shapebass = map(bass, 0, 255, 0, 5);

	pieces = 2*spectrogram.length;
	radius = 100;

	noFill()

	// map decibel values
	//! if color_index < 0  or is NaN (Not a Number), then color_index = 0, else map to decibel val
	color_index =
	(isNaN(parseInt(decibel)) || (decibel < -60))
	? (color_index = 0) : (parseInt(map(decibel, -60, 0, 0, colorPalette.length-1)))

	var rev_color_index = map(color_index, 0, colorPalette.length-1, colorPalette.length-1, 0)


	//! BACKGROUND
	background(50)
	setGradient(colorPalette[color_index])

	//! NAME INITIALS
	// Zohaib
	fill(colorPalette[color_index])
	text('Z', windowWidth/2*-1, windowHeight/5)
	// Rinki
	fill(colorPalette[rev_color_index])
	text('R', windowWidth/3.6,windowHeight/5)


	//! DRAW the SPECTROGRAM
	for(i=0; i<spectrogram.length; i += 1){
		rotate(TWO_PI / (pieces / 2))

		push()
		height_change = (isNaN(spectrogram[i])) ? (height_change = 1) : (map(spectrogram[i], 0, 255, 5, 80))
		rotate(frameCount * -0.005); // TODO - change the speed based on decibel or something
		strokeWeight(1)
		stroke(colorPalette[color_index])

		var height = radius * height_change * scaleMid

		fill(colorPalette[color_index])
		rect(0, radius/2, 1,  height)
		pop()
	}


	// Inspired by the demo - https://github.com/codrops/AudioVisualizers/blob/master/js/main1.js
	pieces = 20
	s = 130
	for (i = 0; i < 20; i += 0.1) {

		rotate(TWO_PI/ (pieces/2));

		noFill();


		/*----------  BASS  ----------*/
		push();
		stroke(colorPalette[rev_color_index]);
		rotate(frameCount * 0.02);
		scale(scalebass/2 + 0.4)
		strokeWeight(0.5);
		polygon(mapbass + i/2, mapbass - i/2,  i*scalebass, 3+shapebass);
		pop();


		// /*----------  MID  ----------*/
		push();
		stroke(colorPalette[rev_color_index])
		strokeWeight(0.3);
		rotate(frameCount * speedMid)
		polygon(mapMid + i / 2, mapMid - i * 2,  i, 6);
		pop();


		/*----------  TREMBLE  ----------*/
		push();
		stroke(colorPalette[color_index])
		strokeWeight(1);
		scale(0.8);
		rotate((frameCount * -0.005));
		heart(mapTreble - (s) + moveTreble, mapTreble - (s) + moveTreble, (i / 2) * scaleTreble)
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

// code from P5.js examples
// =============================================================================
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

  function setGradient(c2){
	var C1 = color('white')
	var C2 = color(c2)
	C2.setAlpha(30)

	noFill()
	for (var y = 0; y < 2*height; y++) {
		var inter = map(y, 0, height, 0, 1);
		var c = lerpColor(C1, C2, inter);
		stroke(c);
		line(0-(width/2), y-height, width, y-height);
	  }
}
// =============================================================================
