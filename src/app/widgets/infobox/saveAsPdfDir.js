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
        '$q'
    ];

    function saveAsPdfDir(
        $rootScope,
        $q
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
                canvg(canvas, xml);
                
                var svgE = angular.element(svg);
                var canvasE = angular.element(canvas);
                svgE.replaceWith(canvasE);
                resolve({
                    svg: svgE,
                    canvas: canvasE
                });
            });
        }


        

        function saveAsPdf(element) {
            // SVG рисуем отдельно от всего остального, потому что они портят текст...
            //var element = el;

            var elements = element.find('svg');

            var promises = Array.prototype.map.call(elements,function (item) {
                return svg2canvas2(item);
                /*return $q(function(resolve, reject){
                    html2canvas(item, {
                        logging:true,
                        allowTaint: true
                    }).then(function(canvas){
                        var svgE = angular.element(item);
                        var canvasE = angular.element(canvas);
                        svgE.replaceWith(canvasE);
                        resolve({
                            svg: svgE,
                            canvas: canvasE
                        })
                    });
                });*/
            });


            $q.all(promises).then(function(elements){
                render(elements);
            }, function(err){});


            function render(elements){
                html2canvas(element[0], {
                    useCORS: true,
                    allowTaint: true
                }).then(function (canvas) {
                    elements.forEach(function(element){
                        element.canvas.replaceWith(element.svg);
                    });

                    var imgData = canvas.toDataURL('image/png');
                    // 'a4': [595.28, 841.89],
                    var doc = new jsPDF('p', 'pt', 'a4', true);
                    
                    var scale = Math.min((595.28 - 20)/canvas.width, (841.89-20)/canvas.height);
                    // doc.addImage(imgData, 'PNG', 10, 10, canvas.width, canvas.height);
                    doc.addImage(imgData, 'PNG', 10, 10, canvas.width*scale, canvas.height*scale);
                    doc.save('sample-file.pdf');
                });
            }
        }

        return {
            restrict: 'A',
            link: function ($scope, $el, attrs) {
                //el = $el;

                // $scope.saveAsPdf = saveAsPdf;
                $scope.saveAsPdf = function(){return saveAsPdf($el);};
            }
        };
    }
}());
