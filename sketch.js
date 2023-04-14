var pieces, radius, fft, analyzer, mapMouseX, mapMouseY, audio, toggleBtn, uploadBtn, uploadedAudio, uploadAnim;
var color_index = 0
var spect_speed = 0.02
var r = 0
var mid_rot = -1
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
	audio = loadSound("/GUZARISH.wav");
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

	frameRate(30)
	// colorMode(HSB)
	// angleMode(DEGREES)

	toggleBtn = createButton("Play / Pause");

	// uploadBtn = createFileInput(uploaded);

	// uploadBtn.addClass("upload-btn");

	toggleBtn.addClass("toggle-btn");

	toggleBtn.mousePressed(toggleAudio);

	// Amplitude measures volume between 0.0 and 1.0
	analyzer = new p5.Amplitude();
	fft = new p5.FFT();
	amp_fft = new p5.FFT(0.9, 128)
	space_between_lines = width / 128

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

	// background("#02073c");
	// background('rgba(0,255,0, 0.25)')
	background(20)

	translate(windowWidth / 2, windowHeight / 2);

	// Middle circle spectrogram
	let spectrogram = amp_fft.analyze()


	level = analyzer.getLevel(); //Returns a single Amplitude, called continuously in draw()
	ampHistory.push(level)

	fft.analyze()

	// Decibel values of the amplitude
	var decibel = parseInt(20*Math.log10(level))

	// speed = map(level, 0, 1, -0.005, -0.008)

	// var decibels = fft.analyze(scale = "dB") // this does not stay within a decent range

	// console.log(`analysis - ${analysis}`)

	var bass = fft.getEnergy(100, 150);
	var treble = fft.getEnergy(150, 250);
	var mid = fft.getEnergy("mid");

	// console.log(`bass is ${bass}, mid - ${mid}, treble - ${treble}`)

	var mapMid = map(mid, 0, 255, -100, 100);
	var scaleMid = map(mid, 0, 255, 0.005, 0.03);

	var mapTreble = map(treble, 0, 255, 200, 350);
	var scaleTreble = map(treble, 0, 255, 0.005, 0.02);
	// var treble_speed = map(treble, 0, 255, 0.-0.005, -0.002);

	var mapbass = map(bass, 0, 255, 50, 200);
	var scalebass = map(bass, 0, 255, 0.05, 1.2);
	var shapebass = map(bass, 0, 255, 2, 5);

	pieces = 2*spectrogram.length;
	radius = 100;

  	// stroke( 235, 0, 255 ) // the color of the eclipse
  	// ellipse( 0, 0, radius )
	noFill()


	// map decibel values
	// if color_index < 0  or is NaN (Not a Number), then color_index = 0, else map to decibel val
	color_index =
	(isNaN(parseInt(decibel)) || (decibel < -60))
	? (color_index = 0) : (parseInt(map(decibel, -60, 0, 0, colorPalette.length-1)))

	// spect_speed = (isNaN(parseInt(decibel)) || (decibel < -60)) ? (spect_speed = 0.002) : (map(decibel, -60, 0, 0.002, 0.01))
	// console.log(`speed is ${spect_speed} and decibel is ${decibel}`)

	for(i=0; i<spectrogram.length; i += 1){
		rotate(TWO_PI / (pieces / 2))

		push()
		r = (isNaN(spectrogram[i])) ? (r = 1) : (map(spectrogram[i], 0, 256, 10, 70))
		rotate(frameCount * -0.03); // TODO - change the speed based on decibel or something
		strokeWeight(1)
		stroke(colorPalette[color_index])

		var rad_change = radius * r * scaleMid

		fill(i, colorPalette[color_index], colorPalette[color_index+1])
		rect(0, radius/2, 2,  rad_change)
		pop()
	}


	pieces = 20
	for (i = 0; i < 20; i += 0.1) {

		rotate(TWO_PI/ (pieces/2));

		noFill();
		var rev_color_index = map(color_index, 0, colorPalette.length-1, colorPalette.length-1, 0)


		/*----------  BASS  ----------*/
		push();
		stroke(colorPalette[rev_color_index]);
    	// stroke(255)
		rotate(frameCount * 0.02 * mid_rot);
		scale(scalebass/2 + 0.4)
		strokeWeight(0.5);
		polygon(mapbass + i/2, mapbass - i/2,  i*scalebass, 3+shapebass);
		// x1, y1, x2, y2
		pop();


		// /*----------  MID  ----------*/
		// console.log(rev_color_index)
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
		polygon(mapTreble + (i/2), (mapTreble/1.3) - (i/2), i / 2, 5);
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
