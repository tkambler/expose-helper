'use strict';

let $ = require('jquery');

function drawtext() {
	var screen_width = $(window).width();

	// set font size based on actual resolution, normalized at 14px/22px for 720
	var fontsize = Math.floor(14*(screen_width/1280));
	var lineheight = Math.floor(22*(screen_width/1280));

	if(fontsize < 11){
		fontsize = 11;
	}

	if(lineheight < 14){
		lineheight = 14;
	}

	$('body').css('font-size',fontsize+'px');
	$('body').css('line-height',lineheight+'px');

	// polygon boundary feature
	$('.slide').each(function(){
		var polygon = $(this).data('polygon');

		if(polygon && $.isArray(polygon) && polygon.length >= 3){
			fillpolygon($(this).find('.content').eq(0),polygon);
		}
	});
}

function fillpolygon(content, polygon) {

	if(!polygon || polygon.length < 3){
		return false;
	}

	// loop back to first vertex
	polygon.push(polygon[0]);

	$('.polygon').remove();

	var fill = $('<div class="polygon" />');
	content.after(fill);
	var cwidth = content.width();
	var cheight = content.height();

	content.contents().each(function(){

		var isblock = false;
		var samefont = true;

		if(this.nodeType == 1){
			isblock = $(this).css("display") == "block";
			samefont = $(content).css("font-size") == $(this).css("font-size");
		}

		// stuff like h1 h2 etc will be difficult to wrap, put them on the first intercept and don't attempt to wrap
		var coords;
		if(this.nodeType == 1 && isblock && !samefont){
			// html, no end clip
			var clone = $(this).clone();
			fill.append(clone);

			coords = intersect(100*(clone.position().top/content.height()), polygon);

			if(coords.length === 0){
				coords = 0;
			}
			else{
				coords = coords.shift();
			}
			if(coords > 0){
				clone.prepend('<span class="filler" style="width: '+coords+'%"></span>');
			}
		}
		else if(this.nodeType == 3 || this.nodeType == 1){ // text node

                        var text;

			if(this.nodeType == 3){
				text = this.nodeValue.trim();
			}
			else{
				text = $(this).text();
			}

			if(!text){
				return true;
			}

			var words = text.match(/\S+/g);

			while(words.length > 0){
				// wrap in span so we can get dimensions
				var span;
				if(this.nodeType == 3 || isblock){
					span = $('<span class="line">&nbsp;</span>');
				}
				else{
					span = $(this).clone().text('');
				}

				fill.append(span);

				var sl = span.position().left;
				var st = span.position().top;

				var left = 100*(sl/cwidth);
				var top = 100*(st/cheight);

				if(top > 100){
					span.remove();
					return false;
				}

				var min = left;
				var max = 100;

				coords = intersect(top, polygon);

				if(!coords || coords.length < 2){
					min = 0;
					max = 100;
				}

				// depending on the x position of the span, we may not care about certain intercepts
				for(var i=0; i<coords.length; i += 2){
					if(coords[i] >= left){
						min = coords[i];
						max = coords[i+1];
						break;
					}
				}

				// shift to min
				span.before('<span class="filler" style="width: '+(min-left)+'%" />');

				// type out text until wraps
				for(i=1; i<=words.length; i++){
					var height = span.height();

					span.text(words.slice(0, i).join(' '));

					var width = 100*(span.width()/cwidth);
					if(min+width > max){
						break;
					}
				}

				if(coords.length < 3 || min+max > 100){
					fill.append('<br />');
				}

				words = words.slice(i);
			}

			if(this.nodeType != 3 && isblock){
				fill.append('<br />');
			}
		}
		else if(this.nodeType == 1){
			fill.append($(this).clone());
		}
	});

	content.hide();
}

function intersect(height, polygon) {

	if(polygon.length < 3){
		return false;
	}

	var points = [];
	for(var i=0; i<polygon.length-1; i++){
		var p1 = polygon[i];
		var p2 = polygon[i+1];

		// horizontal line
		if(p1.y == p2.y && height == p1.y){
			if(p1.x < p2.x){
				points.push(p1.x);
			}
			else{
				points.push(p2.x);
			}
		}
		if(p1.y == height && $.inArray(p1.x, points) < 0){
			points.push(p1.x);
		}
		if(p2.y == height && $.inArray(p2.x, points) < 0){
			points.push(p2.x);
		}
		if(p1.y < height && p2.y > height){
			points.push(p1.x + ((height-p1.y)/(p2.y-p1.y))*(p2.x-p1.x));
		}
		else if(p1.y > height && p2.y < height){
			points.push(p2.x + ((height-p2.y)/(p1.y-p2.y))*(p1.x-p2.x));
		}
	}


	// sort intercepts left to right
	points.sort(function(a,b) {
		return a-b;
	});

	return points;

}

module.exports = fillpolygon;
