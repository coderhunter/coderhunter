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

    // Signin to AVOSCloud and get session token.
    $scope.$watch('auth.profile', function(){
      var profile = $scope.auth.profile;
      if (!profile) return;
      avoscloud.signin.post({
        username: profile.user_id,
        password: fetchGithubToken(profile)
      }, function(user) {
        if (!user) return;
        $scope.auth.objectId = user.objectId;
        if (user.sessionToken)
          avoscloud.headers('sid', user.sessionToken)
      }, function(err) {
        // AVOSCloud signin fail
        console.log(err);
      });
    });

    function hasGitHubToken(profile) {
      return profile.identities && profile.identities[0] && profile.identities[0].provider === 'github';
    }

    function fetchGithubToken(profile) {
      if (!hasGitHubToken(profile))
        return null;
      return profile.identities[0].access_token;
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
