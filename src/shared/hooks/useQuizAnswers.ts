import { useState } from "react";

import type { PublicQuizQuestion, QuizAnswer } from "@/shared/types/quiz.types";

/** Local answer sheet for a fixed list of questions. Grading always happens on the server. */
export function useQuizAnswers(questions: PublicQuizQuestion[]) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Record<string, number>>({});

  const current = questions[index] ?? null;
  const answeredCount = Object.keys(selected).length;

  function select(optionIndex: number) {
    if (!current) return;
    setSelected((prev) => ({ ...prev, [current.id]: optionIndex }));
  }

  function toAnswers(): QuizAnswer[] {
    return questions
      .filter((q) => selected[q.id] !== undefined)
      .map((q) => ({ questionId: q.id, selectedIndex: selected[q.id] }));
  }

  return {
    index,
    current,
    total: questions.length,
    selectedIndex: current ? (selected[current.id] ?? null) : null,
    answeredCount,
    isLast: index === questions.length - 1,
    allAnswered: answeredCount === questions.length,
    select,
    next: () => setIndex((i) => Math.min(i + 1, questions.length - 1)),
    back: () => setIndex((i) => Math.max(i - 1, 0)),
    toAnswers,
  };
}
