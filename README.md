# react-card
Cash legen:
cd ..                    # ← NAAR /kunstroute/
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run dev

Powershell:
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm cache verify
npm install
npm run dev

frontend starten \kunstroute\

npm run dev

backend starten 
cd \kunstroute\server
node server.js