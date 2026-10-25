/* Shared helpers: randomness, the activity log, and HTML escaping. */
"use strict";
(function () {
  const PM = (window.PM = window.PM || {});

  PM.logs = [];

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function choice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function weightedChoice(items) {
    const total = items.reduce((s, entry) => s + entry[1], 0);
    let r = Math.random() * total;
    for (const [item, weight] of items) {
      r -= weight;
      if (r <= 0) return item;
    }
    return items[0][0];
  }

  function log(msg) {
    PM.logs.push(msg);
    if (PM.logs.length > 500) PM.logs.shift();
    PM.renderLog();
  }

  /* The merchant rank ladder, shared by the endgame screen and the final log. */
  function ratingFor(score) {
    const ratings = PM.lang.ui.ratings;
    if (score >= 300) return ratings.king;
    if (score >= 200) return ratings.tycoon;
    if (score >= 100) return ratings.merchant;
    if (score >= 50) return ratings.trader;
    return ratings.novice;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /* Icon system: the game's glyphs are Material Symbols, rendered through
     the self hosted ligature font. Each distinct source glyph maps to one
     unique Material Symbol name, so no two icons repeat. Keys are the
     variation selector stripped forms; iconize() strips the selector before
     looking one up. */
  const ICON_MAP = {
    "\u{1F4B0}": "payments",
    "\u{1F6A2}": "directions_ferry",
    "\u2693": "anchor",
    "\u2705": "check_circle",
    "\u{1F504}": "sync",
    "\u26A0": "warning",
    "\u{1F465}": "groups",
    "\u274C": "cancel",
    "\u{1F527}": "build",
    "\u{1F4E6}": "inventory_2",
    "\u{1F9FE}": "receipt_long",
    "\u{1F4B8}": "receipt",
    "\u{1F30A}": "directions_boat",
    "\u{1F3C6}": "emoji_events",
    "\u{1F4A1}": "lightbulb",
    "\u{1F4CA}": "bar_chart",
    "\u{1F52E}": "auto_awesome",
    "\u{1F338}": "local_florist",
    "\u{1F469}\u200D\u{1F3A8}": "palette",
    "\u{1F469}\u200D\u{1F527}": "diversity_2",
    "\u{1F91D}": "handshake",
    "\u{1F9ED}": "explore",
    "\u{1F6D2}": "shopping_cart",
    "\u2728": "all_inclusive",
    "\u2B50": "star",
    "\u{1F6A8}": "emergency",
    "\u{1F3AE}": "sports_esports",
    "\u{1F4BE}": "save",
    "\u{1F4C8}": "trending_up",
    "\u{1F4CB}": "task_alt",
    "\u{1F5E3}": "record_voice_over",
    "\u{1F458}": "style",
    "\u{1F4A5}": "bolt",
    "\u267B": "recycling",
    "\u2B05": "arrow_back",
    "\u{1F3DB}": "account_balance",
    "\u{1F4C2}": "folder_open",
    "\u{1F4D6}": "menu_book",
    "\u{1F4DC}": "article",
    "\u{1F512}": "lock",
    "\u{1F528}": "gavel",
    "\u{1F9F6}": "grass",
    "\u2699": "settings",
    "\u2713": "check",
    "\u{1F32C}": "air",
    "\u{1F389}": "celebration",
    "\u{1F393}": "school",
    "\u{1F3D7}": "construction",
    "\u{1F3EA}": "storefront",
    "\u{1F3F4}\u200D\u2620": "fingerprint",
    "\u{1F44D}": "thumb_up",
    "\u{1F451}": "workspace_premium",
    "\u{1F464}": "person",
    "\u{1F477}": "engineering",
    "\u{1F494}": "heart_broken",
    "\u{1F4B9}": "query_stats",
    "\u{1F4CC}": "push_pin",
    "\u{1F4CD}": "pin_drop",
    "\u{1F4D5}": "book",
    "\u{1F50C}": "power",
    "\u{1F575}": "face",
    "\u{1F5D1}": "delete",
    "\u{1F680}": "rocket_launch",
    "\u{1F6E0}": "handyman",
    "\u2715": "close",
    "\u{1F375}": "local_cafe",
    "\u{1F38B}": "forest",
    "\u{1F454}": "checkroom",
    "\u{1F455}": "family_restroom",
    "\u{1F457}": "theater_comedy",
    "\u{1F4AB}": "self_improvement",
    "\u{1FA99}": "savings",
  };

  const ICON_UNIT =
    /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}](?:\uFE0F|\u{200D}|[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}])*/gu;

  function micon(name) {
    return '<span class="micon" aria-hidden="true">' + name + "</span>";
  }

  /* Rewrites every emoji in an HTML string to its Material Symbol span.
     Unknown glyphs (number keycaps, typographic marks) pass through. */
  function iconize(html) {
    if (typeof html !== "string") return html;
    return html.replace(ICON_UNIT, (m) => {
      const key = m.replace(/\uFE0F/g, "");
      const name = ICON_MAP[key];
      return name ? micon(name) : m;
    });
  }

  PM.micon = micon;
  PM.iconize = iconize;

  PM.rand = rand;
  PM.choice = choice;
  PM.weightedChoice = weightedChoice;
  PM.log = log;
  PM.ratingFor = ratingFor;
  PM.escapeHtml = escapeHtml;
})();
