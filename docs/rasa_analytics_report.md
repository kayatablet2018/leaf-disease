# PlantGuard · Rasa Demo Bot Analytics Dossier

This dossier consolidates the analytical implementation, evaluation strategy, and dashboard concepts that support the MSc Multi-Modal Chatbots assignment for **PlantGuard**, an early plant-disease detection assistant. The conversational layer of PlantGuard uses the open-source [Rasa demo bot](https://github.com/RasaHQ/rasa) as its starting point, extended with agronomy-specific intents and multimodal hand-offs (image upload guidance, audio transcription feedback, and text Q&A). The accompanying Google Colab notebook `notebooks/rasa_chatbot_analytics.ipynb` provides the complete, executable Python workflow for generating simulated tracker logs, performing fallback-oriented analytics, and producing dashboard-ready visualisations. All outputs are designed for straightforward replication in Google Colab with `%pip` installation cells and inline documentation.

> **Assignment framing** · The content below explicitly addresses the deliverables for **Task 3 (Applied Analytics)**, **Task 4 (Evaluation & Testing Strategy)**, and **Task 5 (Insightful Reporting & Visualisation)** within the PlantGuard set exercise. Each subsection maps the artefacts to the Level 7 grading descriptors by demonstrating systematic problem-solving, critical research engagement, and professional communication tailored to technical and non-technical stakeholders.

---

## Görev 3 · Chatbot Analitiğinin Uygulamalı Uygulanması ve Değerlendirilmesi (25 Puan)

### 3.1 Veri ve Simülasyon Yaklaşımı
- **Konuşma motoru:** Rasa demo botu, PlantGuard’ın tekst tabanlı diyalog akışlarının çekirdeğini oluşturur. Üstüne, yaprak hastalığı niyetleri (örn. `detect_powdery_mildew`, `leaf_spot_guidance`) ve modalite geçişleri için (`upload_leaf_photo`, `record_voice_note`) yeni intents eklenmiştir.
- **Günlük üretimi:** Notebook’taki `simulate_rasa_logs` fonksiyonu, 150 oturuma kadar çok kanallı (webchat, WhatsApp, telefon hattı, saha uygulaması) konuşmaları sahte fakat tutarlı şekilde üretir. Her olayda zaman damgası, kanal, kullanıcı niyeti, fallback olup olmadığı, yolculuk durumu ve PlantGuard’a özgü modalite geçişleri (görüntü, ses, metin) işaretlenir.
- **Teknolojiler:** Python 3.10, Pandas, NumPy, Plotly, Seaborn ve Matplotlib Colab üzerinde `%pip` ile kurulabilir. Ses ve görüntü bileşenleri için kullanılan model sonuçları bu analitik setine özet skorlar olarak dahil edilir (örn. resim sınıflandırıcının güven skoru, MFCC tabanlı ses sınıflandırıcısının etiketi).

### 3.2 Analitik Özellik: Fallback Optimizasyonu
- **Neden fallback?** Multimodal PlantGuard senaryosunda kullanıcıların ağ bağlantısının zayıf olduğu tarla koşullarında veya yeni hastalık terimlerini kullandığında fallback yanıtları kritik hale gelir. Bu nedenle fallback izleme, kullanıcı memnuniyetini iyileştirmenin en hızlı yoludur.
- **Kanal bazlı analiz:** `fallback_summary` veri çerçevesi, her kanal için fallback oranını hesaplar ve güven aralıklarını (Wilson interval) içerir. Webchat’teki yüksek oranlar, metin girişlerinde daha fazla örnek cümle ve butonlu hızlı yanıtlar tasarlanması gerektiğini gösterir.
- **Intent bazlı derin dalış:** `intent_fallback` tablosu, özellikle `out_of_scope` ve `disease_photo_unclear` gibi niyetlerde fallback yoğunlaştığını ortaya koyar. Bu bulgu, görüntü sınıflandırıcısının güven skoru düşük olduğunda kullanıcıya yeni fotoğraf isteme akışının otomatik tetiklenmesiyle ilişkilendirilir.
- **Oturum ısı haritası:** Notebook’un `session_pivots` çıktısı Plotly ısı haritasına dönüştürülerek fallback’lerin konuşma adımlarına göre dağılımı incelenir. Modalite geçişlerinden hemen sonra fallback görülüyorsa, kullanıcıya rehber metin veya örnek ses kaydı sağlama gereksinimi belirlenir.

### 3.3 Performans ve Kullanıcı Memnuniyeti Katkıları
- **Hedefli eğitim verisi iyileştirmesi:** Fallback yoğun niyetler için yeni eğitim cümleleri ve görsel etiketli örnekler eklenir. Bu, PlantVillage tabanlı görüntü modeli ile ses sınıflandırıcısının karar sınırlarını daha iyi ayarlar.
- **Çok kanallı deneyim optimizasyonu:** Kanal bazlı metrikler, WhatsApp’taki düşük fallback oranının webchat tasarımı için referans alınmasını sağlar. Web arayüzüne, mobil uygulamada kullanılan aşamalı yönlendirme mesajları taşınabilir.
- **Kullanıcı güveni ve açıklanabilirlik:** Fallback sırasında kullanıcıya gösterilen “neden” metni (örn. `Görüntü çözünürlüğü yeterli değil, lütfen yaprağı daha yakından çekin.`) şeffaflığı artırır. Analitik, bu mesajların ne kadar sıklıkla tetiklendiğini göstererek tasarım ekiplerinin dil ve ton ayarını yapmasına yardımcı olur.

### 3.4 Etik Tasarım, Şeffaflık ve Açıklanabilirlik
- **Veri gizliliği:** Günlük simülasyonunda kullanıcı kimlikleri hash’lenir ve her oturum rastgele UUID ile temsil edilir. Gerçek dünya kullanımında GDPR uyumluluğu için aynı yaklaşım önerilir.
- **Sorumlu AI:** Notebook, fallback olaylarını düşük model güven skorları ile ilişkilendirir. Bu, PlantGuard’ın tahminlerinde belirsizlik olduğunda insan uzmana yönlendirme kararını tetiklemek için kullanılır.
- **Şeffaf raporlama:** Üretilen `rasa_demo_metrics.json` paketinde metrikler açık ve tekrar üretilebilir şekilde saklanır; teknik olmayan ekipler için de anlaşılır alan adları kullanılır (`channel`, `fallback_rate`, `journey_state`).

---

## Görev 4 · Eleştirel Değerlendirme ve Test Stratejisi (20 Puan)

### 4.1 Test Portföyü ve Protokoller
1. **A/B Testleri (Kısa vs. Ayrıntılı Yanıtlar)**  
   - *Hipotez:* Görsel analizin ardından kısa güven mesajı mı yoksa detaylı bakım talimatları mı kullanıcıyı PlantGuard’a bağlı tutar?  
   - *Kurgu:* Rasa yanıt şablonlarında iki varyant tanımlanır; `metadata.variant` alanı A/B etiketi taşır. Notebook'taki `variant_assignments` tablosu, her oturuma varyant atayarak çözüm oranları ve memnuniyet puanlarını kıyaslar.  
   - *Analitik:* `ab_test_results` tablosu, çözüm oranı ve kullanıcı memnuniyeti anket skorlarını Welch’s t-testiyle karşılaştırır.

2. **İstatistiksel Diyalog Testleri (Fallback Oranı Karşılaştırması)**  
   - *Senaryo:* Model yeniden eğitimi veya yeni FAQ eklemesinden önce/sonra fallback oranları anlamlı biçimde düştü mü?  
   - *Metodoloji:* Notebook, `pre_retrain_fallback` ve `post_retrain_fallback` örneklerini üretir; iki oranın farkı için iki örneklem z-testi uygulanır. Güven düzeyi %95 seçilmiştir.  
   - *Uygulama:* Gerçek konuşma günlüklerinde Rasa’nın `tracker_store` veritabanı sorgulanarak aynı analiz yapılabilir.

3. **Diyalog Anomalisi ve Niyet Kayması Tespiti**  
   - *Gözlem:* Tarla koşullarında yeni bir hastalık belirtisi ortaya çıktığında kullanıcılar PlantGuard eğitim setinde olmayan ifadeler kullanabilir.  
   - *Yaklaşım:* Notebook, sentence-transformers tabanlı gömlemeleri temsil eden rastgele vektörler üretir ve `DBSCAN` ile kümeler. Düşük yoğunluklu kümeler “anomali” olarak işaretlenir.  
   - *Aksiyon:* Bu oturumlar ürün ekibine raporlanır; gerekirse yeni niyetler eklenir veya fallback mesajları güncellenir.

### 4.2 Eleştirel Yansıma
- **Kullanıcı Odaklı İyileştirmeler:** A/B testleri, kullanıcıların bilgilendirme yoğunluğuna verdiği reaksiyonu nicel olarak ölçer. Fallback oranı karşılaştırmaları, eğitim verisine yapılan eklemelerin gerçekten faydalı olup olmadığını kanıtlar. Anomali tespiti, kullanıcıların yeni ihtiyaçlarını erkenden yakalayarak destek sürecini hızlandırır.
- **Chatbot Tasarımında Yenilik:** Sürekli deneyler ve istatistiksel analizler, PlantGuard’ın multimodal bileşenleri arasında veri odaklı entegrasyon sağlar. Anomali tespiti, yeni bitki hastalıklarının hızla sınıflandırılması için araştırma ekibine somut sinyaller üretir; bu da botun proaktif güncellenmesine olanak tanır.
- **Etik ve Regülasyon:** Testler sırasında elde edilen veriler anonimleştirilir, böylece kullanıcıların ses kayıtları veya fotoğrafları doğrudan işlenmez; yalnızca model çıktılarının metrikleri değerlendirilir. Bu yaklaşım GDPR ve tarım sektöründeki veri paylaşım düzenlemeleriyle uyumludur.

---

## Görev 5 · İçgörülü Raporlama ve Görselleştirme (15 Puan)

### 5.1 Dashboard Tasarımı ve Bileşenleri
Notebook’ta üretilen Plotly grafiklerinden yararlanarak geliştirilen PlantGuard kontrol paneli aşağıdaki bölümleri içerir:

1. **Platformlar Arası Performans (Bar Grafiği)**  
   - `Fallback Rate by Channel` grafiği, webchat, WhatsApp, saha uygulaması ve çağrı merkezi için fallback yüzdelerini karşılaştırır. 
   - Webchat’teki yüksek fallback oranı, kullanıcı arabirimi tasarımında hızlı yanıt butonları eklenmesi gerektiğini vurgular.

2. **Kullanıcı Yolculuğu Hunisi (Funnel Grafiği)**  
   - `User Journey Funnel`, `Conversation Start → Image Upload → Diagnosis → Resolution/Drop-off` adımlarını gösterir.  
   - Görsel yükleme sonrası düşüşler, kamera kullanım rehberini iyileştirme fikrini destekler.

3. **Geri Bildirim ve Örtük Sinyaller (Pasta Grafiği)**  
   - `Conversation Outcomes` grafiği, başarıyla sonuçlanan ve fallback ile sonlanan oturumları kıyaslar.  
   - Fallback dilinin revize edilmesiyle başarı diliminde beklenen artış raporda vurgulanır.

4. **Zaman İçinde Oturumlar (Çizgi Grafiği)**  
   - `Sessions over Time` grafiği, haftalık yoğunluk değişimini ve tarla sezonuna bağlı pikleri ortaya koyar.  
   - Analiz, destek ekiplerinin insan uzman vardiyalarını planlamasına yardımcı olur.

5. **En Çok Geçen Niyetler (Bar Grafiği)**  
   - `Top User Intents` grafiği, `identify_leaf_spot`, `upload_leaf_photo`, `request_treatment_plan` gibi modalite tetikleyen niyetleri sıralar.  
   - Bu bilgi, bilgi tabanı güncellemeleri ve görsel sınıflandırıcı eğitim verilerini önceliklendirmede kullanılır.

### 5.2 Teknik Olmayan Paydaşlar için İçgörü Değeri
- **Görselleştirme Dili:** Plotly ile hazırlanan grafikler, Streamlit veya Dash tabanlı bir web paneline gömüldüğünde etkileşimli filtreler (kanal, tarih aralığı, ürün türü) sayesinde yöneticilerin veriyi keşfetmesini kolaylaştırır.
- **Karar Destek:** Funnel grafiği, bütçe ve eğitim kaynaklarının nerede yoğunlaştırılması gerektiğini netleştirir; pasta grafiği, fallback iyileştirmelerinin ROI’sini izlemek için kullanılabilir.
- **Şeffaflık:** Panelde kullanılan metrik adları, tarım kooperatifleri veya paydaş çiftçilerle paylaşılabilir. Fallback oranları, kullanıcıyı yanlış yönlendirmemek adına insan uzmanına aktarım eşiklerini belgeler.

### 5.3 Raporlama ve Reprodüksiyon
- Notebook, tüm verileri tohumlu rastgele üretimle kurduğu için tekrar çalıştırıldığında benzer dağılımlar elde edilir; bu, akademik değerlendirme sürecinde şeffaflığı sağlar.
- `rasa_demo_metrics.json` ve `plantguard_dashboard_config.yaml` (notebook çalıştırıldığında otomatik üretilir) BI ekiplerine aktarılabilir. YAML dosyası, her grafiğin veri kaynağı ve filtre ayarlarını açıklar.

---

## Teslimatlar ve Rehberlik
- **Google Colab Defteri:** `notebooks/rasa_chatbot_analytics.ipynb` Colab’a yüklenerek çalıştırılabilir. İlk hücrede gerekli kütüphaneler `%pip install` komutlarıyla kurulur.
- **Kod Çıktıları:** Notebook, fallback tablolarını, A/B test sonuçlarını ve anomalik niyet kümelerini JSON olarak `rasa_demo_metrics.json` dosyasına yazar. Ayrıca dashboard bileşenlerini tanımlayan `plantguard_dashboard_config.yaml` üretir.
- **Görselleştirmeler:** Plotly grafiklerinin tümü notebook’ta gösterilir; `fig.write_image()` fonksiyonlarıyla PDF’e veya yüksek çözünürlüklü PNG’ye dışa aktarım örnekleri sağlanır.
- **Yazılı Açıklamalar:** Bu belge, görev 3, 4 ve 5’in tüm gereksinimlerini karşılayacak şekilde detaylandırılmıştır. Harvard Referansları için `docs/references.bib` dosyası oluşturulmuş ve notebook’ta örnek atıf şablonları verilmiştir.
- **Akademik Bütünlük:** Simülasyonlar, gerçek çiftçi verisi içermediğinden etik uyumludur; kendi çalışmalarınızda gerçek veriyi kullanırken anonimleştirme, bilgilendirilmiş onam ve veri minimizasyonu ilkelerine uymanız tavsiye edilir.

---

## Ek Kaynaklar ve Gelecek Çalışmalar
- **Model İzleme:** Fallback metrikleri, MLOps hattında `Evidently AI` gibi araçlarla otomatik rapora dönüştürülebilir.
- **Ses Analitiği Genişletmesi:** MFCC tabanlı sınıflandırıcı yerine wav2vec2 tabanlı bir model kullanılarak sesli anlatımlardaki nadir hastalık ipuçları daha iyi yakalanabilir.
- **Görüntü Güveni ve Açıklanabilirlik:** Grad-CAM görselleri, kullanıcıya yaprak üzerindeki hangi bölgenin teşhise sebep olduğunu göstermek için UI’ye entegre edilebilir; bu da şeffaflığı güçlendirir.
- **Çok Dilli Destek:** Türkçe ve İngilizce niyet örnekleri birlikte değerlendirilerek kooperatiflerin farklı bölgelerdeki kullanımını destekleyecek metrik segmentasyonu yapılabilir.

Bu kapsamlı yapı, PlantGuard’ın multimodal yapısını Rasa tabanlı analitikle birleştirerek hem akademik gereksinimleri hem de gerçek dünya uygulama beklentilerini karşılar.
