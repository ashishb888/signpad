(function() {
  angular.module('starter').controller('RegisterCtrl', RegisterCtrl);

  RegisterCtrl.$inject = ['$state', 'starterConfig', 'utilService',
    '$ionicHistory', 'lsService', '$rootScope', 'cameraService',
    '$ionicActionSheet', '$scope'
  ];

  function RegisterCtrl($state, sConfig, utilService,
    $ionicHistory, lsService, $rootScope, cameraService, $ionicActionSheet,
    $scope) {
    // Variables section
    var logger = utilService.getLogger();

    logger.debug("RegisterCtrl start");

    // Variables section
    var rc = this;

    rc.rf = {};
    rc.rf.chequeImgBase64;
    rc.isChequeImg = false;

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
              rc.isChequeImg = true;
              rc.rf.chequeImgBase64 = sucResp;
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
          case sConfig.picSrc.gallery:
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
        titleText: "Choose source type",
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
              addImgs('', sConfig.picSrc.gallery);
              break;
            case 2:
              hideImgsActionSheet();
              break;
          }
          return true;
        }
      });
    }

    var signaturePad;
    var img = new Image(); // Create new img element
    var canvas = document.getElementById('signatureCanvas');
    var ctx = canvas.getContext("2d");
    // img.src = '../img/edelweiss-logo.jpg'; // Set source path
    
    /*img.onload = function() {
      signaturePad = new SignaturePad(canvas);   
      ctx.drawImage(img, 0, 0);   
    };*/

    signaturePad = new SignaturePad(canvas);   
    ctx.drawImage(document.getElementById('img'), 0, 0);   

    //img.src = 'https://mdn.mozillademos.org/files/5395/backdrop.png'; // Dont work
    img.src = "../img/edelweiss-logo.jpg";

    //var signaturePad = new SignaturePad(canvas);

    $scope.clearCanvas = function() {
      signaturePad.clear();
    }

    $scope.saveCanvas = function() {
      var sigImg = signaturePad.toDataURL();
      $scope.signature = sigImg;
    }

    logger.debug("RegisterCtrl end");
  }
})();
