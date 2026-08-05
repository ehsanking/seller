const fs = require('fs');
let content = fs.readFileSync('src/components/StorefrontSandboxPreview.tsx', 'utf8');

// Fix the interface props
content = content.replace(/device \| 'mobile';/, "device: 'desktop' | 'mobile';");
content = content.replace(/type \| 'header'/, "type: 'header'");

fs.writeFileSync('src/components/StorefrontSandboxPreview.tsx', content);
