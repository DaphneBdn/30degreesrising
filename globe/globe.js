// Create the scale
var anomaly = [];
let weightColor;

d3.csv("https://raw.githubusercontent.com/thirtydegreesrising/30degreesrising/main/temp_anomaly_data_header/anomaly_2019.csv", function (text) { 
    anomaly.push(text.tas)
}).then(function (data) {
    anomaly = anomaly.map(Number); // Need to convert array entries from strings to floats or extent won't be correct
    var extent = d3.extent(anomaly);
    console.log(extent)
    weightColor = d3.scaleDiverging(t => d3.interpolateRdBu(1 - t))
    .domain([extent[0], 0, extent[1]]);
    console.log(weightColor(extent[0]));
    console.log(weightColor(extent[1]));
    console.log(weightColor(0));
});


// Create the globe
fetch('https://raw.githubusercontent.com/thirtydegreesrising/30degreesrising/main/temp_anomaly_data_header/anomaly_2019.csv') // Fetch the csv data
.then(res => res.text()) // Transform into text
.then(csv => d3.csvParse(csv, ({ latitude, longitude, tas }) => ({ lat: +latitude, lng: +longitude, tas: +tas }))) // Parse the file
.then(data => // Create the globe and map locations using parsed data
{
    const world = Globe()
    (document.getElementById('globeViz'))
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
    .hexBinPointsData(data)
    .hexAltitude(0.01)
    .hexBinResolution(3.0)
    .hexMargin(0.2)
    .hexTopColor(data => weightColor(data.points[0].tas))
    .hexSideColor(data => weightColor(data.points[0].tas))
    .hexBinMerge(true)
    .enablePointerInteraction(false); // Apparently, this improves performance 

    world.controls().autoRotate = true;
    world.controls().autoRotateSpeed = 1.0;
})