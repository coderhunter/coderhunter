;(function(angular) {
  'use strict';
  
  angular
    .module('coderhunter')
    .controller('layout', ['$scope', layoutCtrler])
    .controller('base', [
      '$scope', '$state', '$timeout', '$location', 'auth',
      baseCtrler
    ]);
  
  function baseCtrler($scope, $state, $timeout, $location, auth) {
    // Reset user
    $scope.user = null;
    $scope.isVisitor = true;
    // Inject locals to template
    $scope.location = $location;
    $scope.state = $state;
    $scope.copyrightYear = (new Date()).getFullYear();
    // Signin via GitHub
    $scope.signin = signin;

    /**
    *
    * Signin via GitHub based on Auth0
    *
    **/
    function signin() {
      auth.signin({
        popup: true
      }, function() {
        console.log(auth.profile);
        if (auth.profile) {
          $scope.user = auth.profile;
          $scope.isVisitor = false;
        }
      }, function(err) {
        console.log("Error :(", err);
      });
    }

    /**
    *
    * Alert utils
    * @example
    *   addAlert();
    *   closeAlert();
    *
    **/
    $scope.alerts = [];
    $scope.addAlert = addAlert;
    $scope.closeAlert = closeAlert;;

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
