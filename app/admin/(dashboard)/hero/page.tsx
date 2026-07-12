import { AdminSectionCard, SimpleListEditor, type FieldConfig } from "@/components/admin/SimpleListEditor";
import { HeroManagementEditor } from "@/components/admin/HeroManagementEditor";
import { getAllPageHeroes, getHeroContent, getMarqueeTags } from "@/lib/cms";
import { makeCrudActions } from "@/lib/supabase/crudFactory";
import type { HeroStat, MarqueeTag } from "@/lib/types";

export const metadata = {
  title: "Hero Management",
  description: "Configure unique visual headers, typography, buttons, and responsiveness per page.",
};

const tagFields: FieldConfig<Omit<MarqueeTag, "id">>[] = [{ name: "label", label: "Tag Label", type: "text" }];
const statFields: FieldConfig<Omit<HeroStat, "id">>[] = [
  { name: "value", label: "Value (e.g. 9+)", type: "text" },
  { name: "label", label: "Label (e.g. Experience)", type: "text" },
];

export default async function AdminHeroPage() {
  const [heroes, hero, tags] = await Promise.all([
    getAllPageHeroes(),
    getHeroContent(),
    getMarqueeTags(),
  ]);
  const stats = hero.stats;

  const tagActions = makeCrudActions<MarqueeTag>("marquee_tags", ["/admin/hero", "/"]);
  const statActions = makeCrudActions<HeroStat>("hero_stats", ["/admin/hero", "/"]);

  return (
    <div className="space-y-10">
      {/* Dynamic Page Heroes Editor */}
      <HeroManagementEditor initialHeroes={heroes} />

      {/* Stats List Editor */}
      <AdminSectionCard title="Hero Stats" description="The three stat callouts under the Home hero CTAs.">
        <SimpleListEditor<HeroStat>
          fields={statFields}
          items={stats}
          emptyItem={{ value: "", label: "" }}
          onCreate={statActions.create}
          onUpdate={statActions.update}
          onDelete={statActions.remove}
        />
      </AdminSectionCard>

      {/* Marquee Tags Editor */}
      <AdminSectionCard title="Marquee Style Tags" description="Scrolling ticker strip beneath the Home hero.">
        <SimpleListEditor<MarqueeTag>
          fields={tagFields}
          items={tags}
          emptyItem={{ label: "" }}
          onCreate={tagActions.create}
          onUpdate={tagActions.update}
          onDelete={tagActions.remove}
        />
      </AdminSectionCard>
    </div>
  );
}
