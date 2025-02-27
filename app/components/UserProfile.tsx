import { motion } from 'framer-motion';
import { FaUser, FaGift, FaCopy, FaCheck } from 'react-icons/fa';
import { useState } from 'react';
import type { UserData } from './AuthModal';

interface UserProfileProps {
  user: UserData;
  onLogout: () => void;
}

export default function UserProfile({ user, onLogout }: UserProfileProps) {
  const [copied, setCopied] = useState(false);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const referralLink = `${window.location.origin}?ref=${user.referralCode}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-dark-lighter rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <FaUser className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user.username}</h3>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-dark dark:text-gray-300 dark:hover:bg-dark-darker rounded-lg transition-all"
        >
          Выйти
        </button>
      </div>

      <div className="space-y-6">
        <div className="p-4 bg-gray-50 dark:bg-dark rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <FaGift className="text-primary" />
            <h4 className="font-medium text-gray-900 dark:text-white">Реферальная программа</h4>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Приглашайте друзей и получайте бонусные баллы!
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Ваш реферальный код:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={user.referralCode}
                  readOnly
                  className="bg-white dark:bg-dark-darker text-gray-900 dark:text-white px-4 py-2 rounded-lg flex-1 border border-gray-200 dark:border-gray-700"
                />
                <button
                  onClick={copyReferralCode}
                  className="px-4 py-2 bg-primary text-white hover:bg-secondary rounded-lg transition-all flex items-center gap-2"
                >
                  {copied ? <FaCheck /> : <FaCopy />}
                  {copied ? 'Скопировано!' : 'Копировать'}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Реферальная ссылка:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="bg-white dark:bg-dark-darker text-gray-900 dark:text-white px-4 py-2 rounded-lg flex-1 text-sm border border-gray-200 dark:border-gray-700"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-dark rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Ваши бонусы</h4>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Бонусные баллы:</span>
            <span className="text-2xl font-bold text-primary">{user.bonusPoints}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            1 бонусный балл = 1₽ скидки на следующую покупку
          </p>
        </div>

        {user.referredBy && (
          <div className="p-4 bg-gray-50 dark:bg-dark rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Вы были приглашены</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Код пригласившего: {user.referredBy}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
} 