;(function(angular) {
  'use strict';
  
  angular
    .module('coderhunter')
    .controller('archive', [
      '$scope', 
      '$state', 
      '$rootScope', 
      'avoscloud',
      'auth',
      archiveCtrler
    ]);

  function archiveCtrler($scope, $state, $rootScope, avoscloud, auth) {
    $scope.fetchMore = fetchMore;

    // Read coders from cache
    if ($scope.coders && $scope.coders.length > 0) return;

    // Start fetching coders
    fetchCoders();

    /**
    *
    * Upvote utils
    *
    **/
    $scope.upvote = upvote;

    function upvote(objectId, index) {
      if (!auth.isAuthenticated)
        return $state.go('layout.signin');
      if ($scope.coders[index].voted)
        return false;

      avoscloud.classes.put({
        className: 'coder',
        objectId: objectId
      }, {
        upvote: {
          __op: 'Increment',
          amount: 1
        }
      }, function(result) {
        $scope.coders[index].voted = true;
        $scope.coders[index].upvote += 1;
      }, function(err) {
        console.log(err);
        alert(err);
      });
    }

    // Read fresh data from AVOSCloud
    // Fetch today's coders
    function fetchCoders() {
      var now = new Date();
      now.setDate(now.getDate() - 1);
      avoscloud.classes.get({
        className: 'coder',
        order: '-upvote,updatedAt,createdAt',
        limit: 20,
        include: 'author',
        where: JSON.stringify({
          createdAt: {
            $gte: {
              "__type": "Date",
              "iso": now.toISOString()
            }
          }
        })
      }, function(data) {
        if ($state.params.page)
          lock = false;
        $scope.coders = data.results;
        if ($state.params.page) 
          $scope.currentPage = currentPage;
        return;
      }, function(err){
        // Class not found.
        if (err.status && err.status === 404)
          $state.go('layout.404');
      });
    }

    function fetchMore() {

    }
  }
})(window.angular);
