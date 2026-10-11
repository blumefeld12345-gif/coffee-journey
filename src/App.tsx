import { useEffect, useMemo, useRef, useState } from 'react'
import { Award, BookOpen, Check, ChevronLeft, ChevronRight, CircleHelp, Coffee, Download, Flame, Home, Leaf, ListFilter, MapPin, RotateCcw, Search, Settings, SlidersHorizontal, Sprout, Trash2, Upload } from 'lucide-react'
import { chapters, getLesson, lessons } from './data'
import { origins, processEffects, roastEffects } from './exploreData'
import { calculateStreak, createBrewLog, emptyData, formatDuration, kindLabels, kindOf, loadData, saveData, todayKey, validateBackup } from './storage'
import type { AppData, BrewKind, BrewLog, ChapterId, Lesson, LessonSection, Ratings } from './types'

type View =
  | { page: 'home' | 'course' | 'explore' | 'logs' | 'badges' | 'settings' | 'brew-form'; id?: string }
  | { page: 'lesson' | 'quiz' | 'log-detail'; id: string }

const chapterIcon: Record<ChapterId, typeof Coffee> = { origin: Sprout, process: Leaf, roast: Flame, brew: Coffee }
const ratingLabels: { key: keyof Ratings; label: string; left: string; right: string }[] = [
  { key: 'acidity', label: '酸味', left: '穏やか', right: '鮮やか' }, { key: 'bitterness', label: '苦味', left: '軽い', right: '強い' },
  { key: 'sweetness', label: '甘み', left: '控えめ', right: '豊か' }, { key: 'body', label: 'コク', left: '軽やか', right: '重厚' },
  { key: 'liking', label: '好み', left: 'もう一歩', right: '大好き' }
]

function App() {
  const [view, setView] = useState<View>({ page: 'home' })
  const [data, setData] = useState<AppData>(() => loadData())
  const [toast, setToast] = useState('')
  useEffect(() => saveData(data), [data])
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [view])
  const update = (fn: (current: AppData) => AppData) => setData((current) => fn(current))
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2500) }

  const content = (() => {
    switch (view.page) {
      case 'home': return <HomePage data={data} navigate={setView} />
      case 'course': return <CoursePage data={data} navigate={setView} />
      case 'lesson': return <LessonPage lesson={getLesson(view.id)!} data={data} navigate={setView} update={update} />
      case 'quiz': return <QuizPage lesson={getLesson(view.id)!} data={data} navigate={setView} update={update} />
      case 'explore': return <ExplorePage />
      case 'brew-form': return <BrewForm update={update} navigate={setView} notify={notify} existing={view.id ? data.brewLogs.find((l) => l.id === view.id) : undefined} />
      case 'logs': return <LogsPage data={data} navigate={setView} />
      case 'log-detail': return <LogDetail log={data.brewLogs.find((l) => l.id === view.id)!} navigate={setView} update={update} notify={notify} />
      case 'badges': return <BadgesPage data={data} />
      case 'settings': return <SettingsPage data={data} setData={setData} notify={notify} navigate={setView} />
    }
  })()

  return <div className="app-shell">
    <header className="topbar"><button className="brand" onClick={() => setView({ page: 'home' })} aria-label="ホームへ"><span className="brand-mark"><Coffee size={20} /></span><span>Coffee <i>Journey</i></span></button><div className="top-actions"><p>一杯ずつ、詳しくなる。</p><button onClick={() => setView({ page: 'settings' })} aria-label="設定"><Settings size={19} /></button></div></header>
    <main>{content}</main>
    <nav className="bottom-nav" aria-label="メインナビゲーション">
      <NavButton active={view.page === 'home'} icon={Home} label="ホーム" onClick={() => setView({ page: 'home' })} />
      <NavButton active={['course', 'lesson', 'quiz'].includes(view.page)} icon={BookOpen} label="学ぶ" onClick={() => setView({ page: 'course' })} />
      <button className="brew-fab" onClick={() => setView({ page: 'brew-form' })} aria-label="抽出を記録"><Coffee /><span>記録</span></button>
      <NavButton active={['logs', 'log-detail'].includes(view.page)} icon={ListFilter} label="記録" onClick={() => setView({ page: 'logs' })} />
      <NavButton active={view.page === 'explore'} icon={Search} label="調べる" onClick={() => setView({ page: 'explore' })} />
    </nav>
    {toast && <div className="toast" role="status"><Check size={18} />{toast}</div>}
  </div>
}

function NavButton({ active, icon: Icon, label, onClick }: { active: boolean; icon: typeof Home; label: string; onClick: () => void }) {
  return <button className={active ? 'active' : ''} onClick={onClick}><Icon size={21} /><span>{label}</span></button>
}

function HomePage({ data, navigate }: { data: AppData; navigate: (v: View) => void }) {
  const next = lessons.find((l) => !data.completedLessons.includes(l.id)) ?? lessons[0]
  const progress = Math.round((data.completedLessons.length / lessons.length) * 100)
  const recent = data.brewLogs[0]
  const streak = calculateStreak(data.activityDates)
  return <>
    <section className="hero">
      <div className="hero-copy"><span className="kicker">GOOD COFFEE STARTS WITH CURIOSITY</span><h1>今日も、一杯の<br /><em>「なぜ？」</em>を楽しもう。</h1><p>産地から抽出まで。知るほど、いつものコーヒーはもっとおいしくなる。</p></div>
      <div className="cup-art" aria-hidden="true"><span className="steam s1" /><span className="steam s2" /><div className="cup"><div className="coffee-surface" /></div><div className="saucer" /><span className="bean b1">◒</span><span className="bean b2">◒</span></div>
    </section>
    <div className="page-grid home-grid">
      <section className="card daily-card"><div className="section-heading"><div><span className="eyebrow">TODAY'S LESSON</span><h2>今日のおすすめ</h2></div><div className="mini-streak"><Flame size={17} /> {streak}日</div></div>
        <div className="lesson-feature"><div className="lesson-number">{String(next.number).padStart(2, '0')}</div><div><span>{chapters.find((c) => c.id === next.chapter)?.title} · {next.minutes}分</span><h3>{next.title}</h3><p>{next.subtitle}</p></div></div>
        <button className="primary wide" onClick={() => navigate({ page: 'lesson', id: next.id })}>{data.completedLessons.includes(next.id) ? 'もう一度学ぶ' : 'レッスンを始める'} <ChevronRight size={18} /></button>
      </section>
      <section className="card progress-card"><div className="section-heading"><div><span className="eyebrow">YOUR PROGRESS</span><h2>学びの進み具合</h2></div><strong>{progress}<small>%</small></strong></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div><p>{data.completedLessons.length} / {lessons.length} レッスン完了</p><div className="chapter-dots">{chapters.map((c) => <div key={c.id}><span style={{ background: c.color }} />{c.title}<b>{lessons.filter((l) => l.chapter === c.id && data.completedLessons.includes(l.id)).length}/3</b></div>)}</div><button className="text-button" onClick={() => navigate({ page: 'course' })}>すべてのコースを見る <ChevronRight size={16} /></button></section>
      <section className="card recent-card"><div className="section-heading"><div><span className="eyebrow">COFFEE JOURNAL</span><h2>最近の一杯</h2></div><button className="icon-button" onClick={() => navigate({ page: 'logs' })}><ChevronRight /></button></div>{recent ? <button className="recent-log" onClick={() => navigate({ page: 'log-detail', id: recent.id })}><div className="bean-thumb"><Coffee /></div><div><span className={`kind-pill kind-${kindOf(recent)}`}>{kindLabels[kindOf(recent)]}</span><h3>{recent.bean}</h3><p>{recent.cafeName || recent.brand || recent.origin || recent.date}</p><div className="stars">{'★'.repeat(recent.ratings.liking)}{'☆'.repeat(5 - recent.ratings.liking)}</div></div></button> : <div className="empty-compact"><Coffee /><p>家でもカフェでも、最初の一杯を<br />記録してみましょう。</p><button className="secondary" onClick={() => navigate({ page: 'brew-form' })}>記録する</button></div>}</section>
    </div>
  </>
}

function CoursePage({ data, navigate }: { data: AppData; navigate: (v: View) => void }) {
  return <div className="page narrow"><PageTitle eyebrow="LEARNING PATH" title="コーヒーを、順番に知る。" copy="4つの章を旅するように学びます。気になるところから始めても大丈夫。" />
    <div className="chapter-list">{chapters.map((chapter) => { const Icon = chapterIcon[chapter.id]; const list = lessons.filter((l) => l.chapter === chapter.id); const done = list.filter((l) => data.completedLessons.includes(l.id)).length; return <section className="chapter-card" key={chapter.id} style={{ '--chapter': chapter.color } as React.CSSProperties}><div className="chapter-head"><div className="chapter-icon"><Icon /></div><div><span>CHAPTER {chapter.number}</span><h2>{chapter.title}</h2><p>{chapter.description}</p></div><div className="chapter-score">{done}<small>/3</small></div></div><div className="lesson-list">{list.map((lesson) => { const complete = data.completedLessons.includes(lesson.id); return <button key={lesson.id} onClick={() => navigate({ page: 'lesson', id: lesson.id })}><span className={`status ${complete ? 'done' : ''}`}>{complete ? <Check size={15} /> : lesson.number}</span><div><h3>{lesson.title}</h3><p>{lesson.subtitle} · {lesson.minutes}分</p></div><ChevronRight size={19} /></button> })}</div></section> })}</div>
  </div>
}

function PageTitle({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) { return <header className="page-title"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{copy && <p>{copy}</p>}</header> }

function LessonPage({ lesson, data, navigate, update }: { lesson: Lesson; data: AppData; navigate: (v: View) => void; update: (fn: (d: AppData) => AppData) => void }) {
  const chapter = chapters.find((c) => c.id === lesson.chapter)!
  const index = lessons.findIndex((l) => l.id === lesson.id)
  const markComplete = () => update((d) => ({ ...d, completedLessons: [...new Set([...d.completedLessons, lesson.id])], activityDates: [...new Set([...d.activityDates, todayKey()])] }))
  return <div className="lesson-page">
    <button className="back" onClick={() => navigate({ page: 'course' })}><ChevronLeft size={18} /> コース一覧</button>
    <header className="lesson-hero" style={{ '--chapter': chapter.color } as React.CSSProperties}><span>CHAPTER {chapter.number} · LESSON {lesson.number}</span><h1>{lesson.title}</h1><p>{lesson.subtitle}</p><div><span>約 {lesson.minutes} 分</span><span>{data.completedLessons.includes(lesson.id) ? '✓ 学習済み' : '図解レッスン'}</span></div></header>
    <div className="lesson-content">{lesson.sections.map((section, i) => <LessonBlock key={i} section={section} />)}
      <section className="takeaway"><Coffee /><div><span>今日のひとこと</span><h2>{lesson.takeaway}</h2></div></section>
      <section className="terms"><span className="eyebrow">KEY WORDS</span><h2>覚えておきたい言葉</h2><div>{lesson.terms.map((term) => <article key={term.term}><strong>{term.term}</strong><p>{term.meaning}</p></article>)}</div></section>
      <button className="primary quiz-start" onClick={() => { markComplete(); navigate({ page: 'quiz', id: lesson.id }) }}>3問クイズに挑戦 <ChevronRight /></button>
      <div className="lesson-pagination"><button disabled={index === 0} onClick={() => navigate({ page: 'lesson', id: lessons[index - 1].id })}><ChevronLeft /> 前へ</button><button disabled={index === lessons.length - 1} onClick={() => navigate({ page: 'lesson', id: lessons[index + 1].id })}>次へ <ChevronRight /></button></div>
    </div>
  </div>
}

function LessonBlock({ section }: { section: LessonSection }) {
  return <section className={`lesson-block visual-${section.visual}`}><div className="lesson-text"><span className="eyebrow">{section.eyebrow}</span><h2>{section.title}</h2><p>{section.body}</p></div><div className="visual-board">{section.items.map((item, i) => <article key={item.label} className={item.tone ?? ''}><span>{String(i + 1).padStart(2, '0')}</span><strong>{item.label}</strong><p>{item.detail}</p></article>)}</div></section>
}

function QuizPage({ lesson, data, navigate, update }: { lesson: Lesson; data: AppData; navigate: (v: View) => void; update: (fn: (d: AppData) => AppData) => void }) {
  const [current, setCurrent] = useState(0); const [answers, setAnswers] = useState<number[]>([]); const [selected, setSelected] = useState<number | null>(null)
  const finished = current >= lesson.quiz.length; const score = answers.filter((answer, i) => answer === lesson.quiz[i].answer).length
  useEffect(() => { if (finished) update((d) => ({ ...d, completedLessons: [...new Set([...d.completedLessons, lesson.id])], quizScores: { ...d.quizScores, [lesson.id]: Math.max(d.quizScores[lesson.id] ?? 0, score) }, activityDates: [...new Set([...d.activityDates, todayKey()])] })) }, [finished]) // eslint-disable-line react-hooks/exhaustive-deps
  if (finished) return <div className="page quiz-result"><div className="result-ring"><strong>{score}</strong><span>/ 3</span></div><span className="eyebrow">LESSON COMPLETE</span><h1>{score === 3 ? 'パーフェクト！' : '一歩ずつ、詳しくなっています。'}</h1><p>{score === 3 ? '知識がきれいにつながりました。次の一杯で確かめてみましょう。' : '解説を思い出しながら、もう一度挑戦しても大丈夫です。'}</p><div className="result-actions"><button className="primary" onClick={() => navigate({ page: 'course' })}>コースへ戻る</button><button className="secondary" onClick={() => { setCurrent(0); setAnswers([]); setSelected(null) }}><RotateCcw size={17} /> もう一度</button></div><p className="best-score">ベストスコア：{Math.max(data.quizScores[lesson.id] ?? 0, score)} / 3</p></div>
  const question = lesson.quiz[current]
  return <div className="page quiz-page"><button className="back" onClick={() => navigate({ page: 'lesson', id: lesson.id })}><ChevronLeft /> レッスンへ</button><div className="quiz-progress"><span>QUESTION {current + 1} / 3</span><div>{lesson.quiz.map((_, i) => <i key={i} className={i <= current ? 'active' : ''} />)}</div></div><div className="quiz-card"><CircleHelp /><h1>{question.question}</h1><div className="choices">{question.choices.map((choice, i) => { const answered = selected !== null; const state = answered ? (i === question.answer ? 'correct' : i === selected ? 'wrong' : '') : ''; return <button disabled={answered} className={state} key={choice} onClick={() => { setSelected(i); setAnswers([...answers, i]) }}><span>{String.fromCharCode(65 + i)}</span>{choice}{state === 'correct' && <Check />}</button> })}</div>{selected !== null && <div className={`explanation ${selected === question.answer ? 'correct' : 'wrong'}`}><strong>{selected === question.answer ? '正解！' : 'おしい！'}</strong><p>{question.explanation}</p><button className="primary" onClick={() => { setCurrent(current + 1); setSelected(null) }}>{current === 2 ? '結果を見る' : '次の問題'} <ChevronRight /></button></div>}</div></div>
}

function ExplorePage() {
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState<'すべて' | 'アフリカ' | '中南米' | 'アジア'>('すべて')
  const [originId, setOriginId] = useState('')
  const [process, setProcess] = useState<keyof typeof processEffects>('unknown')
  const [roast, setRoast] = useState<keyof typeof roastEffects>('unknown')
  const selected = origins.find((item) => item.id === originId)
  const needle = query.trim().toLowerCase()
  const filtered = origins.filter((item) => (region === 'すべて' || item.region === region) && (!needle || [item.country, ...item.aliases, ...item.regions, ...item.flavors].some((text) => text.toLowerCase().includes(needle))))
  const processInfo = processEffects[process]
  const roastInfo = roastEffects[roast]
  const acidity = selected ? Math.max(1, Math.min(5, selected.acidity + roastInfo.acidity)) : 0
  const body = selected ? Math.max(1, Math.min(5, selected.body + roastInfo.body)) : 0
  const flavorPrediction = selected ? [...new Set([...selected.flavors, ...processInfo.flavors, ...roastInfo.flavors])].slice(0, 7) : []

  return <div className="page explore-page"><PageTitle eyebrow="COFFEE FINDER" title="この豆、どんな味？" copy="お店や袋に書かれた情報を、分かる範囲で選んでください。味わいの一般的な傾向を予想します。" />
    {!selected ? <>
      <div className="origin-search"><Search /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="国・地域名を検索　例：イルガチェフェ" /></div>
      <div className="region-tabs">{(['すべて', 'アフリカ', '中南米', 'アジア'] as const).map((item) => <button className={region === item ? 'active' : ''} key={item} onClick={() => setRegion(item)}>{item}</button>)}</div>
      <section className="finder-guide"><MapPin /><div><strong>まず、産地を選ぶ</strong><p>「イルガチェフェ」のような地域名でも検索できます。分からなければ、袋やメニューの国名を探してみましょう。</p></div></section>
      <div className="origin-grid">{filtered.map((item) => <button key={item.id} onClick={() => { setOriginId(item.id); window.scrollTo({ top: 0, behavior: 'smooth' }) }}><span>{item.region}</span><h2>{item.country}</h2><p>{item.headline}</p><div>{item.flavors.slice(0, 3).map((flavor) => <i key={flavor}>{flavor}</i>)}</div><ChevronRight /></button>)}</div>
      {!filtered.length && <div className="empty-state"><div><Search /></div><h2>該当する産地が見つかりません</h2><p>国名や地域名を短くして試してみてください。</p></div>}
    </> : <>
      <button className="back finder-back" onClick={() => setOriginId('')}><ChevronLeft /> 産地を選び直す</button>
      <section className="origin-profile"><span>{selected.region} · ORIGIN GUIDE</span><h1>{selected.country}</h1><p>{selected.headline}</p><div>{selected.regions.map((item) => <i key={item}>{item}</i>)}</div></section>
      <section className="finder-step"><div className="step-title"><span>01</span><div><h2>精製方法は？</h2><p>分からなければ「不明」のままで大丈夫。</p></div></div><div className="choice-chips">{Object.entries(processEffects).map(([key, item]) => <button className={process === key ? 'active' : ''} key={key} onClick={() => setProcess(key as keyof typeof processEffects)}>{item.label}</button>)}</div></section>
      <section className="finder-step"><div className="step-title"><span>02</span><div><h2>焙煎度は？</h2><p>お店の表記に一番近いものを選びます。</p></div></div><div className="choice-chips">{Object.entries(roastEffects).map(([key, item]) => <button className={roast === key ? 'active' : ''} key={key} onClick={() => setRoast(key as keyof typeof roastEffects)}>{item.label}</button>)}</div></section>
      <section className="taste-prediction"><div className="prediction-head"><SlidersHorizontal /><div><span>TASTE PREDICTION</span><h2>こんな一杯かもしれません</h2></div></div><div className="flavor-cloud">{flavorPrediction.map((flavor) => <span key={flavor}>{flavor}</span>)}</div><div className="prediction-bars"><TasteMeter label="酸味" value={acidity} left="穏やか" right="鮮やか" /><TasteMeter label="コク" value={body} left="軽やか" right="重厚" /></div><p className="origin-story">{selected.story}</p>{process !== 'unknown' && <div className="effect-note"><strong>{processInfo.label}</strong><p>{processInfo.note}</p></div>}{roast !== 'unknown' && <div className="effect-note"><strong>{roastInfo.label}</strong><p>{roastInfo.note}</p></div>}<div className="pairing"><Coffee /><div><span>こんなときに</span><p>{selected.pairWith}</p></div></div></section>
      <p className="tendency-note">※ ここでの説明は一般的な傾向です。同じ産地でも、品種・農園・標高・精製・焙煎・抽出によって味わいは変わります。</p>
    </>}
  </div>
}

function TasteMeter({ label, value, left, right }: { label: string; value: number; left: string; right: string }) {
  return <div className="finder-meter"><div><strong>{label}</strong><span>{left} ↔ {right}</span></div><div>{[1, 2, 3, 4, 5].map((n) => <i className={n <= value ? 'on' : ''} key={n} />)}</div></div>
}

function BrewForm({ update, navigate, notify, existing }: { update: (fn: (d: AppData) => AppData) => void; navigate: (v: View) => void; notify: (s: string) => void; existing?: BrewLog }) {
  const [form, setForm] = useState({ kind: kindOf(existing ?? {} as BrewLog), bean: existing?.bean ?? '', cafeName: existing?.cafeName ?? '', brand: existing?.brand ?? '', origin: existing?.origin ?? '', process: existing?.process ?? '', roast: existing?.roast ?? '', dose: existing?.dose ?? 15, water: existing?.water ?? 240, temperature: existing?.temperature ?? 92, duration: existing?.duration ?? 180, grind: existing?.grind ?? '中挽き' as BrewLog['grind'], ratings: existing?.ratings ?? { acidity: 3, bitterness: 3, sweetness: 3, body: 3, liking: 3 }, note: existing?.note ?? '', date: existing?.date ?? todayKey() })
  const set = <K extends keyof typeof form>(key: K, value: typeof form[K]) => setForm({ ...form, [key]: value })
  const submit = (e: React.FormEvent) => { e.preventDefault(); if (!form.bean.trim()) return; const log = existing ? { ...existing, ...form } : createBrewLog(form); update((d) => ({ ...d, brewLogs: existing ? d.brewLogs.map((l) => l.id === existing.id ? { ...log, suggestion: createBrewLog(form).suggestion } : l) : [log, ...d.brewLogs], activityDates: [...new Set([...d.activityDates, todayKey()])] })); notify(existing ? '記録を更新しました' : '一杯を記録しました'); navigate({ page: 'log-detail', id: log.id }) }
  const isHand = form.kind === 'hand-drip'; const isBag = form.kind === 'drip-bag'; const isCafe = form.kind === 'cafe'
  return <div className="page form-page"><button className="back" onClick={() => navigate(existing ? { page: 'log-detail', id: existing.id } : { page: 'home' })}><ChevronLeft /> 戻る</button><PageTitle eyebrow="COFFEE JOURNAL" title={existing ? '記録を編集する' : '今日の一杯を記録する'} copy="家で淹れた一杯も、カフェで出会った一杯も、同じノートへ。" /><form onSubmit={submit}>
    <section className="form-card kind-card"><h2><span>01</span> どんな一杯ですか？</h2><div className="kind-selector">{([['hand-drip', 'ハンドドリップ', '自分で豆から淹れた'], ['drip-bag', 'ドリップバッグ', '市販品を手軽に淹れた'], ['cafe', 'カフェの一杯', 'お店で飲んだ']] as [BrewKind, string, string][]).map(([kind, label, copy]) => <button type="button" key={kind} className={form.kind === kind ? 'selected' : ''} onClick={() => set('kind', kind)}><Coffee /><strong>{label}</strong><small>{copy}</small></button>)}</div></section>
    <section className="form-card"><h2><span>02</span> 一杯の情報</h2>
      {isCafe && <label className="full">カフェ名<input required value={form.cafeName} onChange={(e) => set('cafeName', e.target.value)} placeholder="例：Coffee Journey Roasters" /></label>}
      {isBag && <label className="full">メーカー・ブランド<input value={form.brand} onChange={(e) => set('brand', e.target.value)} placeholder="例：○○コーヒー" /></label>}
      <label className="full">{isBag ? '商品名・コーヒー名' : isCafe ? 'メニュー名・豆の名前' : '豆の名前'}<input required value={form.bean} onChange={(e) => set('bean', e.target.value)} placeholder={isBag ? '例：エチオピア ドリップバッグ' : '例：エチオピア イルガチェフェ'} /></label>
      <div className="field-grid meta-grid"><label>産地<input value={form.origin} onChange={(e) => set('origin', e.target.value)} placeholder="例：エチオピア" /></label><label>精製方法<input value={form.process} onChange={(e) => set('process', e.target.value)} placeholder="例：ウォッシュド" /></label><label>焙煎度<input value={form.roast} onChange={(e) => set('roast', e.target.value)} placeholder="例：浅煎り" /></label><label>日付<input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} /></label></div>
      {!isCafe && <><div className="field-grid">{isHand && <NumberField label="豆の量" value={form.dose} suffix="g" min={1} max={100} onChange={(v) => set('dose', v)} />}<NumberField label="湯量" value={form.water} suffix="g" min={1} max={1000} onChange={(v) => set('water', v)} /><NumberField label="湯温" value={form.temperature} suffix="℃" min={50} max={100} onChange={(v) => set('temperature', v)} /><NumberField label="抽出時間" value={form.duration} suffix="秒" min={1} max={900} onChange={(v) => set('duration', v)} /></div>{isHand && <label className="full">挽き目<select value={form.grind} onChange={(e) => set('grind', e.target.value as BrewLog['grind'])}>{['細挽き', '中細挽き', '中挽き', '粗挽き'].map((x) => <option key={x}>{x}</option>)}</select></label>}</>}
    </section>
    <section className="form-card"><h2><span>03</span> 味わい</h2>{ratingLabels.map(({ key, ...rating }) => <Rating key={key} {...rating} value={form.ratings[key]} onChange={(value) => set('ratings', { ...form.ratings, [key]: value })} />)}</section>
    <section className="form-card"><h2><span>04</span> ひとことメモ</h2><textarea value={form.note} onChange={(e) => set('note', e.target.value)} placeholder={isCafe ? 'お店の雰囲気、一緒に食べたもの、印象に残った香りなど…' : '香り、冷めてからの変化、次に試したいことなど…'} rows={4} /></section>
    <button className="primary wide save-button" type="submit">{existing ? '変更を保存する' : 'この一杯を保存する'} <Check /></button>
  </form></div>
}

function NumberField({ label, value, suffix, min, max, onChange }: { label: string; value: number; suffix: string; min: number; max: number; onChange: (v: number) => void }) { return <label>{label}<div className="number-input"><input type="number" value={value} min={min} max={max} onChange={(e) => onChange(Number(e.target.value))} /><span>{suffix}</span></div></label> }
function Rating({ label, left, right, value, onChange }: { label: string; left: string; right: string; value: number; onChange: (v: number) => void }) { return <div className="rating"><div><strong>{label}</strong><span>{left} ↔ {right}</span></div><div>{[1, 2, 3, 4, 5].map((n) => <button type="button" className={n <= value ? 'filled' : ''} aria-label={`${label} ${n}`} key={n} onClick={() => onChange(n)}>{n}</button>)}</div></div> }

function logSummary(log: BrewLog) {
  if (kindOf(log) === 'cafe') return [log.cafeName, log.origin, log.roast].filter(Boolean).join(' · ') || 'カフェで飲んだ一杯'
  if (kindOf(log) === 'drip-bag') return [log.brand, log.origin, `${log.water}g`].filter(Boolean).join(' · ')
  return `${log.dose}g → ${log.water}g · ${log.temperature}℃ · ${formatDuration(log.duration)}`
}

function LogsPage({ data, navigate }: { data: AppData; navigate: (v: View) => void }) {
  const [filter, setFilter] = useState<'all' | BrewKind>('all')
  const visible = filter === 'all' ? data.brewLogs : data.brewLogs.filter((log) => kindOf(log) === filter)
  return <div className="page narrow"><PageTitle eyebrow="COFFEE JOURNAL" title="一杯ずつ、好みが見える。" copy={`${data.brewLogs.length}件のコーヒー記録`} />
    <div className="log-filters">{([['all', 'すべて'], ['hand-drip', 'ハンドドリップ'], ['drip-bag', 'ドリップバッグ'], ['cafe', 'カフェ']] as const).map(([key, label]) => <button className={filter === key ? 'active' : ''} key={key} onClick={() => setFilter(key)}>{label}</button>)}</div>
    {visible.length ? <div className="logs-list">{visible.map((log) => <button key={log.id} onClick={() => navigate({ page: 'log-detail', id: log.id })}><div className="log-date"><strong>{new Date(`${log.date}T00:00:00`).getDate()}</strong><span>{new Intl.DateTimeFormat('ja-JP', { month: 'short' }).format(new Date(`${log.date}T00:00:00`))}</span></div><div><span className={`kind-pill kind-${kindOf(log)}`}>{kindLabels[kindOf(log)]}</span><h2>{log.bean}</h2><p>{logSummary(log)}</p><div className="stars">{'★'.repeat(log.ratings.liking)}{'☆'.repeat(5 - log.ratings.liking)}</div></div><ChevronRight /></button>)}</div> : <div className="empty-state"><div><Coffee /></div><h2>{data.brewLogs.length ? 'この種類の記録はまだありません' : 'まだ記録がありません'}</h2><p>家で淹れた一杯も、カフェで出会った一杯も、<br />ひとつのノートに残せます。</p><button className="primary" onClick={() => navigate({ page: 'brew-form' })}>一杯を記録する</button></div>}
  </div>
}

function LogDetail({ log, navigate, update, notify }: { log: BrewLog; navigate: (v: View) => void; update: (fn: (d: AppData) => AppData) => void; notify: (s: string) => void }) {
  if (!log) return <div className="page"><p>記録が見つかりません。</p></div>
  const kind = kindOf(log)
  const facts = [{ k: kind === 'cafe' ? 'カフェ' : kind === 'drip-bag' ? 'ブランド' : '種類', v: log.cafeName || log.brand || kindLabels[kind] }, { k: '産地', v: log.origin }, { k: '精製', v: log.process }, { k: '焙煎', v: log.roast }].filter((x) => x.v)
  const recipe = kind === 'hand-drip' ? [{ k: '豆', v: `${log.dose}g` }, { k: '湯', v: `${log.water}g` }, { k: '湯温', v: `${log.temperature}℃` }, { k: '時間', v: formatDuration(log.duration) }, { k: '挽き目', v: log.grind }] : kind === 'drip-bag' ? [{ k: '湯', v: `${log.water}g` }, { k: '湯温', v: `${log.temperature}℃` }, { k: '時間', v: formatDuration(log.duration) }] : []
  return <div className="page detail-page"><button className="back" onClick={() => navigate({ page: 'logs' })}><ChevronLeft /> 記録一覧</button><header><span className={`kind-pill kind-${kind}`}>{kindLabels[kind]}</span><span className="eyebrow detail-date">{log.date}</span><h1>{log.bean}</h1><div className="stars large">{'★'.repeat(log.ratings.liking)}{'☆'.repeat(5 - log.ratings.liking)}</div></header>{facts.length > 0 && <section className="coffee-facts">{facts.map((x) => <div key={x.k}><span>{x.k}</span><strong>{x.v}</strong></div>)}</section>}{recipe.length > 0 && <section className="recipe-strip">{recipe.map((x) => <div key={x.k}><span>{x.k}</span><strong>{x.v}</strong></div>)}</section>}<section className="taste-card"><h2>味わい</h2>{ratingLabels.map((r) => <div className="taste-row" key={r.key}><span>{r.label}</span><div><i style={{ width: `${log.ratings[r.key] * 20}%` }} /></div><strong>{log.ratings[r.key]}</strong></div>)}</section>{kind !== 'cafe' && <section className="suggestion"><Sprout /><div><span>NEXT CUP</span><h2>次の一杯で試すこと</h2><p>{log.suggestion}</p></div></section>}{log.note && <section className="note-card"><span>MEMO</span><p>{log.note}</p></section>}<div className="detail-actions"><button className="secondary" onClick={() => navigate({ page: 'brew-form', id: log.id })}>編集する</button><button className="danger" onClick={() => { if (confirm('この記録を削除しますか？')) { update((d) => ({ ...d, brewLogs: d.brewLogs.filter((x) => x.id !== log.id) })); notify('記録を削除しました'); navigate({ page: 'logs' }) } }}><Trash2 /> 削除</button></div></div>
}

const badges = [
  { id: 'first', icon: Sprout, name: 'はじめの一歩', text: '最初のレッスンを完了', test: (d: AppData) => d.completedLessons.length >= 1 },
  { id: 'origin', icon: BookOpen, name: '産地の旅人', text: '産地の章を完了', test: (d: AppData) => lessons.filter((l) => l.chapter === 'origin').every((l) => d.completedLessons.includes(l.id)) },
  { id: 'perfect', icon: Award, name: 'クイズマスター', text: 'いずれかのクイズで満点', test: (d: AppData) => Object.values(d.quizScores).some((x) => x === 3) },
  { id: 'brewer', icon: Coffee, name: 'ホームブリューワー', text: '最初の一杯を記録', test: (d: AppData) => d.brewLogs.length >= 1 },
  { id: 'journal', icon: ListFilter, name: '味の探究者', text: '5杯を記録', test: (d: AppData) => d.brewLogs.length >= 5 },
  { id: 'graduate', icon: Flame, name: 'コーヒー通への入口', text: '全12レッスンを完了', test: (d: AppData) => d.completedLessons.length === lessons.length }
]
function BadgesPage({ data }: { data: AppData }) { const earned = badges.filter((b) => b.test(data)).length; return <div className="page narrow"><PageTitle eyebrow="MILESTONES" title="小さな発見のしるし。" copy={`${earned} / ${badges.length} バッジ獲得`} /><div className="badge-grid">{badges.map((badge) => { const Icon = badge.icon; const unlocked = badge.test(data); return <article className={unlocked ? 'unlocked' : ''} key={badge.id}><div><Icon /></div><span>{unlocked ? 'GET!' : 'LOCKED'}</span><h2>{badge.name}</h2><p>{badge.text}</p></article> })}</div></div> }

function SettingsPage({ data, setData, notify, navigate }: { data: AppData; setData: (d: AppData) => void; notify: (s: string) => void; navigate: (v: View) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const download = () => { const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `coffee-journey-${todayKey()}.json`; a.click(); URL.revokeObjectURL(url); notify('バックアップを書き出しました') }
  const upload = async (file?: File) => { if (!file) return; try { const parsed = validateBackup(JSON.parse(await file.text())); setData(parsed); notify('バックアップを復元しました') } catch (e) { alert(e instanceof Error ? e.message : '読み込みに失敗しました。') } finally { if (fileRef.current) fileRef.current.value = '' } }
  return <div className="page settings-page"><PageTitle eyebrow="SETTINGS" title="設定とデータ" copy="記録はこの端末のブラウザ内だけに保存されています。" /><section className="settings-card"><div><Download /><span><strong>バックアップを書き出す</strong><small>学習進捗と抽出記録をJSONで保存</small></span></div><button className="secondary" onClick={download}>書き出す</button></section><section className="settings-card"><div><Upload /><span><strong>バックアップから復元</strong><small>書き出したJSONファイルを読み込み</small></span></div><input ref={fileRef} hidden type="file" accept="application/json" onChange={(e) => upload(e.target.files?.[0])} /><button className="secondary" onClick={() => fileRef.current?.click()}>読み込む</button></section><section className="settings-card"><div><Award /><span><strong>獲得バッジ</strong><small>学びの節目を振り返る</small></span></div><button className="secondary" onClick={() => navigate({ page: 'badges' })}>バッジを見る</button></section><section className="settings-card danger-zone"><div><Trash2 /><span><strong>すべてのデータを削除</strong><small>この操作は元に戻せません</small></span></div><button className="danger" onClick={() => { if (confirm('学習進捗と抽出記録をすべて削除しますか？')) { setData(emptyData); notify('すべてのデータを削除しました') } }}>削除する</button></section><section className="about"><Coffee /><h2>Coffee Journey</h2><p>Version 1.0 · データは端末内に保存</p><small>産地や精製による味の説明は一般的な傾向です。品種、農園、焙煎、抽出などによって実際の味わいは変わります。</small></section></div>
}

export default App
