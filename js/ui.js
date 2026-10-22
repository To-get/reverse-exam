// UI Controller & Render Logic for "Reverse Exam Roguelike"

document.addEventListener('DOMContentLoaded', () => {
  const game = new ExamGame();
  let selectedCharId = 'crammer';
  let isDeckRemoveMode = false;

  // DOM Elements
  const topBar = document.getElementById('top-bar');
  const relicsBar = document.getElementById('relics-bar');
  const topDayText = document.getElementById('top-day-text');
  const topSanText = document.getElementById('top-san-text');
  const topSanFill = document.getElementById('top-san-fill');
  const topMoneyText = document.getElementById('top-money-text');
  const topRetakeText = document.getElementById('top-retake-text');
  const topDeckCount = document.getElementById('top-deck-count');

  // Screens
  const screens = {
    START: document.getElementById('screen-start'),
    CHAR_SELECT: document.getElementById('screen-char-select'),
    DAY_CAMPUS: document.getElementById('screen-day-campus'),
    NIGHT_EXAM: document.getElementById('screen-night-exam'),
    EXAM_SETTLEMENT: document.getElementById('screen-settlement'),
    GAME_OVER: document.getElementById('screen-game-over'),
    VICTORY: document.getElementById('screen-victory')
  };

  // Modals
  const modals = {
    event: document.getElementById('modal-event'),
    library: document.getElementById('modal-library'),
    cafe: document.getElementById('modal-cafe'),
    shop: document.getElementById('modal-shop'),
    flea: document.getElementById('modal-flea'),
    relics: document.getElementById('modal-relics'),
    deck: document.getElementById('modal-deck'),
    rules: document.getElementById('modal-rules')
  };

  function switchScreen(screenKey) {
    Object.values(screens).forEach(s => s && s.classList.remove('active'));
    if (screens[screenKey]) {
      screens[screenKey].classList.add('active');
    }
  }

  function showModal(modalKey) {
    if (modals[modalKey]) {
      modals[modalKey].classList.add('active');
      window.sounds.playClick();
    }
  }

  function closeModal(modalKey) {
    if (modals[modalKey]) {
      modals[modalKey].classList.remove('active');
    }
  }

  // In-Game Sleek Toast Notification System
  function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    else if (type === 'warning') icon = '⚠️';
    else if (type === 'error') icon = '❌';
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-text">${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 320);
    }, 2500);
  }

  // Close modals on outside click
  Object.entries(modals).forEach(([key, modal]) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(key);
      }
    });
  });

  // Sound Toggle Button
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  btnSoundToggle.addEventListener('click', () => {
    const isEnabled = window.sounds.toggleSound();
    btnSoundToggle.textContent = isEnabled ? '🔊' : '🔇';
  });

  // Cross-browser Web Audio auto-unlock for mobile WebKit/iOS Safari & Android Chrome
  const unlockAudio = () => {
    if (window.sounds) {
      window.sounds.initContext();
    }
  };
  ['touchstart', 'touchend', 'pointerdown', 'mousedown'].forEach(ev => {
    window.addEventListener(ev, unlockAudio, { once: true, passive: true });
  });

  // Help Button
  document.getElementById('btn-show-rules').addEventListener('click', () => showModal('rules'));
  document.getElementById('btn-help-top').addEventListener('click', () => showModal('rules'));
  document.getElementById('btn-close-rules').addEventListener('click', () => closeModal('rules'));

  // Relics Compendium Modal
  const btnViewRelics = document.getElementById('btn-view-relics');
  if (btnViewRelics) {
    btnViewRelics.addEventListener('click', () => {
      renderRelicsModal();
      showModal('relics');
    });
  }
  const btnCloseRelics = document.getElementById('btn-close-relics');
  if (btnCloseRelics) {
    btnCloseRelics.addEventListener('click', () => closeModal('relics'));
  }

  // Deck Modal & Compendium Tab switching
  let currentDeckModalTab = 'current'; // 'current' or 'compendium'
  let currentCompendiumFilter = 'all';

  document.getElementById('btn-view-deck').addEventListener('click', () => {
    isDeckRemoveMode = false;
    currentDeckModalTab = 'current';
    renderDeckModal();
    showModal('deck');
  });
  document.getElementById('btn-close-deck').addEventListener('click', () => closeModal('deck'));

  const tabDeckBtn = document.getElementById('tab-btn-current-deck');
  if (tabDeckBtn) {
    tabDeckBtn.addEventListener('click', () => {
      currentDeckModalTab = 'current';
      window.sounds.playClick();
      renderDeckModal();
    });
  }

  const tabAllBtn = document.getElementById('tab-btn-all-cards');
  if (tabAllBtn) {
    tabAllBtn.addEventListener('click', () => {
      currentDeckModalTab = 'compendium';
      window.sounds.playClick();
      renderDeckModal();
    });
  }

  document.querySelectorAll('#compendium-filter-bar .filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#compendium-filter-bar .filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCompendiumFilter = pill.dataset.filter || 'all';
      window.sounds.playClick();
      renderDeckModal();
    });
  });

  // =========================================================
  // 1. Start & Character Select
  // =========================================================
  let isStartingEndless = false;
  const btnStartEndless = document.getElementById('btn-start-endless');
  const startEndlessStreakText = document.getElementById('start-endless-streak-text');

  function refreshStartScreenEndless() {
    let isUnlocked = false;
    let bestStreak = '0';
    try {
      if (typeof localStorage !== 'undefined') {
        isUnlocked = localStorage.getItem('reverse_exam_endless_unlocked') === 'true';
        bestStreak = localStorage.getItem('reverse_exam_endless_best') || '0';
      }
    } catch (e) {}
    if (btnStartEndless) {
      btnStartEndless.style.display = isUnlocked ? 'block' : 'none';
    }
    if (startEndlessStreakText) {
      startEndlessStreakText.textContent = bestStreak;
    }
  }
  refreshStartScreenEndless();

  if (btnStartEndless) {
    btnStartEndless.addEventListener('click', () => {
      window.sounds.playClick();
      isStartingEndless = true;
      renderCharSelect();
      switchScreen('CHAR_SELECT');
    });
  }

  document.getElementById('btn-start-game').addEventListener('click', () => {
    window.sounds.playClick();
    isStartingEndless = false;
    renderCharSelect();
    switchScreen('CHAR_SELECT');
  });

  document.getElementById('btn-back-to-start').addEventListener('click', () => {
    window.sounds.playClick();
    game.state.phase = 'START';
    topBar.style.display = 'none';
    relicsBar.style.display = 'none';
    lastExamState = { score: null, san: null, shield: null };
    refreshStartScreenEndless();
    switchScreen('START');
  });

  document.getElementById('btn-confirm-char').addEventListener('click', () => {
    window.sounds.playClick();
    game.initCharacter(selectedCharId);
    if (isStartingEndless) {
      game.startEndlessMode();
    }
  });

  function renderCharSelect() {
    const listEl = document.getElementById('char-select-list');
    listEl.innerHTML = '';

    GAME_DATA.characters.forEach(char => {
      const relic = GAME_DATA.relics[char.relicId];
      const card = document.createElement('div');
      card.className = `char-card ${char.id === selectedCharId ? 'selected' : ''}`;
      card.innerHTML = `
        <div class="char-header">
          <div class="char-avatar">${char.avatar}</div>
          <div style="flex:1;">
            <div style="display:flex; align-items:center; justify-content:space-between;">
              <span class="char-name">${char.name}</span>
              <span class="char-badge">${char.title}</span>
            </div>
            <div style="display:flex; gap:6px; margin-top:6px; flex-wrap:wrap;">
              <span style="font-size:11px; background:#f1f5f9; padding:2px 6px; border-radius:4px; font-weight:600;">🧠 精神 ${char.initialSan}</span>
              <span style="font-size:11px; background:#fef3c7; color:#92400e; padding:2px 6px; border-radius:4px; font-weight:600;">💰 ${char.initialMoney}元</span>
              <span style="font-size:11px; background:#fee2e2; color:#991b1b; padding:2px 6px; border-radius:4px; font-weight:600;">📜 ${char.initialRetake}张重修券</span>
            </div>
          </div>
        </div>
        <div class="char-desc">${char.desc}</div>
        <div class="char-trait">
          <strong>专属特质：</strong>${char.trait}
        </div>
        <div style="font-size:11.5px; color:#475569; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:6px 10px; display:flex; justify-content:space-between; align-items:center;">
          <span>初始法宝：<strong>${relic ? relic.icon + ' ' + relic.name : ''}</strong></span>
          <span>初始卡牌: ${char.startingDeck.length}张</span>
        </div>
      `;
      card.addEventListener('click', () => {
        selectedCharId = char.id;
        window.sounds.playClick();
        renderCharSelect();
      });
      listEl.appendChild(card);
    });
  }

  // =========================================================
  // 2. Daytime Campus Hub
  // =========================================================
  document.getElementById('btn-action-library').addEventListener('click', () => {
    if (game.state.dayAp < 1) {
      showToast('今日精力点已耗尽！请奔赴今晚考场！', 'warning');
      return;
    }
    showModal('library');
  });

  document.getElementById('btn-close-library').addEventListener('click', () => closeModal('library'));

  // Library Option A: Study Cards (Pick 1 of 3)
  document.getElementById('btn-lib-study-cards').addEventListener('click', () => {
    closeModal('library');
    if (!game.useDayAp(1)) return;
    game.generateCardRewards();
    openCardRewardModal('研读真题：请挑选1张心仪卡牌加入卡组', () => {
      game.notify();
    });
  });

  // Library Option B: Thematic Pack (Pick 1 of 3 by Category for 15 money + 1 AP)
  const btnLibThematic = document.getElementById('btn-lib-thematic-pack');
  if (btnLibThematic) {
    btnLibThematic.addEventListener('click', () => {
      if (game.state.dayAp < 1) {
        showToast('今日精力点已耗尽！请奔赴今晚考场！', 'warning');
        return;
      }
      if (game.state.money < 15) {
        showToast('生活费不足15元，无法购买教研专项突破包！', 'warning');
        return;
      }
      closeModal('library');
      openThematicPackSelector();
    });
  }

  function openThematicPackSelector() {
    isDeckRemoveMode = false;
    const tabsContainer = document.getElementById('deck-tabs-container');
    if (tabsContainer) tabsContainer.style.display = 'none';
    const filterBar = document.getElementById('compendium-filter-bar');
    if (filterBar) filterBar.style.display = 'none';
    const bannerTip = document.getElementById('compendium-banner-tip');
    if (bannerTip) bannerTip.style.display = 'none';
    const removeTip = document.getElementById('deck-remove-tip');
    if (removeTip) removeTip.style.display = 'none';

    document.getElementById('deck-modal-title').textContent = '🎯 专项教研突破包：选择研读方向';
    const grid = document.getElementById('deck-view-grid');
    grid.innerHTML = `
      <div style="grid-column:1/-1; display:flex; flex-direction:column; gap:12px; padding:10px;">
        <div style="font-size:13px; color:#475569; margin-bottom:4px;">
          花费 1 点白天行动 AP 与 15 元生活费，定向研读该分类下的 3 张高能卡牌：
        </div>
        <div class="event-option-btn theme-opt-btn" data-theme="score" style="border-left:4px solid #3b82f6;">
          <div class="opt-text" style="color:#1d4ed8;">🎯 分值冲刺包 (20种分值牌)</div>
          <div class="opt-effect">包含平时出勤底分、公式速记、答题解字套路。</div>
        </div>
        <div class="event-option-btn theme-opt-btn" data-theme="reverse" style="border-left:4px solid #f43f5e;">
          <div class="opt-text" style="color:#be123c;">🧹 逆向橡皮包 (14种控分牌)</div>
          <div class="opt-effect">精准下压超纲过线分数，2B橡皮擦、划掉重写。</div>
        </div>
        <div class="event-option-btn theme-opt-btn" data-theme="chill" style="border-left:4px solid #10b981;">
          <div class="opt-text" style="color:#047857;">☕ 摸鱼减压包 (15种护盾减压牌)</div>
          <div class="opt-effect">构筑心理自信护盾，消除焦虑，回血自保。</div>
        </div>
        <div class="event-option-btn theme-opt-btn" data-theme="strategy" style="border-left:4px solid #a855f7;">
          <div class="opt-text" style="color:#6d28d9;">⚡ 策略战术包 (15种战术秘策)</div>
          <div class="opt-effect">考场快速过牌、精力爆发、重新洗牌、倍率绝杀。</div>
        </div>
      </div>
    `;

    grid.querySelectorAll('.theme-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        if (!game.useDayAp(1)) {
          showToast('今日精力已耗尽！', 'warning');
          closeModal('deck');
          return;
        }
        game.state.money -= 15;
        game.generateCardRewards(theme);
        window.sounds.playClick();
        openCardRewardModal(`专项教研包：请挑选 1 张加入卡组`, () => {
          game.notify();
        });
      });
    });

    showModal('deck');
  }

  // Library Option C: Refine Deck (Delete card for 30 money)
  document.getElementById('btn-lib-delete-card').addEventListener('click', () => {
    if (game.state.dayAp < 1) {
      showToast('今日精力点已耗尽！请奔赴今晚考场！', 'warning');
      return;
    }
    if (game.state.money < 30) {
      showToast('生活费不足30元，无法找学霸帮忙整理笔记删牌！', 'warning');
      return;
    }
    closeModal('library');
    isDeckRemoveMode = true;
    currentDeckModalTab = 'current';
    renderDeckModal();
    showModal('deck');
  });

  // Cafe Modal
  document.getElementById('btn-action-cafe').addEventListener('click', () => {
    if (game.state.dayAp < 1) {
      showToast('今日精力点已耗尽！请奔赴今晚考场！', 'warning');
      return;
    }
    const valSpan = document.getElementById('cafe-max-energy-val');
    if (valSpan) valSpan.textContent = game.getEffectiveMaxEnergy();
    showModal('cafe');
  });
  document.getElementById('btn-close-cafe').addEventListener('click', () => closeModal('cafe'));

  document.getElementById('btn-buy-latte').addEventListener('click', () => {
    if (game.state.dayAp < 1) {
      showToast('今日精力点已耗尽！请奔赴今晚考场！', 'warning');
      return;
    }
    if (game.buyCatering('latte')) {
      closeModal('cafe');
      showToast('☕ 选购了一杯香醇拿铁，回复了 15 点精神！', 'success');
    } else {
      showToast('生活费不足25元！', 'warning');
    }
  });

  const btnBuyEspresso = document.getElementById('btn-buy-espresso');
  if (btnBuyEspresso) {
    btnBuyEspresso.addEventListener('click', () => {
      if (game.state.dayAp < 1) {
        showToast('今日精力点已耗尽！请奔赴今晚考场！', 'warning');
        return;
      }
      if (game.state.money < 35) {
        showToast('生活费不足35元，无法选购特调双倍浓缩冰美式！', 'warning');
        return;
      }
      if (game.upgradeMaxEnergy(35, 1)) {
        game.useDayAp(1);
        closeModal('cafe');
        showToast(`☕ 特调双倍浓缩冰美式一饮而尽！考场精力上限永久提升至 ${game.getEffectiveMaxEnergy()} 点！`, 'success');
      }
    });
  }

  document.getElementById('btn-take-nap').addEventListener('click', () => {
    if (game.state.dayAp < 1) {
      showToast('今日精力点已耗尽！请奔赴今晚考场！', 'warning');
      return;
    }
    if (game.buyCatering('nap')) {
      closeModal('cafe');
      showToast('😴 在沙发上小憩了片刻，精神已完全恢复充沛！', 'success');
    }
  });

  // Flea Market Used Books
  const btnActionFlea = document.getElementById('btn-action-flea');
  if (btnActionFlea) {
    btnActionFlea.addEventListener('click', () => {
      renderFleaMarketModal();
      showModal('flea');
    });
  }
  const btnCloseFlea = document.getElementById('btn-close-flea');
  if (btnCloseFlea) {
    btnCloseFlea.addEventListener('click', () => closeModal('flea'));
  }

  function renderFleaMarketModal() {
    const moneyEl = document.getElementById('flea-money-text');
    if (moneyEl) moneyEl.textContent = game.state.money;
    const list = document.getElementById('flea-items-list');
    if (!list) return;
    list.innerHTML = '';

    if (!game.state.dayFleaMarketCards || game.state.dayFleaMarketCards.length === 0) {
      list.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:#94a3b8; padding:30px;">今日二手好书已全部淘空！明日再来看看吧！</div>';
      return;
    }

    game.state.dayFleaMarketCards.forEach(item => {
      const card = GAME_DATA.cards[item.id];
      if (!card) return;
      const canBuy = game.state.money >= item.price;
      const wrapEl = document.createElement('div');
      wrapEl.className = 'flea-item-card';
      wrapEl.style.display = 'flex';
      wrapEl.style.flexDirection = 'column';
      wrapEl.style.gap = '8px';
      wrapEl.style.background = '#fff';
      wrapEl.style.border = '1.5px solid #cbd5e1';
      wrapEl.style.borderRadius = '10px';
      wrapEl.style.padding = '8px';
      wrapEl.style.boxShadow = '0 2px 6px rgba(0,0,0,0.06)';

      const cardEl = createCardElement(card, -1, true);
      cardEl.style.margin = '0';
      cardEl.style.width = '100%';

      const buyBtn = document.createElement('button');
      buyBtn.className = `btn ${canBuy ? 'btn-gold' : 'btn-outline'}`;
      buyBtn.style.padding = '8px 12px';
      buyBtn.style.fontSize = '12.5px';
      buyBtn.style.fontWeight = '700';
      buyBtn.innerHTML = `💰 购买 (${item.price}元)`;
      buyBtn.addEventListener('click', () => {
        if (!canBuy) {
          showToast('生活费不足，无法淘得此卡！', 'warning');
          return;
        }
        if (game.buyCardDirectly(item.id, item.price)) {
          showToast(`🎉 恭喜淘得二手好牌【${card.name}】！已加入卡组！`, 'success');
          renderFleaMarketModal();
        }
      });

      wrapEl.appendChild(cardEl);
      wrapEl.appendChild(buyBtn);
      list.appendChild(wrapEl);
    });
  }

  // Shop Modal
  document.getElementById('btn-action-shop').addEventListener('click', () => {
    renderShopModal();
    showModal('shop');
  });
  document.getElementById('btn-close-shop').addEventListener('click', () => closeModal('shop'));

  // Random Campus Event
  document.getElementById('btn-action-event').addEventListener('click', () => {
    if (game.state.dayAp < 1) {
      showToast('今日精力点已耗尽！请奔赴今晚考场！', 'warning');
      return;
    }
    game.useDayAp(1);
    game.triggerRandomEvent();
  });

  // Enter Night Exam
  document.getElementById('btn-enter-exam').addEventListener('click', () => {
    window.sounds.playClick();
    lastExamState = { score: null, san: null, shield: null };
    game.enterExam();
  });

  // =========================================================
  // 3. Night Exam (Combat / Reverse Answering)
  // =========================================================
  document.getElementById('btn-end-turn').addEventListener('click', () => {
    window.sounds.playClick();
    game.endTurn();
  });

  document.getElementById('btn-submit-paper').addEventListener('click', () => {
    const score = game.state.exam ? game.state.exam.score : 0;
    const msg = score === 60 
      ? '🎯 太棒了！当前刚好 60 分！确认立即交卷吗？' 
      : `当前卷面分数为 ${score} 分。确定现在提前交卷吗？`;
    
    if (confirm(msg)) {
      window.sounds.playBell();
      game.submitExamPaper();
    }
  });

  // Pile counters view
  document.getElementById('btn-draw-pile').addEventListener('click', () => {
    if (!game.state.exam) return;
    viewSpecificPile('抽牌堆剩余卡牌', game.state.exam.drawPile);
  });

  document.getElementById('btn-discard-pile').addEventListener('click', () => {
    if (!game.state.exam) return;
    viewSpecificPile('弃牌堆卡牌', game.state.exam.discardPile);
  });

  document.getElementById('btn-exhaust-pile').addEventListener('click', () => {
    if (!game.state.exam) return;
    viewSpecificPile('本次考试已消耗卡牌', game.state.exam.exhaustPile);
  });

  function viewSpecificPile(title, cardIds) {
    isDeckRemoveMode = false;
    const tabsContainer = document.getElementById('deck-tabs-container');
    if (tabsContainer) tabsContainer.style.display = 'none';
    const filterBar = document.getElementById('compendium-filter-bar');
    if (filterBar) filterBar.style.display = 'none';
    const bannerTip = document.getElementById('compendium-banner-tip');
    if (bannerTip) bannerTip.style.display = 'none';

    document.getElementById('deck-modal-title').textContent = title;
    document.getElementById('deck-remove-tip').style.display = 'none';
    const grid = document.getElementById('deck-view-grid');
    grid.innerHTML = '';
    if (cardIds.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:#94a3b8; padding:20px;">空空如也</div>';
    } else {
      cardIds.forEach(id => {
        const card = GAME_DATA.cards[id];
        if (!card) return;
        const el = createCardElement(card, -1, false);
        grid.appendChild(el);
      });
    }
    showModal('deck');
  }

  // =========================================================
  // 4. Settlement & Progression
  // =========================================================
  document.getElementById('btn-next-day').addEventListener('click', () => {
    window.sounds.playClick();
    game.finishSettlement();
  });

  document.getElementById('btn-skip-reward').addEventListener('click', () => {
    window.sounds.playClick();
    game.state.cardRewardOptions = [];
    document.getElementById('reward-section').style.display = 'none';
  });

  document.getElementById('btn-restart-game').addEventListener('click', () => {
    window.sounds.playClick();
    game.state.phase = 'START';
    topBar.style.display = 'none';
    relicsBar.style.display = 'none';
    lastExamState = { score: null, san: null, shield: null };
    refreshStartScreenEndless();
    switchScreen('START');
  });

  document.getElementById('btn-victory-restart').addEventListener('click', () => {
    window.sounds.playClick();
    game.state.phase = 'START';
    topBar.style.display = 'none';
    relicsBar.style.display = 'none';
    lastExamState = { score: null, san: null, shield: null };
    refreshStartScreenEndless();
    switchScreen('START');
  });

  const btnEnterEndless = document.getElementById('btn-enter-endless');
  if (btnEnterEndless) {
    btnEnterEndless.addEventListener('click', () => {
      window.sounds.playClick();
      game.startEndlessMode();
    });
  }

  // =========================================================
  // State Observer (Re-renders UI when game state changes)
  // =========================================================
  game.subscribe((state) => {
    if (state.phase !== 'NIGHT_EXAM') {
      lastExamState = { score: null, san: null, shield: null };
    }

    // 1. Update Global Top Bar
    if (state.phase !== 'START' && state.phase !== 'CHAR_SELECT') {
      topBar.style.display = 'flex';
      relicsBar.style.display = 'flex';
      if (state.isEndless) {
        topDayText.innerHTML = `<span style="color:#ef4444; font-weight:800;">🔥 无尽第 ${state.day - 7} 场 (连胜: ${state.endlessStreak})</span>`;
      } else {
        topDayText.textContent = `第 ${state.day}/7 天`;
      }
      topSanText.textContent = `${state.san}/${state.maxSan}`;
      const sanPercent = Math.max(0, Math.min(100, (state.san / state.maxSan) * 100));
      topSanFill.style.width = `${sanPercent}%`;
      topSanFill.style.backgroundColor = sanPercent > 50 ? 'var(--accent-green)' : (sanPercent > 25 ? 'var(--accent-gold)' : 'var(--accent-red)');
      topMoneyText.textContent = state.money;
      topRetakeText.textContent = state.retakes;
      topDeckCount.textContent = state.deck.length;
      const topRelicsCount = document.getElementById('top-relics-count');
      if (topRelicsCount) topRelicsCount.textContent = state.relics.length;

      // Render Relics Bar
      renderRelicsBar(state.relics);
    } else {
      topBar.style.display = 'none';
      relicsBar.style.display = 'none';
    }

    // 2. Render Screen Specific UI
    switch (state.phase) {
      case 'DAY_CAMPUS':
        switchScreen('DAY_CAMPUS');
        renderDayCampus(state);
        break;

      case 'NIGHT_EXAM':
        switchScreen('NIGHT_EXAM');
        renderNightExam(state);
        break;

      case 'EXAM_SETTLEMENT':
        switchScreen('EXAM_SETTLEMENT');
        renderSettlement(state);
        break;

      case 'GAME_OVER':
        switchScreen('GAME_OVER');
        renderGameOver(state);
        break;

      case 'VICTORY':
        switchScreen('VICTORY');
        renderVictory(state);
        break;
    }

    // 3. Render Event Modal if triggered
    if (state.currentEvent) {
      renderEventModal(state.currentEvent);
      showModal('event');
    } else {
      closeModal('event');
    }
  });

  // =========================================================
  // Detailed Render Helpers
  // =========================================================
  function renderRelicsBar(relicIds) {
    relicsBar.innerHTML = '';
    relicIds.forEach(id => {
      const relic = GAME_DATA.relics[id];
      if (!relic) return;
      const pill = document.createElement('div');
      pill.className = 'relic-pill';
      pill.innerHTML = `<span>${relic.icon}</span> <span>${relic.name}</span>`;
      pill.title = `${relic.name}\n${relic.desc}\n(点击查看校园法宝全图鉴与实战用途)`;
      pill.addEventListener('click', () => {
        renderRelicsModal();
        showModal('relics');
      });
      relicsBar.appendChild(pill);
    });
  }

  function renderRelicsModal() {
    const ownedCountEl = document.getElementById('relics-modal-owned-count');
    if (ownedCountEl) ownedCountEl.textContent = game.state.relics.length;
    const grid = document.getElementById('relics-compendium-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const relicSources = {
      eraser_4b: { source: "【压线战神】初始自带专属 / 校门口打印店选购 (65元)", role: "控分核心：所有逆向扣分牌效果额外多扣除 2 分，微调大额降分更从容" },
      koi_wallpaper: { source: "【摆烂锦鲤】初始自带专属 / 校门口打印店选购 (75元)", role: "玄学神物：考场内所有随机事件（如骰子必掷6、偷瞄100%成功）必定触发最优大吉结果" },
      thermos: { source: "【通宵狂魔】初始自带专属 / 校门口打印店选购 (70元)", role: "护盾防御：每回合开始自动获得 5 点精神护盾，全程累计抵御 35~40 点精神折磨" },
      gold_pencil: { source: "校门口打印店选购 (80元) / 校园偶遇二手群淘宝", role: "精力回复：打出分值牌时 30% 几率返还 1 点考场精力，支持单回合 4~6 张牌连招" },
      noise_canceller: { source: "校门口打印店选购 (60元)", role: "减伤神技：监考老师巡视施压与倒计时交卷带来的精神伤害直接降低 50%" },
      power_bank: { source: "校门口打印店选购 (55元) / 宿舍突发断电断网事件", role: "经济与免疫：每天早晨自动白得 15 元生活费，且免疫白天断电断网负面惩罚" },
      senior_notes: { source: "校门口打印店选购 (90元) / 二手群手写密卷事件", role: "极速过线：每门考试开局卷面自动额外获得 12 分起评分（底分提升至 32 分）" },
      sugar_mint: { source: "校门口打印店选购 (50元)", role: "固定减伤：受到任何精神伤害时固定减免 2 点（最少至1点），配合护盾防守极其稳固" },
      meal_card: { source: "校门口打印店选购 (65元)", role: "双倍续航：白天在食堂与咖啡角摸鱼喝拿铁的恢复效果提升 100%（一杯回满64精神）" },
      gold_brain: { source: "校门口打印店高阶选购 (85元) / 走廊偶遇老导师称赞", role: "精力与过牌：考场精力上限永久 +2 点，每轮大考开局抽牌额外 +1 张（手牌达7~8张）" },
      energy_can: { source: "校门口打印店选购 (75元) / 疯狂星期四聚餐事件", role: "爆发精力：考场精力上限永久 +1 点，每门考试第一回合爆发获得额外 2 点精力" },
      insulated_mat: { source: "校门口打印店选购 (60元)", role: "心流补牌：每回合结束时若精力用尽为 0，下回合开局额外多抽 1 张牌" },
      booster_pack: { source: "校门口打印店常驻供应 (25元/次)", role: "抽卡扩卡：购买即拆！从全图鉴 64 种卡牌中随机抽取 1 张加入卡组，可反复购买" }
    };

    Object.values(GAME_DATA.relics).forEach(relic => {
      const isOwned = game.state.relics.includes(relic.id);
      const meta = relicSources[relic.id] || { source: "校门口打印店选购", role: relic.desc };
      const cardEl = document.createElement('div');
      cardEl.className = 'relic-compendium-card';
      cardEl.style.background = isOwned ? '#f0fdf4' : '#fff';
      cardEl.style.border = isOwned ? '2px solid #22c55e' : '1.5px solid #cbd5e1';
      cardEl.style.borderRadius = '12px';
      cardEl.style.padding = '12px 14px';
      cardEl.style.display = 'flex';
      cardEl.style.flexDirection = 'column';
      cardEl.style.gap = '6px';
      cardEl.style.boxShadow = '0 2px 6px rgba(0,0,0,0.06)';

      cardEl.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:24px;">${relic.icon}</span>
            <span style="font-weight:800; font-size:14px; color:#1e293b;">${relic.name}</span>
          </div>
          <span style="font-size:11px; font-weight:700; padding:2px 8px; border-radius:12px; ${isOwned ? 'background:#dcfce7; color:#15803d;' : 'background:#f1f5f9; color:#64748b;'}">
            ${isOwned ? '🟢 已装备' : `💰 ${relic.price}元`}
          </span>
        </div>
        <div style="font-size:12.5px; color:#334155; line-height:1.5; margin-top:2px;">
          ${relic.desc}
        </div>
        <div style="background:${isOwned ? '#dcfce7' : '#f8fafc'}; border-radius:6px; padding:6px 8px; font-size:11.5px; margin-top:4px;">
          <div style="color:#0f766e; font-weight:700;">💡 实战用途：<span style="font-weight:400; color:#334155;">${meta.role}</span></div>
          <div style="color:#b45309; font-weight:700; margin-top:3px;">🛒 获得途径：<span style="font-weight:400; color:#475569;">${meta.source}</span></div>
        </div>
      `;
      grid.appendChild(cardEl);
    });
  }

  function renderDayCampus(state) {
    const subject = game.getTodaySubject();
    if (state.isEndless) {
      document.getElementById('campus-subject-name').textContent = `🔥《${subject.name}》`;
      document.getElementById('banner-exam-name').textContent = `今晚无尽大考：${subject.name}`;
      document.getElementById('banner-exam-diff').textContent = `★★★★★ (连胜: ${state.endlessStreak}场)`;
      document.getElementById('banner-exam-desc').textContent = subject.desc + ` ⚠️ 监考折磨伤害阶梯强化 +${state.endlessStreak * 2} 点！`;
    } else if (subject) {
      document.getElementById('campus-subject-name').textContent = `《${subject.name}》`;
      document.getElementById('banner-exam-name').textContent = `今晚大考：《${subject.name}》`;
      document.getElementById('banner-exam-diff').textContent = subject.difficulty;
      document.getElementById('banner-exam-desc').textContent = subject.desc;
    }
    const valSpan = document.getElementById('cafe-max-energy-val');
    if (valSpan) valSpan.textContent = game.getEffectiveMaxEnergy();
    document.getElementById('campus-ap-text').textContent = `⚡ ${state.dayAp} / ${state.maxDayAp}`;
  }

  let lastExamState = { score: null, san: null, shield: null };

  function renderNightExam(state) {
    const exam = state.exam;
    if (!exam) return;

    // Header info
    if (state.isEndless) {
      document.getElementById('exam-subject-title').innerHTML = `<span style="color:#dc2626;">🔥【无尽第 ${state.day - 7} 场】</span>《${exam.subject.name}》 <span style="font-size:12px; color:#b45309; font-weight:700;">(连胜: ${state.endlessStreak} 场)</span>`;
    } else {
      document.getElementById('exam-subject-title').textContent = `《${exam.subject.name}》`;
    }
    document.getElementById('exam-turn-display').textContent = `第 ${exam.turn} / ${exam.maxTurns} 回合`;

    // Teacher Intent & Damage Preview Calculation
    const intent = exam.intent;
    const calcTag = document.getElementById('intent-calc-preview');
    if (intent) {
      document.getElementById('teacher-intent-title').textContent = `监考意图：${intent.name}`;
      document.getElementById('teacher-intent-desc').textContent = intent.desc;
      
      if (calcTag) {
        if (intent.type === 'stress' || intent.type === 'countdown') {
          let actualDmg = intent.val;
          if (state.relics.includes('noise_canceller')) actualDmg = Math.ceil(actualDmg * 0.5);
          if (state.relics.includes('sugar_mint')) actualDmg = Math.max(1, actualDmg - 2);
          const netDmg = Math.max(0, actualDmg - exam.shield);
          calcTag.innerHTML = `⚠️ 预计精神折磨: <b>${actualDmg}</b> 点 (当前护盾 <b>${exam.shield}</b> 抵消，预计扣除: <b style="color:#dc2626;">${netDmg}</b> 精神)`;
        } else if (intent.type === 'bonus') {
          calcTag.innerHTML = `📈 预计强制送分: <b style="color:#2563eb;">+${intent.val}</b> 分 (小心控分超标！)`;
        } else if (intent.type === 'subScore') {
          calcTag.innerHTML = `📉 预计倒扣卷面: <b style="color:#dc2626;">-${intent.val}</b> 分 (若扣至0以下将擦破答题卡)`;
        } else if (intent.type === 'randomFluctuate' || intent.type === 'randomDrift') {
          calcTag.innerHTML = `🎲 正态分布扰动: <b style="color:#d97706;">±${intent.val}</b> 分随机波动`;
        } else if (intent.type === 'discard') {
          calcTag.innerHTML = `🗑️ 生词干扰弃牌: 预计随机丢弃 <b style="color:#dc2626;">${intent.val}</b> 张手牌`;
        } else if (intent.type === 'energyLock' || intent.type === 'lockEnergy') {
          calcTag.innerHTML = `🔒 逻辑死锁限制: 下回合可用精力减少 <b style="color:#dc2626;">${intent.val}</b> 点`;
        }
      }
    }

    // Core Score Board & Score Floating Text
    const currentScoreEl = document.getElementById('exam-score-current');
    if (lastExamState.score !== null && lastExamState.score !== exam.score) {
      const diff = exam.score - lastExamState.score;
      if (diff > 0) {
        spawnFloatingNumber(`+${diff} 分`, '#2563eb', currentScoreEl);
      } else {
        spawnFloatingNumber(`${diff} 分`, '#dc2626', currentScoreEl);
      }
    }
    currentScoreEl.textContent = exam.score;
    const scoreBoardEl = currentScoreEl.closest('.score-board');
    if (exam.score === 60) {
      currentScoreEl.classList.add('is-perfect');
      if (scoreBoardEl) scoreBoardEl.classList.add('is-perfect');
    } else {
      currentScoreEl.classList.remove('is-perfect');
      if (scoreBoardEl) scoreBoardEl.classList.remove('is-perfect');
    }

    // Score Status Pill
    const pill = document.getElementById('score-status-pill');
    const submitBtn = document.getElementById('btn-submit-paper');
    if (exam.score === 60) {
      pill.className = 'score-status-pill perfect';
      pill.innerHTML = '🎯 刚好60分！神级控分！随时点击【提前交卷】！';
      submitBtn.classList.add('pulse-ready');
    } else if (exam.score < 60) {
      pill.className = 'score-status-pill below';
      pill.innerHTML = `🎯 还差 ${60 - exam.score} 分刚好及格`;
      submitBtn.classList.remove('pulse-ready');
    } else {
      pill.className = 'score-status-pill above';
      pill.innerHTML = `⚠️ 警告：已超分 +${exam.score - 60} 分！(快用橡皮擦逆向控分)`;
      submitBtn.classList.remove('pulse-ready');
    }

    // Gauge fill bar
    const fillPercent = Math.min(100, (exam.score / 100) * 100);
    document.getElementById('score-fill-bar').style.width = `${fillPercent}%`;

    // Combat Stats (Sanity, Shield, Low-SAN Panic Alert)
    const sanTextEl = document.getElementById('exam-san-text');
    const statsBox = document.getElementById('exam-player-stats-box');
    if (lastExamState.san !== null && lastExamState.san !== state.san) {
      const sanDiff = state.san - lastExamState.san;
      if (sanDiff < 0) {
        spawnFloatingNumber(`${sanDiff} 精神`, '#dc2626', sanTextEl);
      } else {
        spawnFloatingNumber(`+${sanDiff} 精神`, '#10b981', sanTextEl);
      }
    }
    sanTextEl.textContent = `${state.san}/${state.maxSan}`;

    // Low-SAN visual warning (< 30%)
    if (state.san <= 30) {
      statsBox.classList.add('is-panic');
    } else {
      statsBox.classList.remove('is-panic');
    }

    // Shield Display
    const shieldBadge = document.getElementById('exam-shield-badge');
    if (lastExamState.shield !== null && exam.shield > lastExamState.shield) {
      const shieldDiff = exam.shield - lastExamState.shield;
      spawnFloatingNumber(`🛡️ +${shieldDiff} 护盾`, '#059669', shieldBadge);
    }
    if (exam.shield > 0) {
      shieldBadge.style.display = 'inline-block';
      shieldBadge.textContent = `🛡️ 护盾 +${exam.shield}`;
    } else {
      shieldBadge.style.display = 'none';
    }

    // Update last tracking state
    lastExamState = { score: exam.score, san: state.san, shield: exam.shield };

    // Energy Orbs and Numeric Text
    const energyNumEl = document.getElementById('exam-energy-num');
    if (energyNumEl) {
      energyNumEl.textContent = `${exam.energy} / ${exam.maxEnergy}`;
    }
    const orbsContainer = document.getElementById('energy-orbs-container');
    orbsContainer.innerHTML = '';
    const totalOrbs = Math.max(exam.maxEnergy, exam.energy);
    for (let i = 0; i < totalOrbs; i++) {
      const orb = document.createElement('div');
      const isBonus = i >= exam.maxEnergy;
      const isActive = i < exam.energy;
      orb.className = `energy-orb ${isActive ? 'active' : ''} ${isBonus ? 'bonus' : ''}`;
      if (isBonus) orb.title = '额外爆发精力';
      orbsContainer.appendChild(orb);
    }

    // Piles
    document.getElementById('draw-pile-count').textContent = exam.drawPile.length;
    document.getElementById('discard-pile-count').textContent = exam.discardPile.length;
    document.getElementById('exhaust-pile-count').textContent = exam.exhaustPile.length;

    // Hand Cards
    const handContainer = document.getElementById('hand-container');
    handContainer.innerHTML = '';
    exam.hand.forEach((cardId, index) => {
      const card = GAME_DATA.cards[cardId];
      if (!card) return;
      const canPlay = exam.energy >= card.cost;
      const cardEl = createCardElement(card, index, canPlay);
      cardEl.addEventListener('click', () => {
        if (!canPlay) {
          window.sounds.playDamage();
          showToast(`精力不足！打出【${card.name}】需要 ${card.cost} 点精力，当前仅剩 ${exam.energy} 点！`, 'warning');
          return;
        }
        game.playCard(index);
      });
      handContainer.appendChild(cardEl);
    });

    // Battle Log
    const ticker = document.getElementById('battle-log-ticker');
    if (exam.examLog.length > 0) {
      ticker.innerHTML = exam.examLog.slice(-4).map(l => `<div>${l}</div>`).join('');
      ticker.scrollTop = ticker.scrollHeight;
    }
  }

  function spawnFloatingNumber(text, color, targetEl) {
    if (!targetEl) return;
    const rect = targetEl.getBoundingClientRect();
    const floatEl = document.createElement('div');
    floatEl.className = 'floating-combat-number';
    floatEl.style.color = color;
    floatEl.textContent = text;
    floatEl.style.left = `${rect.left + rect.width / 2}px`;
    floatEl.style.top = `${rect.top - 10}px`;
    document.body.appendChild(floatEl);

    setTimeout(() => {
      floatEl.remove();
    }, 1100);
  }

  function createCardElement(card, index, canPlay = true, statusBadge = null) {
    const el = document.createElement('div');
    el.className = `card-item type-${card.type} ${!canPlay ? 'disabled' : ''}`;
    let badgeHtml = '';
    if (statusBadge) {
      badgeHtml = `<div class="card-status-badge ${statusBadge.type || ''}">${statusBadge.text}</div>`;
    }
    el.innerHTML = `
      <div class="card-cost">${card.cost}</div>
      ${badgeHtml}
      <div class="card-top">
        <span class="card-icon">${card.icon}</span>
        <span class="card-name">${card.name}</span>
      </div>
      <div class="card-type-tag">${card.typeName}</div>
      <div class="card-body">${card.desc}</div>
    `;
    return el;
  }

  function renderSettlement(state) {
    const set = state.settlement;
    if (!set) return;

    if (state.isEndless) {
      document.getElementById('settlement-subject-tag').textContent = `🔥 无尽修罗场 · 第 ${state.day - 7} 场放榜 (连胜: ${state.endlessStreak})`;
    } else {
      document.getElementById('settlement-subject-tag').textContent = `第 ${state.day} 天 · 《${set.subjectName}》放榜`;
    }
    document.getElementById('settlement-title').textContent = set.ratingTitle;
    document.getElementById('settlement-score-big').innerHTML = `${set.score} <span style="font-size:18px; color:#64748b;">分</span>`;
    document.getElementById('settlement-desc').textContent = set.ratingDesc;

    // Stamp
    const stamp = document.getElementById('settlement-stamp');
    if (set.score === 60) {
      stamp.className = 'stamp-seal';
      stamp.innerHTML = '<div>神级控分</div><div style="font-size:16px;">60及格</div>';
      launchConfetti();
    } else if (set.isPassed) {
      stamp.className = 'stamp-seal';
      stamp.innerHTML = '<div>教务处</div><div style="font-size:16px;">及格</div>';
    } else {
      stamp.className = 'stamp-seal failed';
      stamp.innerHTML = '<div>挂科</div><div style="font-size:14px;">补考重修</div>';
    }

    // Deltas
    const sanDeltaEl = document.getElementById('settlement-san-delta');
    if (set.sanDelta > 0) {
      sanDeltaEl.textContent = `+${set.sanDelta} (心满意足)`;
      sanDeltaEl.style.color = '#10b981';
    } else if (set.sanDelta < 0) {
      sanDeltaEl.textContent = `${set.sanDelta} (身心受损)`;
      sanDeltaEl.style.color = '#ef4444';
    } else {
      sanDeltaEl.textContent = '无变动';
      sanDeltaEl.style.color = '#64748b';
    }

    const moneyDeltaEl = document.getElementById('settlement-money-delta');
    moneyDeltaEl.textContent = `+${set.moneyDelta}元 生活费`;

    // Reward Cards Section
    const rewardSection = document.getElementById('reward-section');
    const rewardCardsRow = document.getElementById('reward-cards-row');
    rewardCardsRow.innerHTML = '';

    if (set.isPassed && state.cardRewardOptions && state.cardRewardOptions.length > 0) {
      rewardSection.style.display = 'flex';
      state.cardRewardOptions.forEach(cardId => {
        const card = GAME_DATA.cards[cardId];
        if (!card) return;
        const cardEl = createCardElement(card, -1, true);
        cardEl.addEventListener('click', () => {
          game.chooseCardReward(cardId);
          rewardSection.style.display = 'none';
        });
        rewardCardsRow.appendChild(cardEl);
      });
    } else {
      rewardSection.style.display = 'none';
    }

    // Next button text
    const nextBtn = document.getElementById('btn-next-day');
    if (state.isEndless) {
      nextBtn.textContent = `🔥 迎战下一场无尽大考 (当前连胜: ${(state.endlessStreak || 0) + 1})`;
    } else {
      nextBtn.textContent = state.day >= 7 ? '🎓 查看期末总战报' : `🌅 继续第 ${state.day + 1} 天备考`;
    }
  }

  function renderGameOver(state) {
    const set = state.settlement;
    if (set) {
      document.getElementById('gameover-title').textContent = set.ratingTitle;
      document.getElementById('gameover-reason').textContent = set.ratingDesc;
      if (state.isEndless) {
        document.getElementById('gameover-detail').textContent = `在无尽修罗场中斩获了连续通过 ${state.endlessStreak || 0} 门高难考试的骄人战绩！`;
      } else {
        document.getElementById('gameover-detail').textContent = `在第 ${state.day} 天的《${set.subjectName}》中遗憾退学。`;
      }
    }
  }

  function renderVictory(state) {
    const list = document.getElementById('victory-summary-list');
    list.innerHTML = '';

    let perfectCount = 0;
    state.passedSubjects.forEach(sub => {
      if (sub.score === 60) perfectCount++;
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.justifyContent = 'space-between';
      row.style.padding = '5px 0';
      row.style.borderBottom = '1px dashed #f1f5f9';
      const is60 = sub.score === 60;
      row.innerHTML = `
        <span style="color:#334155;">第${sub.day}天 《${sub.name}》</span>
        <span style="font-weight:700; color:${is60 ? '#d97706' : '#15803d'};">
          ${sub.score}分 ${is60 ? '🎯 [精准60]' : '✓ [及格]'}
        </span>
      `;
      list.appendChild(row);
    });

    // Calculate Tier
    let tierTitle = '';
    let tierDesc = '';
    let tierColor = '#166534';
    let borderColor = '#22c55e';

    if (perfectCount === 7) {
      tierTitle = '🌟 SSS · 及格线之神';
      tierDesc = '【天选躺平人】7 门必修大考全部 60 分精准压线绝杀！多一分精力没浪费，少一分也没挂科，你达成了大学校园传说中的最高境界！教务处奉你为神！';
      tierColor = '#b45309';
      borderColor = '#f59e0b';
    } else if (perfectCount >= 4) {
      tierTitle = '🥇 S · 考场控分大师';
      tierDesc = `【游刃有余】7 门考试中有 ${perfectCount} 门精准命中 60 分压线绝杀，其余科目均稳健及格！你对期末考卷分数的掌控力已炉火纯青！`;
      tierColor = '#047857';
      borderColor = '#10b981';
    } else if (perfectCount >= 1) {
      tierTitle = '🥈 A · 稳健实用主义者';
      tierDesc = `【实力上岸】成功及格通过全部 7 门大考，其中 ${perfectCount} 门达成精准 60 分！既不过度内卷，也不摆烂挂科，顺利升学！`;
      tierColor = '#1d4ed8';
      borderColor = '#3b82f6';
    } else {
      tierTitle = '🥉 B · 惊险上岸人';
      tierDesc = '【惊险过关】虽然过程几度徘徊在挂科边缘，但你顽强守住了全部学分，7门必修全部及格上岸！毕业快乐！';
      tierColor = '#475569';
      borderColor = '#94a3b8';
    }

    const tierTitleEl = document.getElementById('victory-tier-title');
    const tierDescEl = document.getElementById('victory-tier-desc');
    const tierBoxEl = document.getElementById('victory-tier-box');
    if (tierTitleEl) {
      tierTitleEl.textContent = tierTitle;
      tierTitleEl.style.color = tierColor;
    }
    if (tierDescEl) {
      tierDescEl.textContent = tierDesc;
    }
    if (tierBoxEl) {
      tierBoxEl.style.borderColor = borderColor;
    }

    const statSubEl = document.getElementById('victory-stats-sub');
    if (statSubEl) {
      statSubEl.textContent = `🎯 精准控分 60 分命中率：${perfectCount} / 7 门 (剩余重修券: ${state.retakes}，结余生活费: ${state.money}元)`;
    }

    launchConfetti();
  }

  function renderEventModal(ev) {
    document.getElementById('event-title').textContent = ev.title;
    document.getElementById('event-icon').textContent = ev.icon;
    document.getElementById('event-desc').textContent = ev.desc;

    const optsList = document.getElementById('event-options-list');
    optsList.innerHTML = '';

    ev.options.forEach((opt, idx) => {
      const btn = document.createElement('div');
      btn.className = 'event-option-btn';
      btn.innerHTML = `
        <div class="opt-text">${opt.text}</div>
        <div class="opt-effect">${opt.effectDesc}</div>
      `;
      btn.addEventListener('click', () => {
        window.sounds.playClick();
        const res = game.chooseEventOption(idx);
        if (res) {
          showToast(res, 'info');
        }
        game.closeEventModal();
      });
      optsList.appendChild(btn);
    });
  }

  function renderShopModal() {
    document.getElementById('shop-money-text').textContent = game.state.money;
    const list = document.getElementById('shop-items-list');
    list.innerHTML = '';

    if (game.state.dayShopRelics.length === 0) {
      list.innerHTML = '<div style="text-align:center; color:#94a3b8; padding:20px;">今日特供法宝已全部售罄！</div>';
      return;
    }

    game.state.dayShopRelics.forEach(id => {
      const relic = GAME_DATA.relics[id];
      if (!relic) return;
      const canBuy = game.state.money >= relic.price;
      const itemEl = document.createElement('div');
      itemEl.className = 'shop-item-card';
      itemEl.innerHTML = `
        <div class="shop-item-left">
          <div class="shop-item-icon">${relic.icon}</div>
          <div>
            <div class="shop-item-title">${relic.name}</div>
            <div class="shop-item-desc">${relic.desc}</div>
          </div>
        </div>
        <button class="btn ${canBuy ? 'btn-gold' : 'btn-outline'}" style="padding:6px 12px; font-size:12px;">
          💰 ${relic.price}元
        </button>
      `;
      itemEl.querySelector('button').addEventListener('click', () => {
        if (!canBuy) {
          showToast('生活费不足！', 'warning');
          return;
        }
        if (id === 'booster_pack') {
          const newCard = game.buyMysteryBooster(relic.price);
          if (newCard) {
            showToast(`📦 恭喜打开考前划重点盲盒！获得了新卡牌：【${newCard.name}】(${newCard.typeName})！已收录入卡组！`, 'success');
            renderShopModal();
          }
          return;
        }
        if (game.buyRelic(id)) {
          showToast(`✨ 成功购买法宝【${relic.name}】！`, 'success');
        }
        renderShopModal();
      });
      list.appendChild(itemEl);
    });
  }

  function updateDeckModalTabsUI() {
    const tabsContainer = document.getElementById('deck-tabs-container');
    if (tabsContainer) tabsContainer.style.display = 'flex';

    const tabDeckBtn = document.getElementById('tab-btn-current-deck');
    const tabAllBtn = document.getElementById('tab-btn-all-cards');
    const filterBar = document.getElementById('compendium-filter-bar');
    const bannerTip = document.getElementById('compendium-banner-tip');
    const removeTip = document.getElementById('deck-remove-tip');

    // Counts
    const deckCountEl = document.getElementById('deck-tab-count');
    const compUnlockedEl = document.getElementById('compendium-unlocked-count');
    const compTotalEl = document.getElementById('compendium-total-count');

    const totalCardsCount = Object.keys(GAME_DATA.cards).length;
    const uniqueCardsInDeck = new Set(game.state.deck).size;

    if (deckCountEl) deckCountEl.textContent = game.state.deck.length;
    if (compUnlockedEl) compUnlockedEl.textContent = uniqueCardsInDeck;
    if (compTotalEl) compTotalEl.textContent = totalCardsCount;

    if (currentDeckModalTab === 'current') {
      if (tabDeckBtn) {
        tabDeckBtn.className = 'tab-btn active';
        tabDeckBtn.style.background = '#2563eb';
        tabDeckBtn.style.color = '#fff';
      }
      if (tabAllBtn) {
        tabAllBtn.className = 'tab-btn';
        tabAllBtn.style.background = '#f8fafc';
        tabAllBtn.style.color = '#475569';
      }
      if (filterBar) filterBar.style.display = 'none';
      if (bannerTip) bannerTip.style.display = 'none';
      if (removeTip) removeTip.style.display = isDeckRemoveMode ? 'block' : 'none';
      document.getElementById('deck-modal-title').textContent = isDeckRemoveMode 
        ? '✂️ 整理笔记（点击卡牌移除）' 
        : `🎴 当前卡组全览 (共 ${game.state.deck.length} 张)`;
    } else {
      if (tabDeckBtn) {
        tabDeckBtn.className = 'tab-btn';
        tabDeckBtn.style.background = '#f8fafc';
        tabDeckBtn.style.color = '#475569';
      }
      if (tabAllBtn) {
        tabAllBtn.className = 'tab-btn active';
        tabAllBtn.style.background = '#2563eb';
        tabAllBtn.style.color = '#fff';
      }
      if (filterBar) filterBar.style.display = 'flex';
      if (bannerTip) bannerTip.style.display = 'block';
      if (removeTip) removeTip.style.display = 'none';
      document.getElementById('deck-modal-title').textContent = `📚 大学期末卡牌全图鉴 (共 ${totalCardsCount} 种策略牌)`;
    }
  }

  function renderDeckModal() {
    updateDeckModalTabsUI();
    const grid = document.getElementById('deck-view-grid');
    grid.innerHTML = '';

    if (currentDeckModalTab === 'current') {
      if (game.state.deck.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:#94a3b8; padding:30px;">当前卡组暂无卡牌</div>';
        return;
      }
      const deckCounts = {};
      game.state.deck.forEach(id => {
        deckCounts[id] = (deckCounts[id] || 0) + 1;
      });

      game.state.deck.forEach((cardId, index) => {
        const card = GAME_DATA.cards[cardId];
        if (!card) return;
        const count = deckCounts[cardId] || 1;
        const badge = count > 1 ? { type: 'in-deck', text: `在卡组中 ×${count}` } : { type: 'in-deck', text: '在卡组中' };
        const cardEl = createCardElement(card, index, true, badge);
        if (isDeckRemoveMode) {
          cardEl.style.cursor = 'pointer';
          cardEl.title = `点击花费 30 元永久移除【${card.name}】`;
          cardEl.addEventListener('click', () => {
            if (confirm(`确定花费 30 元生活费永久移除【${card.name}】吗？`)) {
              if (game.state.dayAp < 1) {
                showToast('今日精力点已耗尽！请奔赴今晚考场！', 'warning');
                closeModal('deck');
                return;
              }
              if (game.state.money < 30) {
                showToast('生活费不足30元！', 'warning');
                return;
              }
              if (game.removeCardFromDeck(index, 30)) {
                game.useDayAp(1);
                closeModal('deck');
                showToast(`已成功移除【${card.name}】！卡组更加精炼！`, 'success');
              }
            }
          });
        }
        grid.appendChild(cardEl);
      });
    } else {
      renderCompendiumCards(grid);
    }
  }

  function renderCompendiumCards(grid) {
    const rareCardIds = ['reverse_mastery', 'curve_savior', 'adrenaline', 'crying_in_heart', 'double_espresso', 'peer_pressure_immune', 'all_in_rush', 'eraser_shred'];
    const allCards = Object.values(GAME_DATA.cards);

    const filtered = allCards.filter(card => {
      const inDeck = game.state.deck.includes(card.id);
      if (currentCompendiumFilter === 'all') return true;
      if (currentCompendiumFilter === 'in_deck') return inDeck;
      return card.type === currentCompendiumFilter;
    });

    if (filtered.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:#94a3b8; padding:30px;">未找到匹配分类的卡牌</div>';
      return;
    }

    filtered.forEach(card => {
      const countInDeck = game.state.deck.filter(id => id === card.id).length;
      let badge = null;
      if (countInDeck > 0) {
        badge = { type: 'in-deck', text: `已收录 ×${countInDeck}` };
      } else if (rareCardIds.includes(card.id)) {
        badge = { type: 'rare', text: '进阶秘策' };
      } else {
        badge = { type: 'unlocked', text: '已解锁·研读' };
      }

      const cardEl = createCardElement(card, -1, true, badge);
      cardEl.classList.add('compendium-card');
      grid.appendChild(cardEl);
    });
  }

  function openCardRewardModal(title, onChosen) {
    isDeckRemoveMode = false;
    const tabsContainer = document.getElementById('deck-tabs-container');
    if (tabsContainer) tabsContainer.style.display = 'none';
    const filterBar = document.getElementById('compendium-filter-bar');
    if (filterBar) filterBar.style.display = 'none';
    const bannerTip = document.getElementById('compendium-banner-tip');
    if (bannerTip) bannerTip.style.display = 'none';

    document.getElementById('deck-modal-title').textContent = title;
    document.getElementById('deck-remove-tip').style.display = 'none';
    const grid = document.getElementById('deck-view-grid');
    grid.innerHTML = '';

    game.state.cardRewardOptions.forEach(cardId => {
      const card = GAME_DATA.cards[cardId];
      if (!card) return;
      const cardEl = createCardElement(card, -1, true);
      cardEl.addEventListener('click', () => {
        game.chooseCardReward(cardId);
        closeModal('deck');
        if (onChosen) onChosen();
      });
      grid.appendChild(cardEl);
    });

    showModal('deck');
  }

  // =========================================================
  // Confetti Particle System
  // =========================================================
  function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 3,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.7) * 14,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        alpha: 1
      });
    }

    let animationFrame;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.rotation += p.rotSpeed;
        p.alpha -= 0.012;

        if (p.alpha > 0) {
          alive++;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (alive > 0) {
        animationFrame = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrame);
      }
    }
    render();
  }
});
