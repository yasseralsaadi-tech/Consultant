/** Moves focus to the first invalid control after a failed submit (accessibility). */
export function focusFirstInvalid(form: HTMLFormElement | null) {
  window.setTimeout(() => form?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 0);
}
