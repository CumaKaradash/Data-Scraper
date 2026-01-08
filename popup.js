document.getElementById('scrapeBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const statusArea = document.getElementById('statusArea');

  statusArea.innerText = "Sayfa taranıyor...";

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: scrapeProducts,
  }, (results) => {
    if (chrome.runtime.lastError) {
      statusArea.innerText = "Hata: " + chrome.runtime.lastError.message;
      return;
    }

    const products = results[0].result;

    if (!products || products.length === 0) {
      statusArea.innerText = "Hiç ürün bulunamadı.";
      return;
    }

    statusArea.innerText = `${products.length} ürün bulundu, indiriliyor...`;
    downloadCSV(products);
  });
});

// Sayfada çalışacak olan scraping fonksiyonu
function scrapeProducts() {
  const products = [];
  
  // Amazon Selectors
  let items = document.querySelectorAll('.s-result-item[data-component-type="s-search-result"]');
  let selectors = {
    title: 'h2 span',
    price: '.a-price-whole',
    image: '.s-image',
    link: 'a.a-link-normal'
  };

  // Trendyol Check
  if (items.length === 0) {
    items = document.querySelectorAll('.p-card-wrppr');
    selectors = {
      title: '.prdct-desc-cntnr-ttl',
      price: '.prc-box-dscntd',
      image: '.p-card-img',
      link: 'a'
    };
  }

  // Fallback (Generic)
  if (items.length === 0) {
    items = document.querySelectorAll('article, .product, .product-item');
    selectors = {
      title: 'h2, .title, .product-title',
      price: '.price, .product-price',
      image: 'img',
      link: 'a'
    };
  }

  items.forEach(item => {
    const titleEl = item.querySelector(selectors.title);
    const priceEl = item.querySelector(selectors.price);
    const imageEl = item.querySelector(selectors.image);
    const linkEl = item.querySelector(selectors.link);

    if (titleEl) {
      products.push({
        title: titleEl.innerText.trim().replace(/,/g, ''), // CSV bozulmaması için virgülleri temizle
        price: priceEl ? priceEl.innerText.trim().replace(/,/g, '') : 'N/A',
        image: imageEl ? imageEl.src : 'N/A',
        url: linkEl ? (linkEl.href.startsWith('http') ? linkEl.href : window.location.origin + linkEl.getAttribute('href')) : 'N/A'
      });
    }
  });

  return products;
}

// CSV Dönüştürme ve İndirme
function downloadCSV(data) {
  const headers = ["Ürün Adı", "Fiyat", "Resim Linki", "Ürün Linki"];
  const rows = data.map(p => `${p.title},${p.price},${p.image},${p.url}`);
  
  // BOM (Byte Order Mark) ekleyerek Excel'de Türkçe karakter desteği sağla
  const csvContent = "\uFEFF" + headers.join(",") + "\n" + rows.join("\n");
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `urunler_${new Date().getTime()}.csv`);
  document.body.appendChild(link);
  
  link.click();
  document.body.removeChild(link);
}
