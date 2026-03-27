document.addEventListener('keydown', function(e) {
  if (e.key === ' ' || e.code === 'Space') {
    const tag = e.target.tagName;
    const editable = e.target.isContentEditable ||
      tag === 'INPUT' ||
      tag === 'TEXTAREA' ||
      e.target.closest('[contenteditable="true"], [role="textbox"]');

    if (!editable) {
      e.stopImmediatePropagation();
    }
  }
}, true);
