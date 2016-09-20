(function () {
    "use strict";
    /**
     * @desc
     * @example
     */
    angular.module('SportsensusApp')
        .directive('mapDir', mapDir);

    mapDir.$inject = [
        '$rootScope'
    ];

    function mapDir(
        $rootScope
    )    {
        return {
            restrict: 'E',
            scope: {
                hotel: '=',
                mapId: '='
            },
            //templateUrl: '/views/hotelsList/hotelsList.html',
            //replace: true, center="center" \
            template: '<leaflet \
                bounds="bounds" \
                lf-center="center" \
                tiles="tiles" \
                defaults="defaults" \
                width="100%" \
                height="100%" \
                id="{{mapId}}" \
                ></leaflet>',
            link: function ($scope, $el, attrs) {},

            controller: [
                '$scope',
                '$location',
                'leafletData',
                'leafletBoundsHelpers',
                function(
                    $scope,
                    $location,
                    leafletData,
                    leafletBoundsHelpers
                ){
                    $scope.tiles = {
                        url: '//tiles.maps.sputnik.ru/{z}/{x}/{y}.png',
                        options: {
                            minZoom: 3,
                            maxZoom: 19
                        }
                    };

                    $scope.bounds = leafletBoundsHelpers.createBoundsFromArray([
                        [ 51.508742458803326, -0.087890625 ],
                        [ 51.508742458803326, -0.087890625 ]
                    ]);

                    $scope.center = {};

                    $scope.defaults = {
                        zoomControl: false,
                        attributionControl: false
                    };

                    //$scope.mapId = 'map_hotel_'+hotel.id;

                    leafletData.getMap($scope.mapId).then(function (map) {
                        if ($scope.hotel && $scope.hotel.geoJson){
                            var layer = L.GeoJSON.geometryToLayer($scope.hotel.geoJson);
                            var bounds = layer.getBounds();
                            if (bounds){
                                $scope.bounds = leafletBoundsHelpers.createBoundsFromLeaflet(bounds);
                            }
                        }

                    });

                }]
        };
    }
}());
