import { Link } from 'react-router-dom'
import { Atom, Zap, Users } from 'lucide-react'

export function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Group Theory Calculator
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Interactive web tool for Lie algebra calculations and symmetry breaking
          in Grand Unified Theories. Zero installation required.
        </p>
        <Link
          to="/calculator"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          Start Calculating
        </Link>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 py-16">
        <div className="text-center p-6">
          <div className="flex justify-center mb-4">
            <Atom className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Interactive Dynkin Diagrams</h3>
          <p className="text-gray-600">
            Click nodes to break symmetry and visualize group decomposition in real-time
          </p>
        </div>

        <div className="text-center p-6">
          <div className="flex justify-center mb-4">
            <Zap className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Fast Computations</h3>
          <p className="text-gray-600">
            Powered by SageMath for rapid tensor product decompositions and irrep construction
          </p>
        </div>

        <div className="text-center p-6">
          <div className="flex justify-center mb-4">
            <Users className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Educational Focus</h3>
          <p className="text-gray-600">
            Perfect for students learning GUTs and researchers needing quick calculations
          </p>
        </div>
      </div>

      {/* Example */}
      <div className="bg-white rounded-lg shadow-md p-8 my-16">
        <h2 className="text-3xl font-bold mb-4">Example: SO(10) GUT</h2>
        <p className="text-gray-700 mb-6">
          Breaking Grand Unified Theory SO(10) down to the Standard Model:
        </p>
        <div className="bg-gray-50 p-6 rounded font-mono text-sm">
          <div className="mb-2">SO(10) → SU(5) ⊗ U(1)</div>
          <div className="mb-2 ml-8">→ SU(3) ⊗ SU(2) ⊗ U(1) ⊗ U(1)</div>
          <div className="ml-16">→ SU(3) ⊗ SU(2) ⊗ U(1)ʏ</div>
        </div>
        <p className="text-gray-600 mt-4 text-sm">
          The spinor <strong>16</strong> representation decomposes to Standard Model fermions
        </p>
      </div>

      {/* CTA */}
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold mb-4">Ready to explore?</h2>
        <p className="text-gray-600 mb-6">
          Start with simple SU(3) calculations or jump into GUT symmetry breaking
        </p>
        <Link
          to="/calculator"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Open Calculator
        </Link>
      </div>
    </div>
  )
}
