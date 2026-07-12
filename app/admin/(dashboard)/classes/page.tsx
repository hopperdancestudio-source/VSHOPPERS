import { AdminSectionCard, SimpleListEditor, type FieldConfig } from "@/components/admin/SimpleListEditor";
import { ClassStylesEditor } from "@/components/admin/ClassStylesEditor";
import { getAgeBatches, getClassStyles } from "@/lib/cms";
import { makeCrudActions } from "@/lib/supabase/crudFactory";
import type { ClassStyleDb } from "@/lib/types";

interface AgeBatchDb {
  id: string;
  name: string;
  ageRange: string;
  description: string;
}

const batchFields: FieldConfig<Omit<AgeBatchDb, "id">>[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "ageRange", label: "Age Range", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
];

export default async function AdminClassesPage() {
  const [styles, batches] = await Promise.all([getClassStyles(), getAgeBatches()]);

  const styleActions = makeCrudActions<ClassStyleDb>("class_styles", ["/admin/classes", "/classes"]);
  const batchActions = makeCrudActions<AgeBatchDb>("age_batches", ["/admin/classes", "/classes", "/"]);

  return (
    <div>

      <AdminSectionCard
        title="Class Styles"
        description="Each style renders as one alternating row on the Classes page, ordered by 'Order'."
      >
        <ClassStylesEditor
          items={styles}
          onCreate={styleActions.create}
          onUpdate={styleActions.update}
          onDelete={styleActions.remove}
        />
      </AdminSectionCard>

      <AdminSectionCard title="Age Batches" description="Kids / Teens / Adults style group cards.">
        <SimpleListEditor<AgeBatchDb>
          fields={batchFields}
          items={batches}
          emptyItem={{ name: "", ageRange: "", description: "" }}
          onCreate={batchActions.create}
          onUpdate={batchActions.update}
          onDelete={batchActions.remove}
        />
      </AdminSectionCard>
    </div>
  );
}
