;(function(angular) {
  'use strict';
  
  angular
    .module('coderhunter')
    .controller('create', [
      '$scope',
      '$state',
      'avoscloud',
      'auth',
      createCtrler
    ]);

  function createCtrler($scope, $state, avoscloud, auth) {
    $scope.create = function() {
      if (!$scope.coder)
        return $scope.addAlert('请填写有效字段...');
      if (!auth.profile || !auth.objectId)
        return $state.go('layout.signin');
      var newbie = new avoscloud.classes();
      newbie.name = $scope.coder.name;
      newbie.uri = $scope.coder.uri;
      newbie.author = {
        __type: "Pointer",
        className: "_User",
        objectId: auth.objectId
      };
      newbie.$save({
        className: 'coder'
      }, function(result){
        if (!result.objectId) return;
        $state.go('layout.single', {
          uri: result.objectId
        });
      }, function(err){
        $scope.addAlert(err);
      });
    }
  }
})(window.angular);
