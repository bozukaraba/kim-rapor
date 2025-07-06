import React, { useState } from 'react';
import { User, Lock, Building } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { auth, signInWithEmailAndPassword } from '../firebase';

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

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Geçici çözüm - Firebase Auth olmadan test
      const user = {
        id: 'demo-user-id',
        name: 'Demo Kullanıcı',
        email: 'demo@kimrapor.com',
        role: 'analyst' as const,
        department: 'Demo Departman'
      };
      setUser(user);
      
      // Firebase Authentication aktif olduğunda bu kısım kullanılacak:
      // const demoEmail = 'demo@kimrapor.com';
      // const demoPassword = 'demo123';
      // const userCredential = await signInWithEmailAndPassword(auth, demoEmail, demoPassword);
      // const user = {
      //   id: userCredential.user.uid,
      //   name: 'Demo Kullanıcı',
      //   email: demoEmail,
      //   role: 'analyst' as const,
      //   department: 'Demo Departman'
      // };
      // setUser(user);
    } catch (err) {
      console.error('Demo login error:', err);
      setError('Demo girişi başarısız.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = {
        id: userCredential.user.uid,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department
      };
      setUser(user);
    } catch (err) {
      console.error('Login error:', err);
      setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Giriş Yap</h2>
        
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
              />
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;