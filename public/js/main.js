/**
 * AngularJS Tutorial 1
 * @author Nick Kaye <nick.c.kaye@gmail.com>
 */

/**
 * Main AngularJS Web Application
 */
var app = angular.module('vaqoApp', [
  'ngRoute', 'ui.codemirror'
]);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', '$locationProvider', function ($routeProvider) {
  $routeProvider
    // Home
    .when("/", {templateUrl: "partials/home.html", controller: "GeneralCtrl"})
    // Pages
    .when("/about", {templateUrl: "partials/about.html", controller: "GeneralCtrl"})
    .when("/userGuide", {templateUrl: "partials/userGuide.html", controller: "GeneralCtrl"})
    .when("/faq", {templateUrl: "partials/faq.html", controller: "GeneralCtrl"})
    .when("/contact", {templateUrl: "partials/contact.html", controller: "GeneralCtrl"})
    .when("/testDb", {templateUrl: "partials/testDb.html", controller: "TestDbCtrl"})

    .when("/connectDb", {templateUrl: "partials/connectDb.html", controller: "ConnectDbCtrl"})
    .when("/workspace", {templateUrl: "partials/workspace.html", controller: "WorkspaceCtrl"})

    // else 404
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "GeneralCtrl"});
}]);

/* Controls the Connect DB page */
app.controller('ConnectDbCtrl', function ($scope/*, $location, $http */) {
  console.log('Connect Database Controller loaded.');

  // Initialize the inputs to '' and use the $scope.abc handles to access the data
  $scope.usernameInput = '';
  $scope.passwordInput = '';
  $scope.hostInput = '';
  $scope.hostInput = '';

  // TODO: Obfuscate password!!! There might be an external tool/plugin for this.

  // Function that connects the user's DB using the credential supplied
  $scope.connectDatabase = function(){
    console.log('Username:', $scope.usernameInput);
    console.log('Password:', $scope.passwordInput);
    console.log('Host:', $scope.hostInput);
    console.log('Port:', $scope.portInput);

    // Add code here to try to connect with credentials, show messages if incorrect, load data and proceed to workspace page if correct

  };
});

/* Controls the Workspace page and all of its tabs */
app.controller('WorkspaceCtrl', function ($scope, $http, $timeout/*, $location, $http */) {
  $scope.database = function(){
    console.log('Database popup...');

    // TODO: Add code that pops up a database view that lets users see the test database
    //       If custom database selected, take back to connect database page to be able to edit the connnection
    //       (maybe make the text read "Database Connection") when connected to a custom database?

  }  

  // COMMON ################################################################################################################################
                                    
  // RA Mode from ReLax
  CodeMirror.defineMode('relationalAlgebra', function () {
        var keywords = [
            'pi', 'sigma', 'rho', 'tau', '<-', '->', 'intersect', 'union', 'except', '/', '-', '\\\\', 'x', 'cross join', 'join',
            'inner join', 'natural join', 'left join', 'right join', 'left outer join', 'right outer join',
            'left semi join', 'right semi join', 'anti join', 'anti semi join', 'and', 'or', 'xor'
        ];
        var keywordsMath = ['π', 'σ', 'ρ', 'τ', '←', '→', '∩', '∪', '÷', '-', '⨯', '⨝', '⟕', '⟖', '⟗', '⋉', '⋊', '▷'];
        var operators = ['<-', '->', '>=', '<=', '=', '∧', '∨', '⊻', '⊕', '≠', '=', '¬', '>', '<', '≥', '≤'];
        var matchAny = function (stream, array, consume, successorPattern) {
            for (var i = 0; i < array.length; i++) {
                var needle;
                if (!successorPattern)
                    needle = array[i];
                else
                    needle = new RegExp('^' + array[i] + successorPattern);

                if (stream.match(needle, consume))
                    return true;
            }
            return false;
        };
        var seperators = '([\\(\\)\[\\]\{\\}, \\.\\t]|$)';

        return {
            startState: function () {
                return {
                    inBlockComment: false
                };
            },
            token: function (stream, state) {
                if (state.inBlockComment) {
                    if (stream.match(/.*?\*\//, true))
                        state.inBlockComment = false;
                    else
                        stream.match(/.*/, true);
                    return 'comment';
                }
                else if (!state.inBlockComment && stream.match(/^\/\*.*/, true)) {
                    state.inBlockComment = true;
                    return 'comment';
                }

                else if (state.inInlineRelation) {
                    if (stream.match(/.*?}/, true))
                        state.inInlineRelation = false;
                    else
                        stream.match(/.*/, true);
                    return 'inlineRelation';
                }
                else if (stream.match(/^{/, true)) {
                    state.inInlineRelation = true;
                    return 'inlineRelation';
                }

                else if (stream.match(/^--[\t ]/, true)) {
                    stream.skipToEnd();
                    return 'comment';
                }
                else if (stream.match(/^\/\*.*?$/, true)) {
                    return 'comment';
                }
                else if (matchAny(stream, keywordsMath, true)) {
                    return 'keyword math'; // needed for the correct font
                }
                else if (matchAny(stream, keywords, true, seperators)) {
                    return 'keyword';
                }
                else if (matchAny(stream, operators, true)) {
                    return 'operator math';
                }
                else if (stream.match(/^\[[0-9]+]/, true)) {
                    return 'attribute';
                }
                else if (stream.match(/^[0-9]+(\.[0-9]+)?/, true)) {
                    return 'number';
                }
                else if (stream.match(/\^'[^']*'/i, true)) {
                    return 'string';
                }
                else if (stream.match(/\^[a-z]+\.[a-z]*/i, true)) {
                    return 'qualified-column';
                }
                else if (stream.match(/^[\(\)\[]\{},]/i, true)) {
                    return 'bracket';
                }
                else if (stream.match(/^[a-z][a-z0-9\.]*/i, true)) {
                    return 'word';
                }
                else {
                    stream.next();
                    return 'else';
                }
            }
        };
  });

    // Initialize nodes, edges and options for the run tab, optimize tab original and optimize tab optimized
    var nodes = new vis.DataSet([]);
    var edges = new vis.DataSet([]);
    $scope.runData = {
        nodes: nodes,
        edges: edges
    };
    $scope.originalData = {
                nodes: nodes,
                edges: edges
            };
    $scope.optimizedData = {
        nodes: nodes,
        edges: edges
    };
    $scope.options = {
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

  // RUN TAB ###################################################################################################################################################

  var myTextArea = document.getElementById("raCodearea");

  $scope.cmOption = {
    lineNumbers:true,
    indentWithTabs:true,
    mode:'relationalAlgebra'
  }

  $scope.cmModel={string:'console.log();'};
  $scope.tableParams = {};
  
  $scope.refreshCodemirror = true;
  $timeout(function(){
    $scope.refreshCodemirror = false;
  }, 100);

  /*
    Function: runQuery
    Description: Run the relational algebra query for the run tab
  */
  $scope.runQuery = function(){
      console.log('Run query...');

      // This is where you will run the query and display results. 
      // TODO: Get the actual query string instead of 'SELECT * FROM Person;'
      
      var data_in = {params:{queryString: 'SELECT * FROM Person;'}};
      $http.get('/queryDatabase', data_in).then(function(data_out, status){
          $scope.data_headers = data_out.data['dataColumns'];
          $scope.data_results = data_out.data['valueDictionary'];
          // $scope.messages = [{text:"123 text", val:data_out.data}, {text:"2 text", val:'45'}];
      });

      // Failed attempts at getting coremirror editor values:
     // console.log('Value:', $scope.cmModel.string);

      // Update graph results
      $scope.showGraph = true;
      updateNodes();

      $scope.cmModel.string = 'OVERWRITE';

      //TODO: Refresh code mirror
      //$scope.cmModel.string.refresh(); // For code mirror editor
  };

  /*
    Function: updateNodes
    Description: Update the nodes for the run tab
  */
  updateNodes = function(){
    // Creating new nodes
    // TODO: Add logic to update the nodes for real
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

  //var container = angular.element(document.getElementById('mynetwork'));
  var network = new vis.Network(container, $scope.runData, $scope.options);

  // OPTIMIZE TAB ###################################################################################################################################################
  $scope.cmOptionOptimize = {
    lineNumbers:true,
    indentWithTabs:true,
    mode:'relationalAlgebra'
  }

  $scope.cmModelOptimize={string:'consoleee.log();'};

  $scope.optimizedQueryString = "Optimized query will go here...";
  $scope.showGraphs = false;

  /* Function triggered when "Optimize" button is clicked */
  $scope.optimizeQuery = function(){
    // TODO: Print the contents of the code mirror to the console to get handle to it
    console.log('Optimize query!');
    // This is where you will run the query and display results. 

    // Temporarily setting the results to <temp results>
    $scope.optimizedQueryString = '<temp results>';

    // Update graph results
    $scope.showGraphs = true;
    updateAllNodes();
  }

  var originalNetwork = new vis.Network(originalContainer, $scope.originalData, $scope.options);
  var optimizedNetwork = new vis.Network(optimizedContainer, $scope.optimizedData, $scope.options);

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

        // Creating new edges
        var originalEdges = new vis.DataSet([
            {from: 1, to: 3},
            {from: 1, to: 2},
            {from: 2, to: 4},
            {from: 2, to: 5},
            {from: 2, to: 6}
        ]);

        // Updating the dataset for the network
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





  // CONVERT TAB ###################################################################################################################################################
  $scope.cmOptionConvertRa = {
    lineNumbers:true,
    indentWithTabs:true,
    mode:'relationalAlgebra'
  }

  $scope.cmModelConvertRa={string:'consolasdfdse.log();'};

  $scope.cmOptionConvertSql = {
    lineNumbers:true,
    indentWithTabs:true,
    mode:'text/x-mysql'
  }

  $scope.cmModelConvertSql={string:'console.log(SQL);'};
  

  $scope.convertToSql = function(){
    console.log('Convert to sql');

    // TODO: Get handle from code mirror for Relational Algebra code

    updateSqlEditor( $scope.cmModelConvertRa);
            
  }

  $scope.convertToRelAlg = function(){
    console.log('Convert to rel alg');

    // TODO: Get handle from code mirror for Relational Algebra code

    updateRelAlgEditor($scope.cmModelConvertSql);

  }

  function updateSqlEditor(query){
                // TODO: Get handle to SQL editor and add code to update it with the given query string
                console.log('Updating SQL editor with: ', query);
  }

  function updateRelAlgEditor(query){
    // TODO: Get handle to SQL editor and add code to update it with the given query string
    console.log('Updating SQL editor with: ', query);
  }


});






/* Controls the testDb modification page */
app.controller('TestDbCtrl', function ($scope/*, $location, $http */) {
  

});

/* Controls all other Pages (general) */
app.controller('GeneralCtrl', function ($scope/*, $location, $http */) {
  console.log("Page Controller loaded.");
  // Activates the Carousel
  $('.carousel').carousel({
    interval: 5000
  });

  // Activates Tooltips for Social Links
  $('.tooltip-social').tooltip({
    selector: "a[data-toggle=tooltip]"
  });

});