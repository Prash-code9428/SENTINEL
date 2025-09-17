"""
SENTINEL - Advanced Space Weather Intelligence Platform
Flask backend server with NASA DONKI API integration
"""

from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import requests
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Skyfield imports for satellite tracking
SKYFIELD_AVAILABLE = False
try:
    from skyfield.api import load, EarthSatellite
    SKYFIELD_AVAILABLE = True
except ImportError:
    print("Skyfield library not available. Satellite tracking will be disabled.")

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# NASA DONKI API Configuration
NASA_API_KEY = os.getenv('NASA_API_KEY', 'DEMO_KEY')  # Default to DEMO_KEY if not set
DONKI_BASE_URL = 'https://api.nasa.gov/DONKI'

class SentinelAPI:
    """NASA DONKI API integration class"""
    
    def __init__(self, api_key):
        self.api_key = api_key
        
    def get_date_range(self, days_back=30):
        """Get date range for API calls"""
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days_back)
        return start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')
    
    def make_request(self, endpoint, params=None):
        """Make request to NASA DONKI API"""
        if params is None:
            params = {}
        
        params['api_key'] = self.api_key
        
        try:
            response = requests.get(f"{DONKI_BASE_URL}/{endpoint}", params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"API Error: {e}")
            return []
    
    def get_solar_flares(self, days_back=30):
        """Get solar flare events"""
        start_date, end_date = self.get_date_range(days_back)
        params = {
            'startDate': start_date,
            'endDate': end_date
        }
        return self.make_request('FLR', params)
    
    def get_cme_events(self, days_back=30):
        """Get Coronal Mass Ejection events"""
        start_date, end_date = self.get_date_range(days_back)
        params = {
            'startDate': start_date,
            'endDate': end_date
        }
        return self.make_request('CME', params)
    
    def get_geomagnetic_storms(self, days_back=30):
        """Get Geomagnetic Storm events"""
        start_date, end_date = self.get_date_range(days_back)
        params = {
            'startDate': start_date,
            'endDate': end_date
        }
        return self.make_request('GST', params)
    
    def get_all_events(self, days_back=30):
        """Get all space weather events"""
        return {
            'solar_flares': self.get_solar_flares(days_back),
            'cme_events': self.get_cme_events(days_back),
            'geomagnetic_storms': self.get_geomagnetic_storms(days_back)
        }

# Initialize API client
sentinel_api = SentinelAPI(NASA_API_KEY)

# Routes
@app.route('/')
def home():
    """Home page"""
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    """Dashboard page"""
    return render_template('dashboard.html')

@app.route('/data')
def data():
    """Data repository page"""
    return render_template('data.html')

@app.route('/satellites')
def satellites():
    """Satellite tracking page"""
    return render_template('satellites.html')

@app.route('/about')
def about():
    """About page"""
    return render_template('about.html')

# API Endpoints
@app.route('/api/events')
def api_events():
    """Get all space weather events"""
    days_back = request.args.get('days', 30, type=int)
    events = sentinel_api.get_all_events(days_back)
    return jsonify(events)

@app.route('/api/solar-flares')
def api_solar_flares():
    """Get solar flare events"""
    days_back = request.args.get('days', 30, type=int)
    flares = sentinel_api.get_solar_flares(days_back)
    return jsonify(flares)

@app.route('/api/cme')
def api_cme():
    """Get CME events"""
    days_back = request.args.get('days', 30, type=int)
    cme = sentinel_api.get_cme_events(days_back)
    return jsonify(cme)

@app.route('/api/geomagnetic')
def api_geomagnetic():
    """Get geomagnetic storm events"""
    days_back = request.args.get('days', 30, type=int)
    storms = sentinel_api.get_geomagnetic_storms(days_back)
    return jsonify(storms)

@app.route('/api/satellites')
def api_satellites():
    """Get satellite positions using Skyfield"""
    if not SKYFIELD_AVAILABLE:
        return jsonify({'error': 'Skyfield library not available'}), 503
    
    try:
        # Sample satellite data (TLE format)
        satellites = [
            {
                'name': 'ISS (ZARYA)',
                'line1': '1 25544U 98067A   23266.52564382  .00012204  00000+0  21834-3 0  9998',
                'line2': '2 25544  51.6411 330.5453 0004878 122.4546 315.0519 15.49753158413464'
            },
            {
                'name': 'Hubble Space Telescope',
                'line1': '1 20580U 90037B   23266.18448469  .00008522  00000+0  14755-3 0  9992',
                'line2': '2 20580  28.4693 225.9754 0002460  64.6941 295.4418 15.09250316349088'
            }
        ]
        
        # Load timescale and get current time
        ts = load.timescale()
        t = ts.now()
        
        # Process each satellite
        satellite_data = []
        for sat_info in satellites:
            try:
                # Create EarthSatellite object
                satellite = EarthSatellite(
                    sat_info['line1'],
                    sat_info['line2'],
                    sat_info['name'],
                    ts
                )
                
                # Get satellite position at current time
                geocentric = satellite.at(t)
                
                # Calculate geographic position using Skyfield's subpoint method
                subpoint = geocentric.subpoint()
                lat = float(subpoint.latitude.degrees)
                lon = float(subpoint.longitude.degrees)
                alt = float(subpoint.elevation.km)
                
                # Calculate velocity using Skyfield's velocity data
                velocity_kmps = geocentric.velocity.km_per_s
                speed = float((velocity_kmps[0]**2 + velocity_kmps[1]**2 + velocity_kmps[2]**2)**0.5)
                
                # Add to results
                satellite_data.append({
                    'id': sat_info['name'].replace(' ', '_').lower(),
                    'name': sat_info['name'],
                    'latitude': lat,
                    'longitude': lon,
                    'altitude': alt,
                    'velocity': speed,
                    'timestamp': t.utc_iso()
                })
            except Exception as e:
                print(f"Error processing satellite {sat_info['name']}: {e}")
                continue
        
        return jsonify({
            'satellites': satellite_data,
            'count': len(satellite_data),
            'timestamp': t.utc_iso()
        })
    except Exception as e:
        print(f"Error fetching satellite data: {e}")
        return jsonify({'error': 'Failed to fetch satellite data'}), 500

@app.route('/api/status')
def api_status():
    """Get system status"""
    return jsonify({
        'status': 'online',
        'api_key_configured': NASA_API_KEY != 'DEMO_KEY',
        'skyfield_available': SKYFIELD_AVAILABLE,
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    # Create templates directory if it doesn't exist
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static/css', exist_ok=True)
    os.makedirs('static/js', exist_ok=True)
    
    app.run(debug=True, host='0.0.0.0', port=5000)