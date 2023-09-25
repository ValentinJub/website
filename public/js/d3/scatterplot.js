const newLocal = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json",
URL = newLocal,
margin = 80,
widthSVG = 1000,
heightSVG = 600,
widthChart = widthSVG - (2 * margin),
heightChart = heightSVG - (2 * margin),
dotRadius = 5;

const doping = "#fc8d59",
clean = "#99d594";

var cleanRanking = [],
dirtyRanking = [];

//color const - doping pink - clean green

//this function adds st nd rd th to place ranks
function processPlaces(d, key) {
d.forEach((d,i) => {
    const x = d[key];
    if(x < 4) {
    switch(x) {
        case 1:
        d[key] += "ˢᵗ"
        break;
        case 2:
        d[key] += "ᶮᵈ"
        break;
        case 3:
        d[key] += "ʳᵈ"
        break;
        default:
        break;
    }
    }
    else if(x >= 21 && x < 24) {
    switch(x) {
        case 21:
        d[key] += "ˢᵗ"
        break;
        case 22:
        d[key] += "ᶮᵈ"
        break;
        case 23:
        d[key] += "ʳᵈ"
        break;
        default:
        break;
    }
    }
    else if(x >= 31 && x < 34) {
    switch(x) {
        case 31:
        d[key] += "ˢᵗ"
        break;
        case 32:
        d[key] += "ᶮᵈ"
        break;
        case 33:
        d[key] += "ʳᵈ"
        break;
        default:
        break;
    }
    }
    else {
    if(key in d) {
        d[key] += "ᵗʰ"
    }
    }
})
}

function createNewRanking(d) {
let clean = 1,
dirty = 1;
d.forEach((d,i) => {
    if(d.Doping === "") {
    d.cleanPlace = clean;
    clean++;
    }
    else {
    d.dirtyPlace = dirty;
    dirty++;
    }
})
processPlaces(d,"cleanPlace");
processPlaces(d,"dirtyPlace");
}

//function that creates a shame and honour rankings and adds it to json object

document.addEventListener("DOMContentLoaded",function() {

fetch(URL)
    .then(response => response.json())
    .then(d => {
    const time = d.map(e => {
        const parsedTime = e.Time.split(':');
        //retrieve minutes and seconds
        return new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1])
        //create a new date object - have to precise year months day hours 
        //and add only min and sec from parsed time only min and
        //sec will be kept at the end but scaleTime needs date objects
    });
    //format and retrieve time data 
    const years = d.map(e => e.Year);
    //retrieve years for convenience

    processPlaces(d,"Place");
    //add st nd rd th to place to make a nicer description in the tooltip
    createNewRanking(d);
    
    console.log(d);

    const yScale = d3.scaleTime()
        .domain(d3.extent(time))
        .range([0,heightChart])
        //range is not reversed as we want the lowest value at the top
        //subtract in the y? tbc.... 

        //depreceated but informative:
        //reverse the range so that the axis value are in right position
        //remember to subtract height of chart to height of bar IN THE HEIGHT
    
    const formatxAxis = d3.format('.0f');
    //this allows to remove decimal point on x Axis
    //as d3 converts 1996 into 199.6
    const formatyAxis = d3.timeFormat('%M:%S');
    //this allows to only keep minutes and seconds from date object 

    const xScale = d3.scaleLinear()
        .domain([d3.min(years) - 1, d3.max(years) + 1])
        .range([0,widthChart])
    
    //using scaleLinear as data is plain years: 1999, 1998 etc...

    var title = d3 
        .select('#container')
        .append('h1')
        .attr('id','title')
        .html("🚲 Tour de France: Best Climb Time in Alpes d'Huez 🚲")

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
            .style("opacity", .8)
            .attr('data-year', d.Year)
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
        const truePlace = d.Doping === "" ?
            "He's not a cheater and his time ranks him " + d.cleanPlace + " on the true hero's leaderboard"
            : "He's a cheater and his time ranks him " + d.dirtyPlace + " on the cheater's leaderboard"
        Tooltip
            .style("left", function(d) {
            return d3.event.pageX + (d3.event.pageX > 642 ? -70 : 70) + "px"
            })
            .style("top", 530 + "px")
            .html(d.Nationality + ' - ' + d.Name + '</br>' +
            d.Year + ' - ' + d.Time + '</br>' +
            'His time puts him in ' + d.Place + ' place globally</br>' +
            truePlace + '</br>' +
            d.Doping);
        }
        ///can improve tooltip tracking///

        var mouseleave = function(d) {
        Tooltip
            .style("opacity", 0)
        d3.select(this)
            .style("opacity", .8)
        }

    
    //SWAP THE X AND Y VALUE AS WE ROTATE -90 DEG

    const leftLegend = svg
        .append('text')
        .attr('id','legend')
        .attr('class','legend')
        .attr('x', -(heightSVG / 2) - (margin / 2))
        //perfect centering
        .attr('y', margin / 2)
        .attr('transform', 'rotate(-90)')
        .text('Time in minutes')

    //SWAP THE X AND Y VALUE AS WE ROTATE -90 DEG
    
    // const bottomLegend = svg
    //   .append('text')
    //   .attr('class','legend')
    //   .attr('transform',`translate(${widthChart / 2 + margin},${heightSVG - (margin / 2.6)})`)
    //   .html('Learn more here: <a href="http://www.bea.gov/national/pdf/nipaguid.pdf" target="_blank">bea.gov/national/pdf/nipaguid.pdf</a>')

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
        .call(d3.axisLeft(yScale).tickFormat(formatyAxis)) 
        // .tickSize(-widthChart)
        //this draws horizontal lines 
        // .ticks(10))
        //create the Y axis
        
    const xAxis = chart
        .append('g')
        .attr('id','x-axis')
        .attr('transform',`translate(0,${heightChart})`)
        .call(d3.axisBottom(xScale).tickFormat(formatxAxis))
        // .ticks(15))
        //create the x axis
    
    svg 
        .append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('x', widthSVG - (margin * 1.5))
        .attr('y', (heightSVG / 2) - margin)
        .style('fill', doping)

    svg
        .append('text')
        .attr('class','leg')
        .attr('x', widthSVG - (margin * 1.5) + 20)
        .attr('y', (heightSVG / 2) + 15 - margin)
        .text('Doping 💉')
    
        svg
        .append('text')
        .attr('class','leg')
        .attr('x', widthSVG - (margin * 1.5) + 20)
        .attr('y', (heightSVG / 2) + 45 - margin)
        // .style('font-size')
        .text('Clean 💪')
    
    svg 
        .append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('x', widthSVG - (margin * 1.5))
        .attr('y', (heightSVG / 2) + 30 - margin)
        .style('fill', clean)
        
    chart
        .selectAll('circle')
        .data(d)
        .enter()
        .append('circle')
        .attr('class','dot')
        .attr('data-xvalue',(d,i) => years[i])
        .attr('data-yvalue', function (d,i) {
            return time[i].toISOString()
        })
        .attr('cx',(d,i) => xScale(years[i]))
        //I add +1 so that the bars line up PERFECTLY with the xAxis
        //I only do this to pass the test on CodePen, visually they are aligned without it. 
        .attr('cy',(d,i) => yScale(time[i]))
        .attr('r', 5)
        .style('fill',(d,i) => d.Doping === "" ? clean : doping)


    //   //event functions below
        
        .on('mouseover',mouseover)
        .on('mousemove', mousemove)
        .on('mouseleave', mouseleave)

    //allows highlighting hovered bar
    })
});