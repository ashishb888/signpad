(function() {
  angular.module('starter').controller('PANCtrl', PANCtrl);

  PANCtrl.$inject = ['$state', 'starterConfig', 'utilService',
    '$ionicHistory', 'lsService', '$rootScope', 'panService', '$timeout',
    '$ionicLoading'
  ];

  function PANCtrl($state, sConfig, utilService,
    $ionicHistory, lsService, $rootScope, panService, $timeout, $ionicLoading
  ) {
    // Variables section
    var logger = utilService.getLogger();

    logger.debug("PANCtrl start");

    // Variables section
    var pc = this;

    // Functions section
    pc.verifyPAN = verifyPAN;
    pc.verifyPANFail = verifyPANFail;

    function verifyPAN() {
      try {
        logger.debug("verifyPAN function");

        if (!utilService.isAppOnlineService()) {
          utilService.toastMessage(sConfig.msgs.noConnMsg);
          return;
        }

        $ionicLoading.show({
          template: '<ion-spinner icon="lines"></ion-spinner>'
        });

        $timeout(function() {
          $ionicLoading.hide();
          utilService.toastMessage("PAN verification done");
          $state.go(sConfig.appStates.consents);
        }, 2000);

        //$state.go(sConfig.appStates.register);
      } catch (exception) {
        logger.error("exception: " + exception);
      }
    }

    function verifyPANFail() {
      try {
        logger.debug("verifyPANFail function");

        if (!utilService.isAppOnlineService()) {
          utilService.toastMessage(sConfig.msgs.noConnMsg);
          return;
        }

        $ionicLoading.show({
          template: '<ion-spinner icon="lines"></ion-spinner>'
        });

        $timeout(function() {
          $ionicLoading.hide();
          utilService.toastMessage("PAN varification failed");
          $state.go(sConfig.appStates.aadhar);
        }, 2000);

        //$state.go(sConfig.appStates.register);
      } catch (exception) {
        logger.error("exception: " + exception);
      }
    }

    logger.debug("PANCtrl end");
  }
})();
