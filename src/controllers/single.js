;(function(angular) {
  'use strict';
  
  angular
    .module('coderhunter')
    .controller('single', [
      '$scope', 
      '$state', 
      'avoscloud', 
      '$rootScope', 
      singleCoderCtrler
    ]);

  function singleCoderCtrler($scope, $state, avoscloud, $rootScope) {
    var uri = $state.params.uri;
    if (!uri) return $state.go('layout.404');

    // Read coder from cache
    if ($scope.coder) return;
    
    // Fetch coder details
    avoscloud.classes.get({
      className: 'coder',
      objectId: uri
    }, function(result) {
      console.log(result);
    }, function(err){
      // when err;
      console.log(err);
    });
    // $duoshuo.get('threads/details', {
    //   thread_id: uri
    // }, function(err, result) {
    //   if (err)
    //     return $scope.addAlert('文章内容获取失败，请稍后再试...', 'danger');
    //   $scope.coder = result;
    //   $rootScope.$emit('updateMeta', {
    //     title: result.title,
    //     description: fetchDesciption(result.content)
    //   });
    //   if (result.meta && result.meta.background) {
    //     $scope.updateBackground(result.meta.background);
    //   }
    //   if (!result.author_id) return;
    //   // fetch authors' profile
    //   $duoshuo.get('users/profile', {
    //     user_id: result.author_id
    //   }, function(err, result) {
    //     if (err) return; // ignore null profile
    //     $scope.author = result;
    //     $scope.author.description = result.connected_services.weibo ?
    //       result.connected_services.weibo.description :
    //       null;
    //   })
    // }, function(err) {
    //   return $state.go('layout.404');
    // });
  }

  function fetchDesciption(text) {
    var maxLength = 80;
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  }
})(window.angular);
