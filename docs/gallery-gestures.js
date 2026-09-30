/* Horizontal swipes rotate; vertical gestures remain native page scrolling. */
function bindGalleryGestures(stage, {getAngle, start, change, finish, now = () => performance.now()}) {
  let pointer = null, axis = null, x0 = 0, y0 = 0, angle0 = 0;
  let lastX = 0, lastTime = 0, velocity = 0, suppressUntil = 0;
  const down = e => {
    if (pointer !== null || e.isPrimary === false || (e.pointerType === 'mouse' && e.button !== 0)) return;
    pointer = e.pointerId; axis = null; x0 = lastX = e.clientX; y0 = e.clientY;
    angle0 = getAngle(); lastTime = now(); velocity = 0; start();
  };
  const move = e => {
    if (e.pointerId !== pointer) return;
    const dx = e.clientX - x0, dy = e.clientY - y0;
    if (!axis && Math.max(Math.abs(dx), Math.abs(dy)) > 8) {
      axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (axis === 'x') {stage.setPointerCapture?.(pointer); stage.classList.add('dragging');}
    }
    if (axis !== 'x') return;
    if (e.cancelable) e.preventDefault();
    const time = now(), elapsed = Math.max(8, time - lastTime);
    velocity = (e.clientX - lastX) / elapsed;
    lastX = e.clientX; lastTime = time;
    change(angle0 + dx * .28);
  };
  const end = e => {
    if (e.pointerId !== pointer) return;
    const horizontal = axis === 'x', cancelled = e.type === 'pointercancel';
    if (horizontal) suppressUntil = now() + 450;
    if (stage.hasPointerCapture?.(pointer)) stage.releasePointerCapture(pointer);
    stage.classList.remove('dragging'); pointer = null; axis = null;
    finish(horizontal && !cancelled && now() - lastTime < 100 ? Math.max(-80, Math.min(80, velocity * 65)) : 0);
  };
  const click = e => {
    if (e.detail !== 0 && now() < suppressUntil) { e.preventDefault(); e.stopImmediatePropagation(); }
  };
  stage.addEventListener('pointerdown', down);
  stage.addEventListener('pointermove', move, {passive:false});
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);
  stage.addEventListener('lostpointercapture', end);
  stage.addEventListener('click', click, true);
  return () => {
    stage.removeEventListener('pointerdown', down); stage.removeEventListener('pointermove', move);
    stage.removeEventListener('pointerup', end); stage.removeEventListener('pointercancel', end);
    stage.removeEventListener('lostpointercapture', end); stage.removeEventListener('click', click, true);
  };
}
