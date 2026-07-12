import { AdminSectionCard, SimpleListEditor, type FieldConfig } from "@/components/admin/SimpleListEditor";
import { getFaqItems } from "@/lib/cms";
import { makeCrudActions } from "@/lib/supabase/crudFactory";

interface FaqItemDb {
  id: string;
  question: string;
  answer: string;
}

const faqFields: FieldConfig<Omit<FaqItemDb, "id">>[] = [
  { name: "question", label: "Question", type: "text" },
  { name: "answer", label: "Answer", type: "textarea" },
];

export default async function AdminFaqsPage() {
  const faqs = await getFaqItems();
  const actions = makeCrudActions<FaqItemDb>("faqs", ["/admin/faqs", "/contact"]);

  return (
    <div>
      <AdminSectionCard title="Frequently Asked Questions" description="Rendered as an accordion on the Contact page.">
        <SimpleListEditor<FaqItemDb>
          fields={faqFields}
          items={faqs}
          emptyItem={{ question: "", answer: "" }}
          onCreate={actions.create}
          onUpdate={actions.update}
          onDelete={actions.remove}
        />
      </AdminSectionCard>
    </div>
  );
}
