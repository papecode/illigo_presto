import { PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  actionOnClick?: () => void;
}

export function EmptyState({ title, description, actionLabel, actionHref, actionOnClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <PackageOpen className="h-16 w-16 text-muted-foreground/40 mb-4" />
      <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>
      {actionLabel && actionOnClick && (
        <Button type="button" onClick={actionOnClick} className="mt-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
          {actionLabel}
        </Button>
      )}
      {actionLabel && actionHref && !actionOnClick && (
        <Button asChild className="mt-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
          <Link to={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
