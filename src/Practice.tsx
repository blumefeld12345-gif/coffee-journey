import { useMemo, useState } from 'react'
import { ArrowRight, Beaker, ChevronLeft, Coffee, MessageCircle, RefreshCw, SlidersHorizontal, Sparkles, Target } from 'lucide-react'
import type { BrewLog } from './types'
import { kindLabels, kindOf } from './storage'

export type PracticePage = 'practice' | 'taste-training' | 'order-guide' | 'brew-lab' | 'troubleshoot' | 'taste-profile'

type Props = { page: PracticePage; logs: BrewLog[]; go: (page: PracticePage | 'course' | 'brew-form') => void }

const modules = [
  { page: 'taste-training' as const, icon: Sparkles, number: '01', title: '味を言葉にする', copy: '感じた印象を選び、自分のテイスティングコメントを作る。', time: '約3分' },
  { page: 'order-guide' as const, icon: MessageCircle, number: '02', title: '注文ナビ', copy: '好みを整理して、店員さんへ伝える言葉に変える。', time: '約2分' },
  { page: 'brew-lab' as const, icon: Beaker, number: '03', title: '抽出実験室', copy: '条件を1つだけ変え、味への影響を体験する。', time: '実践15分' },
  { page: 'troubleshoot' as const, icon: SlidersHorizontal, number: '04', title: '味から調整する', copy: '困った味から、次に変える条件を1つ選ぶ。', time: '約1分' },
  { page: 'taste-profile' as const, icon: Target, number: '05', title: 'わたしの好み', copy: '記録した一杯から、自分の傾向を見つける。', time: '記録3件〜' }
]

export default function Practice({ page, logs, go }: Props) {
  if (page === 'taste-training') return <TasteTraining go={go} />
  if (page === 'order-guide') return <OrderGuide go={go} />
  if (page === 'brew-lab') return <BrewLab go={go} />
  if (page === 'troubleshoot') return <Troubleshoot go={go} />
  if (page === 'taste-profile') return <TasteProfile logs={logs} go={go} />
  return <PracticeHub logs={logs} go={go} />
}

function Back({ go }: { go: Props['go'] }) { return <button className="back" onClick={() => go('practice')}><ChevronLeft size={18} /> 実践トレーニング</button> }
function PracticeTitle({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) { return <header className="page-title practice-title"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{copy}</p></header> }

function PracticeHub({ logs, go }: { logs: BrewLog[]; go: Props['go'] }) {
  return <div className="page practice-page"><button className="back" onClick={() => go('course')}><ChevronLeft /> 学ぶへ</button><PracticeTitle eyebrow="PRACTICE STUDIO" title="知識を、自分の言葉と技術へ。" copy="覚えるだけでなく、選ぶ・伝える・試す。カフェと自宅ですぐに使える練習です。" /><div className="practice-modules">{modules.map(({ page, icon: Icon, number, title, copy, time }) => <button key={page} onClick={() => go(page)}><span>{number}</span><div className="practice-icon"><Icon /></div><div><small>{time}</small><h2>{title}</h2><p>{copy}</p>{page === 'taste-profile' && <i>{logs.length}件の記録</i>}</div><ArrowRight /></button>)}</div></div>
}

const tasteChoices = {
  acidity: ['穏やか', '柑橘のよう', 'りんごのよう', 'ベリーのよう'],
  sweetness: ['控えめ', '砂糖のよう', 'はちみつのよう', 'キャラメルのよう'],
  body: ['さらさら', '紅茶のように軽い', 'なめらか', 'どっしり'],
  finish: ['すっきり短い', '甘さが残る', '香りが長く続く', 'ほろ苦さが残る']
}

function TasteTraining({ go }: { go: Props['go'] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const complete = Object.keys(answers).length === 4
  const sentence = complete ? `このコーヒーは、酸味が${answers.acidity}で、甘さは${answers.sweetness}。口当たりは${answers.body}印象で、後味は${answers.finish}と感じました。` : ''
  const labels = { acidity: '酸味は何に近い？', sweetness: '甘さは何に近い？', body: '口当たりは？', finish: '飲んだ後の余韻は？' }
  return <div className="page practice-detail"><Back go={go} /><PracticeTitle eyebrow="TASTE WORDS" title="味を、自分の言葉にする。" copy="正解はありません。いま感じた印象に一番近い言葉を選びましょう。" />
    <div className="training-steps">{Object.entries(tasteChoices).map(([key, choices], index) => <section key={key}><div><span>0{index + 1}</span><h2>{labels[key as keyof typeof labels]}</h2></div><div className="training-choices">{choices.map((choice) => <button className={answers[key] === choice ? 'active' : ''} onClick={() => setAnswers({ ...answers, [key]: choice })} key={choice}>{choice}</button>)}</div></section>)}</div>
    {complete && <section className="words-result"><span>YOUR TASTING NOTE</span><h2>あなたの味わい表現</h2><blockquote>{sentence}</blockquote><p>カフェでは、この文章のうち特に好きだった部分を店員さんへ伝えてみましょう。</p><button className="secondary" onClick={() => setAnswers({})}><RefreshCw /> もう一度</button></section>}
  </div>
}

function OrderGuide({ go }: { go: Props['go'] }) {
  const [acid, setAcid] = useState('ほどよい')
  const [body, setBody] = useState('軽やか')
  const [aroma, setAroma] = useState('柑橘・花')
  const [drink, setDrink] = useState('ハンドドリップ')
  const origin = aroma === '柑橘・花' ? 'エチオピアやパナマ' : aroma === 'ベリー・果実' ? 'ケニアやルワンダ' : aroma === 'ナッツ・チョコ' ? 'ブラジルやグアテマラ' : 'インドネシアなど'
  const phrase = `${acid === '控えめ' ? '酸味は穏やかで' : acid === '鮮やか' ? '明るい酸味があり' : '酸味と甘さのバランスがよく'}、${body}で、${aroma}のような香りのコーヒーを${drink}で飲みたいです。おすすめはありますか？`
  return <div className="page practice-detail"><Back go={go} /><PracticeTitle eyebrow="CAFE CONVERSATION" title="好みを、店員さんへ伝える。" copy="4つ選ぶだけで、注文に使える文章を作ります。" /><ChoiceRow number="01" title="酸味" values={['控えめ', 'ほどよい', '鮮やか']} value={acid} set={setAcid} /><ChoiceRow number="02" title="口当たり" values={['軽やか', 'なめらか', 'しっかり']} value={body} set={setBody} /><ChoiceRow number="03" title="好きな香り" values={['柑橘・花', 'ベリー・果実', 'ナッツ・チョコ', 'ハーブ・スパイス']} value={aroma} set={setAroma} /><ChoiceRow number="04" title="飲み方" values={['ハンドドリップ', 'エスプレッソ系', 'アイス']} value={drink} set={setDrink} />
    <section className="order-result"><MessageCircle /><span>店員さんへの伝え方</span><blockquote>「{phrase}」</blockquote><div><strong>産地の候補</strong><p>{origin}の豆に、近い特徴が見つかるかもしれません。</p></div><div><strong>追加で聞いてみる</strong><p>「精製方法と焙煎度も教えてください」と聞くと、味と情報がつながります。</p></div></section></div>
}

function ChoiceRow({ number, title, values, value, set }: { number: string; title: string; values: string[]; value: string; set: (v: string) => void }) { return <section className="choice-row"><div><span>{number}</span><h2>{title}</h2></div><div>{values.map((item) => <button className={value === item ? 'active' : ''} onClick={() => set(item)} key={item}>{item}</button>)}</div></section> }

const experiments = [
  { id: 'grind', title: '挽き目を比べる', question: '細かさで、味の出方はどう変わる？', a: '中挽き', b: '中細挽き', keep: '豆15g・湯240g・92℃・3分', watch: 'Bは抽出が進みやすく、甘さや苦味、質感が強くなる可能性があります。酸っぱく薄い一杯の調整に使えます。' },
  { id: 'temp', title: '湯温を比べる', question: '温度で、明るさと苦味はどう変わる？', a: '88℃', b: '93℃', keep: '豆15g・湯240g・中挽き・3分', watch: 'Bは成分が溶け出しやすく、香りや酸味、苦味が強く出ることがあります。深煎りでは低めから試すのも有効です。' },
  { id: 'ratio', title: '濃さを比べる', question: '湯量で、飲み物の濃さはどう変わる？', a: '湯220g', b: '湯260g', keep: '豆15g・92℃・中挽き・約3分', watch: 'Aは濃く、Bは軽く感じやすくなります。これは主に「濃度」の比較で、抽出不足・過多とは分けて考えます。' },
  { id: 'pour', title: '注ぐ勢いを比べる', question: '粉の動きで、味はどう変わる？', a: '細く静かに', b: 'やや太く勢いよく', keep: '豆15g・湯240g・92℃・同じ注湯回数', watch: 'Bは粉がよく動き、抽出が進む場合があります。一方で湯が速く抜けることもあるため、落ちきる時間も一緒に記録しましょう。' }
]

function BrewLab({ go }: { go: Props['go'] }) {
  const [selected, setSelected] = useState(experiments[0])
  return <div className="page practice-detail"><Back go={go} /><PracticeTitle eyebrow="BREW LAB" title="一度に変えるのは、ひとつだけ。" copy="同じ豆でAとBを淹れ、違いを体験します。正解を当てる実験ではありません。" /><div className="experiment-tabs">{experiments.map((item) => <button className={selected.id === item.id ? 'active' : ''} onClick={() => setSelected(item)} key={item.id}>{item.title}</button>)}</div><section className="experiment-card"><span>TODAY'S EXPERIMENT</span><h2>{selected.question}</h2><div className="ab-cups"><article><Coffee /><small>CUP A</small><strong>{selected.a}</strong></article><b>VS</b><article><Coffee /><small>CUP B</small><strong>{selected.b}</strong></article></div><div className="keep-same"><strong>そろえる条件</strong><p>{selected.keep}</p></div><div className="observe"><strong>観察のヒント</strong><p>{selected.watch}</p></div><button className="primary wide" onClick={() => go('brew-form')}>実験した一杯を記録する <ArrowRight /></button></section></div>
}

const diagnoses = [
  { symptom: '薄くて酸っぱい', change: '挽き目を一段細かくする', why: '成分が十分に出ていない可能性があります。まず接触面積を増やし、甘さが出るかを確認します。', avoid: '粉量・湯温・時間を同時に変えない' },
  { symptom: '苦くて渋い', change: '挽き目を一段粗くする', why: '成分を取り出しすぎている可能性があります。抽出を少し穏やかにして比較します。', avoid: 'いきなり極端に低い湯温へ変えない' },
  { symptom: '濃すぎる', change: '湯量を10〜20g増やす', why: '味の出方ではなく、飲み物の濃度が高い可能性があります。まず比率を調整します。', avoid: '濃い＝必ず過抽出、と決めつけない' },
  { symptom: '薄すぎる', change: '湯量を10〜20g減らす', why: '飲み物の濃度が低い可能性があります。味が酸っぱい場合は挽き目も別の回で検討します。', avoid: '薄い＝必ず抽出不足、と決めつけない' },
  { symptom: '味がぼんやり', change: '注ぎ方と時間を毎回そろえる', why: '条件のばらつきで、味の輪郭が見えにくい可能性があります。再現できる基準を先につくります。', avoid: 'すぐに器具や豆を変えない' },
  { symptom: '酸味はあるが甘くない', change: '抽出時間を15秒ほど長くする', why: '明るい成分の後に出る甘さまで届いていない可能性があります。少しだけ抽出を進めます。', avoid: '長時間にしすぎて渋みを出さない' }
]

function Troubleshoot({ go }: { go: Props['go'] }) {
  const [selected, setSelected] = useState(diagnoses[0])
  return <div className="page practice-detail"><Back go={go} /><PracticeTitle eyebrow="TASTE TO ACTION" title="味から、次の一手を選ぶ。" copy="いま一番気になる状態を選び、次回は提案された1項目だけを変えます。" /><div className="symptom-grid">{diagnoses.map((item) => <button className={selected.symptom === item.symptom ? 'active' : ''} onClick={() => setSelected(item)} key={item.symptom}>{item.symptom}</button>)}</div><section className="diagnosis-result"><span>FIRST CHANGE</span><h2>{selected.change}</h2><div><strong>なぜ？</strong><p>{selected.why}</p></div><div><strong>今回はしないこと</strong><p>{selected.avoid}</p></div><p className="caution">器具や豆によって結果は異なります。変更前後を記録し、自分の環境で確かめることが大切です。</p><button className="primary wide" onClick={() => go('brew-form')}>次の一杯を記録する <ArrowRight /></button></section></div>
}

function TasteProfile({ logs, go }: { logs: BrewLog[]; go: Props['go'] }) {
  const profile = useMemo(() => {
    if (!logs.length) return null
    const avg = (key: keyof BrewLog['ratings']) => logs.reduce((sum, log) => sum + log.ratings[key], 0) / logs.length
    const top = (values: (string | undefined)[]) => { const counts = values.filter(Boolean).reduce<Record<string, number>>((a, v) => ({ ...a, [v!]: (a[v!] ?? 0) + 1 }), {}); return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] }
    return { acidity: avg('acidity'), sweetness: avg('sweetness'), body: avg('body'), liking: avg('liking'), origin: top(logs.map((l) => l.origin)), roast: top(logs.map((l) => l.roast)), kind: top(logs.map((l) => kindLabels[kindOf(l)])) }
  }, [logs])
  if (!profile || logs.length < 3) return <div className="page practice-detail"><Back go={go} /><PracticeTitle eyebrow="MY TASTE" title="3杯から、好みが見えてくる。" copy="産地や味の評価を記録すると、あなたの傾向をここにまとめます。" /><section className="profile-empty"><Target /><strong>{logs.length} / 3 杯</strong><div><i style={{ width: `${Math.min(100, logs.length / 3 * 100)}%` }} /></div><p>あと{Math.max(0, 3 - logs.length)}杯記録すると、最初のプロフィールを表示できます。</p><button className="primary" onClick={() => go('brew-form')}>一杯を記録する</button></section></div>
  const character = profile.acidity >= 3.8 && profile.body < 3.5 ? '華やかで軽やかな味わい' : profile.body >= 3.8 ? 'コク深く、飲みごたえのある味わい' : profile.sweetness >= 3.8 ? '甘さが長く続く、まろやかな味わい' : 'バランスのよい、親しみやすい味わい'
  return <div className="page practice-detail"><Back go={go} /><PracticeTitle eyebrow="MY TASTE" title="わたしの好みプロフィール" copy={`${logs.length}杯の記録から見える、現在の傾向です。`} /><section className="profile-hero"><Target /><span>YOUR COFFEE TYPE</span><h2>{character}</h2><p>記録が増えるほど、プロフィールは少しずつ変化します。</p></section><section className="profile-stats"><ProfileMeter label="酸味" value={profile.acidity} /><ProfileMeter label="甘み" value={profile.sweetness} /><ProfileMeter label="コク" value={profile.body} /><ProfileMeter label="好み評価" value={profile.liking} /></section><section className="profile-clues"><h2>よく選んでいるもの</h2><div>{profile.origin && <article><span>産地</span><strong>{profile.origin}</strong></article>}{profile.roast && <article><span>焙煎</span><strong>{profile.roast}</strong></article>}{profile.kind && <article><span>飲む場所</span><strong>{profile.kind}</strong></article>}</div><p>次回は、好きな条件を1つ残し、別の条件を1つだけ変えてみましょう。</p></section></div>
}

function ProfileMeter({ label, value }: { label: string; value: number }) { return <div><span>{label}</span><div><i style={{ width: `${value * 20}%` }} /></div><strong>{value.toFixed(1)}</strong></div> }
