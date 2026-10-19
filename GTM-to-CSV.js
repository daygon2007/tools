// Paste this script in the Console section of your browser Dev Tools.
(() => {
  const txt = el => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');

  // Header info
  const button = document.querySelector('.suite-up-button');
  const crumbs = button ? button.querySelectorAll('.suite-up-button-text-secondary') : [];
  const accountName = txt(crumbs.length > 1 ? crumbs[1] : crumbs[0]);
  const containerName = txt(button && button.querySelector('.suite-up-text-name'));
  const gtmId = txt(document.querySelector('.gtm-container-public-id')) ||
    (document.body.innerText.match(/GTM-[A-Z0-9]+/) || [''])[0];

  // Map columns by header text
  const headers = [...document.querySelectorAll('table.gtm-multiselect-table thead th')]
    .map(th => txt(th).toLowerCase());
  const col = name => headers.findIndex(h => h.includes(name));
  const idx = {
    name: col('name'),
    type: col('type'),
    triggers: col('firing'),
    folder: col('folder'),
    edited: col('last edited'),
  };
  console.log('Column map:', idx, headers);

  const rows = document.querySelectorAll('tr.wd-tag-row');
  if (!rows.length) { console.error('No tag rows found (tr.wd-tag-row). Are you on the Tags list?'); return; }

  const data = [...rows].map(tr => {
    const cells = tr.querySelectorAll(':scope > td');
    const cell = i => (i >= 0 ? cells[i] : null);

    // Split firing triggers from exceptions
    const trigCell = cell(idx.triggers);
    const exceptionChips = new Set(trigCell ? trigCell.querySelectorAll('div > label ~ gtm-trigger-chip .small-trigger-chip') : []);
    const allChips = trigCell ? [...trigCell.querySelectorAll('.small-trigger-chip')] : [];
    const firing = allChips.filter(c => !exceptionChips.has(c)).map(txt).join(', ');
    const exceptions = allChips.filter(c => exceptionChips.has(c)).map(txt).join(', ');

    const editedCell = cell(idx.edited);
    const editedSpan = editedCell && editedCell.querySelector('span[title]');

    return {
      Account: accountName,
      Property: containerName,
      GTM_Container: gtmId,
      Name: txt(cell(idx.name)),
      Type: txt(cell(idx.type)),
      Folder: txt(cell(idx.folder)),
      Firing_Triggers: firing,
      Exceptions: exceptions,
      Last_Edited: editedSpan ? editedSpan.title : txt(editedCell),
      Currently_Paused: tr.classList.contains('gtm-table-row--paused') || !!tr.querySelector('.pause-circle-filled-icon'),
    };
  });

  const esc = v => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [
    Object.keys(data[0]).join(','),
    ...data.map(o => Object.values(o).map(esc).join(',')),
  ].join('\n');

  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  a.download = 'gtm_data.csv';
  document.body.appendChild(a); a.click(); a.remove();
  console.log(`Exported ${data.length} rows`);
})();
