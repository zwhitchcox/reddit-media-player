app.controller('AudVidCtrl', ['$scope', '$http', '$routeParams', 'Menu',
  function($scope, $http, $routeParams, Menu) {
    $scope.updateMenu = function() {
      Menu.btns =  [
          {btnName: 'forward', fn: $scope.next}
        ]
      Menu.txtBtns = [
        {txt: 'YouTube Only', fn: $scope.filterMedia}
      ]
    }

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
    $scope.getMedia = function() {
      $scope.curIdx = -1
      $http.jsonp('http://www.reddit.com/r/'+$routeParams.sub+'.json?limit=100&jsonp=JSON_CALLBACK')
        .success(function(res) {
          $scope.permalinks = {}
          $scope.queried = res.data.children.reduce(function(prev,cur) {
            if (cur.data.domain === 'soundcloud.com') {
              if (localStorage['ids'] === null || localStorage['ids'] === undefined || localStorage['ids'] === "") {
                ids = [];
              } else {
                ids = JSON.parse(localStorage["ids"]);
              }
              if (!~ids.indexOf(cur.data.id) || !$scope.omitRedundancies) {
                prev.push({
                  scuri: cur.data.url,
                  type:'sc',
                  uri:cur.data.permalink,
                  title: cur.data.title,
                  id:cur.data.id
                })
              }
            } else if (/^https?:\/\/(www\.)?youtube/.test(cur.data.url)) {
              var type = 'yt';
              var ids;
              if (localStorage['ids'] === null || localStorage['ids'] === undefined || localStorage['ids'] === "") {
                ids = [];
              } else {
                ids = JSON.parse(localStorage["ids"]);
              }
              if (!~ids.indexOf(cur.data.id) || !$scope.omitRedundancies) {
                prev.push({type: type, id: cur.data.id, title:cur.data.title, uri:cur.data.permalink,ytid: getJsonFromUrl(cur.data.url.substr(cur.data.url.indexOf('?',8)+1)).v})
              }
            } else if (/^https?:\/\/(www\.)?vimeo/.test(cur.data.url)) {
              if (localStorage['ids'] === null || localStorage['ids'] === undefined || localStorage['ids'] === "") {
                ids = [];
              } else {
                ids = JSON.parse(localStorage["ids"]);
              }
              if (!~ids.indexOf(cur.data.id) || !$scope.omitRedundancies) {
                prev.push({
                  viuri: cur.data.url.substr(cur.data.url.indexOf('/',8)+1),
                  type:'vi',
                  uri:cur.data.permalink,
                  title: cur.data.title,
                  id:cur.data.id
                })
              }
            }
            return prev
          },[])
          $scope.media = $scope.queried
          $scope.play()
        })
    }
    $scope.filterMedia = function() {
      $scope.media = $scope.queried
      $scope.media = $scope.media.reduce(function(prev,cur) {
        if (Menu.YouTubeOnly && cur.type !== 'yt') {
          return prev
        }
        prev.push(cur)
        return prev
      },[])
      $scope.media.forEach(function(cur){console.log(cur.type)})
    }
    $scope.getMedia()
    $scope.play = function(playIdx) {
      $('#stage').html("")
      if (playIdx === undefined) {
        $scope.curIdx++
      } else {
        $scope.curIdx = playIdx
      }
      var cur = $scope.media[$scope.curIdx]
      addIDToStorage(cur.id)
      // soundcloud
      if (cur.type === 'sc') {
        $http.jsonp('http://soundcloud.com/oembed?format=js&url='+
        cur.scuri
        +'&callback=JSON_CALLBACK&auto_play=true')
        .success(function(res) {
          $('#stage').append(res.html)
          var widgetIframe = $('iframe')[0],
          widget       = SC.Widget(widgetIframe)
          $scope.next = function() {$scope.play()}
          $scope.updateMenu()
          widget.bind(SC.Widget.Events.READY, function() {
            widget.bind(SC.Widget.Events.FINISH, function() {
              $scope.play()
            })
          })
        })
      }
      // vimeo
      else if (cur.type === 'vi') {
        $scope.next = function() {$scope.play()}
        $scope.updateMenu()
        var html = '<iframe id="vimeo_player" src="//player.vimeo.com/video/'+cur.viuri+'?autoplay=1&api=1&player_id=vimeo_player" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
        $('#stage').append(html)
        var iframe = $('#vimeo_player')[0];
        var player = $f(iframe);
        player.addEvent('ready', function() {
          addIDToStorage(cur.id)
          player.addEvent('finish', finish)
          function finish() {
            $scope.play()
          }
        })
        document.getElementById('vimeo_player').width= window.innerWidth * .9
        document.getElementById('vimeo_player').height= window.innerWidth * 0.609375 * .9
        window.onresize = function() {
          document.getElementById('vimeo_player').width= window.innerWidth * .9
          document.getElementById('vimeo_player').height= window.innerWidth * 0.609375 * .9

        }
      }
      // youtube
      else if (cur.type ==='yt') {
        $('#stage').append("<div id='ytplayer'></div>")
        player = new YT.Player('ytplayer', {
          height: window.innerWidth * 0.609375 * .9,
          width: window.innerWidth * .9,
          videoId: $scope.media[$scope.curIdx].ytid,
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
          }
        })
        window.onresize = function() {
          player.setSize(window.innerWidth * .9,window.innerWidth * 0.609375 * .9)
        }

        $scope.next = function(id,event) {
          if (id !== undefined) {
            if ($scope.playedNext !== id) {
              if ($scope.media[$scope.curIdx+1].type==='yt') {
                $scope.$apply(++$scope.curIdx)
                event.target.loadVideoById($scope.media[$scope.curIdx].ytid)
                $scope.$apply()
              } else {
                $scope.play()
              }
            }
            $scope.playedNext = id
          } else {
              $scope.play()
          }
        }
        $scope.updateMenu()
        function onPlayerReady(event) {
          event.target.playVideo()
        }
        function onPlayerStateChange(event) {
          try {
            addIDToStorage($scope.media[$scope.curIdx].id)
            if (event.target.getPlayerState()===0) {
              $scope.next($scope.media[$scope.curIdx].id,event)
            }
          }
          catch (e) {console.log(e)}
        }

      }
    }
  }])
  
