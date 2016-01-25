//配置文件
var options = {
	'element': '#main',
	'nodes': {},
	'links': {},
	'radiu': 23,
}


//关系图整体方法
var bgMain = function(options){
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
bgMain.prototype.init = function(){
	//初始化方法
	//创建svg
	this.svg = d3.select(this.element).append('svg');
	this.svg.attr('width', d3.select(this.element).attr('width')).attr('height', d3.select(this.element).attr('width'));
	//计算图形中心点
	this.x = d3.select(this.element).attr('width');
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
	]
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