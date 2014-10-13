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
    console.log(auth)

    // Inject locals to template
    $scope.state = $state;
    $scope.location = $location;
    $scope.copyrightYear = (new Date()).getFullYear();

    // Signin and Signout
    $scope.signin = signin;
    $scope.signout = signout;

    // Signin to AVOSCloud and get session token.
    $scope.$watch('auth.profile', function(){
      var profile = $scope.auth.profile;
      if (!profile) return;
      avoscloud.signin.post({
        username: profile.user_id,
        password: fetchGithubToken(profile)
      }, function(user){
        if (!user) return;
        if (user.sessionToken)
          avoscloud.headers('sid', user.sessionToken)
      }, function(err) {
        // AVOSCloud signin fail
        console.log(err);
      });
    });

    // Signin via Auth0
    function signin() {
      auth.signin({
        popup: true
      }, function() {
        // Check if user exsit in AVOSCloud Database
        checkMemeber(auth.profile.user_id, function(err, exist){
          if (err)
            return addAlert('登录出错，请稍后再试试');
          if (exist) 
            return false;
          createMember(auth.profile);
        })
      }, function(err) {
        // signin error
        addAlert('登录出错，请稍后再试试...');
        console.log(err);
      });
    }

    // Signout via auth0
    function signout() {
      auth.signout();
      return $state.go('layout.home');
    }

    // Check a member if exist in AVOSCloud database.
    function checkMemeber(user_id, callback) {
      if (!user_id) return;
      if (!callback) return;

      avoscloud.users.get({
        where: JSON.stringify({user_id: user_id}) // This is ugly
      }, function(data){
        var user = data.results;
        if (user.length > 0)
          return callback(null, true);

        return callback(null, false);
      }, function(err) {
        return callback(err);
      });
    }

    // Create a member if NOT in AVOSCloud database.
    function createMember(profile) {      
      var toplevelKeys = ['name', 'nickname', 'email', 'followers', 'following', 'company', 'hireable', 'location', 'public_repos', 'html_url'];

      var newbie = new avoscloud.users();
      newbie.username = profile.user_id;
      newbie.profile = profile;

      if (hasGitHubToken(profile))
        newbie.password = fetchGithubToken(profile);

      angular.forEach(toplevelKeys, function(item){
        if (!profile[item]) return;
        newbie[item] = profile[item];
      });

      newbie.$save(function(err){
        if (err)
          return addAlert(err);
        if (newbie.sessionToken)
          avoscloud.headers('sid', newbie.sessionToken);
      });
    }

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
