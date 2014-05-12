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

	// control ------------------------

	this.branchsInit = {
		execute:function(){
			for(var i = 0; i < 5; i++){
				this.branchInit();
			}
		},
		branchInit:function(){
			var _x = Math.floor(Math.random()*2)==1?
			((climbUp.Bwidth-climbUp.treeWidth)/2-climbUp.branchWidth+1):
			((climbUp.Bwidth+climbUp.treeWidth)/2-1);
			var _y = Math.floor(Math.random()*climbUp.Bheight);
			climbUp.branchs.push({x:_x,y:_y});
		}
	}
};

// prototype extend
ClimbUp.prototype = {
	start:function(){
		// init
		this.ctx.clearRect(0,0,this.Bwidth,this.Bheight);
		this.branchs=[];

		this.branchsInit.execute();
		this.drawAll();
		RAF(function(){climbUp.start();});
	},
	drawAll:function(){
		this.drawTree();
		this.drawBranch();
	},
	drawTree:function(){
		this.ctx.save();
		this.ctx.fillStyle = this.treeColor;
		this.ctx.strokeStyle = this.treeColor;
		this.ctx.fillRect((this.Bwidth-this.treeWidth)/2,0,this.treeWidth,this.treeHeight);
		this.ctx.restore();
	},
	drawBranch:function(){
		this.ctx.save();
		this.ctx.fillStyle = this.branchColor;
		this.ctx.strokeStyle = this.branchColor;
		for(var i = 0; i < this.branchs.length; i++){
			this.ctx.fillRect(this.branchs[i].x,this.branchs[i].y,this.branchWidth,this.branchHeight);
		}
		this.ctx.restore();
	}
}

var climbUp = new ClimbUp();
RAF(function(){climbUp.start();});