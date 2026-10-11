export type OriginGuide = {
  id: string
  country: string
  aliases: string[]
  region: 'アフリカ' | '中南米' | 'アジア'
  headline: string
  flavors: string[]
  acidity: number
  body: number
  story: string
  regions: string[]
  pairWith: string
}

export const origins: OriginGuide[] = [
  { id: 'ethiopia', country: 'エチオピア', aliases: ['イルガチェフェ', 'イリガチェフェ', 'グジ', 'シダモ', 'sidamo', 'guji', 'yirgacheffe'], region: 'アフリカ', headline: '花と果実がひらく、華やかな一杯', flavors: ['ジャスミン', 'レモン', '紅茶', 'ベリー'], acidity: 5, body: 2, story: 'アラビカ種の原産地とされ、多様な在来品種があります。地域や精製で、紅茶のような透明感から熟したベリーの香りまで幅広く変化します。', regions: ['イルガチェフェ', 'グジ', 'シダマ', 'リム'], pairWith: '香りをじっくり楽しみたい日、フルーツ系の菓子' },
  { id: 'kenya', country: 'ケニア', aliases: ['ニエリ', 'キリニャガ', 'sl28', 'sl34', 'nyeri', 'kirinyaga'], region: 'アフリカ', headline: '果汁のように鮮やかで、余韻が長い', flavors: ['カシス', 'グレープフルーツ', 'トマト', '黒糖'], acidity: 5, body: 4, story: 'SL28やSL34などの品種と高地の環境で知られます。明るい酸味と豊かな甘さが重なり、ジューシーに感じる豆が多い傾向です。', regions: ['ニエリ', 'キリニャガ', 'エンブ'], pairWith: '果実感をはっきり味わいたい日、ベリー系デザート' },
  { id: 'rwanda', country: 'ルワンダ', aliases: ['ブルボン', 'bourbon'], region: 'アフリカ', headline: '赤い果実とやさしい甘さの調和', flavors: ['赤りんご', 'ベリー', '紅茶', 'キャラメル'], acidity: 4, body: 3, story: '標高の高い丘陵地で栽培され、ブルボン系品種が広く見られます。きれいな酸味と丸い甘さのバランスが魅力です。', regions: ['西部州', '南部州', '北部州'], pairWith: '軽やかさと甘さを両方ほしい日、焼き菓子' },
  { id: 'burundi', country: 'ブルンジ', aliases: ['ブルボン', 'bourbon'], region: 'アフリカ', headline: '明るい果実感に、蜜のような甘さ', flavors: ['クランベリー', 'オレンジ', 'はちみつ', '紅茶'], acidity: 4, body: 3, story: '小規模農家の豆がウォッシングステーションに集められることが多い産地。明るさと甘い余韻を持つロットが見られます。', regions: ['カヤンザ', 'ンゴジ'], pairWith: '爽やかだけれど甘い一杯、柑橘の菓子' },
  { id: 'colombia', country: 'コロンビア', aliases: ['ウイラ', 'ナリーニョ', 'カウカ', 'huila', 'narino', 'cauca'], region: '中南米', headline: '甘さ・酸味・コクの優等生', flavors: ['オレンジ', '赤りんご', 'キャラメル', 'チョコレート'], acidity: 4, body: 3, story: '山脈による多様な気候と年間を通した収穫で、味わいの幅が広い産地です。親しみやすいバランスから華やかな個性派まで見つかります。', regions: ['ウイラ', 'ナリーニョ', 'カウカ', 'アンティオキア'], pairWith: '迷ったときの一杯、バターを使った焼き菓子' },
  { id: 'brazil', country: 'ブラジル', aliases: ['セラード', 'ミナスジェライス', 'cerrado', 'minas gerais'], region: '中南米', headline: 'ナッツとチョコの、穏やかな安心感', flavors: ['アーモンド', 'チョコレート', 'キャラメル', 'ドライフルーツ'], acidity: 2, body: 4, story: '世界最大級の生産国で、広大な地域に多様な農園があります。酸味が穏やかで香ばしく、エスプレッソやブレンドにもよく使われます。', regions: ['ミナスジェライス', 'セラード', 'モジアナ'], pairWith: 'ほっとしたい日、チョコレートやナッツ' },
  { id: 'guatemala', country: 'グアテマラ', aliases: ['アンティグア', 'ウエウエテナンゴ', 'antigua', 'huehuetenango'], region: '中南米', headline: 'チョコの甘さに、りんごの明るさ', flavors: ['りんご', 'カカオ', 'キャラメル', 'スパイス'], acidity: 4, body: 4, story: '火山性土壌や高地など、地域ごとの環境差が大きい産地です。しっかりした甘さとコクに、きれいな酸味が重なりやすい傾向です。', regions: ['アンティグア', 'ウエウエテナンゴ', 'アティトラン'], pairWith: '甘さと飲みごたえがほしい日、チョコレートケーキ' },
  { id: 'costarica', country: 'コスタリカ', aliases: ['タラス', 'tarrazu', 'ハニー'], region: '中南米', headline: '明るくクリーン、甘さの輪郭もくっきり', flavors: ['シトラス', 'りんご', 'はちみつ', 'キャラメル'], acidity: 4, body: 3, story: 'マイクロミルによる細かなロット管理やハニープロセスでも知られます。明瞭な酸味と甘さを感じる豆が多い傾向です。', regions: ['タラス', 'ウェストバレー', 'セントラルバレー'], pairWith: 'すっきり甘い一杯、朝食や柑橘の菓子' },
  { id: 'panama', country: 'パナマ', aliases: ['ゲイシャ', 'ゲシャ', 'ボケテ', 'gesha', 'geisha', 'boquete'], region: '中南米', headline: '香水のような香りと、繊細な透明感', flavors: ['ジャスミン', 'ベルガモット', '桃', 'はちみつ'], acidity: 5, body: 2, story: 'ボケテ周辺の高地やゲシャ品種で名高い産地。とくにゲシャは、花や柑橘を思わせる非常に華やかな香りで知られます。', regions: ['ボケテ', 'ボルカン', 'レナシミエント'], pairWith: '香りに集中したい特別な日、単体でゆっくり' },
  { id: 'peru', country: 'ペルー', aliases: ['カハマルカ', 'クスコ', 'cajamarca', 'cusco'], region: '中南米', headline: 'やさしい果実味と、なめらかな甘さ', flavors: ['黄りんご', 'ミルクチョコ', 'ナッツ', 'キャラメル'], acidity: 3, body: 3, story: 'アンデス山脈の各地で小規模農家が栽培しています。穏やかでクリーン、日常になじみやすい甘さを持つ豆が見られます。', regions: ['カハマルカ', 'クスコ', 'フニン'], pairWith: '毎日飲みたい穏やかな一杯、ビスケット' },
  { id: 'indonesia', country: 'インドネシア', aliases: ['スマトラ', 'マンデリン', 'ジャワ', 'トラジャ', 'sumatra', 'mandheling', 'java', 'toraja'], region: 'アジア', headline: '大地やハーブを思わせる、深いコク', flavors: ['ハーブ', 'ダークチョコ', 'スパイス', '大地'], acidity: 2, body: 5, story: 'スマトラ式と呼ばれる独特の処理もあり、重厚な質感と複雑な香りで知られます。ジャワやスラウェシなど島によっても個性が異なります。', regions: ['スマトラ', 'ジャワ', 'スラウェシ（トラジャ）'], pairWith: '深いコクを楽しみたい日、濃厚なチョコやチーズ' },
  { id: 'yemen', country: 'イエメン', aliases: ['モカ', 'ハラーズ', 'mokka', 'mocha', 'haraz'], region: 'アジア', headline: '乾いた果実とスパイスの、野性的な複雑さ', flavors: ['ドライフルーツ', 'カカオ', 'シナモン', 'ワイン'], acidity: 3, body: 4, story: 'コーヒー栽培と交易の長い歴史を持ち、乾燥した山岳地で伝統的に栽培されます。凝縮した果実感と独特の複雑さが魅力です。', regions: ['ハラーズ', 'バニ・マタル', 'サナア'], pairWith: '個性的な香りを探検したい日、スパイス菓子' }
]

export const processEffects = {
  unknown: { label: '不明・選ばない', note: '精製方法による補正はせず、産地の一般的な傾向を表示します。', flavors: [] },
  washed: { label: 'ウォッシュド', note: '輪郭が明瞭で、すっきりした酸味や後味になりやすい傾向です。', flavors: ['透明感', 'クリーン'] },
  natural: { label: 'ナチュラル', note: '熟した果実の香り、豊かな甘さ、丸い質感が出やすい傾向です。', flavors: ['熟した果実', '芳醇'] },
  honey: { label: 'ハニー', note: 'クリーンさと果実感の間で、蜜のような甘さを感じやすい傾向です。', flavors: ['はちみつ', 'まろやか'] },
  anaerobic: { label: 'アナエロビックなど', note: '発酵由来の強い香りや、トロピカルフルーツ、スパイスの印象が出ることがあります。', flavors: ['発酵感', 'トロピカル'] }
} as const

export const roastEffects = {
  unknown: { label: '不明・選ばない', note: '焙煎度による補正はせず、産地の一般的な傾向を表示します。', acidity: 0, body: 0, flavors: [] },
  light: { label: '浅煎り', note: '産地由来の花や果実、明るい酸味を感じやすい焙煎です。', acidity: 1, body: -1, flavors: ['花', '果実'] },
  medium: { label: '中煎り', note: '果実感とロースト由来の甘さが調和しやすい焙煎です。', acidity: 0, body: 0, flavors: ['キャラメル', 'バランス'] },
  dark: { label: '深煎り', note: '酸味は穏やかになり、カカオや香ばしさ、重い質感が出やすい焙煎です。', acidity: -2, body: 1, flavors: ['カカオ', '香ばしさ'] }
} as const
