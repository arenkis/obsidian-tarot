const { Plugin, Notice, Modal } = require("obsidian");

module.exports = class TarotPlugin extends Plugin {
    spreads = {
      "Single Card": 1,
      "Three Card Spread": 3,
      "Celtic Cross": 10,
    };

    tarotDeck = this.generateTarotDeck();
    tarotMeanings = this.generateTarotMeanings();

  async onload() {
    console.log('Loading Tarot Plugin');

    // Add a command for drawing Tarot cards
    this.addCommand({
      id: 'tarot-draw',
      name: 'Draw Tarot Cards',
      callback: async () => {
        const selectedSpread = await this.selectSpread();
        if (!selectedSpread) {
          new Notice("No spread selected. Action canceled.");
          return;
        }

        const cardCount = this.spreads[selectedSpread];
        if (!cardCount) {
          new Notice("Invalid spread selected. Action canceled.");
          return;
        }

        const drawnCards = this.drawCards(cardCount);
        const markdown = this.generateMarkdown(selectedSpread, drawnCards);
        await this.appendToDailyNote(markdown);
      },
    });

    this.registerEvent(this.app.vault.on("create", async (file) => {
      if (this.isDailyNoteFile(file)) {
        const drawnCards = this.drawCards(3);
        const markdown = this.generateMarkdown("Three Card Spread", drawnCards);
        await this.appendToDailyNote(file, markdown);
      } else {
      }
    }));    
  }

  async onunload() {
    console.log("Unloading Tarot Plugin");
    new Notice("Tarot Plugin Unloaded!");
  }

  // Generate a standard tarot deck
  generateTarotDeck() {
    const suits = ["Wands", "Cups", "Swords", "Pentacles"];
    const ranks = [
      "Ace", "Two", "Three", "Four", "Five", 
      "Six", "Seven", "Eight", "Nine", "Ten", 
      "Page", "Knight", "Queen", "King"
    ];

    const majorArcana = [
      "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
      "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
      "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
      "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement",
      "The World"
    ];

    const deck = [];

    // Add Minor Arcana
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push(`${rank} of ${suit}`);
      }
    }

    // Add Major Arcana
    for (const card of majorArcana) {
      deck.push(card);
    }

    return deck;
  }

  // Generate tarot meanings
  generateTarotMeanings() {
    const minorArcanaMeanings = {
      "Ace of Wands": { upright: "creation, willpower, inspiration, desire", reversed: "lack of energy, lack of passion, boredom" },
      "Two of Wands": { upright: "planning, making decisions, leaving home", reversed: "fear of change, playing safe, bad planning" },
      "Three of Wands": { upright: "looking ahead, expansion, rapid growth", reversed: "obstacles, delays, frustration" },
      "Four of Wands": { upright: "community, home, celebration", reversed: "lack of support, transience, home conflicts" },
      "Five of Wands": { upright: "competition, rivalry, conflict", reversed: "avoiding conflict, respecting differences" },
      "Six of Wands": { upright: "victory, success, public reward", reversed: "excess pride, lack of recognition, punishment" },
      "Seven of Wands": { upright: "perseverance, defensive, maintaining control", reversed: "give up, destroyed confidence, overwhelmed" },
      "Eight of Wands": { upright: "rapid action, movement, quick decisions", reversed: "panic, waiting, slowdown" },
      "Nine of Wands": { upright: "resilience, grit, last stand", reversed: "exhaustion, fatigue, questioning motivations" },
      "Ten of Wands": { upright: "accomplishment, responsibility, burden", reversed: "inability to delegate, overstressed, burnt out" },
      "Page of Wands": { upright: "exploration, excitement, freedom", reversed: "lack of direction, procrastination, creating conflict" },
      "Knight of Wands": { upright: "action, adventure, fearlessness", reversed: "anger, impulsiveness, recklessness" },
      "Queen of Wands": { upright: "courage, determination, joy", reversed: "selfishness, jealousy, insecurities" },
      "King of Wands": { upright: "big picture, leader, overcoming challenges", reversed: "impulsive, overbearing, unachievable expectations" },
      "Ace of Cups": { upright: "new feelings, spirituality, intuition", reversed: "emotional loss, blocked creativity, emptiness" },
      "Two of Cups": { upright: "unity, partnership, connection", reversed: "imbalance, broken communication, tension" },
      "Three of Cups": { upright: "friendship, community, happiness", reversed: "overindulgence, gossip, isolation" },
      "Four of Cups": { upright: "apathy, contemplation, disconnectedness", reversed: "sudden awareness, choosing happiness, acceptance" },
      "Five of Cups": { upright: "loss, grief, self-pity", reversed: "acceptance, moving on, finding peace" },
      "Six of Cups": { upright: "familiarity, happy memories, healing", reversed: "moving forward, leaving home, independence" },
      "Seven of Cups": { upright: "searching for purpose, choices, daydreaming", reversed: "lack of purpose, diversion, confusion" },
      "Eight of Cups": { upright: "walking away, disillusionment, leaving behind", reversed: "avoidance, fear of change, fear of loss" },
      "Nine of Cups": { upright: "satisfaction, emotional stability, luxury", reversed: "lack of inner joy, smugness, dissatisfaction" },
      "Ten of Cups": { upright: "inner happiness, fulfillment, dreams coming true", reversed: "shattered dreams, broken family, domestic disharmony" },
      "Page of Cups": { upright: "happy surprise, dreamer, sensitivity", reversed: "emotional immaturity, insecurity, disappointment" },
      "Knight of Cups": { upright: "following the heart, idealist, romantic", reversed: "moodiness, disappointment" },
      "Queen of Cups": { upright: "compassion, calm, comfort", reversed: "martyrdom, insecurity, dependence" },
      "King of Cups": { upright: "compassion, control, balance", reversed: "coldness, moodiness, bad advice" },
      "Ace of Swords": { upright: "breakthrough, clarity, sharp mind", reversed: "confusion, brutality, chaos" },
      "Two of Swords": { upright: "difficult choices, indecision, stalemate", reversed: "lesser of two evils, no right choice, confusion" },
      "Three of Swords": { upright: "heartbreak, suffering, grief", reversed: "recovery, forgiveness, moving on" },
      "Four of Swords": { upright: "rest, restoration, contemplation", reversed: "restlessness, burnout, stress" },
      "Five of Swords": { upright: "unbridled ambition, win at all costs, sneakiness", reversed: "lingering resentment, desire to reconcile, forgiveness" },
      "Six of Swords": { upright: "transition, leaving behind, moving on", reversed: "emotional baggage, unresolved issues, resisting transition" },
      "Seven of Swords": { upright: "deception, trickery, tactics and strategy", reversed: "coming clean, rethinking approach, deception" },
      "Eight of Swords": { upright: "imprisonment, entrapment, self-victimization", reversed: "self acceptance, new perspective, freedom" },
      "Nine of Swords": { upright: "anxiety, hopelessness, trauma", reversed: "hope, reaching out, despair" },
      "Ten of Swords": { upright: "failure, collapse, defeat", reversed: "can't get worse, only upwards, inevitable end" },
      "Page of Swords": { upright: "curiosity, restlessness, mental energy", reversed: "deception, manipulation, all talk" },
      "Knight of Swords": { upright: "action, impulsiveness, defending beliefs", reversed: "no direction, disregard for consequences, unpredictability" },
      "Queen of Swords": { upright: "complexity, perceptiveness, clear mindedness", reversed: "cold hearted, cruel, bitterness" },
      "King of Swords": { upright: "head over heart, discipline, truth", reversed: "manipulative, cruel, weakness" },
      "Ace of Pentacles": { upright: "opportunity, prosperity, new venture", reversed: "lost opportunity, missed chance, bad investment" },
      "Two of Pentacles": { upright: "balancing decisions, priorities, adapting to change", reversed: "loss of balance, disorganized, overwhelmed" },
      "Three of Pentacles": { upright: "teamwork, collaboration, building", reversed: "lack of teamwork, disorganized, group conflict" },
      "Four of Pentacles": { upright: "conservation, frugality, security", reversed: "greediness, stinginess, possessiveness" },
      "Five of Pentacles": { upright: "need, poverty, insecurity", reversed: "recovery, charity, improvement" },
      "Six of Pentacles": { upright: "charity, generosity, sharing", reversed: "strings attached, stinginess, power and domination" },
      "Seven of Pentacles": { upright: "hard work, perseverance, diligence", reversed: "work without results, distractions, lack of rewards" },
      "Eight of Pentacles": { upright: "apprenticeship, passion, high standards", reversed: "lack of passion, uninspired, no motivation" },
      "Nine of Pentacles": { upright: "fruits of labor, rewards, luxury", reversed: "reckless spending, living beyond means, false success" },
      "Ten of Pentacles": { upright: "legacy, culmination, inheritance", reversed: "fleeting success, lack of stability, lack of resources" },
      "Page of Pentacles": { upright: "ambition, desire, diligence", reversed: "lack of commitment, greediness, laziness" },
      "Knight of Pentacles": { upright: "efficiency, hard work, responsibility", reversed: "laziness, obsessiveness, work without reward" },
      "Queen of Pentacles": { upright: "practicality, creature comforts, financial security", reversed: "self-centeredness, jealousy, smothering" },
      "King of Pentacles": { upright: "abundance, prosperity, security", reversed: "greed, indulgence, sensuality" }
    };

    const majorArcanaMeanings = {
      "The Fool": { upright: "innocence, new beginnings, free spirit", reversed: "recklessness, taken advantage of, inconsideration" },
      "The Magician": { upright: "willpower, desire, creation, manifestation", reversed: "trickery, illusions, out of touch" },
      "The High Priestess": { upright: "intuitive, unconscious, inner voice", reversed: "lack of center, lost inner voice, repressed feelings" },
      "The Empress": { upright: "motherhood, fertility, nature", reversed: "dependence, smothering, emptiness, nosiness" },
      "The Emperor": { upright: "authority, structure, control, fatherhood", reversed: "tyranny, rigidity, coldness" },
      "The Hierophant": { upright: "tradition, conformity, morality, ethics", reversed: "rebellion, subversiveness, new approaches" },
      "The Lovers": { upright: "partnerships, duality, union", reversed: "loss of balance, one-sidedness, disharmony" },
      "The Chariot": { upright: "direction, control, willpower", reversed: "lack of control, lack of direction, aggression" },
      "Strength": { upright: "inner strength, bravery, compassion, focus", reversed: "self doubt, weakness, insecurity" },
      "The Hermit": { upright: "contemplation, search for truth, inner guidance", reversed: "loneliness, isolation, lost your way" },
      "Wheel of Fortune": { upright: "change, cycles, inevitable fate", reversed: "no control, clinging to control, bad luck" },
      "Justice": { upright: "cause and effect, clarity, truth", reversed: "dishonesty, unaccountability, unfairness" },
      "The Hanged Man": { upright: "sacrifice, release, martyrdom", reversed: "stalling, needless sacrifice, fear of sacrifice" },
      "Death": { upright: "end of cycle, beginnings, change, metamorphosis", reversed: "fear of change, holding on, stagnation, decay" },
      "Temperance": { upright: "middle path, patience, finding meaning", reversed: "extremes, excess, lack of balance" },
      "The Devil": { upright: "addiction, materialism, playfulness", reversed: "freedom, release, restoring control" },
      "The Tower": { upright: "sudden upheaval, broken pride, disaster", reversed: "disaster avoided, delayed disaster, fear of suffering" },
      "The Star": { upright: "hope, faith, rejuvenation", reversed: "faithlessness, discouragement, insecurity" },
      "The Moon": { upright: "unconscious, illusions, intuition", reversed: "confusion, fear, misinterpretation" },
      "The Sun": { upright: "joy, success, celebration, positivity", reversed: "negativity, depression, sadness" },
      "Judgement": { upright: "reflection, reckoning, awakening", reversed: "lack of self awareness, doubt, self loathing" },
      "The World": { upright: "fulfillment, harmony, completion", reversed: "incompletion, no closure" },
    };

    return { ...majorArcanaMeanings, ...minorArcanaMeanings };
  }

  // Shuffle the deck
  shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  // Draw cards from the deck
  drawCards(count) {
    const shuffledDeck = this.shuffleDeck([...this.tarotDeck]);
    return shuffledDeck.slice(0, count);
  }

  // Show modal to select a tarot spread
  async selectSpread() {
    return new Promise((resolve) => {
      const modal = new Modal(this.app);
      modal.titleEl.setText("Select a Tarot Spread");

      Object.keys(this.spreads).forEach((spread) => {
        const button = modal.contentEl.createEl("button", { text: spread });
        button.onclick = () => {
          modal.close();
          resolve(spread);
        };
      });

      modal.open();
    });
  }

  generateMarkdown(spreadName, cards) {
    return `> [!INFO] Tarot: ${spreadName}
  >
  ${cards
      .map((card, index) => {
        const meaning = this.tarotMeanings[card] || {
          upright: "Meaning not available",
          reversed: "Meaning not available",
        };
        // Randomly pick upright or reversed
        const orientation = Math.random() > 0.5 ? "Upright" : "Reversed";
  
        return `> ${index + 1}. **${card}** (${orientation}): ${meaning[orientation.toLowerCase()]}`;
      })
      .join("\n")}\n\n---`;
  }  

  async appendToDailyNote(file, markdownText) {
    try {
      const content = await this.app.vault.read(file);
  
      // Avoid appending duplicate content
      if (content.includes("# Tarot Reading:")) {
        console.log("Tarot Reading already added to the daily note.");
        return;
      }
  
      const updatedContent = `${content}\n\n${markdownText}`;
      await this.app.vault.modify(file, updatedContent);
    } catch (error) {
      console.error("Error appending to daily note:", error);
    }
  }  
  

  isDailyNoteFile(file) {
    const dailyNotesConfig = this.app.internalPlugins.plugins["daily-notes"]?.instance?.options;
    if (!dailyNotesConfig) {
      console.log("Daily Notes plugin is not enabled or misconfigured.");
      return false;
    }
  
    const dailyNoteFolder = dailyNotesConfig.folder || "Journal";
    const dateFormat = dailyNotesConfig.format || "YYYY-MM-DD";
    const today = window.moment().format(dateFormat);
  
    const expectedPath = `${dailyNoteFolder}/${today}.md`;
    const isDailyNote = file.path === expectedPath;
  
    return isDailyNote;
  }  
}