const fs = require('fs');
const file = 'app/ui/styles/item/login_registration.scss';
let content = fs.readFileSync(file, 'utf8');

const oldCode = `&.twitter:hover {
				color: #fff;
				filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
			}`;

const newCode = `&.twitter {
				background: transparent !important;
				width: auto !important;
				&:hover {
					color: #fff;
					filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
					background: transparent !important;
				}
			}`;

content = content.replace(oldCode, newCode);
fs.writeFileSync(file, content);
console.log('Done! Check localhost:3003');
