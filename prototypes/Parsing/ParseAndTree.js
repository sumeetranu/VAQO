var TypeEnum = {"Pi":0, "Sigma":1, "Rho":2, "NJoin":3, "Data":4}
var Types = ["\u03C0", "\u03C3", "\u03C1", "\u2A1D", "Data"]

function Node(type, val)
{
    this.type = type;
    this.value = val;
    this.parent = null;
    this.children = [];
}


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
    else if (q.startsWith("\u2A1D") || q.startsWith("njoin"))
    {
        newq = q.substring(q.indexOf("(") + 1, q.lastIndexOf(")"));
        return parseNJoin(newq);
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
pi a, c (
	sigma a < 4 (
		(pi a,c (sigma a < 5 (R))) njoin S
	)
)
*/

query = "\t \n  \u03C0 a, c (\n    \u03C3 a < 3 (\n        \u2A1D(pi a,b,c (sigma a < 5 (R)),S)\n    )\n)"
newq = query.replace(/[^\x21-\x7E\u03C0\u03C3\u2A1D]+/g, ' ');
newq = newq.replace(/^\s+|\s+$/g, '').trim();
var a = [];
a.push(1);
//window.alert(query);
//window.alert(newq);
var tree = createTree(newq);
var a = TreeToGraphRun(tree);

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