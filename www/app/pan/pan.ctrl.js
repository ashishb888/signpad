(function() {
  angular.module('starter').controller('PANCtrl', PANCtrl);

  PANCtrl.$inject = ['$state', 'starterConfig', 'utilService',
    '$ionicHistory', 'lsService', '$rootScope'
  ];

  function PANCtrl($state, sConfig, utilService,
    $ionicHistory, lsService, $rootScope) {
    // Variables section
    var logger = utilService.getLogger();

    logger.debug("PANCtrl start");

    // Variables section
    var pc = this;

    // Functions section
    pc.verifyPAN = verifyPAN;

    function verifyPAN() {
      try {
        logger.debug("verifyPAN function");

        if (!utilService.isAppOnlineService()) {
          utilService.toastMessage(sConfig.msgs.noConnMsg);
          return;
        }

        $state.go(sConfig.appStates.register);
      } catch (exception) {
        logger.error("exception: " + exception);
      }
    }

    logger.debug("PANCtrl end");
  }
})();
