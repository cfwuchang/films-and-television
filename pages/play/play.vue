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
		
		<!--  video -->
		<!-- #ifndef H5 -->
		<view class="vudeo">
			<video class="aa" :src="url" @fullscreenchange='fullscreenchange'></video>
		</view>
		<!-- #endif -->
		 <!-- #ifdef H5 -->
		<view class="video-js vjs-default-skin vjs-big-play-centered" ref="video" >
		
		</view>
		<!-- #endif  -->
		<!-- #ifndef MP -->
		<view class="but-div"></view>
		<!-- #endif -->
	</view>
</template>


<script>
	export default {
		data() {
			return {
				detail:"",
				list:'',
				url:'',
				id:'',
				from:'',
				index:''
			}
		},
		onLoad(options) {
			console.log(options)
			console.log(options.url)
			console.log(options.id)
			// url=${url}&upUrl=${this.upUrl}&id=${this.id}&i=${this.i}
			uni.showLoading({
			    title: '加载中',
				mask:true
			});
			if(options.id==2&&options.i==1){
				uniCloud.callFunction({
					name: 'index',
					data: {
						$url: 'rrDetail',
						url:options.upUrl
						}
				}).then(r => {
						uni.hideLoading();
						console.log(r)
						this.detail=r.result.con
						uniCloud.callFunction({
							name:'index',
							data:{
								$url:'rrPlay',
								id:options.url
							}
						}).then((r)=>{
							console.log(r.result)
							this.url=r.result
							// #ifdef H5
							this.aa(this.url)
							// #endif
						})
				})
			}else if(options.id==2&options.i==2){
				uniCloud.callFunction({
					name: 'index',
					data: {
						$url: 'hjDetail',
						url:options.upUrl,
						}
				}).then(r => {
					console.log(r.result)
						uni.hideLoading();
						console.log(r)
						this.detail=r.result.con
						uniCloud.callFunction({
							name:'index',
							data:{
								$url:'hjPlay',
								id:options.url
							}
						}).then((r)=>{
							this.url=r.result
							// #ifdef H5
							this.aa(this.url)
							// #endif
						})
				})
			}else if(options.id==4){
				uniCloud.callFunction({
					name: 'index',
					data: {
						$url: 'yhDetail',
						url:options.upUrl
						}
				}).then(r => {
						uni.hideLoading();
						console.log(r)
						this.detail=r.result.con
						uniCloud.callFunction({
							name:'index',
							data:{
								$url:'yhPlay',
								id:options.url
							}
						}).then((r)=>{
							// this.url=r.result
							uniCloud.callFunction({
								name:'index',
								data:{
									$url:'aa',
									url:r.result
								}
							}).then((r1)=>{
								console.log(r1.result)
								this.url=r1.result
								// #ifdef H5
								this.aa(this.url)
								// #endif
							})
						})
				})
			}else{
				uniCloud.callFunction({
					name: 'index',
					data: {
						$url: 'detail',
						url:options.upUrl
						}
				}).then(r => {
						uni.hideLoading();
						console.log(r)
						this.detail=r.result.con
						var id=options.url.substring(options.url.indexOf('play/')+5,options.url.indexOf('-'))
						var aa=options.url.substring(options.url.indexOf('-')+1,options.url.length)
						var from=aa.substring(0,aa.indexOf('-'))
						var bb=aa.substring(aa.indexOf('-')+1,aa.length)
						var index=bb.substring(0,bb.indexOf('.html'))
						this.id=id
						this.from=from
						this.index=index
						this.shiping(id,from,index)
				})
			}
		},
		methods: {
			shiping(id,from,index){
				uniCloud.callFunction({
					name:'index',
					data:{
						$url:'play',
						id:id,
						from:from,
						index:index
					}
				}).then(r=>{
					console.log(r.result)
					this.url=r.result
					// #ifdef H5
					this.aa(this.url)
					// #endif
				})
			},
			aa(aa){
				if(document.querySelector('video')!=null){
					var source=document.querySelector('source')
					source.src =aa
					
					return
				}
				var video = document.createElement('video')
				video.id = 'video'
				video.controls = true
				loop: false
				preload:'auto'
				var source = document.createElement('source')
				source.src =aa
				video.appendChild(source)
				this.$refs.video.$el.appendChild(video)
				videojs('video')
			}
			,fullscreenchange(e){
				console.log(e)
				e.detail.direction='horizontal'
			}
		},
		onPullDownRefresh(){
			this.shiping(this.id,this.from,this.index)
			uni.stopPullDownRefresh()
		},
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
			.top-l{
				flex: 0.4;
				padding: 30upx 0;
				image{
					width: 100%;
					height: 100%;
					border-radius: 30upx;
				}
			}
			.top-r{
				flex: 0.6;
				padding: 30upx;
				min-height: 300upx;
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
		@media screen and(max-width:576px){
			.video-js{
				height: 500upx;
			}
		}
		@media screen and(min-width:576px){
			.video-js{
				height: 1000upx;
			}
		}
	.video-js,.vudeo{
		width: 100%;
	}
	.aa{
		width: 100%;
		height: 100%;
	}
	}
</style>
