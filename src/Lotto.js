class Lotto {
  #numbers;

  constructor(numbers) {
    this.#validate(numbers);
    this.#numbers = numbers;
  }

  #validate(numbers) {
    if (numbers.length !== 6) {
      throw new Error("[ERROR] 로또 번호는 6개여야 합니다.");
    }
    if (new Set(numbers).size !== 6) {
      throw new Error("[ERROR] 중복되지 않는 숫자 6개를 입력해야 합니다.");
    }
  }

  getNumbers() {
    return this.#numbers;
  }

  getRank(winningNumbers, bonusNumber) {
    const matchedCount = this.#numbers.filter((num) =>
      winningNumbers.includes(num)
    ).length;
    if (matchedCount === 5 && this.#numbers.includes(bonusNumber)) {
      return 5.5;
    }
    return matchedCount;
  }
}

export default Lotto;
