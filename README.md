# 🕷️ Data Scraper Lite

E-ticaret sitelerinden (Amazon, Trendyol vb.) ürün bilgilerini (Ad, Fiyat, Resim, Link) otomatik olarak çeken ve Excel uyumlu CSV formatında indiren hafif bir veri kazıma aracıdır.

## ✨ Özellikler

- **Çoklu Platform Desteği:** - Amazon
  - Trendyol
  - Diğer siteler (Generic Fallback seçiciler ile)
- **Akıllı Algılama:** Sayfa yapısına göre doğru CSS seçicilerini (selectors) otomatik belirler.
- **Veri Temizliği:** Fiyat ve başlık alanlarındaki gereksiz boşlukları ve CSV formatını bozan virgülleri temizler.
- **Excel Uyumlu Çıktı:** Türkçe karakter sorunu yaşamamak için **BOM (Byte Order Mark)** desteği ile CSV oluşturur.
- **Görsel Bildirim:** Ürün bulunduğunda veya hata alındığında kullanıcıyı pop-up üzerinden bilgilendirir.

## 📦 Çıktı Formatı (CSV)

| Ürün Adı | Fiyat | Resim Linki | Ürün Linki |
|----------|-------|-------------|------------|
| Örnek Ürün | 100 TL | http://img... | http://site... |

## 🛠️ Kullanım

1. Bir e-ticaret sitesinde (örn: Amazon arama sonuçları) sayfayı açın.
2. Eklenti ikonuna tıklayın.
3. **"Scrape"** butonuna basın.
4. Veriler tarandıktan sonra `urunler_[timestamp].csv` dosyası otomatik inecektir.
