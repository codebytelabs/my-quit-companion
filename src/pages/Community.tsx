import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Heart, MessageCircle, UserPlus, Shield, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockPosts = [
  { id: '1', message: 'Hit 7 days today!', reactions: 24, timeAgo: '2h ago' },
  { id: '2', message: 'First smoke-free weekend with friends!', reactions: 18, timeAgo: '5h ago' },
  { id: '3', message: 'Day 30 milestone reached! Never thought I would make it this far.', reactions: 45, timeAgo: '1d ago' },
  { id: '4', message: 'Just survived a tough craving. The breathing exercise really helped!', reactions: 12, timeAgo: '1d ago' },
  { id: '5', message: 'Finally told my family about my quit journey. They are so supportive!', reactions: 31, timeAgo: '2d ago' },
];

export const CommunityPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
          <Users className="w-8 h-8 text-secondary-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Community</h1>
        <p className="text-muted-foreground mt-1">You are not alone in this journey</p>
      </div>

      {/* Coming Soon Banner */}
      <Card className="bg-primary-light border-primary/20">
        <CardContent className="p-4 text-center">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
          <p className="font-semibold">Full Community Features Coming Soon!</p>
          <p className="text-sm text-muted-foreground mt-1">
            Share your journey, support others, and celebrate together.
          </p>
        </CardContent>
      </Card>

      {/* Preview Feed */}
      <div>
        <h2 className="font-bold text-lg mb-3">Community Wins</h2>
        <div className="space-y-3">
          {mockPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-muted border-0">
                <CardContent className="p-4">
                  <p className="font-medium mb-3">{post.message}</p>
                  <div className="flex items-center justify-between">
                    <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>{post.reactions}</span>
                    </button>
                    <span className="text-xs text-muted-foreground">{post.timeAgo}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Accountability Feature Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserPlus className="w-5 h-5 text-primary" />
            Accountability Partners
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Invite up to 3 friends or family members to support your journey. They will receive milestone updates and can cheer you on!
          </p>
          <Button variant="secondary" className="w-full" disabled>
            <UserPlus className="w-4 h-4" />
            Coming Soon
          </Button>
        </CardContent>
      </Card>

      {/* Safety Note */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardContent className="p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sm">Safe and Supportive Space</p>
            <p className="text-xs text-muted-foreground mt-1">
              Our community follows strict guidelines to ensure everyone feels supported. All posts are anonymous and moderated.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityPage;
