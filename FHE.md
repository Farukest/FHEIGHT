# FHEIGHT Project - ZAMA FHEVM Protocol Reference

Bu dosya Claude'un kalici hafizasidir. Proje bilgileri ve FHEVM dokumantasyonu burada saklanir.

---

## ONEMLI: SUNUCU BASLATMA

**FIREBASE_PRIVATE_KEY'i environment variable olarak gecmiyorum. Sunucuyu .env dosyasini okuyarak baslatmam lazim.**

```bash
# DOGRU - .env dosyasini otomatik yukler
cd fheight-source
node -r dotenv/config ./bin/api

# YANLIS - .env dosyasini okumaz, Firebase basarisiz olur!
npx cross-env NODE_ENV=development ... npm run api
```

`.env` dosyasinda sunlar olmali:
```
FIREBASE_URL=https://zama-e9173-default-rtdb.firebaseio.com/
FIREBASE_PROJECT_ID=zama-e9173
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@zama-e9173.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_LEGACY_TOKEN=...
POSTGRES_CONNECTION=pg://fheight:fheight@localhost:5432/fheight
REDIS_HOST=localhost
```

---

## 1. MIMARI BILESENLER

| Bilesen | Aciklama |
|---------|----------|
| **FHEVM Library** | Solidity'de sifreli veri tipleri ve FHE operasyonlari |
| **Host Contracts** | EVM zincirlerinde ACL yonetimi (Ethereum, Sepolia) |
| **Coprocessors** | Off-chain FHE hesaplama servisleri |
| **Gateway** | Arbitrum L3 orkestrator (Chain ID: 10901) |
| **KMS** | MPC tabanli anahtar yonetimi (13 node, 7/13 threshold) |
| **Relayer** | Off-chain kopru servisi, SDK ile etkilesim |

---

## 2. SIFRELI VERI TIPLERI

```solidity
// Unsigned integers
ebool, euint8, euint16, euint32, euint64, euint128, euint256

// Signed integers
eint8, eint16, eint32, eint64, eint128, eint256

// Address
eaddress

// External input types (off-chain'den gelen)
externalEbool, externalEuint8, externalEuint16, externalEuint32, externalEuint64, externalEaddress
```

---

## 3. FHE OPERASYONLARI

### Aritmetik
```solidity
FHE.add(a, b)      // Toplama
FHE.sub(a, b)      // Cikarma
FHE.mul(a, b)      // Carpma
FHE.div(a, b)      // Bolme
FHE.rem(a, b)      // Mod
FHE.neg(a)         // Negatif
FHE.min(a, b)      // Minimum
FHE.max(a, b)      // Maximum
```

### Mantiksal
```solidity
FHE.and(a, b)      // AND
FHE.or(a, b)       // OR
FHE.xor(a, b)      // XOR
FHE.not(a)         // NOT
```

### Karsilastirma (ebool doner)
```solidity
FHE.eq(a, b)       // a == b
FHE.ne(a, b)       // a != b
FHE.lt(a, b)       // a < b
FHE.gt(a, b)       // a > b
FHE.le(a, b)       // a <= b
FHE.ge(a, b)       // a >= b
```

### Bit Manipulasyonu
```solidity
FHE.shl(a, shift)  // Sola kaydir
FHE.shr(a, shift)  // Saga kaydir
FHE.rotl(a, n)     // Sola rotate
FHE.rotr(a, n)     // Saga rotate
```

### Secim (Ternary)
```solidity
FHE.select(condition, ifTrue, ifFalse)  // condition ? ifTrue : ifFalse
```

### Random Sayi Uretimi
```solidity
FHE.randEbool()
FHE.randEuint8()
FHE.randEuint16()
FHE.randEuint32()
FHE.randEuint64()
FHE.randEuint8(upperBound)    // 0 ile upperBound-1 arasi (bounded)
FHE.randEuint16(upperBound)
FHE.randEuint32(upperBound)
FHE.randEuint64(upperBound)
```

### Tip Donusumleri
```solidity
FHE.asEbool(value)
FHE.asEuint8(value)
FHE.asEuint32(value)
FHE.asEuint64(value)
FHE.asEaddress(value)
FHE.toBytes32(handle)    // Handle'i bytes32'ye cevir
```

---

## 4. ACL (Access Control List)

```solidity
// Kalici erisim izni
FHE.allow(handle, address)

// Gecici erisim (sadece bu tx icin)
FHE.allowTransient(handle, address)

// Contract'in kendisine erisim
FHE.allowThis(handle)

// Public decrypt icin izin
FHE.makePubliclyDecryptable(handle)

// Erisim kontrolu
FHE.isAllowed(handle, address)
FHE.isSenderAllowed(handle)
```

### ACL Kurallari
- User decrypt icin HEM contract HEM user'a allow verilmeli
- `FHE.allowThis()` unutulursa user decrypt BASARISIZ olur
- Ephemeral permission tx sonunda silinir

---

## 5. INPUT HANDLING (Encryption)

### Contract Tarafi
```solidity
function myFunction(externalEuint32 encryptedInput, bytes calldata inputProof) external {
    // Off-chain'den gelen sifreli input'u dogrula ve donustur
    euint32 value = FHE.fromExternal(encryptedInput, inputProof);

    // Izinleri ayarla
    FHE.allowThis(value);
    FHE.allow(value, msg.sender);
}
```

### TypeScript/Frontend Tarafi - TEK DEGER
```typescript
import { fhevm } from "hardhat";

// Sifreli input olustur
const input = fhevm.createEncryptedInput(contractAddress, userAddress);
input.add32(12345);  // uint32 deger ekle
const encrypted = await input.encrypt();

// Contract'a gonder
await contract.myFunction(encrypted.handles[0], encrypted.inputProof);
```

### COKLU INPUT SIFRELEME
```typescript
const input = fhevm.createEncryptedInput(contractAddress, userAddress);
input.addBool(true);      // handles[0] = ebool
input.add8(255);          // handles[1] = euint8
input.add16(65535);       // handles[2] = euint16
input.add32(12345);       // handles[3] = euint32
input.add64(9999999999n); // handles[4] = euint64
input.addAddress("0x..."); // handles[5] = eaddress
const encrypted = await input.encrypt();

// Tek proof hepsi icin kullanilir!
await contract.multiInput(
    encrypted.handles[0],
    encrypted.handles[1],
    encrypted.handles[2],
    encrypted.handles[3],
    encrypted.handles[4],
    encrypted.handles[5],
    encrypted.inputProof  // Tek proof
);
```

---

## 6. USER DECRYPTION (Off-chain Decrypt)

### TEK DEGER USER DECRYPT
```typescript
import { FhevmType } from "@fhevm/hardhat-plugin";

// Contract'tan handle al
const encryptedHandle = await contract.getValue();

// User decrypt - sadece izinli user yapabilir
const clearValue = await fhevm.userDecryptEuint(
    FhevmType.euint32,    // Tip
    encryptedHandle,       // Contract'tan alinan handle
    contractAddress,       // Contract adresi
    userSigner             // Izinli user'in signer'i
);

console.log("Decrypted value:", clearValue);
```

### COKLU DEGER USER DECRYPT
```typescript
import { FhevmType } from "@fhevm/hardhat-plugin";

// Contract'tan birden fazla handle al
const [handleA, handleB, handleMax] = await contract.getValues();

// Coklu decrypt - ayni contract ve user icin
const clearValues = await fhevm.userDecrypt(
    [
        { type: FhevmType.euint32, handle: handleA, contractAddress, signer: alice },
        { type: FhevmType.euint32, handle: handleB, contractAddress, signer: alice },
        { type: FhevmType.euint32, handle: handleMax, contractAddress, signer: alice }
    ]
);

console.log("A:", clearValues[0]);
console.log("B:", clearValues[1]);
console.log("Max:", clearValues[2]);
```

### USER DECRYPT ICIN GEREKLI IZINLER (Contract'ta)
```solidity
// HER IKI IZIN DE GEREKLI!
FHE.allowThis(_value);           // 1. Contract'a izin
FHE.allow(_value, msg.sender);   // 2. User'a izin
```

---

## 7. PUBLIC DECRYPTION (On-chain Verifiable)

### CONTRACT TARAFI - Public Decrypt Istegi
```solidity
// 1. Sifreli degeri olustur
euint32 private _encryptedResult;

function computeResult() external {
    _encryptedResult = FHE.add(a, b);

    // Public decrypt icin isaretle
    FHE.makePubliclyDecryptable(_encryptedResult);
}

// 2. Decrypt sonucunu dogrula ve kaydet
function recordResult(bytes calldata abiEncodedClearValue, bytes calldata decryptionProof) external {
    // Dogrulama icin handle'lari hazirla
    bytes32[] memory cts = new bytes32[](1);
    cts[0] = FHE.toBytes32(_encryptedResult);

    // KMS imzasini dogrula
    FHE.checkSignatures(cts, abiEncodedClearValue, decryptionProof);

    // Artik clear degeri kullanabiliriz
    uint32 clearResult = abi.decode(abiEncodedClearValue, (uint32));
    // ... islem yap
}
```

### FRONTEND TARAFI - Public Decrypt Carisi
```typescript
// 1. Contract'tan sifreli handle'i al
const encryptedHandle = await contract.getEncryptedResult();

// 2. Relayer'dan decrypt iste
const publicDecryptResults = await fhevm.publicDecrypt([encryptedHandle]);

// 3. Sonuclari contract'a gonder
await contract.recordResult(
    publicDecryptResults.abiEncodedClearValues,
    publicDecryptResults.decryptionProof
);
```

### COKLU PUBLIC DECRYPT
```typescript
// Birden fazla handle icin
const [handle1, handle2, handle3] = await contract.getMultipleHandles();

const results = await fhevm.publicDecrypt([handle1, handle2, handle3]);

// results.clearValues = [value1, value2, value3]
// results.abiEncodedClearValues = tumu icin encoded
// results.decryptionProof = tek proof

await contract.recordMultipleResults(
    results.abiEncodedClearValues,
    results.decryptionProof
);
```

### SOLIDITY'DE COKLU DEGER DECODE
```solidity
function recordMultipleResults(
    bytes calldata abiEncodedClearValues,
    bytes calldata decryptionProof
) external {
    bytes32[] memory cts = new bytes32[](3);
    cts[0] = FHE.toBytes32(_handle1);
    cts[1] = FHE.toBytes32(_handle2);
    cts[2] = FHE.toBytes32(_handle3);

    FHE.checkSignatures(cts, abiEncodedClearValues, decryptionProof);

    // Coklu decode
    (uint32 val1, uint64 val2, bool val3) = abi.decode(
        abiEncodedClearValues,
        (uint32, uint64, bool)
    );
}
```

---

## 8. SEPOLIA TESTNET ADRESLERI

```
ACL_CONTRACT:     0xf0Ffdc93b7E186bC2f8CB3dAA75D86d1930A433D
KMS_VERIFIER:     0xbE0E383937d564D7FF0BC3b46c51f0bF8d5C311A
INPUT_VERIFIER:   0xBBC1fFCdc7C316aAAd72E807D9b0272BE8F84DA0
FHEVM_EXECUTOR:   0x92C920834Ec8941d2C77D188936E1f7A6f49c127
RELAYER_URL:      https://relayer.testnet.zama.org
GATEWAY_CHAIN_ID: 10901
```

---

## 9. HARDHAT KURULUMU

### Yeni Proje
```bash
git clone https://github.com/zama-ai/fhevm-hardhat-template my-project
cd my-project
npm install
```

### Dosya Yapisi
```
contracts/          # .sol dosyalari
test/              # .ts test dosyalari
deploy/            # deployment scripts
```

### Komutlar
```bash
npx hardhat compile                    # Derleme
npx hardhat test --network hardhat     # Mock test (hizli, gercek FHE yok)
npx hardhat test --network localhost   # Local Hardhat node
npx hardhat test --network sepolia     # Gercek FHE testnet
npx hardhat deploy --network sepolia   # Deploy
```

### Environment Variables (.env)
```
MNEMONIC="your 12 word mnemonic phrase"
INFURA_API_KEY="your-infura-key"
ETHERSCAN_API_KEY="your-etherscan-key"
```

---

## 10. TEMEL CONTRACT SABLONU

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract MyContract is ZamaEthereumConfig {
    euint32 private _secretValue;

    // Sifreli deger set et
    function setValue(externalEuint32 input, bytes calldata inputProof) external {
        euint32 value = FHE.fromExternal(input, inputProof);
        _secretValue = value;

        // IZINLER ONEMLI!
        FHE.allowThis(_secretValue);        // Contract erisimi
        FHE.allow(_secretValue, msg.sender); // User decrypt icin
    }

    // Sifreli hesaplama
    function addToValue(externalEuint32 input, bytes calldata inputProof) external {
        euint32 addend = FHE.fromExternal(input, inputProof);
        _secretValue = FHE.add(_secretValue, addend);

        FHE.allowThis(_secretValue);
        FHE.allow(_secretValue, msg.sender);
    }

    // Handle dondur (user decrypt icin)
    function getValue() external view returns (euint32) {
        return _secretValue;
    }
}
```

---

## 11. COUNTER ORNEGI (Tam)

### Contract
```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract FHECounter is ZamaEthereumConfig {
    euint32 private _counter;

    function incrementBy(externalEuint32 amount, bytes calldata inputProof) external {
        euint32 encrypted = FHE.fromExternal(amount, inputProof);
        _counter = FHE.add(_counter, encrypted);
        FHE.allowThis(_counter);
        FHE.allow(_counter, msg.sender);
    }

    function decrementBy(externalEuint32 amount, bytes calldata inputProof) external {
        euint32 encrypted = FHE.fromExternal(amount, inputProof);
        _counter = FHE.sub(_counter, encrypted);
        FHE.allowThis(_counter);
        FHE.allow(_counter, msg.sender);
    }

    function getCounter() external view returns (euint32) {
        return _counter;
    }
}
```

### Test
```typescript
describe("FHECounter", function () {
    it("should increment and decrypt", async function () {
        // Encrypt amount
        const input = fhevm.createEncryptedInput(contractAddress, alice.address);
        input.add32(5);
        const encrypted = await input.encrypt();

        // Increment
        await counter.connect(alice).incrementBy(encrypted.handles[0], encrypted.inputProof);

        // Get handle and decrypt
        const handle = await counter.getCounter();
        const value = await fhevm.userDecryptEuint(FhevmType.euint32, handle, contractAddress, alice);

        expect(value).to.equal(5);
    });
});
```

---

## 12. IF-THEN-ELSE ORNEGI (Max Bulma)

### Contract
```solidity
contract IfThenElse is ZamaEthereumConfig {
    euint32 private _a;
    euint32 private _b;
    euint32 private _max;

    function setA(externalEuint32 input, bytes calldata proof) external {
        _a = FHE.fromExternal(input, proof);
        FHE.allowThis(_a);
        FHE.allow(_a, msg.sender);
    }

    function setB(externalEuint32 input, bytes calldata proof) external {
        _b = FHE.fromExternal(input, proof);
        FHE.allowThis(_b);
        FHE.allow(_b, msg.sender);
    }

    function computeMax() external {
        // Sifreli karsilastirma
        ebool aGreaterOrEqual = FHE.ge(_a, _b);

        // Sifreli select (if-then-else)
        _max = FHE.select(aGreaterOrEqual, _a, _b);

        FHE.allowThis(_max);
        FHE.allow(_max, msg.sender);
    }

    function getValues() external view returns (euint32, euint32, euint32) {
        return (_a, _b, _max);
    }
}
```

---

## 13. HEADS OR TAILS ORNEGI (Public Decrypt)

### Contract
```solidity
contract HeadsOrTails is ZamaEthereumConfig {
    struct Game {
        address headsPlayer;
        address tailsPlayer;
        ebool encryptedResult;  // true = heads, false = tails
        address winner;
        bool isSettled;
    }

    mapping(uint256 => Game) public games;
    uint256 public gameCounter;

    function startGame(address headsPlayer, address tailsPlayer) external returns (uint256) {
        uint256 gameId = gameCounter++;

        // Rastgele sifreli sonuc
        ebool result = FHE.randEbool();

        games[gameId] = Game({
            headsPlayer: headsPlayer,
            tailsPlayer: tailsPlayer,
            encryptedResult: result,
            winner: address(0),
            isSettled: false
        });

        // Public decrypt icin isaretle
        FHE.makePubliclyDecryptable(result);

        return gameId;
    }

    function getEncryptedResult(uint256 gameId) external view returns (ebool) {
        return games[gameId].encryptedResult;
    }

    function recordWinner(
        uint256 gameId,
        bytes calldata abiEncodedResult,
        bytes calldata decryptionProof
    ) external {
        Game storage game = games[gameId];
        require(!game.isSettled, "Already settled");

        // KMS imzasini dogrula
        bytes32[] memory cts = new bytes32[](1);
        cts[0] = FHE.toBytes32(game.encryptedResult);
        FHE.checkSignatures(cts, abiEncodedResult, decryptionProof);

        // Kazanani belirle
        bool headsWon = abi.decode(abiEncodedResult, (bool));
        game.winner = headsWon ? game.headsPlayer : game.tailsPlayer;
        game.isSettled = true;
    }
}
```

### Frontend
```typescript
// 1. Oyun baslat
const tx = await contract.startGame(headsPlayer.address, tailsPlayer.address);
const receipt = await tx.wait();
const gameId = 0; // Event'ten al

// 2. Sifreli sonucu al
const encryptedResult = await contract.getEncryptedResult(gameId);

// 3. Public decrypt
const decryptResult = await fhevm.publicDecrypt([encryptedResult]);

// 4. Kazanani kaydet
await contract.recordWinner(
    gameId,
    decryptResult.abiEncodedClearValues,
    decryptResult.decryptionProof
);

// 5. Kazanani kontrol et
const game = await contract.games(gameId);
console.log("Winner:", game.winner);
```

---

## 14. OPENZEPPELIN ERC7984 (Confidential Token)

### Kurulum
```bash
npm i @openzeppelin/confidential-contracts
```

### Contract
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { ERC7984 } from "@openzeppelin/confidential-contracts/token/ERC7984.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { Ownable2Step, Ownable } from "@openzeppelin/contracts/access/Ownable2Step.sol";
import { FHE } from "@fhevm/solidity/lib/FHE.sol";

contract MyConfidentialToken is ZamaEthereumConfig, ERC7984, Ownable2Step {
    constructor(
        address owner,
        uint64 initialSupply,
        string memory name,
        string memory symbol,
        string memory uri
    ) ERC7984(name, symbol, uri) Ownable(owner) {
        euint64 encrypted = FHE.asEuint64(initialSupply);
        _mint(owner, encrypted);
    }

    // Owner icin mint
    function mint(address to, uint64 amount) external onlyOwner {
        euint64 encrypted = FHE.asEuint64(amount);
        _mint(to, encrypted);
    }
}
```

### Confidential Transfer
```typescript
// Sifreli transfer miktari olustur
const input = await fhevm
    .createEncryptedInput(tokenAddress, sender.address)
    .add64(transferAmount)
    .encrypt();

// Confidential transfer
await token.connect(sender)['confidentialTransfer(address,bytes32,bytes)'](
    recipient.address,
    input.handles[0],
    input.inputProof
);
```

### Balance Sorgulama
```typescript
// Sifreli balance handle'i al
const balanceHandle = await token.confidentialBalanceOf(user.address);

// User decrypt ile balance ogren
const balance = await fhevm.userDecryptEuint(
    FhevmType.euint64,
    balanceHandle,
    tokenAddress,
    userSigner
);
```

---

## 15. WALLET ENTEGRASYONU (Relayer SDK)

### Kurulum
```bash
npm install @zama-fhe/relayer-sdk ethers
```

### Instance Olusturma
```typescript
import { createInstance, SepoliaConfig } from '@zama-fhe/relayer-sdk';

// Sepolia icin instance
const instance = await createInstance(SepoliaConfig);
```

### Sifreli Input Olusturma
```typescript
// Contract ve user adresleri ile input olustur
const input = instance.createEncryptedInput(contractAddress, userAddress);
input.add32(42);
input.add64(1000000n);
const encrypted = await input.encrypt();

// Contract carisi
await contract.someFunction(
    encrypted.handles[0],
    encrypted.handles[1],
    encrypted.inputProof
);
```

### User Decryption
```typescript
// 1. Keypair olustur
const keypair = instance.generateKeypair();

// 2. EIP-712 imza istegi olustur
const eip712 = instance.createEIP712(
    keypair.publicKey,
    [contractAddress],  // Izin verilen contract'lar
    startTime,          // Gecerlilik baslangici
    days                // Gecerlilik suresi (gun)
);

// 3. Kullanicidan imza al
const signature = await signer.signTypedData(
    eip712.domain,
    eip712.types,
    eip712.message
);

// 4. Decrypt
const decryptedValue = await instance.userDecrypt(
    [encryptedHandle],
    keypair,
    signature,
    contractAddress,
    userAddress
);
```

---

## 16. HCU (Homomorphic Complexity Unit)

| Operasyon | Yaklasik HCU |
|-----------|--------------|
| add/sub | Dusuk |
| mul | Orta |
| div | Yuksek |
| comparison | Orta |
| random | Yuksek |

- **TX Limit**: 20,000,000 HCU
- **Depth Limit**: 5,000,000

---

## 17. ONEMLI NOTLAR VE HATALAR

### UNUTMA!
1. **ACL Unutma**: `FHE.allowThis()` ve `FHE.allow()` olmadan decrypt CALISMAZ
2. **Proof Tek**: Coklu input icin tek `inputProof` kullanilir
3. **Handle = bytes32**: Sifreli degerler on-chain'de bytes32 handle olarak saklanir
4. **Mock vs Real**: Hardhat network mock kullanir (hizli), Sepolia gercek FHE
5. **Gas Maliyeti**: FHE operasyonlari pahali, optimize et
6. **Overflow Yok**: FHE operasyonlarinda otomatik overflow korumasi yok!

### YAYGIN HATALAR
```solidity
// YANLIS - izin yok
function setValue(externalEuint32 input, bytes calldata proof) external {
    _value = FHE.fromExternal(input, proof);
    // Izin vermeden decrypt BASARISIZ olur!
}

// DOGRU
function setValue(externalEuint32 input, bytes calldata proof) external {
    _value = FHE.fromExternal(input, proof);
    FHE.allowThis(_value);        // Contract icin
    FHE.allow(_value, msg.sender); // User icin
}
```

---

## 18. TEST SABLONU (TypeScript)

```typescript
import { expect } from "chai";
import { ethers, fhevm } from "hardhat";
import { FhevmType } from "@fhevm/hardhat-plugin";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("MyContract", function () {
    let contract: any;
    let contractAddress: string;
    let owner: HardhatEthersSigner;
    let alice: HardhatEthersSigner;

    before(async function () {
        [owner, alice] = await ethers.getSigners();
    });

    beforeEach(async function () {
        const factory = await ethers.getContractFactory("MyContract");
        contract = await factory.deploy();
        contractAddress = await contract.getAddress();
    });

    it("should set and get encrypted value", async function () {
        // Encrypt
        const input = fhevm.createEncryptedInput(contractAddress, alice.address);
        input.add32(12345);
        const encrypted = await input.encrypt();

        // Set value
        const tx = await contract.connect(alice)
            .setValue(encrypted.handles[0], encrypted.inputProof);
        await tx.wait();

        // Get handle
        const handle = await contract.getValue();

        // Decrypt
        const clearValue = await fhevm.userDecryptEuint(
            FhevmType.euint32,
            handle,
            contractAddress,
            alice
        );

        expect(clearValue).to.equal(12345);
    });

    it("should test public decrypt", async function () {
        // Sifreli deger olustur
        await contract.createEncryptedValue();

        // Handle al
        const handle = await contract.getEncryptedValue();

        // Public decrypt
        const result = await fhevm.publicDecrypt([handle]);

        // Contract'a dogrulama gonder
        await contract.verifyAndStore(
            result.abiEncodedClearValues,
            result.decryptionProof
        );

        // Sonucu kontrol et
        const stored = await contract.getStoredValue();
        expect(stored).to.be.gt(0);
    });
});
```

---

# PROJE: FHE FHEIGHT (Gizli Taktik Kart Oyunu)

## KAYNAK: Open Duelyst
- Repo: https://github.com/open-duelyst/duelyst
- Game Logic: `app/sdk/` (CoffeeScript - donusturulecek)
- Assets: `app/resources/` (kullanilacak)
- Kart Data: `app/sdk/cards/`
- Board Logic: `app/sdk/board.coffee`
- Actions: `app/sdk/actions/`
- Spells: `app/sdk/spells/`
- Modifiers: `app/sdk/modifiers/`

## FHEIGHT OYUN MEKANIKLERI
```
  5x9 Grid Tabanli Taktik Kart Oyunu

  - Her oyuncunun 1 General'i (Hero) var
  - 40 kartlik deste
  - Baslangic eli: 5 kart (mulligan var)
  - Her tur: +1 mana (max 9), +1 kart cek
  - Kartlar: Minion, Spell, Artifact
  - Amac: Rakip General'i oldur

  Turn Yapisi:
  1. Kart cek
  2. Mana yenile
  3. Kart oyna / Birim hareket / Saldir
  4. Turn bitir
```

## GIZLILIK STRATEJISI (FHEVM)

### Sifreli Olacaklar (Rakip Goremez)
| Veri | Tip | Aciklama |
|------|-----|----------|
| Oyuncu Eli | euint8[6] | Eldeki kart ID'leri sifreli |
| Deste Sirasi | euint8[40] | Cekilecek kartlarin sirasi |
| Kart Cekimi | FHE.randEuint8Bounded() | Shuffle icin random |

### Acik Olacaklar (Board State)
| Veri | Neden Acik |
|------|------------|
| Board uzerindeki birimler | Oynanabilirlik - gormek lazim |
| Birim HP/ATK | Savas icin gerekli |
| General HP | Oyun durumu |
| Mana | Hamle planlamasi |
| Mezarlik | Bazi kartlar buna bakar |

### Hibrit Yaklasim
```
Oyuncu A Eli: [encrypted, encrypted, encrypted, ...]  - Sadece A gorebilir
Board State:  [public, public, public, ...]           - Herkes gorur
Oyuncu B Eli: [encrypted, encrypted, encrypted, ...]  - Sadece B gorebilir
```

---

## TUM OYUN HAMLELERI VE FHE GEREKSINIMLERI

Oyunda toplam **65 farkli action** bulunmaktadir.

### A. GIZLI KALMASI GEREKEN HAMLELER (USER DECRYPT)

| Hamle | Dosya | Aciklama | FHE Tipi |
|-------|-------|----------|----------|
| DrawCardAction | drawCardAction.js | Desteden kart cek | euint8 (kart ID) |
| DrawStartingHandAction | drawStartingHandAction.js | Baslangic eli cek (5 kart) | euint8[5] |
| ReplaceCardFromHandAction | replaceCardFromHandAction.js | Karti deste ile degistir | euint8 |
| PutCardInHandAction | putCardInHandAction.js | Ele kart ekle | euint8 |
| BurnCardAction | burnCardAction.js | Kart yak (el dolu) | euint8 |

**ACL:** `FHE.allowThis()` + `FHE.allow(player)` - Sadece kart sahibi gorebilir

### B. ACIK HAMLELER (PUBLIC - Herkes Gorur)

| Hamle | Dosya | Aciklama |
|-------|-------|----------|
| MoveAction | moveAction.js | Birim hareket |
| AttackAction | attackAction.js | Saldir |
| DamageAction | damageAction.js | Hasar ver |
| HealAction | healAction.js | Iyilestir |
| DieAction | dieAction.js | Birim olur |
| PlayCardFromHandAction | playCardFromHandAction.js | Kart oyna (board'a koyunca ACIK) |
| TeleportAction | teleportAction.js | Isinla |
| ApplyModifierAction | applyModifierAction.js | Buff/debuff uygula |
| SwapUnitsAction | swapUnitsAction.js | Birimler yer degistir |

### C. HIBRIT HAMLELER (Gizli -> Acik)

| Hamle | Baslangic | Sonuc |
|-------|-----------|-------|
| PlayCardFromHandAction | El'deki kart GIZLI | Board'a koyunca ACIK |
| GenerateSignatureCardAction | Secim GIZLI | Oynaninca ACIK |
| RevealHiddenCardAction | GIZLI | Public DECRYPT ile ACIK |

---

## OYUN AKISI (Turn Structure)

```
OYUN BASI (SETUP)
1. DrawStartingHandAction (her oyuncu 5 kart - GIZLI)
2. Mulligan secenegi (3 kart degistir - GIZLI)
3. Player 2 baslar (Player 1'den 1 mana fazla)

HER TUR (MAX 9 MANA)
START TURN PHASE:
  - StartTurnAction calisir
  - RefreshExhaustionAction (birimler hareket edebilir)
  - Mana yenilenir (max +1, max 9) - ACIK
  - 1 kart cekilir (DrawCardAction) - GIZLI

ACTION PHASE:
  - PlayCardFromHandAction (mana harcama) - GIZLI->ACIK
  - MoveAction (birim hareket) - ACIK
  - AttackAction (saldiri) - ACIK
  - ReplaceCardFromHandAction (kart degistir) - GIZLI
  - ApplyModifierAction (buff/debuff) - ACIK

END TURN PHASE:
  - EndTurnAction calisir
  - Diger oyuncuya gecilir

OYUN SONU
  - General HP <= 0 -> DieAction -> Oyun biter
  - ResignAction (oyuncu teslim eder)
```

---

## FHE DECRYPT AKISLARI

### 1. Kendi Elini Gorme (USER DECRYPT)
```
Oyuncu A elini gormek istiyor:
1. Frontend: const handles = await game.getHand(gameId);
2. Frontend: for each handle -> userDecryptEuint()
3. Frontend: kartlari goster

ACL Gereksinim:
- FHE.allowThis(hand[i])     // Contract icin
- FHE.allow(hand[i], player) // Oyuncu icin
```

### 2. Kart Oynama (GIZLI -> ACIK)
```
Oyuncu A kart oynamak istiyor:
1. Frontend: eldeki karti sec (index 2 mesela)
2. Contract: publicDecrypt ile karti aciga cikar
3. Contract: decryptedCard'i board'a yerlestir
4. Broadcast: Rakip artik karti gorebilir

Solidity:
function playCard(uint8 handSlot, uint8 x, uint8 y) {
    FHE.makePubliclyDecryptable(playerHand[msg.sender][handSlot]);
    // KMS decrypt sonrasi board'a ekle
}
```

### 3. Kart Cekme (GIZLI KALIR)
```
Oyuncu A kart cekiyor:
1. Contract: deck[nextIndex] -> hand'e kopyala
2. Contract: FHE.allowThis() ve FHE.allow(player)
3. Frontend: yeni karti userDecrypt ile gor
4. Rakip: sadece "1 kart cekildi" gorur, icerigi bilmez
```

### 4. Replace (GIZLI -> GIZLI)
```
Oyuncu eldeki karti degistiriyor:
1. Contract: hand[slot] -> deck'e geri koy
2. Contract: deck'ten yeni kart cek (FHE.randEuint8)
3. Contract: yeni kart hand[slot]'a ekle
4. ACL: sadece oyuncuya izin ver
```

---

## SOLIDITY CONTRACT TASARIMI

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint8 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract GameSession is ZamaEthereumConfig {

    // === GIZLI VERI ===
    mapping(address => euint8[6]) private playerHand;  // Sifreli el
    mapping(address => uint8) public handSize;          // El boyutu (ACIK)
    mapping(address => euint8[40]) private deckOrder;   // Sifreli deste sirasi
    mapping(address => uint8) public deckRemaining;     // Kalan kart (ACIK)

    // === ACIK VERI ===
    struct BoardUnit {
        uint32 cardId;
        address owner;
        uint8 x;
        uint8 y;
        uint8 hp;
        uint8 atk;
        bool exhausted;
    }
    BoardUnit[] public board;

    struct PlayerMana {
        uint8 current;
        uint8 maximum;
    }
    mapping(address => PlayerMana) public playerMana;

    // === KART CEK (GIZLI) ===
    function drawCard() external {
        require(deckRemaining[msg.sender] > 0, "No cards");
        require(handSize[msg.sender] < 6, "Hand full");

        uint8 idx = 40 - deckRemaining[msg.sender];
        euint8 drawnCard = deckOrder[msg.sender][idx];

        // Ele ekle
        playerHand[msg.sender][handSize[msg.sender]] = drawnCard;

        // ACL - sadece oyuncu gorebilir
        FHE.allowThis(drawnCard);
        FHE.allow(drawnCard, msg.sender);

        handSize[msg.sender]++;
        deckRemaining[msg.sender]--;
    }

    // === KART OYNA (GIZLI -> ACIK) ===
    function playCard(
        uint8 handSlot,
        uint8 x,
        uint8 y,
        bytes calldata decryptedCardId,
        bytes calldata proof
    ) external {
        // KMS proof dogrula
        bytes32[] memory cts = new bytes32[](1);
        cts[0] = FHE.toBytes32(playerHand[msg.sender][handSlot]);
        FHE.checkSignatures(cts, decryptedCardId, proof);

        uint32 cardId = abi.decode(decryptedCardId, (uint32));

        // Board'a ekle (ACIK)
        board.push(BoardUnit({
            cardId: cardId,
            owner: msg.sender,
            x: x,
            y: y,
            hp: getCardHp(cardId),
            atk: getCardAtk(cardId),
            exhausted: true
        }));

        // Elden cikar
        _removeFromHand(msg.sender, handSlot);
    }

    // === HAREKET (ACIK) ===
    function moveUnit(uint256 unitIdx, uint8 newX, uint8 newY) external {
        BoardUnit storage unit = board[unitIdx];
        require(unit.owner == msg.sender, "Not owner");
        require(!unit.exhausted, "Exhausted");

        unit.x = newX;
        unit.y = newY;
        unit.exhausted = true;
    }

    // === SALDIR (ACIK) ===
    function attack(uint256 attackerIdx, uint256 targetIdx) external {
        BoardUnit storage attacker = board[attackerIdx];
        BoardUnit storage target = board[targetIdx];

        require(attacker.owner == msg.sender, "Not owner");
        require(!attacker.exhausted, "Exhausted");
        require(target.owner != msg.sender, "Own unit");

        // Hasar ver
        if (target.hp <= attacker.atk) {
            _removeUnit(targetIdx);
        } else {
            target.hp -= attacker.atk;
        }

        // Karsi saldir
        if (attacker.hp <= target.atk) {
            _removeUnit(attackerIdx);
        } else {
            attacker.hp -= target.atk;
        }

        attacker.exhausted = true;
    }

    // === REPLACE (GIZLI -> GIZLI) ===
    function replaceCard(uint8 handSlot) external {
        require(deckRemaining[msg.sender] > 0, "No cards");

        // Eski karti desteye koy (basitlesmis)
        // Yeni kart cek
        uint8 idx = 40 - deckRemaining[msg.sender];
        euint8 newCard = deckOrder[msg.sender][idx];

        playerHand[msg.sender][handSlot] = newCard;

        FHE.allowThis(newCard);
        FHE.allow(newCard, msg.sender);

        deckRemaining[msg.sender]--;
    }

    // === EL KARTLARINI GOR (USER DECRYPT) ===
    function getHand() external view returns (euint8[6] memory) {
        return playerHand[msg.sender];
    }
}
```

---

## TYPESCRIPT FRONTEND ORNEGI

```typescript
import { ethers, fhevm } from "hardhat";
import { FhevmType } from "@fhevm/hardhat-plugin";

// Kendi elini gor
async function viewHand(gameSession, player) {
    const handles = await gameSession.connect(player).getHand();

    const hand = [];
    for (let i = 0; i < 6; i++) {
        if (handles[i] != 0) {
            const cardId = await fhevm.userDecryptEuint(
                FhevmType.euint8,
                handles[i],
                gameSession.address,
                player
            );
            hand.push(cardId);
        }
    }
    return hand;
}

// Kart oyna
async function playCard(gameSession, player, handSlot, x, y) {
    // Oncelikle karti decrypt et
    const handles = await gameSession.connect(player).getHand();
    const result = await fhevm.publicDecrypt([handles[handSlot]]);

    // Contract'a gonder
    await gameSession.connect(player).playCard(
        handSlot,
        x,
        y,
        result.abiEncodedClearValues,
        result.decryptionProof
    );
}

// Board'u gor (herkes gorebilir)
async function viewBoard(gameSession) {
    const boardLength = await gameSession.getBoardLength();
    const units = [];
    for (let i = 0; i < boardLength; i++) {
        units.push(await gameSession.board(i));
    }
    return units;
}
```

## SESSION KEY COZUMU (UX)

### Problem
Her hamle icin MetaMask popup = Oynanamaz

### Cozum: Ephemeral Session Key
```
1. Oyun baslangici:
   - Tarayicida yeni keypair olustur
   - Ana cuzdandan bu key'e yetki ver (1 tx)
   - Session key oyun contract'larina sinirli

2. Oyun sirasinda:
   - Tum hamleler session key ile imzalanir
   - Kullanici popup gormez
   - Hamle aninda gonderilir

3. Oyun bitisi:
   - Session key otomatik expire
   - Veya manuel revoke
```

---

## FHE EKONOMI ANALIZI

### Hangi Sistemde FHE Kullanilacak?

| Sistem | FHE | Oncelik | Aciklama |
|--------|-----|---------|----------|
| Spirit Orbs | EVET | YUKSEK | Provably fair loot box - kart icerigi encrypted |
| Daily Claims | HAYIR | - | Deterministik, gizlenecek bilgi yok |
| Mystery Crates | BELKI | DUSUK | Randomness eklenirse gerekir |
| Gold | HAYIR | - | Seffaf olmali, ERC20 olabilir |
| Gauntlet Draft | BELKI | ORTA | Kart havuzu gizliligi icin |

### Decryption ve Wallet Onaylari

```
PUBLIC VERILER (Decrypt Gerekmez, Popup Yok):
- Gold bakiyesi
- Spirit bakiyesi
- Kac orb'un var
- Kart koleksiyonun
- Deck'lerin

ENCRYPTED VERILER (FHE ile):
- Orb ICINDEKI kartlar (acilana kadar)
- Shuffle sirasi
- Gauntlet draft havuzu
```

### Wallet Popup Gereken Islemler

| Islem | Popup? | Aciklama |
|-------|--------|----------|
| Gold bakiye gorme | HAYIR | Public read |
| Orb satin alma | EVET | 1x transfer tx |
| Orb acma | EVET | 1x tx (veya session key ile 0) |
| Kartlari gorme (acilmis) | HAYIR | Public read |
| Oyun oynama | HAYIR | Session key ile |

### FHE Ne Zaman Devreye Girer?

```
ORB LIFECYCLE:

1. SATIN ALMA (FHE YOK)
   -> Kullanici Gold oder
   -> "unopenedOrbs" sayaci +1 olur
   -> Henuz kart belirlenmedi!

2. ORB ACMA (FHE BASLAR)
   -> Kullanici "Open Orb" tiklar
   -> Contract FHE.randEuint8() ile 5 kart belirler
   -> Kartlar ENCRYPTED olarak saklanir

3. KART REVEAL (PUBLIC DECRYPT)
   -> Her kart icin publicDecrypt cagrilir
   -> KMS imzasi ile dogrulanir
   -> Kartlar koleksiyona eklenir (artik public)
```

### Tokenization Stratejisi

| Varlik | Token Tipi | FHE? | Trade? |
|--------|------------|------|--------|
| Gold | ERC20 | HAYIR | EVET |
| Spirit | ERC20 | HAYIR | EVET |
| Kartlar | ERC721 (NFT) | HAYIR | EVET |
| Unopened Orb | ERC721 (NFT) | EVET* | EVET |

*Orb NFT'si trade edilebilir, ama icindeki kartlar hala encrypted - yeni sahibi acinca reveal olur

### FHE Kullanim Amaclari

1. **PROVABLE FAIRNESS** - "Bu orb'dan legendary cikma sansi %2 idi" kanitlanabilir
2. **HIDDEN INFORMATION** - Orb icerigi ACILANA kadar kimse bilmez
3. **TRUSTLESS RANDOMNESS** - Sunucu manipulasyon yapamaz, Math.random() yerine FHE.randEuint8()
4. **GELECEK: OYUN ICI GIZLILIK** - El kartlari encrypted, deste sirasi encrypted

### Spirit Orb Contract Ornegi

```solidity
contract SpiritOrb is ERC721 {
    // Acilmamis orb'larin encrypted icerigi
    mapping(uint256 => euint8[5]) private _encryptedCards;

    // Orb ac - FHE ile kart belirle
    function openOrb(uint256 orbId) external {
        require(ownerOf(orbId) == msg.sender);

        // 5 kart icin random (encrypted)
        for (uint i = 0; i < 5; i++) {
            _encryptedCards[orbId][i] = FHE.randEuint8();
        }

        // Public decrypt icin isaretle
        for (uint i = 0; i < 5; i++) {
            FHE.makePubliclyDecryptable(_encryptedCards[orbId][i]);
        }
    }

    // Kartlari reveal et (frontend cagirir)
    function revealCards(
        uint256 orbId,
        bytes calldata clearValues,
        bytes calldata proof
    ) external {
        // KMS imzasi dogrula
        // Kartlari mint et (NFT olarak)
        // Orb'u burn et
    }
}
```

---

## PROJE DURUMU

### Tamamlanan
- [x] FHEVM dokumantasyonu okundu ve hafizaya alindi
- [x] Duelyst yapisi analiz edildi
- [x] Gizlilik stratejisi belirlendi
- [x] Session key cozumu tasarlandi
- [x] Asset'ler cikarildi (180MB)
- [x] 730 kart JSON formatinda cikarildi
- [x] Decaffeinate bug fix'leri yapildi
- [x] FHE Ekonomi Analizi tamamlandi

### Yapilacak
- [ ] Smart Contract'lar yazilacak (SpiritOrb.sol, CardNFT.sol, GameGold.sol)
- [ ] Hardhat + FHEVM kurulumu
- [ ] Local Hardhat test
- [ ] Sepolia deploy
- [ ] Frontend entegrasyonu

---

## DECAFFEINATE BUG FIX'LER

### 1. Action Type Bug (2025-12-07)

**Dosya:** `fheight-source/app/sdk/actions/action.js`

**Sorun:** ES6'da `super()` constructor'da ilk carilmali. Orijinal CoffeeScript'te `@type ?= ChildClass.type` ONCE calisiyordu.

**Cozum:**
```javascript
getType() {
  return this.constructor.type || this.type;
}
```

### 2. ZAMA UI Degisiklikleri
- Tutorial metinleri ZAMA temali yapildi
- Gold buton stilleri eklendi (.zama-gold)
- Loading GIF fhe_wizard olarak guncellendi

### 3. hasAttemptedChallengeCategory Bug (2025-12-08)

**Dosya:** `fheight-source/app/ui/managers/progression_manager.js`

**Sorun:** Decaffeinate `_.reduce` icin yanlis context binding uretti.

**Yanlis:**
```javascript
return _.reduce(challengesInCategory, function (memo, challenge) {
    return memo && this.hasAttemptedChallengeOfType(challenge.type);
}, true, this);  // 4. parametre context icin calismaz
```

**Dogru:**
```javascript
return _.reduce(challengesInCategory, function (memo, challenge) {
    return memo && this.hasAttemptedChallengeOfType(challenge.type);
}.bind(this), true);  // .bind(this) kullan
```

---

## FAZ 3: WALLET ENTEGRASYONU

### Strateji
Username/Password sistemi kaldirildi. Sadece wallet ile giris yapiliyor.

```
1. Connect Wallet  (MetaMask/Injected Provider)
   -> window.ethereum.request({ method: 'eth_requestAccounts'})

2. Sign Message (Popup Step 2)
   -> signer.signMessage("Login to FHEIGHT...")

3. Backend'e gonder: POST /session/wallet-connect
   { walletAddress, signature, message }

4. Backend:
   - Signature dogrula (ecrecover)
   - Kullanici yoksa: users tablosunda olustur
   - Firebase Custom Token uret
   - Token dondur

5. Frontend: authWithCustomToken(token)
   -> Mevcut Firebase sistemi devam eder
```

### Dosya Degisiklikleri

| Dosya | Degisiklik |
|-------|------------|
| `app/ui/templates/item/login_menu.hbs` | Username/password inputlari kaldirildi, Connect Wallet butonu |
| `app/ui/views/item/login_menu.js` | Wallet connect logic eklendi |
| `app/ui/views/item/wallet_connect_dialog.js` | YENI - 2 adimli popup (connect + sign) |
| `app/ui/templates/item/wallet_connect_dialog.hbs` | YENI - Popup template |
| `app/common/session2.js` | walletConnect() metodu eklendi |
| `app/common/wallet.js` | YENI - ethers.js wrapper |

### Network Konfigurasyonu
```javascript
// Sepolia Testnet
const SEPOLIA_CONFIG = {
  chainId: '0xaa36a7',  // 11155111
  chainName: 'Sepolia',
  rpcUrls: ['https://rpc.sepolia.org'],
  nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 }
};

// Local Hardhat
const HARDHAT_CONFIG = {
  chainId: '0x7a69',  // 31337
  chainName: 'Hardhat Local',
  rpcUrls: ['http://127.0.0.1:8545'],
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }
};
```

### Backend Endpoint (Eklenecek)
```javascript
// POST /session/wallet-connect
router.post('/wallet-connect', async (req, res) => {
  const { walletAddress, signature, message } = req.body;

  // 1. Signature dogrula
  const recoveredAddress = ethers.verifyMessage(message, signature);
  if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // 2. Kullanici bul veya olustur
  let user = await findUserByWallet(walletAddress);
  if (!user) {
    user = await createUser({
      wallet_address: walletAddress,
      username: formatWalletUsername(walletAddress) // 0x78c1...5CF9
    });
  }

  // 3. Firebase Custom Token uret
  const token = await admin.auth().createCustomToken(user.id);

  res.json({ token, userId: user.id });
});
```

---

## PROJE KLASOR YAPISI

```
FHEIGHT/
├── fheight-source/     <- Ana proje (open-duelyst fork)
│   ├── app/
│   │   ├── sdk/        <- Oyun mantigi
│   │   ├── ui/         <- Frontend (Backbone/Marionette)
│   │   └── common/     <- Paylasilan kod
│   ├── bin/            <- Sunucu baslaticlari (api, game, sp, worker)
│   ├── server/         <- Backend kodlari
│   └── dist/           <- Build ciktisi
├── game/               <- Cikarilan asset/data deposu
│   ├── assets/         <- Gorseller (cards, units, fx, etc.)
│   ├── data/           <- Kart JSON'lari
│   └── reference/      <- Referans materyaller
├── duelyst-original/   <- Orijinal kaynak referansi
├── document/           <- Dokumantasyon
└── scripts/            <- Yardimci scriptler
```

---

*Son guncelleme: 2025-12-08 - FHE Ekonomi Analizi eklendi*
