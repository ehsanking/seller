const fs = require('fs');
let c = fs.readFileSync('src/components/StorefrontSandboxPreview.tsx', 'utf8');
c = c.replace(/product\.name/g, 'product.title');
fs.writeFileSync('src/components/StorefrontSandboxPreview.tsx', c);
