
// chart 4
Highcharts.chart('chart4', {
	chart: {
		type: 'column'
	},
	title: {
		text: 'Monthly Electricity Consumptions'
	},
	subtitle: {
		text: ''
	},
	xAxis: {
		categories: [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
		],
		crosshair: true
	},
	yAxis: {
		min: 0,
		title: {
			text: 'Rainfall (mm)'
		}
	},
	tooltip: {
		headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
		pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
		'<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
		footerFormat: '</table>',
		shared: true,
		useHTML: true
	},
	plotOptions: {
		column: {
			pointPadding: 0.2,
			borderWidth: 0
		}
	},
	series: [{
		name: 'Floor 1',
		data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

	}, {
		name: 'Floor 2',
		data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

	}, {
		name: 'Floor 3',
		data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]

	}, {
		name: 'Floor 4',
		data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]

	}]
});

Highcharts.chart('chart11', {
	chart: {
		type: 'column'
	},
	title: {
		text: 'Monthly Electricity Expenses'
	},
	subtitle: {
		text: ''
	},
	xAxis: {
		categories: [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
		],
		crosshair: true
	},
	yAxis: {
		min: 0,
		title: {
			text: 'Rainfall (mm)'
		}
	},
	tooltip: {
		headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
		pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
		'<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
		footerFormat: '</table>',
		shared: true,
		useHTML: true
	},
	plotOptions: {
		column: {
			pointPadding: 0.2,
			borderWidth: 0
		}
	},
	series: [{
		name: 'Floor 1',
		data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

	}, {
		name: 'Floor 2',
		data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

	},{
		name: '3rd Floor',
		data: [5.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]

	}]
});

Highcharts.chart('chart12', {
	chart: {
		type: 'column'
	},
	title: {
		text: 'Monthly Electricity test'
	},
	subtitle: {
		text: ''
	},
	xAxis: {
		categories: [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
		],
		crosshair: true
	},
	yAxis: {
		min: 0,
		title: {
			text: 'kwh'
		}
	},
	
	tooltip: {
		headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
		pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
		'<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
		footerFormat: '</table>',
		shared: true,
		useHTML: true
	},
	plotOptions: {
		column: {
			pointPadding: 0.2,
			borderWidth: 0
		}
	},
	series: [{
		name: '1st Floor',
		data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

	},  {
		name: '2nd Floor',
		data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]

	},{
		name: '3rd Floor',
		data: [5.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]

	}]
});

// chart 5
Highcharts.chart('chart5', {
	title: {
		text: 'Electricity Consumption',
	},
	xAxis: {
		categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	},
	series: [{
		type: 'pie',
		allowPointSelect: true,
		keys: ['name', 'y', 'selected', 'sliced'],
		data: [
		['1st Floor', 29.9, false],
		['2nd Floor', 71.5, false],	
		['3rd Floor', 25.5, false],	
		],
		showInLegend: true
	}]
});

// chart 6
Highcharts.chart('chart6', {
	chart: {
		type: 'pie',
		options3d: {
			enabled: true,
			alpha: 45
		}
	},
	title: {
		text: 'Electricity Expenses'
	},
	subtitle: {
		text: '3D donut in Highcharts'
	},
	plotOptions: {
		pie: {
			innerSize: 100,
			depth: 45
			
		}
	},
	series: [{
		name: 'Electricity Expenses $',
		data: [
		['1st Floor', 8000],
		['2nd Floor', 3000],
		['3rd Floor', 5000],
		
		]
	}]
});

// chart 7
Highcharts.chart('chart7', {
	chart: {
		type: 'gauge',
		plotBackgroundColor: null,
		plotBackgroundImage: null,
		plotBorderWidth: 0,
		plotShadow: false
	},
	title: {
		text: 'Total'
	},
	pane: {
		startAngle: -150,
		endAngle: 150,
		background: [{
			backgroundColor: {
				linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
				stops: [
				[0, '#FFF'],
				[1, '#333']
				]
			},
			borderWidth: 0,
			outerRadius: '109%'
		}, {
			backgroundColor: {
				linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
				stops: [
				[0, '#333'],
				[1, '#FFF']
				]
			},
			borderWidth: 1,
			outerRadius: '107%'
		}, {
		}, {
			backgroundColor: '#DDD',
			borderWidth: 0,
			outerRadius: '105%',
			innerRadius: '103%'
		}]
	},
	yAxis: {
		min: 0,
		max: 200,

		minorTickInterval: 'auto',
		minorTickWidth: 1,
		minorTickLength: 10,
		minorTickPosition: 'inside',
		minorTickColor: '#666',

		tickPixelInterval: 30,
		tickWidth: 2,
		tickPosition: 'inside',
		tickLength: 10,
		tickColor: '#666',
		labels: {
			step: 2,
			rotation: 'auto'
		},
		title: {
			text: 'kw/h'
		},
		plotBands: [{
			from: 0,
			to: 120,
			color: '#55BF3B'
		}, {
			from: 120,
			to: 160,
			color: '#DDDF0D'
		}, {
			from: 160,
			to: 200,
			color: '#DF5353'
		}]
	},
	series: [{
		name: 'Speed',
		data: [80],
		tooltip: {
			valueSuffix: ' kw/h'
		}
	}]
},
function (chart) {
	if (!chart.renderer.forExport) {
		setInterval(function () {
			var point = chart.series[0].points[0],
			newVal,
			inc = Math.round((Math.random() - 0.5) * 20);

			newVal = point.y + inc;
			if (newVal < 0 || newVal > 200) {
				newVal = point.y - inc;
			}

			point.update(newVal);

		}, 3000);
	}
});

// chart 9
Highcharts.chart('chart9', {
	chart: {
		type: 'gauge',
		plotBackgroundColor: null,
		plotBackgroundImage: null,
		plotBorderWidth: 0,
		plotShadow: false
	},
	title: {
		text: 'Floor 1'
	},
	pane: {
		startAngle: -150,
		endAngle: 150,
		background: [{
			backgroundColor: {
				linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
				stops: [
				[0, '#FFF'],
				[1, '#333']
				]
			},
			borderWidth: 0,
			outerRadius: '109%'
		}, {
			backgroundColor: {
				linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
				stops: [
				[0, '#333'],
				[1, '#FFF']
				]
			},
			borderWidth: 1,
			outerRadius: '107%'
		}, {
		}, {
			backgroundColor: '#DDD',
			borderWidth: 0,
			outerRadius: '105%',
			innerRadius: '103%'
		}]
	},
	yAxis: {
		min: 0,
		max: 200,

		minorTickInterval: 'auto',
		minorTickWidth: 1,
		minorTickLength: 10,
		minorTickPosition: 'inside',
		minorTickColor: '#666',

		tickPixelInterval: 30,
		tickWidth: 2,
		tickPosition: 'inside',
		tickLength: 10,
		tickColor: '#666',
		labels: {
			step: 2,
			rotation: 'auto'
		},
		title: {
			text: 'kw/h'
		},
		plotBands: [{
			from: 0,
			to: 120,
			color: '#55BF3B'
		}, {
			from: 120,
			to: 160,
			color: '#DDDF0D'
		}, {
			from: 160,
			to: 200,
			color: '#DF5353'
		}]
	},
	series: [{
		name: 'Speed',
		data: [80],
		tooltip: {
			valueSuffix: ' kw/h'
		}
	}]
},
function (chart) {
	if (!chart.renderer.forExport) {
		setInterval(function () {
			var point = chart.series[0].points[0],
			newVal,
			inc = Math.round((Math.random() - 0.5) * 20);

			newVal = point.y + inc;
			if (newVal < 0 || newVal > 200) {
				newVal = point.y - inc;
			}

			point.update(newVal);

		}, 3000);
	}
});

// chart 10
Highcharts.chart('chart10', {
	chart: {
		type: 'gauge',
		plotBackgroundColor: null,
		plotBackgroundImage: null,
		plotBorderWidth: 0,
		plotShadow: false
	},
	title: {
		text: 'Floor 2'
	},
	pane: {
		startAngle: -150,
		endAngle: 150,
		background: [{
			backgroundColor: {
				linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
				stops: [
				[0, '#FFF'],
				[1, '#333']
				]
			},
			borderWidth: 0,
			outerRadius: '109%'
		}, {
			backgroundColor: {
				linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
				stops: [
				[0, '#333'],
				[1, '#FFF']
				]
			},
			borderWidth: 1,
			outerRadius: '107%'
		}, {
		}, {
			backgroundColor: '#DDD',
			borderWidth: 0,
			outerRadius: '105%',
			innerRadius: '103%'
		}]
	},
	yAxis: {
		min: 0,
		max: 200,

		minorTickInterval: 'auto',
		minorTickWidth: 1,
		minorTickLength: 10,
		minorTickPosition: 'inside',
		minorTickColor: '#666',

		tickPixelInterval: 30,
		tickWidth: 2,
		tickPosition: 'inside',
		tickLength: 10,
		tickColor: '#666',
		labels: {
			step: 2,
			rotation: 'auto'
		},
		title: {
			text: 'kw/h'
		},
		plotBands: [{
			from: 0,
			to: 120,
			color: '#55BF3B'
		}, {
			from: 120,
			to: 160,
			color: '#DDDF0D'
		}, {
			from: 160,
			to: 200,
			color: '#DF5353'
		}]
	},
	series: [{
		name: 'Speed',
		data: [80],
		tooltip: {
			valueSuffix: ' kw/h'
		}
	}]
},
function (chart) {
	if (!chart.renderer.forExport) {
		setInterval(function () {
			var point = chart.series[0].points[0],
			newVal,
			inc = Math.round((Math.random() - 0.5) * 20);

			newVal = point.y + inc;
			if (newVal < 0 || newVal > 200) {
				newVal = point.y - inc;
			}

			point.update(newVal);

		}, 3000);
	}
});

// chart 8
Highcharts.chart('chart8', {
	chart: {
		type: 'boxplot'
	},
	title: {
		text: 'Highcharts Box Plot Example'
	},
	legend: {
		enabled: false
	},
	xAxis: {
		categories: ['1', '2', '3', '4', '5'],
		title: {
			text: 'Experiment No.'
		}
	},
	yAxis: {
		title: {
			text: 'Observations'
		},
		plotLines: [{
			value: 932,
			color: 'red',
			width: 1,
			label: {
				text: 'Theoretical mean: 932',
				align: 'center',
				style: {
					color: 'gray'
				}
			}
		}]
	},
	series: [{
		name: 'Observations',
		data: [
		[760, 801, 848, 895, 965],
		[733, 853, 939, 980, 1080],
		[714, 762, 817, 870, 918],
		[724, 802, 806, 871, 950],
		[834, 836, 864, 882, 910]
		],
		tooltip: {
			headerFormat: '<em>Experiment No {point.key}</em><br/>'
		}
	}, {
		name: 'Outlier',
		color: Highcharts.getOptions().colors[0],
		type: 'scatter',
		data: [
		[0, 644],
		[4, 718],
		[4, 951],
		[4, 969]
		],
		marker: {
			fillColor: 'white',
			lineWidth: 1,
			lineColor: Highcharts.getOptions().colors[0]
		},
		tooltip: {
			pointFormat: 'Observation: {point.y}'
		}
	}]

});
