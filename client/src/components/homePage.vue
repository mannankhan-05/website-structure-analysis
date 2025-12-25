<template>
  <div
    class="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30 font-sans"
  >
    <!-- Navbar -->
    <nav
      class="border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50"
    >
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-7 flex items-center justify-between"
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

    <!-- Hero Section -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
      <div class="text-center space-y-8 max-w-3xl mx-auto">
        <h1
          class="text-5xl md:text-7xl font-extrabold tracking-tight text-balance leading-[1.1]"
        >
          Visualize your website's
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400"
            >structure</span
          >
        </h1>

        <p
          class="text-lg md:text-xl text-slate-400 text-pretty max-w-2xl mx-auto leading-relaxed"
        >
          Deep-dive into your website structure. Get actionable insights to
          improve semantic markup, dom structure, and content organization.
        </p>

        <!-- Input Section -->
        <div class="mt-12 relative max-w-xl mx-auto group">
          <div
            class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"
          ></div>
          <form
            @submit.prevent="handleSubmit"
            class="relative flex flex-col sm:flex-row gap-3 bg-slate-900 p-2 rounded-2xl border border-slate-800 shadow-2xl"
          >
            <div class="relative flex-1 flex items-center">
              <Globe class="absolute left-4 w-5 h-5 text-slate-500" />
              <input
                v-model="url"
                type="url"
                placeholder="https://example.com"
                required
                class="w-full bg-transparent border-none text-white pl-12 pr-4 py-3 rounded-xl focus:ring-0 placeholder:text-slate-600"
              />
            </div>
            <button
              type="submit"
              :disabled="isLoading"
              class="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/50 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95"
            >
              <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
              <Search v-else class="w-5 h-5" />
              {{ isLoading ? "Analyzing..." : "Analyze" }}
            </button>
          </form>
        </div>

        <!-- Loading State -->
        <div
          v-if="isLoading || result"
          class="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
          <div
            v-if="isLoading"
            class="p-12 border border-dashed border-slate-800 rounded-3xl bg-slate-900/20"
          >
            <div class="flex flex-col items-center gap-4">
              <div class="relative w-16 h-16">
                <div
                  class="absolute inset-0 border-4 border-blue-500/20 rounded-full"
                ></div>
                <div
                  class="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"
                ></div>
              </div>
              <p
                class="text-slate-400 font-medium animate-pulse text-sm uppercase tracking-widest"
              >
                Scanning structure nodes...
              </p>
            </div>
          </div>

          <div v-else-if="result" class="space-y-8 text-left">
            <!-- Header Section -->
            <div
              class="p-8 border border-slate-800 rounded-3xl bg-slate-900/50 backdrop-blur-sm shadow-2xl"
            >
              <div
                class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8"
              >
                <div>
                  <h2 class="text-2xl font-bold flex items-center gap-2 mb-2">
                    <BarChart3 class="w-7 h-7 text-blue-400" />
                    Analysis Results
                  </h2>
                  <p class="text-slate-400 text-sm font-mono">
                    {{ result.analysis.url }}
                  </p>
                </div>
                <div
                  class="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800"
                >
                  <div class="text-right">
                    <p
                      class="text-xs text-slate-500 uppercase font-bold tracking-wider"
                    >
                      Structure Score
                    </p>
                    <p class="text-3xl font-mono text-blue-400">
                      {{ result.analysis.overall_structure_score }}
                      <span class="text-lg text-slate-600">/100</span>
                    </p>
                  </div>
                  <div
                    :v-model="result.analysis.overall_structure_score"
                    class="w-12 h-12 rounded-full border-4 border-slate-800 flex items-center justify-center relative"
                  ></div>
                </div>
              </div>

              <!-- Summary Section -->
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-800/50"
              >
                <div class="space-y-4">
                  <h3
                    class="text-sm font-bold uppercase tracking-widest text-slate-500"
                  >
                    Overall Assessment
                  </h3>
                  <p class="text-slate-300 leading-relaxed">
                    {{ result.analysis.summary.overall_assessment }}
                  </p>
                </div>
                <div class="space-y-6">
                  <div>
                    <h3
                      class="text-sm font-bold uppercase tracking-widest text-slate-500 mb-3"
                    >
                      Primary Strengths
                    </h3>
                    <ul class="space-y-2">
                      <li
                        v-for="strength in result.analysis.summary
                          .primary_strengths"
                        :key="strength"
                        class="flex items-start gap-2 text-sm text-emerald-400"
                      >
                        <CheckCircle2 class="w-4 h-4 mt-0.5 shrink-0" />
                        {{ strength }}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3
                      class="text-sm font-bold uppercase tracking-widest text-slate-500 mb-3"
                    >
                      Primary Weaknesses
                    </h3>
                    <ul class="space-y-2">
                      <li
                        v-for="weakness in result.analysis.summary
                          .primary_weaknesses"
                        :key="weakness"
                        class="flex items-start gap-2 text-sm text-rose-400"
                      >
                        <XCircle class="w-4 h-4 mt-0.5 shrink-0" />
                        {{ weakness }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Detailed Metrics -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="(metric, key) in {
                  'Semantic Markup': {
                    ...result.analysis.semantic_markup,
                    icon: FileCode,
                    color: 'text-blue-400',
                  },
                  'DOM Structure': {
                    ...result.analysis.dom_structure,
                    icon: Layers,
                    color: 'text-purple-400',
                  },
                  'Script Dependency': {
                    ...result.analysis.script_dependency,
                    icon: Zap,
                    color: 'text-amber-400',
                  },
                }"
                :key="key"
                class="p-6 border border-slate-800 rounded-2xl bg-slate-900/30"
              >
                <div class="flex items-center gap-3 mb-4">
                  <component
                    :is="metric.icon"
                    class="w-5 h-5"
                    :class="metric.color"
                  />
                  <h3 class="font-bold">{{ key }}</h3>
                </div>

                <!-- Semantic Quality / Hierarchy Clarity / Dependency Level Badges -->
                <div class="mb-3">
                  <span
                    v-if="metric.semantic_quality"
                    class="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                    :class="
                      metric.semantic_quality === 'good'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-amber-500/10 text-amber-400'
                    "
                  >
                    {{ metric.semantic_quality }} Quality
                  </span>
                  <div v-else-if="metric.hierarchy_clarity" class="flex gap-2">
                    <span
                      class="text-[10px] text-slate-500 uppercase font-bold tracking-widest"
                      >Hierarchy:</span
                    >
                    <span
                      class="text-[10px] text-blue-400 uppercase font-bold"
                      >{{ metric.hierarchy_clarity }}</span
                    >
                  </div>
                  <span
                    v-else-if="metric.dependency_level"
                    class="text-[10px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider"
                  >
                    {{ metric.dependency_level }} dependency
                  </span>
                </div>

                <!-- Issues List or Rendering Risk Text -->
                <ul v-if="metric.issues" class="space-y-2">
                  <li
                    v-for="issue in metric.issues"
                    :key="issue"
                    class="text-xs text-slate-400 flex gap-2"
                  >
                    <span class="text-amber-500">•</span> {{ issue }}
                  </li>
                </ul>
                <p
                  v-else-if="metric.rendering_risk"
                  class="text-xs text-slate-400 leading-relaxed"
                >
                  {{ metric.rendering_risk }}
                </p>
              </div>
            </div>

            <!-- Recommendations -->
            <div
              class="p-8 border border-slate-800 rounded-3xl bg-blue-600/5 overflow-hidden relative"
            >
              <div class="absolute top-0 right-0 p-8 opacity-5">
                <ShieldCheck class="w-32 h-32 text-blue-400" />
              </div>
              <h3 class="text-lg font-bold flex items-center gap-2 mb-6">
                <AlertTriangle class="w-5 h-5 text-blue-400" />
                Actionable Recommendations
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="rec in result.analysis.recommendations"
                  :key="rec.recommendation"
                  class="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800"
                >
                  <div
                    class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0"
                  >
                    <CheckCircle2 class="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p
                      class="text-[10px] text-blue-500 font-bold uppercase tracking-widest mb-1"
                    >
                      {{ rec.category }}
                    </p>
                    <p class="text-sm text-slate-300">
                      {{ rec.recommendation }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import {
  LayoutGrid,
  Globe,
  Search,
  Loader2,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  XCircle,
  FileCode,
  Layers,
  Zap,
} from "lucide-vue-next";
import axios from "axios";

export default {
  name: "HomePage",

  components: {
    LayoutGrid,
    Globe,
    Search,
    Loader2,
    BarChart3,
    CheckCircle2,
    AlertTriangle,
    ShieldCheck,
    XCircle,
    FileCode,
    Layers,
    Zap,
  },

  data() {
    return {
      url: "",
      isLoading: false,
      result: null,
    };
  },

  methods: {
    async handleSubmit() {
      if (!this.url) return;

      this.isLoading = true;
      this.result = null;

      try {
        const response = await axios.post(`http://localhost:5000/api/analyze`, {
          url: this.url,
        });

        this.result = response.data;
        console.log(this.result);

        console.log("[v0] Analysis complete for:", this.url);
      } catch (error) {
        console.log("[v0] Error during analysis:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style>
/* @import "tailwindcss"; */

body {
  background-color: #020617; /* slate-950 */
}
</style>
