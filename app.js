const{useState,useMemo,useEffect,useRef,useCallback}=React;
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function SimpleBarChart(_ref) {
  let data = _ref.data;
  if (!data || !data.length) return null;
  const max = Math.max(...data.map(d => d.minutes), 1);
  const W = 300,
    H = 90,
    PL = 4;
  const bw = Math.max((W - PL) / data.length - 2, 2);
  return React.createElement('svg', {
    viewBox: '0 0 ' + W + ' ' + H,
    style: {
      width: '100%',
      height: H
    }
  }, data.map((d, i) => {
    const bh = Math.max(d.minutes / max * (H - 20), 1);
    const x = PL + i * ((W - PL) / data.length);
    return React.createElement('g', {
      key: i
    }, React.createElement('rect', {
      x,
      y: H - 20 - bh,
      width: bw,
      height: bh,
      fill: '#5B9FFF',
      rx: 2
    }), i % 3 === 0 ? React.createElement('text', {
      x: x + bw / 2,
      y: H - 4,
      textAnchor: 'middle',
      fill: 'rgba(255,255,255,0.3)',
      fontSize: 7
    }, d.date) : null);
  }));
}
const PULSE_STYLE = `
@keyframes pulse {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}
`;

// ── CONSTANTS ──────────────────────────────────────────────
const SUBJECTS = [{
  id: "keikaku",
  name: "計画",
  short: "計",
  color: "#FF6B6B",
  bg: "rgba(255,107,107,0.12)"
}, {
  id: "kankyo",
  name: "環境・設備",
  short: "環",
  color: "#4ECDC4",
  bg: "rgba(78,205,196,0.12)"
}, {
  id: "houki",
  name: "法規",
  short: "法",
  color: "#5B9FFF",
  bg: "rgba(91,159,255,0.12)"
}, {
  id: "kouzou",
  name: "構造",
  short: "構",
  color: "#B57BFF",
  bg: "rgba(181,123,255,0.12)"
}, {
  id: "sekou",
  name: "施工",
  short: "施",
  color: "#FFB84D",
  bg: "rgba(255,184,77,0.12)"
}];
const RANK_COLOR = {
  A: "#34D399",
  B: "#FBBF24",
  C: "#F87171"
};
const EXAM_DATE = new Date("2027-07-25");
// JST(UTC+9)基準の日付取得
// logsの値(秒 or 分)を分に統一して返す
// 値が100以上なら秒、未満なら分として扱う
// 全て秒単位で統一
const toMinutes = val => Math.floor(val / 60);
const toSeconds = val => val;
const dayTotalSec = dayLog => Object.values(dayLog || {}).reduce((a, v) => a + v, 0);
const dayTotalMin = dayLog => Math.floor(dayTotalSec(dayLog) / 60);
const todayStr = () => {
  const d = new Date();
  d.setTime(d.getTime() + 9 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 10);
};
const nowJST = () => {
  const d = new Date();
  d.setTime(d.getTime() + 9 * 60 * 60 * 1000);
  return d;
};
const relativeDate = dateStr => {
  if (!dateStr) return null;
  const todayJST = nowJST();
  todayJST.setHours(0, 0, 0, 0);
  const today = todayJST;
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  const diff = Math.round((today - d) / 86400000);
  if (diff === 0) return "今日";
  if (diff === 1) return "昨日";
  if (diff < 7) return `${diff}日前`;
  if (diff < 30) return `${Math.floor(diff / 7)}週間前`;
  if (diff < 365) return `${Math.floor(diff / 30)}ヶ月前`;
  return `${Math.floor(diff / 365)}年前`;
};

// ── 専門用語辞書 ─────────────────────────────────────────────
const TERMS = ["主要構造部", "特殊建築物", "延焼のおそれのある部分", "確認済証", "完了検査", "指定確認検査機関", "遮炎性能", "防火設備", "特定防火設備", "準防火性能", "建築物", "建築主", "工事施工者", "工事監理", "工事監理者", "建築主事", "特定行政庁", "大規模の修繕", "大規模の模様替", "新築", "増築", "改築", "移転", "避難階", "地階", "階数", "延べ面積", "建築面積", "床面積", "容積率", "建蔽率", "耐火構造", "準耐火構造", "防火構造", "不燃材料", "準不燃材料", "難燃材料", "耐火建築物", "準耐火建築物", "防火地域", "準防火地域", "防火区画", "排煙設備", "非常用照明", "非常用の進入口", "内装制限", "構造計算適合性判定", "仮使用", "中間検査", "定期報告", "特定工程"];

// ── 間隔反復 ────────────────────────────────────────────────
const SRS_INTERVALS = [1, 2, 4, 7, 14, 30, 60];
const getSrsNextDate = q => {
  if (!q.lastAnswered) return null;
  const h = q.history || [];
  let streak = 0;
  for (let i = h.length - 1; i >= 0; i--) {
    if (h[i] === "○") streak++;else break;
  }
  const interval = SRS_INTERVALS[Math.min(streak, SRS_INTERVALS.length - 1)];
  const last = new Date(q.lastAnswered);
  last.setDate(last.getDate() + interval);
  return last.toISOString().slice(0, 10);
};
const isDueToday = q => {
  if (!q.lastAnswered) return true;
  const next = getSrsNextDate(q);
  return !next || next <= todayStr();
};
const fmtMD = d => `${d.getMonth() + 1}/${d.getDate()}`;
const BUNDLED_QUESTIONS = [{
  id: "q_H30_01",
  subject: "houki",
  year: "H30",
  no: 1,
  rank: "A",
  topic: "用語の定義",
  qPage: "12",
  tbPage: "7",
  q: "次の記述のうち、建築基準法上、誤っているものはどれか。",
  opts: ["高架の工作物内に設ける店舗は、「建築物」である。", "傾斜地等で敷地に高低差のある場合は、建築物の避難階が複数となることがある。", "「遮炎性能」とは、通常の火災時における火炎を有効に遮るために外壁に必要とされる性能をいう。", "建築材料の品質における「安全上、防火上又は衛生上重要である建築物の部分」には、主要構造部以外のバルコニーで防火上重要であるものとして国土交通大臣が定めるものも含まれる。"],
  correct: 2,
  explain: "法2条九号の二ロ。遮炎性能とは「防火設備」に必要な性能。「外壁」ではない点が誤り。\n①建築物に該当○\n②複数避難階あり○\n④バルコニー等含まれる○",
  refs: "法2条九号の二ロ",
  starred: false,
  history: []
}, {
  id: "q_H29_01",
  subject: "houki",
  year: "H29",
  no: 1,
  rank: "A",
  topic: "用語の定義",
  qPage: "13",
  tbPage: "7",
  q: "次の記述のうち、建築基準法上、誤っているものはどれか。",
  opts: ["液化石油ガスの保安の確保及び取引の適正化に関する法律第38条の2の規定並びにこの規定に基づく命令及び条例の規定で建築物の敷地、構造又は建築設備に係るものは、「建築基準関係規定」である。", "防火戸であって、これに通常の火災による火熱が加えられた場合に、加熱開始後45分間当該加熱面以外の面に火炎を出さないものとして、国土交通大臣が定めた構造方法を用いるものは、「特定防火設備」である。", "同一敷地内に二つの地上2階建ての建築物(延べ面積はそれぞれ400㎡及び200㎡)を新築する場合において、当該建築物相互の外壁間の距離を5mとする場合は、二つの建築物は「延焼のおそれのある部分」を有している。", "スポーツの練習場の用途に供する建築物は、非常用の照明装置の設置に関する規定における「学校等」に含まれる。"],
  correct: 1,
  explain: "令112条1項かっこ書。特定防火設備は「1時間」耐火。「45分間」が誤り。\n①建築基準関係規定に該当○\n③延焼のおそれある部分あり○\n④学校等に含まれる○",
  refs: "令112条1項かっこ書",
  starred: false,
  history: []
}, {
  id: "q_R01_01",
  subject: "houki",
  year: "R01",
  no: 1,
  rank: "A",
  topic: "用語の定義",
  qPage: "11",
  tbPage: "2",
  q: "次の記述のうち、建築基準法上、誤っているものはどれか。",
  opts: ["建築物の周囲において発生する通常の火災による延焼の抑制に一定の効果を発揮するために外壁に必要とされる性能を、「準防火性能」という。", "天井面から50cm下方に突出した垂れ壁で、不燃材料で覆われたものは、「防煙壁」に該当する。", "電子計算機に対する指令であって、一の結果を得ることができるように組み合わされたものを、「プログラム」という。", "木造、地上2階建ての建築物において、土台の過半について行う修繕は、「大規模の修繕」に該当する。"],
  correct: 3,
  explain: "法2条十四号。土台は主要構造部ではないため大規模の修繕に該当しない。\n①準防火性能の定義○\n②防煙壁の定義○\n③プログラムの定義○",
  refs: "法2条十四号",
  starred: false,
  history: []
}, {
  id: "q_H28_01",
  subject: "houki",
  year: "H28",
  no: 1,
  rank: "B",
  topic: "用語の定義",
  qPage: "14",
  tbPage: "2",
  q: "次の記述のうち、建築基準法上、誤っているものはどれか。",
  opts: ["レストラン、飲食店の用途に供する建築物で、その用途に供する部分の床面積の合計が500㎡のものは、「特殊建築物」である。", "鉄筋コンクリート造3階建ての建築物において、その3階の床及びはりに鉄筋を配置するものは、「建築物」の一部である「建築」に該当する。", "建築物の部分で、自動車車庫の用途に供するものは、「特殊建築物」に含まれない。", "地階に設ける居室の床が地盤面下にある階は、「地階」である。"],
  correct: 2,
  explain: "法2条二号。自動車車庫は特殊建築物に含まれる。「含まれない」が誤り。\n①レストランは特殊建築物○\n②建築の定義○\n④地階の定義○",
  refs: "法2条二号",
  starred: false,
  history: []
}, {
  id: "q_H26_01",
  subject: "houki",
  year: "H26",
  no: 1,
  rank: "B",
  topic: "用語の定義",
  qPage: "16",
  tbPage: "2",
  q: "次の記述のうち、建築基準法上、誤っているものはどれか。",
  opts: ["日用品の販売を主たる目的とする店舗で、その用途に供する部分の床面積の合計が4㎡以内であるものは、「長屋」の一部として建築することができる。", "いわゆるコンビニエンスストアの用途に供する建築物は、「特殊建築物」である。", "建築物の部分で、自動車車庫の用途に供するものは、「特殊建築物」の部分に含まれる。", "日本国内に存在する外国公館は、「建築物」に含まれる。"],
  correct: 0,
  explain: "法2条一号かっこ書。長屋の店舗床面積制限は「4㎡以内」ではなく「50㎡以内かつ延べ面積の1/2未満」。\n②コンビニは特殊建築物○\n③自動車車庫は特殊建築物○\n④外国公館も建築物○",
  refs: "法2条一号、二号",
  starred: false,
  history: []
}, {
  id: "q_R02_06",
  subject: "houki",
  year: "R02",
  no: 6,
  rank: "B",
  topic: "用語の定義",
  qPage: "19",
  tbPage: "2",
  q: "次の記述のうち、建築基準法上、誤っているものはどれか。",
  opts: ["建築物の主要構造部の一種以上について行う過半の模様替は、「大規模の模様替」である。", "建築物に設ける給水管は、建築物に設ける配管設備として「建築設備」に含まれる。", "百貨店の用途に供する建築物の地上階に設ける居室は、「特殊建築物」の居室に該当する。", "建築物の一部が木造である場合において、その木造の部分と木造以外の部分とが接続して建築されているものは、「木造建築物」である。"],
  correct: 3,
  explain: "木造と非木造が接続している場合は混構造であり「木造建築物」とはいえない。\n①大規模の模様替の定義○\n②給水管は建築設備○\n③百貨店は特殊建築物○",
  refs: "法2条五号",
  starred: false,
  history: []
}, {
  id: "q_H24_01",
  subject: "houki",
  year: "H24",
  no: 1,
  rank: "A",
  topic: "用語の定義",
  qPage: "21",
  tbPage: "2",
  q: "次の記述のうち、建築基準法上、誤っているものはどれか。",
  opts: ["スキー場、スケート場、水泳場又はスポーツの練習場の用途に供する建築物は、「特殊建築物」である。", "プログラムは、電子計算機に対する指令であって、一の結果を得ることができるように組み合わされたものをいう。", "高さ6mのもの（土地に定着するもの）は、「工作物」の築造について建築確認が必要なものに含まれない。", "「大規模の修繕」とは、建築物の主要構造部の一種以上について行う過半の修繕をいう。"],
  correct: 2,
  explain: "令138条。高さ6mを超える煙突等は工作物として確認申請が必要。\n①スポーツ練習場は特殊建築物○\n②プログラムの定義○\n④大規模の修繕の定義○",
  refs: "令138条",
  starred: false,
  history: []
}, {
  id: "q_H23_11",
  subject: "houki",
  year: "H23",
  no: 11,
  rank: "B",
  topic: "用語の定義",
  qPage: "22",
  tbPage: "2",
  q: "次の記述のうち、建築基準法上、誤っているものはどれか。",
  opts: ["建築物の屋上に設ける広告塔で、高さが2m〜4mの範囲のものについては、工作物の築造に関する規定は適用されない。", "建築物の主要構造部の一種以上について行う過半の修繕を「大規模の修繕」という。", "「建築」とは、建築物を新築し、増築し、改築し、又は移転することをいう。", "「延焼のおそれのある部分」とは、隣地境界線等から、1階にあっては3m以下、2階以上にあっては5m以下の距離にある建築物の部分をいう。"],
  correct: 0,
  explain: "令138条3項一号。屋上広告塔で高さ3mを超えるものは確認申請が必要。2〜4mの範囲は3mを超えるものを含む。\n②大規模の修繕の定義○\n③建築の定義○\n④延焼のおそれのある部分の定義○",
  refs: "令138条3項一号",
  starred: false,
  history: []
}, {
  id: "q_R01_02",
  subject: "houki",
  year: "R01",
  no: 2,
  rank: "A",
  topic: "面積・高さ・階数",
  qPage: "25",
  tbPage: "24",
  q: "次の記述のうち、建築基準法上、誤っているものはどれか。",
  opts: ["建築物の地上階において、その階の床面積に対する天井の高さが1/2以上の部分の高さが1.5mに満たない階は、「地階」である。", "建築物の敷地が斜面になっている場合には、建築物の「避難階」が複数となることがある。", "共同住宅の住戸に設ける台所の床面積は、その住戸の「居室」の床面積に算入しない。", "建築物の屋上部分であるエレベーター機械室で、その水平投影面積の合計が当該建築物の建築面積の1/8以内のものは、当該建築物の「階数」に算入しない。"],
  correct: 2,
  explain: "令19条。台所は居室に含まれ、床面積算入しないとする規定はなく誤り。\n①地階の定義○\n②避難階が複数になりうる○\n④エレベーター機械室1/8以内は階数不算入○",
  refs: "令19条、令2条",
  starred: false,
  history: []
}, {
  id: "q_H30_02",
  subject: "houki",
  year: "H30",
  no: 2,
  rank: "B",
  topic: "面積・高さ・階数",
  qPage: "25",
  tbPage: "24",
  q: "次の記述のうち、建築基準法上、誤っているものはどれか。",
  opts: ["建築物の屋上に設けるものであって、その水平投影面積の合計が当該建築物の建築面積の1/8以内の階段室は、建築物の「高さ」に算入しない。", "建築物の「建築面積」の算定に当たっては、地盤面下の部分及び特定の建築物の部分は、建築面積に算入しない。", "共同住宅において、共用の廊下及び階段の用に供する部分の床面積は、容積率算定の基礎となる「延べ面積」に算入しない。", "建築物の容積率算定の基礎となる「延べ面積」の算定に当たり、自動車車庫等の用途に供する部分の床面積は、延べ面積の1/5を限度として算入しない。"],
  correct: 0,
  explain: "令2条1項6号。屋上階段室1/8以内のものは「高さ」に完全に算入しないのではなく12mを超えた部分のみ算入する。\n②建築面積の算定○\n③共用廊下・階段は延べ面積不算入○\n④自動車車庫1/5限度○",
  refs: "令2条1項6号",
  starred: false,
  history: []
}, {
  id: "q_H26_02",
  subject: "houki",
  year: "H26",
  no: 2,
  rank: "A",
  topic: "面積・高さ・階数",
  qPage: "29",
  tbPage: "24",
  q: "次の記述のうち、建築基準法上、誤っているものはどれか。",
  opts: ["同一敷地内に2棟の建築物がある場合、各棟の延べ面積をそれぞれ算定し、各棟の容積率を個別に確認する。", "建築物の容積率算定の基礎となる延べ面積には、共同住宅の共用の廊下及び階段の用に供する部分の床面積は算入しない。", "建築物の「高さ」の算定において、棟飾及び防火壁の屋上突出部は、その建築物の高さに算入しない。", "建築物の屋上部分であって、階段室・昇降機塔・装飾塔等の水平投影面積の合計が建築面積の1/8以内のものについては、12mまでは高さに算入しない。"],
  correct: 0,
  explain: "同一敷地内の複数建築物は敷地全体の延べ面積合計を敷地面積で除して容積率を算定。各棟個別に算定するのは誤り。\n②共用廊下・階段は算入しない○\n③棟飾・防火壁は不算入○\n④1/8以内で12mまで不算入○",
  refs: "法52条",
  starred: false,
  history: []
}, {
  id: "q_H24_03",
  subject: "houki",
  year: "H24",
  no: 3,
  rank: "B",
  topic: "面積・高さ・階数",
  qPage: "33",
  tbPage: "24",
  q: "次の記述のうち、建築基準法上、誤っているものはどれか。",
  opts: ["建築物の屋上に設けるもので水平投影面積の合計が当該建築物の建築面積の1/8以内の階段室は、その部分の高さが12mまでは建築物の「高さ」に算入しない。", "令56条の2に規定する日影規制において、軒の高さが7mを超える建築物は規制対象となる。", "同一敷地内に2以上の建築物がある場合、延べ面積の合計と敷地面積とにより容積率を算定する。", "令2条1項四号に規定する「建築面積」の算定において、地盤面下の部分はその建築面積に算入しない。"],
  correct: 1,
  explain: "日影規制対象は軒高7mを超えるもの又は地階除く階数3以上のもの。正答②を確認。\n①階段室12m以内不算入○\n③同一敷地内は合算○\n④地盤面下は不算入○",
  refs: "令2条、令56条の2",
  starred: false,
  history: []
}, {
  id: "q_R01_04",
  subject: "houki",
  year: "R01",
  no: 4,
  rank: "A",
  topic: "手続き",
  qPage: "37",
  tbPage: "30",
  q: "次の記述のうち、建築基準法上、誤っているものはどれか。",
  opts: ["延べ面積が1,000㎡を超え、高さが13mを超える建築物を新築する場合、当該工事の施工者は、工事現場の見やすい場所に建築主事等への確認済証に記載された事項を掲示しなければならない。", "延べ面積が500㎡のホテルを新築する場合、工事施工者は当該建築物の工事を完了したときは、建築主事に工事完了の検査を申請しなければならない。", "木造3階建て、延べ面積300㎡の一戸建て住宅を新築する場合、工事施工者は建築主事等による中間検査を受けなければならない。", "建築基準法第6条の規定による確認の申請書の提出を受けた場合においても、建築主事は工事施工者に対し適切に工事を行うよう指導しなければならない。"],
  correct: 3,
  explain: "確認申請を受けた建築主事が指導すべき相手は「建築主」であり「工事施工者」ではない。\n①確認済証の掲示義務○\n②ホテル完了検査申請必要○\n③中間検査の対象となりうる○",
  refs: "法6条、法7条の3",
  starred: false,
  history: []
}, {
  id: "q_H30_03",
  subject: "houki",
  year: "H30",
  no: 3,
  rank: "B",
  topic: "手続き",
  qPage: "38",
  tbPage: "30",
  q: "次の記述のうち、建築基準法上、誤っているものはどれか。",
  opts: ["建築主事を置かない市町村の区域内において、延べ面積が多数の者が利用する用途に供する建築物で政令で定めるものを新築しようとする場合、建築主は都道府県知事に確認申請をしなければならない。", "建築確認申請が不要な建築物の建築工事について、工事施工者は工事現場の見やすい場所に工事概要を掲示しなければならない場合がある。", "延べ面積が20㎡、高さが8m、地上2階建ての木造建築物の大規模の修繕をしようとする場合、建築主は建築主事等の確認を受けなければならない。", "建築主事は、確認申請書が受理されてから、木造以外の建築物に係るものについて特定の場合を除き、35日以内に確認済証を交付しなければならない。"],
  correct: 2,
  explain: "木造2階建てで延べ面積500㎡以下等は四号建築物。大規模修繕でも確認申請不要。\n①建築主事を置かない市町村○\n②掲示義務○\n④35日以内○",
  refs: "法6条1項",
  starred: false,
  history: []
}, {
  id: "q_H30_04",
  subject: "houki",
  year: "H30",
  no: 4,
  rank: "B",
  topic: "手続き",
  qPage: "41",
  tbPage: "41",
  q: "次の記述のうち、建築基準法上、誤っているものはどれか。",
  opts: ["延べ面積が1,500㎡を超え、かつ5階以上の建築物の新築工事について、工事監理者は工事監理報告書を建築主に提出しなければならない。", "延べ面積が1,000㎡を超え、かつ3階建ての共同住宅の新築工事について、特定工程に係る工事を終えたときは、建築主は建築主事等の中間検査を申請しなければならない。", "延べ面積が500㎡を超え、高さが13mを超え、かつ地上3階以上の建築物の新築工事について、工事施工者は建築基準法令の規定に適合するよう工事を行う義務がある。", "延べ面積が300㎡の木造2階建て住宅の大規模の修繕の工事について、建築主は工事が完了したときに建築主事等の完了検査の申請をする必要はない。"],
  correct: 3,
  explain: "確認申請が必要な建築物の工事完了時は完了検査申請も必要。④の「申請する必要はない」が誤り。\n①工事監理報告書○\n②中間検査申請○\n③工事施工者の義務○",
  refs: "法7条",
  starred: false,
  history: []
}, {
  id: "q_H29_03",
  subject: "houki",
  year: "H29",
  no: 3,
  rank: "B",
  topic: "手続き",
  qPage: "43",
  tbPage: "30",
  q: "次の記述のうち、建築基準法上、誤っているものはどれか。",
  opts: ["鉄筋コンクリート造、延べ面積500㎡、高さ10m、地上3階建ての病院の新築に係る建築確認において、構造計算適合性判定が必要な場合、建築主事は構造計算適合性判定の結果を記載した通知書の交付を受けた後でなければ、確認済証を交付することができない。", "延べ面積600㎡のホテルに係る大規模の修繕の工事が完了した場合、建築主は4日以内に建築主事等に対して工事完了の検査を申請しなければならない。", "木造3階建て、延べ面積500㎡の建築物に係る工事の施工者は、当該工事に係る設計図書を工事現場に備えておかなければならない。", "建築物のエネルギー消費性能の向上に関する法律に基づく建築物エネルギー消費性能確保計画の認定を受けた建築物については、建築基準法の規定による建築確認を受けたものとみなされる。"],
  correct: 3,
  explain: "建築物省エネ法の認定を受けても建築基準法の確認を受けたとみなされる規定はない。\n①構造計算適合性判定後に確認済証交付○\n②4日以内完了検査申請○\n③設計図書の備え置き○",
  refs: "法6条の3",
  starred: false,
  history: []
}, {
  id: "q_H29_04",
  subject: "houki",
  year: "H29",
  no: 4,
  rank: "A",
  topic: "手続き",
  qPage: "43",
  tbPage: "30",
  q: "次の記述のうち、建築基準法上、誤っているものはどれか。",
  opts: ["延べ面積が60㎡の木造平屋建ての建築物の新築をしようとする場合、建築主は建築主事等の確認を受けなくてもよい。", "建築主は、建築主事等から確認済証の交付を受けた後でなければ、当該確認に係る建築物の建築工事を行うことができない。", "建築士である設計者から設計図書に問題があると報告を受けた建築主は、建築主事等への届出をする必要がある。", "建築主事等は、確認申請書を受理した場合において、建築物の計画が建築基準関係規定に適合することを確認したときは、申請者に確認済証を交付しなければならない。"],
  correct: 2,
  explain: "法6条の2。設計者から不適合の報告を受けた場合の届出義務の主体について正答③を確認。\n①60㎡木造平屋→四号で確認不要○\n②確認済証交付後に工事開始○\n④確認済証交付義務○",
  refs: "法6条の2",
  starred: false,
  history: []
}, {
  id: "q_H28_03",
  subject: "houki",
  year: "H28",
  no: 3,
  rank: "B",
  topic: "手続き",
  qPage: "45",
  tbPage: "30",
  q: "次の記述のうち、建築基準法上、誤っているものはどれか。",
  opts: ["木造、地上3階建て、延べ面積300㎡、高さ9m、軒高8mの一戸建て住宅について大規模の修繕をしようとする場合、建築主は建築主事等の確認を受けなければならない。", "建築確認を要しない建築物の建築工事についても、建築主は工事完了後4日以内に建築主事等に完了検査の申請をしなければならない場合がある。", "建築主事は、建築確認申請書を受理した日から、木造以外の建築物に係るものについて原則として35日以内に確認済証を交付しなければならない。", "建築主事は、高さ8m、延べ面積500㎡、地上3階建ての建築物の一部の除却の届出を受けた場合においても、危険を防止するために必要な条件を付することができる。"],
  correct: 1,
  explain: "確認申請を要しない建築物については完了検査申請も不要。②が誤り。\n①木造3階建て300㎡は三号建築物で確認申請必要○\n③35日以内○\n④除却届出への条件付与可能○",
  refs: "法7条、法15条",
  starred: false,
  history: []
}, {
  id: "q_H27_03",
  subject: "houki",
  year: "H27",
  no: 3,
  rank: "B",
  topic: "手続き",
  qPage: "48",
  tbPage: "44",
  q: "次の記述のうち、建築基準法上、誤っているものはどれか。",
  opts: ["建築物の建築に係る確認済証の交付を受けた後、建築主の変更があった場合、新たな建築主は建築主事等に届出をしなければならない。", "鉄筋コンクリート造、地上2階建て、延べ面積500㎡のホテルを新築しようとする場合、建築主は建築主事等の確認を受けなければならない。", "建築基準法第12条の規定に基づく定期報告制度において、建築設備の定期検査報告の対象となる建築設備には、非常用の照明装置は含まれない。", "木造、地上3階建て、延べ面積300㎡の一戸建て住宅を新築しようとする場合、建築主は建築主事等の確認を受けなければならない。"],
  correct: 2,
  explain: "法12条3項。非常用照明装置は定期検査報告の対象に含まれる。「含まれない」が誤り。\n①建築主変更の届出義務○\n②RC2階ホテルは確認申請必要○\n④木造3階建ては確認申請必要○",
  refs: "法12条3項",
  starred: false,
  history: []
}, {
  id: "q_H26_04",
  subject: "houki",
  year: "H26",
  no: 4,
  rank: "B",
  topic: "手続き",
  qPage: "49",
  tbPage: "30",
  q: "次の記述のうち、建築基準法上、誤っているものはどれか。",
  opts: ["建築物のエネルギー消費性能の向上に関する法律に基づく認定を受けた建築物は、建築基準法の規定による確認を受けたものとみなされる場合がある。", "建築主事等が確認済証を交付した建築物について、建築基準法の施行に関する事務を主管する都道府県知事は、建築主に対し工事の施工状況に関する報告を求めることができる。", "建築確認申請書に添付する設計図書を作成した建築士は、設計図書が建築基準関係規定に適合することを確認した旨を当該設計図書に記載しなければならない。", "建築主事は、建築確認の申請書が提出された建築物が建築基準関係規定に適合しないことを発見した場合において、緊急の必要があるときは確認済証の交付を保留することができる。"],
  correct: 0,
  explain: "建築物省エネ法の認定を受けても建築基準法の確認を受けたとみなされる規定はない。\n②都道府県知事の報告徴収権限○\n③建築士の適合確認記載義務○\n④確認済証交付保留○",
  refs: "法6条",
  starred: false,
  history: []
}, {
  id: "q_H25_03",
  subject: "houki",
  year: "H25",
  no: 3,
  rank: "A",
  topic: "手続き",
  qPage: "50",
  tbPage: "30",
  q: "次の記述のうち、建築基準法上、誤っているものはどれか。",
  opts: ["木造、地上3階建て、延べ面積100㎡、高さ8.5m、軒高6.5mの一戸建て住宅を新築しようとする場合、建築主は建築主事等の確認を受けなければならない。", "建築主事は、建築確認の申請書を受理した日から、木造以外の建築物で2以上の階数を有するものに係るものについては、原則として35日以内に確認済証を交付しなければならない。", "建築確認において、指定確認検査機関が確認した場合は、当該機関が確認済証を交付する。", "鉄骨造、平家建て、延べ面積100㎡以下の建築物の大規模の修繕については、建築主は建築主事等の確認を受ける必要はない。"],
  correct: 3,
  explain: "鉄骨造平屋100㎡以下は四号建築物で大規模修繕でも確認申請不要というのは正しい記述。写真の正答④を確認。\n①木造3階建ては三号建築物で確認必要○\n②35日以内○\n③指定確認検査機関が確認済証交付○",
  refs: "法6条1項",
  starred: false,
  history: []
}, {
  id: "q_H23_02",
  subject: "houki",
  year: "H23",
  no: 2,
  rank: "B",
  topic: "手続き",
  qPage: "52",
  tbPage: "30",
  q: "次の記述のうち、建築基準法上、誤っているものはどれか。",
  opts: ["延べ面積が800㎡、地上3階建てのホテルを新築しようとする場合において、工事の施工者は、当該工事に係る設計図書を工事現場に備えておかなければならない。", "建築確認を受けた建築物の工事が完了した場合、建築主は工事が完了した日から4日以内に建築主事等の検査を申請しなければならない。", "建築主事は、確認を受けた建築物の計画の変更（軽微な変更を除く）に係る確認申請書を受理した場合、木造以外の建築物について原則として35日以内に確認済証を交付しなければならない。", "木造、地上2階建て、延べ面積150㎡の一戸建て住宅について大規模の修繕をしようとする場合、建築主は建築主事等の確認を受けなければならない。"],
  correct: 3,
  explain: "木造2階建て延べ面積150㎡は四号建築物。大規模修繕でも確認申請は不要。\n①設計図書の備え置き義務○\n②4日以内の完了検査申請○\n③計画変更の35日以内確認済証交付○",
  refs: "法6条1項",
  starred: false,
  history: []
}, {
  id: "q_H23_04",
  subject: "houki",
  year: "H23",
  no: 4,
  rank: "A",
  topic: "手続き",
  qPage: "53",
  tbPage: "37",
  q: "次の記述のうち、建築基準法上、誤っているものはどれか。",
  opts: ["特定工程に係る工事を終えたときは、建築主は建築主事等の中間検査を申請しなければならない。", "中間検査合格証の交付を受けた後でなければ施工できない特定工程後の工程については、建築主は中間検査合格証を受けた後でなければ当該工程に係る工事を施工させることができない。", "特定行政庁は、建築基準法の施行に関する事務を主管する都道府県知事に対し、建築主に係る工事の施工状況について報告を求めることができる。", "建築主事等は、建築物の工事完了検査において、建築物及びその敷地が建築基準関係規定に適合しないと認める場合、検査済証を交付してはならない。"],
  correct: 2,
  explain: "特定行政庁と都道府県知事は別機関。特定行政庁が都道府県知事に報告を求める規定はない。\n①中間検査申請義務○\n②中間検査合格証後に次工程○\n④不適合の場合検査済証不交付○",
  refs: "法7条の3、法7条の4",
  starred: false,
  history: []
}, {
  id: "q_H24_04",
  subject: "houki",
  year: "H24",
  no: 4,
  rank: "B",
  topic: "手続き",
  qPage: "54",
  tbPage: "38",
  q: "次の記述のうち、建築基準法上、誤っているものはどれか。",
  opts: ["木造、地上3階建て、延べ面積120㎡の一戸建て住宅の大規模の修繕を行う場合、当該工事が特定工程を含むときは、建築主は中間検査を申請しなければならない。", "延べ面積が2,000㎡の建築物の建築工事について、工事施工者は当該工事に係る設計図書を工事現場に備えておかなければならない。", "建築主事等は、延べ面積が4,500㎡で地上2階建ての建築物の新築に係る建築確認申請書を受理した場合、原則として受理した日から35日以内に確認済証を交付しなければならない。", "建築物の用途変更について建築確認が必要となる場合において、工事施工者が確認を受けずに工事を行ったときは、建築主に罰則が適用される場合がある。"],
  correct: 2,
  explain: "延べ面積4,500㎡は構造計算適合性判定が必要な場合があり35日の期限が延長される。「原則として35日以内」が誤り。\n①特定工程含む場合は中間検査申請必要○\n②設計図書備え置き義務○\n④建築主への罰則適用○",
  refs: "法6条4項",
  starred: false,
  history: []
}];
const BUNDLE_VER = "v9";

// ── 問題集目次(法規) p番号は問題解説集のページ ──────────────
const CHAPTERS = {
  houki: [{
    id: "h_1_1",
    textbook: "【用語の定義 テキストより】\n■ 建築物(法2条一号): 土地に定着する工作物のうち屋根・柱または壁を有するもの等。高架の工作物内の店舗・倉庫も建築物。\n■ 主要構造部(法2条五号): 壁・柱・床・はり・屋根・階段。土台・最下階の床・小屋組・局部的な小階段・屋外階段は除く。\n■ 特殊建築物(法2条二号): 学校・病院・劇場・百貨店・旅館・共同住宅・倉庫・自動車車庫など。\n■ 建築(法2条一三号): 新築・増築・改築・移転。\n■ 大規模の修繕(法2条一四号): 主要構造部の一種以上について行う過半の修繕。土台は主要構造部ではない。\n■ 遮炎性能(法2条九号の二ロ): 「防火設備」に必要な性能。外壁ではない。\n■ 特定防火設備(令112条1項): 1時間加熱面以外に火炎を出さないもの(45分は誤り)。\n■ 準防火性能(法23条): 建築物周囲の延焼抑制のために外壁に必要な性能。\n■ 防煙壁: 天井面から50cm以上下方に突出した不燃材料の垂れ壁等。\n■ 地階: 床が地盤面下にある階。天井高の1/3以上が地盤面以下。",
    name: "1-1 用語の定義",
    page: 11,
    topics: ["用語の定義"]
  }, {
    id: "h_1_2",
    textbook: "【面積・高さ・階数 テキストより】\n■ 建築面積(令2条1項二号): 外壁中心線で囲まれた水平投影面積。地盤面下は不算入。ひさし等は先端から1m後退。\n■ 延べ面積(令2条1項四号): 各階床面積の合計。共用廊下・階段は不算入。自動車車庫は1/5を限度に不算入。\n■ 高さ(令2条1項六号): 地盤面から。棟飾・防火壁の屋上突出部は不算入。屋上の階段室等(1/8以内)は12mを超える部分のみ算入。\n■ 階数(令2条1項八号): 地階を含む。屋上の階段室等(1/8以内)は不算入。\n■ 容積率算定: 共用廊下・階段不算入。自動車車庫は1/5まで不算入。同一敷地の複数棟は合算。\n■ 日影規制対象: 軒高7m超または地階除く階数3以上。",
    name: "1-2 面積・高さ・階数",
    page: 24,
    topics: ["面積", "高さ", "階数"]
  }, {
    id: "h_1_3",
    textbook: "【手続き テキストより】\n■ 確認申請対象(法6条1項): ①特殊建築物200㎡超 ②木造3階以上/高さ13m超/軒高9m超 ③木造以外2階以上または200㎡超 ④四号(都市計画区域内の上記以外)\n■ 四号建築物: 大規模修繕・模様替は確認不要。新築は必要。\n■ 確認済証交付日数: 一〜三号(木造以外)35日以内/四号7日以内。構造計算適合性判定が必要な場合延長。\n■ 指定確認検査機関: 確認・検査が可能。確認済証は機関が交付し建築主事に通知。\n■ 完了検査(法7条): 工事完了から4日以内に申請。検査済証交付後でなければ使用不可(例外あり)。\n■ 中間検査(法7条の3): 特定工程含む建築物が対象。合格証交付後でなければ次工程施工不可。\n■ 仮使用: 完了検査前使用の例外。1,500㎡以下3階建て以下住宅等は工事完了後4日以内に申請で可。\n■ 工事監理報告書: 延べ面積1,500㎡超かつ5階以上の新築で建築主に提出義務。\n■ 定期報告(法12条): 建築設備の定期検査対象に非常用照明装置も含まれる(誤りの肢として頻出)。\n■ 重要: 確認申請の指導対象は建築主(工事施工者ではない)。省エネ法認定≠建築確認とみなし。",
    name: "1-3 手続き",
    page: 35,
    topics: ["確認申請", "完了検査", "中間検査"]
  }, {
    id: "h_2",
    name: "第2章 一般構造",
    page: 57,
    topics: ["居室", "天井高", "採光", "換気", "階段"]
  }, {
    id: "h_3",
    name: "第3章 構造強度",
    page: 70,
    topics: ["木造〜SRC造", "構造計算"]
  }, {
    id: "h_4_1",
    name: "4-1 耐火建築物等",
    page: 110,
    topics: ["耐火建築物", "準耐火建築物", "特定防火設備"]
  }, {
    id: "h_4_2",
    name: "4-2 防火・準防火地域",
    page: 116,
    topics: ["防火地域", "準防火地域"]
  }, {
    id: "h_4_3",
    name: "4-3 防火区画等",
    page: 132,
    topics: ["面積区画", "竪穴区画", "異種用途区画"]
  }, {
    id: "h_4_4",
    name: "4-4 内装制限",
    page: 138,
    topics: ["内装制限"]
  }, {
    id: "h_4_5",
    name: "4-5 防火規定融合",
    page: 144,
    topics: ["防火規定融合"]
  }, {
    id: "h_5_1",
    name: "5-1 避難規定",
    page: 156,
    topics: ["廊下幅", "直通階段", "避難階段", "排煙", "非常照明"]
  }, {
    id: "h_5_2",
    name: "5-2 防火・避難規定融合",
    page: 164,
    topics: ["防火・避難融合"]
  }, {
    id: "h_5_3",
    name: "5-3 建築設備",
    page: 184,
    topics: ["給排水", "電気", "昇降機"]
  }, {
    id: "h_6_1",
    name: "6-1 道路",
    page: 202,
    topics: ["道路の定義", "接道義務", "道路斜線"]
  }, {
    id: "h_6_2",
    name: "6-2 用途地域",
    page: 212,
    topics: ["用途制限", "用途地域"]
  }, {
    id: "h_6_3",
    name: "6-3 容積率・建蔽率",
    page: 222,
    topics: ["容積率", "建蔽率"]
  }, {
    id: "h_6_4",
    name: "6-4 高さ制限",
    page: 240,
    topics: ["絶対高さ", "道路斜線", "隣地斜線", "北側斜線", "日影"]
  }, {
    id: "h_6_5",
    name: "6-5 地域・地区等",
    page: 260,
    topics: ["地域地区", "建築協定"]
  }, {
    id: "h_7_1",
    name: "7-1 建築協定等",
    page: 266,
    topics: ["建築協定"]
  }, {
    id: "h_7_2",
    name: "7-2 建築基準法融合",
    page: 273,
    topics: ["建築基準法融合"]
  }, {
    id: "h_8_1",
    name: "8-1 建築士法",
    page: 296,
    topics: ["建築士法", "免許", "業務"]
  }, {
    id: "h_8_2",
    name: "8-2 職業倫理",
    page: 338,
    topics: ["職業倫理"]
  }, {
    id: "h_9_1",
    name: "9-1 都市計画法",
    page: 346,
    topics: ["都市計画法", "開発許可"]
  }, {
    id: "h_9_2",
    name: "9-2 消防法",
    page: 354,
    topics: ["消防法", "消火設備", "警報設備"]
  }, {
    id: "h_9_3",
    name: "9-3 バリアフリー法",
    page: 364,
    topics: ["バリアフリー法"]
  }, {
    id: "h_9_4",
    name: "9-4 耐震改修促進法",
    page: 374,
    topics: ["耐震改修促進法"]
  }, {
    id: "h_9_5",
    name: "9-5 品確法",
    page: 378,
    topics: ["品確法"]
  }, {
    id: "h_9_6",
    name: "9-6 その他関係法令融合",
    page: 379,
    topics: ["その他関係法令融合"]
  }],
  keikaku: [],
  kankyo: [],
  kouzou: [],
  sekou: []
};
const SUPABASE_URL = "https://nypugenklrsnhqjtyccc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55cHVnZW5rbHJzbmhxanR5Y2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2ODU1MzAsImV4cCI6MjA5NTI2MTUzMH0.zWE458sdO1ktBL86pIXUN55UOESd-D5YdMdfLRsKoMY";
const USER_ID = "shoggy217";
const SB_GET_HEADERS = {
  "apikey": SUPABASE_KEY,
  "Authorization": "Bearer " + SUPABASE_KEY
};
const SB_MOD_HEADERS = {
  ...SB_GET_HEADERS,
  "Content-Type": "application/json"
};
let _store = null,
  _saveTimer = null,
  _loadPromise = null,
  _rowExists = null;
const _loadAll = () => {
  if (_loadPromise) return _loadPromise;
  _loadPromise = (async () => {
    try {
      const local = localStorage.getItem("store_v1");
      if (local) _store = JSON.parse(local);
      const res = await fetch(SUPABASE_URL + "/rest/v1/study_data?user_id=eq." + USER_ID + "&order=updated_at.desc&limit=1&select=data", {
        headers: SB_GET_HEADERS
      });
      if (res.ok) {
        const rows = await res.json();
        if (rows.length > 0 && rows[0].data) {
          _store = rows[0].data;
          localStorage.setItem("store_v1", JSON.stringify(_store));
        }
      }
    } catch (e) {}
    if (!_store) _store = {};
    return _store;
  })();
  return _loadPromise;
};
const load = async (key, fb) => {
  const store = await _loadAll();
  return store[key] !== undefined ? store[key] : fb;
};
const _flush = async () => {
  if (!_store) return;
  try {
    const body = JSON.stringify({
      user_id: USER_ID,
      data: _store,
      updated_at: new Date().toISOString()
    });
    if (_rowExists === null) {
      const check = await fetch(SUPABASE_URL + "/rest/v1/study_data?user_id=eq." + USER_ID + "&select=id&limit=1", {
        headers: SB_GET_HEADERS
      });
      const rows = check.ok ? await check.json() : [];
      _rowExists = rows.length > 0;
    }
    if (_rowExists) {
      await fetch(SUPABASE_URL + "/rest/v1/study_data?user_id=eq." + USER_ID, {
        method: "PATCH",
        headers: SB_MOD_HEADERS,
        body
      });
    } else {
      await fetch(SUPABASE_URL + "/rest/v1/study_data", {
        method: "POST",
        headers: {
          ...SB_MOD_HEADERS,
          "Prefer": "return=minimal"
        },
        body
      });
      _rowExists = true;
    }
  } catch (e) {
    console.error(e);
  }
};
const save = async (key, val) => {
  if (!_store) _store = {};
  _store[key] = val;
  localStorage.setItem("store_v1", JSON.stringify(_store));
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(_flush, 800);
};

// ── CLAUDE API ─────────────────────────────────────────────
// AIキャッシュ
const _aiCache = {};
const EDGE_URL = "https://nypugenklrsnhqjtyccc.supabase.co/functions/v1/claude-proxy";
const callClaude = async (s, u) => {
  const k = s.slice(0, 20) + u.slice(0, 50);
  if (_aiCache[k]) return _aiCache[k];
  try {
    const r = await fetch(EDGE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + SUPABASE_KEY,
        "apikey": SUPABASE_KEY
      },
      body: JSON.stringify({
        system: s,
        user: u,
        max_tokens: 400
      })
    });
    const d = await r.json();
    const t = d.text || "";
    if (t) _aiCache[k] = t;
    return t;
  } catch (e) {
    return "";
  }
};

// ── XP SYSTEM ──────────────────────────────────────────────
const XP_PER_CORRECT = 10;
const XP_PER_WRONG = 2;
const levelFromXP = xp => Math.floor(Math.sqrt(xp / 50)) + 1;
const xpForLevel = lv => 50 * (lv - 1) ** 2;

// ── MAIN APP ───────────────────────────────────────────────
function App() {
  const _useState = useState("home"),
    _useState2 = _slicedToArray(_useState, 2),
    tab = _useState2[0],
    setTab = _useState2[1];
  const _useState3 = useState([]),
    _useState4 = _slicedToArray(_useState3, 2),
    questions = _useState4[0],
    setQuestions = _useState4[1];
  const _useState5 = useState({}),
    _useState6 = _slicedToArray(_useState5, 2),
    logs = _useState6[0],
    setLogs = _useState6[1];
  const _useState7 = useState(0),
    _useState8 = _slicedToArray(_useState7, 2),
    xp = _useState8[0],
    setXp = _useState8[1];
  const _useState9 = useState(0),
    _useState0 = _slicedToArray(_useState9, 2),
    streak = _useState0[0],
    setStreak = _useState0[1];
  const _useState1 = useState(true),
    _useState10 = _slicedToArray(_useState1, 2),
    loading = _useState10[0],
    setLoading = _useState10[1];
  const _useState11 = useState(0),
    _useState12 = _slicedToArray(_useState11, 2),
    pendingCount = _useState12[0],
    setPendingCount = _useState12[1];
  const _useState13 = useState("☁"),
    _useState14 = _slicedToArray(_useState13, 2),
    syncLabel = _useState14[0],
    setSyncLabel = _useState14[1];
  const _useState15 = useState(window.innerWidth >= 768),
    _useState16 = _slicedToArray(_useState15, 2),
    isPC = _useState16[0],
    setIsPC = _useState16[1];
  useEffect(() => {
    const onResize = () => setIsPC(window.innerWidth >= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // PCのときフォントサイズを大きく
  const pcScale = isPC ? 1.3 : 1;
  const _useState17 = useState(""),
    _useState18 = _slicedToArray(_useState17, 2),
    clockStr = _useState18[0],
    setClockStr = _useState18[1];

  // 時計(JST) - 1秒ごとに更新
  useEffect(() => {
    const tick = () => {
      const d = nowJST();
      const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
      const dd = String(d.getUTCDate()).padStart(2, "0");
      const hh = String(d.getUTCHours()).padStart(2, "0");
      const mi = String(d.getUTCMinutes()).padStart(2, "0");
      const ss = String(d.getUTCSeconds()).padStart(2, "0");
      setClockStr(`${d.getUTCFullYear()}/${mm}/${dd} ${hh}:${mi}:${ss}`);
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);
  const _useState19 = useState(false),
    _useState20 = _slicedToArray(_useState19, 2),
    timerRunning = _useState20[0],
    setTimerRunning = _useState20[1];
  const _useState21 = useState(0),
    _useState22 = _slicedToArray(_useState21, 2),
    timerSec = _useState22[0],
    setTimerSec = _useState22[1];
  const timerRef = useRef(null);

  // boot
  useEffect(() => {
    (async () => {
      const _await$Promise$all = await Promise.all([load("questions_v3", []), load("questions_v2", []), load("logs", {}), load("xp", 0), load("bver", ""), load("claude_pending_questions", [])]),
        _await$Promise$all2 = _slicedToArray(_await$Promise$all, 6),
        qs = _await$Promise$all2[0],
        qs_v2 = _await$Promise$all2[1],
        lg = _await$Promise$all2[2],
        savedXp = _await$Promise$all2[3],
        bv = _await$Promise$all2[4],
        pend = _await$Promise$all2[5];
      // 旧キー(questions_v2)からデータを引き継ぐ(history/starred保持)
      const existingMap = new Map(qs.map(q => [q.id, q]));
      for (const q of qs_v2) {
        if (!existingMap.has(q.id)) {
          existingMap.set(q.id, q);
        } else {
          // 既存にあればhistory/starred等を保持しつつマージ
          const existing = existingMap.get(q.id);
          if ((q.history || []).length > (existing.history || []).length) {
            existingMap.set(q.id, {
              ...existing,
              history: q.history,
              starred: q.starred || existing.starred
            });
          }
        }
      }
      // バンドル問題を常にマージ(historyは既存を優先)
      for (const bq of BUNDLED_QUESTIONS) {
        if (!existingMap.has(bq.id)) {
          existingMap.set(bq.id, bq);
        }
        // 既存にある場合はそのまま(historyを上書きしない)
      }
      let finalQs = Array.from(existingMap.values());
      // バージョンが変わった場合のみ保存
      if (bv !== BUNDLE_VER || finalQs.length !== qs.length) {
        await save("questions_v3", finalQs);
        await save("bver", BUNDLE_VER);
      }
      // lastAnsweredが未設定の問題を自動補完（historyがある場合は昨日(JST)の日付を設定→間隔反復に即出題）
      const ystJST = nowJST();
      ystJST.setUTCDate(ystJST.getUTCDate() - 1);
      const yesterdayStr = ystJST.toISOString().slice(0, 10);
      let needsSave = false;
      const fixedQs = finalQs.map(q => {
        if ((q.history || []).length > 0 && !q.lastAnswered) {
          needsSave = true;
          return {
            ...q,
            lastAnswered: yesterdayStr
          };
        }
        return q;
      });
      if (needsSave) {
        await save("questions_v3", fixedQs);
      }
      setQuestions(needsSave ? fixedQs : finalQs);
      setLogs(lg);
      setXp(savedXp);
      setPendingCount(pend.length);
      // streak
      let s = 0,
        d = new Date();
      while (true) {
        const k = d.toISOString().slice(0, 10);
        const dl = lg[k];
        if (!dl || Object.values(dl).reduce((a, b) => a + b, 0) === 0) break;
        s++;
        d.setDate(d.getDate() - 1);
      }
      setStreak(s);
      setLoading(false);
    })();
  }, []);

  // タイマー
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => setTimerSec(s => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);
  const toggleTimer = useCallback(async () => {
    if (timerRunning) {
      // 停止 → 分単位で今日の記録に加算
      if (timerSec >= 5) {
        const today = todayStr();
        const newLogs = {
          ...logs
        };
        if (!newLogs[today]) newLogs[today] = {};
        newLogs[today]["学習"] = (newLogs[today]["学習"] || 0) + timerSec;
        setLogs(newLogs);
        await save("logs", newLogs);
      }
      setTimerSec(0);
      setTimerRunning(false);
    } else {
      setTimerRunning(true);
    }
  }, [timerRunning, timerSec, logs]);

  // autosave questions
  useEffect(() => {
    if (loading) return;
    setSyncLabel("○");
    const t = setTimeout(async () => {
      await save("questions_v3", questions);
      setSyncLabel("✓");
      setTimeout(() => setSyncLabel("☁"), 1500);
    }, 500);
    return () => clearTimeout(t);
  }, [questions, loading]);
  useEffect(() => {
    if (!loading) save("logs", logs);
  }, [logs, loading]);
  useEffect(() => {
    if (!loading) save("xp", xp);
  }, [xp, loading]);

  // pending poll
  useEffect(() => {
    const iv = setInterval(async () => {
      const p = await load("claude_pending_questions", []);
      setPendingCount(p.length);
    }, 8000);
    return () => clearInterval(iv);
  }, []);
  const importPending = useCallback(async () => {
    const pend = await load("claude_pending_questions", []);
    if (!pend.length) return 0;
    const ids = new Set(questions.map(q => q.id));
    const news = pend.filter(q => !ids.has(q.id));
    const merged = [...questions, ...news];
    setQuestions(merged);
    await save("claude_pending_questions", []);
    setPendingCount(0);
    return news.length;
  }, [questions]);
  const addXp = useCallback(pts => setXp(prev => prev + pts), []);
  const daysLeft = Math.ceil((EXAM_DATE - new Date()) / 86400000);
  const level = levelFromXP(xp);
  const levelXp = xp - xpForLevel(level);
  const nextXp = xpForLevel(level + 1) - xpForLevel(level);
  const xpPct = Math.min(levelXp / nextXp * 100, 100);
  const totalStudyMin = useMemo(() => Math.floor(Object.values(logs).reduce((s, d) => s + dayTotalSec(d), 0) / 60), [logs]);
  const weakQuestions = useMemo(() => questions.filter(q => {
    const r = (q.history || []).slice(-3);
    return r.filter(x => x === "×").length >= 2;
  }), [questions]);
  const todayRec = logs[todayStr()] || {};
  const todayMin = Object.values(todayRec).reduce((a, b) => a + b, 0);
  if (loading) return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#080C14",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Noto Sans JP',-apple-system,sans-serif"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "rgba(255,255,255,0.3)",
      fontSize: 13
    }
  }, "\u8AAD\u307F\u8FBC\u307F\u4E2D..."));
  const TABS = [{
    id: "home",
    icon: "🏠",
    label: "ホーム"
  }, {
    id: "quiz",
    icon: "✏️",
    label: "演習"
  }, {
    id: "log",
    icon: "📊",
    label: "記録"
  }, {
    id: "ai",
    icon: "🤖",
    label: "AI"
  }, {
    id: "manage",
    icon: "⚙️",
    label: "管理",
    badge: pendingCount
  }, {
    id: "notes",
    icon: "📝",
    label: "ノート"
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, PULSE_STYLE), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#080C14",
      minHeight: "100vh",
      color: "#fff",
      fontFamily: "'Noto Sans JP',-apple-system,BlinkMacSystemFont,sans-serif",
      paddingBottom: 80,
      fontSize: isPC ? "115%" : "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "48px 20px 0",
      maxWidth: 520,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      letterSpacing: "0.2em",
      color: "rgba(255,255,255,0.3)",
      marginBottom: 4
    }
  }, "\u4E00\u7D1A\u5EFA\u7BC9\u58EB"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "rgba(255,255,255,0.5)"
    }
  }, "Lv.", level, " \xB7 ", xp, " XP")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 42,
      fontWeight: 200,
      lineHeight: 1,
      fontVariantNumeric: "tabular-nums"
    }
  }, daysLeft), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "rgba(255,255,255,0.3)",
      marginTop: 2
    }
  }, "days left"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      height: 3,
      background: "rgba(255,255,255,0.07)",
      borderRadius: 99
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: `${xpPct}%`,
      background: "linear-gradient(90deg,#5B9FFF,#B57BFF)",
      borderRadius: 99,
      transition: "width 0.6s"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "rgba(255,255,255,0.25)"
    }
  }, "Lv.", level), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "rgba(255,255,255,0.25)"
    }
  }, "Lv.", level + 1, " \u307E\u3067 ", nextXp - levelXp, " XP"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "24px 20px 0",
      maxWidth: 520,
      margin: "0 auto"
    }
  }, tab === "home" && /*#__PURE__*/React.createElement(HomeTab, {
    streak: streak,
    todayMin: todayMin,
    totalStudyMin: totalStudyMin,
    weakQuestions: weakQuestions,
    questions: questions,
    setTab: setTab,
    logs: logs,
    timerRunning: timerRunning,
    timerSec: timerSec,
    toggleTimer: toggleTimer
  }), tab === "quiz" && /*#__PURE__*/React.createElement(QuizTab, {
    questions: questions,
    setQuestions: setQuestions,
    addXp: addXp
  }), tab === "log" && /*#__PURE__*/React.createElement(LogTab, {
    logs: logs,
    setLogs: setLogs,
    questions: questions
  }), tab === "ai" && /*#__PURE__*/React.createElement(AITab, {
    questions: questions,
    weakQuestions: weakQuestions,
    logs: logs
  }), tab === "manage" && /*#__PURE__*/React.createElement(ManageTab, {
    questions: questions,
    setQuestions: setQuestions,
    pendingCount: pendingCount,
    importPending: importPending
  }), tab === "notes" && /*#__PURE__*/React.createElement(NotesTab, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      background: "rgba(8,12,20,0.92)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      zIndex: 100
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      maxWidth: 520,
      margin: "0 auto",
      padding: "8px 0 max(8px,env(safe-area-inset-bottom))"
    }
  }, TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => setTab(t.id),
    style: {
      flex: 1,
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "6px 0",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      marginBottom: 2,
      opacity: tab === t.id ? 1 : 0.35
    }
  }, t.icon), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: tab === t.id ? "#5B9FFF" : "rgba(255,255,255,0.35)"
    }
  }, t.label), t.badge > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 4,
      right: "50%",
      transform: "translateX(8px)",
      background: "#5B9FFF",
      color: "#000",
      fontSize: 9,
      fontWeight: 700,
      width: 16,
      height: 16,
      borderRadius: 99,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, t.badge))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      top: 14,
      left: "50%",
      transform: "translateX(-50%)",
      fontSize: 10,
      color: "rgba(255,255,255,0.25)",
      zIndex: 200,
      pointerEvents: "none",
      whiteSpace: "nowrap"
    }
  }, clockStr), /*#__PURE__*/React.createElement("button", {
    onClick: async () => {
      setSyncLabel("⟳");
      try {
        const res = await fetch(SUPABASE_URL + "/rest/v1/study_data?user_id=eq." + USER_ID + "&order=updated_at.desc&limit=1&select=data", {
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": "Bearer " + SUPABASE_KEY
          }
        });
        if (res.ok) {
          const rows = await res.json();
          if (rows.length > 0 && rows[0].data) {
            const d = rows[0].data;
            if (d.questions_v3) setQuestions(d.questions_v3);
            if (d.logs) setLogs(d.logs);
            if (d.xp !== undefined) setXp(d.xp);
            localStorage.setItem("store_v1", JSON.stringify(d));
          }
        }
      } catch (e) {
        console.error(e);
      }
      setSyncLabel("✓");
      setTimeout(() => setSyncLabel("☁"), 2000);
    },
    style: {
      position: "fixed",
      top: 14,
      right: 14,
      fontSize: 13,
      color: "rgba(255,255,255,0.3)",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 8,
      cursor: "pointer",
      padding: "4px 8px",
      zIndex: 200,
      lineHeight: 1
    }
  }, syncLabel)));
}

// ── CARD ───────────────────────────────────────────────────
function Card(_ref2) {
  let children = _ref2.children,
    _ref2$style = _ref2.style,
    style = _ref2$style === void 0 ? {} : _ref2$style;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(255,255,255,0.04)",
      borderRadius: 16,
      padding: 20,
      ...style
    }
  }, children);
}
function SectionTitle(_ref3) {
  let children = _ref3.children;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      letterSpacing: "0.15em",
      color: "rgba(255,255,255,0.3)",
      marginBottom: 14,
      textTransform: "uppercase"
    }
  }, children);
}

// ── HOME TAB ───────────────────────────────────────────────
function HomeTab(_ref4) {
  let streak = _ref4.streak,
    todayMin = _ref4.todayMin,
    totalStudyMin = _ref4.totalStudyMin,
    weakQuestions = _ref4.weakQuestions,
    questions = _ref4.questions,
    setTab = _ref4.setTab,
    logs = _ref4.logs,
    timerRunning = _ref4.timerRunning,
    timerSec = _ref4.timerSec,
    toggleTimer = _ref4.toggleTimer;
  const last7 = useMemo(() => {
    return Array.from({
      length: 7
    }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10);
      return {
        date: fmtMD(d),
        key
      };
    });
  }, []);
  const stats = useMemo(() => {
    let mastered = 0,
      learning = 0,
      weak = 0,
      untried = 0;
    questions.forEach(q => {
      const h = (q.history || []).slice(-3);
      if (!h.length) {
        untried++;
        return;
      }
      if (h.filter(x => x === "○").length === h.length && h.length >= 2) mastered++;else if (h.filter(x => x === "×").length >= 2) weak++;else learning++;
    });
    return {
      mastered,
      learning,
      weak,
      untried,
      total: questions.length
    };
  }, [questions]);

  // 学習ペース計算
  const EXAM_DATE = new Date("2027-07-25");
  const daysLeft = Math.ceil((EXAM_DATE - new Date()) / 86400000);
  const dueToday = questions.filter(q => (q.history || []).length > 0 && isDueToday(q)).length;
  const untried = questions.filter(q => !(q.history || []).length).length;
  const dailyNeeded = untried > 0 ? Math.ceil(untried / daysLeft) : 0;
  const todaySrsLimit = Math.min(dueToday, 20);
  const todaySrsDone = questions.filter(q => (q.history || []).length > 0 && q.lastAnswered === todayStr() && !isDueToday(q)).length;

  // 科目別1周進捗
  const subjectProgress = SUBJECTS.map(s => {
    const qs = questions.filter(q => q.subject === s.id);
    const done = qs.filter(q => (q.history || []).length > 0).length;
    return {
      ...s,
      total: qs.length,
      done
    };
  }).filter(s => s.total > 0);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, null, "\u4ECA\u65E5\u306E\u30CE\u30EB\u30DE"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 12,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "rgba(255,255,255,0.6)"
    }
  }, "\uD83D\uDD04 \u9593\u9694\u53CD\u5FA9\uFF08\u4E0A\u965020\u554F\uFF09"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: todaySrsDone >= todaySrsLimit ? "#34D399" : "#fff",
      fontVariantNumeric: "tabular-nums"
    }
  }, todaySrsDone, " / ", todaySrsLimit, "\u554F")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      background: "rgba(255,255,255,0.07)",
      borderRadius: 99
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: `${Math.min(todaySrsDone / Math.max(todaySrsLimit, 1) * 100, 100)}%`,
      background: todaySrsDone >= todaySrsLimit ? "#34D399" : "#5B9FFF",
      borderRadius: 99,
      transition: "width 0.4s"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 12px",
      background: "rgba(255,255,255,0.04)",
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "rgba(255,255,255,0.5)",
      lineHeight: 1.8
    }
  }, /*#__PURE__*/React.createElement("div", null, "\u8A66\u9A13\u307E\u3067 ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: "#fff"
    }
  }, daysLeft, "\u65E5")), untried > 0 && /*#__PURE__*/React.createElement("div", null, "\u672A\u7740\u624B ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: "#FBBF24"
    }
  }, untried, "\u554F"), " \u2014 1\u65E5 ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: "#fff"
    }
  }, dailyNeeded, "\u554F"), " \u89E3\u3051\u3070\u8A66\u9A13\u524D\u306B1\u5468\u5B8C\u4E86"), untried === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#34D399"
    }
  }, "\u2713 \u5168\u554F\u984C\u30921\u5468\u5B8C\u4E86\uFF01"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, subjectProgress.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.id
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 11,
      marginBottom: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "rgba(255,255,255,0.5)"
    }
  }, s.name), /*#__PURE__*/React.createElement("span", {
    style: {
      color: s.done === s.total ? "#34D399" : "rgba(255,255,255,0.4)",
      fontVariantNumeric: "tabular-nums"
    }
  }, s.done, "/", s.total, "\u554F ", s.done === s.total ? "✓" : "")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 3,
      background: "rgba(255,255,255,0.07)",
      borderRadius: 99
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: `${s.total > 0 ? s.done / s.total * 100 : 0}%`,
      background: s.color,
      borderRadius: 99
    }
  }))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "rgba(255,255,255,0.4)",
      marginBottom: 8
    }
  }, "\uD83D\uDD25 \u9023\u7D9A\u65E5\u6570"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 40,
      fontWeight: 200,
      fontVariantNumeric: "tabular-nums",
      lineHeight: 1
    }
  }, streak), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "rgba(255,255,255,0.3)",
      marginTop: 4
    }
  }, "day streak")), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "rgba(255,255,255,0.4)",
      marginBottom: 8
    }
  }, "\u23F1 \u4ECA\u65E5"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 40,
      fontWeight: 200,
      fontVariantNumeric: "tabular-nums",
      lineHeight: 1
    }
  }, todayMin + Math.floor((timerSec || 0) / 60)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "rgba(255,255,255,0.3)",
      marginTop: 4
    }
  }, "\u5206 / \u7D2F\u8A08 ", (totalStudyMin / 60).toFixed(1), "h"), /*#__PURE__*/React.createElement("button", {
    onClick: toggleTimer,
    style: {
      marginTop: 10,
      padding: "6px 18px",
      borderRadius: 20,
      background: timerRunning ? "rgba(255,80,80,0.12)" : "rgba(91,159,255,0.12)",
      border: timerRunning ? "1px solid rgba(255,80,80,0.4)" : "1px solid rgba(91,159,255,0.3)",
      color: timerRunning ? "#f87171" : "#5B9FFF",
      fontSize: 12,
      cursor: "pointer"
    }
  }, timerRunning ? `⏹ ${String(Math.floor((timerSec || 0) / 60)).padStart(2, "0")}:${String((timerSec || 0) % 60).padStart(2, "0")}` : "▶ 計測開始"))), weakQuestions.length > 0 && /*#__PURE__*/React.createElement("div", {
    onClick: () => setTab("quiz"),
    style: {
      background: "rgba(248,113,113,0.1)",
      border: "1px solid rgba(248,113,113,0.25)",
      borderRadius: 16,
      padding: "16px 20px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: "#F87171",
      marginBottom: 4
    }
  }, "\u8981\u5FA9\u7FD2 ", weakQuestions.length, "\u554F\u3042\u308A"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "rgba(255,255,255,0.5)"
    }
  }, "\u30BF\u30C3\u30D7\u3057\u3066\u6F14\u7FD2\u3078")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      opacity: 0.6
    }
  }, "\u2192")), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, null, "\u76F4\u8FD17\u65E5"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      justifyContent: "space-between"
    }
  }, last7.map(_ref5 => {
    let date = _ref5.date,
      key = _ref5.key;
    const dayLog = logs[key] || {};
    const mins = Object.values(dayLog).reduce((a, b) => a + b, 0);
    const done = mins > 0;
    return /*#__PURE__*/React.createElement("div", {
      key: key,
      style: {
        flex: 1,
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: "100%",
        aspectRatio: "1",
        borderRadius: 8,
        background: done ? "#5B9FFF" : "rgba(255,255,255,0.07)",
        marginBottom: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, done && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        color: "#000",
        fontWeight: 700
      }
    }, mins)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: "rgba(255,255,255,0.25)"
      }
    }, date));
  }))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, null, "\u554F\u984C\u7FD2\u719F\u5EA6 \xB7 ", stats.total, "\u554F"), stats.total === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: "rgba(255,255,255,0.2)",
      fontSize: 13,
      padding: "16px 0"
    }
  }, "\u307E\u3060\u554F\u984C\u304C\u3042\u308A\u307E\u305B\u3093") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      height: 6,
      borderRadius: 99,
      overflow: "hidden",
      marginBottom: 16,
      gap: 2
    }
  }, [["#34D399", stats.mastered], ["#FBBF24", stats.learning], ["#F87171", stats.weak], ["rgba(255,255,255,0.1)", stats.untried]].map((_ref6, i) => {
    let _ref7 = _slicedToArray(_ref6, 2),
      c = _ref7[0],
      n = _ref7[1];
    return n > 0 && /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        flex: n,
        background: c
      }
    });
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8
    }
  }, [["#34D399", "習得済", stats.mastered], ["#FBBF24", "学習中", stats.learning], ["#F87171", "要復習", stats.weak], ["rgba(255,255,255,0.25)", "未着手", stats.untried]].map(_ref8 => {
    let _ref9 = _slicedToArray(_ref8, 3),
      c = _ref9[0],
      l = _ref9[1],
      n = _ref9[2];
    return /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 13
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 8,
        height: 8,
        borderRadius: 99,
        background: c,
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "rgba(255,255,255,0.6)"
      }
    }, l), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: "auto",
        fontVariantNumeric: "tabular-nums"
      }
    }, n));
  })))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, null, "\u79D1\u76EE\u5225\u9032\u6357"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, SUBJECTS.map(s => {
    const qs = questions.filter(q => q.subject === s.id);
    const total = qs.length;
    if (total === 0) return /*#__PURE__*/React.createElement("div", {
      key: s.id,
      style: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: 13
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "rgba(255,255,255,0.4)"
      }
    }, s.name), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "rgba(255,255,255,0.2)",
        fontSize: 11
      }
    }, "\u672A\u767B\u9332"));
    const mastered = qs.filter(q => (q.history || []).length >= 3 && [...(q.history || [])].slice(-3).every(h => h === "○")).length;
    const weak = qs.filter(q => (q.history || []).length > 0 && (q.history || []).filter(h => h === "×").length > (q.history || []).length / 2).length;
    const answered = qs.filter(q => (q.history || []).length > 0).length;
    const pct = Math.round(mastered / total * 100);
    const correctRate = answered > 0 ? Math.round(qs.reduce((a, q) => {
      const h = q.history || [];
      return a + h.filter(x => x === "○").length;
    }, 0) / qs.reduce((a, q) => a + (q.history || []).length, 0) * 100) : null;
    return /*#__PURE__*/React.createElement("div", {
      key: s.id
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 8,
        height: 8,
        borderRadius: 99,
        background: s.color,
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13
      }
    }, s.name)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 12
      }
    }, weak > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#F87171"
      }
    }, "\u8981\u5FA9\u7FD2 ", weak, "\u554F"), correctRate !== null && /*#__PURE__*/React.createElement("span", {
      style: {
        color: "rgba(255,255,255,0.4)"
      }
    }, "\u6B63\u7B54\u7387 ", correctRate, "%"), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "rgba(255,255,255,0.3)",
        fontVariantNumeric: "tabular-nums"
      }
    }, answered, "/", total, "\u554F"))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 6,
        background: "rgba(255,255,255,0.07)",
        borderRadius: 99,
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        height: "100%",
        gap: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${mastered / total * 100}%`,
        background: "#34D399",
        borderRadius: 99,
        transition: "width 0.6s"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${(answered - mastered) / total * 100}%`,
        background: "#FBBF24",
        transition: "width 0.6s"
      }
    }))), pct > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: "rgba(255,255,255,0.25)",
        marginTop: 3
      }
    }, "\u7FD2\u5F97\u6E08 ", pct, "%"));
  }))), weakQuestions.length > 0 && /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, null, "\u5F31\u70B9\u554F\u984C ", weakQuestions.length, "\u554F"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, weakQuestions.slice(0, 5).map(q => {
    const history = q.history || [];
    const wrongCount = history.filter(h => h === "×").length;
    return /*#__PURE__*/React.createElement("div", {
      key: q.id,
      style: {
        padding: "10px 12px",
        background: "rgba(248,113,113,0.06)",
        borderRadius: 10,
        borderLeft: "2px solid rgba(248,113,113,0.3)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: "rgba(255,255,255,0.6)",
        marginBottom: 4,
        lineHeight: 1.5
      },
      dangerouslySetInnerHTML: {
        __html: q.q.length > 50 ? q.q.slice(0, 50) + "…" : q.q
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: "rgba(255,255,255,0.3)"
      }
    }, q.year, " ", q.topic), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: "#F87171",
        marginLeft: "auto"
      }
    }, "\xD7", wrongCount, "\u56DE"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 2
      }
    }, history.slice(-5).map((h, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        width: 12,
        height: 12,
        borderRadius: 99,
        background: h === "○" ? "#34D399" : "#F87171",
        fontSize: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#000",
        fontWeight: 700
      }
    }, h)))));
  }), weakQuestions.length > 5 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "rgba(255,255,255,0.3)",
      textAlign: "center"
    }
  }, "\u4ED6 ", weakQuestions.length - 5, "\u554F"))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, null, "\u51FA\u984C\u5E74\u5EA6\u5206\u6790"), (() => {
    // 年度ごとの正答率を集計
    const yearStats = {};
    questions.forEach(q => {
      if (!q.year) return;
      if (!yearStats[q.year]) yearStats[q.year] = {
        total: 0,
        correct: 0,
        answered: 0
      };
      const h = q.history || [];
      yearStats[q.year].total++;
      yearStats[q.year].answered += h.length > 0 ? 1 : 0;
      yearStats[q.year].correct += h.filter(x => x === "○").length;
    });
    const years = Object.keys(yearStats).sort().reverse();
    if (!years.length) return /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: "rgba(255,255,255,0.2)",
        padding: "8px 0"
      }
    }, "\u554F\u984C\u30C7\u30FC\u30BF\u306A\u3057");
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 8
      }
    }, years.map(yr => {
      const s = yearStats[yr];
      const totalAns = questions.filter(q => q.year === yr).reduce((a, q) => a + (q.history || []).length, 0);
      const rate = totalAns > 0 ? Math.round(s.correct / totalAns * 100) : null;
      const freqLabel = s.total >= 3 ? "🔥 頻出" : s.total >= 2 ? "⚡ 重要" : "";
      return /*#__PURE__*/React.createElement("div", {
        key: yr,
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 0",
          borderBottom: "1px solid rgba(255,255,255,0.05)"
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 12,
          color: "rgba(255,255,255,0.6)",
          width: 36,
          flexShrink: 0
        }
      }, yr), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 10,
          color: "rgba(255,255,255,0.3)",
          width: 40,
          flexShrink: 0
        }
      }, s.total, "\u554F"), freqLabel && /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 10
        }
      }, freqLabel), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          height: 4,
          background: "rgba(255,255,255,0.07)",
          borderRadius: 99
        }
      }, rate !== null && /*#__PURE__*/React.createElement("div", {
        style: {
          height: "100%",
          width: `${rate}%`,
          background: rate >= 70 ? "#34D399" : rate >= 40 ? "#FBBF24" : "#F87171",
          borderRadius: 99
        }
      })), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11,
          color: "rgba(255,255,255,0.4)",
          width: 36,
          textAlign: "right",
          flexShrink: 0
        }
      }, rate !== null ? `${rate}%` : "-"));
    }));
  })()), (() => {
    const refMap = {};
    questions.forEach(q => {
      if (!q.refs || !(q.history || []).length) return;
      const wrongs = (q.history || []).filter(h => h === "×").length;
      if (wrongs === 0) return;
      const key = q.refs;
      if (!refMap[key]) refMap[key] = {
        refs: key,
        wrong: 0,
        total: 0
      };
      refMap[key].wrong += wrongs;
      refMap[key].total += (q.history || []).length;
    });
    const sorted = Object.values(refMap).sort((a, b) => b.wrong - a.wrong).slice(0, 5);
    if (!sorted.length) return null;
    return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, null, "\u82E6\u624B\u6761\u6587 Top5"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 8
      }
    }, sorted.map((r, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#F87171",
        fontVariantNumeric: "tabular-nums",
        width: 16,
        flexShrink: 0
      }
    }, i + 1), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        color: "rgba(255,255,255,0.7)"
      }
    }, r.refs), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#F87171",
        flexShrink: 0
      }
    }, "\xD7", r.wrong, "\u56DE")))));
  })());
}

// ── 専門用語ポップアップ ────────────────────────────────────────
function HighlightedText(_ref0) {
  let text = _ref0.text,
    onTermClick = _ref0.onTermClick;
  if (!text) return null;
  // 専門用語を長い順にソート（部分一致を防ぐ）
  const sorted = [...TERMS].sort((a, b) => b.length - a.length);
  const regex = new RegExp(`(${sorted.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  const parts = text.split(regex);
  return /*#__PURE__*/React.createElement("span", null, parts.map((part, i) => TERMS.includes(part) ? /*#__PURE__*/React.createElement("span", {
    key: i,
    onClick: () => onTermClick(part),
    style: {
      color: "#5B9FFF",
      borderBottom: "1px dashed rgba(91,159,255,0.5)",
      cursor: "pointer"
    }
  }, part) : /*#__PURE__*/React.createElement("span", {
    key: i
  }, part)));
}
function TermPopup(_ref1) {
  let term = _ref1.term,
    onClose = _ref1.onClose;
  const _useState23 = useState(""),
    _useState24 = _slicedToArray(_useState23, 2),
    explanation = _useState24[0],
    setExplanation = _useState24[1];
  const _useState25 = useState(true),
    _useState26 = _slicedToArray(_useState25, 2),
    loading = _useState26[0],
    setLoading = _useState26[1];
  useEffect(() => {
    if (!term) return;
    setLoading(true);
    setExplanation("");
    callClaude("あなたは一級建築士試験の専門講師です。建築用語を中学生でも分かるように説明してください。\n形式(厳守):\n📖 [用語名]: [1行の定義]\n• [ポイント1]\n• [ポイント2]\n▶ 根拠条文: [条文番号]\n\n80字以内。", `「${term}」を分かりやすく説明してください。`).then(text => {
      setExplanation(text);
      setLoading(false);
    });
  }, [term]);
  if (!term) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 500,
      display: "flex",
      alignItems: "flex-end"
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: "100%",
      background: "#1a1a2e",
      borderRadius: "20px 20px 0 0",
      padding: "24px 20px 40px",
      boxShadow: "0 -4px 40px rgba(0,0,0,0.5)",
      border: "1px solid rgba(91,159,255,0.2)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      color: "#5B9FFF"
    }
  }, term), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: "none",
      border: "none",
      color: "rgba(255,255,255,0.4)",
      fontSize: 20,
      cursor: "pointer"
    }
  }, "\u2715")), loading ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "rgba(255,255,255,0.3)"
    }
  }, "\u89E3\u8AAC\u3092\u751F\u6210\u4E2D...") : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      lineHeight: 1.9,
      color: "rgba(255,255,255,0.85)",
      whiteSpace: "pre-wrap"
    }
  }, explanation)));
}

// ── QUIZ TAB ───────────────────────────────────────────────
function QuizTab(_ref10) {
  let questions = _ref10.questions,
    setQuestions = _ref10.setQuestions,
    addXp = _ref10.addXp;
  const _useState27 = useState("all"),
    _useState28 = _slicedToArray(_useState27, 2),
    subj = _useState28[0],
    setSubj = _useState28[1];
  const _useState29 = useState("AB"),
    _useState30 = _slicedToArray(_useState29, 2),
    mode = _useState30[0],
    setMode = _useState30[1]; // AB A all weak starred untried
  const _useState31 = useState("normal"),
    _useState32 = _slicedToArray(_useState31, 2),
    course = _useState32[0],
    setCourse = _useState32[1]; // normal / srs
  const _useState33 = useState(null),
    _useState34 = _slicedToArray(_useState33, 2),
    sessionConf = _useState34[0],
    setSessionConf = _useState34[1]; // {count, secPerQ} or null
  const _useState35 = useState(0),
    _useState36 = _slicedToArray(_useState35, 2),
    timedSec = _useState36[0],
    setTimedSec = _useState36[1];
  const _useState37 = useState(false),
    _useState38 = _slicedToArray(_useState37, 2),
    timedDone = _useState38[0],
    setTimedDone = _useState38[1];
  const _useState39 = useState(null),
    _useState40 = _slicedToArray(_useState39, 2),
    timedResult = _useState40[0],
    setTimedResult = _useState40[1];
  const timedRef = useRef(null);
  const _useState41 = useState(false),
    _useState42 = _slicedToArray(_useState41, 2),
    paused = _useState42[0],
    setPaused = _useState42[1];
  const sessionStartRef = useRef(null);
  const _useState43 = useState(0),
    _useState44 = _slicedToArray(_useState43, 2),
    idx = _useState44[0],
    setIdx = _useState44[1];
  const _useState45 = useState(null),
    _useState46 = _slicedToArray(_useState45, 2),
    currentQId = _useState46[0],
    setCurrentQId = _useState46[1];
  const _useState47 = useState(null),
    _useState48 = _slicedToArray(_useState47, 2),
    activeTerm = _useState48[0],
    setActiveTerm = _useState48[1];
  const _useState49 = useState(null),
    _useState50 = _slicedToArray(_useState49, 2),
    sel = _useState50[0],
    setSel = _useState50[1];
  const _useState51 = useState(false),
    _useState52 = _slicedToArray(_useState51, 2),
    done = _useState52[0],
    setDone = _useState52[1];
  const _useState53 = useState({
      correct: 0,
      total: 0
    }),
    _useState54 = _slicedToArray(_useState53, 2),
    session = _useState54[0],
    setSession = _useState54[1];
  const _useState55 = useState(""),
    _useState56 = _slicedToArray(_useState55, 2),
    aiHint = _useState56[0],
    setAiHint = _useState56[1];
  const _useState57 = useState(false),
    _useState58 = _slicedToArray(_useState57, 2),
    hintLoading = _useState58[0],
    setHintLoading = _useState58[1];
  const _useState59 = useState(false),
    _useState60 = _slicedToArray(_useState59, 2),
    showHint = _useState60[0],
    setShowHint = _useState60[1];
  const _useState61 = useState(""),
    _useState62 = _slicedToArray(_useState61, 2),
    knowledge = _useState62[0],
    setKnowledge = _useState62[1];
  const _useState63 = useState(false),
    _useState64 = _slicedToArray(_useState63, 2),
    knowledgeLoading = _useState64[0],
    setKnowledgeLoading = _useState64[1];
  const _useState65 = useState(false),
    _useState66 = _slicedToArray(_useState65, 2),
    knowledgeSkipped = _useState66[0],
    setKnowledgeSkipped = _useState66[1];
  const _useState67 = useState(""),
    _useState68 = _slicedToArray(_useState67, 2),
    memo = _useState68[0],
    setMemo = _useState68[1];
  const _useState69 = useState(false),
    _useState70 = _slicedToArray(_useState69, 2),
    memoEditing = _useState70[0],
    setMemoEditing = _useState70[1];
  const _useState71 = useState(""),
    _useState72 = _slicedToArray(_useState71, 2),
    aiQuestion = _useState72[0],
    setAiQuestion = _useState72[1];
  const _useState73 = useState(""),
    _useState74 = _slicedToArray(_useState73, 2),
    aiAnswer = _useState74[0],
    setAiAnswer = _useState74[1];
  const _useState75 = useState(false),
    _useState76 = _slicedToArray(_useState75, 2),
    aiQLoading = _useState76[0],
    setAiQLoading = _useState76[1];
  const _useState77 = useState({}),
    _useState78 = _slicedToArray(_useState77, 2),
    memos = _useState78[0],
    setMemos = _useState78[1];
  const pool = useMemo(() => {
    const today = todayStr();
    let arr = [...questions];
    if (subj !== "all") arr = arr.filter(q => q.subject === subj);
    if (mode === "AB") arr = arr.filter(q => !q.rank || q.rank === "A" || q.rank === "B");else if (mode === "A") arr = arr.filter(q => q.rank === "A");else if (mode === "weak") arr = arr.filter(q => {
      const r = (q.history || []).slice(-3);
      return r.filter(x => x === "×").length >= 2;
    });else if (mode === "starred") arr = arr.filter(q => q.starred);else if (mode === "untried") arr = arr.filter(q => !q.history || !q.history.length);
    const priority = q => {
      const h = q.history || [];
      if (!h.length) return 1;
      const last3 = h.slice(-3);
      if (last3.filter(x => x === "×").length >= 2) return 0;
      if (last3.every(x => x === "○") && last3.length >= 3) return 3;
      return 2;
    };
    const solvedToday = arr.filter(q => q.lastAnswered === today);
    const notSolvedToday = arr.filter(q => q.lastAnswered !== today);
    notSolvedToday.sort((a, b) => priority(a) - priority(b));
    // SRSモードの場合は今日が出題日の問題のみ
    if (course === "srs") {
      // 一度以上解いた問題のうち、今日が出題日のもの
      const due = [...questions].filter(q => (q.history || []).length > 0 && isDueToday(q));
      // 今日すでに解いたものは後ろへ
      const notDoneToday = due.filter(q => q.lastAnswered !== todayStr());
      const doneToday = due.filter(q => q.lastAnswered === todayStr());
      // 要復習を優先
      const priority = q => {
        const last3 = (q.history || []).slice(-3);
        if (last3.filter(x => x === "×").length >= 2) return 0;
        return 1;
      };
      notDoneToday.sort((a, b) => priority(a) - priority(b));
      return [...notDoneToday, ...doneToday];
    }
    return [...notSolvedToday, ...solvedToday];
  }, [questions, subj, mode, course]);

  // pool変化でqがずれないようIDで固定
  const poolQ = pool[idx % Math.max(pool.length, 1)];
  const q = currentQId ? questions.find(qq => qq.id === currentQId) || poolQ : poolQ;
  const subj_ = SUBJECTS.find(s => s.id === q?.subject) || SUBJECTS[0];
  function reset(newSubj, newMode) {
    if (newSubj !== undefined) setSubj(newSubj);
    if (newMode !== undefined) setMode(newMode);
    setIdx(0);
    setSel(null);
    setDone(false);
    setAiHint("");
    setShowHint(false);
    setKnowledge("");
    setKnowledgeLoading(false);
    setKnowledgeSkipped(false);
    setSession({
      correct: 0,
      total: 0
    });
  }
  const pick = i => {
    if (done) return;
    if (!q) return;
    setCurrentQId(q.id); // 回答中はIDで固定
    const correct = i === q.correct;
    setSel(i);
    setDone(true);
    addXp(correct ? XP_PER_CORRECT : XP_PER_WRONG);
    setSession(s => ({
      correct: s.correct + (correct ? 1 : 0),
      total: s.total + 1
    }));
    const updatedQuestions = questions.map(qq => qq.id !== q.id ? qq : {
      ...qq,
      history: [...(qq.history || []), correct ? "○" : "×"].slice(-10),
      lastAnswered: todayStr()
    });
    setQuestions(updatedQuestions);
    // 回答直後に即時保存（タブを閉じても記録が消えないよう）
    save("questions_v3", updatedQuestions);
    setAiHint("");
    setShowHint(false);
    setKnowledge("");
    setKnowledgeSkipped(false);
    // 回答直後に知識まとめを自動生成
    generateKnowledge(i, correct, q);
  };
  const generateKnowledge = async (selectedIdx, wasCorrect, question) => {
    setKnowledgeLoading(true);
    const textbookContext = question.textbook ? `\n\n【教科書の記述】\n${question.textbook}` : "";
    const sys = "あなたは一級建築士試験の専門講師です。問題を解いた学習者に対して、この問題を通じて確実に覚えるべき核心知識を提供してください。\n\n以下のフォーマットで、簡潔に日本語で回答してください:\n\n📌 [分野名]\n• [ポイント1]\n• [ポイント2]\n• [ポイント3(必要な場合)]\n▶ 条文: [関連条文]\n\n💡 覚え方: [記憶の助けになるひと言]\n\n300字以内で、箇条書きを中心にまとめてください。";
    const usr = `問題: ${question.q}\n\n選択肢:\n${question.opts.map((o, i) => `${i + 1}. ${o}`).join("\n")}\n\n正解: ${question.correct + 1}番\n\n解説: ${question.explain || ""}\n\n参照条文: ${question.refs || ""}${textbookContext}`;
    const text = await callClaude(sys, usr);
    setKnowledge(text);
    setKnowledgeLoading(false);
  };

  // セッションタイマー
  useEffect(() => {
    if (sessionConf && sessionConf.secPerQ > 0 && !timedDone && !paused) {
      const limit = sessionConf.count * sessionConf.secPerQ;
      timedRef.current = setInterval(() => {
        setTimedSec(s => {
          if (s + 1 >= limit) {
            clearInterval(timedRef.current);
            setTimedDone(true);
            return limit;
          }
          return s + 1;
        });
      }, 1000);
    } else {
      clearInterval(timedRef.current);
    }
    return () => clearInterval(timedRef.current);
  }, [sessionConf, timedDone, paused]);
  const startSession = conf => {
    setSessionConf(conf);
    setTimedSec(0);
    setTimedDone(false);
    setTimedResult(null);
    setIdx(0);
    setSel(null);
    setDone(false);
    setSession({
      correct: 0,
      total: 0
    });
  };
  const finishSession = async () => {
    clearInterval(timedRef.current);
    // 経過時間を計算（制限なしでも実時間を使う）
    const elapsedSec = sessionStartRef.current ? Math.floor((Date.now() - sessionStartRef.current) / 1000) : timedSec;
    const actualSec = Math.max(timedSec, elapsedSec);
    setTimedDone(true);
    setTimedResult({
      correct: session.correct,
      total: session.total,
      sec: actualSec
    });
    // 学習時間をlogsに記録（5秒以上の場合、秒単位で保存）
    if (actualSec >= 5) {
      const today = todayStr();
      const newLogs = {
        ...logs
      };
      if (!newLogs[today]) newLogs[today] = {};
      newLogs[today]["演習"] = (newLogs[today]["演習"] || 0) + actualSec;
      setLogs(newLogs);
      await save("logs", newLogs);
    }
  };
  const resetSession = () => {
    clearInterval(timedRef.current);
    setSessionConf(null);
    setTimedSec(0);
    setTimedDone(false);
    setTimedResult(null);
    setPaused(false);
    setIdx(0);
    setSel(null);
    setDone(false);
    setSession({
      correct: 0,
      total: 0
    });
  };
  const next = () => {
    // セッション: 指定問数に達したら終了
    if (sessionConf && sessionConf.count < 9999 && session.total + 1 >= sessionConf.count) {
      finishSession();
      return;
    }
    setCurrentQId(null); // 次の問題はpoolから取得
    setIdx(i => i + 1);
    setSel(null);
    setDone(false);
    setAiHint("");
    setShowHint(false);
    setKnowledge("");
    setKnowledgeLoading(false);
    setKnowledgeSkipped(false);
    setMemo("");
    setMemoEditing(false);
    setAiQuestion("");
    setAiAnswer("");
    setAiQLoading(false);
  };

  // 問題が変わったらその問題のメモをロード
  useEffect(() => {
    if (!q) return;
    load("memos", {}).then(m => {
      setMemos(m);
      setMemo(m[q.id] || "");
    });
  }, [q?.id]);
  const saveMemo = async text => {
    const newMemos = {
      ...memos,
      [q.id]: text
    };
    setMemos(newMemos);
    await save("memos", newMemos);
  };
  const askAI = async () => {
    if (!aiQuestion.trim() || !q) return;
    setAiQLoading(true);
    const text = await callClaude("あなたは一級建築士試験の専門講師です。以下の形式で日本語で答えてください。\n📌 結論: [1行]\n• [根拠・補足1]\n• [根拠・補足2]\n150字以内で簡潔に。", `問題: ${q.q}

解説: ${q.explain || ""}

受験生の質問: ${aiQuestion}`);
    setAiAnswer(text);
    setAiQLoading(false);
  };
  const toggleStar = () => setQuestions(questions.map(qq => qq.id === q?.id ? {
    ...qq,
    starred: !qq.starred
  } : qq));
  const getHint = async () => {
    if (!q) return;
    setHintLoading(true);
    setShowHint(true);
    const text = await callClaude("あなたは一級建築士試験の専門講師です。問題のテーマに関する法的な知識を2点だけ教えてください。選択肢・正解・正誤には一切触れないこと。\n\n形式(必ず守る):\n🔑 核心: [テーマの本質を1行]\n• [法的知識1]\n• [法的知識2]\n\n合計60字以内。", `テーマ: ${q.topic || q.refs || "建築基準法"}  条文: ${q.refs || ""}`);
    setAiHint(text);
    setHintLoading(false);
  };
  if (!questions.length) return /*#__PURE__*/React.createElement(Card, {
    style: {
      textAlign: "center",
      padding: "48px 20px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      marginBottom: 8
    }
  }, "\u554F\u984C\u304C\u3042\u308A\u307E\u305B\u3093"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "rgba(255,255,255,0.4)"
    }
  }, "\u7BA1\u7406\u30BF\u30D6\u304B\u3089\u8FFD\u52A0\u3057\u3066\u304F\u3060\u3055\u3044"));

  // セッション設定画面（コース選択後、開始前）
  if (!sessionConf) {
    const avail = pool.length;
    const SEC_OPTIONS = [{
      label: "1分/問",
      sec: 60
    }, {
      label: "1.5分/問",
      sec: 90
    }, {
      label: "2分/問 (推奨)",
      sec: 120
    }, {
      label: "制限なし",
      sec: 0
    }];
    const COUNT_OPTIONS = [5, 10, 20, 30].filter(n => n <= avail).concat(avail > 30 ? [avail] : []);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8
      }
    }, [["normal", "🆕 新規"], ["srs", "🔄 反復"]].map(_ref11 => {
      let _ref12 = _slicedToArray(_ref11, 2),
        id = _ref12[0],
        label = _ref12[1];
      return /*#__PURE__*/React.createElement("button", {
        key: id,
        onClick: () => {
          setCourse(id);
          resetSession();
        },
        style: {
          flex: 1,
          padding: "12px",
          borderRadius: 12,
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          background: course === id ? "rgba(91,159,255,0.15)" : "rgba(255,255,255,0.04)",
          border: course === id ? "1px solid rgba(91,159,255,0.4)" : "1px solid rgba(255,255,255,0.08)",
          color: course === id ? "#5B9FFF" : "rgba(255,255,255,0.5)"
        }
      }, label);
    })), course === "srs" && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "8px 12px",
        background: "rgba(52,211,153,0.07)",
        borderRadius: 10,
        border: "1px solid rgba(52,211,153,0.15)",
        fontSize: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#34D399",
        fontWeight: 600
      }
    }, "\u4ECA\u65E5\u306E\u5FA9\u7FD2: ", questions.filter(q => (q.history || []).length > 0 && isDueToday(q)).length, "\u554F")), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        marginBottom: 16
      }
    }, "\u554F\u984C\u6570"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        marginBottom: 20
      }
    }, COUNT_OPTIONS.map(n => /*#__PURE__*/React.createElement("button", {
      key: n,
      onClick: () => startSession({
        count: n,
        secPerQ: 120
      }),
      style: {
        flex: 1,
        minWidth: 60,
        padding: "12px 8px",
        borderRadius: 12,
        background: "rgba(91,159,255,0.1)",
        border: "1px solid rgba(91,159,255,0.25)",
        color: "#5B9FFF",
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer"
      }
    }, n === avail ? "全問" : n + "問"))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        marginBottom: 12
      }
    }, "1\u554F\u3042\u305F\u308A\u306E\u6642\u9593"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 8
      }
    }, SEC_OPTIONS.map(_ref13 => {
      let label = _ref13.label,
        sec = _ref13.sec;
      return /*#__PURE__*/React.createElement("button", {
        key: sec,
        onClick: () => startSession({
          count: Math.min(10, avail),
          secPerQ: sec
        }),
        style: {
          padding: "12px 16px",
          borderRadius: 12,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: sec === 120 ? "#5B9FFF" : "rgba(255,255,255,0.6)",
          fontSize: 13,
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }
      }, /*#__PURE__*/React.createElement("span", null, label), sec === 120 && /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 10,
          color: "rgba(91,159,255,0.6)"
        }
      }, "\u30C7\u30D5\u30A9\u30EB\u30C8"));
    }))));
  }

  // 結果画面
  if (timedDone) {
    const rate = timedResult?.total > 0 ? Math.round(timedResult.correct / timedResult.total * 100) : 0;
    const min = Math.floor((timedResult?.sec || 0) / 60);
    const sec = (timedResult?.sec || 0) % 60;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Card, {
      style: {
        textAlign: "center",
        padding: "32px 20px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 16,
        fontWeight: 600,
        marginBottom: 20
      }
    }, "\uD83D\uDCCA \u30BB\u30C3\u30B7\u30E7\u30F3\u7D50\u679C"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 56,
        fontWeight: 200,
        color: rate >= 70 ? "#34D399" : rate >= 50 ? "#FBBF24" : "#F87171",
        marginBottom: 8,
        fontVariantNumeric: "tabular-nums"
      }
    }, rate, "%"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: "rgba(255,255,255,0.5)",
        marginBottom: 4
      }
    }, timedResult?.correct, "/", timedResult?.total, "\u554F\u6B63\u89E3"), timedResult?.sec > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: "rgba(255,255,255,0.3)",
        marginBottom: 20
      }
    }, "\u89E3\u7B54\u6642\u9593: ", min, "\u5206", sec, "\u79D2"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: "rgba(255,255,255,0.5)",
        marginBottom: 24,
        padding: "14px",
        background: "rgba(255,255,255,0.04)",
        borderRadius: 12
      }
    }, rate >= 70 ? "🎉 合格ライン突破！この調子で続けよう" : rate >= 50 ? "📈 もう少し！弱点問題を復習しよう" : "💪 要復習モードで弱点を克服しよう"), /*#__PURE__*/React.createElement("button", {
      onClick: resetSession,
      style: {
        width: "100%",
        padding: "14px",
        borderRadius: 14,
        background: "#fff",
        color: "#000",
        fontSize: 14,
        fontWeight: 600,
        border: "none",
        cursor: "pointer"
      }
    }, "\u623B\u308B")));
  }
  if (!pool.length) return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, [["normal", "🆕 新規"], ["srs", "🔄 間隔反復"]].map(_ref14 => {
    let _ref15 = _slicedToArray(_ref14, 2),
      id = _ref15[0],
      label = _ref15[1];
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => {
        setCourse(id);
        setIdx(0);
        setSel(null);
        setDone(false);
      },
      style: {
        flex: 1,
        padding: "10px",
        borderRadius: 12,
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        background: course === id ? "rgba(91,159,255,0.15)" : "rgba(255,255,255,0.04)",
        border: course === id ? "1px solid rgba(91,159,255,0.4)" : "1px solid rgba(255,255,255,0.08)",
        color: course === id ? "#5B9FFF" : "rgba(255,255,255,0.5)"
      }
    }, label);
  })), /*#__PURE__*/React.createElement(FilterBar, {
    questions: questions,
    subj: subj,
    mode: mode,
    reset: reset
  }), /*#__PURE__*/React.createElement(Card, {
    style: {
      textAlign: "center",
      padding: "48px 20px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "rgba(255,255,255,0.4)"
    }
  }, course === "srs" ? "🎉 今日の復習は完了！また明日" : "該当問題なし")));
  const acc = session.total > 0 ? (session.correct / session.total * 100).toFixed(0) : null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, [["normal", "🆕 新規"], ["srs", "🔄 反復"]].map(_ref16 => {
    let _ref17 = _slicedToArray(_ref16, 2),
      id = _ref17[0],
      label = _ref17[1];
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => {
        setCourse(id);
        resetSession();
      },
      style: {
        flex: 1,
        padding: "12px",
        borderRadius: 12,
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        background: course === id ? "rgba(91,159,255,0.15)" : "rgba(255,255,255,0.04)",
        border: course === id ? "1px solid rgba(91,159,255,0.4)" : "1px solid rgba(255,255,255,0.08)",
        color: course === id ? "#5B9FFF" : "rgba(255,255,255,0.5)"
      }
    }, label);
  })), course === "srs" && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 12px",
      background: "rgba(52,211,153,0.07)",
      borderRadius: 10,
      border: "1px solid rgba(52,211,153,0.15)",
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#34D399",
      fontWeight: 600
    }
  }, "\u4ECA\u65E5\u306E\u5FA9\u7FD2: ", questions.filter(q => (q.history || []).length > 0 && isDueToday(q)).length, "\u554F"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "rgba(255,255,255,0.3)",
      marginLeft: 12
    }
  }, "\u5B8C\u4E86: ", questions.filter(q => (q.history || []).length > 0 && q.lastAnswered === todayStr() && !isDueToday(q)).length, "\u554F")), /*#__PURE__*/React.createElement(FilterBar, {
    questions: questions,
    subj: subj,
    mode: mode,
    reset: reset
  }), sessionConf && !timedDone && (() => {
    const totalSec = sessionConf.count * sessionConf.secPerQ;
    const remaining = Math.max(0, totalSec - timedSec);
    const perQ = sessionConf.secPerQ;
    const elapsedThisQ = perQ > 0 ? timedSec % perQ : 0;
    const remainingThisQ = perQ > 0 ? Math.max(0, perQ - elapsedThisQ) : null;
    const isOver = perQ > 0 && elapsedThisQ >= perQ;
    const isWarning = remainingThisQ !== null && remainingThisQ <= 10 && !isOver;
    const color = isOver ? "#F87171" : isWarning ? "#FBBF24" : "#5B9FFF";
    const bg = isOver ? "rgba(248,113,113,0.08)" : isWarning ? "rgba(251,191,36,0.08)" : "rgba(91,159,255,0.08)";
    const border = isOver ? "1px solid rgba(248,113,113,0.3)" : isWarning ? "1px solid rgba(251,191,36,0.25)" : "1px solid rgba(91,159,255,0.2)";
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        background: bg,
        border,
        borderRadius: 12,
        animation: isOver ? "timerFlash 0.8s ease-in-out infinite" : "none"
      }
    }, /*#__PURE__*/React.createElement("style", null, `@keyframes timerFlash { 0%,100%{opacity:1} 50%{opacity:0.3} }`), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color,
        fontWeight: 600
      }
    }, session.total + 1, "/", sessionConf.count === 9999 ? pool.length : sessionConf.count, "\u554F"), perQ > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 20,
        fontWeight: 200,
        color,
        fontVariantNumeric: "tabular-nums"
      }
    }, String(Math.floor(remainingThisQ / 60)).padStart(2, "0"), ":", String(remainingThisQ % 60).padStart(2, "0")), isOver && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: "#F87171"
      }
    }, "\u6642\u9593\u8D85\u904E")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setPaused(p => !p),
      style: {
        fontSize: 11,
        color: paused ? color : "rgba(255,255,255,0.5)",
        background: paused ? `rgba(${isOver ? "248,113,113" : "251,191,36"},0.1)` : "none",
        border: paused ? `1px solid ${color}33` : "none",
        borderRadius: 6,
        padding: "4px 8px",
        cursor: "pointer"
      }
    }, paused ? "▶ 再開" : "⏸ 停止"), /*#__PURE__*/React.createElement("button", {
      onClick: finishSession,
      style: {
        fontSize: 11,
        color: "rgba(255,255,255,0.3)",
        background: "none",
        border: "none",
        cursor: "pointer"
      }
    }, "\u7D42\u4E86")));
  })(), (() => {
    const today = todayStr();
    const solvedToday = questions.filter(q => q.lastAnswered === today).length;
    const total = pool.length;
    const remaining = pool.filter(q => q.lastAnswered !== today).length;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 12,
        paddingLeft: 4,
        fontSize: 12,
        color: "rgba(255,255,255,0.4)",
        flexWrap: "wrap",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("span", null, "\u4ECA\u65E5 ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: "#34D399",
        fontVariantNumeric: "tabular-nums"
      }
    }, solvedToday), "\u554F\u89E3\u7B54"), /*#__PURE__*/React.createElement("span", null, "\u6B8B\u308A ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: "#fff",
        fontVariantNumeric: "tabular-nums"
      }
    }, remaining), "\u554F"), session.total > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, "\u6B63\u7B54\u7387 ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: "#fff"
      }
    }, acc, "%"))), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: "auto",
        color: "rgba(255,255,255,0.2)",
        fontVariantNumeric: "tabular-nums"
      }
    }, idx % Math.max(pool.length, 1) + 1, "/", pool.length));
  })(), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      flexWrap: "wrap",
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 99,
      background: subj_.color,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "rgba(255,255,255,0.5)"
    }
  }, subj_.name), q.rank && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      padding: "2px 6px",
      borderRadius: 4,
      fontWeight: 700,
      background: RANK_COLOR[q.rank] || "#888",
      color: "#000"
    }
  }, q.rank), q.year && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "rgba(255,255,255,0.3)"
    }
  }, q.year, q.no ? `-${String(q.no).padStart(2, "0")}` : ""), q.topic && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "rgba(255,255,255,0.25)"
    }
  }, "\xB7 ", q.topic), q.qPage && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: "rgba(255,255,255,0.2)",
      background: "rgba(255,255,255,0.05)",
      padding: "1px 6px",
      borderRadius: 4
    }
  }, "\u554F\u984C\u96C6 p.", q.qPage), q.tbPage && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: "rgba(181,123,255,0.5)",
      background: "rgba(181,123,255,0.07)",
      padding: "1px 6px",
      borderRadius: 4
    }
  }, "\u6559\u79D1\u66F8 p.", q.tbPage)), q.lastAnswered && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: "rgba(255,255,255,0.25)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, "\uD83D\uDD50 ", relativeDate(q.lastAnswered)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 3
    }
  }, [0, 1, 2, 3, 4].map(i => {
    const r = (q.history || []).slice(-5)[i];
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        width: 14,
        height: 14,
        borderRadius: 3,
        background: r === "○" ? "rgba(52,211,153,0.2)" : r === "×" ? "rgba(248,113,113,0.2)" : "rgba(255,255,255,0.05)",
        border: `1px solid ${r ? "transparent" : "rgba(255,255,255,0.08)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 8,
        color: r === "○" ? "#34D399" : r === "×" ? "#F87171" : "transparent"
      }
    }, r || "");
  })), /*#__PURE__*/React.createElement("button", {
    onClick: toggleStar,
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: 18,
      lineHeight: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: q.starred ? "#FBBF24" : "rgba(255,255,255,0.2)"
    }
  }, "\u2605")))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      lineHeight: 1.75,
      marginBottom: 20,
      whiteSpace: "pre-wrap"
    }
  }, /*#__PURE__*/React.createElement(HighlightedText, {
    text: q.q,
    onTermClick: t => setActiveTerm(t)
  })), !done && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, !showHint ? /*#__PURE__*/React.createElement("button", {
    onClick: getHint,
    style: {
      background: "rgba(91,159,255,0.1)",
      border: "1px solid rgba(91,159,255,0.2)",
      borderRadius: 10,
      padding: "8px 16px",
      fontSize: 12,
      color: "#5B9FFF",
      cursor: "pointer"
    }
  }, "\u2726 \u30D2\u30F3\u30C8\u3092\u3082\u3089\u3046") : /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(91,159,255,0.08)",
      border: "1px solid rgba(91,159,255,0.15)",
      borderRadius: 12,
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#5B9FFF",
      marginBottom: 6
    }
  }, "\u2726 AI\u30D2\u30F3\u30C8"), hintLoading ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "rgba(255,255,255,0.4)"
    }
  }, "\u8003\u3048\u4E2D...") : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "rgba(255,255,255,0.8)",
      lineHeight: 1.9,
      whiteSpace: "pre-wrap"
    }
  }, aiHint))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, q.opts.map((opt, i) => {
    const isSelected = sel === i;
    const isCorrect = i === q.correct;
    let bg = "rgba(255,255,255,0.04)",
      border = "transparent",
      textC = "#fff";
    if (done && isCorrect) {
      bg = "rgba(52,211,153,0.12)";
      border = "rgba(52,211,153,0.35)";
      textC = "#34D399";
    } else if (done && isSelected) {
      bg = "rgba(248,113,113,0.12)";
      border = "rgba(248,113,113,0.35)";
      textC = "#F87171";
    } else if (!done && isSelected) {
      bg = "rgba(255,255,255,0.1)";
    }
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => pick(i),
      disabled: done,
      style: {
        textAlign: "left",
        padding: "14px 16px",
        borderRadius: 14,
        background: bg,
        border: `1px solid ${border}`,
        cursor: done ? "default" : "pointer",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        transition: "all 0.15s"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "rgba(255,255,255,0.3)",
        fontSize: 12,
        fontVariantNumeric: "tabular-nums",
        marginTop: 1,
        flexShrink: 0
      }
    }, i + 1), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        lineHeight: 1.65,
        color: textC
      }
    }, opt), done && isCorrect && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: "auto",
        flexShrink: 0,
        color: "#34D399"
      }
    }, "\u2713"), done && isSelected && !isCorrect && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: "auto",
        flexShrink: 0,
        color: "#F87171"
      }
    }, "\u2717"));
  })), done && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      paddingTop: 20,
      borderTop: "1px solid rgba(255,255,255,0.07)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      background: sel === q.correct ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.12)",
      borderRadius: 99,
      padding: "4px 12px",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: sel === q.correct ? "#34D399" : "#F87171"
    }
  }, sel === q.correct ? `+${XP_PER_CORRECT} XP ✓` : `+${XP_PER_WRONG} XP ✗`)), q.explain && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "rgba(255,255,255,0.3)",
      letterSpacing: "0.1em",
      marginBottom: 8
    }
  }, "\u89E3\u8AAC"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      lineHeight: 1.8,
      color: "rgba(255,255,255,0.8)",
      marginBottom: q.refs ? 12 : 20,
      whiteSpace: "pre-wrap"
    }
  }, q.explain)), q.refs && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "rgba(91,159,255,0.8)",
      marginBottom: 10
    }
  }, "\uD83D\uDCD6 ", q.refs), (q.qPage || q.tbPage) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 16,
      flexWrap: "wrap"
    }
  }, q.qPage && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      background: "rgba(255,255,255,0.06)",
      borderRadius: 8,
      padding: "5px 10px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: "rgba(255,255,255,0.4)"
    }
  }, "\u554F\u984C\u96C6"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "rgba(255,255,255,0.8)",
      fontWeight: 600
    }
  }, "p.", q.qPage)), q.tbPage && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      background: "rgba(181,123,255,0.1)",
      borderRadius: 8,
      padding: "5px 10px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: "rgba(181,123,255,0.6)"
    }
  }, "\u6559\u79D1\u66F8"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "#B57BFF",
      fontWeight: 600
    }
  }, "p.", q.tbPage))), !knowledgeSkipped && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, knowledgeLoading ? /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(181,123,255,0.08)",
      border: "1px solid rgba(181,123,255,0.2)",
      borderRadius: 14,
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "#B57BFF",
      fontWeight: 500
    }
  }, "\u2726 \u77E5\u8B58\u307E\u3068\u3081"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "rgba(255,255,255,0.3)"
    }
  }, "\u751F\u6210\u4E2D...")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: 6,
      height: 6,
      borderRadius: 99,
      background: "rgba(181,123,255,0.4)",
      animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`
    }
  })))) : knowledge ? /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(181,123,255,0.08)",
      border: "1px solid rgba(181,123,255,0.2)",
      borderRadius: 14,
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "#B57BFF",
      fontWeight: 500
    }
  }, "\u2726 \u77E5\u8B58\u307E\u3068\u3081"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setKnowledgeSkipped(true),
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: 11,
      color: "rgba(255,255,255,0.3)",
      padding: "2px 6px"
    }
  }, "\u30B9\u30AD\u30C3\u30D7 \xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      lineHeight: 1.85,
      color: "rgba(255,255,255,0.85)",
      whiteSpace: "pre-wrap"
    }
  }, knowledge), q.textbook && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      paddingTop: 12,
      borderTop: "1px solid rgba(181,123,255,0.15)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "rgba(181,123,255,0.6)",
      marginBottom: 6
    }
  }, "\uD83D\uDCDA \u6559\u79D1\u66F8\u3088\u308A"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "rgba(255,255,255,0.55)",
      lineHeight: 1.7,
      whiteSpace: "pre-wrap"
    }
  }, q.textbook))) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "rgba(255,255,255,0.3)",
      marginBottom: 8,
      letterSpacing: "0.08em"
    }
  }, "\uD83D\uDCDD \u30E1\u30E2"), memoEditing ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("textarea", {
    value: memo,
    onChange: e => setMemo(e.target.value),
    placeholder: "\u3053\u306E\u554F\u984C\u306E\u30DD\u30A4\u30F3\u30C8\u30FB\u899A\u3048\u65B9\u306A\u3069",
    rows: 3,
    style: {
      width: "100%",
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 10,
      padding: "10px 12px",
      fontSize: 13,
      color: "#fff",
      resize: "none",
      fontFamily: "inherit"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      saveMemo(memo);
      setMemoEditing(false);
    },
    style: {
      flex: 1,
      padding: "8px",
      borderRadius: 10,
      background: "rgba(255,255,255,0.1)",
      color: "#fff",
      fontSize: 13,
      border: "none",
      cursor: "pointer"
    }
  }, "\u4FDD\u5B58"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setMemoEditing(false),
    style: {
      padding: "8px 16px",
      borderRadius: 10,
      background: "none",
      color: "rgba(255,255,255,0.3)",
      fontSize: 13,
      border: "none",
      cursor: "pointer"
    }
  }, "\u30AD\u30E3\u30F3\u30BB\u30EB"))) : /*#__PURE__*/React.createElement("div", {
    onClick: () => setMemoEditing(true),
    style: {
      minHeight: 36,
      padding: "8px 12px",
      background: "rgba(255,255,255,0.03)",
      border: "1px dashed rgba(255,255,255,0.1)",
      borderRadius: 10,
      fontSize: 13,
      color: memo ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)",
      cursor: "pointer",
      lineHeight: 1.7,
      whiteSpace: "pre-wrap"
    }
  }, memo || "タップしてメモを追加...")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20,
      background: "rgba(91,159,255,0.05)",
      border: "1px solid rgba(91,159,255,0.12)",
      borderRadius: 14,
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#5B9FFF",
      marginBottom: 10,
      letterSpacing: "0.08em"
    }
  }, "\uD83E\uDD16 AI\u306B\u8CEA\u554F\u3059\u308B"), aiAnswer ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "rgba(255,255,255,0.4)",
      marginBottom: 6
    }
  }, "Q: ", aiQuestion), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "rgba(255,255,255,0.85)",
      lineHeight: 1.75,
      whiteSpace: "pre-wrap"
    }
  }, aiAnswer), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setAiAnswer("");
      setAiQuestion("");
    },
    style: {
      marginTop: 10,
      fontSize: 11,
      color: "rgba(91,159,255,0.6)",
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 0
    }
  }, "\u5225\u306E\u8CEA\u554F\u3092\u3059\u308B")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: aiQuestion,
    onChange: e => setAiQuestion(e.target.value),
    onKeyDown: e => e.key === "Enter" && askAI(),
    placeholder: "\u4F8B: \u306A\u305C\u571F\u53F0\u306F\u4E3B\u8981\u69CB\u9020\u90E8\u3067\u306F\u306A\u3044\u306E\uFF1F",
    style: {
      flex: 1,
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 10,
      padding: "8px 12px",
      fontSize: 13,
      color: "#fff",
      fontFamily: "inherit"
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: askAI,
    disabled: aiQLoading || !aiQuestion.trim(),
    style: {
      padding: "8px 14px",
      borderRadius: 10,
      background: aiQLoading || !aiQuestion.trim() ? "rgba(91,159,255,0.1)" : "rgba(91,159,255,0.2)",
      color: "#5B9FFF",
      fontSize: 13,
      border: "none",
      cursor: aiQLoading || !aiQuestion.trim() ? "default" : "pointer",
      whiteSpace: "nowrap"
    }
  }, aiQLoading ? "..." : "質問"))), /*#__PURE__*/React.createElement("button", {
    onClick: next,
    style: {
      width: "100%",
      padding: "14px",
      borderRadius: 14,
      background: "#fff",
      color: "#000",
      fontSize: 14,
      fontWeight: 600,
      border: "none",
      cursor: "pointer"
    }
  }, "\u6B21\u306E\u554F\u984C \u2192"))), activeTerm && /*#__PURE__*/React.createElement(TermPopup, {
    term: activeTerm,
    onClose: () => setActiveTerm(null)
  }));
}
function FilterBar(_ref18) {
  let questions = _ref18.questions,
    subj = _ref18.subj,
    mode = _ref18.mode,
    reset = _ref18.reset;
  const pillStyle = (active, color) => ({
    padding: "6px 14px",
    borderRadius: 99,
    fontSize: 12,
    border: "none",
    cursor: "pointer",
    whiteSpace: "nowrap",
    flexShrink: 0,
    background: active ? color || "#fff" : "rgba(255,255,255,0.07)",
    color: active ? "#000" : "rgba(255,255,255,0.6)"
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      overflowX: "auto",
      paddingBottom: 4,
      scrollbarWidth: "none"
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: pillStyle(subj === "all"),
    onClick: () => reset("all", undefined)
  }, "\u5168\u79D1\u76EE"), SUBJECTS.map(s => {
    const cnt = questions.filter(q => q.subject === s.id).length;
    if (!cnt) return null;
    return /*#__PURE__*/React.createElement("button", {
      key: s.id,
      style: pillStyle(subj === s.id, s.color),
      onClick: () => reset(s.id, undefined)
    }, s.name, " ", cnt);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      overflowX: "auto",
      paddingBottom: 4,
      scrollbarWidth: "none"
    }
  }, [["AB", "A・B優先", null], ["A", "Aのみ", null], ["all", "全難易度", null], ["weak", "要復習", "#F87171"], ["starred", "★", "#FBBF24"], ["untried", "未着手", null]].map(_ref19 => {
    let _ref20 = _slicedToArray(_ref19, 3),
      v = _ref20[0],
      l = _ref20[1],
      c = _ref20[2];
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      style: {
        ...pillStyle(mode === v, c),
        fontSize: 11,
        padding: "5px 12px"
      },
      onClick: () => reset(undefined, v)
    }, l);
  })));
}

// ── LOG TAB ────────────────────────────────────────────────
function LogTab(_ref21) {
  let logs = _ref21.logs,
    setLogs = _ref21.setLogs,
    questions = _ref21.questions;
  const _useState79 = useState({}),
    _useState80 = _slicedToArray(_useState79, 2),
    inputs = _useState80[0],
    setInputs = _useState80[1];
  const today = todayStr();
  const todayLog = logs[today] || {};
  const todayMin = Object.values(todayLog).reduce((a, b) => a + b, 0);

  // 週別正答率グラフ用データ（過去8週）
  const weeklyStats = useMemo(() => {
    const weeks = [];
    for (let w = 7; w >= 0; w--) {
      const start = new Date();
      start.setDate(start.getDate() - w * 7 - 6);
      const end = new Date();
      end.setDate(end.getDate() - w * 7);
      const startStr = start.toISOString().slice(0, 10);
      const endStr = end.toISOString().slice(0, 10);
      let correct = 0,
        total = 0;
      (questions || []).forEach(q => {
        (q.history || []).forEach((h, i) => {
          // historyの長さとlastAnsweredから大まかに日付を推定
          // より正確には各回答に日付が必要だが、簡易的に週ごとに集計
        });
      });
      // 学習ログから学習時間を集計
      let studyMin = 0;
      Object.entries(logs).forEach(_ref22 => {
        let _ref23 = _slicedToArray(_ref22, 2),
          date = _ref23[0],
          dayLog = _ref23[1];
        if (date >= startStr && date <= endStr) {
          studyMin += Object.values(dayLog).reduce((a, b) => a + b, 0);
        }
      });
      const label = `${start.getMonth() + 1}/${start.getDate()}`;
      weeks.push({
        label,
        studyMin
      });
    }
    return weeks;
  }, [logs, questions]);

  // 科目別正答率（全期間）
  const subjectAccuracy = useMemo(() => {
    return (questions || []).reduce((acc, q) => {
      const h = q.history || [];
      if (!h.length) return acc;
      if (!acc[q.subject]) acc[q.subject] = {
        correct: 0,
        total: 0
      };
      acc[q.subject].correct += h.filter(x => x === "○").length;
      acc[q.subject].total += h.length;
      return acc;
    }, {});
  }, [questions]);
  const save_ = () => {
    const cleaned = {};
    Object.entries(inputs).forEach(_ref24 => {
      let _ref25 = _slicedToArray(_ref24, 2),
        k = _ref25[0],
        v = _ref25[1];
      const n = parseInt(v) || 0;
      if (n > 0) cleaned[k] = n;
    });
    if (!Object.keys(cleaned).length) return;
    setLogs(prev => ({
      ...prev,
      [today]: {
        ...(prev[today] || {}),
        ...cleaned
      }
    }));
    setInputs({});
  };
  const last14 = useMemo(() => {
    return Array.from({
      length: 14
    }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      const key = d.toISOString().slice(0, 10);
      const dl = logs[key] || {};
      return {
        date: fmtMD(d),
        minutes: Math.floor(Object.values(dl).reduce((a, b) => a + b, 0) / 60)
      };
    });
  }, [logs]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, (() => {
    // JST基準で今日から16週前の月曜日を起点に計算
    const todayJST = nowJST();
    const todayDateStr = todayStr();
    // 今日の曜日(月=0, 火=1, ... 日=6)
    const dow = (todayJST.getUTCDay() + 6) % 7; // 月曜始まりに変換
    // 今週の月曜日
    const startDate = new Date(todayJST);
    startDate.setUTCDate(startDate.getUTCDate() - dow - 15 * 7);

    // 16週分のデータを週ごとに作成
    const WEEKS = 16;
    const DOW = ["月", "火", "水", "木", "金", "土", "日"];
    const weeks = [];
    for (let w = 0; w < WEEKS; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(startDate);
        date.setUTCDate(startDate.getUTCDate() + w * 7 + d);
        const str = date.toISOString().slice(0, 10);
        const dayLog = logs[str] || {};
        const min = dayTotalMin(dayLog);
        const solved = (questions || []).filter(q => q.lastAnswered === str).length;
        const isFuture = str > todayDateStr;
        days.push({
          str,
          min,
          solved,
          isFuture,
          day: date.getUTCDate(),
          month: date.getUTCMonth() + 1
        });
      }
      weeks.push(days);
    }
    const maxMin = Math.max(...weeks.flat().map(d => d.min), 1);
    return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, null, "\u5B66\u7FD2\u30AB\u30EC\u30F3\u30C0\u30FC\uFF08\u904E\u53BB16\u9031\uFF09"), /*#__PURE__*/React.createElement("div", {
      style: {
        overflowX: "auto"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 2,
        paddingTop: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 2,
        marginRight: 4,
        flexShrink: 0
      }
    }, DOW.map((d, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        height: 14,
        fontSize: 8,
        color: "rgba(255,255,255,0.3)",
        display: "flex",
        alignItems: "center"
      }
    }, i % 2 === 0 ? d : ""))), weeks.map((week, wi) => {
      // 月が変わる週に月ラベルを表示
      const firstDay = week[0];
      const showMonth = firstDay.day <= 7 || wi === 0;
      return /*#__PURE__*/React.createElement("div", {
        key: wi,
        style: {
          display: "flex",
          flexDirection: "column",
          gap: 2,
          position: "relative",
          flexShrink: 0
        }
      }, showMonth && /*#__PURE__*/React.createElement("div", {
        style: {
          position: "absolute",
          top: -16,
          left: 0,
          fontSize: 8,
          color: "rgba(255,255,255,0.4)",
          whiteSpace: "nowrap"
        }
      }, firstDay.month, "\u6708"), week.map((cell, di) => {
        if (cell.isFuture) return /*#__PURE__*/React.createElement("div", {
          key: di,
          style: {
            width: 14,
            height: 14,
            borderRadius: 3,
            background: "rgba(255,255,255,0.02)"
          }
        });
        const intensity = cell.min > 0 ? Math.max(0.2, cell.min / maxMin) : 0;
        const isToday = cell.str === todayDateStr;
        const bg = cell.min > 0 ? `rgba(91,159,255,${intensity})` : cell.solved > 0 ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.06)";
        return /*#__PURE__*/React.createElement("div", {
          key: di,
          title: `${cell.str}（${cell.min}分・${cell.solved}問）`,
          style: {
            width: 14,
            height: 14,
            borderRadius: 3,
            background: bg,
            outline: isToday ? "2px solid #5B9FFF" : "none",
            outlineOffset: "1px"
          }
        });
      }));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 10,
        marginTop: 12,
        fontSize: 10,
        color: "rgba(255,255,255,0.35)",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 10,
        height: 10,
        borderRadius: 2,
        background: "rgba(255,255,255,0.06)"
      }
    }), /*#__PURE__*/React.createElement("span", null, "\u306A\u3057"), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 10,
        height: 10,
        borderRadius: 2,
        background: "rgba(52,211,153,0.3)"
      }
    }), /*#__PURE__*/React.createElement("span", null, "\u89E3\u7B54\u306E\u307F"), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 10,
        height: 10,
        borderRadius: 2,
        background: "rgba(91,159,255,0.4)"
      }
    }), /*#__PURE__*/React.createElement("span", null, "\u5B66\u7FD2"), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 10,
        height: 10,
        borderRadius: 2,
        background: "rgba(91,159,255,0.9)"
      }
    }), /*#__PURE__*/React.createElement("span", null, "\u591A\u304F\u5B66\u7FD2"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: "auto",
        display: "flex",
        alignItems: "center",
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 10,
        height: 10,
        borderRadius: 2,
        outline: "2px solid #5B9FFF",
        outlineOffset: "1px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "\u4ECA\u65E5")))));
  })(), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, null, "\u4ECA\u65E5\u306E\u5B66\u7FD2\u8A18\u9332"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "rgba(255,255,255,0.35)",
      marginBottom: 16
    }
  }, "\u6F14\u7FD2\u30BB\u30C3\u30B7\u30E7\u30F3\u3092\u7D42\u4E86\u3059\u308B\u3068\u81EA\u52D5\u3067\u8A18\u9332\u3055\u308C\u307E\u3059"), dayTotalSec(todayLog) >= 5 ? /*#__PURE__*/React.createElement("div", null, (() => {
    const totalSec = dayTotalSec(todayLog);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor(totalSec % 3600 / 60);
    const s = totalSec % 60;
    const display = h > 0 ? `${h}時間${m}分` : m > 0 ? `${m}分${s}秒` : `${s}秒`;
    const totalAllSec = Object.values(logs).reduce((a, d) => a + dayTotalSec(d), 0);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 48,
        fontWeight: 200,
        fontVariantNumeric: "tabular-nums",
        marginBottom: 4
      }
    }, display), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: "rgba(255,255,255,0.4)",
        marginBottom: 16
      }
    }, "\u7D2F\u8A08 ", (totalAllSec / 3600).toFixed(1), "\u6642\u9593"));
  })(), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, Object.entries(todayLog).map(_ref26 => {
    let _ref27 = _slicedToArray(_ref26, 2),
      key = _ref27[0],
      val = _ref27[1];
    const sec = toSeconds(val);
    if (sec < 5) return null;
    const m = Math.floor(sec / 60),
      s = sec % 60;
    const disp = m > 0 ? `${m}分${s > 0 ? s + "秒" : ""}` : `${s}秒`;
    return /*#__PURE__*/React.createElement("div", {
      key: key,
      style: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: 13,
        padding: "6px 0",
        borderBottom: "1px solid rgba(255,255,255,0.04)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "rgba(255,255,255,0.6)"
      }
    }, key), /*#__PURE__*/React.createElement("span", {
      style: {
        fontVariantNumeric: "tabular-nums"
      }
    }, disp));
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "24px 0",
      color: "rgba(255,255,255,0.2)",
      fontSize: 13
    }
  }, "\u4ECA\u65E5\u306F\u307E\u3060\u8A18\u9332\u304C\u3042\u308A\u307E\u305B\u3093", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11
    }
  }, "\u6F14\u7FD2\u30BF\u30D6\u3067\u30BB\u30C3\u30B7\u30E7\u30F3\u3092\u958B\u59CB\u3057\u307E\u3057\u3087\u3046"))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, null, "\u76F4\u8FD114\u65E5"), /*#__PURE__*/React.createElement(SimpleBarChart, {
    data: last14
  })));
}

// ── AI TAB ─────────────────────────────────────────────────
function AITab(_ref28) {
  let questions = _ref28.questions,
    weakQuestions = _ref28.weakQuestions,
    logs = _ref28.logs;
  const _useState81 = useState("analysis"),
    _useState82 = _slicedToArray(_useState81, 2),
    mode = _useState82[0],
    setMode = _useState82[1]; // analysis | generate | advice
  const _useState83 = useState(""),
    _useState84 = _slicedToArray(_useState83, 2),
    output = _useState84[0],
    setOutput = _useState84[1];
  const _useState85 = useState(false),
    _useState86 = _slicedToArray(_useState85, 2),
    loading = _useState86[0],
    setLoading = _useState86[1];
  const _useState87 = useState(""),
    _useState88 = _slicedToArray(_useState87, 2),
    prompt = _useState88[0],
    setPrompt = _useState88[1];
  const subjectStats = useMemo(() => {
    return SUBJECTS.map(s => {
      const qs = questions.filter(q => q.subject === s.id);
      const answered = qs.filter(q => (q.history || []).length > 0);
      const correct = answered.filter(q => {
        const h = (q.history || []).slice(-3);
        return h.filter(x => x === "○").length === h.length && h.length >= 2;
      });
      return {
        ...s,
        total: qs.length,
        answered: answered.length,
        mastered: correct.length
      };
    });
  }, [questions]);
  const run = async () => {
    setLoading(true);
    setOutput("");
    let sys = "",
      usr = "";
    if (mode === "analysis") {
      sys = "あなたは一級建築士試験の専門コーチです。学習データを分析して、具体的で実践的なアドバイスを日本語で300字程度で提供してください。";
      usr = `学習データ:\n${subjectStats.map(s => `${s.name}: 登録${s.total}問、回答済${s.answered}問、習得${s.mastered}問`).join("\n")}\n要復習問題: ${weakQuestions.length}問\n\n弱点分析と優先して取り組むべき事項を教えてください。`;
    } else if (mode === "generate") {
      const weakSubjs = subjectStats.filter(s => s.answered > 0 && s.mastered / Math.max(s.answered, 1) < 0.6);
      const target = weakSubjs.length > 0 ? weakSubjs[0].name : "法規";
      sys = "あなたは一級建築士試験の問題作成専門家です。本試験の出題形式に沿った練習問題を1問作成してください。「次の記述のうち、誤っているものはどれか。」形式で、4択、解説付きでお願いします。";
      usr = `科目: ${target}\n${prompt || "総則・用語の定義"}\nに関する練習問題を1問作成してください。`;
    } else {
      sys = "あなたは一級建築士試験の学習コーチです。独学で勉強している建築士(日建設計勤務、多忙)に対して、今日の学習計画を具体的に提案してください。200字程度で。";
      usr = `弱点科目: ${weakQuestions.map(q => q.subject).filter((v, i, a) => a.indexOf(v) === i).join("、") || "なし"}\n要復習問題数: ${weakQuestions.length}\n${prompt || "今日は30分しか時間がありません"}`;
    }
    const res = await callClaude(sys, usr);
    setOutput(res);
    setLoading(false);
  };
  const MODES = [{
    id: "analysis",
    label: "弱点分析"
  }, {
    id: "generate",
    label: "問題生成"
  }, {
    id: "advice",
    label: "今日の計画"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 1,
      background: "rgba(255,255,255,0.05)",
      borderRadius: 14,
      padding: 4
    }
  }, MODES.map(m => /*#__PURE__*/React.createElement("button", {
    key: m.id,
    onClick: () => {
      setMode(m.id);
      setOutput("");
    },
    style: {
      flex: 1,
      padding: "10px 0",
      borderRadius: 10,
      border: "none",
      cursor: "pointer",
      fontSize: 12,
      fontWeight: 500,
      background: mode === m.id ? "#fff" : "transparent",
      color: mode === m.id ? "#000" : "rgba(255,255,255,0.5)",
      transition: "all 0.2s"
    }
  }, m.label))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "rgba(255,255,255,0.3)",
      marginBottom: 12
    }
  }, mode === "analysis" && "あなたの学習データをもとに弱点を分析します", mode === "generate" && "弱点科目の練習問題をAIが生成します", mode === "advice" && "今日の状況に合わせた学習計画を提案します"), (mode === "generate" || mode === "advice") && /*#__PURE__*/React.createElement("input", {
    value: prompt,
    onChange: e => setPrompt(e.target.value),
    placeholder: mode === "generate" ? "分野を指定(例: 防火区画)" : "一言メモ(例: 今日は20分だけ)",
    style: {
      width: "100%",
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 10,
      padding: "10px 14px",
      color: "#fff",
      fontSize: 13,
      outline: "none",
      marginBottom: 14,
      boxSizing: "border-box"
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: run,
    disabled: loading,
    style: {
      width: "100%",
      padding: "14px",
      borderRadius: 14,
      background: loading ? "rgba(91,159,255,0.4)" : "linear-gradient(135deg,#5B9FFF,#B57BFF)",
      color: "#fff",
      fontSize: 14,
      fontWeight: 600,
      border: "none",
      cursor: loading ? "default" : "pointer"
    }
  }, loading ? "AIが考え中..." : "✦ 実行"), output && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      paddingTop: 20,
      borderTop: "1px solid rgba(255,255,255,0.07)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "rgba(91,159,255,0.8)",
      marginBottom: 10
    }
  }, "\u2726 AI \u306E\u56DE\u7B54"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      lineHeight: 1.8,
      color: "rgba(255,255,255,0.85)",
      whiteSpace: "pre-wrap"
    }
  }, output))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, null, "\u79D1\u76EE\u5225\u7FD2\u719F\u72B6\u6CC1"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, subjectStats.map(s => {
    const pct = s.answered > 0 ? s.mastered / s.answered * 100 : 0;
    return /*#__PURE__*/React.createElement("div", {
      key: s.id
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: 13,
        marginBottom: 5
      }
    }, /*#__PURE__*/React.createElement("span", null, s.name), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "rgba(255,255,255,0.4)",
        fontVariantNumeric: "tabular-nums"
      }
    }, s.mastered, "/", s.answered, "\u554F \u7FD2\u5F97")), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 4,
        background: "rgba(255,255,255,0.07)",
        borderRadius: 99
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: "100%",
        width: `${pct}%`,
        background: s.color,
        borderRadius: 99,
        transition: "width 0.6s"
      }
    })));
  }))));
}

// ── HISTORY EDITOR ─────────────────────────────────────────
function HistoryEditor(_ref29) {
  let questions = _ref29.questions,
    setQuestions = _ref29.setQuestions;
  const _useState89 = useState(""),
    _useState90 = _slicedToArray(_useState89, 2),
    search = _useState90[0],
    setSearch = _useState90[1];
  const _useState91 = useState(null),
    _useState92 = _slicedToArray(_useState91, 2),
    expanded = _useState92[0],
    setExpanded = _useState92[1];
  const answered = questions.filter(q => (q.history || []).length > 0);
  const filtered = search ? answered.filter(q => q.q.includes(search) || q.topic?.includes(search) || q.year?.includes(search) || q.refs?.includes(search)) : answered;
  const removeLastHistory = async qId => {
    const updated = questions.map(q => {
      if (q.id !== qId) return q;
      const newHistory = [...(q.history || [])].slice(0, -1);
      const newLastAnswered = newHistory.length > 0 ? q.lastAnswered : null;
      return {
        ...q,
        history: newHistory,
        lastAnswered: newLastAnswered
      };
    });
    setQuestions(updated);
    await save("questions_v3", updated);
  };
  const clearHistory = async qId => {
    const updated = questions.map(q => q.id !== qId ? q : {
      ...q,
      history: [],
      lastAnswered: null
    });
    setQuestions(updated);
    await save("questions_v3", updated);
  };
  const toggleHistory = async (qId, idx) => {
    const updated = questions.map(q => {
      if (q.id !== qId) return q;
      const h = [...(q.history || [])];
      h[idx] = h[idx] === "○" ? "×" : "○";
      return {
        ...q,
        history: h
      };
    });
    setQuestions(updated);
    await save("questions_v3", updated);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(255,255,255,0.04)",
      borderRadius: 16,
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 500,
      marginBottom: 4
    }
  }, "\u56DE\u7B54\u5C65\u6B74\u306E\u4FEE\u6B63"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "rgba(255,255,255,0.4)",
      marginBottom: 16
    }
  }, "\u8AA4\u3063\u3066\u56DE\u7B54\u3057\u305F\u8A18\u9332\u3092\u4FEE\u6B63\u30FB\u524A\u9664\u3067\u304D\u307E\u3059"), /*#__PURE__*/React.createElement("input", {
    value: search,
    onChange: e => setSearch(e.target.value),
    placeholder: "\u554F\u984C\u30FB\u6761\u6587\u30FB\u5E74\u5EA6\u3067\u691C\u7D22...",
    style: {
      width: "100%",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 10,
      padding: "10px 12px",
      fontSize: 13,
      color: "#fff",
      marginBottom: 12,
      fontFamily: "inherit"
    }
  }), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "rgba(255,255,255,0.3)",
      textAlign: "center",
      padding: "16px 0"
    }
  }, search ? "該当なし" : "回答済みの問題がありません"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      maxHeight: 400,
      overflowY: "auto"
    }
  }, filtered.slice(0, 30).map(q => {
    const h = q.history || [];
    const isExpanded = expanded === q.id;
    return /*#__PURE__*/React.createElement("div", {
      key: q.id,
      style: {
        background: "rgba(255,255,255,0.04)",
        borderRadius: 12,
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: () => setExpanded(isExpanded ? null : q.id),
      style: {
        padding: "12px 14px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        fontSize: 12,
        color: "rgba(255,255,255,0.7)",
        lineHeight: 1.5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "rgba(255,255,255,0.4)",
        marginRight: 6
      }
    }, q.year), q.q.slice(0, 40), q.q.length > 40 ? "…" : ""), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 2,
        flexShrink: 0
      }
    }, h.slice(-5).map((v, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        width: 14,
        height: 14,
        borderRadius: 3,
        background: v === "○" ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 8,
        color: v === "○" ? "#34D399" : "#F87171"
      }
    }, v))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: "rgba(255,255,255,0.3)"
      }
    }, isExpanded ? "▲" : "▼")), isExpanded && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "0 14px 14px",
        borderTop: "1px solid rgba(255,255,255,0.06)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "rgba(255,255,255,0.4)",
        marginBottom: 8,
        marginTop: 10
      }
    }, "\u30BF\u30C3\u30D7\u3067\u25CB\u2194\xD7\u5207\u308A\u66FF\u3048"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 4,
        flexWrap: "wrap",
        marginBottom: 12
      }
    }, h.map((v, i) => /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => toggleHistory(q.id, i),
      style: {
        width: 28,
        height: 28,
        borderRadius: 6,
        background: v === "○" ? "rgba(52,211,153,0.15)" : "rgba(248,113,113,0.15)",
        border: v === "○" ? "1px solid rgba(52,211,153,0.4)" : "1px solid rgba(248,113,113,0.4)",
        color: v === "○" ? "#34D399" : "#F87171",
        fontSize: 12,
        cursor: "pointer"
      }
    }, v))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => removeLastHistory(q.id),
      style: {
        flex: 1,
        padding: "8px",
        borderRadius: 10,
        background: "rgba(251,191,36,0.1)",
        border: "1px solid rgba(251,191,36,0.25)",
        color: "#FBBF24",
        fontSize: 12,
        cursor: "pointer"
      }
    }, "\u6700\u5F8C\u306E1\u4EF6\u3092\u524A\u9664"), /*#__PURE__*/React.createElement("button", {
      onClick: () => clearHistory(q.id),
      style: {
        flex: 1,
        padding: "8px",
        borderRadius: 10,
        background: "rgba(248,113,113,0.1)",
        border: "1px solid rgba(248,113,113,0.25)",
        color: "#F87171",
        fontSize: 12,
        cursor: "pointer"
      }
    }, "\u5C65\u6B74\u3092\u30EA\u30BB\u30C3\u30C8"))));
  })));
}

// ── MANAGE TAB ─────────────────────────────────────────────
function ManageTab(_ref30) {
  let questions = _ref30.questions,
    setQuestions = _ref30.setQuestions,
    pendingCount = _ref30.pendingCount,
    importPending = _ref30.importPending;
  const _useState93 = useState(false),
    _useState94 = _slicedToArray(_useState93, 2),
    importing = _useState94[0],
    setImporting = _useState94[1];
  const _useState95 = useState(null),
    _useState96 = _slicedToArray(_useState95, 2),
    importDone = _useState96[0],
    setImportDone = _useState96[1];
  const _useState97 = useState(false),
    _useState98 = _slicedToArray(_useState97, 2),
    showManual = _useState98[0],
    setShowManual = _useState98[1];
  const _useState99 = useState(""),
    _useState100 = _slicedToArray(_useState99, 2),
    ioMsg = _useState100[0],
    setIoMsg = _useState100[1];

  // データをJSONファイルとして保存
  const exportData = async () => {
    try {
      const logs = await load("logs", {});
      const xp = await load("xp", 0);
      const hints = await load("hints", {});
      const data = {
        version: 1,
        exportedAt: new Date().toISOString(),
        questions,
        logs,
        xp,
        hints
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kenchikushi_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setIoMsg("保存しました ✓");
    } catch (e) {
      setIoMsg("保存失敗: " + e.message);
    }
  };

  // JSONファイルから読み込む
  const importData = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async ev => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.version || !data.questions) throw new Error("形式が不正です");
        // 既存のhistoryを保持しつつマージ
        const existingMap = new Map(questions.map(q => [q.id, q]));
        for (const q of data.questions) {
          const existing = existingMap.get(q.id);
          if (!existing) {
            existingMap.set(q.id, q);
          } else {
            // historyが多い方を採用
            if ((q.history || []).length > (existing.history || []).length) {
              existingMap.set(q.id, {
                ...existing,
                history: q.history,
                starred: q.starred || existing.starred
              });
            }
          }
        }
        const merged = Array.from(existingMap.values());
        setQuestions(merged);
        await save("questions_v3", merged);
        if (data.logs) await save("logs", data.logs);
        if (data.xp) await save("xp", data.xp);
        if (data.hints) await save("hints", data.hints);
        setIoMsg(`読み込み完了 — ${merged.length}問, XP:${data.xp || 0} ✓`);
      } catch (e) {
        setIoMsg("読み込み失敗: " + e.message);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };
  const _useState101 = useState({
      subject: "houki",
      q: "",
      opts: ["", "", "", ""],
      correct: 0,
      explain: "",
      refs: "",
      year: "",
      no: "",
      rank: "B",
      topic: "",
      textbook: "",
      qPage: "",
      tbPage: ""
    }),
    _useState102 = _slicedToArray(_useState101, 2),
    form = _useState102[0],
    setForm = _useState102[1];
  const _useState103 = useState(""),
    _useState104 = _slicedToArray(_useState103, 2),
    msg = _useState104[0],
    setMsg = _useState104[1];
  const doImport = async () => {
    setImporting(true);
    setImportDone(null);
    const n = await importPending();
    setImporting(false);
    setImportDone(n || 0);
  };
  const addManual = () => {
    if (!form.q.trim() || form.opts.some(o => !o.trim())) {
      setMsg("問題文と全選択肢を入力してください");
      return;
    }
    setQuestions([...questions, {
      ...form,
      id: `q_${Date.now()}`,
      starred: false,
      history: []
    }]);
    setForm({
      ...form,
      q: "",
      opts: ["", "", "", ""],
      correct: 0,
      explain: "",
      refs: "",
      no: "",
      textbook: "",
      qPage: "",
      tbPage: ""
    });
    setMsg("追加しました ✓");
  };
  const inp = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: "10px 14px",
    color: "#fff",
    fontSize: 13,
    outline: "none",
    width: "100%",
    boxSizing: "border-box"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(255,255,255,0.05)",
      borderRadius: 16,
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 500,
      marginBottom: 4
    }
  }, "\u30C7\u30FC\u30BF\u4FDD\u5B58 / \u8AAD\u8FBC"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "rgba(255,255,255,0.4)",
      marginBottom: 16,
      lineHeight: 1.7
    }
  }, "\u554F\u984C\u30FB\u56DE\u7B54\u5C65\u6B74\u30FB\u5B66\u7FD2\u8A18\u9332\u3092JSON\u30D5\u30A1\u30A4\u30EB\u3067\u4FDD\u5B58\u3002", /*#__PURE__*/React.createElement("br", null), "iPhone\u306A\u3089\u30D5\u30A1\u30A4\u30EB\u30A2\u30D7\u30EA/iCloud\u306B\u4FDD\u5B58\u3057\u3066\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3067\u304D\u307E\u3059\u3002"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: exportData,
    style: {
      flex: 1,
      padding: "13px",
      borderRadius: 12,
      background: "#fff",
      color: "#000",
      fontSize: 14,
      fontWeight: 600,
      border: "none",
      cursor: "pointer"
    }
  }, "\u2B07 \u4FDD\u5B58\u3059\u308B"), /*#__PURE__*/React.createElement("label", {
    style: {
      flex: 1,
      padding: "13px",
      borderRadius: 12,
      background: "rgba(91,159,255,0.15)",
      color: "#5B9FFF",
      fontSize: 14,
      fontWeight: 600,
      border: "1px solid rgba(91,159,255,0.3)",
      cursor: "pointer",
      textAlign: "center"
    }
  }, "\u2B06 \u8AAD\u307F\u8FBC\u3080", /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: ".json",
    onChange: importData,
    style: {
      display: "none"
    }
  }))), ioMsg && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      fontSize: 12,
      color: "#34D399"
    }
  }, ioMsg)), /*#__PURE__*/React.createElement(HistoryEditor, {
    questions: questions,
    setQuestions: setQuestions
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: pendingCount > 0 ? "rgba(91,159,255,0.1)" : "rgba(255,255,255,0.04)",
      border: pendingCount > 0 ? "1px solid rgba(91,159,255,0.3)" : "1px solid transparent",
      borderRadius: 16,
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 500
    }
  }, "Claude\u304B\u3089\u53D6\u308A\u8FBC\u3080"), pendingCount > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#5B9FFF",
      color: "#000",
      fontSize: 11,
      fontWeight: 700,
      padding: "2px 10px",
      borderRadius: 99
    }
  }, pendingCount, "\u554F \u5F85\u6A5F\u4E2D")), pendingCount > 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "rgba(255,255,255,0.6)",
      lineHeight: 1.7,
      marginBottom: 14
    }
  }, "\u554F\u984C\u306E\u6E96\u5099\u304C\u3067\u304D\u307E\u3057\u305F\u3002"), /*#__PURE__*/React.createElement("button", {
    onClick: doImport,
    disabled: importing,
    style: {
      width: "100%",
      padding: "14px",
      borderRadius: 14,
      background: importing ? "rgba(91,159,255,0.4)" : "#5B9FFF",
      color: "#000",
      fontSize: 14,
      fontWeight: 700,
      border: "none",
      cursor: "pointer"
    }
  }, importing ? "取り込み中..." : `${pendingCount}問を追加する`), importDone !== null && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontSize: 13,
      color: "#34D399"
    }
  }, importDone, "\u554F\u3092\u8FFD\u52A0\u3057\u307E\u3057\u305F \u2713")) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "rgba(255,255,255,0.35)",
      lineHeight: 1.8
    }
  }, "\u30C1\u30E3\u30C3\u30C8\u306B\u554F\u984C\u96C6\u306E\u5199\u771F\u3092\u9001\u308A", /*#__PURE__*/React.createElement("br", null), "\u300C\u554F\u984C\u3092\u767B\u9332\u3057\u3066\u300D\u3068\u8A00\u3046\u3060\u3051")), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, null, "\u4F7F\u3044\u65B9"), [["1", "問題集の写真をチャットに送る"], ["2", "「問題を登録して」と送る"], ["3", "このタブに通知が来る"], ["4", "ボタン1タップで完了"]].map(_ref31 => {
    let _ref32 = _slicedToArray(_ref31, 2),
      n = _ref32[0],
      t = _ref32[1];
    return /*#__PURE__*/React.createElement("div", {
      key: n,
      style: {
        display: "flex",
        gap: 12,
        alignItems: "center",
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 24,
        height: 24,
        borderRadius: 99,
        background: "rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        color: "rgba(255,255,255,0.5)",
        flexShrink: 0
      }
    }, n), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: "rgba(255,255,255,0.7)"
      }
    }, t));
  })), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowManual(!showManual),
    style: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "rgba(255,255,255,0.5)",
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("span", null, "\u624B\u52D5\u5165\u529B"), /*#__PURE__*/React.createElement("span", null, showManual ? "▲" : "▼")), showManual && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: form.subject,
    onChange: e => setForm({
      ...form,
      subject: e.target.value
    }),
    style: {
      ...inp,
      appearance: "none"
    }
  }, SUBJECTS.map(s => /*#__PURE__*/React.createElement("option", {
    key: s.id,
    value: s.id,
    style: {
      background: "#1a1a2e"
    }
  }, s.name))), /*#__PURE__*/React.createElement("select", {
    value: form.rank,
    onChange: e => setForm({
      ...form,
      rank: e.target.value
    }),
    style: {
      ...inp,
      appearance: "none"
    }
  }, ["A", "B", "C"].map(r => /*#__PURE__*/React.createElement("option", {
    key: r,
    value: r,
    style: {
      background: "#1a1a2e"
    }
  }, r, " ", r === "A" ? "基本" : r === "B" ? "標準" : "難解")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: form.year,
    onChange: e => setForm({
      ...form,
      year: e.target.value
    }),
    placeholder: "\u5E74\u5EA6 H27",
    style: inp
  }), /*#__PURE__*/React.createElement("input", {
    value: form.no,
    onChange: e => setForm({
      ...form,
      no: e.target.value
    }),
    placeholder: "\u554F\u756A\u53F7",
    style: inp
  }), /*#__PURE__*/React.createElement("input", {
    value: form.topic,
    onChange: e => setForm({
      ...form,
      topic: e.target.value
    }),
    placeholder: "\u5206\u91CE",
    style: inp
  })), /*#__PURE__*/React.createElement("textarea", {
    value: form.q,
    onChange: e => setForm({
      ...form,
      q: e.target.value
    }),
    placeholder: "\u554F\u984C\u6587",
    rows: 3,
    style: {
      ...inp,
      resize: "none"
    }
  }), form.opts.map((o, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setForm({
      ...form,
      correct: i
    }),
    style: {
      width: 30,
      height: 30,
      borderRadius: 99,
      border: "none",
      cursor: "pointer",
      flexShrink: 0,
      background: form.correct === i ? "#34D399" : "rgba(255,255,255,0.08)",
      color: form.correct === i ? "#000" : "rgba(255,255,255,0.5)",
      fontSize: 12,
      fontWeight: 700
    }
  }, i + 1), /*#__PURE__*/React.createElement("input", {
    value: o,
    onChange: e => {
      const opts = [...form.opts];
      opts[i] = e.target.value;
      setForm({
        ...form,
        opts
      });
    },
    placeholder: `選択肢${i + 1}`,
    style: inp
  }))), /*#__PURE__*/React.createElement("textarea", {
    value: form.explain,
    onChange: e => setForm({
      ...form,
      explain: e.target.value
    }),
    placeholder: "\u89E3\u8AAC",
    rows: 2,
    style: {
      ...inp,
      resize: "none"
    }
  }), /*#__PURE__*/React.createElement("input", {
    value: form.refs,
    onChange: e => setForm({
      ...form,
      refs: e.target.value
    }),
    placeholder: "\u53C2\u7167\u6761\u6587(\u6CD52\u6761\u4E5D\u53F7 \u7B49)",
    style: inp
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: form.qPage || "",
    onChange: e => setForm({
      ...form,
      qPage: e.target.value
    }),
    placeholder: "\u554F\u984C\u96C6 p.\u25CB\u25CB",
    style: inp
  }), /*#__PURE__*/React.createElement("input", {
    value: form.tbPage || "",
    onChange: e => setForm({
      ...form,
      tbPage: e.target.value
    }),
    placeholder: "\u6559\u79D1\u66F8 p.\u25CB\u25CB",
    style: inp
  })), /*#__PURE__*/React.createElement("textarea", {
    value: form.textbook || "",
    onChange: e => setForm({
      ...form,
      textbook: e.target.value
    }),
    placeholder: "\u6559\u79D1\u66F8\u306E\u8A72\u5F53\u30C6\u30AD\u30B9\u30C8(\u5199\u771F\u3092\u30C1\u30E3\u30C3\u30C8\u306B\u9001\u308B\u3068\u81EA\u52D5\u5165\u529B\u3055\u308C\u307E\u3059)",
    rows: 3,
    style: {
      ...inp,
      resize: "none"
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: addManual,
    style: {
      width: "100%",
      padding: "13px",
      borderRadius: 14,
      background: "#fff",
      color: "#000",
      fontSize: 14,
      fontWeight: 600,
      border: "none",
      cursor: "pointer"
    }
  }, "\u8FFD\u52A0"), msg && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#34D399"
    }
  }, msg))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, null, "\u767B\u9332\u6E08\u307F \xB7 ", questions.length, "\u554F"), questions.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: "rgba(255,255,255,0.2)",
      fontSize: 13,
      padding: "16px 0"
    }
  }, "\u307E\u3060\u3042\u308A\u307E\u305B\u3093") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      maxHeight: 320,
      overflowY: "auto"
    }
  }, questions.map(q => {
    const s = SUBJECTS.find(sx => sx.id === q.subject);
    return /*#__PURE__*/React.createElement("div", {
      key: q.id,
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "10px 12px",
        background: "rgba(255,255,255,0.03)",
        borderRadius: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 6,
        height: 6,
        borderRadius: 99,
        background: s?.color || "#fff",
        flexShrink: 0,
        marginTop: 5
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6,
        alignItems: "center",
        marginBottom: 3,
        flexWrap: "wrap"
      }
    }, q.rank && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        padding: "1px 5px",
        borderRadius: 3,
        fontWeight: 700,
        background: RANK_COLOR[q.rank] || "#888",
        color: "#000"
      }
    }, q.rank), q.year && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: "rgba(255,255,255,0.3)"
      }
    }, q.year, q.no ? `-${String(q.no).padStart(2, "0")}` : ""), q.qPage && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        color: "rgba(255,255,255,0.2)"
      }
    }, "p.", q.qPage), q.tbPage && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        color: "rgba(181,123,255,0.4)"
      }
    }, "\u6559p.", q.tbPage)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: "rgba(255,255,255,0.7)",
        lineHeight: 1.5,
        overflow: "hidden",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical"
      }
    }, q.q)), /*#__PURE__*/React.createElement("button", {
      onClick: () => setQuestions(questions.filter(qq => qq.id !== q.id)),
      style: {
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "rgba(255,255,255,0.2)",
        fontSize: 18,
        lineHeight: 1,
        flexShrink: 0,
        padding: 4
      }
    }, "\xD7"));
  }))));
}

// ── NOTES TAB ──────────────────────────────────────────────
function NotesTab() {
  const _useState105 = useState({}),
    _useState106 = _slicedToArray(_useState105, 2),
    hints = _useState106[0],
    setHints = _useState106[1];
  const _useState107 = useState("houki"),
    _useState108 = _slicedToArray(_useState107, 2),
    selectedSubject = _useState108[0],
    setSelectedSubject = _useState108[1];
  const _useState109 = useState(null),
    _useState110 = _slicedToArray(_useState109, 2),
    editingId = _useState110[0],
    setEditingId = _useState110[1];
  const _useState111 = useState(""),
    _useState112 = _slicedToArray(_useState111, 2),
    draft = _useState112[0],
    setDraft = _useState112[1];
  const _useState113 = useState(true),
    _useState114 = _slicedToArray(_useState113, 2),
    loading = _useState114[0],
    setLoading = _useState114[1];
  useEffect(() => {
    load("hints", {}).then(h => {
      setHints(h);
      setLoading(false);
    });
  }, []);
  useEffect(() => {
    if (!loading) save("hints", hints);
  }, [hints, loading]);
  const chapters = CHAPTERS[selectedSubject] || [];
  const inp = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: "10px 14px",
    color: "#fff",
    fontSize: 13,
    outline: "none",
    width: "100%",
    boxSizing: "border-box"
  };
  if (loading) return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: "rgba(255,255,255,0.3)",
      padding: 40,
      fontSize: 13
    }
  }, "\u8AAD\u307F\u8FBC\u307F\u4E2D...");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, null, "\u5B66\u7FD2\u30CE\u30FC\u30C8"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      overflowX: "auto",
      paddingBottom: 8,
      scrollbarWidth: "none"
    }
  }, SUBJECTS.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    onClick: () => setSelectedSubject(s.id),
    style: {
      padding: "6px 14px",
      borderRadius: 99,
      border: "none",
      cursor: "pointer",
      whiteSpace: "nowrap",
      flexShrink: 0,
      fontSize: 12,
      background: selectedSubject === s.id ? s.color : "rgba(255,255,255,0.07)",
      color: selectedSubject === s.id ? "#000" : "rgba(255,255,255,0.6)"
    }
  }, s.name)))), chapters.length === 0 ? /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: "rgba(255,255,255,0.2)",
      fontSize: 13,
      padding: "24px 0"
    }
  }, "\u3053\u306E\u79D1\u76EE\u306F\u6E96\u5099\u4E2D\u3067\u3059")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, chapters.map(ch => {
    const memo = hints[ch.id] || "";
    const isEditing = editingId === ch.id;
    return /*#__PURE__*/React.createElement("div", {
      key: ch.id,
      style: {
        background: "rgba(255,255,255,0.04)",
        borderRadius: 14,
        padding: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: memo || isEditing ? 12 : 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 500
      }
    }, ch.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: "rgba(255,255,255,0.25)",
        background: "rgba(255,255,255,0.06)",
        padding: "1px 7px",
        borderRadius: 4
      }
    }, "p.", ch.page, "\u301C")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: "rgba(255,255,255,0.3)",
        marginTop: 3
      }
    }, ch.topics.join(" · "))), !isEditing && /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setEditingId(ch.id);
        setDraft(memo);
      },
      style: {
        background: "rgba(255,255,255,0.07)",
        border: "none",
        cursor: "pointer",
        fontSize: 11,
        color: "rgba(255,255,255,0.5)",
        padding: "4px 10px",
        borderRadius: 6,
        flexShrink: 0
      }
    }, memo ? "編集" : "+ 追加")), ch.textbook && !isEditing && /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 10,
        padding: "10px 12px",
        background: "rgba(181,123,255,0.08)",
        borderRadius: 8,
        borderLeft: "2px solid rgba(181,123,255,0.35)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: "rgba(181,123,255,0.8)",
        marginBottom: 6,
        letterSpacing: "0.1em"
      }
    }, "\uD83D\uDCDA \u6559\u79D1\u66F8\u3088\u308A"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: "rgba(255,255,255,0.75)",
        lineHeight: 1.85,
        whiteSpace: "pre-wrap"
      }
    }, ch.textbook)), isEditing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("textarea", {
      value: draft,
      onChange: e => setDraft(e.target.value),
      placeholder: "\u91CD\u8981\u30DD\u30A4\u30F3\u30C8\u30FB\u30D2\u30F3\u30C8\u30FB\u899A\u3048\u65B9\u30FB\u5B66\u7FD2\u306E\u30D2\u30F3\u30C8\u306A\u3069",
      rows: 4,
      style: {
        ...inp,
        resize: "none"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        marginTop: 8
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setHints({
          ...hints,
          [ch.id]: draft
        });
        setEditingId(null);
      },
      style: {
        flex: 1,
        padding: "10px",
        borderRadius: 10,
        background: "#fff",
        color: "#000",
        fontSize: 13,
        fontWeight: 600,
        border: "none",
        cursor: "pointer"
      }
    }, "\u4FDD\u5B58"), /*#__PURE__*/React.createElement("button", {
      onClick: () => setEditingId(null),
      style: {
        padding: "10px 16px",
        borderRadius: 10,
        background: "rgba(255,255,255,0.07)",
        color: "rgba(255,255,255,0.5)",
        fontSize: 13,
        border: "none",
        cursor: "pointer"
      }
    }, "\u30AD\u30E3\u30F3\u30BB\u30EB"))) : memo ? /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: "rgba(255,255,255,0.75)",
        lineHeight: 1.8,
        whiteSpace: "pre-wrap"
      }
    }, memo) : null);
  })));
}
window.App = App;
window.App=App;