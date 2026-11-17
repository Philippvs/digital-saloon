import { createServer } from 'node:http'

const PORT = Number(process.env.MAIL_CATCHER_PORT ?? 4105)
const HOST = '127.0.0.1'

/**
 * @typedef {{ filename: string; contentType: string; content: string }} CaughtAttachment
 * @typedef {{ id: number; receivedAt: string; from: string; to: string; subject: string; html: string; attachments: CaughtAttachment[] }} CaughtMessage
 */

/** @type {CaughtMessage[]} */
const messages = []
let nextId = 1

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderInboxPage() {
  const itemsHtml =
    messages.length === 0
      ? '<p style="color:#7A6862">Noch keine E-Mails empfangen. Erstelle eine Test-Buchung unter <a href="http://127.0.0.1:3100/book" style="color:#B9540E">http://127.0.0.1:3100/book</a>.</p>'
      : [...messages]
          .reverse()
          .map((msg) => {
            const attachmentsHtml =
              msg.attachments.length > 0
                ? `<div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:8px">${msg.attachments
                    .map(
                      (att, idx) =>
                        `<a href="/emails/${msg.id}/attachments/${idx}" download="${escapeHtml(att.filename)}" style="display:inline-block;padding:6px 12px;border:1px solid #4A3631;border-radius:4px;color:#4A3631;text-decoration:none;font-size:13px;font-weight:600;background:#F2EEEB">Anhang: ${escapeHtml(att.filename)}</a>`,
                    )
                    .join('')}</div>`
                : ''
            return `
          <article style="border:1px solid #E2DCDA;border-radius:8px;padding:18px;margin-bottom:20px;background:#fff">
            <div style="font-size:12px;color:#7A6862;margin-bottom:4px">#${msg.id} · ${escapeHtml(msg.receivedAt)}</div>
            <div style="font-weight:700;font-size:16px;margin-bottom:6px;color:#4A3631">${escapeHtml(msg.subject)}</div>
            <div style="font-size:13px;color:#4A3631;margin-bottom:10px">
              <strong>Von:</strong> ${escapeHtml(msg.from)} · <strong>An:</strong> ${escapeHtml(msg.to)}
            </div>
            ${attachmentsHtml}
            <div style="border-top:1px solid #E8E2DF;margin-top:14px;padding-top:14px">${msg.html}</div>
          </article>`
          })
          .join('')

  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="5" />
  <title>SalonFlow Mail-Catcher (${messages.length})</title>
</head>
<body style="font-family:system-ui,sans-serif;max-width:860px;margin:24px auto;padding:0 16px;background:#F2EEEB;color:#4A3631">
  <header style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
    <div>
      <h1 style="margin:0;font-size:22px">SalonFlow Mail-Catcher</h1>
      <p style="margin:4px 0 0;font-size:13px;color:#7A6862">Lokaler Posteingang für Test-E-Mails (aktualisiert alle 5s · ${messages.length} E-Mail(s))</p>
    </div>
    <form method="post" action="/clear">
      <button type="submit" style="padding:8px 14px;border:1px solid #4A3631;border-radius:6px;background:#fff;color:#4A3631;cursor:pointer;font-weight:600">Posteingang leeren</button>
    </form>
  </header>
  ${itemsHtml}
</body>
</html>`
}

const server = createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/emails') {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}')
        const attachments = Array.isArray(payload.attachments)
          ? payload.attachments.map((att) => ({
              filename: String(att.filename ?? 'attachment.bin'),
              contentType: String(att.contentType ?? 'application/octet-stream'),
              content: String(att.content ?? ''),
            }))
          : []
        const entry = {
          id: nextId++,
          receivedAt: new Date().toISOString(),
          from: String(payload.from ?? ''),
          to: Array.isArray(payload.to) ? payload.to.join(', ') : String(payload.to ?? ''),
          subject: String(payload.subject ?? ''),
          html: String(payload.html ?? ''),
          attachments,
        }
        messages.push(entry)
        console.log(
          `[mail-catcher] #${entry.id} To: ${entry.to} | Subject: ${entry.subject} | Attachments: ${attachments.length}`,
        )
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: true, id: entry.id }))
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: false, error: 'Invalid JSON' }))
      }
    })
    return
  }

  const attachmentMatch =
    req.method === 'GET' && req.url?.match(/^\/emails\/(\d+)\/attachments\/(\d+)$/)
  if (attachmentMatch) {
    const messageId = Number(attachmentMatch[1])
    const attachmentIdx = Number(attachmentMatch[2])
    const message = messages.find((item) => item.id === messageId)
    const attachment = message?.attachments[attachmentIdx]
    if (!attachment) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end('Attachment not found')
      return
    }
    const buffer = Buffer.from(attachment.content, 'base64')
    res.writeHead(200, {
      'Content-Type': attachment.contentType,
      'Content-Disposition': `attachment; filename="${attachment.filename.replace(/"/g, '')}"`,
    })
    res.end(buffer)
    return
  }

  if (req.method === 'GET' && req.url === '/emails') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ emails: messages }))
    return
  }

  if (req.method === 'POST' && req.url === '/clear') {
    messages.length = 0
    res.writeHead(303, { Location: '/' })
    res.end()
    return
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end(renderInboxPage())
})

server.listen(PORT, HOST, () => {
  console.log(`[mail-catcher] Inbox ready at http://${HOST}:${PORT}`)
})
