const newLocal = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json",
    URL = newLocal,
    margin = 80,
    widthSVG = 1400,
    heightSVG = 600,
    widthChart = widthSVG - (2 * margin),
    heightChart = heightSVG - (2 * margin);

    const yScaleDomain = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const years = [];
    const colors = ["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2"];
    const colorsAlt = ["#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd"]; 
    const thresholds = [2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8];

    //colors go from hot to cold (red to blue)

    document.addEventListener("DOMContentLoaded",function() {

    fetch(URL)
        .then(response => response.json())
        .then(d => {
        d.monthlyVariance.forEach((e,i) => {
            const v = e.month - 1;
            e.month = v;
            e.monthString = yScaleDomain[v];
            years.push(e.year);
        })
        /*
        Data processing here
        Array.Prototype.map/forEach/etc...
        */
        
        console.log(d);
        console.log(colors)
        const baseTemperature = d.baseTemperature;
        console.log('Base temp is ' + baseTemperature);

        const yScale = d3.scaleBand()
            .domain(yScaleDomain)
            //could use d3.extent(GDP) 
            //instead of d3.min + d3.max
            .range([0,heightChart])
            //reverse the range so that the axis value are in right position
            //remember to subtract height of chart to height of bar IN THE HEIGHT

            // console.log(yScale("January"))
            // console.log(yScale(yScaleDomain[1 - 1]))
            // console.log(yScale("February"))
            // console.log(yScale("March"))

        console.log(yScale.bandwidth());
            
        const xScale = d3.scaleLinear()
            .domain([d3.min(years), d3.max(years) + 1])
            .range([0,widthChart]); 
        
        const formatxAxis = d3.format('.0f');
        const formatLegendAxis = d3.format('.1f');

        const legendScale = d3.scaleLinear()
            .domain(d3.extent(thresholds))
            .range([(margin * 1.5), widthChart / 3])
        
        const legendScaleColors = d3.scaleLinear()
            .domain(d3.extent(colorsAlt))
            .range([(margin * 1.5), widthChart / 3])
        
        var title = d3 
            .select('#container')
            .append('h1')
            .attr('id','title')
            .html("Earth's Monthly Global Land-Surface Temperature")

        var svg = d3
            .select('#container')
            .append('svg')
            .attr('width',widthSVG)
            .attr('height',heightSVG)
        
        var description = d3
            .select('svg')
            .append('text')
            .attr('id','description')
            .attr('x', (widthSVG / 2) - (margin * 3.2))
            .attr('y', margin / 2)
            .text('1753 - 2015: base temperature 8.66℃')
        
        var Tooltip = d3
            .select('#container')
            .append('div')
            .attr('id','tooltip')
            .style('opacity',0)
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        var mouseover = function(d) {
            Tooltip
            .style("opacity", 1)
            .attr('data-year',d.year)
            .style("left", event.pageX + "px")
            .style("top", event.pageY + "px")
            d3.select(this)
            .style("stroke", "black")
            .style("opacity", 0.3)
        }

        var mousemove = function(d) {
            console.log(d3.eventpageX)
            const temp = (baseTemperature + d.variance).toFixed(1);
            Tooltip
            .html(d.monthString + " - " + d.year + "</br>" +
                temp + "°C" + "</br>" +
                d.variance + "°C")
                .style("left", event.pageX + "px")
                .style("top", event.pageY + "px")
            /* to get position event.pageX/Y */
        }

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
            .text('Months')

        //SWAP THE X AND Y VALUE AS WE ROTATE -90 DEG
        
        const bottomLegend = svg
            .append('text')
            .attr('class','legend')
            .attr('transform',`translate(${widthChart / 2 + margin},${heightSVG - (margin / 2.6)})`)
            .html('Years')

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
            .call(d3.axisLeft(yScale))
            // .ticks(10))
            //create the Y axis
            
        const xAxis = chart
            .append('g')
            .attr('id','x-axis')
            .attr('transform',`translate(0,${heightChart})`)
            .call(d3.axisBottom(xScale).tickFormat(formatxAxis))
            // .ticks(15))
            //create the x axis

        const posXLegendAxis = margin * 1.5;
        const posYLegendAxis = heightChart + margin + (margin / 1.5);

        
        const legendAxis = svg
            .append('g')
            .attr('transform', `translate(${posXLegendAxis}, ${posYLegendAxis})`)
            .call(d3.axisBottom(legendScale).tickFormat(formatLegendAxis).tickValues(thresholds))
        
        const legend = svg
            .attr('id','legend')
            .selectAll('rect')
            .data(colorsAlt.reverse())
            .enter()
            .append('rect')
            .attr('x',(d,i) => (legendScale(thresholds[i])) + margin * 1.5)
            .attr('y',(d) => posYLegendAxis - 25)
            .attr('width', (d,i) => {
                return i === 5 ?
                35.5
                : 32.5
            })
            .attr('height', (d) => 25)
            .attr('fill', (d) => d)
            
        chart
            .selectAll('rect')
            .data(d.monthlyVariance)
            .enter()
            .append('rect')
            .attr('class','cell')
            .attr('data-month',(d) => d.month)
            .attr('data-year', (d) => d.year)
            .attr('data-temp', (d) => (baseTemperature - d.variance).toFixed(1))
            .attr('x',(d) => xScale(d.year))
            .attr('y',(d) => yScale(d.monthString))
            .attr('width', widthChart / (2015-1753))
            .attr('height', (d) => yScale.bandwidth())
            .style('fill',function(d) {
                const temp = (baseTemperature + d.variance).toFixed(1);
                if(temp < thresholds[0]) return colors[10];
                else if(temp >= thresholds[0] && temp < thresholds[1]) return colors[9];
                else if(temp >= thresholds[1] && temp < thresholds[2]) return colors[8];
                else if(temp >= thresholds[2] && temp < thresholds[3]) return colors[7];
                else if(temp >= thresholds[3] && temp < thresholds[4]) return colors[6];
                else if(temp >= thresholds[4] && temp < thresholds[5]) return colors[5];
                else if(temp >= thresholds[5] && temp < thresholds[6]) return colors[4];
                else if(temp >= thresholds[6] && temp < thresholds[7]) return colors[3];
                else if(temp >= thresholds[7] && temp < thresholds[8]) return colors[2];
                else if(temp >= thresholds[8] && temp < thresholds[9]) return colors[1];
                else return colors[0];
            })
            //event functions below
            
            .on('mouseover',mouseover)
            .on('mousemove', mousemove)
            .on('mouseleave', mouseleave)
        })
    });