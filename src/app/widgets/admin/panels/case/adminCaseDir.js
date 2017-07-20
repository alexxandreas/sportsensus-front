(function () {
	"use strict";
	/**
	 * @desc
	 * @example
	 */
	angular.module('SportsensusApp')
		.directive('adminCaseDir', adminCaseDir);

	adminCaseDir.$inject = [
		'$rootScope'
	];

	function adminCaseDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				// type: '@'
			},
			templateUrl: '/views/widgets/admin/panels/case/case.html',
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
	                
                    
                    
                    $scope.tinymceOptions = {
                        selector: '#case_editor',
                        height: 700,
                        plugins: [
                            'advlist autolink lists link image charmap print preview hr anchor pagebreak',
                            'searchreplace wordcount visualblocks visualchars code fullscreen',
                            'insertdatetime media nonbreaking save table contextmenu directionality',
                            'emoticons template paste textcolor colorpicker textpattern imagetools codesample'
                        ],
                        toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
                        toolbar2: 'print preview media | forecolor backcolor emoticons | codesample help',
                        image_advtab: true,
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
                    }
                    
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
              
                    
                    
                    


              
                    $scope.caseId = Number.parseInt($routeParams.caseId);
                    if (Number.isNaN($scope.caseId)){
                        setArticle({
                            title: 'Заголовок', 
                            content: 'Текс статьи'
                        });
                    } else {
                        $scope.showPreloader = true;
                        ArticlesSrv.getArticle($scope.caseId).then(function(article){
                            setArticle(article);
                            $scope.showPreloader = false;
                        }, function(){
                            $scope.showPreloader = false;
                            $mdDialog.show(
                              $mdDialog.alert()
                                .clickOutsideToClose(false)
                                .title('Ошибка')
                                .textContent('Ошибка загрузки данных с сервера')
                                .ok('OK')
                            ).then(function(){
                                $location.path('/admin/cases/');
                            });
                        })
                    }
                     
                    function setArticle(article){
                        article.tags = article.tags || [];
                        article.groupedTags = article.groupedTags || {};
                        article.groupedTags.sport = article.groupedTags.sport || [];
                        article.groupedTags.category = article.groupedTags.category || [];
                        
                        $scope.article = article;   
                        
                    }
                    
                    $scope.$on("$destroy", function() {
                        tinymce.remove("#case_editor");
                    });
             
                    ArticlesSrv.getTags().then(function(tags){
                        $scope.allTags = tags;
                    }); 

            
                    $scope.removeArticle = function(article){
                        $scope.showPreloader = true;
                        ArticlesSrv.removeArticle(article).then(function(){
                            $location.path('/admin/cases/');
                        }, function(){
                            $scope.showPreloader = false;
                            $mdDialog.show(
                              $mdDialog.alert()
                                .clickOutsideToClose(false)
                                .title('Ошибка')
                                .textContent('Ошибка удаления')
                                .ok('OK')
                            );
                        });
                    };
                    
                    
                    $scope.saveArticle = function(){
                        $scope.showPreloader = true;
                        ArticlesSrv.setArticle($scope.article).then(function(){
                            $scope.showPreloader = false;
                        }, function(){
                            $scope.showPreloader = false;
                            $mdDialog.show(
                              $mdDialog.alert()
                                .clickOutsideToClose(false)
                                .title('Ошибка')
                                .textContent('Ошибка сохранения')
                                .ok('OK')
                            );
                        });
                    };
                    
                    $scope.cancelEdit = function(){
                        $location.path('/admin/cases/');
                    };
                    
                    
                    
                    
                    
                    
                    
                    $scope.openKDPVFileDialog = function(){
                        $scope.$broadcast('imageUploadFileEvent');
                    }
                    
                    $scope.$watch('imageUploadFile', function(newValue, oldValue){
                        if (!newValue) return;
                        var file = newValue;
                        
                        $scope.setFile(file);
                        
                        
                    });
                    
                    $scope.removeImage = function(){
                        $scope.article.image = null;
                    };
                    
                    $scope.setFile = function(file){
                        var reader = new FileReader();  
                        reader.onload = function(e) {
                            var img = document.createElement("img");
                            img.onload = function () {
                                var canvas = document.createElement("canvas");
                                var ctx = canvas.getContext("2d");
                                ctx.drawImage(img, 0, 0);
                                
                                var MAX_WIDTH = 300;
                                var MAX_HEIGHT = 300;
                                var width = img.width;
                                var height = img.height;
                                
                                var k = Math.max(width / MAX_WIDTH, height / MAX_HEIGHT, 1);
                                
                                height /= k;
                                width /= k;
                                
                                canvas.width = width;
                                canvas.height = height;
                                var ctx = canvas.getContext("2d");
                                ctx.drawImage(img, 0, 0, width, height);
                                
                                var dataURL = canvas.toDataURL("image/png");
                                
                                var blobBin = atob(dataURL.split(',')[1]);
                                var array = [];
                                for(var i = 0; i < blobBin.length; i++) {
                                    array.push(blobBin.charCodeAt(i));
                                }
                                var newfile=new Blob([new Uint8Array(array)], {type: 'image/png'});

                                $scope.$apply(function(){
                                    UploadFileSrv.uploadFile(newfile, imageUploadUrl, 'upload', file.name).then(function(response){
                                        var url = response.data && response.data.url;
                                        if (!url) return;
                                        
                                        
                                        $scope.article.image = url;
                                        // $scope.article.image = 'http://sportsensus.ru' + encodeURI(url);
                                    }, function(){
                                        
                                    });
                                    
                                })
                                
                            }
                            img.src = e.target.result;
                        }
                        reader.readAsDataURL(file);
                    };
                    
                    
                    $scope.transformSportTag = function(tag) {
                      // If it is an object, it's already a known chip
                      if (angular.isString(tag)) {
                        //   if (tag.indexOf('sport::') == 0)
                            return tag;
                      }
                
                      // Otherwise, create a new one
                      return null;
                    };
                    
                    $scope.onSportTagAdd = function(tag) {
                        var a = tag;
                    }
                    
                    $scope.transformCategoryTag = function(tag) {
                      // If it is an object, it's already a known chip
                      if (angular.isString(tag)) {
                          if (tag.indexOf('category::') == 0)
                            return tag;
                      }
                
                      // Otherwise, create a new one
                      return null;
                    };
            
                    $scope.querySportTagSearch = function(query) {
                        return querySportTagSearch('sport', query);
                    };
                    
                    $scope.queryCategoryTagSearch = function(query) {
                        return querySportTagSearch('category', query);
                    };
                    
                    function querySportTagSearch(group, query) {
                        var lowercaseQuery = angular.lowercase(query);
                        
                        if (!$scope.allTags[group]) return [];
                        
                        var results = query ? $scope.allTags[group].filter(function(tag){
                            return tag.toLowerCase().indexOf(lowercaseQuery) === 0;
                        }) : [];
                        
                        return results;
                    }
				

				}]
		};
	}
}());
