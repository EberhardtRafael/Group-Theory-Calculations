import {
	dissertationMetadata,
	dissertationChapters,
} from "@/data/dissertation-content";
import { Card } from "@/components/ui";
import Link from "next/link";

const DissertationPage = () => {

	return (
		<div className="container mx-auto px-4 py-8 max-w-5xl">
			{/* Header */}
			<div className="mb-12 text-center">
				<h1 className="text-4xl font-bold mb-4 text-amber-700 dark:text-amber-500">
					{dissertationMetadata.title}
				</h1>
				<div className="text-lg text-gray-600 dark:text-gray-400 space-y-2">
					<p className="font-semibold">{dissertationMetadata.author}</p>
					<p>{dissertationMetadata.degree}</p>
					<p>{dissertationMetadata.institution}</p>
					<p>{dissertationMetadata.department}</p>
					<p className="text-sm">
						Advisor: {dissertationMetadata.advisor}
					</p>
					<p className="text-sm">{dissertationMetadata.year}</p>
				</div>
			</div>

			{/* Abstract/Introduction */}
			<Card className="mb-8 p-6">
				<h2 className="text-2xl font-bold mb-4 text-amber-600 dark:text-amber-400">
					About This Work
				</h2>
				<div className="prose prose-sm dark:prose-invert max-w-none">
					<p>
						This dissertation presents a user-friendly Python library for
						performing Group Theory calculations in Particle Physics. The
						library handles classical Lie algebras (SU(N), SO(N), Sp(2N)) and
						exceptional algebras (G₂, F₄, E₆, E₇, E₈), providing capabilities
						for:
					</p>
					<ul className="list-disc ml-6 mt-2 space-y-1">
						<li>Building irreducible representations (irreps)</li>
						<li>Calculating tensor products</li>
						<li>Generating Dynkin diagrams</li>
						<li>Analyzing symmetry breaking</li>
						<li>Visualizing multiplet diagrams in quantum number space</li>
					</ul>
					<p className="mt-4">
						The work demonstrates practical applications by showing how the
						Standard Model particles emerge from SO(10) Grand Unified Theory
						through symmetry breaking.
					</p>
				</div>
			</Card>

			{/* Table of Contents */}
			<div className="mb-8">
				<h2 className="text-2xl font-bold mb-6 text-amber-600 dark:text-amber-400">
					Table of Contents
				</h2>
				<div className="space-y-3">
					{dissertationChapters.map((chapter) => (
						<Link
							key={chapter.id}
							href={`/dissertation/${chapter.id}`}
							className="block"
						>
							<Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-amber-500">
								<div className="flex items-start gap-4">
									{chapter.number && (
										<div className="text-3xl font-bold text-amber-600 dark:text-amber-400 min-w-[3rem]">
											{chapter.number}
										</div>
									)}
									<div className="flex-1">
										<div className="text-xl font-semibold mb-2">
											{chapter.title}
										</div>
										{chapter.subsections && (
											<div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
												{chapter.subsections.length} subsection
												{chapter.subsections.length !== 1 ? "s" : ""}
											</div>
										)}
									</div>
								</div>
							</Card>
						</Link>
					))}
				</div>
			</div>

			{/* Quick Links */}
			<Card className="p-6 bg-amber-50 dark:bg-amber-900/20">
				<h2 className="text-xl font-bold mb-4 text-amber-700 dark:text-amber-500">
					Quick Links
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Link
						href="/examples"
						className="text-amber-600 dark:text-amber-400 hover:underline"
					>
						→ Interactive Examples from Dissertation
					</Link>
					<Link
						href="/calculator"
						className="text-amber-600 dark:text-amber-400 hover:underline"
					>
						→ Try the Library (Calculator)
					</Link>
					<Link
						href="/dissertation/theoretical-background"
						className="text-amber-600 dark:text-amber-400 hover:underline"
					>
						→ Theoretical Background
					</Link>
					<Link
						href="/dissertation/real-life-problems"
						className="text-amber-600 dark:text-amber-400 hover:underline"
					>
						→ Applications to Standard Model
					</Link>
				</div>
			</Card>
		</div>
	);
};

export default DissertationPage;
