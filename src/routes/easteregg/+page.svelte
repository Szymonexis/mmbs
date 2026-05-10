<script lang="ts">
  import * as d3 from 'd3';
  import { onMount } from 'svelte';

  let container: HTMLDivElement;

  let x = 0;
  let y = 0;
  let scaleX = 1;
  let scaleY = 1;

  function drawHangman(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) {
    svg.selectAll("*").remove();

    const centerX = 150 + x;
    const centerY = 150 + y;

    const g = svg.append("g")
      .attr("transform", `translate(${centerX}, ${centerY}) scale(${scaleX}, ${scaleY})`);

    g.append("line")
      .attr("x1", -100).attr("y1", 110)
      .attr("x2", 100).attr("y2", 110)
      .attr("stroke", "black").attr("stroke-width", 3);

    g.append("line")
      .attr("x1", -70).attr("y1", 110)
      .attr("x2", -70).attr("y2", -120)
      .attr("stroke", "black").attr("stroke-width", 3);

    g.append("line")
      .attr("x1", -71.5).attr("y1", -120)
      .attr("x2", 31.5).attr("y2", -120)
      .attr("stroke", "black").attr("stroke-width", 3);

    g.append("line")
      .attr("x1", 30).attr("y1", -120)
      .attr("x2", 30).attr("y2", -70)
      .attr("stroke", "black").attr("stroke-width", 3);

    g.append("circle")
      .attr("cx", 30).attr("cy", -45)
      .attr("r", 25)
      .attr("stroke", "black").attr("stroke-width", 3).attr("fill", "none");

    g.append("line")
      .attr("x1", 30).attr("y1", -20)
      .attr("x2", 30).attr("y2", 40)
      .attr("stroke", "black").attr("stroke-width", 3);

    g.append("line")
      .attr("x1", 30).attr("y1", -5)
      .attr("x2", -10).attr("y2", 25)
      .attr("stroke", "black").attr("stroke-width", 3);

    g.append("line")
      .attr("x1", 30).attr("y1", -5)
      .attr("x2", 70).attr("y2", 25)
      .attr("stroke", "black").attr("stroke-width", 3);

    g.append("line")
      .attr("x1", 30).attr("y1", 40)
      .attr("x2", 5).attr("y2", 75)
      .attr("stroke", "black").attr("stroke-width", 3);

    g.append("line")
      .attr("x1", 30).attr("y1", 40)
      .attr("x2", 55).attr("y2", 75)
      .attr("stroke", "black").attr("stroke-width", 3);
  }

  onMount(() => {
    const svg = d3.select(container)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", "0 0 300 300")
      .attr("preserveAspectRatio", "xMidYMid meet");

    drawHangman(svg);
  });

  $: if (x !== undefined || y !== undefined || scaleX !== undefined || scaleY !== undefined) {
    const svgElement = d3.select(container).select<SVGSVGElement>("svg");
    if (!svgElement.empty()) {
      drawHangman(svgElement);
    }
  }
</script>

<div class="ludzik">
  <div bind:this={container}></div>
</div>

<style>
  .ludzik {
    position: relative;
    width: 100%;
    min-height: 70vh;
  }

  .ludzik > div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 700px;
    min-width: 200px;
    aspect-ratio: 1 / 1;
  }
</style>