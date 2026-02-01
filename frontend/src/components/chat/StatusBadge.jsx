import { cn } from "../../lib/utils";

export const StatusBadge = ({ status, className }) => {
    const statusConfig = {
        open: {
            label: "Open",
            className: "bg-status-open/20 text-status-open border-status-open/30",
        },
        active: {
            label: "Active",
            className: "bg-status-active/20 text-status-active border-status-active/30",
        },
        archived: {
            label: "Archived",
            className: "bg-status-archived/20 text-status-archived border-status-archived/30",
        },
    };

    const config = statusConfig[status];

    return (
        <span
            className={cn(
                "px-2 py-0.5 text-xs font-medium rounded-full border",
                config.className,
                className
            )}
        >
            {config.label}
        </span>
    );
};
