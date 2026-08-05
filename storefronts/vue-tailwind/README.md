# SELLER Vue 3 + Tailwind CSS Starter Storefront

This is an official starter storefront boilerplate built with **Vue 3 (Composition API)**, **Vite**, and **Tailwind CSS**, designed to connect directly to **SELLER Core Headless Engine** (`ehsanking/seller`).

## ⚡ Quick Start

```bash
# 1. Navigate to directory
cd storefronts/vue-tailwind

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

## 🌐 Fetching Products from SELLER Headless REST API

In Vue 3 Composition API, fetch catalog data directly from the `/api/products` endpoint:

```vue
<template>
  <div class="grid grid-cols-3 gap-4">
    <div v-for="product in products" :key="product.id" class="p-4 border rounded">
      <h3>{{ product.title }}</h3>
      <p>${{ product.price }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const products = ref([]);

onMounted(async () => {
  const res = await fetch('http://localhost:3000/api/products');
  products.value = await res.json();
});
</script>
```

## 🛠️ Created by EHSANKiNG — 100% Free Forever
For complete docs and core API specifications, visit [ehsanking/seller](https://github.com/ehsanking/seller).
