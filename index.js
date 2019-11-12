'use strict';

const input_func = document.getElementById("func")
const input_arg = document.getElementById("arg")
const label_res = document.getElementById("res")
const btn = document.getElementById("calc_btn")

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d");

const e = 0.001;

let canvasHeight = canvas.height
let canvasWidth = canvas.width

let minX = document.getElementById("minX").value - 0
let maxX = document.getElementById("maxX").value - 0
let minY = document.getElementById("minY").value - 0
let maxY = document.getElementById("maxY").value - 0

let scaleX = canvasWidth / (Math.abs(minX) + Math.abs(maxX))
let scaleY = canvasHeight / (Math.abs(minY) + Math.abs(maxY))

let gridDashX = document.getElementById("dashX").value - 0;
let gridDashY = document.getElementById("dashY").value - 0;

let segmentStepX = document.getElementById("segStepX").value - 0;


let pow = Math.pow;
let sqrt = Math.sqrt;
let abs = Math.abs;
let cos = Math.cos;
let arccos = Math.acos;
let sin = Math.sin;
let arcsin = Math.asin;
let tg = Math.tan;
let arctg = Math.atan;
let exp = Math.exp;
let ln = Math.log;

let ctg = (x) => {
	return 1 / tg(x);
};
let arcctg = (x) => {
	return ((PI / 2) - arctg(x));
};


/**
 * 
 * Принимает строку с функцией и возвращает фун-ию js
 * @param {String} expr строка функции
 */
const getFunc = (expr) => {
	try {
		return (new Function('x', 'return ' + expr));
	} catch (err) {
		throw 'Function parse error'
	}
}

/**
 * 
 * Рисует оси координат
 */
const drawAxis = () => {
	let width = 10;

	ctx.beginPath();
	ctx.moveTo(-width / 2, maxY * scaleY - width * 2);
	ctx.lineTo(0, maxY * scaleY);
	ctx.lineTo(width / 2, maxY * scaleY - width * 2);
	ctx.lineTo(-width / 2, maxY * scaleY - width * 2);

	ctx.moveTo(0, minY * scaleY);
	ctx.lineTo(0, maxY * scaleY);

	ctx.moveTo(minX * scaleX, 0);
	ctx.lineTo(maxX * scaleX, 0);

	ctx.closePath();
	ctx.stroke();
}


/**
 * 
 * Рисует сетку по заданным параметрам
 * @param {Number} dashX шаг сетки по оси X
 * @param {Number} dashY шаг сетки по оси Y
 * @param {string} style стиль линии
 */
const drawGrid = (dashX, dashY, style) => {
	ctx.save();
	ctx.beginPath();
	ctx.strokeStyle = style;

	for (let x = 0; x <= maxX * scaleX; x += dashX) {
		if (x !== 0) {
			ctx.moveTo(x, minY * scaleY);
			ctx.lineTo(x, maxY * scaleY);
		}
	}

	for (let x = 0; x >= minX * scaleX; x -= dashX) {
		if (x !== 0) {
			ctx.moveTo(x, minY * scaleY);
			ctx.lineTo(x, maxY * scaleY);
		}
	}

	for (let y = 0; y <= maxY * scaleY; y += dashY) {
		if (y !== 0) {
			ctx.moveTo(minX * scaleX, y);
			ctx.lineTo(maxX * scaleX, y);
		}
	}

	for (let y = 0; y >= minY * scaleY; y -= dashY) {
		if (y !== 0) {
			ctx.moveTo(minX * scaleX, y);
			ctx.lineTo(maxX * scaleX, y);
		}
	}

	ctx.stroke();
	ctx.restore();
}

/**
 * 
 * Рисует нумерованные отрезки на осях координат 
 * @param {Canvas} ctx контекст холста
 * @param {Number} dash шаг разбиения
 */
const drawSegments = (ctx, dash) => {
	ctx.beginPath();
	let height = 10;

	ctx.save();
	ctx.scale(1, -1);
	ctx.font = "14px Verdana";
	ctx.fillText(0, 20, 0);
	ctx.stroke();
	ctx.restore();

	for (let x = dash; x < maxX; x += dash) {
		ctx.save();
		ctx.scale(1, -1);
		ctx.font = "14px Verdana";
		ctx.fillText(x, x * scaleX, 20);
		ctx.stroke();
		ctx.restore();
		ctx.moveTo(x * scaleX, -height / 2);
		ctx.lineTo(x * scaleX, height / 2);
	}

	for (let x = -dash; x >= minX; x -= dash) {
		ctx.save();
		ctx.scale(1, -1);
		ctx.font = "14px Verdana";
		ctx.fillText(x, x * scaleX, 20);
		ctx.stroke();
		ctx.restore();
		ctx.moveTo(x * scaleX, -height / 2);
		ctx.lineTo(x * scaleX, height / 2);
	}

	for (let y = dash; y < maxY; y += dash) {
		ctx.save();
		ctx.scale(1, -1);
		ctx.font = "14px Verdana";
		ctx.fillText(-y, 20, y * scaleY);
		ctx.stroke();
		ctx.restore();
		ctx.moveTo(-height / 2, y * scaleY);
		ctx.lineTo(height / 2, y * scaleY);
	}

	for (let y = -dash; y > minY; y -= dash) {
		ctx.save();
		ctx.scale(1, -1);
		ctx.font = "14px Verdana";
		ctx.fillText(-y, 20, y * scaleY);
		ctx.stroke();
		ctx.restore();
		ctx.moveTo(-height / 2, y * scaleY);
		ctx.lineTo(height / 2, y * scaleY);
	}
	ctx.closePath();
	ctx.stroke();
}


/**
 * 
 * Обновляет значения переменных и очищает Canvas
 */
const update = () => {
	document.getElementById('ErrorMessage').textContent = '';
	minX = document.getElementById("minX").value - 0;
	maxX = document.getElementById("maxX").value - 0;
	minY = document.getElementById("minY").value - 0;
	maxY = document.getElementById("maxY").value - 0;

	gridDashX = document.getElementById("dashX").value - 0;
	gridDashY = document.getElementById("dashY").value - 0;

	segmentStepX = document.getElementById("segStepX").value - 0;

	canvasHeight = canvas.height;
	canvasWidth = canvas.width;

	scaleX = canvasWidth / (Math.abs(maxX - minX));
	scaleY = canvasHeight / (Math.abs(maxY - minY));
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

/**
 * 
 * Задает каноническую систему координат 
 * @param {*} canvas 
 * @param {*} scaleX 
 * @param {*} scaleY 
 * @param {*} minX 
 * @param {*} minY 
 */
const setCoordSystem = (canvas, scaleX, scaleY, minX, minY) => {
	let ctx = canvas.getContext('2d');

	ctx.save();
	ctx.translate(0, canvas.height);
	ctx.scale(1, -1);
	ctx.translate(-scaleX * minX, -scaleY * minY);
}

/**
 * Рисует оси координат и сетку, соответствующие заданным параметрам
 * @param {Canvas} canvas 
 * @param {Number} scaleX 
 * @param {Number} scaleY 
 * @param {Number} minX 
 * @param {Number} minY 
 */
const drawPlot = (canvas, scaleX, scaleY, minX, minY) => {
	let ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	setCoordSystem(canvas, scaleX, scaleY, minX, minY);
	drawGrid(gridDashX * scaleX, gridDashY * scaleY, 'orange');
	drawAxis();
	drawSegments(ctx, segmentStepX);
}

/**
 * 
 * Вычисляет значения функции в точках на заданном отрезке
 * @param {function} func
 * @param {Number} minX 
 * @param {Number} maxX 
 */
const calcPoints = (func, minX, maxX) => {
	0
	let points = [];
	for (let x = minX; x <= maxX; x += e) {
		points.push(new Point(x, func(x)));
	}
	return points;
}

/**
 * 
 * Рисует график функции по заданным точкам
 * @param {Point []} points массив точек
 */
const drawFunction = (points, ctx, scaleX, scaleY, strokeStyle) => {
	ctx.beginPath();
	ctx.strokeStyle = strokeStyle;
	let i = 1;
	for (; i < points.length - 2; i++) {
		if (points[i].y !== NaN &&
			points[i].y !== Infinity &&
			points[i].y !== -Infinity &&
			points[i].y <= maxY + 2 &&
			points[i].y >= minY - 2
		) {
			let xc = (points[i].x + points[i + 1].x) / 2;
			let yc = (points[i].y + points[i + 1].y) / 2;
			ctx.quadraticCurveTo(scaleX * points[i].x, scaleY * points[i].y, scaleX * xc, scaleY * yc);
		} else if (points[i].y >= maxY + 2 || points[i].y <= minY - 2) {
			if ((points[i - 1].y < maxY + 2 && points[i - 1].y > minY)) {
				ctx.lineTo(scaleX * points[i].x, scaleY * points[i].y);
			}

			else if ((points[i + 1].y < maxY + 2 && points[i + 1].y > minY)) {
				ctx.lineTo(scaleX * points[i].x, scaleY * points[i].y);
			}
			else {
				ctx.stroke();
				ctx.beginPath();
			}
		}
		else {
			ctx.stroke();
			ctx.beginPath();
		}
	}
	ctx.quadraticCurveTo(scaleX * points[i].x, scaleY * points[i].y, scaleX * points[i + 1].x, scaleY * points[i + 1].y);
	ctx.stroke();
	ctx.restore();
}

/*
Обработчик нажатия на кнопку visualize
*/
btn.onclick = () => {
	update();
	let func, points
	try {
		func = getFunc(input_func.value);
		points = calcPoints(func, minX, maxX);
	} catch (err) {
		document.getElementById('ErrorMessage').textContent = 'Function parse error'
		return;
	}

	drawPlot(canvas, scaleX, scaleY, minX, minY);
	drawFunction(points, ctx, scaleX, scaleY, 'blue');

}

class Point {
	/**
	 * 
	 * @param {Number} x 
	 * @param {Number} y 
	 */
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}