const THEMES = {
    animals: ["КОШКА","СОБАКА","ЛЕВ","ТИГР","СЛОН","ВОЛК","ЗАЯЦ"],
    fruits: ["ЯБЛОКО","БАНАН","АПЕЛЬСИН","ГРУША","АНАНАС"],
    countries: ["РОССИЯ","ФРАНЦИЯ","ГЕРМАНИЯ","ИТАЛИЯ","ЯПОНИЯ"],
    mixed: ["ЗАГАДКА","РЕБУС","КНИГА","КОМПЬЮТЕР"]
};
const MAX_WRONG = 7;
let secret = "";
let revealed = [];
let wrong = 0;
let gameOver = false;

const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const themeEl = document.getElementById('theme');
const wordEl = document.getElementById('word');
const alphabetEl = document.getElementById('alphabet');
const statusEl = document.getElementById('status');
const wrongCountEl = document.getElementById('wrongCount');
const canvas = document.getElementById('gallows');
const ctx = canvas.getContext('2d');

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);

function startGame(){
    const theme = themeEl.value;
    secret = pickWord(theme);
    revealed = Array.from(secret).map(ch => (isLetter(ch) ? '_' : ch));
    wrong = 0; gameOver = false;
    renderWord();
    buildAlphabet();
    drawGallows();
    updateStatus('Игра началась — угадайте слово');
    wrongCountEl.textContent = wrong;
}

function resetGame(){
    secret = '';
    revealed = [];
    wrong = 0;
    gameOver = false;
    wordEl.textContent = '';
    alphabetEl.innerHTML = '';
    updateStatus('Нажмите «Начать игру»');
    wrongCountEl.textContent = wrong;
    clearCanvas();
}

function pickWord(theme){
    const list = THEMES[theme] || THEMES.mixed;
    const idx = Math.floor(Math.random()*list.length);
    return list[idx];
}

function renderWord(){
    wordEl.textContent = revealed.join(' ');
}

function buildAlphabet(){
    alphabetEl.innerHTML = '';
    const letters = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');
    letters.forEach(l => {
        const btn = document.createElement('button');
        btn.textContent = l;
        btn.setAttribute('aria-label', 'Буква ' + l);
        btn.addEventListener('click', () => onGuess(l, btn));
        alphabetEl.appendChild(btn);
    });
}

function onGuess(letter, btn){
    if(gameOver) return;
    btn.disabled = true;
    if(secret.includes(letter)){
        for(let i=0;i<secret.length;i++){
            if(secret[i] === letter) revealed[i] = letter;
        }
        renderWord();
        if(!revealed.includes('_')){
            win();
        }
    } 
    else{
        wrong++;
        wrongCountEl.textContent = wrong;
        drawStep(wrong);
        if(wrong >= MAX_WRONG) lose();
    }
}

function win(){
    gameOver = true;
    updateStatus('Поздравляем! Вы угадали слово: ' + secret);
}

function lose(){
    gameOver = true;
    revealed = Array.from(secret);
    renderWord();
    updateStatus('Вы проиграли. Загаданное слово: ' + secret);
}   

function updateStatus(text){
    statusEl.textContent = text;
}

function isLetter(ch){
    return /[А-ЯЁ]/.test(ch);
}

function clearCanvas(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
}

function drawGallows(){
    clearCanvas();
    ctx.lineWidth = 4; 
    ctx.strokeStyle = '#111';
    ctx.beginPath(); 
    ctx.moveTo(20,280); 
    ctx.lineTo(280,280); 
    ctx.stroke();
    ctx.beginPath(); 
    ctx.moveTo(70,280); 
    ctx.lineTo(70,20); 
    ctx.lineTo(190,20); 
    ctx.lineTo(190,60); 
    ctx.stroke();
}

function drawStep(step){
    ctx.lineWidth = 3; ctx.strokeStyle = '#111';
    switch(step){
        case 1: // верёвка
            ctx.beginPath(); ctx.moveTo(190,60); ctx.lineTo(190,100); ctx.stroke(); 
            break;
        case 2: // голова
            ctx.beginPath(); ctx.arc(190,125,25,0,Math.PI*2); ctx.stroke(); 
            break;
        case 3: // тело
            ctx.beginPath(); ctx.moveTo(190,150); ctx.lineTo(190,220); ctx.stroke(); 
            break;
        case 4: // рука левая
            ctx.beginPath(); ctx.moveTo(190,170); ctx.lineTo(155,200); ctx.stroke(); 
            break;
        case 5: // рука правая
            ctx.beginPath(); ctx.moveTo(190,170); ctx.lineTo(225,200); ctx.stroke(); 
            break;
        case 6: // нога левая
            ctx.beginPath(); ctx.moveTo(190,220); ctx.lineTo(165,260); ctx.stroke(); 
            break;
        case 7: // нога правая
            ctx.beginPath(); ctx.moveTo(190,220); ctx.lineTo(215,260); ctx.stroke(); 
            break;
        default: break;
}
}

drawGallows();