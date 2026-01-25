import { Iphone } from "@/components/ui/iphone";

export const EnhancedPhoneMockup = () => {
    return (
        <div className="w-full max-w-[280px] mx-auto">
            <Iphone>
                {/* Screen Content */}
                <div className="absolute inset-0 bg-background" style={{
                    left: "4.9%",
                    top: "2.2%",
                    width: "90%",
                    height: "95.6%",
                    borderRadius: "6.3%",
                }}>
                    {/* Status bar */}
                    <div className="flex items-center justify-between px-6 py-2.5 text-xs">
                        <span className="font-medium">9:41</span>
                        <div className="flex items-center gap-1">
                            <div className="flex gap-0.5">
                                <div className="w-1 h-1 bg-foreground rounded-full" />
                                <div className="w-1 h-1 bg-foreground rounded-full" />
                                <div className="w-1 h-1 bg-foreground rounded-full" />
                                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                            </div>
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 3C7.46 3 3.34 5.78 2.07 9.63C2.02 9.79 2 9.96 2 10.13V11C2 12.1 2.9 13 4 13H5C5.55 13 6 12.55 6 12V10C6 9.45 5.55 9 5 9H4.09C5.28 6.36 8.42 4.5 12 4.5C15.58 4.5 18.72 6.36 19.91 9H19C18.45 9 18 9.45 18 10V12C18 12.55 18.45 13 19 13H20C21.1 13 22 12.1 22 11V10.13C22 9.96 21.98 9.79 21.93 9.63C20.66 5.78 16.54 3 12 3Z" />
                            </svg>
                            <div className="w-6 h-2.5 bg-foreground rounded-sm" />
                        </div>
                    </div>

                    {/* App content */}
                    <div className="px-4 pb-6 pt-2">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-xs text-muted-foreground">Welcome back</p>
                                <p className="font-semibold text-sm">Init Expo App</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                                <span className="text-xs font-bold text-primary-foreground">ie</span>
                            </div>
                        </div>

                        {/* Hero Card */}
                        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 mb-4 border border-primary/20">
                            <p className="text-xs text-muted-foreground mb-1">Dashboard</p>
                            <p className="text-2xl font-bold">Ready to build</p>
                            <p className="text-xs text-muted-foreground mt-1">NativeWind v4 configured ✨</p>
                        </div>

                        {/* Quick actions */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {[
                                { name: "Profile", icon: "👤" },
                                { name: "Settings", icon: "⚙️" },
                                { name: "Help", icon: "❓" }
                            ].map((item) => (
                                <div
                                    key={item.name}
                                    className="bg-secondary rounded-lg p-3 text-center hover:bg-secondary/80 transition-colors"
                                >
                                    <div className="text-xl mb-1">{item.icon}</div>
                                    <p className="text-[10px] text-muted-foreground">{item.name}</p>
                                </div>
                            ))}
                        </div>

                        {/* List items */}
                        <div className="space-y-2">
                            {[
                                { title: "Expo Router Setup", progress: 100 },
                                { title: "Zustand Integration", progress: 100 }
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 p-3 bg-secondary rounded-lg"
                                >
                                    <div className="w-8 h-8 rounded-md bg-success/20 flex items-center justify-center shrink-0">
                                        <span className="text-success text-sm">✓</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium">{item.title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-success rounded-full"
                                                    style={{ width: `${item.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] text-success">{item.progress}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom navigation */}
                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-around py-4 border-t border-border bg-background/80 backdrop-blur-sm">
                        {[
                            { name: "Home", active: true },
                            { name: "Search", active: false },
                            { name: "Profile", active: false }
                        ].map((item, i) => (
                            <div key={item.name} className="flex flex-col items-center gap-1">
                                <div className={`w-5 h-5 rounded-md ${item.active ? "bg-primary" : "bg-muted"}`} />
                                <span className={`text-[10px] ${item.active ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                                    {item.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </Iphone>
        </div>
    );
};
