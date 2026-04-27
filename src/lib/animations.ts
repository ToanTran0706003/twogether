export const KEYFRAMES = `
  @keyframes heartBeat {
    0%,100% { transform: scale(1); }
    15%      { transform: scale(1.35); }
    30%      { transform: scale(1.1); }
    45%      { transform: scale(1.28); }
    60%      { transform: scale(1); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes popIn {
    0%  { transform: scale(0);    opacity: 0; }
    70% { transform: scale(1.15); opacity: 1; }
    100%{ transform: scale(1);    opacity: 1; }
  }
  @keyframes slideUp {
    from { transform: translateY(100%); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }
  @keyframes ripple {
    0%   { transform: scale(0);   opacity: 0.6; }
    100% { transform: scale(3.5); opacity: 0; }
  }
  @keyframes confettiFall {
    0%   { transform: translateY(0) rotate(0deg);    opacity: 1; }
    100% { transform: translateY(80px) rotate(720deg); opacity: 0; }
  }
  @keyframes floatPetal {
    0%   { transform: translateY(0) rotate(0deg) translateX(0);    opacity: 0.9; }
    50%  { transform: translateY(-24px) rotate(180deg) translateX(8px);  opacity: 0.6; }
    100% { transform: translateY(-48px) rotate(360deg) translateX(-4px); opacity: 0; }
  }
  @keyframes bounce {
    0%,100% { transform: translateY(0); }
    50%     { transform: translateY(-10px); }
  }
  @keyframes waveIn {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  @keyframes pulse {
    0%,100% { opacity: 1;   transform: scale(1); }
    50%     { opacity: 0.4; transform: scale(0.85); }
  }
  @keyframes checkDraw {
    0%   { stroke-dashoffset: 30; }
    100% { stroke-dashoffset: 0; }
  }
  @keyframes tickFill {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  @keyframes streakPop {
    0%   { transform: scale(0.5); }
    60%  { transform: scale(1.3); }
    100% { transform: scale(1); }
  }
  @keyframes celebrationScale {
    0%   { transform: scale(0) rotate(-10deg); opacity: 0; }
    60%  { transform: scale(1.1) rotate(3deg);  opacity: 1; }
    100% { transform: scale(1) rotate(0deg);    opacity: 1; }
  }
`

export function injectKeyframes() {
  if (typeof document === 'undefined') return
  if (document.getElementById('twogether-keyframes')) return
  const style = document.createElement('style')
  style.id = 'twogether-keyframes'
  style.textContent = KEYFRAMES
  document.head.appendChild(style)
}

export function burstConfetti(
  container: HTMLElement,
  count = 30,
  colors = ['#E8A0B0','#C0607A','#F7D6DF','#A8C5B5','#C4B5D8','#FFF0C0','#D8EDE5']
) {
  injectKeyframes()
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div')
    dot.style.cssText = `
      position: absolute;
      width: ${4 + Math.random() * 7}px;
      height: ${4 + Math.random() * 7}px;
      background: ${colors[i % colors.length]};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      left: ${10 + Math.random() * 80}%;
      top: ${10 + Math.random() * 60}%;
      pointer-events: none;
      animation: confettiFall ${0.5 + Math.random() * 0.8}s ease ${Math.random() * 0.4}s forwards;
    `
    container.appendChild(dot)
    setTimeout(() => dot.remove(), 1500)
  }
}

export function floatPetals(container: HTMLElement, count = 10) {
  injectKeyframes()
  const petals = ['🌸', '🌺', '✿', '❀', '🌷']
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span')
    p.textContent = petals[i % petals.length]
    p.style.cssText = `
      position: absolute;
      font-size: ${10 + Math.random() * 8}px;
      left: ${Math.random() * 90}%;
      bottom: 0;
      pointer-events: none;
      animation: floatPetal ${1 + Math.random() * 1.2}s ease ${Math.random() * 0.6}s forwards;
    `
    container.appendChild(p)
    setTimeout(() => p.remove(), 2000)
  }
}
