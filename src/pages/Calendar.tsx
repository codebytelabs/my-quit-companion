import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { ChevronLeft, ChevronRight, Flame, Trophy, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isBefore, parseISO, addMonths, subMonths } from 'date-fns';
import { cn } from '@/lib/utils';
import { DayStatus } from '@/types/app';
import { Mascot } from '@/components/mascot/Mascot';

const statusColors: Record<DayStatus, string> = {
  'smoke-free': 'bg-success',
  'slip': 'bg-warning',
  'relapse': 'bg-danger',
  'pre-quit': 'bg-muted',
  'future': 'bg-transparent',
};

const statusLabels: Record<DayStatus, string> = {
  'smoke-free': 'Smoke-free',
  'slip': 'Slip',
  'relapse': 'Relapse',
  'pre-quit': 'Pre-quit',
  'future': 'Future',
};

export const CalendarPage: React.FC = () => {
  const { user, dayLogs, streak } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  if (!user) return null;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDayStatus = (date: Date): DayStatus => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const log = dayLogs.find(l => l.date === dateStr);
    if (log) return log.status;
    
    const quitDate = parseISO(user.quitDate);
    if (isBefore(date, quitDate)) return 'pre-quit';
    if (isBefore(new Date(), date)) return 'future';
    return 'pre-quit';
  };

  const selectedLog = selectedDate ? dayLogs.find(l => l.date === selectedDate) : null;

  // Calculate evolution stages based on streak
  const evolutionStages = [
    { stage: 'baby', days: 0, label: 'Baby' },
    { stage: 'child', days: 7, label: 'Child' },
    { stage: 'teen', days: 30, label: 'Teen' },
    { stage: 'adult', days: 90, label: 'Adult' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid grid-cols-3 gap-3">
        <Card variant="primary" className="p-3 text-center">
          <Flame className="w-5 h-5 mx-auto mb-1 text-accent" />
          <p className="text-xl font-bold">{streak.current}</p>
          <p className="text-xs text-muted-foreground">Current</p>
        </Card>
        <Card variant="soft" className="p-3 text-center">
          <Trophy className="w-5 h-5 mx-auto mb-1 text-streak" />
          <p className="text-xl font-bold">{streak.longest}</p>
          <p className="text-xs text-muted-foreground">Longest</p>
        </Card>
        <Card variant="soft" className="p-3 text-center">
          <CalendarIcon className="w-5 h-5 mx-auto mb-1 text-health" />
          <p className="text-xl font-bold">{streak.totalSmokeFree}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </Card>
      </div>

      {/* Calendar */}
      <Card>
        <CardContent className="p-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h3 className="text-lg font-bold">{format(currentMonth, 'MMMM yyyy')}</h3>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before month start */}
            {Array.from({ length: monthStart.getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Day cells */}
            {days.map((day) => {
              const status = getDayStatus(day);
              const dateStr = format(day, 'yyyy-MM-dd');
              const isSelected = selectedDate === dateStr;

              return (
                <motion.button
                  key={dateStr}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={cn(
                    'aspect-square rounded-lg flex items-center justify-center relative transition-all',
                    isToday(day) && 'ring-2 ring-primary',
                    isSelected && 'ring-2 ring-accent scale-110'
                  )}
                  whileTap={{ scale: 0.9 }}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                      statusColors[status],
                      status === 'smoke-free' && 'text-primary-foreground',
                      status === 'slip' && 'text-foreground',
                      status === 'relapse' && 'text-primary-foreground',
                      status === 'pre-quit' && 'text-muted-foreground',
                      status === 'future' && 'text-muted-foreground/50'
                    )}
                  >
                    {format(day, 'd')}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t">
            {(['smoke-free', 'slip', 'relapse', 'pre-quit'] as DayStatus[]).map((status) => (
              <div key={status} className="flex items-center gap-1.5">
                <div className={cn('w-3 h-3 rounded-full', statusColors[status])} />
                <span className="text-xs text-muted-foreground">{statusLabels[status]}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Day Detail */}
      {selectedDate && selectedLog && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant="soft">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold">{format(parseISO(selectedDate), 'MMMM d, yyyy')}</h4>
                <span className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  statusColors[selectedLog.status],
                  selectedLog.status === 'smoke-free' && 'text-primary-foreground'
                )}>
                  {statusLabels[selectedLog.status]}
                </span>
              </div>
              {selectedLog.notes && (
                <p className="text-sm text-muted-foreground">{selectedLog.notes}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Mascot Evolution Timeline */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-4">Your Journey</h3>
          <div className="flex items-center justify-between">
            {evolutionStages.map((stage, index) => {
              const isUnlocked = streak.totalSmokeFree >= stage.days;
              return (
                <div key={stage.stage} className="flex flex-col items-center">
                  <div className={cn(
                    'w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-all',
                    isUnlocked ? 'bg-primary-light' : 'bg-muted opacity-50'
                  )}>
                    <Mascot
                      type={user.mascot.type}
                      stage={stage.stage as any}
                      mood={isUnlocked ? 'happy' : 'sleeping'}
                      size="sm"
                    />
                  </div>
                  <span className="text-xs font-medium">{stage.label}</span>
                  <span className="text-xs text-muted-foreground">{stage.days}d</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarPage;
