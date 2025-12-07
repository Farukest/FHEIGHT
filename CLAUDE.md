# FHEIGHT Project - ZAMA FHEVM Protocol Reference

Bu dosya Claude'un kal1c1 haf1zas1d1r. Proje bilgileri ve FHEVM dˆk¸mantasyonu burada saklan1r.

---

## 1. M0MAR0 B0LE^ENLER

| Bile_en | AÁ1klama |
|---------|----------|
| **FHEVM Library** | Solidity'de _ifreli veri tipleri ve FHE operasyonlar1 |
| **Host Contracts** | EVM zincirlerinde ACL yˆnetimi (Ethereum, Sepolia) |
| **Coprocessors** | Off-chain FHE hesaplama servisleri |
| **Gateway** | Arbitrum L3 orkestratˆr (Chain ID: 10901) |
| **KMS** | MPC tabanl1 anahtar yˆnetimi (13 node, 7/13 threshold) |
| **Relayer** | Off-chain kˆpr¸ servisi, SDK ile etkile_im |

---

## 2. ^0FREL0 VER0 T0PLER0

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

## 3. FHE OPERASYONLAR0

### Aritmetik
```solidity
FHE.add(a, b)      // Toplama
FHE.sub(a, b)      // «1karma
FHE.mul(a, b)      // «arpma
FHE.div(a, b)      // Bˆlme
FHE.rem(a, b)      // Mod
FHE.neg(a)         // Negatif
FHE.min(a, b)      // Minimum
FHE.max(a, b)      // Maximum
```

### Mant1ksal
```solidity
FHE.and(a, b)      // AND
FHE.or(a, b)       // OR
FHE.xor(a, b)      // XOR
FHE.not(a)         // NOT
```

### Kar_1la_t1rma (ebool dˆner)
```solidity
FHE.eq(a, b)       // a == b
FHE.ne(a, b)       // a != b
FHE.lt(a, b)       // a < b
FHE.gt(a, b)       // a > b
FHE.le(a, b)       // a <= b
FHE.ge(a, b)       // a >= b
```

### Bit Manip¸lasyonu
```solidity
FHE.shl(a, shift)  // Sola kayd1r
FHE.shr(a, shift)  // Saa kayd1r
FHE.rotl(a, n)     // Sola rotate
FHE.rotr(a, n)     // Saa rotate
```

### SeÁim (Ternary)
```solidity
FHE.select(condition, ifTrue, ifFalse)  // condition ? ifTrue : ifFalse
```

### Random Say1 ‹retimi
```solidity
FHE.randEbool()
FHE.randEuint8()
FHE.randEuint16()
FHE.randEuint32()
FHE.randEuint64()
FHE.randEuint8(upperBound)    // 0 ile upperBound-1 aras1 (bounded)
FHE.randEuint16(upperBound)
FHE.randEuint32(upperBound)
FHE.randEuint64(upperBound)
```

### Tip Dˆn¸_¸mleri
```solidity
FHE.asEbool(value)
FHE.asEuint8(value)
FHE.asEuint32(value)
FHE.asEuint64(value)
FHE.asEaddress(value)
FHE.toBytes32(handle)    // Handle'1 bytes32'ye Áevir
```

---

## 4. ACL (Access Control List)

```solidity
// Kal1c1 eri_im izni
FHE.allow(handle, address)

// GeÁici eri_im (sadece bu tx iÁin)
FHE.allowTransient(handle, address)

// Contract'1n kendisine eri_im
FHE.allowThis(handle)

// Public decrypt iÁin izin
FHE.makePubliclyDecryptable(handle)

// Eri_im kontrol¸
FHE.isAllowed(handle, address)
FHE.isSenderAllowed(handle)
```

### ACL Kurallar1
- User decrypt iÁin HEM contract HEM user'a allow verilmeli
- `FHE.allowThis()` unutulursa user decrypt BA^ARISIZ olur
- Ephemeral permission tx sonunda silinir

---

## 5. INPUT HANDLING (Encryption)

### Contract Taraf1
```solidity
function myFunction(externalEuint32 encryptedInput, bytes calldata inputProof) external {
    // Off-chain'den gelen _ifreli input'u dorula ve dˆn¸_t¸r
    euint32 value = FHE.fromExternal(encryptedInput, inputProof);

    // 0zinleri ayarla
    FHE.allowThis(value);
    FHE.allow(value, msg.sender);
}
```

### TypeScript/Frontend Taraf1 - TEK DEER
```typescript
import { fhevm } from "hardhat";

// ^ifreli input olu_tur
const input = fhevm.createEncryptedInput(contractAddress, userAddress);
input.add32(12345);  // uint32 deer ekle
const encrypted = await input.encrypt();

// Contract'a gˆnder
await contract.myFunction(encrypted.handles[0], encrypted.inputProof);
```

### «OKLU INPUT ^0FRELEME
```typescript
const input = fhevm.createEncryptedInput(contractAddress, userAddress);
input.addBool(true);      // handles[0] = ebool
input.add8(255);          // handles[1] = euint8
input.add16(65535);       // handles[2] = euint16
input.add32(12345);       // handles[3] = euint32
input.add64(9999999999n); // handles[4] = euint64
input.addAddress("0x..."); // handles[5] = eaddress
const encrypted = await input.encrypt();

// Tek proof hepsi iÁin kullan1l1r!
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

### TEK DEER USER DECRYPT
```typescript
import { FhevmType } from "@fhevm/hardhat-plugin";

// Contract'tan handle al
const encryptedHandle = await contract.getValue();

// User decrypt - sadece izinli user yapabilir
const clearValue = await fhevm.userDecryptEuint(
    FhevmType.euint32,    // Tip
    encryptedHandle,       // Contract'tan al1nan handle
    contractAddress,       // Contract adresi
    userSigner             // 0zinli user'1n signer'1
);

console.log("Decrypted value:", clearValue);
```

### «OKLU DEER USER DECRYPT
```typescript
import { FhevmType } from "@fhevm/hardhat-plugin";

// Contract'tan birden fazla handle al
const [handleA, handleB, handleMax] = await contract.getValues();

// «oklu decrypt - ayn1 contract ve user iÁin
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

### USER DECRYPT 0«0N GEREKL0 0Z0NLER (Contract'ta)
```solidity
// HER 0K0 0Z0N DE GEREKL0!
FHE.allowThis(_value);           // 1. Contract'a izin
FHE.allow(_value, msg.sender);   // 2. User'a izin
```

---

## 7. PUBLIC DECRYPTION (On-chain Verifiable)

### CONTRACT TARAFI - Public Decrypt 0stei
```solidity
// 1. ^ifreli deeri olu_tur
euint32 private _encryptedResult;

function computeResult() external {
    _encryptedResult = FHE.add(a, b);

    // Public decrypt iÁin i_aretle
    FHE.makePubliclyDecryptable(_encryptedResult);
}

// 2. Decrypt sonucunu dorula ve kaydet
function recordResult(bytes calldata abiEncodedClearValue, bytes calldata decryptionProof) external {
    // Dorulama iÁin handle'lar1 haz1rla
    bytes32[] memory cts = new bytes32[](1);
    cts[0] = FHE.toBytes32(_encryptedResult);

    // KMS imzas1n1 dorula
    FHE.checkSignatures(cts, abiEncodedClearValue, decryptionProof);

    // Art1k clear deeri kullanabiliriz
    uint32 clearResult = abi.decode(abiEncodedClearValue, (uint32));
    // ... i_lem yap
}
```

### FRONTEND TARAFI - Public Decrypt «ar1s1
```typescript
// 1. Contract'tan _ifreli handle'1 al
const encryptedHandle = await contract.getEncryptedResult();

// 2. Relayer'dan decrypt iste
const publicDecryptResults = await fhevm.publicDecrypt([encryptedHandle]);

// 3. SonuÁlar1 contract'a gˆnder
await contract.recordResult(
    publicDecryptResults.abiEncodedClearValues,
    publicDecryptResults.decryptionProof
);
```

### «OKLU PUBLIC DECRYPT
```typescript
// Birden fazla handle iÁin
const [handle1, handle2, handle3] = await contract.getMultipleHandles();

const results = await fhevm.publicDecrypt([handle1, handle2, handle3]);

// results.clearValues = [value1, value2, value3]
// results.abiEncodedClearValues = t¸m¸ iÁin encoded
// results.decryptionProof = tek proof

await contract.recordMultipleResults(
    results.abiEncodedClearValues,
    results.decryptionProof
);
```

### SOLIDITY'DE «OKLU DEER DECODE
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

    // «oklu decode
    (uint32 val1, uint64 val2, bool val3) = abi.decode(
        abiEncodedClearValues,
        (uint32, uint64, bool)
    );
}
```

---

## 8. SEPOLIA TESTNET ADRESLER0

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

### Dosya Yap1s1
```
contracts/          # .sol dosyalar1
test/              # .ts test dosyalar1
deploy/            # deployment scripts
```

### Komutlar
```bash
npx hardhat compile                    # Derleme
npx hardhat test --network hardhat     # Mock test (h1zl1, gerÁek FHE yok)
npx hardhat test --network localhost   # Local Hardhat node
npx hardhat test --network sepolia     # GerÁek FHE testnet
npx hardhat deploy --network sepolia   # Deploy
```

### Environment Variables (.env)
```
MNEMONIC="your 12 word mnemonic phrase"
INFURA_API_KEY="your-infura-key"
ETHERSCAN_API_KEY="your-etherscan-key"
```

---

## 10. TEMEL CONTRACT ^ABLONU

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract MyContract is ZamaEthereumConfig {
    euint32 private _secretValue;

    // ^ifreli deer set et
    function setValue(externalEuint32 input, bytes calldata inputProof) external {
        euint32 value = FHE.fromExternal(input, inputProof);
        _secretValue = value;

        // 0Z0NLER ÷NEML0!
        FHE.allowThis(_secretValue);        // Contract eri_imi
        FHE.allow(_secretValue, msg.sender); // User decrypt iÁin
    }

    // ^ifreli hesaplama
    function addToValue(externalEuint32 input, bytes calldata inputProof) external {
        euint32 addend = FHE.fromExternal(input, inputProof);
        _secretValue = FHE.add(_secretValue, addend);

        FHE.allowThis(_secretValue);
        FHE.allow(_secretValue, msg.sender);
    }

    // Handle dˆnd¸r (user decrypt iÁin)
    function getValue() external view returns (euint32) {
        return _secretValue;
    }
}
```

---

## 11. COUNTER ÷RNE0 (Tam)

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

## 12. IF-THEN-ELSE ÷RNE0 (Max Bulma)

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
        // ^ifreli kar_1la_t1rma
        ebool aGreaterOrEqual = FHE.ge(_a, _b);

        // ^ifreli select (if-then-else)
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

## 13. HEADS OR TAILS ÷RNE0 (Public Decrypt)

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

        // Rastgele _ifreli sonuÁ
        ebool result = FHE.randEbool();

        games[gameId] = Game({
            headsPlayer: headsPlayer,
            tailsPlayer: tailsPlayer,
            encryptedResult: result,
            winner: address(0),
            isSettled: false
        });

        // Public decrypt iÁin i_aretle
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

        // KMS imzas1n1 dorula
        bytes32[] memory cts = new bytes32[](1);
        cts[0] = FHE.toBytes32(game.encryptedResult);
        FHE.checkSignatures(cts, abiEncodedResult, decryptionProof);

        // Kazanan1 belirle
        bool headsWon = abi.decode(abiEncodedResult, (bool));
        game.winner = headsWon ? game.headsPlayer : game.tailsPlayer;
        game.isSettled = true;
    }
}
```

### Frontend
```typescript
// 1. Oyun ba_lat
const tx = await contract.startGame(headsPlayer.address, tailsPlayer.address);
const receipt = await tx.wait();
const gameId = 0; // Event'ten al

// 2. ^ifreli sonucu al
const encryptedResult = await contract.getEncryptedResult(gameId);

// 3. Public decrypt
const decryptResult = await fhevm.publicDecrypt([encryptedResult]);

// 4. Kazanan1 kaydet
await contract.recordWinner(
    gameId,
    decryptResult.abiEncodedClearValues,
    decryptResult.decryptionProof
);

// 5. Kazanan1 kontrol et
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

    // Owner iÁin mint
    function mint(address to, uint64 amount) external onlyOwner {
        euint64 encrypted = FHE.asEuint64(amount);
        _mint(to, encrypted);
    }
}
```

### Confidential Transfer
```typescript
// ^ifreli transfer miktar1 olu_tur
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
// ^ifreli balance handle'1 al
const balanceHandle = await token.confidentialBalanceOf(user.address);

// User decrypt ile balance ˆren
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

### Instance Olu_turma
```typescript
import { createInstance, SepoliaConfig } from '@zama-fhe/relayer-sdk';

// Sepolia iÁin instance
const instance = await createInstance(SepoliaConfig);
```

### ^ifreli Input Olu_turma
```typescript
// Contract ve user adresleri ile input olu_tur
const input = instance.createEncryptedInput(contractAddress, userAddress);
input.add32(42);
input.add64(1000000n);
const encrypted = await input.encrypt();

// Contract Áar1s1
await contract.someFunction(
    encrypted.handles[0],
    encrypted.handles[1],
    encrypted.inputProof
);
```

### User Decryption
```typescript
// 1. Keypair olu_tur
const keypair = instance.generateKeypair();

// 2. EIP-712 imza istei olu_tur
const eip712 = instance.createEIP712(
    keypair.publicKey,
    [contractAddress],  // 0zin verilen contract'lar
    startTime,          // GeÁerlilik ba_lang1c1
    days                // GeÁerlilik s¸resi (g¸n)
);

// 3. Kullan1c1dan imza al
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

| Operasyon | Yakla_1k HCU |
|-----------|--------------|
| add/sub | D¸_¸k |
| mul | Orta |
| div | Y¸ksek |
| comparison | Orta |
| random | Y¸ksek |

- **TX Limit**: 20,000,000 HCU
- **Depth Limit**: 5,000,000

---

## 17. ÷NEML0 NOTLAR VE HATALAR

### UNUTMA!
1. **ACL Unutma**: `FHE.allowThis()` ve `FHE.allow()` olmadan decrypt «ALI^MAZ
2. **Proof Tek**: «oklu input iÁin tek `inputProof` kullan1l1r
3. **Handle = bytes32**: ^ifreli deerler on-chain'de bytes32 handle olarak saklan1r
4. **Mock vs Real**: Hardhat network mock kullan1r (h1zl1), Sepolia gerÁek FHE
5. **Gas Maliyeti**: FHE operasyonlar1 pahal1, optimize et
6. **Overflow Yok**: FHE operasyonlar1nda otomatik overflow korumas1 yok!

### YAYGN HATALAR
```solidity
// YANLI^ - izin yok
function setValue(externalEuint32 input, bytes calldata proof) external {
    _value = FHE.fromExternal(input, proof);
    // 0zin vermeden decrypt BA^ARISIZ olur!
}

// DORU
function setValue(externalEuint32 input, bytes calldata proof) external {
    _value = FHE.fromExternal(input, proof);
    FHE.allowThis(_value);        // Contract iÁin
    FHE.allow(_value, msg.sender); // User iÁin
}
```

---

## 18. TEST ^ABLONU (TypeScript)

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
        // ^ifreli deer olu_tur
        await contract.createEncryptedValue();

        // Handle al
        const handle = await contract.getEncryptedValue();

        // Public decrypt
        const result = await fhevm.publicDecrypt([handle]);

        // Contract'a dorulama gˆnder
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

## KAYNAK: Open Fheight
- Repo: https://github.com/open-fheight/fheight
- Game Logic: `app/sdk/` (CoffeeScript - dˆn¸_t¸r¸lecek)
- Assets: `app/resources/` (kullan1lacak)
- Kart Data: `app/sdk/cards/`
- Board Logic: `app/sdk/board.coffee`
- Actions: `app/sdk/actions/`
- Spells: `app/sdk/spells/`
- Modifiers: `app/sdk/modifiers/`

## FHEIGHT OYUN MEKAN0KLER0
```
                                                 
  5x9 Grid Tabanl1 Taktik Kart Oyunu             
                                                 
  - Her oyuncunun 1 General'i (Hero) var         
  - 40 kartl1k deste                             
  - Ba_lang1Á eli: 5 kart (mulligan var)         
  - Her tur: +1 mana (max 9), +1 kart Áek        
  - Kartlar: Minion, Spell, Artifact             
  - AmaÁ: Rakip General'i ˆld¸r                  
                                                 
  Turn Yap1s1:                                   
  1. Kart Áek                                    
  2. Mana yenile                                 
  3. Kart oyna / Birim hareket / Sald1r          
  4. Turn bitir                                  
                                                 
```

## G0ZL0L0K STRATEJ0S0 (FHEVM)

### ^ifreli Olacaklar (Rakip Gˆremez)
| Veri | Tip | AÁ1klama |
|------|-----|----------|
| Oyuncu Eli | euint8[6] | Eldeki kart ID'leri _ifreli |
| Deste S1ras1 | euint8[40] | «ekilecek kartlar1n s1ras1 |
| Kart «ekimi | FHE.randEuint8Bounded() | Shuffle iÁin random |

### AÁ1k Olacaklar (Board State)
| Veri | Neden AÁ1k |
|------|------------|
| Board ¸zerindeki birimler | Oynanabilirlik - gˆrmek laz1m |
| Birim HP/ATK | Sava_ iÁin gerekli |
| General HP | Oyun durumu |
| Mana | Hamle planlamas1 |
| Mezarl1k | Baz1 kartlar buna bakar |

### Hibrit Yakla_1m
```
Oyuncu A Eli: [encrypted, encrypted, encrypted, ...]  ê Sadece A gˆrebilir
Board State:  [public, public, public, ...]           ê Herkes gˆr¸r
Oyuncu B Eli: [encrypted, encrypted, encrypted, ...]  ê Sadece B gˆrebilir
```

## SESSION KEY «÷Z‹M‹ (UX)

### Problem
Her hamle iÁin MetaMask popup = Oynanamaz

### «ˆz¸m: Ephemeral Session Key
```
1. Oyun ba_lang1c1:
   - Taray1c1da yeni keypair olu_tur
   - Ana c¸zdandan bu key'e yetki ver (1 tx)
   - Session key oyun contract'lar1na s1n1rl1

2. Oyun s1ras1nda:
   - T¸m hamleler session key ile imzalan1r
   - Kullan1c1 popup gˆrmez
   - Hamle an1nda gˆnderilir

3. Oyun biti_i:
   - Session key otomatik expire
   - Veya manuel revoke
```

---

## PROJE DURUMU

### Tamamlanan
- [x] FHEVM dˆk¸mantasyonu okundu ve haf1zaya al1nd1
- [x] Fheight yap1s1 analiz edildi
- [x] Gizlilik stratejisi belirlendi
- [x] Session key Áˆz¸m¸ tasarland1
- [x] Fheight repo klonland1
- [x] Asset'ler Á1kar1ld1 (180MB - units, tiles, generals, UI, FX)
- [x] 730 kart JSON format1nda Á1kar1ld1
- [x] Localization entegrasyonu yap1ld1
- [x] Faz 1: Hardhat + FHEVM Kurulum
- [x] Faz 2: Smart Contracts tamamland1
- [x] Deploy scriptleri yaz1ld1
- [x] T¸m testler geÁti (12/12)
- [x] Local Hardhat'a deploy edildi
- [x] Sepolia Testnet Deploy & Verify 

### Sepolia Testnet Deploy Adresleri (Verified )
```
CardRegistry:        0x143AC4264fa68b0203eb54705BF102f4eFEF9f3b
GameSession:         0xA82161613062c726Fe4b52C9651B581e028BEF57
SessionKeyManager:   0x0ce34ecab16CE5b1d395d4C13a3f5F3e54d89215
GameSessionWithKeys: 0xf2FEC4EDf6edb1f32D4D366e0068BF911AA6e7d0

Deployer: 0x78c1e25054E8a3F1BC7f9d16f4E5dAC0BA415CF9
```

### Etherscan Links
- [CardRegistry](https://sepolia.etherscan.io/address/0x143AC4264fa68b0203eb54705BF102f4eFEF9f3b#code)
- [GameSession](https://sepolia.etherscan.io/address/0xA82161613062c726Fe4b52C9651B581e028BEF57#code)
- [SessionKeyManager](https://sepolia.etherscan.io/address/0x0ce34ecab16CE5b1d395d4C13a3f5F3e54d89215#code)
- [GameSessionWithKeys](https://sepolia.etherscan.io/address/0xf2FEC4EDf6edb1f32D4D366e0068BF911AA6e7d0#code)

---

## DECAFFEINATE BUG FIX'LER

### 1. Action Type Bug (2025-12-07)

**Dosya:** `fheight-source/app/sdk/actions/action.js`

**Sorun:** ES6'da `super()` constructor'da ilk Áar1lmal1. Orijinal CoffeeScript'te `@type ?= ChildClass.type` ÷NCE Áal1_1yordu.

**«ˆz¸m:**
```javascript
getType() {
  return this.constructor.type || this.type;
}
```

### 2. ZAMA UI Dei_iklikleri
- Tutorial metinleri ZAMA temal1 yap1ld1
- Gold buton stilleri eklendi (.zama-gold)
- Loading GIF fhe_wizard olarak g¸ncellendi

---

*Son g¸ncelleme: 2025-12-07*
