import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Info, Moon, Sun } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export const Route = createFileRoute("/")({
  component: Index,
});

const KANTIAN_PLACEHOLDER =
  "The categorical imperative requires us to ask: could the maxim of this action be universalized without contradiction? To act morally is to act from duty, treating every rational being as an end in themselves and never merely as a means. Consequences, however favorable, cannot redeem an act whose principle could not be willed as universal law.";

const UTILITARIAN_PLACEHOLDER =
  "The action that produces the greatest aggregate well-being is the morally correct one. We must weigh the consequences for all affected parties — counting each as one and none as more than one — and choose the path that maximizes happiness and minimizes suffering across the whole. Intentions matter little; outcomes are everything.";

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    const initial =
      stored ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initial);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);
  return { theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) };
}

const CANONICAL_DILEMMAS = [
  { label: "The Trolley Problem", text: "A runaway trolley is heading toward five people tied to the tracks. You can pull a lever to divert it onto a side track, where it will kill one person instead. Should you pull the lever?" },
  { label: "Lying to Save a Life", text: "A murderer asks where your friend is hiding. You know the truth. Lying could save your friend's life. Is it ever right to lie?" },
  { label: "Breaking a Promise", text: "You promised to meet a friend, but on the way you encounter a stranger in urgent need of help. Helping them means breaking your promise. What should you do?" },
  { label: "Stealing the Medicine", text: "A pharmacist refuses to lower the price of a drug that could save your dying spouse. You cannot afford it. Would it be morally permissible to steal the medicine?" },
];

function Index() {
  const { theme, toggle } = useTheme();
  const [dilemma, setDilemma] = useState("");
  const [kantian, setKantian] = useState("");
  const [utilitarian, setUtilitarian] = useState("");
  const [loading, setLoading] = useState(false);
  const [flashedPill, setFlashedPill] = useState<number | null>(null);
  const [textareaFlash, setTextareaFlash] = useState(false);
  const [buttonRipple, setButtonRipple] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const nudgeTextarea = () => {
    textareaRef.current?.focus();
    setTextareaFlash(true);
    window.setTimeout(() => setTextareaFlash(false), 500);
  };

  const handleReasonClick = () => {
    if (loading) return;
    if (dilemma.trim().length === 0) {
      nudgeTextarea();
      return;
    }
    handleSubmit();
  };

  const handlePillClick = (i: number) => {
    setDilemma(CANONICAL_DILEMMAS[i].text);
    setFlashedPill(i);
    setTextareaFlash(true);
    window.setTimeout(() => setFlashedPill(null), 400);
    window.setTimeout(() => setTextareaFlash(false), 500);
  };

  const canSubmit = dilemma.trim().length > 0 && !loading;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setButtonRipple((n) => n + 1);
    setLoading(true);
    setKantian("");
    setUtilitarian("");
    setTimeout(() => {
      setKantian(KANTIAN_PLACEHOLDER);
      setUtilitarian(UTILITARIAN_PLACEHOLDER);
      setLoading(false);
    }, 1000);
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <button
        onClick={toggle}
        aria-label="Toggle theme"
        className="fixed top-5 right-5 z-50 h-10 w-10 grid place-items-center rounded-full border border-border bg-popover/70 backdrop-blur text-foreground/80 hover:text-foreground hover:border-foreground/40 transition-all duration-300"
      >
        <span className="relative h-5 w-5 block">
          <Sun
            className="absolute inset-0 h-5 w-5 transition-all duration-300"
            style={{ opacity: theme === "light" ? 1 : 0, transform: theme === "light" ? "rotate(0)" : "rotate(-90deg)" }}
          />
          <Moon
            className="absolute inset-0 h-5 w-5 transition-all duration-300"
            style={{ opacity: theme === "dark" ? 1 : 0, transform: theme === "dark" ? "rotate(0)" : "rotate(90deg)" }}
          />
        </span>
      </button>

      <main className="flex-1 px-6 py-20 md:py-28 max-w-6xl mx-auto w-full">
        <header className="text-center mb-16 animate-fade-up">
          <h1
            className="font-serif font-medium tracking-tight text-foreground leading-[0.95]"
            style={{ fontSize: "clamp(48px, 9vw, 88px)", letterSpacing: "-0.02em" }}
          >
            The Moral Agent
          </h1>
          <p className="font-sans text-sm md:text-[15px] text-muted-foreground mt-5 tracking-wide">
            Two philosophies. One question. See where they diverge.
          </p>
        </header>

        <section className="max-w-[680px] mx-auto animate-fade-up" style={{ animationDelay: "120ms" }}>
          <div className="group relative">
            <textarea
              ref={textareaRef}
              value={dilemma}
              onChange={(e) => setDilemma(e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              placeholder="A runaway trolley is heading toward five people…"
              rows={5}
              className={`w-full bg-popover/40 backdrop-blur-sm border border-border rounded-xl px-6 py-5 text-[17px] leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-ring/60 focus:ring-4 focus:ring-ring/15 focus:shadow-[inset_0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-200 resize-none font-serif${textareaFlash ? " textarea-flash" : ""}`}
            />
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-2.5">
            {CANONICAL_DILEMMAS.map((d, i) => (
              <button
                key={d.label}
                type="button"
                onClick={() => handlePillClick(i)}
                className={`pill animate-pill-in${flashedPill === i ? " pill-flash" : ""}`}
                style={{ animationDelay: `${320 + i * 60}ms` }}
              >
                {d.label}
              </button>
            ))}
          </div>
          <div className="flex justify-center mt-7">
            <button
              onClick={handleReasonClick}
              aria-disabled={!canSubmit}
              data-disabled={!canSubmit ? "true" : "false"}
              data-loading={loading ? "true" : "false"}
              className={`reason-btn font-sans text-[13px] font-medium uppercase tracking-[0.18em] px-9 py-3.5 rounded-full bg-accent text-background${loading ? " is-loading" : ""}${!canSubmit ? " is-disabled" : ""}`}
            >
              <span className="reason-glow" aria-hidden="true" />
              {buttonRipple > 0 && (
                <span key={buttonRipple} className="reason-ripple" aria-hidden="true" />
              )}
              <span className="reason-label">
                {loading ? (
                  <span className="reason-dots" aria-label="Reasoning">
                    <span /><span /><span />
                  </span>
                ) : (
                  "Reason"
                )}
              </span>
            </button>
          </div>
        </section>

        <section className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          <Column
            title="Kantian"
            accentVar="--kantian"
            content={kantian}
            loading={loading}
            popoverTitle="Kantian Ethics"
            popoverBody="Founded by Immanuel Kant (1724–1804). Morality is grounded in reason, not consequences. An action is right if its underlying maxim could be willed as a universal law without contradiction (the Categorical Imperative), and if it treats every person as an end in themselves, never merely as a means. Duties hold absolutely — even when breaking them would produce better outcomes."
          />
          <Column
            title="Utilitarian"
            accentVar="--utilitarian"
            content={utilitarian}
            loading={loading}
            popoverTitle="Utilitarianism"
            popoverBody={`Most fully developed by John Stuart Mill (1806–1873), building on Jeremy Bentham. The right action is the one that produces the greatest aggregate well-being for all affected parties. Consequences are what matter morally — intentions and rules are only instrumentally valuable. Mill emphasizes "higher" pleasures of the intellect over mere physical satisfaction, and treats every person's welfare as counting equally.`}
          />
        </section>
      </main>

      <footer className="pb-10 pt-4 px-6">
        <div className="max-w-xs mx-auto h-px bg-border/60 mb-6" />
        <p className="text-center font-serif italic text-sm text-muted-foreground">
          A study in ethical AI — [your names], [course name]
        </p>
      </footer>
    </div>
  );
}

function Column({
  title,
  accentVar,
  content,
  loading,
  popoverTitle,
  popoverBody,
}: {
  title: string;
  accentVar: string;
  content: string;
  loading: boolean;
  popoverTitle: string;
  popoverBody: string;
}) {
  const accent = `var(${accentVar})`;
  return (
    <div
      className="pt-6 animate-fade-up"
      style={{ borderTop: `2px solid ${accent}`, animationDelay: "240ms" }}
    >
      <div className="flex items-center gap-2.5 mb-6">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: accent }}
        />
        <h2
          className="font-serif text-3xl md:text-[34px] font-medium text-foreground tracking-tight"
        >
          {title}
        </h2>
        <HoverCard openDelay={80} closeDelay={120}>
          <HoverCardTrigger asChild>
            <button
              aria-label={`About ${title}`}
              className="ml-1 inline-grid place-items-center h-5 w-5 rounded-full text-muted-foreground/70 hover:text-foreground transition-colors"
            >
              <Info className="h-4 w-4" />
            </button>
          </HoverCardTrigger>
          <HoverCardContent
            align="start"
            className="w-80 border-border bg-popover text-popover-foreground"
          >
            <div
              className="font-serif text-base font-semibold mb-1.5"
              style={{ color: accent }}
            >
              {popoverTitle}
            </div>
            <p className="font-sans text-[13px] leading-relaxed text-muted-foreground">
              {popoverBody}
            </p>
          </HoverCardContent>
        </HoverCard>
      </div>
      <div className="font-serif text-[17px] leading-[1.75] text-foreground/90 min-h-[140px]">
        {loading && !content ? (
          <span className="font-sans italic text-sm text-muted-foreground animate-soft-pulse">
            Considering…
          </span>
        ) : content ? (
          <p className="animate-fade-up">{content}</p>
        ) : (
          <span className="font-sans italic text-sm text-muted-foreground/60">
            Awaiting a dilemma.
          </span>
        )}
      </div>
    </div>
  );
}
