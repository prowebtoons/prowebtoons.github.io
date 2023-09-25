/* main title */
    function tb5_makeArray(n){this.length=n;}function tb5_shuffle(arr){var k;for(var i=0;i<arr.length;i++){k=Math.round(Math.random()*(arr.length-i-1))+i;temp=arr[i];arr[i]=arr[k];arr[k]=temp;}return(arr);}var tb5_messages=new tb5_makeArray(4);tb5_messages[0]="Tetap Tersenyum :)";tb5_messages[1]="Senyum Itu Ibadah";tb5_messages[2]="Banyakin Skill";tb5_messages[3]="Bukan Bacot!!!";var tb5_rptType="infinite";var tb5_rptNbr=10;var tb5_speed=100;var tb5_delay=3000;var tb5_counter=1;var tb5_currMsg=0;var tb5_stsmsg="";var tb5_arr=new tb5_makeArray(tb5_messages[tb5_currMsg].length);var tb5_sts=new tb5_makeArray(tb5_messages[tb5_currMsg].length);for(var i=0;i<tb5_messages[tb5_currMsg].length;i++){tb5_arr[i]=i;tb5_sts[i]="_";}var tb5_arr=tb5_shuffle(tb5_arr);function tb5_init(n){var k;if(n==tb5_arr.length){if(tb5_currMsg==tb5_messages.length-1){if((tb5_rptType=='finite')&&(tb5_counter==tb5_rptNbr)){clearTimeout(tb5_timerID);return;}tb5_counter++;tb5_currMsg=0;}else{tb5_currMsg++;}n=0;tb5_arr=new tb5_makeArray(tb5_messages[tb5_currMsg].length);tb5_sts=new tb5_makeArray(tb5_messages[tb5_currMsg].length);for(var i=0;i<tb5_messages[tb5_currMsg].length;i++){tb5_arr[i]=i;tb5_sts[i]="_";}tb5_arr=tb5_shuffle(tb5_arr);tb5_sp=tb5_delay;}else{tb5_sp=tb5_speed;k=tb5_arr[n];tb5_sts[k]=tb5_messages[tb5_currMsg].charAt(k);tb5_stsmsg="";for(var i=0;i<tb5_sts.length;i++){tb5_stsmsg+=tb5_sts[i];}document.title=tb5_stsmsg;n++;}var tb5_timerID=setTimeout("tb5_init("+n+")",tb5_sp);}function tb5_randomizetitle(){tb5_init(0);}tb5_randomizetitle();

/* Custom Functions */
    if(!String.prototype.format){String.prototype.format=function(){var args=arguments;return(this.replace(/{(\d+)}/g,function(match,number){return(typeof args[number]!='undefined'?args[number]:match);}));}}
    if(!String.prototype.enc36){String.prototype.enc36=function(){var result="";for(i=0;i<this.length;i++){result+=this.charCodeAt(i).toString(36).padStart(2,'0')}return(result.toUpperCase());}}
    if(!String.prototype.dec36){String.prototype.dec36=function(){var e36=this.match(/.{1,2}/g)||[],result="";for(i=0;i<e36.length;i++){result+=String.fromCharCode(parseInt(e36[i],36))}return(result);}}
    if(!Number.prototype.enc){Number.prototype.enc=function(radix=36){return(this.toString(radix).toUpperCase());}}
    if(!String.prototype.dec){String.prototype.dec=function(radix=36){return(parseInt(this,radix));}}

    const gid = (id) => {return(document.getElementById(id));}
    const collator = new Intl.Collator(undefined, {numeric:true, sensitivity:'base'});
    const sleep = (delay) => {var start = new Date().getTime()+delay;while (new Date().getTime()<start);}
    const $_get = (k, v=true) => {
        match = RegExp("(?:\\?|&)({0})(?:=([\\w\\d-/]*)|&|$)".format(k),'g').exec(document.location.search);
        if (match) {res = {};res[match[1]] = match[2];if (v) {return(res[k]);}else {return(true);}}return(null);
    }
    const copytext = (text) => {
        var input = document.createElement('input');
        input.setAttribute('value', text);
        document.body.appendChild(input);
        input.select();
        var result = document.execCommand('copy');
        document.body.removeChild(input);
        return result;
    }
    const pars = (p1, p2, val, idx=1) => {
        if (val.includes(p1) && val.includes(p2)) {
            for (var i=0; i<idx; i++) {
                if (val.includes(p1)) val = val.slice(val.indexOf(p1)+p1.length);
            }
            return(val.slice(0, val.indexOf(p2)).trim());
        }
    }
    const setCookie = (name, value, xdays=7) => {
        var expires = "";
        if (xdays) {
            var date = new Date();
            date.setHours(23, 59, 59);
            date.setDate(date.getDate()+xdays);
            expires = "; expires={0}".format(date.toUTCString());
        }
        document.cookie = "{0}={1}{2}; path=/".format(name, (value||""), expires);
    }
    const getCookie = (name) => {
        var nameEQ = "{0}=".format(name);
        var ca = document.cookie.split(';');
        for (var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return(c.substring(nameEQ.length, c.length));
        }
        return(null);
    }


    var scrollTimer = null, scrollStart = null,
        mouseTimer = null, cursorVisible = true;
    function disappearScroll(x) {
        if (window.scrollY >= (document.body.scrollHeight - window.innerHeight)) {
            clearInterval(scrollTimer); scrollTimer=null
        } window.scrollTo(0, scrollStart); scrollStart += x;
    }
    const scroll_down = (x=1, t=2) => {
        if (scrollTimer) {clearInterval(scrollTimer);scrollTimer=null}
        else {scrollTimer = setInterval(function() {disappearScroll(x)}, t);}
        return({'x':x, 't':t})
    }
    function disappearCursor(){
        mouseTimer=null;
        document.body.style.cursor="none";
        cursorVisible=false
    }
    document.onmousemove=function(){
        if(mouseTimer){window.clearTimeout(mouseTimer)};
        if(!cursorVisible){document.body.style.cursor="default";cursorVisible = true}
        mouseTimer=window.setTimeout(disappearCursor,2000)
    }
    document.onkeydown = function(e) {
        if (e.keyCode == 123) {return false;}
        // if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {return false;}
        if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {return false;}
        if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {return false;}
        if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {return false;}
        if (e.ctrlKey && e.keyCode == 'S'.charCodeAt(0)) {return false;}
    }


    const hide = (id) => {return gid(id).style.display = "none"}
    const show = (id) => {return gid(id).style.display = "block"}
    const toggle = (id) => {return (gid(id).style.display==="none" ? show(id):hide(id))}

    const genToken = (length=64) => {
        randomHex = "";
        while (true) {randomHex += (Math.floor(Math.random() * 256)).toString(16).padStart(2, '0');if (randomHex.length>=length) {break}}
        return(randomHex);
    }


    const getChapter = (v) => {
        if (v) {document.getElementsByTagName("meta").chapter.content = v;}
        else {return(document.getElementsByTagName("meta").chapter.content);}
    }
    const nav = document.querySelector("nav");
    const nav_up = () => {
        if (Array.from(nav.classList).includes('nav-up')) {
            nav.classList.remove('nav-up')
        } else {nav.classList.add('nav-up')}
    }
    var lastScrollY = window.pageYOffset, scrolledStart = false;
    const scrolled = () => {
        if (!scrolledStart) return;
        var ScrollY = window.pageYOffset;
        var isnavup = Array.from(nav.classList).includes('nav-up');
        if (Math.abs(ScrollY - lastScrollY) > 10) {
            if (scrollY > lastScrollY) {if(!isnavup){nav.classList.add("nav-up");}}
            else {if(isnavup){nav.classList.remove('nav-up');}}
            lastScrollY = ScrollY;
        }
    }

    const onImgError = (img) => {
        img.setAttribute('src', '../img/404.jpeg')
        img.setAttribute('ondblclick',"reloadImg(this);");
        img.classList.add('error')

        img.setAttribute('onmousedown', "onHold(this)");
        img.setAttribute('onmouseup', "clearTimeout(timeout_id)");
        img.setAttribute('onmouseleave', "clearTimeout(timeout_id)");
    }
    const reloadImg=(imgTag)=>{
        var sortOrder=imgTag.getAttribute('data-sortOrder');
        var data_src = 'https://raw.githubusercontent.com/prowebtoons-thief/{0}/main/{1}/{2}_{3}.jpg'.format(app.manhwa, (getChapter()+'').padStart(3, '0'), app.epsInfo[getChapter()].episodeTitleHash, (sortOrder+'').padStart(3, '0'))
        /*imgTag.setAttribute('src',imgTag.getAttribute('data-src'));*/
        imgTag.setAttribute('src',data_src);
        imgTag.removeAttribute('ondblclick');
        imgTag.classList.remove('error');

        img.removeAttribute('onmousedown')
        img.removeAttribute('onmouseup')
        img.removeAttribute('onmouseleave')
    }
    var timeout_id = null, hold_time = 3000;
    const onHold = (img) => {
        timeout_id = setTimeout(function() {
            console.log( img.getAttribute('data-src') )
            window.open( img.getAttribute('data-src') )
        }, hold_time)
    }