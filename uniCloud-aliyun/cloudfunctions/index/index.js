'use strict';
const TcbRouter = require('tcb-router');
const cheerio = require('cheerio')
const axios = require('axios');
const qs = require('qs');
const iconv = require('iconv-lite');

exports.main = (event, context) => {
	const app = new TcbRouter({
		event
	})
	// 主体
	// 首页

	app.router('index', async (ctx, next) => {
		const list = {}
		await axios({
			method: 'get',
			url: 'http://www.100bt4kyy.com/'
		}).then((r) => {
			// ctx.body=r.data
			const $ = cheerio.load(r.data)
			const aa = $('.row').find('.menulist')
			var toplist = []
			aa.map((i, d) => {
				var cc = {}
				cc.titleList = $(d).children('.menulist-l').children('.ilist').children(
					'.stit').children('a:last').text()
				cc.url = $(d).children('.menulist-l').children('.ilist').children(
					'.stit').children('a:last').attr('href')
				var dd = []

				var gg = $(d).children('.menulist-r').find('li')
				gg.map((j, b) => {
					var ff = {}
					ff.img = $(b).children('.li_li ').children('.li_all')
						.children(".li_img").children('a').children('img').attr(
							'src')
					ff.text = $(b).children('.li_li ').children('.li_all')
						.children(".li_text").children('.name').text()
					ff.url = $(b).children('.li_li ').children('.li_all')
						.children(".li_text").children('.name').children('a').attr('href')
					ff.name = $(b).children('.li_li ').children('.li_all')
						.children(".li_text").children('.actor').text()
					dd.push(ff)
				})
				cc.com = dd
				toplist.push(cc)
			})
			list.top = toplist
			ctx.body = list
		})

	});
	// top10
	app.router('top10', async (ctx, next) => {
		await axios({
			method: 'get',
			url: 'http://www.100bt4kyy.com/'
		}).then((r) => {
			// ctx.body=r.data
			const $ = cheerio.load(r.data)
			const aa = $('.ilist')
			const bb = []
			aa.map((i, d) => {
				var ff = {}
				ff.title = $(d).children('.stit').children('a:last').text()
				var top10 = $(d).children('.mb_none').find('li')
				var cc = []
				top10.map((j, b) => {
					var dd = {}
					dd.title = $(b).children('a').text()
					dd.url = $(b).children('a').attr('href')
					dd.time = $(b).children('a').children('.score').text()
					cc.push(dd)
				})
				ff.com = cc
				bb.push(ff)
			})
			ctx.body = bb
		})

	});
	// lists
	app.router('Searc', async (ctx, next) => {
		await axios({
			Method: "get",
			url: `http://www.100bt4kyy.com/l/${event.index}-${event.num}.html`
		}).then((r) => {
			var com = {}
			var list = []
			var lists = []
			const $ = cheerio.load(r.data)
			const aa = $('.case').find('.feifan123-net')
			const gg = $('.list').find('li')
			const rr = $('.mb_none').find('a')
			aa.map((i, d) => {
				var bb = {}
				bb.title = $(d).children('span').text()
				var cc = $(d).find("li")
				var dd = []
				cc.map((j, b) => {
					if($(b).children('em').text()!='全部'){
						var ff = {}
						ff.text = $(b).children('a').text()
						ff.url = $(b).children('a').attr("href")
						dd.push(ff)
					}
				})
				bb.com = dd
				list.push(bb)
			})
			gg.map((a, c) => {
				var zz = {}
				zz.url = $(c).children('.li_li').children('.li_all').children('.li_img')
					.children('a').attr('href')
				zz.img = $(c).children('.li_li').children('.li_all').children('.li_img')
					.children("a")
					.children('img').attr(
						'src')
				zz.title = $(c).children('.li_li').children('.li_all').children(
					'.li_text').children('p:first').text()
				zz.time = $(c).children('.li_li').children('.li_all').children(
					'.li_text').children('p:last').text()
				lists.push(zz)
			})
			var num
			var index
			let kk = 0
			rr.map((r, d) => {
				kk = $(d).attr('href')
			})
			index = kk.substring(kk.indexOf('-') + 1, kk.indexOf('.'))
			num = parseInt(index) * 35
			com.index = index
			com.num = num
			com.list = list
			com.lists = lists
			ctx.body = com
		})
	})
	// 条件搜索
	app.router('result', async (ctx, next) => {
		await axios({
			method: 'get',
			url: `http://www.100bt4kyy.com${event.url}&page=${event.page}`
		}).then((r)=>{
			const $=cheerio.load(r.data)
			var com = {}
			var lists = []
			const gg = $('.list').find('li')
			const rr = $('.mb_none').find('a')
			gg.map((a, c) => {
				var zz = {}
				zz.url = $(c).children('.li_li').children('.li_all').children('.li_img')
					.children('a').attr('href')
				zz.img = $(c).children('.li_li').children('.li_all').children('.li_img')
					.children("a")
					.children('img').attr(
						'src')
				zz.title = $(c).children('.li_li').children('.li_all').children(
					'.li_text').children('p:first').text()
				zz.time = $(c).children('.li_li').children('.li_all').children(
					'.li_text').children('p:last').text()
				lists.push(zz)
			})
			var num
			var index
			let kk = 0
			rr.map((r, d) => {
				kk = $(d).attr('href')
			})
			index = kk.substring(kk.indexOf('=') + 1, kk.indexOf('&'))
			num = parseInt(index) *28
			com.index = index
			com.num = num
			com.lists = lists
			ctx.body = com
			// ctx.body=r.data
		})
	})
	// input搜索
	app.router('input',async (ctx,next)=>{

		await axios.post('http://www.100bt4kyy.com/search1.php',qs.stringify({ 'searchword': event.input ,'page':event.page}))
		.then((r)=>{
			var com={}
			const $=cheerio.load(r.data)
			var aa=$('.list').find('li')
			var zz=$('.mb_none').find('a')
			var bb=[]
			aa.map((i,d)=>{
				var cc={}
				cc.title=$(d).children('.li_li').children('.li_all').children('.li_text').children('.name').text()
				cc.remark=$(d).children('.li_li').children('.li_all').children('.li_text').children('p:nth-child(2)').text()
				cc.type=$(d).children('.li_li').children('.li_all').children('.li_text').children('p:nth-child(3)').text()
				cc.protagonist=$(d).children('.li_li').children('.li_all').children('.li_text').children('p:nth-child(4)').text()
				cc.regisseur=$(d).children('.li_li').children('.li_all').children('.li_text').children('p:nth-child(5)').text()
				cc.region=$(d).children('.li_li').children('.li_all').children('.li_text').children('p:nth-child(6)').text()
				cc.time=$(d).children('.li_li').children('.li_all').children('.li_text').children('p:nth-child(7)').text()
				cc.img=$(d).children('.li_li').children('.li_all').children('.li_img').children('a').children('img').attr("src")
				cc.url=$(d).children('.li_li').children('.li_all').children('.li_img').children('a').attr("href")
				bb.push(cc)
			})
			var num
			var index
			let kk = ''
			zz.map((r, d) => {
				kk = $(d).attr('href')
			})
			index = kk.substring(kk.indexOf('=') + 1, kk.indexOf('&'))
			num = parseInt(index) *30
			com.index = index
			com.num = num
			com.list=bb
			ctx.body=com
		})
	})
	// 详情
	app.router('detail',async(ctx,next)=>{
		await axios({
			method: 'get', 
			url: `http://www.100bt4kyy.com${event.url}`
		}).then((r)=>{
			const $=cheerio.load(r.data)
			const list=$('.stab_list').find('li')
			var cc={}
			const aa={}
			aa.img=$('.dpic').attr('src')
			aa.title=$('.detail_text').children("p").text()
			aa.protagonist=$('.detail_text').children(".dlall").children('.dl').children('dl:nth-child(1)').text()
			aa.remark=$('.detail_text').children(".dlall").children('.dl').children('dl:nth-child(2)').text()
			aa.genre=$('.detail_text').children(".dlall").children('.dl').children('dl:nth-child(3)').text()
			aa.language=$('.detail_text').children(".dlall").children('.dl').children('dl:nth-child(4)').text()
			aa.update=$('.detail_text').children(".dlall").children('.dl').children('dl:nth-child(5)').text()
			aa.region=$('.detail_text').children(".dlall").children('.dl').children('dl:nth-child(6)').text()
			aa.com=$('.des_xy').text()
			cc.con=aa
			var ccc=[]
			list.map((i,d)=>{
				var dd={}
				dd.text=$(d).children('a').text()
				dd.url=$(d).children('a').attr('href')
				ccc.push(dd)
			})
			cc.list=ccc
			ctx.body=cc
		})
	})
	// 播放页
	app.router('play',async(ctx,next)=>{
		var cc
		await axios({
			method: 'get',
			url: `http://www.100bt4kyy.com/ass.php?url=dp&vid=${event.id}&vfrom=${event.from}&vpart=${event.index}`
		}).then((r)=>{
			var bb= r.data.trim()
			var aa=bb.substring(1,bb.length-2)
			cc=JSON.parse(aa).s.video[0]
			ctx.body=cc
		})
	})
	
	//樱花动漫top10
	app.router('yinghua',async(ctx,next)=>{
		await axios.get("http://www.dmh8.com", { responseType: 'arraybuffer' })
		    .then((r) => {
		        var str = iconv.decode(Buffer.from(r.data), 'gb2312');
		        var data = iconv.encode(str, 'utf8').toString();
				const $=cheerio.load(data)
				const list=$('.pics').children('ul').find('li')
				var lists=[]
					list.map((i,d)=>{
						var aa={}
						aa.img=$(d).children('a').children('img').attr('href')
						aa.url=$(d).children('a').attr('href')
						aa.title=$(d).children('h2').text()
						aa.time=new Date().getMonth()<=9?'0'+(new Date().getMonth()+1)+'-'+new Date().getDate():new Date().getMonth()+1+'-'+new Date().getDate()
						lists.push(aa)
					})
		        ctx.body=lists
		    })
	})
	// 樱花动漫lists
	app.router('yhSearc',async(ctx,next)=>{
		await axios.get(`http://www.dmh8.com/so.asp?page=${event.num}&fl=0&pl=time`, { responseType: 'arraybuffer' })
		    .then((r) => {
		        var str = iconv.decode(Buffer.from(r.data), 'gb2312');
		        var data = iconv.encode(str, 'utf8').toString();
				const $=cheerio.load(data)
				const cc=$('.ters').find('p')
				const gg=$('.pics').children('ul').find('li')
				const rr=$('.pages').children('span').text()
				var com = {}
				var list = []
				var lists = []
				var index=''
				var num=''
				cc.map((i,d)=>{
					var bb = {}
					bb.title = $(d).children('label').text()
					var dd = []
					var zz = $(d).find("a")
					zz.map((j,b)=>{
						var ff = {}
						ff.text =$(b).text()
						ff.url = $(b).attr("href")
						dd.push(ff)
					})
					bb.com = dd
					list.push(bb)
				})
		        
				gg.map((a, c) => {
					var zz = {}
					zz.url = $(c).children('a').attr('href')
					zz.img = $(c).children('a').children('img').attr('src')
					zz.title = $(c).children('h2').text()
					zz.time = $(c).children('p').text()
					lists.push(zz)
				})
				var num
				var index
				num =rr.substring(rr.indexOf('共')+1,rr.indexOf('条')-1)
				index = Math.ceil(parseInt(num) /100)
				com.index = index
				com.num = num
				com.list=list
				com.lists=lists
				ctx.body=com
		    })
	})
	// 樱花动漫条件搜索
	app.router('yhResult', async (ctx, next) => {
		await axios.get(`http://www.dmh8.com/so.asp?page=${event.page}&nf=${event.url}`, { responseType: 'arraybuffer' })
		.then((r)=>{
			var str = iconv.decode(Buffer.from(r.data), 'gb2312');
			var data = iconv.encode(str, 'utf8').toString();
			const $=cheerio.load(data)
			var com = {}
			var lists = []
			const gg = $('.pics').children('ul').find('li')
			const rr = $('.pages').children('span').text()
			gg.map((a, c) => {
				var zz = {}
				zz.url = $(c).children('a').attr('href')
				zz.img = $(c).children("a").children('img').attr('src')
				zz.title = $(c).children('h2').text()
				zz.time = $(c).children('span:last').text()
				lists.push(zz)
			})
			var num
			var index
			num =rr.substring(rr.indexOf('共')+1,rr.indexOf('条')-1)
			index = Math.ceil(parseInt(num) /12)
			com.index = index
			com.num = num
			com.lists = lists
			ctx.body = com
		})
	})
	// 樱花动漫input搜索
	app.router('yhInput',async (ctx,next)=>{await
		await axios.post('http://www.dmh8.com/search.asp',qs.stringify({ 'searchword': event.input }),{ responseType: 'arraybuffer' })
		.then((r)=>{
			var com={}
			var str = iconv.decode(Buffer.from(r.data), 'gb2312');
			var data = iconv.encode(str, 'utf8').toString();
			const $=cheerio.load(data)
			var aa=$('.pics').children('ul').find('li')
			var rr=$('.pages').children('span').text()
			var bb=[]
			aa.map((i,d)=>{
				var cc={}
				cc.title=$(d).children('h2').text()
				cc.type=$(d).children('p').text()
				cc.time=$(d).children('span:last').text()
				cc.img=$(d).children('a').children('img').attr("src")
				cc.url=$(d).children('a').attr("href")
				bb.push(cc)
			})
			var num
			var index
			num =rr.substring(rr.indexOf('共')+1,rr.indexOf('条')-1)
			index = Math.ceil(parseInt(num) /10)
			com.index = index
			com.num = num
			com.list=bb
			ctx.body=com
		})
	})
	// 樱花动漫详情
	app.router('yhDetail',async(ctx,next)=>{
		await axios.get(`http://www.dmh8.com${event.url}`, { responseType: 'arraybuffer' })
		.then((r)=>{
			var str = iconv.decode(Buffer.from(r.data), 'gb2312');
			var data = iconv.encode(str, 'utf8').toString();
			const $=cheerio.load(data)
			const list=$('.movurl').children('ul').find('li')
			var cc={}
			const aa={}
			aa.img=$('.tpic').children('img').attr('src')
			aa.title=$('.tpic').children('.spay').children('a').text()
			aa.genre=$('.alex').children('span:eq(1)').text()
			aa.language=$('.alex').children('span:eq(3)').text()
			aa.update=$('.alex').children('p:eq(1)').text()
			aa.region=$('.alex').children('span:eq(2)').text()
			cc.con=aa
			var ccc=[]
			list.map((i,d)=>{
				var dd={}
				dd.text=$(d).children('a').text()
				dd.url=$(d).children('a').attr('href')
				ccc.push(dd)
			})
			cc.list=ccc
			ctx.body=cc
		})
	})
	// 樱花动漫播放页
	app.router('yhPlay',async(ctx,next)=>{
		await axios.get(`http://www.dmh8.com${event.id}`, { responseType: 'arraybuffer' })
		.then((r)=>{
			var dd=0
			var str = iconv.decode(Buffer.from(r.data), 'gb2312');
			var data = iconv.encode(str, 'utf8').toString();
			const $=cheerio.load(data)
			const list=$('.player').children('script:first').attr('src')
			var aa=list.substring(0,list.indexOf('?'))
			
			ctx.body=aa
		})
	})
	app.router('aa',async(ctx,next)=>{
		await axios({
				method: 'get',
				url: `http://www.dmh8.com${event.url}`
		}).then((r)=>{
			r.data=r.data.substring(r.data.indexOf("$")+1,r.data.indexOf('$flv'))
			ctx.body=r.data
		})
	})
	
	// 人人美剧top10
	app.router('renren',async(ctx,next)=>{
		await axios({
			method: 'get',
			url: 'https://www.rrmeiju.com'
		}).then((r)=>{
			const $=cheerio.load(r.data)
			const list=$('.week-hot').children('.sea-vod-hot').find('li')
			var lists=[]
			list.map((i,d)=>{
				var aa={}
				aa.title=$(d).children('p').children('a').text(),
				aa.url=$(d).children('p').children('a').attr('href'),
				aa.time=new Date().getMonth()<=9?'0'+(new Date().getMonth()+1)+'-'+new Date().getDate():new Date().getMonth()+1+'-'+new Date().getDate()
				lists.push(aa)
			})
			ctx.body=lists
		})
	})
	// 人人美剧 lists
	app.router('rrSearc',async(ctx,next)=>{
		await axios({
			method:'get',
			url:`https://www.rrmeiju.com/vodshow/1--------${event.num}---.html`
		}).then((r)=>{
			var com = {}
			var list = []
			var lists = []
			const $ = cheerio.load(r.data)
			const aa = $('.dl-horizontal').find('dt')
			const dd = $('.dl-horizontal').find('dd')
			const bb = $('.btn-group').find('a')
			const ff=$('.list-unstyled').find('li')
			const gg=$('.pagination').find('a:last').attr('href')
			// const gg = $('.list').find('li')
			// const rr = $('.mb_none').find('a')
			aa.map((i,d)=>{
				var zz={}
				zz.com=[]
				if(i==3){
					zz.title="排序"
					bb.map((j,b)=>{
						var xx={}
						xx.text=$(b).text()
						xx.url=$(b).attr("href")
						zz.com.push(xx)
					})
				}else{
					zz.title=$(d).text()
					dd.map((j,b)=>{
						if(j==i){
							var cc=$(b).find('a') 
							cc.map((a,b)=>{
								var xx={}
								xx.text=$(b).text()
								xx.url=$(b).attr("href")
								zz.com.push(xx)
							})
						}
					})
				}
				list.push(zz)
			})
			
			ff.map((i,d)=>{
				var zz = {}
				zz.url=$(d).children('a').attr('href')
				zz.img=$(d).children('a').children('img').attr('src')
				zz.title =$(d).children('h4').text()
				zz.time=$(d).children('h6').text()
				lists.push(zz)
			})
			
			var index
			var num
			index=gg.substring(gg.indexOf('--------')+8,gg.indexOf('---.html'))
			num=parseInt(index)*24
			com.index = index
			com.num = num
			com.list = list
			com.lists = lists
			ctx.body=com
		})
	})
	// 人人美剧条件搜索
	app.router('rrResult', async (ctx, next) => {
		// var newurl=encodeURIComponent(event.url)
		await axios({
			method: 'get',
			url: `https://www.rrmeiju.com${event.url}`
		}).then((r)=>{
			const $=cheerio.load(r.data)
			var com = {}
			var lists = []
			const ff = $('.list-unstyled').find('li')
			const gg=$('.pagination').find('a:last').attr('href')
			ff.map((a, c) => {
				var zz = {}
				zz.url = $(c).children('a').attr('href')
				zz.img = $(c).children("a").children('img').attr('src')
				zz.title = $(c).children('h4').text()
				zz.time = $(c).children('h6').text()
				lists.push(zz)
			})
			var index
			var num
			index=gg.substring(gg.indexOf('--------')+8,gg.indexOf('---.html'))
			num=parseInt(index)*24
			com.index = index
			com.num = num
			com.lists = lists
			ctx.body=com
		})
	})
	// 人人美剧input搜索
	app.router('rrInput',async (ctx,next)=>{
		await axios.post('https://www.rrmeiju.com/vodsearch/-------------.html',qs.stringify({ 'wd': event.input }))
		.then((r)=>{
			var com={}
			const $=cheerio.load(r.data)
			var aa=$('.list-unstyled').find('li')
			var bb=[]
			aa.map((i,d)=>{
				var cc={}
				cc.title=$(d).children('h4').text()
				cc.time=$(d).children('h6').text()
				cc.img=$(d).children('a').children('img').attr("src")
				cc.url=$(d).children('a').attr("href")
				bb.push(cc)
			})
			var num
			num = bb.length
			com.num = num
			com.list=bb
			ctx.body=com
		})
	})
	// 人人美剧详情
	app.router('rrDetail',async(ctx,next)=>{
		await axios({
			method: 'get', 
			url: `https://www.rrmeiju.com${event.url}`
		}).then((r)=>{
			const $=cheerio.load(r.data)
			const list=$('.text-center').find('li')
			var cc={}
			const aa={}
			aa.img=$('.sea-col').children('ul').children('li:first').children('img').attr('src')
			aa.title=$('.sea-col').children('.page-header').children("h1").text()
			aa.language=$('.sea-col').children('ul').children('.col-xs-8').children('dl').children("dd:eq(3)").text()
			aa.update='更新时间：'+$('.sea-col').children('ul').children('.col-xs-8').children('dl').children('dd:eq(5)').text()
			aa.region='地区：'+ $('.sea-col').children('ul').children('.col-xs-8').children('dl').children('dd:eq(4)').text()
			aa.com=$('.sea-col').children('ul').children('.col-xs-8').children('dl').children('dd:eq(6)').text()
			cc.con=aa
			var ccc=[]
			list.map((i,d)=>{
				var dd={}
				dd.text=$(d).children('a').text()
				dd.url=$(d).children('a').attr('href')
				ccc.push(dd)
			})
			cc.list=ccc
			ctx.body=cc
		})
	})
	// 人人美剧播放页
	app.router('rrPlay',async(ctx,next)=>{
		var cc
		await axios({
			method: 'get',
			url: `https://www.rrmeiju.com${event.id}`
		}).then((r)=>{
			const $=cheerio.load(r.data)
			const list=$('.container').children('script:first').html()
			var aa=list.substring(list.indexOf('=')+1,list.length)
			var bb=JSON.parse(aa).url
			ctx.body=bb
		})
	})
	

	// 韩剧网 list
	app.router('hjSearc',async(ctx,next)=>{
		await axios({
			method: 'get',
			url: 'https://www.ihanju5.com/',
			headers: {
			       //"content-type": "application/json",
			       "content-Type": "text/html;charset=UTF-8;",
			       'User-Agent':' Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36'
			     },
		}).then((r)=>{
			const $=cheerio.load(r.data)
			const aaa=$('#nav').find('li')
			const bbb=$('.box_con').children('.dis:first').find('li')
			var com = {}
			var list = []
			var lists = []
			var index=''
			var num=''
			var zz={}
			zz.title='年代'
			zz.com=[]
			aaa.map((i,d)=>{
				if(i!=0){
					var aa={}
					aa.text=$(d).text()
					aa.url=$(d).children('a').attr('href')
					zz.com.push(aa)
				}
				
			})
			list.push(zz)
			bbb.map((i,d)=>{
				var aa={}
				aa.title=$(d).children('a').children('h2').text(),
				aa.url=$(d).children('a').attr('href'),
				aa.img=$(d).children('a').children('img').attr('src'),
				aa.time=$(d).children('a').children('i').text()
				lists.push(aa)
			})
			com.index = index
			com.num = num
			com.list = list
			com.lists = lists
			ctx.body=com
		})
	})
	// 韩剧网
	app.router('hanju',async(ctx,next)=>{
		await axios({
			method: 'get',
			url: 'https://www.ihanju5.com/',
			 headers: {
			        //"content-type": "application/json",
			        "content-Type": "text/html;charset=UTF-8;",
			        'User-Agent':' Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36'
			      },
		}).then((r)=>{
			const $=cheerio.load(r.data)
			const list=$('.box_con').children('ul').find('li')
			var lists=[]
			list.map((i,d)=>{
				var aa={}
				aa.text=$(d).children('a').children('h2').text(),
				aa.url=$(d).children('a').attr('href'),
				aa.img=$(d).children('a').children('img').attr('src'),
				aa.name=$(d).children('a').children('i').text()
				lists.push(aa)
			})
			ctx.body=lists
			// ctx.body=11
		})
	})
	//  韩剧网条件搜索
	app.router('hjResult', async (ctx, next) => {
		await axios({
			method: 'get',
			url: `https://www.ihanju5.com/${event.url}`,
			headers: {
			       //"content-type": "application/json",
			       "content-Type": "text/html;charset=UTF-8;",
			       'User-Agent':' Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36'
			     },
		}).then((r)=>{
			const $=cheerio.load(r.data)
			var com = {}
			var lists = []
			const gg = $('.img-list').find('li')
			gg.map((a, c) => {
				var zz = {}
				zz.url = $(c).children('a').attr('href')
				zz.img = $(c).children("a").children('img').attr('src')
				zz.title = $(c).children('a').children('h2').text(),
				zz.time = $(c).children('a').children('i').text()
				lists.push(zz)
			})
			var num
			num=lists.length
			var index
			com.index = index
			com.num = num
			com.lists = lists
			ctx.body = com
			// ctx.body=r.data
		})
	})
	// 韩剧网input搜索
	app.router('hjInput',async (ctx,next)=>{
		await axios({
			method: 'get',
			url: `https://www.ihanju5.com/vodsearch/-------------.html?wd=${event.input}`,
			headers: {
			       //"content-type": "application/json",
			       "content-Type": "text/html;charset=UTF-8;",
			       'User-Agent':' Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36'
			     },
		}).then((r)=>{
			var com={}
			const $=cheerio.load(r.data)
			var aa=$('.show-list').find('li')
			var zz=$('.page_tip').text()
			var list=[]
			aa.map((i,d)=>{
				var cc={}
				cc.title=$(d).children('.play-txt').children('h2').children('a').text()
				cc.remark=$(d).children('.play-txt').children('dl:nth-child(2)').text()
				cc.type=$(d).children('.play-txt').children('dl:nth-child(4)').text()
				cc.protagonist=$(d).children('.play-txt').children('dl:nth-child(1)').text()
				cc.regisseur=$(d).children('.play-txt').children('dl:nth-child(3)').text()
				cc.region=$(d).children('.play-txt').children('dl:nth-child(5)').text()
				cc.time=$(d).children('.play-txt').children('dl:nth-child(6)').text()
				cc.img=$(d).children('.play-img').children('img').attr("src")
				cc.url=$(d).children('.play-img').attr("href")
				list.push(cc)
			})
			// var num
			// var index
			// num =zz.substring(zz.indexOf('共')+1,zz.indexOf('条')-1)
			// index = Math.ceil(parseInt(num) /100)
			// com.index = index
			// com.num = num
			com.list=list
			ctx.body=com
		})
	})
	// 韩剧网详情
	app.router('hjDetail',async(ctx,next)=>{
		await axios({
			method: 'get', 
			url: `https://www.ihanju5.com/${event.url}`,
			headers: {
			       //"content-type": "application/json",
			       "content-Type": "text/html;charset=UTF-8;",
			       'User-Agent':' Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36'
			     },
		}).then((r)=>{
			const $=cheerio.load(r.data)
			const list=$('.video_list').find('a')
			var cc={}
			const aa={}
			aa.img=$('.detail-cols').children('.detail-pic').children('img').attr('src')
			aa.title=$('.detail-cols').children(".detail-info").children('.detail-title').children('h1').text()
			aa.protagonist=$('.detail-cols').children(".detail-info").children('.info ').children('dl:eq(2)').text()
			aa.remark=$('.detail-cols').children(".detail-info").children('.info ').children('dl:eq(1)').text()
			aa.genre=$('.detail-cols').children(".detail-info").children('.info ').children('dl:eq(3)').text()
			aa.language=$('.detail-cols').children(".detail-info").children('.info ').children('dl:eq(5)').text()
			aa.update=$('.detail-cols').children(".detail-info").children('.info ').children('dl:eq(10)').text()
			aa.region=$('.detail-cols').children(".detail-info").children('.info ').children('dl:eq(4)').text()
			cc.con=aa
			var ccc=[]
			list.map((i,d)=>{
				var dd={}
				dd.text=$(d).text()
				dd.url=$(d).attr('href')
				ccc.push(dd)
			})
			cc.list=ccc
			ctx.body=cc
		})
	})
	// 韩剧网播放页 待写
	// app.router('hjPlay',async(ctx,next)=>{
	// 	var cc
	// 	await axios({
	// 		method: 'get',
	// 		url: `http://www.100bt4kyy.com/ass.php?url=dp&vid=${event.id}&vfrom=${event.from}&vpart=${event.index}`
	// 	}).then((r)=>{
	// 		var bb= r.data.trim()
	// 		var aa=bb.substring(1,bb.length-2)
	// 		cc=JSON.parse(aa).s.video[0]
	// 		ctx.body=cc
	// 	})
	// })
	
	return app.serve();
}
