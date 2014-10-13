;(function(angular) {
  'use strict';

  angular
    .module('coderhunter')
    .controller('member', [
      '$scope',
      '$state',
      'avoscloud',
      'auth',
      memberCtrler
    ]);

  function memberCtrler($scope, $state, avoscloud, auth) {
    var uri = $state.params.uri;
    if (!uri) return $state.go('layout.404');

    // Read coder from cache
    if ($scope.member) return;

    // Fetch user's information
    avoscloud.users.get({
      objectId: uri
    }, function(data) {
      $scope.member = data;
    }, function(err) {
      $state.go('layout.404');
    });

    // Signout via auth0
    $scope.signout = signout;

    function signout() {
      auth.signout();
      return $state.go('layout.home');
    }
  }
})(window.angular);
