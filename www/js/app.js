// Ionic Starter App
// Server values would be prod for production, dev for dev, uat for uat and local for localhost server.
var env = "local";
var envLs = {
  prod: "prod",
  uat: "uat",
  dev: "dev",
  local: "local"
};

/* Global URLs for all environments */
var urls = {
  prod: "",
  uat: "",
  dev: "",
  local: "/api"
};

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'ngMessages'])

.run(function($ionicPlatform, $rootScope, $ionicLoading, utilService, lsService,
  $state, eventsService, httpCallsService, hwBackBtnService) {
  utilService.getLogger().debug("run starts");

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
      // StatusBar.backgroundColorByHexString("#886aea");
      StatusBar.backgroundColorByHexString("#392675");
    }

    // Double tap to exit app
    hwBackBtnService.tapToExit();
  });

  eventsService.startEvents();

  /* Logs every request. */
  $rootScope.$on('logReqResp', function(event, data, key) {
    utilService.logReqResp(data, key);
  });

  // Handle HTTP erros
  $rootScope.$on('errorHandler', function(event, respErr) {
    utilService.errorHandler(respErr);
  });

  /* Shows ionicLoading */
  $rootScope.$on('loadingShow', function() {
    utilService.getLogger().debug("loadingShow");
    $ionicLoading.show({
      template: '<ion-spinner icon="lines"></ion-spinner>'
    });
  });

  /* Hides ionicLoading */
  $rootScope.$on('loadingHide', function() {
    utilService.getLogger().debug("loadingHide");
    $ionicLoading.hide();
  });

  utilService.getLogger().debug("run ends");
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider, $logProvider) {
  console.debug("config() start");
  console.debug("env: " + env);

  /* Depending upon env it Enables/disables debug statements */
  switch (env) {
    case envLs.prod:
      $logProvider.debugEnabled(false);
      break;
    case envLs.uat:
      $logProvider.debugEnabled(false);
      break;
    case envLs.dev:
      $logProvider.debugEnabled(true);
      break;
    case envLs.local:
      $logProvider.debugEnabled(true);
      break;
    default:
      $logProvider.debugEnabled(false);
  }

  /* Interceptors pool */
  $httpProvider.interceptors.push(
    loadingInterceptor,
    /*loggerInterceptor,*/
    errorHandlerInterceptor
  );

  function errorHandlerInterceptor($rootScope, $q) {
    return {
      request(req) {
        return req;
      },
      response(resp) {
        return resp;
      },
      responseError(respErr) {
        if (respErr.config !== undefined || respErr.config !== null) {
          /*if (respErr.config.url.endsWith("/login")) {
            return $q.reject(respErr);
          }*/

          if (urlCheck(respErr.config.url)) {
            $rootScope.$broadcast('errorHandler', respErr);
          }
        }
        return $q.reject(respErr);
      }
    };
  }

  /* Loads/hides ionicLoading for every request */
  function loadingInterceptor($rootScope, $q) {
    return {
      request(req) {
        if (req !== undefined || req !== null) {
          if (urlCheck(req.url)) {
            $rootScope.$broadcast("loadingShow");
          }
        }
        return req;
      },
      response(resp) {
        if (resp.config !== undefined || resp.config !== null) {
          if (urlCheck(resp.config.url)) {
            $rootScope.$broadcast("loadingHide");
          }
        }
        return resp;
      },
      responseError(respErr) {
        if (respErr.config !== undefined || respErr.config !== null) {
          if (urlCheck(respErr.config.url)) {
            $rootScope.$broadcast("loadingHide");
          }
        }
        return $q.reject(respErr);
      }
    };
  }

  /* Logs every request's req & resp */
  function loggerInterceptor($rootScope, $q) {
    return {
      request(req) {
        if (req !== undefined || req !== null) {
          if (req.url.includes("images"))
            return req;
          if (urlCheck(req.url)) {
            $rootScope.$broadcast("logReqResp", req.data, "req");
          }
        }
        return req;
      },
      response(resp) {
        if (resp.config !== undefined || resp.config !== null) {
          if (resp.config.url.includes("images"))
            return resp;
          if (urlCheck(resp.config.url)) {
            $rootScope.$broadcast("logReqResp", resp.data, "resp");
          }
        }
        return resp;
      },
      responseError(respErr) {
        if (respErr.config !== undefined || respErr.config !== null) {
          if (urlCheck(respErr.config.url)) {
            $rootScope.$broadcast("logReqResp", respErr, "respErr");
          }
        }
        return $q.reject(respErr);
      }
    };
  }

  /* Checks if URL start with HTTP or HTTPS */
  function urlCheck(url) {
    url = url.toLowerCase();

    if (url.startsWith("http:") || url.startsWith("https:") || url.startsWith(
        "/api")) {
      return true;
    }
    return false;
  }

  $stateProvider

  .state("welcome", {
    url: "/welcome",
    templateUrl: "app/welcome/welcome.html"
  })

  .state("pan", {
    url: "/pan",
    templateUrl: "app/pan/pan.html",
    controller: "PANCtrl as pc"
  })

  .state("register", {
    url: "/register",
    templateUrl: "app/register/register.html",
    controller: "RegisterCtrl as rc"
  })

  .state('retry', {
    params: {
      'state': "welcome"
    },
    url: '/retry',
    templateUrl: 'app/retry/retry.html',
    controller: 'RetryCtrl as rc'
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/pan');
});
