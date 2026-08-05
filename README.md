<p align="center">
  <img src="./src/assets/images/seller_banner_1785927221343.jpg" alt="Seller Banner" width="100%" style="border-radius: 12px; shadow: 0 10px 30px rgba(0,0,0,0.3);" />
</p>

<p align="center">
  <img src="./src/assets/images/seller_logo_1785927209652.jpg" alt="Seller Logo" width="120" height="120" style="border-radius: 20px;" />
</p>

<h1 align="center">SELLER Core (ehsanking/seller)</h1>

<p align="center">
  <strong>Hyper-Fast, Open-Source, Headless E-Commerce Core & Extension Platform</strong><br>
  Designed to empower small businesses and startups with enterprise-grade headless technology — <strong>100% Free Forever</strong>.
</p>

<p align="center">
  <a href="https://github.com/ehsanking/seller"><img src="https://img.shields.io/badge/Maintainer-EHSANKiNG-indigo.svg?style=for-the-badge&logo=github" alt="Maintainer EHSANKiNG" /></a>
  <a href="https://github.com/ehsanking/seller"><img src="https://img.shields.io/badge/License-MIT-emerald.svg?style=for-the-badge" alt="License MIT" /></a>
  <a href="https://github.com/ehsanking/seller"><img src="https://img.shields.io/badge/Laravel-11.x-red.svg?style=for-the-badge&logo=laravel" alt="Laravel 11" /></a>
  <a href="https://github.com/ehsanking/seller"><img src="https://img.shields.io/badge/PHP-8.2%2B-777BB4.svg?style=for-the-badge&logo=php" alt="PHP 8.2+" /></a>
  <a href="https://github.com/ehsanking/seller"><img src="https://img.shields.io/badge/PostgreSQL-JSONB-336791.svg?style=for-the-badge&logo=postgresql" alt="PostgreSQL" /></a>
  <a href="https://github.com/ehsanking/seller"><img src="https://img.shields.io/badge/Price-100%25%20FREE%20FOREVER-purple.svg?style=for-the-badge" alt="Free Forever" /></a>
</p>

---

## 🌟 Mission Statement / ماموریت ما

> **"Financial freedom for small businesses, zero software tax."**
> 
> **SELLER** was created by **EHSANKiNG** with a singular mission: to ensure that any entrepreneur, small business owner, or startup anywhere in the world can build, run, and scale a modern, lightning-fast e-commerce store with **zero licensing fees, zero recurring subscription costs, and total data sovereignty**.
> 
> This platform is **100% Free and Open-Source, forever**. There are no hidden paywalls, no "pro" lock-outs, and no mandatory cloud dependencies.

---

## 🚀 One-Line Instant Installation / نصب تک‌خطی سریع

Deploy the full SELLER Headless Core stack instantly using our single-line installer:

```bash
curl -sSL https://raw.githubusercontent.com/ehsanking/seller/main/install.sh | bash
```

### Docker One-Liner Execution:
```bash
docker run -d -p 3000:3000 --name seller-core ehsanking/seller:latest
```

---

## 💎 Key Features & Capabilities

- ⚡ **100% Headless Architecture**: Pure RESTful API outputs built using Laravel API Resources and strict PHP 8.2+ typing. Compatible with any frontend framework (Next.js, Nuxt.js, React, Mobile Apps).
- 🧩 **Dynamic Plugin Engine**: Modular plugin library supporting activation, custom config, drag-and-drop manifest uploads, and automatic mounting of active extensions into the Admin Navigation Menu.
- 💳 **Payment Integrations**: Pre-built plugins for **Stripe** (Credit Cards, Apple Pay, Webhooks) and **PayPal Commerce** (Express Checkout, Pay Later).
- 🚚 **Logistics & Express Shipping**: Integrated **DHL Express** plugin with live shipping rate calculation and waybill/packing slip printing.
- 🧠 **Multi-AI Commerce Copilot**: Built-in support for **Google Gemini 2.5 Flash**, **OpenAI GPT-4o**, and **Anthropic Claude 3.5** for automated SEO titles, product descriptions, and customer support response drafting.
- 📊 **CSV Data Exporting**: One-click CSV export for filtered Products and Orders data tables.
- 🖨️ **Print Engine**: Commercial invoice and warehouse packing slip print generators for store managers.
- 🛡️ **PostgreSQL & JSONB Ready**: Flexible schema supporting dynamic product attributes and custom metadata without database migrations.

---

## 🛠️ Plugin & Platform Development Guide / راهنمای توسعه

### 1. Plugin Manifest Specification (`plugin.json`)
Every plugin in **Seller** is defined by a manifest structure. Developers can author plugins locally or upload them via the Admin UI:

```json
{
  "name": "Custom Crypto Payment Gateway",
  "slug": "crypto-payment",
  "description": "Accept Bitcoin, Ethereum, and USDT payments with instant webhook confirmation.",
  "author": "EHSANKiNG",
  "version": "1.0.0",
  "category": "payment",
  "iconName": "CreditCard",
  "menuTitle": "Crypto Payments",
  "config": {
    "walletAddress": "TKPswLQqd2e73UTGJ5prxVXBVo7MTsWedU",
    "network": "TRC20",
    "autoConfirm": true
  },
  "hooks": [
    "OrderPlaced",
    "PaymentConfirmed"
  ]
}
```

### 2. Event-Driven Architecture (Laravel Events)
Plugins register listeners to core event dispatches without modifying core codebase:
- `OrderPlaced`: Dispatched when a customer completes checkout.
- `PaymentProcessed`: Triggered upon gateway confirmation.
- `OrderShipped`: Auto-invokes DHL tracking status emails.
- `ProductCreated`: Triggers AI SEO metadata auto-generation.

---

## 🏗️ Technical Stack & Standards

| Component | Technology | Standards / Architecture |
| :--- | :--- | :--- |
| **Backend Core** | Laravel 11 (PHP 8.2+) | Service-Repository Pattern, Strict Typing, PSR-12 |
| **Database** | PostgreSQL | JSONB for Dynamic Attributes, Indexing & Query Optimization |
| **API Layer** | Laravel API Resources | 100% Headless REST APIs, Rate Limited, CORS Secured |
| **Admin UI** | React 18, Vite, Tailwind CSS | Modular Component Architecture, Responsive, Accessible |
| **Icons** | Lucide React | Clean Vector Icons |

---

## ☕ Support & Donations / حمایت مالی از پروژه

**SELLER** is completely free to use for any commercial or personal purpose. If this software helped your business save money and thrive, consider donating to support continuous maintenance and feature updates by **EHSANKiNG**:

| Currency / Network | Wallet Address |
| :--- | :--- |
| 🟢 **USDT (Tether - TRC20)** | `TKPswLQqd2e73UTGJ5prxVXBVo7MTsWedU` |
| 🔴 **TRON (TRX)** | `TKPswLQqd2e73UTGJ5prxVXBVo7MTsWedU` |

---

## ⚖️ Legal Disclaimer & Terms of Use / سلب مسئولیت قانونی

```text
DISCLAIMER OF WARRANTY AND LIABILITY:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. 

IN NO EVENT SHALL THE AUTHOR ("EHSANKiNG") OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

MERCHANTS AND USERS ARE SOLELY RESPONSIBLE FOR COMPLYING WITH LOCAL E-COMMERCE LAWS,
TAXATION REGULATIONS, PAYMENT GATEWAY COMPLIANCE (PCI-DSS), AND DATA PRIVACY LAWS (GDPR/CCPA).
```

---

## 📜 License & Authorship

- **Author & Maintainer**: **EHSANKiNG** ([GitHub: @ehsanking](https://github.com/ehsanking))
- **Repository**: [ehsanking/seller](https://github.com/ehsanking/seller)
- **License**: MIT License — Open-Source and Free Forever.
