// Game Data for "Reverse Exam Roguelike" (期末生存指南：逆向答题)

const GAME_DATA = {
  // 角色列表
  characters: [
    {
      id: "crammer",
      name: "压线战神",
      title: "精准控分大师",
      avatar: "🎯",
      desc: "“60分万岁，多一分浪费！”对及格线有着近乎偏执的掌控力，擅长在及格边缘极限微调。",
      trait: "初始拥有专属【4B巨型橡皮】遗物，控分更容易；初始精力上限 10 点，自带神牌【2B橡皮轻擦】。",
      initialSan: 100,
      initialMoney: 80,
      initialRetake: 2,
      initialMaxEnergy: 10,
      relicId: "eraser_4b",
      startingDeck: [
        "guess_c", "three_long_one_short", "write_solution", "elimination_method",
        "eraser_small", "pencil_sharpen", "cross_out_rewrite", "deep_breath",
        "repeat_modify", "scratch_off_step"
      ]
    },
    {
      id: "koi",
      name: "摆烂锦鲤",
      title: "运气流宗师",
      avatar: "🐟",
      desc: "“只要我心态好，挂科就追不上我。”摸鱼与玄学加持，考场上全靠蒙，但往往能奇迹压线。",
      trait: "摸鱼类卡牌效果提升50%，初始自带【考神锦鲤壁纸】遗物，更有钱，初始精力上限 10 点。",
      initialSan: 110,
      initialMoney: 130,
      initialRetake: 2,
      initialMaxEnergy: 10,
      relicId: "koi_wallpaper",
      startingDeck: [
        "guess_c", "crazy_guess", "graph_estimation", "special_value_test",
        "pray_god", "slack_chat", "spin_pen", "eraser_small",
        "chew_peppermint_gum", "stare_window"
      ]
    },
    {
      id: "night_owl",
      name: "通宵狂魔",
      title: "高压爆发型",
      avatar: "🦉",
      desc: "“生前何必久睡，死后自会长眠！”考前一周不合眼，血液里全是冰美式与红牛。",
      trait: "初始手牌上限+1（每回合开局抽7张），自带【保温杯里泡枸杞】遗物，精力上限额外+1 (11点AP)，重修券+1，但初始精神值略低。",
      initialSan: 85,
      initialMoney: 60,
      initialRetake: 3,
      initialMaxEnergy: 11,
      relicId: "thermos",
      startingDeck: [
        "guess_c", "fake_derivation", "scratch_math", "caffeine_pill",
        "drink_redbull", "eraser_small", "cross_out_rewrite", "pocket_candy",
        "iced_americano", "peer_pressure_immune"
      ]
    }
  ],

  // 卡牌定义（共 64 张策略牌：分值牌20张、逆向牌14张、摸鱼牌15张、策略牌15张）
  cards: {
    // ==========================================
    // 一、分值牌 (Score Cards - 20张)
    // ==========================================
    guess_c: {
      id: "guess_c",
      name: "盲猜选C",
      type: "score",
      typeName: "分值牌",
      cost: 2,
      icon: "🔤",
      score: 3,
      desc: "卷面得分 <span class=\"val-score\">+3</span>。简单朴素的考场信仰。",
      effect: (state) => {
        return { score: 3 };
      }
    },
    three_long_one_short: {
      id: "three_long_one_short",
      name: "三长一短选最短",
      type: "score",
      typeName: "分值牌",
      cost: 3,
      icon: "📏",
      score: 5,
      desc: "卷面得分 <span class=\"val-score\">+5</span>。高中相传的高效玄学蒙题法。",
      effect: (state) => {
        return { score: 5 };
      }
    },
    write_solution: {
      id: "write_solution",
      name: "大题写“解”字",
      type: "score",
      typeName: "分值牌",
      cost: 1,
      icon: "✍️",
      score: 2,
      shield: 4,
      desc: "得分 <span class=\"val-score\">+2</span>，获得 <span class=\"val-shield\">4点护盾</span>。态度端正即可得同情步骤分。",
      effect: (state) => {
        return { score: 2, shield: 4 };
      }
    },
    neat_handwriting: {
      id: "neat_handwriting",
      name: "字迹工整卷面分",
      type: "score",
      typeName: "分值牌",
      cost: 3,
      icon: "📝",
      score: 4,
      shield: 6,
      desc: "得分 <span class=\"val-score\">+4</span>，获得 <span class=\"val-shield\">6点护盾</span>。字迹如印刷体，老师心情大好送分。",
      effect: (state) => {
        return { score: 4, shield: 6 };
      }
    },
    fake_derivation: {
      id: "fake_derivation",
      name: "伪造推导过程",
      type: "score",
      typeName: "分值牌",
      cost: 3,
      icon: "📐",
      score: 6,
      selfDamage: 3,
      desc: "得分 <span class=\"val-score\">+6</span>，受到 <span class=\"val-harm\">3点心虚压力</span>。看似严密，实则全靠瞎编。",
      effect: (state) => {
        return { score: 6, selfDamage: 3 };
      }
    },
    scratch_math: {
      id: "scratch_math",
      name: "草稿纸列满算式",
      type: "score",
      typeName: "分值牌",
      cost: 4,
      icon: "📊",
      score: 7,
      desc: "卷面得分 <span class=\"val-score\">+7</span>。不管对不对，至少气势上拿下了！",
      effect: (state) => {
        return { score: 7 };
      }
    },
    memorize_half_page: {
      id: "memorize_half_page",
      name: "背诵半页公式",
      type: "score",
      typeName: "分值牌",
      cost: 5,
      icon: "🧠",
      score: 9,
      selfDamage: 4,
      desc: "得分 <span class=\"val-score\">+9</span>，受到 <span class=\"val-harm\">4点头痛伤害</span>。临阵磨枪，脑仁发胀。",
      effect: (state) => {
        return { score: 9, selfDamage: 4 };
      }
    },
    cram_big_question: {
      id: "cram_big_question",
      name: "套用万能大题公式",
      type: "score",
      typeName: "分值牌",
      cost: 5,
      icon: "🧬",
      score: 8,
      shield: 6,
      desc: "得分 <span class=\"val-score\">+8</span>，获得 <span class=\"val-shield\">6点护盾</span>。生搬硬套核心定理，得分防守兼备。",
      effect: (state) => {
        return { score: 8, shield: 6 };
      }
    },
    curve_blessing: {
      id: "curve_blessing",
      name: "考前突击真题卷",
      type: "score",
      typeName: "分值牌",
      cost: 3,
      icon: "📑",
      score: 5,
      heal: 5,
      desc: "得分 <span class=\"val-score\">+5</span>，精神恢复 <span class=\"val-heal\">+5</span>。原题重现！狂喜之余压力顿减。",
      effect: (state) => {
        return { score: 5, heal: 5 };
      }
    },
    glance_neighbor: {
      id: "glance_neighbor",
      name: "斜眼瞟邻桌",
      type: "score",
      typeName: "分值牌",
      cost: 3,
      icon: "👀",
      desc: "70%概率得分 <span class=\"val-score\">+8</span>；30%被老师抓包，受到 <span class=\"val-harm\">6点精神创伤</span>。",
      effect: (state) => {
        const hasKoi = state.relics.includes("koi_wallpaper");
        const roll = Math.random();
        if (hasKoi || roll < 0.7) {
          return { score: 8, message: "偷瞄成功！抄上了邻桌的一道大题核心答案！" };
        } else {
          return { selfDamage: 6, message: "被监考老师严厉瞪了一眼，吓出一身冷汗！" };
        }
      }
    },
    crazy_guess: {
      id: "crazy_guess",
      name: "骰子蒙题法",
      type: "score",
      typeName: "分值牌",
      cost: 2,
      icon: "🎲",
      desc: "掷出1个骰子，增加 <span class=\"val-score\">点数 (1~6分)</span>，心态放松。",
      effect: (state) => {
        const hasKoi = state.relics.includes("koi_wallpaper");
        const val = hasKoi ? 6 : Math.floor(Math.random() * 6) + 1;
        return { score: val, message: hasKoi ? `🎏 【考神锦鲤壁纸】显灵！必定投出最高 6 点！增加 6 分！` : `投出 ${val} 点！盲猜增加了 ${val} 分！` };
      }
    },
    overthink: {
      id: "overthink",
      name: "过度解读题意",
      type: "score",
      typeName: "分值牌",
      cost: 4,
      icon: "🤔",
      score: 8,
      selfDamage: 5,
      desc: "得分 <span class=\"val-score\">+8</span>，受到 <span class=\"val-harm\">5点精神折磨</span>。想太多导致做题过头。",
      effect: (state) => {
        return { score: 8, selfDamage: 5 };
      }
    },
    elimination_method: {
      id: "elimination_method",
      name: "排除法二选一",
      type: "score",
      typeName: "分值牌",
      cost: 2,
      icon: "✂️",
      score: 3,
      draw: 1,
      desc: "得分 <span class=\"val-score\">+3</span>，抽 1 张牌。排除掉两个离谱选项，胜率大增！",
      effect: (state) => {
        return { score: 3, draw: 1 };
      }
    },
    special_value_test: {
      id: "special_value_test",
      name: "代入特殊值验证",
      type: "score",
      typeName: "分值牌",
      cost: 3,
      icon: "🧪",
      score: 4,
      desc: "得分 <span class=\"val-score\">+4</span>。令 x=0 或令 n=1，秒杀选择题！",
      effect: (state) => {
        return { score: 4 };
      }
    },
    graph_estimation: {
      id: "graph_estimation",
      name: "尺规作图肉眼量角",
      type: "score",
      typeName: "分值牌",
      cost: 3,
      icon: "📐",
      score: 4,
      shield: 5,
      desc: "得分 <span class=\"val-score\">+4</span>，获得 <span class=\"val-shield\">5点护盾</span>。拿量角器和橡皮测几何题！",
      effect: (state) => {
        return { score: 4, shield: 5 };
      }
    },
    dimensional_analysis: {
      id: "dimensional_analysis",
      name: "量纲分析盲猜单位",
      type: "score",
      typeName: "分值牌",
      cost: 4,
      icon: "🔬",
      score: 6,
      selfDamage: 2,
      desc: "得分 <span class=\"val-score\">+6</span>，受到 2 点心虚压力。根据单位凑出正确公式！",
      effect: (state) => {
        return { score: 6, selfDamage: 2 };
      }
    },
    memorize_outline: {
      id: "memorize_outline",
      name: "突击默写考纲小结",
      type: "score",
      typeName: "分值牌",
      cost: 4,
      icon: "📋",
      score: 5,
      shield: 5,
      desc: "得分 <span class=\"val-score\">+5</span>，获得 <span class=\"val-shield\">5点护盾</span>。考前群里传的背诵框架立功了！",
      effect: (state) => {
        return { score: 5, shield: 5 };
      }
    },
    pseudo_code_trick: {
      id: "pseudo_code_trick",
      name: "伪代码逻辑障眼法",
      type: "score",
      typeName: "分值牌",
      cost: 5,
      icon: "💻",
      score: 7,
      desc: "得分 <span class=\"val-score\">+7</span>。格式规范缩进工整，老师直接给大部分步骤分！",
      effect: (state) => {
        return { score: 7 };
      }
    },
    peer_sympathy: {
      id: "peer_sympathy",
      name: "同病相怜步骤分",
      type: "score",
      typeName: "分值牌",
      cost: 2,
      icon: "🤝",
      score: 2,
      draw: 1,
      desc: "得分 <span class=\"val-score\">+2</span>，抽 1 张牌。写下“同理可证”，态度诚恳。",
      effect: (state) => {
        return { score: 2, draw: 1 };
      }
    },
    citation_bomb: {
      id: "citation_bomb",
      name: "狂列经典参考文献",
      type: "score",
      typeName: "分值牌",
      cost: 6,
      icon: "📚",
      score: 9,
      shield: 8,
      desc: "得分 <span class=\"val-score\">+9</span>，获得 <span class=\"val-shield\">8点护盾</span>。大题末尾堆砌权威期刊名，气场碾压！",
      effect: (state) => {
        return { score: 9, shield: 8 };
      }
    },

    // ==========================================
    // 二、逆向扣分牌 (Reverse Cards - 14张)
    // ==========================================
    eraser_small: {
      id: "eraser_small",
      name: "2B橡皮轻擦",
      type: "reverse",
      typeName: "逆向牌",
      cost: 2,
      icon: "🧹",
      desc: "得分 <span class=\"val-sub\">-2</span>，获得 <span class=\"val-shield\">3点护盾</span>。擦掉涂过火的选项，微调控分！",
      effect: (state) => {
        return { score: -2, shield: 3, message: "橡皮擦生效，精准扣除 2 分！" };
      }
    },
    cross_out_rewrite: {
      id: "cross_out_rewrite",
      name: "划掉涂黑重写",
      type: "reverse",
      typeName: "逆向牌",
      cost: 3,
      icon: "✏️",
      desc: "得分 <span class=\"val-sub\">-5</span>，受到 2 点心痛。大刀阔斧削减卷面多余分数！",
      effect: (state) => {
        return { score: -5, selfDamage: 2, message: "整段划掉，扣除 5 分！" };
      }
    },
    tear_scratch_paper: {
      id: "tear_scratch_paper",
      name: "揉烂草稿纸",
      type: "reverse",
      typeName: "逆向牌",
      cost: 2,
      icon: "🗑️",
      desc: "得分 <span class=\"val-sub\">-3</span>，抽 1 张牌。发泄情绪，重新理清思路。",
      effect: (state) => {
        return { score: -3, draw: 1 };
      }
    },
    smudge_sheet: {
      id: "smudge_sheet",
      name: "手抖弄脏答题卡",
      type: "reverse",
      typeName: "逆向牌",
      cost: 4,
      icon: "☕",
      desc: "得分 <span class=\"val-sub\">-7</span>，受到 4 点伤害，获得 5 点护盾。危急时刻挽救暴增的分数！",
      effect: (state) => {
        return { score: -7, selfDamage: 4, shield: 5, message: "答题卡脏了一片，机器漏读 7 分！" };
      }
    },
    reverse_mastery: {
      id: "reverse_mastery",
      name: "绝妙控分术",
      type: "reverse",
      typeName: "逆向牌",
      cost: 6,
      icon: "🎭",
      exhaust: true,
      desc: "若当前卷面 > 60分，<span class=\"val-gold\">强制将分数重设为刚好60分！</span> 消耗牌。",
      effect: (state) => {
        const cur = state.exam ? state.exam.score : 0;
        if (cur > 60) {
          const diff = cur - 60;
          return { setScore: 60, exhaust: true, message: `绝妙控分发动！削掉超出的 ${diff} 分，稳稳锁定60！` };
        } else {
          return { score: 4, exhaust: true, message: "当前未超分，控分术补充 4 分！" };
        }
      }
    },
    curve_savior: {
      id: "curve_savior",
      name: "求老师期末捞捞",
      type: "reverse",
      typeName: "逆向牌",
      cost: 4,
      icon: "🙏",
      desc: "卷面得分 <span class=\"val-sub\">-5</span>，抽 2 张牌。态度诚恳，老师高抬贵手。",
      effect: (state) => {
        return { score: -5, draw: 2, message: "老师动了恻隐之心，平时分重新微调！" };
      }
    },
    pencil_sharpen: {
      id: "pencil_sharpen",
      name: "削铅笔拖延时间",
      type: "reverse",
      typeName: "逆向牌",
      cost: 2,
      icon: "✏️",
      desc: "得分 <span class=\"val-sub\">-2</span>，获得 <span class=\"val-shield\">4点护盾</span>。慢条斯理削铅笔，稳住心态。",
      effect: (state) => {
        return { score: -2, shield: 4 };
      }
    },
    erase_fraction: {
      id: "erase_fraction",
      name: "擦掉通分分母",
      type: "reverse",
      typeName: "逆向牌",
      cost: 3,
      icon: "🧮",
      desc: "得分 <span class=\"val-sub\">-3</span>，抽 1 张牌。擦掉算错的中间推导，理清主干。",
      effect: (state) => {
        return { score: -3, draw: 1 };
      }
    },
    black_tape_fix: {
      id: "black_tape_fix",
      name: "修正带大面积覆盖",
      type: "reverse",
      typeName: "逆向牌",
      cost: 4,
      icon: "🩹",
      desc: "得分 <span class=\"val-sub\">-5</span>，获得 <span class=\"val-shield\">6点护盾</span>。白白净净覆盖错题！",
      effect: (state) => {
        return { score: -5, shield: 6 };
      }
    },
    cross_step_two: {
      id: "cross_step_two",
      name: "大题步骤二打横线",
      type: "reverse",
      typeName: "逆向牌",
      cost: 3,
      icon: "❌",
      desc: "得分 <span class=\"val-sub\">-4</span>，受到 2 点心疼。果断止损避免算到满分！",
      effect: (state) => {
        return { score: -4, selfDamage: 2 };
      }
    },
    overwritten_ink: {
      id: "overwritten_ink",
      name: "圆珠笔水渍晕染",
      type: "reverse",
      typeName: "逆向牌",
      cost: 4,
      icon: "🖋️",
      desc: "得分 <span class=\"val-sub\">-6</span>，受到 3 点伤害，抽 1 张牌。墨水糊了两行字。",
      effect: (state) => {
        return { score: -6, selfDamage: 3, draw: 1 };
      }
    },
    eraser_crumbs_blow: {
      id: "eraser_crumbs_blow",
      name: "吹走卷面橡皮屑",
      type: "reverse",
      typeName: "逆向牌",
      cost: 1,
      icon: "💨",
      desc: "得分 <span class=\"val-sub\">-1</span>，获得 <span class=\"val-shield\">3点护盾</span>。极限微调1分的控分神技！",
      effect: (state) => {
        return { score: -1, shield: 3 };
      }
    },
    question_abandon: {
      id: "question_abandon",
      name: "压轴题主动留白",
      type: "reverse",
      typeName: "逆向牌",
      cost: 5,
      icon: "🈳",
      desc: "得分 <span class=\"val-sub\">-7</span>，精神恢复 <span class=\"val-heal\">+6</span>。不写就不会得超纲分，心态释然。",
      effect: (state) => {
        return { score: -7, heal: 6 };
      }
    },
    precision_dial: {
      id: "precision_dial",
      name: "纳米级精准控分",
      type: "reverse",
      typeName: "逆向牌",
      cost: 5,
      icon: "🎯",
      exhaust: true,
      desc: "若卷面在 61~66 分之间，直接将卷面精准锁定为 60 分！消耗牌。",
      effect: (state) => {
        const cur = state.exam ? state.exam.score : 0;
        if (cur >= 61 && cur <= 66) {
          return { setScore: 60, exhaust: true, message: "纳米级控分生效！将多余的几分恰到好处抹去，定格60！" };
        }
        return { score: -3, exhaust: true, message: "未处于61~66区间，微调扣除 3 分。" };
      }
    },
    repeat_modify: {
      id: "repeat_modify",
      name: "反复涂改微调",
      type: "reverse",
      typeName: "逆向牌",
      cost: 1,
      icon: "✏️",
      desc: "若卷面分 ≥ 60 则 <span class=\"val-sub\">-1分</span>，若 < 60 则 <span class=\"val-score\">+1分</span>！压线点杀神牌。",
      effect: (state) => {
        const cur = state.exam ? state.exam.score : 0;
        if (cur >= 60) {
          return { score: -1, message: "反复涂改微调：当前≥60分，微扣1分！" };
        } else {
          return { score: 1, message: "反复涂改微调：当前<60分，微补1分！" };
        }
      }
    },
    scratch_off_step: {
      id: "scratch_off_step",
      name: "划去多余演算步骤",
      type: "reverse",
      typeName: "逆向牌",
      cost: 2,
      icon: "✂️",
      desc: "卷面得分 <span class=\"val-sub\">-2</span>，精神 <span class=\"val-heal\">+2</span>。精简步骤，减轻压力。",
      effect: (state) => {
        return { score: -2, heal: 2, message: "划掉冗余草稿，身心轻松！" };
      }
    },

    // ==========================================
    // 三、摸鱼减压牌 (Chill Cards - 15张)
    // ==========================================
    slack_chat: {
      id: "slack_chat",
      name: "水群摸鱼",
      type: "chill",
      typeName: "摸鱼牌",
      cost: 2,
      icon: "💬",
      heal: 7,
      desc: "精神值 <span class=\"val-heal\">+7</span>，得分 -1。大家都在水，那我就放心了。",
      effect: (state) => {
        const mult = state.characterId === "koi" ? 1.5 : 1;
        return { heal: Math.round(7 * mult), score: -1 };
      }
    },
    deep_breath: {
      id: "deep_breath",
      name: "考场深呼吸",
      type: "chill",
      typeName: "摸鱼牌",
      cost: 2,
      icon: "🌬️",
      shield: 7,
      desc: "获得 <span class=\"val-shield\">7点精神护盾</span>。抵挡监考老师眼神与压轴题压迫感。",
      effect: (state) => {
        return { shield: 7 };
      }
    },
    pretend_thinking: {
      id: "pretend_thinking",
      name: "托腮装作思考",
      type: "chill",
      typeName: "摸鱼牌",
      cost: 2,
      icon: "🤔",
      shield: 5,
      draw: 1,
      desc: "获得 <span class=\"val-shield\">5点护盾</span>，抽 1 张牌。眉头紧锁，老师以为你在解难题。",
      effect: (state) => {
        return { shield: 5, draw: 1 };
      }
    },
    sleep_on_desk: {
      id: "sleep_on_desk",
      name: "趴桌小憩五分钟",
      type: "chill",
      typeName: "摸鱼牌",
      cost: 4,
      icon: "😴",
      heal: 12,
      exhaust: true,
      desc: "精神值大幅恢复 <span class=\"val-heal\">+12</span>。养足精神，后程发力！消耗牌。",
      effect: (state) => {
        const mult = state.characterId === "koi" ? 1.5 : 1;
        return { heal: Math.round(12 * mult), exhaust: true };
      }
    },
    fengyoujing: {
      id: "fengyoujing",
      name: "风油精涂太阳穴",
      type: "chill",
      typeName: "摸鱼牌",
      cost: 3,
      icon: "🌿",
      shield: 10,
      desc: "获得 <span class=\"val-shield\">10点护盾</span>。刺鼻清凉，瞬间清醒！",
      effect: (state) => {
        return { shield: 10 };
      }
    },
    eat_chocolate: {
      id: "eat_chocolate",
      name: "偷吃一口士力架",
      type: "chill",
      typeName: "摸鱼牌",
      cost: 3,
      icon: "🍫",
      heal: 8,
      shield: 5,
      desc: "恢复 <span class=\"val-heal\">8点精神</span>，获得 <span class=\"val-shield\">5点护盾</span>。横扫饥饿，做回自己！",
      effect: (state) => {
        const mult = state.characterId === "koi" ? 1.5 : 1;
        return { heal: Math.round(8 * mult), shield: 5 };
      }
    },
    eye_drop: {
      id: "eye_drop",
      name: "滴一滴眼药水",
      type: "chill",
      typeName: "摸鱼牌",
      cost: 1,
      icon: "💧",
      shield: 5,
      draw: 1,
      exhaust: true,
      desc: "获得 <span class=\"val-shield\">5点护盾</span>，抽 1 张牌。清凉明目。消耗牌。",
      effect: (state) => {
        return { shield: 5, draw: 1, exhaust: true };
      }
    },
    watch_clock: {
      id: "watch_clock",
      name: "抬头盯考场石英钟",
      type: "chill",
      typeName: "摸鱼牌",
      cost: 2,
      icon: "⏱️",
      shield: 5,
      draw: 1,
      desc: "获得 <span class=\"val-shield\">5点护盾</span>，抽 1 张牌。看着秒针滴答发呆放空。",
      effect: (state) => {
        return { shield: 5, draw: 1 };
      }
    },
    spin_pen: {
      id: "spin_pen",
      name: "手指转笔花活杂技",
      type: "chill",
      typeName: "摸鱼牌",
      cost: 3,
      icon: "🖊️",
      heal: 5,
      shield: 4,
      desc: "精神恢复 <span class=\"val-heal\">+5</span>，获得 4 点护盾。笔在指尖飞转，心态平复。",
      effect: (state) => {
        return { heal: 5, shield: 4 };
      }
    },
    drink_warm_water: {
      id: "drink_warm_water",
      name: "喝两口保温杯温水",
      type: "chill",
      typeName: "摸鱼牌",
      cost: 2,
      icon: "🍵",
      heal: 6,
      desc: "精神恢复 <span class=\"val-heal\">+6</span>。多喝热水，包治各种考场慌张。",
      effect: (state) => {
        return { heal: 6 };
      }
    },
    stretching_waist: {
      id: "stretching_waist",
      name: "考场大伸懒腰",
      type: "chill",
      typeName: "摸鱼牌",
      cost: 3,
      icon: "🙆",
      shield: 8,
      desc: "获得 <span class=\"val-shield\">8点护盾</span>。骨骼舒展，腰不酸了背不痛了。",
      effect: (state) => {
        return { shield: 8 };
      }
    },
    doodle_on_margin: {
      id: "doodle_on_margin",
      name: "试卷边角偷画火柴人",
      type: "chill",
      typeName: "摸鱼牌",
      cost: 3,
      icon: "🎨",
      heal: 7,
      shield: 4,
      desc: "精神恢复 <span class=\"val-heal\">+7</span>，获得 4 点护盾，得分 -1。艺术解压！",
      effect: (state) => {
        return { heal: 7, shield: 4, score: -1 };
      }
    },
    earplug_silence: {
      id: "earplug_silence",
      name: "佩戴降噪海绵耳塞",
      type: "chill",
      typeName: "摸鱼牌",
      cost: 4,
      icon: "🎧",
      shield: 11,
      desc: "获得 <span class=\"val-shield\">11点强力护盾</span>。隔绝考场所有翻卷咳嗽杂音。",
      effect: (state) => {
        return { shield: 11 };
      }
    },
    pocket_candy: {
      id: "pocket_candy",
      name: "口袋里的薄荷硬糖",
      type: "chill",
      typeName: "摸鱼牌",
      cost: 1,
      icon: "🍬",
      heal: 4,
      shield: 3,
      desc: "精神恢复 <span class=\"val-heal\">+4</span>，获得 3 点护盾。含在舌尖丝丝甜意。",
      effect: (state) => {
        return { heal: 4, shield: 3 };
      }
    },
    bask_in_sunlight: {
      id: "bask_in_sunlight",
      name: "窗边阳光治愈沐浴",
      type: "chill",
      typeName: "摸鱼牌",
      cost: 5,
      icon: "☀️",
      heal: 14,
      shield: 6,
      exhaust: true,
      desc: "精神大幅恢复 <span class=\"val-heal\">+14</span>，获得 6 点护盾。暖阳入窗，焦虑一扫而空！消耗牌。",
      effect: (state) => {
        return { heal: 14, shield: 6, exhaust: true };
      }
    },
    chew_peppermint_gum: {
      id: "chew_peppermint_gum",
      name: "嚼薄荷无糖口香糖",
      type: "chill",
      typeName: "摸鱼牌",
      cost: 2,
      icon: "🍬",
      desc: "获得 <span class=\"val-shield\">6点护盾</span>。清凉在舌尖迸发，专注度拉满！",
      effect: (state) => {
        let val = 6;
        if (state.relics.includes("koi_wallpaper")) val = 9;
        return { shield: val, message: "清凉薄荷驱散了考场困意！" };
      }
    },
    stare_window: {
      id: "stare_window",
      name: "望向窗外发呆",
      type: "chill",
      typeName: "摸鱼牌",
      cost: 2,
      icon: "🪟",
      desc: "获得 <span class=\"val-shield\">4点护盾</span>，抽 1 张牌。看操场发呆，压力骤降。",
      effect: (state) => {
        let val = 4;
        if (state.relics.includes("koi_wallpaper")) val = 6;
        return { shield: val, draw: 1, message: "看着窗外的阳光与白鸽，内心一片宁静。" };
      }
    },

    // ==========================================
    // 四、策略战术牌 (Strategy Cards - 15张)
    // ==========================================
    drink_redbull: {
      id: "drink_redbull",
      name: "喝灌红牛",
      type: "strategy",
      typeName: "策略牌",
      cost: 1,
      icon: "🐂",
      desc: "立即恢复 <span class=\"val-energy\">4点精力</span>！下回合承受 8 点精神反噬压力。",
      effect: (state) => {
        return { energy: 4, nextTurnDamage: 8, message: "大口灌下红牛！精力暴涨，但后劲很足！" };
      }
    },
    iced_americano: {
      id: "iced_americano",
      name: "冰美式续命",
      type: "strategy",
      typeName: "策略牌",
      cost: 3,
      icon: "🥤",
      desc: "抽取 <span class=\"val-draw\">3张手牌</span>，受到 4 点心悸伤害。快速过牌找关键牌。",
      effect: (state) => {
        return { draw: 3, selfDamage: 4 };
      }
    },
    pray_god: {
      id: "pray_god",
      name: "拜赛博考神",
      type: "strategy",
      typeName: "策略牌",
      cost: 2,
      icon: "⛩️",
      exhaust: true,
      desc: "随机获得 1 张临时逆向牌或分值牌加入手牌。消耗牌。",
      effect: (state) => {
        const pool = ["eraser_small", "pencil_sharpen", "three_long_one_short", "special_value_test"];
        const pick = pool[Math.floor(Math.random() * pool.length)];
        if (state.exam) state.exam.hand.push(pick);
        return { exhaust: true, message: `考神显灵！直接向你的手牌赐予了 1 张【${GAME_DATA.cards[pick].name}】！` };
      }
    },
    recall_keypoints: {
      id: "recall_keypoints",
      name: "老师划重点闪回",
      type: "strategy",
      typeName: "策略牌",
      cost: 3,
      icon: "💡",
      desc: "获得增益：下一次打出分值牌时，<span class=\"val-gold\">额外增加 6 分</span>！",
      effect: (state) => {
        return { addBuff: "keypoints", message: "脑海中浮现老师敲黑板说“这题必考”的画面！" };
      }
    },
    skip_question: {
      id: "skip_question",
      name: "战术放弃压轴题",
      type: "strategy",
      typeName: "策略牌",
      cost: 3,
      icon: "🚪",
      desc: "弃掉所有手牌，获得 <span class=\"val-shield\">10点护盾</span>，抽 2 张新牌。绝不在难题上耗死！",
      effect: (state) => {
        return { discardAll: true, shield: 10, draw: 2, message: "果断翻页！把难题留给卷王！" };
      }
    },
    crying_in_heart: {
      id: "crying_in_heart",
      name: "考场无声崩溃",
      type: "strategy",
      typeName: "策略牌",
      cost: 1,
      icon: "😭",
      exhaust: true,
      desc: "卷面得分 <span class=\"val-sub\">-10</span>，精神恢复 +6。大哭一场，重新做题！消耗牌。",
      effect: (state) => {
        return { score: -10, heal: 6, exhaust: true, message: "吸了吸鼻涕，强行打起精神控分！" };
      }
    },
    adrenaline: {
      id: "adrenaline",
      name: "考前半小时爆发",
      type: "strategy",
      typeName: "策略牌",
      cost: 4,
      icon: "⚡",
      exhaust: true,
      desc: "恢复 <span class=\"val-energy\">4点精力</span>，抽 2 张牌，卷面 +4 分！消耗牌。",
      effect: (state) => {
        return { energy: 4, draw: 2, score: 4, exhaust: true, message: "潜能彻底爆发！字迹起飞！" };
      }
    },
    caffeine_pill: {
      id: "caffeine_pill",
      name: "吞服高纯度咖啡因片",
      type: "strategy",
      typeName: "策略牌",
      cost: 1,
      icon: "💊",
      desc: "立即恢复 <span class=\"val-energy\">5点精力</span>！下回合承受 7 点反噬伤害。",
      effect: (state) => {
        return { energy: 5, nextTurnDamage: 7, message: "咖啡因直接注入神经！精力澎湃！" };
      }
    },
    focus_rush: {
      id: "focus_rush",
      name: "深度心流沉浸突刺",
      type: "strategy",
      typeName: "策略牌",
      cost: 4,
      icon: "🧘",
      desc: "抽 1 张牌，获得 6 点护盾，下张分值牌额外 +6 分！",
      effect: (state) => {
        return { draw: 1, shield: 6, addBuff: "keypoints", message: "进入心流模式！整个考场只有你和试卷！" };
      }
    },
    card_recycle: {
      id: "card_recycle",
      name: "翻阅草稿纸回收笔记",
      type: "strategy",
      typeName: "策略牌",
      cost: 3,
      icon: "♻️",
      desc: "从弃牌堆随机抽回 1 张卡牌置入手牌，并获得 4 点护盾。",
      effect: (state) => {
        if (state.exam && state.exam.discardPile.length > 0) {
          const idx = Math.floor(Math.random() * state.exam.discardPile.length);
          const retrieved = state.exam.discardPile.splice(idx, 1)[0];
          state.exam.hand.push(retrieved);
          return { shield: 4, message: `从草稿纸堆里找回了【${GAME_DATA.cards[retrieved].name}】！` };
        }
        return { shield: 4, message: "弃牌堆暂无可用卡牌。" };
      }
    },
    quick_nap_boost: {
      id: "quick_nap_boost",
      name: "极速闭目养神十五秒",
      type: "strategy",
      typeName: "策略牌",
      cost: 2,
      icon: "🔋",
      desc: "恢复 <span class=\"val-energy\">3点精力</span>，获得 4 点护盾。短暂停顿，迅速回能。",
      effect: (state) => {
        return { energy: 3, shield: 4 };
      }
    },
    predict_teacher_step: {
      id: "predict_teacher_step",
      name: "预判老师巡视走位",
      type: "strategy",
      typeName: "策略牌",
      cost: 3,
      icon: "👣",
      desc: "获得 <span class=\"val-shield\">8点护盾</span>，精神恢复 +3。知己知彼，百战不殆。",
      effect: (state) => {
        return { shield: 8, heal: 3 };
      }
    },
    risk_gamble: {
      id: "risk_gamble",
      name: "孤注一掷逆风豪赌",
      type: "strategy",
      typeName: "策略牌",
      cost: 5,
      icon: "🎰",
      desc: "抽 3 张牌，获得 <span class=\"val-shield\">9点护盾</span>。既然到了绝境，不如一把梭哈！",
      effect: (state) => {
        return { draw: 3, shield: 9 };
      }
    },
    emergency_ration: {
      id: "emergency_ration",
      name: "抽屉深处的压缩饼干",
      type: "strategy",
      typeName: "策略牌",
      cost: 3,
      icon: "🍪",
      desc: "精神恢复 +7，恢复 <span class=\"val-energy\">2点精力</span>。高碳水高能量！",
      effect: (state) => {
        return { heal: 7, energy: 2 };
      }
    },
    quantum_fluctuation: {
      id: "quantum_fluctuation",
      name: "量子力学考神共振",
      type: "strategy",
      typeName: "策略牌",
      cost: 6,
      icon: "🌌",
      exhaust: true,
      desc: "直接抽取 4 张手牌，恢复 <span class=\"val-energy\">3点精力</span>！消耗牌。",
      effect: (state) => {
        return { draw: 4, energy: 3, exhaust: true, message: "考神附体！全手牌瞬间补满！" };
      }
    },
    peer_pressure_immune: {
      id: "peer_pressure_immune",
      name: "邻桌翻页声免疫",
      type: "strategy",
      typeName: "策略牌",
      cost: 2,
      icon: "🎧",
      desc: "获得 <span class=\"val-shield\">7点护盾</span>，抽 1 张牌。两耳不闻卷王翻卷声，专注自我！",
      effect: (state) => {
        return { shield: 7, draw: 1, message: "任凭周围翻页如飞，我自岿然不动！" };
      }
    }
  },

  // 遗物定义（校园法宝）
  relics: {
    eraser_4b: {
      id: "eraser_4b",
      name: "4B大号考试橡皮",
      icon: "🧽",
      price: 65,
      desc: "所有逆向（减分）牌的效果额外增加 2 点扣减值，控分如丝般顺滑。"
    },
    koi_wallpaper: {
      id: "koi_wallpaper",
      name: "考神锦鲤手机壁纸",
      icon: "🎏",
      price: 75,
      desc: "考试中所有随机概率事件必定触发最优结果。"
    },
    thermos: {
      id: "thermos",
      name: "老式保温杯泡枸杞",
      icon: "🍶",
      price: 70,
      desc: "每回合开始时，自动恢复 5 点精神护盾。"
    },
    gold_pencil: {
      id: "gold_pencil",
      name: "正品中华2B涂卡铅笔",
      icon: "✏️",
      price: 80,
      desc: "打出分值牌时，有 30% 几率返还 1 点精力。"
    },
    noise_canceller: {
      id: "noise_canceller",
      name: "强效降噪耳塞",
      icon: "🎧",
      price: 60,
      desc: "监考老师巡视和倒计时带来的精神伤害降低 50%。"
    },
    power_bank: {
      id: "power_bank",
      name: "全宿舍唯一的充电宝",
      icon: "🔋",
      price: 55,
      desc: "免疫白天所有断电断网事件的负面惩罚，且每天自动获得 15 生活费。"
    },
    senior_notes: {
      id: "senior_notes",
      name: "保研学长的救命笔记",
      icon: "📒",
      price: 90,
      desc: "每门科目考试开始时，卷面初始自动拥有 12 分基础起评分（底分提升至32分）！"
    },
    sugar_mint: {
      id: "sugar_mint",
      name: "无糖强劲薄荷含片",
      icon: "🍬",
      price: 50,
      desc: "受到精神伤害时，伤害值固定减免 2 点（最少减至 1 点）。"
    },
    meal_card: {
      id: "meal_card",
      name: "充好巨款的学生饭卡",
      icon: "💳",
      price: 65,
      desc: "白天在食堂/咖啡厅摸鱼的恢复效果提升 100%。"
    },
    gold_brain: {
      id: "gold_brain",
      name: "速效脑黄金口服液",
      icon: "🧪",
      price: 85,
      desc: "深层开发大脑潜能！考场精力上限永久 +2，每轮考试初始手牌+1！"
    },
    energy_can: {
      id: "energy_can",
      name: "红牛拉环纪念手绳",
      icon: "📿",
      price: 75,
      desc: "精力充沛！考场精力上限永久 +1，每门大考第一回合额外获得 2 点精力！"
    },
    insulated_mat: {
      id: "insulated_mat",
      name: "加厚防潮自习坐垫",
      icon: "🧘",
      price: 60,
      desc: "坐镇自习室！每回合结束时若精力用尽，下回合开局额外补抽 1 张牌！"
    },
    booster_pack: {
      id: "booster_pack",
      name: "期末急救锦囊盲盒",
      icon: "🎁",
      price: 25,
      desc: "购买立即从全图鉴中随机抽取 1 张强力卡牌直接加入当前卡组！"
    }
  },

  // 二手书摊推荐卡牌池（跳蚤市场可直接花钱买牌）
  fleaMarketCards: [
    { id: "eraser_small", price: 25 },
    { id: "pencil_sharpen", price: 20 },
    { id: "elimination_method", price: 25 },
    { id: "deep_breath", price: 20 },
    { id: "spin_pen", price: 25 },
    { id: "quick_nap_boost", price: 30 },
    { id: "black_tape_fix", price: 35 },
    { id: "focus_rush", price: 35 },
    { id: "precision_dial", price: 45 },
    { id: "reverse_mastery", price: 55 }
  ],

  // 7天考试科目（标准模式必修魔王关卡）
  subjects: [
    {
      day: 1,
      name: "思想道德与法治",
      courseCode: "思修",
      avatar: "⚖️",
      teacher: "和蔼的思修马老师",
      difficulty: "★☆☆☆☆",
      desc: "期末周第一枪！老师仁慈，送分题多，但一不留神容易把分数答太高爆表！",
      targetScore: 60,
      maxTurns: 7,
      teacherIntents: [
        { type: "bonus", val: 5, name: "【送分题】弘扬真善美", desc: "老师仁慈送分！卷面强制 +5 分！(小心超分)" },
        { type: "stress", val: 6, name: "【提问】辨析价值尺度", desc: "对你进行精神施压，造成 6 点精神伤害。" },
        { type: "bonus", val: 4, name: "【送分题】多选题全选", desc: "多选题送福利！卷面强制 +4 分！" },
        { type: "countdown", val: 8, name: "【提醒】还剩二十分钟", desc: "老师敲讲台，造成 8 点精神压力。" }
      ]
    },
    {
      day: 2,
      name: "大学英语综合（四级强化）",
      courseCode: "大英",
      avatar: "🇬🇧",
      teacher: "严谨的英语外教 & 助教",
      difficulty: "★★☆☆☆",
      desc: "满篇阅读理解长难句，听力杂音刺耳，精神压力极大。",
      targetScore: 60,
      maxTurns: 7,
      teacherIntents: [
        { type: "stress", val: 10, name: "【听力】杂音长对话", desc: "耳机刺啦响，造成 10 点精神折磨！" },
        { type: "discard", val: 1, name: "【长难句】生词轰炸", desc: "随机丢弃你 1 张手牌！" },
        { type: "bonus", val: 6, name: "【范文】书信固定开头", desc: "套用模板得分！卷面强制 +6 分！" },
        { type: "stress", val: 12, name: "【收卷预警】请注意涂卡", desc: "造成 12 点精神伤害。" }
      ]
    },
    {
      day: 3,
      name: "线性代数",
      courseCode: "线代",
      avatar: "🔢",
      teacher: "冷酷的数学院老教授",
      difficulty: "★★★☆☆",
      desc: "满屏特征值与正交变换，稍有不慎卷面算错直接扣除大分！",
      targetScore: 60,
      maxTurns: 7,
      teacherIntents: [
        { type: "subScore", val: 5, name: "【扣分陷阱】行列式算错符号", desc: "严谨扣分！卷面被动扣除 5 分！" },
        { type: "stress", val: 12, name: "【特征值暴击】矩阵秩求解", desc: "抽象几何冲击，造成 12 点精神伤害！" },
        { type: "energyLock", val: 1, name: "【降维打击】逻辑卡壳", desc: "下回合你的可用精力减少 1 点！" },
        { type: "bonus", val: 6, name: "【单位矩阵】直接送分", desc: "卷面强制 +6 分！" }
      ]
    },
    {
      day: 4,
      name: "大学物理（电磁学）",
      courseCode: "大物",
      avatar: "⚡",
      teacher: "眼神犀利的物院监考组",
      difficulty: "★★★☆☆",
      desc: "高斯定理与麦克斯韦方程组，送分题与扣分题乱飞，控分如走钢丝！",
      targetScore: 60,
      maxTurns: 7,
      teacherIntents: [
        { type: "bonus", val: 8, name: "【致命送分陷阱】磁通量估算", desc: "题目看似简单，动笔强制 +8 分！小心冲破60及格线！" },
        { type: "stress", val: 15, name: "【电磁巡视】电介质极化", desc: "老师踱步施加高压，造成 15 点精神伤害！" },
        { type: "stress", val: 14, name: "【难题暴击】自感互感计算", desc: "难如天书，造成 14 点精神伤害！" },
        { type: "subScore", val: 6, name: "【扣分陷阱】右手定则反向", desc: "方向搞反！卷面扣除 6 分！" }
      ]
    },
    {
      day: 5,
      name: "概率论与数理统计",
      courseCode: "概率论",
      avatar: "🎲",
      teacher: "佛系微笑着的老讲师",
      difficulty: "★★★★☆",
      desc: "大数定律与中心极限定理，分数波动极大，控分极具不确定性！",
      targetScore: 60,
      maxTurns: 7,
      teacherIntents: [
        { type: "randomDrift", val: 3, name: "【正态波动】随机误差", desc: "卷面分数发生正态扰动（随机 ±3分波动）！" },
        { type: "stress", val: 16, name: "【马尔可夫链】思维死循环", desc: "造成 16 点精神伤害！" },
        { type: "bonus", val: 7, name: "【置信区间】双侧送分", desc: "老师仁慈送分！强制 +7 分！" },
        { type: "stress", val: 18, name: "【假设检验】显著性水平暴击", desc: "造成 18 点精神伤害！" }
      ]
    },
    {
      day: 6,
      name: "数据结构与操作系统",
      courseCode: "计科基础",
      avatar: "💻",
      teacher: "秃头极客系主任",
      difficulty: "★★★★☆",
      desc: "死锁、红黑树旋转与页面置换，精力消耗极快！",
      targetScore: 60,
      maxTurns: 7,
      teacherIntents: [
        { type: "energyLock", val: 2, name: "【死锁机制】资源竞争卡死", desc: "下回合可用精力减少 2 点！" },
        { type: "stress", val: 18, name: "【段错误】空指针异常崩溃", desc: "造成 18 点精神伤害！" },
        { type: "discard", val: 1, name: "【内存溢出】强制清理缓存", desc: "随机弃掉你 1 张手牌！" },
        { type: "stress", val: 20, name: "【LRU算法】末尾淘汰暴击", desc: "高压精神伤害 20 点！" }
      ]
    },
    {
      day: 7,
      name: "高等数学（下）· 决战期末之巅",
      courseCode: "高数下",
      avatar: "👹",
      teacher: "全校挂科率最高的终极魔王考官",
      difficulty: "★★★★★",
      desc: "全校挂科率40%的终极大考！三重积分、格林公式、傅里叶级数，及格即成神！",
      targetScore: 60,
      maxTurns: 8,
      teacherIntents: [
        { type: "stress", val: 22, name: "【魔王威压】斯托克斯公式推导", desc: "高压狂暴！造成 22 点精神折磨！" },
        { type: "bonus", val: 10, name: "【致命送分陷阱】第一道送分大题", desc: "极具诱惑力！动笔直接强制 +10 分！严防冲破60及格线！" },
        { type: "subScore", val: 7, name: "【扣分深坑】收敛半径判别错误", desc: "严酷扣除 7 分！" },
        { type: "stress", val: 25, name: "【期末终极凝视】监考老师站在你身后", desc: "恐怖降临！造成 25 点精神暴击伤害！" }
      ]
    }
  ],

  // 无尽模式考场科目库（Endless Mode Subjects）
  endlessSubjects: [
    {
      name: "量子力学与统计物理",
      courseCode: "量子物理",
      avatar: "⚛️",
      teacher: "严肃的理论物理博导",
      difficulty: "★★★★★",
      desc: "薛定谔方程与波包弥散，每一步推导都充满量子态坍缩的不确定性！",
      targetScore: 60,
      maxTurns: 7,
      teacherIntents: [
        { type: "stress", val: 18, name: "【意图】波包弥散施压", desc: "对你造成 18 点精神折磨！" },
        { type: "bonus", val: 8, name: "【送分陷阱】势阱谐振子", desc: "老师送分！卷面强制 +8 分！小心超分！" },
        { type: "discard", val: 2, name: "【测不准原理】观察者效应", desc: "随机丢弃你 2 张手牌！" },
        { type: "stress", val: 22, name: "【提问】自旋与角动量", desc: "老师走到你桌前凝视，造成 22 点精神伤害！" }
      ]
    },
    {
      name: "实变函数与泛函分析",
      courseCode: "泛函分析",
      avatar: "📐",
      teacher: "数学院名誉院长",
      difficulty: "★★★★★",
      desc: "“实变函数学十遍，泛函分析心胆寒！”数学系著名的四大天王魔王课。",
      targetScore: 60,
      maxTurns: 7,
      teacherIntents: [
        { type: "stress", val: 20, name: "【意图】测度论精神压制", desc: "造成 20 点精神折磨！" },
        { type: "subScore", val: 6, name: "【陷阱】不可测集反例", desc: "卷面分数倒扣 6 分！分值不足将触发答题卡擦穿！" },
        { type: "lockEnergy", val: 2, name: "【紧算子】谱分析死锁", desc: "造成 15 点伤害，并冻结下回合 2 点精力 AP！" },
        { type: "stress", val: 25, name: "【突袭】巴拿赫空间收敛", desc: "精神暴击！造成 25 点精神伤害！" }
      ]
    },
    {
      name: "微分流形与代数拓扑",
      courseCode: "代数拓扑",
      avatar: "🍩",
      teacher: "国家杰青拓扑学者",
      difficulty: "★★★★★",
      desc: "同调群与纤维丛，满试卷的莫比乌斯环与克莱因瓶抽象空间。",
      targetScore: 60,
      maxTurns: 6,
      teacherIntents: [
        { type: "stress", val: 22, name: "【意图】同调群高维折磨", desc: "造成 22 点精神折磨！" },
        { type: "bonus", val: 9, name: "【陷阱】不可定向流形", desc: "强制卷面 +9 分！极度危险的送分陷阱！" },
        { type: "stress", val: 26, name: "【大题】黎曼度量曲率张量", desc: "造成 26 点精神巨额伤害！" }
      ]
    },
    {
      name: "编译原理与高级操作系统内核",
      courseCode: "编译系统",
      avatar: "💾",
      teacher: "计科系元老泰斗",
      difficulty: "★★★★★",
      desc: "语法分析器冲突与内核虚拟内存分页故障，考场如修罗战场。",
      targetScore: 60,
      maxTurns: 7,
      teacherIntents: [
        { type: "stress", val: 24, name: "【意图】LR移进规约死锁", desc: "造成 24 点精神折磨，冻结 2 点精力！" },
        { type: "discard", val: 2, name: "【段错误】核心转储 Core Dump", desc: "随机丢弃你 2 张关键手牌！" },
        { type: "stress", val: 28, name: "【期末大题】死锁预防银行家算法", desc: "高压轰炸！造成 28 点精神伤害！" }
      ]
    },
    {
      name: "研究生毕业答辩终极评审",
      courseCode: "毕业答辩",
      avatar: "🎓",
      teacher: "答辩委员会主席 & 终身教授",
      difficulty: "★★★★★★",
      desc: "全体学术委员会齐聚一堂！每个提问都直击论文核心漏洞！",
      targetScore: 60,
      maxTurns: 6,
      teacherIntents: [
        { type: "stress", val: 26, name: "【盲审意见】创新性存疑", desc: "造成 26 点精神暴击！" },
        { type: "subScore", val: 8, name: "【质询】数据真实性核验", desc: "卷面分数倒扣 8 分！" },
        { type: "stress", val: 30, name: "【终极审判】结论推导逻辑断层", desc: "致命精神风暴！造成 30 点精神伤害！" }
      ]
    }
  ],

  // 校园随机事件库
  campusEvents: [
    {
      id: "ev_morning_check",
      title: "早八突击点名",
      tag: "辅导员查寝",
      icon: "⏰",
      desc: "早上7点50分，班级群突然炸锅：“辅导员今天亲自去大教室点名查迟到！”你还在被窝里...",
      options: [
        {
          text: "极限冲刺！穿着睡裤狂奔去大教室",
          effectDesc: "精神 -10，获得 1 张应急卡牌【战术放弃压轴题】。",
          action: (state) => {
            state.san = Math.max(1, state.san - 10);
            state.deck.push("skip_question");
            return "你踩着上课铃滑跪冲进教室，虽然气喘吁吁，但学到了一招极限逃跑术！";
          }
        },
        {
          text: "找室友帮忙喊“到”",
          effectDesc: "50%概率混过去（无消耗），50%被抓个正着（扣30元生活费检讨）。",
          action: (state) => {
            if (state.relics.includes("koi_wallpaper") || Math.random() < 0.5) {
              return "室友用变声技巧成功帮你答到，危机化解！";
            } else {
              state.money = Math.max(0, state.money - 30);
              state.san = Math.max(1, state.san - 5);
              return "室友刚喊完，辅导员抬头盯着他：“你一个人有两张嘴？”被罚写检讨，交了30班费！";
            }
          }
        },
        {
          text: "不管了，继续睡大觉养精蓄锐",
          effectDesc: "精神 +20，但生活费 -20（买早餐贿赂室友补笔记）。",
          action: (state) => {
            state.san = Math.min(state.maxSan || 100, state.san + 20);
            state.money = Math.max(0, state.money - 20);
            return "睡了个大饱觉，精神充沛！虽然花了20块钱给室友买奶茶补全重点。";
          }
        }
      ]
    },
    {
      id: "ev_power_outage",
      title: "宿舍突发断电断网",
      tag: "突发事件",
      icon: "🔌",
      desc: "晚上正准备突击复习，啪的一声，整栋宿舍楼陷入一片漆黑！“阿姨，没电啦！！”",
      options: [
        {
          text: "开启手机热点，点蜡烛摸黑复习",
          effectDesc: "精神 -12，获得神牌【背诵半页公式】。",
          action: (state) => {
            if (state.relics.includes("power_bank")) {
              state.deck.push("memorize_half_page");
              return "幸好有【充电宝】遗物！不仅没掉精神，还借着微光背熟了公式！";
            }
            state.san = Math.max(1, state.san - 12);
            state.deck.push("memorize_half_page");
            return "眼睛快看瞎了，但也硬生生多记住了半页核心推导！";
          }
        },
        {
          text: "既然断电了，那就说明是老天让我休息",
          effectDesc: "精神 +18，获得卡牌【水群摸鱼】。",
          action: (state) => {
            state.san = Math.min(state.maxSan || 100, state.san + 18);
            state.deck.push("slack_chat");
            return "室友们掏出吉他和零食开起了宿舍夜聊大会，压力一扫而空！";
          }
        }
      ]
    },
    {
      id: "ev_crazy_thursday",
      title: "疯狂星期四！V我50！",
      tag: "社交名场面",
      icon: "🍗",
      desc: "在自习室学得头昏脑胀时，室友突然在微信狂轰滥炸：“今天是肯德基疯狂星期四！谁V我50热辣香骨鸡？！”",
      options: [
        {
          text: "V他50！一起吃炸鸡大快朵颐",
          effectDesc: "生活费 -50，精神 +28，获得卡牌【偷吃一口士力架】。",
          action: (state) => {
            if (state.money >= 50) {
              state.money -= 50;
              state.san = Math.min(state.maxSan || 100, state.san + 28);
              state.deck.push("eat_chocolate");
              return "炸鸡配可乐，快乐无极限！高热量食物极大地治愈了备考创伤！";
            } else {
              state.san = Math.max(1, state.san - 5);
              return "你钱包里连50块都没有，只能和室友相视苦笑，精神受到暴击-5。";
            }
          }
        },
        {
          text: "反向发疯：“我是秦始皇，V我100吃全家桶！”",
          effectDesc: "白嫖室友半对烤翅，精神 +10。",
          action: (state) => {
            state.san = Math.min(state.maxSan || 100, state.san + 10);
            return "你的发疯文学逗乐了整个自习室，室友分了你两个蛋挞！";
          }
        }
      ]
    },
    {
      id: "ev_senior_notes",
      title: "二手群流出学霸神秘手写笔记",
      tag: "宝物机遇",
      icon: "📑",
      desc: "校园二手交易群里有人匿名发帖：“毕业保研学长手写考前密卷与控分秘籍，仅此一份！”",
      options: [
        {
          text: "花 45 元重金拍下！",
          effectDesc: "生活费 -45，随机获得 1 张稀有卡牌。",
          action: (state) => {
            if (state.money >= 45) {
              state.money -= 45;
              const rareCards = ["reverse_mastery", "curve_savior", "adrenaline", "precision_dial", "quantum_fluctuation"];
              const pick = rareCards[Math.floor(Math.random() * rareCards.length)];
              state.deck.push(pick);
              const cardName = GAME_DATA.cards[pick].name;
              return `翻开笔记，字字珠玑！你学会了秘技【${cardName}】！`;
            } else {
              return "囊中羞涩，眼睁睁看着笔记被隔壁宿舍抢先拍走了。";
            }
          }
        },
        {
          text: "去帖子里跟风发“好人一生平安，求好心人共享网盘”",
          effectDesc: "白嫖得到残页卡牌【老师划重点闪回】。",
          action: (state) => {
            state.deck.push("recall_keypoints");
            return "居然真有好心学姐发了一个度盘链接！你成功白嫖到了核心笔记！";
          }
        }
      ]
    },
    {
      id: "ev_advisor_check",
      title: "走廊偶遇院系大Boss导师",
      tag: "恐怖故事",
      icon: "👨‍🏫",
      desc: "正端着泡面走出开水房，迎面撞上了走路带风的院系最严厉老导师！",
      options: [
        {
          text: "热情鞠躬：“老师好！我正在复习您讲的核心章节！”",
          effectDesc: "获得老师赞许，下一门考试初始得分 +5。",
          action: (state) => {
            state.examScoreBonus = (state.examScoreBonus || 0) + 5;
            return "老师欣慰地拍了拍你的肩膀：“不错，好好考，不难为用功的学生。”";
          }
        },
        {
          text: "假装看手机，低头企图蒙混过关",
          effectDesc: "被导师叫住唠叨5分钟，精神 -8。",
          action: (state) => {
            state.san = Math.max(1, state.san - 8);
            return "“小同学走路别看手机！平时多注意仪态！”你被当场说教，心率狂飙。";
          }
        }
      ]
    },
    {
      id: "ev_canteen_aunt",
      title: "二食堂打饭阿姨的恩赐",
      tag: "生活补给",
      icon: "🍲",
      desc: "中午去食堂窗口打糖醋里脊，今天打饭阿姨竟然没有手抖！满满一整勺肉！",
      options: [
        {
          text: "大口炫饭，扫光盘子",
          effectDesc: "精神 +15，精力充沛。",
          action: (state) => {
            state.san = Math.min(state.maxSan || 100, state.san + 15);
            return "吃饱喝足，肚子暖洋洋的，感觉还能再刷50道选择题！";
          }
        },
        {
          text: "嘴甜夸阿姨：“阿姨今天真年轻！”",
          effectDesc: "阿姨一高兴又加了个鸡腿，获得生活费 +20（相当于省了一顿饭）。",
          action: (state) => {
            state.money += 20;
            state.san = Math.min(state.maxSan || 100, state.san + 10);
            return "阿姨笑逐颜开：“这小伙子真会说话！再给你多加个卤蛋！”";
          }
        }
      ]
    }
  ]
};

// Export to window
window.GAME_DATA = GAME_DATA;
