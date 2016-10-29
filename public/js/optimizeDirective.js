angular.module('vaqoApp')
.directive('optimize', function() {
    return{
        restrict:'E',
        transclude:true,
        template:'<p>This is the Optimize tab.</p>',
        scope: {},
        link:function(scope,elem,attr){}
    }
})