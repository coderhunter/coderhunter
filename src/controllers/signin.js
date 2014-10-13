;(function(angular) {
  'use strict';
  
  angular
    .module('coderhunter')
    .controller('signin', [
      '$scope', 
      '$state',
      'avoscloud',
      'auth',
      signinCtrler
    ]);

  function signinCtrler($scope, $state, avoscloud, auth) {
    $scope.message = '请在弹出的窗口登录';

    if (auth.profile)
      return $state.go('layout.home');

    signin();

    // Signin via Auth0
    function signin() {
      auth.signin({
        popup: true
      }, function() {
        $scope.message = '登录成功，正在跳转...';
        $state.go('layout.home');
        // Check if user exsit in AVOSCloud Database
        checkMemeber(auth.profile.user_id, function(err, exist){
          if (err)
            return $scope.addAlert('登录出错，请稍后再试试');
          if (exist) 
            return;
          createMember(auth.profile);
        })
      }, function(err) {
        // Signin error or was canceled
        console.log(err);
      });
    }

    // Check a member if exist in AVOSCloud database.
    function checkMemeber(user_id, callback) {
      if (!user_id) return;
      if (!callback) return;

      avoscloud.users.get({
        where: JSON.stringify({username: user_id}) // This is ugly
      }, function(data) {
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
          return $scope.addAlert(err);
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
  }
})(window.angular);
