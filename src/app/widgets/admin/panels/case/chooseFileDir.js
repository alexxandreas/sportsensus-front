(function () {
    "use strict";
    /**
     * @desc
     */
    angular.module('SportsensusApp')
        .directive('chooseFile', function() {
            return {
              link: function (scope, elem, attrs) {
               // var button = elem.find('button');
                var input = angular.element(elem[0].querySelector('input#fileInput'));
                scope.chooseFileElem = elem;
                
        
                // button.bind('click', function() {
                //   input[0].click();
                // });
        
                scope.openFileDialog = function(){
                    input[0].click();
                }
                
                input.bind('change', function(e) {
                  scope.$apply(function() {
                    var files = e.target.files;
                    if (files[0]) {
                        scope.setFile(files[0]);
                        
                        
                     // scope.fileName = files[0].name;
                    } else {
                        scope.setFile();
                      //scope.fileName = null;
                    }
                  });
                });
              }
            };
          });
   
   
          
}());
