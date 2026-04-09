import { Check, Package, Truck, MapPin, Clock } from 'lucide-react';

const steps = [
  { key: 'recue', label: 'Commande reçue', icon: Check },
  { key: 'preparation', label: 'En préparation', icon: Package },
  { key: 'livraison', label: 'En livraison', icon: Truck },
  { key: 'livree', label: 'Livrée', icon: MapPin },
];

interface OrderStatusStepperProps {
  statut: string;
}

export function OrderStatusStepper({ statut }: OrderStatusStepperProps) {
  const currentIndex = steps.findIndex(s => s.key === statut);

  if (statut === 'annulee') {
    return (
      <div className="flex items-center justify-center py-4">
        <span className="text-destructive font-medium flex items-center gap-2">
          <Clock className="h-5 w-5" /> Commande annulée
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full max-w-lg mx-auto py-4">
      {steps.map((step, i) => {
        const isDone = i <= currentIndex;
        const Icon = step.icon;
        return (
          <div key={step.key} className="flex flex-col items-center flex-1 relative">
            {i > 0 && (
              <div className={`absolute top-4 right-1/2 w-full h-0.5 -translate-y-1/2 ${i <= currentIndex ? 'bg-secondary' : 'bg-border'}`} style={{ zIndex: 0 }} />
            )}
            <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${isDone ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'}`}>
              <Icon className="h-4 w-4" />
            </div>
            <span className={`mt-1 text-xs text-center ${isDone ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}
