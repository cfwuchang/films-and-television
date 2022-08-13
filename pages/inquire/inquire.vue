<template>
	<view class="con">
		<!-- #ifndef MP -->
		<view class="top-div"></view>
		<!-- #endif -->
		<view class="top">
			以<text>{{value}}</text>为关键词，为你找到了<text>{{num}}</text>条
		</view>
		<view class="list">
			<view class="list-view"  v-for="(item,index) in detail" :key='index'>
				<view class="lists"  @click="listHandler(item.url)">
					<view class="list-img">
						<image :src="item.img" mode="aspectFit"></image>
					</view>
					<view class="list-text">
						<view class="title">
							{{item.title}}
						</view>
						<view class="remark">
							{{item.remark}}
						</view>
						<view class="time">
							{{item.time}}
						</view>
						<view class="type">
							{{item.type}}
						</view>
						<view class="protagonist">
							{{item.protagonist}}
						</view>
						<view class="region">
							{{item.region}}
						</view>
						<view class="regisseur">
							{{item.regisseur}}
						</view>
					</view>
					
				</view>
			</view>
		</view>
		<view class="but" v-if="bool">
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
				detail:'',
				index:'',
				num:'',
				value : '',
				bool:true,
				page:1,
				id:-1,
				i:-1
			}
		},
		onLoad(option) {
			this.value=option.value
			this.id=option.id
			this.i=option.i
			this.con(this.value,this.page)
		},
		methods: {
			con(value,page){
				console.log(this.id,this.i)
				uni.showLoading({
				    title: '加载中',
					mask:true
				});
				if(this.id==2&&this.i==1){
					uniCloud.callFunction({
						name:'index',
						data: {
							$url: 'rrInput',
							input:value
						}
					}).then(r=>{
						console.log(r.result)
						 uni.hideLoading();
						this.index=r.result.index
						this.num=r.result.num
						if(this.detail==''){
							this.detail=r.result.list
						}else{
							this.detail=this.detail.concat(r.result.list)
						}
					})
				}else if(this.id==2&&this.i==2){
					uniCloud.callFunction({
						name:'index',
						data: {
							$url: 'hjInput',	
							input:encodeURIComponent(value)
						}
					}).then(r=>{
						console.log(r.result)
						 uni.hideLoading();
						this.index=r.result.index
						this.num=r.result.num
						if(this.detail==''){
							this.detail=r.result.list
						}else{
							this.detail=this.detail.concat(r.result.list)
						}
					})
				}else if(this.id==4){
					uniCloud.callFunction({
						name:'index',
						data: {
							$url: 'yhInput',
							input:value
						}
					}).then(r=>{
						 uni.hideLoading();
						this.index=r.result.index
						this.num=r.result.num
						if(this.detail==''){
							this.detail=r.result.list
						}else{
							this.detail=this.detail.concat(r.result.list)
						}
					})
				}else{
					uniCloud.callFunction({
						name:'index',
						data: {
							$url: 'input',
							input:value,
							page:page
						}
					}).then(r=>{
						 uni.hideLoading();
						this.index=r.result.index
						this.num=r.result.num
						if(this.detail==''){
							this.detail=r.result.list
						}else{
							this.detail=this.detail.concat(r.result.list)
						}
					})
				}
				
			},
			listHandler(e){
				console.log(e)
				uni.navigateTo({
					url:`../lists/lists?url=${e}`,
					animationType:'pop-in',
					animationDuration:300
				})
			}
		},
		onReachBottom(){
			if(this.page<parseInt(this.index)){
				this.page=this.page+1
				this.con(this.value,this.page)
			}else{
				this.bool=false
			}
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
<style lang="less">
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
		.top {
			margin-top:var(--status-bar-height);
			background: #FFFFFF;
			border-radius: 20upx;
			padding: 10upx 20upx 10upx 30upx;
			font-size: 32upx;
				text{
					color: red;
					font-size: 32upx;
				}
			}
			.list{
				margin-top:20upx ;
				.list-view{
					padding: 20upx;
					background: #FFFFFF;
					border-radius: 10upx;
					margin-top:20upx ;
					.lists{
						display: flex;
						@media screen and(max-width:576px){
							.list-img{
								flex: 0.4;
							}
							.list-text{
								flex: 0.6;
								overflow: hidden;
								text-overflow:ellipsis;
								white-space: nowrap;
							}
						}
						@media screen and(min-width:576px){
							.list-img{
								width: 300upx;
							}
							.list-text{
								flex: 1;
								overflow: hidden;
								text-overflow:ellipsis;
								white-space: nowrap;
							}
						}
						.list-img{
							padding: 30upx 0;
							image{
								width: 100%;
								height: 100%;
								border-radius: 30upx;
							}
						}
						.list-text{
							padding: 30upx;
							
							.title,.remark,.time,.type,.protagonist,.region,.regisseur{
								font-size: 30upx;
								margin: 10upx;
								text-align: left;
								font-size: 26upx;
							}
							.title{
								margin-top:0 ;
								font-size: 34upx;
								font-weight: 700;
							}
						}
					}
					
				}
			}
			.but{
				text-align: center;
				font-size:30upx ;
				margin: 20upx;
				color: #C0C0C0;
			}
		}
</style>
