// @TODO: YOUR CODE HERE!
function makeResponsive() {

    var svgArea = d3.select("body").select("svg");
  
    if (!svgArea.empty()) {
      svgArea.remove();
    }
  
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;
  
    var margin = {
      top: 20,
      right: 40,
      bottom: 100,
      left: 100
    };
  
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
  
    var svg = d3.select("#scatter")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);
  
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    d3.csv("assets/data/data.csv").then(stateData => {
        stateData.forEach(data => {
            data.healthcare = +data.healthcare;
            data.poverty = +data.poverty;
            data.state = +data.state;
        });
        // Scale functions
        var xLinearScale = d3.scaleLinear()
            .domain([0, d3.max(stateData, d => d.poverty)])
            .range([0, width]);
        
        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(stateData, d => d.healthcare)])
            .range([height, 0]);

        var zLinearScale = d3.scaleLinear()
            .domain([1, d3.max(stateData, d => d.state)])

        // Axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Append axis to chart
        chartGroup.append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(bottomAxis);

        chartGroup.append("g")
          .call(leftAxis);
        
        var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("opacity", ".5")

        var toolTip = d3.tip()
          .attr("class", "tooltip")
          .offset([80, -80])
          .html(d => `${d.state} <br> W/o healthcare: ${d.healthcare}%<br> In poverty: ${d.poverty}%`);

        chartGroup.call(toolTip);

        circlesGroup.on("mouseover", function(data) {
          toolTip.show(data, this);
        })

        .on("mouseout", function(data) {
          toolTip.hide(data);
        });
        
        d3.selectAll("text")
          .data(stateData)
          .enter()
          .append("text")
          .text(function(data) {
            return data.abbr;
          })
          .attr("cx", d => (d.poverty))
          .attr("cy", d => (d.healthcare))
          .attr("font-size", "12px")
          .attr("text-anchor", "middle")
          .attr("class", 'stateText');

        chartGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left + 40)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .attr("class", "axisText")
          .text("In Poverty");

        chartGroup.append("text")
          .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
          .attr("class", "axisText")
          .text("Lacks Healthcare");
    });
  }

  makeResponsive();

  d3.select(window).on("resize", makeResponsive);
