// Уніфіковане сховище прогресу.
// Якщо середовище надає платформне асинхронне window.storage — використовуємо його.
// Інакше (наприклад, на GitHub Pages чи file://) — падаємо на localStorage,
// тож прогрес тепер реально зберігається там, де раніше мовчки губився.
(function () {
  if (window.storage && typeof window.storage.get === "function") return;

  const ls = {
    available() {
      try {
        const k = "__t__";
        localStorage.setItem(k, "1");
        localStorage.removeItem(k);
        return true;
      } catch (e) {
        return false;
      }
    },
  };
  const ok = ls.available();
  const mem = {};

  window.storage = {
    async get(key) {
      if (ok) {
        const v = localStorage.getItem(key);
        return v === null ? null : { value: v };
      }
      return key in mem ? { value: mem[key] } : null;
    },
    async set(key, value) {
      if (ok) localStorage.setItem(key, value);
      else mem[key] = value;
    },
    async delete(key) {
      if (ok) localStorage.removeItem(key);
      else delete mem[key];
    },
  };
})();
