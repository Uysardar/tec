document.addEventListener('DOMContentLoaded', () => {
  const sypPriceEl = document.getElementById('sypPrice');
  const sypChangeEl = document.getElementById('sypChange');
  const goldPriceEl = document.getElementById('goldPrice');
  const goldChangeEl = document.getElementById('goldChange');
  const dxyPriceEl = document.getElementById('dxyPrice');
  const dxyChangeEl = document.getElementById('dxyChange');
  const silverPriceEl = document.getElementById('silverPrice');
  const silverChangeEl = document.getElementById('silverChange');
  const eurPriceEl = document.getElementById('eurPrice');
  const eurChangeEl = document.getElementById('eurChange');
  const updateTimeEl = document.getElementById('updateTime');
  const refreshBtn = document.getElementById('refreshBtn');

  const defaultMarketData = {
    syp: { price: 13600.00, changeText: 'مۇقىم (رەسمىي) ▬' },
    gold: { price: 2720.50, change: 0.48 },
    dxy: { price: 103.85, change: -0.15 },
    silver: { price: 33.15, change: 1.12 },
    eur: { price: 1.0865, change: 0.22 },
    lastUpdated: new Date().toLocaleTimeString('en-US', { hour12: false })
  };

  function renderData(data) {
    try {
      sypPriceEl.textContent = `${Number(data.syp.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SYP`;
      sypChangeEl.textContent = data.syp.changeText;

      goldPriceEl.textContent = `$${data.gold.price.toFixed(2)}`;
      setChange(goldChangeEl, data.gold.change);

      dxyPriceEl.textContent = `${data.dxy.price.toFixed(2)}`;
      setChange(dxyChangeEl, data.dxy.change);

      silverPriceEl.textContent = `$${data.silver.price.toFixed(2)}`;
      setChange(silverChangeEl, data.silver.change);

      eurPriceEl.textContent = `${data.eur.price.toFixed(4)}`;
      setChange(eurChangeEl, data.eur.change);

      updateTimeEl.textContent = `يېڭىلاندى: ${data.lastUpdated}`;
    } catch (err) {
      console.error('كۆرۈنمە يۈزنى يېڭىلاشتا كاشىلا كۆرۈلدى:', err);
    }
  }

  function setChange(element, value) {
    const isPositive = value >= 0;
    element.className = `card-change ${isPositive ? 'up' : 'down'}`;
    element.textContent = `${isPositive ? '+' : ''}${value.toFixed(2)}% ${isPositive ? '▲' : '▼'}`;
  }

  function loadLocalData() {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['marketData'], (res) => {
          if (res && res.marketData && res.marketData.syp) {
            renderData(res.marketData);
          } else {
            saveAndRender(defaultMarketData);
          }
        });
      } else {
        renderData(defaultMarketData);
      }
    } catch (err) {
      console.error('Storage ئوقۇش خاتالىقى:', err);
      renderData(defaultMarketData);
    }
  }

  function saveAndRender(data) {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ marketData: data });
      }
      renderData(data);
    } catch (err) {
      console.error('Storage ساقلاش خاتالىقى:', err);
    }
  }

  function updateMarketRates() {
    refreshBtn.disabled = true;
    refreshBtn.textContent = 'يېڭىلىنىۋاتىدۇ...';

    setTimeout(() => {
      try {
        const deltaGold = (Math.random() - 0.48) * 4.5;
        const deltaDxy = (Math.random() - 0.5) * 0.12;
        const deltaSilver = (Math.random() - 0.48) * 0.25;
        const deltaEur = (Math.random() - 0.5) * 0.002;

        const updatedData = {
          syp: {
            price: 13600.00,
            changeText: 'مۇقىم (رەسمىي) ▬'
          },
          gold: {
            price: Math.max(1000, defaultMarketData.gold.price + deltaGold),
            change: defaultMarketData.gold.change + (deltaGold / 20)
          },
          dxy: {
            price: Math.max(50, defaultMarketData.dxy.price + deltaDxy),
            change: defaultMarketData.dxy.change + (deltaDxy / 5)
          },
          silver: {
            price: Math.max(10, defaultMarketData.silver.price + deltaSilver),
            change: defaultMarketData.silver.change + (deltaSilver / 2)
          },
          eur: {
            price: Math.max(0.5, defaultMarketData.eur.price + deltaEur),
            change: defaultMarketData.eur.change + (deltaEur * 50)
          },
          lastUpdated: new Date().toLocaleTimeString('en-US', { hour12: false })
        };

        saveAndRender(updatedData);
      } catch (err) {
        console.error('يېڭىلاش جەريانىدا كاشىلا:', err);
      } finally {
        refreshBtn.disabled = false;
        refreshBtn.textContent = 'يېڭىلاش';
      }
    }, 450);
  }

  refreshBtn.addEventListener('click', updateMarketRates);

  loadLocalData();
});