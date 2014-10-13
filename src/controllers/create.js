;(function(angular) {
  'use strict';
  
  angular
    .module('coderhunter')
    .controller('create', [
      '$scope',
      '$state',
      'avoscloud', 
      createCtrler
    ]);

  function createCtrler($scope, $state, avoscloud) {
    $scope.create = function() {
      if (!$scope.coder)
        return $scope.addAlert('请填写有效字段...');
      var newbie = new avoscloud.classes();
      newbie.name = $scope.coder.name;
      newbie.uri = $scope.coder.uri;
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
