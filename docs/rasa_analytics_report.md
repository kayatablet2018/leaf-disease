# Rasa Demo Bot Analytics Report

This document summarises the analytical implementation, evaluation strategy, and dashboarding approach created for the Rasa open-source demo bot. It accompanies the executable Google Colab notebook located at `notebooks/rasa_chatbot_analytics.ipynb`, which contains the full Python code for generating the simulated logs, computing metrics, and producing the visualisations described below.

---

## Görev 3 · Chatbot Analitiğinin Uygulamalı Uygulanması ve Değerlendirilmesi (25 Puan)

### Kullanılan Veri ve Yöntem
- **Rasa Demo Botu:** Analiz için Rasa'nın GitHub üzerinde yayımlanan demo bot senaryosu temel alınmıştır. Konuşma günlükleri gerçek konuşmalarla eşleştirilebilmesi amacıyla Rasa tracker formatını taklit eden simülasyon fonksiyonuyla üretilmiştir.
- **Teknolojiler:** Python 3.10, Pandas, NumPy, Matplotlib, Seaborn ve Plotly (Colab üzerinde `%pip` komutuyla kurulabilir).
- **Log Üretimi:** `simulate_rasa_logs` fonksiyonu farklı kanallardan gelen 150 oturumu oluşturur. Her oturum içinde niyet, zaman damgası, kanal, fallback işareti ve yolculuk durumu gibi alanlar bulunur.

### Uygulanan Analitik Özellik: Fallback Optimizasyonu
- Kanal başına fallback oranları hesaplanarak, hangi platformda toparlanma akışlarının geliştirilmesi gerektiği belirlenir.
- Niyet bazlı fallback analizi, botun hangi kullanıcı amaçlarında yetersiz kaldığını ortaya çıkarır.
- Oturum başına fallback ısı haritası, hatalı yanıtların konuşmanın hangi adımında gerçekleştiğini görselleştirir.
- Toplanan sonuçlar `rasa_demo_metrics.json` dosyasına aktarılarak MLOps veya BI süreçlerine entegre edilebilir.

### Performans ve Kullanıcı Memnuniyeti Açısından Katkılar
- **Kanal bazlı ölçümler** webchat kanalında daha yüksek fallback riskini göstererek, bot yanıtlarının veya kanal entegrasyonunun iyileştirilmesini sağlar.
- **Niyet frekansı ile fallback kombinasyonu**; örneğin `out_of_scope` niyeti yüksek fallback oranına sahipse, yeni eğitim verileri eklenmesi gerektiğini gösterir.
- **Isı haritası** konuşma akışında kritik kırılma noktalarını belirleyerek, daha iyi yönlendirme mesajları veya insan temsilciye aktarma tetiklerini ayarlamaya yardımcı olur.

### Etik Tasarım, Şeffaflık ve Açıklanabilirlik
- Fallback olaylarının izlenmesi, botun emin olmadığı durumlarda kullanıcıyı bilgilendirme ve açıkça yönlendirme mekanizmalarını güçlendirir.
- Kanala göre metrikler, hangi platformda veri toplama veya yönlendirme uygulamalarının kullanıcıya açıklanması gerektiğini gösterir.
- Analiz çıktıları paydaşlarla paylaşılabilir ve kullanıcı gizliliği korunarak anonimleştirilmiş özetler üzerinden açıklanabilir karar destekleri sunar.

---

## Görev 4 · Eleştirel Değerlendirme ve Test Stratejisi (20 Puan)

### Önerilen Test Yöntemleri
1. **A/B Testleri:**
   - *Örnek hipotez:* Kısa, doğrudan yanıtlar ile daha açıklayıcı yanıtların kullanıcı memnuniyeti üzerindeki etkisi.
   - *Uygulama:* Rasa'nın politika yapılandırmasıyla iki farklı yanıt şablonu dağıtılıp konuşma sonu geri bildirimleri ve çözüm oranları karşılaştırılır.
2. **İstatistiksel Diyalog Testleri:**
   - *Ölçüm:* Yeniden eğitim öncesi ve sonrası fallback oranlarının iki örneklem proporsiyon testiyle (örn. z-testi) kıyaslanması.
   - *Veri Kaynağı:* Notebook'taki `fallback_summary` çıktıları veya gerçek tracker günlükleri.
3. **Diyalog Anomalisi / Niyet Kayması Tespiti:**
   - *Yöntem:* Yeni veya düşük güven skorlu niyetleri tespit eden bir eşik tabanlı uyarı sistemi. Konuşmalardan TF-IDF vektörleri veya sentence embedding'leriyle kümeleme yapılabilir.
   - *Aksiyon:* Yeni konu tespitinde ürün ekibine bildirim ve bot yanıtlarının güncellenmesi.

### Eleştirel Yansıma
- **Kullanıcı Odaklı İyileştirmeler:** A/B testleri kullanıcıya en yüksek memnuniyeti sağlayan ton ve yanıt detayını bulmak için doğrudan geri bildirim toplar. İstatistiksel testler, yapılan model güncellemelerinin gerçekten hataları azalttığını kanıtlar. Anomali tespiti, kullanıcıların yeni ihtiyaçlarını hızlıca fark ederek botun güncel ve yardımcı kalmasını sağlar.
- **Chatbot Tasarımında Yenilik:** Sistematik deney ve ölçüm yaklaşımı, bot mimarisinin veriye dayalı evrimini destekler. Anomali tespiti ile bot, eğitim verisinin dışında kalan yeni konuları otomatik algılayarak sürekli öğrenen bir yapıya kavuşur.

---

## Görev 5 · İçgörülü Raporlama ve Görselleştirme (15 Puan)

### Gösterge Paneli Tasarımı
Notebook'ta üretilen Plotly grafikleri temel alınarak aşağıdaki bileşenlere sahip bir gösterge paneli önerilmektedir:

1. **Platform Performansı:** `Fallback Rate by Channel` çubuk grafiği farklı kanallardaki başarı durumunu gösterir.
2. **Kullanıcı Yolculuğu Atribüsyonu:** `User Journey Funnel` grafiği kullanıcıların başlangıçtan çözüme veya fallback ile çıkışa kadar olan akışı izler.
3. **Geri Bildirim / Örtük Sinyaller:** `Conversation Outcomes` pasta grafiği başarı ve fallback oranlarını öne çıkarır.
4. **Zaman Serisi İzleme:** `Sessions over Time` çizgi grafiği yoğunluk piklerini ve trendleri takip eder.
5. **Top Intentler:** `Top User Intents` çubuk grafiği en sık karşılaşılan kullanıcı amaçlarını sıralar.

Plotly grafikleri Dash veya Streamlit üzerinden kolaylıkla gerçek zamanlı dashboard'a dönüştürülebilir; notebook, her grafiğin veri çerçevesini hazırlar.

### Teknik Olmayan Paydaşlar İçin Katma Değer
- Grafikler, karmaşık metrikleri görsel hale getirerek ürün yöneticilerinin bot sağlığını hızlıca değerlendirmesini sağlar.
- Funnel ve pasta grafikleri, kullanıcıların nerede kaybedildiğini açıkça göstererek yatırım yapılması gereken akış adımlarını öne çıkarır.
- Zaman serisi, destek ekiplerinin yoğun saatlerde kaynak planlaması yapmasına yardımcı olur.
- Intent frekansı, içerik ve bilgi tabanı ekiplerinin önceliklendirme yapmasını destekler.

---

## Teslimatlar
- **Notebook:** `notebooks/rasa_chatbot_analytics.ipynb`
- **JSON Çıktısı:** Notebook çalıştırıldığında `rasa_demo_metrics.json` metrik demetini üretir.
- **Görseller:** Notebook içinde Plotly ve Seaborn grafikleri oluşturulur (Colab'de interaktif).
- **Yazılı Açıklamalar:** Bu belge Görev 3, 4 ve 5 için açıklamaları ve yansımaları içerir.

