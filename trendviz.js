//配置文件
var options = {
	'element': '#main',
	'nodes': {},
	'links': {},
	'radiu': 350,
}
var nodesArr = [];
var linksArr = [];

//关系图整体方法
var Trendviz = function(options){
	this.element = options.element || 'body'; //图形应用的元素
	this.nodes = options.nodes; //节点数据
	this.links = options.links; //节点关系数据
	this.borderPathRadiu = options.radiu || 350; //边界半径
	this.borderPathColor = 'black'; //边界颜色
	this.borderPathSpace = '2 2'; //边界虚线间隙
	this.endsPointColor = 'rgb(53, 74, 95)'; //边界终点的圆形颜色
	this.endsPointRadiu = [5, 18]; //边界终点的圆形半径
	this.endsPointAngle = 45; //边界终点的圆形角度
	this.endsTextColor = '#000'; //边界终点的文字颜色
	this.endsTextContext = ['start', 'end']; //边界终点的文字内容
	this.svg; //应用的svg
	this.init(); 
}
Trendviz.prototype.init = function(){
	//初始化方法
	//创建svg
	this.svg = d3.select(this.element).append('svg');
	this.svg.attr('width', d3.select(this.element).attr('width')).attr('height', d3.select(this.element).attr('width'));
	//计算图形中心点
	this.x = d3.select(this.element).attr('width')/2;
	this.y = this.x;
	//边界终点的文字半径
	this.endsTextRadiu = this.borderPathRadiu+30;
	//边界终点的圆形位置
	this.endsPointOffset = [
		this.borderPathRadiu*getRadianByAngle(this.endsPointAngle*0.8, 'sin'),
		this.borderPathRadiu*getRadianByAngle(this.endsPointAngle*0.8, 'cos')
	];
	//边界终点的文字位置
	this.endsTextOffset = [
		this.endsTextRadiu*getRadianByAngle(this.endsPointAngle*0.8, 'sin'),
		this.endsTextRadiu*getRadianByAngle(this.endsPointAngle*0.8, 'cos')
	];
	//边界终点的原型与文字的具体位置
	this.ends = [
		[	
			[this.x+this.endsPointOffset[0], this.y-this.endsPointOffset[1]],
			[this.x+this.endsTextOffset[0], this.y-this.endsTextOffset[1]],
			this.endsTextContext[0]
		],
		[
			[this.x-this.endsPointOffset[0], this.y-this.endsPointOffset[1]],
			[this.x-this.endsTextOffset[0], this.y-this.endsTextOffset[1]],
			this.endsTextContext[1]
		]
	];
	//绘制背景圆圈
	this.drawBorderPath();
}
//绘制虚线圆圈
Trendviz.prototype.drawBorderPath = function(){
	//最外层背景圆圈
	this.borderPathStr = 'M '+(this.x+this.endsPointOffset[0])+' '+(this.y-this.endsPointOffset[1])+' A '+this.borderPathRadiu+' '+this.borderPathRadiu+' -30 1 1 '+(this.x-this.endsPointOffset[0])+' '+(this.y-this.endsPointOffset[1]);
	//绘制圆圈
	this.borderPath = this.svg.append('g').attr('id', 'trendviz_path').append('path').attr('d', this.borderPathStr).attr('stroke', this.borderPathColor).attr('stroke-width', 1).attr('fill', 'none').attr('stroke-dasharray', this.borderPathSpace);
}
//绘制背景文字与圆形
Trendviz.prototype.drawEnds = function(){
	//绘制圆形区域
	this.endsPointG = this.svg.append('g').attr('id', 'trendviz_point');
	//绘制文字区域
	this.endsTextG = this.svg.append('g').attr('id', 'trendviz_text');

	for(this.num=0; this.num<this.ends.length; this.num++){
		this.drawEndsPoint(this.ends[this.num][0][0], this.ends[this.num][0][1], this.endsPointRadiu[this.num], this.endsPointColor);
		this.drawEndsText(this.ends[this.num][2], this.ends[this.num][1][0], this.ends[this.num][1][1], this.endsTextColor, this.x);
	}
}
//绘制背景圆形
Trendviz.prototype.drawEndsPoint = function(x, y, r, fill){
	this.endsPointG.append('circle')
		.attr('cx', x)
		.attr('cy', y)
		.attr('r', r)
		.attr('fill', fill)
		.attr('stroke', 'none');
}
//绘制背景文字
Trendviz.prototype.drawEndsText = function(text, x, y, fill, center){
	this.endsTextG.append('text')
		.text(text)
		.attr('x', function(){
			if(x<center){
				return (x-this.offsetWidth);
			}else{
				return x;
			}
		})
		.attr('y', y)
		.attr('fill', fill)
		.attr('font-size', '15px');
}
//绘制数据节点
Trendviz.prototype.drawNodes = function(){
	svg.append('g').attr('id', 'nodes');
	this.nodesAngle = (360-2*this.endsPointAngle)/(this.nodes.length-1);
	for(this.num=0; this.num<this.nodes.length; this.num++){
		nodesArr.push(new Point(this.nodes[this.num].name, this.nodes[this.num].category, this.nodes[this.num].value, (this.endsPointAngle+this.nodesAngle*this.num), this.x, this.y, this.borderPathRadiu))

	}
}
Trendviz.prototype.drawLinks = function(){
	svg.append('g').attr('id', 'links');
	for(this.num=0; this.num<this.links.length; this.num++){
		linksArr.push(Path(getNodesByName(this.links[this.num].source.nodesArr), getNodesByName(this.links[this.num].target.nodesArr), this.links[this.num].weight, this.x, this.y))
	}
}

Trendviz.prototype.display = function(){
	this.drawEnds();
	this.drawNodes();
	this.drawLinks();
}
//绘制数据节点
var Point = function(name, category, value, angle, x, y, r){
	this.name = name;
	this.category = category;
	this.value = value;
	this.angle = angle;
	this.x = x;
	this.y = y;
	this.r = r;
	this.flag = true;
	this.colors = ['rgb(210, 49, 118)', 'rgb(82, 189, 231)', 'rgb(82, 231, 121)'];
	this.init();
}
Point.prototype.init = function(){
	this.bigR = this.r*0.7;
	this.smallR = this.r*0.45;
	this.textR = this.r+30;
	this.textbR = this.bigR+30;
	this.textsR = this.smallR+30;

	this.norX = this.x+this.r*getRadianByAngle(this.angle, 'sin');
	this.norY = this.y+this.r*getRadianByAngle(this.angle, 'cos');
	this.bigX = this.x+this.bigR*getRadianByAngle(this.angle, 'sin');
	this.bigY = this.y+this.bigR*getRadianByAngle(this.angle, 'cos');
	this.smallX = this.x+this.smallR*getRadianByAngle(this.angle, 'sin');
	this.smallY = this.y+this.smallR*getRadianByAngle(this.angle, 'cos');

	this.textX = this.x+this.textR*getRadianByAngle(this.angle, 'sin');
	this.textY = this.y+this.textR*getRadianByAngle(this.angle, 'cos');
	this.textbX = this.x+this.textbR*getRadianByAngle(this.angle, 'sin');
	this.textbY = this.y+this.textbR*getRadianByAngle(this.angle, 'cos');
	this.textsX = this.x+this.textsR*getRadianByAngle(this.angle, 'sin');
	this.textsY = this.y+this.textsR*getRadianByAngle(this.angle, 'cos');

	this.trueColor = this.colors[this.category];

	this.display();
}
Point.prototype.cirMouseOver = function(){
	var _self = this;
	this.circleDom.on('mouseover', function(){
		d3.select(this).transition()
			.ease('elastic')
			.attr('r', (_self.value*2.1))
			.duration(500)
	})
}
Point.prototype.cirMouseOut = function(){
	var _self = this;
	this.circleDom.on('mouseout', function(){
		d3.select(this).transition()
			.ease('elastic')
			.attr('r', (_self.value*1.1))
			.duration(500)
	})
}
Point.prototype.cirMouseClick = function(){
	var _self = this;
	this.circleDom.on('click', function(){
		if(_self.flag == true){
			for(_self.num=0; _self.num<linksArr.length; _self.num++){
				linksArr[_self.num].target.reback();
				linksArr[_self.num].source.reback();
				linksArr[_self.num].color = linksArr[_self.num].source.color;
				linksArr[_self.num].show();
			}
			_self.nowX = _self.bigX;
			_self.nowY = _self.bigY;
			_self.show();

			_self.textDom.transition()
				.ease('elastic')
				.attr('x', _self.textbX)
				.attr('y', _self.textbY)
				.duration(500)

			_self.flag = false;

			for(_self.num=0; _self.num<nodesArr.length; _self.num++){
				if(nodesArr[_self.num].name != _self.name){
					nodesArr[_self.num].flag = true;
				}
			}

			for(_self.num=0; _self.num<linksArr.length; _self.num++){
				if(_self.name == linksArr[_self.num].source.name || _self.name == linksArr[_self.num].target.name){
					if(_self.name == linksArr[_self.num].source.name){
						linksArr[_self.num].target.change();
					}
					if(_self.name == linksArr[_self.num].target.name){
						linksArr[_self.num].source.change();
					}
				}else{
					linksArr[_self.num].color = 'rgba(33, 33, 33, 0.1)';
				}
			}
			for(_self.num=0; _self.num<linksArr.length; _self.num++){
				linksArr[_self.num].show();
			}
		}else{
			_self.nowX = _self.norX;
			_self.nowY = _self.norY;
			_self.show();
			_self.textDom.transition()
				.ease('elastic')
				.attr('x', _self.textX)
				.attr('y', _self.textY)
				.duration(500)

			_self.flag = true;

			for(_self.num=0; _self.num<linksArr.length; _self.num++){
				linksArr[_self.num].target.reback();
				linksArr[_self.num].source.reback();
			}

			for(_self.num=0; _self.num<linksArr.length; _self.num++){
				linksArr[_self.num].color = linksArr[_self.num].source.color;
				linksArr[_self.num].show();
			}
		}
	})
}
Point.prototype.change = function(){
	this.nowX = this.smallX;
	this.nowY = this.smallY;
	this.nowC = this.trueColor;
	this.show();
	this.textDom.transition()
		.ease('elastic')
		.attr('x', this.textsX)
		.attr('y', this.textsY)
		.duration(500)
}
Point.prototype.reback = function(){
	this.nowX = this.norX;
	this.nowY = this.norY;
	this.nowC = this.trueColor;
	this.show();
	this.textDom.transition()
		.ease('elastic')
		.attr('x', this.textX)
		.attr('y', this.textY)
		.duration(500)
}
Point.prototype.show = function(){
	this.circleDom.transition()
		.ease('elastic')
		.attr('cx', this.nowX)
		.attr('cy', this.nowY)
		.attr('fill', this.nowC)
}
Point.prototype.display = function(){
	var _self = this;

	this.nowX = this.norX;
	this.nowY = this.norY;
	this.nowC = this.trueColor;

	this.circleDom = d3.select('#nodes')
		.append('circle')
		.attr('cx', this.nowX)
		.attr('cy', this.nowY)
		.attr('r', this.value)
		.attr('fill', this.nowC)
		.attr('stroke', 'none')

	this.textDom = d3.select('#nodes')
		.append('text')
		.text(this.name)
		.attr('x', function(){
			if(_self.textX < _self.x){
				_self.textX -= this.offsetWidth;
				_self.textbX -= this.offsetWidth;
				_self.textsX -= this.offsetWidth;
			}
			return _self.textX;
		})
		.attr('y', this.textY)
		.attr('fill', this.fill)
		.attr('font-size', '12px')

	this.cirMouseOver();
	this.cirMouseOut();
	this.cirMouseClick();
}


var Path = function(source, target, weight, x, y){
	this.source = source;
	this.target = target;
	this.weight = weight;
	this.x = x;
	this.y = y;
}
Path.prototype.show = function(){
	this.linkDom.transition()
		.ease('elastic')
		.attr('d', 'M '+this.source.nowX+' '+this.source.nowY+' Q '+this.x+' '+this.y+' '+this.target.nowX+' '+this.target.nowY)
		.attr('stroke', this.color)
}
Path.prototype.display = function(){
	this.color = this.source.color;
	this.linkDom = d3.select('#links')
		.append('path')
		.attr('d', 'M '+this.source.nowX+' '+this.source.nowY+' Q '+this.x+' '+this.y+' '+this.target.nowX+' '+this.target.nowY)
		.attr('stroke', this.source.nowC)
		.attr('opacity', this.weight/2)
		.attr('fill', 'none')
}


function getRadianByAngle(ang, sc){
	if(sc == 'sin'){
		return Math.sin(ang*2*Math.PI/360);
	}else{
		return Math.cos(ang*2*Math.PI/360);
	}
}


function getNodesByName(name, array){
	for(var i=0; i<array.length; i++){
		if(array[i].name == name){
			return array[i];
		}
	}
}