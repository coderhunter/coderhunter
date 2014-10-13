;(function(angular) {
  'use strict';

  angular
    .module('coderhunter', [
      'auth0',
      'avoscloud',
      'ui.router',
      'ui.bootstrap'
    ])
    .config([
      'authProvider',
      'avoscloudProvider',
      '$stateProvider',
      '$urlRouterProvider',
      '$locationProvider',
      '$httpProvider',
       config
    ])
    .run(function(auth) {
      auth.hookEvents();
    });

  function config(authProvider, avoscloudProvider, $stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    var templatesPath = globalConfigs.templatesPath || 'templates';
    // AVOSCloud backend configs
    avoscloudProvider.config({
      'X-AVOSCloud-Application-Id': AVOSConfigs.appId,
      'X-AVOSCloud-Application-Key': AVOSConfigs.appKey
    });
    // Init router objects
    var routers = defineRoutes(['archive', 'single', 'admin', '404', 'layout']);
    // Routes configs
    $urlRouterProvider.otherwise("/404");
    // Signup routes uri
    $stateProvider
      .state('layout',        routerMaker('', routers.layout))
      .state('layout.home',   routerMaker('/', routers.layout)) // alias router for layout
      .state('layout.pager',  routerMaker('/page/:page', routers.archive))
      .state('layout.single', routerMaker('/coder/:uri', routers.single))
      .state('layout.create', routerMaker('/create', routers.admin, appendToRouter('title','新建')))
      .state('layout.update', routerMaker('/coder/:uri/update', routers.admin, appendToRouter('title','更新')))
      .state('layout.404',    routerMaker('/404', routers['404']));

    // Hashtag config
    $locationProvider
      .hashPrefix(globalConfigs.hashPrefix || '!');

    // Html5 mode should also be supported by server side
    if (globalConfigs.html5Mode)
      $locationProvider.html5Mode(true);

    // GitHub Auth service based on Auth0
    authProvider.init({
      domain: globalConfigs.auth0.domain,
      clientID: globalConfigs.auth0.clientID,
      loginState: 'layout.signin',
      callbackUrl: location.href
    });

    // This will disable avoscloud communcation
    // $httpProvider.interceptors.push('authInterceptor');

    function defineRoutes(routes) {
      var routers = {};
      angular.forEach(routes, function(route) {
        routers[route] = {};
        routers[route].templateUrl = templatesPath + '/' + route + '.html';
        if (route !== '404')
          routers[route].controller = route;
        // define the LAYOUT router
        if (route === 'layout') {
          // define default sub-views of layout
          routers[route].views = {
            'layout': routers.layout,
            '@layout': routers.archive,
            '@layout.home': routers.archive
          }
        }
      });
      return routers;
    }

    function routerMaker(url, router, data) {
      var obj = angular.copy(router);
      obj.url = url;
      if (data && typeof(data) === 'object') 
        obj = angular.extend(obj, data);
      return obj;
    }

    function appendDataToRouter(data) {
      return {
        data: data
      }
    }

    function appendToRouter(type, object) {
      var data = {};
      data[type] = object;
      return appendDataToRouter(data);
    }
  }

})(window.angular);
