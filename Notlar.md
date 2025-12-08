1. Bakiye Görüntüleme (Gold, Spirit, Orb Sayısı)

HAYIR - Decrypt gerekmez!

┌─────────────────────────────────────────────────────────────┐
│  PUBLIC (Şifresiz)              │  ENCRYPTED (FHE)          │
├─────────────────────────────────┼───────────────────────────┤
│  Gold bakiyesi                  │  Orb İÇİNDEKİ kartlar     │
│  Spirit bakiyesi                │  Açılmamış orb içeriği    │
│  Kaç orb'un var                 │  Shuffle sırası           │
│  Kart koleksiyonun             │                           │
│  Deck'lerin                     │                           │
└─────────────────────────────────┴───────────────────────────┘

Neden? Gold, Spirit, sahip olduğun kartlar saklanması gereken bilgiler değil. Bunlar public ERC20/ERC721 olabilir, herkes görebilir - sorun yok.

  ---
2. FHE Ne Zaman Devreye Girer?

ORB LIFECYCLE:

1. SATIN ALMA (FHE YOK)
   └─> Kullanıcı 100 Gold öder
   └─> "unopenedOrbs" sayacı +1 olur
   └─> Henüz kart belirlenmedi!

2. ORB AÇMA (FHE BAŞLAR)
   └─> Kullanıcı "Open Orb" tıklar
   └─> Contract FHE.randEuint8() ile 5 kart belirler
   └─> Kartlar ENCRYPTED olarak saklanır
   └─> Kullanıcı animasyon görür

3. KART REVEAL (PUBLIC DECRYPT)
   └─> Her kart için publicDecrypt çağrılır
   └─> KMS imzası ile doğrulanır
   └─> Kartlar koleksiyona eklenir (artık public)

Önemli: Orb TANIMLANIRKEN değil, AÇILIRKEN FHE devreye girer!

  ---
3. Contract Onayı / Wallet Popup'ları

┌────────────────────────────────────────────────────────────────┐
│  İŞLEM                         │  WALLET POPUP?              │
├────────────────────────────────┼─────────────────────────────┤
│  Gold bakiyesi görme           │  HAYIR (public read)        │
│  Orb satın alma                │  EVET (1x - transfer)       │
│  Orb açma                      │  EVET (1x - tx gönderme)    │
│  Kart görme (açılmış)          │  HAYIR (public read)        │
│  Oyun oynama (session key)     │  HAYIR (session key ile)    │
└────────────────────────────────┴─────────────────────────────┘

Session Key Avantajı: Oyun başında 1 kez imza atarsın, sonra tüm hamleler otomatik. Her orb açımı için popup görmezsin.

  ---
4. Tokenization Stratejisi

┌─────────────────────────────────────────────────────────────┐
│  VARLIK          │  TOKEN TİPİ    │  FHE?    │  TRADE?     │
├──────────────────┼────────────────┼──────────┼─────────────┤
│  Gold            │  ERC20         │  HAYIR   │  EVET       │
│  Spirit          │  ERC20         │  HAYIR   │  EVET       │
│  Kartlar         │  ERC721 (NFT)  │  HAYIR   │  EVET       │
│  Unopened Orb    │  ERC721 (NFT)  │  EVET*   │  EVET       │
│  Açılmamış içerik│  euint8[5]     │  EVET    │  HAYIR      │
└──────────────────┴────────────────┴──────────┴─────────────┘

* Orb NFT'si trade edilebilir, ama içindeki kartlar
  hala encrypted - yeni sahibi açınca reveal olur

  ---
5. FHE Neden Ekliyoruz?

Sadece "provable fairness" için DEĞİL!

FHE KULLANIM AMAÇLARI:

1. PROVABLE FAIRNESS (Kanıtlanabilir Adillik)
   └─> "Bu orb'dan legendary çıkma şansı %2 idi" kanıtlanabilir
   └─> Şirket hile yapamaz, blockchain üzerinde doğrulanır

2. HIDDEN INFORMATION (Gizli Bilgi)
   └─> Orb içeriği AÇILANA kadar kimse bilmez
   └─> Orb trade edilebilir, içi hala gizemli
   └─> "Sealed product" konsepti korunur

3. TRUSTLESS RANDOMNESS (Güvenilir Rastgelelik)
   └─> Sunucu manipülasyon yapamaz
   └─> Math.random() yerine FHE.randEuint8()
   └─> Seed manipulation imkansız

4. GELECEK: OYUN İÇİ GİZLİLİK
   └─> El kartları encrypted (rakip göremez)
   └─> Deste sırası encrypted
   └─> Gerçek "fog of war"

  ---
Özet Karar Tablosu

| Soru                            | Cevap                                         |
  |---------------------------------|-----------------------------------------------|
| Gold görmek için decrypt?       | HAYIR - public                                |
| Orb sayısı görmek için decrypt? | HAYIR - public                                |
| Orb açmak için wallet onayı?    | EVET - 1 tx                                   |
| Kartları görmek için decrypt?   | HAYIR - açılınca public olur                  |
| Tokenize olacak mı?             | EVET - Gold/Spirit ERC20, Kartlar NFT         |
| FHE sadece provability için mi? | HAYIR - hidden info + trustless random da var |

  ---
Implementasyon Önerisi

// SpiritOrb.sol - Basitleştirilmiş

contract SpiritOrb is ERC721 {
// Açılmamış orb'ların encrypted içeriği
mapping(uint256 => euint8[5]) private _encryptedCards;

      // Orb aç - FHE ile kart belirle
      function openOrb(uint256 orbId) external {
          require(ownerOf(orbId) == msg.sender);

          // 5 kart için random (encrypted)
          for (uint i = 0; i < 5; i++) {
              _encryptedCards[orbId][i] = FHE.randEuint8();
          }

          // Public decrypt için işaretle
          for (uint i = 0; i < 5; i++) {
              FHE.makePubliclyDecryptable(_encryptedCards[orbId][i]);
          }
      }

      // Kartları reveal et (frontend çağırır)
      function revealCards(
          uint256 orbId,
          bytes calldata clearValues,
          bytes calldata proof
      ) external {
          // KMS imzası doğrula
          // Kartları mint et (NFT olarak)
          // Orb'u burn et
      }
}

Bu yapıda:
- Bakiye görme = free, no popup
- Orb açma = 1 tx, 1 popup
- Reveal = 1 tx, 1 popup (veya session key ile 0 popup)
