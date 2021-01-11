// Append to make id strings
d3.json('samples.json').then((data)=>{
  var string = data.names;
  console.log(data.metadata);
  var fixed = d3.selectAll('#selDataset');
  Object.entries(string).forEach(([i,j])=>{
      fixed.append('option').text(j);
  })
})

// Create a function that reads the plots
function graph(sampleData) {
  d3.json('samples.json').then((data)=> {
    // Create the sample data for reference
    var samples = data.samples;
    var numbers = samples.map(row=>row.id).indexOf(sampleData);

    // Make the bar chart
    var topTen = samples.map(row=>row.sample_values);
    var topTen = topTen[numbers].slice(0,10).reverse();

    var topTenId = samples.map(row=>row.otu_ids);
    var topTenId = topTenId[numbers].slice(0,10);

    var labels = samples.map(row=>row.otu_labels);
    var labels = labels[numbers].slice(0,10);

    var trace1 = {
      x: topTen,
      y: topTenId.map(x=>`UTO ${x}`),
      text: labels,
      type:'bar',
      orientation:'h'
    };
    var data1 = [trace1]
    var layout = {
      colorway : ['#182844']
    };


  Plotly.newPlot('bar', data1, layout);

  // Use same data to make bubble

    var samplesV = samples.map(row=>row.sample_values);
    var samplesV = samplesV[numbers];

    var iD = samples.map(row=>row.otu_ids);
    var iD = iD[numbers];

    var labelsV = samples.map(row=>row.otu_labels);
    var labelsV = labelsV[numbers];

    var min = d3.min(iD);
    var max = d3.max(iD);

    var linearScale = d3.scaleLinear()
      .domain([min, max])
      .range([0,1]);
    var colors = iD.map(y => d3.interpolateRgbBasis(["purple", "blue", "green", "brown"])(linearScale(y)));
    var trace2 = {
      x: iD,
      y: samplesV,
      text: labelsV,
      mode: 'markers',
      marker: {
        color: colors,
        // This creates the bubble sizes
        size: samplesV.map(x=>x*8),
        sizemode: 'area'
      }
    };
    var data2 = [trace2];
    var bubbleLayout={
      xaxis:{
        autochange: true,
        height: 750,
        width: 750,
        title: {
          text: 'OTU ID'
        }
      },
    };
    Plotly.newPlot('bubble', data2, bubbleLayout);

  });
};

function optionChanged(newId){
  graph(newId);
}
