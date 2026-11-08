const chapters = [
  {
    label: 'CHAPTER 01 · LAST CALL', caption: 'THE LAST TRAIN HAS LEFT',
    title: 'The city is<br><em>still awake.</em>',
    text: 'Rain taps the windows of the little after-hours café. You came for a quiet cup of tea. The owner, your old friend Mina, has other plans.',
    choices: [
      { text: 'Ask what she’s still doing up.', bond: 1, mood: 'warm', response: '“I could ask you the same thing,” Mina says, setting down a cup of jasmine tea. Her smile is soft around the edges. “But I’m glad you’re here.”' },
      { text: 'Offer to help with the closing dishes.', bond: 2, mood: 'warm', response: 'Mina blinks, then laughs. “You always did know how to make yourself useful.” She hands you a towel—and keeps you company at the sink.' },
      { text: 'Compliment the cozy café.', bond: 1, mood: 'sparkle', response: '“You noticed the new lights!” Mina’s eyes brighten. “I picked them out last week. It’s nicer when someone gets to enjoy them with me.”' }
    ]
  },
  {
    label: 'CHAPTER 02 · A SHARED TABLE', caption: 'TWO CUPS, ONE QUIET NIGHT',
    title: 'A little more<br><em>honest.</em>',
    text: 'The rain keeps falling. Mina brings over a second cup and takes the chair across from you. For once, the café is still enough to hear the clock.',
    choices: [
      { text: 'Ask what she dreams about when the café is closed.', bond: 2, mood: 'sparkle', response: '“A tiny place by the sea, maybe,” she says. “Somewhere I can open the windows and hear waves instead of the espresso machine.” She looks at you. “Would you visit?”' },
      { text: 'Tell her about a dream of your own.', bond: 2, mood: 'warm', response: 'Mina listens without interrupting, her chin resting in one hand. When you finish, she says, “I like that you told me. Let’s make sure it doesn’t stay just a dream.”' },
      { text: 'Tease her about being a night owl.', bond: 1, mood: 'sparkle', response: '“Says the person who came here after midnight,” she grins. The teasing turns into an easy story-swapping contest, and neither of you keeps score.' }
    ]
  },
  {
    label: 'CHAPTER 03 · THE LITTLE THINGS', caption: 'A SONG BETWEEN THE RAINDROPS',
    title: 'Some things are<br><em>hard to say.</em>',
    text: 'A slow jazz song drifts from the old speaker. Mina reaches to turn it down, then pauses. Outside, the rain has softened to a silver hush.',
    choices: [
      { text: 'Ask her to save this song for next time.', bond: 2, mood: 'warm', response: '“Next time,” Mina repeats, tasting the words. A hopeful little smile finds her face. “I’d like that.”' },
      { text: 'Tell her you’ve missed these evenings together.', bond: 3, mood: 'warm', response: 'Mina’s expression turns tender. “I’ve missed them too. More than I let myself admit.” Her fingertips rest beside yours on the table.' },
      { text: 'Invite her to dance—right here, in the empty café.', bond: 2, mood: 'sparkle', response: 'She laughs, but takes your hand. You sway between the tables, a little clumsy and completely unhurried. The café has never felt so warm.' }
    ]
  },
  {
    label: 'CHAPTER 04 · THE WALK HOME', caption: 'THE NIGHT IS YOURS',
    title: 'The night is<br><em>almost over.</em>',
    text: 'Mina locks the front door and turns the sign to CLOSED. The first hint of dawn colors the clouds. She looks at you, suddenly shy.',
    choices: [
      { text: 'Ask if she’d like to see the sunrise together.', bond: 3, mood: 'warm', response: '“I thought you’d never ask.” Mina slips her arm through yours, and together you step into the soft blue morning.' },
      { text: 'Tell her you’d like this to be the beginning of something.', bond: 3, mood: 'sparkle', response: 'Mina’s eyes shine in the dawn light. “Then let’s begin slowly,” she says, and offers you her hand. You take it.' },
      { text: 'Promise to come back for another cup soon.', bond: 2, mood: 'warm', response: '“I’ll save your favorite table,” she says. Her smile makes the promise feel like a beginning, not a goodbye.' }
    ]
  }
];

let chapterIndex = 0;
let bond = 0;
let answered = false;
let soundOn = false;
let audioContext = null;
let droneOscillator = null;
let droneGain = null;

const $ = (id) => document.getElementById(id);
const title = $('story-title');
const copy = $('story-copy');
const choiceBox = $('choices');
const panel = $('story-panel');

function startGame() {
  chapterIndex = 0;
  bond = 0;
  answered = false;
  $('hud').classList.remove('hidden');
  $('story-meta').classList.add('hidden');
  $('story-footer').classList.add('hidden');
  renderChapter();
}

function renderChapter() {
  const chapter = chapters[chapterIndex];
  answered = false;
  $('chapter-label').textContent = chapter.label;
  $('art-caption').textContent = chapter.caption;
  $('eyebrow').textContent = chapter.label;
  title.innerHTML = chapter.title;
  copy.textContent = chapter.text;
  panel.classList.remove('ending');
  $('scene-art').className = 'scene-art';
  choiceBox.innerHTML = '';
  chapter.choices.forEach((choice) => {
    const button = document.createElement('button');
    button.className = 'choice';
    button.innerHTML = `<span>${choice.text}</span><b>→</b>`;
    button.addEventListener('click', () => selectChoice(choice));
    choiceBox.appendChild(button);
  });
  updateBond();
}

function selectChoice(choice) {
  if (answered) return;
  answered = true;
  bond += choice.bond;
  updateBond();
  $('scene-art').classList.add(`mood-${choice.mood}`);
  copy.textContent = choice.response;
  choiceBox.innerHTML = '';
  const next = document.createElement('button');
  next.className = 'choice primary';
  next.innerHTML = `<span>${chapterIndex === chapters.length - 1 ? 'See where the morning leads' : 'Stay a little longer'}</span><b>→</b>`;
  next.addEventListener('click', () => {
    chapterIndex += 1;
    if (chapterIndex < chapters.length) renderChapter();
    else showEnding();
  });
  choiceBox.appendChild(next);
}

function updateBond() {
  const percent = Math.min(100, Math.round((bond / 10) * 100));
  $('bond-number').textContent = bond;
  $('bond-fill').style.width = `${percent}%`;
  $('bond-note').textContent = bond < 4 ? 'A fresh start' : bond < 7 ? 'Getting closer' : 'A little spark';
}

function showEnding() {
  const close = bond >= 9;
  const middle = bond >= 6;
  const ending = close ? {
    label: 'YOUR ENDING · A NEW DAWN', caption: 'SOMEWHERE, THE SUN IS RISING',
    title: 'A new dawn,<br><em>together.</em>',
    text: 'You and Mina watch the sunrise from the quiet pier, shoulders touching. There are no grand declarations—just warm tea, an easy silence, and the promise of more evenings together. Somehow, that feels like everything.',
    footer: 'ENDING UNLOCKED · THE BEGINNING'
  } : middle ? {
    label: 'YOUR ENDING · A SWEET PROMISE', caption: 'THE FIRST OF MANY MORNINGS',
    title: 'More than<br><em>one night.</em>',
    text: 'You part ways beneath a paling sky, but Mina walks you to the corner and asks when she’ll see you again. You already know your answer. The next cup is on her; the next story is on you.',
    footer: 'ENDING UNLOCKED · NEXT TIME'
  } : {
    label: 'YOUR ENDING · A LOVELY EVENING', caption: 'THE CITY WAKES, SLOWLY',
    title: 'A night to<br><em>remember.</em>',
    text: 'The two of you say goodnight as the first morning buses begin to rumble past. Mina waves from the café door, and you carry the warmth of the evening with you. Some stories are best when they take their time.',
    footer: 'ENDING UNLOCKED · SLOW BURN'
  };
  $('chapter-label').textContent = ending.label;
  $('eyebrow').textContent = ending.label;
  $('art-caption').textContent = ending.caption;
  title.innerHTML = ending.title;
  copy.textContent = ending.text;
  panel.classList.add('ending');
  $('scene-art').className = 'scene-art mood-warm mood-sparkle';
  choiceBox.innerHTML = '';
  const button = document.createElement('button');
  button.className = 'choice primary';
  button.innerHTML = '<span>Start a new evening</span><b>↻</b>';
  button.addEventListener('click', startGame);
  choiceBox.appendChild(button);
  $('story-footer').innerHTML = `<span>♡</span> ${ending.footer} · ALL CHARACTERS 21+`;
  $('story-footer').classList.remove('hidden');
}

$('start-button').addEventListener('click', startGame);
$('restart-top').addEventListener('click', () => {
  $('hud').classList.add('hidden');
  $('story-meta').classList.remove('hidden');
  $('story-footer').innerHTML = '<span>♡</span> A little charm goes a long way.';
  $('story-footer').classList.remove('hidden');
  $('chapter-label').textContent = 'A STORY GAME';
  $('eyebrow').textContent = 'A MOONLIT STORY · ALL CHARACTERS 21+';
  $('art-caption').textContent = 'THE LAST TRAIN HAS LEFT';
  title.innerHTML = 'The city is<br><em>still awake.</em>';
  copy.textContent = 'Rain taps the windows of the little after-hours café. You came for a quiet cup of tea. The owner, your old friend Mina, has other plans.';
  $('scene-art').className = 'scene-art';
  panel.classList.remove('ending');
  choiceBox.innerHTML = '<button class="choice primary" id="start-button"><span>Begin the evening</span><b>→</b></button>';
  $('start-button').addEventListener('click', startGame);
});

$('sound-toggle').addEventListener('click', async (event) => {
  soundOn = !soundOn;
  event.currentTarget.classList.toggle('active', soundOn);
  event.currentTarget.setAttribute('aria-pressed', String(soundOn));
  event.currentTarget.title = soundOn ? 'Turn ambient tone off' : 'Turn ambient tone on';
  if (soundOn) {
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      await audioContext.resume();
      droneOscillator = audioContext.createOscillator();
      droneGain = audioContext.createGain();
      droneOscillator.type = 'sine';
      droneOscillator.frequency.value = 110;
      droneGain.gain.value = 0.018;
      droneOscillator.connect(droneGain).connect(audioContext.destination);
      droneOscillator.start();
    } catch (error) {
      soundOn = false;
      event.currentTarget.classList.remove('active');
    }
  } else if (droneOscillator) {
    droneGain.gain.setTargetAtTime(0, audioContext.currentTime, .08);
    droneOscillator.stop(audioContext.currentTime + .4);
    droneOscillator = null;
  }
});
