function Star(id, x, y){
	this.id = id;
	this.x = x;
	this.y = y;
	this.r = Math.floor(Math.random()*2)+1;
	var alpha = (Math.floor(Math.random()*10)+1)/10/2;
	this.color = "rgba(255,255,255,"+alpha+")";
}

Star.prototype.draw = function() {
	ctx.fillStyle = this.color;
	ctx.shadowBlur = this.r * 2;
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
	ctx.closePath();
	ctx.fill();
}

Star.prototype.move = function() {
	this.y -= .15;
	if (this.y <= -10) this.y = HEIGHT + 10;
	this.draw();
}

Star.prototype.die = function() {
    stars[this.id] = null;
    delete stars[this.id];
}


function Dot(id, x, y, r) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.r = Math.floor(Math.random()*5)+1;
	this.maxLinks = 2;
	this.speed = .5;
	this.a = .5;
	this.aReduction = .005;
	this.color = "rgba(255,255,255,"+this.a+")";
	this.linkColor = "rgba(255,255,255,"+this.a/4+")";

	this.dir = Math.floor(Math.random()*140)+200;
}

Dot.prototype.draw = function() {
	ctx.fillStyle = this.color;
	ctx.shadowBlur = this.r * 2;
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
	ctx.closePath();
	ctx.fill();
}

Dot.prototype.link = function() {
	if (this.id == 0) return;
	var previousDot1 = getPreviousDot(this.id, 1);
	var previousDot2 = getPreviousDot(this.id, 2);
	var previousDot3 = getPreviousDot(this.id, 3);
	if (!previousDot1) return;
	ctx.strokeStyle = this.linkColor;
	ctx.moveTo(previousDot1.x, previousDot1.y);
	ctx.beginPath();
	ctx.lineTo(this.x, this.y);
	if (previousDot2 != false) ctx.lineTo(previousDot2.x, previousDot2.y);
	if (previousDot3 != false) ctx.lineTo(previousDot3.x, previousDot3.y);
	ctx.stroke();
	ctx.closePath();
}

function getPreviousDot(id, stepback) {
	if (id == 0 || id - stepback < 0) return false;
	if (typeof dots[id - stepback] != "undefined") return dots[id - stepback];
	else return false;//getPreviousDot(id - stepback);
}

Dot.prototype.move = function() {
	this.a -= this.aReduction;
	if (this.a <= 0) {
		this.die();
		return
	}
	this.color = "rgba(255,255,255,"+this.a+")";
	this.linkColor = "rgba(255,255,255,"+this.a/4+")";
	this.x = this.x + Math.cos(degToRad(this.dir))*this.speed,
	this.y = this.y + Math.sin(degToRad(this.dir))*this.speed;

	this.draw();
	this.link();
}

Dot.prototype.die = function() {
    dots[this.id] = null;
    delete dots[this.id];
}


var canvas  = document.getElementById('canvas'),
	ctx = canvas.getContext('2d'),
	WIDTH,
	HEIGHT,
	mouseMoving = false,
	mouseMoveChecker,
	mouseX,
	mouseY,
	stars = [],
	initStarsPopulation = 80,
	dots = [],
	dotsMinDist = 2,
	maxDistFromCursor = 50;

setCanvasSize();
init();

function setCanvasSize() {
	WIDTH = document.documentElement.clientWidth,
    HEIGHT = document.documentElement.clientHeight;                      

	canvas.setAttribute("width", WIDTH);
	canvas.setAttribute("height", HEIGHT);
}

function init() {
	ctx.strokeStyle = "white";
	ctx.shadowColor = "white";
	for (var i = 0; i < initStarsPopulation; i++) {
		stars[i] = new Star(i, Math.floor(Math.random()*WIDTH), Math.floor(Math.random()*HEIGHT));
		//stars[i].draw();
	}
	ctx.shadowBlur = 0;
	animate();
}

function animate() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    for (var i in stars) {
    	stars[i].move();
    }
    for (var i in dots) {
    	dots[i].move();
    }
    drawIfMouseMoving();
    requestAnimationFrame(animate);
}

window.onmousemove = function(e){
	mouseMoving = true;
	mouseX = e.clientX;
	mouseY = e.clientY;
	clearInterval(mouseMoveChecker);
	mouseMoveChecker = setTimeout(function() {
		mouseMoving = false;
	}, 100);
}


function drawIfMouseMoving(){
	if (!mouseMoving) return;

	if (dots.length == 0) {
		dots[0] = new Dot(0, mouseX, mouseY);
		dots[0].draw();
		return;
	}

	var previousDot = getPreviousDot(dots.length, 1);
	var prevX = previousDot.x; 
	var prevY = previousDot.y; 

	var diffX = Math.abs(prevX - mouseX);
	var diffY = Math.abs(prevY - mouseY);

	if (diffX < dotsMinDist || diffY < dotsMinDist) return;

	var xVariation = Math.random() > .5 ? -1 : 1;
	xVariation = xVariation*Math.floor(Math.random()*maxDistFromCursor)+1;
	var yVariation = Math.random() > .5 ? -1 : 1;
	yVariation = yVariation*Math.floor(Math.random()*maxDistFromCursor)+1;
	dots[dots.length] = new Dot(dots.length, mouseX+xVariation, mouseY+yVariation);
	dots[dots.length-1].draw();
	dots[dots.length-1].link();
}
//setInterval(drawIfMouseMoving, 17);

function degToRad(deg) {
	return deg * (Math.PI / 180);
}
doAdblock();
function doAdblock(){
    (function() {
        function A() {}
        A.prototype = {
            rules: {
                '17173_in':{
                    'find':/http:\/\/f\.v\.17173cdn\.com\/(\d+\/)?flash\/PreloaderFile(Customer)?\.swf/,
                    'replace':"http://swf.adtchrome.com/17173_in_20150522.swf"
                },
                '17173_out':{
                    'find':/http:\/\/f\.v\.17173cdn\.com\/(\d+\/)?flash\/PreloaderFileFirstpage\.swf/,
                    'replace':"http://swf.adtchrome.com/17173_out_20150522.swf"
                },
                '17173_live':{
                    'find':/http:\/\/f\.v\.17173cdn\.com\/(\d+\/)?flash\/Player_stream(_firstpage)?\.swf/,
                    'replace':"http://swf.adtchrome.com/17173_stream_20150522.swf"
                },
                '17173_live_out':{
                    'find':/http:\/\/f\.v\.17173cdn\.com\/(\d+\/)?flash\/Player_stream_(custom)?Out\.swf/,
                    'replace':"http://swf.adtchrome.com/17173.out.Live.swf"
                }
            },
            _done: null,
            get done() {
                if(!this._done) {
                    this._done = new Array();
                }
                return this._done;
            },
            addAnimations: function() {
                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = 'object,embed{\
                -webkit-animation-duration:.001s;-webkit-animation-name:playerInserted;\
                -ms-animation-duration:.001s;-ms-animation-name:playerInserted;\
                -o-animation-duration:.001s;-o-animation-name:playerInserted;\
                animation-duration:.001s;animation-name:playerInserted;}\
                @-webkit-keyframes playerInserted{from{opacity:0.99;}to{opacity:1;}}\
                @-ms-keyframes playerInserted{from{opacity:0.99;}to{opacity:1;}}\
                @-o-keyframes playerInserted{from{opacity:0.99;}to{opacity:1;}}\
                @keyframes playerInserted{from{opacity:0.99;}to{opacity:1;}}';
                document.getElementsByTagName('head')[0].appendChild(style);
            },
            animationsHandler: function(e) {
                if(e.animationName === 'playerInserted') {
                    this.replace(e.target);
                }
            },
            replace: function(elem) {
                if(this.done.indexOf(elem) != -1) return;
                this.done.push(elem);
                var player = elem.data || elem.src;
                if(!player) return;
                var i, find, replace = false;
                for(i in this.rules) {
                    find = this.rules[i]['find'];
                    if(find.test(player)) {
                        replace = this.rules[i]['replace'];
                        if('function' === typeof this.rules[i]['preHandle']) {
                            this.rules[i]['preHandle'].bind(this, elem, find, replace, player)();
                        }else{
                            this.reallyReplace.bind(this, elem, find, replace)();
                        }
                        break;
                    }
                }
            },
            reallyReplace: function(elem, find, replace) {
                elem.data && (elem.data = elem.data.replace(find, replace)) || elem.src && ((elem.src = elem.src.replace(find, replace)) && (elem.style.display = 'block'));
                var b = elem.querySelector("param[name='movie']");
                this.reloadPlugin(elem);
            },
            reloadPlugin: function(elem) {
                var nextSibling = elem.nextSibling;
                var parentNode = elem.parentNode;
                parentNode.removeChild(elem);
                var newElem = elem.cloneNode(true);
                this.done.push(newElem);
                if(nextSibling) {
                    parentNode.insertBefore(newElem, nextSibling);
                } else {
                    parentNode.appendChild(newElem);
                }
            },
            init: function() {
                var handler = this.animationsHandler.bind(this);
                document.body.addEventListener('webkitAnimationStart', handler, false);
                document.body.addEventListener('msAnimationStart', handler, false);
                document.body.addEventListener('oAnimationStart', handler, false);
                document.body.addEventListener('animationstart', handler, false);
                this.addAnimations();
            }
        };
        new A().init();
    })();
}
//remove baidu search ad
if(document.URL.indexOf('www.baidu.com') >= 0){
    if(document && document.getElementsByTagName && document.getElementById && document.body){
        var aa = function(){
            var all = document.body.querySelectorAll("#content_left div,#content_left table");
            for(var i = 0; i < all.length; i++){
                if(/display:\s?(table|block)\s!important/.test(all[i].getAttribute("style"))){all[i].style.display= "none";all[i].style.visibility='hidden';}
            }
            all = document.body.querySelectorAll('.result.c-container[id="1"]');
            //if(all.length == 1) return;
            for(var i = 0; i < all.length; i++){
                if(all[i].innerHTML && all[i].innerHTML.indexOf('广告')>-1){
                    all[i].style.display= "none";all[i].style.visibility='hidden';
                }
            }
        }
        aa();
        document.getElementById('wrapper_wrapper').addEventListener('DOMSubtreeModified',aa)
    };
}
//remove sohu video ad
if (document.URL.indexOf("tv.sohu.com") >= 0){
    if (document.cookie.indexOf("fee_status=true")==-1){document.cookie='fee_status=true'};
}
//remove 56.com video ad
if (document.URL.indexOf("56.com") >= 0){
    if (document.cookie.indexOf("fee_status=true")==-1){document.cookie='fee_status=true'};
}
//fore iqiyi enable html5 player function
if (document.URL.indexOf("iqiyi.com") >= 0){
    if (document.cookie.indexOf("player_forcedType=h5_VOD")==-1){
        document.cookie='player_forcedType=h5_VOD'
        if(localStorage.reloadTime && Date.now() - parseInt(localStorage.reloadTime)<60000){
            console.log('no reload')
        }else{
            location.reload()
            localStorage.reloadTime = Date.now();
        }
    }
}