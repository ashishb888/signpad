(function() {
  angular.module('starter').controller('PGCtrl', PGCtrl);

  PGCtrl.$inject = ['$state', 'starterConfig', 'utilService',
    '$ionicHistory', 'lsService', '$rootScope', 'panService', '$timeout',
    '$ionicLoading', '$ionicModal', '$scope'
  ];

  function PGCtrl($state, sConfig, utilService,
    $ionicHistory, lsService, $rootScope, panService, $timeout, $ionicLoading,
    $ionicModal, $scope
  ) {
    // Variables section
    var logger = utilService.getLogger();

    logger.debug("PGCtrl start");

    // Variables section
    var pgc = this;

    // Functions section
    pgc.makePayment = makePayment;
    pgc.goHome = goHome;

    // Modals functions
    pgc.showPGModal = showPGModal;
    pgc.hidePGModal = hidePGModal;

    // Functions definations
    function goHome() {
      logger.debug("goHome function");

      pgc.hidePGModal();
      $state.go(sConfig.appStates.pan);
    }

    $ionicModal.fromTemplateUrl('app/pg/pg-modal.html', {
      scope: $scope,
      animation: sConfig.modal.animation
    }).then(function(modal) {
      pgc.pgModal = modal;
    });

    function showPGModal(index) {
      logger.debug("showPGModal function");
      pgc.pgModal.show();
    }

    function hidePGModal() {
      logger.debug("hidePGModal function");
      pgc.pgModal.hide();
    }

    function makePayment() {
      try {
        logger.debug("makePayment function");

        if (!utilService.isAppOnlineService()) {
          utilService.toastMessage(sConfig.msgs.noConnMsg);
          return;
        }

        $ionicLoading.show({
          template: '<ion-spinner icon="lines"></ion-spinner>'
        });

        $timeout(function() {
          $ionicLoading.hide();
          utilService.toastMessage("Payment received");
          pgc.showPGModal()
        }, 2000);

        //$state.go(sConfig.appStates.register);
      } catch (exception) {
        logger.error("exception: " + exception);
      }
    }

    logger.debug("PGCtrl end");
  }
})();
