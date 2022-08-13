<template>
	<view class="con">
		<!-- #ifndef MP -->
		<view class="top-div"></view>
		<!-- #endif -->
		<view class="detail-top">
			<view class="top-l">
				<image :src="detail.img" mode="aspectFit"></image>
			</view>
			<view class="top-r">
				<view class="title">
					{{detail.title}}
				</view>
				<view class="remark">
					{{detail.remark}}
				</view>
				<view class="genre">
					{{detail.genre}}
				</view>
				<view class="update">
					{{detail.update}}
				</view>
				<view class="region">
					{{detail.region}}
				</view>
			</view>
		</view>
		<view class="top-text">
			{{detail.com}}
		</view>
		<view class="com">
			<view class="com-list" v-for="(item,index) in list" @click="listHandler(item.url)">
				<view class="text">
					{{item.text}}
				</view>
			</view>
		</view>
		<view class="top10">
			<view class="top10-list" v-for="(item,index) in top10">
				<view class="list-text" @click="listTextHandler(index+1)">
					<text class="l">{{item.title}}</text><text class="r">更多...</text>
				</view>
				<view class="lists" v-for="(e,i) in item.com">
					<view class="list-view" @click="top10ListHandler(e.url)">
						<text class="index">{{i+1}}、</text><text class="l">{{e.title}}</text><text class="r">{{e.time}}</text>
					</view>
				</view>
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
				detail:'',
				list:'',
				top10:'',
				upUrl:'',
				i:-1,
				id:-1
			}
		},
		onLoad(options) {
			// 详情数据
			this.id=options.id,
			this.upUrl=options.url,
			this.i=options.i
			
			this.Detail(options.url)
			// top10 数据
			uni.showLoading({
			    title: '加载中',
				mask:true
			});
			uniCloud.callFunction({
				name:'index',
				data:{
					$url:'top10'
				}
			}).then(r=>{
				uni.hideLoading();
				// console.log(r)
				console.log(r.result)
				for (var i = 0; i < r.result.length; i++) {
					for(var j = 0; j < r.result[i].com.length; j++){
						var reg = /[\u4e00-\u9fa5]/g;
						r.result[i].com[j].title=r.result[i].com[j].title.match(reg).join('')
					}
				}
				this.top10=r.result
			})
		},
		methods: {
			// 转到播放页
			listHandler(url){
				uni.navigateTo({
				    url: `../play/play?url=${url}&upUrl=${this.upUrl}&id=${this.id}&i=${this.i}`
				});
			},
			// top10推荐
			top10ListHandler(url){
				console.log(url)
				this.id=-1
				this.i=-1
				this.Detail(url)
			},
			// 返回
			listTextHandler(index){
				getApp().globalData.id=index
				uni.switchTab({
				    url: '../search/search'
				});
			},
			// 拉去数据
			Detail(url){
				uni.showLoading({
				    title: '加载中',
					mask:true
				});
				console.log(url)
				if(this.id==2&&this.i==1){
					uniCloud.callFunction({
						name: 'index',
						data: {
							$url: 'rrDetail',
							url:url
							}
					}).then(r => {
							uni.hideLoading();
							console.log(r)
							this.detail=r.result.con
							this.list=r.result.list
					})
				}else if(this.id==2&this.i==2){
					uniCloud.callFunction({
						name: 'index',
						data: {
							$url: 'hjDetail',
							url:url
							}
					}).then(r => {
						console.log(r.result)
							uni.hideLoading();
							console.log(r)
							this.detail=r.result.con
							this.list=r.result.list
					})
				}else if(this.id==4){
					uniCloud.callFunction({
						name: 'index',
						data: {
							$url: 'yhDetail',
							url:url
							}
					}).then(r => {
							uni.hideLoading();
							console.log(r)
							this.detail=r.result.con
							this.list=r.result.list
					})
				}else{
					uniCloud.callFunction({
						name: 'index',
						data: {
							$url: 'detail',
							url:url
							}
					}).then(r => {
							uni.hideLoading();
							console.log(r)
							this.detail=r.result.con
							this.list=r.result.list
					})
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
	.con{
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
		.detail-top{
			margin-top: var(--status-bar-height);
			padding: 20upx;
			background: #FFFFFF;
			display: flex;
			border-radius: 10upx;
			// height: 500upx;
			margin-bottom:10upx ;
			// border-bottom: 10upx #C0C0C0 solid;
			@media screen and(max-width:576px){
				.top-l{
					flex: 0.4;
				}
				.top-r{
					flex: 0.6;
				}
			}
			@media screen and(min-width:576px){
				.top-l{
					width: 300upx;
				}
				.top-r{
					flex: 1;
				}
			}
			.top-l{
				padding: 30upx 0;
				image{
					width: 100%;
					height: 100%;
					border-radius: 30upx;
				}
			}
			.top-r{
				min-height: 300upx;
				padding: 30upx;
				.title,.remark,.genre,.update,.region{
					font-size: 30upx;
					margin: 10upx;
					text-align: left;
					font-size: 26upx;
				}
				.title{
					margin-top:0 ;
				}
			}
		}
		.top-text{
			margin-top: 20upx;
			padding: 20upx;
			border-radius: 20upx;
			background: #FFFFFF;
			text-indent: 40upx;
			text-align: left;
			font-size: 30upx;
		}
		.com{
			margin-top: 20upx;
			padding: 20upx;
			border-radius: 20upx;
			overflow-x: auto;
			display: flex;
			background: #FFFFFF;
			.com-list{
				flex: auto;
				.text{
					margin: 0 20upx;
					padding: 10upx;
					border: 1upx solid #cccccc;
					background: #f2f2f2;
					font-size: 28upx;
					border-radius: 10upx;
					text-align: center;
					white-space: nowrap;
				}
			}
		}
		.top10{
			margin-top: 20upx;
			padding: 20upx;
			border-radius: 20upx;
			background: #FFFFFF;
			.top10-list{
				.list-text{
					font-size: 38upx;
					font-weight: 700;
					padding:0 20upx;
					.r{
						float: right;
						color: #cccccc;
						font-size: 28upx;
					}
				}
				.lists{
					padding-left: 30upx;
					margin: 10upx;
					padding: 10upx;
					font-size: 28upx;
					.list-view{
						.index{
							font-style: oblique;
							font-weight: 700;
						}
						.l{
							
						}
						.r{
							float: right;
							color:orange;
						}
					}
					
				}
			}
		}
	}
</style>
