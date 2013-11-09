$(function() {
  initButtons()

  nodes = []
  links = []
  fill = d3.scale.category20()

  vis = d3.select('#main').append("svg")
                           .attr("width", '100%')
                           .attr("height", '100%')

  force = d3.layout.force()
         .nodes(nodes)
         .links(links)
         .charge(-500)
         .friction(0.1)
         .gravity(0.1)
         .size([500,500])
         .start()

  addAtom('H')

})

function addAtom(element, linkedAtomId) {
  var atomRepr = atom(element)
  atomRepr.id = nodes.length
  nodes.push(atomRepr)

  if (typeof linkedAtomId !== 'undefined') {
    console.log(linkedAtomId)
    console.log({source: atomRepr.id, target: linkedAtomId})
    links.push({source: atomRepr.id, target: linkedAtomId, value: 1})
  }

  var link = vis.selectAll("line.link")
    .data(links, function(d) { return d.source.id + "-" + d.target.id; });

  link.enter().insert("line")
      .attr("class", "link");

  // link.exit().remove();

  var node = vis.selectAll("g.node")
    .data(nodes, function(d) { return d.id;});

  var nodeEnter = node.enter().append("g")
                              .attr("class", "node")
                              .call(force.drag);

  node.append("circle")
      .attr("r", function(d) {
        return Math.pow(40 * d.size, 1/3);
      })
      .attr("fill", function(d) {
        return fill(d.size);
      })
      .attr("stroke", "black")
      .attr("stroke-width",2);

  nodeEnter.append("text")
            .attr("class", "nodetext")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function(d) {return d.atom});

  // node.exit().remove();

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });

  force.start();
}


function atom(letter) {
  switch(letter)
  {
    case "C":
      return {"atom":"C", "size":12};
    case "H":
      return {"atom":"H", "size":1};
    case "N":
      return {"atom":"N", "size":7};
    case "O":
      return {"atom":"O", "size":16};
    default:
      return {}; //Not sure what to do here...
  }
}

function initButtons() {
  $('.add-atom').click(function(e) {
    var element = $(this).attr('data-element')
    addAtom(element)
  })
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
