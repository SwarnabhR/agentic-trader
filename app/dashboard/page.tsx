import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
    return (
        <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
            <Card className="border-blue-900/20 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Welcome to Agentic Trader</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Navigate to the sidebar to access:
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                        <li>📊 <strong>Chart</strong> - View live stock market data</li>
                        <li>📝 <strong>Editor</strong> - Write and test Pine Script indicators</li>
                        <li>🤖 <strong>AI Insights</strong> - Get AI-powered market analysis</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
