import { AdminSectionCard, SimpleListEditor, type FieldConfig } from "@/components/admin/SimpleListEditor";
import { FounderProfileEditor } from "@/components/admin/FounderProfileEditor";
import {
  getAboutStats,
  getCoreValues,
  getFounderProfile,
  getJourneyMilestones,
} from "@/lib/cms";
import { makeCrudActions } from "@/lib/supabase/crudFactory";
import { makeSingletonSaveAction } from "@/lib/supabase/singletonFactory";
import type { HeroStat } from "@/lib/types";

interface FounderFormValues {
  name: string;
  bio: string;
  photoUrl: string;
  secondaryImageUrl?: string | null;
}

interface CoreValueItem {
  id: string;
  indexLabel: string;
  title: string;
  description: string;
}

interface JourneyMilestoneDb {
  id: string;
  year: string;
  title: string;
  description: string;
}


const statFields: FieldConfig<Omit<HeroStat, "id">>[] = [
  { name: "value", label: "Value (e.g. 2000+)", type: "text" },
  { name: "label", label: "Label (e.g. Members Trained)", type: "text" },
];
const valueFields: FieldConfig<Omit<CoreValueItem, "id">>[] = [
  { name: "indexLabel", label: "Index (e.g. 01.)", type: "text" },
  { name: "title", label: "Title", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
];
const milestoneFields: FieldConfig<Omit<JourneyMilestoneDb, "id">>[] = [
  { name: "year", label: "Year", type: "text" },
  { name: "title", label: "Title", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
];

export default async function AdminAboutPage() {
  const [founder, stats, values, milestones] = await Promise.all([
    getFounderProfile(),
    getAboutStats(),
    getCoreValues(),
    getJourneyMilestones(),
  ]);

  const saveFounder = makeSingletonSaveAction<FounderFormValues>("founder_profile", ["/admin/about", "/about"]);
  const statActions = makeCrudActions<HeroStat>("about_stats", ["/admin/about", "/about"]);
  const valueActions = makeCrudActions<CoreValueItem>("core_values", ["/admin/about", "/about"]);
  const milestoneActions = makeCrudActions<JourneyMilestoneDb>("journey_milestones", ["/admin/about", "/about"]);

  return (
    <div>

      <AdminSectionCard title="Founder Profile">
        <FounderProfileEditor initialData={founder} onSave={saveFounder} />
      </AdminSectionCard>

      <AdminSectionCard title="Stats Bar">
        <SimpleListEditor<HeroStat>
          fields={statFields}
          items={stats}
          emptyItem={{ value: "", label: "" }}
          onCreate={statActions.create}
          onUpdate={statActions.update}
          onDelete={statActions.remove}
        />
      </AdminSectionCard>

      <AdminSectionCard title="Core Values">
        <SimpleListEditor<CoreValueItem>
          fields={valueFields}
          items={values.map((v) => ({ id: v.id, indexLabel: v.index, title: v.title, description: v.description }))}
          emptyItem={{ indexLabel: "", title: "", description: "" }}
          onCreate={valueActions.create}
          onUpdate={valueActions.update}
          onDelete={valueActions.remove}
        />
      </AdminSectionCard>

      <AdminSectionCard title="Journey Timeline">
        <SimpleListEditor<JourneyMilestoneDb>
          fields={milestoneFields}
          items={milestones}
          emptyItem={{ year: "", title: "", description: "" }}
          onCreate={milestoneActions.create}
          onUpdate={milestoneActions.update}
          onDelete={milestoneActions.remove}
        />
      </AdminSectionCard>

      <p className="text-sm text-ink-muted">
        Team photos are managed on the{" "}
        <a href="/admin/gallery" className="text-accent underline">
          Gallery
        </a>{" "}
        page — tag them with category &quot;TEAM&quot;.
      </p>
    </div>
  );
}
