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
    rc.rf.signedChequeImgBase64;
    rc.isChequeImg = false;

    // Canvas objects
    var chequeSignaturePad;

    // Functions section
    rc.register = register;
    rc.imgsActionSheet = imgsActionSheet;
    rc.clearCanvas = clearCanvas;
    rc.saveCanvas = saveCanvas;
    rc.imgToCanvas = imgToCanvas;
    rc.clearChequeCanvas = clearChequeCanvas;
    rc.saveChequeCanvas = saveChequeCanvas;

    // Local functions
    var addImgs = addImgs;
    var getImages = getImages;

    // Functions definations
    function clearChequeCanvas() {
      logger.debug("clearChequeCanvas function");

      chequeSignaturePad.clear();
    }

    function saveChequeCanvas() {
      logger.debug("saveChequeCanvas function");

      rc.rf.signedChequeImgBase64 = chequeSignaturePad.toDataURL("image/png");
    }

    function imgToCanvas(base64) {
      try {
        logger.debug("imgToCanvas function");

        var canvas = document.getElementById("signChequeCanvas");
        chequeSignaturePad = new SignaturePad(canvas);
        // chequeSignaturePad.fromDataURL("data:image/jpg;base64," + base64);
      } catch (exception) {
        logger.error("exception: " + exception);
      }
    }

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
              rc.imgToCanvas(sucResp);
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

    /*var signaturePad;
    var img = new Image(); // Create new img element
    var canvas = document.getElementById('signatureCanvas');
    var ctx = canvas.getContext("2d");*/
    /*img.src = '../img/edelweiss-logo.jpg'; // Set source path

    img.onload = function() {
      signaturePad = new SignaturePad(canvas);   
      ctx.drawImage(img, 10, 10);   
    };*/

    /*signaturePad = new SignaturePad(canvas); */

    function clearCanvas() {
      logger.debug("saveCanvas function");

      signaturePad.clear();
    }

    function saveCanvas() {
      logger.debug("saveCanvas function");

      rc.testImg = signaturePad.toDataURL("image/png");
    }

    logger.debug("RegisterCtrl end");
  }
})();
