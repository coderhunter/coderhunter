;(function(angular) {
  'use strict';
  
  angular
    .module('coderhunter')
    .controller('layout', ['$scope', layoutCtrler])
    .controller('base', [
      '$scope', '$state', '$timeout', '$location',
      baseCtrler
    ]);
  
  function baseCtrler($scope, $state, $timeout, $location) {
    // inject locals to template
    $scope.location = $location;
    $scope.state = $state;
    // signin section
    $scope.hiddenSigninSection = true;
    $scope.toggleSigninSection = toggleSigninSection;
    // alerts module
    $scope.alerts = [];
    $scope.addAlert = addAlert;
    $scope.closeAlert = closeAlert;;
    // init copyright
    $scope.copyrightYear = (new Date()).getFullYear();

    function toggleSigninSection() {
      $scope.hiddenSigninSection = !$scope.hiddenSigninSection;
    }

    function addAlert(msg, type, dismiss) {
      $scope.alerts.push({
        msg: msg,
        type: type || 'success'
      });
      var alertIndex = $scope.alerts.length - 1;
      $timeout(function() {
        $scope.closeAlert(alertIndex);
      }, dismiss ? (dismiss * 1000) : 3000);
      return alertIndex;
    }

    function closeAlert(index) {
      $scope.alerts.splice(index, 1);
    }
  }

  function layoutCtrler() {}

})(window.angular);
