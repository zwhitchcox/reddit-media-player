'use strict';
app.controller('Ctrl', ['$scope', '$http', '$routeParams', 'Menu',
  function($scope, $http, $routeParams, Menu) {
    $scope.menu = Menu
    $scope.clearCache = function() {
      localStorage['ids'] = ""
    }
    $scope.ytonly = function(fn) {
      Menu.YouTubeOnly = !Menu.YouTubeOnly
      fn()
    }
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
