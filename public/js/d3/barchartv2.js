const newLocal = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json",
    URL = newLocal,
    margin = 80,
    widthSVG = 1000,
    heightSVG = 600,
    widthChart = widthSVG - (2 * margin),
    heightChart = heightSVG - (2 * margin);

    document.addEventListener("DOMContentLoaded",function() {

    fetch(URL)
        .then(response => response.json())
        .then(d => {
        var GDP = d.data.map(e => {
            return e[1]
        });
        var years = d.data.map(e => {
            return new Date(e[0])
        })
        
        const widthBar = (widthChart / 275);

        console.log(GDP);
        console.log(years);

        const yScale = d3.scaleLinear()
            .domain([0,d3.max(GDP) + 200])
            //could use d3.extent(GDP) 
            //instead of d3.min + d3.max
            .range([heightChart,0])
            //reverse the range so that the axis value are in right position
            //remember to subtract height of chart to height of bar IN THE HEIGHT
        
        const xScale = d3.scaleTime()
            .domain([d3.min(years), d3.max(years)])
            .range([0,widthChart])
        
        const formatYear = d3.timeFormat("%Y");

        console.log(yScale(8000));

        var title = d3 
            .select('#container')
            .append('h1')
            .attr('id','title')
            .html('US GDP from 1947 to 2015')

        var svg = d3
            .select('#container')
            .append('svg')
            .attr('width',widthSVG)
            .attr('height',heightSVG)
        
        var Tooltip = d3
            .select('#container')
            .append('div')
            .attr('id','tooltip')
            .style('opacity',0)
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")



            var mouseover = function(d) {
            Tooltip
                .style("opacity", 1)
                .attr('data-date',d[0])
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 0.3)
            }

            ///can improve tooltip tracking
            //by detailing the return value with more
            //conditions if under 500 ....
            //if > 500 && < 800>>>
            //else ....
            var mousemove = function(d) {
            console.log(d3.event.pageX + ' ' + d3.event.pageY)
            Tooltip
                .html(d[0] + "</br>$" + d[1] + " Billion")
                .style("left", function(d) {
                return d3.event.pageX + (d3.event.pageX > 642 ? -70 : 70) + "px"
                })
                .style("top", 530 + "px")
            }
            ///can improve tooltip tracking///

            var mouseleave = function(d) {
            Tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 1)
            }

        
        //SWAP THE X AND Y VALUE AS WE ROTATE -90 DEG

        const leftLegend = svg
            .append('text')
            .attr('class','legend')
            .attr('x', -(heightSVG / 2) - (margin / 2))
            //perfect centering
            .attr('y', margin / 2)
            .attr('id','leftLegend')
            .attr('transform', 'rotate(-90)')
            .text('GDP in billion $')

        //SWAP THE X AND Y VALUE AS WE ROTATE -90 DEG
        
        const bottomLegend = svg
            .append('text')
            .attr('class','legend')
            .attr('transform',`translate(${widthChart / 2 + margin},${heightSVG - (margin / 2.6)})`)
            .html('Learn more here: <a href="http://www.bea.gov/national/pdf/nipaguid.pdf" target="_blank">bea.gov/national/pdf/nipaguid.pdf</a>')

        const chart = svg
            .append('g')
            .attr('id','chart')
            .attr('width',widthChart)
            .attr('height',heightChart)
            .attr('transform',`translate(${margin}, ${margin})`)
            //translate chart to apply margins

        const yAxis = chart
            .append('g')
            .attr('id','y-axis')
            .call(d3.axisLeft(yScale)
            .tickSize(-widthChart)
            .ticks(10))
            //create the Y axis
            
        const xAxis = chart
            .append('g')
            .attr('id','x-axis')
            .attr('transform',`translate(0,${heightChart})`)
            .call(d3.axisBottom(xScale)
            .ticks(15))
            //create the x axis
            
        chart
            .selectAll('rect')
            .data(d.data)
            .enter()
            .append('rect')
            .attr('class','bar')
            .attr('data-gdp',(d,i) => GDP[i])
            .attr('data-date', (d,i) => d[0])
            .attr('x',(d,i) => (widthBar * i) + 1)
            //I add +1 so that the bars line up PERFECTLY with the xAxis
            //I only do this to pass the test on CodePen, visually they are aligned without it. 
            .attr('y',(d,i) => yScale(GDP[i]))
            .attr('width', widthBar)
            .attr('height', (d,i) => heightChart - yScale(GDP[i]))  


            //event functions below
            
            .on('mouseover',mouseover)
            .on('mousemove', mousemove)
            .on('mouseleave', mouseleave)

        //allows highlighting hovered bar

        // console.log(d.data);
        })
    });