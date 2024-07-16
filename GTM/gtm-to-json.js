// Paste this script in the Console section of your browser Dev Tools.
gtmData = [];

var button = document.querySelector(".suite.suite-up-button.md-button.md-standard-theme.md-ink-ripple.layout-align-start-center.layout-row");

// Extract the account name
var accountNameElements = button.querySelectorAll(".suite-up-button-text-secondary");
var accountName;
if (accountNameElements.length > 1) {
    accountName = accountNameElements[1].textContent.trim();
} else {
    console.log("Expected more than one .suite-up-button-text-secondary element, found less");
}

// Extract the GTM container name
var gtmContainerNameElement = button.querySelector(".suite-up-text-name");
var gtmContainerName = gtmContainerNameElement.textContent.trim();

// GTM Container ID
var gtmNumber = document.querySelector('.gtm-container-public-id.md-gtm-theme').textContent.trim();

document.querySelectorAll('tr[gtm-table-row]').forEach(n => {
    const td2 = n.querySelector('td:nth-child(1)');
    const td3 = n.querySelector('td:nth-child(2)');
    const td4 = n.querySelector('td:nth-child(3)');
    const td5 = n.querySelector('td:nth-child(5)');

    const triggerName = td2 ? td2.textContent.trim() : '';
    const eventType = td3 ? td3.textContent.trim() : '';
    const firingTriggers = Array.from(n.querySelectorAll('td:nth-child(3) .small-trigger-chip')).map(conditionElement => conditionElement.textContent.trim());
    const lastEdited = td5 ? td5.textContent.trim() : '';


    // To find if Tag is currently paused
    let paused;
    if (td5) {
        const lastEditedClassNames = Array.from(td5.childNodes).filter(child => child.clientHeight > 0);
        paused = lastEditedClassNames.length !== 0;
    } else {
        console.log("No td:nth-child(6) found.");
    }

    const tag = {
        Account: accountName,
        Property: gtmContainerName,
        GTM_Container: gtmNumber,
        Name: triggerName,
        Type: eventType,
        Firing_Triggers: firingTriggers,
        Last_Edited: lastEdited,
        Currently_Paused: paused
    }

    gtmData.push(tag);
})

console.log(gtmData); // To see the output in console