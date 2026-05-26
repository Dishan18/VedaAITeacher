"use client";

import { Download, Loader2, RefreshCcw, Sparkles } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { GeneratedPaper } from "@vedaai/shared-types";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { api, pdfUrl } from "@/lib/api";
import { demoAssignments, demoPapers } from "@/lib/demo-data";
import { useAssignmentSocket } from "@/hooks/use-assignment-socket";
import { useAssignmentStore } from "@/stores/assignment-store";

type AssignmentResponse = {
  assignment: { _id: string; title: string; status: string; pdfPath?: string };
  paper?: { paper: GeneratedPaper; pdfPath?: string };
};

export default function AssignmentOutputPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<AssignmentResponse | null>(null);
  const progress = useAssignmentStore((state) => state.activeProgress);
  useAssignmentSocket(params.id);

  useEffect(() => {
    const load = () =>
      api<AssignmentResponse>(`/assignments/${params.id}`).then(setData).catch(() => {
        const demoAssignment = demoAssignments.find((assignment) => assignment.id === params.id);
        const demoPaper = demoPapers[params.id];
        setData(
          demoAssignment && demoPaper
            ? {
                assignment: {
                  _id: demoAssignment.id,
                  title: demoAssignment.title,
                  status: demoAssignment.status
                },
                paper: { paper: demoPaper }
              }
            : null
        );
      });
    load();
    const timer = setInterval(load, 2500);
    return () => clearInterval(timer);
  }, [params.id]);

  const paper = data?.paper?.paper;
  const status = progress?.assignmentId === params.id ? progress.status : data?.assignment.status;
  const isReady = status === "completed" && paper;

  return (
    <main className="flex min-h-screen bg-[#dedede]">
      <Sidebar />
      <section className="min-w-0 flex-1 pb-32 lg:pb-8 lg:pr-4">
        <Topbar title="Create New" />
        <div className="mx-auto max-w-[1120px] px-4 py-4 lg:px-0">
          <div className="mb-3 rounded-[22px] bg-[#222] p-5 text-white shadow-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold">Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade 8 Science classes on the NCERT chapters:</p>
                <p className="mt-1 text-xs text-white/55 capitalize">{status?.replaceAll("_", " ") ?? "loading"}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" asChild>
                  <a href={pdfUrl(data?.paper?.pdfPath ?? data?.assignment.pdfPath)} download>
                    <Download className="h-4 w-4" /> Download as PDF
                  </a>
                </Button>
                <Button size="sm" onClick={() => api(`/assignments/${params.id}/regenerate`, { method: "POST" })}>
                  <RefreshCcw className="h-4 w-4" /> Regenerate
                </Button>
              </div>
            </div>
          </div>

          {!isReady ? (
            <div className="grid min-h-[620px] place-items-center rounded-[26px] bg-white paper-shadow">
              <div className="max-w-sm text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#ff642a]" />
                <h1 className="mt-5 text-2xl font-black">Generating assessment</h1>
                <p className="mt-2 text-neutral-500">{progress?.message ?? "Your paper is moving through the AI generation queue."}</p>
                <div className="mt-6 h-2 overflow-hidden rounded-full bg-neutral-100">
                  <div className="h-full bg-[#ff642a] transition-all" style={{ width: `${progress?.progress ?? 12}%` }} />
                </div>
              </div>
            </div>
          ) : (
            <article className="paper-shadow min-h-[900px] rounded-[24px] bg-white px-5 py-8 text-[#222] sm:px-12 lg:px-20">
              <header className="text-center">
                <h1 className="text-2xl font-bold">{paper.schoolName}</h1>
                <p className="mt-2 font-bold">Subject: {paper.subject}</p>
                <p>Class: {paper.class}</p>
              </header>
              <div className="mt-8 flex justify-between text-sm">
                <span>Time Allowed: {paper.timeAllowedMinutes} minutes</span>
                <span>Maximum Marks: {paper.maximumMarks}</span>
              </div>
              <p className="mt-6 text-sm">All questions are compulsory unless stated otherwise.</p>
              <div className="mt-6 text-sm leading-7">
                <p>Name: __________________________</p>
                <p>Roll Number: ____________________</p>
                <p>Class: {paper.class} Section: ________</p>
              </div>
              {paper.sections.map((section) => (
                <section key={section.title} className="mt-10">
                  <h2 className="text-center text-lg font-bold">{section.title}</h2>
                  <p className="mt-5 font-bold">{section.instruction}</p>
                  <ol className="mt-5 space-y-4 text-sm leading-6">
                    {section.questions.map((question, index) => (
                      <li key={`${question.question}-${index}`} className="grid gap-2 sm:grid-cols-[1fr_auto]">
                        <span>{index + 1}. {question.question}</span>
                        <span className="flex items-center gap-2">
                          <span className="rounded-full bg-neutral-100 px-2 py-1 text-[11px] capitalize">{question.difficulty}</span>
                          <b>[{question.marks} Marks]</b>
                        </span>
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
              <p className="mt-10 text-sm font-bold">End of Question Paper</p>
              <section className="mt-8 border-t pt-6">
                <h2 className="font-bold">Answer Key:</h2>
                <ol className="mt-3 list-decimal space-y-3 pl-5 text-sm leading-6">
                  {paper.sections.flatMap((section) => section.questions).map((question, index) => (
                    <li key={`${question.answer}-${index}`}>{question.answer}</li>
                  ))}
                </ol>
              </section>
            </article>
          )}
        </div>
      </section>
      <MobileNav />
    </main>
  );
}
