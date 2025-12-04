import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/contexts/AppContext';
import { DollarSign, Heart, Sparkles, TrendingUp, Plus, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const healthMilestones = [
  { days: 0.014, title: '20 Minutes', description: 'Heart rate and blood pressure begin to drop' },
  { days: 0.5, title: '12 Hours', description: 'Carbon monoxide level in your blood drops to normal' },
  { days: 3, title: '3 Days', description: 'Nicotine is completely out of your body' },
  { days: 14, title: '2 Weeks', description: 'Circulation improves and lung function increases' },
  { days: 30, title: '1 Month', description: 'Coughing and shortness of breath decrease' },
  { days: 90, title: '3 Months', description: 'Risk of heart attack begins to drop' },
  { days: 365, title: '1 Year', description: 'Risk of heart disease is half that of a smoker' },
  { days: 1825, title: '5 Years', description: 'Risk of stroke same as non-smoker' },
  { days: 3650, title: '10 Years', description: 'Risk of lung cancer is half that of a smoker' },
];

export const ProgressPage: React.FC = () => {
  const { user, streak, totalMoneySaved, cigarettesAvoided, savingsGoals, addSavingsGoal } = useApp();

  if (!user) return null;

  const dailySavings = (user.cigarettesPerDay / user.cigarettesPerPack) * user.costPerPack;
  const weeklySavings = dailySavings * 7;
  const yearlySavings = dailySavings * 365;

  const currentMilestoneIndex = healthMilestones.findIndex(m => m.days > streak.totalSmokeFree);
  const nextMilestone = healthMilestones[currentMilestoneIndex] || healthMilestones[healthMilestones.length - 1];
  const prevMilestone = healthMilestones[Math.max(0, currentMilestoneIndex - 1)];
  const milestoneProgress = currentMilestoneIndex > 0 
    ? ((streak.totalSmokeFree - prevMilestone.days) / (nextMilestone.days - prevMilestone.days)) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Money Saved Section */}
      <Card variant="calm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-primary-foreground">
            <DollarSign className="w-5 h-5" />
            Money Saved
          </CardTitle>
        </CardHeader>
        <CardContent className="text-primary-foreground">
          <motion.p
            className="text-4xl font-bold mb-4"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
          >
            ${totalMoneySaved.toFixed(2)}
          </motion.p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="opacity-80">Weekly</p>
              <p className="font-semibold">${weeklySavings.toFixed(0)}/week</p>
            </div>
            <div>
              <p className="opacity-80">Yearly projection</p>
              <p className="font-semibold">${yearlySavings.toFixed(0)}/year</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Savings Goals */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-savings" />
              Savings Goals
            </CardTitle>
            <Button variant="ghost" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {savingsGoals.length > 0 ? (
            <div className="space-y-3">
              {savingsGoals.map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{goal.name}</span>
                    <span className="text-muted-foreground">
                      ${Math.min(totalMoneySaved, goal.targetAmount).toFixed(0)} / ${goal.targetAmount}
                    </span>
                  </div>
                  <Progress 
                    value={(Math.min(totalMoneySaved, goal.targetAmount) / goal.targetAmount) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Target className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Set a savings goal to track what your smoke-free money can buy!</p>
              <Button variant="soft" size="sm" className="mt-3">
                <Plus className="w-4 h-4 mr-1" />
                Create Goal
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Health Improvements */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-health" />
            Health Improvements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Next milestone progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Next: {nextMilestone.title}</span>
              <span className="text-xs text-muted-foreground">
                {Math.max(0, Math.ceil(nextMilestone.days - streak.totalSmokeFree))} days left
              </span>
            </div>
            <Progress value={milestoneProgress} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">{nextMilestone.description}</p>
          </div>

          {/* Milestone timeline */}
          <div className="space-y-3">
            {healthMilestones.slice(0, 7).map((milestone, index) => {
              const isAchieved = streak.totalSmokeFree >= milestone.days;
              return (
                <motion.div
                  key={milestone.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-xl transition-all',
                    isAchieved ? 'bg-success-light' : 'bg-muted'
                  )}
                >
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                    isAchieved ? 'bg-success text-primary-foreground' : 'bg-border'
                  )}>
                    {isAchieved ? (
                      <Sparkles className="w-3 h-3" />
                    ) : (
                      <span className="text-xs font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'font-semibold text-sm',
                      isAchieved ? 'text-success' : 'text-foreground'
                    )}>
                      {milestone.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {milestone.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3">
        <Card variant="soft">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{cigarettesAvoided}</p>
            <p className="text-xs text-muted-foreground">Cigarettes not smoked</p>
          </CardContent>
        </Card>
        <Card variant="soft">
          <CardContent className="p-4 text-center">
            <Heart className="w-6 h-6 mx-auto mb-2 text-health" />
            <p className="text-2xl font-bold">{Math.round(cigarettesAvoided * 11)}</p>
            <p className="text-xs text-muted-foreground">Minutes of life gained</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressPage;
