// SENTINEL Dashboard JavaScript
// =============================

let solarChart = null;
let cmeChart = null;
let geomagneticChart = null;
let currentData = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Initialize dashboard components
    setupEventListeners();
    loadDashboardData();
    initializeCharts();
    
    // Auto-refresh every 5 minutes
    setInterval(loadDashboardData, 5 * 60 * 1000);
    
    console.log('Dashboard initialized');
}

function initializeCharts() {
    initializeSolarChart();
    initializeCMEChart();
    initializeGeomagneticChart();
}

function initializeSolarChart() {
    const ctx = document.getElementById('solar-activity-chart');
    if (!ctx) return;
    
    solarChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
            datasets: [
                {
                    label: 'X-Class Flares',
                    data: [1, 0, 1, 2, 1, 0, 1],
                    borderColor: '#ff4444',
                    backgroundColor: 'rgba(255, 68, 68, 0.1)',
                    tension: 0.4,
                    pointRadius: 4
                },
                {
                    label: 'M-Class Flares',
                    data: [2, 1, 3, 4, 2, 1, 2],
                    borderColor: '#ffaa00',
                    backgroundColor: 'rgba(255, 170, 0, 0.1)',
                    tension: 0.4,
                    pointRadius: 4
                },
                {
                    label: 'C-Class Flares',
                    data: [5, 7, 12, 7, 9, 6, 3],
                    borderColor: '#44ff44',
                    backgroundColor: 'rgba(68, 255, 68, 0.1)',
                    tension: 0.4,
                    pointRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#e0e0e0',
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            scales: {
                x: {
                    ticks: { 
                        color: '#e0e0e0',
                        font: { size: 11 }
                    },
                    grid: { 
                        color: 'rgba(224, 224, 224, 0.1)',
                        borderColor: 'rgba(224, 224, 224, 0.2)'
                    }
                },
                y: {
                    ticks: { 
                        color: '#e0e0e0',
                        font: { size: 11 }
                    },
                    grid: { 
                        color: 'rgba(224, 224, 224, 0.1)',
                        borderColor: 'rgba(224, 224, 224, 0.2)'
                    }
                }
            }
        }
    });
}

function initializeCMEChart() {
    const ctx = document.getElementById('cme-activity-chart');
    if (!ctx) return;
    
    cmeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Sep 10', 'Sep 11', 'Sep 12', 'Sep 13', 'Sep 14', 'Sep 15', 'Sep 16'],
            datasets: [{
                label: 'CME Speed (km/s)',
                data: [450, 890, 320, 1200, 650, 400, 750],
                backgroundColor: '#4fc3f7',
                borderColor: '#29b6f6',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#e0e0e0',
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            scales: {
                x: {
                    ticks: { 
                        color: '#e0e0e0',
                        font: { size: 11 }
                    },
                    grid: { 
                        color: 'rgba(224, 224, 224, 0.1)',
                        borderColor: 'rgba(224, 224, 224, 0.2)'
                    }
                },
                y: {
                    ticks: { 
                        color: '#e0e0e0',
                        font: { size: 11 }
                    },
                    grid: { 
                        color: 'rgba(224, 224, 224, 0.1)',
                        borderColor: 'rgba(224, 224, 224, 0.2)'
                    }
                }
            }
        }
    });
}

function initializeGeomagneticChart() {
    const ctx = document.getElementById('geomagnetic-activity-chart');
    if (!ctx) return;
    
    geomagneticChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Sep 10', 'Sep 11', 'Sep 12', 'Sep 13', 'Sep 14', 'Sep 15', 'Sep 16'],
            datasets: [{
                label: 'K-index',
                data: [2, 3, 6, 4, 7, 5, 3],
                borderColor: '#66bb6a',
                backgroundColor: 'rgba(102, 187, 106, 0.3)',
                fill: true,
                tension: 0.4,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#e0e0e0',
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            scales: {
                x: {
                    ticks: { 
                        color: '#e0e0e0',
                        font: { size: 11 }
                    },
                    grid: { 
                        color: 'rgba(224, 224, 224, 0.1)',
                        borderColor: 'rgba(224, 224, 224, 0.2)'
                    }
                },
                y: {
                    min: 0,
                    max: 9,
                    ticks: { 
                        color: '#e0e0e0',
                        font: { size: 11 }
                    },
                    grid: { 
                        color: 'rgba(224, 224, 224, 0.1)',
                        borderColor: 'rgba(224, 224, 224, 0.2)'
                    }
                }
            }
        }
    });
}

function setupEventListeners() {
    // Refresh button
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            loadDashboardData(true);
        });
    }
    
    // Export buttons
    const exportDataBtn = document.getElementById('export-data-btn');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', exportDashboardData);
    }
    
    // Filter change handlers
    const dateFilter = document.getElementById('date-filter');
    const eventFilter = document.getElementById('event-filter');
    
    if (dateFilter) {
        dateFilter.addEventListener('change', () => {
            loadDashboardData();
        });
    }
    
    if (eventFilter) {
        eventFilter.addEventListener('change', () => {
            updateEventDisplay();
        });
    }
}

async function loadDashboardData(showLoading = false) {
    if (showLoading) {
        updateLoadingStates();
    }
    
    try {
        const days = document.getElementById('date-filter')?.value || 30;
        
        // Load all data in parallel
        const [events, status] = await Promise.all([
            sentinelAPI.getEvents(days),
            sentinelAPI.getSystemStatus()
        ]);
        
        currentData = events;
        
        // Update dashboard components
        updateStatusCards(events);
        updateRecentEvents(events);
        updateChart(events);
        updateSystemStatus(status);
        
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        showError('Failed to load dashboard data. Using fallback data.');
        loadFallbackData();
    }
}

function updateStatusCards(data) {
    if (!data) return;
    
    const flares = data.solar_flares || [];
    const cmes = data.cme_events || [];
    const storms = data.geomagnetic_storms || [];
    
    // Update last events
    updateElement('last-flare', getLastEventInfo(flares, 'flare'));
    updateElement('last-cme', getLastEventInfo(cmes, 'cme'));
    updateElement('last-geomagnetic', getLastEventInfo(storms, 'storm'));
    updateElement('system-status', 'Normal');
}

function getLastEventInfo(events, type) {
    if (!events || events.length === 0) {
        return 'No events found in past year';
    }
    
    const latest = events[0];
    const date = formatDate(latest.beginTime || latest.eventTime);
    return `${date}`;
}

function updateRecentEvents(data) {
    const container = document.getElementById('recent-events');
    if (!container) return;
    
    if (!data || (!data.solar_flares?.length && !data.cme_events?.length && !data.geomagnetic_storms?.length)) {
        container.innerHTML = '<div class="no-events">No recent events</div>';
        return;
    }
    
    // Combine all events and sort by date
    const allEvents = [
        ...(data.solar_flares || []).map(e => ({...e, type: 'FLR'})),
        ...(data.cme_events || []).map(e => ({...e, type: 'CME'})),
        ...(data.geomagnetic_storms || []).map(e => ({...e, type: 'GST'}))
    ];
    
    allEvents.sort((a, b) => {
        const dateA = new Date(a.beginTime || a.eventTime);
        const dateB = new Date(b.beginTime || b.eventTime);
        return dateB - dateA;
    });
    
    const recentEvents = allEvents.slice(0, 5);
    container.innerHTML = recentEvents.map(createEventCard).join('');
}

function initializeChart() {
    const ctx = document.getElementById('solar-activity-chart');
    if (!ctx) return;
    
    // Create sample data for demonstration
    const sampleData = generateSampleChartData();
    
    dashboardChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sampleData.labels,
            datasets: [
                {
                    label: 'Solar Flares',
                    data: sampleData.flares,
                    borderColor: '#ff6b35',
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'CME Events',
                    data: sampleData.cmes,
                    borderColor: '#4fc3f7',
                    backgroundColor: 'rgba(79, 195, 247, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Geomagnetic Activity',
                    data: sampleData.geomagnetic,
                    borderColor: '#66bb6a',
                    backgroundColor: 'rgba(102, 187, 106, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#e0e0e0'
                    }
                }
            },
            scales: {
                x: {
                    ticks: { 
                        color: '#e0e0e0',
                        font: { size: 11 }
                    },
                    grid: { 
                        color: 'rgba(224, 224, 224, 0.1)',
                        borderColor: 'rgba(224, 224, 224, 0.2)'
                    }
                },
                y: {
                    ticks: { 
                        color: '#e0e0e0',
                        font: { size: 11 }
                    },
                    grid: { 
                        color: 'rgba(224, 224, 224, 0.1)',
                        borderColor: 'rgba(224, 224, 224, 0.2)'
                    }
                }
            }
        }
    });
}

function updateChart(data) {
    if (!dashboardChart || !data) return;
    
    // Update chart with real data when available
    // For now, using sample data
    const sampleData = generateSampleChartData();
    
    dashboardChart.data.labels = sampleData.labels;
    dashboardChart.data.datasets[0].data = sampleData.flares;
    dashboardChart.data.datasets[1].data = sampleData.cmes;
    dashboardChart.data.datasets[2].data = sampleData.geomagnetic;
    
    dashboardChart.update();
}

function generateSampleChartData() {
    const labels = [];
    const flares = [];
    const cmes = [];
    const geomagnetic = [];
    
    // Generate 30 days of sample data
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        // Generate realistic sample data
        flares.push(Math.floor(Math.random() * 12) + 1);
        cmes.push(Math.floor(Math.random() * 8) + 1);
        geomagnetic.push(Math.floor(Math.random() * 6) + 2);
    }
    
    return { labels, flares, cmes, geomagnetic };
}

function updateSystemStatus(status) {
    if (!status) return;
    
    updateElement('api-status', status.api_key_configured ? 'Connected' : 'Demo Mode');
    updateElement('last-update', formatDate(status.timestamp));
    
    // Update status indicators
    const apiStatus = document.getElementById('api-status');
    if (apiStatus) {
        apiStatus.className = `status-indicator ${status.api_key_configured ? 'online' : 'demo'}`;
    }
}

function updateElement(id, content) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = content;
    }
}

function updateLoadingStates() {
    const statusValues = document.querySelectorAll('.status-value');
    statusValues.forEach(element => {
        element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    });
    
    const recentEvents = document.getElementById('recent-events');
    if (recentEvents) {
        recentEvents.innerHTML = '<div class="loading">Refreshing events...</div>';
    }
}

function exportDashboardData() {
    if (!currentData) {
        alert('No data available to export');
        return;
    }
    
    const filename = `sentinel-dashboard-${new Date().toISOString().split('T')[0]}`;
    exportToJSON(currentData, filename);
}

function loadFallbackData() {
    // Load fallback data when API is unavailable
    const fallbackData = {
        solar_flares: [],
        cme_events: [],
        geomagnetic_storms: []
    };
    
    updateStatusCards(fallbackData);
    updateRecentEvents(fallbackData);
    
    // Update status to show fallback mode
    updateElement('last-flare', 'No events found in past year');
    updateElement('last-cme', 'No events found in past year');
    updateElement('last-geomagnetic', 'No events found in past year');
    
    const dataStatus = document.getElementById('data-status');
    if (dataStatus) {
        dataStatus.textContent = 'Using fallback data';
        dataStatus.style.color = '#ff9800';
    }
}