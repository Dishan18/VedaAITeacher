"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Calendar, ChevronDown, Minus, Mic, MoveLeft, Plus, UploadCloud, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { QUESTION_TYPES } from "@vedaai/shared-types";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

const rowSchema = z.object({
  id: z.string(),
  type: z.enum(QUESTION_TYPES),
  count: z.number().min(1).max(50),
  marks: z.number().min(1).max(20)
});

const formSchema = z.object({
  title: z.string().min(2, "Title is required"),
  dueDate: z.string().min(1, "Due date is required"),
  manualText: z.string().optional(),
  instructions: z.string().optional(),
  questionConfig: z.array(rowSchema).min(1)
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  title: "Quiz on Electricity",
  dueDate: "",
  manualText: "",
  instructions: "",
  questionConfig: [
    { id: crypto.randomUUID(), type: "MCQ", count: 4, marks: 1 },
    { id: crypto.randomUUID(), type: "Short Questions", count: 3, marks: 2 },
    { id: crypto.randomUUID(), type: "Diagram/Graph Based", count: 5, marks: 5 },
    { id: crypto.randomUUID(), type: "Numerical Problems", count: 5, marks: 5 }
  ]
};

function Stepper({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div className="flex h-11 items-center justify-between rounded-full bg-white px-3">
      <button type="button" className="grid h-8 w-8 place-items-center rounded-full text-neutral-400 hover:bg-neutral-100" onClick={() => onChange(Math.max(1, value - 1))}>
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-8 text-center font-bold">{value}</span>
      <button type="button" className="grid h-8 w-8 place-items-center rounded-full text-neutral-400 hover:bg-neutral-100" onClick={() => onChange(value + 1)}>
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function CreateAssignmentPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues:
      typeof window !== "undefined" && localStorage.getItem("vedaai-draft")
        ? JSON.parse(localStorage.getItem("vedaai-draft")!)
        : defaultValues
  });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "questionConfig" });
  const rows = form.watch("questionConfig");
  const totals = useMemo(
    () => ({
      questions: rows.reduce((sum, row) => sum + Number(row.count || 0), 0),
      marks: rows.reduce((sum, row) => sum + Number(row.count || 0) * Number(row.marks || 0), 0)
    }),
    [rows]
  );

  useEffect(() => {
    const sub = form.watch((value) => localStorage.setItem("vedaai-draft", JSON.stringify(value)));
    return () => sub.unsubscribe();
  }, [form]);

  async function submit(values: FormValues) {
    setIsSubmitting(true);
    const data = new FormData();
    data.append("title", values.title);
    data.append("dueDate", values.dueDate);
    data.append("manualText", values.manualText ?? "");
    data.append("instructions", values.instructions ?? "");
    data.append("timeAllowedMinutes", "45");
    data.append("questionConfig", JSON.stringify(values.questionConfig));
    files.forEach((file) => data.append("files", file));

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/assignments`, {
      method: "POST",
      body: data
    });
    const result = await response.json();
    setIsSubmitting(false);
    if (!response.ok) throw new Error(result.message ?? "Unable to create assignment");
    localStorage.removeItem("vedaai-draft");
    router.push(`/assignments/${result.assignmentId}`);
  }

  return (
    <main className="flex min-h-screen bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.95),rgba(218,218,218,0.92)_45%,rgba(199,199,199,0.9))]">
      <Sidebar />
      <section className="min-w-0 flex-1 pb-32 lg:pb-8 lg:pr-4">
        <Topbar title="Create Assignment" centered />
        <form onSubmit={form.handleSubmit(submit)} className="mx-auto max-w-[980px] px-4 py-6 lg:px-0">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded-full border-4 border-emerald-200 bg-emerald-500" />
              <div>
                <h1 className="text-2xl font-black">Create Assignment</h1>
                <p className="text-sm text-neutral-500">Set up a new assignment for your students</p>
              </div>
            </div>
            <div className="mx-auto mt-9 grid max-w-3xl grid-cols-2 gap-2">
              <div className="h-1.5 rounded-full bg-neutral-700" />
              <div className="h-1.5 rounded-full bg-neutral-300" />
            </div>
          </div>

          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-[30px] bg-white/55 p-5 shadow-[0_28px_80px_rgba(0,0,0,0.12)] sm:p-8">
            <h2 className="text-xl font-black">Assignment Details</h2>
            <p className="text-sm text-neutral-500">Basic information about your assignment</p>

            <div
              className="mt-8 grid min-h-44 cursor-pointer place-items-center rounded-[22px] border-2 border-dashed border-neutral-300 bg-white/50 p-6 text-center"
              onClick={() => fileInputRef.current?.click()}
              onDrop={(event) => {
                event.preventDefault();
                setFiles(Array.from(event.dataTransfer.files));
              }}
              onDragOver={(event) => event.preventDefault()}
            >
              <input ref={fileInputRef} type="file" multiple accept=".pdf,.docx,.txt,image/*" className="hidden" onChange={(event) => setFiles(Array.from(event.target.files ?? []))} />
              <UploadCloud className="mx-auto h-8 w-8" />
              <p className="mt-5 font-semibold">Choose a file or drag & drop it here</p>
              <p className="mt-2 text-xs text-neutral-500">PDF, DOCX, TXT, images, up to 10MB</p>
              <Button type="button" variant="secondary" size="sm" className="mt-5">Browse Files</Button>
              {files.length ? <p className="mt-4 text-sm font-semibold text-[#ff642a]">{files.map((file) => file.name).join(", ")}</p> : null}
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label>
                <span className="mb-2 block font-bold">Assignment Title</span>
                <Input {...form.register("title")} />
              </label>
              <label>
                <span className="mb-2 block font-bold">Due Date</span>
                <div className="relative">
                  <Input type="date" {...form.register("dueDate")} />
                  <Calendar className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2" />
                </div>
              </label>
            </div>

            <div className="mt-6">
              <div className="hidden grid-cols-[1fr_140px_120px_32px] gap-4 px-1 text-sm font-bold md:grid">
                <span>Question Type</span>
                <span>No. of Questions</span>
                <span>Marks</span>
              </div>
              <div className="mt-3 space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid gap-3 rounded-[22px] bg-white/70 p-3 md:grid-cols-[1fr_140px_120px_32px] md:rounded-none md:bg-transparent md:p-0">
                    <Controller
                      control={form.control}
                      name={`questionConfig.${index}.type`}
                      render={({ field: controllerField }) => (
                        <label className="relative">
                          <select {...controllerField} className="h-12 w-full appearance-none rounded-full bg-white px-4 text-sm outline-none">
                            {QUESTION_TYPES.map((type) => <option key={type}>{type}</option>)}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2" />
                        </label>
                      )}
                    />
                    <Controller control={form.control} name={`questionConfig.${index}.count`} render={({ field: controllerField }) => <Stepper value={controllerField.value} onChange={controllerField.onChange} />} />
                    <Controller control={form.control} name={`questionConfig.${index}.marks`} render={({ field: controllerField }) => <Stepper value={controllerField.value} onChange={controllerField.onChange} />} />
                    <button type="button" className="grid h-10 w-10 place-items-center rounded-full hover:bg-neutral-100" onClick={() => remove(index)}>
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" className="mt-5 inline-flex items-center gap-3 font-bold" onClick={() => append({ id: crypto.randomUUID(), type: "Long Questions", count: 2, marks: 5 })}>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#222] text-white"><Plus className="h-5 w-5" /></span>
                Add Question Type
              </button>
            </div>

            <div className="mt-5 text-right font-semibold">
              <p>Total Questions : {totals.questions}</p>
              <p>Total Marks : {totals.marks}</p>
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block font-bold">Additional Information (For better output)</span>
              <div className="relative">
                <Textarea placeholder="e.g Generate a question paper for 3 hour exam duration..." {...form.register("instructions")} />
                <Mic className="absolute bottom-5 right-5 h-5 w-5" />
              </div>
            </label>
            <label className="mt-4 block">
              <span className="mb-2 block font-bold">Manual Instructions or Source Text</span>
              <Textarea placeholder="Paste source notes, syllabus, chapter summary, or custom teacher guidance." {...form.register("manualText")} />
            </label>
          </motion.section>

          <div className="mt-8 flex justify-between">
            <Button type="button" variant="secondary" onClick={() => router.push("/")}>
              <MoveLeft className="h-5 w-5" /> Previous
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Next"} <MoveLeft className="h-5 w-5 rotate-180" />
            </Button>
          </div>
        </form>
      </section>
      <MobileNav />
    </main>
  );
}
