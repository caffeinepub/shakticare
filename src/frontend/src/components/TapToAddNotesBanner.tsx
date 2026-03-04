import { NotebookPen, Plus } from "lucide-react";

interface TapToAddNotesBannerProps {
  /** Determines the data-ocid for this banner */
  ocid: string;
  /** Called when user taps the banner */
  onClick: () => void;
}

/**
 * A warm pink banner visible on every tab/page.
 * - When logged in: opens the relevant add dialog (handled by the parent via onClick).
 * - When not logged in: parent passes a handler that shows a sign-in toast.
 */
export function TapToAddNotesBanner({
  ocid,
  onClick,
}: TapToAddNotesBannerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={ocid}
      className="
        w-full flex items-center gap-3 px-4 py-3.5
        bg-primary/10 border border-primary/20
        rounded-2xl
        hover:bg-primary/15 active:scale-[0.99]
        transition-all duration-150
        group
      "
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
        <NotebookPen className="h-4 w-4 text-primary" />
      </div>

      {/* Text */}
      <div className="flex-1 text-left">
        <p className="text-sm font-semibold text-primary leading-tight">
          📝 Tap to add notes
        </p>
        <p className="text-xs text-primary/70 mt-0.5">
          Save your personal notes here
        </p>
      </div>

      {/* Right icon */}
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <Plus className="h-3.5 w-3.5 text-primary" />
      </div>
    </button>
  );
}
