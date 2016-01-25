var bgPoint = function(gId, x, y, r, fill){
    this.gId = gId;
    this.x = x;
    this.y = y;
    this.r = r;
    this.fill = fill;
}
bgPoint.prototype.display = function(){
    svg.selectAll('#'+this.gId).append("circle").attr('cx',this.x).attr('cy',this.y).attr('r',this.r).attr("fill",this.fill).attr("stroke","none")
}

var bgText = function(gId, text, x, y, fill, centerX){
    this.gId = gId;
    this.text = text;
    this.x = x;
    this.y = y;
    this.fill = fill;
    this.centerX = centerX;
}
bgText.prototype.display = function(){
    this.textDom = svg.selectAll('#'+this.gId).append('text').text(this.text).attr('x',this.x).attr('y',this.y).attr('fill',this.fill).attr('font-size','15px')
    var that = this;
    this.textDom.attr('x',function(){
        if (d3.select(this).attr('x') < that.centerX){
            return d3.select(this).attr('x')-this.offsetWidth
        }else{
            return d3.select(this).attr('x')
        }
    }).attr('fill',this.fill)
}
// var dataAngle = (360-2*angle)/(nodes.length-1);

var point = function(name, category, value, gId, angle, centerX, centerY, pathR){
    this.gId = gId;
    this.name = name;
    this.category = category;
    this.value = value;
    this.angle = angle;
    this.centerX = centerX;
    this.centerY = centerY;
    this.pathR = pathR;
    // this.textR = textR;
    // this.bigR = bigR;
    // this.smallR = smallR;
    this.flag = true;
    this.init();
}
point.prototype.init = function(){
    this.textR = this.pathR+30;
    this.bigR = this.pathR*0.7;
    this.smallR = this.pathR*0.45;
    this.textbR = this.bigR+30;
    this.textsR = this.smallR+30;
    // this.num = Number(this.id.substr(1));
    // this.x = this.centerX+this.pathR*getRadianByAngle((this.angle),'sin');
    // this.y = this.centerY-this.pathR*getRadianByAngle((this.angle),'cos');
    this.norx = this.centerX+this.pathR*getRadianByAngle((this.angle),'sin');
    this.nory = this.centerY-this.pathR*getRadianByAngle((this.angle),'cos');
    this.bigx = this.centerX+this.bigR*getRadianByAngle((this.angle),'sin');
    this.bigy = this.centerY-this.bigR*getRadianByAngle((this.angle),'cos');
    this.smallx = this.centerX+this.smallR*getRadianByAngle((this.angle),'sin');
    this.smally = this.centerY-this.smallR*getRadianByAngle((this.angle),'cos');
    this.textx = this.centerX+this.textR*getRadianByAngle((this.angle),'sin');
    this.texty = this.centerY-this.textR*getRadianByAngle((this.angle),'cos');
    this.textbx = this.centerX+this.textbR*getRadianByAngle((this.angle),'sin');
    this.textby = this.centerY-this.textbR*getRadianByAngle((this.angle),'cos');
    this.textsx = this.centerX+this.textsR*getRadianByAngle((this.angle),'sin');
    this.textsy = this.centerY-this.textsR*getRadianByAngle((this.angle),'cos');
    this.truecolor = colors[this.category];
}
point.prototype.cirMouseOver = function(){
    var that = this;
    this.circleDom.on("mouseover",function(){
        d3.select(this).transition().ease('elastic').attr("r",(that.value)*2.1).duration(500)
    })
}
point.prototype.cirMouseOut = function(){
    var that = this;
    this.circleDom.on('mouseout',function(){
        d3.select(this).transition().ease('elastic').attr("r",(that.value)*1.1).duration(500)
    })
}
point.prototype.cirMouseClick = function(){
    var that = this;
    this.circleDom.on('click',function(){
        if (that.flag == true ){
          for (var i=0;i<linksArr.length;i++){
            linksArr[i].target.reback();
            linksArr[i].source.reback();
            linksArr[i].color = linksArr[i].source.color;
            linksArr[i].show();
          }
          that.x = that.bigx;
          that.y = that.bigy;
          that.show();                 
          that.textDom.transition().ease('elastic').attr("x",that.textbx).attr("y",that.textby).duration(500)
          that.flag = false;
          for(var i=0;i<nodesArr.length;i++){
            if (nodesArr[i].name != that.name){
                nodesArr[i].flag = true;
            }
          }  
          for (var i=0;i<linksArr.length;i++){
            if (that.name == linksArr[i].source.name || that.name == linksArr[i].target.name){
                 
                if (that.name == linksArr[i].source.name){
                    linksArr[i].target.change();
                }
                if (that.name == linksArr[i].target.name){
                    linksArr[i].source.change();
                }  
            }else{
                linksArr[i].color = 'rgba(33,33,33,0.1)'
            }
                                 
          }
          for (var i=0;i<linksArr.length;i++){
            linksArr[i].show();
          }
        }else{
            console.info(that.flag)
            that.x = that.norx;
            that.y = that.nory;
            that.show();
            that.textDom.transition().ease('elastic').attr("x",that.textx).attr("y",that.texty).duration(500)
            that.flag = true; 
            console.info(linksArr.length)
            
            for (var i=0;i<linksArr.length;i++){
                linksArr[i].target.reback();
                linksArr[i].source.reback();
            }
            for (var i=0;i<linksArr.length;i++){
                 linksArr[i].color = linksArr[i].source.color;
                linksArr[i].show();
            }
        }                   
    })
}
point.prototype.change = function(){
    this.x = this.smallx;
    this.y = this.smally;
    this.color = this.truecolor;
    this.show();
    this.textDom.transition().ease('elastic').attr("x",this.textsx).attr("y",this.textsy).duration(500) 
}
point.prototype.reback = function(){
    this.x = this.norx;
    this.y = this.nory;
    this.color = this.truecolor;
    this.show();
    this.textDom.transition().ease('elastic').attr("x",this.textx).attr("y",this.texty).duration(500)
}
point.prototype.show = function(){
    this.circleDom.transition().ease('elastic').attr("cx",this.x).attr("cy",this.y).attr('fill',this.color)
}
point.prototype.display = function(){
    this.x = this.norx;
    this.y = this.nory;
    this.color = this.truecolor;
    this.circleDom = svg.selectAll('#'+this.gId).append('circle').attr("cx",this.x).attr("cy",this.y).attr("r",this.value).attr("fill",this.color).attr("stroke","none")
    this.textDom = svg.selectAll('#'+this.gId).append('text').text(this.name).attr('x',this.textx).attr('y',this.texty).attr('fill',this.fill).attr('font-size','5px')
    var that = this;
    this.textDom.attr('x',function(){
        if (d3.select(this).attr('x') < that.centerX){
            that.textx  -= this.offsetWidth;
            that.textbx -= this.offsetWidth;
            that.textsx -= this.offsetWidth;
            return d3.select(this).attr('x')-this.offsetWidth
        }else{
            return d3.select(this).attr('x')
        }
    }).attr('fill',this.fill)
    this.cirMouseOver();
    this.cirMouseOut();
    this.cirMouseClick();
}

var path = function(gId, source, target, weight, centerX, centerY){
    this.gId = gId;
    this.source = source;
    this.target = target;
    this.weight = weight;
    this.centerX = centerX;
    this.centerY = centerY;
}
path.prototype.show = function(){
    this.linkDom.transition().ease('elastic').attr("d",'M '+this.source.x+' '+this.source.y+' Q '+this.centerX+' '+this.centerY+' '+this.target.x+' '+this.target.y).attr("stroke",this.color)
}
path.prototype.display = function(){
    this.color = this.source.color;
    this.linkDom = svg.selectAll('#'+this.gId).append('path').attr("d",'M '+this.source.x+' '+this.source.y+' Q '+this.centerX+' '+this.centerY+' '+this.target.x+' '+this.target.y).attr("stroke",this.source.color).attr('opacity',this.weight/2).attr('fill','none')
}


var nodesArr = new Array();
var linksArr = new Array();
var bgMain = function(x, y, angle, pathR, data, circleR){
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.pathR = pathR;
    this.data = data;
    this.pathColor = 'black';
    this.pointColor = 'rgb(53, 74, 95)';
    this.textColor = '#000';
    this.circleR = circleR;
    this.init();
}
bgMain.prototype.init = function(){
    this.textR = this.pathR+30;

    this.pointOffset = [this.pathR*getRadianByAngle(this.angle*0.8,'sin'),this.pathR*getRadianByAngle(this.angle*0.8,'cos')];
    this.textOffset = [this.textR*getRadianByAngle(this.angle*0.8,'sin'),this.textR*getRadianByAngle(this.angle*0.8,'cos')];
    this.datas = [[[this.x+this.pointOffset[0],this.y-this.pointOffset[1]],[this.x+this.textOffset[0],this.y-this.textOffset[1]],this.data[0]],[[this.x-this.pointOffset[0],this.y-this.pointOffset[1]],[this.x-this.textOffset[0],this.y-this.textOffset[1]],this.data[1]]]
    this.pointArr = [];
    this.textArr = [];
}
bgMain.prototype.drawCircle = function(){
    this.circlePathStr = 'M '+(this.x+this.pointOffset[0])+' '+(this.y-this.pointOffset[1])+' A '+this.pathR+' '+this.pathR+' -30 1 1 '+(this.x-this.pointOffset[0])+' '+(this.y-this.pointOffset[1])
    console.info(this.circlePathStr)
    this.bgPath = svg.append("g").attr('id','main-path').append("path").attr("d",this.circlePathStr).attr("stroke",this.pathColor).attr("stroke-width", 1).attr("fill","none").attr("stroke-dasharray","2 2")
}
bgMain.prototype.drawPointText = function(){
    this.pointId = 'main-point';
    svg.append("g").attr('id',this.pointId);
    this.textId = 'main-text';
    svg.append("g").attr("id",this.textId);
    for (var i=0; i<this.datas.length; i++){
        var d = this.datas[i];
        var points = new bgPoint(this.pointId, d[0][0], d[0][1], this.circleR[i], this.pointColor)
        console.info(d[1][0], d[1][1])
        var texts = new bgText(this.textId, d[2], d[1][0], d[1][1], this.textColor, this.x)
        this.pointArr.push(points)
        this.textArr.push(texts)
    }
    for (var i=0; i<this.datas.length; i++){
        this.pointArr[i].display();
        this.textArr[i].display();
    }
}
bgMain.prototype.drawNodes = function(){
    this.nodesId = 'nodes';
    this.dataAngle = (360 - 2*this.angle)/(nodes.length-1);
    svg.append('g').attr('id',this.nodesId);
    for (var i=0; i<nodes.length; i++){
        var node = new point(nodes[i].name, nodes[i].category, nodes[i].value, this.nodesId, this.angle+this.dataAngle*(i), this.x, this.y, this.pathR)
        nodesArr.push(node)
    }
    for (var i=0;i<nodesArr.length;i++){
        nodesArr[i].display();
    }
}
bgMain.prototype.drawLinks = function(){
    this.linksId = 'links';
    svg.insert('g','#'+this.nodesId).attr('id',this.linksId);
    for (var i=0;i<links.length;i++){
        var link = new path(this.linksId, getNodesByName(links[i].source,nodesArr), getNodesByName(links[i].target,nodesArr), links[i].weight, this.x, this.y)  
        linksArr.push(link)
    }
    for (var i=0;i<linksArr.length;i++){
        linksArr[i].display();
    }
}
bgMain.prototype.display = function(){
    this.drawCircle();
    this.drawPointText();               
    this.drawNodes();
    this.drawLinks();   
}
