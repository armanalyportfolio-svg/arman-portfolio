"use client";

import type {
  AboutContent,
  ContactContent,
  GeneralContent,
  HeroContent,
  PortfolioContent,
  ResumeContent,
  SeoContent,
  ServicesContent,
  SocialPlatform,
  SocialProfile,
  TestimonialsContent,
} from "@/lib/content/types";
import { serviceIcons, getServiceIcon } from "@/lib/content/service-icons";
import { verificationCode } from "@/lib/content/merge";
import {
  Card,
  Grid,
  ListEditor,
  MediaInput,
  NumberInput,
  RangeInput,
  Select,
  TagsInput,
  TextArea,
  TextInput,
  Toggle,
} from "./fields";

type EditorProps<T> = { value: T; onChange: (value: T) => void };

function makeSetter<T>(value: T, onChange: (value: T) => void) {
  return <K extends keyof T>(key: K) =>
    (v: T[K]) =>
      onChange({ ...value, [key]: v });
}

const newId = () => Math.random().toString(36).slice(2, 10);

function SectionHeaderFields<T extends { eyebrow: string; heading: string; subheading?: string }>({
  value,
  onChange,
}: EditorProps<T>) {
  const set = makeSetter(value, onChange);
  return (
    <Card title="Section heading" description="Small label, title and intro text shown at the top of the section.">
      <Grid>
        <TextInput label="Small label (eyebrow)" value={value.eyebrow} onChange={set("eyebrow")} />
        <TextInput label="Heading" value={value.heading} onChange={set("heading")} />
      </Grid>
      {value.subheading !== undefined && (
        <TextArea
          label="Intro text"
          value={value.subheading}
          onChange={(v) => onChange({ ...value, subheading: v })}
          rows={2}
        />
      )}
    </Card>
  );
}

// ---------------------------------------------------------------- General

export function GeneralEditor({ value, onChange }: EditorProps<GeneralContent>) {
  const set = makeSetter(value, onChange);
  return (
    <>
      <Card title="Identity" description="Your name and role, used across the whole site.">
        <Grid>
          <TextInput label="Full name" value={value.name} onChange={set("name")} />
          <TextInput label="Logo text (navbar)" value={value.logoText} onChange={set("logoText")} />
          <TextInput label="Role / title" value={value.role} onChange={set("role")} />
          <TextInput label="Location" value={value.location} onChange={set("location")} placeholder="Karachi, PK" />
        </Grid>
      </Card>
      <Card title="Availability">
        <Toggle
          label="Show “available for work” badge"
          checked={value.availableForWork}
          onChange={set("availableForWork")}
          hint="Shown in the hero, about photo and contact section."
        />
        <TextInput label="Badge text" value={value.availabilityText} onChange={set("availabilityText")} />
      </Card>
      <Card title="Footer">
        <TextInput label="Footer tagline" value={value.footerTagline} onChange={set("footerTagline")} />
        <TextInput label="Copyright / credit line" value={value.footerCredit} onChange={set("footerCredit")} />
      </Card>
    </>
  );
}

// ---------------------------------------------------------------- SEO

export function SeoEditor({ value, onChange }: EditorProps<SeoContent>) {
  const set = makeSetter(value, onChange);
  return (
    <Card title="Search & social sharing" description="How the site appears on Google and when the link is shared on WhatsApp, Facebook, etc.">
      <TextInput
        label="Page title"
        value={value.title}
        onChange={set("title")}
        hint={`${value.title.length} characters — aim for under 60.`}
      />
      <TextArea
        label="Description"
        value={value.description}
        onChange={set("description")}
        hint={`${value.description.length} characters — aim for 120–160.`}
      />
      <TagsInput label="Keywords" value={value.keywords} onChange={set("keywords")} />
      <MediaInput
        label="Share image (1200×630, optional)"
        value={value.ogImage}
        onChange={set("ogImage")}
        folder="seo"
        hint="JPG or PNG. Leave empty to use an auto-generated card with your name, role and photo."
      />
      <TextInput
        label="Google Search Console verification code"
        value={value.googleVerification}
        onChange={(v) => set("googleVerification")(verificationCode(v))}
        placeholder="e.g. abc123XYZ..."
        hint="In Search Console choose “HTML tag” and paste only the code inside content=“...”."
      />
    </Card>
  );
}

// ---------------------------------------------------------------- Hero

export function HeroEditor({ value, onChange }: EditorProps<HeroContent>) {
  const set = makeSetter(value, onChange);
  return (
    <>
      <Card title="What to show" description="Turn either part on or off. If both are off, the hero section is hidden.">
        <Toggle
          label="Image + background name"
          checked={value.showVisual}
          onChange={set("showVisual")}
          hint="Your portrait with the glitch effect, and the big faded name behind it."
        />
        <Toggle
          label="Content"
          checked={value.showContent}
          onChange={set("showContent")}
          hint="Name, typewriter, tagline, buttons, stat cards and social icons. Centred when the image is off."
        />
        {!value.showVisual && !value.showContent && (
          <p className="text-[11px] text-amber-500">Both are off — the hero section will not appear on the site.</p>
        )}
      </Card>
      <Card title="Text">
        <TagsInput
          label="Typewriter roles"
          value={value.roles}
          onChange={set("roles")}
          hint="These rotate one after another under your name."
        />
        <TextArea label="Tagline" value={value.tagline} onChange={set("tagline")} />
        <TagsInput label="Key skill chips" value={value.keySkills} onChange={set("keySkills")} />
        <p className="text-[11px] text-[var(--text-muted)]">
          The three stat cards in the hero use the first three stats from the <strong>About</strong> section.
        </p>
      </Card>
      <Card title="Images" description="Use transparent PNG cut-outs for the best look. Shown on tablet and desktop.">
        <MediaInput label="Main portrait" value={value.portraitImage} onChange={set("portraitImage")} folder="hero" />
        <MediaInput
          label="Glitch image (optional)"
          value={value.revealImage}
          onChange={set("revealImage")}
          folder="hero"
          hint="The portrait glitches into this image every few seconds. Leave empty to turn the effect off."
        />
      </Card>
    </>
  );
}

// ---------------------------------------------------------------- About

export function AboutEditor({ value, onChange }: EditorProps<AboutContent>) {
  const set = makeSetter(value, onChange);
  return (
    <>
      <SectionHeaderFields value={value} onChange={onChange} />
      <Card title="Profile photo card">
        <MediaInput label="Photo" value={value.image} onChange={set("image")} folder="about" />
        <Grid>
          <TextInput label="Subtitle under name" value={value.cardSubtitle} onChange={set("cardSubtitle")} />
          <TextInput label="Corner badge" value={value.cardBadge} onChange={set("cardBadge")} placeholder="PK" />
        </Grid>
      </Card>
      <Card title="Bio">
        <ListEditor
          label="Paragraphs"
          items={value.bio}
          onChange={set("bio")}
          createItem={() => ""}
          itemTitle={(p) => p.replace(/\*\*/g, "").slice(0, 70)}
          addLabel="Add paragraph"
          renderItem={(p, _update, i) => (
            <TextArea
              label="Paragraph"
              value={p}
              rows={4}
              onChange={(v) => set("bio")(value.bio.map((old, j) => (j === i ? v : old)))}
              hint="Wrap words in **double asterisks** to make them bold."
            />
          )}
        />
        <TagsInput label="Highlight badges" value={value.highlights} onChange={set("highlights")} />
      </Card>
      <Card title="Stats" description="Animated counters. The first three also appear in the hero.">
        <ListEditor
          label="Stats"
          items={value.stats}
          onChange={set("stats")}
          createItem={() => ({ value: 0, suffix: "+", label: "", detail: "" })}
          itemTitle={(s) => `${s.value}${s.suffix} ${s.label}`}
          addLabel="Add stat"
          renderItem={(s, update) => (
            <Grid>
              <NumberInput label="Number" value={s.value} onChange={(v) => update({ value: v })} />
              <TextInput label="Suffix" value={s.suffix} onChange={(v) => update({ suffix: v })} placeholder="+ or %" />
              <TextInput label="Label" value={s.label} onChange={(v) => update({ label: v })} />
              <TextInput label="Detail" value={s.detail} onChange={(v) => update({ detail: v })} />
            </Grid>
          )}
        />
      </Card>
      <Card title="Skills">
        <TextInput label="Skills heading" value={value.skillsHeading} onChange={set("skillsHeading")} />
        <ListEditor
          label="Skills"
          items={value.skills}
          onChange={set("skills")}
          createItem={() => ({ name: "", tag: "", level: 80 })}
          itemTitle={(s) => `${s.name} — ${s.level}%`}
          addLabel="Add skill"
          renderItem={(s, update) => (
            <>
              <Grid>
                <TextInput label="Skill" value={s.name} onChange={(v) => update({ name: v })} />
                <TextInput label="Tag" value={s.tag} onChange={(v) => update({ tag: v })} />
              </Grid>
              <RangeInput label="Level" value={s.level} onChange={(v) => update({ level: v })} />
            </>
          )}
        />
      </Card>
    </>
  );
}

// ---------------------------------------------------------------- Services

const iconOptions = Object.entries(serviceIcons).map(([value, { label }]) => ({ value, label }));

export function ServicesEditor({ value, onChange }: EditorProps<ServicesContent>) {
  const set = makeSetter(value, onChange);
  return (
    <>
      <SectionHeaderFields value={value} onChange={onChange} />
      <Card title="Services">
        <ListEditor
          label="Service cards"
          items={value.items}
          onChange={set("items")}
          createItem={() => ({ icon: "sparkles", title: "", description: "", tags: [] })}
          itemTitle={(s) => s.title}
          addLabel="Add service"
          renderItem={(s, update) => {
            const Icon = getServiceIcon(s.icon);
            return (
              <>
                <div className="flex items-end gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#5C5470] text-white flex items-center justify-center shrink-0">
                    <Icon size={22} />
                  </div>
                  <div className="flex-1">
                    <Select label="Icon" value={s.icon} onChange={(v) => update({ icon: v })} options={iconOptions} />
                  </div>
                </div>
                <TextInput label="Title" value={s.title} onChange={(v) => update({ title: v })} />
                <TextArea label="Description" value={s.description} onChange={(v) => update({ description: v })} />
                <TagsInput label="Tags" value={s.tags} onChange={(v) => update({ tags: v })} />
              </>
            );
          }}
        />
      </Card>
    </>
  );
}

// ---------------------------------------------------------------- Portfolio

export function PortfolioEditor({ value, onChange }: EditorProps<PortfolioContent>) {
  const set = makeSetter(value, onChange);
  const categoryOptions = value.categories.map((c) => ({ value: c.id, label: c.label || c.id }));

  return (
    <>
      <SectionHeaderFields value={value} onChange={onChange} />
      <Card title="Projects" description="Your work. Featured shows a gold badge; Spotlight makes the card double-width in the bento view.">
        <ListEditor
          label="Projects"
          items={value.items}
          onChange={set("items")}
          createItem={() => ({
            id: newId(),
            title: "",
            category: value.categories[0]?.id ?? "",
            image: "",
            description: "",
            tags: [],
            featured: false,
            spotlight: false,
          })}
          itemTitle={(p) => p.title}
          itemThumb={(p) => p.image || undefined}
          addLabel="Add project"
          renderItem={(p, update) => (
            <>
              <MediaInput label="Image" value={p.image} onChange={(v) => update({ image: v })} folder="portfolio" />
              <Grid>
                <TextInput label="Title" value={p.title} onChange={(v) => update({ title: v })} />
                <Select
                  label="Category"
                  value={p.category}
                  onChange={(v) => update({ category: v })}
                  options={categoryOptions}
                />
              </Grid>
              <TextArea label="Description" value={p.description} onChange={(v) => update({ description: v })} />
              <TagsInput label="Tags" value={p.tags} onChange={(v) => update({ tags: v })} />
              <Grid>
                <Toggle label="Featured" checked={p.featured} onChange={(v) => update({ featured: v })} />
                <Toggle label="Spotlight (wide card)" checked={p.spotlight} onChange={(v) => update({ spotlight: v })} />
              </Grid>
            </>
          )}
        />
      </Card>
      <Card title="Filter categories" description="Tabs above the gallery. “All Work” is added automatically.">
        <ListEditor
          label="Categories"
          items={value.categories}
          onChange={set("categories")}
          createItem={() => ({ id: newId(), label: "" })}
          itemTitle={(c) => `${c.label} (${value.items.filter((p) => p.category === c.id).length} projects)`}
          addLabel="Add category"
          renderItem={(c, update) => (
            <TextInput label="Tab label" value={c.label} onChange={(v) => update({ label: v })} />
          )}
        />
      </Card>
      <Card title="Scrolling marquee">
        <TagsInput label="Marquee words" value={value.marquee} onChange={set("marquee")} />
      </Card>
    </>
  );
}

// ---------------------------------------------------------------- Resume

export function ResumeEditor({ value, onChange }: EditorProps<ResumeContent>) {
  const set = makeSetter(value, onChange);
  return (
    <>
      <Card title="Section heading">
        <Grid>
          <TextInput label="Small label (eyebrow)" value={value.eyebrow} onChange={set("eyebrow")} />
          <TextInput label="Heading" value={value.heading} onChange={set("heading")} />
        </Grid>
        <MediaInput
          label="CV file (PDF)"
          value={value.cvUrl}
          onChange={set("cvUrl")}
          folder="cv"
          accept="application/pdf"
          hint="Upload your CV. Leave empty to hide the download button."
        />
      </Card>
      <Card title="Experience">
        <ListEditor
          label="Jobs"
          items={value.experience}
          onChange={set("experience")}
          createItem={() => ({ title: "", company: "", period: "", description: "", tags: [] })}
          itemTitle={(e) => `${e.title} — ${e.company}`}
          addLabel="Add job"
          renderItem={(e, update) => (
            <>
              <Grid>
                <TextInput label="Job title" value={e.title} onChange={(v) => update({ title: v })} />
                <TextInput label="Company" value={e.company} onChange={(v) => update({ company: v })} />
              </Grid>
              <TextInput label="Period" value={e.period} onChange={(v) => update({ period: v })} placeholder="2024 — Present" />
              <TextArea label="Description" value={e.description} onChange={(v) => update({ description: v })} />
              <TagsInput label="Tags" value={e.tags} onChange={(v) => update({ tags: v })} />
            </>
          )}
        />
      </Card>
      <Card title="Education">
        <ListEditor
          label="Education"
          items={value.education}
          onChange={set("education")}
          createItem={() => ({ title: "", institution: "", period: "", description: "", grade: "" })}
          itemTitle={(e) => e.title}
          addLabel="Add education"
          renderItem={(e, update) => (
            <>
              <TextInput label="Degree / course" value={e.title} onChange={(v) => update({ title: v })} />
              <Grid>
                <TextInput label="Institution" value={e.institution} onChange={(v) => update({ institution: v })} />
                <TextInput label="Period" value={e.period} onChange={(v) => update({ period: v })} />
              </Grid>
              <TextInput label="Grade (optional)" value={e.grade} onChange={(v) => update({ grade: v })} />
              <TextArea label="Description" value={e.description} onChange={(v) => update({ description: v })} />
            </>
          )}
        />
      </Card>
    </>
  );
}

// ---------------------------------------------------------------- Testimonials

export function TestimonialsEditor({ value, onChange }: EditorProps<TestimonialsContent>) {
  const set = makeSetter(value, onChange);
  return (
    <>
      <Card title="Section heading">
        <Grid>
          <TextInput label="Small label (eyebrow)" value={value.eyebrow} onChange={set("eyebrow")} />
          <TextInput label="Heading" value={value.heading} onChange={set("heading")} />
        </Grid>
      </Card>
      <Card title="Reviews" description="The section is hidden when there are no reviews.">
        <ListEditor
          label="Reviews"
          items={value.items}
          onChange={set("items")}
          createItem={() => ({ name: "", role: "", text: "", rating: 5 })}
          itemTitle={(t) => `${t.name} — ${"★".repeat(t.rating)}`}
          addLabel="Add review"
          renderItem={(t, update) => (
            <>
              <Grid>
                <TextInput label="Client name" value={t.name} onChange={(v) => update({ name: v })} />
                <TextInput label="Role / company" value={t.role} onChange={(v) => update({ role: v })} />
              </Grid>
              <TextArea label="Review" value={t.text} onChange={(v) => update({ text: v })} rows={4} />
              <Select
                label="Rating"
                value={String(t.rating)}
                onChange={(v) => update({ rating: Number(v) })}
                options={[5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${"★".repeat(n)} (${n})` }))}
              />
            </>
          )}
        />
      </Card>
    </>
  );
}

// ---------------------------------------------------------------- Contact

const platformOptions: { value: SocialPlatform; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "facebook", label: "Facebook" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "website", label: "Other / Website" },
];

export function ContactEditor({ value, onChange }: EditorProps<ContactContent>) {
  const set = makeSetter(value, onChange);
  return (
    <>
      <SectionHeaderFields value={value} onChange={onChange} />
      <Card title="Contact details">
        <TextInput label="Email" type="email" value={value.email} onChange={set("email")} />
        <TextInput
          label="WhatsApp number"
          type="tel"
          value={value.whatsappNumber}
          onChange={set("whatsappNumber")}
          placeholder="923001234567"
          hint="With country code, digits only (e.g. 923232902969). Leave empty to hide the WhatsApp bubble."
        />
        <TextArea
          label="Pre-filled WhatsApp message"
          value={value.whatsappMessage}
          onChange={set("whatsappMessage")}
          rows={2}
        />
        <TextArea
          label="WhatsApp popup greeting"
          value={value.whatsappGreeting}
          onChange={set("whatsappGreeting")}
          rows={2}
        />
        <TextArea
          label="Availability note"
          value={value.availabilityNote}
          onChange={set("availabilityNote")}
          rows={2}
        />
      </Card>
      <Card title="Social profiles" description="Shown in the hero, navbar menu, contact section and footer.">
        <ListEditor
          label="Profiles"
          items={value.socials}
          onChange={set("socials")}
          createItem={(): SocialProfile => ({ platform: "website", name: "", handle: "", url: "" })}
          itemTitle={(s) => `${s.name} — ${s.handle}`}
          addLabel="Add profile"
          renderItem={(s, update) => (
            <>
              <Grid>
                <Select
                  label="Platform (icon)"
                  value={s.platform}
                  onChange={(v) => update({ platform: v as SocialPlatform })}
                  options={platformOptions}
                />
                <TextInput label="Display name" value={s.name} onChange={(v) => update({ name: v })} />
              </Grid>
              <TextInput label="Handle" value={s.handle} onChange={(v) => update({ handle: v })} placeholder="@username" />
              <TextInput
                label="Link"
                type="url"
                value={s.url}
                onChange={(v) => update({ url: v })}
                placeholder="https://"
                hint={s.platform === "whatsapp" ? "Leave empty to use the WhatsApp number above." : undefined}
              />
            </>
          )}
        />
      </Card>
    </>
  );
}
