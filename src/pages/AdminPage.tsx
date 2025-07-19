import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Download, 
  Users, 
  Activity, 
  TrendingUp,
  Eye,
  Lock,
  LogOut
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { storage } from '../utils/storage';
import { AdminCase } from '../types';

const AdminPage: React.FC = () => {
  const { t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [adminCases, setAdminCases] = useState<AdminCase[]>([]);
  const [stats, setStats] = useState({
    totalScans: 0,
    uniqueDiseases: 0,
    activeUsers: 0,
    avgAccuracy: 0
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const loadDashboardData = () => {
    const cases = storage.getAdminCases();
    setAdminCases(cases);

    // Calculate statistics
    const totalScans = cases.length;
    const uniqueDiseases = new Set(cases.map(c => c.disease)).size;
    const activeUsers = Math.floor(totalScans * 0.3); // Mock calculation
    const avgAccuracy = cases.length > 0 
      ? Math.round(cases.reduce((sum, c) => sum + c.confidence, 0) / cases.length)
      : 0;

    setStats({
      totalScans,
      uniqueDiseases,
      activeUsers,
      avgAccuracy
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded authentication
    if (credentials.username === 'admin' && credentials.password === 'agro123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials. Use username: admin, password: agro123');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCredentials({ username: '', password: '' });
  };

  const handleExportCSV = () => {
    const csvContent = storage.exportAdminCasesToCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agroguardian-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <div className="text-center mb-8">
            <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
              <Lock className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-green-800 mb-2">
              {t('admin.login')}
            </h1>
            <p className="text-green-600">Access the admin dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-green-800 font-medium mb-2">
                {t('admin.username')}
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="w-full p-3 border border-green-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block text-green-800 font-medium mb-2">
                {t('admin.password')}
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full p-3 border border-green-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {t('admin.signin')}
            </button>
          </form>

          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-700">
              <strong>Demo Credentials:</strong><br />
              Username: admin<br />
              Password: agro123
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">
            {t('admin.title')}
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">{t('admin.total.scans')}</p>
                <p className="text-3xl font-bold text-green-800">{stats.totalScans}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">{t('admin.diseases.detected')}</p>
                <p className="text-3xl font-bold text-green-800">{stats.uniqueDiseases}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">{t('admin.users.active')}</p>
                <p className="text-3xl font-bold text-green-800">{stats.activeUsers}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">{t('admin.accuracy')}</p>
                <p className="text-3xl font-bold text-green-800">{stats.avgAccuracy}%</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Cases */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-green-800">
              {t('admin.recent.cases')}
            </h2>
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{t('admin.export')}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-green-200">
                  <th className="text-left py-3 px-4 font-semibold text-green-800">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-green-800">{t('admin.crop')}</th>
                  <th className="text-left py-3 px-4 font-semibold text-green-800">{t('admin.disease')}</th>
                  <th className="text-left py-3 px-4 font-semibold text-green-800">{t('admin.date')}</th>
                  <th className="text-left py-3 px-4 font-semibold text-green-800">{t('admin.language')}</th>
                  <th className="text-left py-3 px-4 font-semibold text-green-800">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {adminCases.slice(0, 20).map((case_, index) => (
                  <tr key={case_.id} className={index % 2 === 0 ? 'bg-green-25' : ''}>
                    <td className="py-3 px-4 text-sm text-green-700">{case_.id.slice(-8)}</td>
                    <td className="py-3 px-4 text-sm text-green-700 capitalize">{case_.crop}</td>
                    <td className="py-3 px-4 text-sm text-green-700">{case_.disease}</td>
                    <td className="py-3 px-4 text-sm text-green-700">
                      {new Date(case_.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-green-700 uppercase">{case_.language}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        case_.confidence >= 80 
                          ? 'bg-green-100 text-green-800'
                          : case_.confidence >= 60
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {case_.confidence}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {adminCases.length === 0 && (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-green-300 mx-auto mb-4" />
              <p className="text-green-600">No data available yet. Start by uploading some crop images!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;