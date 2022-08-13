<template>
	<view class="con">
		<!-- #ifndef MP -->
		<view class="top-div"></view>
		<!-- #endif -->
		<view class="con-input">
			<!-- #ifdef H5 -->
			<image class="img" src="../../static/icon/fanhui.png" mode="aspectFit" @click="goBack"></image>
			<match-media class="toplist-pc" :min-width="576" >
				<view :class="indexs==index+1?'active':''" class="list" v-for="(item,index) in toplist" :key="index"
					@click="classHandler(index+1)">
					<view class="son">
						{{item.titleList}}
						<view class="son-list" v-show="show">
							<view class="lists" :class="i==j?'actives':''" v-for="(e,j) in sonLists" v-if="index==1"  @click.stop="sonHnadler(j)">
								{{e}}
							</view>
						</view>
					</view>
					<image class="icon" src="../../static/icon/xia.png" mode="aspectFit" v-if="index==1" v-show="show"></image>
					<image class="icon" src="../../static/icon/shang.png" mode="aspectFit" v-if="index==1" v-show="!show"></image>
				</view>
			</match-media>
			<!-- #endif -->
			<view class="input">
				<image class="icons" src="../../static/icon/sousuo.png" mode="aspectFit"></image>
				<input type="text" value="" placeholder="输入搜索关键词" @confirm="valueHandler" />
			</view>
		</view>
			<match-media class="toplist" :max-width="576" >
				<view :class="indexs==index+1?'active':''" class="list" v-for="(item,index) in toplist" :key="index"
					@click="classHandler(index+1)">
					{{item.titleList}}
				</view>
			</match-media>
		<view class="Searc">
			<view class="num">
				为你找到了<text style="color:red;font-size: 28upx;">{{Searc.num}}</text>条
				<image src="../../static/icon/xia.png" mode="aspectFit" @click="imgHabdler" v-if="isOpen"></image>
				<image src="../../static/icon/shang.png" mode="aspectFit" @click="imgHabdler" v-if="!isOpen"></image>
			</view>
			<view :class="isOpen ? 'content-open' : 'content-close'">
				<view class="top" v-for="(item,index) in Searc.list" :key='index'
					:class="isOpen ? 'item-open' : 'item-close'">
					<view class="top-text">
						{{item.title}}
					</view>
					<view class="top-con">
						<view class="top-con-list" v-for="(e,i) in item.com" :key='i'
							@click="listTextHandler(e.text,i,index,e.url)">
							<view :class="datas[index].b==i?'active':''">
								{{e.text}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="con-list">
			<view class="list" v-for="(item,index) in Searc.lists" :key='index'>
				<image :title='item.text' :src="item.img" @error="onImgeError(Searc.lists,index)" mode="scaleToFill"
				@click="urlHandler(item.url)"></image>
				<view class="img-com">
					<view class="title">
						{{item.title}}
					</view>
					<view class="time">
						{{item.time}}
					</view>
				</view>
			</view>
		</view>
		
		<!-- 数据加载彻底加载完触发 -->
		<view class="bun" v-if="!bool">
			亲！没有更多了哦！
		</view>
		<!-- #ifndef MP -->
		<view class="but-div"></view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				toplist: '',
				num: 1,
				nub:-1,
				url:'',
				indexs: 1,
				Searc: {},
				placeholderImage:require('../../static/jiazai.png'),
				datas: [{
					b: -1,
					text: ''
				}, {
					b: -1,
					text: ''
				}, {
					b: -1,
					text: ''
				}, {
					b: -1,
					text: ''
				}, {
					b: -1,
					text: ''
				}],
				isOpen: true,
				
				bool:true,
				isnum:false,
				show:false,
				sonLists:['综合','美剧','韩剧'],
				i:-1
			}
		},
		onLoad(option) {
			
			uniCloud.callFunction({
				name:'index',
				data:{
					$url:'yhInput',
					input:'1'
				}
			}).then((r)=>{
				console.log(r.result)
			})
			// 判断。toplist节点是否存在
			// #ifdef H5
				var node=document.querySelector('.toplist')
				if(node!=null){
					this.isOpen=false
				}
			// #endif
			
			// 获取toplist数据
			this.top()
			// console.log(getApp().globalData.id)
			// 获取index页面点击项目，根据项目获取内容
			this.indexs = getApp().globalData.id
			this.searc(this.num)
		},
		onShow(){
			this.top()
			this.indexs = getApp().globalData.id
			this.Searc.lists=[]
			this.searc(this.num)
		},
		methods: {
			top(){
				uni.showLoading({
				    title: '加载中',
					mask:true
				});
				uniCloud.callFunction({
					name: 'index',
					data: {
						$url: 'index'
					}
				}).then(r => {
					uni.hideLoading();
					console.log(r.result.top)
					var aa=r.result.top[2].titleList
					r.result.top[2].titleList=r.result.top[3].titleList
					r.result.top[3].titleList=aa
					this.toplist = r.result.top
				})
			},
			// 点击子项目
			sonHnadler(e){
				this.i=e
				this.show=false
				for (var i = 0; i < this.datas.length; i++) {
					this.datas[i].text=''
					this.datas[i].b=-1
					
				}
				this.Searc.lists=[]
				this.num=1
				this.searc(this.num)
			},
			// 更换toplist内容数据
			classHandler(e ) {
				this.indexs = e
				if(e==2){
					this.show=true
				}else{
					this.show=false
					for (var i = 0; i < this.datas.length; i++) {
						this.datas[i].text=''
						this.datas[i].b=-1
						
					}
					this.Searc.lists=[]
					this.num=1
					this.searc(this.num)
				}
				
				
			},
			
			searc(num){
				uni.showLoading({
				    title: '加载中',
					mask:true
				});
				if(this.indexs==2 && this.i==1){
					uniCloud.callFunction({
						name:'index',
						data:{
							$url:'rrSearc',
							num:num
						}
					}).then((r)=>{
						uni.hideLoading();
						console.log(this.Searc.lists)
						if(this.Searc.lists!=undefined){
							console.log(r.result.lists)
							var aa=this.Searc.lists
							aa=aa.concat(r.result.lists)
							r.result.lists=aa
						}
						this.Searc = r.result
						console.log(this.Searc)
					})
				}else if(this.indexs==2 && this.i==2){
					console.log(2123)
					uniCloud.callFunction({
						name:"index",
						data:{
							$url:'hjSearc'
						}
					}).then((r)=>{
						console.log(r.result)
						uni.hideLoading();
						if(this.Searc.lists!=undefined){
							console.log(r.result.lists)
							var aa=this.Searc.lists
							aa=aa.concat(r.result.lists)
							r.result.lists=aa
						}
						this.Searc = r.result
					})
				}else if(this.indexs==4){
					uniCloud.callFunction({
						name:"index",
						data:{
							$url:'yhSearc',
							num:num
						}
					}).then((r)=>{
						console.log(r.result)
						r.result.list=r.result.list.slice(2,3)
						uni.hideLoading();
						if(this.Searc.lists!=undefined){
							console.log(r.result.lists)
							var aa=this.Searc.lists
							aa=aa.concat(r.result.lists)
							r.result.lists=aa
						}
						this.Searc = r.result
					})
				}else{
					console.log(this.indexs)
					uniCloud.callFunction({
						name: 'index',
						data: {
							$url: 'Searc',
							index: this.indexs,
							num:num
						}
					}).then(r => {
						uni.hideLoading();
						console.log(r.result)
						console.log(this.Searc.lists)
						if(this.Searc.lists!=undefined){
							console.log(r.result.lists)
							var aa=this.Searc.lists
							aa=aa.concat(r.result.lists)
							r.result.lists=aa
						}
						this.Searc = r.result
					})
				}
				
			},
			// 搜索条件选择
			listTextHandler(e, i, index,url) {
				console.log(index,e, i)
				var aa = {}
				aa.text = e
				aa.b = i
				aa.url=url
				this.datas[index] = aa
				console.log(this.datas)
				var url=''
				if(this.indexs==2&&this.i==1){ //人人美剧url合成
				var a1=''
				var a2=''
				var a3=''
				var a4=''
					for (var i = 0; i < this.datas.length; i++) {
						console.log(this.datas[i].text)
						if(this.datas[i].text!=''){
							switch(i){
								case 0:
									a3=this.datas[i].text
									break;
								case 3:
									if(this.datas[i].b==0){
										a2='time'
									}
									if(this.datas[i].b==1){
										a2='hits'
									}
									if(this.datas[i].b==2){
										a2='score'
									}
									break;
								case 1:
									a1=this.datas[i].text
									break;
								case 2:
									a4=this.datas[i].text
									break;
							}
						}
					}
					url=`1-${a1}-${a2}-${a3}--------${a4}.html`
				}else if(this.indexs==2&&this.i==2){ //韩剧网url合成
					for (var i = 0; i < this.datas.length; i++) {
						if(this.datas[i].url!=undefined){
							url=this.datas[i].url
						}
					}
				}else if(this.indexs==4){ //樱花动漫url合成
					for (var i = 0; i < this.datas.length; i++) {
						if(this.datas[i].url!=undefined){
							url=this.datas[i].text
						}
					}
				}else{ //url合成
					for (var i = 0; i < this.datas.length; i++) {
						if(this.datas[i].url!=undefined){
							if(url==''){
								url=this.datas[i].url
							}else{
								url=url+this.datas[i].url.substring(this.datas[i].url.indexOf('tid')+5,this.datas[i].length)
							}
						}
					}
				}
				
				this.url=url
				console.log(url)
				
				this.result(url,this.num,1)
			},
			// 搜索条件数据
			result(url,num,id){
				if(num==1){
					this.nub=this.Searc.index
					this.Searc.lists=[]
				}
				if(id==1){
					this.Searc.lists=[]
				}
				this.$forceUpdate()
				uni.showLoading({
				    title: '加载中',
					mask:true
				});
				if(this.indexs==2&&this.i==1 ){ //人人美剧条件搜索
				console.log(url)
				url="/vodshow/"+encodeURIComponent(url)
				console.log(url)
					uniCloud.callFunction({
						name: 'index',
						data: {
							$url: 'rrResult',
							url:url
						}
					}).then(r => {
						uni.hideLoading();
						console.log(r.result)
						this.Searc.lists=this.Searc.lists.concat(r.result.lists)
						this.Searc.index=r.result.index
						this.Searc.num=r.result.num
						console.log(this.Searc)
					})
					
				}else if(this.indexs==2&&this.i==2){ //韩剧网条件搜索
					uniCloud.callFunction({
						name: 'index',
						data: {
							$url: 'hjResult',
							url:url
						}
					}).then(r => {
						uni.hideLoading();
						console.log(r.result)
						this.Searc.lists=this.Searc.lists.concat(r.result.lists)
						this.Searc.index=r.result.index
						this.Searc.num=r.result.num
						console.log(this.Searc)
					})
				}else if(this.indexs==4){ //樱花动漫条件搜索
					uniCloud.callFunction({
						name: 'index',
						data: {
							$url: 'yhResult',
							page:num,
							url:url
						}
					}).then(r => {
						uni.hideLoading();
						console.log(r.result)
						this.Searc.lists=this.Searc.lists.concat(r.result.lists)
						this.Searc.index=r.result.index
						this.Searc.num=r.result.num
						console.log(this.Searc)
					})
				}else{ //条件搜索
					uniCloud.callFunction({
						name: 'index',
						data: {
							$url: 'result',
							page:num,
							url:url
						}
					}).then(r => {
						uni.hideLoading();
						console.log(r.result)
						this.Searc.lists=this.Searc.lists.concat(r.result.lists)
						this.Searc.index=r.result.index
						this.Searc.num=r.result.num
						console.log(this.Searc)
					})
				}
				
					
			},
			// 数据详情页
			urlHandler(url){
				console.log(url)
				uni.navigateTo({
					url:`../lists/lists?url=${url}&id=${this.indexs}&i=${this.i}`,
					animationType:'pop-in',
					animationDuration:300
				})
			},
			// 向后导航
			goBack(){
				uni.switchTab({
				    url: '/pages/index/index'
				});
			},
			// 手风琴动画
			imgHabdler() {
				this.isOpen = !this.isOpen
			},
			// 图片加载错误触发，更改默认图片
			onImgeError(dataArray,index){
				// console.log('加载失败')
				// console.log(dataArray,index)
				dataArray[index].img=this.placeholderImage
			},
			// 搜索框事件
			valueHandler(e){
				uni.navigateTo({
					url:`../inquire/inquire?value=${e.detail.value}&id=${this.indexs}&i=${this.i}`
				})
			}
		},
		// 上拉触底事件，加载下页数据，
		onReachBottom(e){
			// console.log(e)
			// console.log(parseInt(this.num),parseInt(this.Searc.index))
			// this.nub=this.Searc.index
				
			if(this.nub==this.Searc.index || this.nub==-1){
				if(parseInt(this.num)<=parseInt(this.Searc.index)){
					this.num=parseInt(this.num)+1
					this.searc(this.num)
				}else{
					console.log(111)
					this.bool=false
				}
			}else{
				// console.log(112223)
				if(!this.isnum){
					this.num==1
				}
				console.log(parseInt(this.num),parseInt(this.Searc.index))
				if(parseInt(this.num)<=parseInt(this.Searc.index)){
					this.isnum=true
					this.num=parseInt(this.num)+1
					console.log(this.num)
					this.result(this.url,this.num,2)
				}else{
					console.log(111)
					this.bool=false
				}
			}
			
		}
	}
</script>
<!-- #ifdef MP -->
<style>
	page {
		background: #F8F8F8;
	}
</style>
<!-- #endif -->
<style lang="less" scoped>
	page {
		background: #F8F8F8;
	}
	@media screen and(min-width:992px){
		.con{
			width: 960px;
			margin:20upx auto;
		}
	}
	@media screen and(max-width:992px){
		.con{
			margin:20upx;
		}
	}
	.con {
		margin-bottom:calc(var(--window-bottom) + 10px);
		.top-div{
			height: var(--status-bar-height);
			width: 100%;
			background: #F8F8F8;
			position: fixed;
			top: 0;
			left: 50%;
			transform: translateX(-50%);
			z-index:99;
		}
		.but-div{
			bottom: calc(var(--window-bottom) + 10px);
		}
		.con-input {
			margin-top:var(--status-bar-height);
			display: flex;
			height: 60upx;
			margin: 20upx 0;
			.img{
				flex: 0.1;
				width: 40upx;
				height: 40upx;
				padding: 10upx;
				background-color: #FFFFFF;
				// margin-right: 30upx;
				border-radius: 50rpx;
			}
			.toplist-pc{
				flex: 0.5;
				display: flex;
				margin: 0 30upx;
				width: 100%;
				.list {
					flex: 1;
					display: flex;
					padding: 10upx;
					margin: 0 10upx;
					background: #C0C0C0;
					color: #FFFFFF;
					font-size: 28upx;
					text-align: center;
					border-radius: 10upx;
					
					.son{
						flex: 1;
						position: relative;
						
						.son-list{
							position: absolute;
							border-radius: 10upx;
							top: 25px;
							left: -10upx;
							width: 100%;
							padding-right:60upx ;
							background: #C0C0C0;
							z-index: 999;
							color: #FFFFFF;
							.lists{
								margin: 10upx 0;
							}
							.actives{
								color: red;
							}
						}
					}
					.icon{
						width: 40upx;
						height: 40upx;
					}
				}
				
				.active {
					color: red;
					background: #FFFFFF;
				}
			}
			@media screen and(max-width:576px){
				.input{
					flex: 0.9;
				}
			}
			@media screen and(min-width:576px){
				.input{
					flex: 0.5;
				}
			}
			.input{
				display: flex;
				overflow: hidden;
				background-color: #FFFFFF;
				border-radius: 50rpx;
				input {
					display: block;
					flex: 0.8;
					height: 40upx;
					margin: 10upx auto;
				}
				
				.icons {
					flex: 0.2;
					width: 40upx;
					height: 40upx;
					padding: 10Upx 0;
				}
			}
			
		}
		.toplist {
			display: flex;
			margin-bottom: 10upx;

			.list {
				flex: 1;
				padding: 10upx;
				margin: 0 10upx;
				background: #C0C0C0;
				color: #FFFFFF;
				font-size: 28upx;
				text-align: center;
				border-radius: 30upx;
			}

			.active {
				color: red;
				background: #FFFFFF;
			}
		}

		.Searc {
			background: #FFFFFF;
			border-radius: 20upx;
			margin-top: 20upx;
			font-size: 30upx;
			.num {
				padding: 10upx 20upx;
				border-bottom: 1upx solid #C0C0C0;
				image {
					width: 40upx;
					height: 40upx;
					float: right;
				}
			}

			.content-open {
				overflow: hidden;
				transition: all 1.4s cubic-bezier(0.25, 1.0, 0.25, 1.0);
			}

			.content-close {
				height: 0;
				transition: all 1.4s cubic-bezier(0.25, 1.0, 0.25, 1.0);
			}

			.item-open {
				transition: all 1.4s cubic-bezier(0.25, 1.0, 0.25, 1.0);
			}

			.item-close {
				transition: all 1.4s cubic-bezier(0.25, 1.0, 0.25, 1.0);
				opacity: 0;
			}
			.top {
				padding: 10upx;
				// width: 100%;
				display: flex;
				border-bottom: 1upx solid #ccc;
				padding: 20upx;
				@media screen and(max-width:576px){
					.top-text {
						flex: 0.2;
						font-size: 34upx;
						text-align: center;
					}
					.top-con {
						flex: 0.8;
						display: flex;
						overflow-x: auto;
						.top-con-list {
							flex: 1;
							font-size: 28upx;
							white-space: nowrap;
							margin: 0 10upx 10upx;
							text-align: center;
							.active {
								color: red;
							}
						}
					}
				}
				@media screen and(min-width:576px){
					.top-text {
						flex: 0.1;
						font-size: 30upx;
						text-align: center;
					}
					.top-con {
						flex: 0.8;
						display: flex;
						overflow-x: auto;
						.top-con-list {
							width: 100upx;
							font-size: 24upx;
							white-space: nowrap;
							margin: 0 20upx 10upx;
							text-align: center;
							.active {
								color: red;
								border-bottom: 1upx solid red;
							}
						}
					}
				}
				
			}
		}
	
		.con-list {
			display: flex;
			flex-wrap: wrap;
			height: auto;
			margin: 20upx 0;
			background: #FFFFFF;
			border-radius: 20upx;
			width: 100%;
			@media screen and(max-width:576px){
				.list{
					width: 33.3%;
				}
			}
			@media screen and(min-width:576px){
				.list{
					width: 16.6%;
				}
			}
			.list{
				// width: 32%;
				box-sizing: border-box;
				padding: 10upx;
				text-align: center;
				margin-bottom:20upx ;
				height: auto;
				image{
					width: 100%;
					height: 300upx;
					border-radius: 20upx;
				}
				.title ,.time{
					font-size: 24upx;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					margin-top:10upx ;
				}
				.time{
					font-size: 20upx;
					color: #C0C0C0;
				}
			}
		}
		.bun{
			text-align: center;
			font-size:30upx ;
			margin: 20upx;
			color: #C0C0C0;
		}
	}
</style>
