export function FieldError({ message }: { message?: string | null }) {
  if (!message) return null;

  return (
    <p className="text-sm text-red-500 mt-1 flex items-start gap-1 animate-fade-in">
      <span aria-hidden>✕</span>
      <span>{message}</span>
    </p>
  );
}
