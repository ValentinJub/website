const margin = {
    top:40,
    bottom:40,
    left:40,
    right:40
    };

    const widthSVG = 1240,
    heightSVG = 980,
    widthMap = widthSVG - (margin.left - margin.right),
    heightMap = heightSVG - (margin.top - margin.bottom),
    widthLegend = 500,
    heightLegend = 300;

    const colorPalette = [
    "#fc1703",
    "#9998DD",
    "#90CC66",
    "#EDCAC9",
    "#C7AF57",
    "#D49CDE",
    "#C14844",
    "#39AC43",
    "#E0EEF5",
    "#C2CDEB",
    "#D08971",
    "#BB3EAF",
    "#20603D",
    "#674B22",
    "#3F501B",
    "#327B95",
    "#58491D",
    "#2D2B82",
    "#522B82"
    ]
    const colorScale = d3.scaleOrdinal().range(colorPalette);


    //create an SVG in which the drawing will take place
    var svg = d3
    .select('#container')
    .append('svg')
    .attr('width',widthSVG)
    .attr('height',heightSVG);

    var svgLegend = d3
    .select('#container')
    .attr("class","temp")
    .append('svg')
    .attr('width',widthLegend)
    .attr('height',heightLegend)
    .attr("id","legend")

    var map = svg
    .append('g')
    .attr('id','map')
    .attr('width',widthMap)
    .attr('height',heightMap)
    .attr('transform',`translate(${margin.left}, ${margin.top})`);
    //translate chart to apply margins

    //create a tooltip to interctively display data
    var tooltip = d3
    .select('#container')
    .append('div')
    .attr('id','tooltip')
    .style('opacity',0)
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

    // create an object for the values of the legend
    // defining the percentages and the matching color for the fill of the rectangle elements
    const legendValues = {
    percentage: [0, 12, 21, 30, 39, 48, 57, 66],
    color: [...colorPalette],
    height: 15,
    width: 30
    }

    // // create and append a legend at the top of the SVG
    // const legend = svg
    //   .append("g")
    //   .attr("id", "legend")
    //   // translate the legend as to have the last rectangle on the very edge of the container
    //   .attr("transform", `translate(${widthSVG - legendValues.percentage.length * legendValues.width}, 0)`);

    // // in the group referencing the legend, append one rectangle each for the defined values
    // legend
    //   .selectAll("rect")
    //   .data(legendValues.percentage)
    //   .enter()
    //   .append("rect")
    //   .attr("width", legendValues.width)
    //   .attr("height", legendValues.height)
    //   // include the rectangle elements on the basis of their width, one after the other
    //   .attr("x", (d, i) => i*legendValues.width)
    //   // include the rectangle elements at the top of the canvas
    //   .attr("y", 0)
    //   .attr("fill", (d, i) => legendValues.color[i]);

    // // beside the rectangles, include text elements as labels for the rectangle elements themselves
    // legend
    //   .selectAll("text")
    //   .data(legendValues.percentage)
    //   .enter()
    //   .append("text")
    //   .attr("x", (d,i) => i*legendValues.width)
    //   // position the labels below the rectangle elements
    //   .attr("y", legendValues.height*2)
    //   .style("font-size", "0.6rem")
    //   .text((d) => `${d}%`);

    //Three sets of urls:
    // Kickstarter Pledges: https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json
    // Movie Sales: https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json
    // Video Game Sales: https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json

    const videogamesalesData = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

    //start by fetching the data
    fetch(videogamesalesData)
    .then((response) => response.json())
    .then((json) => drawTreeMap(json));

    //draw the map once the data has been loaded and the necessary components
    //such as SVG legend tooltip scale etc have been created
    function drawTreeMap(data) {
    console.log(data);
    
    const treemap = d3.treemap().size([widthMap - (margin.left + margin.right), heightMap - (margin.top + margin.bottom)]);
    const root = d3.hierarchy(data, (d) => d.children)
        .sum((d) => d.value);
    const tree = treemap(root);

    console.log(tree.leaves());

    var cell = map
        .selectAll('g')
        .data(tree.leaves())
        .enter()
        .append('g')
        .attr('class', 'group')
        .attr('transform', (d) => 'translate(' + d.x0 + ',' + d.y0 + ')');

    cell
        .append("rect")
        .attr('class', 'tile')
        .attr("width", (d) => Math.max(0, d.x1 - d.x0 - 1))
        .attr("height", (d) => Math.max(0, d.y1 - d.y0  - 1))
        .attr("data-name", (d) => d.data.name)
        .attr("data-value", (d) => d.data.value)
        .attr("data-category", (d) => d.data.category)
        .attr("fill", (d) => colorScale(d.parent.data.name))
        .on("mouseenter", function(d,i) {
        tooltip
            .attr("data-value", d.data.value)
            .style("opacity", 1)
            .style("left", event.pageX + "px")
            .style("top", event.pageY + "px")
            .html(`${d.data.name}</br>${d.data.category}</br>${d.data.value}`)
        })
        .on("mouseleave", function(d,i) {
        tooltip
            .style("opacity", 0)
        })
    
    cell
    .append('text')
    .attr('class', 'tile-text')
    .selectAll('tspan')
    .data(function (d) {
        return d.data.name.split(/(?=[A-Z][^A-Z])/g);
    })
    .enter()
    .append('tspan')
    .attr('x', 5)
    .attr('y', function (d, i) {
        return 13 + i * 10;
    })
    .text(function (d) {
        return d;
    });

    var categories = data.children.map((d) => d.name);
    const marginLeg = 15,
    paddingText = 5,
    numOfCategories = 18,
    horizontalSpace = widthLegend - (marginLeg * 2),
    verticalSpace = heightLegend - (marginLeg * 2),
    rectWidth = 15,
    rectHeight = 15,
    sizeText = 25,
    positionX = [marginLeg, (horizontalSpace / 2) - sizeText / 2, horizontalSpace - marginLeg - sizeText];

    svgLegend
        .selectAll("rect")
        .data(categories)
        .enter()
        .append("rect")
        .attr('class', 'legend-item')
        .attr("width", rectWidth)
        .attr("height", rectHeight)
        .attr("fill", (d) => colorScale(d))
        .attr("x", (d,i) => {
        switch(i) {
            case 0:
            case 3:
            case 6:
            case 9:
            case 12:
            case 15:
            return positionX[0];
            case 1:
            case 4:
            case 7:
            case 10:
            case 13:
            case 16:
            return positionX[1];
            case 2:
            case 5:
            case 8:
            case 11:
            case 14:
            case 17:
            return positionX[2];
        }
        })
        .attr("y", (d,i) => {
        switch(i) {
            case 0:
            case 1:
            case 2:
            return verticalSpace / 9 * 1;
            case 3:
            case 4:
            case 5:
            return (verticalSpace / 9)  * 2  + marginLeg;
            case 6:
            case 7:
            case 8:
            return verticalSpace / 9 * 3   + marginLeg * 2;
            case 9:
            case 10:
            case 11:
            return verticalSpace / 9 * 4  + marginLeg  * 3;
            case 12:
            case 13:
            case 14:
            return verticalSpace / 9 * 5  + marginLeg * 4;
            case 15:
            case 16:
            case 17:
            return verticalSpace / 9 * 6  + marginLeg * 5;
        }
        })
    
    svgLegend
        .selectAll("text")
        .data(categories)
        .enter().append("text")
        .text((d) => d)
        .style("font-size", "1.2rem")
        .style("font-weight", "bold")
        .attr("x", (d,i) => {
        switch(i) {
            case 0:
            case 3:
            case 6:
            case 9:
            case 12:
            case 15:
            return positionX[0] + paddingText + rectWidth;
            case 1:
            case 4:
            case 7:
            case 10:
            case 13:
            case 16:
            return positionX[1] + paddingText + rectWidth;
            case 2:
            case 5:
            case 8:
            case 11:
            case 14:
            case 17:
            return positionX[2] + paddingText + rectWidth;
        }
        })
        .attr("y", (d,i) => {
        switch(i) {
            case 0:
            case 1:
            case 2:
            return ((verticalSpace / 9) * 1) + (paddingText * 2.2);
            case 3:
            case 4:
            case 5:
            return ((verticalSpace / 9)  * 2)  + (marginLeg) + (paddingText * 2.2);
            case 6:
            case 7:
            case 8:
            return ((verticalSpace / 9) * 3)  + (marginLeg * 2) + (paddingText * 2.2);
            case 9:
            case 10:
            case 11:
            return ((verticalSpace / 9) * 4)  + (marginLeg  * 3) + (paddingText * 2.2);
            case 12:
            case 13:
            case 14:
            return ((verticalSpace / 9) * 5)  + (marginLeg * 4) + (paddingText * 2.2);
            case 15:
            case 16:
            case 17:
            return ((verticalSpace / 9) * 6)  + (marginLeg * 5) + (paddingText * 2.2);
        }
        })
    }