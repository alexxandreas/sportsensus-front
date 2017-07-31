(function () {
	"use strict";
	/**
	 * @desc
	 * @example
	 */
	angular.module('SportsensusApp')
		.directive('tinyDir', tinyDir);

	tinyDir.$inject = [
		'$rootScope'
	];

	function tinyDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				tinyOptions: '=',
				tinyModel: '='
			},
			//templateUrl: '/views/widgets/admin/panels/case/case.html',
			template: '<div>'+
                '<input type="file" class="ng-hide" file-model-dir="tinymceUploadFile" file-model-open-event="tinymceUploadFileEvent"/>'+
                '<textarea ui-tinymce="tinymceOptions" ng-model="tinyModel"></textarea>'+
            '</div>',
			link: function ($scope, $el, attrs) {
				//$scope.init();
				$scope.el = $el;
			},

			controller: [
				'$scope',
				'$routeParams',
				'$location',
				'$window',
				'$compile',
				'$mdDialog',
				'ParamsSrv',
				'ArticlesSrv',
				'ConfigSrv',
				'UserSrv',
				'UploadFileSrv',
				function(
					$scope,
					$routeParams,
					$location,
					$window,
					$compile,
					$mdDialog,
					ParamsSrv,
					ArticlesSrv,
					ConfigSrv,
					UserSrv,
					UploadFileSrv
				) {
	
	                var proxyURL = /*ConfigSrv.get().proxyURL || */ '';
	                var imageUploadUrl = proxyURL + ConfigSrv.get().imageUploadUrl + '?sid=' + UserSrv.getSid() + '&format=json';
	
	                $scope.tinymceUploadFile = null;
	                
                    //$scope.tinyOptions
                    $scope.tinymceOptions = angular.extend({}, $scope.tinyOptions, {
                        // selector: '#case_editor',
                        // height: 700,
                        // plugins: [
                        //     'advlist autolink lists link image charmap print preview hr anchor pagebreak',
                        //     'searchreplace wordcount visualblocks visualchars code fullscreen',
                        //     'insertdatetime media nonbreaking save table contextmenu directionality',
                        //     'emoticons template paste textcolor colorpicker textpattern imagetools codesample'
                        // ],
                        // toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
                        // toolbar2: 'print preview media | forecolor backcolor emoticons | codesample help',
                        // image_advtab: true,
                        file_browser_callback: function(field_name, url, type, win) {
                            if(type=='image') {
                                $scope.$broadcast('tinymceUploadFileEvent');
                            }
                        },
                        file_picker_callback: function(cb, value, meta) {
                            if (meta.filetype == 'image'){
                                $scope.$broadcast('tinymceUploadFileEvent');
                            }
                        }
                    });
                    
                    $scope.$watch('tinymceUploadFile', function(newValue, oldValue){
                        if (!newValue) return;
                        var file = newValue;
                        
                        $scope.showUploadPreloader();
                        UploadFileSrv.uploadFile(file, imageUploadUrl, 'upload').then(function(response){
                            $scope.hideUploadPreloader();
                            
                            var url = response.data && response.data.url;
                            if (!url) return;
                            
                            $scope.setImageUrl(url);
                        }, function(){
                            $scope.hideUploadPreloader();
                        });
                    });
                    
                    $scope.setImageUrl = function(url){
                        var openBtn = document.querySelectorAll('.mce-btn.mce-open')[0];
                        var textBox = openBtn.parentElement.querySelector('.mce-textbox');
                        var textBoxEl = angular.element(textBox)
                        textBoxEl.val(url);
                        
                        var closeBtn = openBtn.closest('.mce-window').querySelector('.mce-primary');
                        var closeBtnEl = angular.element(closeBtn)[0];
                        closeBtn.click();
                    }
                    
                    var buttonContainer = null;
                    var hiddenButton = null;
                    var preloader = null;
                    
                    $scope.showUploadPreloader = function(){
                        hiddenButton = angular.element(document.querySelectorAll('.mce-btn.mce-open button')[0]);
                        hiddenButton.remove();
                        buttonContainer = angular.element(document.querySelectorAll('.mce-btn.mce-open')[0]);
            
                        var tpl = '<md-progress-circular md-mode="indeterminate" md-diameter="26" style="padding:1px;"></md-progress-circular>'
                        preloader = angular.element(tpl);
                        $compile(preloader)($scope);
                        buttonContainer.append(preloader);
                    }
                    
                    $scope.hideUploadPreloader = function(){
                        preloader.remove();
                        buttonContainer.append(hiddenButton);
                    }
              
                    
                    
                    

                    $scope.$on("$destroy", function() {
                        tinymce.remove("#case_editor");
                    });

				}]
		};
	}
}());
