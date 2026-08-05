# SELLER React + Tailwind CSS Starter Storefront

This is an official starter storefront boilerplate built with **React 18**, **Vite**, and **Tailwind CSS**, designed to connect directly to **SELLER Core Headless Engine** (`ehsanking/seller`).

## ⚡ Quick Start

```bash
# 1. Navigate to directory
cd storefronts/react-tailwind

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

## 🌐 Fetching Products from SELLER Headless REST API

In React, fetch catalog data directly from the `/api/products` endpoint:

```jsx
import { useEffect, useState } from 'react';

export default function Catalog() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(console.error);
  }, []);

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.title}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

## 🛠️ Created by EHSANKiNG — 100% Free Forever
For complete docs and core API specifications, visit [ehsanking/seller](https://github.com/ehsanking/seller).
