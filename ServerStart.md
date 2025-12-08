● Bash(cd /c/Users/Farukest-Working/Desktop/PROJECT/FHEIGHT/fheight-source && node -r dotenv/config ./bin/api)
⎿  Running in the background (down arrow to manage)

● BashOutput(Reading shell output)
⎿  CONFIG: version:1.0.0
CONFIG: env:development
CONFIG: firebase:zama-e9173-default-rtdb.firebaseio.com
… +10 lines (ctrl+o to expand)

● API sunucusu port 3000'de çalışıyor. Firebase, Redis, Postgres bağlantıları başarılı.

Başka sunucu var mı kontrol edeyim ve gerekirse onları da başlatayım:

● Search(pattern: "fheight-source/bin/*")
⎿  Found 5 files (ctrl+o to expand)

● Game ve single_player sunucularını da başlatayım:

● Bash(cd /c/Users/Farukest-Working/Desktop/PROJECT/FHEIGHT/fheight-source && node -r dotenv/config ./bin/game)
⎿  Running in the background (down arrow to manage)

● Bash(cd /c/Users/Farukest-Working/Desktop/PROJECT/FHEIGHT/fheight-source && node -r dotenv/config ./bin/single_player)
⎿  Running in the background (down arrow to manage)

● BashOutput(Reading shell output)
⎿  CONFIG: version:1.0.0
CONFIG: env:development
CONFIG: firebase:zama-e9173-default-rtdb.firebaseio.com
… +7 lines (ctrl+o to expand)

● BashOutput(Reading shell output)
⎿  CONFIG: version:1.0.0
CONFIG: env:development
CONFIG: firebase:zama-e9173-default-rtdb.firebaseio.com
… +8 lines (ctrl+o to expand)

● Tüm sunucular çalışıyor:

| Sunucu             | Port | Durum       |
  |--------------------|------|-------------|
| API                | 3000 | ✅ Çalışıyor |
| Game               | 8001 | ✅ Çalışıyor |
| Single Player (AI) | 8000 | ✅ Çalışıyor |