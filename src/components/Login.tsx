import React, { useState } from 'react';
import { User, Lock, Building, Shield, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { signInWithEmail, signUpWithEmail } from '../supabase';

const Login: React.FC = () => {
  const { setUser } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'staff' as 'admin' | 'staff', // Varsayılan olarak staff
    department: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleDemoLogin = async (demoRole: 'admin' | 'staff') => {
    setLoading(true);
    setError(null);
    
    try {
      const user = {
        id: `demo-${demoRole}-${Date.now()}`,
        name: demoRole === 'admin' ? 'Demo Admin' : 'Demo Personel',
        email: `demo-${demoRole}@example.com`,
        role: demoRole,
        department: demoRole === 'admin' ? 'Yönetim' : 'Pazarlama'
      };
      setUser(user);
      console.log(`${demoRole} demo modu aktif`);
    } catch (err: any) {
      console.error('Demo login error:', err);
      setError(`Demo girişi başarısız: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isSignUp) {
        // Kayıt ol
        const { data, error } = await signUpWithEmail(
          formData.email, 
          formData.password,
          {
            name: formData.name,
            role: formData.role,
            department: formData.department
          }
        );
        
        if (error) throw error;
        
        if (data.user) {
          const user = {
            id: data.user.id,
            name: formData.name,
            email: formData.email,
            role: formData.role,
            department: formData.department
          };
          setUser(user);
        }
      } else {
        // Giriş yap
        const { data, error } = await signInWithEmail(formData.email, formData.password);
        
        if (error) throw error;
        
        if (data.user) {
          const user = {
            id: data.user.id,
            name: formData.name || data.user.email || 'Kullanıcı',
            email: data.user.email || formData.email,
            role: formData.role,
            department: formData.department || 'Genel'
          };
          setUser(user);
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'İşlem başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isSignUp ? 'Kayıt Ol' : 'Giriş Yap'}
          </h2>
          <p className="text-gray-600 mt-2">ReportHub Yönetim Sistemi</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Demo Giriş Butonları */}
        <div className="mb-6 space-y-3">
          <p className="text-sm font-medium text-gray-700 text-center">Demo Hesapları</p>
          
          <button
            onClick={() => handleDemoLogin('admin')}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <Shield className="w-5 h-5" />
            <span>{loading ? 'Giriş yapılıyor...' : 'Admin Olarak Giriş Yap'}</span>
          </button>
          
          <button
            onClick={() => handleDemoLogin('staff')}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <Users className="w-5 h-5" />
            <span>{loading ? 'Giriş yapılıyor...' : 'Personel Olarak Giriş Yap'}</span>
          </button>
          
          <div className="text-center text-sm text-gray-500">veya</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <User className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şifre
            </label>
            <div className="relative">
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                minLength={6}
              />
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {isSignUp && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departman
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <Building className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as 'admin' | 'staff'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="staff">Personel - Veri Girişi</option>
                  <option value="admin">Admin - Yönetim</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.role === 'admin' 
                    ? 'Tüm verileri görüntüleyebilir ve rapor oluşturabilir'
                    : 'Sadece veri girişi yapabilir'
                  }
                </p>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'İşlem yapılıyor...' : (isSignUp ? 'Kayıt Ol' : 'Giriş Yap')}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            {isSignUp ? 'Zaten hesabınız var mı? Giriş yapın' : 'Hesabınız yok mu? Kayıt olun'}
          </button>
        </div>

        {/* Role Açıklamaları */}
        <div className="mt-6 border-t pt-4">
          <p className="text-xs text-gray-500 text-center mb-2">Rol Açıklamaları:</p>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <Shield className="w-3 h-3 text-purple-500" />
              <span><strong>Admin:</strong> Tüm raporları görür, filtreleyebilir, personel verilerini analiz edebilir</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-3 h-3 text-green-500" />
              <span><strong>Personel:</strong> Sadece veri girişi yapar, kendi girdiği verileri görür</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;