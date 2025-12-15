
import { Button } from "../../../components/ui/button"
import { Mail, FileText, Camera, Send } from "lucide-react"

export function StepByStepSection() {
    return (
        <section className="py-24 bg-muted/20">
            <div className="container px-4 mx-auto max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">How to Submit an Update</h2>
                    <p className="text-lg text-muted-foreground">
                        Please send an email to our Data Team with the following details.
                    </p>
                </div>

                <div className="bg-card border rounded-3xl p-8 md:p-12 shadow-sm">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary" />
                                <span className="font-semibold text-muted-foreground">Email:</span>
                                <a href="mailto:support@china-heatexchangers.com" className="font-bold hover:text-primary transition-colors">support@china-heatexchangers.com</a>
                            </div>
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-primary" />
                                <span className="font-semibold text-muted-foreground">Subject:</span>
                                <span className="font-mono text-sm bg-muted px-2 py-1 rounded">[Claim Profile] - Your Company Name</span>
                            </div>
                        </div>

                        <Button size="lg" className="shrink-0" asChild>
                            <a href="mailto:support@china-heatexchangers.com?subject=%5BClaim%20Profile%5D%20-%20YOUR%20COMPANY%20NAME">
                                <Send className="w-4 h-4 mr-2" />
                                Send Email
                            </a>
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">1</span>
                                Required Info
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-sm">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                                    <div>
                                        <strong className="block text-foreground">Company Identity</strong>
                                        <span className="text-muted-foreground">Full English Name & Official Website.</span>
                                    </div>
                                </li>
                                <li className="flex gap-3 text-sm">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                                    <div>
                                        <strong className="block text-foreground">Key Contact</strong>
                                        <span className="text-muted-foreground">Name of Export Manager & Direct Email.</span>
                                    </div>
                                </li>
                                <li className="flex gap-3 text-sm">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                                    <div>
                                        <strong className="block text-foreground">Docs</strong>
                                        <span className="text-muted-foreground">Business License (Required) & Valid Certificates.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-xs">2</span>
                                Optional (Recommended)
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-sm">
                                    <Camera className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                                    <div>
                                        <strong className="block text-foreground">High-Res Photos</strong>
                                        <span className="text-muted-foreground">Factory exterior, workshop floor, or key product shots.</span>
                                    </div>
                                </li>
                                <li className="flex gap-3 text-sm">
                                    <FileText className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                                    <div>
                                        <strong className="block text-foreground">Description</strong>
                                        <span className="text-muted-foreground">A short updated "About Us" paragraph highlighting core competencies.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t text-center">
                        <p className="text-sm text-muted-foreground italic">
                            Note: We reserve the right to request additional information to prove you are the authorized representative of the factory.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
