/**
 * Box Plot - View 4
 * Soft Skills Comparison (Placed Students)
 */

function createBoxPlot() {
    const container = d3.select("#box-plot");
    const width = 800;
    const height = 350;

    // Create SVG
    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "svg-boxplot");

    // Create groups
    svg.append("g").attr("class", "boxplot-group");
    svg.append("g").attr("class", "x-axis");
    svg.append("g").attr("class", "y-axis");

    // Axis labels
    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height - 5)
        .attr("text-anchor", "middle")
        .text("Skill Category");

    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .text("Score");

    // Legend
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - 120}, ${margin.top})`);

    const legendData = [
        { label: "Communication Skills", color: "#e67e22" },
        { label: "Extra Curricular", color: "#9b59b6" },
        { label: "Academic Performance", color: "#3498db" }
    ];

    legendData.forEach((d, i) => {
        const g = legend.append("g").attr("transform", `translate(0, ${i * 20})`);
        g.append("rect").attr("width", 14).attr("height", 14).attr("fill", d.color).attr("opacity", 0.7).attr("rx", 2);
        g.append("text").attr("x", 20).attr("y", 11).text(d.label).style("font-size", "11px");
    });

    updateBoxPlot();
}

function updateBoxPlot() {
    const svg = d3.select("#svg-boxplot");
    const width = 800;
    const height = 350;

    // Filter to placed students only
    const placedData = filteredData.filter(d => d.placement === "Yes");

    // Prepare data for three categories
    const categories = [
        { name: "Communication Skills", key: "communication", color: "#e67e22" },
        { name: "Extra Curricular", key: "extra_curricular", color: "#9b59b6" },
        { name: "Academic Performance", key: "academic_perf", color: "#3498db" }
    ];

    // Calculate box plot statistics for each category
    const boxData = categories.map(cat => {
        const values = placedData.map(d => d[cat.key]).sort(d3.ascending);
        const q1 = d3.quantile(values, 0.25) || 0;
        const median = d3.quantile(values, 0.5) || 0;
        const q3 = d3.quantile(values, 0.75) || 0;
        const iqr = q3 - q1;
        const min = Math.max(d3.min(values) || 0, q1 - 1.5 * iqr);
        const max = Math.min(d3.max(values) || 0, q3 + 1.5 * iqr);

        return {
            name: cat.name,
            color: cat.color,
            q1, median, q3, min, max,
            values
        };
    });

    // Scales
    const xScale = d3.scaleBand()
        .domain(categories.map(c => c.name))
        .range([margin.left + 50, width - margin.right - 50])
        .padding(0.4);

    const yScale = d3.scaleLinear()
        .domain([0, 11])
        .range([height - margin.bottom, margin.top]);

    // Update axes
    svg.select(".x-axis")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .transition().duration(500)
        .call(d3.axisBottom(xScale));

    svg.select(".y-axis")
        .attr("transform", `translate(${margin.left + 50}, 0)`)
        .transition().duration(500)
        .call(d3.axisLeft(yScale).ticks(6));

    // Draw box plots
    const boxGroup = svg.select(".boxplot-group");

    // Clear and redraw
    boxGroup.selectAll(".box-element").remove();

    boxData.forEach(d => {
        const g = boxGroup.append("g").attr("class", "box-element");
        const center = xScale(d.name) + xScale.bandwidth() / 2;
        const boxWidth = xScale.bandwidth();

        // Vertical line (whiskers)
        g.append("line")
            .attr("class", "whisker")
            .attr("x1", center)
            .attr("x2", center)
            .attr("y1", yScale(d.min))
            .attr("y2", yScale(d.max))
            .attr("stroke", "#333")
            .attr("stroke-width", 1);

        // Min whisker cap
        g.append("line")
            .attr("x1", center - boxWidth / 4)
            .attr("x2", center + boxWidth / 4)
            .attr("y1", yScale(d.min))
            .attr("y2", yScale(d.min))
            .attr("stroke", "#333")
            .attr("stroke-width", 1);

        // Max whisker cap
        g.append("line")
            .attr("x1", center - boxWidth / 4)
            .attr("x2", center + boxWidth / 4)
            .attr("y1", yScale(d.max))
            .attr("y2", yScale(d.max))
            .attr("stroke", "#333")
            .attr("stroke-width", 1);

        // Box (Q1 to Q3)
        g.append("rect")
            .attr("class", "box")
            .attr("x", xScale(d.name))
            .attr("y", yScale(d.q3))
            .attr("width", boxWidth)
            .attr("height", yScale(d.q1) - yScale(d.q3))
            .attr("fill", d.color)
            .attr("fill-opacity", 0.7)
            .attr("stroke", "#333")
            .attr("stroke-width", 1.5)
            .on("mouseover", function (event) {
                showTooltip(event, `
                    <strong>${d.name}</strong><br>
                    Max: ${d.max.toFixed(1)}<br>
                    Q3: ${d.q3.toFixed(1)}<br>
                    Median: ${d.median.toFixed(1)}<br>
                    Q1: ${d.q1.toFixed(1)}<br>
                    Min: ${d.min.toFixed(1)}
                `);
            })
            .on("mouseout", hideTooltip);

        // Median line
        g.append("line")
            .attr("class", "median-line")
            .attr("x1", xScale(d.name))
            .attr("x2", xScale(d.name) + boxWidth)
            .attr("y1", yScale(d.median))
            .attr("y2", yScale(d.median))
            .attr("stroke", "#333")
            .attr("stroke-width", 2);
    });
}
