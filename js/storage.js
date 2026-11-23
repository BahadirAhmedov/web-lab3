const LEADERS_KEY = 'game2048-leaders';
const LEADERS_LIMIT = 10;

const GameStorage = {
  read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },

  write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage недоступен — продолжаем без сохранения
    }
  },

  getLeaders() {
    return this.read(LEADERS_KEY, []);
  },

  addLeader(record) {
    const leaders = this.getLeaders();
    leaders.push(record);
    leaders.sort((a, b) => b.score - a.score);
    const top = leaders.slice(0, LEADERS_LIMIT);
    this.write(LEADERS_KEY, top);
    return top;
  },
};
