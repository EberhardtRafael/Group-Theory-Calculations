import { notFound } from "next/navigation";
import Link from "next/link";
import {
	dissertationChapters,
	type DissertationSection,
} from "@/data/dissertation-content";
import { Card } from "@/components/ui";

interface ChapterPageProps {
	params: {
		chapterId: string;
		locale: string;
	};
}

const findChapter = (id: string): DissertationSection | undefined => {
	return dissertationChapters.find((chapter) => chapter.id === id);
};

const ChapterPage = ({ params }: ChapterPageProps) => {
	const chapter = findChapter(params.chapterId);

	if (!chapter) {
		notFound();
	}

	// Find navigation (previous/next chapters)
	const currentIndex = dissertationChapters.findIndex(
		(ch) => ch.id === chapter.id,
	);
	const prevChapter =
		currentIndex > 0 ? dissertationChapters[currentIndex - 1] : null;
	const nextChapter =
		currentIndex < dissertationChapters.length - 1
			? dissertationChapters[currentIndex + 1]
			: null;

	const renderContent = (content: string) => {
		// Split content by paragraphs
		const paragraphs = content.split("\n\n");

		return paragraphs.map((para, index) => {
			// Check for headings (lines starting with ### or **)
			if (para.startsWith("### ")) {
				return (
					<div
						key={`heading-${index}`}
						className="text-2xl font-bold mt-8 mb-4 text-amber-600 dark:text-amber-400"
					>
						{para.replace("### ", "")}
					</div>
				);
			}

			// Check for bold sections
			if (para.startsWith("**") && para.includes("**:")) {
				const [title, ...rest] = para.split("**:");
				return (
					<p key={`para-${index}`} className="mb-4">
						<span className="font-bold text-amber-700 dark:text-amber-300">
							{title.replace(/\*\*/g, "")}:
						</span>
						{rest.join(":")}
					</p>
				);
			}

			// Check for list items
			if (para.trim().startsWith("-") || para.trim().startsWith("•")) {
				const items = para.split("\n").filter((line) => line.trim());
				return (
					<ul key={`list-${index}`} className="list-disc ml-6 mb-4 space-y-2">
						{items.map((item, i) => (
							<li key={`item-${i}`}>
								{item.replace(/^[-•]\s*/, "").trim()}
							</li>
						))}
					</ul>
				);
			}

			// Check for numbered lists
			if (/^\d+\./.test(para.trim())) {
				const items = para.split("\n").filter((line) => line.trim());
				return (
					<ol
						key={`numlist-${index}`}
						className="list-decimal ml-6 mb-4 space-y-2"
					>
						{items.map((item, i) => (
							<li key={`numitem-${i}`}>
								{item.replace(/^\d+\.\s*/, "").trim()}
							</li>
						))}
					</ol>
				);
			}

			// Regular paragraph - check for inline formatting
			let formattedPara = para;

			// Handle bold text (**text**)
			formattedPara = formattedPara.replace(
				/\*\*([^*]+)\*\*/g,
				'<strong class="font-bold text-amber-700 dark:text-amber-300">$1</strong>',
			);

			// Handle subscripts and superscripts (basic)
			formattedPara = formattedPara.replace(/₀|₁|₂|₃|₄|₅|₆|₇|₈|₉/g, (match) => {
				return `<sub>${match}</sub>`;
			});
			formattedPara = formattedPara.replace(/⁰|¹|²|³|⁴|⁵|⁶|⁷|⁸|⁹|⁺|⁻/g, (match) => {
				return `<sup>${match}</sup>`;
			});

			return (
				<p
					key={`para-${index}`}
					className="mb-4 leading-relaxed"
					dangerouslySetInnerHTML={{ __html: formattedPara }}
				/>
			);
		});
	};

	const renderSubsection = (subsection: DissertationSection, level = 0) => {
		const headingClass =
			level === 0
				? "text-2xl font-bold mt-8 mb-4 text-amber-600 dark:text-amber-400"
				: "text-xl font-bold mt-6 mb-3 text-amber-500 dark:text-amber-300";

		return (
			<div key={subsection.id} className="mb-8">
				<div className={headingClass}>
					{subsection.number && (
						<span className="mr-2">{subsection.number}</span>
					)}
					{subsection.title}
				</div>
				<div className="prose prose-sm dark:prose-invert max-w-none">
					{renderContent(subsection.content)}
				</div>

				{/* Render figures if any */}
				{subsection.figures && subsection.figures.length > 0 && (
					<div className="mt-6 space-y-4">
						{subsection.figures.map((figure) => (
							<Card key={figure.id} className="p-4 bg-gray-50 dark:bg-gray-800">
								<div className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">
									Figure {figure.number}
								</div>
								<div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
									{figure.caption}
								</div>
								{figure.description && (
									<div className="text-xs text-gray-500 dark:text-gray-500">
										{figure.description}
									</div>
								)}
								{figure.exampleId && (
									<Link
										href={`/examples#${figure.exampleId}`}
										className="text-xs text-amber-600 dark:text-amber-400 hover:underline mt-2 inline-block"
									>
										→ View interactive example
									</Link>
								)}
							</Card>
						))}
					</div>
				)}

				{/* Recursively render subsections */}
				{subsection.subsections &&
					subsection.subsections.map((sub) => renderSubsection(sub, level + 1))}
			</div>
		);
	};

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			{/* Breadcrumb */}
			<div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
				<Link href="/dissertation" className="hover:text-amber-600">
					Dissertation
				</Link>
				<span className="mx-2">→</span>
				<span className="text-amber-600 dark:text-amber-400">
					{chapter.title}
				</span>
			</div>

			{/* Chapter Title */}
			<div className="mb-8">
				<div className="flex items-start gap-4">
					{chapter.number && (
						<div className="text-5xl font-bold text-amber-600 dark:text-amber-400">
							{chapter.number}
						</div>
					)}
					<div className="flex-1">
						<h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
							{chapter.title}
						</h1>
					</div>
				</div>
			</div>

			{/* Chapter Content */}
			<Card className="p-8 mb-8">
				<div className="prose prose-sm dark:prose-invert max-w-none">
					{renderContent(chapter.content)}
				</div>

				{/* Subsections */}
				{chapter.subsections &&
					chapter.subsections.map((subsection) => renderSubsection(subsection))}
			</Card>

			{/* Navigation */}
			<div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
				<div className="flex-1">
					{prevChapter && (
						<Link
							href={`/dissertation/${prevChapter.id}`}
							className="text-amber-600 dark:text-amber-400 hover:underline"
						>
							← {prevChapter.number && `${prevChapter.number}. `}
							{prevChapter.title}
						</Link>
					)}
				</div>
				<div className="flex-1 text-center">
					<Link
						href="/dissertation"
						className="text-gray-600 dark:text-gray-400 hover:text-amber-600"
					>
						↑ Table of Contents
					</Link>
				</div>
				<div className="flex-1 text-right">
					{nextChapter && (
						<Link
							href={`/dissertation/${nextChapter.id}`}
							className="text-amber-600 dark:text-amber-400 hover:underline"
						>
							{nextChapter.number && `${nextChapter.number}. `}
							{nextChapter.title} →
						</Link>
					)}
				</div>
			</div>
		</div>
	);
};

export default ChapterPage;

// Generate static params for all chapters
export const generateStaticParams = () => {
	return dissertationChapters.map((chapter) => ({
		chapterId: chapter.id,
	}));
};
