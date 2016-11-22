移动端滚动插件

支持amd加载

相关参数：
option = {
	autoPlay: true,//是否自动播放
	delay: 2000,//切换间隔时间(毫秒)
	start: 0,//开始index
	align: 'h', //or v 滚动方向 h水平  v竖直
	isNav: true,//是否展示导航点
	navColor: '#ffffff',//导航点默认颜色
	navActiveColor: 'red',//导航点激活颜色
	changeEvent: function(index, swpier) {}//切换事件
}