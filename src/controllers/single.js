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
      $scope.coder = result;
    }, function(err){
      console.log(err);
    });
  }

  function fetchDesciption(text) {
    var maxLength = 80;
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  }
})(window.angular);
