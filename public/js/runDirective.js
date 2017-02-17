angular.module('vaqoApp')
.directive('run', function() {
    return{
        restrict:'E',
        transclude:true,
        templateUrl:'../partials/runTemplate.html',
        scope: true,
        controllerAs: 'run',
        controller:function(){
            // "this.xxx" allows you to access from templateUrl as "run.xxx"
            this.messages = [];
            this.showGraph = false;
            
            this.runQuery = function(){
                // TODO: Print the contents of the code mirror to the console to get handle to it
                console.log('Run query...');
                // This is where you will run the query and display results. 
                queryStatement("SELECT * from Person;");
                // Temporarily setting the result data
                this.messages = [{text:"1 text", val:'45'}, {text:"2 text", val:'45'}];

                // Update graph results
                this.showGraph = true;
                updateNodes();
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