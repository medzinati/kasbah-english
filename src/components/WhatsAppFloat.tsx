import { getWhatsAppHref } from "@/lib/site-contact";

type WhatsAppFloatProps = {
  label: string;
  prefill: string;
};

export function WhatsAppFloat({ label, prefill }: WhatsAppFloatProps) {
  return (
    <a
      className="whatsapp-float"
      href={getWhatsAppHref(prefill)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      <svg viewBox="0 0 32 32" aria-hidden="true" width="28" height="28">
        <path
          fill="currentColor"
          d="M16.01 3C9.39 3 4 8.37 4 14.95c0 2.1.55 4.14 1.6 5.95L4 29l8.3-1.56a12.1 12.1 0 0 0 3.71.58c6.62 0 12-5.37 12-11.95C28.01 8.37 22.63 3 16.01 3zm0 21.75c-1.2 0-2.38-.22-3.49-.66l-.25-.1-4.93.93.93-4.8-.16-.27a9.7 9.7 0 0 1-1.48-5.17c0-5.37 4.4-9.74 9.82-9.74s9.82 4.37 9.82 9.74-4.4 9.74-9.82 9.74zm5.4-7.3c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.23 5.14 4.53.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z"
        />
      </svg>
      <span className="whatsapp-float-label">{label}</span>
    </a>
  );
}
