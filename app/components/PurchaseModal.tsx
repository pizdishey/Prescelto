import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FaTimes, FaCheck, FaCoins } from 'react-icons/fa';
import type { UserData } from './AuthModal';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    name: string;
    price: string;
    duration: string;
  };
  user?: UserData | null;
  onPurchaseComplete?: () => void;
}

type PromoCodesType = {
  [key: string]: number;
};

const PROMO_CODES: PromoCodesType = {
  'LAUNCH': 20, // 20% скидка
  'WINTER': 15, // 15% скидка
  'FRIEND': 10, // 10% скидка
};

export default function PurchaseModal({ isOpen, onClose, plan, user, onPurchaseComplete }: PurchaseModalProps) {
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [usedBonusPoints, setUsedBonusPoints] = useState(0);

  const basePrice = parseInt(plan.price.replace('₽', ''));
  const maxBonusPoints = user ? Math.min(user.bonusPoints, basePrice) : 0;
  const discountAmount = basePrice * discount / 100;
  const bonusDiscount = usedBonusPoints;
  const finalPrice = Math.max(0, basePrice - discountAmount - bonusDiscount);

  const handlePromoCode = () => {
    const code = promoCode.toUpperCase();
    if (PROMO_CODES[code]) {
      setDiscount(PROMO_CODES[code]);
      setPromoSuccess(`Промокод применён! Скидка ${PROMO_CODES[code]}%`);
      setPromoError('');
    } else {
      setPromoError('Неверный промокод');
      setPromoSuccess('');
      setDiscount(0);
    }
  };

  const handleBonusPointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setUsedBonusPoints(Math.min(value, maxBonusPoints));
  };

  const handlePurchase = () => {
    // В реальном приложении здесь будет API-запрос
    if (onPurchaseComplete) {
      onPurchaseComplete();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-dark-lighter rounded-xl p-6 max-w-md w-full relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <FaTimes />
            </button>

            <h2 className="text-2xl font-bold mb-4">Покупка {plan.name}</h2>
            <p className="text-gray-300 mb-6">
              Длительность: {plan.duration}
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Промокод
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="bg-dark text-white px-4 py-2 rounded-lg flex-1"
                  placeholder="Введите промокод"
                />
                <button
                  onClick={handlePromoCode}
                  className="px-4 py-2 bg-primary hover:bg-secondary rounded-lg transition-all"
                >
                  Применить
                </button>
              </div>
              {promoError && (
                <p className="text-red-500 text-sm mt-2">{promoError}</p>
              )}
              {promoSuccess && (
                <p className="text-green-500 text-sm mt-2 flex items-center gap-2">
                  <FaCheck /> {promoSuccess}
                </p>
              )}
            </div>

            {user && user.bonusPoints > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <FaCoins className="inline mr-2" />
                  Использовать бонусные баллы ({user.bonusPoints} доступно)
                </label>
                <input
                  type="number"
                  min="0"
                  max={maxBonusPoints}
                  value={usedBonusPoints}
                  onChange={handleBonusPointsChange}
                  className="w-full bg-dark text-white px-4 py-2 rounded-lg"
                />
              </div>
            )}

            <div className="border-t border-dark pt-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Базовая стоимость:</span>
                <span className="text-gray-300">{plan.price}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Скидка по промокоду:</span>
                  <span className="text-green-500">-{discountAmount}₽</span>
                </div>
              )}
              {usedBonusPoints > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Бонусные баллы:</span>
                  <span className="text-green-500">-{usedBonusPoints}₽</span>
                </div>
              )}
              <div className="flex justify-between items-center text-lg font-bold mt-2">
                <span>Итого:</span>
                <span>{finalPrice}₽</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-dark hover:bg-dark-darker rounded-lg transition-all"
              >
                Отмена
              </button>
              <button
                onClick={handlePurchase}
                className="flex-1 px-4 py-2 bg-primary hover:bg-secondary rounded-lg transition-all"
              >
                Оплатить
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 