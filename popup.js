const toggleButton = document.getElementById('toggle');
const statusText = document.getElementById('status');

async function getEnabledState() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['spellCorrecterEnabled'], (result) => {
      const isEnabled = result.spellCorrecterEnabled !== false;
      resolve(isEnabled);
    });
  });
}

function setStatus(message, isSuccess = true) {
  statusText.textContent = message;
  statusText.style.color = isSuccess ? '#065f46' : '#991b1b';
}

async function updateToggleState(enabled) {
  toggleButton.dataset.enabled = String(enabled);
  toggleButton.textContent = enabled ? 'Disable' : 'Enable';
  toggleButton.classList.toggle('primary', enabled);
}

(async function init() {
  const enabled = await getEnabledState();
  await updateToggleState(enabled);

  toggleButton.addEventListener('click', async () => {
    const nextState = toggleButton.dataset.enabled !== 'true';

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab) {
        setStatus('Unable to access this tab.', false);
        return;
      }

      chrome.tabs.sendMessage(
        activeTab.id,
        { action: 'toggle', enabled: nextState },
        () => {
          chrome.storage.local.set({ spellCorrecterEnabled: nextState }, async () => {
            await updateToggleState(nextState);
            setStatus(nextState ? 'Auto-correct enabled.' : 'Auto-correct disabled.');
          });
        }
      );
    });
  });

})();
