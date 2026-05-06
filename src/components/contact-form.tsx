"use client";

import React, { useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { sendContactEmailAction } from "@/actions/contact.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/AppIcon";
import { motion } from "framer-motion";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-base transition-all duration-300 shadow-lg shadow-primary/20 cursor-pointer"
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <Icon name="ArrowPathIcon" size={18} className="animate-spin" />
          Sending...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          Send Message
          <Icon name="PaperAirplaneIcon" size={18} />
        </span>
      )}
    </Button>
  );
}

export default function ContactForm() {
  const [selectedType, setSelectedType] = useState<string>("feedback");

  const handleSubmit = async (formData: FormData) => {
    const result = await sendContactEmailAction(formData);

    if (result.success) {
      toast.success(result.message);
      const form = document.getElementById("contact-form") as HTMLFormElement;
      form?.reset();
    } else {
      toast.error(result.error || "Something went wrong");
    }
  };

  const types = [
    { id: "bug", label: "Bug Report", icon: "BugAntIcon" },
    { id: "feature request", label: "Feature", icon: "SparklesIcon" },
    { id: "feedback", label: "Feedback", icon: "ChatBubbleLeftRightIcon" },
  ];

  return (
    <form id="contact-form" action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold ml-1">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            required
            className="h-12 px-4 rounded-2xl border-border/50 bg-muted/20 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold ml-1">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            className="h-12 px-4 rounded-2xl border-border/50 bg-muted/20 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-semibold ml-1">
          What can we help with?
        </Label>
        <div className="grid grid-cols-3 gap-3">
          <input type="hidden" name="type" value={selectedType} />
          {types.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedType(t.id)}
              className={`relative cursor-pointer flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all duration-300 ${
                selectedType === t.id
                  ? "bg-primary/10 border-primary text-primary shadow-sm"
                  : "bg-muted/20 border-border/50 text-muted-foreground hover:bg-muted/40"
              }`}
            >
              <Icon name={t.icon} size={20} />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {t.label}
              </span>
              {selectedType === t.id && (
                <motion.div
                  layoutId="active-type"
                  className="absolute inset-0 border-2 border-primary rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-semibold ml-1">
          Message
        </Label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Tell us more about your request..."
          required
          className="w-full p-4 rounded-2xl border border-border/50 bg-muted/20 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all resize-none text-sm outline-none"
        />
      </div>

      <div className="pt-2">
        <SubmitButton />
      </div>

      <p className="text-center text-xs text-muted-foreground mt-4">
        By sending a message, you agree to our{" "}
        <a href="#" className="underline hover:text-foreground">
          Terms of Service
        </a>
        .
      </p>
    </form>
  );
}
