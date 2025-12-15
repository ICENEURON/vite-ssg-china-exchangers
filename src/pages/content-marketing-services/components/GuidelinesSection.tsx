
import { FileText, XCircle, CheckCircle } from "lucide-react"

export function GuidelinesSection() {
    return (
        <section id="guidelines" className="py-24 bg-background">
            <div className="container px-4 mx-auto max-w-5xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Submission Standards</h2>
                    <p className="text-muted-foreground">We maintain a high bar for quality to ensure our audience trusts your content.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                    {/* The "YES" Column */}
                    <div className="rounded-2xl border bg-card p-1">
                        <div className="bg-primary/5 rounded-xl p-8 h-full">
                            <div className="flex items-center gap-3 mb-6">
                                <CheckCircle className="w-6 h-6 text-green-500" />
                                <h3 className="font-bold text-xl">Accepted</h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">File Formats</span>
                                    <div className="mt-2 flex gap-3">
                                        <div className="flex items-center gap-2 px-4 py-2 bg-background border rounded-lg shadow-sm">
                                            <FileText className="w-4 h-4 text-blue-500" />
                                            <span className="font-mono font-bold">.DOC</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2 bg-background border rounded-lg shadow-sm">
                                            <FileText className="w-4 h-4 text-blue-500" />
                                            <span className="font-mono font-bold">.DOCX</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Topics</span>
                                    <ul className="mt-2 space-y-2 text-sm text-foreground/80">
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"></span>
                                            Technical Analysis (e.g. Design parameters)
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"></span>
                                            Maintenance & Troubleshooting Guides
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"></span>
                                            Real-world Case Studies
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* The "NO" Column */}
                    <div className="rounded-2xl border bg-card p-1">
                        <div className="bg-muted/30 rounded-xl p-8 h-full">
                            <div className="flex items-center gap-3 mb-6">
                                <XCircle className="w-6 h-6 text-red-500" />
                                <h3 className="font-bold text-xl">Rejected</h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">File Formats</span>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        PDF, TXT, Pages, or Google Doc links are <span className="text-red-500 font-bold">NOT</span> accepted. We need editable files for formatting.
                                    </p>
                                </div>

                                <div>
                                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Content</span>
                                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                                            Pure marketing fluff / "Salesy" language
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                                            Press releases
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                                            AI-generated low-quality text
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
