var TypeEnum = {"Pi":1, "Sigma":2, "Rho":3, "NJoin":4, "Data":5}

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


    var node = new Node(TypeEnum.NJoin, "⨝");
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
    if (q.startsWith("π ") || q.startsWith("pi "))
    {
        newq = q.substring(q.indexOf(" ") + 1);
        return parseProject(newq);
    }
    else if (q.startsWith("σ ") || q.startsWith("sigma "))
    {
        newq = q.substring(q.indexOf(" ") + 1);
        return parseSelect(newq);
    }
    else if (q.startsWith("⨝") || q.startsWith("njoin"))
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

query = "\t \n  π a, c (\n    σ a < 3 (\n        ⨝(R,S)\n    )\n)"
newq = query.replace(/[^\x21-\x7Eπσ⨝]+/g, ' ');
newq = newq.replace(/^\s+|\s+$/g, '').trim();
var a = [];
a.push(1);
//window.alert(query);
//window.alert(newq);
var tree = createTree(newq);
var a = splitOnComma("((3), 123 (4)), ( 3 2, (1 (2)))")
