import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaLock, FaGift } from 'react-icons/fa';
import { supabase, createUser, getUserByEmail } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: UserData) => void;
}

export interface UserData {
  id: string;
  username: string;
  email: string;
  referralCode: string;
  referredBy?: string;
  bonusPoints: number;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    referralCode: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        // Вход
        const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (signInError) throw signInError;

        const user = await getUserByEmail(formData.email);
        if (!user) throw new Error('Пользователь не найден');

        onSuccess({
          id: user.id,
          username: user.username,
          email: user.email,
          referralCode: user.referral_code || '',
          bonusPoints: user.bonus_points || 0,
        });
      } else {
        // Регистрация
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (signUpError) throw signUpError;

        // Создаем запись в таблице users
        const newUser = await createUser({
          id: authData.user?.id,
          username: formData.username,
          email: formData.email,
          referral_code: Math.random().toString(36).substr(2, 8).toUpperCase(),
          bonus_points: 0,
        });

        if (!newUser) throw new Error('Ошибка при создании пользователя');

        onSuccess({
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          referralCode: newUser.referral_code || '',
          bonusPoints: newUser.bonus_points || 0,
        });
      }

      onClose();
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Произошла ошибка при авторизации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-dark-lighter rounded-xl p-6 max-w-md w-full relative shadow-lg"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
            >
              <FaTimes />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
              {isLogin ? 'Вход' : 'Регистрация'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaUser className="inline mr-2" />
                  Имя пользователя
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-dark border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaEnvelope className="inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-dark border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaLock className="inline mr-2" />
                  Пароль
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-dark border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary/50"
                  required
                  minLength={6}
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaGift className="inline mr-2" />
                    Реферальный код (необязательно)
                  </label>
                  <input
                    type="text"
                    value={formData.referralCode}
                    onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-dark border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary/50"
                    placeholder="Введите код друга"
                  />
                </div>
              )}

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-6 bg-primary text-white hover:bg-secondary rounded-lg transition-all font-medium ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-primary hover:text-secondary font-medium"
              >
                {isLogin ? 'Создать аккаунт' : 'Уже есть аккаунт? Войти'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 