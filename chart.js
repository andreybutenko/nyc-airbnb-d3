/**
 * Some code from Mapping With D3 by Andy Woodruff for Maptime Boston
 * https://maptimeboston.github.io/d3-maptime/
 */
const HEIGHT = 800;
const WIDTH = 1000;
const MARGIN = 50;

const svg = d3.select('.display')
  .append('svg')
  .attr('width', WIDTH + 2 * MARGIN)
  .attr('height', HEIGHT + 2 * MARGIN);

const map = svg.append('g');
const locations = svg.append('g');

const mercatorProjection = d3.geoMercator();

d3.queue()
  .defer(d3.json, 'nygeo.json')
  .defer(d3.csv, 'data.csv')
  .awaitAll((err, results) => {
    d3.select('#loading').remove();

    const nygeo = results[0];
    const airbnbs = results[1].map(d => ({ ...d, coords: [d.longitude, d.latitude] }));

    const fittedProjection = mercatorProjection
      .fitSize([WIDTH, HEIGHT], nygeo)
    const geoPath = d3.geoPath()
      .projection(fittedProjection);

    map.selectAll('path')
      .data(nygeo.features)
      .enter()
      .append('path')
      .attr('class', 'geography')
      .attr('d', geoPath);
    
    locations.selectAll('circle')
      .data(airbnbs)
      .enter()
      .append('circle')
      .attr('class', 'marker')
      .attr('opacity', 1)
      .attr('r', 3)
      .attr('fill', '#000')
      .attr('cx', d => fittedProjection(d.coords)[0])
      .attr('cy', d => fittedProjection(d.coords)[1])
      .on('mouseover', function() {
        d3.select(this)
          .transition()
          .duration(250)
          .attr('r', 8)
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(250)
          .attr('r', 2)
      })
      .on('click', function() {
        d3.select(this)
          .transition()
          .duration(1000)
          .attr('cx', WIDTH / 2)
          .attr('cy', HEIGHT / 2)
          .attr('r', 1000)
          .attr('opacity', 0)
          .on('end', function() {
            d3.select(this).remove()
          })
      });


  });