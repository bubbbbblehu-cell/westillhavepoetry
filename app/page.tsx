"use client";

import { useState } from "react";

type Poem = { id: number; title: string; author: string; lines: string[]; code: string };

const poems: Poem[] = [
  { id: 1, code: "SHA / 01", title: "在风里", author: "匿名来信", lines: ["风把每一张纸折成翅膀", "而你刚好伸出手", "接住一小段", "正在抵达你的远方"] },
  { id: 2, code: "LIS / 02", title: "把雨收好", author: "诗云档案", lines: ["下雨的时候", "请不要急着撑伞", "有些话只在潮湿的空气里", "才愿意落到你肩上"] },
  { id: 3, code: "MAD / 03", title: "一封未寄出的信", author: "南方写作者", lines: ["我没有说想念", "只是把窗留了一条缝", "让夜色进来", "替我坐一会儿"] },
  { id: 4, code: "VLC / 04", title: "凌晨四点", author: "诗云档案", lines: ["城市暂时不说话", "月亮把银色的东西", "轻轻放在屋顶", "像一句还没说完的原谅"] },
];

const paperPositions = [
  { x: "20%", y: "9%", r: "-13deg" }, { x: "72%", y: "13%", r: "8deg" },
  { x: "34%", y: "66%", r: "-6deg" }, { x: "82%", y: "61%", r: "13deg" },
  { x: "57%", y: "76%", r: "-11deg" }, { x: "64%", y: "35%", r: "4deg" },
];

export default function Home() {
  const [current, setCurrent] = useState<Poem | null>(null);
  const [saved, setSaved] = useState<Poem[]>([]);
  const [round, setRound] = useState(0);

  const catchPoem = (index: number) => setCurrent(poems[(index + round) % poems.length]);
  const savedCurrent = Boolean(current && saved.some((item) => item.id === current.id));
  const saveCurrent = () => {
    if (current && !savedCurrent) setSaved((items) => [...items, current]);
  };

  return (
    <main className="poem-radar">
      <header className="topbar">
        <button className="wordmark" onClick={() => setRound((value) => value + 1)}>
          <span className="signal-icon">☷</span>
          <span><small>POETRY RAIN · 024</small>诗雨接收站</span>
        </button>
        <nav aria-label="主导航">
          <button>今日风向</button>
          <button>诗云档案 <b>24</b></button>
          <button>我的诗笺 <b>{saved.length.toString().padStart(2, "0")}</b></button>
        </nav>
        <button className="sound">◖ SOUND OFF</button>
      </header>

      <section className="story-panel">
        <p className="section-code">01 / POETRY WEATHER</p>
        <h1>Catch it,<br />before it disappears</h1>
        <p className="subtitle">趁它落地前，接住它。</p>
        <button className="primary-action" onClick={() => catchPoem(round + 1)}>
          <span>●</span> 接住一首 <small>RANDOM POEM</small>
        </button>
        <button className="archive-action" onClick={() => setCurrent(saved[0] ?? poems[0])}>
          <span>我的诗笺档案</span><small>{saved.length.toString().padStart(2, "0")} POEMS ↗</small>
        </button>
        <div className="mini-grid">
          <button onClick={() => catchPoem(0)}><small>SHA</small> 上海 <i>↗</i></button>
          <button onClick={() => catchPoem(1)}><small>LIS</small> 里斯本 <i>↗</i></button>
          <button onClick={() => catchPoem(2)}><small>MAD</small> 马德里 <i>↗</i></button>
          <button onClick={() => catchPoem(3)}><small>VLC</small> 瓦伦西亚 <i>↗</i></button>
        </div>
        <div className="stats"><span><b>024</b>正在飘落</span><span><b>{saved.length.toString().padStart(2, "0")}</b>已接住</span><span><b>∞</b>诗云总量</span></div>
      </section>

      <section className="radar-stage" aria-label="正在飘落的诗歌">
        <div className="radar-label top">WIND FIELD / SHANGHAI / 31°14′N</div>
        <div className="radar-label bottom">POETRY CLOUD · 24 SIGNALS · LIVE</div>
        <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" />
        <div className="wind-lines"><i /><i /><i /><i /><i /></div>
        {paperPositions.map((item, index) => (
          <button className={`falling-paper p${index + 1}`} style={{ left: item.x, top: item.y, "--paper-angle": item.r } as React.CSSProperties} onClick={() => catchPoem(index)} key={index} aria-label="接住飘落的诗">
            <small>{poems[index % poems.length].code}</small><span>{["风", "雨", "夜", "光", "远", "云"][index]}</span><i>—</i>
          </button>
        ))}
        <div className="radar-controls"><button onClick={() => setRound((value) => value + 1)}>Ⅱ</button><span>诗云流动中 / POEMS PASSING</span><button onClick={() => catchPoem(round)}>→</button><i /><button>−</button><b>100%</b><button>＋</button></div>
      </section>

      <footer><span>testType trackpad · Fusion Pixel 12px</span><span>POETRY WEATHER · 24 SIGNALS · MADE FOR UNEXPECTED ENCOUNTERS</span></footer>

      {current && <div className="modal-backdrop" onMouseDown={() => setCurrent(null)} role="presentation">
        <article className="poem-modal" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="poem-title">
          <header><span>{current.code} / POEM RECEIVED</span><button onClick={() => setCurrent(null)} aria-label="关闭">×</button></header>
          <div className="modal-title"><p>你接住了一张纸</p><h2 id="poem-title">{current.title}</h2><small>{current.author}</small></div>
          <div className="modal-lines">{current.lines.map((line) => <p key={line}>{line}</p>)}</div>
          <footer><button className="store" onClick={saveCurrent}>{savedCurrent ? "已收入诗笺" : "收入我的诗笺"}</button><button onClick={() => { setCurrent(null); setRound((value) => value + 1); }}>放回天空 ↗</button></footer>
        </article>
      </div>}
    </main>
  );
}
