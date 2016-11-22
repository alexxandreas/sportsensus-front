(function(){
	"use strict";

	var root = this,
		Chart = root.Chart,
		helpers = Chart.helpers;


	var defaultConfig = {
		//Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
		scaleBeginAtZero : true,

		//Boolean - Whether grid lines are shown across the chart
		scaleShowGridLines : true,

		//String - Colour of the grid lines
		scaleGridLineColor : "rgba(0,0,0,.05)",

		//Number - Width of the grid lines
		scaleGridLineWidth : 1,

		//Boolean - Whether to show horizontal lines (except X axis)
		scaleShowHorizontalLines: true,

		//Boolean - Whether to show vertical lines (except Y axis)
		scaleShowVerticalLines: true,
		
		// Засечки на оси Y
		showHorisontalSerifs: true,
		
		// Засечки на оси Х
		showVerticalSerifs: true,

		// не сдвигать бары в соседних датасетах
		barsInOneLine: false,

		//Boolean - If there is a stroke on each bar
		barShowStroke : true,

		//Number - Pixel width of the bar stroke
		barStrokeWidth : 2,

		//Number - Spacing between each of the X value sets
		barValueSpacing : 5,

		//Number - Spacing between data sets within X values
		barDatasetSpacing : 1,

		// ширина столбца
		barWidth: 30,

		// максимальная высота столбца
		barHeight: 100,

		//String - A legend template
		legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

		
	};

  Chart.HorizontalRectangle = Chart.Element.extend({
		draw : function(){

			if (!this.value) return;

			var ctx = this.ctx,
				halfHeight = this.height/2,
				top = this.y - halfHeight,
				bottom = this.y + halfHeight,
				right = this.left - (this.left - this.x),
				halfStroke = this.strokeWidth / 2;

			// Canvas doesn't allow us to stroke inside the width so we can
			// adjust the sizes to fit if we're setting a stroke on the line
			if (this.showStroke){
				top += halfStroke;
				bottom -= halfStroke;
				right += halfStroke;
			}

			ctx.beginPath();

			ctx.fillStyle = this.fillColor;
			//ctx.strokeStyle = this.strokeColor;
			ctx.lineWidth = this.strokeWidth;

			// It'd be nice to keep this class totally generic to any rectangle
			// and simply specify which border to miss out.
			ctx.moveTo(this.left, top);
  			ctx.lineTo(right, top);
  			ctx.lineTo(right, bottom);
			ctx.lineTo(this.left, bottom);
			ctx.fill();
			if (this.showStroke){
				ctx.stroke();
			}

			if (this.showLabels !== false) {
				ctx.fillStyle = "#000000";
				ctx.textAlign = (this.value < 0) ? "right" : "left";
				var dx = (this.value < 0) ? -5 : 5;
				ctx.textBaseline = "middle";// : "top";
				if (this.showLabels instanceof Function)
					ctx.fillText(this.showLabels(this.value), right + dx, this.y);
				else
					ctx.fillText(this.value, right + dx, this.y);
			}
			// if (this.label) {
			// 	ctx.fillStyle = "#000000";
			// 	ctx.textAlign = (this.value < 0) ? "right" : "left";
			// 	var dx = (this.value < 0) ? -5 : 5;
			// 	ctx.textBaseline = "middle";// : "top";
			// 	ctx.fillText(this.label, right + dx, this.y);
			// }
		},
		inRange : function(chartX,chartY){
  			return (
			((chartX >= this.left && chartX <= this.x) || (chartX <= this.left && chartX >= this.x)) 
			&& chartY >= (this.y - this.height/2) && chartY <= (this.y + this.height/2));
		}
	});

	Chart.Type.extend({
		name: "HorizontalBar",
		defaults : defaultConfig,
		initialize:  function(data){

			//Expose options as a scope variable here so we can access it in the ScaleClass
			var options = this.options;

			this.ScaleClass = Chart.Scale.extend({
				offsetGridLines : true,
				calculateBarX : function(datasetCount, datasetIndex, barIndex){
					//Reusable method for calculating the xPosition of a given bar based on datasetIndex & width of the bar
					var xWidth = this.calculateBaseWidth(),
						xAbsolute = this.calculateX(barIndex) - (xWidth/2),
						barWidth = this.calculateBarWidth(datasetCount);

					return xAbsolute + (barWidth * datasetIndex) + (datasetIndex * options.barDatasetSpacing) + barWidth/2;
				},
				calculateBaseWidth : function(){
					return (this.calculateX(1) - this.calculateX(0)) - (2*options.barValueSpacing);
				},
				// calculateBaseWidth : function(){
				// 	if (options.barWidth)
				// 		return options.barWidth;
				// 	else
				// 		return (this.calculateX(1) - this.calculateX(0)) - (2*options.barValueSpacing);
				// },
				calculateBarWidth : function(datasetCount){
					if (options.barsInOneLine) datasetCount = 1;
					//The padding between datasets is to the right of each bar, providing that there are more than 1 dataset
					var baseWidth = this.calculateBaseWidth() - ((datasetCount - 1) * options.barDatasetSpacing);

					return (baseWidth / datasetCount);
				},

				calculateBaseHeight : function(){
					if (options.barWidth)
					 		return options.barWidth;
					else
					return ((this.endPoint - this.startPoint) / this.yLabels.length) - (2*options.barValueSpacing);
				},
				calculateBarHeight : function(datasetCount){
					if (options.barWidth)
						return options.barWidth;
					if (options.barsInOneLine) datasetCount = 1;
					//The padding between datasets is to the right of each bar, providing that there are more than 1 dataset
					var baseHeight = this.calculateBaseHeight() - ((datasetCount) * options.barDatasetSpacing);

					return (baseHeight / datasetCount);
				},

				calculateXInvertXY : function(value) {
					var scalingFactor = (this.width - Math.round(this.xScalePaddingLeft) - this.xScalePaddingRight) / (this.max - this.min);
					return Math.round(this.xScalePaddingLeft) + (scalingFactor * (value - this.min));
				},

				calculateYInvertXY : function(index){
					return index * ((this.startPoint - this.endPoint) / (this.yLabels.length));
				},

				calculateBarY : function(datasetCount, datasetIndex, barIndex){
					if (options.barsInOneLine) datasetCount = 1;
					//Reusable method for calculating the yPosition of a given bar based on datasetIndex & height of the bar
					var yHeight = this.calculateBaseHeight(),
						// yAbsolute = (this.endPoint + this.calculateYInvertXY(barIndex) - (yHeight / 2)) - 5,
						yAbsolute = (this.endPoint + this.calculateYInvertXY(barIndex) - (yHeight / 2)) - options.barValueSpacing/2,
						barHeight = this.calculateBarHeight(datasetCount);
					// if (datasetCount > 1) yAbsolute = yAbsolute + (barHeight * (datasetIndex - 1)) - (datasetIndex * options.barDatasetSpacing) + barHeight/2;
					var dy = datasetIndex * barHeight + datasetIndex * options.barDatasetSpacing;
					if (datasetCount > 1 && datasetIndex > 0){
						yAbsolute -= dy
					}
					return yAbsolute;
				},

        buildCalculatedLabels : function() {
    			this.calculatedLabels = [];

    			var stepDecimalPlaces = helpers.getDecimalPlaces(this.stepValue);

    			for (var i=0; i<=this.steps; i++){
    				this.calculatedLabels.push(helpers.template(this.templateString,{value:(this.min + (i * this.stepValue)).toFixed(stepDecimalPlaces)}));
    			}
    		},

    		buildYLabels : function(){
				this.buildYLabelCounter = (typeof this.buildYLabelCounter === 'undefined') ? 0 : this.buildYLabelCounter + 1;
				this.buildCalculatedLabels();
				if(this.buildYLabelCounter === 0) this.yLabels = this.xLabels;
			  	this.xLabels = this.calculatedLabels;
				this.yLabelWidth = (this.display && this.showLabels) ? helpers.longestText(this.ctx,this.font,this.yLabels) + 10 : 0;
    		},

        calculateX : function(index){
    			var isRotated = (this.xLabelRotation > 0),
    				innerWidth = this.width - (this.xScalePaddingLeft + this.xScalePaddingRight),
    				valueWidth = innerWidth/(this.steps - ((this.offsetGridLines) ? 0 : 1)),
    				valueOffset = (valueWidth * index) + this.xScalePaddingLeft;

    			if (this.offsetGridLines){
    				valueOffset += (valueWidth/2);
    			}

    			return Math.round(valueOffset);
    		},

        draw : function(){
    			var ctx = this.ctx,
    				yLabelGap = (this.endPoint - this.startPoint) / this.yLabels.length,
    				xStart = Math.round(this.xScalePaddingLeft),
					xStop = this.width - Math.round(this.xScalePaddingRight),
					//xStart += 100;
					zeroPos = this.calculateXInvertXY(0);
				// TODO xStart - не левая граница х, а позиция нуля! Влияет на надписи по Y и черточки
    			if (this.display){

    				ctx.fillStyle = this.textColor;
    				ctx.font = this.font;
    				helpers.each(this.yLabels,function(labelString,index){
    					var yLabelCenter = this.endPoint - (yLabelGap * index),
							linePositionY = Math.round(yLabelCenter),
							drawHorizontalLine = this.showHorizontalLines;

    					yLabelCenter -= yLabelGap / 2;

    					ctx.textAlign = "right";
    					ctx.textBaseline = "middle";
    					// if (this.showLabels){
    						ctx.fillText(labelString,zeroPos - 10,yLabelCenter);
    					// }

						// if (this.showLabels !== false)
						// 	if (this.showLabels instanceof Function)
						// 		ctx.fillText(this.showLabels(labelString), zeroPos - 10,yLabelCenter);
						// 	else
						// 		ctx.fillText(labelString,zeroPos - 10,yLabelCenter);

                        if (index === 0 && !drawHorizontalLine) {
                            drawHorizontalLine = true;
                        }
                        if (drawHorizontalLine){
                            ctx.beginPath();
                        }
    					if (index > 0){
    						// This is a grid line in the centre, so drop that
    						ctx.lineWidth = this.gridLineWidth;
    						ctx.strokeStyle = this.gridLineColor;
    					} else {
    						// This is the first line on the scale
    						ctx.lineWidth = this.lineWidth;
    						ctx.strokeStyle = this.lineColor;
    					}

    					linePositionY += helpers.aliasPixel(ctx.lineWidth);

                        if(drawHorizontalLine){
                            ctx.moveTo(xStart, linePositionY);
                            ctx.lineTo(xStop, linePositionY);
                            ctx.stroke();
                            ctx.closePath();
                        }

						if (options.showHorisontalSerifs) {
							ctx.lineWidth = this.lineWidth;
							ctx.strokeStyle = this.lineColor;
							ctx.beginPath();
							ctx.moveTo(zeroPos - 2, linePositionY);
							ctx.lineTo(zeroPos + 2 + this.lineWidth, linePositionY);
							ctx.stroke();
							ctx.closePath();
						}

    				},this);

    				helpers.each(this.xLabels,function(label,index){
    					var width = this.calculateX(1) - this.calculateX(0);
    					var xPos = this.calculateX(index) + helpers.aliasPixel(this.lineWidth) - (width / 2),
    						// Check to see if line/bar here and decide where to place the line
    						linePos = this.calculateX(index - (this.offsetGridLines ? 0.5 : 0)) + helpers.aliasPixel(this.lineWidth),
    						isRotated = (this.xLabelRotation > 0);

    					ctx.beginPath();

    					//if (index > 0){ // TODO нулевой тоже рисуем так
						if (label != '0'){
    						// This is a grid line in the centre, so drop that
    						ctx.lineWidth = this.gridLineWidth;
    						ctx.strokeStyle = this.gridLineColor;
    					} else {
    						// This is the first line on the scale
    						ctx.lineWidth = this.lineWidth;
    						ctx.strokeStyle = this.lineColor;
    					}
    					ctx.moveTo(linePos,this.endPoint);
    					ctx.lineTo(linePos,this.startPoint - 3);
    					ctx.stroke();
    					ctx.closePath();


    					ctx.lineWidth = this.lineWidth;
    					ctx.strokeStyle = this.lineColor;


    					// Small lines at the bottom of the base grid line
    					ctx.beginPath();
    					ctx.moveTo(linePos,this.endPoint);
    					ctx.lineTo(linePos,this.endPoint + 5);
    					ctx.stroke();
    					ctx.closePath();

    					ctx.save();
    					ctx.translate(xPos,(isRotated) ? this.endPoint + 12 : this.endPoint + 8);
    					ctx.rotate(helpers.radians(this.xLabelRotation)*-1);
    					ctx.font = this.font;
    					ctx.textAlign = (isRotated) ? "right" : "center";
    					ctx.textBaseline = (isRotated) ? "middle" : "top";
    					ctx.fillText(label, 0, 0);
    					ctx.restore();
    				},this);

    			}
    		}

			});

			this.datasets = [];

			//Set up tooltip events on the chart
			if (this.options.showTooltips){
				helpers.bindEvents(this, this.options.tooltipEvents, function(evt){
					var activeBars = (evt.type !== 'mouseout') ? this.getBarsAtEvent(evt) : [];

					this.eachBars(function(bar){
						bar.restore(['fillColor', 'strokeColor']);
					});
					helpers.each(activeBars, function(activeBar){
						activeBar.fillColor = activeBar.highlightFill;
						activeBar.strokeColor = activeBar.highlightStroke;
					});
					this.showTooltip(activeBars);
				});
			}

			//Declare the extension of the default point, to cater for the options passed in to the constructor
			this.BarClass = Chart.HorizontalRectangle.extend({
				strokeWidth : this.options.barStrokeWidth,
				showStroke : this.options.barShowStroke,
				showLabels : this.options.showLabels,
				ctx : this.chart.ctx
			});

			//Iterate through each of the datasets, and build this into a property of the chart
			helpers.each(data.datasets,function(dataset,datasetIndex){

				var datasetObject = {
					label : dataset.label || null,
					fillColor : dataset.fillColor,
					strokeColor : dataset.strokeColor,
					bars : []
				};

				this.datasets.push(datasetObject);

				helpers.each(dataset.data,function(dataPoint,index){
					//Add a new point for each piece of data, passing any required data to draw.
					datasetObject.bars.push(new this.BarClass({
						value : dataPoint,
						//label : data.labels[index],
						label: dataset.label && dataset.label[index],
						datasetLabel: dataset.label,
						//strokeColor : dataset.strokeColor,
						//strokeColor : dataset.strokeColor[index],
						//fillColor : dataset.fillColor,
						fillColor : dataset.fillColor[index],
						//highlightFill : dataset.highlightFill || dataset.fillColor,
						highlightFill : dataset.fillColor[index]
						//highlightStroke : dataset.highlightStroke || dataset.strokeColor
					}));
				},this);

			},this);

			this.buildScale(data.labels);

			
			var paddingsX = this.scale.xScalePaddingLeft + this.scale.xScalePaddingRight;
			var paddingsY = this.chart.height - (this.scale.endPoint - this.scale.startPoint);

			//var datas = data.labels.length * this.options.barWidth + data.labels.length * this.options.barValueSpacing;
			if (this.options.barsInOneLine)
				var oneData = this.options.barWidth;
			else
				var oneData = this.options.barWidth * this.datasets.length + this.options.barDatasetSpacing * (this.datasets.length-1);
			oneData += this.options.barValueSpacing;
			var datas = oneData * data.labels.length;

			//var datas = data.labels.length * (this.options.barWidth * this.datasets.length + this.options.barDatasetSpacing * (this.datasets.length-1)) + data.labels.length * this.options.barValueSpacing;

			// var width = paddings + datas;
			var height = paddingsY + datas;

			var width = this.options.barHeight + paddingsX;


			// var height = this.options.barHeight - (this.scale.endPoint - this.scale.startPoint) + this.chart.height;
			//var height = (this.scale.endPoint - this.scale.startPoint) + this.chart.height;

			this.chart.width = width;
			this.chart.canvas.width = width;

			this.chart.height = height;
			this.chart.canvas.height = height;

			helpers.retinaScale(this.chart);
			this.buildScale(data.labels);

      		this.BarClass.prototype.left = Math.round(this.scale.xScalePaddingLeft);

			function getPrevValues(_index, _datasetIndex){
				var value = 0;
				this.eachBars(function(bar, index, datasetIndex){
					if (datasetIndex < _datasetIndex && index == _index)
						value += bar.value;
				});
				return value;
			}


			this.eachBars(function(bar, index, datasetIndex){
				helpers.extend(bar, {
          			//x: Math.round(this.scale.xScalePaddingLeft),
					left: this.scale.calculateXInvertXY(0),
					x: this.scale.calculateXInvertXY(0),
					//x: this.scale.calculateXInvertXY(this.options.stacked ? getPrevValues.call(this, index, datasetIndex) : 0),
					y : this.scale.calculateBarY(this.datasets.length, datasetIndex, index),
					height : this.scale.calculateBarHeight(this.datasets.length)


				});
				bar.save();
			}, this);

			this.render();
		},
		showTooltip: function(activeBars){
			if(this.options.customTooltips){
				this.options.customTooltips(false);
			}
			if (!activeBars || !activeBars.length) return;
			// get dataset
			/*var dataArray, dataIndex;
			for (var i = this.datasets.length - 1; i >= 0; i--) {
				dataArray = this.datasets[i].points || this.datasets[i].bars || this.datasets[i].segments;
				dataIndex = dataArray.indexOf(activeBars[0]);
				if (dataIndex !== -1){
					break;
				}
			}*/
			var tooltipLabels = [];

			var pos = {x: 0, y:0};
			//var x=0;
			//var y=0;
			activeBars.forEach(function (bar){
				var right = bar.left - (bar.left - bar.x);
				pos.x = Math.max(pos.x, right);
				pos.y = bar.y;
				
				// var obj = {bar:bar};
				// var dataArray, dataIndex;
				// for (var i = this.datasets.length - 1; i >= 0; i--) {
				// 	dataArray = this.datasets[i].points || this.datasets[i].bars || this.datasets[i].segments;
				// 	dataIndex = dataArray.indexOf(activeBars[0]);
				// 	if (dataIndex !== -1){
				// 		//break;
				// 		obj.dataset = this.datasets[i];
				// 		obj.yLabel = this.scale.yLabels[i];
				// 	}
				// }
				tooltipLabels.push(helpers.template(this.options.multiTooltipTemplate, bar));
				//tooltipLabels.push(bar.label + ': ' + bar.value);
			}, this);
			//tooltipLabels.push(helpers.template(this.options.multiTooltipTemplate, element));

			//var tooltipPosition = Element.tooltipPosition();
			new Chart.Tooltip({
				x: pos.x,
				y: pos.y,
				labels: tooltipLabels,
				xPadding: this.options.tooltipXPadding,
				yPadding: this.options.tooltipYPadding,
				fillColor: this.options.tooltipFillColor,
				textColor: this.options.tooltipFontColor,
				fontFamily: this.options.tooltipFontFamily,
				fontStyle: this.options.tooltipFontStyle,
				fontSize: this.options.tooltipFontSize,
				caretHeight: this.options.tooltipCaretSize,
				cornerRadius: this.options.tooltipCornerRadius,
				text: '',//template(this.options.tooltipTemplate, Element),
				chart: this.chart,
				custom: this.options.customTooltips
			}).draw();

			/*new Chart.MultiTooltip({
				//x: medianPosition.x,
				//y: medianPosition.y,
				//x: Math.round(tooltipPosition.x),
				//y: Math.round(tooltipPosition.y),
				x: pos.x,
				y: pos.y,
				xPadding: this.options.tooltipXPadding,
				yPadding: this.options.tooltipYPadding,
				xOffset: this.options.tooltipXOffset,
				fillColor: this.options.tooltipFillColor,
				textColor: this.options.tooltipFontColor,
				fontFamily: this.options.tooltipFontFamily,
				fontStyle: this.options.tooltipFontStyle,
				fontSize: this.options.tooltipFontSize,
				titleTextColor: this.options.tooltipTitleFontColor,
				titleFontFamily: this.options.tooltipTitleFontFamily,
				titleFontStyle: this.options.tooltipTitleFontStyle,
				titleFontSize: this.options.tooltipTitleFontSize,
				cornerRadius: this.options.tooltipCornerRadius,
				labels: tooltipLabels,
				legendColors: [],//tooltipColors,
				legendColorBackground : this.options.multiTooltipKeyBackground,
				title: '',//template(this.options.tooltipTitleTemplate,activeBars[0]),
				chart: this.chart,
				ctx: this.chart.ctx,
				custom: this.options.customTooltips
			}).draw();*/

		},
		update : function(){
			this.scale.update();
			// Reset any highlight colours before updating.
			helpers.each(this.activeElements, function(activeElement){
				activeElement.restore(['fillColor', 'strokeColor']);
			});

			this.eachBars(function(bar){
				bar.save();
			});
			this.render();
		},
		eachBars : function(callback){
			helpers.each(this.datasets,function(dataset, datasetIndex){
				helpers.each(dataset.bars, callback, this, datasetIndex);
			},this);
		},
		getBarsAtEvent : function(e){
			var barsArray = [],
				eventPosition = helpers.getRelativePosition(e),
				datasetIterator = function(dataset){
					barsArray.push(dataset.bars[barIndex]);
				},
				barIndex;

			for (var datasetIndex = 0; datasetIndex < this.datasets.length; datasetIndex++) {
				for (barIndex = 0; barIndex < this.datasets[datasetIndex].bars.length; barIndex++) {
					if (this.datasets[datasetIndex].bars[barIndex].inRange(eventPosition.x,eventPosition.y)){
						helpers.each(this.datasets, datasetIterator);
						return barsArray;
					}
				}
			}

			return barsArray;
		},
		buildScale : function(labels){
			var self = this;

			var dataTotal = function(){
				var values = [];
				self.eachBars(function(bar){
					values.push(bar.value);
				});
				return values;
			};
			var dataTotalStacked = function(){
				var values = [];
				helpers.each(self.datasets, function(dataset) {
					helpers.each(dataset.bars, function(bar, barIndex) {
						if(!values[barIndex]) values[barIndex] = 0;
						values[barIndex] = +values[barIndex] + +bar.value;
					});
				});
				return values;
			};

			var scaleOptions = {
				templateString : this.options.scaleLabel,
				height : this.chart.height,
				width : this.chart.width,
				ctx : this.chart.ctx,
				textColor : this.options.scaleFontColor,
				fontSize : this.options.scaleFontSize,
				fontStyle : this.options.scaleFontStyle,
				fontFamily : this.options.scaleFontFamily,
				valuesCount : labels.length,
				beginAtZero : this.options.scaleBeginAtZero,
				integersOnly : this.options.scaleIntegersOnly,
				stacked: this.options.stacked,
				calculateYRange: function(currentHeight){
					var updatedRanges = helpers.calculateScaleRange(
						this.stacked ? dataTotalStacked() : dataTotal(),
						currentHeight,
						this.fontSize,
						this.beginAtZero,
						this.integersOnly
					);
					helpers.extend(this, updatedRanges);
				},
				xLabels : labels,
				font : helpers.fontString(this.options.scaleFontSize, this.options.scaleFontStyle, this.options.scaleFontFamily),
				lineWidth : this.options.scaleLineWidth,
				lineColor : this.options.scaleLineColor,
				showHorizontalLines : this.options.scaleShowHorizontalLines,
				showVerticalLines : this.options.scaleShowVerticalLines,
				gridLineWidth : (this.options.scaleShowGridLines) ? this.options.scaleGridLineWidth : 0,
				gridLineColor : (this.options.scaleShowGridLines) ? this.options.scaleGridLineColor : "rgba(0,0,0,0)",
				padding : (this.options.showScale) ? 0 : (this.options.barShowStroke) ? this.options.barStrokeWidth : 0 + (this.options.padding  ? this.options.padding : 0),
				showLabels : this.options.scaleShowLabels,
				display : this.options.showScale
			};

			if (this.options.scaleOverride){
				helpers.extend(scaleOptions, {
					calculateYRange: helpers.noop,
					steps: this.options.scaleSteps,
					stepValue: this.options.scaleStepWidth,
					min: this.options.scaleStartValue,
					max: this.options.scaleStartValue + (this.options.scaleSteps * this.options.scaleStepWidth)
				});
			}


			// if (this.options.scaleStartValue !== undefined)
			// 	scaleOptions.min = this.options.scaleStartValue;
			// if (this.options.scaleStopValue !== undefined)
			// 	scaleOptions.max = this.options.scaleStopValue;
			//
			this.scale = new this.ScaleClass(scaleOptions);

			var labelsTotal = function(){
				var labels = [];
				self.eachBars(function(bar){
					//if (bar.label)
					//	labels.push(bar.label);
					if (bar.value)
						labels.push(bar.value);
				});
				return labels;
			};

			var padding = helpers.longestText(this.scale.ctx,this.scale.font,labelsTotal());

			this.scale.xScalePaddingRight += padding || 0;

			if (dataTotal().some(function(value){return value < 0;}))
				this.scale.xScalePaddingLeft += padding || 0;


		},
		addData : function(valuesArray,label){
			//Map the values array for each of the datasets
			helpers.each(valuesArray,function(value,datasetIndex){
				//Add a new point for each piece of data, passing any required data to draw.
				this.datasets[datasetIndex].bars.push(new this.BarClass({
					value : value,
					label : label,
					//x: 0,
					//x: this.scale.calculateXInvertXY(0),
					x: this.scale.calculateBarX(this.datasets.length, datasetIndex, this.scale.valuesCount+1),
					y: this.scale.endPoint,
					width : this.scale.calculateBarWidth(this.datasets.length),
					base : this.scale.endPoint,
					strokeColor : this.datasets[datasetIndex].strokeColor,
					fillColor : this.datasets[datasetIndex].fillColor
				}));
			},this);

			this.scale.addXLabel(label);
			//Then re-render the chart.
			this.update();
		},
		removeData : function(){
			this.scale.removeXLabel();
			//Then re-render the chart.
			helpers.each(this.datasets,function(dataset){
				dataset.bars.shift();
			},this);
			this.update();
		},
		reflow : function(){
			helpers.extend(this.BarClass.prototype,{
				y: this.scale.endPoint,
				base : this.scale.endPoint
			});
			var newScaleProps = helpers.extend({
				height : this.chart.height,
				width : this.chart.width
			});

			this.scale.update(newScaleProps);
		},
		draw : function(ease){
			var easingDecimal = ease || 1;
			this.clear();

			var ctx = this.chart.ctx;

			this.scale.draw(easingDecimal);

			function getPrevValues(_index, _datasetIndex){
				var value = 0;
				this.eachBars(function(bar, index, datasetIndex){
					if (datasetIndex < _datasetIndex && index == _index)
						value += bar.value;
				});
				return value;
			}

			//Draw all the bars for each dataset
			helpers.each(this.datasets,function(dataset,datasetIndex){
				helpers.each(dataset.bars,function(bar,index){
					if (bar.hasValue()){
						//bar.left = Math.round(this.scale.xScalePaddingLeft);
						//bar.left = this.scale.calculateXInvertXY(0);
						//bar.left = this.scale.calculateXInvertXY(this.options.stacked ? getPrevValues.call(this, index, datasetIndex) : 0);
						//bar.x = bar.left;
						//Transition then draw
						bar.transition({
							// x : this.scale.calculateXInvertXY(bar.value),
							// y : this.scale.calculateBarY(this.datasets.length, datasetIndex, index),
							// height : this.scale.calculateBarHeight(this.datasets.length)
							// x : this.scale.calculateXInvertXY(bar.value),
							left: this.scale.calculateXInvertXY(this.options.stacked ? getPrevValues.call(this, index, datasetIndex) : 0),
							x : this.scale.calculateXInvertXY(bar.value + (this.options.stacked ? getPrevValues.call(this, index, datasetIndex) : 0)),
							y : this.scale.calculateBarY(this.datasets.length, datasetIndex, index),
							height : this.scale.calculateBarHeight(this.datasets.length)
						}, easingDecimal).draw();
					}
				},this);

			},this);
		}
	});


}).call(this);
