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
    const queryError = chrome.runtime.lastError;
    if (queryError) {
      onError?.('Unable to access this tab.');
      return;
    }

    const activeTab = tabs[0];
    if (!activeTab || activeTab.id === undefined) {
      onError?.('Unable to access this tab.');
      return;
    }

    let injectionAttempted = false;
    const sendMessage = () => {
      chrome.tabs.sendMessage(activeTab.id, action, (response) => {
        const messageError = chrome.runtime.lastError;
        if (!messageError) {
          onSuccess?.(response);
          return;
        }

        if (injectionAttempted) {
          onError?.('Could not communicate with the content script on this page.');
          return;
        }

        injectionAttempted = true;
        chrome.scripting.executeScript(
          { target: { tabId: activeTab.id }, files: ['content.js'] },
          () => {
            const injectionError = chrome.runtime.lastError;
            if (injectionError) {
              onError?.('Chrome does not allow content scripts on this page.');
              return;
            }
            sendMessage();
          }
        );
      });
    };

    sendMessage();
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
