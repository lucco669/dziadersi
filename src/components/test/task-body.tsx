"use client";

import type { Task } from "@/content/test";
import { BlotView, ChoiceView, SmsView } from "./choice";
import { InventoryView } from "./inventory";
import { MapView } from "./map";
import { RapidView } from "./rapid";
import { ReflexView } from "./reflex";
import { ScaleView } from "./scale";
import { WordsView } from "./words";

/** One task of any format, as the test and the table both ask it. */
export function TaskBody({
  task,
  proxy,
  value,
  seed,
  untimed,
  onAnswer,
}: {
  task: Task;
  proxy: boolean;
  value: number | undefined;
  seed: number;
  untimed: boolean;
  onAnswer: (value: number) => void;
}) {
  const props = { proxy, value, seed, onAnswer, untimed };
  switch (task.kind) {
    case "choice":
      return <ChoiceView task={task} {...props} />;
    case "sms":
      return <SmsView task={task} {...props} />;
    case "blot":
      return <BlotView task={task} {...props} />;
    case "words":
      return <WordsView task={task} {...props} />;
    case "reflex":
      return <ReflexView task={task} {...props} />;
    case "map":
      return <MapView task={task} {...props} />;
    case "inventory":
      return <InventoryView task={task} {...props} />;
    case "scale":
      return <ScaleView task={task} {...props} />;
    case "rapid":
      return <RapidView task={task} {...props} />;
  }
}
