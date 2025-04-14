
import React from 'react';
import ToolLayout from '@/components/ToolLayout';
import { KeyRound } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { usePasswordGame } from '@/components/password-game/usePasswordGame';
import RuleList from '@/components/password-game/RuleList';
import PasswordInput from '@/components/password-game/PasswordInput';
import WelcomeCard from '@/components/password-game/WelcomeCard';
import GameCompletedCard from '@/components/password-game/GameCompletedCard';
import ScoreCard from '@/components/password-game/ScoreCard';
import AchievementList from '@/components/password-game/AchievementList';
import ComingSoonFeature from '@/components/password-game/ComingSoonFeature';

const PasswordGame = () => {
  const {
    password,
    rules,
    activeRuleCount,
    score,
    highestScore,
    achievements,
    showCompletedRules,
    gameStarted,
    gameCompleted,
    inputRef,
    startGame,
    handlePasswordChange,
    toggleShowCompletedRules,
    completedRuleCount
  } = usePasswordGame();

  return (
    <ToolLayout
      title="The Password Game"
      description="Can you create a password that meets all the requirements?"
      icon={<KeyRound className="h-6 w-6 text-yellow-500" />}
    >
      <div className="max-w-6xl mx-auto">
        {!gameStarted ? (
          <WelcomeCard onStart={startGame} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <PasswordInput
                    ref={inputRef}
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                  />
                </CardContent>
              </Card>

              <RuleList
                rules={rules}
                showCompleted={showCompletedRules}
                onToggleShowCompleted={toggleShowCompletedRules}
                completedCount={completedRuleCount}
                totalCount={activeRuleCount}
              />
              
              <ComingSoonFeature
                title="Multiplayer Challenge Mode"
                description="Challenge your friends to a password-creating competition! Compete in real-time to see who can meet the requirements fastest."
                estimatedRelease="Q2 2025"
              />
            </div>

            <div className="space-y-6">
              <ScoreCard 
                score={score} 
                highestScore={highestScore} 
                completed={gameCompleted} 
              />
              
              {gameCompleted && (
                <GameCompletedCard onRestart={startGame} score={score} />
              )}
              
              <AchievementList achievements={achievements} />
              
              <ComingSoonFeature
                title="Password Strength Analyzer"
                description="Advanced analysis of your passwords with detailed security insights and recommendations for improvement."
              />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default PasswordGame;
