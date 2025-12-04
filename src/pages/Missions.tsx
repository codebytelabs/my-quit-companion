import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/contexts/AppContext';
import { Target, BookOpen, Star, Sparkles, Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const learningContent = [
  { id: '1', title: 'Understanding Nicotine Addiction', type: 'article', duration: '5 min', phase: 'preparing' },
  { id: '2', title: 'Managing Withdrawal Symptoms', type: 'article', duration: '4 min', phase: 'first-week' },
  { id: '3', title: 'Identifying Your Triggers', type: 'article', duration: '6 min', phase: 'preparing' },
  { id: '4', title: 'Building New Habits', type: 'article', duration: '5 min', phase: 'maintenance' },
  { id: '5', title: 'Handling Social Situations', type: 'article', duration: '4 min', phase: 'maintenance' },
  { id: '6', title: 'What to Do If You Slip', type: 'article', duration: '3 min', phase: 'relapse' },
];

export const MissionsPage: React.FC = () => {
  const { missions, completeMission, streak } = useApp();

  const dailyMissions = missions.filter(m => m.type === 'daily');
  const weeklyMissions = missions.filter(m => m.type === 'weekly');
  const totalPoints = missions.filter(m => m.completed).reduce((sum, m) => sum + m.reward, 0);

  return (
    <div className="space-y-6">
      {/* Points Header */}
      <Card variant="accent">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-accent-foreground/80">Total Points</p>
            <p className="text-3xl font-bold text-accent-foreground">{totalPoints}</p>
          </div>
          <div className="w-14 h-14 rounded-full bg-accent-foreground/20 flex items-center justify-center">
            <Star className="w-7 h-7 text-accent-foreground" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="missions" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="missions">Missions</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
        </TabsList>

        <TabsContent value="missions" className="space-y-4">
          {/* Daily Missions */}
          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Daily Missions
            </h3>
            <div className="space-y-3">
              {dailyMissions.map((mission, index) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    variant={mission.completed ? 'soft' : 'default'}
                    className={cn(mission.completed && 'opacity-60')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                          mission.completed ? 'bg-success text-primary-foreground' : 'bg-primary-light'
                        )}>
                          {mission.completed ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <Target className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className={cn(
                              'font-semibold',
                              mission.completed && 'line-through'
                            )}>
                              {mission.title}
                            </p>
                            <span className="text-xs font-bold text-streak">
                              +{mission.reward}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {mission.description}
                          </p>
                          {!mission.completed && (
                            <Progress
                              value={(mission.progress / mission.target) * 100}
                              className="h-1.5"
                            />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Weekly Missions */}
          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              Weekly Challenge
            </h3>
            <div className="space-y-3">
              {weeklyMissions.map((mission) => (
                <Card key={mission.id} variant={mission.completed ? 'soft' : 'primary'}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                        mission.completed ? 'bg-success' : 'bg-accent/20'
                      )}>
                        {mission.completed ? (
                          <Check className="w-6 h-6 text-primary-foreground" />
                        ) : (
                          <Sparkles className="w-6 h-6 text-accent" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-bold">{mission.title}</p>
                          <span className="text-sm font-bold text-streak">
                            +{mission.reward}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {mission.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={(Math.min(streak.current, mission.target) / mission.target) * 100}
                            className="h-2 flex-1"
                          />
                          <span className="text-xs font-medium">
                            {Math.min(streak.current, mission.target)}/{mission.target}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="learning" className="space-y-4">
          {/* Recommended */}
          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-streak" />
              Recommended for You
            </h3>
            <div className="space-y-3">
              {learningContent.slice(0, 3).map((content, index) => (
                <motion.div
                  key={content.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant="interactive" className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-secondary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{content.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {content.type} • {content.duration}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* All Content */}
          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              All Lessons
            </h3>
            <div className="space-y-2">
              {learningContent.map((content) => (
                <Card key={content.id} variant="soft" className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{content.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {content.phase.replace('-', ' ')} • {content.duration}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MissionsPage;
