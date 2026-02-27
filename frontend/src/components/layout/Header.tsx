import { Link } from 'react-router-dom'
import { Atom } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Atom className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">
            Group Theory Calculator
          </span>
        </Link>

        <div className="flex space-x-6">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Home
          </Link>
          <Link
            to="/calculator"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Calculator
          </Link>
          <a
            href="https://github.com/your-username/group-theory-calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            GitHub
          </a>
        </div>
      </nav>
    </header>
  )
}
