'use strict';
app.controller('ImagesCtrl', ['$scope', '$http', '$routeParams', 'Menu',
  function($scope, $http, $routeParams, Menu) {
    $scope.sub = $routeParams.sub
    $http.jsonp('http://www.reddit.com/r/'+$scope.sub+'.json?limit=100&jsonp=JSON_CALLBACK')
      .success(function(res) {
        var ids = getIDsFromStorage($scope.sub)
        var fileTypes = [".jpg", ".jpeg", ".bmp", ".gif", ".png"]
        $scope.imgs = res.data.children.reduce(function(prev,cur) {
          var origl = prev.length
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
            } else if (
              cur.data.url.substr(cur.data.url.length-5)==='.gifv' ||
              cur.data.url.substr(cur.data.url.length-5)==='.webm'
              ){
              prev.push({
                type:'webm',
                mp4uri:cur.data.url.replace('gifv','mp4'),
                webmuri:cur.data.url.replace('gifv','webm'),
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
      $('#gallery').css('margin-left','0')
      var cur = $scope.imgs[$scope.curIdx]
      addIDToStorage(cur.id)
      if (cur.type === 'img') {
        $('#gallery').html('<img id="curimg" src="'+cur.uri+'">')
        $('#curimg').css('max-width',window.innerWidth*.9)
      } else if (cur.type==='imgur-embed') {
        $('#gallery').html('<blockquote class="imgur-embed-pub" lang="en" data-id="'
        +cur.hash+'"></blockquote><script async src="http://s.imgur.com/min/embed.js" charset="utf-8"></script>')
        document.getElementsByTagName('iframe')[0].style.zIndex= -1000
        $('#gallery').css('margin-left','-20px')
      } else if (cur.type === 'webm') {
        $('#gallery').html(
          '<video autoplay="true" onclick="goToNext()" loop="true" webkit-playsinline src="'+cur.mp4uri+'" width="'+window.innerWidth*.85+'">'+
          '<source src="'+cur.webmuri+'" type="video/webm">'+
          '<source src="'+cur.mp4uri+'" type="video/mp4"></video>')
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
function goToNext() {
  var scope = angular.element($("#gallery")).scope()
  scope.$apply(scope.next())
}
