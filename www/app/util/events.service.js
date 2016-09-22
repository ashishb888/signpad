(function() {
  angular.module('starter').factory('eventsService', eventsService);
  eventsService.$inject = ['utilService', '$ionicPlatform',
    'httpCallsService', '$cordovaNetwork', '$rootScope', '$ionicHistory',
    '$state', 'starterConfig'
  ];

  function eventsService(utilService, $ionicPlatform, httpCallsService,
    $cordovaNetwork, $rootScope, $ionicHistory, $state, sConfig) {
    // Variables section
    var es = this;
    var logger = utilService.getLogger();

    // Declare services here
    es.startEvents = startEvents;

    // Functions definations
    function startEvents() {
      try {
        logger.debug("startEvents service");

      } catch (exception) {
        logger.error("exception: " + exception);
      }
    }

    $ionicPlatform.on("offline", function() {
      logger.debug("$ionicPlatform offline");
    });

    $ionicPlatform.on("online", function() {
      logger.debug("$ionicPlatform online");
    });

    $ionicPlatform.on("pause", function() {
      // httpCallsService.updateLastActive();
      logger.debug("$ionicPlatform pause");
    });

    $ionicPlatform.on("resume", function() {
      logger.debug("$ionicPlatform resume");
    });

    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
      try {
        logger.debug("$cordovaNetwork:offline service");
        logger.debug("currentStateName: " + $ionicHistory.currentStateName());

        if (!sConfig.offlineStates.includes($ionicHistory.currentStateName())) {
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $state.go(sConfig.appStates.retry, {
            "state": sConfig.appStates.menu_db
          });
        }

        utilService.toastMessage(sConfig.msgs.noConnMsg);
      } catch (exception) {
        logger.error("exception: " + exception);
      }
    });

    $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
      try {
        logger.debug("$cordovaNetwork:online service");

        $ionicHistory.nextViewOptions({
          disableBack: true
        });

        $state.go(sConfig.appStates.menu_db);

        utilService.toastMessage(sConfig.msgs.connMsg);
      } catch (exception) {
        logger.error("exception: " + exception);
      }
    });

    return es;
  }
})();
