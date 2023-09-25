//define the margin(space between map and its container(the svg))
//SVG size and map size(relative to margin and SVG size) 
const margin = {
    top:60,
    bottom:20,
    left:40,
    right:20
    },
    widthSVG = 1000,
    heightSVG = 700,
    widthMap = widthSVG - (margin.left - margin.right),
    heightMap = heightSVG - (margin.top - margin.bottom);

    const colorPalette = d3.quantize(d3.interpolateHcl("#fafa6e", "#2A4858"), 9);

    const colorScale = d3
    .scaleQuantize()
    .range(colorPalette);

    //create an SVG in which the drawing will take place
    var svg = d3
    .select('#container')
    .append('svg')
    .attr('width',widthSVG)
    .attr('height',heightSVG);

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

    // create and append a legend at the top of the SVG
    const legend = svg
    .append("g")
    .attr("id", "legend")
    // translate the legend as to have the last rectangle on the very edge of the container
    .attr("transform", `translate(${widthSVG - legendValues.percentage.length * legendValues.width}, 0)`);

    // in the group referencing the legend, append one rectangle each for the defined values
    legend
    .selectAll("rect")
    .data(legendValues.percentage)
    .enter()
    .append("rect")
    .attr("width", legendValues.width)
    .attr("height", legendValues.height)
    // include the rectangle elements on the basis of their width, one after the other
    .attr("x", (d, i) => i*legendValues.width)
    // include the rectangle elements at the top of the canvas
    .attr("y", 0)
    .attr("fill", (d, i) => legendValues.color[i]);

    // beside the rectangles, include text elements as labels for the rectangle elements themselves
    legend
    .selectAll("text")
    .data(legendValues.percentage)
    .enter()
    .append("text")
    .attr("x", (d,i) => i*legendValues.width)
    // position the labels below the rectangle elements
    .attr("y", legendValues.height*2)
    .style("font-size", "0.6rem")
    .text((d) => `${d}%`);

    //Two sets of urls:
    // - geoData contains the data to draw the map
    // - educationData contains the data to fill the tooltip and an id to 
    //   link that data with geoData

    const geoData = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
    const educationData = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

    //start by fetching the educationData
    fetch(educationData)
    .then((response) => response.json())
    .then((json) => mergeData(json));

    //mergeData will consolidate the education data and the geodata
    //this allows linking geoData with its edcation data
    //and working with just one dataset instead of two 
    function mergeData(data) {

    // console.log("The first data set should contain educational data: ", data);
    fetch(geoData)
    .then((response) => response.json())
    .then((json) => {

        //loop in data set to get fips number
        for(let i = 0; i < data.length; i++) {

        //get fips number
        let fips = data[i].fips;

        //retrieve the geometries array from geoData
        //this works as a pointer to the json array, or at least that is how I understand it
        let geometries = json.objects.counties.geometries;
        //loop in geoData to retrieve id number
        for(let y = 0; i < geometries.length; y++) {

            // consider the id of each array item
            let id = geometries[y].id;
            
            if(id === fips) {
            //this will consolidate education data with geo data
            //as geometries act as a pointer to the geodata object
            //reassinging its value will be reflected on the geoData
            //achieving consolidation of the two dataset according to matching id and fips
            geometries[y] = Object.assign({}, geometries[y], data[i]);
            //no need to loop further when match found
            break;
            }
        }
        }
        return json;
    })
    //after the merge is done we can draw the map
    .then((json) => drawMap(json));
    }

    //draw the map once the data has been merged and the necessary components
    //such as SVG legend tooltip scale etc have been created
    function drawMap(data) {
    console.log(d3.max(data.objects.counties.geometries, (d) => d.bachelorsOrHigher));

    colorScale.domain([0, d3.max(data.objects.counties.geometries, (d) => d.bachelorsOrHigher)])

    // as d3.geoPath() works with GeoJSON, it is first necessary to convert the object into a type of understandable format
    // topojson.feature is a function from the topojson library which converts a topology to a feature collection
    // it accepts two arguments, the object itself and the subset to be "feature-ized"
    let feature = topojson.feature(data, data.objects.counties);

    console.log("This is the topojson data transformed into geojson, it's mainly filled with coordinates ", feature);

    // include the function which creates the SVG values from the coordinates included in the JSON file
    const path = d3
        .geoPath();
    
    map
        .selectAll("path")
        .data(feature.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", (d,i) => colorScale(data.objects.counties.geometries[i].bachelorsOrHigher))
        .attr("class", "county")
        // include the attributes prescribed by the user stories
        .attr("data-fips", (d, i) => data.objects.counties.geometries[i].fips)
        .attr("data-state", (d, i) => data.objects.counties.geometries[i].state)
        .attr("data-area", (d, i) => data.objects.counties.geometries[i].area_name)
        .attr("data-education", (d, i) => data.objects.counties.geometries[i].bachelorsOrHigher)
        .on("mouseenter", function(d,i) {
        tooltip
            .style("opacity", .8)
            .attr("data-fips", data.objects.counties.geometries[i].fips)
            .attr("data-education", data.objects.counties.geometries[i].bachelorsOrHigher)
            .html(`${data.objects.counties.geometries[i].area_name} ${data.objects.counties.geometries[i].state} </br>` + 
            `Bachelors or higher: ${data.objects.counties.geometries[i].bachelorsOrHigher}%`)
            .style("left", event.pageX + "px")
            .style("top", event.pageY + "px")
        d3.select(this)
            .style("stroke", "black")
            .style("stroke-width", 2)
            .style("opacity", 1)
        })
        .on("mouseleave", function(d,i) {
        tooltip
            .style("opacity", 0)
        d3.select(this)
            .style("opacity", 1)
            .style("stroke", "none")
        });
    }