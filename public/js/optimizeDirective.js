angular.module('vaqoApp')
.directive('optimize', function() {
    return{
        restrict:'E',
        transclude:true,
        templateUrl:'../partials/optimizeTemplate.html',
        scope: {},
        link:function(scope,elem,attr){}
    }
})