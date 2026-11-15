export type EmailMessage = {
  to: string
  subject: string
  text: string
}

export type EmailSendResult =
  { ok: true; mode: 'resend' | 'log' } | { ok: false; retryable: boolean; error: string }

export function isFunctionsEmulator(): boolean {
  return process.env.FUNCTIONS_EMULATOR === 'true'
}

export function allowLogOnlyDelivery(): boolean {
  if (isFunctionsEmulator()) return true
  return process.env.NOTIFICATIONS_ALLOW_LOG_ONLY === 'true'
}

export function getResendConfig(): { apiKey: string; fromEmail: string } | null {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim()
  if (!apiKey || !fromEmail) return null
  return { apiKey, fromEmail }
}

/**
 * Deliver email via Resend, or log-only in emulator/dev.
 * In production without Resend config, returns a non-ok result (no silent discard).
 */
export async function sendEmail(message: EmailMessage): Promise<EmailSendResult> {
  const resend = getResendConfig()
  if (resend) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resend.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: resend.fromEmail,
          to: [message.to],
          subject: message.subject,
          text: message.text,
        }),
      })
      if (!response.ok) {
        const body = await response.text()
        const retryable = response.status >= 500 || response.status === 429
        return {
          ok: false,
          retryable,
          error: `Resend HTTP ${response.status}: ${body.slice(0, 500)}`,
        }
      }
      return { ok: true, mode: 'resend' }
    } catch (error) {
      return {
        ok: false,
        retryable: true,
        error: error instanceof Error ? error.message : 'Resend request failed',
      }
    }
  }

  if (allowLogOnlyDelivery()) {
    console.info('[notifications] log-only delivery', {
      to: message.to,
      subject: message.subject,
      text: message.text,
    })
    return { ok: true, mode: 'log' }
  }

  return {
    ok: false,
    retryable: true,
    error: 'RESEND_API_KEY/RESEND_FROM_EMAIL missing; refusing silent discard in production.',
  }
}

export function messageForNotificationJob(input: {
  type: string
  toEmail: string
  payload: Record<string, unknown>
}): EmailMessage {
  const serviceName = String(input.payload.serviceName ?? 'Termin')
  const startAt = String(input.payload.startAt ?? '')
  const firstName = String(input.payload.firstName ?? '')
  const greeting = firstName ? `Hallo ${firstName},` : 'Hallo,'

  const subjects: Record<string, string> = {
    RESERVATION_CREATED: `Buchungsanfrage: ${serviceName}`,
    RESERVATION_CONFIRMED: `Termin bestätigt: ${serviceName}`,
    RESERVATION_DECLINED: `Buchung abgelehnt: ${serviceName}`,
    RESERVATION_CANCELLED: `Termin storniert: ${serviceName}`,
    RESERVATION_RESCHEDULED: `Termin verschoben: ${serviceName}`,
    RESERVATION_EXPIRED: `Buchungsanfrage abgelaufen: ${serviceName}`,
  }

  const bodies: Record<string, string> = {
    RESERVATION_CREATED: `${greeting}\n\nIhre Buchungsanfrage für ${serviceName} am ${startAt} ist eingegangen und wartet auf Bestätigung.`,
    RESERVATION_CONFIRMED: `${greeting}\n\nIhr Termin für ${serviceName} am ${startAt} wurde bestätigt.`,
    RESERVATION_DECLINED: `${greeting}\n\nIhre Buchungsanfrage für ${serviceName} am ${startAt} wurde leider abgelehnt. Bitte kontaktieren Sie den Salon telefonisch.`,
    RESERVATION_CANCELLED: `${greeting}\n\nIhr Termin für ${serviceName} am ${startAt} wurde storniert.`,
    RESERVATION_RESCHEDULED: `${greeting}\n\nIhr Termin für ${serviceName} wurde auf ${startAt} verschoben.`,
    RESERVATION_EXPIRED: `${greeting}\n\nIhre Buchungsanfrage für ${serviceName} am ${startAt} ist abgelaufen, weil sie nicht rechtzeitig bestätigt wurde.`,
  }

  return {
    to: input.toEmail,
    subject: subjects[input.type] ?? `SalonFlow: ${input.type}`,
    text: bodies[input.type] ?? `${greeting}\n\nStatusupdate zu Ihrem Termin (${serviceName}).`,
  }
}
