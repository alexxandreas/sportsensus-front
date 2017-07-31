(function () {
	"use strict";
	/**
	 * @desc
	 * @example
	 */
	angular.module('SportsensusApp')
		.directive('adminSendMailDir', adminSendMailDir);

	adminSendMailDir.$inject = [
		'$rootScope'
	];

	function adminSendMailDir(
		$rootScope
	)    {
		return {
			restrict: 'E',
			scope: {
				type: '@'
			},
			templateUrl: '/views/widgets/admin/panels/sendMail/sendMail.html', 
			link: function ($scope, $el, attrs) {
				//$scope.init();
			},

			controller: [
				'$scope',
				'$routeParams',
				'$location',
				'$window',
				'$q',
				'$mdDialog',
				'ParamsSrv',
				'ApiSrv',
				'AdminProfilesSrv',
				'TariffsSrv',
				function(
					$scope,
					$routeParams,
					$location,
					$window,
					$q,
					$mdDialog,
					ParamsSrv,
					ApiSrv,
					AdminProfilesSrv,
					TariffsSrv
				) { 
	
	                $scope.tinyOptions = {
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
                        image_advtab: true
                    }
	
	                $scope.theme = 'Информационное письмо от sportsensus.ru';
	
                    var userId = Number.parseInt($routeParams.userId);
                    
                    $scope.selectedProfiles = [];
                    
                    
                    $scope.showPreloader = true;
                    AdminProfilesSrv.getProfiles().then(function(profiles){
						$scope.showPreloader = false;	
						$scope.profiles = profiles;
						
						if (isNaN(userId)) {
                            $scope.usersSelectable = true;
                        } else {
                            $scope.selectedProfiles = $scope.profiles.filter(function(profile){
                                return profile.user_id == userId;
                            });
                            
                            $scope.usersSelectable = !$scope.selectedProfiles.length;
                            
                            // if ($scope.selectedProfiles.length)
                            //     $scope.selectedProfiles = $scope.selectedProfiles[0];
                            // else
                            //     $scope.selectedProfiles = null;
                            // $scope.usersSelectable = true;
                            
                        }
                    
					}, function(){
						$scope.showPreloader = false;
                        $mdDialog.show(
                          $mdDialog.alert()
                            .clickOutsideToClose(false)
                            .title('Ошибка')
                            .textContent('Ошибка загрузки данных')
                            .ok('OK')
                        );
					});
                    
                    
                    $scope.sendMail = function(){
                        var addresses = $scope.selectedProfiles.map(function(profile){
                            return profile.login;
                        });
                        if (!addresses) {
                            $mdDialog.show($mdDialog.alert()
                                .title('Отправка на почту')
                                .textContent('Не указан получатель письма')
                                .ok('OK'));   
                            return;
                        }
                        
                        $scope.showPreloader = true;
                        ApiSrv.sendEmail({
                            address: addresses,
                            theme: $scope.theme,
                            message: $scope.message
                            // attachments: [{
                            //     filename: options && options.filename ? options.filename + '.pdf' : 'sportsensus-report.pdf',
                            //     data: data
                            // }]
                        }).then(function(){
                            $scope.showPreloader = false;
                            $mdDialog.show($mdDialog.alert()
                                .title('Отправка на почту')
                                // .textContent('Письмо успешно отправлено на \n' + addresses.join(''))
                                .textContent('Письмо успешно отправлено')
                                .ok('OK'));
                        }, function(){
                            $scope.showPreloader = false;
                            $mdDialog.show($mdDialog.alert()
                                .title('Отправка на почту')
                                .textContent('Ошибка отправки письма')
                                .ok('OK'));
                        });
                    }

					
				}]
		};
	}
}());
