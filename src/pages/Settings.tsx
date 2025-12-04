import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useApp } from '@/contexts/AppContext';
import { Mascot } from '@/components/mascot/Mascot';
import { 
  ArrowLeft, User, Bell, Palette, Database, 
  ChevronRight, Shirt, LogOut, Trash2, Edit
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MascotType } from '@/types/app';

const mascotAccessories = [
  { id: 'none', name: 'None', icon: '✨' },
  { id: 'hat', name: 'Party Hat', icon: '🎩' },
  { id: 'bow', name: 'Bow Tie', icon: '🎀' },
  { id: 'crown', name: 'Crown', icon: '👑' },
  { id: 'glasses', name: 'Cool Glasses', icon: '😎' },
];

export const SettingsPage: React.FC = () => {
  const { user, setUser, setIsOnboarded } = useApp();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    dailyCheckin: true,
    cravingReminder: true,
    weeklySummary: true,
    milestones: true,
  });
  const [showMascotCloset, setShowMascotCloset] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setIsOnboarded(false);
    navigate('/');
  };

  const updateMascotType = (type: MascotType) => {
    setUser({
      ...user,
      mascot: { ...user.mascot, type }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Button variant="ghost" size="icon-sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm">Cigarettes per day</span>
            <span className="font-semibold">{user.cigarettesPerDay}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm">Cost per pack</span>
            <span className="font-semibold">${user.costPerPack}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm">Quit date</span>
            <span className="font-semibold">{user.quitDate}</span>
          </div>
          <Button variant="soft" size="sm" className="w-full">
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      {/* Mascot Customization */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Shirt className="w-5 h-5" />
            Mascot Customization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Mascot
              type={user.mascot.type}
              stage={user.mascot.stage}
              mood="happy"
              size="md"
            />
            <div>
              <p className="font-bold">{user.mascot.name}</p>
              <p className="text-sm text-muted-foreground capitalize">
                {user.mascot.stage} stage
              </p>
            </div>
          </div>
          <Button 
            variant="soft" 
            className="w-full"
            onClick={() => setShowMascotCloset(true)}
          >
            <Palette className="w-4 h-4" />
            Open Closet
            <ChevronRight className="w-4 h-4 ml-auto" />
          </Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'dailyCheckin', label: 'Daily check-in reminder' },
            { key: 'cravingReminder', label: 'Craving-time reminders' },
            { key: 'weeklySummary', label: 'Weekly summary' },
            { key: 'milestones', label: 'Milestone celebrations' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <span className="text-sm">{item.label}</span>
              <Switch
                checked={notifications[item.key as keyof typeof notifications]}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, [item.key]: checked }))
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="soft" className="w-full justify-start">
            Export my data
            <ChevronRight className="w-4 h-4 ml-auto" />
          </Button>
          <Button variant="soft" className="w-full justify-start text-danger">
            <Trash2 className="w-4 h-4" />
            Delete all data
            <ChevronRight className="w-4 h-4 ml-auto" />
          </Button>
        </CardContent>
      </Card>

      {/* Logout */}
      <Button 
        variant="outline" 
        className="w-full" 
        onClick={handleLogout}
      >
        <LogOut className="w-4 h-4" />
        Start Over
      </Button>

      {/* App Info */}
      <p className="text-center text-xs text-muted-foreground">
        Quit Buddy v1.0.0
      </p>

      {/* Mascot Closet Dialog */}
      <Dialog open={showMascotCloset} onOpenChange={setShowMascotCloset}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>Mascot Closet</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Choose your buddy type:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {(['dragon', 'fox', 'sprout', 'robot'] as MascotType[]).map((type) => (
                <Card
                  key={type}
                  variant={user.mascot.type === type ? 'primary' : 'interactive'}
                  className={cn(
                    'p-3 text-center cursor-pointer',
                    user.mascot.type === type && 'ring-2 ring-primary'
                  )}
                  onClick={() => updateMascotType(type)}
                >
                  <Mascot
                    type={type}
                    stage={user.mascot.stage}
                    mood="happy"
                    size="sm"
                    className="mx-auto mb-2"
                  />
                  <p className="text-sm font-medium capitalize">{type}</p>
                </Card>
              ))}
            </div>

            <p className="text-sm text-muted-foreground mt-6 mb-3">
              Accessories (unlock with streaks):
            </p>
            <div className="flex flex-wrap gap-2">
              {mascotAccessories.map((acc) => (
                <button
                  key={acc.id}
                  className={cn(
                    'px-3 py-2 rounded-xl text-sm font-medium transition-all',
                    acc.id === 'none' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground opacity-50'
                  )}
                >
                  {acc.icon} {acc.name}
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
