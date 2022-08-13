<template>
	<view class="content">
		<!-- #ifndef MP -->
		<view class="top-div"></view>
		<!-- #endif -->
		<!-- 导航条 -->
		<uni-row class="demo-uni-row">
		    <uni-col :xs="6" :sm="6" :md="4" :lg="4" >
		        <view class="demo-uni-col ">
					<image class="img" src="../../static/logo.png" mode="aspectFit"></image>
				</view>
		    </uni-col>
		    <uni-col :xs="0" :sm="10" :md="10" :lg="12" >
		        <view class="demo-uni-col lists">
					<view class="list" v-for="(item,index) in toplist" :key='index' @click="topListUrl(index)" >
						{{item.titleList}}
					</view>
				</view>
		    </uni-col>
		    <uni-col :xs="14" :sm="5" :md="6" :lg="6" >
		        <view class="demo-uni-col inputs">
					<image class="icons" src="../../static/icon/sousuo.png" mode="aspectFit"></image>
					<input class="input" type="text" value="" placeholder="输入搜索关键词" @confirm="inputHandler"/>
				</view>
		    </uni-col>
		    <uni-col :xs="4" :sm="3" :md="2" :lg="2" >
		        <view class="demo-uni-col ">
					<image class="icon" src="../../static/icon/chakantiezigengduo.png" mode="aspectFit" @click="showDrawer"></image>
				</view>
		    </uni-col>
		</uni-row>
		
		
		<!-- 主要内容 -->
		<view class="content-com">
			<match-media class="left" :min-width="576" >
				<view class="top10" v-for="(item,index) in top10" :key="index">
					<view class="top10-text">
						<text class="">{{item.title}}</text><text class="r">更多...</text>
					</view>
					<view class="top10-con" v-for="(e,i) in item.com" :key="i">
						<view class="top10-lists" @click="top10Handler(index+1,e.url)">
							<text>{{i+1}}、</text><text class="title">{{e.title}}</text><text class="time">{{e.time}}</text>
						</view>
					</view>
				</view>
			</match-media>
			<view class="com">
				<view v-for="(item,index) in toplist" :key="index"  class="com-vessel">
					<view class="com-top" @click="topListUrl(index)">
						<text class="left">{{item.titleList}}</text> <text class="right">更多...</text>
					</view>
					<view class="con-flex">
						<view class="com-list" v-for="(e,i) in item.com" :key="i" @click="comHandler(index+1,e.url)">
							<image :title='e.text' :src="e.img" @error="onImgeError(item.com,i)" mode="scaleToFill"></image>
							<view class="img-com">
								<view class="name">
									{{e.name}}
								</view>
								<view class="text">
									{{e.text}}
								</view>
							</view>
						</view>
					</view>
				</view>
				
				
				<!-- 抽屉 -->
				<uni-drawer ref="showRight" mode="right" :mask-click="false" class="drawer">
					<scroll-view style="height: 100%;" scroll-y="true">
						<!-- <button @click="closeDrawer" type="primary">关闭Drawer</button> -->
						<view class="icon">
							<image class="icon-img" src="../../static/icon/quxiao.png" @click="closeDrawer" mode="aspectFit"></image>
						</view>
						<view class="list"  >
							<view v-for="(item,index) in toplist" :key="index" @click="topListUrl(index)">
								{{item.titleList}}
							</view>
						</view>
					</scroll-view>
				</uni-drawer>
			</view>
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
				placeholderImage:require('../../static/jiazai.png'),
				toplist:'',
				value:'',
				bool:true,
				info:false,
				top10:'',
				aa:[],
				bb:[],
				idexs:-1,
				i:-1
			}
		},
		onLoad() {
			// #ifdef H5
			this.IsPC()
			uni.hideTabBar()
			// #endif
			uni.showLoading({
			    title: '加载中',
				mask:true
			});
			// 首页数据
			uniCloud.callFunction({
				name: 'index',
				data: {
					$url: 'index'
				}
			}).then(r => {
				console.log(r.result)
				// console.log(2333)
				uniCloud.callFunction({
					name:'index',
					data:{
						$url:'hanju'
					}
				}).then((res)=>{
					uni.hideLoading();
					if(res.data!=[]){
						this.indexs=2,
						this.i=2
						for (var i = 0; i < r.result.top.length; i++) {
							if(r.result.top[i].titleList=='电视剧'){
								r.result.top[i].com=res.result
							}
						}
					}
					this.toplist=r.result.top
				})
				
			})
			
				// top10数据
			uniCloud.callFunction({
				name: 'index',
				data: {
					$url: 'top10'
				}
			}).then(r => {
					console.log(r.result)
					for (var i = 0; i < r.result.length; i++) {
						for(var j = 0; j < r.result[i].com.length; j++){
							var reg = /[\u4e00-\u9fa5]/g;
						r.result[i].com[j].title=r.result[i].com[j].title.match(reg).join('')
					}
				}
				var promise1=new Promise((res,rej)=>{
					// top10人人美剧数据
					uniCloud.callFunction({
						name:'index',
						data:{
							$url:'renren'
						}
					}).then((r)=>{
						return res(r)
					})
				})
				var promise2=new Promise((res,rej)=>{
					//top10樱花动漫数据
					
					uniCloud.callFunction({
						name:'index',
						data:{
							$url:'yinghua'
						}
					}).then(r=>{
						return res(r)
						})
				})
				Promise.all([promise1,promise2]).then((r1)=>{
					console.log(r1)
					for (var i = 0; i < r.result.length; i++) {
						if(r.result[i].title=='电视剧'){
							if(r1[0].result!=[]){
								r.result[i].com=r1[0].result
							}
						}else if(r.result[i].title=='动漫'){
							if(r1[0].result!=[]){
								r.result[i].com=r1[1].result
							}
						}
					}
					
				})
				console.log(r.result)
				console.log(111)
				this.top10=r.result
			})
		},
		// computed:{
		// 	top10s:function(){
		// 		console.log(this.aa,this.bb,this.top10)
		// 		console.log(1111)
		// 		for (var i = 0; i < this.top10.length; i++) {
		// 			if(this.top10[i].title=='电视剧'){
		// 				console.log(this.aa)
		// 				if(this.aa!=[]){
		// 					console.log(this.aa)
		// 					this.top10[i].com=this.aa
		// 				}
		// 			}else if(this.top10[i].title=='动漫'){
		// 				if(this.bb!=[]){
		// 					console.log(this.bb)
		// 					this.top10[i].com=this.bb
		// 				}
		// 			}
		// 			return this.top10
		// 		}
		// 	}
		// },
		methods: {
			// input 搜索
			inputHandler(e){
				uni.navigateTo({
					url:`../inquire/inquire?value=${e.detail.value}`
				})
			},
			showDrawer(e){
				console.log(this.bool)
				if(this.bool){
					this.$refs.showRight.open();
				}
			},
			closeDrawer() {
				this.$refs.showRight.close();
			},
			topListUrl(e){
				// console.log(e)
				getApp().globalData.id=e+1
				// console.log(getApp().globalData)
				uni.switchTab({
					url: '../search/search',
					animationType:'pop-in',
					animationDuration:300,
				});
			},
			top10Handler(i,url){
				this.comHandler(i.url)
			},
			onImgeError(dataArray,index){
				// console.log('加载失败')
				// console.log(dataArray,index)
				dataArray[index].img=this.placeholderImage
			},
			 IsPC() {
				 var bool
			       var result = window.matchMedia('(max-width:768px)');
			         if(result.matches) {
			          bool=true
			         }else{
			           bool=false
			         }
					 this.bool=bool
			    },
				// 点击去详情页
			comHandler(i,e){
				// console.log(e)
				if(i==2){
					this.id=2
					this.i=1
				}else if(i==4){
					this.i=4
				}else{
					this.id=-1
					this.i=-1
				}
				uni.navigateTo({
					url:`../lists/lists?url=${e}&id=${this.id}&i=${this.i}`,
					animationType:'pop-in',
					animationDuration:300
				})
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
		background: #f3f3f3;
	}
	@media screen and(min-width:992px) {
		.content{
			width: 960px;
			margin: auto;
		}
	}
	.content{
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
		background: #F8F8F8;
		.but-div{
			bottom: calc(var(--window-bottom) + 10px);
		}
	}
	.demo-uni-row {
		margin-top:var(--status-bar-height);
	    margin-bottom:10upx;
		background-color: #FFFFFF;
	    /* QQ、字节小程序文档写有 :host，但实测不生效 */
	    /* 百度小程序没有 :host，需要设置block */
	    /* #ifdef MP-TOUTIAO || MP-QQ || MP-BAIDU */
	    display: block;
	    /* #endif */
		border-bottom: 10upx solid #F0F0F0;
	}
	
	/* 支付宝小程序没有 demo-uni-row 层级 */
	/* 微信小程序使用了虚拟化节点，没有 demo-uni-row 层级 */
	/* #ifdef MP-ALIPAY || MP-WEIXIN */
	/deep/ .uni-row {
	    margin-bottom: 10px;
		border-bottom: 10upx solid #F0F0F0;
		background-color: #FFFFFF;
	}
	/* #endif */
	.demo-uni-col {
	    height: 90upx;
		.img{
			width: 100%;
			height: 100%;
			display: block;
		}
		.input{
			display: block;
			flex: 0.8;
			height: 40upx;
			margin: 10upx auto;
		}
		.icon{
			width: 100%;
			height: 40upx;
			margin: 25upx 0;
			display: block;
		}
	}
	.inputs{
		display: flex;
		height: 60upx;
		background-color: #F8F8F8;
		border-radius: 50rpx;
		margin: 20upx 0;
		overflow:hidden;
		.icons{
			height: 60%;
			flex: 0.15;
			margin: auto;
		}
	}
	.lists{
		display: flex;
		
		.list{
			flex: 0.2;
			margin: auto;
			text-align: center;
			background: pink;
			border-radius: 10upx;
			font-size: 30upx;
		}
	}
	.drawer{
		.icon{
			width: 20px;
			height: 20px;
			.icon-img{
				width: 100%;
				height: 100%;
				position: relative;
				right: -90px;
				top: 10px;
			}
		}
		.list{
			overflow: hidden;
			margin-left:12px;
			view{
				margin: 10px;
				padding: 10px 0;
			}
		}
	}
	.content-com{
		display: flex;
		width: 100%;
		font-size: 30upx;
		.left{
			width: 30%;
				margin: 20upx;
			.top10{
				padding: 20upx;
				background: #FFFFFF;
				border-radius:10upx ;
				border-bottom: 20upx;
				margin-bottom: 10upx;
			}
			.top10-text{
				border-bottom:1px solid #f6f6f6;
				font-size: 36upx;
				font-weight: 700;
				padding: 10upx ;
				.r{
					color: #C0C0C0;
					font-size: 28upx;
					font-weight: 100;
					float: right;
				}
			}
			.top10-con{
				margin-top: 10upx;
				.top10-lists{
					padding: 10upx;
					font-size: 28upx;
					.title{
						width: 80%;
					}
					.time{
						float: right;
						color:orange;
					}
				}
			}
		}
		@media screen and(min-width:576px){
			.com{
				width: 70%;
			}
		}
		@media screen and(max-width:576px){
			.com{
				width: 100%;
			}
		}
		.com{
			margin: 20upx ;
			position: relative;
			.com-vessel{
				background: #FFFFFF;
				margin-bottom: 20upx;
				border-radius: 10upx;
				width: 100%;
				.com-top{
					font-size: 38upx;
					padding:0 30upx ;
					margin-bottom:20upx ;
					border-bottom: 1upx solid #f0f0f0;
					
					.left{
						font-weight: 700;
					}
					.right{
						color: #ccc;
						float: right;
						font-size: 28upx;
					}
				}
				.con-flex{
					display: flex;
					flex-wrap: wrap;
					height: auto;
				}
				@media screen and(min-width:576px){
					.com-list{
						width:16.6% ;
						box-sizing: border-box;
						padding:10upx ;
						height: auto;
						text-align: center;
						margin-bottom:20upx ;
						image{
							width: 100%;
							height: 300upx;
							border-radius: 20upx;
						}
						.name ,.text{
							font-size: 24upx;
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow: hidden;
							margin-top:10upx ;
						}
						.text{
							font-size: 20upx;
							color: #C0C0C0;
						}
					}
				}
				@media screen and(max-width:576px){
					.com-list{
						width: 33.3%;
						padding: 10upx;
						box-sizing: border-box;
						height: auto;
						text-align: center;
						margin-bottom:20upx ;
						image{
							width: 100%;
							height: 300upx;
							border-radius: 20upx;
						}
						.name ,.text{
							font-size: 24upx;
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow: hidden;
							margin-top:10upx ;
						}
						.text{
							font-size: 20upx;
							color: #C0C0C0;
						}
					}
				}
				
			}
		}
		
	}
	
</style>
