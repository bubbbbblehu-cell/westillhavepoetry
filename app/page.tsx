"use client";

import { useEffect, useRef, useState } from "react";

type Poem = { title: string; author: string; text: string[]; directTranslation: string[] };
type Particle = { x: number; y: number; vx: number; vy: number; size: number; turn: number; spin: number; tint: string; poem: number; readyAt: number; };
type BackgroundPiece = { text: string; left: string; top: string; style?: "large" | "small" | "vertical" | "muted" | "wide" | "echo"; rotate?: number };
type SoundEngine = { context: AudioContext; master: GainNode; drones: OscillatorNode[]; timer: number };

const poems: Poem[] = [
  { title: "Romance sonámbulo", author: "Federico García Lorca", text: ["Verde que te quiero verde.", "Verde viento. Verdes ramas.", "El barco sobre la mar", "y el caballo en la montaña."], directTranslation: ["绿色，我多么爱你绿色。", "绿色的风。绿色的树枝。", "船在海上", "马在山上。"] },
  { title: "Proverbios y cantares", author: "Antonio Machado", text: ["Caminante, son tus huellas", "el camino y nada más;", "caminante, no hay camino,", "se hace camino al andar."], directTranslation: ["行路人，是你的脚印", "是道路，仅此而已；", "行路人，没有道路，", "路是在行走中形成的。"] },
  { title: "Rima XXI", author: "Gustavo Adolfo Bécquer", text: ["¿Qué es poesía?, dices mientras clavas", "en mi pupila tu pupila azul.", "¡Qué es poesía! ¿Y tú me lo preguntas?", "Poesía... eres tú."], directTranslation: ["什么是诗？当你把", "你蓝色的瞳孔钉在我的瞳孔上时，你说。", "什么是诗！你还问我？", "诗……就是你。"] },
  { title: "Canción de jinete", author: "Federico García Lorca", text: ["Córdoba. Lejana y sola.", "Jaca negra, luna grande,", "y aceitunas en mi alforja.", "Aunque sepa los caminos"], directTranslation: ["科尔多瓦。遥远而孤单。", "黑马，大月亮，", "我的鞍囊里有橄榄。", "即使我知道那些路。"] },
  { title: "The Tyger", author: "William Blake", text: ["Tyger Tyger, burning bright,", "In the forests of the night;", "What immortal hand or eye,", "Could frame thy fearful symmetry?"], directTranslation: ["老虎，老虎，燃烧得明亮，", "在夜晚的森林里；", "怎样不朽的手或眼，", "能塑造你可怕的匀称？"] },
  { title: "Ah! Sun-flower", author: "William Blake", text: ["Ah Sun-flower! weary of time,", "Who countest the steps of the sun;", "Seeking after that sweet golden clime", "Where the traveller's journey is done;"], directTranslation: ["啊，向日葵！厌倦了时间，", "你数着太阳的脚步；", "寻找那甜美的金色国度，", "旅人的旅程在那里结束；"] },
  { title: "The Sick Rose", author: "William Blake", text: ["O Rose thou art sick.", "The invisible worm,", "That flies in the night", "In the howling storm:"], directTranslation: ["噢，玫瑰，你病了。", "那看不见的虫，", "在嚎叫的暴风里", "于夜间飞行："] },
  { title: "Ozymandias", author: "Percy Bysshe Shelley", text: ["I met a traveller from an antique land,", "Who said—\"Two vast and trunkless legs of stone", "Stand in the desert. . . . Near them, on the sand,", "Half sunk a shattered visage lies. . . .\""], directTranslation: ["我遇见一位来自古老国度的旅人，", "他说：两条巨大的、没有躯干的石腿", "站在沙漠中……在它们旁边的沙地上，", "半埋着一张破碎的面容……"] },
  { title: "Bright star", author: "John Keats", text: ["Bright star, would I were stedfast as thou art—", "Not in lone splendour hung aloft the night", "And watching, with eternal lids apart,", "Like nature's patient, sleepless Eremite,"], directTranslation: ["明亮的星啊，我愿像你一样坚定——", "不是在孤独的光辉中高悬夜空，", "睁着永恒分开的眼睑观看，", "像自然耐心而不眠的隐士，"] },
  { title: "To Autumn", author: "John Keats", text: ["Season of mists and mellow fruitfulness,", "Close bosom-friend of the maturing sun;", "Conspiring with him how to load and bless", "With fruit the vines that round the thatch-eves run;"], directTranslation: ["雾与成熟果实的季节，", "与正在成熟的太阳亲密相伴；", "同它谋划着怎样让缠绕茅檐的藤蔓", "结满并受福的果实；"] },
  { title: "I Wandered Lonely as a Cloud", author: "William Wordsworth", text: ["I wandered lonely as a cloud", "That floats on high o'er vales and hills,", "When all at once I saw a crowd,", "A host, of golden daffodils;"], directTranslation: ["我孤独地漫游，像一朵云，", "高高飘过山谷和山丘，", "忽然间我看见一群，", "一大片金色的水仙花；"] },
  { title: "She Walks in Beauty", author: "Lord Byron", text: ["She walks in beauty, like the night", "Of cloudless climes and starry skies;", "And all that's best of dark and bright", "Meet in her aspect and her eyes;"], directTranslation: ["她行走在美中，像夜晚，", "像无云的气候和繁星的天空；", "黑暗与明亮中最好的部分", "相遇在她的容貌和眼睛里；"] },
  { title: "Remember", author: "Christina Rossetti", text: ["Remember me when I am gone away,", "Gone far away into the silent land;", "When you can no more hold me by the hand,", "Nor I half turn to go yet turning stay."], directTranslation: ["当我离去时，请记得我，", "远远离去，进入沉默的土地；", "当你再也不能牵住我的手，", "我也不能半转身离开又留下。"] },
  { title: "The Lake Isle of Innisfree", author: "W. B. Yeats", text: ["I will arise and go now, and go to Innisfree,", "And a small cabin build there, of clay and wattles made;", "Nine bean-rows will I have there, a hive for the honey-bee,", "And live alone in the bee-loud glade."], directTranslation: ["我现在就要起身，去往因尼斯弗里，", "在那里用黏土和枝条盖一间小屋；", "我要有九行豆子，一只蜜蜂的蜂箱，", "独自住在蜜蜂喧响的林间空地。"] },
  { title: "He Wishes for the Cloths of Heaven", author: "W. B. Yeats", text: ["Had I the heavens' embroidered cloths,", "Enwrought with golden and silver light,", "The blue and the dim and the dark cloths", "Of night and light and the half-light,"], directTranslation: ["若我拥有天堂刺绣的布匹，", "织着金色与银色的光，", "蓝的、昏暗的、深黑的布匹，", "属于夜、光和半明半暗，"] },
  { title: "Le Pont Mirabeau", author: "Guillaume Apollinaire", text: ["Sous le pont Mirabeau coule la Seine", "Et nos amours", "Faut-il qu'il m'en souvienne", "La joie venait toujours après la peine"], directTranslation: ["米拉波桥下流着塞纳河，", "也流着我们的爱情，", "我是否必须记起它，", "快乐总是在痛苦之后到来。"] },
  { title: "Sensation", author: "Arthur Rimbaud", text: ["Par les soirs bleus d'été, j'irai dans les sentiers,", "Picoté par les blés, fouler l'herbe menue:", "Rêveur, j'en sentirai la fraîcheur à mes pieds.", "Je laisserai le vent baigner ma tête nue."], directTranslation: ["在夏日蓝色的傍晚，我将走进小径，", "被麦穗刺痒，踩过细草：", "像做梦一样，我会感到脚下的清凉。", "我会让风沐浴我裸露的头。"] },
  { title: "Le ciel est, par-dessus le toit", author: "Paul Verlaine", text: ["Le ciel est, par-dessus le toit,", "Si bleu, si calme!", "Un arbre, par-dessus le toit,", "Berce sa palme."], directTranslation: ["屋顶之上，天空", "如此蓝，如此安静！", "屋顶之上，一棵树", "摇动它的叶掌。"] },
  { title: "Correspondances", author: "Charles Baudelaire", text: ["La Nature est un temple où de vivants piliers", "Laissent parfois sortir de confuses paroles;", "L'homme y passe à travers des forêts de symboles", "Qui l'observent avec des regards familiers."], directTranslation: ["自然是一座神殿，活着的柱子在那里", "有时放出含混的话语；", "人穿过象征的森林，", "它们以熟悉的目光注视着他。"] },
  { title: "Wanderers Nachtlied", author: "Johann Wolfgang von Goethe", text: ["Über allen Gipfeln", "Ist Ruh,", "In allen Wipfeln", "Spürest du"], directTranslation: ["所有山峰之上，", "是安静，", "所有树梢之中，", "你感觉到"] },
  { title: "Herbsttag", author: "Rainer Maria Rilke", text: ["Herr: es ist Zeit. Der Sommer war sehr groß.", "Leg deinen Schatten auf die Sonnenuhren,", "und auf den Fluren lass die Winde los.", "Befiehl den letzten Früchten voll zu sein;"], directTranslation: ["主啊：时候到了。夏天曾经非常巨大。", "把你的影子放在日晷上，", "让原野上的风自由离开。", "命令最后的果实变得饱满；"] },
  { title: "Autopsicografia", author: "Fernando Pessoa", text: ["O poeta é um fingidor.", "Finge tão completamente", "Que chega a fingir que é dor", "A dor que deveras sente."], directTranslation: ["诗人是一个伪装者。", "他伪装得如此彻底，", "以至于把真正感觉到的痛", "也伪装成一种痛。"] },
  { title: "Я вас любил", author: "Alexander Pushkin", text: ["Я вас любил: любовь еще, быть может,", "В душе моей угасла не совсем;", "Но пусть она вас больше не тревожит;", "Я не хочу печалить вас ничем."], directTranslation: ["我曾爱过你：也许爱情", "在我的灵魂中还没有完全熄灭；", "但愿它不再使你烦扰；", "我不愿以任何事使你悲伤。"] },
  { title: "Hope is the thing with feathers", author: "Emily Dickinson", text: ["\"Hope\" is the thing with feathers—", "That perches in the soul—", "And sings the tune without the words—", "And never stops—at all—"], directTranslation: ["希望是那长着羽毛的东西——", "栖息在灵魂里——", "不带歌词地唱着曲调——", "从不停止——完全不——"] },
];

const paperTints = ["#f1eee5", "#e6e1d5", "#f8f5ed", "#d9d4c8", "#eeebe2", "#e2ded4"];
const backgroundLayouts: BackgroundPiece[][] = [
  [
    { text: "窗没有关紧", left: "46%", top: "13%", style: "large" },
    { text: "城市从缝隙里", left: "48%", top: "21%" },
    { text: "吹进来", left: "51%", top: "29%", style: "large" },
    { text: "下午四点", left: "41%", top: "40%", style: "wide" },
    { text: "玻璃记住了", left: "43%", top: "47%" },
    { text: "一阵不肯走的雨", left: "46%", top: "54%", style: "wide" },
    { text: "滴答", left: "32%", top: "63%", style: "echo", rotate: -18 },
    { text: "滴答", left: "55%", top: "66%", style: "echo", rotate: 14 },
    { text: "轻轻", left: "21%", top: "73%", style: "small", rotate: -31 },
    { text: "又一滴", left: "67%", top: "76%", style: "small", rotate: 24 },
    { text: "雨", left: "48%", top: "82%", style: "vertical" },
  ],
  [
    { text: "不要着急", left: "42%", top: "52%", style: "large" },
    { text: "一只慢慢的云", left: "45%", top: "60%" },
    { text: "正在穿过你的下午", left: "42%", top: "68%", style: "wide" },
    { text: "云", left: "24%", top: "25%", style: "echo" },
    { text: "很", left: "31%", top: "30%", style: "small" },
    { text: "慢", left: "37%", top: "35%", style: "echo" },
    { text: "慢", left: "56%", top: "35%", style: "echo" },
    { text: "地", left: "63%", top: "30%", style: "small" },
    { text: "过", left: "70%", top: "25%", style: "echo" },
    { text: "去", left: "76%", top: "19%", style: "small" },
    { text: "没有事情必须马上发生", left: "20%", top: "79%", style: "muted" },
  ],
  [
    { text: "我想睡一会", left: "44%", top: "13%", style: "large" },
    { text: "我想睡很久", left: "44%", top: "22%", style: "large" },
    { text: "我真的很想", left: "45%", top: "31%" },
    { text: "把闹钟", left: "47%", top: "39%", style: "vertical" },
    { text: "交给窗外", left: "47%", top: "49%", style: "vertical" },
    { text: "让它替我", left: "44%", top: "61%", style: "large" },
    { text: "和世界周旋", left: "44%", top: "70%", style: "large" },
    { text: "嘘", left: "32%", top: "35%", style: "echo", rotate: -28 },
    { text: "嘘", left: "60%", top: "44%", style: "echo", rotate: 23 },
    { text: "再安静一点", left: "39%", top: "82%", style: "muted" },
  ],
  [
    { text: "一只没有名字的狗", left: "14%", top: "17%", style: "wide", rotate: 25 },
    { text: "从草地的空白处", left: "27%", top: "25%", style: "small", rotate: 25 },
    { text: "跑向一阵闪电", left: "40%", top: "34%", style: "small", rotate: 25 },
    { text: "野", left: "38%", top: "78%", style: "large" },
    { text: "狗", left: "46%", top: "78%", style: "large" },
    { text: "一动不动", left: "51%", top: "78%", style: "large" },
    { text: "站在空白的草地上", left: "62%", top: "78%", style: "large" },
    { text: "风把尾巴吹成一根逗号", left: "45%", top: "61%", style: "muted" },
    { text: "，", left: "58%", top: "47%", style: "large" },
  ],
];

function createParticle(width: number, height: number, index: number, startAnywhere = true, readyAt = 0): Particle {
  const size = 3.4 + ((index * 23) % 58) / 10;
  return {
    x: ((index * 97) % Math.max(width, 1)) + Math.random() * 50,
    y: startAnywhere ? ((index * 61) % Math.max(height, 1)) : -20 - Math.random() * height * 0.25,
    vx: -0.22 + Math.random() * 0.44,
    vy: 0.18 + Math.random() * 0.65,
    size,
    turn: Math.random() * Math.PI * 2,
    spin: -0.028 + Math.random() * 0.056,
    tint: paperTints[index % paperTints.length],
    poem: index % poems.length,
    readyAt,
  };
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const pointerRef = useRef({ x: -1000, y: -1000, down: false });
  const soundEngineRef = useRef<SoundEngine | null>(null);
  const [poem, setPoem] = useState<Poem | null>(null);
  const [soundOn, setSoundOn] = useState(false);

  const playChime = (engine: SoundEngine, volume = .055) => {
    const { context, master } = engine;
    const now = context.currentTime;
    const note = [220, 261.63, 329.63, 392][Math.floor(Math.random() * 4)];
    [1, 2.01, 3.02].forEach((ratio, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = index === 0 ? "sine" : "triangle";
      oscillator.frequency.setValueAtTime(note * ratio, now);
      gain.gain.setValueAtTime(.0001, now);
      gain.gain.exponentialRampToValueAtTime(volume / (index + 1), now + .04);
      gain.gain.exponentialRampToValueAtTime(.0001, now + 1.7 + index * .24);
      oscillator.connect(gain).connect(master);
      oscillator.start(now);
      oscillator.stop(now + 2.1);
    });
  };

  const stopSound = () => {
    const engine = soundEngineRef.current;
    if (!engine) return;
    window.clearInterval(engine.timer);
    engine.drones.forEach((drone) => drone.stop());
    engine.master.gain.setTargetAtTime(.0001, engine.context.currentTime, .08);
    window.setTimeout(() => engine.context.close(), 280);
    soundEngineRef.current = null;
  };

  const startSound = async () => {
    if (soundEngineRef.current) return;
    const context = new AudioContext();
    await context.resume();
    const master = context.createGain();
    master.gain.setValueAtTime(.42, context.currentTime);
    master.connect(context.destination);
    const drones = [73.42, 110].map((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = index === 0 ? "sine" : "triangle";
      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      gain.gain.setValueAtTime(index === 0 ? .025 : .012, context.currentTime);
      oscillator.connect(gain).connect(master);
      oscillator.start();
      return oscillator;
    });
    const engine: SoundEngine = { context, master, drones, timer: 0 };
    engine.timer = window.setInterval(() => playChime(engine, .018), 6400);
    soundEngineRef.current = engine;
    playChime(engine, .028);
  };

  useEffect(() => () => stopSound(), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let animation = 0;
    let width = 0;
    let height = 0;
    let last = performance.now();
    let flightStartedAt = performance.now();

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      flightStartedAt = performance.now();
      particlesRef.current = Array.from({ length: width < 700 ? 140 : 320 }, (_, index) => {
        const particle = createParticle(width, height, index, false, flightStartedAt + index * 34);
        particle.x = width * .9 - Math.random() * 90;
        particle.y = height * .14 + 20 + Math.random() * 40;
        particle.vx += -.24 + Math.random() * .12;
        return particle;
      });
    };

    const drawParticle = (particle: Particle, heldInView = false) => {
      context.save();
      context.translate(particle.x, particle.y);
      context.rotate(particle.turn);
      context.globalAlpha = heldInView ? .98 : Math.min(.95, .36 + particle.size / 15);
      context.fillStyle = particle.tint;
      context.strokeStyle = heldInView ? "rgba(25, 24, 21, .72)" : "rgba(25, 24, 21, .42)";
      context.lineWidth = heldInView ? .8 : particle.size > 4 ? .55 : .35;
      context.beginPath();
      context.moveTo(-particle.size * .75, -particle.size * .42);
      context.lineTo(particle.size * .72, -particle.size * .5);
      context.lineTo(particle.size * .58, particle.size * .5);
      context.lineTo(-particle.size * .66, particle.size * .43);
      context.closePath();
      context.fill();
      context.stroke();
      if (particle.size > 4.5) {
        context.globalAlpha *= .55;
        context.beginPath();
        context.moveTo(-particle.size * .45, 0);
        context.lineTo(particle.size * .4, 0);
        context.stroke();
      }
      context.restore();
    };

    const planePosition = (time: number) => {
      const loop = ((time - flightStartedAt) % 12000) / 12000;
      const movingLeft = loop < .5;
      const leg = movingLeft ? loop / .5 : (loop - .5) / .5;
      return {
        x: width * (movingLeft ? .9 - leg * .8 : .1 + leg * .8),
        y: height * (.14 + Math.sin(time / 1500) * .014),
      };
    };

    const animate = (time: number) => {
      const delta = Math.min(2.2, (time - last) / 16.67);
      last = time;
      context.clearRect(0, 0, width, height);
      const pointer = pointerRef.current;
      const particles = particlesRef.current;

      for (const particle of particles) {
        if (time < particle.readyAt) continue;
        const wind = Math.sin(time / 1500 + particle.y / 90) * .014;
        let heldInView = false;
        if (pointer.x > -10) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 172 && distance > 1) {
            const force = (1 - distance / 172) * (pointer.down ? -.11 : -.024);
            particle.vx += (dx / distance) * force * delta;
            particle.vy += (dy / distance) * force * delta;
            if (!pointer.down && distance < 104) {
              particle.vx *= .962;
              particle.vy *= .962;
              heldInView = true;
            }
          }
        }
        particle.vx = (particle.vx + wind * delta) * .992;
        particle.vy = (particle.vy + .009 * delta) * .994;
        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;
        particle.turn += particle.spin * delta;
        if (particle.y > height + 26 || particle.x < -30 || particle.x > width + 30) {
          const reset = createParticle(width, height, Math.floor(Math.random() * 1000), false);
          const plane = planePosition(time);
          reset.x = plane.x - 35 + Math.random() * 70;
          reset.y = plane.y + 22 + Math.random() * 22;
          reset.vx += -0.2 + Math.random() * .4;
          Object.assign(particle, reset);
        }
        drawParticle(particle, heldInView);
      }
      animation = requestAnimationFrame(animate);
    };

    resize();
    animation = requestAnimationFrame(animate);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const updatePointer = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerRef.current.x = event.clientX - rect.left;
    pointerRef.current.y = event.clientY - rect.top;
  };

  const catchACluster = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    let closest = particlesRef.current[0];
    let distance = Infinity;
    for (const particle of particlesRef.current) {
      const nextDistance = Math.hypot(particle.x - x, particle.y - y);
      if (nextDistance < distance) {
        closest = particle;
        distance = nextDistance;
      }
    }
    if (closest && distance < Math.max(29, closest.size * 3.4)) {
      if (soundEngineRef.current) playChime(soundEngineRef.current, .09);
      setPoem(poems[closest.poem]);
    }
  };

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setPoem(null);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  return (
    <main className={poem ? "particle-rain is-reading" : "particle-rain"}>
      <div className="book-page" aria-hidden="true">
        <div className="cathedral-ascii">
          <img src="/cathedral-ascii.png" alt="" />
          <p>basílica de la sagrada família</p>
        </div>
      </div>
      <img className="helicopter-ascii" src="/ascii-helicopter-rebuilt.gif" alt="" aria-hidden="true" />
      <p className="particle-title">WE STILL HAVE POETRY</p>
      <p className="particle-hint">a helicopter scatters poems</p>
      <button className="sound-toggle" aria-pressed={soundOn} onClick={async () => {
        if (soundOn) {
          stopSound();
          setSoundOn(false);
        } else {
          await startSound();
          setSoundOn(true);
        }
      }}>{soundOn ? "sound on" : "sound off"}</button>
      <canvas
        ref={canvasRef}
        className="particle-field"
        aria-label="a field of moving paper particles"
        onPointerMove={updatePointer}
        onPointerDown={(event) => { updatePointer(event); event.currentTarget.setPointerCapture(event.pointerId); pointerRef.current.down = true; }}
        onPointerUp={(event) => { updatePointer(event); pointerRef.current.down = false; }}
        onPointerCancel={() => { pointerRef.current.x = -1000; pointerRef.current.y = -1000; pointerRef.current.down = false; }}
        onPointerLeave={() => { pointerRef.current.x = -1000; pointerRef.current.y = -1000; pointerRef.current.down = false; }}
        onClick={catchACluster}
      />
      <p className="particle-note"><span className="desktop-guide">hover to slow · hold to gather · catch a page</span><span className="mobile-guide">touch a paper · hold to gather</span></p>

      {poem && (
        <div className="poem-overlay" onPointerDown={() => setPoem(null)} role="presentation">
          <article className="poem-sheet" onPointerDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={poem.title}>
            <button className="close" onClick={() => setPoem(null)} aria-label="close">×</button>
            <p className="author">{poem.author}</p>
            <h1>{poem.title}</h1>
            <div className="bilingual-verse">
              <section className="verse-column" aria-label="Spanish original">
                <p className="translation-label">original</p>
                <div className="verse">{poem.text.map((line) => <p key={line}>{line}</p>)}</div>
              </section>
              <section className="verse-column" aria-label="Chinese direct translation">
                <p className="translation-label">中文直译</p>
                <div className="verse is-translation">{poem.directTranslation.map((line) => <p key={line}>{line}</p>)}</div>
              </section>
            </div>
            <button className="release" onClick={() => setPoem(null)}>let it go</button>
          </article>
        </div>
      )}
    </main>
  );
}
