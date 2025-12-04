import React from 'react';
import { motion } from 'framer-motion';
import { MascotType, MascotStage, MascotMood } from '@/types/app';
import { cn } from '@/lib/utils';

interface MascotProps {
  type: MascotType;
  stage: MascotStage;
  mood: MascotMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  showGlow?: boolean;
}

const stageScales: Record<MascotStage, number> = {
  baby: 0.7,
  child: 0.85,
  teen: 0.95,
  adult: 1,
};

const moodAnimations = {
  happy: {
    animate: { y: [0, -5, 0] },
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
  },
  excited: {
    animate: { y: [0, -10, 0], rotate: [-2, 2, -2] },
    transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" as const },
  },
  calm: {
    animate: { scale: [1, 1.02, 1] },
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
  },
  concerned: {
    animate: { x: [-2, 2, -2] },
    transition: { duration: 0.3, repeat: 3 },
  },
  celebrating: {
    animate: { rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1] },
    transition: { duration: 0.8, repeat: 2 },
  },
  sleeping: {
    animate: { scale: [1, 1.03, 1], opacity: [1, 0.9, 1] },
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const },
  },
};

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-40 h-40',
  xl: 'w-56 h-56',
};

// Dragon mascot SVG
const DragonMascot: React.FC<{ mood: MascotMood; stage: MascotStage }> = ({ mood, stage }) => {
  const mouthStyle = mood === 'happy' || mood === 'excited' || mood === 'celebrating' 
    ? 'M15,30 Q20,35 25,30' 
    : mood === 'concerned' 
    ? 'M15,32 Q20,30 25,32'
    : 'M16,31 L24,31';

  return (
    <svg viewBox="0 0 40 50" className="w-full h-full">
      {/* Body */}
      <ellipse cx="20" cy="32" rx="14" ry="12" fill="hsl(var(--primary))" />
      
      {/* Head */}
      <circle cx="20" cy="18" r="12" fill="hsl(var(--primary))" />
      
      {/* Belly */}
      <ellipse cx="20" cy="34" rx="9" ry="8" fill="hsl(var(--primary-light))" />
      
      {/* Eyes */}
      <g fill="hsl(var(--foreground))">
        {mood === 'sleeping' ? (
          <>
            <path d="M13,18 Q16,20 19,18" stroke="hsl(var(--foreground))" strokeWidth="1.5" fill="none" />
            <path d="M21,18 Q24,20 27,18" stroke="hsl(var(--foreground))" strokeWidth="1.5" fill="none" />
          </>
        ) : (
          <>
            <circle cx="15" cy="16" r="2.5" />
            <circle cx="25" cy="16" r="2.5" />
            <circle cx="15.5" cy="15.5" r="0.8" fill="white" />
            <circle cx="25.5" cy="15.5" r="0.8" fill="white" />
          </>
        )}
      </g>
      
      {/* Mouth */}
      <path d={mouthStyle} stroke="hsl(var(--foreground))" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      
      {/* Horns */}
      <path d="M10,10 Q8,4 12,8" fill="hsl(var(--accent))" />
      <path d="M30,10 Q32,4 28,8" fill="hsl(var(--accent))" />
      
      {/* Wings */}
      <path d="M6,28 Q-2,22 4,18 Q8,22 6,28" fill="hsl(var(--primary))" opacity="0.8" />
      <path d="M34,28 Q42,22 36,18 Q32,22 34,28" fill="hsl(var(--primary))" opacity="0.8" />
      
      {/* Tail */}
      <path d="M20,44 Q28,48 32,44 Q30,42 28,44" fill="hsl(var(--primary))" />
      
      {/* Blush */}
      {(mood === 'happy' || mood === 'excited' || mood === 'celebrating') && (
        <>
          <ellipse cx="10" cy="22" rx="3" ry="2" fill="hsl(var(--accent))" opacity="0.4" />
          <ellipse cx="30" cy="22" rx="3" ry="2" fill="hsl(var(--accent))" opacity="0.4" />
        </>
      )}
      
      {/* Sparkles for celebrating */}
      {mood === 'celebrating' && (
        <g fill="hsl(var(--streak-gold))">
          <circle cx="5" cy="8" r="1.5" />
          <circle cx="35" cy="8" r="1.5" />
          <circle cx="3" cy="15" r="1" />
          <circle cx="37" cy="15" r="1" />
        </g>
      )}
      
      {/* Z's for sleeping */}
      {mood === 'sleeping' && (
        <g fill="hsl(var(--muted-foreground))" fontSize="6" fontWeight="bold">
          <text x="30" y="10">z</text>
          <text x="34" y="6">z</text>
          <text x="38" y="2">z</text>
        </g>
      )}
    </svg>
  );
};

// Fox mascot SVG
const FoxMascot: React.FC<{ mood: MascotMood; stage: MascotStage }> = ({ mood }) => {
  return (
    <svg viewBox="0 0 40 50" className="w-full h-full">
      {/* Body */}
      <ellipse cx="20" cy="35" rx="12" ry="10" fill="#F97316" />
      
      {/* Head */}
      <circle cx="20" cy="18" r="11" fill="#F97316" />
      
      {/* Ears */}
      <path d="M8,12 L6,2 L14,10 Z" fill="#F97316" />
      <path d="M32,12 L34,2 L26,10 Z" fill="#F97316" />
      <path d="M9,11 L8,4 L13,10 Z" fill="#FBBF24" />
      <path d="M31,11 L32,4 L27,10 Z" fill="#FBBF24" />
      
      {/* White face patch */}
      <path d="M12,18 Q20,30 28,18 Q24,22 20,22 Q16,22 12,18" fill="white" />
      
      {/* Eyes */}
      {mood === 'sleeping' ? (
        <>
          <path d="M13,16 Q16,18 19,16" stroke="hsl(var(--foreground))" strokeWidth="1.5" fill="none" />
          <path d="M21,16 Q24,18 27,16" stroke="hsl(var(--foreground))" strokeWidth="1.5" fill="none" />
        </>
      ) : (
        <>
          <circle cx="15" cy="15" r="2" fill="hsl(var(--foreground))" />
          <circle cx="25" cy="15" r="2" fill="hsl(var(--foreground))" />
          <circle cx="15.5" cy="14.5" r="0.7" fill="white" />
          <circle cx="25.5" cy="14.5" r="0.7" fill="white" />
        </>
      )}
      
      {/* Nose */}
      <circle cx="20" cy="20" r="2" fill="hsl(var(--foreground))" />
      
      {/* Mouth */}
      <path d="M18,23 Q20,25 22,23" stroke="hsl(var(--foreground))" strokeWidth="1" fill="none" />
      
      {/* Tail */}
      <path d="M30,38 Q42,35 38,28 Q36,32 32,35" fill="#F97316" />
      <path d="M38,28 Q36,30 34,32" fill="white" />
      
      {/* Chest */}
      <ellipse cx="20" cy="38" rx="6" ry="5" fill="white" />
    </svg>
  );
};

// Sprout mascot SVG
const SproutMascot: React.FC<{ mood: MascotMood; stage: MascotStage }> = ({ mood }) => {
  return (
    <svg viewBox="0 0 40 50" className="w-full h-full">
      {/* Pot */}
      <path d="M8,45 L12,35 L28,35 L32,45 Z" fill="#8B5A2B" />
      <rect x="10" y="32" width="20" height="4" rx="1" fill="#A0522D" />
      
      {/* Stem */}
      <path d="M20,32 Q18,25 20,18" stroke="#22C55E" strokeWidth="3" fill="none" strokeLinecap="round" />
      
      {/* Leaves */}
      <ellipse cx="14" cy="22" rx="6" ry="4" fill="#22C55E" transform="rotate(-30 14 22)" />
      <ellipse cx="26" cy="22" rx="6" ry="4" fill="#22C55E" transform="rotate(30 26 22)" />
      
      {/* Face on main leaf/body */}
      <circle cx="20" cy="12" r="8" fill="#4ADE80" />
      
      {/* Eyes */}
      {mood === 'sleeping' ? (
        <>
          <path d="M15,11 Q17,13 19,11" stroke="hsl(var(--foreground))" strokeWidth="1.5" fill="none" />
          <path d="M21,11 Q23,13 25,11" stroke="hsl(var(--foreground))" strokeWidth="1.5" fill="none" />
        </>
      ) : (
        <>
          <circle cx="17" cy="11" r="1.5" fill="hsl(var(--foreground))" />
          <circle cx="23" cy="11" r="1.5" fill="hsl(var(--foreground))" />
        </>
      )}
      
      {/* Mouth */}
      <path d={mood === 'happy' ? "M17,15 Q20,18 23,15" : "M18,16 L22,16"} stroke="hsl(var(--foreground))" strokeWidth="1.2" fill="none" />
      
      {/* Blush */}
      {mood === 'happy' && (
        <>
          <ellipse cx="13" cy="13" rx="2" ry="1.5" fill="#F9A8D4" opacity="0.6" />
          <ellipse cx="27" cy="13" rx="2" ry="1.5" fill="#F9A8D4" opacity="0.6" />
        </>
      )}
    </svg>
  );
};

// Robot mascot SVG
const RobotMascot: React.FC<{ mood: MascotMood; stage: MascotStage }> = ({ mood }) => {
  return (
    <svg viewBox="0 0 40 50" className="w-full h-full">
      {/* Antenna */}
      <line x1="20" y1="8" x2="20" y2="2" stroke="#9CA3AF" strokeWidth="2" />
      <circle cx="20" cy="2" r="2" fill="hsl(var(--accent))" />
      
      {/* Head */}
      <rect x="8" y="8" width="24" height="18" rx="4" fill="#6B7280" />
      
      {/* Face screen */}
      <rect x="11" y="11" width="18" height="12" rx="2" fill="#1F2937" />
      
      {/* Eyes */}
      {mood === 'sleeping' ? (
        <>
          <line x1="14" y1="16" x2="18" y2="16" stroke="#22D3EE" strokeWidth="2" />
          <line x1="22" y1="16" x2="26" y2="16" stroke="#22D3EE" strokeWidth="2" />
        </>
      ) : (
        <>
          <circle cx="16" cy="16" r="2" fill="#22D3EE" />
          <circle cx="24" cy="16" r="2" fill="#22D3EE" />
        </>
      )}
      
      {/* Mouth */}
      <rect x="15" y="20" width="10" height="2" rx="1" fill={mood === 'happy' ? '#22D3EE' : '#6B7280'} />
      
      {/* Body */}
      <rect x="10" y="28" width="20" height="16" rx="3" fill="#6B7280" />
      
      {/* Chest panel */}
      <rect x="14" y="31" width="12" height="8" rx="1" fill="#374151" />
      <circle cx="17" cy="35" r="1.5" fill="#22C55E" />
      <circle cx="23" cy="35" r="1.5" fill="hsl(var(--accent))" />
      
      {/* Arms */}
      <rect x="4" y="30" width="5" height="10" rx="2" fill="#9CA3AF" />
      <rect x="31" y="30" width="5" height="10" rx="2" fill="#9CA3AF" />
      
      {/* Feet */}
      <rect x="12" y="44" width="6" height="4" rx="1" fill="#374151" />
      <rect x="22" y="44" width="6" height="4" rx="1" fill="#374151" />
    </svg>
  );
};

const mascotComponents: Record<MascotType, React.FC<{ mood: MascotMood; stage: MascotStage }>> = {
  dragon: DragonMascot,
  fox: FoxMascot,
  sprout: SproutMascot,
  robot: RobotMascot,
};

export const Mascot: React.FC<MascotProps> = ({
  type,
  stage,
  mood,
  size = 'lg',
  className,
  onClick,
  showGlow = false,
}) => {
  const MascotComponent = mascotComponents[type];
  const animation = moodAnimations[mood];
  const scale = stageScales[stage];

  return (
    <motion.div
      className={cn(
        sizeClasses[size],
        'relative cursor-pointer select-none',
        showGlow && 'shadow-glow rounded-full',
        className
      )}
      style={{ transform: `scale(${scale})` }}
      animate={animation.animate}
      transition={animation.transition}
      onClick={onClick}
      whileTap={{ scale: scale * 0.95 }}
    >
      <MascotComponent mood={mood} stage={stage} />
    </motion.div>
  );
};

export default Mascot;
