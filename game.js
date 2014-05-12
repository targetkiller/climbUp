/*
 * @author:tqtan;
 * @date:14/5/12;
 * @content:游戏逻辑代码;
*/
window.RAF =
   (function () {
      return window.requestAnimationFrame   ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame    ||
         window.oRequestAnimationFrame      ||
         window.msRequestAnimationFrame     ||

         function (callback, element) {
            var start,
                finish;

            window.setTimeout( function () {
               start = +new Date();
               callback(start);
               finish = +new Date();

               self.timeout = 1000 / 60 - (finish - start);

            }, self.timeout);
         };
      }
   )
();


// 键盘控制响应.......................................................
window.onkeydown = function (e) {
   var key = e.keyCode;

   if (key === 80) {  // 'p'
      // 暂停
   }

   if (key === 37) { // left arrow
      climbUp.roleX = climbUp.toRight;
   }

   else if (key === 39) { // right arrow
      climbUp.roleX = climbUp.toLeft;
   }
};

// 鼠标或触摸响应.......................................................
document.addEventListener('touchstart',function(ev){
	if(ev.touches[0].pageX>climbUp.Bwidth/2){
      climbUp.roleX = climbUp.toLeft;
	}
	else{  
      climbUp.roleX = climbUp.toRight;
	}
},false);	

var ClimbUp = function(){
	// init ---------------------------
	this.canvas = document.getElementById('game'),
	this.ctx = this.canvas.getContext('2d'),
	this.Bwidth = this.canvas.clientWidth,
	this.Bheight = this.canvas.clientHeight,
	this.canvas.width = this.Bwidth,
	this.canvas.height = this.Bheight,

	// setting ------------------------
	this.treeWidth = 40,
	this.treeHeight = this.Bheight,
	this.treeColor = "#770000",

	this.branchWidth = 150,
	this.branchHeight = 30,
	this.branchColor = "#770000",
	this.branchs = [],
	this.branchsVelocity = 15,

	this.roleWidth = 40,
	this.roleHeight = 40,
	this.roleColor = "#007700",
	this.toLeft = (this.Bwidth-this.treeWidth)/2-this.roleWidth,
	this.toRight = (this.Bwidth+this.treeWidth)/2,
	this.roleX = this.toLeft;
	this.roleY = this.Bheight-50;

	// control ------------------------
	this.branchsInit = {
		execute:function(){
			for(var i = 0; i < 1; i++){
				this.branchInit();
			}
		},
		branchInit:function(){
			var _x = Math.floor(Math.random()*2)==1?
			((climbUp.Bwidth-climbUp.treeWidth)/2-climbUp.branchWidth+1):
			((climbUp.Bwidth+climbUp.treeWidth)/2-1);
			var _y = -(Math.floor(Math.random()*(climbUp.Bheight))+climbUp.branchHeight*2);
			climbUp.branchs.push({x:_x,y:_y});
		}
	}
};

// prototype extend
ClimbUp.prototype = {
	start:function(){
		// init
		this.branchs=[];
		this.branchsInit.execute();
		RAF(function(){climbUp.animate();});
	},
	animate:function(){
		this.ctx.clearRect(0,0,this.Bwidth,this.Bheight);
		this.drawAll();
		RAF(function(){climbUp.animate();});
	},
	drawAll:function(){
		this.drawTree();
		this.drawBranch();
		this.drawRole();
		if(this.isCollide()){
			// 发生碰撞
			document.getElementById('gameover').style.display="block";
			this.branchs = [];
		}
	},
	drawTree:function(){
		this.ctx.save();
		this.ctx.fillStyle = this.treeColor;
		this.ctx.fillRect((this.Bwidth-this.treeWidth)/2,0,this.treeWidth,this.treeHeight);
		this.ctx.restore();
	},
	drawBranch:function(){
		this.ctx.save();
		this.ctx.fillStyle = this.branchColor;
		for(var i = 0; i < this.branchs.length; i++){
			// 枝叶的y值每次减去相应距离
			this.branchs[i].y += this.branchsVelocity;
			this.ctx.fillRect(this.branchs[i].x,this.branchs[i].y,this.branchWidth,this.branchHeight);
			// 枝叶超出高度新建枝叶
			if(this.branchs[i].y>this.Bheight){
				this.branchs=[];
				this.branchsInit.execute();
			}
		}
		this.ctx.restore();
	},
	drawRole:function(){
		this.ctx.save();
		this.ctx.fillStyle = this.roleColor;
		this.ctx.fillRect(this.roleX,this.roleY,this.roleWidth,this.roleHeight);
		this.ctx.restore();
	},
	// 碰撞检测
	isCollide:function(){
		var top = this.roleY;
		var left = this.roleX;
		var right = this.roleWidth + left;
		var bottom = this.roleHeight + top;
		var centerX = left+(this.roleWidth/2);
		var centerY = top+(this.roleHeight/2);
		var branchTop = 0;
		var branchLeft = 0;
		var branchWidth = 0;
		var branchHeight = 0;
		for(var i = 0; i < this.branchs.length; i++){
			branchTop = this.branchs[i].y;
			branchLeft = this.branchs[i].x;
			branchWidth = this.branchWidth;
			branchHeight = this.branchHeight;
		}
		this.ctx.beginPath();
        this.ctx.rect(branchLeft, branchTop, branchWidth, branchHeight);
        return  this.ctx.isPointInPath(left,    top)     ||
                this.ctx.isPointInPath(right,   top)     ||
                this.ctx.isPointInPath(centerX, centerY) ||
                this.ctx.isPointInPath(left,    bottom)  ||
                this.ctx.isPointInPath(right,   bottom);
	}
}

var climbUp = new ClimbUp();
climbUp.start();
