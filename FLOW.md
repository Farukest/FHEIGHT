# FHEIGHT - FHE Session ve Decrypt Akışı (Otel Analojisi)

## Karakterler

| Teknik Terim | Otel Analojisi |
|--------------|----------------|
| Contract | Otel (bina + resepsiyon) |
| KMS | Görevli (kutuları getiren) |
| Encrypted Value | Kutu (master key ile kilitli) |
| Handle | Kutu numarası (301, 302...) |
| ACL | Kutunun üstündeki "kim açabilir" listesi |
| Session Key | Otel kartı (geçici, süreli) |
| Cüzdan Adresi | Kimlik (0x78c1...) |
| Master Key | Otelin ana anahtarı (sadece KMS'te) |
| publicKey | Senin verdiğin kilit (KMS bununla kilitleyecek) |
| privateKey | Senin anahtarın (sadece sen açabilirsin) |

---

## HAZIRLIK: Otel Kartı ve Kilit Alma

### Adım 1: Session Key Oluştur (Tarayıcıda)

```
Zama'nın özel aleti var (fhevmInstance.generateKeypair)
Amazon'dan da alabilirsin, herkes kullanabilir.

Bu alet sana iki şey veriyor:
- publicKey: Herkese verebilirsin (kilit gibi)
- privateKey: GİZLİ, sadece sende (anahtar gibi)

Cebine (localStorage) koyuyorsun ikisini de.
```

### Adım 2: Otel Kartı Al (Signature)

```
MetaMask popup çıkıyor:

"Bu publicKey benim adıma çalışabilir.
 Süre: 1 gün"

Sign'a basıyorsun.
Gas yok, para yok.
Blockchain'e bir şey yazılmıyor.

Signature = Otel kartın
Cebine (localStorage) koyuyorsun.

Kartın üstünde yazıyor:
- Senin cüzdan adresin (0x78c1)
- publicKey
- SKT (1 gün sonra)
```

### Cebinde (localStorage) Ne Var?

```json
{
  "publicKey": "0x04a1b2...",
  "privateKey": "0x9f8e7d...",
  "signature": "0x1a2b3c..."
}
```

---

## ADIM 1: Otele Giriş (joinGame TX)

```
Sen: joinGame() çağırıyorsun

MetaMask popup: "Gas öde, TX imzala"
→ Confirm

Contract (Otel Sahibi) çalışıyor:
1. "Yeni müşteri geldi: 0x78c1"
2. 5 kutu oluşturuyor (encrypted kartlar)
   - Kutu 301: [içinde kart, master key ile kilitli]
   - Kutu 302: [içinde kart, master key ile kilitli]
   - Kutu 303: [içinde kart, master key ile kilitli]
   - Kutu 304: [içinde kart, master key ile kilitli]
   - Kutu 305: [içinde kart, master key ile kilitli]
3. Her kutunun üstüne yazıyor (ACL):
   - "0x78c1 açabilir"

TX bitti. Kutular hazır, ACL tanımlı.
```

---

## ADIM 2: Kutu Numaralarını Öğren (View Call)

```
Sen: "Kutularım hangileri Otel sahibine soruyorsun ?"

const handles = await gameSession.getHand();

Contract (Resepsiyon - Sadece dinleyici view methodu. Yazma yok TX yok yani):
1. "Kim soruyor ( otel sahibi(resepsyon) dinliyor - view - viewer yani ) ?" → msg.sender = 0x78c1
2. Tüm kutulara bakıp seninkileri ayırmaya gidiyor ve senden aldığı msg.sender ( adresi ilbunu isteyen az önce ( dinlediğim ele olan kutuları filtreliyor - ayırıyor )
4. ACL'de ( kutu üstünde ) "0x78c1" yazanları buluyor. ( Çünkü az önce seni dinledi ve adresini aldı biliyor adresini )
5. Kutu numaralarını alıp sana veriyor: [301, 302, 303, 304, 305]

Bu bir VIEW call:
- Gas yok
- Popup yok
- Blockchain'e yazı yok
- Sadece okuma
```

---

## ADIM 3: Kutuyu Getir (KMS Decrypt)

```
Sen: Artık Kutu numaralarınnı biliyorsun. 
Sen : KMS'YE yani Görevliye diyorsun git "Kutu 301'i getir"
KMS : senden bilgileri talep ediyor ( lütfen kartınızı ve cihazdan aldığınız key'inizi söyleyin ve hangi kutuyu istiyorsunuz söyleyin diyor )

KMS'e gönderdiğin paket ( yani Görevli ye az önce verdiğin bilgiler ):
{
  handle: "kutu_301",           // Hangi kutuyu istediğin
  signature: "0x1a2b3c...",     // Otel kartın ( mm ile imzalayarak aldığın signature )
  publicKey: "0x04a1b2..."      // Yeni kilitlemek için ( zama cihazı ile aldığın ve cebine koyduğun 2 keyden public olan ( hem prive hem pub koymuştuk cihazdan alıp )
}

KMS (Görevli):
1. Kartına bakıyor ( cüzdan ile aldığın ( imzalama ile ) signature de bu bilgiler okunabilir )
   - ecrecover(signature) → "Bu kart 0x78c1'e ait"
   - SKT kontrolü → "Dolmamış, geçerli"
   - Tamamdır gideyim no problem diyor Görevli ( ama daha herşey bitmedi )

2. Görevli Kutu 301'e gidiyor
   - ACL kontrolü: "0x78c1 açabilir mi?" ( az önce senin signatureden aldığı adresinn -cüzdan adresin- )
   - Contract'a soruyor ve okeyliyor 
      - ( yukarda 1. adımdaki madde 3 e bak -> "Otel sahibi sen tx atıınca -> Her kutunun üstüne yazmıştı adresleri -> - "0x78c1 açabilir" diye" )
   

3. Kutuyu açıyor
   - Master key ile (sadece KMS'te var)
   - İçinden senin istediğin kart'ın çıktı

4. Yeni kutuya koyuyor ( cünkü sanna getirirken gizli kalması ve bitek senin açabilmen gerek kimse ne getirdiği görmemeli bu akış sırasında )
   - SENİN publicKey ile kilitliyor ( zama cihazından aldığıın 2 key den biri olan pubkey ) 
   - Artık sadece SEN açabilirsin ( zama cihazıından aldığın 2 keyden biri olan priv key ile bu pubkey şifresini çözüp kutuyu açabiliyorsun )


```

---

## ADIM 4: Kutuyu Aç (Frontend Decrypt)

```
Sen:
- KMS'ten ( Görevliden ) gelen kutuyu aldın
- privateKey ile açtın (tarayıcıda)
- İçinden kart çıktı: "Lyonar General"

Artık kartını görüyorsun!
Rakip göremez çünkü:
- Onun ACL izni yok (kutu üstünde adı yok)
- Senin privateKey'in yok onda
```

---

## ÖZET AKIŞ

```
┌─────────────────────────────────────────────────────────────┐
│ 1. HAZIRLIK (1 kere, oyun başı)                            │
│    ├── generateKeypair() → publicKey + privateKey          │
│    ├── signTypedData() → signature (POPUP)                 │
│    └── localStorage'a kaydet                               │
│                                                             │
│ 2. JOIN GAME (1 kere, TX)                                  │
│    ├── joinGame() çağır (POPUP - gas)                      │
│    ├── Contract kutuları oluşturur (encrypted)             │
│    └── ACL'e cüzdan adresini ekler                         │
│                                                             │
│ 3. KUTULARI ÖĞREN (view, popup yok)                        │
│    ├── getHand() çağır                                     │
│    ├── Contract msg.sender'a göre filtreler                │
│    └── Handle'ları döner [301, 302, ...]                   │
│                                                             │
│ 4. DECRYPT (her kart için, popup yok)                      │
│    ├── KMS'e: handle + signature + publicKey               │
│    ├── KMS: signature check → ACL check → aç → reencrypt   │
│    └── Sen: privateKey ile aç → kart!                      │
└─────────────────────────────────────────────────────────────┘
```

---

## POPUP SAYISI

| İşlem | Popup | Tip |
|-------|-------|-----|
| Session key oluştur | 0 | Tarayıcıda |
| Signature al | 1 | Sign (gas yok) |
| joinGame() | 1 | TX (gas var) |
| getHand() | 0 | View |
| Decrypt (5 kart) | 0 | KMS |

**Toplam: 2 popup** (biri gas'lı, biri gas'sız)
Sonra tüm oyun boyunca popup yok (session key ile).

---

## SECURITY NEDEN ÇALIŞIYOR?

```
Rakip senin kartlarını göremez çünkü:

1. Handle'ları bilse bile (kutu numaraları açık)
2. KMS'e gitse "301'i ver" dese
3. KMS signature'a bakar → "Bu 0xABCD imzası"
4. ACL'e bakar → "Kutu 301'de 0x78c1 var, 0xABCD yok"
5. REDDEDİLİR

Senin signature'ını çalsa bile:
- publicKey senin (reencrypt buna yapılır)
- privateKey sende (sadece sen açarsın)
- Signature süre dolarsa geçersiz
```

---

## REENCRYPTION NEDİR?

```
SORUN:
- Kutular MASTER KEY ile kilitli
- Master key sadece KMS'te
- Sen master key'i bilmiyorsun

ÇÖZÜM:
- KMS kutuyu açıyor (master key ile)
- Aynı içeriği SENİN publicKey ile kilitliyor
- Sana veriyor
- Sen privateKey ile açıyorsun

RE-ENCRYPTION = "Başka key ile tekrar kilitle"

Güvenli çünkü:
- KMS içeriği kimseye göstermiyor
- Sadece izinli kişinin key'i ile kilitliyor
- İnternet üzerinden gitse bile güvenli
```

---

## İKİ FARKLI KEY ÇİFTİ

```
1. CÜZDAN KEY (MetaMask'ta)
   ├── Kalıcı, asla değişmez
   ├── Para ve varlıkların kontrolü
   ├── TX imzalamak için
   └── ASLA paylaşma, ASLA localStorage'da

2. SESSION KEY (tarayıcıda)
   ├── Geçici, her session yeni olabilir
   ├── Sadece decrypt için
   ├── Para transferi YAPAMAZ
   └── localStorage'da saklanır (sorun değil)
```

---

## TX vs SIGNATURE vs VIEW

| | TX | Signature | View |
|---|---|---|---|
| Gas | VAR | YOK | YOK |
| Popup | VAR | VAR | YOK |
| Blockchain'e yazar | EVET | HAYIR | HAYIR |
| State değişir | EVET | HAYIR | HAYIR |
| Örnek | joinGame() | session key | getHand() |

---

*Son güncelleme: 2025-12-09*
