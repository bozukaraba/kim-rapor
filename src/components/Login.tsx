import React, { useState } from 'react';
import { User, Lock, Building, Shield, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { signInWithEmail, signUpWithEmail } from '../firebase';

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
        
        if (error) {
          // Production-ready error handling
          if (error.message.includes('email-already-in-use')) {
            throw new Error('Bu email adresi zaten kayıtlı. Giriş yapmayı deneyin.');
          } else if (error.message.includes('weak-password')) {
            throw new Error('Şifre en az 6 karakter olmalı.');
          } else if (error.message.includes('invalid-email')) {
            throw new Error('Geçerli bir email adresi girin.');
          } else {
            throw new Error('Kayıt işlemi başarısız. Demo hesapları kullanabilirsiniz.');
          }
        }
        
        if (data.user) {
          const user = {
            id: data.user.uid,
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
        
        if (error) {
          // Production-ready error handling for login
          if (error.message.includes('user-not-found') || error.message.includes('wrong-password')) {
            throw new Error('Email veya şifre hatalı.');
          } else if (error.message.includes('too-many-requests')) {
            throw new Error('Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin.');
          } else {
            throw new Error('Giriş başarısız. Demo hesapları kullanabilirsiniz.');
          }
        }
        
        if (data.user) {
          const user = {
            id: data.user.uid,
            name: data.user.displayName || data.user.email || 'Kullanıcı',
            email: data.user.email || formData.email,
            role: 'staff' as 'admin' | 'staff', // Default role, Firebase'de metadata farklı çalışır
            department: 'Genel'
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

        {/* Demo Giriş Butonları - ANA GIRIŞ YÖNTEMİ */}
        <div className="mb-6 space-y-3">
          <p className="text-sm font-medium text-gray-700 text-center">🚀 Hızlı Giriş (Önerilen)</p>
          
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
          
          <div className="text-center text-sm text-gray-500">
            veya{' '}
            <span className="text-blue-600 font-medium">manuel giriş</span>
          </div>
        </div>

        {error && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-800">{error}</p>
                <p className="text-xs text-amber-600 mt-1">
                  💡 Önerilen: Yukarıdaki "Hızlı Giriş" butonlarını kullanın
                </p>
              </div>
            </div>
          </div>
        )}

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