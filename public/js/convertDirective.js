angular.module('vaqoApp')
.directive('convert', function() {
    return{
        restrict:'E',
        transclude:true,
        templateUrl:'../partials/convertTemplate.html',
        scope: {},
        link:function(scope,elem,attr){}
    }
})