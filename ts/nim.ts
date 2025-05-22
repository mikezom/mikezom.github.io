let heaps: number[] = [3, 5, 7];
let isGameOver: boolean = false;

const stateEl = document.getElementById('game-state') as HTMLElement;
const messageEl = document.getElementById('message') as HTMLElement;
const heapInput = document.getElementById('heap-input') as HTMLInputElement;
const countInput = document.getElementById('count-input') as HTMLInputElement;

function drawState(): void {
  const lines = heaps.map((heap, i) => `Heap ${i}: ${'|'.repeat(heap)}`);
  stateEl.innerHTML = lines.join('<br>');
}

function playerMove(): void {
  if (isGameOver) return;

  const heapIndex = parseInt(heapInput.value);
  const count = parseInt(countInput.value);

  if (
    isNaN(heapIndex) || isNaN(count) ||
    heapIndex < 0 || heapIndex >= heaps.length ||
    count < 1 || count > heaps[heapIndex]
  ) {
    messageEl.textContent = "Invalid move.";
    return;
  }

  heaps[heapIndex] -= count;
  messageEl.textContent = `You removed ${count} from Heap ${heapIndex}`;
  checkEndGame("You");

  if (!isGameOver) {
    setTimeout(aiMove, 800);
  }

  drawState();
}

function aiMove(): void {
  const move = getOptimalMove(heaps);
  if (!move) return;

  const [heapIndex, count] = move;
  heaps[heapIndex] -= count;
  messageEl.textContent = `AI removed ${count} from Heap ${heapIndex}`;
  drawState();
  checkEndGame("AI");
}

function getOptimalMove(state: number[]): [number, number] | null {
  const xorSum = state.reduce((a, b) => a ^ b, 0);
  if (xorSum === 0) {
    for (let i = 0; i < state.length; i++) {
      if (state[i] > 0) return [i, 1];
    }
  }

  for (let i = 0; i < state.length; i++) {
    const target = state[i] ^ xorSum;
    if (target < state[i]) {
      return [i, state[i] - target];
    }
  }

  return null;
}

function checkEndGame(whoMovedLast: string): void {
  if (heaps.every(h => h === 0)) {
    messageEl.textContent = `${whoMovedLast} took the last stick. ${whoMovedLast} loses!`;
    isGameOver = true;
  }
}

drawState();

// Expose function globally so HTML button can call it
(window as any).playerMove = playerMove;
