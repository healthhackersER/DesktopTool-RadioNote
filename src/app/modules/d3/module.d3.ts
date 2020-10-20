import { Component, OnInit, Input, OnChanges} from '@angular/core';
import * as d3 from "d3";

@Component({
  selector: 'ModuleD3',
  templateUrl: './module.d3.html',
  styleUrls: ['./module.d3.scss']
})

export class ModuleD3 implements OnInit {
  data1 = {a: 9, b: 20, c:30, d:8, e:12}
  data2 = {a: 6, b: 16, c:20, d:14, e:19, f:12}
  svg: any;
  radius: Number;
  ngOnInit() {
        // set the dimensions and margins of the graph
    var width = document.getElementById("my_dataviz").offsetWidth;
    var height = 450;
    var margin = 40;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    this.radius = Math.min(width, height) / 2 - margin

    this.svg = d3.select("#my_dataviz")
      .append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
      this.updateChart(this.data1);
  }
  onShowData1(){
    console.log("Show Dataset 1");
    this.updateChart(this.data1);
  }
  onShowData2(){
    console.log("Show Dataset 2");
    this.updateChart(this.data2);
  }

  updateChart(data){
    // set the color scale
    var color = d3.scaleOrdinal()
      .domain(["a", "b", "c", "d", "e", "f"])
      .range(d3.schemeDark2);
    
    // Compute the position of each group on the pie:
    var pie = d3.pie()
      .value(function(d) {return d.value; })
      .sort(function(a, b) { console.log(a) ; return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
    
    var data_ready = pie(d3.entries(data));

    // map to data
    var u = this.svg.selectAll("path").data(data_ready)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    u.enter()
      .append('path')
      .merge(u)
      .transition()
      .duration(1000)
      .attr('d', d3.arc()
        .innerRadius(0)
        .outerRadius(this.radius)
      )
      .attr('fill', function(d){ return(color(d.data.key)) })
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 1)

    // remove the group that is not present anymore
    u.exit().remove()
  }
}
