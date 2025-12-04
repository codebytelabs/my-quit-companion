import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mascot } from '@/components/mascot/Mascot';
import { useApp } from '@/contexts/AppContext';
import { AlertCircle, Sparkles, Heart, DollarSign, Cigarette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, differenceInDays, parseISO } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const dailyTips = [
  "Remember: cravings only last 3-5 minutes. You can ride it out!",
  "Your taste buds are recovering – food will taste better soon!",
  "Every smoke-free hour is healing your body.",
  "Stay hydrated – it helps manage cravings.",
  "You're saving money with every cigarette you don't smoke!",
];

const focusTasks = [
  { id: 1, title: "Take 3 deep breaths", completed: false },
  { id: 2, title: "Drink a glass of water", completed: false },
  { id: 3, title: "Go for a short walk", completed: false },
];

export const Home: React.FC = () => {
  const { user, streak, totalMoneySaved, cigarettesAvoided, isPreQuit, daysUntilQuit, mascotMood, todayCheckedIn, addDayLog } = useApp();
  const navigate = useNavigate();
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showMascotTalk, setShowMascotTalk] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<'smoke-free' | 'slip' | 'relapse' | null>(null);

  if (!user) return null;

  const todayTip = dailyTips[Math.floor(Date.now() / 86400000) % dailyTips.length];
  
  const handleCheckIn = () => {
    if (checkInStatus) {
      addDayLog({
        date: format(new Date(), 'yyyy-MM-dd'),
        status: checkInStatus,
        mood: 3,
      });
      setShowCheckIn(false);
      setCheckInStatus(null);
    }
  };

  const mascotMessages = [
    `Hey there! You're doing amazing! ${streak.current > 0 ? `${streak.current} days strong!` : "Let's start this journey together!"}`,
    "I believe in you. Every moment counts.",
    "Remember why you started. You've got this!",
  ];

  return (
    <div className="space-y-6 pb-4">
      {/* Mascot Section */}
      <motion.div 
        className="text-center pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative inline-block">
          <Mascot
            type={user.mascot.type}
            stage={user.mascot.stage}
            mood={mascotMood}
            size="xl"
            showGlow={streak.current >= 7}
            onClick={() => setShowMascotTalk(true)}
          />
          {streak.current >= 7 && (
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 text-streak" />
            </motion.div>
          )}
        </div>

        <motion.div 
          className="mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {isPreQuit ? (
            <div>
              <p className="text-2xl font-bold text-foreground">Pre-Quit Mode</p>
              <p className="text-lg text-muted-foreground">
                {daysUntilQuit} days until your quit date
              </p>
            </div>
          ) : streak.current > 0 ? (
            <div>
              <p className="text-3xl font-bold text-foreground">Day {streak.current}</p>
              <p className="text-lg text-muted-foreground">smoke-free 🎉</p>
            </div>
          ) : (
            <div>
              <p className="text-2xl font-bold text-foreground">Fresh Start</p>
              <p className="text-lg text-muted-foreground">Let's begin your journey</p>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          variant={todayCheckedIn ? "soft" : "accent"}
          size="xl"
          className="w-full"
          onClick={() => setShowCheckIn(true)}
          disabled={todayCheckedIn}
        >
          <Heart className="w-5 h-5" />
          {todayCheckedIn ? "Today's Check-in Complete" : "Daily Check-in"}
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="sos"
            size="lg"
            onClick={() => navigate('/sos')}
          >
            <AlertCircle className="w-5 h-5" />
            Craving SOS
          </Button>
          <Button
            variant="soft"
            size="lg"
            onClick={() => navigate('/progress')}
          >
            <Sparkles className="w-5 h-5" />
            Log Feeling
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card variant="primary">
          <CardContent className="p-4 text-center">
            <Cigarette className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold text-foreground">{cigarettesAvoided}</p>
            <p className="text-sm text-muted-foreground">Cigarettes avoided</p>
          </CardContent>
        </Card>
        <Card variant="soft">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-6 h-6 mx-auto mb-2 text-savings" />
            <p className="text-2xl font-bold text-foreground">${totalMoneySaved.toFixed(0)}</p>
            <p className="text-sm text-muted-foreground">Money saved</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Focus */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-3">Today's Focus</h3>
          <div className="space-y-2">
            {focusTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-muted rounded-xl"
              >
                <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                  {task.completed && <div className="w-3 h-3 rounded-full bg-primary" />}
                </div>
                <span className="text-sm font-medium">{task.title}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tip of the Day */}
      <Card variant="glass">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground mb-1">💡 Tip of the day</p>
          <p className="font-medium">{todayTip}</p>
        </CardContent>
      </Card>

      {/* Check-in Dialog */}
      <Dialog open={showCheckIn} onOpenChange={setShowCheckIn}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">How was today?</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {[
              { value: 'smoke-free', label: 'No cigarettes today! 🎉', color: 'bg-success-light border-success' },
              { value: 'slip', label: 'I had one or two 😅', color: 'bg-warning-light border-warning' },
              { value: 'relapse', label: 'I smoked as usual 😔', color: 'bg-danger-light border-danger' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setCheckInStatus(option.value as typeof checkInStatus)}
                className={cn(
                  'w-full p-4 rounded-xl border-2 text-left font-medium transition-all',
                  checkInStatus === option.value ? option.color : 'bg-muted border-transparent hover:border-border'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <Button
            variant="accent"
            size="lg"
            className="w-full"
            disabled={!checkInStatus}
            onClick={handleCheckIn}
          >
            Submit Check-in
          </Button>
        </DialogContent>
      </Dialog>

      {/* Mascot Talk Dialog */}
      <Dialog open={showMascotTalk} onOpenChange={setShowMascotTalk}>
        <DialogContent className="max-w-sm rounded-2xl">
          <div className="text-center py-4">
            <Mascot
              type={user.mascot.type}
              stage={user.mascot.stage}
              mood="happy"
              size="lg"
              className="mx-auto mb-4"
            />
            <p className="text-lg font-medium px-4">
              {mascotMessages[Math.floor(Math.random() * mascotMessages.length)]}
            </p>
          </div>
          <Button variant="soft" onClick={() => setShowMascotTalk(false)}>
            Thanks, {user.mascot.name}! 💕
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
