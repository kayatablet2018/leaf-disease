# GitHub Push Instructions

Aşağıdaki komutlar, bu depo üzerindeki değişiklikleri GitHub üzerindeki uzak (remote) bir depoya göndermek için kullanılabilir. Komutları çalıştırmadan önce GitHub üzerinde boş bir depo oluşturduğunuzdan ve HTTPS/SSH erişiminizin hazır olduğundan emin olun.

1. ## Uzak Depoyu Tanımla
   ```bash
   git remote add origin https://github.com/<kullanici-adi>/<depo-adi>.git
   ```
   > Eğer uzak depo zaten tanımlıysa, bu adımı atlayabilir ya da aşağıdaki komutla adresini güncelleyebilirsiniz:
   ```bash
   git remote set-url origin https://github.com/<kullanici-adi>/<depo-adi>.git
   ```

2. ## Değişiklikleri Kontrol Et
   ```bash
   git status
   ```
   Bu komut hangi dosyaların değiştiğini gösterir.

3. ## Değişiklikleri Kaydet (Commit)
   ```bash
   git add .
   git commit -m "Rasa chatbot analitik materyallerini ekle"
   ```

4. ## Değişiklikleri GitHub'a Gönder (Push)
   ```bash
   git push -u origin work
   ```
   > `work` mevcut dal adıdır. Başka bir dal kullanıyorsanız onu yazın.

5. ## Sonraki Push İşlemleri
   İlk push işleminden sonra aynı dal için:
   ```bash
   git push
   ```

6. ## Doğrulama
   GitHub web arayüzünden depo sayfanızı yenileyerek commit'lerin yüklendiğini doğrulayabilirsiniz.

> **Not:** Bu ortamdan doğrudan GitHub'a push işlemi yapamamaktayız; yukarıdaki komutlar kendi makineniz üzerinde kullanmanız içindir.
