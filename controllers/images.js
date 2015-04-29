'use strict';
app.controller('ImagesCtrl', ['$scope', '$http', '$routeParams', 'Menu',
  function($scope, $http, $routeParams, Menu) {
    $scope.sub = $routeParams.sub
    $http.jsonp('http://www.reddit.com/r/'+$scope.sub+'.json?limit=100&jsonp=JSON_CALLBACK')
      .success(function(res) {
        var ids = getIDsFromStorage()
        var fileTypes = [".jpg", ".jpeg", ".bmp", ".gif", ".png"]
        $scope.imgs = res.data.children.reduce(function(prev,cur) {
          if (!~ids.indexOf(cur.data.id)) {
            if (cur.data.domain === 'imgur.com') {
              var hash = cur.data.url.substr(cur.data.url.indexOf('/',8)+1)
              prev.push({
                type:'imgur-embed',
                hash:hash,
                title:cur.data.title,
                perm: 'http://reddit.com'+cur.data.permalink,
                id: cur.data.id
              })
            } else if (~fileTypes.indexOf(cur.data.url.substr(cur.data.url.length-4))) {
              prev.push({type:'img',
              uri:cur.data.url,
              title:cur.data.title,
              perm: 'http://reddit.com'+cur.data.permalink,
              id: cur.data.id
            })
            } else if (cur.data.url.substr(cur.data.url.length-5)==='.gifv'){
              console.log(cur.data.url.replace('gifv','webm'))
              prev.push({
                type:'webm',
                uri:cur.data.url.replace('gifv','webm'),
                title:cur.data.title,
                perm: 'http://reddit.com'+cur.data.permalink,
                id: cur.data.id
              })
            }
          }
          return prev
        },[])
        $scope.play(0)
      })
    $scope.play = function(idx) {
      if (idx === undefined) {
        $scope.curIdx++
      } else {
        $scope.curIdx = idx
      }
      var cur = $scope.imgs[$scope.curIdx]
      addIDToStorage(cur.id)
      if (cur.type === 'img') {
        $('#gallery').html('<img id="curimg" src="'+cur.uri+'">')
        $('#curimg').css('max-width',window.innerWidth*.9)
      } else if (cur.type==='imgur-embed') {
        $('#gallery').html('<blockquote class="imgur-embed-pub" lang="en" data-id="'
        +cur.hash+'"></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script>')
      } else if (cur.type === 'webm') {
        $('#gallery').html('<video controls><source src="' + cur.uri+'" type="video/webm">Your browser does not support HTML5 video.</video>')
      }

    }
    $scope.next = function() {
      $scope.play($scope.curIdx+1)
    }
    $scope.prev = function() {
      $scope.play($scope.curIdx-1)
    }
    Menu.btns =  [
      {btnName: 'backward', fn: $scope.prev},
      {btnName: 'forward', fn: $scope.next}

      ]
    window.onkeydown = function (event) {
      if (event.which === 32) {
        event.preventDefault()
        $scope.$apply($scope.next())
      }
    }
  }])
