/* Coded by aqil.almara - t.me/prudentscitus © 2024 */
const MCT_ProWebtoons = {
    title:Object.keys($.getSearchObject())[0],
    epsInfo:null,
    prev_eps:null,
    next_eps:null,
    client:{
        qwe:null,
        viewed:null,
        last_view:null
    },

    // full_data_src:"https://raw.githubusercontent.com/prowebtoons/webtoons/main/{0}/{1}/{2}.jpg",
    // full_data_src:"https://raw.githubusercontent.com/prowebtoons/webtoons/refs/heads/main/{0}/{1}/{2}.jpg",
    full_data_src:"https://raw.githubusercontent.com/prowebtoons/{0}/refs/heads/main/{1}/{2}.jpg",
    // full_data_src:"contents/{0}/{1}/{2}.jpg",
    lastScrollY:window.pageYOffset,
    scrolledStart:false,

    init:function() {
        this.content = $("section#content"),
        this.player = this.content.find("audio#player"),
        this.imageList = this.content.find("ul#imageList"),
        this.fixed_tool = this.content.find('section#fixed-tool'),
        this.progress_bar = this.fixed_tool.find('div#progress-bar'),
        this.btn_epsL = this.fixed_tool.find('div#list-Episode'),
        this.btn_audio = this.fixed_tool.find('div#btn-audio'),

        this.btn_scroll = this.fixed_tool.find('div#btn-scroll'),
        this.to_Top = this.btn_scroll.find('div#to-Top'),
        this.to_Down = this.btn_scroll.find('div#to-Down'),

        this.footer_bar = this.fixed_tool.find('div#footer-bar'),
        this.to_Prev = this.footer_bar.find('div#to-Prev'),
        this.to_Next = this.footer_bar.find('div#to-Next'),
        this.opt_episode = this.footer_bar.find('select#opt-Episode'),

        this.sortalist = this.content.find("section#sortalist"),
        this.dashboard = this.content.find("section#dashboard");

        // Initial call to set the progress bar width
        this.updateProgress();
        this.imageList.attr("onclick", "MCT_ProWebtoons.fixedTool();");

        this.scrolling = false;
        var windowHeight = window.innerHeight;
        var scrollTo = function(to=0) {window.scrollTo({top: to, behavior: 'smooth'})};
        this.to_Top.on('click', function(event) {
            event.preventDefault();
            scrollTo()
        });
        this.to_Down.on('click', function(event) {
            event.preventDefault();
            var currentScroll = window.scrollY;
            while(currentScroll<document.body.scrollHeight -windowHeight){
                currentScroll+=windowHeight*2,scrollTo(currentScroll)
            }
        });
        this.btn_audio.on('click', function() {
            event.preventDefault();
            var player = MCT_ProWebtoons.player.e,
            btn_audio = MCT_ProWebtoons.btn_audio;
            player.paused?(btn_audio.removeClass('off'),player.play()):(btn_audio.addClass('off'),player.pause())
        })

        if(!this.title){
            // var lt = {}
            // Object.keys(localStorage).forEach(n=>{lt[n.match(/\.(.*)/s)[1]]=''})

            $.view_ajax(`${location.origin}/listmanhwa.json`).then(listmanhwa => {
                var ul = $("<ul>")
                Object.keys(listmanhwa).forEach((st, i)=> {
                    console.log(st, i)
                    var unread = parseInt(localStorage[`total.${st}`]) - parseInt(localStorage[`last_view.${st}`])
                    var li = $("<li>").append($("<a>")
                        .addClass('series').addClass(`s${(unread>99?'_':unread)}`)
                        .attr('href', `?${st}`).html(Object.values(listmanhwa)[i]||st).e)
                    ul.append(li.e)
                });
                this.sortalist.append(ul.e).show()
            }).catch(e=>{console.error(e)});
        }
        else{
            if ($.getSearchObject().remcha) {
                ['qwe', 'viewed', 'last_view'].forEach(k=>{localStorage.removeItem(`${k}.${this.title}`)});
                window.location.search = window.location.search.replace('remcha', '')
            };
            document.title=this.title.toUpperCase().replaceAll("-"," ");

            this.client.qwe = JSON.parse(localStorage[`qwe.${this.title}`]||'{}');
            this.client.viewed = (v=localStorage[`viewed.${this.title}`])?v.match(/[0-9]{3}/g):[];
            this.client.last_view = localStorage[`last_view.${this.title}`]||'';

            // $.view_ajax(`./manhwa/git_dtb.webtoon.id.${this.title}.json`).then(manhwa => {
            $.view_ajax(`https://raw.githubusercontent.com/prowebtoons/${this.title}/refs/heads/main/id.${this.title}.json`).then(manhwa => {
                this.epsInfo = manhwa;

                this.opt_episode.on("change", function(){
                    MCT_ProWebtoons.referer(this.options[this.selectedIndex].value)
                });

                this.setDashboard();
                var episode = this.client.last_view;

                $("meta[name='viewport']").attr('content', "width=device-width,initial-scale=1.0,maximum-scale=2.0,minimum-scale=1.0,user-scalable=yes")

                var lch = this.opt_episode.e;
                if(lch.length>1){Array.from(lch.options).slice(1).forEach(elem=>{elem.remove()})};
                lch.options[0].selected = true;
                Object.keys(this.epsInfo.episodeList).forEach(eps=>{
                    var option=$("<option>").attr("value", eps).e;
                    option.text=this.epsInfo.episodeList[eps].episodeName;
                    option.rel="nofollow";
                    if(eps==episode){option.selected=true};
                    lch.append(option);
                });
                this.referer(episode)
            }).catch(e=>{console.error(e)});
            // window.location.search = "";

            // fetch(`https://raw.githubusercontent.com/prowebtoons-thief/${this.title}/main/dtb.webtoon.id.${this.title}.json`).then(r=>r.ok?r.json():Promise.reject(`HTTP error! status: ${r.status}`)).then(j=>this.epsInfo=j).catch(e=>console.error('Failed to fetch JSON:',e));
            // fetch('https://raw.githubusercontent.com/prowebtoons-thief/{0}/main/dtb.webtoon.id.{0}.json'.format(App.titleNa)).then(response=>response.json()).then(json=>App.epsInfo=json);
            // fetch(`./${this.title}.json`).then(r=>r.ok?r.json():Promise.reject(`HTTP error! status: ${r.status}`)).then(j=>{this.epsInfo=j}).catch(e=>console.error('Failed to fetch JSON:',e));
        }
    }
}

MCT_ProWebtoons.updateProgress=function(){
    var pathLength = $('#fixed-tool #progress').width();
    var scroll = window.scrollY;
    var height = document.body.scrollHeight - window.innerHeight;

    // Calculate the new width of the progress bar
    var newWidth = (scroll / height) * pathLength;
    this.progress_bar.width(newWidth);
}
MCT_ProWebtoons.getChapter=function(v){
    const chapterMetaTag=$("meta[name='chapter']");
    if(v)chapterMetaTag.attr("content",v);
    return chapterMetaTag.attr("content").padStart(3, 0)
}
MCT_ProWebtoons.scrolled=function(){if(!this.scrolledStart)return;this.updateProgress();var ScrollY=window.pageYOffset;if(Math.abs(ScrollY-this.lastScrollY)>=10){if(this.scrolling||(ScrollY>this.lastScrollY&&this.fixedTool(1).active))this.fixedTool(1).hide();this.lastScrollY=ScrollY}}
MCT_ProWebtoons.fixedTool=function(s=0){var active=(this.to_Prev.attr('class')||'').includes('active');if(s==1){return{active:active,show:()=>{this.btn_epsL.addClass('active'),this.btn_audio.addClass('active'),this.to_Top.addClass('active'),this.to_Down.addClass('active'),this.to_Prev.addClass('active'),this.to_Next.addClass('active'),this.opt_episode.addClass('active')},hide:()=>{this.btn_epsL.removeClass('active'),this.btn_audio.removeClass('active'),this.to_Top.removeClass('active'),this.to_Down.removeClass('active'),this.to_Prev.removeClass('active'),this.to_Next.removeClass('active'),this.opt_episode.removeClass('active')}}}if(!active)this.fixedTool(1).show();else this.fixedTool(1).hide()}
MCT_ProWebtoons.referer=function(eps){if(!Object.keys(this.epsInfo.episodeList).includes(eps)){$('#dashboard').show();return}document.title=`#${eps} .... ${this.epsInfo.episodeList[eps].episodeName}`;if(eps!==this.client.last_view){this.client.last_view=eps;this.client.qwe.thumb_img=0;this.client.qwe.scrollY=0;window.scrollTo(0,0)}$('#dashboard').hide();$('#fixed-tool').show();this.imageList.show();localStorage.setItem(`qwe.${this.title}`,JSON.stringify(this.client.qwe));localStorage.setItem(`last_view.${this.title}`,this.client.last_view);localStorage.setItem(`total.${this.title}`,Object.keys(this.epsInfo.episodeList).length);this.load_content(eps);this.progress_bar.width(1)}
MCT_ProWebtoons.setImage=function(index){var imgTag=$("ul#imageList li img").get(index),wh=Math.max(window.innerHeight*3.1,window.innerHeight*3.1+imgTag.e.offsetHeight), iph=imgTag.e.offsetTop+imgTag.e.offsetHeight;if(window.scrollY-wh<=iph&&iph<=window.scrollY+wh){var data_src=imgTag.attr("data-imglink")||this.full_data_src.format(this.title,this.getChapter(),imgTag.attr("data-fname"));this.client.qwe.thumb_img=parseInt(imgTag.attr("data-sortOrder"));var isrc=imgTag.attr("src");if(isrc&&isrc!==data_src&&window.scrollY>=imgTag.e.offsetTop&&window.scrollY<=imgTag.e.offsetTop+imgTag.e.offsetHeight)this.reloadImg(index);else if(!isrc)imgTag.attr("src",data_src)}}
MCT_ProWebtoons.onImgError=function(index){var imgTag=$("ul#imageList li img").get(index);imgTag.attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVQYGWMAAQAABQAB8C9sxAAAAABJRU5ErkJggg==");imgTag.attr("ondblclick",`MCT_ProWebtoons.reloadImg(${index});`);imgTag.addClass("error");imgTag.on('longpress',()=>{var link=imgTag.attr("data-imglink")||this.full_data_src.format(this.title,this.getChapter(),imgTag.attr("data-fname"));window.open(link);},5E+3)}
MCT_ProWebtoons.reloadImg=function(index){var imgTag=$("ul#imageList li img").get(index),data_src=imgTag.attr("data-imglink")||this.full_data_src.format(this.title,this.getChapter(),imgTag.attr("data-fname"));imgTag.attr("src",data_src);imgTag.attr("ondblclick",null);imgTag.removeClass("error")}
MCT_ProWebtoons.setDashboard=function(){
    window.onscroll = function() {MCT_ProWebtoons.updateProgress()}

    var genre = this.epsInfo.genreName, tag_genre = this.dashboard.find('h2.genre');
    tag_genre.html(genre);tag_genre.addClass(`g_${genre.toLocaleLowerCase()}`);

    this.dashboard.find('h1.title').html(this.epsInfo.titleName);
    this.dashboard.find('p.summary').html((this.epsInfo.synopsis||'').replaceAll("\n", "<br>"));

    var ul = $("<ul>");
    Object.keys(this.epsInfo.episodeList).forEach(eps=>{
        var a = $("<div>").attr('title', this.epsInfo.episodeList[eps].episodeName);
        if(this.client.viewed&&this.client.viewed.includes(eps)) a.addClass("visited");
        a.attr("onclick", `MCT_ProWebtoons.referer("${eps}")`);

        a.append($("<span>").addClass('chtitle').html(this.epsInfo.episodeList[eps].episodeName||`Chapter ${eps}`).e)
        a.append($("<span>").addClass('date').html(new Date(this.epsInfo.episodeList[eps].presentYmdt||new Date().getTime()).toDateString()).e)
        a.append($("<span>").addClass('tx').html(`#${parseInt(eps)}`).e)
        ul.append($("<li>").attr("data-episode-no", parseInt(eps)).append(a.e).e)
    });
    this.dashboard.find('div.detail_lst').html(" ").append(ul.e),
    this.fixed_tool.hide(),this.imageList.hide(),this.dashboard.show(),
    window.scrollTo(0,0);
}
MCT_ProWebtoons.load_content=function(episode){
    const _0x1ac87b=_0x56ba;(function(_0xf28f3a,_0x293015){const _0x2fc6b2=_0x56ba,_0x9072d7=_0xf28f3a();while(!![]){try{const _0x23f369=-parseInt(_0x2fc6b2(0xfa))/0x1+-parseInt(_0x2fc6b2(0xf9))/0x2+-parseInt(_0x2fc6b2(0xfd))/0x3+parseInt(_0x2fc6b2(0xe4))/0x4+-parseInt(_0x2fc6b2(0xf4))/0x5+parseInt(_0x2fc6b2(0xee))/0x6+parseInt(_0x2fc6b2(0xfe))/0x7;if(_0x23f369===_0x293015)break;else _0x9072d7['push'](_0x9072d7['shift']());}catch(_0x293c5b){_0x9072d7['push'](_0x9072d7['shift']());}}}(_0x2f90,0xac8d0));const firebaseConfig={'apiKey':'AIzaSyDMiO0chCHHPFRAjDdqhcvYAYyhvatWPgc','authDomain':'webtoon-reader-15191.firebaseapp.com','projectId':_0x1ac87b(0xf7),'storageBucket':_0x1ac87b(0xf2),'messagingSenderId':_0x1ac87b(0xeb),'appId':_0x1ac87b(0xe8),'measurementId':'G-RPCM7MKJBJ'};function _0x2f90(){const _0x1b9567=['error','Jumlah\x20pembaca\x20berhasil\x20diperbarui\x20menjadi:','1:906980261628:web:743a99babb58d10a6b2179','runTransaction',this.title,'906980261628','get','getTime','6918498BRHMUl','doc','collection','firestore','webtoon-reader-15191.firebasestorage.app','catch','5004160HlSACT','reject',episode,'webtoon-reader-15191','then','1135304KywMGX','315653ZZkjJf','HTTP\x20error!\x20status:\x20','update','3113835mWUaDt','13269837wOBUYC','data','2320304LcJwmj','https://api.ipgeolocation.io/v2/ipgeo?apiKey=680a1baad37d4b08b694de099b1cb1c1'];_0x2f90=function(){return _0x1b9567;};return _0x2f90();}firebase['initializeApp'](firebaseConfig);const db=firebase[_0x1ac87b(0xf1)](),episodeDocRef=db[_0x1ac87b(0xf0)]('views')[_0x1ac87b(0xef)](_0x1ac87b(0xea)),dataname=_0x1ac87b(0xf6);function _0x56ba(_0x4845d3,_0x12e20c){const _0x2f9067=_0x2f90();return _0x56ba=function(_0x56ba08,_0x199083){_0x56ba08=_0x56ba08-0xe4;let _0x2d72ee=_0x2f9067[_0x56ba08];return _0x2d72ee;},_0x56ba(_0x4845d3,_0x12e20c);}db['runTransaction'](_0x242afa=>_0x242afa[_0x1ac87b(0xec)](episodeDocRef)[_0x1ac87b(0xf8)](_0x3b6619=>{const _0x2fe5c3=_0x1ac87b,_0x1e9644=_0x3b6619['exists']?_0x3b6619['data']()?.[dataname]||0x0:0x0,_0x28ac16=_0x1e9644+0x1;return _0x242afa[_0x2fe5c3(0xfc)](episodeDocRef,{[dataname]:_0x28ac16}),_0x28ac16;}))[_0x1ac87b(0xf8)](_0x319bd1=>{const _0x155d68=_0x1ac87b;console['log'](_0x155d68(0xe7),_0x319bd1);})[_0x1ac87b(0xf3)](_0x1fb68a=>{const _0xc65d56=_0x1ac87b;console[_0xc65d56(0xe6)]('Error\x20updating\x20view\x20count:\x20',_0x1fb68a);}),fetch(_0x1ac87b(0xe5))[_0x1ac87b(0xf8)](_0x52cdd2=>_0x52cdd2['ok']?_0x52cdd2['json']():Promise[_0x1ac87b(0xf5)](_0x1ac87b(0xfb)+_0x52cdd2['status']))['then'](_0x2cce41=>{const _0x4d9a88=_0x1ac87b;usersDocRef=db[_0x4d9a88(0xf0)]('users')['doc'](_0x4d9a88(0xff)),db[_0x4d9a88(0xe9)](_0x27c46e=>_0x27c46e[_0x4d9a88(0xec)](usersDocRef)['then'](_0x2a27fb=>{const _0x1fd7c5=_0x4d9a88;_0x27c46e[_0x1fd7c5(0xfc)](usersDocRef,{[new Date()[_0x1fd7c5(0xed)]()]:_0x2cce41});}));});
    
    this.getChapter(episode);
    Array.from(this.opt_episode.find('option').e).slice(1).forEach(e=>{
        if (e.value==episode) e.selected=true;
    });
    this.prev_eps = (""+(parseInt(episode)-1));
    this.next_eps = (""+(parseInt(episode)+1));
    // console.log(MCT_ProWebtoons.prev_eps, MCT_ProWebtoons.next_eps)
    if(Object.keys(this.epsInfo.episodeList).indexOf(this.prev_eps)>=0){
        this.to_Prev.show();
        this.to_Prev.on('click', ()=>{
            MCT_ProWebtoons.referer(MCT_ProWebtoons.prev_eps)
        })
    } else this.to_Prev.hide();
    if(Object.keys(this.epsInfo.episodeList).indexOf(this.next_eps)>=0){
        this.to_Next.show();
        this.to_Next.on("click", ()=>{
            MCT_ProWebtoons.referer(MCT_ProWebtoons.next_eps)
        })
    }else this.to_Next.hide();

    var imageList=$("ul#imageList").e.getElementsByTagName("li");
    if (imageList.length) Array.from(imageList).forEach(elem=>{elem.remove()});
    for (i=0;i<(this.epsInfo.episodeList[episode].imageList||[]).length;i++) {
        var img_ctn = $("<img>");
        img_ctn.attr("onerror", `MCT_ProWebtoons.onImgError(${i});`);
        img_ctn.attr("oncontextmenu", "return false;");
        img_ctn.attr("data-sortOrder", `${i+1}`);

        var imgI = this.epsInfo.episodeList[episode].imageList[i];
        if (imgI.height>0) {
            img_ctn.attr("width", imgI.width);
            img_ctn.attr("height", imgI.height *(window.innerWidth /imgI.width))
        } else img_ctn.style('min-height: 240px;');
        if (imgI.sortName) img_ctn.attr("data-fname", imgI.sortName);
        else if (imgI.link) img_ctn.attr("data-imglink", imgI.link);

        var li_img = $("<li>");
        this.imageList.append(li_img.append(img_ctn.e).e)
    };

    this.content.attr('onclick', null)
    if (!this.epsInfo.episodeList[episode].imageList) {
        this.content.attr('onclick', "MCT_ProWebtoons.fixedTool();")
        console.error(`Image not found in ${this.epsInfo.episodeList[episode].episodeName}`);
        return
    }

    var thumb_img = this.client.qwe.thumb_img||3;
    for (var i=Math.max(0,thumb_img-3);i<thumb_img;i++) {this.setImage(i)};

    var scrollStart,lastPageYOffset=window.pageYOffset;
    window.onscroll = function() {
        MCT_ProWebtoons.scrolled();

        for (var i=0;i<imageList.length;i++) {MCT_ProWebtoons.setImage(i)};

        if (window.scrollY>=(document.body.scrollHeight-window.innerHeight*1.1)) {
            if (!MCT_ProWebtoons.client.viewed.includes(episode)) {
                MCT_ProWebtoons.client.viewed.push(episode);
                localStorage.setItem(`viewed.${MCT_ProWebtoons.title}`, MCT_ProWebtoons.client.viewed.join(''))
            };
            MCT_ProWebtoons.fixedTool(1).show()
        }

        MCT_ProWebtoons.client.qwe.scrollY = scrollStart = window.scrollY;
        if (Math.abs(window.pageYOffset-lastPageYOffset)>=100) {
            localStorage.setItem(`qwe.${MCT_ProWebtoons.title}`, JSON.stringify(MCT_ProWebtoons.client.qwe))
            lastPageYOffset = window.pageYOffset
        }
    };

    (undefined===this.epsInfo.episodeList[episode].audio?
        (this.player.attr('src',''),this.btn_audio.hide()):
        (this.player.attr('src',`./audio/${this.epsInfo.episodeList[episode].audio}`),this.btn_audio.show(),this.btn_audio.e.click()))

    scrollStart = lastPageYOffset = this.client.qwe.scrollY;
    window.scrollTo(0,scrollStart);
    setTimeout(()=>{this.scrolledStart=true},666)
}

document.addEventListener("DOMContentLoaded", ()=>{
    // (function() {"use strict"})();
    MCT_ProWebtoons.init()
});
