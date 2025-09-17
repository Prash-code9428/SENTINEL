Ui# SENTINEL - Advanced Space Weather Intelligence Platform

![SENTINEL Logo](https://img.shields.io/badge/SENTINEL-Space%20Weather%20Intelligence-blueviolet)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

SENTINEL is a cutting-edge space weather monitoring platform that integrates with NASA's DONKI API to provide real-time analysis of solar flares, coronal mass ejections (CMEs), and geomagnetic storms.

## 🌟 Features

- **Real-time Monitoring**: Live space weather data from NASA DONKI API
- **Beautiful Dark Theme**: Space-like interface with animated starfield
- **Interactive Dashboard**: Real-time charts and monitoring
- **Data Repository**: Historical space weather data with export capabilities
- **Responsive Design**: Works on all devices
- **API Integration**: RESTful API for programmatic access

## 🚀 Quick Start

### Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

### Installation

1. **Clone or download the project**
   ```bash
   cd "c:\trident new"
   ```

2. **Activate the virtual environment**
   ```bash
   .\venv\Scripts\Activate.ps1
   ```

3. **Install dependencies** (already done)
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure your NASA API key**
   - Edit the `.env` file
   - Replace `DEMO_KEY` with your actual NASA API key:
   ```
   NASA_API_KEY=your_actual_api_key_here
   ```

5. **Run the application**
   ```bash
   python app.py
   ```

6. **Open your browser**
   - Navigate to `http://localhost:5000`
   - The platform will be running with animated starfield background!

## 🔑 NASA API Key Setup

To get full functionality, you need a NASA API key:

1. **Get your free API key**:
   - Visit: https://api.nasa.gov/
   - Click "Generate API Key"
   - Fill in your information
   - You'll receive your API key instantly

2. **Configure the key**:
   - Open the `.env` file in the project root
   - Replace `DEMO_KEY` with your actual API key:
   ```
   NASA_API_KEY=your_actual_nasa_api_key_here
   ```

3. **Restart the application** to apply changes

> **Note**: The platform works with `DEMO_KEY` but has limited requests. For full functionality, use your own API key.

## 📖 Platform Pages

### 🏠 Home Page
- Hero section with animated background
- Space weather education content
- Platform feature overview
- Call-to-action buttons

### 📊 Dashboard
- Real-time space weather monitoring
- Status cards for latest events
- Interactive charts showing solar activity
- System status indicators
- Data export capabilities

### 📁 Data Repository
- Historical space weather data
- Advanced filtering options
- Data export (CSV, JSON)
- Event details modal
- API documentation

### ℹ️ About Page
- Platform mission and technology
- Team information
- Data sources and partners
- Contact information

## 🛠 API Endpoints

The platform provides a RESTful API for programmatic access:

```bash
# Get all events from past 30 days
GET /api/events?days=30

# Get only solar flares
GET /api/solar-flares?days=7

# Get CME events
GET /api/cme?days=14

# Get geomagnetic storms
GET /api/geomagnetic?days=30

# Get system status
GET /api/status
```

## 🎨 Design Features

- **Animated Starfield**: Moving stars in the background
- **Dark Space Theme**: Professional dark color scheme
- **Purple Accent Colors**: Inspired by space and cosmic themes
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Hover effects and transitions
- **Modern Typography**: Clean, readable fonts

## 🗂 Project Structure

```
trident new/
├── app.py                 # Flask backend server
├── requirements.txt       # Python dependencies
├── .env                   # Environment configuration
├── .gitignore            # Git ignore rules
├── templates/            # HTML templates
│   ├── base.html         # Base template
│   ├── index.html        # Home page
│   ├── dashboard.html    # Dashboard page
│   ├── data.html         # Data repository
│   └── about.html        # About page
├── static/               # Static assets
│   ├── css/
│   │   └── style.css     # Main stylesheet
│   └── js/
│       ├── main.js       # Core JavaScript
│       ├── dashboard.js  # Dashboard functionality
│       └── data.js       # Data page functionality
└── venv/                 # Virtual environment
```

## 🌍 Space Weather Events Monitored

### ☀️ Solar Flares
- **X-Class**: Most powerful, can cause global radio blackouts
- **M-Class**: Moderate intensity, regional radio disruptions  
- **C-Class**: Minor effects on polar regions

### 🌪 Coronal Mass Ejections (CMEs)
- Speed: 300-3000 km/s
- Travel time to Earth: 1-4 days
- Can cause geomagnetic storms and auroras

### 🌎 Geomagnetic Storms
- Measured by K-index (Kp 0-9)
- Affect power grids, satellites, and navigation
- Create beautiful auroras

## 🔧 Technical Stack

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, JavaScript
- **Charts**: Chart.js
- **API**: NASA DONKI
- **Styling**: Custom CSS with animations
- **Icons**: Font Awesome

## 🚨 Important Notes

- **Demo Mode**: Works with DEMO_KEY but has limited API calls
- **API Limits**: NASA API has rate limits (1000 requests/hour with API key)
- **Real-time Data**: Updates every 5 minutes from NASA DONKI
- **Educational Use**: Platform designed for educational and research purposes

## 🎯 Future Enhancements

- [ ] PDF report generation
- [ ] Email alerts for major events
- [ ] Mobile app version
- [ ] Machine learning predictions
- [ ] Integration with more space weather APIs
- [ ] User accounts and saved preferences

## 📞 Support

For questions or issues:
- Check the About page for detailed information
- Review NASA DONKI API documentation
- Ensure your API key is properly configured

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ by Team API-demic**

*Safeguarding space exploration through advanced space weather intelligence*