'use strict';
app.controller('Ctrl', ['$scope', '$http', '$routeParams', 'Menu',
  function($scope, $http, $routeParams, Menu) {
    window.globalStop = true
    if (window.speechSynthesis !== undefined) {
      window.speechSynthesis.cancel()
    } else {
      if (window.aud !== undefined) {
        window.aud.pause()
      }

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
        'AskScience'
      ],
      text: [
        'Jokes',
        'TIFU'
      ],
      images: [
        'Funny',
        'Gifs',
        'Pics',
        'WTF'
      ]
    }
    $("[name='my-checkbox']").bootstrapSwitch({
      size:'mini'
    })
    .on('switchChange.bootstrapSwitch', function(event, state) {
       $scope.$apply($scope.omitRedundancies = state)
    })
  }])



function apitts(txt,cb) {
  if (window.aud !== undefined && window.aud !== null) {window.aud.pause()}
  window.aud = new Audio("http://tts-api.com/tts.mp3?r=10&q=" + encodeURIComponent(txt))
  window.aud.play()
  window.aud.addEventListener('ended',cb, false)
}
function nativetts(txt,cb) {
  var chunkLength = 150;
  var pattRegex = new RegExp('^[\\s\\S]{' + Math.floor(chunkLength / 2) + ',' + chunkLength + '}[.!?,]{1}|^[\\s\\S]{1,' + chunkLength + '}$|^[\\s\\S]{1,' + chunkLength + '} ');

  if (window.globalStop) {
    return
  }
  var arr = [];
  var element = this;
  while (txt.length > 0) {
      arr.push(txt.match(pattRegex)[0]);
      txt = txt.substring(arr[arr.length - 1].length);
  }
  $.each(arr, function () {
      var u = new SpeechSynthesisUtterance(this.trim())
      // dumb-ios u.rate = 0.5
      u.voice = window.speechSynthesis.getVoices().filter(function(voice) { return voice.name == 'Alex'; })[0];
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
