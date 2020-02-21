class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // num_curve_sections:  int
    constructor(canvas, num_curve_sections, show_points_flag) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.slide_idx = 0;
        this.num_curve_sections = num_curve_sections;
        this.show_points = show_points_flag;
        this.allVertices = [];
    }

    // n:  int
    setNumCurveSections(n) {
        this.num_curve_sections = n;
        this.drawSlide(this.slide_idx);
    }

    // flag:  bool
    showPoints(flag) {
        this.show_points = flag;
        this.drawSlide(this.slide_idx);
    }
    
    // slide_idx:  int
    drawSlide(slide_idx) {
        this.slide_idx = slide_idx;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let framebuffer = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0(framebuffer);
                break;
            case 1:
                this.drawSlide1(framebuffer);
                break;
            case 2:
                this.drawSlide2(framebuffer);
                break;
            case 3:
                this.drawSlide3(framebuffer);
                break;
        }

        this.ctx.putImageData(framebuffer, 0, 0);
    }

    // framebuffer:  canvas ctx image data
    drawSlide0(framebuffer) {
        this.drawRectangle({x: 300, y: 300}, {x: 500, y: 400}, [255, 0, 0, 255], framebuffer);
    }

    // framebuffer:  canvas ctx image data
    drawSlide1(framebuffer) {
    	this.drawCirle({x: 400, y: 400}, 100, [255, 0, 0, 255], framebuffer);
    }

    // framebuffer:  canvas ctx image data
    drawSlide2(framebuffer) {
    	this.drawBezierCurve({x: 300, y: 300}, {x: 460, y: 60}, {x: 300, y: 120}, {x: 200, y: 100}, [255, 0, 0, 255], framebuffer);
    }

    // framebuffer:  canvas ctx image data
    drawSlide3(framebuffer) {
    	//L
    	this.drawLine({x: 50, y:300}, {x: 50, y: 500}, [255, 0, 0, 255], framebuffer);
    	this.drawLine({x: 50, y:300}, {x: 150, y: 300}, [255, 0, 0, 255], framebuffer);
    	//U
    	this.drawBezierCurve({x: 175, y: 500}, {x: 200, y: 225 }, {x: 240, y: 225}, {x: 275, y: 500}, [255, 0, 0, 255], framebuffer);
    	//C
    	this.drawBezierCurve({x: 400, y: 500}, {x: 250, y: 325}, {x: 250, y: 325}, {x:400, y: 300}, [255, 0, 0, 255], framebuffer);
    	//Y
    	this.drawLine({x:415, y: 500}, {x: 500, y: 425}, [255, 0, 0, 255], framebuffer);
    	this.drawLine({x:585, y: 500}, {x: 500, y: 425}, [255, 0, 0, 255], framebuffer);
    	this.drawLine({x:500, y: 425}, {x: 500, y: 300}, [255, 0, 0, 255], framebuffer);
    	//P
    	this.drawLine({x:650, y: 500}, {x: 650, y: 300}, [255, 0, 0, 255], framebuffer);
    	this.drawCirle({x: 700, y: 470}, 50, [255, 0, 0, 255], framebuffer);

    	if (this.show_points) {
    		this.drawVertex({x: 50, y:300}, false, framebuffer);
    		this.drawVertex({x: 50, y: 500}, false, framebuffer);
    		this.drawVertex({x: 150, y: 300}, false, framebuffer);
    		this.drawVertex({x:415, y: 500}, false, framebuffer);
    		this.drawVertex({x: 500, y: 425}, false, framebuffer);
    		this.drawVertex({x:585, y: 500}, false, framebuffer);
    		this.drawVertex({x: 500, y: 300}, false, framebuffer);
    		this.drawVertex({x:650, y: 500}, false, framebuffer);
    		this.drawVertex({x: 650, y: 300}, false, framebuffer);
    	}
    }

    // left_bottom:  object ({x: __, y: __})
    // right_top:    object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawRectangle(left_bottom, right_top, color, framebuffer) {
    	var right_bottom = {x: right_top.x, y: left_bottom.y};
    	var left_top = {x: left_bottom.x, y: right_top.y};
        this.drawLine(left_bottom, right_bottom, color, framebuffer);
        this.drawLine(right_bottom, right_top, color, framebuffer);
        this.drawLine(right_top, left_top, color, framebuffer);
        this.drawLine(left_top, left_bottom, color, framebuffer);
        if (this.show_points) {
        	this.drawVertex({x: left_bottom.x, y: left_bottom.y}, false, framebuffer);
        	this.drawVertex({x: right_bottom.x, y: right_bottom.y}, false, framebuffer);
        	this.drawVertex({x: right_top.x, y: right_top.y}, false, framebuffer);
        	this.drawVertex({x: left_top.x, y: left_top.y}, false, framebuffer);
        }
    }

    drawRectangleVertex(left_bottom, right_top, color, framebuffer) {
    	var right_bottom = {x: right_top.x, y: left_bottom.y};
    	var left_top = {x: left_bottom.x, y: right_top.y};
        this.drawLine(left_bottom, right_bottom, color, framebuffer);
        this.drawLine(right_bottom, right_top, color, framebuffer);
        this.drawLine(right_top, left_top, color, framebuffer);
        this.drawLine(left_top, left_bottom, color, framebuffer);
    }

    // center:       object ({x: __, y: __})
    // radius:       int
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawCirle(center, radius, color, framebuffer) {
        var theta = (360 / this.num_curve_sections) * Math.PI / 180;
        var x_coord = center.x + radius;
        var y_coord = center.y;
        var nextX;
        var nextY;
        var currentAngle = theta;
       	if (this.show_points) {
       		this.drawVertex(center, true, framebuffer);
       	}
        for(var i = 1; i <= this.num_curve_sections; i++) {
        	nextX = Math.round(center.x + radius * Math.cos(currentAngle));
        	nextY = Math.round(center.y + radius * Math.sin(currentAngle));
        	this.drawLine({x: x_coord, y: y_coord}, {x: nextX, y: nextY}, color, framebuffer);
        	if (this.show_points) {
       		this.drawVertex({x: x_coord, y: y_coord}, false, framebuffer);
       		}
        	x_coord = nextX;
        	y_coord = nextY;
        	currentAngle = currentAngle + theta;
        }

    }

    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // pt2:          object ({x: __, y: __})
    // pt3:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawBezierCurve(pt0, pt1, pt2, pt3, color, framebuffer) {
        var segmentLength = 1 / this.num_curve_sections;
        var t = 0;
        var startX = pt0.x;
        var startY = pt0.y;
        var nextX;
        var nextY;
        if (this.show_points) {
       		this.drawVertex(pt1, true, framebuffer);
       		this.drawVertex(pt2, true, framebuffer);
       		this.drawVertex({x: startX, y: startY}, false, framebuffer);
       	}
        for (var i = 0; i <= this.num_curve_sections; i++) {
        	nextX = Math.round(Math.pow((1-t), 3) * pt0.x + 3 * Math.pow((1-t), 2) * t * pt1.x + 3 * (1-t) * t * t * pt2.x + Math.pow(t, 3) * pt3.x);
 			nextY = Math.round(Math.pow((1-t), 3) * pt0.y + 3 * Math.pow((1-t), 2) * t * pt1.y + 3 * (1-t) * t * t * pt2.y + Math.pow(t, 3) * pt3.y);
 			this.drawLine({x: startX, y: startY}, {x: nextX, y: nextY}, color, framebuffer);
 			if (this.show_points) {
       		this.drawVertex({x: nextX, y: nextY}, false, framebuffer);
       		}
        	startX = nextX;
        	startY = nextY;
        	t = t + segmentLength;
        }
    }

    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawLine(pt0, pt1, color, framebuffer)
    {
        //if change in x is bigger than change in y, drawline low
		if (Math.abs(pt1.y - pt0.y) <= Math.abs(pt1.x - pt0.x)) {
			if (pt0.x < pt1.x) {
				this.drawLineLow(pt0.x, pt0.y, pt1.x, pt1.y, color, framebuffer);
			} else {
				this.drawLineLow(pt1.x, pt1.y, pt0.x, pt0.y, color, framebuffer);
			}
		} else {//if change in y is bigger than change in x, drawline high
			if (pt0.y < pt1.y) {
				this.drawLineHigh(pt0.x, pt0.y, pt1.x, pt1.y, color, framebuffer);
			} else {
				this.drawLineHigh(pt1.x, pt1.y, pt0.x, pt0.y, color, framebuffer);
			}
		}
    }

    drawLineLow(x0, y0, x1, y1, color, framebuffer) {
		//only chance the the slope is negative is if A is negative
		var A = y1 - y0;
		var B = x0 - x1;
		var iy = 1; //var for decramenting y
		if (A < 0) {
			//slope is negative
			iy = -1;
			A *= -1;
		}
		var x = x0;
		var y = y0;
		//initial difference
		var d = 2 * A + B;
		var px;
		
		while (x <= x1) {
			px = this.pixelIndex(x, y, framebuffer);
			this.setFramebufferColor(framebuffer, px, color);
			x = x + 1;
			if (d <= 0) {
				d = d + 2*A;
				
				
			} else {
				d = d + 2*A + 2*B;
				y = y + iy;
			}
			
		}
		
	}

	drawLineHigh(x0, y0, x1, y1, color, framebuffer) {
		//only change is swapping x and y
		var A = x1 - x0;
		var B = y0 - y1;
		var ix = 1; 
		if (A < 0) {
			ix = -1;
			A *= -1;
		}
		var x = x0;
		var y = y0;
		var d = 2 * A + B;
		var px;
		
		while (y <= y1) {
			px = this.pixelIndex(x, y, framebuffer);
			this.setFramebufferColor(framebuffer, px, color);
			y = y + 1;
			if (d <= 0) {
				d = d + 2*A;
				
				
			} else {
				d = d + 2*A + 2*B;
				x = x+ ix;
			}
			
		}
	}

	setFramebufferColor(framebuffer, px, color) {
		framebuffer.data[px + 0] = color[0];
		framebuffer.data[px + 1] = color[1];
		framebuffer.data[px + 2] = color[2];
		framebuffer.data[px + 3] = color[3];
	}

	pixelIndex(x, y, framebuffer) {
		return 4 * y * framebuffer.width + 4 * x;
	}
	
	drawVertex(point, controlPoint, framebuffer) {
		var color = controlPoint ? [50, 168, 58, 255] : [66, 135, 245, 255];
		this.drawRectangleVertex({x: point.x - 5, y: point.y -5}, {x: point.x + 5, y: point.y + 5}, color, framebuffer);
	}
};
