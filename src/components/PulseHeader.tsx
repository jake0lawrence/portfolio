import AnimatedSignalPulse from "@/components/AnimatedSignalPulse";

interface PulseHeaderProps {
  id: string | number;
  label: string;
  glow: "gold" | "green" | "indigo";
  className?: string;
}

export default function PulseHeader({ className = "mt-10 mb-4", ...props }: PulseHeaderProps) {
  return (
    <div className={className}>
      <AnimatedSignalPulse {...props} />
    </div>
  );
}
