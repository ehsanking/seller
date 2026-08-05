<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
    <!-- Header -->
    <header class="max-w-6xl mx-auto flex items-center justify-between pb-6 border-b border-slate-800">
      <div class="flex items-center gap-2">
        <span class="w-3.5 h-3.5 rounded-full bg-emerald-400" />
        <h1 class="text-xl font-bold tracking-tight">SELLER Vue 3 Storefront</h1>
      </div>
      <button class="px-4 py-2 rounded-full bg-emerald-600 text-white font-semibold text-sm">
        Cart ({{ cart.length }})
      </button>
    </header>

    <!-- Hero -->
    <section className="max-w-6xl mx-auto my-8 p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-emerald-950 border border-slate-800 text-center space-y-3">
      <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
        Vue 3 Composition API + Tailwind CSS
      </span>
      <h2 className="text-3xl font-extrabold text-white">Connected to SELLER Headless API</h2>
      <p className="text-sm text-slate-300 max-w-xl mx-auto">
        This Vue 3 application fetches catalog state directly from <code>http://localhost:3000/api/products</code>.
      </p>
    </section>

    <!-- Products Grid -->
    <main class="max-w-6xl mx-auto">
      <div v-if="loading" class="text-center py-12 text-slate-400">Loading catalog from SELLER API...</div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="p in products" :key="p.id" class="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition">
          <img :src="p.image" :alt="p.title" class="h-40 w-full object-cover rounded-lg bg-slate-950" />
          <div>
            <span class="text-xs text-emerald-400 font-semibold uppercase">{{ p.category }}</span>
            <h3 class="text-base font-bold text-white truncate">{{ p.title }}</h3>
          </div>
          <div class="flex items-center justify-between pt-3 border-t border-slate-800">
            <span class="text-lg font-extrabold text-emerald-400">${{ p.price?.toFixed(2) }}</span>
            <button
              @click="addToCart(p)"
              class="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const products = ref([]);
const loading = ref(true);
const cart = ref([]);

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/products');
    products.value = await res.json();
  } catch (err) {
    console.error('Failed to fetch SELLER API products:', err);
  } finally {
    loading.value = false;
  }
});

function addToCart(product) {
  cart.value.push(product);
}
</script>
