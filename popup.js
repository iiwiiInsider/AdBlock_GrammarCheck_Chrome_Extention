const toggleButton = document.getElementById('toggle');
const fixButton = document.getElementById('fix-page');
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
  toggleButton.classList.toggle('secondary', !enabled);
}

async function handleActiveTabMessage(action, onSuccess, onError) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (!activeTab) {
      onError?.('Unable to access this tab.');
      return;
    }

    chrome.tabs.sendMessage(activeTab.id, action, (response) => {
      const lastError = chrome.runtime.lastError;
      if (lastError) {
        onError?.('This page is not ready for a content script update.');
        return;
      }

      onSuccess?.(response);
    });
  });
}

(async function init() {
  const enabled = await getEnabledState();
  await updateToggleState(enabled);

  toggleButton.addEventListener('click', async () => {
    const nextState = toggleButton.dataset.enabled !== 'true';

    chrome.storage.local.set({ spellCorrecterEnabled: nextState }, async () => {
      await updateToggleState(nextState);
      setStatus(nextState ? 'Auto-correct enabled.' : 'Auto-correct disabled.');
    });

    handleActiveTabMessage(
      { action: 'toggle', enabled: nextState },
      () => {
        // Content script handles the state change immediately.
      },
      () => {
        // Ignore page-level failures so the popup still reflects the saved setting.
      }
    );
  });

  fixButton.addEventListener('click', () => {
    handleActiveTabMessage(
      { action: 'fixCurrentPage' },
      (response) => {
        const fixedCount = Number(response?.fixedCount || 0);
        if (fixedCount > 0) {
          setStatus(`Corrected ${fixedCount} field${fixedCount === 1 ? '' : 's'} on this page.`);
          return;
        }

        setStatus('No spelling issues were found on this page.', true);
      },
      (errorMessage) => {
        setStatus(errorMessage, false);
      }
    );
  });
})();
