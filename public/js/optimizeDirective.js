angular.module('vaqoApp')
.directive('optimize', function() {
    return{
        restrict:'E',
        transclude:true,
        templateUrl:'../partials/optimizeTemplate.html',
        scope: true,
        controllerAs: 'optimize',
        controller:function(){
            // "this.xxx" allows you to access from templateUrl as "optimize.xxx"
            // TODO: change this. to vm. and set ' var vm = this;'
            this.optimizedQueryString = "Optimized query will go here...";
            this.showGraphs = false;

            /* Function triggered when "Optimize" button is clicked */
            this.optimizeQuery = function(){
                // TODO: Print the contents of the code mirror to the console to get handle to it
                console.log('Optimize query!');
                // This is where you will run the query and display results. 

                // Temporarily setting the results to <temp results>
                this.optimizedQueryString = '<temp results>';

                // Update graph results
                this.showGraphs = true;
                updateAllNodes();
            }

            /* vis js configuration - for both graphs */
            var nodes = new vis.DataSet([]);
            var edges = new vis.DataSet([]);
            self.originalData = {
                nodes: nodes,
                edges: edges
            };
            self.optimizedData = {
                nodes: nodes,
                edges: edges
            };
            self.options = {
                nodes: {
                    color:{background:'#3D5273'},
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

            var originalNetwork = new vis.Network(originalContainer, originalData, options);
            var optimizedNetwork = new vis.Network(optimizedContainer, optimizedData, options);
   
            function updateAllNodes(){
                /* visjs data for the original graphs */
                var originalNodes = new vis.DataSet([
                    {id: 1, label: 'Node 1', title: 'Node 1'},
                    {id: 2, label: 'Node 2', title: 'Node 2'},
                    {id: 3, label: 'Node 3', title: 'Node 3'},
                    {id: 4, label: 'Node 4', title: 'Node 4'},
                    {id: 5, label: 'Node 5', title: 'Node 5'},
                    {id: 6, label: 'Node 6', title: 'Node 6'}
                ]);

                // create an array with edges
                var originalEdges = new vis.DataSet([
                    {from: 1, to: 3},
                    {from: 1, to: 2},
                    {from: 2, to: 4},
                    {from: 2, to: 5},
                    {from: 2, to: 6},
                ]);
            
                originalNetwork.setData({
                    nodes: originalNodes,
                    edges: originalEdges
                });

                /* visjs data for the optimized graph */
                var optimizedNodes = new vis.DataSet([
                    {id: 1, label: 'Node 1', title: 'Node 1'},
                    {id: 2, label: 'Node 2', title: 'Node 2'},
                    {id: 3, label: 'Node 3', title: 'Node 3'},
                    {id: 4, label: 'Node 4', title: 'Node 4'},
                    {id: 5, label: 'Node 5', title: 'Node 5'},
                    {id: 6, label: 'Node 6', title: 'Node 6'}
                ]);

                // create an array with edges
                var optimizedEdges = new vis.DataSet([
                    {from: 1, to: 3},
                    {from: 1, to: 2},
                    {from: 2, to: 4},
                    {from: 2, to: 5},
                    {from: 2, to: 6},
                ]);
        
                optimizedNetwork.setData({
                    nodes: optimizedNodes,
                    edges: optimizedEdges
                });

                // TODO: Bug - for some reason the optimized graphs show up messed up after this function is run
            
            }

        },
        link:function(scope,elem,attr){}
    }
})