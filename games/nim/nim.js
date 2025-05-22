"use strict";
let heaps = [3, 5, 7];
let isGameOver = false;
const stateEl = document.getElementById('game-state');
const messageEl = document.getElementById('message');
const heapInput = document.getElementById('heap-input');
const countInput = document.getElementById('count-input');
function drawState() {
    const lines = heaps.map((heap, i) => `Heap ${i}: ${'|'.repeat(heap)}`);
    stateEl.innerHTML = lines.join('<br>');
}
function playerMove() {
    if (isGameOver)
        return;
    const heapIndex = parseInt(heapInput.value);
    const count = parseInt(countInput.value);
    if (isNaN(heapIndex) || isNaN(count) ||
        heapIndex < 0 || heapIndex >= heaps.length ||
        count < 1 || count > heaps[heapIndex]) {
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
function aiMove() {
    const move = getOptimalMove(heaps);
    if (!move)
        return;
    const [heapIndex, count] = move;
    heaps[heapIndex] -= count;
    messageEl.textContent = `AI removed ${count} from Heap ${heapIndex}`;
    drawState();
    checkEndGame("AI");
}
function getOptimalMove(state) {
    const xorSum = state.reduce((a, b) => a ^ b, 0);
    if (xorSum === 0) {
        for (let i = 0; i < state.length; i++) {
            if (state[i] > 0)
                return [i, 1];
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
function checkEndGame(whoMovedLast) {
    if (heaps.every(h => h === 0)) {
        messageEl.textContent = `${whoMovedLast} took the last stick. ${whoMovedLast} Wins!`;
        isGameOver = true;
    }
}
drawState();
// Expose function globally so HTML button can call it
window.playerMove = playerMove;
