'use strict';
app.controller('Ctrl', ['$scope', '$http', '$routeParams', 'Menu',
  function($scope, $http, $routeParams, Menu) {
    if (window.speechSynthesis !== undefined) {
      window.speechSynthesis.cancel()
    } else {
      window.aud.pause()
    }
    $scope.menu = Menu
    $scope.menu.btns =[]
    $scope.menu.YouTubeOnly =  false
    $scope.menu.txtBtns = []
    $scope.clearCache = function() {
      localStorage[Menu.sub+'ids'] = ""
    }
    $scope.ytonly = function(fn) {
      Menu.YouTubeOnly = !Menu.YouTubeOnly
      fn()
    }
    function getSubsFromStorage() {
      var subs;
      if (localStorage['custsubs'] === null || localStorage['custsubs'] === undefined || localStorage['custsubs'] === "") {
        subs = [];
      } else {
        subs = JSON.parse(localStorage["custsubs"]);
      }
      return subs
    }
    $scope.custsubs = getSubsFromStorage()
    $scope.subs = {
      audvid: [
        'Videos',
        'Music',
        'ListenToThis'
      ],
      comments: [
        'AskReddit',
        'AskScience'
      ],
      text: [
        'Jokes',
        'TIFU'
      ],
      images: [
        'funny',
        'diy'
      ]
    }
    $("[name='my-checkbox']").bootstrapSwitch({
      size:'mini'
    })
    .on('switchChange.bootstrapSwitch', function(event, state) {
       $scope.$apply($scope.omitRedundancies = state)
    })
  }])


var chunkLength = 150;
var pattRegex = new RegExp('^[\\s\\S]{' + Math.floor(chunkLength / 2) + ',' + chunkLength + '}[.!?,]{1}|^[\\s\\S]{1,' + chunkLength + '}$|^[\\s\\S]{1,' + chunkLength + '} ');
var u = new SpeechSynthesisUtterance()
u.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == 'Alex'; })[0];

function apitts(txt,cb) {
  if (window.aud !== undefined && window.aud !== null) {window.aud.pause()}
  window.aud = new Audio("http://tts-api.com/tts.mp3?q=" + encodeURIComponent(txt))
  window.aud.play()
  window.aud.addEventListener('ended',cb, false)
}
function nativetts(txt,cb) {
  var arr = [];
  var element = this;
  while (txt.length > 0) {
      arr.push(txt.match(pattRegex)[0]);
      txt = txt.substring(arr[arr.length - 1].length);
  }
  $.each(arr, function () {
      var u = new SpeechSynthesisUtterance(this.trim())
      u.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == 'Alex'; })[0];
      window.speechSynthesis.speak(u)
      u.onend = cb
  })

}
function getIDsFromStorage(sub) {
  var ids;
  if (localStorage[sub+'ids'] === null || localStorage[sub+'ids'] === undefined || localStorage[sub+'ids'] === "") {
    ids = [];
  } else {
    ids = JSON.parse(localStorage[sub+"ids"]);
  }
  return ids
}
function addIDToStorage (id,sub) {
  var ids;
  if (localStorage[sub+'ids'] === null || localStorage[sub+'ids'] === undefined || localStorage[sub+'ids'] === "") {
    ids = [];
  } else {
    ids = JSON.parse(localStorage[sub+"ids"]);
  }
  if (!~ids.indexOf(id)) {
    ids.push(id)
    localStorage[sub+"ids"] = JSON.stringify(ids);
  }
}
function weirdImgurFn() {
  var imcon;!function(){imcon={_:{checked:!1,con:!1,conFuncs:["assert","clear","count","debug","dir","dirxml","error","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","table","time","timeEnd","timeline","timelineEnd","timeStamp","trace","warn"]},_getCon:function(a){return a||(a="log"),imcon._.checked||("object"==typeof console&&"function"==typeof console.log&&(imcon._.con=console),imcon._.checked=!0),imcon._.con&&"function"==typeof imcon._.con[a]?imcon._.con:!1},_makeFunc:function(a){imcon[a]=function(){return imcon._wrapped(a,arguments)}},_wrapped:function(a,b){var c=imcon._getCon(a);return c?c[a].apply(c,b):void 0}};for(var a=imcon._.conFuncs,b=a.length,c=0;b>c;c++)imcon._makeFunc(a[c])}(),function(){var a,b,c,d,e=function(){var a=document.getElementsByTagName("script");for(var b in a){var c=/^(http(s)?:){0,1}\/\/([a-z]{1,9}\.)*?(imgur(-dev)?.com)/.exec(a[b].src);if(c)return-1===c[0].indexOf("//s.imgur.com")?c[0]:c[1]?c[1]+"//imgur.com":window.location.protocol+"//imgur.com"}},f=window,g=document,h=g.documentElement,i=g.getElementsByTagName("body")[0],j=(f.innerWidth||h.clientWidth||i.clientWidth,500),k=g.createElement("iframe"),l=e(),m=540,n=200,o=f.addEventListener?"addEventListener":"attachEvent",p=f[o],q="attachEvent"==o?"onmessage":"message";p(q,function(a){var b=JSON.parse(a.data);"resize_imgur"===b.message&&b.href===k.src?s(b.height):"404_imgur_embed"===b.message&&b.href===k.src&&s(n)},!1);var r=function(a){var b=g.getElementsByTagName("head")[0],c=g.createElement("style");c.type="text/css",c.styleSheet?c.styleSheet.cssText=a:c.appendChild(g.createTextNode(a)),b.appendChild(c)},s=function(a){var b="."+d+" { height: "+a+"px !important;width:"+c+"px !important;}";r(b)},t=function(){var a=".imgur-embed-iframe-pub { box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.10); border: 1px solid #ddd; border-radius: 2px;}";r(a)},u=function(a,b,d){var e=[l,d,"embed"].join("/"),f="ref="+(window.location.origin||window.location.protocol+"//"+window.location.hostname+(window.location.port?":"+window.location.port:""));return a?(e+="?pub=true&"+f,"false"===b&&(e+="&context=false")):e+="false"===b?"?context=false&"+f:"?"+f,e+"&w="+c},v=function(e){if(e){var f,h,i,l;try{b=e.getAttribute("data-context")||"true",f=e.getAttribute("data-id"),h=0===f.indexOf("a/"),l=e.parentNode.offsetWidth}catch(n){return void imcon.error(n)}var o=function(){try{return g.createEvent("TouchEvent"),!0}catch(a){return!1}};a=o()?300:400,t(),k.setAttribute("allowfullscreen",!0),k.setAttribute("mozallowfullscreen",!0),k.setAttribute("webkitallowfullscreen",!0),k.style.height=j+"px",c=m>l?a>l?a:l:m,k.style.width=c+"px",d="imgur-embed-iframe-pub-"+f.replace("/","-")+"-"+b+"-"+c,k.className="imgur-embed-iframe-pub "+d,k.style.margin="10px 0px",k.style.padding=0,k.scrolling="no",i=u(h,b,f),k.src=i,k.id="imgur-embed-iframe-pub-"+f,e.parentNode.replaceChild(k,e)}};v(g.querySelector("blockquote.imgur-embed-pub"))}();
}
