$(function() {
  initButtons()

  // link = d3.selectAll('.link')
  // node = d3.selectAll('.node')

  var nodes = []
  var links = []
  fill = d3.scale.category20()

  vis = d3.select('#main').append("svg")
                           .attr("width", '100%')
                           .attr("height", '100%')

  initForce(nodes, links)

  initFirst()
})

function initForce(nodes, links) {
  force = d3.layout.force()
       .nodes(nodes)
       .links(links)
       .linkDistance(120)
       .charge(-1500)
       .friction(0.3)
       .gravity(0.1)
       .size([500,500])
       .start()

  force.on("tick", function() {
    d3.selectAll('.link').attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

    d3.selectAll('.node').attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  })
}

function initFirst() {
  addAtom('C')
  selectedNode = force.nodes()[0]
  $('circle').attr('stroke', 'green');
}


function hasUnpaired(atom) {
  return _.filter(force.links(), function(link) {
    return link.source.id == atom.id || link.target.id == atom.id
  }).length < atom.electrons
}

function addAtom(element, linkedAtom) {
  if (linkedAtom && !hasUnpaired(linkedAtom)) {
    console.log('WARNING: tried to link without available electron')
    return null
  }

  var atomRepr = atom(element)
  atomRepr.id = force.nodes().length
  force.nodes().push(atomRepr)

  if (typeof linkedAtom !== 'undefined') {
    force.links().push({source: atomRepr.id, target: linkedAtom.id, value: 1})
  }

  var link = vis.selectAll("line.link")
    .data(force.links(), function(d) { return d.source.id + "-" + d.target.id; });

  link.enter().insert("line")
      .attr("class", "link");

  link.exit().remove();

  var node = vis.selectAll("g.node")
    .data(force.nodes(), function(d) { return d.id;});

  var nodeEnter = node.enter().append("g")
                              .attr("class", "node")
                              .call(force.drag);

  nodeEnter.append("circle")
      .attr("r", function(d) {
        return Math.pow(40 * d.size, 1/3);
      })
      .attr("fill", function(d) {
        return fill(d.size);
      })
      .attr("stroke", "black")
      .attr("stroke-width",2)
      .on('click', function(d,i) {
        $('circle').attr('stroke', 'black');
        $(this).attr('stroke', 'green');
        selectedNode = d;
      })

  nodeEnter.append("text")
            .attr("class", "nodetext")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function(d) {return d.atom});

  node.exit().remove();

  force.start()
}

function atom(letter) {
  switch(letter)
  {
    case "C":
      return {atom:"C", size:12, electrons: 4};
    case "H":
      return {atom:"H", size:1, electrons: 1};
    case "N":
      return {atom:"N", size:7, electrons: 3};
    case "O":
      return {atom:"O", size:16, electrons: 2};
    default:
      return {}; //Not sure what to do here...
  }
}

function connectedIds(atomId) {
  var links = _.filter(force.links(), function(link) {
    return link.target.id == atomId || link.source.id == atomId
  })

  var all_ids = _.map(links, function(link) {return [link.source.id, link.target.id]})
  return _.uniq(_.reject(_.flatten(all_ids), function(id) { return id == atomId}))
}

function killAtom(atom) {
  if (connectedIds(atom.id).length > 1) {
    console.log('WARNING: removing non-edge atom')
    return null
  }

  var nodes = _.reject(force.nodes(), function(node) {return node.id == atom.id});
  var links = _.reject(force.links(), function(link) {
    return link.source.id == atom.id || link.target.id == atom.id
  })

  initForce(nodes, links)

  var node = vis.selectAll(".node");
  node = node.data(nodes, function(d) { return d.id;});
  node.exit().remove();

  var link = vis.selectAll(".link");
  link = link.data(links, function(d) { return d.source.id + "-" + d.target.id; });
  link.exit().remove();

  force.start();

  selectedNode = null
}

function initButtons() {
  $('.add-atom').click(function(e) {
    var element = $(this).attr('data-element')
    if (selectedNode) {
      addAtom(element, selectedNode);
    } else if (force.nodes().length == 0) {
      addAtom(element)
    }
  });

  $('.kill-selected').click(function(e) {
    if (selectedNode) { killAtom(selectedNode); }
  })

  $('.clear').click(function(e) {
    vis.selectAll('.node').remove()
    vis.selectAll('.link').remove()
    var nodes = []
    var links = []
    initForce(nodes, links)
    initFirst()
  })
}

var free_electrons = function(atomSize){
  if (atomSize <= 2){
    return 2 - atomSize;
  } if (atomSize < 18){
    return ((2 - atomSize) % 8) + 8;
  }
}

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
