import { Resend } from 'resend'

let cachedClient: { apiKey: string; client: Resend } | null = null

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) return null
  if (!cachedClient || cachedClient.apiKey !== apiKey) {
    cachedClient = { apiKey, client: new Resend(apiKey) }
  }
  return cachedClient.client
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatIcsUtc(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z')
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
}

function foldIcsLine(line: string): string {
  const chunks: string[] = []
  let rest = line
  while (rest.length > 75) {
    chunks.push(rest.slice(0, 75))
    rest = ` ${rest.slice(75)}`
  }
  chunks.push(rest)
  return chunks.join('\r\n')
}

export type BookingEmailInput = {
  reservationId: string
  to: string
  firstName: string
  lastName: string
  serviceName: string
  durationMinutes: number
  startAt: Date
  status: 'PENDING' | 'CONFIRMED'
  managementToken: string
  notes: string | null
  timeZone?: string
  salonName?: string
  salonAddress?: string
  salonPhone?: string
}

export function buildBookingIcs(input: BookingEmailInput, manageUrl: string | null): string {
  const endAt = new Date(input.startAt.getTime() + input.durationMinutes * 60_000)
  const salonName = input.salonName?.trim() || 'SalonFlow'
  const summary = `${input.serviceName} — ${salonName}`
  const descriptionParts = [
    `Leistung(en): ${input.serviceName}`,
    `Dauer: ${input.durationMinutes} Minuten`,
    ...(input.notes ? [`Notiz: ${input.notes}`] : []),
    ...(manageUrl ? [`Termin verwalten: ${manageUrl}`] : []),
  ]

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SalonFlow//Booking//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${input.reservationId}@salonflow.local`,
    `DTSTAMP:${formatIcsUtc(new Date())}`,
    `DTSTART:${formatIcsUtc(input.startAt)}`,
    `DTEND:${formatIcsUtc(endAt)}`,
    `SUMMARY:${escapeIcsText(summary)}`,
    `DESCRIPTION:${escapeIcsText(descriptionParts.join('\n'))}`,
    ...(input.salonAddress ? [`LOCATION:${escapeIcsText(input.salonAddress)}`] : []),
    `STATUS:${input.status === 'CONFIRMED' ? 'CONFIRMED' : 'TENTATIVE'}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  return `${lines.map(foldIcsLine).join('\r\n')}\r\n`
}

function buildBookingEmailHtml(input: BookingEmailInput, manageUrl: string | null): string {
  const timeZone = input.timeZone ?? 'Europe/Vienna'
  const endAt = new Date(input.startAt.getTime() + input.durationMinutes * 60_000)
  const salonName = input.salonName?.trim() || 'SalonFlow'

  const dateFormatted = new Intl.DateTimeFormat('de-AT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone,
  }).format(input.startAt)

  const startTimeFormatted = new Intl.DateTimeFormat('de-AT', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  }).format(input.startAt)

  const endTimeFormatted = new Intl.DateTimeFormat('de-AT', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  }).format(endAt)

  const isConfirmed = input.status === 'CONFIRMED'
  const statusLabel = isConfirmed ? 'Termin bestätigt' : 'Anfrage eingegangen'
  const statusBg = isConfirmed ? '#E2701F' : '#4A3631'
  const introText = isConfirmed
    ? `Hallo ${escapeHtml(input.firstName)}, Ihr Termin ist fest für Sie reserviert.`
    : `Hallo ${escapeHtml(input.firstName)}, wir haben Ihre Anfrage erhalten und melden uns in Kürze.`

  const notesRow = input.notes
    ? `
      <tr>
        <td style="padding:10px 0;border-top:1px solid #E8E2DF;color:#7A6862;font-size:13px;vertical-align:top;width:120px;">Ihre Notiz</td>
        <td style="padding:10px 0;border-top:1px solid #E8E2DF;color:#4A3631;font-size:14px;line-height:1.5;">${escapeHtml(input.notes)}</td>
      </tr>`
    : ''

  const addressRow = input.salonAddress
    ? `
      <tr>
        <td style="padding:10px 0;border-top:1px solid #E8E2DF;color:#7A6862;font-size:13px;vertical-align:top;width:120px;">Adresse</td>
        <td style="padding:10px 0;border-top:1px solid #E8E2DF;color:#4A3631;font-size:14px;">${escapeHtml(input.salonAddress)}</td>
      </tr>`
    : ''

  const manageSection = manageUrl
    ? `
      <div style="margin-top:24px;">
        <a href="${escapeHtml(manageUrl)}" style="display:inline-block;background-color:#4A3631;color:#FFFFFF;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:4px;">
          Termin verwalten oder stornieren
        </a>
      </div>`
    : ''

  const footerContact = [input.salonAddress, input.salonPhone]
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    .map(escapeHtml)
    .join(' · ')

  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
</head>
<body style="margin:0;padding:0;background-color:#F2EEEB;font-family:'Helvetica Neue',Arial,sans-serif;color:#4A3631;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F2EEEB;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background-color:#FFFFFF;border:1px solid #E2DCDA;border-top:4px solid #E2701F;border-radius:4px;overflow:hidden;">
          <tr>
            <td style="padding:28px 28px 24px 28px;">
              <div style="font-size:18px;font-weight:700;letter-spacing:-0.01em;color:#4A3631;margin-bottom:20px;">
                ${escapeHtml(salonName)}
              </div>

              <div style="display:inline-block;background-color:${statusBg};color:#FFFFFF;font-size:12px;font-weight:600;padding:4px 10px;border-radius:4px;margin-bottom:14px;">
                ${statusLabel}
              </div>

              <h1 style="margin:0 0 6px 0;font-size:22px;line-height:1.25;font-weight:700;letter-spacing:-0.02em;color:#4A3631;">
                ${escapeHtml(dateFormatted)}
              </h1>
              <div style="font-size:16px;font-weight:600;color:#B9540E;margin-bottom:16px;font-variant-numeric:tabular-nums;">
                ${escapeHtml(startTimeFormatted)} – ${escapeHtml(endTimeFormatted)} Uhr
              </div>

              <p style="margin:0 0 22px 0;font-size:15px;line-height:1.55;color:#4A3631;">
                ${introText}
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                <tr>
                  <td style="padding:10px 0;border-top:1px solid #E8E2DF;color:#7A6862;font-size:13px;vertical-align:top;width:120px;">Leistung(en)</td>
                  <td style="padding:10px 0;border-top:1px solid #E8E2DF;color:#4A3631;font-size:14px;font-weight:600;">${escapeHtml(input.serviceName)}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-top:1px solid #E8E2DF;color:#7A6862;font-size:13px;vertical-align:top;width:120px;">Dauer</td>
                  <td style="padding:10px 0;border-top:1px solid #E8E2DF;color:#4A3631;font-size:14px;">${input.durationMinutes} Minuten</td>
                </tr>
                ${addressRow}
                ${notesRow}
              </table>

              ${manageSection}

              <p style="margin:22px 0 0 0;padding:12px 14px;background-color:#F2EEEB;border-radius:4px;font-size:13px;line-height:1.5;color:#4A3631;">
                Im Anhang finden Sie die Kalenderdatei <strong>termin.ics</strong>, um den Termin direkt in Ihren Kalender einzutragen.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px;border-top:1px solid #E8E2DF;background-color:#FAF8F7;font-size:12px;color:#7A6862;line-height:1.5;">
              <strong style="color:#4A3631;">${escapeHtml(salonName)}</strong>${footerContact ? ` · ${footerContact}` : ''}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

/**
 * Sends at most one confirmation/request email per newly created online booking.
 * Uses local MAIL_CATCHER_URL when set (avoiding Resend quota in dev/tests),
 * no-ops when RESEND_API_KEY is unset, and never throws.
 */
export async function sendBookingConfirmationEmail(input: BookingEmailInput): Promise<void> {
  const mailCatcherUrl = process.env.MAIL_CATCHER_URL?.trim()
  const resend = mailCatcherUrl ? null : getResendClient()
  if (!mailCatcherUrl && !resend) {
    return
  }

  const from = process.env.RESEND_FROM_EMAIL?.trim() || 'onboarding@resend.dev'
  const timeZone = input.timeZone ?? 'Europe/Vienna'
  const whenFormatted = new Intl.DateTimeFormat('de-AT', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone,
  }).format(input.startAt)

  const salonName = input.salonName?.trim() || 'SalonFlow'
  const isConfirmed = input.status === 'CONFIRMED'
  const subject = isConfirmed
    ? `${salonName}: Terminbestätigung am ${whenFormatted}`
    : `${salonName}: Terminanfrage am ${whenFormatted}`

  const publicBaseUrl = process.env.PUBLIC_APP_URL?.trim().replace(/\/+$/, '')
  const manageUrl = publicBaseUrl
    ? `${publicBaseUrl}/manage/${encodeURIComponent(input.managementToken)}`
    : null

  const html = buildBookingEmailHtml(input, manageUrl)
  const icsContent = buildBookingIcs(input, manageUrl)
  const icsBase64 = Buffer.from(icsContent, 'utf8').toString('base64')

  try {
    if (mailCatcherUrl) {
      const response = await fetch(mailCatcherUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from,
          to: input.to,
          subject,
          html,
          attachments: [
            {
              filename: 'termin.ics',
              contentType: 'text/calendar; charset=utf-8; method=PUBLISH',
              content: icsBase64,
            },
          ],
        }),
      })
      if (!response.ok) {
        console.error('[email] Mail-Catcher returned HTTP', response.status)
      }
      return
    }

    const response = await resend!.emails.send({
      from,
      to: input.to,
      subject,
      html,
      attachments: [
        {
          filename: 'termin.ics',
          content: Buffer.from(icsContent, 'utf8'),
          contentType: 'text/calendar; charset=utf-8; method=PUBLISH',
        },
      ],
    })
    if (response.error) {
      console.error('[email] Resend returned an error:', response.error)
    }
  } catch (error) {
    console.error('[email] Failed to send booking email:', error)
  }
}
