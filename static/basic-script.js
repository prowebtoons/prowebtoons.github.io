/* Coded by aqil.almara - t.me/prudentscitus © 2024 */
if(!String.prototype.format){String.prototype.format=function(){var a=arguments;return this.replace(/{(\d+)}/g,function(m,n){return typeof a[n]!="undefined"?a[n]:m})}}
function $(s){var d=document,t=(s.match(/<.*>/g)||[""])[0].slice(1,-1);s=t?d.createElement(t):d.querySelectorAll(s);return new Elements(typeof s==='object'?s:s)}
function Elements(e){this.e=(e.length>1)?e:(e[0]||e);this.l={}}
Elements.prototype={
    addClass:function(c){return this.e.classList.add(c),this},
    removeClass:function(c){return this.e.classList.remove(c),this},
    style:function(s){return s?(this.e.style=s,this):this.e.style},
    html:function(h){return h?(this.e.innerHTML=h,this):this.e.innerHTML},
    append:function(c){return this.e.appendChild(c),this},
    remove:function(c){return this.e.removeChild(c),this},
    attr:function(n,v){return v===undefined?this.e.getAttribute(n):(v===null?this.e.removeAttribute(n):this.e.setAttribute(n,v),this)},

    // attr:function(n,v){return v===null?this.e.removeAttribute(n):v===undefined?this.e.getAttribute(n):(this.e.setAttribute(n,v),this)},
    css:function(p,v){return v?(this.e.style[p]=v,this):this.e.style[p]},
    get:function(i){return new Elements(this.e[i])},
    find:function(s){return new Elements(this.e.querySelectorAll(s))},
    show:function(){return this.e.style.display="block",this},
    hide:function(){return this.e.style.display="none",this},
    toggle:function(){return this.e.style.display=this.e.style.display=="none"?"block":"none",this},
    insertBefore:function(s){const t=document.querySelector(s);t.parentNode.insertBefore(this.e,t);return this},
    off:function(e,c){return this.e.removeEventListener(e,c),this},
    on:function(e,c,t=3000){if(this.l[e])this.off(e,this.l[e]);this.l[e]=c;if(e==="longpress"){let o,cancel=()=>clearTimeout(o);this.e.ontouchstart=()=>{o=setTimeout(()=>{o=null;c()},t)};this.e.onmousedown=()=>{o=setTimeout(()=>{o=null;c()},t)};this.e.ontouchend=this.e.onmouseup=this.e.ontouchmove=this.e.onmouseleave=cancel}else this.e.addEventListener(e,c);return this},
    width:function(w){return w?(this.e.style.width=`${w}px`,this):this.e.offsetWidth},
    height:function(h){return h?(this.e.style.height=`${h}px`,this):this.e.offsetHeight}
};
$.cookie=function(n,v,o){if(typeof v!="undefined"){o=o||{};if(v===null){v="";o.expires=-1}var e="";if(o.expires){var d;if(typeof o.expires=="number"){d=new Date();d.setHours(23,59,59);d.setDate(d.getDate()+o.expires)}else{d=o.expires}e=";expires="+d.toUTCString()}document.cookie=[n,"=",encodeURIComponent(v),e,";path="+(o.path||"/"),(o.domain?";domain="+o.domain:""),(o.secure?";secure":"")].join("")}else{var r=new RegExp("(?:; )?"+n+"=([^;]*);?");return r.test(document.cookie)?decodeURIComponent(RegExp.$1):null}};
$.getSearchObject=function(){if(location.search==="")return{};var o={};location.search.substr(1).split("&").forEach(pair=>{var[k,v]=pair.split("=");k=decodeURIComponent(k),v=decodeURIComponent(v)||null;if(o[k]){if(!(o[k]instanceof Array))o[k]=[o[k]];o[k].push(v)}else o[k]=v});return o};
$.createElements=(e,p)=>{e.forEach((e)=>{const t=document.createElement(e.tag);if(e.attrs){Object.keys(e.attrs).forEach((a)=>{t.setAttribute(a,e.attrs[a])})}if(e.children){e.children.forEach((c)=>{if(typeof c==="string"){t.innerHTML=c}else if(typeof c==="object"){$.createElements([c],t)}})}p.appendChild(t)})};
$.createEvalCSS=(s,r)=>{const t=document.querySelector("style");if(t){t.insertAdjacentText("beforeend",`${s}{${r}}`)}else{console.error("No style element found.")}};
$.view_ajax=(url)=>{return new Promise((resolve,reject)=>{fetch(url).then(response=>{if(!response.ok){throw new Error(`HTTP error! status: ${response.status}`)}return response.text()}).then(responseText=>{try{resolve(JSON.parse(responseText))}catch(error){reject(error.message)}}).catch(error=>{reject(error.message)})})}

var mouseTimer=null,cursorVisible=true;document.onmousemove=()=>{if(mouseTimer){window.clearTimeout(mouseTimer)}if(!cursorVisible){document.documentElement.style.cursor="default";cursorVisible=true}mouseTimer=window.setTimeout(()=>{mouseTimer=null;document.documentElement.style.cursor="none";cursorVisible=false},3E3)};
// document.onkeydown=(e)=>{if(e.ctrlKey&&e.shiftKey&&["C","J","I"].includes(e.key.toUpperCase())){return false}if(e.ctrlKey&&["C","S","U"].includes(e.key.toUpperCase())){return false}};
