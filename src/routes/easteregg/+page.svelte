<script lang="ts">
  import * as d3 from 'd3';
  import { onMount } from 'svelte';

  let container: HTMLDivElement;
  let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;

  // TODO: dobrze by bylo gdybysmy dokonali jakiejs normalizacji - np, zamiast rysowac ludzika w relatywnie, 
  // z absolutnymi wartosciami dlugosci linii itd, fajnie by bylo stworzyc ludzika za 
  // pomoca abstrakcyjnych dlugosci, ktore potem mapowalibysmy na dostepna przestrzen
  function drawPart(step: number) {
    // fajnie ze korzystasz ze switch 
    // case ale tutaj to az sie prosi o poprostu liste
    switch(step) {
      case 0:
        svg.append("line")
          .attr("x1", 0).attr("y1", 280)
          .attr("x2", 150).attr("y2", 280)
          .attr("stroke", "black");
        break;

      case 1:
        svg.append("line")
          .attr("x1", 50).attr("y1", 280)
          .attr("x2", 50).attr("y2", 50)
          .attr("stroke", "black");
        break;

      case 2:
        svg.append("line")
          .attr("x1", 50).attr("y1", 50)
          .attr("x2", 150).attr("y2", 50)
          .attr("stroke", "black");
        break;

      case 3:
        svg.append("line")
          .attr("x1", 150).attr("y1", 50)
          .attr("x2", 150).attr("y2", 80)
          .attr("stroke", "black");
        break;

      case 4:
        svg.append("circle")
          .attr("cx", 150)
          .attr("cy", 100)
          .attr("r", 20)
          .attr("stroke", "black")
          .attr("fill", "none");
        break;

      case 5:
        svg.append("line")
          .attr("x1", 150).attr("y1", 120)
          .attr("x2", 150).attr("y2", 180)
          .attr("stroke", "black");
        break;

      case 6:
        svg.append("line")
          .attr("x1", 150).attr("y1", 140)
          .attr("x2", 120).attr("y2", 160)
          .attr("stroke", "black");
        break;

      case 7:
        svg.append("line")
          .attr("x1", 150).attr("y1", 140)
          .attr("x2", 180).attr("y2", 160)
          .attr("stroke", "black");
        break;

      case 8:
        svg.append("line")
          .attr("x1", 150).attr("y1", 180)
          .attr("x2", 120).attr("y2", 220)
          .attr("stroke", "black");
        break;

      case 9:
        svg.append("line")
          .attr("x1", 150).attr("y1", 180)
          .attr("x2", 180).attr("y2", 220)
          .attr("stroke", "black");
        break;
    }
  }

  onMount(() => {
    svg = d3.select(container)
      .append("svg")
      .attr("width", 300)
      .attr("height", 300);

    let step = 0;

    const interval = setInterval(() => {
      drawPart(step);
      step++;

      if (step > 9) {
        clearInterval(interval);
      }
    }, 600); 
  });
</script>

<div class="flex items-center justify-center h-[60dvh] w-full">
  <div bind:this={container}></div>
</div>

