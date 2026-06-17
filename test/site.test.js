// Тести збірки сайту. Без зовнішніх залежностей — вбудований node:test.
// Запуск: `npm test` (збирає сайт у _site/ і перевіряє результат).
//
// Що перевіряємо (саме ці пункти ловлять регресії, через які сайт «не працював»):
//  • усі сторінки й ассети збираються;
//  • НЕМАЄ абсолютних внутрішніх шляхів (/assets, /page.html) — вони ламаються
//    у підкаталозі GitHub Pages і через file://;
//  • кожне локальне посилання/ассет реально існує у _site (немає 404);
//  • на сторінках є контент і noindex, немає залишків шаблонів ({{ }} / {% %}).

const { test, before } = require("node:test");
const assert = require("node:assert");
const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const SITE = path.join(ROOT, "_site");
const read = (p) => fs.readFileSync(path.join(SITE, p), "utf8");
const PAGES = [
  "index.html",
  "schedule.html",
  "kf800.html",
  "basketball.html",
  "skate-plan.html",
];

before(() => {
  // Чиста збірка перед тестами — тести самодостатні.
  execSync("npx @11ty/eleventy", { cwd: ROOT, stdio: "pipe" });
});

test("усі очікувані сторінки та ассети існують", () => {
  for (const p of PAGES) {
    assert.ok(fs.existsSync(path.join(SITE, p)), `немає _site/${p}`);
  }
  for (const a of [
    "assets/css/hub.css",
    "assets/css/schedule.css",
    "assets/css/kf800.css",
    "assets/css/basketball.css",
    "assets/css/skate.css",
    "assets/js/storage.js",
    "assets/js/schedule.js",
    "assets/js/kf800-data.js",
    "assets/js/kf800.jsx",
    "assets/js/basketball.js",
    "assets/js/skate.js",
    "robots.txt",
    ".nojekyll",
  ]) {
    assert.ok(fs.existsSync(path.join(SITE, a)), `немає _site/${a}`);
  }
});

test("немає абсолютних внутрішніх шляхів (працює і в підкаталозі, і у file://)", () => {
  for (const p of PAGES) {
    const html = read(p);
    const abs = [...html.matchAll(/(?:href|src)="(\/[^"]*)"/g)].map((m) => m[1]);
    assert.deepStrictEqual(
      abs,
      [],
      `${p} містить абсолютні внутрішні шляхи: ${abs.join(", ")}`
    );
  }
});

test("усі локальні посилання та ассети існують у _site (немає 404)", () => {
  const missing = [];
  for (const p of PAGES) {
    const html = read(p);
    const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
    for (const ref of refs) {
      if (/^(https?:|data:|mailto:|#)/.test(ref)) continue; // зовнішні/якорі
      const clean = ref.replace(/^\//, "").split(/[?#]/)[0];
      if (!clean) continue;
      if (!fs.existsSync(path.join(SITE, clean))) {
        missing.push(`${p} → ${ref}`);
      }
    }
  }
  assert.deepStrictEqual(missing, [], `биті посилання:\n${missing.join("\n")}`);
});

test("кожна сторінка має noindex і не містить залишків шаблонів", () => {
  for (const p of PAGES) {
    const html = read(p);
    assert.match(html, /<meta name="robots" content="noindex/, `${p}: немає noindex`);
    assert.ok(!/\{\{|\{%/.test(html), `${p}: залишки шаблону {{ }} / {% %}`);
  }
});

test("хаб показує всі картки, і кожна веде на наявну сторінку", () => {
  const html = read("index.html");
  const links = [...html.matchAll(/class="card[^"]*"\s+href="([^"]+)"/g)].map(
    (m) => m[1]
  );
  assert.strictEqual(links.length, 4, `очікував 4 картки, отримав ${links.length}`);
  for (const l of links) {
    assert.ok(fs.existsSync(path.join(SITE, l)), `картка веде в нікуди: ${l}`);
  }
  // Підключений власний CSS хабу.
  assert.match(html, /assets\/css\/hub\.css/);
});

test("schedule: дані інʼєктовані й непорожні", () => {
  const html = read("schedule.html");
  const m = html.match(/window\.__DATA__ = (\{.*?\});/s);
  assert.ok(m, "немає window.__DATA__");
  const data = JSON.parse(m[1].replace(/\\u003c/g, "<"));
  assert.ok(Array.isArray(data.events) && data.events.length >= 10, "мало подій");
  assert.ok(Array.isArray(data.notes) && data.notes.length >= 1, "немає нотаток");
  assert.match(html, /assets\/js\/schedule\.js/);
});

test("kf800: програма-контент і React-рушій підключені", () => {
  const html = read("kf800.html");
  assert.match(html, /id="root"/);
  assert.match(html, /assets\/js\/kf800-data\.js/);
  assert.match(html, /type="text\/babel"[^>]*assets\/js\/kf800\.jsx/);
  const data = read("assets/js/kf800-data.js");
  assert.match(data, /window\.__DATA__\.program\s*=/);
  assert.ok((data.match(/videoId:/g) || []).length === 18, "очікував 18 вправ");
});

test("basketball: 13 вправ і 5 концептів, прогрес-сховище перед рушієм", () => {
  const html = read("basketball.html");
  assert.strictEqual((html.match(/class="exercise"/g) || []).length, 13);
  assert.strictEqual((html.match(/class="concept"/g) || []).length, 5);
  // storage.js має йти ДО basketball.js, інакше прогрес зламається.
  assert.ok(
    html.indexOf("assets/js/storage.js") < html.indexOf("assets/js/basketball.js"),
    "storage.js має підключатися перед basketball.js"
  );
});

test("skate: 10 кроків, 3 фази, 10 SVG-діаграм збережено", () => {
  const html = read("skate-plan.html");
  assert.strictEqual((html.match(/class="step"/g) || []).length, 10);
  assert.strictEqual((html.match(/class="phase"/g) || []).length, 3);
  assert.strictEqual((html.match(/class="diagram"/g) || []).length, 10);
  assert.ok(
    html.indexOf("assets/js/storage.js") < html.indexOf("assets/js/skate.js"),
    "storage.js має підключатися перед skate.js"
  );
});
