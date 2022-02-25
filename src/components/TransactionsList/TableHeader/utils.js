const weekDayMap = {
  domingo: 1,
  segundo: 2,
  terça: 3,
  quarta: 4,
  quinta: 5,
  sexta: 6,
  sábado: 7,
};

export function orderColumnsAsc(a, b, by) {
  if (by === "date") {
    return new Date(a.date) - new Date(b.date);
  }

  if (by === "weekDay") {
    return weekDayMap[a.week_day] - weekDayMap[b.week_day];
  }

  if (by === "value") {
    return a.value - b.value;
  }
}

export function orderColumnsDesc(a, b, by) {
  if (by === "date") {
    return new Date(b.date) - new Date(a.date);
  }

  if (by === "weekDay") {
    return weekDayMap[b.week_day] - weekDayMap[a.week_day];
  }

  if (by === "value") {
    return b.value - a.value;
  }
}
