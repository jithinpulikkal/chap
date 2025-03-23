import React from "react";
import { MessageSquare } from "lucide-react";

function NoChatselected() {
    return (
        <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
            <div className="max-w-md text-center space-y-6">
                <h2 className="text-2xl font-bold">Welcome </h2>

                {/* ICON DISPLAY */}
                <div className="flex justify-center gap-4 mb-4">
                    <div className="relative">
                        <div className="w-20 rounded-2xl flex items-center justify-center animate-bounce     ">
                            {/* <MessageSquare className="w-8 h-8 text-primary" /> */}
                            <img src="/lets-chat-logo-transparent.png" alt="" className="w-40 text-primary" />
                        </div>
                    </div>
                </div>

                {/* WELCOME TEXT */}

                <p className="text-base-content/60">Select a contact to start</p>
            </div>
        </div>
    );
}

export default NoChatselected;
