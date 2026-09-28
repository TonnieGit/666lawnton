"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { buttonClass } from "@/components/ButtonLink";

// PHASE 1 DEMO: this form validates and shows a success message but DOES NOT
// SEND ANYTHING. Phase 2: submit via Wix Forms or a service like Resend
// (destination to be confirmed with the client, spec §7 Contact / §13).

type Fields = { firstName: string; lastName: string; email: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.email.trim()) e.email = "Please enter your email.";
  else if (!EMAIL_RE.test(f.email.trim())) e.email = "Please enter a valid email address.";
  if (!f.message.trim()) e.message = "Please enter a message.";
  return e;
}

export function ContactForm({ successMessage }: { successMessage: string }) {
  const params = useSearchParams();
  const artist = params.get("artist");
  const initialMessage = artist
    ? `Hi, I'd like to enquire about a tattoo with ${artist.charAt(0).toUpperCase()}${artist.slice(1)}.`
    : "";

  const [fields, setFields] = useState<Fields>({ firstName: "", lastName: "", email: "", message: initialMessage });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields((f) => ({ ...f, [k]: e.target.value }));

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      (e.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    // Demo only: nothing is sent.
    setSent(true);
  }

  if (sent) {
    return (
      <div role="status" className="border border-brass/40 bg-ink-2 p-8">
        <p className="font-display text-2xl">Message received</p>
        <p className="mt-3 text-bone/85">{successMessage}</p>
        <p className="mt-4 text-xs text-muted">(Demo: messages aren’t sent yet.)</p>
      </div>
    );
  }

  const input = "mt-2 w-full rounded-xl border border-bone/30 bg-ink-2 px-4 py-3 aria-[invalid=true]:border-blood-bright";

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="firstName" className="text-sm font-medium">
          First Name
        </label>
        <input id="firstName" name="firstName" autoComplete="given-name" value={fields.firstName} onChange={set("firstName")} className={input} />
      </div>
      <div>
        <label htmlFor="lastName" className="text-sm font-medium">
          Last Name
        </label>
        <input id="lastName" name="lastName" autoComplete="family-name" value={fields.lastName} onChange={set("lastName")} className={input} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email <span aria-hidden="true" className="text-blood-bright">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          value={fields.email}
          onChange={set("email")}
          className={input}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-blood-bright">
            {errors.email}
          </p>
        )}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="message" className="text-sm font-medium">
          Message <span aria-hidden="true" className="text-blood-bright">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          value={fields.message}
          onChange={set("message")}
          className={input}
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-sm text-blood-bright">
            {errors.message}
          </p>
        )}
      </div>
      <div className="sm:col-span-2">
        <button
          type="submit"
          className={buttonClass()}
        >
          Send
        </button>
      </div>
    </form>
  );
}
