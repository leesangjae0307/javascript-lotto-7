import { Console, Random } from "@woowacourse/mission-utils";
import Lotto from "./Lotto.js";

class App {
  constructor() {
    this.lottos = [];
    this.winningNumbers = [];
    this.bonusNumber = null;
  }

  async run() {
    await this.purchaseLottos();
  }

  async purchaseLottos() {
    const amount = await Console.readLineAsync("구입금액을 입력해 주세요.\n");
    try {
      this.validateAmount(amount);
      const count = Math.floor(amount / 1000);
      this.generateLottos(count);
      this.printLottos();
      await this.inputWinningNumbers();
    } catch (error) {
      Console.print(error.message);
      await this.purchaseLottos();
    }
  }

  validateAmount(amount) {
    if (isNaN(amount) || amount % 1000 !== 0 || amount <= 0) {
      throw new Error("[ERROR] 구입 금액은 1,000원 단위로 입력해야 합니다.");
    }
  }

  generateLottos(count) {
    for (let i = 0; i < count; i++) {
      const numbers = Random.pickUniqueNumbersInRange(1, 45, 6).sort(
        (a, b) => a - b
      );
      this.lottos.push(new Lotto(numbers));
    }
  }

  printLottos() {
    Console.print(`${this.lottos.length}개를 구매했습니다.`);
    this.lottos.forEach((lotto) =>
      Console.print(`[${lotto.getNumbers().join(", ")}]`)
    );
  }

  async inputWinningNumbers() {
    const numbers = await Console.readLineAsync(
      "\n당첨 번호를 입력해 주세요. (쉼표로 구분된 숫자 6개)\n"
    );
    try {
      this.winningNumbers = this.validateNumbers(
        numbers.split(",").map((num) => Number(num.trim()))
      );
      await this.inputBonusNumber();
    } catch (error) {
      Console.print(error.message);
      await this.inputWinningNumbers();
    }
  }

  async inputBonusNumber() {
    const number = await Console.readLineAsync(
      "\n보너스 번호를 입력해 주세요.\n"
    );
    try {
      this.bonusNumber = this.validateNumber(Number(number.trim()));
      this.printResults();
    } catch (error) {
      Console.print(error.message);
      await this.inputBonusNumber();
    }
  }

  validateNumbers(numbers) {
    if (
      numbers.length !== 6 ||
      numbers.some((num) => isNaN(num) || num < 1 || num > 45)
    ) {
      throw new Error("[ERROR] 로또 번호는 1부터 45 사이의 숫자여야 합니다.");
    }
    if (new Set(numbers).size !== 6) {
      throw new Error("[ERROR] 중복되지 않는 숫자 6개를 입력해야 합니다.");
    }
    return numbers;
  }

  validateNumber(number) {
    if (isNaN(number) || number < 1 || number > 45) {
      throw new Error("[ERROR] 보너스 번호는 1부터 45 사이의 숫자여야 합니다.");
    }
    if (this.winningNumbers.includes(number)) {
      throw new Error(
        "[ERROR] 보너스 번호는 당첨 번호와 중복되지 않아야 합니다."
      );
    }
    return number;
  }

  printResults() {
    const results = this.lottos.map((lotto) => this.getLottoRank(lotto));
    const stats = this.calculateStatistics(results);
    this.printStatistics(stats);
  }

  getLottoRank(lotto) {
    const matchCount = lotto
      .getNumbers()
      .filter((number) => this.winningNumbers.includes(number)).length;
    const hasBonus = lotto.getNumbers().includes(this.bonusNumber);

    if (matchCount === 6) return 1;
    if (matchCount === 5 && hasBonus) return 2;
    if (matchCount === 5) return 3;
    if (matchCount === 4) return 4;
    if (matchCount === 3) return 5;
    return 0;
  }

  calculateStatistics(results) {
    const stats = [0, 0, 0, 0, 0, 0];
    results.forEach((result) => {
      if (result > 0) {
        stats[result]++;
      }
    });
    return stats;
  }

  printStatistics(stats) {
    const prize = [0, 2000000000, 30000000, 1500000, 50000, 5000];
    let totalPrize = 0;
    Console.print("\n당첨 통계\n---");
    stats.forEach((count, index) => {
      if (index === 2) {
        Console.print(
          `5개 일치, 보너스 볼 일치 (${prize[
            index
          ].toLocaleString()}원) - ${count}개`
        );
      } else if (index > 2) {
        Console.print(
          `${index + 1}개 일치 (${prize[
            index
          ].toLocaleString()}원) - ${count}개`
        );
      } else if (index > 0) {
        Console.print(
          `${index + 2}개 일치 (${prize[
            index
          ].toLocaleString()}원) - ${count}개`
        );
      }
      totalPrize += count * prize[index];
    });
    const investment = this.lottos.length * 1000;
    const yieldRate = ((totalPrize / investment) * 100).toFixed(1);
    Console.print(`총 수익률은 ${yieldRate}%입니다.`);
  }
}

export default App;
