(function() {
  angular.module('starter').controller('AadharCtrl', AadharCtrl);

  AadharCtrl.$inject = ['$state', 'starterConfig', 'utilService',
    '$ionicHistory', 'lsService', '$rootScope', 'panService', '$timeout',
    '$ionicLoading', '$ionicModal', '$scope'
  ];

  function AadharCtrl($state, sConfig, utilService,
    $ionicHistory, lsService, $rootScope, panService, $timeout, $ionicLoading,
    $ionicModal, $scope
  ) {
    // Variables section
    var logger = utilService.getLogger();

    logger.debug("AadharCtrl start");

    // Variables section
    var ac = this;

    // Modals variables
    ac.otpModal;

    // Functions section
    ac.verifyOTP = verifyOTP;
    ac.sendOTP = sendOTP;

    // Modals functions
    ac.showOTPModal = showOTPModal;
    ac.hideOTPModal = hideOTPModal;

    // Functions definations
    $ionicModal.fromTemplateUrl('app/aadhar/otp-modal.html', {
      scope: $scope,
      animation: sConfig.modal.animation
    }).then(function(modal) {
      ac.otpModal = modal;
    });

    function showOTPModal(index) {
      logger.debug("showOTPModal function");
      ac.otpModal.show();
    }

    function hideOTPModal() {
      logger.debug("hideOTPModal function");
      ac.otpModal.hide();
    }

    function sendOTP() {
      try {
        logger.debug("sendOTP function");

        if (!utilService.isAppOnlineService()) {
          utilService.toastMessage(sConfig.msgs.noConnMsg);
          return;
        }

        $ionicLoading.show({
          template: '<ion-spinner icon="lines"></ion-spinner>'
        });

        $timeout(function() {
          $ionicLoading.hide();
          ac.showOTPModal();
        }, 2000);
      } catch (exception) {
        logger.error("exception: " + exception);
      }
    }

    function verifyOTP() {
      try {
        logger.debug("verifyOTP function");

        if (!utilService.isAppOnlineService()) {
          utilService.toastMessage(sConfig.msgs.noConnMsg);
          return;
        }

        $ionicLoading.show({
          template: '<ion-spinner icon="lines"></ion-spinner>'
        });

        $timeout(function() {
          $ionicLoading.hide();
          ac.hideOTPModal();
          $state.go(sConfig.appStates.consents);
        }, 2000);
      } catch (exception) {
        logger.error("exception: " + exception);
      }
    }

    logger.debug("AadharCtrl end");
  }
})();
