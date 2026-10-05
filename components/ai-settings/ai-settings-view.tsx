"use client";

import { useState, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { toneOptions } from "@/components/automations/labels";
import { PageContainer, PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { useWorkspace } from "@/lib/store/workspace";
import type { AiSettings, CreatorProfile, EmojiUsage, ReplyLength, WritingStyle } from "@/lib/types";
import { ReplyPreview } from "./reply-preview";
import { RulesEditor } from "./rules-editor";
import { TagEditor } from "./tag-editor";

function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader title={title} description={description} />
      <div className="px-5 pb-5">{children}</div>
    </Card>
  );
}

function SettingsForm({ saved }: { saved: AiSettings }) {
  const { aiSettings } = useWorkspace();
  const notify = useToast();
  const [draft, setDraft] = useState<AiSettings>(saved);
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  const setProfile = <K extends keyof CreatorProfile>(key: K, value: CreatorProfile[K]) =>
    setDraft((d) => ({ ...d, profile: { ...d.profile, [key]: value } }));
  const setStyle = <K extends keyof WritingStyle>(key: K, value: WritingStyle[K]) =>
    setDraft((d) => ({ ...d, style: { ...d.style, [key]: value } }));

  const save = async () => {
    setSaving(true);
    const next = await aiSettings.save(draft);
    setDraft(next);
    setSaving(false);
    notify("AI settings saved", { tone: "ai", description: "New replies will use your updated voice and rules." });
  };

  const reset = async () => {
    const next = await aiSettings.reset();
    setDraft(next);
    notify("Restored default settings", { tone: "info" });
  };

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-4">
          <Section title="Creator profile" description="Who CreatorAI is speaking for.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Display name" htmlFor="displayName">
                <Input id="displayName" value={draft.profile.displayName} onChange={(e) => setProfile("displayName", e.target.value)} />
              </Field>
              <Field label="Instagram handle" htmlFor="handle">
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-fg-subtle">@</span>
                  <Input id="handle" className="pl-7" value={draft.profile.handle} onChange={(e) => setProfile("handle", e.target.value)} />
                </div>
              </Field>
              <Field label="Niche" htmlFor="niche">
                <Input id="niche" value={draft.profile.niche} onChange={(e) => setProfile("niche", e.target.value)} />
              </Field>
              <Field label="Website" htmlFor="website">
                <Input id="website" value={draft.profile.website} onChange={(e) => setProfile("website", e.target.value)} />
              </Field>
              <Field label="Business email" htmlFor="businessEmail" hint="Brands and partnership requests are sent here." className="sm:col-span-2">
                <Input
                  id="businessEmail"
                  type="email"
                  value={draft.profile.businessEmail}
                  onChange={(e) => setProfile("businessEmail", e.target.value)}
                />
              </Field>
              <Field label="About you" htmlFor="bio" hint="Background the AI can draw on when answering questions." className="sm:col-span-2">
                <Textarea id="bio" rows={3} value={draft.profile.bio} onChange={(e) => setProfile("bio", e.target.value)} />
              </Field>
            </div>
          </Section>

          <Section title="Writing style" description="How your replies should sound.">
            <div className="space-y-5">
              <Field label="Default tone">
                <Segmented
                  label="Default tone"
                  value={draft.style.tone}
                  onChange={(tone) => setStyle("tone", tone)}
                  options={toneOptions.map((t) => ({ value: t.value, label: t.label }))}
                  className="max-w-full overflow-x-auto"
                />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Emoji usage">
                  <Segmented<EmojiUsage>
                    label="Emoji usage"
                    value={draft.style.emojiUsage}
                    onChange={(v) => setStyle("emojiUsage", v)}
                    options={[
                      { value: "none", label: "None" },
                      { value: "light", label: "Light" },
                      { value: "frequent", label: "Frequent" },
                    ]}
                  />
                </Field>
                <Field label="Reply length">
                  <Segmented<ReplyLength>
                    label="Reply length"
                    value={draft.style.replyLength}
                    onChange={(v) => setStyle("replyLength", v)}
                    options={[
                      { value: "short", label: "Short" },
                      { value: "medium", label: "Medium" },
                      { value: "detailed", label: "Detailed" },
                    ]}
                  />
                </Field>
              </div>
              <Field label="Sign-off" htmlFor="signoff" hint="Added to the end of DM replies. Leave empty for none.">
                <Input id="signoff" value={draft.style.signoff} onChange={(e) => setStyle("signoff", e.target.value)} className="sm:max-w-xs" />
              </Field>
              <Field label="Style notes" htmlFor="styleNotes">
                <Textarea id="styleNotes" rows={3} value={draft.style.styleNotes} onChange={(e) => setStyle("styleNotes", e.target.value)} />
              </Field>
            </div>
          </Section>

          <Section title="Knowledge" description="Facts and topics CreatorAI can answer confidently.">
            <TagEditor
              label="Add knowledge topic"
              values={draft.knowledgeTopics}
              onChange={(knowledgeTopics) => setDraft((d) => ({ ...d, knowledgeTopics }))}
              placeholder="e.g. Presets are 30% off for students"
            />
          </Section>

          <Section title="Topics to avoid" description="CreatorAI will politely deflect and flag these for you.">
            <TagEditor
              label="Add topic to avoid"
              tone="danger"
              values={draft.avoidTopics}
              onChange={(avoidTopics) => setDraft((d) => ({ ...d, avoidTopics }))}
              placeholder="e.g. Politics"
            />
          </Section>

          <Section title="Rules" description="Hard rules CreatorAI follows on every reply.">
            <RulesEditor rules={draft.rules} onChange={(rules) => setDraft((d) => ({ ...d, rules }))} />
          </Section>

          <div className="flex justify-start">
            <Button variant="ghost" size="sm" onClick={reset}>
              <RotateCcw /> Restore defaults
            </Button>
          </div>
        </div>

        <div className="xl:sticky xl:top-6 xl:self-start">
          <ReplyPreview settings={draft} />
        </div>
      </div>

      {dirty && (
        <div className="sticky bottom-4 z-10 mx-auto flex max-w-xl animate-fade-in items-center justify-between gap-3 rounded-xl border border-line-strong bg-surface-2/95 px-4 py-2.5 shadow-2xl shadow-black/50 backdrop-blur">
          <p className="text-sm text-fg-muted">You have unsaved changes</p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setDraft(saved)}>
              Discard
            </Button>
            <Button variant="primary" size="sm" onClick={save} loading={saving}>
              Save changes
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export function AiSettingsView() {
  const { aiSettings } = useWorkspace();

  return (
    <PageContainer>
      <PageHeader title="AI Settings" description="Teach CreatorAI your voice, what it knows, and where its limits are." />
      {aiSettings.settings ? (
        <SettingsForm saved={aiSettings.settings} />
      ) : (
        <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <Skeleton className="h-72 rounded-card" />
            <Skeleton className="h-64 rounded-card" />
          </div>
          <Skeleton className="h-80 rounded-card" />
        </div>
      )}
    </PageContainer>
  );
}
