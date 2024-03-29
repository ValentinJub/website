const URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
//Execute code once page is loaded
document.addEventListener('DOMContentLoaded', function() {
    const req = new XMLHttpRequest();
    req.open("GET",URL,true);
    req.send();
    req.onload = function(){
        //dataset
        const json = JSON.parse(req.responseText);
        //const
        const rW = 5, h = 600, size = json.data.length,
        initialPadding = 60,
        w = 980;
        
        //Scale to vertically fit data
        const yScaleAxis = d3.scaleLinear()
        .domain([0,d3.max(json.data, (d) => d[1])])
        .range([h - initialPadding, 0]);
        
        const yScale = d3.scaleLinear()
        .domain([0,d3.max(json.data, (d) => d[1])])
        .range([0,h - initialPadding])
        
        var xScaleAxis = d3.scaleTime()
        .domain(d3.extent(json.data, function(d) { 
        return new Date(d[0]); 
        }))
        .range([initialPadding, w]);
        
        var xScale = d3.scaleTime()
        .domain(d3.extent(json.data, function(d) { 
        return new Date(d[0]); 
        }))
        .range([w,initialPadding]);
        
        //create tooltip
        var tooltip = d3.select("body")
        .append('div')
        .attr("id","tooltip")
        .style('opacity', 0);
        
        //create an svg
        const svg = d3.select("body")
        .append("svg")
        .attr("width",w)
        .attr("height",h);
        //create rect according to dataSet
        svg.selectAll("rect")
        .data(json.data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("data-date",(d) => d[0])
        .attr("data-gdp",(d) => d[1])
        .attr("x", (d, i) => (w - xScale(new Date(d[0])) + initialPadding))
        .attr("y", (d, i) => (h - yScale(d[1])) - initialPadding)
        .attr("width", (d,i) => rW)
        .attr("height", (d, i) => yScale(d[1]))
        .attr("index",(d,i) => i)
        
        .on('mouseover', function (event, d) {
        // d or datum is the height of the
        // current rect
        var i = this.getAttribute('index');

        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip
            .html(
            json.data[i][1] +
                '<br>' +
                '$' +
                ' Billion'
            )
            .attr('data-date', json.data[i][0])
            // .style('left', i * rW + 30 + 'px')
            // .style('top', h - 100 + 'px')
            // .style('transform', 'translateX(60px)');
        })
        .on('mouseout', function () {
        tooltip.transition().duration(200).style('opacity', 0);
        })
        .on('mousemove', (d) => {
        tooltip
            .style("left", function(d) {
                return d3.event.pageX + (d3.event.pageX > 642 ? -70 : 70) + "px"
            })
            .style("top", 530 + "px")
        })
        
    
        
        const yAxis = d3.axisLeft().scale(yScaleAxis).ticks(20);
        
        svg.append("g")
        .attr("id","y-axis")
        .attr("transform", "translate(" + initialPadding + ",0)")
        .call(yAxis);

        const xAxis = d3.axisBottom().scale(xScaleAxis).ticks(25);
        
        svg.append("g")
        .attr("id","x-axis")
        .attr("transform", "translate(0, " + (h - initialPadding) + ")")
        .call(xAxis)
        
        svg.append("text")
        .attr("id","title")
        .attr("x", (w / 2))
        .attr("y", 0 + (initialPadding))
        .attr("text-anchor", "middle")
        .style("font-size", "30px") 
        .style("text-decoration", "underline")
        .text(json.source_name);
    };
});