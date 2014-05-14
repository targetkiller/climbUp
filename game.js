/*
 * @author:tqtan;
 * @site:http://targetkiller.net;
 * @date:14/5/12;
 * @content:游戏逻辑代码;
*/
// window.RAF =
//    (function () {
//       return window.requestAnimationFrame   ||
//          window.webkitRequestAnimationFrame ||
//          window.mozRequestAnimationFrame    ||
//          window.oRequestAnimationFrame      ||
//          window.msRequestAnimationFrame     ||

//          function (callback, element) {
//             var start,
//                 finish;

//             window.setTimeout( function () {
//                start = +new Date();
//                callback(start);
//                finish = +new Date();

//                self.timeout = 1000 / 60 - (finish - start);

//             }, self.timeout);
//          };
//       }
//    )
// ();

function shareFriend() {
    WeixinJSBridge.invoke('sendAppMessage',{
        "appid": climbUp.appid,
        "img_url": climbUp.imgUrl,
        "img_width": "200",
        "img_height": "200",
        "link": climbUp.lineLink,
        "desc": climbUp.descContent,
        "title": climbUp.shareTitle
    }, function(res) {
        //_report('send_msg', res.err_msg);
    })
}
function shareTimeline() {
    WeixinJSBridge.invoke('shareTimeline',{
        "img_url": climbUp.imgUrl,
        "img_width": "200",
        "img_height": "200",
        "link": climbUp.lineLink,
        "desc": climbUp.descContent,
        "title": climbUp.shareTitle
    }, function(res) {
           //_report('timeline', res.err_msg);
    });
}
function shareWeibo() {
    WeixinJSBridge.invoke('shareWeibo',{
        "content": climbUp.descContent,
        "url": climbUp.lineLink,
    }, function(res) {
        //_report('weibo', res.err_msg);
    });
}
// 当微信内置浏览器完成内部初始化后会触发WeixinJSBridgeReady事件。
document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
    // 发送给好友
    WeixinJSBridge.on('menu:share:appmessage', function(argv){
        shareFriend();
    });
    // 分享到朋友圈
    WeixinJSBridge.on('menu:share:timeline', function(argv){
        shareTimeline();
    });
    // 分享到微博
    WeixinJSBridge.on('menu:share:weibo', function(argv){
        shareWeibo();
    });
}, false);

// 键盘控制响应.......................................................
window.onkeydown = function (e) {
   var key = e.keyCode;
   if (key === 80) {  // 'p'
      // 暂停
   }
   if (key === 37) { // left arrow
      climbUp.roleX = climbUp.toLeft;
   }
   else if (key === 39) { // right arrow
      climbUp.roleX = climbUp.toRight;
   }
};

// window.onresize = function (e) {
//    location.reload();
// };

// 重力感应
function Orientation(selector) {
	          
}

Orientation.prototype.init = function(){
    window.addEventListener('deviceorientation', this.orientationListener, false);
}

Orientation.prototype.orientationListener = function(evt) {
  var gamma = evt.gamma
  var beta = evt.beta
  var alpha = evt.alpha

  if(climbUp.optWay==1&&climbUp.changeSideDir==0){
	if(gamma<0){
	  	climbUp.roleX = climbUp.toLeft;
	}
	else{
	  	climbUp.roleX = climbUp.toRight;
	}
  }
  else if(climbUp.optWay==1&&climbUp.changeSideDir==1){
  	if(gamma>0){
	  	climbUp.roleX = climbUp.toLeft;
	}
	else{
	  	climbUp.roleX = climbUp.toRight;
	}	
  }
}

// 开始游戏.......................................................
// 触摸
var shake = document.getElementById('shake');
shake.addEventListener('click',function(ev){
	document.getElementById('gametips').style.opacity="0";
	climbUp.optWay = 1;//摆动操作
	climbUp.start();
},false);

// 点击
var point = document.getElementById('point');
point.addEventListener('click',function(ev){
	document.getElementById('gametips').style.display="none";
	climbUp.optWay = 0;//点击操作
	climbUp.start();
},false);

// 重新开始游戏.......................................................
var restart = document.getElementById('restart');
restart.addEventListener('click',function(ev){
	climbUp.reset();
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
	this.branchsSpeed = 5,
	this.branchsVelocity = 0.005,
	this.branchsSpeedMax = 25,
	this.branchsNum = 1,

	this.roleWidth = 40,
	this.roleHeight = 40,
	this.roleColor = "#ffff00",
	this.toLeft = (this.Bwidth-this.treeWidth)/2-this.roleWidth,
	this.toRight = (this.Bwidth+this.treeWidth)/2,
	this.roleX = this.toLeft;
	this.roleY = this.Bheight-50;

	this.score = 0;
	this.scoreVelocity = 1;

	this.startTime = +new Date(),
	this.changeSideBaseTime = 5000,
	this.changeSideRanTime = 10000,
	this.changeSideTime = Math.floor(Math.random()*this.changeSideBaseTime)+this.changeSideRanTime,
	this.changeSideDir = 0;//0:正,1:反

	this.stopGame = false;
	// 操作方式 点击，摆动
	this.optWay = 0;//0点击，1摆动

	// 微信分享
	this.imgUrl = 'http://targetkiller.net/climbUp/icon.jpg';
	this.lineLink = 'http://targetkiller.net/climbUp/index.html';
	this.descContent = "爬楼梯的我根本就停不下来！";
	this.shareTitle = '一起来和我爬楼梯，我们比比分～';
	this.appid = '';

	// control ------------------------
	this.branchsInit = {
		execute:function(){
			for(var i = 0; i < climbUp.branchsNum; i++){
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
		// RAF(function(){climbUp.animate();});
		if(climbUp.optWay==0){
			// 鼠标或触摸响应.......................................................
			document.addEventListener('touchstart',function(ev){
				if(ev.touches[0].pageX<climbUp.Bwidth/2){
			      climbUp.roleX = climbUp.toLeft;
				}
				else{  
			      climbUp.roleX = climbUp.toRight;
				}
			},false);
		}
		climbUp.interval = setInterval(function(){climbUp.animate();},1000/60);
	},
	animate:function(){
		this.ctx.clearRect(0,0,this.Bwidth,this.Bheight);
		this.drawAll();
		// RAF(function(){climbUp.animate();});
	},
	reset:function(){
		this.branchsVelocity = 0.01;
		this.branchsSpeed = 5;
		this.score = 0;
		this.scoreVelocity = 1;
		this.branchs=[];
		this.branchsInit.execute();
		document.getElementById('gameover').style.display="none";
		document.getElementById('score').innerText=this.score;
		document.getElementById('funnyInfo').innerText="平地";
		this.stopGame = false;
	},
	drawAll:function(){
		this.drawTree();
		this.drawBranch();
		this.drawRole();
		if(this.isCollide()){
			// 发生碰撞
			document.getElementById('gameover').style.display="block";
			document.getElementById('finalScore').innerText=this.score;
			this.branchsVelocity = 0;
			this.branchsSpeed = 0;
			this.scoreVelocity = 0;
			this.branchs = [];
			this.stopGame = true;
			this.shareTitle = "我在爬楼梯游戏中登上了"+climbUp.showFunnyInfo(this.score)+", 得分"+this.score+"!来超越我吧～";
		}
		if(!this.stopGame){
			if(this.isNeedChangeSide()){
				// console.log("changesize!");
				this.changeSide();
			}
		}
		// 游戏加速
		if(this.branchsSpeed<this.branchsSpeedMax){
			this.branchsSpeed += this.branchsVelocity;
			// document.getElementById('speed').innerText=this.branchsSpeed;
		}
		//document.getElementById('speed').innerText=this.branchsSpeed.toFixed(2);
		
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
			this.branchs[i].y += this.branchsSpeed;
			this.ctx.fillRect(this.branchs[i].x,this.branchs[i].y,this.branchWidth,this.branchHeight);
			// 枝叶超出高度新建枝叶
			if(this.branchs[i].y>this.Bheight){
				// 游戏增分
				this.score += this.scoreVelocity;
				document.getElementById('score').innerText=this.score;
				this.showFunnyInfo(this.score);

				// climbUp.coinSound.play();
				document.getElementById('coin-sound').play();
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
	showFunnyInfo:function(score){
		var now = score;
		var result = "平地";
		if(now < 5){
			result = "小别墅";
		}
		else if(now < 10){
			result = "普通大厦";
		}
		else if(now < 20){
			result = "高级大厦";
		}
		else if(now < 30){
			result = "台北101";
		}
		else if(now < 40){
			result = "吉隆波双子塔";
		}
		else if(now < 50){
			result = "上海东方明珠";
		}
		else if(now < 60){
			result = "安纳普尔纳峰";
		}
		else if(now < 70){
			result = "南迦帕尔巴特峰";
		}
		else if(now < 80){
			result = "马纳斯鲁峰";
		}
		else if(now < 90){
			result = "道拉吉里峰";
		}
		else if(now < 100){
			result = "卓奥友峰";
		}
		else if(now < 110){
			result = "马卡鲁峰";
		}
		else if(now < 120){
			result = "洛子峰";
		}
		else if(now < 130){
			result = "干城章嘉峰";
		}
		else if(now < 140){
			result = "乔戈里峰";
		}
		else if(now < 150){
			result = "珠穆朗玛峰";
		}
		else if(now < 160){
			result = "云层";
		}
		else if(now < 170){
			result = "天堂";
		}
		else if(now < 180){
			result = "地球表面";
		}
		else{
			result = "外太空";
		}

		document.getElementById('funnyInfo').innerText=result;
		return result;
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
	},
	// 判断转向的发生时机
	isNeedChangeSide:function(){
		var now = +new Date();
		return (now-this.startTime)>this.changeSideTime;
	},
	// 操作转向
	changeSide:function(){
		var left,right;
		// 转向，0是正，1是反，默认是正
		if(this.changeSideDir==1){
			left = climbUp.toLeft;
			right = climbUp.toRight;
			document.getElementsByTagName('body')[0].style.backgroundColor = "#000";
			this.changeSideDir = 0;
		}
		else{
			left = climbUp.toRight;
			right = climbUp.toLeft;
			document.getElementsByTagName('body')[0].style.backgroundColor = "#aaa";
			this.changeSideDir = 1;
		}

		// 键盘控制响应.......................................................
		window.onkeydown = function (e) {
		   var key = e.keyCode;
		   if (key === 37) { // left arrow
		      climbUp.roleX = left;
		   }
		   else if (key === 39) { // right arrow
		      climbUp.roleX = right;
		   }
		};

		if(climbUp.optWay==0){
			// 鼠标或触摸响应.......................................................
			document.addEventListener('touchstart',function(ev){
				if(ev.touches[0].pageX<climbUp.Bwidth/2){
			      climbUp.roleX = left;
				}
				else{  
			      climbUp.roleX = right;
				}
			},false);
		}

		// 重新设置下一次转向时间
		this.startTime = +new Date();
		this.changeSideTime = Math.floor(Math.random()*this.changeSideBaseTime)+this.changeSideRanTime;
	}
}

var climbUp = new ClimbUp();
(new Orientation()).init();




