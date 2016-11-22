(function(window, undefined) {

	/**tool-start**/
	function extend(orginObj, obj) {
		for (var i in orginObj) {
			orginObj[i] = obj[i] + '' !== 'undefined' ? obj[i] : orginObj[i];
		}
	}

	function each(obj, fun) {
		for (var j = 0; j < obj.length; j++) {
			fun(obj[j]);
		}
	}
	/**tool-end**/

	function Swiper(el, op) {
		//el是 querySelector
		this.config = {
				autoPlay: true,
				delay: 2000,
				start: 0,
				align: 'h', //or v
				isNav: true,
				navColor: '#ffffff',
				navActiveColor: 'red',
				changeEvent: function(index, swpier) {}
			}
			/**合并参数**/
		extend(this.config, op || {});

		this.currentDirect = 'left';
		this.autoPlayTimer = null;
		this.moveTimer = null;
		this.navs = null;

		this.element = document.querySelector(el);
		this.swiperContent = document.querySelector(el).children[0];
		this.swiperChild = this.swiperContent.children;

		this.element.style = 'position: relative;width: 100%;overflow: hidden;';
		this.swiperContent.style = 'overflow: hidden;';

		var _this = this;

		if (this.config.isNav) {
			this.singleWidth = window.getComputedStyle(this.element)['width'].match(/(\d+)/)[0];

		} else {
			this.singleWidth = window.getComputedStyle(this.element)['height'].match(/(\d+)/)[0];
		}
		each(this.swiperChild, function(el) {
			if (_this.config.align == 'h') {
				el.style = 'float: left;';
			} else {
				el.style = 'display:block;';
			}
		})
		this.length = this.swiperChild.length;
		this.allWidth = this.singleWidth * this.length;



		/**导航**/
		(function() {
			if (_this.config.isNav && _this.length > 0) {
				_this.navs = document.createElement('div');
				_this.navs.style = 'pointer-events: none;text-align: center;position: absolute;width:100%;bottom:5px;';
				var spans = '';
				for (var i = 0; i < _this.length; i++) {
					spans += '<span style="border-radius: 50%;display: inline-block;width: 10px;height: 10px;background-color: #' + _this.config.navColor + ';margin-left:2px;margin-right:2px"></span>';
				}
				_this.navs.innerHTML = spans;
				_this.element.appendChild(_this.navs);
			}
		})()

		each(this.swiperChild, function(child) {
			if (_this.config.align == 'h') {
				child.style.width = _this.singleWidth + 'px';
			} else {
				child.style.height = _this.singleWidth + 'px';
			}
		})
		if (this.config.align == 'h') {
			this.swiperContent.style.width = this.allWidth + 'px';
		}

		/**初始化位置**/
		(function() {
			_this.setX(-_this.config.start * _this.singleWidth);
			_this.navSelect(_this.config.start);
		})()

		var x = 0,
			y = 0; //记录开始滑动的位置


		/**绑定事件**/
		this.swiperContent.addEventListener('touchmove', function(e) {

			var dir = '';
			if (_this.config.align == 'h') {
				dir = _this.direction(_this.x, e.targetTouches[0].pageX);
			}else{
				dir = _this.direction(_this.y, e.targetTouches[0].pageY);
			}
			_this.currentDirect = dir;
			switch (dir) {
				case 'left':
					_this.moveX(-Math.abs(e.targetTouches[0].pageX - _this.x));
					break;
				case 'right':
					_this.moveX(Math.abs(e.targetTouches[0].pageX - _this.x));
					break;
				case 'up':
					_this.moveX(-Math.abs(e.targetTouches[0].pageY - _this.y));
					break;
				case 'down':
					_this.moveX(Math.abs(e.targetTouches[0].pageY - _this.y));
					break;

			}
			_this.x = e.targetTouches[0].pageX;
			_this.y = e.targetTouches[0].pageY;
		})

		this.swiperContent.addEventListener('touchstart', function(e) {

			_this.autoPlayTimer && clearInterval(_this.autoPlayTimer);
			_this.moveTimer && clearInterval(_this.moveTimer);

			_this.x = e.targetTouches[0].pageX;
			_this.y = e.targetTouches[0].pageY;

		})

		this.swiperContent.addEventListener('touchend', function(e) {

			_this.x = 0;
			_this.y = 0;

			var index = _this.getIndex();
			if (_this.currentDirect == 'left' || _this.currentDirect == 'up') {
				index = index + 1 < _this.length ? index + 1 : _this.length - 1;
			}
			_this.toMoveIndex(index);

			if (_this.config.autoPlay) {
				// setTimeout(function() {
				_this.autoPlay();
				// }, 1000)
			}
		})

		if (this.config.autoPlay) {
			this.autoPlay();
		}
	}
	Swiper.prototype = {
		/**自动播放**/
		autoPlay: function() {
			var _this = this;
			var index = this.getIndex();

			var flag = 2; //标记两个方向的滚动 1 index增加  2 index减少
			if (index + 1 < _this.length) {
				flag = 1;
			}

			_this.autoPlayTimer && clearInterval(_this.autoPlayTimer);

			this.autoPlayTimer = setInterval(function() {

				if (flag == 1 && index + 1 < _this.length) {
					index++;
				} else if (flag == 2 && index > 0) {
					index--;
				} else if (flag == 1 && index + 1 == _this.length) {
					flag = 2;
					index--;
				} else if (flag == 2 && index == 0) {
					flag = 1;
					index++;
				}

				_this.toMoveIndex(index);

			}, _this.config.delay)
		},
		/**判断方向**/
		direction: function(x1, x2) {
			if (this.config.align == 'h') {
				return x2 > x1 ? 'right' : 'left';
			} else {
				return x2 > x1 ? 'down' : 'up';
			}
		},
		/**缓缓移动**/
		toMoveX: function(x) {
			var i = 1;
			var currentX = this.getCurrentX();
			var value = currentX - x;
			//label 用于判断方向
			var label = '+';

			if (value > 0) {
				label = '-';
			}
			var step = parseInt(label + this.singleWidth / 20);
			var _this = this;
			this.moveTimer && clearInterval(this.moveTimer);
			this.moveTimer = setInterval(function() {

				value = value + step;

				_this.moveX(step);

				if (label == '-' && value <= 0) {
					_this.setX(x);
					clearInterval(_this.moveTimer);

				} else if (label == '+' && value >= 0) {
					_this.setX(x);
					clearInterval(_this.moveTimer);

				}

				i += 5;

			}, 20 + i);
		},
		/**实际的设置移动距离**/
		setX: function(tempx) {
			if (this.config.align == 'h') {
				this.swiperContent.style.transform = 'translateX(' + tempx + 'px)';
			} else {
				this.swiperContent.style.transform = 'translateY(' + tempx + 'px)';
			}
		},

		/**通过将移动的index算出位移量**/
		moveX: function(step) {

			var currentX = this.getCurrentX();

			var tempx = parseInt(currentX) + parseInt(step);

			if (tempx >= 0) {
				tempx = 0;
			}
			if (-tempx >= this.allWidth - this.singleWidth) {
				tempx = -(this.allWidth - this.singleWidth);
			}
			this.setX(tempx);
		},
		/**获得当前位移**/
		getCurrentX: function() {
			return parseInt(this.swiperContent.style.transform ? this.swiperContent.style.transform.match(/-*\d+/)[0] : 0);
		},
		/**移动到相应的index**/
		toMoveIndex: function(index) {

			var toX = -(index * this.singleWidth);

			this.toMoveX(toX);
			this.config.changeEvent(index, this);
			this.navSelect(index);
		},
		navSelect: function(index) {
			if (this.config.isNav) {
				var spans = this.navs.children;
				for (var i = 0; i < spans.length; i++) {
					if (index == i) {
						spans[i].style.backgroundColor = this.config.navActiveColor;
					} else {
						spans[i].style.backgroundColor = this.config.navColor;
					}
				}
			}
		},
		/**获得目前的index**/
		getIndex: function() {
			var currentX = this.getCurrentX();

			var step = 0;
			if (!currentX) {
				return step;
			}

			step = parseInt(Math.abs(currentX) / this.singleWidth);

			return step;

		}
	}

	/**兼容amd**/
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return Swiper;
		})
	} else {
		window.Swiper = Swiper;
	}

})(window)