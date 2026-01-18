# University Placement Strategic Dashboard

[2025ws] Data Visualization

## Project Overview

An interactive dashboard for analyzing key success factors in university student placement, built with D3.js.

## Project Structure

```
Uniplacement_Vis/
├── index.html              # Main HTML file
├── README.md               # Project documentation
├── LICENSE                 # License file
├── data/
│   └── CollegePlacement.csv   # Dataset
├── css/
│   └── style.css           # Stylesheet
└── js/
    ├── main.js             # Application entry point
    └── charts/
        ├── stackedBarChart.js      # View 1: CGPA Distribution
        ├── scatterPlot.js          # View 2: IQ vs CGPA
        ├── horizontalBarChart.js   # View 3: Top Colleges
        └── boxPlot.js              # View 4: Soft Skills
```

## Dashboard Views

| View   | Chart Type           | Task                                                        |
| ------ | -------------------- | ----------------------------------------------------------- |
| View 1 | Stacked Bar Chart    | Compare CGPA distribution for placed vs non-placed students |
| View 2 | Scatter Plot         | Explore correlation between IQ, CGPA, and Internship status |
| View 3 | Horizontal Bar Chart | Identify top-performing colleges                            |
| View 4 | Box Plot             | Compare soft skills importance for placement                |

## Interactions

- **CGPA Range Slider**: Filter data across all views (linked views)
- **Tooltip**: Hover over elements to see detailed information
- **Ghosting Effect**: Non-filtered data points are de-emphasized in scatter plot

## Getting Started

1. Clone the repository
2. Open with Live Server or any local server
3. Open `index.html` in your browser

## Technologies

- D3.js v7
- HTML5 / CSS3
- Vanilla JavaScript (ES6+)
