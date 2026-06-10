import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface RfqEntryDialogProps {
  open: boolean;
  onClose: () => void;
}

interface EntryPoint {
  title: string;
  body: string;
}

function getPoints(value: unknown): EntryPoint[] {
  return Array.isArray(value) ? value.filter((item): item is EntryPoint => (
    typeof item?.title === "string" && typeof item?.body === "string"
  )) : [];
}

export function RfqEntryDialog({ open, onClose }: RfqEntryDialogProps) {
  const { t } = useTranslation("translation", { keyPrefix: "pages.rfq.entry" });
  const inspectionRows = getPoints(t("points", { returnObjects: true }));
  const dispatchLine = t("primaryCta");

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-x-hidden bg-[#101820]/72 px-4 py-6 backdrop-blur-sm transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-entry-title"
    >
      <div
        data-component="quote-entry-minimal-dialog"
        className="w-full max-w-[calc(100vw-32px)] overflow-hidden rounded-sm border border-white/15 bg-white text-[#101820] shadow-2xl sm:max-w-lg"
      >
        <div className="border-b border-[#101820]/10 px-6 py-5 md:px-7">
          <div className="flex items-start justify-between gap-5">
            <h2 id="quote-entry-title" className="min-w-0 text-2xl font-black leading-tight tracking-tight md:text-3xl">
              {t("title")}
            </h2>
            <button
              type="button"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm text-[#101820]/55 transition-colors duration-200 hover:bg-[#101820]/5 hover:text-[#101820] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              aria-label={t("close")}
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-3 hidden max-w-md text-sm leading-7 text-[#101820]/70 sm:block">
            {t("description")}
          </p>
        </div>

        <ul className="divide-y divide-[#101820]/10 px-6 md:px-7">
          {inspectionRows.map((point, index) => (
            <li key={point.title} className="grid grid-cols-[0.75rem_minmax(0,1fr)] gap-3 py-4">
              <span className={index === 1 ? "mt-2 h-2 w-2 bg-blue-600" : "mt-2 h-2 w-2 bg-orange-500"} aria-hidden="true" />
              <p className="min-w-0 text-sm leading-6 text-[#101820]/68">
                <span className="font-bold text-[#101820]">{point.title}</span>
                <span className="mx-1 text-[#101820]/35">:</span>
                <span>{point.body}</span>
              </p>
            </li>
          ))}
        </ul>

        <div className="border-t border-[#101820]/10 px-6 py-5 md:px-7">
          <button
            type="button"
            className="inline-flex h-12 w-full items-center justify-center rounded-sm bg-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-colors duration-200 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            onClick={onClose}
          >
            {dispatchLine}
          </button>
        </div>
      </div>
    </div>
  );
}
