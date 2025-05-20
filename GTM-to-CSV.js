// Paste this script in the Console section of your browser Dev Tools.
gtmData = [];

var button = document.querySelector(".suite.suite-up-button.md-button.md-standard-theme.md-ink-ripple.layout-align-start-center.layout-row");

// Extract the account name
var accountNameElements = button.querySelectorAll(".suite-up-button-text-secondary");
var accountName = '';
if (accountNameElements.length > 1) {
    accountName = accountNameElements[1].textContent.trim();
} else {
    console.log("Expected more than one .suite-up-button-text-secondary element, found less");
}

// Extract the GTM container name
var gtmContainerNameElement = button.querySelector(".suite-up-text-name");
var gtmContainerName = gtmContainerNameElement ? gtmContainerNameElement.textContent.trim() : '';

// GTM Container ID
var gtmNumberElement = document.querySelector('.gtm-container-public-id.md-gtm-theme');
var gtmNumber = gtmNumberElement ? gtmNumberElement.textContent.trim() : '';

document.querySelectorAll('tr[gtm-table-row]').forEach(n => {
    const td2 = n.querySelector('td:nth-child(1)');
    const td3 = n.querySelector('td:nth-child(2)');
    const td4 = n.querySelector('td:nth-child(3)');
    const td5 = n.querySelector('td:nth-child(6)');

    const triggerName = td3 ? td3.textContent.trim() : '';
    const eventType = td4 ? td4.textContent.trim() : "";
    const firingTriggers = Array.from(n.querySelectorAll('td:nth-child(4) .small-trigger-chip')).map(conditionElement => conditionElement.textContent.trim()).join(', ');
    const lastEdited = td5 ? td5.textContent.trim() : '';

    // To find if Tag is currently paused
    let paused = false;
    if (td5) {
        const visibleNodes = Array.from(td5.childNodes).filter(child => child.clientHeight > 0);
        paused = visibleNodes.length !== 0;
    }

    gtmData.push({
        Account: accountName,
        Property: gtmContainerName,
        GTM_Container: gtmNumber,
        Name: triggerName,
        Type: eventType,
        Firing_Triggers: firingTriggers,
        Last_Edited: lastEdited,
        Currently_Paused: paused
    });
});

// Convert to CSV
function convertToCSV(data) {
    const header = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).map(val => `"${String(val).replace(/"/g, '""')}"`).join(','));
    return [header, ...rows].join('\n');
}

function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const csv = convertToCSV(gtmData);
downloadCSV(csv, "gtm_data.csv");
