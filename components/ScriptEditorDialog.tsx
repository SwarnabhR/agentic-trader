"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SavedScript, saveScript } from "@/lib/scriptStorage";
import { Play, Save } from "lucide-react";

interface ScriptEditorDialogProps {
    open: boolean;
    onClose: () => void;
    script?: SavedScript;
    onSave?: (script: SavedScript) => void;
}

export function ScriptEditorDialog({ open, onClose, script, onSave }: ScriptEditorDialogProps) {
    const [name, setName] = useState("");
    const [code, setCode] = useState(`//@version=5
indicator("My Indicator")
plot(close)`);

    useEffect(() => {
        if (script) {
            setName(script.name);
            setCode(script.code);
        } else {
            setName("");
            setCode(`//@version=5
indicator("My Indicator")
plot(close)`);
        }
    }, [script, open]);

    const handleSave = () => {
        const savedScript = saveScript(
            script ? { ...script, name, code } : { name, code }
        );
        onSave?.(savedScript);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{script ? "Edit Script" : "New Script"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">Script Name</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., RSI Indicator"
                            className="bg-background/50"
                        />
                    </div>

                    <div className="flex-1">
                        <label className="text-sm font-medium mb-2 block">Pine Script Code</label>
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full h-[400px] resize-none bg-background/50 border rounded-md p-4 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
                            spellCheck={false}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={!name.trim()}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Script
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
