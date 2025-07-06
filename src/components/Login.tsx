import React, { useState } from 'react';
import { User, Lock, Building } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { signInWithEmail, signUpWithEmail } from '../supabase';

const Login: React.FC = () => {
  const { setUser } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'analyst' as const,
    department: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Demo kullanıcı bilgileri
      const demoEmail = 'demo@kimrapor.com';
      const demoPassword = 'demo123456';
      
      const { data, error } = await signInWithEmail(demoEmail, demoPassword);
      
      if (error) {
        // Demo kullanıcı yoksa oluştur
        const { data: signUpData, error: signUpError } = await signUpWithEmail(
          demoEmail, 
          demoPassword, 
          {
            name: 'Demo Kullanıcı',
            role: 'analyst',
            department: 'Demo Departman'
          }
        );
        
        if (signUpError) throw signUpError;
        
        if (signUpData.user) {
          const user = {
            id: signUpData.user.id,
            name: 'Demo Kullanıcı',
            email: demoEmail,
            role: 'analyst' as const,
            department: 'Demo Departman'
          };
          setUser(user);
        }
      } else if (data.user) {
        const user = {
          id: data.user.id,
          name: 'Demo Kullanıcı',
          email: demoEmail,
          role: 'analyst' as const,
          department: 'Demo Departman'
        };
        setUser(user);
      }
    } catch (err: any) {
      console.error('Demo login error:', err);
      setError('Demo girişi başarısız: ' + err.message);
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
        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignUp ? 'Kayıt Ol' : 'Giriş Yap'}
        </h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 mb-4"
          >
            {loading ? 'Giriş yapılıyor...' : 'Demo ile Giriş Yap'}
          </button>
          <div className="text-center text-sm text-gray-500 mb-4">veya</div>
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
                  onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="analyst">Analist</option>
                  <option value="manager">Yönetici</option>
                  <option value="admin">Admin</option>
                </select>
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
      </div>
    </div>
  );
};

export default Login;