'use strict';

app.controller('CommentsCtrl', ['$scope', '$http', '$routeParams',
  function($scope, $http, $routeParams) {

  }])
app.controller('TextCtrl', ['$scope', '$http', '$routeParams',
  function($scope, $http, $routeParams) {

  }])
app.controller('VideosCtrl', ['$scope', '$http', '$routeParams',
  function($scope, $http, $routeParams) {
    function getJsonFromUrl(query) {
      var result = {};
      query.split("&").forEach(function(part) {
        var item = part.split("=");
        result[item[0]] = decodeURIComponent(item[1]);
      });
      return result;
    }
    $scope.omitRedundancies = true
    $scope.getVids = function() {
      $http.jsonp('http://www.reddit.com/r/'+$routeParams.sub+'.json?limit=100&jsonp=JSON_CALLBACK')
        .success(function(res) {
          $scope.permalinks = []
          $scope.vids = res.data.children.reduce(function(prev,cur) {
            if (/^https?:\/\/(www\.)?youtube/.test(cur.data.url)) {
              var id = getJsonFromUrl(cur.data.url.substr(30)).v
              var ids;
              if (localStorage['ids'] === null || localStorage['ids'] === undefined || localStorage['ids'] === "") {
                ids = [];
              } else {
                ids = JSON.parse(localStorage["ids"]);
              }
              if (!~ids.indexOf(id) || !$scope.omitRedundancies) {
                $scope.permalinks.push({title:cur.data.title,uri:cur.data.permalink})
                prev.push(id)
              }
              return prev
            } else {
              return prev
            }
          },[])
          $scope.play(0)
        })
    }
    $scope.custsub = 'videos'
    $scope.$watch('omitRedundancies',$scope.getVids())
    $scope.getVids()
    $scope.play = function() {
      var player;
      player = new YT.Player('player', {
        height: '390',
        width: '640',
        playerVars: { 'autoplay': 0},
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      })
      function onPlayerReady(event) {
        player.cuePlaylist($scope.vids)
      }
      $scope.waiting = false
      function onPlayerStateChange(event) {
        try {
          addVidIdToStorage(getJsonFromUrl(player.getVideoUrl().substr(30)).v)
          if (event.target.getPlayerState()===0) {
            setTimeout(function(){player.playVideo()},3000)
          }
        }
        catch (e) {}
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
    }
  }])
app.controller('Ctrl', ['$scope', '$http', '$routeParams',
  function($scope, $http, $routeParams) {
    $("[name='my-checkbox']").bootstrapSwitch({
      size:'mini'
    })
    .on('switchChange.bootstrapSwitch', function(event, state) {
      $scope.$apply($scope.omitRedundancies = state)
    })
  }])
