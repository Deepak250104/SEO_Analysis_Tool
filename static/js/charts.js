// Chart.js utilities for SEO Analysis Tool
// Additional chart configurations and helpers

/**
 * Create a radar chart for SEO metrics comparison
 */
function createRadarChart(canvasId, labels, datasets) {
    const ctx = document.getElementById(canvasId);
    
    if (!ctx) {
        console.error(`Canvas element ${canvasId} not found`);
        return null;
    }
    
    return new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 10,
                    ticks: {
                        stepSize: 2,
                        color: '#9aa0a6'
                    },
                    grid: {
                        color: '#2d3748'
                    },
                    pointLabels: {
                        color: '#e8eaed',
                        font: {
                            size: 14
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#e8eaed',
                        font: {
                            size: 14
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create a bar chart for metric comparison
 */
function createBarChart(canvasId, labels, data, label) {
    const ctx = document.getElementById(canvasId);
    
    if (!ctx) {
        console.error(`Canvas element ${canvasId} not found`);
        return null;
    }
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: [
                    'rgba(79, 150, 255, 0.6)',
                    'rgba(94, 234, 212, 0.6)',
                    'rgba(52, 211, 153, 0.6)',
                    'rgba(251, 191, 36, 0.6)'
                ],
                borderColor: [
                    'rgba(79, 150, 255, 1)',
                    'rgba(94, 234, 212, 1)',
                    'rgba(52, 211, 153, 1)',
                    'rgba(251, 191, 36, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    ticks: {
                        color: '#9aa0a6'
                    },
                    grid: {
                        color: '#2d3748'
                    }
                },
                x: {
                    ticks: {
                        color: '#9aa0a6'
                    },
                    grid: {
                        color: '#2d3748'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#e8eaed'
                    }
                }
            }
        }
    });
}

/**
 * Create a doughnut chart for score visualization
 */
function createDoughnutChart(canvasId, score, label) {
    const ctx = document.getElementById(canvasId);
    
    if (!ctx) {
        console.error(`Canvas element ${canvasId} not found`);
        return null;
    }
    
    const remaining = 10 - score;
    
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [label, 'Remaining'],
            datasets: [{
                data: [score, remaining],
                backgroundColor: [
                    score >= 8 ? 'rgba(52, 211, 153, 0.8)' : 
                    score >= 5 ? 'rgba(251, 191, 36, 0.8)' : 
                    'rgba(248, 113, 113, 0.8)',
                    'rgba(45, 55, 72, 0.5)'
                ],
                borderColor: [
                    score >= 8 ? '#34d399' : 
                    score >= 5 ? '#fbbf24' : 
                    '#f87171',
                    '#2d3748'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

/**
 * Update chart data dynamically
 */
function updateChartData(chart, newData) {
    if (!chart) return;
    
    chart.data.datasets[0].data = newData;
    chart.update();
}

/**
 * Destroy chart instance
 */
function destroyChart(chart) {
    if (chart) {
        chart.destroy();
    }
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createRadarChart,
        createBarChart,
        createDoughnutChart,
        updateChartData,
        destroyChart
    };
}

