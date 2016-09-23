(function() {
  angular.module('starter').controller('ConsentsCtrl', ConsentsCtrl);

  ConsentsCtrl.$inject = ['$state', 'starterConfig', 'utilService',
    '$ionicHistory', 'lsService', '$rootScope', 'cameraService',
    '$ionicActionSheet', '$scope'
  ];

  function ConsentsCtrl($state, sConfig, utilService,
    $ionicHistory, lsService, $rootScope, cameraService, $ionicActionSheet,
    $scope) {
    // Variables section
    var logger = utilService.getLogger();

    logger.debug("ConsentsCtrl start");

    // Variables section
    var cc = this;

    // Functions section
    cc.consents = consents;

    // Functions definations
    function consents() {
      try {
        logger.debug("consents function");

        if (!utilService.isAppOnlineService()) {
          utilService.toastMessage(sConfig.msgs.noConnMsg);
          return;
        }

        $state.go(sConfig.appStates.register);
      } catch (exception) {
        logger.error("exception: " + exception);
      }
    }

    logger.debug("ConsentsCtrl end");
  }
})();
