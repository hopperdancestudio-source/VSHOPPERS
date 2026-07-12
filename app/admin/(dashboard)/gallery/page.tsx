import { AdminSectionCard } from "@/components/admin/SimpleListEditor";
import { GalleryItemsEditor } from "@/components/admin/GalleryItemsEditor";
import { GalleryCategoriesEditor } from "@/components/admin/GalleryCategoriesEditor";
import { getGalleryItems, getGalleryCategories } from "@/lib/cms";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "./actions";

export default async function AdminGalleryPage() {
  const [items, categories] = await Promise.all([
    getGalleryItems(),
    getGalleryCategories(),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <AdminSectionCard
        title="Gallery Categories"
        description="Add, rename, delete, and drag & drop to reorder gallery filters."
      >
        <GalleryCategoriesEditor
          categories={categories}
          onCreate={createCategory}
          onUpdate={updateCategory}
          onDelete={deleteCategory}
          onReorder={reorderCategories}
        />
      </AdminSectionCard>

      <AdminSectionCard
        title="Gallery Items"
        description="Configure media files, map them to CMS categories, and define optional display titles."
      >
        <GalleryItemsEditor
          items={items}
          categories={categories}
          onCreate={createGalleryItem}
          onUpdate={updateGalleryItem}
          onDelete={deleteGalleryItem}
        />
      </AdminSectionCard>
    </div>
  );
}
