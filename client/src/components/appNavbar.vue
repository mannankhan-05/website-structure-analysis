<template>
  <nav
    class="border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50"
  >
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
    >
      <div class="flex items-center gap-2">
        <div
          class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"
        >
          <LayoutGrid class="w-5 h-5 text-white" />
        </div>
        <span class="text-xl font-bold tracking-tight">Structura</span>
      </div>
      <div class="hidden md:flex items-center gap-8 text-sm font-medium">
        <a href="#" class="text-blue-400 hover:text-white transition-colors"
          >Features</a
        >
        <a href="#" class="text-blue-400 hover:text-white transition-colors"
          >Pricing</a
        >
        <a href="#" class="text-blue-400 hover:text-white transition-colors"
          >Docs</a
        >
      </div>
      <button
        class="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all"
      >
        Sign In
      </button>
    </div>
  </nav>
</template>

<script>
import { LayoutGrid } from "lucide-vue-next";
export default {
  components: {
    LayoutGrid,
  },
};
</script>

<style></style>
