const QUIZ_CORES  = ['#1368ce','#d89e00','#26890c','#e21b3c'];
const QUIZ_LETRAS = ['A','B','C','D'];

function medalha(i) { return ['🥇','🥈','🥉'][i] || '   '; }

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
