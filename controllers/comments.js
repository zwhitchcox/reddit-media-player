'use strict';
app.controller('CommentsCtrl', ['$scope', '$http', '$routeParams', 'Menu',
  function($scope, $http, $routeParams, Menu) {
    $scope.sub = $routeParams.sub
    $scope.getTitles = function(sub) {
      $http.jsonp('http://www.reddit.com/r/'+$scope.sub+'.json?limit=100&jsonp=JSON_CALLBACK')
        .success(function(res) {
          $scope.titles = res.data.children
        })
    }
    $scope.getTitles()
    $scope.continuous = true
    $scope.played = []
    $scope.curPlay = 0
    $scope.getComments = function (post) {
      $http.jsonp('http://www.reddit.com/comments/'+post+'.json?jsonp=JSON_CALLBACK')
        .success(function(res) {
          $scope.comments = flattenCommentTree(res[1])
          $scope.comments.unshift(res[0].data.children[0].data.title+" \n ")
          $scope.read(0,true)
        })
    }
    function flattenCommentTree (commentTree) {
      var arr = []
      commentTree.data.children.forEach(function(comment) {
        if (comment.data.hasOwnProperty('body')) {
          arr.push(comment.data.body)
          if (comment.data.replies !== "" &&
          comment.data.replies
          .data.children[0]
          .data.hasOwnProperty('body')) {
            arr = arr.concat(flattenCommentTree(comment.data.replies))
          }
        }
      })
      return arr
    }
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
        if ($scope.played.some(function(cur) {return cur === curIdx}) ||
          $scope.curPlay !== curPlay) {
            return
        } else {
          $scope.played.push(curIdx)
        }
        var comment = $scope.comments[curIdx]
          .replace(/\b(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?\b/g,'link')
        if (window.speechSynthesis !== undefined) {
          if ($scope.continuous) {
            nativetts(comment,function(){
              setTimeout(function(){
                $scope.read(curIdx+1,false,curPlay)
                $scope.$apply()
              },1000)
              })
          } else {
            nativetts(comment)
          }

        } else {
          if (window['aud'+$scope.curPlay] !== undefined) {
            window['aud'+$scope.curPlay].pause()
          }
          if ($scope.continuous) {
            apitts(comment,function(){setTimeout(function(){$scope.read(curIdx+1,false,curPlay);$scope.$apply()},1000)})
          } else {
            apitts(comment)
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
      return 'http://reddit.com'+$scope.titles[idx].data.permalink
    }


  }])
