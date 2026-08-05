<p align="center">
  <img src="./src/assets/images/seller_banner_1785927221343.jpg" alt="SELLER Core Banner" width="100%" style="border-radius: 14px; box-shadow: 0 12px 40px rgba(0,0,0,0.35);" />
</p>

<p align="center">
  <img src="./src/assets/images/seller_logo_1785927209652.jpg" alt="SELLER Logo" width="130" height="130" style="border-radius: 24px;" />
</p>

<h1 align="center">SELLER Core — Enterprise Headless E-Commerce Platform</h1>

<p align="center">
  <strong>The Ultimate High-Performance, Modular, Open-Source E-Commerce Engine</strong><br>
  Empowering small businesses, creators, and developers worldwide with enterprise-grade headless technology — <strong>100% Free Forever</strong>.
</p>

<p align="center">
  <a href="https://github.com/ehsanking/seller"><img src="https://img.shields.io/badge/Author-EHSANKiNG-indigo.svg?style=for-the-badge&logo=github" alt="Maintainer EHSANKiNG" /></a>
  <a href="https://github.com/ehsanking/seller"><img src="https://img.shields.io/badge/License-MIT-emerald.svg?style=for-the-badge" alt="License MIT" /></a>
  <a href="https://github.com/ehsanking/seller"><img src="https://img.shields.io/badge/Backend-Laravel%2011%20%7C%20PHP%208.2%2B-red.svg?style=for-the-badge&logo=laravel" alt="Laravel 11" /></a>
  <a href="https://github.com/ehsanking/seller"><img src="https://img.shields.io/badge/Database-PostgreSQL%20JSONB-336791.svg?style=for-the-badge&logo=postgresql" alt="PostgreSQL" /></a>
  <a href="https://github.com/ehsanking/seller"><img src="https://img.shields.io/badge/Price-100%25%20FREE%20%26%20OPEN%20SOURCE-purple.svg?style=for-the-badge" alt="Free Forever" /></a>
</p>

---

## 🌐 Mission & Vision: Democratic Commerce for Everyone

In today’s e-commerce landscape, small business owners and independent entrepreneurs are choked by escalating monthly SaaS subscription fees, transaction cut percentages, locked-in proprietary ecosystems, and forced platform migrations.

**SELLER Core** was architected from the ground up by **EHSANKiNG** to break these barriers permanently. 

> ### 📢 Our Immutable Guarantee:
> **SELLER Core is, and will forever remain, 100% Free and Open-Source.** 
> No feature lock-outs, no monthly licensing fees, no transactional commission cuts, and zero vendor lock-in. You own your data, your infrastructure, your codebase, and your destiny.

---

## ⚡ One-Line Automatic Installation

Deploy the complete SELLER Headless Core environment on any Linux server, Cloud VM, or Docker container with a single command:

```bash
curl -sSL https://raw.githubusercontent.com/ehsanking/seller/main/install.sh | bash
```

### 🐳 Docker One-Liner Execution:
```bash
docker run -d -p 3000:3000 --name seller-core ehsanking/seller:latest
```

---

## 🎨 Universal Multi-Framework Storefront Engines

SELLER Core is a **true headless platform**. Its high-speed RESTful JSON API layer decouples backend management from frontend presentation, allowing you to connect **any** frontend technology stack seamlessly. 

We provide official pre-built starter storefront templates in the `/storefronts` repository directory:

```
├── storefronts/
│   ├── react-tailwind/        # React 18 + Vite + Tailwind CSS Storefront
│   ├── vue-tailwind/          # Vue 3 Composition API + Pinia Storefront
│   ├── bootstrap5/            # Pure HTML5 + Bootstrap 5 Lightweight Theme
│   └── nextjs-app-router/     # Next.js 14 App Router + Server Components
```

### 1. React + Tailwind CSS Starter
```bash
cd storefronts/react-tailwind
npm install && npm run dev
```

### 2. Vue 3 + Tailwind CSS Starter
```bash
cd storefronts/vue-tailwind
npm install && npm run dev
```

### 3. Bootstrap 5 Zero-Build HTML5 Template
Simply open `storefronts/bootstrap5/index.html` in any web browser or serve it directly via Nginx/Apache.

---

## 🧩 Dynamic Extension & Plugin Architecture

SELLER Core features an extensible plugin lifecycle. Plugins can hook into core application events, extend admin navigation menus, inject payment gateways, and trigger third-party API webhooks automatically.

```
                  ┌─────────────────────────────────────────┐
                  │            SELLER CORE API              │
                  │   Laravel 11 / PHP 8.2+ Event Engine    │
                  └────────────────────┬────────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│ Stripe & PayPal  │         │   DHL Express    │         │ Multi-AI Engine  │
│ Payment Gateways │         │ Shipping & Rates │         │ Gemini/OpenAI/Cl │
└──────────────────┘         └──────────────────┘         └──────────────────┘
```

### Included Out-of-the-Box Plugins:
1. **Stripe Gateway Integration**: Credit cards, Apple Pay, Google Pay, and webhook event listeners (`payment_intent.succeeded`, `charge.refunded`).
2. **PayPal Commerce Platform**: Express Checkout, Pay Later, and global debit/credit processing.
3. **DHL Express Logistics**: Live real-time shipping rate calculator, zip code distance mapping, and automatic commercial waybill/packing slip printing.
4. **Popular Multi-AI Commerce Copilot**: Built-in adapter for **Google Gemini 2.5 Flash**, **OpenAI GPT-4o**, and **Anthropic Claude 3.5** to generate SEO product titles, automated descriptions, and customer support responses.

---

## 💻 Developer Guide: Building Custom Plugins

Developing custom plugins for **SELLER Core** requires no core code modifications. Simply create a manifest file (`plugin.json`) or upload it directly through the **Plugin Library UI**:

### Plugin Manifest Specification (`plugin.json`)
```json
{
  "name": "Crypto & Web3 Payment Gateway",
  "slug": "crypto-payment",
  "description": "Accept Bitcoin, Ethereum, and USDT TRC20 with instant webhook confirmation.",
  "author": "EHSANKiNG",
  "version": "1.0.0",
  "category": "payment",
  "iconName": "CreditCard",
  "menuTitle": "Crypto Payments",
  "config": {
    "usdtWalletAddress": "TKPswLQqd2e73UTGJ5prxVXBVo7MTsWedU",
    "network": "TRC20",
    "autoConfirmWebhooks": true
  },
  "hooks": [
    "OrderPlaced",
    "PaymentCaptured"
  ]
}
```

### Event Hooks Lifecycle
- `OrderPlaced`: Dispatched immediately when a customer initiates checkout.
- `PaymentProcessed`: Executed upon payment provider verification.
- `OrderShipped`: Invokes shipping label generation and parcel tracking dispatch.
- `ProductCreated`: Fires AI metadata auto-enrichment processes.

---

## 🏛️ Technical Stack & Architectural Standards

| Tier | Technology | Key Architectural Benefits |
| :--- | :--- | :--- |
| **Backend Core** | **Laravel 11 (PHP 8.2+)** | Repository-Service Pattern, PSR-12, Strict Static Typing |
| **Database Engine** | **PostgreSQL** | JSONB Dynamic Attribute Storage for zero-migration product custom fields |
| **API Transport** | **RESTful JSON Resources** | Sub-30ms response times, CORS secured, API Rate Limited |
| **Admin Control Panel** | **React 18 + Vite + Tailwind** | Responsive design, real-time metrics, CSV exporter, invoice printer |

---

## ☕ Support the Free Software Movement / Donations

SELLER Core is developed and maintained independently by **EHSANKiNG** with the goal of keeping enterprise commerce accessible to every human being for free. 

If SELLER Core saved you thousands of dollars in SaaS fees and helped launch your business, consider supporting ongoing development with a crypto donation:

<p align="center">
  <table>
    <tr>
      <th>Network / Asset</th>
      <th>Wallet Address</th>
    </tr>
    <tr>
      <td>🟢 <strong>Tether (USDT - TRC20)</strong></td>
      <td><code>TKPswLQqd2e73UTGJ5prxVXBVo7MTsWedU</code></td>
    </tr>
    <tr>
      <td>🔴 <strong>TRON (TRX)</strong></td>
      <td><code>TKPswLQqd2e73UTGJ5prxVXBVo7MTsWedU</code></td>
    </tr>
  </table>
</p>

---

## ⚖️ Legal Disclaimer & Terms of Use

```text
LEGAL DISCLAIMER OF WARRANTY AND LIMITATION OF LIABILITY:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. 

IN NO EVENT SHALL THE AUTHOR ("EHSANKiNG") OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

STORE MANAGERS, DEVELOPERS, AND MERCHANTS ARE SOLELY RESPONSIBLE FOR COMPLYING WITH ALL
APPLICABLE LOCAL E-COMMERCE LAWS, TAXATION STATUTES, CONSUMER PROTECTION ACTS, AND PAYMENT
CARD INDUSTRY DATA SECURITY STANDARDS (PCI-DSS) WITHIN THEIR RESPECTIVE JURISDICTIONS.
```

---

## 📜 License & Community

- **Creator & Principal Maintainer**: **EHSANKiNG** ([GitHub Profile](https://github.com/ehsanking))
- **Official Repository**: [ehsanking/seller](https://github.com/ehsanking/seller)
- **License**: MIT License — Free for commercial and private use forever.

<p align="center">
  <sub>Built with passion for the global open-source community by <strong>EHSANKiNG</strong>.</sub>
</p>
