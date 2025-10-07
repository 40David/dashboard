import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const IrrigationDashboard = () => {
  const [sensorData, setSensorData] = useState(null);
  const [predictedMotorState, setPredictedMotorState] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeSection, setActiveSection] = useState('live');
  const [tempHistory, setTempHistory] = useState([]);
  const [debugInfo, setDebugInfo] = useState('Waiting for data...');

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const fetchData = async () => {
  try {
    const response = await fetch(${backendUrl}/dashboard-data/ESP32_001);
    const data = await response.json();
    setDebugInfo(`Data from ${JSON.stringify(data, null, 2)}`);
    if (data) {
      setSensorData(data);
      const now = new Date();
      const timeStr = now.toLocaleTimeString();
      setTempHistory(prev => {
        const newHistory = [...prev, { time: timeStr, temp: data.temperature || 0 }];
        return newHistory.slice(-20);
      });
    }
  } catch (error) {
    setDebugInfo(`Error fetching from /dashboard-data/ESP32_001: ${error.message}`);
  }
};

const fetchPrediction = async () => {
  try {
    const response = await fetch(`${backendUrl}/dashboard-data/ESP32_001`);
    const data = await response.json();
    setPredictedMotorState(data.prediction);
  } catch (error) {
    console.error("Error fetching prediction:", error);
  }
};

    fetchData();
    fetchPrediction();
    const interval = setInterval(() => {
      fetchData();
      fetchPrediction();
    }, 5000); // Fetch data every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isMotorOn = sensorData?.motor === 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-700 text-gray-200 p-5 font-sans w-full">
      <div className=" mx-auto">
        {/* Header */}
        <header className="text-center mb-8 p-5 bg-gray-700 bg-opacity-5 rounded-xl backdrop-blur-sm">
          <h1 className="text-4xl text-white mb-2">💧 Irrigation Dashboard</h1>
          <div className="text-gray-400 text-sm">
            Last updated: {currentTime.toLocaleTimeString()} - {currentTime.toLocaleDateString()}
          </div>
          <div className="inline-block px-4 py-1 rounded-full text-sm mt-2 bg-green-500 bg-opacity-20 text-green-400">
            ● Connected to Express Backend
          </div>
        </header>

        {/* Debug Info */}
        <div className="bg-gray-700 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-lg p-4 mb-5 font-mono text-sm">
          <pre className="m-0 whitespace-pre-wrap">{debugInfo}</pre>
        </div>

        {/* Navigation */}
        <nav className="flex justify-center gap-2 mb-8">
          <button
            className={`px-8 py-3 rounded-lg text-base transition-all border-2 ${
              activeSection === 'live'

                ? 'bg-gray-600 border-gray-900 text-white'
                : 'bg-gray-800 border-gray-900 text-white'
            }`}
            onClick={() => setActiveSection('live')}
          >
            Live Data
          </button>
          <button
            className={`px-8 py-3 rounded-lg text-base transition-all border-2 ${
              activeSection === 'history'
              ? 'bg-gray-600 border-gray-900 text-white'
                : 'bg-gray-800 border-gray-900 text-white'
            }`}
            onClick={() => setActiveSection('history')}
          >
            Historical Data
          </button>
        </nav>

        {/* Live Data Section */}
        {activeSection === 'live' && (
          <div>
            {/* Sensor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <SensorCard
                title="Temperature"
                icon="🌡️"
                value={sensorData?.temperature?.toFixed(1) || '--'}
                unit="°C"
              />
              <SensorCard
                title="Humidity"
                icon="💧"
                value={sensorData?.humidity?.toFixed(0) || '--'}
                unit="%"
              />
              <SensorCard
                title="Soil Moisture"
                icon="🌱"
                value={sensorData?.soil_moistu?.toFixed(0) || '--'}
                unit="%"
              />
              <SensorCard
                title="Motor Status"
                icon="⚙️"
                value={isMotorOn ? 'ON' : 'OFF'}
                unit="Status"
                valueColor={isMotorOn ? '#00b894' : '#636e72'}
              />
            </div>

            {/* Motor Control */}
            <div className="bg-gray-700 bg-opacity-5 rounded-xl p-8 mb-8">
              <h2 className="text-2xl mb-5 text-white">Motor Control</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                <div className="bg-gray-700 bg-opacity-8 rounded-lg p-5 border-l-4 border-blue-400">
                  <div className="text-lg font-semibold mb-4 flex items-center">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${isMotorOn ? 'bg-green-500' : 'bg-gray-600'}`}></span>
                    Irrigation Motor
                  </div>
                  <div className="flex justify-around mt-4 pt-4 border-t border-white border-opacity-10">
                    <div className="text-center">
                      <div className="text-xs text-gray-400 mb-1">State</div>
                      <div className="text-lg font-bold text-white">{sensorData?.motor ?? '--'}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-400 mb-1">Status</div>
                      <div className="text-lg font-bold text-white">{isMotorOn ? 'Running' : 'Stopped'}</div>
                    </div>
                     <div className="text-center">
                      <div className="text-xs text-gray-400 mb-1">Predicted State</div>
                      <div className="text-lg font-bold text-white">{predictedMotorState ?? '--'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Historical Data Section */}
        {activeSection === 'history' && (
          <div>
            <div className="bg-gray=700 bg-opacity-8 rounded-xl p-8 mb-8 border border-white border-opacity-10">
              <h3 className="text-2xl mb-5 text-white">Temperature Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={tempHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="time" stroke="#b0b0b0" />
                  <YAxis stroke="#b0b0b0" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#2d3436', border: '1px solid #636e72' }}
                    labelStyle={{ color: '#e4e4e4' }}
                  />
                  <Legend wrapperStyle={{ color: '#e4e4e4' }} />
                  <Line type="monotone" dataKey="temp" stroke="#74b9ff" name="Temperature (°C)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-700 bg-opacity-8 rounded-xl p-8 mb-8 border border-white border-opacity-10">
              <h3 className="text-2xl mb-5 text-white">Motor Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[{ name: 'Motor Status', value: sensorData?.prediction || 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#b0b0b0" />
                  <YAxis domain={[0, 1]} ticks={[0, 1]} stroke="#b0b0b0" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#2d3436', border: '1px solid #636e72' }}
                  />
                  <Bar dataKey="value" fill={isMotorOn ? '#00b894' : '#636e72'} radius={8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Sensor Card Component
const SensorCard = ({ title, icon, value, unit, valueColor = '#74b9ff' }) => (
  <div className="bg-gray-700 bg-opacity-8 rounded-xl p-6 border border-white border-opacity-10">
    <div className="flex justify-between items-center mb-5">
      <span className="text-lg text-white font-semibold">{title}</span>
      <div className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center text-xl">
        {icon}
      </div>
    </div>
    <div className="text-4xl font-bold mb-2" style={{ color: valueColor }}>{value}</div>
    <div className="text-gray-400 text-sm">{unit}</div>
  </div>
);

export default IrrigationDashboard;