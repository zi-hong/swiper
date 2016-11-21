(function(window, undefine) {

	function extend(orginObj, obj) {
		for (var i in orginObj) {
			orginObj[i] = obj[i] || orginObj[i];
		}
	}

	function Swiper(el, op) {
		this.config = {
			autoPlay: true,
			delay: 2000,
			changeEvent: function() {}
		}

		this.width = el.width();
		this.length = el.find('.list').length;
		this.allWidth = this.width * this.length;
		this.currentDirect = 'left';
		this.autoPlayTimer = null;
		this.moveTimer = null;

		_this = this;

		el.find('.list').css('width', this.width + 'px');

		el.find('.swiper-content').width(this.allWidth + 'px');

		var x = 0;//记录开始滑动的位置

		el.find('.swiper-content')[0].addEventListener('touchmove', function(e) {

			var dir = direction(x, e.targetTouches[0].pageX);
			_this.currentDirect = dir;
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

		el.find('.swiper-content')[0].addEventListener('touchstart', function(e) {

			_this.autoPlayTimer && clearInterval(_this.autoPlayTimer);
			_this.moveTimer && clearInterval(_this.moveTimer);

			x = e.targetTouches[0].pageX;

		})

		el.find('.swiper-content')[0].addEventListener('touchend', function(e) {

			x = 0;

			var index = getIndex();
			if (_this.currentDirect == 'left') {
				index = index + 1 < _this.length ? index + 1 : _this.length - 1;
			}
			toMoveIndex(index);

			if (_this.config.autoPlay) {
				// setTimeout(function() {
					autoPlay();
				// }, 1000)
			}
		})

		function toMoveX(x) {
			var i = 1;
			var currentX = getCurrentX();
			var value = currentX - x;
			var label = '+';

			if (value > 0) {
				label = '-';
			}
			var step = parseInt(label + 20);

			_this.moveTimer && clearInterval(_this.moveTimer);
			_this.moveTimer = setInterval(function() {

				value = value + step;

				moveX(step);

				if (label == '-' && value <= 0) {
					setX(x);
					clearInterval(_this.moveTimer);

				} else if (label == '+' && value >= 0) {
					setX(x);
					clearInterval(_this.moveTimer);

				}

				i += 5;

			}, 20 + i);
		}

		function toMoveIndex(index) {

			var toX = -(index * _this.width);

			toMoveX(toX);
		}

		function getIndex() {
			var currentX = getCurrentX();

			var step = 0;
			if (!currentX) {
				return step;
			}

			step = parseInt(Math.abs(currentX) / _this.width);

			return step;

		}

		function getCurrentX() {
			return parseInt(el.find('.swiper-content').css('transform') + '' != 'none' ? el.find('.swiper-content').css('transform').match(/-*\d+/)[0] : 0);
		}

		function setX(tempx) {
			el.find('.swiper-content').css('transform', 'translateX(' + tempx + 'px)');
		}

		function moveX(step) {

			var currentX = getCurrentX();

			var tempx = parseInt(currentX) + parseInt(step);

			if (tempx >= 0) {
				tempx = 0;
			}
			if (-tempx >= _this.allWidth - _this.width) {
				tempx = -(_this.allWidth - _this.width);
			}
			setX(tempx);
		}

		function direction(x1, x2) {
			return x2 > x1 ? 'right' : 'left';
		}

		function autoPlay() {
			var index = getIndex();

			var flag = 2; //标记两个方向的滚动 1 index增加  2 index减少
			if (index + 1 < _this.length) {
				flag = 1;
			}

			_this.autoPlayTimer && clearInterval(_this.autoPlayTimer);

			_this.autoPlayTimer = setInterval(function() {

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
				var x = -(_this.width * index);
				toMoveX(x);

			}, _this.config.delay)
		}

		if (_this.config.autoPlay) {
			autoPlay();
		}
	}

	window.Swiper = Swiper;

})(window)