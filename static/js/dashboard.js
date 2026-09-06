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
    
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', exportDashboardPDF);
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
    currentData = data;
    updateEventDisplay();
}

function updateEventDisplay() {
    const container = document.getElementById('recent-events');
    if (!container) return;
    
    if (!currentData || (!currentData.solar_flares?.length && !currentData.cme_events?.length && !currentData.geomagnetic_storms?.length)) {
        container.innerHTML = '<div class="no-events">No recent events</div>';
        return;
    }
    
    const filter = document.getElementById('event-filter')?.value || 'all';
    let allEvents = [];
    
    if (filter === 'all' || filter === 'flares') {
        allEvents.push(...(currentData.solar_flares || []).map(e => ({...e, type: 'FLR'})));
    }
    if (filter === 'all' || filter === 'cme') {
        allEvents.push(...(currentData.cme_events || []).map(e => ({...e, type: 'CME'})));
    }
    if (filter === 'all' || filter === 'geomagnetic') {
        allEvents.push(...(currentData.geomagnetic_storms || []).map(e => ({...e, type: 'GST'})));
    }
    
    if (allEvents.length === 0) {
        container.innerHTML = '<div class="no-events">No matching events</div>';
        return;
    }
    
    allEvents.sort((a, b) => {
        const dateA = new Date(a.beginTime || a.eventTime || a.startTime);
        const dateB = new Date(b.beginTime || b.eventTime || b.startTime);
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
    if (typeof exportToJSON === 'function') {
        exportToJSON(currentData, filename);
    } else {
        const jsonContent = JSON.stringify(currentData, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename + '.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

async function exportDashboardPDF() {
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    const originalHtml = exportPdfBtn ? exportPdfBtn.innerHTML : '';
    
    if (exportPdfBtn) {
        exportPdfBtn.disabled = true;
        exportPdfBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
    }
    
    try {
        if (!window.html2pdf) {
            // Fallback to browser print if html2pdf is unavailable
            alert('PDF generation library is loading or offline. Triggering browser print dialog.');
            window.print();
            if (exportPdfBtn) {
                exportPdfBtn.disabled = false;
                exportPdfBtn.innerHTML = originalHtml;
            }
            return;
        }

        // Capture Chart.js canvases as high-res images
        const solarImg = (solarChart && typeof solarChart.toBase64Image === 'function') ? solarChart.toBase64Image('image/png', 1) : null;
        const cmeImg = (cmeChart && typeof cmeChart.toBase64Image === 'function') ? cmeChart.toBase64Image('image/png', 1) : null;
        const geoImg = (geomagneticChart && typeof geomagneticChart.toBase64Image === 'function') ? geomagneticChart.toBase64Image('image/png', 1) : null;

        // Gather metrics and values
        const days = document.getElementById('date-filter')?.value || 30;
        const totalFlares = currentData?.solar_flares?.length || 0;
        const totalCMEs = currentData?.cme_events?.length || 0;
        const totalStorms = currentData?.geomagnetic_storms?.length || 0;
        const lastFlare = document.getElementById('last-flare')?.textContent || 'No recent events';
        const lastCme = document.getElementById('last-cme')?.textContent || 'No recent events';
        const lastGeo = document.getElementById('last-geomagnetic')?.textContent || 'No recent events';
        const systemStatus = document.getElementById('system-status')?.textContent || 'Normal';

        // Prepare combined recent events
        const allEvents = [
            ...(currentData?.solar_flares || []).map(e => ({
                date: e.beginTime || e.eventTime,
                type: 'Solar Flare',
                class: e.classType || 'Standard',
                source: e.sourceLocation || 'Sun'
            })),
            ...(currentData?.cme_events || []).map(e => ({
                date: e.startTime || e.eventTime,
                type: 'CME',
                class: e.speed ? `${e.speed} km/s` : 'Observed',
                source: e.sourceLocation || 'Solar Corona'
            })),
            ...(currentData?.geomagnetic_storms || []).map(e => ({
                date: e.startTime || e.eventTime,
                type: 'Geomagnetic Storm',
                class: e.kpIndex ? `Kp ${e.kpIndex}` : 'Active',
                source: 'Earth Magnetosphere'
            }))
        ];

        allEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
        const topEvents = allEvents.slice(0, 10);

        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toUTCString();

        // Build report element
        const reportElement = document.createElement('div');
        reportElement.className = 'sentinel-pdf-document';
        reportElement.innerHTML = `
            <div class="pdf-header">
                <div class="pdf-brand">
                    <span class="pdf-logo-icon">&#9889;</span>
                    <div>
                        <h1 class="pdf-title">SENTINEL SPACE WEATHER INTELLIGENCE REPORT</h1>
                        <p class="pdf-subtitle">Advanced Space Weather Monitoring & Solar-Terrestrial Impact Assessment</p>
                    </div>
                </div>
                <div class="pdf-meta-badge">
                    <div><strong>Report Date:</strong> ${dateStr}</div>
                    <div><strong>Generated:</strong> ${timeStr}</div>
                    <div><strong>Time Range:</strong> Past ${days} Days</div>
                    <div><strong>Data Feed:</strong> NASA DONKI API</div>
                </div>
            </div>

            <div class="pdf-section-title">&#9679; Executive Intelligence Summary</div>
            <div class="pdf-metrics-grid">
                <div class="pdf-metric-card">
                    <div class="pdf-metric-label">Solar Flares</div>
                    <div class="pdf-metric-val flare">${totalFlares}</div>
                    <div class="pdf-metric-sub">Latest: ${lastFlare}</div>
                </div>
                <div class="pdf-metric-card">
                    <div class="pdf-metric-label">CME Events</div>
                    <div class="pdf-metric-val cme">${totalCMEs}</div>
                    <div class="pdf-metric-sub">Latest: ${lastCme}</div>
                </div>
                <div class="pdf-metric-card">
                    <div class="pdf-metric-label">Geomagnetic Storms</div>
                    <div class="pdf-metric-val geo">${totalStorms}</div>
                    <div class="pdf-metric-sub">Latest: ${lastGeo}</div>
                </div>
                <div class="pdf-metric-card">
                    <div class="pdf-metric-label">Platform Status</div>
                    <div class="pdf-metric-val system">${systemStatus}</div>
                    <div class="pdf-metric-sub">Data Latency: ~5 min</div>
                </div>
            </div>

            <div class="pdf-section-title">&#9679; Space Weather Activity Charts</div>
            <div class="pdf-charts-grid">
                ${solarImg ? `
                <div class="pdf-chart-box full-width">
                    <div class="pdf-chart-title">Solar Activity Overview (X, M, C Class Flare Distribution)</div>
                    <img src="${solarImg}" class="pdf-chart-img" alt="Solar Activity Chart" />
                </div>` : ''}
                <div class="pdf-charts-row">
                    ${cmeImg ? `
                    <div class="pdf-chart-box half-width">
                        <div class="pdf-chart-title">Coronal Mass Ejection Speed (km/s)</div>
                        <img src="${cmeImg}" class="pdf-chart-img" alt="CME Activity Chart" />
                    </div>` : ''}
                    ${geoImg ? `
                    <div class="pdf-chart-box half-width">
                        <div class="pdf-chart-title">Geomagnetic Activity (Kp Index)</div>
                        <img src="${geoImg}" class="pdf-chart-img" alt="Geomagnetic Activity Chart" />
                    </div>` : ''}
                </div>
            </div>

            <div class="pdf-section-title" style="margin-top: 18px;">&#9679; Significant Space Weather Events Log</div>
            <table class="pdf-table">
                <thead>
                    <tr>
                        <th>Date & Time</th>
                        <th>Event Type</th>
                        <th>Classification / Intensity</th>
                        <th>Source Location</th>
                    </tr>
                </thead>
                <tbody>
                    ${topEvents.length > 0 ? topEvents.map(evt => `
                        <tr>
                            <td>${formatDate(evt.date)}</td>
                            <td><strong>${evt.type}</strong></td>
                            <td><span class="pdf-badge ${evt.type.toLowerCase().replace(/\s+/g, '-')}">${evt.class}</span></td>
                            <td>${evt.source}</td>
                        </tr>
                    `).join('') : `
                        <tr><td colspan="4" style="text-align:center; padding: 12px;">No significant events recorded in this time range.</td></tr>
                    `}
                </tbody>
            </table>

            <div class="pdf-footer">
                <div class="pdf-footer-text">
                    <p>SENTINEL Platform &bull; NASA DONKI Intelligence Integration &bull; Team API-demic</p>
                    <p>Designed for space mission planning, satellite operations, and terrestrial infrastructure protection.</p>
                </div>
                <div class="pdf-stamp">OFFICIAL BULLETIN</div>
            </div>
        `;

        document.body.appendChild(reportElement);

        const opt = {
            margin: [8, 8, 8, 8],
            filename: `sentinel-space-weather-report-${dateStr}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                backgroundColor: '#0a0a1a',
                logging: false
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        await window.html2pdf().set(opt).from(reportElement).save();
        document.body.removeChild(reportElement);

        if (exportPdfBtn) {
            exportPdfBtn.innerHTML = '<i class="fas fa-check"></i> Exported!';
            setTimeout(() => {
                exportPdfBtn.innerHTML = originalHtml;
                exportPdfBtn.disabled = false;
            }, 2500);
        }
    } catch (err) {
        console.error('Failed to generate PDF report:', err);
        alert('Failed to generate PDF report: ' + err.message);
        if (exportPdfBtn) {
            exportPdfBtn.disabled = false;
            exportPdfBtn.innerHTML = originalHtml;
        }
    }
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