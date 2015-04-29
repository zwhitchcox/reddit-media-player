'use strict'

app.controller('TextCtrl', ['$scope', '$http', '$routeParams', 'Menu',
  function($scope, $http, $routeParams, Menu) {
    window.globalStop = false
    Menu.sub = $routeParams.sub
    $scope.sub = $routeParams.sub
    $http.jsonp('http://www.reddit.com/r/' + $scope.sub + '.json?limit=100&jsonp=JSON_CALLBACK')
      .success(function(res) {
        var ids = getIDsFromStorage($routeParams.sub)
        $scope.txt = res.data.children.reduce(function(prev,cur) {
          if (!~ids.indexOf(cur.data.id)) {
            prev.push(cur)
          }
          return prev
        },[])
      })
    $scope.played = []
    $scope.curPlay = 0
    $scope.read = function(curIdx,clicked,curPlay) {
      if (clicked) {
        $scope.stopped = false
        $scope.curPlay +=1
        curPlay = $scope.curPlay
        $scope.played = []
        if (window.speechSynthesis !== undefined) {
          window.speechSynthesis.cancel()
        }
      }
      if (!$scope.stopped) {
        nativetts('hello world',function(){})


        if ($scope.played.some(function(cur) {return cur === curIdx}) ||
          $scope.curPlay !== curPlay) {
            return
        } else {
          $scope.played.push(curIdx)
        }


        // add id to local storage
        addIDToStorage($scope.txt[curIdx].data.id,$routeParams.sub)
        $scope.txt[curIdx].txtClass="text-warning"
        var txt = $scope.txt[curIdx].data.title + ". " + $scope.txt[curIdx].data.selftext
        txt = txt.replace(/(https?:\/\/[^\s]+)/g,'link')
        if (window.speechSynthesis !== undefined) {
          nativetts(txt,function(){
            setTimeout(function(){
              $scope.read(curIdx+1,false,curPlay)
              $scope.$apply()
            },1000)
            })
        } else {
          if (window['aud'+$scope.curPlay] !== undefined) {
            window['aud'+$scope.curPlay].pause()
          }
          if ($scope.continuous) {
            apitts(txt,function(){setTimeout(function(){$scope.read(curIdx+1,false,curPlay);$scope.$apply()},1000)})
          } else {
            apitts(txt)
          }

        }

      }
    }
    $scope.stop = function() {
      $scope.stopped = true
      ++$scope.curPlayed
      if (window.speechSynthesis !== undefined) {
        window.speechSynthesis.cancel()
      } else {
        window.aud.pause()
      }
    }

    $scope.updateMenu = function() {
      Menu.btns =  [
          {btnName: 'stop', fn: $scope.stop}
        ]
    }
    $scope.updateMenu()
    $scope.getLink = function(idx) {
      return 'http://reddit.com/'+$scope.txt[idx].data.permalink
    }
  }])
