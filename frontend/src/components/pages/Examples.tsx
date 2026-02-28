'use client';

import { useState } from 'react';
import {
  CATEGORY_INFO,
  DISSERTATION_EXAMPLES,
  EXAMPLES_BY_CATEGORY,
  type ExampleCategory,
} from '@/data/dissertation-examples';
import { FAMOUS_EXAMPLES } from '@/utils/physics-interpretations';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import Card from '../ui/Card';
import DissertationExampleCard from './examples/DissertationExampleCard';
import LegacyExampleCard from './examples/LegacyExampleCard';

const Examples = () => {
  const [selectedCategory, setSelectedCategory] = useState<ExampleCategory | 'all'>('all');
  const [showLegacyExamples, setShowLegacyExamples] = useState(false);

  const categories = Object.keys(CATEGORY_INFO) as ExampleCategory[];

  const examplesToShow =
    selectedCategory === 'all'
      ? DISSERTATION_EXAMPLES
      : EXAMPLES_BY_CATEGORY[selectedCategory] || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="text-sm font-mono bg-blue-100 text-blue-800 px-3 py-1 rounded">
              From 2021 Master&apos;s Dissertation
            </span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Complete Example Catalog</h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Every figure and calculation from &quot;A Python Library for Group Theory Calculations
            in Particle Physics&quot; by Rafael Sarate
          </p>
          <div className="mt-4 text-sm text-slate-500">
            {DISSERTATION_EXAMPLES.length} examples across {categories.length} categories
          </div>
        </div>

        {/* Info Alert */}
        <Alert className="mb-8">
          <div className="text-sm space-y-2">
            <div>
              <strong>🎓 About these examples:</strong>
            </div>
            <div>
              Each card corresponds to a specific figure or calculation from the dissertation.
              Examples are organized by topic, with page numbers and section references for easy
              cross-referencing. Click &quot;Calculate&quot; on working examples, or &quot;Coming
              Soon&quot; for features in development.
            </div>
            <div className="text-xs text-slate-600 mt-2">
              ✅ = Working now | 🚧 = In development (see FEATURE_ROADMAP.md)
            </div>
          </div>
        </Alert>

        {/* Category Navigation */}
        <div className="mb-8 space-y-4">
          <div className="text-sm font-semibold text-slate-700">Browse by Category:</div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All Examples ({DISSERTATION_EXAMPLES.length})
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
              >
                {CATEGORY_INFO[cat].icon} {CATEGORY_INFO[cat].title} (
                {EXAMPLES_BY_CATEGORY[cat]?.length || 0})
              </Button>
            ))}
          </div>
        </div>

        {/* Selected Category Info */}
        {selectedCategory !== 'all' && (
          <Card className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{CATEGORY_INFO[selectedCategory].icon}</span>
              <div>
                <h2 className="font-bold text-slate-900">
                  {CATEGORY_INFO[selectedCategory].title}
                </h2>
                <p className="text-sm text-slate-600">
                  {CATEGORY_INFO[selectedCategory].description}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Examples Grid */}
        <div className="space-y-6">
          {examplesToShow.map((example) => (
            <DissertationExampleCard key={example.id} example={example} />
          ))}
        </div>

        {examplesToShow.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 text-lg">No examples in this category yet</div>
          </div>
        )}

        {/* Legacy Examples Toggle */}
        <div className="mt-12">
          <button
            type="button"
            onClick={() => setShowLegacyExamples(!showLegacyExamples)}
            className="text-sm text-slate-500 hover:text-slate-700 underline"
          >
            {showLegacyExamples ? 'Hide' : 'Show'} Legacy Physics Examples
          </button>
        </div>

        {showLegacyExamples && (
          <div className="mt-6 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">General Physics Examples</h2>
            {FAMOUS_EXAMPLES.map((example) => (
              <LegacyExampleCard key={example.title} example={example} />
            ))}
          </div>
        )}

        {/* Educational Footer */}
        <Card className="mt-12 p-6 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="space-y-4">
            <div className="text-lg font-bold text-slate-900 text-center">
              📚 How to Use This Catalog
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong className="text-slate-900">For Students:</strong>
                <p className="text-slate-700 mt-1">
                  Follow the dissertation sections in order: start with irrep construction (3.2),
                  then move to symmetry breaking (3.4), and finish with GUT applications (Section
                  4).
                </p>
              </div>
              <div>
                <strong className="text-slate-900">For Researchers:</strong>
                <p className="text-slate-700 mt-1">
                  Jump to specific examples using figure numbers. Benchmark calculations (Appendix
                  B) validate computational accuracy against published results.
                </p>
              </div>
            </div>
            <div className="text-center text-xs text-slate-600 pt-3 border-t border-slate-300">
              Full dissertation available at UFRGS Digital Repository (2021)
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Examples;
