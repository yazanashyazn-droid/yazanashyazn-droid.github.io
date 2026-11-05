// "Start a project" form: turns the chosen options into a WhatsApp message.
// The site stores nothing; the visitor reviews the text in WhatsApp before sending it.
export function initBrief() {
  document.querySelectorAll<HTMLFormElement>('[data-brief]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const d = form.dataset;
      const line = (label: string | undefined, key: string) => {
        const value = String(data.get(key) ?? '').trim();
        return value ? `${label}: ${value}` : '';
      };
      const text = [
        d.hello,
        '',
        line(d.lName, 'name'),
        line(d.lType, 'type'),
        line(d.lBudget, 'budget'),
        line(d.lTime, 'time'),
        line(d.lDetails, 'details'),
      ]
        .filter((l, i) => l !== '' || i === 1)
        .join('\n');
      const url = `https://wa.me/${d.phone}?text=${encodeURIComponent(text)}`;
      // Popup blockers can refuse a new tab: fall back to this one
      if (!window.open(url, '_blank', 'noopener')) location.href = url;
    });
  });
}
