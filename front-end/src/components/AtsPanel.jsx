import { Notice, Spinner } from './ui.jsx'

const clamp = (n) => Math.max(0, Math.min(100, Number(n) || 0))

function ScoreRing({ score }) {
    const r = 42, c = 2 * Math.PI * r, value = clamp(score)
    return (
        <div className="relative h-28 w-28 shrink-0">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
                <circle cx="50" cy="50" r={r} fill="none" strokeWidth="8" className="stroke-ink/10" />
                <circle cx="50" cy="50" r={r} fill="none" strokeWidth="8" strokeLinecap="round" className="stroke-ink"
                    strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} style={{ transition: 'stroke-dashoffset 700ms cubic-bezier(.2,.8,.2,1)' }} />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-3xl font-extrabold tracking-tight tabular-nums">{Math.round(value)}</span>
        </div>
    )
}

// Job-description check: ATS score, keyword gaps and suggested rewrites.
export default function AtsPanel({ jobDescription, setJobDescription, aiLoading, aiError, aiResult, onAnalyze, children }) {
    const ready = jobDescription.trim().length > 0
    return (
        <section aria-labelledby="ats-heading" className="ui ui-sheet p-5 sm:p-6 flex flex-col gap-5">
            <div>
                <h2 id="ats-heading" className="ui-h2">Check against a job</h2>
                <p className="ui-help mt-1">Paste a job description or a job title. You'll get an ATS score, missing keywords and suggested rewrites.</p>
            </div>
            <label className="block">
                <span className="sr-only">Job description or title</span>
                <textarea
                    className="ui-input"
                    rows={5}
                    placeholder="Paste the job description or title here"
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                    disabled={aiLoading}
                />
            </label>
            <div className="flex flex-wrap gap-3">
                <button type="button" className="ui-btn ui-btn-primary" onClick={onAnalyze} disabled={aiLoading || !ready}>
                    {aiLoading ? <><Spinner />Analyzing…</> : 'Analyze resume'}
                </button>
                {children}
            </div>
            {aiError && <Notice tone="error">{aiError === 'Network error' ? "Couldn't reach the server. Check your connection and try again." : aiError}</Notice>}
            {aiLoading && !aiResult &&
                <p className="ui-help" role="status">This usually takes 10 to 30 seconds.</p>
            }

            {aiResult &&
                <div className="ui-item-in flex flex-col gap-6 border-t border-rule pt-6" aria-live="polite">
                    {aiResult.score !== undefined &&
                        <div className="flex items-center gap-5">
                            <ScoreRing score={aiResult.score} />
                            <div>
                                <p className="font-bold text-lg">ATS score</p>
                                <p className="ui-help">Out of 100, based on how well this resume matches the job you pasted.</p>
                            </div>
                        </div>
                    }

                    {aiResult.individual_category_score?.length > 0 &&
                        <div className="flex flex-col gap-3">
                            <h3 className="font-semibold">Score by category</h3>
                            <ul className="flex flex-col gap-4">
                                {aiResult.individual_category_score.map((cat, i) => (
                                    <li key={i}>
                                        <div className="flex items-baseline justify-between gap-3">
                                            <span className="font-medium">{cat.category}</span>
                                            <span className="text-sm font-semibold tabular-nums">{cat.score}</span>
                                        </div>
                                        <div className="mt-1.5 h-1.5 rounded-full bg-ink/10 overflow-hidden" aria-hidden="true">
                                            <div className="h-full rounded-full bg-ink" style={{ width: `${clamp(cat.score)}%` }} />
                                        </div>
                                        {cat.short_explanation && <p className="ui-help mt-1.5">{cat.short_explanation}</p>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    }

                    {aiResult.summary &&
                        <div className="flex flex-col gap-2">
                            <h3 className="font-semibold">Summary</h3>
                            <p className="whitespace-pre-line text-graphite">{aiResult.summary}</p>
                        </div>
                    }

                    {aiResult.missingKeywords?.length > 0 &&
                        <div className="flex flex-col gap-2.5">
                            <h3 className="font-semibold">Missing or weak keywords</h3>
                            <ul className="flex flex-wrap gap-2">
                                {aiResult.missingKeywords.map((k, i) => (
                                    <li key={i} className="rounded-full border border-edge px-3 py-1 text-sm">{k}</li>
                                ))}
                            </ul>
                        </div>
                    }

                    {aiResult.rewrites?.length > 0 &&
                        <div className="flex flex-col gap-3">
                            <h3 className="font-semibold">Suggested rewrites</h3>
                            <ul className="flex flex-col gap-3">
                                {aiResult.rewrites.map((rw, i) => (
                                    <li key={i} className="rounded-[12px] border border-rule overflow-hidden">
                                        <div className="px-4 py-3 bg-wash">
                                            <p className="text-xs font-semibold text-graphite">Current</p>
                                            <p className="mt-0.5 text-graphite">{rw.old}</p>
                                        </div>
                                        <div className="px-4 py-3">
                                            <p className="text-xs font-semibold text-graphite">Suggested</p>
                                            <p className="mt-0.5">{rw.new}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    }

                    {aiResult.suggestions?.length > 0 &&
                        <div className="flex flex-col gap-2">
                            <h3 className="font-semibold">Suggestions</h3>
                            <ul className="list-disc pl-5 flex flex-col gap-1.5 marker:text-graphite">
                                {aiResult.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                    }

                    {aiResult.raw &&
                        <pre className="rounded-[12px] bg-wash p-4 text-xs text-graphite whitespace-pre-wrap overflow-x-auto">{aiResult.raw}</pre>
                    }
                </div>
            }
        </section>
    )
}
