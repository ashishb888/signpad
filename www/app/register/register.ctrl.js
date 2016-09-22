(function() {
  angular.module('starter').controller('RegisterCtrl', RegisterCtrl);

  RegisterCtrl.$inject = ['$state', 'starterConfig', 'utilService',
    '$ionicHistory', 'lsService', '$rootScope', 'cameraService',
    '$ionicActionSheet'
  ];

  function RegisterCtrl($state, sConfig, utilService,
    $ionicHistory, lsService, $rootScope, cameraService, $ionicActionSheet) {
    // Variables section
    var logger = utilService.getLogger();

    logger.debug("RegisterCtrl start");

    // Variables section
    var rc = this;

    rc.rf = {};
    rc.rf.chequeImgBase64;

    // Functions section
    rc.register = register;
    rc.imgsActionSheet = imgsActionSheet;

    // Local functions
    var addImgs = addImgs;
    var getImages = getImages;

    function register() {
      try {
        logger.debug("register function");

        if (!utilService.isAppOnlineService()) {
          utilService.toastMessage(sConfig.msgs.noConnMsg);
          return;
        }

      } catch (exception) {
        logger.error("exception: " + exception);
      }
    }

    function addImgs(type, srcType) {
      try {
        logger.debug("addImgs function");

        var promise = getImages(srcType, 1);
        //var promise = getImages("camera", 1);
        promise.then(function(imageData) {
          logger.debug("imageData: " + JSON.stringify(imageData));
          utilService.base64(imageData.uri[0])
            .then(function(sucResp) {
              chequeImgBase64 = sucResp;
            }, function(errResp) {
              logger.error("errResp: " + JSON.stringify(errResp));
            });
        });

      } catch (exception) {
        logger.error("exception: " + exception);
      }
    }

    function getImages(srcType, nImgs) {
      try {
        logger.debug("getImages function");

        switch (srcType) {
          case sConfig.picSrc.camera:
            return cameraService.clickImage(srcType);
            break;
          case sConfig.picSrc.galary:
            return cameraService.selectImage(nImgs);
            break;
          default:
            return cameraService.clickImage(srcType);
        }
      } catch (exception) {
        logger.error("exception: " + exception);
      }
    }

    function imgsActionSheet() {
      logger.debug("imgsActionSheet function");

      var hideImgsActionSheet = $ionicActionSheet.show({
        titleText: "Select an image",
        buttons: [{
          text: "<i class='txt-color icon ion-camera'></i> Camera"
        }, {
          text: "<i class='txt-color icon ion-images'></i> Gallary"
        }, {
          text: "<i class='txt-color icon ion-close-circled'></i> Cancel"
        }],
        /*cancelText: 'Cancel',*/
        cancel: function() {
          logger.debug("Cancelled");
        },
        buttonClicked: function(index) {
          logger.debug("Button clicked", index);

          switch (index) {
            case 0:
              addImgs('', sConfig.picSrc.camera);
              break;
            case 1:
              addImgs('', sConfig.picSrc.gallary);
              break;
            case 2:
              hideImgsActionSheet();
              break;
          }
          return true;
        }
      });
    }

    logger.debug("RegisterCtrl end");
  }
})();
