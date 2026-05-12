import type { LastBusRisk } from "@/types";

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function calculateLastBusRisk(checkedTime: string, lastBusTime: string): LastBusRisk {
  const minutesUntilLastBus = toMinutes(lastBusTime) - toMinutes(checkedTime);

  if (minutesUntilLastBus <= 0) {
    return {
      level: "impossible",
      label: "帰宅困難リスクあり",
      minutesUntilLastBus,
      checkedTime,
      message: "下山予定時刻が終バス以降です。計画の前倒し、別ルート、宿泊を検討してください。",
    };
  }

  if (minutesUntilLastBus < 60) {
    return {
      level: "high",
      label: "高",
      minutesUntilLastBus,
      checkedTime,
      message: "終バスまでの余裕がかなり少ない計画です。遅延時の代替案を用意してください。",
    };
  }

  if (minutesUntilLastBus < 120) {
    return {
      level: "medium",
      label: "中",
      minutesUntilLastBus,
      checkedTime,
      message: "終バスまで一定の余裕がありますが、休憩・道迷い・混雑を考慮してください。",
    };
  }

  return {
    level: "low",
    label: "低",
    minutesUntilLastBus,
    checkedTime,
    message: "終バスまで比較的余裕があります。とはいえ公式時刻表の確認は必須です。",
  };
}
