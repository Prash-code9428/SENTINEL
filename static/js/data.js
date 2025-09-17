// SENTINEL Data Repository JavaScript
// ===================================

let currentDataSet = null;
let filteredData = null;
let currentPage = 1;
const itemsPerPage = 20;

document.addEventListener('DOMContentLoaded', function() {
    initializeDataPage();
});

function initializeDataPage() {
    setupDataEventListeners();
    loadDataOverview();
    
    console.log('Data repository initialized with real NASA DONKI integration');
}

function setupDataEventListeners() {
    // Data controls
    const timeRangeSelect = document.getElementById('data-time-range');
    const refreshBtn = document.getElementById('refresh-data');
    
    if (timeRangeSelect) {
        timeRangeSelect.addEventListener('change', function() {
            loadDataOverview();
        });
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshAllData);
    }
    
    // Data card download buttons
    const downloadBtns = document.querySelectorAll('.download-btn');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const dataType = this.getAttribute('data-type');
            downloadDataType(dataType);
        });
    });
    
    // Data card preview buttons
    const previewBtns = document.querySelectorAll('.preview-btn');
    previewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const dataType = this.getAttribute('data-type');
            showDataPreview(dataType);
        });
    });
    
    // Preview controls
    const closePreviewBtn = document.getElementById('close-preview');
    const exportPreviewCsv = document.getElementById('export-preview-csv');
    const exportPreviewJson = document.getElementById('export-preview-json');
    
    if (closePreviewBtn) {
        closePreviewBtn.addEventListener('click', hideDataPreview);
    }
    
    if (exportPreviewCsv) {
        exportPreviewCsv.addEventListener('click', () => exportPreviewData('csv'));
    }
    
    if (exportPreviewJson) {
        exportPreviewJson.addEventListener('click', () => exportPreviewData('json'));
    }
    
    // Check API status
    checkAPIStatus();
}

async function loadDataOverview() {
    try {
        const days = document.getElementById('data-time-range')?.value || 730;
        const data = await sentinelAPI.getEvents(days);
        
        if (data) {
            updateDataCardCounts(data);
            updateLastUpdatedTimes();
            currentDataSet = data;
        } else {
            loadFallbackStats();
        }
    } catch (error) {
        console.error('Failed to load data overview:', error);
        loadFallbackStats();
    }
}

function updateDataCardCounts(data) {
    const flareCount = data.solar_flares?.length || 0;
    const cmeCount = data.cme_events?.length || 0;
    const geomagneticCount = data.geomagnetic_storms?.length || 0;
    
    updateElement('flare-record-count', flareCount.toLocaleString());
    updateElement('cme-record-count', cmeCount.toLocaleString());
    updateElement('geomagnetic-record-count', geomagneticCount.toLocaleString());
}

function updateLastUpdatedTimes() {
    const now = new Date().toLocaleString();
    updateElement('flare-last-updated', now);
    updateElement('cme-last-updated', now);
    updateElement('geomagnetic-last-updated', now);
}

function loadFallbackStats() {
    updateElement('flare-record-count', '0');
    updateElement('cme-record-count', '0');
    updateElement('geomagnetic-record-count', '0');
    
    const errorTime = 'Failed to load';
    updateElement('flare-last-updated', errorTime);
    updateElement('cme-last-updated', errorTime);
    updateElement('geomagnetic-last-updated', errorTime);
}

async function loadDataTable() {
    // This function is kept for compatibility but the main data display
    // is now handled by the data cards and preview functionality
    console.log('Data table functionality integrated into data cards');
}

// API Status Check
async function checkAPIStatus() {
    const statusBadge = document.getElementById('api-status');
    if (!statusBadge) return;
    
    try {
        const status = await sentinelAPI.getSystemStatus();
        
        if (status && status.status === 'online') {
            statusBadge.innerHTML = `
                <i class="fas fa-check-circle" style="color: #28a745;"></i> 
                NASA DONKI Connected
                ${status.api_key_configured ? '' : ' (Demo Mode)'}
            `;
            statusBadge.className = 'status-badge online';
        } else {
            statusBadge.innerHTML = '<i class="fas fa-exclamation-triangle" style="color: #ffc107;"></i> API Status Unknown';
            statusBadge.className = 'status-badge warning';
        }
    } catch (error) {
        statusBadge.innerHTML = '<i class="fas fa-times-circle" style="color: #dc3545;"></i> API Connection Failed';
        statusBadge.className = 'status-badge error';
    }
}

// Data download functionality
async function downloadDataType(dataType) {
    if (!currentDataSet) {
        alert('No data available. Please refresh the data first.');
        return;
    }
    
    let data = [];
    let filename = `nasa-${dataType}-${new Date().toISOString().split('T')[0]}`;
    
    switch (dataType) {
        case 'solar-flares':
            data = currentDataSet.solar_flares || [];
            break;
        case 'cme':
            data = currentDataSet.cme_events || [];
            break;
        case 'geomagnetic':
            data = currentDataSet.geomagnetic_storms || [];
            break;
        default:
            alert('Invalid data type selected');
            return;
    }
    
    if (data.length === 0) {
        alert(`No ${dataType.replace('-', ' ')} data available for the selected time period.`);
        return;
    }
    
    exportToCSV(data, filename);
}

// Data preview functionality
let currentPreviewData = null;

async function showDataPreview(dataType) {
    if (!currentDataSet) {
        alert('No data available. Please refresh the data first.');
        return;
    }
    
    let data = [];
    let title = '';
    
    switch (dataType) {
        case 'solar-flares':
            data = currentDataSet.solar_flares || [];
            title = 'Solar Flare Events Preview';
            break;
        case 'cme':
            data = currentDataSet.cme_events || [];
            title = 'CME Events Preview';
            break;
        case 'geomagnetic':
            data = currentDataSet.geomagnetic_storms || [];
            title = 'Geomagnetic Storm Events Preview';
            break;
        default:
            alert('Invalid data type selected');
            return;
    }
    
    if (data.length === 0) {
        alert(`No ${dataType.replace('-', ' ')} data available for the selected time period.`);
        return;
    }
    
    currentPreviewData = { data, type: dataType };
    
    // Update preview title and stats
    updateElement('preview-title', title);
    updateElement('preview-count', `${data.length} records`);
    
    // Calculate date range
    if (data.length > 0) {
        const dates = data.map(item => new Date(item.beginTime || item.startTime || item.eventTime))
                         .filter(date => !isNaN(date.getTime()))
                         .sort((a, b) => a - b);
        
        if (dates.length > 0) {
            const startDate = dates[0].toLocaleDateString();
            const endDate = dates[dates.length - 1].toLocaleDateString();
            updateElement('preview-date-range', `${startDate} - ${endDate}`);
        }
    }
    
    // Generate preview table
    generatePreviewTable(data, dataType);
    
    // Show preview block
    const previewBlock = document.getElementById('data-preview-block');
    if (previewBlock) {
        previewBlock.style.display = 'block';
        previewBlock.scrollIntoView({ behavior: 'smooth' });
    }
}

function hideDataPreview() {
    const previewBlock = document.getElementById('data-preview-block');
    if (previewBlock) {
        previewBlock.style.display = 'none';
    }
    currentPreviewData = null;
}

function generatePreviewTable(data, dataType) {
    const tableHead = document.getElementById('preview-table-head');
    const tableBody = document.getElementById('preview-table-body');
    
    if (!tableHead || !tableBody) return;
    
    // Define headers based on data type
    let headers = [];
    
    switch (dataType) {
        case 'solar-flares':
            headers = ['Begin Time', 'Peak Time', 'End Time', 'Class Type', 'Source Location'];
            break;
        case 'cme':
            headers = ['Start Time', 'Speed (km/s)', 'Half Angle', 'Source Location', 'Type'];
            break;
        case 'geomagnetic':
            headers = ['Start Time', 'End Time', 'K-Index', 'Storm Type', 'Linked Events'];
            break;
        default:
            headers = ['Event Time', 'Type', 'Details'];
    }
    
    // Generate table header
    tableHead.innerHTML = `
        <tr>
            ${headers.map(header => `<th>${header}</th>`).join('')}
        </tr>
    `;
    
    // Generate table rows (limit to first 50 records for performance)
    const limitedData = data.slice(0, 50);
    const rows = limitedData.map(item => {
        switch (dataType) {
            case 'solar-flares':
                return `
                    <tr>
                        <td>${formatDate(item.beginTime)}</td>
                        <td>${formatDate(item.peakTime)}</td>
                        <td>${formatDate(item.endTime)}</td>
                        <td><span class="class-badge ${item.classType?.charAt(0)?.toLowerCase()}">${item.classType || 'Unknown'}</span></td>
                        <td>${item.sourceLocation || 'Unknown'}</td>
                    </tr>
                `;
            case 'cme':
                return `
                    <tr>
                        <td>${formatDate(item.startTime)}</td>
                        <td>${item.speed || 'Unknown'}</td>
                        <td>${item.halfAngle || 'Unknown'}</td>
                        <td>${item.sourceLocation || 'Unknown'}</td>
                        <td>${item.type || 'CME'}</td>
                    </tr>
                `;
            case 'geomagnetic':
                return `
                    <tr>
                        <td>${formatDate(item.startTime)}</td>
                        <td>${formatDate(item.endTime)}</td>
                        <td>${item.kpIndex || 'Unknown'}</td>
                        <td>${item.type || 'Geomagnetic Storm'}</td>
                        <td>${item.linkedEvents?.length || 0} events</td>
                    </tr>
                `;
            default:
                return `
                    <tr>
                        <td colspan="${headers.length}">No preview available</td>
                    </tr>
                `;
        }
    }).join('');
    
    tableBody.innerHTML = rows;
    
    // Add note if data was limited
    if (data.length > 50) {
        const noteRow = `
            <tr class="preview-note">
                <td colspan="${headers.length}">
                    <i class="fas fa-info-circle"></i> 
                    Showing first 50 of ${data.length} records. Download full dataset for complete data.
                </td>
            </tr>
        `;
        tableBody.innerHTML += noteRow;
    }
}

function exportPreviewData(format) {
    if (!currentPreviewData) {
        alert('No preview data available');
        return;
    }
    
    const { data, type } = currentPreviewData;
    const filename = `nasa-${type}-preview-${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'csv') {
        exportToCSV(data, filename);
    } else if (format === 'json') {
        exportToJSON(data, filename);
    }
}

async function refreshAllData() {
    const refreshBtn = document.getElementById('refresh-data');
    if (refreshBtn) {
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        refreshBtn.disabled = true;
    }
    
    try {
        await loadDataOverview();
        
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-check"></i> Data Refreshed';
            setTimeout(() => {
                refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
            }, 2000);
        }
        
        // Check API status after refresh
        checkAPIStatus();
        
    } catch (error) {
        console.error('Failed to refresh data:', error);
        
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Refresh Failed';
            setTimeout(() => {
                refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
            }, 3000);
        }
    } finally {
        if (refreshBtn) {
            refreshBtn.disabled = false;
        }
    }
}

function combineEventData(data) {
    const combined = [];
    
    // Add solar flares
    if (data.solar_flares && Array.isArray(data.solar_flares)) {
        data.solar_flares.forEach(event => {
            combined.push(processEventData(event, 'Solar Flare'));
        });
    }
    
    // Add CME events
    if (data.cme_events && Array.isArray(data.cme_events)) {
        data.cme_events.forEach(event => {
            combined.push(processEventData(event, 'CME'));
        });
    }
    
    // Add geomagnetic storms
    if (data.geomagnetic_storms && Array.isArray(data.geomagnetic_storms)) {
        data.geomagnetic_storms.forEach(event => {
            combined.push(processEventData(event, 'Geomagnetic Storm'));
        });
    }
    
    // Sort by date (newest first)
    combined.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    });
    
    return combined;
}



function updateElement(id, content) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = content;
    }
}

// Utility Functions
function formatDate(dateString) {
    if (!dateString || dateString === 'N/A') return 'N/A';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        });
    } catch (error) {
        return 'Invalid Date';
    }
}

function getEventIcon(eventType) {
    switch (eventType.toLowerCase()) {
        case 'solar flare':
            return 'fas fa-sun';
        case 'cme':
            return 'fas fa-wind';
        case 'geomagnetic storm':
            return 'fas fa-chart-line';
        default:
            return 'fas fa-exclamation-triangle';
    }
}

// Export Functions
function exportToCSV(data, filename) {
    if (!data || data.length === 0) {
        alert('No data available to export');
        return;
    }
    
    // Prepare CSV headers
    const headers = ['Date', 'Type', 'Classification', 'Peak Time', 'Source Location'];
    
    // Create CSV content
    const csvContent = [
        headers.join(','),
        ...data.map(event => [
            `"${formatDate(event.date)}"`,
            `"${event.type}"`,
            `"${event.classification}"`,
            `"${formatDate(event.peakTime)}"`,
            `"${event.sourceLocation}"`
        ].join(','))
    ].join('\n');
    
    downloadFile(csvContent, filename + '.csv', 'text/csv');
}

function exportToJSON(data, filename) {
    if (!data || data.length === 0) {
        alert('No data available to export');
        return;
    }
    
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, filename + '.json', 'application/json');
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Enhanced data processing for better display
function processEventData(rawEvent, eventType) {
    const baseEvent = {
        type: eventType,
        sourceLocation: 'Unknown',
        rawData: rawEvent
    };
    
    switch (eventType) {
        case 'Solar Flare':
            return {
                ...baseEvent,
                date: rawEvent.beginTime || rawEvent.eventTime,
                classification: rawEvent.classType || 'Unknown Class',
                peakTime: rawEvent.peakTime || rawEvent.beginTime,
                sourceLocation: rawEvent.sourceLocation || 'Sun',
                intensity: rawEvent.classType ? rawEvent.classType.charAt(0) : 'Unknown'
            };
            
        case 'CME':
            return {
                ...baseEvent,
                date: rawEvent.startTime || rawEvent.eventTime,
                classification: rawEvent.speed ? `${rawEvent.speed} km/s` : 'Unknown Speed',
                peakTime: rawEvent.startTime || 'N/A',
                sourceLocation: rawEvent.sourceLocation || 'Sun Corona',
                intensity: rawEvent.speed ? (rawEvent.speed > 1000 ? 'High' : rawEvent.speed > 500 ? 'Medium' : 'Low') : 'Unknown'
            };
            
        case 'Geomagnetic Storm':
            return {
                ...baseEvent,
                date: rawEvent.startTime || rawEvent.eventTime,
                classification: rawEvent.kpIndex ? `Kp ${rawEvent.kpIndex}` : 'Unknown Kp',
                peakTime: rawEvent.startTime || 'N/A',
                sourceLocation: 'Earth Magnetosphere',
                intensity: rawEvent.kpIndex ? (rawEvent.kpIndex >= 7 ? 'Severe' : rawEvent.kpIndex >= 5 ? 'Strong' : 'Minor') : 'Unknown'
            };
            
        default:
            return {
                ...baseEvent,
                date: rawEvent.eventTime || rawEvent.startTime || rawEvent.beginTime,
                classification: 'Unknown',
                peakTime: 'N/A',
                sourceLocation: 'Unknown'
            };
    }
}

