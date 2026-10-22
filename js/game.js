// Safe localStorage helper for all browser environments
const safeStorage = {
  getItem: (key) => {
    try {
      return typeof window !== "undefined" && window.localStorage ? window.localStorage.getItem(key) : null;
    } catch (e) {
      return null;
    }
  },
  setItem: (key, val) => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, val.toString());
      }
    } catch (e) {}
  }
};

class ExamGame {
  constructor() {
    this.state = this.getInitialState();
    this.listeners = [];
  }

  getInitialState() {
    return {
      phase: "START", // START, CHAR_SELECT, DAY_CAMPUS, NIGHT_EXAM, EXAM_SETTLEMENT, GAME_OVER, VICTORY
      day: 1,
      characterId: null,
      character: null,
      san: 100,
      maxSan: 100,
      money: 80,
      retakes: 2,
      maxEnergy: 10, // 初始考场精力上限（可调变量，默认10）
      deck: [],
      relics: [],
      dayAp: 3,
      maxDayAp: 3,
      examScoreBonus: 0,
      passedSubjects: [],

      // 无尽模式相关状态
      isEndless: false,
      endlessStreak: 0,

      // Exam Battle State
      exam: null,

      // Daytime shop & reward state
      dayShopRelics: [],
      dayFleaMarketCards: [],
      cardRewardOptions: [],

      // Active event
      currentEvent: null,

      // Settlement result
      settlement: null
    };
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  // 计算当前生效的精力上限（考虑基础上限 + 遗物加成）
  getEffectiveMaxEnergy() {
    let base = this.state.maxEnergy || 10;
    if (this.state.relics.includes("gold_brain")) base += 2;
    if (this.state.relics.includes("energy_can")) base += 1;
    return base;
  }

  // 永久提升精力上限（如在咖啡厅或商店选购特调饮料）
  upgradeMaxEnergy(cost = 35, delta = 1) {
    if (this.state.money < cost) return false;
    this.state.money -= cost;
    this.state.maxEnergy = (this.state.maxEnergy || 10) + delta;
    window.sounds.playShield();
    this.notify();
    return true;
  }

  // 开始新游戏选择角色
  initCharacter(charId) {
    const char = GAME_DATA.characters.find(c => c.id === charId);
    if (!char) return;

    this.state = this.getInitialState();
    this.state.phase = "DAY_CAMPUS";
    this.state.characterId = charId;
    this.state.character = char;
    this.state.san = char.initialSan;
    this.state.maxSan = char.initialSan;
    this.state.money = char.initialMoney;
    this.state.retakes = char.initialRetake;
    this.state.maxEnergy = char.initialMaxEnergy || 10;
    this.state.deck = [...char.startingDeck];
    this.state.relics = [char.relicId];

    this.startDay();
  }

  // 开启新的一天
  startDay() {
    this.state.dayAp = this.state.maxDayAp;
    this.state.phase = "DAY_CAMPUS";
    this.state.currentEvent = null;

    // 遗物每日被动：充电宝提供15生活费
    if (this.state.relics.includes("power_bank")) {
      this.state.money += 15;
    }

    // 刷新打印店商品与二手书摊
    this.refreshDayShop();
    this.generateFleaMarketCards();

    this.notify();
  }

  refreshDayShop() {
    const allRelicKeys = Object.keys(GAME_DATA.relics);
    const unowned = allRelicKeys.filter(k => !this.state.relics.includes(k) && k !== "booster_pack");
    // 随机打乱取3个，并加入期末盲盒
    const shuffled = unowned.sort(() => Math.random() - 0.5);
    const shopList = shuffled.slice(0, 3);
    shopList.push("booster_pack");
    this.state.dayShopRelics = shopList;
  }

  // 刷新二手书摊卡牌（可直接花钱买牌）
  generateFleaMarketCards() {
    const pool = GAME_DATA.fleaMarketCards || [];
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    this.state.dayFleaMarketCards = shuffled.slice(0, 3);
  }

  // 消耗白天AP
  useDayAp(cost = 1) {
    if (this.state.dayAp < cost) return false;
    this.state.dayAp -= cost;
    this.notify();
    return true;
  }

  // 图书馆：研读真题（三选一新卡牌，支持按类型专项抽选）
  generateCardRewards(category = null) {
    let cardKeys = Object.keys(GAME_DATA.cards);
    if (category && category !== "all") {
      cardKeys = cardKeys.filter(k => GAME_DATA.cards[k].type === category);
    }
    const shuffled = cardKeys.sort(() => Math.random() - 0.5);
    this.state.cardRewardOptions = shuffled.slice(0, 3);
  }

  chooseCardReward(cardId) {
    if (!cardId || !GAME_DATA.cards[cardId]) return;
    this.state.deck.push(cardId);
    this.state.cardRewardOptions = [];
    window.sounds.playPass();
    this.notify();
  }

  // 跳蚤市场：直接花费生活费购买指定卡牌
  buyCardDirectly(cardId, price) {
    if (this.state.money < price) return false;
    this.state.money -= price;
    this.state.deck.push(cardId);
    // 从今日二手摊移除
    this.state.dayFleaMarketCards = this.state.dayFleaMarketCards.filter(item => item.id !== cardId);
    window.sounds.playPass();
    this.notify();
    return true;
  }

  // 购买盲盒卡包（随机获赠 1 张卡牌）
  buyMysteryBooster(price = 25) {
    if (this.state.money < price) return null;
    this.state.money -= price;
    const allKeys = Object.keys(GAME_DATA.cards);
    const pick = allKeys[Math.floor(Math.random() * allKeys.length)];
    this.state.deck.push(pick);
    window.sounds.playPass();
    this.notify();
    return GAME_DATA.cards[pick];
  }

  // 图书馆：精炼卡组（删卡）
  removeCardFromDeck(cardIndex, cost = 30) {
    if (this.state.money < cost) return false;
    if (cardIndex < 0 || cardIndex >= this.state.deck.length) return false;
    this.state.money -= cost;
    this.state.deck.splice(cardIndex, 1);
    window.sounds.playScoreSub();
    this.notify();
    return true;
  }

  // 购买打印店遗物
  buyRelic(relicId) {
    if (relicId === "booster_pack") {
      return this.buyMysteryBooster(25);
    }

    const relic = GAME_DATA.relics[relicId];
    if (!relic) return false;
    if (this.state.money < relic.price) return false;
    if (this.state.relics.includes(relicId)) return false;

    this.state.money -= relic.price;
    this.state.relics.push(relicId);
    this.state.dayShopRelics = this.state.dayShopRelics.filter(id => id !== relicId);
    window.sounds.playShield();
    this.notify();
    return true;
  }

  // 食堂/咖啡店补给
  restAtCafe(type) {
    if (this.state.dayAp < 1) return false;

    if (type === "coffee" || type === "latte") {
      const cost = 25;
      if (this.state.money < cost) return false;
      this.state.money -= cost;
      this.useDayAp(1);
      const mult = this.state.relics.includes("meal_card") ? 2 : 1;
      this.healSan(Math.round(32 * mult));
      window.sounds.playHeal();
      this.notify();
      return true;
    } else if (type === "nap") {
      this.useDayAp(1);
      const mult = this.state.relics.includes("meal_card") ? 2 : 1;
      this.healSan(Math.round(15 * mult));
      window.sounds.playHeal();
      this.notify();
      return true;
    }
    return false;
  }

  // 别名兼容 UI 调用
  buyCatering(type) {
    return this.restAtCafe(type);
  }

  healSan(val) {
    this.state.san = Math.min(this.state.maxSan, this.state.san + val);
  }

  damageSan(val) {
    this.state.san = Math.max(0, this.state.san - val);
  }

  // 触发校园奇遇
  triggerRandomEvent() {
    const events = GAME_DATA.campusEvents;
    const ev = events[Math.floor(Math.random() * events.length)];
    this.state.currentEvent = ev;
    this.notify();
  }

  // 解决事件选项
  resolveEventOption(optionIndex) {
    if (!this.state.currentEvent) return null;
    const opt = this.state.currentEvent.options[optionIndex];
    if (!opt) return null;

    const resultMsg = opt.action(this.state);
    return resultMsg;
  }

  // 别名兼容 UI 调用
  chooseEventOption(optionIndex) {
    const res = this.resolveEventOption(optionIndex);
    this.notify();
    return res;
  }

  closeEventModal() {
    this.state.currentEvent = null;
    this.notify();
  }

  // 获取当天的考试科目（支持标准模式 7 天与无尽模式阶梯强化）
  getTodaySubject() {
    if (this.state.isEndless) {
      const list = GAME_DATA.endlessSubjects || [];
      const streak = this.state.endlessStreak || 0;
      const idx = streak % list.length;
      const baseSub = list[idx];
      const loopCount = Math.floor(streak / list.length);

      // 随着无尽轮数递增，监考意图伤害递增
      return {
        ...baseSub,
        day: this.state.day,
        name: `【无尽第${streak + 1}关】${baseSub.name}`,
        targetScore: 60,
        maxTurns: Math.max(5, baseSub.maxTurns - (loopCount > 0 ? 1 : 0)),
        teacherIntents: baseSub.teacherIntents.map(intent => {
          if (intent.type === "stress") {
            return { ...intent, val: intent.val + streak * 2 };
          }
          return intent;
        })
      };
    }

    const day = this.state.day;
    return GAME_DATA.subjects[day - 1] || GAME_DATA.subjects[0];
  }

  // 进入考场（夜间战斗）
  enterExam() {
    const subject = this.getTodaySubject();
    if (!subject) return;

    // 大学期末真实设定：平时成绩考勤作业基础起评分 20 分！
    let initialScore = 20;
    // 遗物：保研学长笔记初始额外+12分
    if (this.state.relics.includes("senior_notes")) {
      initialScore += 12;
    }
    // 白天随机事件加成
    if (this.state.examScoreBonus) {
      initialScore += this.state.examScoreBonus;
      this.state.examScoreBonus = 0;
    }

    // 初始抽牌堆打乱
    const drawPile = [...this.state.deck].sort(() => Math.random() - 0.5);

    const effectiveMaxEnergy = this.getEffectiveMaxEnergy();

    this.state.phase = "NIGHT_EXAM";
    this.state.exam = {
      subject: subject,
      score: initialScore,
      targetScore: subject.targetScore || 60,
      turn: 1,
      maxTurns: subject.maxTurns,
      energy: effectiveMaxEnergy,
      maxEnergy: effectiveMaxEnergy,
      shield: 0,
      drawPile: drawPile,
      hand: [],
      discardPile: [],
      exhaustPile: [],
      intent: subject.teacherIntents[0],
      intentIndex: 0,
      nextTurnDamage: 0,
      nextTurnDraw: 0,
      nextTurnEnergyLock: 0,
      buffs: {},
      examLog: [
        `第 ${this.state.day} 天大考：《${subject.name}》正式开考！`,
        `📋 已自动计入期末【平时作业出勤分 20分】(当前底分: ${initialScore}分)！目标：控制得分精准达到刚好 60 分及格！`,
        `⚡ 本回合可用精力：${effectiveMaxEnergy} 点，合理规划出牌博弈！`
      ]
    };

    // 遗物：红牛拉环手绳第一回合精力+2
    if (this.state.relics.includes("energy_can")) {
      this.state.exam.energy += 2;
    }

    // 遗物：保温杯开局护盾
    if (this.state.relics.includes("thermos")) {
      this.state.exam.shield += 5;
    }

    // 抽初始手牌（基础 6 张，通宵狂魔 7 张，速效脑黄金口服液额外+1张，与10点精力上限深度适配）
    let initialDrawCount = this.state.characterId === "night_owl" ? 7 : 6;
    if (this.state.relics.includes("gold_brain")) {
      initialDrawCount += 1;
    }
    this.drawCards(initialDrawCount);

    window.sounds.playBell();
    this.notify();
  }

  // 考试抽牌
  drawCards(count) {
    const exam = this.state.exam;
    if (!exam) return;

    for (let i = 0; i < count; i++) {
      if (exam.hand.length >= 10) break; // 手牌上限提升至10张，与10点精力完美适配
      if (exam.drawPile.length === 0) {
        if (exam.discardPile.length === 0) break;
        // 将弃牌堆洗回抽牌堆
        exam.drawPile = [...exam.discardPile].sort(() => Math.random() - 0.5);
        exam.discardPile = [];
      }
      const cardId = exam.drawPile.pop();
      exam.hand.push(cardId);
    }
  }

  // 打出手牌
  playCard(handIndex) {
    const exam = this.state.exam;
    if (!exam || handIndex < 0 || handIndex >= exam.hand.length) return false;

    const cardId = exam.hand[handIndex];
    const card = GAME_DATA.cards[cardId];
    if (!card) return false;

    // 检查精力
    if (exam.energy < card.cost) {
      return false;
    }

    // 扣除精力（遗物：2B真题铅笔 30%概率返还 1 点精力）
    exam.energy -= card.cost;
    if (card.type === "score" && this.state.relics.includes("gold_pencil")) {
      if (Math.random() < 0.3) {
        exam.energy = Math.min(exam.maxEnergy + 5, exam.energy + 1);
        exam.examLog.push(`✏️ 【2B真题铅笔】触发！返还 1 点精力！`);
      }
    }

    // 从手牌移出
    exam.hand.splice(handIndex, 1);

    // 播放音效
    window.sounds.playCard();

    // 执行卡牌效果
    const effect = card.effect(this.state);

    let logMsg = `你使用了【${card.name}】(消耗 ${card.cost} AP): `;

    // 1. 分数变动
    if (effect.setScore !== undefined) {
      exam.score = effect.setScore;
      logMsg += `卷面分重设为 ${effect.setScore} 分！ `;
      window.sounds.playScoreSub();
    } else if (effect.score) {
      let finalScoreChange = effect.score;
      // 检查 4B大号考试橡皮 遗物（所有逆向减分额外多扣 2 点）
      if (finalScoreChange < 0 && this.state.relics.includes("eraser_4b")) {
        finalScoreChange -= 2;
        exam.examLog.push(`🧽 【4B大号考试橡皮】生效！额外多扣除 2 分！`);
      }
      // 检查划重点 buff
      if (finalScoreChange > 0 && exam.buffs.keypoints) {
        finalScoreChange += 6;
        delete exam.buffs.keypoints;
        exam.examLog.push(`💡 触发【老师划重点】增益！额外增加 6 分！`);
      }

      if (finalScoreChange > 0) {
        exam.score += finalScoreChange;
        logMsg += `得分 +${finalScoreChange}！ `;
        window.sounds.playScoreAdd();
      } else if (finalScoreChange < 0) {
        const needed = Math.abs(finalScoreChange);
        if (exam.score < needed) {
          // 答题卡擦穿机制 (Paper Hole Breakdown)
          const overflow = needed - exam.score;
          exam.score = 0;
          exam.shield += 5;
          this.drawCards(1);
          const tearDamage = overflow;
          this.applyDamageToPlayer(tearDamage, false);
          logMsg += `卷面分归零！⚠️【答题卡擦穿了！】分值不足以扣除导致答题卡磨损擦穿，受到 ${tearDamage} 点心慌反噬！但破罐破摔获得 5 点心理护盾，并补抽 1 张手牌！ `;
          window.sounds.playDamage();
        } else {
          exam.score += finalScoreChange;
          logMsg += `得分 ${finalScoreChange}！ `;
          window.sounds.playScoreSub();
        }
      }
    }

    // 2. 护盾与治疗
    if (effect.shield) {
      exam.shield += effect.shield;
      logMsg += `获得 ${effect.shield} 点护盾！ `;
      window.sounds.playShield();
    }
    if (effect.heal) {
      this.healSan(effect.heal);
      logMsg += `精神恢复 +${effect.heal}！ `;
      window.sounds.playHeal();
    }

    // 3. 抽牌与恢复精力
    if (effect.draw) {
      this.drawCards(effect.draw);
      logMsg += `抽 ${effect.draw} 张牌！ `;
    }
    if (effect.energy) {
      exam.energy = Math.min(exam.maxEnergy + 5, exam.energy + effect.energy);
      logMsg += `精力 +${effect.energy}！ `;
    }

    // 4. 自残反噬（精神伤害）
    if (effect.selfDamage) {
      this.applyDamageToPlayer(effect.selfDamage, false);
      logMsg += `精神受到 ${effect.selfDamage} 点伤害！ `;
      window.sounds.playDamage();
    }

    // 5. 延迟效果
    if (effect.nextTurnDamage) {
      exam.nextTurnDamage = (exam.nextTurnDamage || 0) + effect.nextTurnDamage;
    }
    if (effect.nextTurnDraw) {
      exam.nextTurnDraw = (exam.nextTurnDraw || 0) + effect.nextTurnDraw;
    }

    // 6. 弃掉全部手牌
    if (effect.discardAll) {
      exam.discardPile.push(...exam.hand);
      exam.hand = [];
    }

    // 7. Buff
    if (effect.addBuff) {
      exam.buffs[effect.addBuff] = true;
    }

    if (effect.message) {
      exam.examLog.push(effect.message);
    }

    // 放入弃牌堆或消耗堆
    if (card.exhaust || effect.exhaust) {
      exam.exhaustPile.push(cardId);
      logMsg += `(该牌已消耗) `;
    } else {
      exam.discardPile.push(cardId);
    }

    exam.examLog.push(logMsg);

    // 检查精神值是否归零
    if (this.state.san <= 0) {
      this.handleExamBreakdown();
      return true;
    }

    this.notify();
    return true;
  }

  // 承受伤害（计算护盾与遗物）
  applyDamageToPlayer(dmg, isTeacher = true) {
    const exam = this.state.exam;
    let actualDmg = dmg;
    let absorbed = 0;

    // 降噪耳机减半老师精神伤害
    if (isTeacher && this.state.relics.includes("noise_canceller")) {
      actualDmg = Math.ceil(actualDmg * 0.5);
    }

    // 薄荷糖减免
    if (this.state.relics.includes("sugar_mint")) {
      actualDmg = Math.max(1, actualDmg - 2);
    }

    // 护盾抵扣
    if (exam && exam.shield > 0) {
      if (exam.shield >= actualDmg) {
        absorbed = actualDmg;
        exam.shield -= actualDmg;
        actualDmg = 0;
      } else {
        absorbed = exam.shield;
        actualDmg -= exam.shield;
        exam.shield = 0;
      }
    }

    // 实际伤害扣除精神
    if (actualDmg > 0) {
      this.damageSan(actualDmg);
      window.sounds.playDamage();
    }

    // 精神归零检查
    if (this.state.san <= 0) {
      this.handleExamBreakdown();
    }

    return { actualDmg, absorbed };
  }

  // 结束当前回合（监考老师行动）
  endTurn() {
    const exam = this.state.exam;
    if (!exam) return;

    // 检查加厚防潮坐垫遗物（若回合结束精力恰好用为0，触发灵感补抽1张牌）
    let bonusDraw = 0;
    if (this.state.relics.includes("insulated_mat") && exam.energy === 0) {
      bonusDraw += 1;
      exam.examLog.push(`🧘 【加厚防潮坐垫】生效！精力全部耗尽，触发自习心流，下回合额外补抽 1 张牌！`);
    }

    // 1. 将当前手牌全部移入弃牌堆
    exam.discardPile.push(...exam.hand);
    exam.hand = [];

    // 2. 执行老师当前意图
    this.executeTeacherIntent();

    // 检查精神是否崩溃
    if (this.state.san <= 0) {
      this.handleExamBreakdown();
      return;
    }

    // 3. 处理延迟反噬（如红牛/咖啡因副作用）
    if (exam.nextTurnDamage) {
      exam.examLog.push(`⚠️ 咖啡因反噬生效！受到 ${exam.nextTurnDamage} 点精神伤害！`);
      this.applyDamageToPlayer(exam.nextTurnDamage, false);
      exam.nextTurnDamage = 0;
      if (this.state.san <= 0) {
        this.handleExamBreakdown();
        return;
      }
    }

    // 4. 检查考试时间是否耗尽
    if (exam.turn >= exam.maxTurns) {
      exam.examLog.push(`🔔 考试结束铃声响起！监考老师强制收卷！`);
      this.submitExamPaper();
      return;
    }

    // 5. 准备下一回合
    exam.turn += 1;
    exam.shield = 0;

    // 保温杯遗物恢复护盾
    if (this.state.relics.includes("thermos")) {
      exam.shield += 5;
    }

    // 精力重置（取当前生效的精力上限）
    const effectiveMax = this.getEffectiveMaxEnergy();
    exam.maxEnergy = effectiveMax;
    let nextEnergy = effectiveMax;
    if (exam.nextTurnEnergyLock) {
      nextEnergy -= exam.nextTurnEnergyLock;
      exam.nextTurnEnergyLock = 0;
      exam.examLog.push(`⚠️ 精力受限，本回合可用精力为 ${nextEnergy} 点！`);
    }
    exam.energy = Math.max(0, nextEnergy);

    // 更新老师下一个意图
    const intents = exam.subject.teacherIntents;
    exam.intentIndex = (exam.intentIndex + 1) % intents.length;
    exam.intent = intents[exam.intentIndex];

    // 抽新一轮手牌（基础 6 张，通宵狂魔 7 张，速效脑黄金口服液额外+1张，与10点精力上限深度适配）
    let drawCount = this.state.characterId === "night_owl" ? 7 : 6;
    if (this.state.relics.includes("gold_brain")) drawCount += 1;
    drawCount += bonusDraw;
    if (exam.nextTurnDraw) {
      drawCount += exam.nextTurnDraw;
      exam.nextTurnDraw = 0;
    }
    this.drawCards(drawCount);

    // 处理监考弃牌干扰
    if (exam.pendingDiscard && exam.pendingDiscard > 0) {
      for (let i = 0; i < exam.pendingDiscard; i++) {
        if (exam.hand.length > 0) {
          const idx = Math.floor(Math.random() * exam.hand.length);
          const discardedId = exam.hand.splice(idx, 1)[0];
          exam.discardPile.push(discardedId);
          const cardObj = GAME_DATA.cards[discardedId];
          const cardName = cardObj ? cardObj.name : discardedId;
          exam.examLog.push(`🗑️ 迫于监考压力，新抽出的手牌【${cardName}】被弃置！`);
        }
      }
      exam.pendingDiscard = 0;
    }

    this.notify();
  }

  // 执行监考老师意图
  executeTeacherIntent() {
    const exam = this.state.exam;
    const intent = exam.intent;
    if (!intent) return;

    exam.examLog.push(`👨‍🏫 监考动作：${intent.name} - ${intent.desc}`);

    switch (intent.type) {
      case "stress":
      case "countdown":
        this.applyDamageToPlayer(intent.val, true);
        break;

      case "bonus":
        exam.score += intent.val;
        window.sounds.playScoreAdd();
        exam.examLog.push(`📈 卷面被动增加 ${intent.val} 分！(当前总分：${exam.score})`);
        break;

      case "subScore":
        exam.score = Math.max(0, exam.score - intent.val);
        window.sounds.playScoreSub();
        exam.examLog.push(`📉 卷面被动扣除 ${intent.val} 分！(当前总分：${exam.score})`);
        break;

      case "randomDrift":
      case "randomFluctuate":
        const delta = Math.floor(Math.random() * (intent.val * 2 + 1)) - intent.val;
        exam.score = Math.max(0, exam.score + delta);
        if (delta >= 0) {
          window.sounds.playScoreAdd();
          exam.examLog.push(`🎲 概率波动，得分 +${delta}！`);
        } else {
          window.sounds.playScoreSub();
          exam.examLog.push(`🎲 概率波动，得分 ${delta}！`);
        }
        break;

      case "discard":
        exam.pendingDiscard = (exam.pendingDiscard || 0) + intent.val;
        exam.examLog.push(`🗑️ 受到【${intent.name}】干扰！新回合抽出的手牌中将被迫弃掉 ${intent.val} 张！`);
        break;

      case "lockEnergy":
      case "energyLock":
        exam.nextTurnEnergyLock = intent.val;
        break;
    }
  }

  // 提前交卷 / 强制交卷（核心结算逻辑）
  submitExamPaper() {
    const exam = this.state.exam;
    if (!exam) return;

    const score = exam.score;
    const subject = exam.subject;

    let rating = "";
    let ratingTitle = "";
    let ratingDesc = "";
    let sanDelta = 0;
    let moneyDelta = 0;
    let isPassed = false;

    if (score === 60) {
      // 神级压线及格！
      rating = "PERFECT_60";
      ratingTitle = "🎯 【神级控分·压线战神】";
      ratingDesc = "多一分浪费，少一分受罪！分毫不差刚好60分及格！你就是整座考场最从容的神！";
      sanDelta = this.state.maxSan - this.state.san; // 补满精神
      moneyDelta = 60;
      isPassed = true;
      window.sounds.playPerfect60();
    } else if (score >= 61 && score <= 65) {
      // 险胜及格
      rating = "SOLID_PASS";
      ratingTitle = "🎉 【险胜及格·微量浪费】";
      ratingDesc = `考了 ${score} 分！虽然多考了 ${score - 60} 分浪费了精力，但好歹稳稳通过了！`;
      sanDelta = -5;
      moneyDelta = 35;
      isPassed = true;
      window.sounds.playPass();
    } else if (score >= 66 && score <= 79) {
      // 严重超纲
      rating = "OVER_PASS";
      ratingTitle = "⚠️ 【用力过猛·严重浪费】";
      ratingDesc = `考了 ${score} 分！你居然超纲多拿了 ${score - 60} 分！背多了用不上的重点，身心俱疲。`;
      sanDelta = -15;
      moneyDelta = 20;
      isPassed = true;
      window.sounds.playPass();
    } else if (score >= 80) {
      // 误入卷王
      rating = "TRYHARD_FAIL";
      ratingTitle = "🤦‍♂️ 【误入卷王·惨遭反噬】";
      ratingDesc = `考了 ${score} 分？！说好的一起及格，你背地里偷偷卷成这样？被全班同学指指点点，心态崩坏！`;
      sanDelta = -30;
      moneyDelta = 10;
      isPassed = true;
      window.sounds.playPass();
    } else {
      // 挂科！< 60
      rating = "FAILED";
      ratingTitle = "💀 【惨遭挂科·红牌警告】";
      ratingDesc = `仅得 ${score} 分，未达 60 分及格线！命悬一线，必须消耗重修券抢救！`;
      sanDelta = -35;
      moneyDelta = 0;
      isPassed = false;
      window.sounds.playFail();
    }

    // 结算变动
    if (sanDelta > 0) {
      this.healSan(sanDelta);
    } else if (sanDelta < 0) {
      this.damageSan(Math.abs(sanDelta));
    }
    this.state.money += moneyDelta;

    if (!isPassed) {
      // 消耗重修券
      if (this.state.retakes > 0) {
        this.state.retakes -= 1;
        ratingDesc += ` 已消耗 1 张重修券挽救学籍（剩余重修机会：${this.state.retakes}）。`;
      } else {
        // 重修券耗尽 -> 处理退学 Game Over
        if (this.state.isEndless) {
          const currentBest = parseInt(safeStorage.getItem("reverse_exam_endless_best") || "0", 10);
          if (this.state.endlessStreak > currentBest) {
            safeStorage.setItem("reverse_exam_endless_best", this.state.endlessStreak.toString());
          }
          this.state.phase = "GAME_OVER";
          this.state.settlement = {
            subjectName: subject.name,
            score,
            rating: "ENDLESS_OVER",
            ratingTitle: "🔥 【无尽考场生还记录定格】",
            ratingDesc: `在《${subject.name}》中挂科且重修券已耗尽！你在无尽修罗场中连续通过了 ${this.state.endlessStreak} 门魔王考试！历史最高纪录: ${Math.max(currentBest, this.state.endlessStreak)} 场！`,
            isPassed: false
          };
          this.notify();
          return;
        }

        this.state.phase = "GAME_OVER";
        this.state.settlement = {
          subjectName: subject.name,
          score,
          rating,
          ratingTitle: "🚫 【挂科退学·学籍注销】",
          ratingDesc: `在《${subject.name}》中得分 ${score} 分，重修券已耗尽，期末生存失败！`,
          isPassed: false
        };
        this.notify();
        return;
      }
    }

    // 记录及格科目
    this.state.passedSubjects.push({
      day: this.state.day,
      name: subject.name,
      score: score,
      rating: ratingTitle
    });

    this.state.phase = "EXAM_SETTLEMENT";
    this.state.settlement = {
      subjectName: subject.name,
      score,
      rating,
      ratingTitle,
      ratingDesc,
      sanDelta,
      moneyDelta,
      isPassed
    };

    // 生成战利品卡牌（及格奖励三选一）
    this.generateCardRewards();

    this.notify();
  }

  // 考场崩溃与校医室急救机制
  handleExamBreakdown() {
    const exam = this.state.exam;

    // 如果拥有重修券，触发紧急校医室抢救机制（免死金牌）！
    if (this.state.retakes > 0) {
      this.state.retakes -= 1;
      this.state.san = 35;
      if (exam) {
        exam.shield += 8;
        exam.examLog.push(`🚑【校医室急救抢救成功！】你两眼发黑险些晕厥！监考老师紧急掐人中，校医送来速效救心丸！消耗 1 张重修券挽救学籍（剩余 ${this.state.retakes} 次），精神恢复至 35 点，并获得 8 点应急护盾！请稳住心态继续答题！`);
      }
      window.sounds.playBell();
      this.notify();
      return;
    }

    // 无尽模式退学结算
    if (this.state.isEndless) {
      const currentBest = parseInt(safeStorage.getItem("reverse_exam_endless_best") || "0", 10);
      if (this.state.endlessStreak > currentBest) {
        safeStorage.setItem("reverse_exam_endless_best", this.state.endlessStreak.toString());
      }
      window.sounds.playFail();
      this.state.phase = "GAME_OVER";
      this.state.settlement = {
        subjectName: exam ? exam.subject.name : "无尽考场",
        score: exam ? exam.score : 0,
        rating: "ENDLESS_OVER",
        ratingTitle: "🔥 【无尽考场生还记录定格】",
        ratingDesc: `在第 ${(this.state.endlessStreak || 0) + 1} 场无尽大考中心态彻底崩溃！你在无尽修罗场中连续通过了 ${this.state.endlessStreak || 0} 门高难考试！历史最高纪录: ${Math.max(currentBest, this.state.endlessStreak || 0)} 场！`,
        isPassed: false
      };
      this.notify();
      return;
    }

    window.sounds.playFail();
    this.state.phase = "GAME_OVER";
    this.state.settlement = {
      subjectName: exam ? exam.subject.name : "未知科目",
      score: exam ? exam.score : 0,
      rating: "BREAKDOWN",
      ratingTitle: "🤯 【脑力过载·考场晕厥】",
      ratingDesc: "你的精神值归零且重修券已耗尽，在考场上两眼发黑彻底晕厥... 期末生存失败，学籍被注销！",
      isPassed: false
    };
    this.notify();
  }

  // 开启无尽模式
  startEndlessMode() {
    this.state.isEndless = true;
    this.state.endlessStreak = 0;
    this.state.phase = "DAY_CAMPUS";
    this.state.san = Math.min(this.state.maxSan || 100, this.state.san + 30);
    this.state.money += 50;
    this.state.retakes = Math.max(1, this.state.retakes);
    this.state.day = 8;
    this.startDay();
  }

  // 结算完成后前往下一天、通关或继续无尽
  finishSettlement() {
    if (this.state.isEndless) {
      this.state.endlessStreak = (this.state.endlessStreak || 0) + 1;
      const currentBest = parseInt(safeStorage.getItem("reverse_exam_endless_best") || "0", 10);
      if (this.state.endlessStreak > currentBest) {
        safeStorage.setItem("reverse_exam_endless_best", this.state.endlessStreak.toString());
      }
      this.state.day += 1;
      this.startDay();
      return;
    }

    if (this.state.day >= 7) {
      // 7天期末周全部生存！
      this.state.phase = "VICTORY";
      safeStorage.setItem("reverse_exam_endless_unlocked", "true");
      window.sounds.playPerfect60();
      this.notify();
      return;
    }

    this.state.day += 1;
    this.startDay();
  }
}

window.ExamGame = ExamGame;
