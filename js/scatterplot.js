/**
 * Created by yevheniia on 01.07.19.
 */
var margin = {top: 40, right: 40, bottom: 40, left: 40},
    // dim = Math.min(parseInt(d3.select("#chart").style("width")), parseInt(d3.select("#chart").style("height"))),
    width = parseInt(d3.select("#chart").style("width")) - margin.left - margin.right,
    height = parseInt(d3.select("#chart").style("height")) - margin.top - margin.bottom;


var radius = 5;
var radiusMob = 3;


var x = d3.scaleLinear()
    .range([width, 0]);

var y = d3.scaleLinear()
    .range([0, height]);


var color = d3.scaleOrdinal()
    .range(['#e6194b', '#3cb44b', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000']);


var xAxis = d3.axisTop(x);

var yAxis = d3.axisRight(y);



var svg = d3.select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var textContainer;

d3.csv("data/scatterplot_data.csv", function(error, data) {
    if (error) throw error;


    data.forEach(function(d) {
        d.X1 = +d.X1;
        d.X2 = +d.X2;
    });

    x.domain(d3.extent(data, function(d) { return d.X2; }));
    y.domain(d3.extent(data, function(d) { return d.X1; }));


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        // .call(xAxis)
        .append("text")
        // .attr("class", "axi")
        .attr("x", width)
        .attr("y", 10)
        .style("text-anchor", "end")
        .text("xAxis");

    svg.append("g")
        .attr("class", "y axis")
        // .call(yAxis)
        .append("text")
        // .attr("class", "axis")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("yAxis");


    var dots = svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        // .attr("d", d3.symbol().type(d3.symbolTriangle))
        .attr("r", function(d){
            if(screen.width < 800){
                return radiusMob
            } else {
                return radius
            }
        })
        .attr("cx", function(d) { return x(d.X2); })
        .attr("cy", function(d) { return y(d.X1); })
        // .attr("transform", function(d) { return "translate(" + x(d.X2) + "," + y(d.X1) + ")"; })
        .attr("data-tippy-content", function(d) {
            return d.full_name + "<br>" + d.party  + "<br>"
        })
        .attr("data", function(d){ return d.full_name})
        .style("fill", function(d) {
            if(d.full_name != "NA") {
                return d.color
            } else {
                return "black"
            }
        })
        .style("opacity", function(d) {
            if(d.full_name != "NA") {
                return 0.9
            } else {
                return 0
            }
        })
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .on("click", function(d) {

        });

    svg.append("line")
        .attr("id", "horizontal")
        .attr("x1", x(5.6))
        .attr("x2", x(5.6))
        .attr("y1", y(-7.2))
        .attr("y2", y(0))
        .attr("stroke", "white")
        // .style("stroke-dasharray", ("3, 3"))
    ;

    svg.append("line")
        .attr("id", "vertical")
        .attr("y1", y(-3.4))
        .attr("y2", y(-3.4))
        .attr("x1", x(8))
        .attr("x2", x(3))
        .attr("stroke", "white")
    ;


   svg
        .selectAll(".label-background")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label-background")
        .attr("x", function(d) { return x(d.X2); })
        .attr("y", function(d) { return y(d.X1); })
        .text(function(d) {
            if(d.full_name === "NA"){
                return d.my_labels
            }
        })
        .style("fill", 'black');

    svg
        .selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", function(d) { return x(d.X2); })
        .attr("y", function(d) { return y(d.X1); })
        .text(function(d) {
            if(d.full_name === "NA"){
                return d.my_labels
            }
        })

        .style("fill", function(d) {

            if(d.party != "NA") {
                return d.color
            } else {
                return "white"
            }
        });

    //tippy
    tippy('circle.dot', {
        allowHTML:true,
        animation: 'scale',
        duration: 0,
        arrow: true,
        delay: 500
    });


    //Пошук по графіку
    $("#filter").keyup(function () {
        var value = $(this).val();

        if (value) {
            var i = 0;
            var re = new RegExp(value, "i");

            data.forEach(function (d) {
                if (!d.full_name.match(re)) { // color gray if not a match
                    d3.select(dots._groups[0][i])
                        .style("stroke", "none")
                        .attr("r", function(d){
                            if(window.innerWidth < 800){
                                return radiusMob
                            } else {
                                return radius
                            }
                        })


                } else {
                    d3.select(dots._groups[0][i])
                        .style("stroke", "black")
                        .style("stroke-width", "2px")
                        .attr("r", 10);


                }
                i++;
            });
        } else {
            d3.selectAll(".dot")
                .attr("r", function(d){
                if(window.innerWidth < 800){
                    return radiusMob
                } else {
                    return radius
                }
            })
                .style("stroke", "none");

        }
    }).keyup();

});






function resize() {
    var dim = Math.min(parseInt(d3.select("#chart").style("width")), parseInt(d3.select("#chart").style("height"))),
        width = parseInt(d3.select("#chart").style("width")) - margin.left - margin.right,
        height = parseInt(d3.select("#chart").style("height")) - margin.top - margin.bottom;

    // Update the range of the scale with new width/height
    x.range([width, 0]);
    y.range([0, height]);

    // Update the axis and text with the new scale
    svg.select('.x.axis')
        .attr("transform", "translate(0," + height + ")");
        // .call(xAxis);

    svg.select('.x.axis').select('.label')
        .attr("x", width);

    svg.select('.y.axis');
        // .call(yAxis);

    // Update the tick marks
    xAxis.ticks(width / 75);
    yAxis.ticks(height / 75);


    svg.selectAll('.dot')
        .attr("r", function(d){
            if(window.innerWidth < 800){
                return radiusMob
            } else {
                return radius
            }
        })
        .attr("cx", function(d) { return x(d.X2); })
        .attr("cy", function(d) { return y(d.X1); });

    svg.selectAll(".label")
        .attr("x", function(d) { return x(d.X2); })
        .attr("y", function(d) { return y(d.X1); });

    svg.selectAll(".label-background")
        .attr("x", function(d) { return x(d.X2); })
        .attr("y", function(d) { return y(d.X1); })

    svg.select("#horizontal")
        .attr("x1", x(5.6))
        .attr("x2", x(5.6))
        .attr("y1", y(-7.2))
        .attr("y2", y(0));


    svg.select("#vertical")
        .attr("y1", y(-3.4))
        .attr("y2", y(-3.4))
        .attr("x1", x(8))
        .attr("x2", x(3));

}

d3.select(window).on('resize', resize);

resize();

