/**
 * University Placement Strategic Dashboard
 * Main JavaScript file - Application entry point
 */

// Global variables
let data = [];
let filteredData = [];
let cgpaRange = [4, 11];

// View 2 sampling controls/state
let scatterSamplePct = 5;         // slider value (0..100), default at launch
let scatterSampleCount = 0;         // updated by updateScatterPlot()
let scatterSampledData = [];        // updated by updateScatterPlot()

// Chart dimensions
const margin = { top: 30, right: 30, bottom: 50, left: 60 };

// Color scales
const placementColor = d3.scaleOrdinal()
    .domain(["Yes", "No"])
    .range(["#27ae60", "#e74c3c"]);

const internshipColor = d3.scaleOrdinal()
    .domain(["Yes", "No"])
    .range(["#27ae60", "#e74c3c"]);

// Tooltip
const tooltip = d3.select("#tooltip");

// Tooltip functions
function showTooltip(event, html) {
    tooltip
        .html(html)
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - 10) + "px")
        .classed("visible", true);
}

function hideTooltip() {
    tooltip.classed("visible", false);
}

// Load data and initialize dashboard
async function init() {
    try {
        data = await d3.csv("data/CollegePlacement.csv", (d, i) => ({
            _index: i,              // stable unique id for join keys
            _rand: Math.random(),   // RANDOM sampling value (new each page load)

            college_id: d.College_ID,
            iq: +d.IQ,
            prev_sem: +d.Prev_Sem_Result,
            cgpa: +d.CGPA,
            academic_perf: +d.Academic_Performance,
            internship: d.Internship_Experience,
            extra_curricular: +d.Extra_Curricular_Score,
            communication: +d.Communication_Skills,
            projects: +d.Projects_Completed,
            placement: d.Placement
        }));

        filteredData = [...data];

        console.log("Data loaded:", data.length, "records");

        // Initialize all views
        createStackedBarChart();
        createScatterPlot();
        createHorizontalBarChart();
        createBoxPlot();

        // Setup interactions
        setupSliderInteraction();      // View 1
        setupScatterSampleSlider();    // View 2

    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// View 1 slider interaction setup (CGPA range)
function setupSliderInteraction() {
    const sliderMin = document.getElementById('cgpa-slider-min');
    const sliderMax = document.getElementById('cgpa-slider-max');
    const rangeMin = document.getElementById('range-min');
    const rangeMax = document.getElementById('range-max');

    // Scope to View 1 so it won’t accidentally pick View 2’s .range-selected
    const rangeSelected = document.querySelector('#view1-container .range-selected');

    function updateSlider() {
        let minVal = parseFloat(sliderMin.value);
        let maxVal = parseFloat(sliderMax.value);

        // Prevent min from exceeding max
        if (minVal > maxVal) {
            [sliderMin.value, sliderMax.value] = [maxVal, minVal];
            [minVal, maxVal] = [maxVal, minVal];
        }

        // Update display values
        rangeMin.textContent = minVal.toFixed(1);
        rangeMax.textContent = maxVal.toFixed(1);

        // Update the colored range bar
        const percent1 = ((minVal - 4) / 7) * 100;
        const percent2 = ((maxVal - 4) / 7) * 100;
        rangeSelected.style.left = percent1 + '%';
        rangeSelected.style.width = (percent2 - percent1) + '%';

        // Update global range and refresh views
        cgpaRange = [minVal, maxVal];
        updateAllViews();
    }

    sliderMin.addEventListener('input', updateSlider);
    sliderMax.addEventListener('input', updateSlider);

    // Initialize slider display
    updateSlider();
}

// View 2 slider interaction setup (percent of points rendered)
function setupScatterSampleSlider() {
    const slider = document.getElementById('scatter-sample-slider');
    const valueSpan = document.getElementById('scatter-percent');
    const selectedBar = document.getElementById('scatter-range-selected');

    if (!slider || !valueSpan || !selectedBar) return;

    function updateScatterSample() {
        scatterSamplePct = parseInt(slider.value, 10);
        valueSpan.textContent = `${scatterSamplePct}%`;

        selectedBar.style.left = '0%';
        selectedBar.style.width = `${scatterSamplePct}%`;

        updateScatterPlot();

        // Optional: quick visibility into counts
        // console.log(`[View2] sampled ${scatterSampleCount}/${data.length} points`);
    }

    slider.addEventListener('input', updateScatterSample);
    updateScatterSample();
}

// Update all views based on filter
function updateAllViews() {
    // Filter data based on CGPA range
    filteredData = data.filter(d => d.cgpa >= cgpaRange[0] && d.cgpa <= cgpaRange[1]);

    // Update each view
    updateStackedBarChart();
    updateScatterPlot();
    updateHorizontalBarChart();
    updateBoxPlot();
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", init);
