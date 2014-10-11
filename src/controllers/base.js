;(function(angular) {
  'use strict';
  
  angular
    .module('coderhunter')    
    .controller('base', [
      '$scope', 
      '$state', 
      '$timeout', 
      '$location', 
      'auth',
      'avoscloud',
      baseCtrler
    ])
    .controller('layout', ['$scope', layoutCtrler]);
  
  function baseCtrler($scope, $state, $timeout, $location, auth, avoscloud) {
    // Reset user
    $scope.auth = auth;

    // Inject locals to template
    $scope.state = $state;
    $scope.location = $location;
    $scope.copyrightYear = (new Date()).getFullYear();

    // Signin via GitHub
    $scope.signin = signin;
    $scope.signout = signout;

    checkMemeber('github|1269537');

    // Signin via GitHub based on Auth0
    function signin() {
      auth.signin({
        popup: true
      }, function() {
        // Check if user exsit in AVOSCloud Database
        checkMemeber(auth.profile.user_id, function(exist){
          if (exist) return;
          createMember(auth.profile);
        })
      }, function(err) {
        // signin error
        addAlert('登录出错，请稍后再试试...');
        console.log(err);
      });
    }

    function signout() {
      return auth.signout();
    }

    function checkMemeber(user_id) {
      if (!user_id) return;
      avoscloud.users.get({
        where: JSON.stringify({user_id: user_id})
      }, function(data){
        console.log(data);
      }, function(err){
        console.log(err);
      });
    }

    function createMember(profile) {
      
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
