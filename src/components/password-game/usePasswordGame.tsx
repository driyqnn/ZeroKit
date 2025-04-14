import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { gameRules } from "./gameRules";
import { useGameAchievements } from "./useGameAchievements";
import { Rule, Achievement } from "./types";

export const usePasswordGame = () => {
  const [password, setPassword] = useState("");
  const [rules, setRules] = useState<Rule[]>([]);
  const [activeRuleCount, setActiveRuleCount] = useState(1);
  const [score, setScore] = useState(0);
  const [highestScore, setHighestScore] = useState(0);
  const [showCompletedRules, setShowCompletedRules] = useState(true);
  const [ruleCompletionOrder, setRuleCompletionOrder] = useState<number[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { achievements, unlockAchievement } = useGameAchievements();

  // Initialize rules from imported definitions
  useEffect(() => {
    setRules(gameRules);
  }, []);

  // Password validation effect
  useEffect(() => {
    if (!password) {
      // Reset rule completion status when password is empty
      const resetRules = rules.map((rule) => ({
        ...rule,
        isCompleted: false,
      }));
      setRules(resetRules);
      setRuleCompletionOrder([]);
      setScore(0);
      return;
    }

    let updatedRules = [...rules];
    let newScore = 0;
    let newCompletionOrder: number[] = [...ruleCompletionOrder];

    updatedRules = updatedRules.map((rule) => {
      if (!rule.isActive) return rule;

      const isValid = rule.validator(password);

      if (isValid && !rule.isCompleted) {
        newScore += 1;

        if (!newCompletionOrder.includes(rule.id)) {
          newCompletionOrder.push(rule.id);
        }

        toast.success(`Rule completed: ${rule.title}`);
      }

      return {
        ...rule,
        isCompleted: isValid,
      };
    });

    const completedRulesCount = updatedRules.filter(
      (r) => r.isCompleted
    ).length;

    // Unlock new rule if enough rules are completed
    if (
      completedRulesCount >= activeRuleCount &&
      activeRuleCount < updatedRules.length
    ) {
      updatedRules[activeRuleCount].isActive = true;
      setActiveRuleCount((prev) => prev + 1);

      toast.info(`New rule unlocked: ${updatedRules[activeRuleCount].title}`);
    }

    // Check for achievements
    checkForAchievements(completedRulesCount, updatedRules);

    const allActiveRulesCompleted = updatedRules
      .filter((r) => r.isActive)
      .every((r) => r.isCompleted);

    if (allActiveRulesCompleted && !gameCompleted) {
      setScore(newScore);
      if (newScore > highestScore) {
        setHighestScore(newScore);
      }
    }

    setRules(updatedRules);
    setRuleCompletionOrder(newCompletionOrder);
  }, [
    password,
    rules,
    activeRuleCount,
    ruleCompletionOrder,
    achievements,
    gameCompleted,
    highestScore,
    unlockAchievement,
  ]);

  // Check for achievements based on completed rules
  const checkForAchievements = (
    completedRulesCount: number,
    updatedRules: Rule[]
  ) => {
    if (completedRulesCount >= 5) {
      unlockAchievement(1, "Beginner");
    }

    if (completedRulesCount >= 15) {
      unlockAchievement(2, "Intermediate");
    }

    if (completedRulesCount >= 30) {
      unlockAchievement(3, "Advanced");
    }

    if (completedRulesCount >= 50) {
      unlockAchievement(4, "Expert");
    }

    if (completedRulesCount === updatedRules.length) {
      unlockAchievement(5, "Master");
      setGameCompleted(true);
    }
  };

  // Start/reset the game
  const startGame = () => {
    const resetRules = rules.map((rule, index) => ({
      ...rule,
      isActive: index === 0,
      isCompleted: false,
    }));

    setRules(resetRules);
    setActiveRuleCount(1);
    setPassword("");
    setScore(0);
    setRuleCompletionOrder([]);
    setGameStarted(true);
    setGameCompleted(false);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
  };

  const toggleShowCompletedRules = () => {
    setShowCompletedRules(!showCompletedRules);
  };

  return {
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
    completedRuleCount: rules.filter((r) => r.isCompleted).length,
  };
};

export default usePasswordGame;
