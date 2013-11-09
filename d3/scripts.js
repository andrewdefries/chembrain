var graph;
var selectedNode;

function myGraph(el) {
  this.updateToMolecule = function(nodes, links) {
    this.removeAllNodes()
    _.each(nodes, function(node) {
      this.addNode()
    })
  }

  this.addLinkedNode = function(letter, linkedId) {
    if (selectedNode == null) {
      console.log('WARNING: YOU MUST SELECT A NODE BITCH')
      return null
    }

    var linkedNode = findNode(linkedId)
    if (linkedNode.free < 1) {
      console.log("WARNING: trying to add to full atom")
      return null
    }

    var newNode = this.addNode(letter)
    this.addLink(newNode.id, linkedId, 1)
  }

  this.addNode = function(letter) {
    var atomRepr = getAtom(letter)
    atomRepr.id = nodes.length == 0 && 1 || _.max( nodes, function(node) {return node.id}).id + 1
    nodes.push(atomRepr)
    update();
    if (nodes.length == 1) {
      selectedNode = nodes[0]
      $('circle').attr('stroke', 'green');
    }

    return atomRepr
  };

  this.removeNode = function(id) {
    nodes.splice(findNodeIndex(id), 1);
    this.removeLinksToId(id)
    update();
  };

  this.removeLinksToId = function(id) {
    var i = 0;
    while (i < links.length) {
      link = links[i];
      if (link.target.id == id || link.source.id == id) {
        this.removeLink(link.target.id, link.source.id)
      } else i++;
    }
  }

  this.removeLink = function (id1, id2) {
    var node1 = findNode(id1)
    var node2 = findNode(id2)
    for (var i = 0; i < links.length; i++) {
      link = links[i];
      if (link.source.id == id1 && link.target.id == id2 || link.source.id == id2 && link.target.id == id1) {
        links.splice(i, 1);
        break;
      }
    }
    if (node1) node1.free += 1;
    if (node2) node2.free += 1;
    update();
  };

  this.removeAllLinks = function () {
      links.splice(0, links.length);
      update();
  };

  this.removeAllNodes = function () {
    this.removeAllLinks()
    nodes.splice(0, nodes.length);
    update();
    selectedNode = null;
  };

  this.addLink = function (sourceId, targetId, value) {
    var source = findNode(sourceId)
    var target = findNode(targetId)

    if (source.free < 1 || target.free < 1) {
      console.log("WARNING: trying to add to full atom (from .addLink)")
      return null
    }

    links.push({
      source: source,
      target: target,
      value: value
    });

    source.free -= 1
    target.free -= 1

    update();
  };

  var findNode = function (id) {
    return _.find(nodes, function(node) { return node.id == id})
  };

  var findNodeIndex = function (id) {
      for (var i = 0; i < nodes.length; i++) {
          if (nodes[i].id == id) {
              return i;
          }
      };
  };

  // set up the D3 visualisation in the specified element
  var w = '500';
  var h = '500';

  var vis = d3.select(el)
      .append("svg:svg")
      .attr("width", w)
      .attr("height", h)
      .attr("id", "svg")
      .attr("pointer-events", "all")
      .attr("viewBox", "0 0 " + w + " " + h)
      .attr("perserveAspectRatio", "xMinYMid")
      .append('svg:g');

  var force = d3.layout.force();

  var nodes = force.nodes();
  var links = force.links();
  this._nodes = force.nodes();
  this._links = force.links();

  var update = function () {
    var link = vis.selectAll("line")
      .data(links, function (d) {
      return d.source.id + "-" + d.target.id;
    });

    link.enter().append("line")
      .attr("id", function (d) {
        return d.source.id + "-" + d.target.id;
      })
      .attr("class", "link");

    link.append("title")
      .text(function (d) {
        return d.value;
      });

    link.exit().remove();

    var node = vis.selectAll("g.node")
      .data(nodes, function (d) {
        return d.id;
      });

    var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .call(force.drag);

    nodeEnter.append("svg:circle")
      .attr("r", function(d) {
        return Math.pow(40 * d.size, 1/3);
      })
      .attr("fill", function(d) {
        return d3.scale.category20()(d.size);
      })
      .attr("id", function (d) {
        return "Node;" + d.id;
      })
      .attr("stroke", "black")
      .attr("class", "nodeStrokeClass")
      .attr("stroke-width",2)
      .on('click', function(d,i) {
        $('circle').attr('stroke', 'black');
        $(this).attr('stroke', 'green');
        selectedNode = d;
      });

    nodeEnter.append("svg:text")
      .attr("class", "textClass")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function (d) {
        return d.atom;
      });

    node.exit().remove();
    force.on("tick", function () {
      node.attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
      link.attr("x1", function (d) {
        return d.source.x;
      })
      .attr("y1", function (d) {
        return d.source.y;
      })
      .attr("x2", function (d) {
        return d.target.x;
      })
      .attr("y2", function (d) {
        return d.target.y;
      });
    });

    // Restart the force layout.
    force.gravity(.05)
        .distance(50)
        .linkDistance(50)
        .size([w, h])
        .start();
  };

  // Make it all go
  update();
}

function getAtom(atomSize) {
  switch(parseInt(atomSize))
  {
    case 6:
      return {atom:"C", size:12, electrons: 4, free: 4};
    case 1:
      return {atom:"H", size:1, electrons: 1, free: 1};
    case 7:
      return {atom:"N", size:14, electrons: 3, free: 3};
    case 8:
      return {atom:"O", size:16, electrons: 2, free: 2};
    default:
      console.log('WARNING: unknown element created')
      return {}; //Not sure what to do here...
  }
}

function initButtons() {
  $('.add-atom').click(function(e) {
    var element = $(this).attr('data-element')
    if (selectedNode) {
      graph.addLinkedNode(element, selectedNode.id);
    } else if (graph._nodes.length == 0) {
      graph.addNode(element)
    }
  });

  $('.kill-selected').click(function(e) {
    if (selectedNode) { graph.removeNode(selectedNode.id); }
  })

  $('.clear').click(function(e) {
    graph.removeAllNodes()
  })

  $('.save-to-local').click(function(e) {
    saveToLocal()
  })

  $('.load-from-local').click(function(e) {
    loadFromLocal()
  })
}


$(function () {
  graph = new myGraph("#main");
  graph.addNode('6');

  initButtons()
});




//   force = d3.layout.force()
//     .size([500, 500])
//     .nodes([{atom:"C", size:12, electrons: 4, id: 1}])
//     .linkDistance(120)
//     .charge(-1500)
//     .friction(0.3)


// // function initForce(nodes, links) {
// //   force = d3.layout.force()
// //        .nodes(nodes)
// //        .links(links)
// //        .linkDistance(120)
// //        .charge(-1500)
// //        .friction(0.3)
// //        .gravity(0.1)
// //        .size([500,500])
// //        .start()


// var free_electrons = function(atomSize){
//   if (atomSize <= 2){
//     return 2 - atomSize;
//   } if (atomSize < 18){
//     return ((2 - atomSize) % 8) + 8;
//   }
// }


// ============ LOCAL STORAGE ===============

function saveToLocal() {
  var ob = {
    links: graph._links,
    nodes: graph._nodes
  }
  console.log(ob)

  var stringed = JSON.stringify(ob)
  window.localStorage.setItem("savedMolecule", stringed)
}

function loadFromLocal() {
  var get = window.localStorage["savedMolecule"]
  if (get) {
    var ob = JSON.parse(get)
    console.log(ob)
  }
}

function updateToMolecule(atoms, links) {
  //clear
  //add atoms
  //add links
  //
  //
}


// ============ END LOCAL STORAGE ===============


// ============ SECTION ===============

var molecule = function(atoms_in_molecule){
  // we expect a string e.g. 'CCCNHOOHHHHHH'
  var atoms = [];
  for (var i=0; i < atoms_in_molecule.length; i++){
    atoms.push(atom(atoms_in_molecule[i]))
  }
  return atoms;
}

var pairs_to_links = function(tups){
  var links = [];
  for (var i=0; i < tups.length; i++){
    links.push({"source":tups[i][0], "target":tups[i][1]});
  }
  return links;
}

// ================= END SECTION ===============



// ================= OLD ===============

// var render_molecule = function(selector, molecule_repr, height, width){
//   height = height || 200
//   width = width || 200

//   var m = molecule_repr["molecule"]; // e.g. "HHO"
//   var p = molecule_repr["links"]; // e.g. [[0, 2], [1, 2]]

//   var w=width
//   var h=height
//   fill = d3.scale.category20()

//   nodes = molecule(m)
//   links = pairs_to_links(p)

//   // vis = d3.select(selector).append("svg")
//   //                          .attr("width", w)
//   //                          .attr("height", h),

//   // force = d3.layout.force()
//   //                  .nodes(nodes)
//   //                  .links(links)
//   //                  .charge(-1500)
//   //                  .friction(0.8)
//   //                  .gravity(0.5)
//   //                  .size([w,h])
//   //                  .start(),

//   link = vis.selectAll("line")
//             .data(links)
//             .enter()
//             .append("line")
//             .attr("class","link")

//   node = vis.selectAll(".node")
//             .data(nodes)
//             .enter()
//             .append("g")
//             .attr("class", "node")
//             .call(force.drag);

//   node.append("circle")
//       .attr("r", function(d) {
//         return Math.pow(40 * d.size, 1/3);
//       })
//       .attr("fill", function(d) {
//         return fill(d.size);
//       })
//       .attr("stroke", "black")
//       .attr("stroke-width",2);

//   node.append("text")
//       .attr("dx", function(d) {
//         return Math.pow(40 * d.size, 1/3) + 1;
//       })
//       .attr("dy", ".35em")
//       .text(function(d) {return d.atom;});

//   force.on("tick", function() {
//     link.attr("x1", function(d) { return d.source.x; })
//         .attr("y1", function(d) { return d.source.y; })
//         .attr("x2", function(d) { return d.target.x; })
//         .attr("y2", function(d) { return d.target.y; });

//     node.attr("transform", function(d) {
//       return "translate(" + d.x + "," + d.y + ")";
//     });
//   });
// }
