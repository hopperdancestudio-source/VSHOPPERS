import { AdminSectionCard, SimpleListEditor, type FieldConfig } from "@/components/admin/SimpleListEditor";
import { SingletonForm } from "@/components/admin/SingletonForm";
import { getSiteSettings, getStudioHours } from "@/lib/cms";
import { makeCrudActions } from "@/lib/supabase/crudFactory";
import { makeSingletonSaveAction } from "@/lib/supabase/singletonFactory";
import type { SiteSettings } from "@/lib/types";

interface BusinessFormValues {
  studioName: string;
  establishedYear: number;
  copyrightName: string;
}

interface ContactFormValues {
  phone: string;
  email: string;
}

interface AddressFormValues {
  addressLine1: string;
  addressLine2: string;
  city: string;
  region: string;
}

interface BrandingFormValues {
  tagline: string;
  ctaWatermark: string;
  ctaHeading: string;
  ctaBtnLabel: string;
}

interface SeoFormValues {
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;
}

interface SocialFormValues {
  instagramUrl: string;
  youtubeUrl: string;
  whatsappUrl: string;
  mapsUrl: string;
  facebookUrl: string;
  websiteUrl: string;
}

interface StudioHoursDb {
  id: string;
  label: string;
  hours: string;
  closed: boolean;
}

// TestimonialDb removed

const businessFields: FieldConfig<BusinessFormValues>[] = [
  { name: "studioName", label: "Studio Name", type: "text" },
  { name: "establishedYear", label: "Established Year", type: "number" },
  { name: "copyrightName", label: "Copyright Name", type: "text" },
];

const contactFields: FieldConfig<ContactFormValues>[] = [
  { name: "phone", label: "Phone Number", type: "text" },
  { name: "email", label: "Email Address", type: "text" },
];

const addressFields: FieldConfig<AddressFormValues>[] = [
  { name: "addressLine1", label: "Address Line 1", type: "text" },
  { name: "addressLine2", label: "Address Line 2", type: "text" },
  { name: "city", label: "City", type: "text" },
  { name: "region", label: "Region/State", type: "text" },
];

const brandingFields: FieldConfig<BrandingFormValues>[] = [
  { name: "tagline", label: "Tagline / Pitch", type: "text" },
  { name: "ctaWatermark", label: "CTA Banner Watermark (Background Word)", type: "text" },
  { name: "ctaHeading", label: "CTA Banner Heading", type: "text" },
  { name: "ctaBtnLabel", label: "CTA Banner Button Label", type: "text" },
];

const seoFields: FieldConfig<SeoFormValues>[] = [
  { name: "seoTitle", label: "SEO Title", type: "text" },
  { name: "seoDescription", label: "SEO Description", type: "textarea" },
  { name: "ogImageUrl", label: "Open Graph Image (Cloudinary)", type: "media" },
];

const socialFields: FieldConfig<SocialFormValues>[] = [
  { name: "instagramUrl", label: "Instagram URL", type: "text", placeholder: "https://instagram.com/yourstudio" },
  { name: "youtubeUrl", label: "YouTube URL", type: "text", placeholder: "https://youtube.com/@yourstudio" },
  { name: "whatsappUrl", label: "WhatsApp URL", type: "text", placeholder: "https://wa.me/919999999999" },
  { name: "mapsUrl", label: "Google Maps URL", type: "text", placeholder: "https://maps.google.com/..." },
  { name: "facebookUrl", label: "Facebook URL (Optional)", type: "text", placeholder: "https://facebook.com/yourstudio" },
  { name: "websiteUrl", label: "Website URL (Optional)", type: "text", placeholder: "https://yourstudio.com" },
];


const hoursFields: FieldConfig<Omit<StudioHoursDb, "id">>[] = [
  { name: "label", label: "Day Range (e.g. MON – FRI)", type: "text" },
  { name: "hours", label: "Hours (e.g. 04:00 PM – 10:00 PM, or CLOSED)", type: "text" },
  { name: "closed", label: "Closed", type: "checkbox" },
];

// testimonialFields removed

export default async function AdminSettingsPage() {
  const [settings, hours] = await Promise.all([
    getSiteSettings(),
    getStudioHours(),
  ]);

  const saveSettings = makeSingletonSaveAction<Partial<SiteSettings>>("site_settings", [
    "/admin/settings",
    "/",
    "/about",
    "/classes",
    "/schedule",
    "/gallery",
    "/contact",
  ]);

  const hoursActions = makeCrudActions<StudioHoursDb>("studio_hours", ["/admin/settings", "/contact"]);

  return (
    <div className="flex flex-col gap-8">
      <AdminSectionCard title="Business Information" description="Name, year, and copyright information.">
        <SingletonForm<BusinessFormValues>
          fields={businessFields}
          initialData={{
            studioName: settings.studioName,
            establishedYear: settings.establishedYear,
            copyrightName: settings.copyrightName,
          }}
          onSave={saveSettings}
        />
      </AdminSectionCard>

      <AdminSectionCard title="Contact Information" description="Official email and phone coordinates.">
        <SingletonForm<ContactFormValues>
          fields={contactFields}
          initialData={{
            phone: settings.phone,
            email: settings.email,
          }}
          onSave={saveSettings}
        />
      </AdminSectionCard>

      <AdminSectionCard title="Address" description="Studio physical address metadata.">
        <SingletonForm<AddressFormValues>
          fields={addressFields}
          initialData={{
            addressLine1: settings.addressLine1,
            addressLine2: settings.addressLine2,
            city: settings.city,
            region: settings.region,
          }}
          onSave={saveSettings}
        />
      </AdminSectionCard>

      <AdminSectionCard title="Branding" description="Tagline and call-to-action details.">
        <SingletonForm<BrandingFormValues>
          fields={brandingFields}
          initialData={{
            tagline: settings.tagline,
            ctaWatermark: settings.ctaWatermark,
            ctaHeading: settings.ctaHeading,
            ctaBtnLabel: settings.ctaBtnLabel,
          }}
          onSave={saveSettings}
        />
      </AdminSectionCard>

      <AdminSectionCard title="SEO" description="Metadata indexing settings and social card sharing image.">
        <SingletonForm<SeoFormValues>
          fields={seoFields}
          initialData={{
            seoTitle: settings.seoTitle,
            seoDescription: settings.seoDescription,
            ogImageUrl: settings.ogImageUrl,
          }}
          onSave={saveSettings}
        />
      </AdminSectionCard>

      <AdminSectionCard title="Social Links" description="Branded coordinates and URL connections.">
        <SingletonForm<SocialFormValues>
          fields={socialFields}
          initialData={{
            instagramUrl: settings.instagramUrl,
            youtubeUrl: settings.youtubeUrl,
            whatsappUrl: settings.whatsappUrl,
            mapsUrl: settings.mapsUrl,
            facebookUrl: settings.facebookUrl,
            websiteUrl: settings.websiteUrl,
          }}
          onSave={saveSettings}
        />
      </AdminSectionCard>


      <AdminSectionCard title="Studio Hours">
        <SimpleListEditor<StudioHoursDb>
          fields={hoursFields}
          items={hours}
          emptyItem={{ label: "", hours: "", closed: false }}
          onCreate={hoursActions.create}
          onUpdate={hoursActions.update}
          onDelete={hoursActions.remove}
        />
      </AdminSectionCard>
    </div>
  );
}
