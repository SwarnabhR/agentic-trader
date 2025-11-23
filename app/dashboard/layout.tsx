"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, Code, Home, LayoutDashboard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: BarChart2, label: "Chart", href: "/dashboard/chart" },
    { icon: Code, label: "Editor", href: "/dashboard/editor" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar */}
            <aside className="hidden w-64 flex-col border-r bg-card/50 backdrop-blur-sm md:flex">
                <div className="flex h-14 items-center border-b px-6">
                    <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                        <div className="h-6 w-6 rounded bg-blue-600" />
                        Agentic Trader
                    </Link>
                </div>
                <nav className="flex-1 space-y-1 p-4">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start gap-3",
                                        isActive && "bg-blue-600/10 text-blue-400 hover:bg-blue-600/20"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>
                <div className="border-t p-4">
                    <div className="rounded-lg bg-blue-900/20 p-4">
                        <h4 className="mb-2 text-sm font-medium text-blue-400">AI Assistant</h4>
                        <p className="text-xs text-muted-foreground">
                            Ready to analyze your strategies.
                        </p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-14 items-center gap-4 border-b bg-card/50 px-6 backdrop-blur-sm">
                    <h1 className="text-lg font-semibold">Dashboard</h1>
                    <div className="ml-auto flex items-center gap-4">
                        <Button size="sm" variant="outline">Connect Wallet</Button>
                        <div className="h-8 w-8 rounded-full bg-blue-600/20" />
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
