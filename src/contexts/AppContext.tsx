import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, DayLog, Streak, Mission, SavingsGoal, MascotMood } from '@/types/app';
import { differenceInDays, format, parseISO, isAfter, isBefore, isToday } from 'date-fns';

interface AppContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  isOnboarded: boolean;
  setIsOnboarded: (value: boolean) => void;
  dayLogs: DayLog[];
  addDayLog: (log: DayLog) => void;
  updateDayLog: (date: string, log: Partial<DayLog>) => void;
  streak: Streak;
  missions: Mission[];
  completeMission: (id: string) => void;
  savingsGoals: SavingsGoal[];
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => void;
  totalMoneySaved: number;
  cigarettesAvoided: number;
  daysUntilQuit: number;
  isPreQuit: boolean;
  mascotMood: MascotMood;
  setMascotMood: (mood: MascotMood) => void;
  todayCheckedIn: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultMissions: Mission[] = [
  { id: '1', title: 'Morning Check-in', description: 'Complete your daily check-in', type: 'daily', progress: 0, target: 1, reward: 10, completed: false },
  { id: '2', title: 'Breathing Exercise', description: 'Complete a 2-minute breathing session', type: 'daily', progress: 0, target: 1, reward: 15, completed: false },
  { id: '3', title: 'Read a Lesson', description: 'Read one article from the learning hub', type: 'daily', progress: 0, target: 1, reward: 10, completed: false },
  { id: '4', title: 'Craving Conquered', description: 'Successfully ride out a craving', type: 'daily', progress: 0, target: 1, reward: 20, completed: false },
  { id: '5', title: '7-Day Warrior', description: 'Stay smoke-free for 7 consecutive days', type: 'weekly', progress: 0, target: 7, reward: 100, completed: false },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('quitbuddy_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    return localStorage.getItem('quitbuddy_onboarded') === 'true';
  });
  
  const [dayLogs, setDayLogs] = useState<DayLog[]>(() => {
    const saved = localStorage.getItem('quitbuddy_logs');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [missions, setMissions] = useState<Mission[]>(() => {
    const saved = localStorage.getItem('quitbuddy_missions');
    return saved ? JSON.parse(saved) : defaultMissions;
  });
  
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem('quitbuddy_goals');
    return saved ? JSON.parse(saved) : [];
  });

  const [mascotMood, setMascotMood] = useState<MascotMood>('happy');

  // Persist state
  useEffect(() => {
    if (user) localStorage.setItem('quitbuddy_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('quitbuddy_onboarded', String(isOnboarded));
  }, [isOnboarded]);

  useEffect(() => {
    localStorage.setItem('quitbuddy_logs', JSON.stringify(dayLogs));
  }, [dayLogs]);

  useEffect(() => {
    localStorage.setItem('quitbuddy_missions', JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem('quitbuddy_goals', JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  const addDayLog = (log: DayLog) => {
    setDayLogs(prev => {
      const existing = prev.findIndex(l => l.date === log.date);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = log;
        return updated;
      }
      return [...prev, log];
    });
  };

  const updateDayLog = (date: string, updates: Partial<DayLog>) => {
    setDayLogs(prev => prev.map(log => 
      log.date === date ? { ...log, ...updates } : log
    ));
  };

  // Calculate streak
  const calculateStreak = (): Streak => {
    if (!user || dayLogs.length === 0) {
      return { current: 0, longest: 0, totalSmokeFree: 0 };
    }

    const smokeFreedays = dayLogs.filter(log => log.status === 'smoke-free');
    const totalSmokeFree = smokeFreedays.length;

    // Sort logs by date descending
    const sortedLogs = [...dayLogs]
      .filter(log => log.status === 'smoke-free' || log.status === 'slip' || log.status === 'relapse')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let current = 0;
    let longest = 0;
    let tempStreak = 0;

    // Calculate current streak (consecutive smoke-free days from today)
    const today = format(new Date(), 'yyyy-MM-dd');
    for (const log of sortedLogs) {
      if (log.status === 'smoke-free') {
        current++;
      } else {
        break;
      }
    }

    // Calculate longest streak
    for (const log of sortedLogs.reverse()) {
      if (log.status === 'smoke-free') {
        tempStreak++;
        longest = Math.max(longest, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    return { current, longest, totalSmokeFree };
  };

  const streak = calculateStreak();

  // Calculate savings
  const totalMoneySaved = user 
    ? (streak.totalSmokeFree * (user.costPerPack / user.cigarettesPerPack) * user.cigarettesPerDay)
    : 0;

  const cigarettesAvoided = user ? streak.totalSmokeFree * user.cigarettesPerDay : 0;

  // Pre-quit status
  const isPreQuit = user ? isAfter(parseISO(user.quitDate), new Date()) : false;
  const daysUntilQuit = user && isPreQuit 
    ? differenceInDays(parseISO(user.quitDate), new Date()) 
    : 0;

  // Today's check-in status
  const todayCheckedIn = dayLogs.some(log => log.date === format(new Date(), 'yyyy-MM-dd'));

  const completeMission = (id: string) => {
    setMissions(prev => prev.map(m => 
      m.id === id ? { ...m, progress: m.target, completed: true } : m
    ));
  };

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => {
    setSavingsGoals(prev => [...prev, {
      ...goal,
      id: Date.now().toString(),
      currentAmount: 0
    }]);
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      isOnboarded,
      setIsOnboarded,
      dayLogs,
      addDayLog,
      updateDayLog,
      streak,
      missions,
      completeMission,
      savingsGoals,
      addSavingsGoal,
      totalMoneySaved,
      cigarettesAvoided,
      daysUntilQuit,
      isPreQuit,
      mascotMood,
      setMascotMood,
      todayCheckedIn,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
