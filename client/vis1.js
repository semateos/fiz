function Vis1(config){

	this.config = config;
}

Vis1.prototype = {
	
	render: function(){

		var body = d3.select("body");

		var w = document.body.clientWidth,
		h = document.body.clientHeight;

		var nodes = d3.range(200).map(function() { return {radius: Math.random() * 5 + 2}; }),
			color = d3.scale.category10();

		var force = d3.layout.force()
			.gravity(0.002)
			.charge(function(d, i) { 

				if(i == 0){

					return 300;

				}else if(i%3 == 0){

					return 50;

				}else{

					return i%7 ? 0 : Math.random() * -300; 
				}

				
			})
			.nodes(nodes)
			.size([w, h]);

		var root = nodes[0];
		root.radius = 0;
		root.fixed = true;

		force.start();

		var svg = d3.select("body").append("svg:svg")
			.attr("width", '100%')
			.attr("height", '100%');

		svg.selectAll("circle")
			.data(nodes.slice(1))
			.enter().append("svg:circle")
			.attr("r", function(d) { return d.radius * 1.3; })
			.style("fill", function(d, i) { return color(i % 2); })
			.style("opacity", 1);

		force.on("tick", function(e) {
		  var q = d3.geom.quadtree(nodes),
			  i = 0,
			  n = nodes.length;

			  while (++i < n) {
				q.visit(collide(nodes[i]));
			  }

		  svg.selectAll("circle")
			  .attr("cx", function(d) { return d.x; })
			  .attr("cy", function(d) { return d.y; });
		});

		svg.on("mousemove", function() {
			var p1 = d3.svg.mouse(this);
			root.px = p1[0];
			root.py = p1[1];
			force.resume();
		});

		function collide(node) {
		  var r = node.radius - 2,
			  nx1 = node.x - r,
			  nx2 = node.x + r,
			  ny1 = node.y - r,
			  ny2 = node.y + r;

		  return function(quad, x1, y1, x2, y2) {
			if (quad.point && (quad.point !== node)) {
			  var x = node.x - quad.point.x,
				  y = node.y - quad.point.y,
				  l = Math.sqrt(x * x + y * y),
				  r = node.radius + quad.point.radius;
			  if (l < r) {
				l = (l - r) / l * .5;
				node.x -= x *= l;
				node.y -= y *= l;
				quad.point.x += x;
				quad.point.y += y;
			  }
			}
			return x1 > nx2
				|| x2 < nx1
				|| y1 > ny2
				|| y2 < ny1;
		  };
		}

	}
}