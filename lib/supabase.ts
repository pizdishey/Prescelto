import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Типы данных для таблиц
export interface User {
  id: string;
  username: string;
  email: string;
  hwid?: string;
  subscription_end?: string;
  subscription_type?: 'basic' | 'premium' | 'maximum';
  referral_code?: string;
  bonus_points?: number;
  created_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  plan_type: 'basic' | 'premium' | 'maximum';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

// Функции для работы с пользователями
export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }
  
  return data;
}

export async function createUser(userData: Partial<User>): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating user:', error);
    return null;
  }
  
  return data;
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating user:', error);
    return null;
  }
  
  return data;
}

// Функции для работы с покупками
export async function createPurchase(purchaseData: Partial<Purchase>): Promise<Purchase | null> {
  const { data, error } = await supabase
    .from('purchases')
    .insert([purchaseData])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating purchase:', error);
    return null;
  }
  
  return data;
}

export async function getUserPurchases(userId: string): Promise<Purchase[]> {
  const { data, error } = await supabase
    .from('purchases')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching purchases:', error);
    return [];
  }
  
  return data || [];
}

// Функции для работы с HWID
export async function updateHWID(userId: string, hwid: string): Promise<boolean> {
  const { error } = await supabase
    .from('users')
    .update({ hwid })
    .eq('id', userId);
  
  if (error) {
    console.error('Error updating HWID:', error);
    return false;
  }
  
  return true;
}

// Функции для работы с реферальной системой
export async function applyReferralCode(userId: string, referralCode: string): Promise<boolean> {
  // Находим владельца реферального кода
  const { data: referrer } = await supabase
    .from('users')
    .select('id, bonus_points')
    .eq('referral_code', referralCode)
    .single();

  if (!referrer) return false;

  // Начисляем бонусные баллы обоим пользователям
  const updates = [
    updateUser(referrer.id, { bonus_points: (referrer.bonus_points || 0) + 100 }),
    updateUser(userId, { bonus_points: 100 })
  ];

  try {
    await Promise.all(updates);
    return true;
  } catch (error) {
    console.error('Error applying referral code:', error);
    return false;
  }
} 