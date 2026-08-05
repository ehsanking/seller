const fs = require('fs');
let c = fs.readFileSync('src/components/StorefrontSandboxPreview.tsx', 'utf8');

c = c.replace(/selectedLanguage === 'en' \? '([^']*)'/g, "'$1'");
c = c.replace(/selectedLanguage === 'fa' \? '([^']*)'/g, "''"); // remove persian if it's there

c = c.replace(/isCyberTech \? '([^']*)' : isLuxury \? '([^']*)' : isOrganic \? '([^']*)' /g, "isCyberTech ? '$1' : isLuxury ? '$2' : isOrganic ? '$3' : ''");
c = c.replace(/isCyberTech \? '([^']*)' : isLuxury \? '([^']*)' /g, "isCyberTech ? '$1' : isLuxury ? '$2' : ''");
c = c.replace(/isCyberTech \? '([^']*)'/g, "isCyberTech ? '$1' : ''");

c = c.replace(/\? '([^']*)' $/gm, "? '$1' : ''");

// Fix dir="ltr"
c = c.replace(/dir={selectedLanguage === 'fa' \? 'rtl' }/g, 'dir="ltr"');
c = c.replace(/dir=\{selectedLanguage === 'fa' \? 'rtl' \}/g, 'dir="ltr"');

// 408
c = c.replace(/isLuxury \? 'bg-stone-900' }/g, "isLuxury ? 'bg-stone-900' : ''}");

// 516
c = c.replace(/selectedCategory === cat \? '([^']*)' /g, "selectedCategory === cat ? '$1' : ''");
// 529
c = c.replace(/device === 'mobile' \? '([^']*)' }/g, "device === 'mobile' ? '$1' : ''}");

c = c.replace(/selectedCurrency === cur \? '([^']*)' }/g, "selectedCurrency === cur ? '$1' : ''}");
c = c.replace(/selectedThemeColor === p\.id \? '([^']*)' }/g, "selectedThemeColor === p.id ? '$1' : ''}");
c = c.replace(/selectedColor === color \? '([^']*)' /g, "selectedColor === color ? '$1' : ''");
c = c.replace(/selectedSize === size \? '([^']*)' /g, "selectedSize === size ? '$1' : ''");
c = c.replace(/shippingFee === 0 \? \( 'FREE' \) : formatPrice\(shippingFee\)/g, "shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)");

// 1080 and 1094
c = c.replace(/\? 'border-indigo-600 ring-2 ring-indigo-500\/10'/g, "? 'border-indigo-600 ring-2 ring-indigo-500/10' : 'border-slate-200'");

fs.writeFileSync('src/components/StorefrontSandboxPreview.tsx', c);
