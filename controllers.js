'use strict';
app.controller('CommentsCtrl', ['$scope', '$http', '$routeParams',
  function($scope, $http, $routeParams) {

  }])
app.controller('TextCtrl', ['$scope', '$http', '$routeParams',
  function($scope, $http, $routeParams) {

  }])
app.controller('VideosCtrl', ['$scope', '$http', '$routeParams',
  function($scope, $http, $routeParams) {
    $scope.sub = $routeParams.sub
    function getJsonFromUrl(query) {
      var result = {};
      query.split("&amp;").forEach(function(part) {
        var item = part.split("=");
        result[item[0]] = decodeURIComponent(item[1]);
      });
      return result;
    }
    $scope.omitRedundancies = true

    $scope.getVids = function() {
      $http.jsonp('http://www.reddit.com/r/'+$routeParams.sub+'.json?limit=100&jsonp=JSON_CALLBACK')
        .success(function(res) {
          $scope.permalinks = {}
          $scope.vids = res.data.children.reduce(function(prev,cur) {
            if (/^https?:\/\/(www\.)?youtube/.test(cur.data.url)) {
              var id;
              if (cur.data.url[4] === 's') {
                id = getJsonFromUrl(cur.data.url.substr(30)).v
              } else{
                id = getJsonFromUrl(cur.data.url.substr(29)).v
              }
              var ids;
              if (localStorage['ids'] === null || localStorage['ids'] === undefined || localStorage['ids'] === "") {
                ids = [];
              } else {
                ids = JSON.parse(localStorage["ids"]);
              }
              if (!~ids.indexOf(id) || !$scope.omitRedundancies) {
                prev.push(id)
              }
              $scope.permalinks[id] = {title:cur.data.title,uri:cur.data.permalink}
              return prev
            } else {
              return prev
            }
          },[])
          $scope.play()
        })
    }
    $scope.getVids()
    $scope.play = function() {
      var player;
      player = new YT.Player('player', {
        height: '390',
        width: '640',
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange,
        }
      })
      function onPlayerReady(event) {
        player.cuePlaylist($scope.vids.slice(0,10))
      }
      function onPlayerStateChange(event) {
        try {
          var id = getJsonFromUrl(event.target.getVideoUrl().substr(30)).v
          $scope.$apply($scope.curPermalink = $scope.permalinks[id])
          addVidIdToStorage(id)
          if (event.target.getPlayerState()===0) {
            setTimeout(function(){player.playVideo()},3000)
          }
          console.log('stored')
        }
        catch (e) {console.log(e)}
      }
      function addVidIdToStorage (id) {
        var ids;
        if (localStorage['ids'] === null || localStorage['ids'] === undefined || localStorage['ids'] === "") {
          ids = [];
        } else {
          ids = JSON.parse(localStorage["ids"]);
        }
        if (!~ids.indexOf(id)) {
          ids.push(id)
          localStorage["ids"] = JSON.stringify(ids);
        }
      }
      $("[name='my-checkbox']").bootstrapSwitch({
        size:'mini'
      })
      .on('switchChange.bootstrapSwitch', function(event, state) {
        $scope.$apply($scope.omitRedundancies = state)
        $scope.$apply($scope.getVids())

      })
    }
  }])
app.controller('Ctrl', ['$scope', '$http', '$routeParams',
  function($scope, $http, $routeParams) {
    $scope.subs = {
      videos: [
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
