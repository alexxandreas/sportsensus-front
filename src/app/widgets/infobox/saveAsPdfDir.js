(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('saveAsPdfDir', saveAsPdfDir);

    saveAsPdfDir.$inject = [
        '$rootScope',
        '$q',
        '$timeout',
        '$mdDialog',
        'ApiSrv'
    ];

    function saveAsPdfDir(
        $rootScope,
        $q,
        $timeout,
        $mdDialog,
        ApiSrv
    )    {
        //var el;

        /*function saveAsPdf(){
            console.log(el[0]);
            // var canvas = document.createElement("canvas");
            // canvas.width = 1000;
            // canvas.height = 1000;
             html2canvas(el[0], {
            //html2canvas(el[0].children[0], {
                logging: true,
                allowTaint: 'true'
                 // canvas: canvas
                 // ,onrendered: function(canvas) {
                 //     var imgData = canvas.toDataURL('image/png');
                 //     var doc = new jsPDF('p', 'px', 'a0');
                 //     doc.addImage(imgData, 'PNG', 10, 10, canvas.width, canvas.height);
                 //     doc.save('sample-file.pdf');
                 // }
            }).then(function(canvas){
                // var imgData = canvas.toDataURL('image/png');
                var imgData = canvas.toDataURL('image/jpeg');
                var doc = new jsPDF('p', 'px', 'a0');
                // doc.addImage(imgData, 'PNG', 10, 10, canvas.width, canvas.height);
                doc.addImage(imgData, 'JPEG', 10, 10, canvas.width, canvas.height);
                doc.save('sample-file.pdf');
            });
        }*/

        // returns promise({svg:Element, canvas:Element})
        // canvas.replaceWith(svg);
        function svg2canvas(svg){
            return $q(function(resolve, reject){
                html2canvas(svg, {
                    logging:true,
                    allowTaint: true
                }).then(function(canvas){
                    var svgE = angular.element(svg);
                    var canvasE = angular.element(canvas);
                    svgE.replaceWith(canvasE);
                    resolve({
                        svg: svgE,
                        canvas: canvasE
                    })
                });
            });
        }

        // returns promise({svg:Element, canvas:Element})
        // canvas.replaceWith(svg);
        function svg2canvas2(svg){
            return $q(function(resolve, reject){

                var canvas = document.createElement("canvas");
                var xml = (new XMLSerializer()).serializeToString(svg);

                // Removing the name space as IE throws an error
                xml = xml.replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, '');
                try {
					/*canvg(canvas, xml);
					var svgE = angular.element(svg);
					var canvasE = angular.element(canvas);
                    svgE.replaceWith(canvasE);*/

					var svgE = angular.element(svg);
					var canvasE = angular.element(canvas);
					svgE.after(canvasE);
					canvg(canvas, xml);
					svgE.remove();

                } catch(err){}
                resolve({
                    svg: svgE,
                    canvas: canvasE
                });
            });
        }


        

        function saveAsPdf(element) {
            return $q(function(resolve, reject) {
                // SVG рисуем отдельно от всего остального, потому что они портят текст...
                var elements = element.find('svg');

                var promises = Array.prototype.map.call(elements, function (item) {
                    return svg2canvas2(item);
                });

                $q.all(promises).then(function (elements) {
                    render(elements);
                }, reject);


                function render(elements) {
                    html2canvas(element[0], {
                        useCORS: true,
                        allowTaint: true
                    }).then(function (canvas) {
                        elements.forEach(function (element) {
                            element.canvas.replaceWith(element.svg);
                        });

                        var imgData = canvas.toDataURL('image/png');
                        // 'a4': [595.28, 841.89],
                        var doc = new jsPDF('p', 'pt', 'a4', true);

                        var scale = Math.min((595.28 - 20) / canvas.width, (841.89 - 20) / canvas.height);
                        // doc.addImage(imgData, 'PNG', 10, 10, canvas.width, canvas.height);
                        doc.addImage(imgData, 'PNG', 10, 10, canvas.width * scale, canvas.height * scale);

                        resolve(doc);
                        //doc.save('sample-file.pdf');
                    }, reject);
                }
            });
        }

        return {
            restrict: 'A',
            link: function ($scope, $el, attrs) {
                //el = $el;

                // $scope.saveAsPdf = saveAsPdf;
                $scope.savePdf = function(options){
                    $scope.$broadcast('printStart');
                    $timeout(function() {
                        saveAsPdf($el).then(function (doc) {
                                doc.save(options && options.filename ? options.filename + '.pdf' : 'sportsensus-report.pdf');
                            }, function () {
                                alert('Ошибка записи в PDF');
                            })
                            .finally(function () {
                                $scope.$broadcast('printEnd');
                            });
                    },50);
                };
                $scope.sendPdf = function(options){
                    $scope.$broadcast('printStart');
                    $timeout(function() {
                        saveAsPdf($el).then(function (doc) {
                                var confirm = $mdDialog.prompt()
                                    .title('Отправка на почту')
                                    .textContent('Введите почту, на которую нужно отправить письмо')
                                    .placeholder('e-mail')
                                    .ariaLabel('e-mail')
                                    //.initialValue('Buddy')
                                    //.targetEvent(ev)
                                    .ok('OK')
                                    .cancel('Отмена');
                                $mdDialog.show(confirm).then(function(result) {
                                    if (!result) return;

                                    //var data = doc.output('datauristring');
                                    var data = btoa(doc.output());
                                    ApiSrv.sendEmail({
                                        address: result,
                                        // theme: 'Отчет',
                                        
                                        theme: options.title || 'Отчет с портала sportsensus.ru',
                                        // message: 'Получите файлик',
                                        message: options.message || '',
                                        attachments: [{
                                            filename: options && options.filename ? options.filename + '.pdf' : 'sportsensus-report.pdf',
                                            data: data
                                        }]
                                    }).then(function(){
                                        $mdDialog.show($mdDialog.alert()
                                            .title('Отправка на почту')
                                            .textContent('Письмо успешно отправлено на ' + result)
                                            .ok('OK'));
                                    }, function(){
                                        $mdDialog.show($mdDialog.alert()
                                            .title('Отправка на почту')
                                            .textContent('Ошибка отправки письма на ' + result)
                                            .ok('OK'));
                                    });
                                    //$scope.status = 'You decided to name your dog ' + result + '.';
                                }, function() {
                                    //$scope.status = 'You didn\'t name your dog.';
                                });
                            //doc.save(options && options.filename || 'sportsensus-report.pdf');
                            }, function () {
                                alert('Ошибка записи в PDF');
                            })
                            .finally(function () {
                                $scope.$broadcast('printEnd');
                            });
                    },50)
                };
                $scope.printPdf = function(options){
                    $scope.$broadcast('printStart');
                    $timeout(function() {
                        saveAsPdf($el).then(function(doc){
                                doc.autoPrint();
                                //doc.output('dataurlnewwindow');
                                window.open(doc.output('bloburl'), '_blank');
                            }, function(){alert('Ошибка записи в PDF');})
                            .finally(function(){$scope.$broadcast('printEnd');});
                    },50);
                };
            }
        };
    }
}());
