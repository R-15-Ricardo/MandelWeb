const appWitdh = 700;
const appHeight = 420;

// grid density scales from [0,1]
function densityScaled_mandelbrot(scape_radius, tolerance, grid_density)
{
	const realw = floor(appWitdh*grid_density);
	const realh = floor(appHeight*grid_density);

	const smallPixels = new Uint8Array(realh*realw*4);

	// mapping parameters
	const xmin = -2.6;
	const ymin = -1.16;
	const lenght = 4;

	const dz = (lenght) / realw;

	let c_a = xmin;
	for (let x = 0; x < realw; x++)
	{
		let c_b = ymin;
		for (let y = 0; y < realh; y++)
		{
			let z_a = c_a;
			let z_b = c_b;

			let n = 0;

			let white = false;

			while(n < tolerance)
			{
				const aa = z_a * z_a;
				const bb = z_b * z_b;
				const twoab = 2.0 * z_a * z_b;
				z_a = aa - bb + c_a;
				z_b = twoab + c_b;

				if (dist(aa, bb, 0, 0) > scape_radius*scape_radius*scape_radius)
				{
					white = true;
					break;
				}
				n++;
			}

			const pix = (x+y*realw)*4;

			if (!white)
			{
				smallPixels[pix + 0] = 0;
				smallPixels[pix + 1] = 0;
				smallPixels[pix + 2] = 0;
				smallPixels[pix + 3] = 255;
			}
			else 
			{
				let shade = n/tolerance*100;
				let colorQueue = 'hsb(217, 78%, ' + shade + '%)';

				let pixCol = color(colorQueue);

				smallPixels[pix + 0] = pixCol.levels[0];
				smallPixels[pix + 1] = pixCol.levels[1];
				smallPixels[pix + 2] = pixCol.levels[2];
				smallPixels[pix + 3] = 255;
			}
			c_b += dz;
		}
		c_a += dz;
	}
	return smallPixels;
}

function nearesNeightborScale (scaleFactor, image) 
{
	loadPixels();
	const realw = floor(appWitdh*scaleFactor);

	for (let x = 0; x < appWitdh; x++)
	{
		
		for (let y = 0; y < appHeight; y++)
		{
			const pix1 = (x+y*appWitdh)*4;
			const pix2 = (floor(x*scaleFactor)+floor(y*scaleFactor)*realw)*4;

			pixels[pix1 + 0] = image[pix2 + 0];
			pixels[pix1 + 1] = image[pix2 + 1];
			pixels[pix1 + 2] = image[pix2 + 2];
			pixels[pix1 + 3] = image[pix2 + 3];
		}
	}
	updatePixels();
}

let density;
let scape;
let iterations;

let last_gSlider;
let last_sSlider;
let last_tSlider;

let grid_slider;
let scape_slider;
let tolerance_slider;

function setup() 
{
	var myCanvas = createCanvas(appWitdh, appHeight);
	myCanvas.parent("p5canvas");
	noLoop();

	let t1 = createP('Densidad de cuadricula');
	t1.parent("appControlers");
	grid_slider = createSlider(0.05, 1, 0.5, 0.01);
	grid_slider.parent("appControlers");
	grid_slider.style('width', '120px');
	grid_slider.style('margin', '0px 0px 20px 0px');
	grid_slider.style('padding', '0px 20px 0px 20px');

	let t2 = createP('Radio de escape');
	t2.parent("appControlers");
	scape_slider = createSlider(0.1, 5, 2, 0.1);
	scape_slider.parent("appControlers");
	scape_slider.style('width', '120px');
	scape_slider.style('margin', '0px 0px 20px 0px');
	scape_slider.style('padding', '0px 20px 0px 20px');

	let t3 = createP('Tolerancia');
	t3.parent("appControlers");
	tolerance_slider = createSlider(5, 150, 50, 1);
	tolerance_slider.parent("appControlers");
	tolerance_slider.style('width', '120px');
	tolerance_slider.style('margin', '0px 0px 20px 0px');
	tolerance_slider.style('padding', '0px 20px 0px 20px');

	last_gSlider = grid_slider.value();
	last_sSlider = scape_slider.value();
	last_tSlider = tolerance_slider.value();

	density = grid_slider.value();
	scape = scape_slider.value();
	iterations = tolerance_slider.value();
}

function draw() 
{
	background(234,235,237);
	// background(color('chartreuse'));
	let small = densityScaled_mandelbrot(scape,iterations,density);
	nearesNeightborScale(density, small);

	const yorig = 1.16*appWitdh/4;
	const xorig = 2.6*appWitdh/4;

	stroke(255);
	line(0,yorig,appWitdh,yorig);
	line(xorig,0,xorig,appHeight);

	textSize(15);
	noStroke();
	fill(255);
	text('0+0i', xorig+5, yorig-5);
	circle(xorig, yorig, 5);

}

function mouseReleased() {
	if ((last_gSlider != grid_slider.value()) || 
		(last_sSlider != scape_slider.value()) || 
		(last_tSlider != tolerance_slider.value()))
	{
		density = grid_slider.value();
		scape = scape_slider.value();
		iterations = tolerance_slider.value();
		redraw();
		last_gSlider = grid_slider.value();
		last_sSlider = scape_slider.value();
		last_tSlider = tolerance_slider.value();
	}
}
