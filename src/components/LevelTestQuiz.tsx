"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";

type LevelTestDict = Dictionary["levelTest"];

export function LevelTestQuiz({ dict }: { dict: LevelTestDict }) {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [leadSaved, setLeadSaved] = useState(false);
  const [leadStatus, setLeadStatus] = useState<"idle" | "loading" | "error">("idle");
  const [leadError, setLeadError] = useState("");

  const total = dict.questions.length;
  const question = dict.questions[index];

  function pickLevel(points: number) {
    return dict.levels.find((level) => points <= level.max) ?? dict.levels[dict.levels.length - 1];
  }

  function onNext() {
    if (selected === null) return;
    const points = question.options[selected].points;
    const nextScore = score + points;

    if (index >= total - 1) {
      setScore(nextScore);
      setDone(true);
      return;
    }

    setScore(nextScore);
    setSelected(null);
    setIndex((value) => value + 1);
  }

  async function onLeadSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLeadStatus("loading");
    setLeadError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const level = pickLevel(score);

    try {
      const res = await fetch("/api/level-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          levelCode: level.code,
          levelName: level.name,
          track: level.track,
          score,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setLeadStatus("error");
        setLeadError(json.error || dict.leadError);
        return;
      }
      setLeadSaved(true);
      setLeadStatus("idle");
    } catch {
      setLeadStatus("error");
      setLeadError(dict.leadNetwork);
    }
  }

  if (!started) {
    return (
      <div className="level-panel">
        <button type="button" className="btn btn-primary" onClick={() => setStarted(true)}>
          {dict.start}
        </button>
      </div>
    );
  }

  if (done && !leadSaved) {
    return (
      <div className="level-panel level-result">
        <p className="eyebrow">{dict.leadTitle}</p>
        <h2>{dict.leadHero}</h2>
        <p>{dict.leadText}</p>
        <form className="site-form level-lead-form" onSubmit={onLeadSubmit}>
          <label>
            {dict.leadName}
            <input name="name" type="text" required autoComplete="name" placeholder={dict.leadPhName} />
          </label>
          <label>
            {dict.leadEmail}
            <input name="email" type="email" required autoComplete="email" placeholder="you@email.com" dir="ltr" />
          </label>
          <label>
            {dict.leadWhatsapp}
            <input name="whatsapp" type="tel" autoComplete="tel" placeholder="+966…" dir="ltr" />
          </label>
          <button className="btn btn-primary" type="submit" disabled={leadStatus === "loading"}>
            {leadStatus === "loading" ? dict.leadSending : dict.leadSubmit}
          </button>
          {leadError ? (
            <p className="form-status is-error" role="status">
              {leadError}
            </p>
          ) : null}
        </form>
      </div>
    );
  }

  if (done && leadSaved) {
    const level = pickLevel(score);
    return (
      <div className="level-panel level-result">
        <p className="eyebrow">{dict.resultTitle}</p>
        <h2>
          {dict.yourLevel} {level.code} — {level.name}
        </h2>
        <p>
          {dict.recommend} <strong>{level.track}</strong>
        </p>
        <div className="cta-row">
          <Link className="btn btn-primary" href={`/apply?level=${encodeURIComponent(level.name)}`}>
            {dict.cta}
          </Link>
          <Link className="btn btn-ghost dark" href="/courses">
            {dict.ctaCourses}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="level-panel">
      <p className="level-progress">
        {dict.qProgress} {index + 1} {dict.of} {total}
      </p>
      <h2 className="level-prompt">{question.prompt}</h2>
      <ul className="level-options">
        {question.options.map((option, optionIndex) => (
          <li key={option.label}>
            <button
              type="button"
              className={`level-option${selected === optionIndex ? " is-selected" : ""}`}
              onClick={() => setSelected(optionIndex)}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="btn btn-primary" disabled={selected === null} onClick={onNext}>
        {index >= total - 1 ? dict.seeResult : dict.next}
      </button>
    </div>
  );
}
