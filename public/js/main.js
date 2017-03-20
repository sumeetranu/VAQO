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
            color:{
                background:'#3D5273', 
                border:'#3D5273',
                highlight: {border: '#670000', background:'#670000'},
                hover: {border: '#670000'}
            },
            shape:'box',
            chosen: true,

            font:{size:36, color:'white'},
            borderWidth: 5      
        },
        
        layout: {
            hierarchical: {
                direction: "UD",
                sortMethod: "directed",
                edgeMinimization:true
            }
        },
        interaction: {
            dragNodes :false,
            navigationButtons:true,
            keyboard:false
        }
    };

  // RUN TAB ###################################################################################################################################################

  var myTextArea = document.getElementById("raCodearea");

  $scope.cmOption = {
    lineNumbers:true,
    indentWithTabs:true,
    mode:'relationalAlgebra',
    lineWrapping:true
  }

  $scope.cmModel={string:''};
  //$scope.tableParams = new NgTableParams({}, {dataset: $scope.data_results});
  
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
      
      // Placeholder for the schema dictionary
      // [ numRows, [a1, type2], [a2, type2], ... [an, typen] ]
      var tree = updateNodes();

      schema["R"] = [5, ["a", "int"],["b", "string"], ["c", "string"]]
      schema["S"] = [5, ["b", "string"], ["d", "int"]]
      schema["T"] = [4, ["b", "string"], ["d", "int"]]
      schema["Person"] = [5, ["firstname", "string"], ["lastname", "string"], ["age", "int"]];

      var out = TreeToSql(tree, "", 0, schema);
      var sql = out[0];
      var noReturns = sql.replace(/[^\x21-\x7E\u03C0\u03C1\u03C3\u2A1D\u222A\u2229\u2A2F\u27F5\u2227\u2228]+/g, ' ');
      noReturns = noReturns.replace(/^\s+|\s+$/g, '').trim();
      var data_in = {params:{queryString: sql}};
      $http.get('/queryDatabase', data_in).then(function(data_out, status){
          $scope.data_headers = data_out.data['dataColumns'];
          $scope.data_results = data_out.data['valueDictionary'];
          // $scope.messages = [{text:"123 text", val:data_out.data}, {text:"2 text", val:'45'}];
      });

      // Failed attempts at getting coremirror editor values:
     // console.log('Value:', $scope.cmModel.string);

      // Update graph results
      $scope.showGraph = true;
      

      console.log(sql);


      //$scope.cmModel.string = 'OVERWRITE';

      //TODO: Refresh code mirror
      //$scope.cmModel.string.refresh(); // For code mirror editor
  };

  

  //var container = angular.element(document.getElementById('mynetwork'));
  var network = new vis.Network(container, $scope.runData, $scope.options);


  

var TypeEnum = {"Pi":0, "Sigma":1, "Rho":2, "Join":3, "Data":4,
 "Union":5, "Intersect":6, "Subtraction":7, "Cross":8}

var Types = ["\u03C0", "\u03C3", "\u03C1", "\u2A1D", "Data"
, "\u222A", "\u2229", "-", "\u2A2F"]

function Node(type, val)
{
    this.type = type;
    this.value = val;
    this.data = [];
    this.parent = null;
    this.children = [];
}

//within a binary operation splits the operation into the two sub operations
// ex Join(pi a,b(R), S) would output ["pi a,b(R)", "S"]
function splitOnComma(q)
{
    //todo: fix to make sub binary operations not fuck it up
    if (q.split(",").length == 2)
    {
        return q.split(",");
    }
    else
    {
        firstP = false;
        ct = 0
        for (i = 0; i < q.length; i++)
        {
            if (q[i] == '(')
            {
                firstP = true;
                ct++;
            }
            else if (q[i] == ')')
            {
                ct--;
            }
            else if (firstP && ct == 0 && q[i] == ",")
            {
                lst = [];
                lst.push(q.substring(0,i).trim());
                lst.push(q.substring (i+1).trim());
                return lst;
            }
        }
    }
}

//parses project for turning into the tree
function parseProject(str)
{
    var labels = str.substring(0,str.indexOf("(")).trim();
    var subQ = str.substring(str.indexOf("(")+1,str.lastIndexOf(")")).trim();

    var node = new Node(TypeEnum.Pi, labels);
    var subTree = createTree(subQ);

    subTree.parent = node;

    node.children.push(subTree);
    return node;
}

function parseSelect(str)
{
    var condition = str.substring(0,str.indexOf("(")).trim();
    var subQ = str.substring(str.indexOf("(")+1,str.lastIndexOf(")")).trim();

    var node = new Node(TypeEnum.Sigma, condition);
    var subTree = createTree(subQ);

    subTree.parent = node;

    node.children.push(subTree);
    return node;
}

//TODO handle conditions
function parseRho(str)
{
    var rename = str.substring(0,str.indexOf("(")).trim();
    var subQ = str.substring(str.indexOf("(")+1,str.lastIndexOf(")")).trim();

    var node = new Node(TypeEnum.Rho, rename);
    var subTree = createTree(subQ);

    subTree.parent = node;

    node.children.push(subTree);
    return node;
}

//TODO add conditions.
function parseJoin(str)
{
    var condition = str.substring(0,str.indexOf("(")).trim();
    var rest = str.substring(str.indexOf("(") + 1, str.lastIndexOf(")"));
    var spl = splitOnComma(rest);
    left = spl[0].trim();
    right = spl[1].trim();


    var node = new Node(TypeEnum.Join, condition);
    var subTreeLeft = createTree(left);
    var subTreeRight = createTree(right);

    subTreeLeft.parent = node;
    subTreeRight.parent = node;

    node.children.push(subTreeLeft);
    node.children.push(subTreeRight);
    return node;
}

function parseUnion(str)
{
    var spl = splitOnComma(str);
    left = spl[0].trim();
    right = spl[1].trim();


    var node = new Node(TypeEnum.Union, "");
    var subTreeLeft = createTree(left);
    var subTreeRight = createTree(right);

    subTreeLeft.parent = node;
    subTreeRight.parent = node;

    node.children.push(subTreeLeft);
    node.children.push(subTreeRight);
    return node;
}

//http://www.gokhanatil.com/2010/10/minus-and-intersect-in-mysql.html
function parseIntersection(str)
{
    var spl = splitOnComma(str);
    left = spl[0].trim();
    right = spl[1].trim();


    var node = new Node(TypeEnum.Intersect, "");
    var subTreeLeft = createTree(left);
    var subTreeRight = createTree(right);

    subTreeLeft.parent = node;
    subTreeRight.parent = node;

    node.children.push(subTreeLeft);
    node.children.push(subTreeRight);
    return node;
}

function parseSubtraction(str)
{
    var spl = splitOnComma(str);
    left = spl[0].trim();
    right = spl[1].trim();


    var node = new Node(TypeEnum.Subtraction, "");
    var subTreeLeft = createTree(left);
    var subTreeRight = createTree(right);

    subTreeLeft.parent = node;
    subTreeRight.parent = node;

    node.children.push(subTreeLeft);
    node.children.push(subTreeRight);
    return node;
}

//cross join in sql
function parseCross(str)
{
    var spl = splitOnComma(str);
    left = spl[0].trim();
    right = spl[1].trim();


    var node = new Node(TypeEnum.Cross, "");
    var subTreeLeft = createTree(left);
    var subTreeRight = createTree(right);

    subTreeLeft.parent = node;
    subTreeRight.parent = node;

    node.children.push(subTreeLeft);
    node.children.push(subTreeRight);
    return node;
}


function createTree(q)
{
    if (q.startsWith("\u03C0 ") || q.startsWith("pi"))
    {
        if (q.indexOf(" ") != -1)
        {
            newq = q.substring(q.indexOf(" ") + 1);
            return parseProject(newq);
        }
        else
        {
            //todo give error messages
            return null;
        }
    }
    else if (q.startsWith("\u03C3 ") || q.startsWith("sigma"))
    {
        newq = q.substring(q.indexOf(" ") + 1);
        return parseSelect(newq);
    }
    else if (q.startsWith("\u03C1 ") || q.startsWith("rho"))
    {
        newq = q.substring(q.indexOf(" ") + 1);
        return parseRho(newq);
    }
    else if (q.startsWith("\u2A1D") || q.startsWith("join"))
    {
        //TODO add conditions.
        newq = q.substring(q.indexOf(" "));
        return parseJoin(newq);
    }
    else if (q.startsWith("\u222A") || q.startsWith("union"))
    {
        //TODO add conditions.
        newq = q.substring(q.indexOf("(") + 1, q.lastIndexOf(")"));
        return parseUnion(newq);
    }
    else if (q.startsWith("\u2229") || q.startsWith("intersect"))
    {
        //TODO add conditions.
        newq = q.substring(q.indexOf("(") + 1, q.lastIndexOf(")"));
        return parseIntersection(newq);
    }
    else if (q.startsWith("-") || q.startsWith("subtract"))
    {
        //TODO add conditions.
        newq = q.substring(q.indexOf("(") + 1, q.lastIndexOf(")"));
        return parseSubtraction(newq);
    }
    else if (q.startsWith("\u2A2F") || q.startsWith("cross"))
    {
        //TODO add conditions.
        newq = q.substring(q.indexOf("(") + 1, q.lastIndexOf(")"));
        return parseCross(newq);
    }
    
    else
    {
        var node = new Node(TypeEnum.Data, q);
        return node;
    }
}

/*Id: unique identifier
Label: to be displayed inside the box for each node
Title: shows up when you hover on a node*/

function GraphNode(Id, Label, Title)
{
    this.id = Id;
    this.label = Label;
    this.title = Title;
}

function Edge(From, To)
{
	this.from = From;
	this.to = To;
}

function TreeToGraphRun(n)
{
	var arr = TreeToGraph(n, 0, [], []);
	return [arr[0], arr[1]];
}

/*arguments
    n: Root of the subTree
    id: id of the current node
    nodes: current list of nodes for the Graph
    edges: current list of edges for the Graph
*/
function TreeToGraph(n, id, nodes, edges)
{
	
	if (n.type == TypeEnum["Data"])
	{
		var gnode = new GraphNode(id, n.value, "");
	}
	else
	{
		var gnode = new GraphNode(id, Types[n.type], n.value);
	}
	nodes.push(gnode);
	var curid = id;
	var i = 0;
	while(i < n.children.length)
	{
		id++;
		var edge = new Edge(curid, id);
		edges.push(edge);
		var arr = TreeToGraph(n.children[i], id, nodes, edges);
		nodes = arr[0]
		edges = arr[1];
		id = arr[2];
		i++;
	}
	return [nodes, edges, id];
}


/*
function Node(type, val)
{
    this.type = type;
    this.value = val;
    this.parent = null;
    this.children = [];
}

var Types = ["\u03C0", "\u03C3", "\u03C1", "\u2A1D", "Data"
, "\u222A", "\u2229", "-", "\u2A2F"]

var TypeEnum = {"Pi":0, "Sigma":1, "Rho":2, "Join":3, "Data":4,
 "Union":5, "Intersect":6, "Subtraction":7, "Cross":8}
*/

function NodeToSQL(node, subqueries, alias, schema)
{
    // TODO HANDLE JOIN CORRECTLY
    // TODO handle multiple selects.
    // TODO handle sigma (pi (R))
    var query = "";
    if (node.type == TypeEnum.Pi)
    {
        var select = "SELECT DISTINCT " + node.value + "\n";
        if (node.children[0].type == TypeEnum.Sigma)
        {
            query = select + subqueries[0];
        }
        else if (node.children[0].children.length == 0 || node.children[0].type == TypeEnum.Cross || node.children[0].type == TypeEnum.Join)
        {
            query = select + "FROM " + subqueries[0];
        }
        else
        {
            query = select + "FROM (" + subqueries[0] + ") AS alias" + alias.toString();
            alias++;
        }
    }
    else if (node.type == TypeEnum.Sigma)
    {
        if (node.parent == null || node.parent.type != TypeEnum.Sigma)
        {
            var conditions = node.value.replace(",", " AND ");
            if (node.children[0].type == TypeEnum.Sigma)
            {
                var curNode = node.children[0];
                while (curNode.type = TypeEnum.Sigma)
                {
                    conditions += " AND " + curNode.value;
                    if (curNode.children[0].length > 0)
                    {
                        curNode = curNode.children[0];
                    }
                    else
                    {
                        break;
                    }
                }
            }
            query = "FROM " + subqueries[0] + "\nWHERE " + conditions;
            if (node.parent == null || node.parent.type != TypeEnum.Pi)
            {
                query = "SELECT DISTINCT *\n" + query;
            }
            
        }
        else
        {
            query = subqueries[0];
        }
    }
    else if (node.type == TypeEnum.Rho)
    {
        var changeString = node.value.replace(/\s/g,'');
        
        //this... might be difficult. 
        //as inconvenient as it may be, might have to restrict 
        //this action on data that has not been operated on
        if (changeString.includes("\u27F5") && node.children[0].type == TypeEnum.Data)
        {
            var changes = changeString.split(',');
            select = "SELECT DISTINCT ";

            for (i = 1; i < schema[node.children[0].value].length; i++)
            {
                var column = schema[node.children[0].value][i][0];
                var colChange = column;
                for (j = 0; j < changes.length; j++)
                {
                    var change = changes[j].split('\u27F5');
                    
                    if (column == change[1])
                    {
                        schema[node.children[0].value][i][0] = change[0];
                        colChange = change[1] + " AS " + change[0];
                        break;
                    }
                }
                if (i == 1)
                {
                    select = select + colChange;
                }
                else
                {
                    select = select + ", " + colChange;
                }
            }
            query = select + "\nFROM " + node.children[0].value;
        }
        else if(!changeString.includes("\u27F5"))
        {
            if (node.children[0].type == TypeEnum.Data)
            {
                if (node.parent == null)
                {
                    query = "SELECT DISTINCT *\nFROM " + subqueries[0] + " AS " + changeString;
                }
                else
                {
                    query = subqueries[0] + " AS " + changeString;
                }
                
            }
            else
            {
                query = "(SELECT DISTINCT *\nFROM" + subqueries[0] + ") AS " + changeString;
            }

        }
    }
    else if (node.type == TypeEnum.Join)
    {
        //todo HANDLE CONDITION FROM ALIASES
        if (node.children[0].type != TypeEnum.Data)
        {
            subqueries[0] = "(" + subqueries[0] + ") AS alias" + alias.toString();
            alias++;
        }
        if (node.children[1].type != TypeEnum.Data)
        {
            subqueries[1] = "(" + subqueries[1] + ") AS alias" + alias.toString();
            alias++;
        }
        query = subqueries[0] + " INNER JOIN " + subqueries[1] + " ON " + node.value;
    }
    else if (node.type == TypeEnum.Union)
    {
        if (node.children[0].type == TypeEnum.Data)
        {
            subqueries[0] = "SELECT DISTINCT *\nFROM " + subqueries[0];
        }
        if (node.children[1].type == TypeEnum.Data)
        {
            subqueries[1] = "SELECT DISTINCT *\nFROM " + subqueries[1];
        }
        if (node.parent != null)
        {
            query = "(" +  subqueries[0] + "\nUNION\n" + subqueries[1] + ") AS alias" + alias.toString();
            alias++;
        }
        else
        {
            query = subqueries[0] + "\nUNION\n" + subqueries[1];
        }
        
    }
    //this... might be difficult. 
    //as inconvenient as it may be, might have to restrict 
    //this action on data that has not been operated on
    //NEVERMIND TODO FIX THIS SHIT.
    else if (node.type == TypeEnum.Intersect)
    {
        if (node.children[0].type == TypeEnum.Data && node.children[1].type == TypeEnum.Data)
        {
            var left = subqueries[0].replace(/\s/g,'') ;
            var right = subqueries[1].replace(/\s/g,'');
            var select = "SELECT DISTINCT ";
            var from = "\nFROM " + left + " JOIN " + right;
            var on = "\nON "
            if (left.toLowerCase()!= right.toLowerCase())
            {
                for (i = 1; i < schema[left].length; i++)
                {
                    var column = schema[left][i][0];
                    if (i == 1)
                    {
                        select = select + left + "." + column;
                        on = on + left + "." + column + " = " + right + "." + column; 
                    }
                    else
                    {
                        select = select + ", " + left + "." + column;
                        on = on + " AND " + left + "." + column + " = " + right + "." + column; 
                    }
                    
                }
            }
            else 
            {
                
                var aLeft = "alias" + alias.toString();
                alias++;
                var aRight = "alias" + alias.toString();
                alias++;
                from = "\nFROM " + left + " AS " + aLeft + " JOIN " + right + " AS " + aRight;
                for (i = 1; i < schema[left].length; i++)
                {
                    var column = schema[left][i][0];
                    if (i == 1)
                    {
                        select = select + aLeft  + "." + column;
                        on = on + aLeft + "." + column + " = " + aRight + "." + column; 
                    }
                    else
                    {
                        select = select + ", " + aLeft + "." + column;
                        on = on + " AND " +  aLeft + "." + column + " = " + aRight + "." + column; 
                    }
                }
            }
            query = select + from + on;
        }
        
    }
    //this... might be difficult. 
    //as inconvenient as it may be, might have to restrict 
    //this action on data that has not been operated on
    else if (node.type == TypeEnum.Subtraction)
    {
        if (node.children[0].type == TypeEnum.Data)
        {
            subqueries[0] = "SELECT DISTINCT *\nFROM " + subqueries[0];
        }
        if (node.children[1].type == TypeEnum.Data)
        {
            subqueries[1] = "SELECT DISTINCT *\nFROM " + subqueries[1];
        }
        if (node.parent != null)
        {
            query = "(" +  subqueries[0] + "\nUNION\n" + subqueries[1] + ") AS alias" + alias.toString();
            alias++;
        }
        else
        {
            query = subqueries[0] + "\nUNION\n" + subqueries[1];
        }
        
    }
    else if (node.type == TypeEnum.Cross)
    {
        if (node.children[0].type != TypeEnum.Data)
        {
            subqueries[0] = "(" + subqueries[0] + ") as alias" + alias;
            alias++;
        }
        if (node.children[1].type != TypeEnum.Data)
        {
            subqueries[1] = "(" + subqueries[1] + ") as alias" + alias;
            alias++;
        }
        query = subqueries[0] +  "," +  subqueries[1];
    }
    else if (node.type == TypeEnum.Data)
    {
        if (node.parent == null)
        {
            var query = "select distinct * from " + node.value;
        }
        else
        {
            var query = node.value;
        }
        
        
    }
    return [query, alias, schema];
}

function NodeToRA(node, subqueries)
{
    var query = "";
    if (node.type == TypeEnum.Pi || node.type == TypeEnum.Sigma || node.type == TypeEnum.Rho)
    {
        query = Types[node.type] + " " + node.value + " (" + subqueries[0] + ")";
    }
    else if (node.type == TypeEnum.Join || node.type == TypeEnum.Union || node.type == TypeEnum.Intersect || node.type == TypeEnum.Subtraction || node.type == TypeEnum.Cross)
    {
        var val = node.value;
        if (val != "")
        {
            val = " " + val + " ";
        }
        query = Types[node.type] +  val + "(" + subqueries[0] + "," + subqueries[1] +  ")";
    }
    else if (node.type == TypeEnum.Data)
    {
        query = node.value;
    }
    return query;
}

function TreeToSql(node, query, alias, schema)
{
    var subqueries = [];
	for (var i = 0; i < node.children.length; i++)
	{
        var outs = TreeToSql(node.children[i], query, alias, schema);
        alias = outs[1];
        subqueries.push(outs[0]);
    }

    return NodeToSQL(node, subqueries, alias, schema);
}

function TreeToRA(node, query)
{
    var subqueries = [];
	for (var i = 0; i < node.children.length; i++)
	{
        var out = TreeToRA(node.children[i], query);
        subqueries.push(out);
    }

    return NodeToRA(node, subqueries);
}

function GetFirstParens(query)
{
    var left = query.indexOf('(');
    var ct = 1;
    var i = left;
    while (ct != 0)
    {
        i++;
        if (query[i] == '(')
        {
            ct++;
        }
        else if (query[i] == ')')
        {
            ct--;
        }
    }
    return [left, i];
}


function SqlToTree(query)
{
    var select = query.indexOf("select");
    var selectLen = 6;
    if (query.indexOf("select distinct") == select)
    {
        selectLen = 15;
    }
    var from = query.indexOf("from");
    var children = [];
    
    //handle the subQueries in the from clause.
    while (query.substring(from + 4, where).indexOf('(') != -1)
    {
        var parens = GetFirstParens(query);
        var left = parens[0];
        var right = parens[1];
        children.push(SqlToTree(query.substring(left+ 1, right)));
        
        var alias = query.substring(right+1).split(' ')[2];
        query = query.substring(0, left) + query.substring(right + 1);
    }
    
    var where = query.lastIndexOf("where");

    var selectString = query.substring(select + selectLen, from).trim();
    var selectVars = [];
    piNode = null;
    
    //if the select string is just * there is no projection.
    if (selectString != "*")
    {
        piNode = new Node(TypeEnum.Pi, selectString)
    }

    //needed because the way substring works in js. if there is no where just go to the end of the query.
    if (where == -1)
    {
        var fromString = query.substring(from + 4).trim();
    }
    else
    {
        var fromString = query.substring(from + 4, where).trim();
    }
    
    var subNode = null;

    //if the fromString is not empty
    if (fromString != "")
    {
        //split the from section
        fromVars = fromString.split(',');
        
        //if there is only one from, just send it up by itself. otherwise we have to take the cross product of the tables
        if (fromVars.length == 1)
        {
            //if there is no as there is no child. otherwise there is a child or a rename and must be handled
            if (fromString.indexOf("as") == -1)
            {
                subNode = new Node(TypeEnum.Data, fromString);
            }
            else
            {
                //TODO HANDLE RENAME
                subNode = children[0];
            }
        }
        else if (fromVars.length > 1)
        {
            var curNode = new Node(TypeEnum.Cross, "");
            var childCount = 0;

            var left = fromVars[0].trim();
            var leftNode = null;

            //if there is no as there is no child. otherwise there is a child or a rename and must be handled
            if (left.indexOf("as") == -1)
            {
                leftNode = new Node(TypeEnum.Data, left);
            }
            else
            {
                //TODO handle rename
                leftNode = children[childCount];
                childCount++;
            }

            var right = fromVars[1].trim();
            var rightNode = null;

            //if there is no as there is no child. otherwise there is a child or a rename and must be handled
            if (right.indexOf("as") == -1)
            {
                rightNode = new Node(TypeEnum.Data, right);
            }
            else
            {
                //TODO handle rename
                rightNode = children[childCount];
                childCount++;
            }
            //set parent child relationships
            curNode.children.push(leftNode);
            curNode.children.push(rightNode);
            leftNode.parent = curNode;
            rightNode.parent = curNode;
            
            //everything above handles the left most two in the whole cross product sub tree (or the only 2 if there are only 2)
            //this for loop does the same process with the left being the previous two crossed together.
            for (var i = 2; i < fromVars.length; i++)
            {
                var prevNode = curNode;
                var nextVal = fromVars[i].trim();
                curNode = new Node(TypeEnum.Cross, "");
                var nextNode = null;

                //if there is no as there is no child. otherwise there is a child or a rename and must be handled
                if (nextVal.indexOf("as") == -1)
                {
                    nextNode = new Node(TypeEnum.Data, nextVal);
                }
                else
                {
                    //TODO handle rename
                    nextNode = children[childCount];
                    childCount++;
                }
                prevNode.parent = curNode;
                nextNode.parent = curNode;
                curNode.children.push(prevNode);
                curNode.children.push(nextNode);
            }
            subNode = curNode;
        } 
    }
    else
    {
        //error here
    }

    var whereString = query.substring(where +5).trim();
    var sigmaNode = null;
    //if there is no where then there is no sigmaNode, if there is one make it the parent of the current subNode then make it the subNode.
    if (where != -1)
    {
        sigmaNode = new Node(TypeEnum.Sigma, whereString);
        subNode.parent = sigmaNode;
        sigmaNode.children.push(subNode);
        
        subNode = sigmaNode;
    }

    //if the piNode is null there is no projection, just return the subNode as the root.
    if (piNode != null)
    {
        piNode.children.push(subNode);
        subNode.parent = piNode;
        return piNode
    }
    else
    {
        return subNode;
    } 
}

function BreakUpSelects(node)
{
    if (node.type == TypeEnum.Sigma)
    {
        if (node.value.indexOf(" and ") != -1 || node.value.indexOf("\u2227") != -1)
        {
            var andloc = 0;
            var left = "";
            var right = "";
            if (node.value.indexOf(" and ") != -1)
            {
                andLoc = node.value.indexOf(" and ");
                left = node.value.substring(0, andLoc);
                right = node.value.substring(andLoc + 5);
            }
            else 
            {
                andLoc = node.value.indexOf("\u2227");
                left = node.value.substring(0, andLoc);
                right = node.value.substring(andLoc + 1);
            }
            node.value = left;
            var RightNode = new Node(TypeEnum.Sigma, right);
            node.children[0].parent = RightNode;
            RightNode.children = node.children;
            node.children = [RightNode];
            RightNode.parent = node;
        }
    }
    for (var i = 0; i < node.children.length; i++)
    {
        var newChild = BreakUpSelects(node.children[i]);
        node.children[i] = newChild;
    }
    return node;
}

/*
var TypeEnum = {"Pi":0, "Sigma":1, "Rho":2, "Join":3, "Data":4,
 "Union":5, "Intersect":6, "Subtraction":7, "Cross":8}

schema["R"] = [5, ["a", "int"],["b", "string"], ["c", "string"]]
schema["S"] = [5, ["b", "string"], ["d", "int"]]
schema["T"] = [4, ["b", "string"], ["d", "int"]]
schema["Person"] = [5, ["firstname", "string"], ["lastname", "string"], ["age", "int"]];

*/
function FillTreeData(node, schema)
{
    for (var i = 0; i < node.children.length; i++)
    {
        var newChild = FillTreeData(node.children[i], schema);
        node.children[i] = newChild;
    }
    var newData = null;
    if (node.type == TypeEnum.Pi)
    {
        var data = node.children[0].data;
        var cols = node.value.split(',');
        newData = [data[0]];
        //trim and make all the cols lower case;
        for (var i = 0; i < cols.length; i++)
        {
            cols[i] = cols[i].trim().toLowerCase();
        }
        
        //check if the columns are in the data
        for (var i = 1; i < data.length; i++)
        {
            if (cols.indexOf(data[i][0].toLowerCase()) >= 0)
            {
                newData.push(data[i]);
            }
        }
        //if the columns are not in the data then throw an exception
        if (newData.lenth - 1 != cols.length)
        {
            //todo Throw Exception
        }

        // set the new data
        node.data = newData;
    }
    else if (node.type == TypeEnum.Sigma)
    {
        node.data = node.children[0].data;
    }
    else if (node.type == TypeEnum.Rho)
    {
        var changeString = node.value.replace(/\s/g,'');
        if (changeString.includes("\u27F5"))
        {
            var changes = changeString.split(',');
            newData = node.children[0].data;
            for (var i = 0; i < changes.length; i++)
            {
                var change = changes[i].split('\u27F5');
                change[0] = change[0].trim().toLowerCase();
                change[1] = change[1].trim().toLowerCase();
                for (var j = 1; j < newData.length; j++)
                {
                    if (newData[j][0].toLowerCase() == change[1])
                    {
                        newData[j][0] = change[0];
                        break;
                    }
                    else if (j == newData.length - 1)
                    {
                        //todo throw exception;
                    }
                }
            }
            node.data = newData;
        }
        else
        {
            node.data = node.children[0].data;
        }
        
    }
    else if (node.type == TypeEnum.Join)
    {
        var ldata = node.children[0].data;
        var rdata = node.children[1].data;

        newData = [];
        //max size of a join is the size of the smaller table
        newData.push(Math.min(ldata[0], rdata[0]));
        //get left cols
        for(var i = 1; i < ldata.length; i++)
        {
            newData.push(ldata[i]);
        }
        //get right cols
        for(var i = 1; i < rdata.length; i++)
        {
            newData.push(rdata[i]);
        }
        node.data = newData;
    }
    else if (node.type == TypeEnum.Data)
    {
        node.data = schema[node.value.toLowerCase()];
    }
    else if (node.type == TypeEnum.Union)
    {
        var ldata = node.children[0].data;
        var rdata = node.children[1].data;

        node.data = ldata;
        node.data[0] = ldata[0] + rdata[0];
    }
    else if (node.type == TypeEnum.Intersect)
    {
        var ldata = node.children[0].data;
        var rdata = node.children[1].data;

        node.data = ldata;
        node.data[0] = Math.min(ldata[0], rdata[0]);
    }
    else if (node.type == TypeEnum.Subtraction)
    {
        var ldata = node.children[0].data;
        node.data = ldata;
    }
    else if (node.type == TypeEnum.Cross)
    {
        var ldata = node.children[0].data;
        var rdata = node.children[1].data;

        newData = [];
        //max size of a join is the size of the smaller table
        newData.push(ldata[0]*rdata[0]);
        //get left cols
        for(var i = 1; i < ldata.length; i++)
        {
            newData.push(ldata[i]);
        }
        //get right cols
        for(var i = 1; i < rdata.length; i++)
        {
            newData.push(rdata[i]);
        }
        node.data = newData;
    }

    
    return node;
}

function PushDownSelects(node,schema, changed)
{
    if (node.type == TypeEnum.Sigma)
    {
        var data = node.data;
        var childData = node.children[0].data;

        // if sigma c (pi a1, a2 (R)) is valid, then pi a1, a2 (sigma c (R)) is also valid
        if (node.children[0].type == TypeEnum.Pi)
        {
            changed = true;
            var childNode = node.children[0];
            var grandChildren = childNode.children;
            childNode.parent = node.parent;
            childNode.children = [node];
            node.parent = childNode;
            node.children = grandChildren;
            node = childNode;
        }
        if (node.children[0].type == TypeEnum.Join || node.children[0].type == TypeEnum.Cross)
        {
            var conditions = node.value.replace(/ or /g, " and ").split(' and ');
            var attributes = [];
            for (var  i = 0; i < conditions.length; i++)
            {
                var condition = conditions[i];
                condition = condition.replace(/!=/g, "=").replace(/>=/g, "=").replace(/<=/g, "=").replace(/>/g, "=").replace(/</g, "=");
                var curAtts = condition.split("=");
                var condAtts = []
                for (var j = 0; j < curAtts.length; j++)
                {
                    var att = curAtts[j].trim();
                    if (isNaN(att) && att.indexOf("'") == -1)
                    {
                        condAtts.push(att);
                    }
                } 
                attributes.push(condAtts);
            }
            
            //check if all attributes only belong on one side of the join
            var ldata = node.children[0].children[0].data;
            var rdata = node.children[0].children[1].data;
            var allLeft = true;
            for (var  i = 0; i < attributes.length && allLeft; i++)
            {
                var c = attributes[i];
                for (var j = 0; j < c.length && allLeft; j++)
                {
                    for (var k = 1; k < ldata.length; k++)
                    {
                        if (c[j] == ldata[k][0])
                        {
                            break;
                        }
                        else if (k == ldata.length-1)
                        {
                            allLeft = false;
                        }
                    }
                }
            }
            if (allLeft)
            {
                changed = true;
                var childNode = node.children[0];
                var grandChild = childNode.children[0];
                childNode.parent = node.parent;
                childNode.children[0] = node;
                node.parent = childNode;
                node.children = [grandChild];
                node = childNode; 
            }
            else
            {
                var allRight = true;
                for (var  i = 0; i < attributes.length && allRight; i++)
                {
                    var c = attributes[i];
                    for (var j = 0; j < c.length && allRight; j++)
                    {
                        for (var k = 1; k < rdata.length; k++)
                        {
                            if (c[j] == rdata[k][0])
                            {
                                break;
                            }
                            else if (k == rdata.length-1)
                            {
                                allRight = false;
                            }
                        }
                    }
                }
                if (allRight)
                {
                    changed = true;
                    var childNode = node.children[0];
                    var grandChild = childNode.children[1];
                    childNode.parent = node.parent;
                    childNode.children[1] = node;
                    node.parent = childNode;
                    node.children = [grandChild];
                    node = childNode; 
                }
            }
        }
        //sigma c ( U (R, S)) => U (sigma c (R), sigma c (S))
        if (node.children[0].type == TypeEnum.Union || node.children[0].type == TypeEnum.Intersect || node.children[0].type == TypeEnum.Subtraction)
        {
            changed = true;
            var childNode = node.children[0];
            var lGrandChild = childNode.children[0];
            var rGrandChild = childNode.children[1];
            childNode.parent = node.parent;
            childNode.children[0] = node;
            var newNode = new Node(node.type, node.value);
            childNode.children[1] = newNode;
            node.parent = childNode;
            node.children = [lGrandChild];
            newNode.parent = childNode;
            newNode.children = [rGrandChild]
            node = childNode;
        }
    }
    for (var i = 0; i < node.children.length; i++)
    {
        var out = PushDownSelects(node.children[i], schema, changed);
        newChild = out[0];
        changed = out[1];
        node.children[i] = newChild;
    }
    return [node, changed];
}

function CopyTree(node)
{
    var newNode = new Node(node.type, node.value);
    for (var i = 0; i < node.children.length; i++)
    {
        var newChild = CopyTree(node.children[i]);
        newChild.parent = newNode;
        newNode.children.push(newChild);
    }
    return newNode;
}

function CombineSelectCross(node, schema)
{
    if (node.type == TypeEnum.Sigma && node.children[0].type == TypeEnum.Cross)
    {
        //sigmas are separated so there should only be one condition
        var condition = node.value;
        condition = condition.replace(/!=/g, "=").replace(/>=/g, "=").replace(/<=/g, "=").replace(/>/g, "=").replace(/</g, "=");
        var atts = condition.split("=");
        var rAt = 0;
        var inLeft = false;
        var inRight = false;
        var ldata = node.children[0].children[0].data;
        var rdata = node.children[0].children[1].data;
        for (var i = 1; i < ldata.length; i++)
        {
            if (atts[0].trim() == ldata[i][0].toLowerCase())
            {
                rAt = 1;
                inLeft = true;
                break;
            }
            else if (atts[1].trim() == ldata[i][0].toLowerCase())
            {
                rAt = 0;
                inLeft = true;
                break;
            }
        }
        if (inLeft)
        {
            for (var i = 1; i < rdata.length; i++)
            {
                if (atts[rAt].trim() == rdata[i][0].toLowerCase())
                {
                    inRight = true;
                    break;
                }
            }
            if (inRight)
            {
                changed = true;
                var childNode = node.children[0];
                childNode.parent = node.parent;
                childNode.type = TypeEnum.Join;
                childNode.value = node.value;
                node = childNode; 
            }
        }
        

    }
    for (var i = 0; i < node.children.length; i++)
    {
        var newChild = CombineSelectCross(node.children[i]);
        newChild.parent = node;
        node.children[i] = newChild;
    }
    return node;
}

function OptimizeTree(tree, schema)
{
    tree = CopyTree(tree);
    tree = BreakUpSelects(tree);
    var cont = true
    while (cont)
    {
        tree = FillTreeData(tree, schema);
        var out = PushDownSelects(tree, schema, false);
        tree = out[0];
        cont = out[1];
    }
    tree = FillTreeData(tree, schema);
    tree = CombineSelectCross(tree,schema)
    return tree;
}

query = $scope.cmModel.string;

var cind = query.indexOf("--")
while (cind != -1)
{
    nlind = query.indexOf("\n");
    if (nlind == -1)
    {
        query = query.replace(query.substring(cind), "");
    }
    else
    {
        query = query.replace(query.substring(cind, nlind), "");
    }
    cind = query.indexOf("--")
}
newq = query.replace(/[^\x21-\x7E\u03C0\u03C1\u03C3\u2A1D\u222A\u2229\u2A2F\u27F5\u2227\u2228]+/g, ' ');
newq = newq.replace(/^\s+|\s+$/g, '').trim();
var tree = createTree(newq);
var a = TreeToGraphRun(tree);

var schema = {};
schema["R"] = [5, ["a", "int"],["b", "string"], ["c", "string"]]
schema["S"] = [5, ["b", "string"], ["d", "int"]]
schema["T"] = [4, ["b", "string"], ["d", "int"]]
schema["Person"] = [5, ["firstname", "string"], ["lastname", "string"], ["age", "int"]];

var b = TreeToSql(tree, "", 0, schema);













/*
    Function: updateNodes
    Description: Update the nodes for the run tab
  */
  updateNodes = function(){
    // Creating new nodes
    // TODO: Add logic to update the nodes for real
    // var nodes = new vis.DataSet([
    //     {id: 1, label: 'Node 1', title: 'Node 1'},
    //     {id: 2, label: 'Node 2', title: 'Node 2'},
    //     {id: 3, label: 'Node 3', title: 'Node 3'},
    //     {id: 4, label: 'Node 4', title: 'Node 4'},
    //     {id: 5, label: 'Node 5', title: 'Node 5'},
    //     {id: 6, label: 'Node 6', title: 'Node 6'}
    // ]);

    // Creating new edges
    // var edges = new vis.DataSet([
    //     {from: 1, to: 3},
    //     {from: 1, to: 2},
    //     {from: 2, to: 4},
    //     {from: 2, to: 5},
    //     {from: 2, to: 6}
    // ]);

    query = $scope.cmModel.string;
    var cind = query.indexOf("--")
    while (cind != -1)
    {
        nlind = query.indexOf("\n");
        if (nlind == -1)
        {
            query = query.replace(query.substring(cind), "");
        }
        else
        {
            query = query.replace(query.substring(cind, nlind), "");
        }
        cind = query.indexOf("--")
    }

    newq = query.replace(/[^\x21-\x7E\u03C0\u03C1\u03C3\u2A1D\u222A\u2229\u2A2F\u27F5\u2227\u2228]+/g, ' ');
    newq = newq.replace(/^\s+|\s+$/g, '').trim();
    var tree = createTree(newq);
    //tree = OptimizeTree(tree);
    var graph = TreeToGraphRun(tree);

    var schema = {};
    
    var nodes = new vis.DataSet(graph[0]);
    var edges = new vis.DataSet(graph[1]);

    // Updating the dataset for the network
    network.setData({
        nodes: nodes,
        edges: edges
    });

    console.log(nodes);
    console.log(edges);

    return tree;

  }

















  // OPTIMIZE TAB ###################################################################################################################################################
  $scope.cmOptionOptimize = {
    lineNumbers:true,
    indentWithTabs:true,
    mode:'relationalAlgebra',
    lineWrapping: true
  }

  $scope.cmModelOptimize={string:'consoleee.log();'};

  $scope.optimizedQueryString = "Optimized query will go here...";
  $scope.showGraphs = false;

  /* Function triggered when "Optimize" button is clicked */
  $scope.optimizeQuery = function(){
    // TODO: Print the contents of the code mirror to the console to get handle to it
    console.log('Optimize query!');

    query = $scope.cmModelOptimize.string;
    var cind = query.indexOf("--")
    while (cind != -1)
    {
        nlind = query.indexOf("\n");
        if (nlind == -1)
        {
            query = query.replace(query.substring(cind), "");
        }
        else
        {
            query = query.replace(query.substring(cind, nlind), "");
        }
        cind = query.indexOf("--")
    }

    newq = query.replace(/[^\x21-\x7E\u03C0\u03C1\u03C3\u2A1D\u222A\u2229\u2A2F\u27F5\u2227\u2228]+/g, ' ');
    newq = newq.replace(/^\s+|\s+$/g, '').trim();
    var tree = createTree(newq);

    schema = {};
    schema["person"] = [7, ["firstname", "string"], ["lastname", "string"], ["age", "int"], ["MID", "int"]];
    schema["languages"] = [3, ["most_proficient", "string"], ["ID", "int"]]
    var optTree = OptimizeTree(tree, schema);

    // Temporarily setting the results to <temp results>
    $scope.optimizedQueryString = "pi firstname, lastname (join id=mid(sigma firstname = 'Chris' (Person), sigma most_proficient = 'Python' (languages)))";

    // Update graph results
    $scope.showGraphs = true;
    updateAllNodes(tree, optTree);
  }

  var originalNetwork = new vis.Network(originalContainer, $scope.originalData, $scope.options);
  var optimizedNetwork = new vis.Network(optimizedContainer, $scope.optimizedData, $scope.options);

  function updateAllNodes(tree, optTree){
    /* visjs data for the original graphs */


    var graph = TreeToGraphRun(tree);
    var originalNodes = new vis.DataSet(graph[0]);
    var originalEdges = new vis.DataSet(graph[1]);

    // Updating the dataset for the network
    originalNetwork.setData({
        nodes: originalNodes,
        edges: originalEdges
    });

    var optGraph = TreeToGraphRun(optTree);
    var optimizedNodes = new vis.DataSet(optGraph[0]);
    var optimizedEdges = new vis.DataSet(optGraph[1]);

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
    mode:'relationalAlgebra',
    lineWrapping: true
  }

  $scope.cmModelConvertRa={string:'consolasdfdse.log();'};

  $scope.cmOptionConvertSql = {
    lineNumbers:true,
    indentWithTabs:true,
    mode:'text/x-mysql',
    lineWrapping: true
  }

  $scope.cmModelConvertSql={string:'console.log(SQL);'};
  

  $scope.convertToSql = function(){
    console.log('Convert to sql');

    // TODO: Get handle from code mirror for Relational Algebra code
    var query = "";
    query = $scope.cmModelConvertRa.string; 
    var newq = query.replace(/[^\x21-\x7E\u03C0\u03C1\u03C3\u2A1D\u222A\u2229\u2A2F\u27F5\u2227\u2228]+/g, ' ');
    newq = newq.replace(/^\s+|\s+$/g, '').trim();
    var tree = createTree(newq);

    schema["R"] = [5, ["a", "int"],["b", "string"], ["c", "string"]]
    schema["S"] = [5, ["b", "string"], ["d", "int"]]
    schema["T"] = [4, ["b", "string"], ["d", "int"]]
    schema["Person"] = [5, ["firstname", "string"], ["lastname", "string"], ["age", "int"]];

    var out = TreeToSql(tree, "", 0, schema);
    var sql = out[0];

    console.log(sql);

    updateSqlEditor( $scope.cmModelConvertRa);
            
  }

  $scope.convertToRelAlg = function(){
    console.log('Convert to rel alg');

    query = $scope.cmModelConvertSql.string; 
    var newq = query.replace(/[^\x21-\x7E\u03C0\u03C1\u03C3\u2A1D\u222A\u2229\u2A2F\u27F5\u2227\u2228]+/g, ' ');
    newq = newq.replace(/^\s+|\s+$/g, '').trim().toLowerCase();
    var tree = SqlToTree(newq);


    var Ra = TreeToRA(tree, "", 0, schema);

    console.log(Ra);
    updateRelAlgEditor($scope.cmModelConvertRa);

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
