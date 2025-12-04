import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mascot } from '@/components/mascot/Mascot';
import { useApp } from '@/contexts/AppContext';
import { Wind, Gamepad2, MessageCircle, X, ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

type SOSMode = 'menu' | 'breathe' | 'distract' | 'result';

export const CravingSOS: React.FC = () => {
  const { user, setMascotMood } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState<SOSMode>('menu');
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCount, setBreathCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    setMascotMood('calm');
    return () => setMascotMood('happy');
  }, [setMascotMood]);

  // Breathing exercise logic
  useEffect(() => {
    if (mode !== 'breathe') return;

    const phaseDurations = { inhale: 4000, hold: 4000, exhale: 6000 };
    const timeout = setTimeout(() => {
      if (breathPhase === 'inhale') setBreathPhase('hold');
      else if (breathPhase === 'hold') setBreathPhase('exhale');
      else {
        setBreathPhase('inhale');
        setBreathCount(prev => prev + 1);
        if (breathCount >= 4) {
          setMode('result');
        }
      }
    }, phaseDurations[breathPhase]);

    return () => clearTimeout(timeout);
  }, [mode, breathPhase, breathCount]);

  // Distraction game - bubble timer
  useEffect(() => {
    if (mode !== 'distract') return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev >= 60) {
          setMode('result');
          return prev;
        }
        return prev + 1;
      });

      // Add new bubble
      if (Math.random() > 0.5) {
        setBubbles(prev => [...prev, {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: 100 + Math.random() * 20,
        }]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [mode]);

  // Animate bubbles
  useEffect(() => {
    if (mode !== 'distract') return;

    const interval = setInterval(() => {
      setBubbles(prev => prev
        .map(b => ({ ...b, y: b.y - 3 }))
        .filter(b => b.y > -10)
      );
    }, 50);

    return () => clearInterval(interval);
  }, [mode]);

  const popBubble = (id: number) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
    setGameScore(prev => prev + 1);
  };

  const resetAndGoBack = () => {
    setMode('menu');
    setBreathCount(0);
    setBreathPhase('inhale');
    setTimer(0);
    setGameScore(0);
    setBubbles([]);
  };

  if (!user) return null;

  return (
    <div className="min-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon-sm" onClick={() => mode === 'menu' ? navigate(-1) : resetAndGoBack()}>
          {mode === 'menu' ? <X className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
        </Button>
        <h1 className="text-xl font-bold">Craving SOS</h1>
      </div>

      <AnimatePresence mode="wait">
        {/* Menu Mode */}
        {mode === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col"
          >
            {/* Mascot */}
            <div className="text-center mb-6">
              <Mascot
                type={user.mascot.type}
                stage={user.mascot.stage}
                mood="calm"
                size="lg"
                className="mx-auto"
              />
              <p className="mt-4 text-lg font-medium text-muted-foreground">
                What do you need right now?
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3 flex-1">
              <Card
                variant="interactive"
                className="p-4 cursor-pointer"
                onClick={() => setMode('breathe')}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                    <Wind className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold">Ride out the craving</p>
                    <p className="text-sm text-muted-foreground">2-5 minute breathing exercise</p>
                  </div>
                </div>
              </Card>

              <Card
                variant="interactive"
                className="p-4 cursor-pointer"
                onClick={() => setMode('distract')}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Gamepad2 className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold">Quick distraction</p>
                    <p className="text-sm text-muted-foreground">Pop bubbles mini-game</p>
                  </div>
                </div>
              </Card>

              <Card variant="soft" className="p-4 opacity-60">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="font-bold">Talk to someone</p>
                    <p className="text-sm text-muted-foreground">Coming soon</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Reassurance */}
            <Card variant="glass" className="mt-4">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  💪 Remember: cravings typically last only 3-5 minutes. You've got this!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Breathing Mode */}
        {mode === 'breathe' && (
          <motion.div
            key="breathe"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Breath {breathCount + 1} of 5
            </p>

            <motion.div
              className="w-48 h-48 rounded-full gradient-calm flex items-center justify-center mb-8"
              animate={{
                scale: breathPhase === 'inhale' ? 1.3 : breathPhase === 'hold' ? 1.3 : 1,
              }}
              transition={{ duration: breathPhase === 'exhale' ? 6 : 4, ease: 'easeInOut' }}
            >
              <span className="text-2xl font-bold text-primary-foreground capitalize">
                {breathPhase}
              </span>
            </motion.div>

            <p className="text-lg text-muted-foreground">
              {breathPhase === 'inhale' && 'Breathe in slowly through your nose...'}
              {breathPhase === 'hold' && 'Hold your breath gently...'}
              {breathPhase === 'exhale' && 'Release slowly through your mouth...'}
            </p>

            <Button variant="ghost" className="mt-8" onClick={resetAndGoBack}>
              Cancel
            </Button>
          </motion.div>
        )}

        {/* Distraction Mode */}
        {mode === 'distract' && (
          <motion.div
            key="distract"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 relative overflow-hidden bg-primary-light rounded-2xl"
          >
            {/* Timer and Score */}
            <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
              <span className="px-3 py-1 bg-card rounded-full text-sm font-bold">
                {60 - timer}s
              </span>
              <span className="px-3 py-1 bg-card rounded-full text-sm font-bold">
                Score: {gameScore}
              </span>
            </div>

            {/* Bubbles */}
            {bubbles.map((bubble) => (
              <motion.button
                key={bubble.id}
                className="absolute w-12 h-12 rounded-full bg-primary shadow-lg cursor-pointer"
                style={{ left: `${bubble.x}%`, top: `${bubble.y}%` }}
                initial={{ scale: 0 }}
                animate={{ scale: 1, y: -bubble.y * 3 }}
                whileTap={{ scale: 0 }}
                onClick={() => popBubble(bubble.id)}
              />
            ))}

            {/* Instructions */}
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <p className="text-sm font-medium text-primary">
                Tap the bubbles to pop them!
              </p>
            </div>
          </motion.div>
        )}

        {/* Result Mode */}
        {mode === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <Mascot
              type={user.mascot.type}
              stage={user.mascot.stage}
              mood="celebrating"
              size="xl"
              className="mb-6"
            />

            <h2 className="text-2xl font-bold mb-2">Great job! 🎉</h2>
            <p className="text-muted-foreground mb-6">
              You made it through! How do you feel?
            </p>

            <div className="w-full space-y-3">
              <Button
                variant="success"
                size="lg"
                className="w-full"
                onClick={() => navigate('/home')}
              >
                <Check className="w-5 h-5" />
                Craving passed!
              </Button>
              <Button
                variant="soft"
                size="lg"
                className="w-full"
                onClick={resetAndGoBack}
              >
                I need more time
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CravingSOS;
