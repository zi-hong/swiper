(function(window, undefine) {

	/**tool-start**/
	function extend(orginObj, obj) {
		for (var i in orginObj) {
			orginObj[i] = obj[i] || orginObj[i];
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
			changeEvent: function(index,swpier) {}
		}
		/**合并参数**/
		extend(this.config,op);
		
		var currentDirect = 'left',
			autoPlayTimer = null,
			moveTimer = null;
		
		this.element = document.querySelector(el);
		swiperContent = document.querySelector(el + ' .swiper-content');
		swiperChild = document.querySelector(el + ' .swiper-content').children;
		singleWidth = window.getComputedStyle(this.element)['width'].match(/(\d+)/)[0];
		this.length = swiperChild.length;
		allWidth = singleWidth * this.length;

		_this = this;

		each(swiperChild, function(child) {
			child.style.width = singleWidth + 'px';
		})

		swiperContent.style.width = allWidth + 'px';


		var x = 0; //记录开始滑动的位置

		swiperContent.addEventListener('touchmove', function(e) {

			var dir = direction(x, e.targetTouches[0].pageX);
			currentDirect = dir;
			switch (dir) {
				case 'left':
					moveX(-Math.abs(e.targetTouches[0].pageX - x));
					break;
				case 'right':
					moveX(Math.abs(e.targetTouches[0].pageX - x));
					break;
			}
			x = e.targetTouches[0].pageX;
		})

		swiperContent.addEventListener('touchstart', function(e) {

			autoPlayTimer && clearInterval(autoPlayTimer);
			moveTimer && clearInterval(moveTimer);

			x = e.targetTouches[0].pageX;

		})

		swiperContent.addEventListener('touchend', function(e) {

			x = 0;

			var index = getIndex();
			if (currentDirect == 'left') {
				index = index + 1 < _this.length ? index + 1 : _this.length - 1;
			}
			toMoveIndex(index);

			if (_this.config.autoPlay) {
				// setTimeout(function() {
				autoPlay();
				// }, 1000)
			}
		})

		/**缓缓移动**/
		function toMoveX(x) {
			var i = 1;
			var currentX = getCurrentX();
			var value = currentX - x;
			//label 用于判断方向
			var label = '+';

			if (value > 0) {
				label = '-';
			}
			var step = parseInt(label + 20);

			moveTimer && clearInterval(moveTimer);
			moveTimer = setInterval(function() {

				value = value + step;

				moveX(step);

				if (label == '-' && value <= 0) {
					setX(x);
					clearInterval(moveTimer);

				} else if (label == '+' && value >= 0) {
					setX(x);
					clearInterval(moveTimer);

				}

				i += 5;

			}, 20 + i);
		}

		/**移动到相应的index**/
		function toMoveIndex(index) {

			var toX = -(index * singleWidth);

			toMoveX(toX);
			_this.config.changeEvent(index,this);
		}

		/**获得目前的index**/
		function getIndex() {
			var currentX = getCurrentX();

			var step = 0;
			if (!currentX) {
				return step;
			}

			step = parseInt(Math.abs(currentX) / singleWidth);

			return step;

		}

		/**获得当前位移**/
		function getCurrentX() {
			return parseInt(swiperContent.style.transform ? swiperContent.style.transform.match(/-*\d+/)[0] : 0);
		}

		/**实际的设置移动距离**/
		function setX(tempx) {
			swiperContent.style.transform = 'translateX(' + tempx + 'px)';
		}

		/**通过将移动的index算出位移量**/
		function moveX(step) {

			var currentX = getCurrentX();

			var tempx = parseInt(currentX) + parseInt(step);

			if (tempx >= 0) {
				tempx = 0;
			}
			if (-tempx >= allWidth - singleWidth) {
				tempx = -(allWidth - singleWidth);
			}
			setX(tempx);
		}

		/**判断方向**/
		function direction(x1, x2) {
			return x2 > x1 ? 'right' : 'left';
		}

		/**自动播放**/
		function autoPlay() {
			var index = getIndex();

			var flag = 2; //标记两个方向的滚动 1 index增加  2 index减少
			if (index + 1 < _this.length) {
				flag = 1;
			}

			autoPlayTimer && clearInterval(autoPlayTimer);

			autoPlayTimer = setInterval(function() {

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

				toMoveIndex(index);

			}, _this.config.delay)
		}

		if (_this.config.autoPlay) {
			autoPlay();
		}
	}

	window.Swiper = Swiper;

})(window)