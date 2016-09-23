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

    function verifyPAN() {
      try {
        logger.debug("verifyPAN function");

        if (!utilService.isAppOnlineService()) {
          utilService.toastMessage(sConfig.msgs.noConnMsg);
          return;
        }

        /*var promise = panService.verifyPAN();
        promise.then(function(sucResp){
            try {
                var resp = sucResp.data;
                if (resp.status !== sConfig.httpStatus.SUCCESS) {
                    utilService.toastMessage(resp.messages);
                    return;
                }

                utilService.toastMessage(resp.messages, sConfig.appStates.register, sConfig.msgs.success);
                //$state.go(sConfig.appStates.register);
            } catch (exception) {
                logger.error("exception: " + exception);
            }
        }, function(errResp){
        });*/

        $ionicLoading.show({
          template: '<ion-spinner icon="lines"></ion-spinner>'
        });

        $timeout(function() {
          $ionicLoading.hide();
          utilService.toastMessage("PAN data matched");
          $state.go(sConfig.appStates.consents);
        }, 2000);

        //$state.go(sConfig.appStates.register);
      } catch (exception) {
        logger.error("exception: " + exception);
      }
    }

    logger.debug("PANCtrl end");
  }
})();
