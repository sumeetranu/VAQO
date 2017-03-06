

var TypeEnum = {"Pi":0, "Sigma":1, "Rho":2, "NJoin":3, "Data":4,
 "Union":5, "Intersect":6, "Subtraction":7, "Cross":8}

var Types = ["\u03C0", "\u03C3", "\u03C1", "\u2A1D", "Data"
, "\u222A", "\u2229", "-", "\u2A2F"]

function Node(type, val)
{
    this.type = type;
    this.value = val;
    this.parent = null;
    this.children = [];
}

//within a binary operation splits the operation into the two sub operations
// ex Join(pi a,b(R), S) would output ["pi a,b(R)", "S"]
function splitOnComma(q)
{
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
function parseNJoin(str)
{
    var spl = splitOnComma(str);
    left = spl[0];
    right = spl[1];


    var node = new Node(TypeEnum.NJoin, "");
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
    left = spl[0];
    right = spl[1];


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
    left = spl[0];
    right = spl[1];


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
    left = spl[0];
    right = spl[1];


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
    left = spl[0];
    right = spl[1];


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
    if (q.startsWith("\u03C0 ") || q.startsWith("pi "))
    {
        newq = q.substring(q.indexOf(" ") + 1);
        return parseProject(newq);
    }
    else if (q.startsWith("\u03C3 ") || q.startsWith("sigma "))
    {
        newq = q.substring(q.indexOf(" ") + 1);
        return parseSelect(newq);
    }
    else if (q.startsWith("\u03C1 ") || q.startsWith("rho "))
    {
        newq = q.substring(q.indexOf(" ") + 1);
        return parseRho(newq);
    }
    else if (q.startsWith("\u2A1D") || q.startsWith("njoin"))
    {
        //TODO add conditions.
        newq = q.substring(q.indexOf("(") + 1, q.lastIndexOf(")"));
        return parseNJoin(newq);
    }
    else if (q.startsWith("\u222A") || q.startsWith("union"))
    {
        //TODO add conditions.
        newq = q.substring(q.indexOf("(") + 1, q.lastIndexOf(")"));
        return parseUnion(newq);
    }
    else if (q.startsWith("\u2229") || q.startsWith("intersection"))
    {
        //TODO add conditions.
        newq = q.substring(q.indexOf("(") + 1, q.lastIndexOf(")"));
        return parseIntersection(newq);
    }
    else if (q.startsWith("-") || q.startsWith("subtraction"))
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
*/

function NodeToSQL(node, subqueries, alias, schema)
{
    var query = "";
    if (node.type == TypeEnum.Pi)
    {
        var select = "SELECT DISTINCT " + node.value + "\n";
        if (node.children[0].type == TypeEnum.Sigma)
        {
            query = select + subqueries[0];
        }
        else if (node.children[0].children.length == 0)
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
        var conditions = node.value.replace(",", "AND");
        query = "FROM " + subqueries[0] + "\nWHERE " + conditions;
        if (node.parent == TypeEnum.Pi)
        {
            query = "SELECT DISTINCT *\n" + query;
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
    else if (node.type == TypeEnum.NJoin)
    {
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
        query = subqueries[0] + " NATURAL JOIN " + subqueries[1];
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
    else if (node.type == TypeEnum.Data)
    {
        var query = node.value
        
    }
    return [query, alias, schema];
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

/*
pi a, c (
	sigma a < 4 (
		(pi a,c (sigma a < 5 (R))) njoin S
	)
)
*/

/* symbols:
Complete: πσρ ∩∪-⨯⨝--
Todo: ←∧∨¬=≠≥≤     
pi              \u03C0
sigma           \u03C3
rho             \u03C1
njoin           \u2A1D
Union           \u222A
Intersection    \u2229
Subtraction     \u2A2F
ARROW           \u27F5
*/

query = "\t \n  \u03C0 a, b (\n    \u03C3 a < 3 (\n       \u222A(pi b,a (sigma a < 5 (R)),S)\n    )\n)"
//query = "\u03C0 a, d (\u03C1 d<-c (\u2A2F(S, T))\n)"

//query = "\u03C0 b ,d (\u03C3 b != 'a' (\u222A(\u03C0 b, d(S),T))) "

//query = "\u2229 (S, S)"
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

newq = query.replace(/[^\x21-\x7E\u03C0\u03C1\u03C3\u2A1D\u222A\u2229\u2A2F\u27F5]+/g, ' ');
newq = newq.replace(/^\s+|\s+$/g, '').trim();
var a = [];
a.push(1);
//window.alert(query);
//window.alert(newq);
var tree = createTree(newq);
var a = TreeToGraphRun(tree);

var schema = {};
schema["R"] = [5, ["a", "int"],["b", "string"], ["c", "string"]]
schema["S"] = [5, ["b", "string"], ["d", "int"]]
schema["T"] = [4, ["b", "string"], ["d", "int"]]

var b = TreeToSql(tree, "", 0, schema);
prompt("Copy to clipboard: Ctrl+C, Enter", b[0]);















var nodes = new vis.DataSet(a[0]);
var edges = new vis.DataSet(a[1]);

// create a network
var container = document.getElementById('mynetwork');
var data = {
nodes: nodes,
edges: edges
};
var options = {
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
var network = new vis.Network(container, data, options);

var a = 0;