angular.module('vaqoApp')
.directive('run', function() {
    return{
        restrict:'E',
        transclude:true,
        templateUrl:'../partials/runTemplate.html',
        scope: true,
        controllerAs: 'run',
        controller:function($http){
            // "vm.xxx" allows you to access from templateUrl as "run.xxx"
            var vm = this;
            vm.messages = [];
            vm.showGraph = false;

            var minLines = 7;
            var startingValue = '';
            for (var i = 0; i < minLines; i++) {
                vm.startingValue += '\n';
            }

            vm.tableParams = {};

            editor.getDoc().setValue(startingValue);
                        
            vm.runQuery = function(){
                // TODO: Print the contents of the code mirror to the console to get handle to it
                console.log('Run query...');

                // This is where you will run the query and display results. 
                var data_in = {params:{queryString: 'SELECT * FROM Person;'}};
                $http.get('/queryDatabase', data_in).then(function(data_out, status){
                    // TODO: Actually parse the data here and set messages to the correct value
                    console.log()
                    vm.messages = [{text:data.colCount, val:data_out.data}, {text:"2 text", val:'45'}];
                });

                // Failed attempts at getting coremirror editor values:
                //console.log('Value:', editor.getValue());
                //console.log('textArea:', myTextArea);

                // Update graph results
                vm.showGraph = true;
                updateNodes();

                editor.refresh(); // For code mirror editor
            };

            // Initialize nodes, edges and options
            var nodes = new vis.DataSet([]);
            var edges = new vis.DataSet([]);
            self.data = {
                nodes: nodes,
                edges: edges
            };
            self.options = {
                nodes: {
                    color:{background:'#3D5273'},
                    font:{color:'white'},
                    shape:'box',
                    font:{size:18, color:'white'}
                },
                layout: {
                    hierarchical: {
                        direction: "UD",
                        sortMethod: "directed"
                    }
                },
                interaction: {
                    dragNodes :false,
                    navigationButtons:true,
                    keyboard:true
                },
                physics: {
                    enabled: false
                }
            };
            var network = new vis.Network(container, data, options);

            function updateNodes(){
                // Creating new nodes
                var nodes = new vis.DataSet([
                    {id: 1, label: 'Node 1', title: 'Node 1'},
                    {id: 2, label: 'Node 2', title: 'Node 2'},
                    {id: 3, label: 'Node 3', title: 'Node 3'},
                    {id: 4, label: 'Node 4', title: 'Node 4'},
                    {id: 5, label: 'Node 5', title: 'Node 5'},
                    {id: 6, label: 'Node 6', title: 'Node 6'}
                ]);

                // Creating new edges
                var edges = new vis.DataSet([
                    {from: 1, to: 3},
                    {from: 1, to: 2},
                    {from: 2, to: 4},
                    {from: 2, to: 5},
                    {from: 2, to: 6}
                ]);

                // Updating the dataset for the network
                network.setData({
                    nodes: nodes,
                    edges: edges
                });

            }


        },
        link:function(scope,elem,attr){}
    }
})