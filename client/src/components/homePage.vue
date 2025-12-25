<template>
  <div
    class="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30 font-sans"
  >
    <!-- Navbar -->
    <appNavbar />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
      <div class="text-center space-y-8 max-w-3xl mx-auto">
        <!-- Hero Section -->
        <heroSection />

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
                type="text"
                placeholder="https://example.com"
                required
                class="w-full bg-transparent border-none text-white pl-12 pr-4 py-3 rounded-xl focus:ring-0 placeholder:text-slate-600 outline-none"
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

        <!-- Error State -->
        <div
          v-if="error"
          class="mt-8 p-4 border border-red-500 rounded-xl bg-red-500/10"
        >
          <p class="font-semibold text-red-400">Error:</p>
          <p class="text-red-300">{{ error }}</p>
        </div>

        <!-- Loading State -->
        <div
          v-if="isLoading"
          class="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
          <div
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
        </div>

        <!-- Results Section -->
        <div
          v-else-if="result && result.success"
          class="mt-16 space-y-8 text-left"
        >
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
                <p class="text-slate-400 text-sm font-mono">{{ result.url }}</p>
              </div>
              <div
                class="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800"
              >
                <div class="text-right">
                  <p
                    class="text-xs text-slate-500 uppercase font-bold tracking-wider"
                  >
                    Overall Score
                  </p>
                  <p
                    class="text-3xl font-mono"
                    :class="getScoreColor(analysis.overall_structure_score)"
                  >
                    {{ analysis.overall_structure_score }}
                    <span class="text-lg text-slate-600">/100</span>
                  </p>
                </div>
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
                  {{ analysis.summary.overall_assessment }}
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
                      v-for="(strength, index) in analysis.summary
                        .primary_strengths"
                      :key="'strength-' + index"
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
                      v-for="(weakness, index) in analysis.summary
                        .primary_weaknesses"
                      :key="'weakness-' + index"
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

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Semantic Markup Card -->
            <div
              class="p-6 border border-slate-800 rounded-2xl bg-slate-900/30"
            >
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <FileCode class="w-5 h-5 text-blue-400" />
                  <h3 class="font-bold">Semantic Markup</h3>
                </div>
                <div
                  class="px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg"
                >
                  <span
                    class="text-xs font-mono"
                    :class="
                      getScoreColor(
                        analysis.semantic_markup.semantic_markup_score
                      )
                    "
                  >
                    {{ analysis.semantic_markup.semantic_markup_score }}
                  </span>
                </div>
              </div>

              <!-- Semantic Quality -->
              <div class="mb-3">
                <span
                  class="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                  :class="
                    getQualityBadgeClass(
                      analysis.semantic_markup.semantic_quality
                    )
                  "
                >
                  {{ analysis.semantic_markup.semantic_quality }} Quality
                </span>
              </div>
              <div class="mb-3">
                <p class="text-xs text-slate-500 mb-2">Elements Used:</p>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="(element, index) in analysis.semantic_markup
                      .semantic_elements_used"
                    :key="'element-' + index"
                    class="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[10px] font-mono"
                  >
                    {{ element }}
                  </span>
                </div>
              </div>
              <ul
                v-if="
                  analysis.semantic_markup.issues &&
                  analysis.semantic_markup.issues.length
                "
                class="space-y-2"
              >
                <li
                  v-for="(issue, index) in analysis.semantic_markup.issues"
                  :key="'sem-issue-' + index"
                  class="text-xs text-slate-400 flex gap-2"
                >
                  <span class="text-amber-500">•</span> {{ issue }}
                </li>
              </ul>
            </div>

            <!-- DOM Structure Card -->
            <div
              class="p-6 border border-slate-800 rounded-2xl bg-slate-900/30"
            >
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <Layers class="w-5 h-5 text-purple-400" />
                  <h3 class="font-bold">DOM Structure</h3>
                </div>
                <div
                  class="px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg"
                >
                  <span
                    class="text-xs font-mono"
                    :class="
                      getScoreColor(analysis.dom_structure.dom_structure_score)
                    "
                  >
                    {{ analysis.dom_structure.dom_structure_score }}
                  </span>
                </div>
              </div>
              <div class="mb-3 space-y-2">
                <div class="flex gap-2 items-center">
                  <span
                    class="text-[10px] text-slate-500 uppercase font-bold tracking-widest"
                    >Hierarchy:</span
                  >
                  <span
                    class="text-[10px] uppercase font-bold"
                    :class="
                      getQualityBadgeClass(
                        analysis.dom_structure.hierarchy_clarity
                      )
                    "
                  >
                    {{ analysis.dom_structure.hierarchy_clarity }}
                  </span>
                </div>
                <div class="flex gap-2 items-center">
                  <span
                    class="text-[10px] text-slate-500 uppercase font-bold tracking-widest"
                    >Nesting:</span
                  >
                  <span
                    class="text-[10px] uppercase font-bold"
                    :class="
                      getQualityBadgeClass(
                        analysis.dom_structure.nesting_quality
                      )
                    "
                  >
                    {{ analysis.dom_structure.nesting_quality }}
                  </span>
                </div>
              </div>
              <ul
                v-if="
                  analysis.dom_structure.issues &&
                  analysis.dom_structure.issues.length
                "
                class="space-y-2"
              >
                <li
                  v-for="(issue, index) in analysis.dom_structure.issues"
                  :key="'dom-issue-' + index"
                  class="text-xs text-slate-400 flex gap-2"
                >
                  <span class="text-amber-500">•</span> {{ issue }}
                </li>
              </ul>
            </div>

            <!-- Content Organization Card -->
            <div
              class="p-6 border border-slate-800 rounded-2xl bg-slate-900/30"
            >
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <Database class="w-5 h-5 text-teal-400" />
                  <h3 class="font-bold">Content Organization</h3>
                </div>
                <div
                  class="px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg"
                >
                  <span
                    class="text-xs font-mono"
                    :class="
                      getScoreColor(
                        analysis.content_organization.content_organization_score
                      )
                    "
                  >
                    {{
                      analysis.content_organization.content_organization_score
                    }}
                  </span>
                </div>
              </div>
              <div class="mb-3">
                <span
                  class="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                  :class="
                    getQualityBadgeClass(
                      analysis.content_organization.heading_hierarchy_quality
                    )
                  "
                >
                  {{ analysis.content_organization.heading_hierarchy_quality }}
                  Hierarchy
                </span>
              </div>
              <p class="text-xs text-slate-400 leading-relaxed">
                {{ analysis.content_organization.content_grouping_assessment }}
              </p>
            </div>

            <!-- Metadata Card -->
            <div
              class="p-6 border border-slate-800 rounded-2xl bg-slate-900/30"
            >
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <Activity class="w-5 h-5 text-cyan-400" />
                  <h3 class="font-bold">Metadata</h3>
                </div>
                <div
                  class="px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg"
                >
                  <span
                    class="text-xs font-mono"
                    :class="getScoreColor(analysis.metadata.meta_quality_score)"
                  >
                    {{ analysis.metadata.meta_quality_score }}
                  </span>
                </div>
              </div>
              <div class="mb-3">
                <span
                  class="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                  :class="getQualityBadgeClass(analysis.metadata.meta_quality)"
                >
                  {{ analysis.metadata.meta_quality }}
                </span>
              </div>
              <ul
                v-if="
                  analysis.metadata.issues && analysis.metadata.issues.length
                "
                class="space-y-2"
              >
                <li
                  v-for="(issue, index) in analysis.metadata.issues"
                  :key="'meta-issue-' + index"
                  class="text-xs text-slate-400 flex gap-2"
                >
                  <span class="text-amber-500">•</span> {{ issue }}
                </li>
              </ul>
            </div>

            <!-- Script Dependency Card -->
            <div
              class="p-6 border border-slate-800 rounded-2xl bg-slate-900/30"
            >
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <Zap class="w-5 h-5 text-amber-400" />
                  <h3 class="font-bold">Script Dependency</h3>
                </div>
                <div
                  class="px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg"
                >
                  <span
                    class="text-xs font-mono"
                    :class="
                      getScoreColor(
                        analysis.script_dependency.script_dependency_score
                      )
                    "
                  >
                    {{ analysis.script_dependency.script_dependency_score }}
                  </span>
                </div>
              </div>
              <div class="mb-3">
                <span
                  class="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                  :class="
                    getDependencyBadgeClass(
                      analysis.script_dependency.dependency_level
                    )
                  "
                >
                  {{ analysis.script_dependency.dependency_level }} dependency
                </span>
              </div>
              <p class="text-xs text-slate-400 leading-relaxed">
                {{ analysis.script_dependency.rendering_risk }}
              </p>
            </div>

            <!-- Accessibility Signals Card -->
            <div
              class="p-6 border border-slate-800 rounded-2xl bg-slate-900/30"
            >
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <Eye class="w-5 h-5 text-emerald-400" />
                  <h3 class="font-bold">Accessibility</h3>
                </div>
                <div
                  class="px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg"
                >
                  <span
                    class="text-xs font-mono"
                    :class="
                      getScoreColor(
                        analysis.accessibility_signals.accessibility_score
                      )
                    "
                  >
                    {{ analysis.accessibility_signals.accessibility_score }}
                  </span>
                </div>
              </div>
              <div class="mb-3 space-y-2">
                <div class="flex gap-2 items-center">
                  <span
                    class="text-[10px] text-slate-500 uppercase font-bold tracking-widest"
                    >ARIA:</span
                  >
                  <span
                    class="text-[10px] uppercase font-bold"
                    :class="
                      getQualityBadgeClass(
                        analysis.accessibility_signals.aria_usage
                      )
                    "
                  >
                    {{ analysis.accessibility_signals.aria_usage }}
                  </span>
                </div>
                <div class="flex gap-2 items-center">
                  <span
                    class="text-[10px] text-slate-500 uppercase font-bold tracking-widest"
                    >Alt Text:</span
                  >
                  <span
                    class="text-[10px] uppercase font-bold"
                    :class="
                      getQualityBadgeClass(
                        analysis.accessibility_signals.alt_text_quality
                      )
                    "
                  >
                    {{ analysis.accessibility_signals.alt_text_quality }}
                  </span>
                </div>
              </div>
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
                v-for="(rec, index) in analysis.recommendations"
                :key="'rec-' + index"
                class="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800"
              >
                <div
                  class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  :class="getImpactBgClass(rec.impact)"
                >
                  <CheckCircle2
                    class="w-4 h-4"
                    :class="getImpactTextClass(rec.impact)"
                  />
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-1">
                    <p
                      class="text-[10px] font-bold uppercase tracking-widest"
                      :class="getImpactTextClass(rec.impact)"
                    >
                      {{ rec.category }}
                    </p>
                    <span
                      class="text-[9px] px-1.5 py-0.5 rounded uppercase font-bold"
                      :class="getImpactBadgeClass(rec.impact)"
                    >
                      {{ rec.impact }}
                    </span>
                  </div>
                  <p class="text-sm text-slate-300">{{ rec.recommendation }}</p>
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
import axios from "axios";
import appNavbar from "@/components/appNavbar.vue";
import heroSection from "@/components/heroSection.vue";
import {
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
  Eye,
  Activity,
  Database,
} from "lucide-vue-next";

export default {
  name: "HomePage",

  components: {
    appNavbar,
    heroSection,
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
    Activity,
    Eye,
    Database,
  },

  data() {
    return {
      url: "",
      isLoading: false,
      result: null,
      error: null,
    };
  },

  computed: {
    analysis() {
      return this.result?.analysis || null;
    },
  },

  methods: {
    async handleSubmit() {
      if (!this.url) return;

      this.isLoading = true;
      this.error = null;
      this.result = null;

      try {
        const response = await axios.post("http://localhost:5000/api/analyze", {
          url: this.url,
        });

        if (!response.data.success) {
          throw new Error(response.data.error || "Analysis failed");
        }

        this.result = response.data;
        console.log("[Analysis Complete]", this.result);
      } catch (err) {
        this.error =
          err.response?.data?.error ||
          err.message ||
          "An error occurred during analysis";
        console.error("[Analysis Error]", err);
      } finally {
        this.isLoading = false;
      }
    },

    getScoreColor(score) {
      if (score >= 80) return "text-emerald-400";
      if (score >= 60) return "text-blue-400";
      if (score >= 40) return "text-amber-400";
      return "text-rose-400";
    },

    getQualityBadgeClass(quality) {
      if (!quality) return "bg-slate-500/10 text-slate-400";
      const qualityType = quality.toLowerCase();
      if (
        qualityType === "excellent" ||
        qualityType === "good" ||
        qualityType === "clear"
      ) {
        return "bg-emerald-500/10 text-emerald-400";
      }
      if (
        qualityType === "moderate" ||
        qualityType === "partial" ||
        qualityType === "minimal"
      ) {
        return "bg-amber-500/10 text-amber-400";
      }
      return "bg-rose-500/10 text-rose-400";
    },

    getDependencyBadgeClass(level) {
      if (!level) return "bg-slate-500/10 text-slate-400";
      const dependencyLevel = level.toLowerCase();
      if (dependencyLevel === "low")
        return "bg-emerald-500/10 text-emerald-400";
      if (dependencyLevel === "moderate")
        return "bg-amber-500/10 text-amber-400";
      return "bg-rose-500/10 text-rose-400";
    },

    getImpactBgClass(impact) {
      if (impact === "high") return "bg-rose-500/10";
      if (impact === "medium") return "bg-amber-500/10";
      return "bg-blue-500/10";
    },

    getImpactTextClass(impact) {
      if (impact === "high") return "text-rose-400";
      if (impact === "medium") return "text-amber-400";
      return "text-blue-400";
    },

    getImpactBadgeClass(impact) {
      if (impact === "high") return "bg-rose-500/20 text-rose-400";
      if (impact === "medium") return "bg-amber-500/20 text-amber-400";
      return "bg-blue-500/20 text-blue-400";
    },
  },
};
</script>

<style scoped>
body {
  background-color: #020617;
}

input:focus {
  outline: none;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
