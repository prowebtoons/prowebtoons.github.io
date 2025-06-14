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
        a.append($("<span>").addClass('date').html(new Date(this.epsInfo.episodeList[eps].presentYmdt *1E3||new Date().getTime()).toDateString()).e)
        a.append($("<span>").addClass('tx').html(`#${parseInt(eps)}`).e)
        ul.append($("<li>").attr("data-episode-no", parseInt(eps)).append(a.e).e)
    });
    this.dashboard.find('div.detail_lst').html(" ").append(ul.e),
    this.fixed_tool.hide(),this.imageList.hide(),this.dashboard.show(),
    window.scrollTo(0,0);
}
MCT_ProWebtoons.load_content=function(episode){
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
