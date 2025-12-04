import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mascot } from '@/components/mascot/Mascot';
import { useApp } from '@/contexts/AppContext';
import { OnboardingStep, MascotType, UserProfile } from '@/types/app';
import { ChevronRight, ChevronLeft, Heart, Sparkles, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, addDays } from 'date-fns';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

const triggers = [
  'Stress', 'Social situations', 'Boredom', 'After meals', 
  'Commuting', 'Alcohol', 'Coffee', 'Work breaks'
];

const motivations = [
  'Better health', 'Save money', 'Family', 'Appearance',
  'Sports/Fitness', 'Smell better', 'Be free', 'Live longer'
];

const mascots: { type: MascotType; name: string; personality: string }[] = [
  { type: 'dragon', name: 'Ember', personality: 'Warm & motivating' },
  { type: 'fox', name: 'Maple', personality: 'Clever & supportive' },
  { type: 'sprout', name: 'Bloom', personality: 'Calm & nurturing' },
  { type: 'robot', name: 'Chip', personality: 'Logical & encouraging' },
];

export const OnboardingFlow: React.FC = () => {
  const { setUser, setIsOnboarded } = useApp();
  const [[step, direction], setStep] = useState<[OnboardingStep, number]>(['welcome', 0]);
  
  // Form state
  const [cigarettesPerDay, setCigarettesPerDay] = useState(10);
  const [yearsSmoked, setYearsSmoked] = useState(5);
  const [costPerPack, setCostPerPack] = useState(12);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [selectedMotivations, setSelectedMotivations] = useState<string[]>([]);
  const [quitMode, setQuitMode] = useState<'now' | 'later'>('now');
  const [quitDate, setQuitDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedMascot, setSelectedMascot] = useState<MascotType>('dragon');

  const steps: OnboardingStep[] = ['welcome', 'consent', 'smoking-profile', 'goal', 'mascot', 'summary'];
  const currentIndex = steps.indexOf(step);

  const goNext = () => {
    if (currentIndex < steps.length - 1) {
      setStep([steps[currentIndex + 1], 1]);
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setStep([steps[currentIndex - 1], -1]);
    }
  };

  const completeOnboarding = () => {
    const mascotData = mascots.find(m => m.type === selectedMascot)!;
    const user: UserProfile = {
      id: Date.now().toString(),
      cigarettesPerDay,
      yearsSmoked,
      costPerPack,
      cigarettesPerPack: 20,
      quitDate: quitMode === 'now' ? format(new Date(), 'yyyy-MM-dd') : quitDate,
      triggers: selectedTriggers,
      motivations: selectedMotivations,
      mascot: {
        type: selectedMascot,
        name: mascotData.name,
        stage: 'baby',
        mood: 'happy',
        accessories: [],
      },
    };
    setUser(user);
    setIsOnboarded(true);
  };

  const yearlySavings = Math.round((cigarettesPerDay / 20) * costPerPack * 365);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress indicator */}
      {step !== 'welcome' && (
        <div className="p-4 safe-top">
          <div className="flex gap-1.5">
            {steps.slice(1).map((s, i) => (
              <div
                key={s}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-colors duration-300',
                  i < currentIndex ? 'bg-primary' : 'bg-muted'
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-md"
          >
            {/* Welcome */}
            {step === 'welcome' && (
              <div className="text-center space-y-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  <Mascot type="dragon" stage="baby" mood="excited" size="xl" className="mx-auto" />
                </motion.div>
                <div className="space-y-3">
                  <h1 className="text-3xl font-bold text-foreground">Quit Buddy</h1>
                  <p className="text-lg text-muted-foreground">
                    Your cute companion to quit smoking
                  </p>
                </div>
                <div className="space-y-3 pt-4">
                  <Button variant="accent" size="xl" className="w-full" onClick={goNext}>
                    <Sparkles className="w-5 h-5" />
                    Get Started
                  </Button>
                  <Button variant="ghost" size="lg" className="w-full text-muted-foreground">
                    I'm just exploring
                  </Button>
                </div>
              </div>
            )}

            {/* Consent */}
            {step === 'consent' && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <Heart className="w-12 h-12 text-accent mx-auto" />
                  <h2 className="text-2xl font-bold">Your Privacy Matters</h2>
                </div>
                <Card variant="soft" className="p-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Quit Buddy is designed to support your journey to becoming smoke-free. 
                    Your data stays on your device and is only used to personalize your experience. 
                    We never sell or share your information.
                  </p>
                </Card>
                <div className="flex items-start gap-3 p-4 bg-success-light rounded-xl">
                  <Check className="w-5 h-5 text-success mt-0.5" />
                  <p className="text-sm">
                    I agree to the Terms of Service and Privacy Policy
                  </p>
                </div>
              </div>
            )}

            {/* Smoking Profile */}
            {step === 'smoking-profile' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold">About Your Smoking</h2>
                  <p className="text-muted-foreground mt-1">This helps us personalize your plan</p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Cigarettes per day</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="1"
                        max="60"
                        value={cigarettesPerDay}
                        onChange={(e) => setCigarettesPerDay(Number(e.target.value))}
                        className="flex-1 accent-primary"
                      />
                      <span className="w-12 text-center font-bold text-lg">{cigarettesPerDay}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Years smoking</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="1"
                        max="50"
                        value={yearsSmoked}
                        onChange={(e) => setYearsSmoked(Number(e.target.value))}
                        className="flex-1 accent-primary"
                      />
                      <span className="w-12 text-center font-bold text-lg">{yearsSmoked}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Cost per pack ($)</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="5"
                        max="30"
                        value={costPerPack}
                        onChange={(e) => setCostPerPack(Number(e.target.value))}
                        className="flex-1 accent-primary"
                      />
                      <span className="w-12 text-center font-bold text-lg">${costPerPack}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Common triggers</label>
                    <div className="flex flex-wrap gap-2">
                      {triggers.map((trigger) => (
                        <button
                          key={trigger}
                          onClick={() => setSelectedTriggers(prev => 
                            prev.includes(trigger) 
                              ? prev.filter(t => t !== trigger)
                              : [...prev, trigger]
                          )}
                          className={cn(
                            'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                            selectedTriggers.includes(trigger)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          )}
                        >
                          {trigger}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Goal */}
            {step === 'goal' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold">Set Your Goal</h2>
                  <p className="text-muted-foreground mt-1">When do you want to quit?</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Card
                    variant={quitMode === 'now' ? 'primary' : 'soft'}
                    className={cn(
                      'p-4 cursor-pointer transition-all',
                      quitMode === 'now' && 'ring-2 ring-primary'
                    )}
                    onClick={() => setQuitMode('now')}
                  >
                    <p className="font-bold text-lg">Quit Today</p>
                    <p className="text-sm text-muted-foreground">Start fresh right now</p>
                  </Card>
                  <Card
                    variant={quitMode === 'later' ? 'primary' : 'soft'}
                    className={cn(
                      'p-4 cursor-pointer transition-all',
                      quitMode === 'later' && 'ring-2 ring-primary'
                    )}
                    onClick={() => setQuitMode('later')}
                  >
                    <p className="font-bold text-lg">Set a Date</p>
                    <p className="text-sm text-muted-foreground">Prepare first</p>
                  </Card>
                </div>

                {quitMode === 'later' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quit Date</label>
                    <input
                      type="date"
                      value={quitDate}
                      min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                      onChange={(e) => setQuitDate(e.target.value)}
                      className="w-full p-3 rounded-xl border bg-card"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <label className="text-sm font-medium">What motivates you?</label>
                  <div className="flex flex-wrap gap-2">
                    {motivations.map((motivation) => (
                      <button
                        key={motivation}
                        onClick={() => setSelectedMotivations(prev => 
                          prev.includes(motivation) 
                            ? prev.filter(m => m !== motivation)
                            : [...prev, motivation]
                        )}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                          selectedMotivations.includes(motivation)
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        )}
                      >
                        {motivation}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mascot Selection */}
            {step === 'mascot' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold">Choose Your Buddy</h2>
                  <p className="text-muted-foreground mt-1">They'll grow with you on your journey</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {mascots.map((mascot) => (
                    <Card
                      key={mascot.type}
                      variant={selectedMascot === mascot.type ? 'mascot' : 'interactive'}
                      className={cn(
                        'p-4 text-center',
                        selectedMascot === mascot.type && 'ring-2 ring-primary'
                      )}
                      onClick={() => setSelectedMascot(mascot.type)}
                    >
                      <Mascot
                        type={mascot.type}
                        stage="baby"
                        mood="happy"
                        size="md"
                        className="mx-auto mb-2"
                      />
                      <p className="font-bold">{mascot.name}</p>
                      <p className="text-xs text-muted-foreground">{mascot.personality}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            {step === 'summary' && (
              <div className="space-y-6">
                <div className="text-center">
                  <Mascot
                    type={selectedMascot}
                    stage="baby"
                    mood="excited"
                    size="lg"
                    className="mx-auto mb-4"
                  />
                  <h2 className="text-2xl font-bold">You're All Set!</h2>
                  <p className="text-muted-foreground mt-1">
                    {mascots.find(m => m.type === selectedMascot)?.name} is ready to support you
                  </p>
                </div>

                <Card variant="soft" className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quit Date</span>
                    <span className="font-semibold">
                      {quitMode === 'now' ? 'Today' : format(new Date(quitDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cigarettes/day</span>
                    <span className="font-semibold">{cigarettesPerDay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Years saved in first year</span>
                    <span className="font-bold text-success">${yearlySavings}</span>
                  </div>
                </Card>

                <Button variant="accent" size="xl" className="w-full" onClick={completeOnboarding}>
                  <Sparkles className="w-5 h-5" />
                  Meet Your Buddy
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {step !== 'welcome' && step !== 'summary' && (
        <div className="p-4 flex gap-3 safe-bottom">
          <Button variant="ghost" size="lg" onClick={goBack}>
            <ChevronLeft className="w-5 h-5" />
            Back
          </Button>
          <Button variant="default" size="lg" className="flex-1" onClick={goNext}>
            Continue
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default OnboardingFlow;
