/**
 * Stacked Bar Chart - View 1
 * CGPA Distribution by Placement Status
 */

function createStackedBarChart() {
    const container = d3.select("#stacked-bar-chart");
    const width = 800;
    const height = 350;

    // Create SVG
    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "svg-stacked-bar");

    // Create groups for chart elements
    svg.append("g").attr("class", "bars-group");
    svg.append("g").attr("class", "x-axis");
    svg.append("g").attr("class", "y-axis");

    // Add axis labels
    svg.append("text")
        .attr("class", "axis-label x-label")
        .attr("x", width / 2)
        .attr("y", height - 5)
        .attr("text-anchor", "middle")
        .text("CGPA");

    svg.append("text")
        .attr("class", "axis-label y-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .text("Count");

    // Add legend
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - 120}, ${margin.top})`);

    const legendData = [
        { label: "Placed", color: "#27ae60" },
        { label: "Not Placed", color: "#e74c3c" }
    ];

    legendData.forEach((d, i) => {
        const g = legend.append("g").attr("transform", `translate(0, ${i * 22})`);
        g.append("rect").attr("width", 16).attr("height", 16).attr("fill", d.color).attr("rx", 3);
        g.append("text").attr("x", 22).attr("y", 13).text(d.label).style("font-size", "12px");
    });

    // Initial render
    updateStackedBarChart();
}

function updateStackedBarChart() {
    const svg = d3.select("#svg-stacked-bar");
    const width = 800;
    const height = 350;

    // View 1 ONLY filtering (do not use filteredData)
    const view1Data = data.filter(d =>
        d.cgpa >= view1CgpaRange[0] && d.cgpa <= view1CgpaRange[1]
    );

    // Create CGPA bins (0.5 intervals from 4 to 11)
    const binEdges = d3.range(4, 11.5, 0.5);

    // Bin the data (using view1Data only)
    const binnedData = binEdges.slice(0, -1).map((edge, i) => {
        const binMin = edge;
        const binMax = binEdges[i + 1];
        const binData = view1Data.filter(d => d.cgpa >= binMin && d.cgpa < binMax);

        return {
            bin: binMin,
            binLabel: `${binMin.toFixed(1)}`,
            placed: binData.filter(d => d.placement === "Yes").length,
            notPlaced: binData.filter(d => d.placement === "No").length,
            total: binData.length
        };
    });

    // Scales
    const xScale = d3.scaleBand()
        .domain(binnedData.map(d => d.binLabel))
        .range([margin.left, width - margin.right])
        .padding(0.15);

    const maxCount = d3.max(binnedData, d => d.total) || 1;
    const yScale = d3.scaleLinear()
        .domain([0, maxCount])
        .nice()
        .range([height - margin.bottom, margin.top]);

    // Update axes
    svg.select(".x-axis")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .transition().duration(500)
        .call(d3.axisBottom(xScale).tickSizeOuter(0));

    svg.select(".y-axis")
        .attr("transform", `translate(${margin.left}, 0)`)
        .transition().duration(500)
        .call(d3.axisLeft(yScale).ticks(6));

    // Prepare stacked data
    const stackData = binnedData.map(d => ({
        bin: d.binLabel,
        placed: d.placed,
        notPlaced: d.notPlaced
    }));

    // Bars group
    const barsGroup = svg.select(".bars-group");

    // Bind data for each bin
    const barGroups = barsGroup.selectAll(".bar-group")
        .data(stackData, d => d.bin);

    // Enter
    const barGroupsEnter = barGroups.enter()
        .append("g")
        .attr("class", "bar-group");

    // Not Placed bars (bottom)
    barGroupsEnter.append("rect")
        .attr("class", "bar not-placed")
        .attr("fill", "#e74c3c");

    // Placed bars (top)
    barGroupsEnter.append("rect")
        .attr("class", "bar placed")
        .attr("fill", "#27ae60");

    // Merge and update
    const allBarGroups = barGroupsEnter.merge(barGroups);

    // Update Not Placed bars
    allBarGroups.select(".not-placed")
        .on("mouseover", function (event, d) {
            showTooltip(event, `CGPA: ${d.bin}<br>Not Placed: ${d.notPlaced}`);
        })
        .on("mouseout", hideTooltip)
        .transition().duration(500)
        .attr("x", d => xScale(d.bin))
        .attr("y", d => yScale(d.notPlaced))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - margin.bottom - yScale(d.notPlaced));

    // Update Placed bars (stacked on top)
    allBarGroups.select(".placed")
        .on("mouseover", function (event, d) {
            showTooltip(event, `CGPA: ${d.bin}<br>Placed: ${d.placed}`);
        })
        .on("mouseout", hideTooltip)
        .transition().duration(500)
        .attr("x", d => xScale(d.bin))
        .attr("y", d => yScale(d.notPlaced + d.placed))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - margin.bottom - yScale(d.placed));

    // Exit
    barGroups.exit().remove();
}