var mouseTimer=null,cursorVisible=true;document.onmousemove=()=>{if(mouseTimer){window.clearTimeout(mouseTimer)};if(!cursorVisible){document.getElementsByTagName("html")[0].style.cursor="default";cursorVisible=true};mouseTimer=window.setTimeout(()=>{mouseTimer=null;document.getElementsByTagName("html")[0].style.cursor="none";cursorVisible=false},3E+3)};
document.onkeydown=(e)=>{if(e.ctrlKey&&e.shiftKey&&["C","J","I"].includes(e.key.toUpperCase())){return(false)};if(e.ctrlKey&&["C","S","U"].includes(e.key.toUpperCase())){return(false)}};

if(!String.prototype.format){String.prototype.format=function(){var args=arguments;return(this.replace(/{(\d+)}/g,function(match,number){return(typeof args[number]!="undefined"?args[number]:match)}))}};
const $=(id)=>{return(document.getElementById(id))},
hide=(id)=>{$(id).style.display="none"},
show=(id)=>{$(id).style.display="block"},
$_GET=(k,v=true)=>{match=RegExp("(?:\\?|&)({0})(?:=([\\w\\d-/]*)|&|$)".format(k),"g").exec(document.location.search);if(match){res={};res[match[1]]=match[2];if(v){return(res[k])};return(true)};return(null)},
cookie=(name,value,options)=>{if(typeof value!="undefined"){options=options||{};if(value===null){value="";options.expires=-1};var expires="";if(options.expires&&(typeof options.expires=="number"||options.expires.toUTCString)){var date;if(typeof options.expires=="number"){date=new Date();date.setHours(23,59,59);date.setDate(date.getDate()+options.expires);}else{date=options.expires};expires=";expires={0}".format(date.toUTCString())};document.cookie=[name,"=",encodeURIComponent(value),expires,(";path={0}".format(options.path?options.path:"/")),(options.domain?";domain={0}".format(options.domain):""),(options.secure?";secure":"")].join("")}else{var result=new RegExp("(?:; )?{0}=([^;]*);?".format(name));if(result.test(document.cookie)){return(decodeURIComponent(RegExp["$1"]))};return(null)}},
onLongPress=(element,callback,timeout=3E+3)=>{var timeoutId,cancel=()=>{clearTimeout(timeoutId)};element.ontouchstart=()=>{timeoutId=setTimeout(()=>{timeoutId=null;callback()},timeout)};element.onmousedown=()=>{element.ontouchstart()};element.ontouchend=()=>{cancel()};element.onmouseup=()=>{cancel()};element.ontouchmove=()=>{cancel()};element.onmouseleave=()=>{cancel()}},
createElements=(d,to)=>{Object(d).forEach(c=>{var e=document.createElement(c.tag);if(c.attrs){Object.keys(c.attrs).forEach(a=>{e.setAttribute(a,c.attrs[a])})};if(c.children){Object(c.children).forEach(c=>{if(typeof c=="string"){e.innerHTML=c}else if(typeof c=="object"){createElements([c],e)}})};to.appendChild(e)})},
createEvalCSS=(n,r)=>{document.querySelector("style").insertAdjacentText("beforeend","{0}{{1}}".format(n,r))};
var headChild=[
	{"tag": "title"},
	{"tag": "meta","attrs": {"charset": "UTF-8"}},
	{"tag": "meta","attrs": {"http-equiv": "expires","content": "-1"}},
	{"tag": "meta","attrs": {"http-equiv": "pragma","content": "no-cache"}},
	{"tag": "meta","attrs": {"http-equiv": "X-UA-Compatible","content": "IE=edge"}},
	{"tag": "meta","attrs": {"http-equiv": "Content-Type","content": "text/html;charset=iso-8859-1"}},
	{"tag": "meta","attrs": {"name": "viewport","content": "width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no"}},
	{"tag": "meta","attrs": {"name": "description","content": "Read Manhwa"}},
	{"tag": "meta","attrs": {"name": "chapter","content": ""}},
	{"tag": "link","attrs": {"href": "","rel": "icon","type": "image/png"}},
	{"tag": "style","attrs": {"type": "text/css"},"children": ["@charset \"UTF-8\";",":root{--bg-footer:url(static/blue-block.gif);--bg-ul-images:url(data:image/png;base64,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)}"]}
],bodyChild=[
	{"tag": "section","attrs": {"id": "content"},"children": [
		{"tag": "div","attrs": {"id": "description","style": "display:none"}},
		{"tag": "footer","attrs": {"id": "footer","style": "display:none"},"children": [
			{"tag": "table","attrs": {"width": "100%","cellpadding": "0","cellspacing": "0"},"children": [
				{"tag": "thead","children": [
					{"tag": "tr","children": [
						{"tag": "th","attrs": {"width": "0"},"children": [
							{"tag": "i","attrs": {"id": "list_eps","class": "fa fa-th-list","onclick": "App.description()","style": "margin-left:15px;font-size:20px;"}}
						]},
						{"tag": "th","attrs": {"style": "max-width:170px;"},"children": [
							{"tag": "select","attrs": {"id": "epsisodeList","style": "width:100%;margin-left:10px;float:left;"},"children": [
								{"tag": "option","attrs": {"style": "color:rgb(40 180 20)","disabled": "true","selected": "true"},"children": ["Select Chapter"]}
							]}
						]},
						{"tag": "th","attrs": {"width": "0"},"children": [
							{"tag": "i","attrs": {"id": "prev_eps","class": "fa fa-arrow-left disabled","style": "margin-right:10px;"}},
							{"tag": "i","attrs": {"id": "next_eps","class": "fa fa-arrow-right disabled","style": "margin-left:10px;margin-right:15px"}}
						]}
					]}
				]}
			]}
		]},
		{"tag": "center","children": [
			{"tag": "ul","attrs": {"id": "imageList"}}
		]},
	]}
];
createElements(headChild,document.querySelector("head"));
createElements(bodyChild,document.querySelector("body"));
createEvalCSS("*","margin:0 auto;padding:0;color:#9A9A9A;font-family:monospace;border:0;outline:none;user-select:none");
createEvalCSS("*::-webkit-scrollbar-track,*::-webkit-scrollbar-thumb","-webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.3);border-radius:55px");
createEvalCSS("*::-webkit-scrollbar-track,*::-webkit-scrollbar","width:5px;height:5px;background-color:#000115");
createEvalCSS("*::-webkit-scrollbar-thumb","background-color:rgb(40 180 20);background:rgb(103 137 63)");
createEvalCSS("body","font-size:14px;font-weight:500;background:rgba(72,72,72,1)");
createEvalCSS("#description","padding:15px 0 10px");
createEvalCSS("#description p","padding:4px 12px;color:#eee;font-size:12px;text-align:justify");
createEvalCSS("#description ul#bxcl","padding:8px 12px;list-style:none");
createEvalCSS("#description ul#bxcl li","width:100%;float:left");
createEvalCSS("#description ul#bxcl li .bxch","margin:0 0px 4px;padding:4px 6px;font-size:12px;border:2px solid #adadad88;border-radius:6px;overflow:hidden");
createEvalCSS("#description ul#bxcl li .bxch.viewed","opacity:.6666");
createEvalCSS("#description ul#bxcl li .bxch:hover","background:#333;opacity:1");
createEvalCSS("#description ul#bxcl li .bxch span","display:block");
createEvalCSS("#description ul#bxcl li .bxch span.epsTitle","color:rgb(40 180 20);font-size:16px;font-weight:800;border:1px solid transparent");
createEvalCSS("#description ul#bxcl li .bxch span.epsTitle.view:after","content:\" *\"");
createEvalCSS("#description ul#bxcl li .bxch span.epsDate","font-size:12px;color:#888");
createEvalCSS("#description ul#bxcl li .bxch span.epsDate:before","content:\"YMD: \"");
createEvalCSS("#description ul#bxcl li .bxch span.hover","width:99%;float:left;color:rgb(40 220 25);border-color:#333;border-bottom-color:rgb(40 220 25)");
createEvalCSS("footer","padding:10px 0;position:fixed;z-index:30;width:100%;display:flex;background:rgba(11,11,11,1)var(--bg-footer);background-size:100%;background-position:center;bottom:0px;transition:bottom 0.5s ease-in-out");
createEvalCSS("footer.down","bottom:-52px");
createEvalCSS("select","width:auto;display:block;padding:5px 10px;color:#fff;font-size:18px;text-align:left;font-weight:700;border-radius:25px;cursor:pointer;background:transparent;-webkit-appearance:none");
createEvalCSS("option","padding:5px;color:#28db18db;font-weight:500;background:#181818");
createEvalCSS("i#list_eps,i#prev_eps,i#next_eps","color:#ddd");
createEvalCSS("i#prev_eps:hover,i#next_eps:hover","color:#fff;cursor:pointer");
createEvalCSS("i#prev_eps.disabled,i#next_eps.disabled","cursor:default;color:#444;pointer-events:none");
createEvalCSS("ul#imageList","padding:0;list-style-type:none;line-height:0;background:var(--bg-ul-images)");
createEvalCSS("ul#imageList li","padding:0");
createEvalCSS("ul#imageList li img","width:100%;pointer-events:none;opacity:1");
createEvalCSS("ul#imageList li img.error","border:0px solid gray;border-width:1px 0;pointer-events:painted;opacity:1");
createEvalCSS("ul#imageList li:first-child img.error","border-width:2px 0 1px");
createEvalCSS("ul#imageList li:last-child img.error","border-width:1px 0 2px");
createEvalCSS("@font-face","font-family:FontAwesome;src:url(static/fontawesome-webfont.ttf) format('truetype')");
createEvalCSS(".fa","display:inline-block;font:normal normal normal 24px FontAwesome");
createEvalCSS(".fa-on:before","content:\"\\f028\";color:#0f0");
createEvalCSS(".fa-off:before","content:\"\\f026\"");
createEvalCSS(".fa-repeat:before","content:\"\\f01e\"");
createEvalCSS(".fa-arrow-circle-left:before","content:\"\\f0a8\"");
createEvalCSS(".fa-arrow-circle-right:before","content:\"\\f0a9\"");
createEvalCSS(".fa-arrow-circle-up:before","content:\"\\f0aa\"");
createEvalCSS(".fa-arrow-circle-down:before","content:\"\\f0ab\"");
createEvalCSS(".fa-arrow-left:before","content:\"\\f060\"");
createEvalCSS(".fa-arrow-right:before","content:\"\\f061\"");
createEvalCSS(".fa-arrow-up:before","content:\"\\f062\"");
createEvalCSS(".fa-arrow-down:before","content:\"\\f063\"");
createEvalCSS(".fa-th-list:before","content:\"\\f00b\"");
createEvalCSS(".fa-list:before","content:\"\\f03a\"");
createEvalCSS(".fa-caret-left:before","content:\"\\f0d9\"");
createEvalCSS(".fa-caret-right:before","content:\"\\f0da\"");
createEvalCSS(".fa-chevron-left:before","content:\"\\f053\"");
createEvalCSS(".fa-chevron-right:before","content:\"\\f054\"");
createEvalCSS(".fa-refresh:before","content:\"\\f021\"");
document.querySelector("style").insertAdjacentText("beforeend","@media only screen and (min-width:730px){html{background:var(--bg-footer) center center / 88.8889% #000115}body{display:none}}");
document.getElementsByTagName("link")[0].href="static/icon.png";

var App={
	titleNa:$_GET("t"),
	epsInfo:null,
	prev_eps:null,
	next_eps:null,
	cookie:{
		name:"qwe",
		expires:30,
		qwe:null
	},
	full_data_src_:"{0}/{1}.jpg",
	full_data_src:"https://raw.githubusercontent.com/prowebtoons-thief/{0}/main/{1}/{2}.jpg",
	footer:document.querySelector("footer"),
	lastScrollY:window.pageYOffset,
	scrolledStart:false
};
App.getChapter=(v)=>{if(v){document.getElementsByTagName("meta").chapter.content=v};return(document.getElementsByTagName("meta").chapter.content)};
App.getcookie=()=>{App.cookie.qwe=JSON.parse(cookie(App.cookie.name)?atob(cookie(App.cookie.name)):"{\"last_view\":null,\"thumb_img\":null,\"scrollY\":null,\"viewed\":[]}");return(App.cookie.qwe)};
App.update_cookie=()=>{cookie(App.cookie.name,btoa(JSON.stringify(App.cookie.qwe)),App.cookie.expires)};
App.footer_updown=()=>{if(Array.from(App.footer.classList).includes("down")){App.footer.classList.remove("down")}else{App.footer.classList.add("down")}};
App.scrolled=()=>{if(!App.scrolledStart)return;var ScrollY=window.pageYOffset,isfooterdown=Array.from(App.footer.classList).includes("down");if(Math.abs(ScrollY-App.lastScrollY)>=10){if(scrollY>App.lastScrollY&&!isfooterdown){App.footer.classList.add("down")};App.lastScrollY=ScrollY}};
App.onImgError=(imgTag)=>{
	imgTag.setAttribute("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVQYGWMAAQAABQAB8C9sxAAAAABJRU5ErkJggg==");
	imgTag.setAttribute("ondblclick","App.reloadImg(this);");
	imgTag.classList.add("error");
	onLongPress(imgTag,()=>{
		var data_src=App.full_data_src.format(App.titleNa,App.getChapter(),imgTag.getAttribute("data-fName"));window.open(data_src)
	},5E+3)
};
App.reloadImg=(imgTag)=>{
	var data_src=App.full_data_src.format(App.titleNa,App.getChapter(),imgTag.getAttribute("data-fName"));
	imgTag.setAttribute("src",data_src);
	imgTag.removeAttribute("ondblclick");
	imgTag.classList.remove("error")
};
App.referer=(eps)=>{if(!Object.keys(App.epsInfo["epsInfo"]).includes(eps)){show("description");return}document.title="#{0} .... {1}".format(eps.padStart(3,0),App.epsInfo["epsInfo"][eps].title);if($_GET("superUser",false)){App.epsInfo["epsInfo"][eps].imgInfo=App.epsInfo["epsInfo"][eps].imgInfo.slice(1)};if(eps!==App.cookie.qwe.last_view){App.cookie.qwe.last_view=eps;App.cookie.qwe.thumb_img=0;App.cookie.qwe.scrollY=0;App.cookie.qwe.viewed=App.cookie.qwe.viewed||[];window.scrollTo(0,0)};hide("description");show("footer");show("imageList");App.update_cookie();App.load_content(eps)};

App.description=()=>{
	window.onscroll=undefined;
	if($("description").innerHTML){$("description").innerHTML=""};
	hr=()=>{var hr=document.createElement("hr");hr.setAttribute("style","margin:4px 12px;border-bottom:solid 2px #adadad88;");return(hr)};
	$("description").appendChild(hr());
	$("description").appendChild(hr());
	$("description").appendChild(hr());
	var p=document.createElement("p");
	p.innerHTML=App.epsInfo["description"];
	$("description").appendChild(p);
	$("description").appendChild(hr());
	$("description").appendChild(hr());
	var div=document.createElement("div"),ul=document.createElement("ul");
	ul.setAttribute("id","bxcl");

	Object.keys(App.epsInfo.epsInfo).sort().forEach(eps=>{
		var li=document.createElement("li"),div=document.createElement("div");
		div.setAttribute("class","bxch");
		if(App.cookie.qwe.viewed&&App.cookie.qwe.viewed.includes(eps)){div.classList.add("viewed")};
		div.setAttribute("onclick","App.referer('{0}')".format(eps));
		div.setAttribute("onmouseover","this.getElementsByTagName('span')[0].classList.add('hover')");
		div.setAttribute("onmouseleave","this.getElementsByTagName('span')[0].classList.remove('hover')");
		var a=document.createElement("a"),sp=document.createElement("span");
		sp.setAttribute("class","epsTitle");
		if(eps==App.cookie.qwe.last_view){sp.classList.add("view")};
		sp.innerHTML=App.epsInfo["epsInfo"][eps].title;
		a.appendChild(sp);
		var sp=document.createElement("span");
		sp.setAttribute("class","epsDate");
		sp.innerHTML=App.epsInfo["epsInfo"][eps].date;
		a.appendChild(sp);
		div.appendChild(a);
		li.appendChild(div);
		ul.appendChild(li)
	});
	$("description").appendChild(ul);

	var b=document.createElement("b");
	b.setAttribute("style","padding:1px 12px;");
	$("description").appendChild(b);
	$("description").appendChild(hr());
	$("description").appendChild(hr());

	hide("footer");
	hide("imageList");
	show("description");
	window.scrollTo(0,0)
};
App.setImage=(index)=>{
	var imageList=$("imageList").getElementsByTagName("li"),
		imgTag = imageList[index].getElementsByTagName("img")[0],
		wh = window.innerHeight*3.1,iph = imgTag.offsetTop+imgTag.offsetHeight;

	if (window.scrollY-wh <= iph&&iph <= window.scrollY+wh) {
		var sortOrder = imgTag.getAttribute("data-sortOrder"),
		fName = imgTag.getAttribute("data-fName"),
		isrc = imgTag.getAttribute("src"),
		data_src = App.full_data_src.format(App.titleNa, App.getChapter(), fName);

		if (isrc&&isrc!==data_src&&window.scrollY>=imgTag.offsetTop&&window.scrollY<=imgTag.offsetTop+imgTag.offsetHeight) {App.reloadImg(imgTag)}
		else if (!isrc) {imgTag.setAttribute("src",data_src)};
		App.cookie.qwe.thumb_img = parseInt(sortOrder)
	}
};
App.load_content=(episode)=>{
	App.getChapter(episode);
	Array.from($("epsisodeList").getElementsByTagName("option")).slice(1).forEach(elem=>{
		if(elem.value==episode){elem.selected=true}
	});
	App.prev_eps=(""+(parseInt(episode)-1)).padStart(3,"0");
	App.next_eps=(""+(parseInt(episode)+1)).padStart(3,"0");
	if(Object.keys(App.epsInfo.epsInfo).indexOf(App.prev_eps)>=0){
		$("prev_eps").classList.remove("disabled");
		$("prev_eps").onclick= function(){App.referer(App.prev_eps)}
	}else{$("prev_eps").classList.add("disabled")};
	if(Object.keys(App.epsInfo.epsInfo).indexOf(App.next_eps)>=0){
		$("next_eps").classList.remove("disabled");
		$("next_eps").onclick=function(){App.referer(App.next_eps)}
	}else{$("next_eps").classList.add("disabled")};

	var imageList=$("imageList").getElementsByTagName("li");
	if (imageList.length) Array.from(imageList).forEach(elem=>{elem.remove()});
	for (i=0;i<App.epsInfo["epsInfo"][episode].imgInfo.length;i++) {
		var sortOrder = App.epsInfo.epsInfo[episode].imgInfo[i].sortOrder;
		var fName = App.epsInfo.epsInfo[episode].imgInfo[i].fname;

		var img_ctn = document.createElement("img");
		img_ctn.width = App.epsInfo["epsInfo"][episode].imgInfo[i].width;
		img_ctn.height = (
			(window.innerWidth/App.epsInfo["epsInfo"][episode].imgInfo[i].width)
			*App.epsInfo["epsInfo"][episode].imgInfo[i].height
		);
		img_ctn.setAttribute("data-sortOrder","{0}".format(sortOrder));
		img_ctn.setAttribute("data-fName",fName);
		img_ctn.setAttribute("onerror","App.onImgError(this);");
		img_ctn.setAttribute("oncontextmenu","return false;");
		var li_img=document.createElement("li");
		li_img.setAttribute("onclick","App.footer_updown();");
		li_img.appendChild(img_ctn);
		$("imageList").appendChild(li_img)
	};

	var thumb_img = Math.max(App.cookie.qwe.thumb_img,3);
	for (var i=Math.max(0,thumb_img-3);i<thumb_img;i++) {App.setImage(i)};

	var scrollStart,lastPageYOffset=window.pageYOffset;
	window.onscroll = function() {
		App.scrolled();

		for (var i=0;i<imageList.length;i++) {App.setImage(i)};

		if (window.scrollY>=(document.body.scrollHeight-window.innerHeight*1.1)) {
			if (!App.cookie.qwe.viewed.includes(episode)) {App.cookie.qwe.viewed.push(episode)};
			App.footer.classList.remove("down")
		}

		App.cookie.qwe.scrollY = scrollStart = window.scrollY;
		if (Math.abs(window.pageYOffset-lastPageYOffset)>=100) {
			App.update_cookie();lastPageYOffset = window.pageYOffset
		}
	};

	scrollStart = lastPageYOffset = App.cookie.qwe.scrollY;
	window.scrollTo(0,scrollStart);
	setTimeout(()=> {App.scrolledStart = true},666)
};

App.init=()=>{
	if(!App.titleNa){
		$("content").style="width:100vw;height:100vh;";

		var i = Math.floor(Math.random()*5);
		var div = document.createElement("div");
		div.style = "position:relative;width:100%;height:100%;background-image:url(static/media/{0}.jpg);background-position:center;background-size:contain;background-repeat:no-repeat;left:50%;transform:translateX(-50%)".format(i);
		$("content").insertBefore(div,$("content").firstChild);

		div.ontouchstart = ()=>audio.paused?audio.play():"";
		div.onmousedown = ()=>audio.paused?audio.play():"";
		div.ondblclick = ()=>audio.played?audio.pause():"";

		var div = document.createElement("div");
		div.style = "position:absolute;width:100vw;height:100vh;background-image:url(static/media/{0}.jpg);background-position:center;background-size:cover;filter:blur(3px);opacity:.666".format(i);
		$("content").insertBefore(div,$("content").firstChild);

		var audio = document.createElement("audio");
		audio.setAttribute("autoplay",true);
		audio.setAttribute("src","static/media/{0}.m4a".format(i));
		$("content").insertBefore(audio,$("content").firstChild);

		audio.addEventListener("timeupdate",function() {
			if (audio.ended) {window.location.reload()}
		})

	}else{
		App.cookie.name="qwe.{0}".format(App.titleNa);
		document.title=App.titleNa.toUpperCase().replace("-"," ");
		App.getcookie();

		var retry=1;
		/* fetch("dtb.webtoons.id.{0}.json".format(App.titleNa)).then(response=>response.json()).then(json=>App.epsInfo=json); */
		fetch('https://raw.githubusercontent.com/prowebtoons-thief/{0}/main/dtb.webtoon.id.{0}.json'.format(App.titleNa)).then(response=>response.json()).then(json=>App.epsInfo=json);
		const get_epsInfo=()=>{
			retry++;
			if(retry>999){window.location.search = "?t=";return(App.epsInfo)};
			if(!App.epsInfo){
				setTimeout(function(){get_epsInfo()},10);
				return(App.epsInfo)
			};
			$("epsisodeList").onchange=function(){
				App.referer(this.options[this.selectedIndex].value)
			};

			App.description();
			var episode = App.cookie.qwe.last_view;

			document.getElementsByName("viewport")[0].content="width=device-width,initial-scale=1.0,maximum-scale=2.0,minimum-scale=1.0,user-scalable=yes";
			var lch=$("epsisodeList");
			if(lch.length>1){Array.from(lch.options).slice(1).forEach(elem=>{elem.remove()})};
			lch.options[0].selected = true;
			Object.keys(App.epsInfo.epsInfo).sort().forEach(eps=>{
				var option=document.createElement("option");
				option.value=eps;
				option.text=App.epsInfo["epsInfo"][eps].title;
				option.rel="nofollow";
				if(eps==episode){option.selected=true};
				$("epsisodeList").add(option);
			});
			App.referer(episode)

		};
		get_epsInfo()
	}
};
App.init()
