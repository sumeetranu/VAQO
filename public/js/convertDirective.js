angular.module('vaqoApp')
.directive('convert', function() {
    return{
        restrict:'E',
        transclude:true,
        templateUrl:'../partials/convertTemplate.html',
        scope: true,
        controllerAs: 'convert',
        controller:function(){
            // "this.xxx" allows you to access from templateUrl as "convert.xxx"
            // TODO: change this. to vm. and set ' var vm = this;'

            this.convertToSql = function(){
                console.log('Convert to sql');

                // TODO: Get handle from code mirror for Relational Algebra code

                updateSqlEditor('converted SQL query');
            
            }

            function updateSqlEditor(query){
                // TODO: Get handle to SQL editor and add code to update it with the given query string
                console.log('Updating SQL editor with: ', query);
            }

            this.convertToRelAlg = function(){
                console.log('Convert to RelAlg');

                // TODO: Get handle from code mirror for Relational Algebra code

                updateRelAlgEditor('converted RelAlg query');
            
            }

            function updateRelAlgEditor(query){
                // TODO: Get handle to SQL editor and add code to update it with the given query string
                console.log('Updating SQL editor with: ', query);
            }

        },
        link:function(scope,elem,attr){}
    }
})