import type { CollectionAfterChangeHook } from 'payload'

export const emailInquiryNotification: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req: { payload },
}) => {
  // Only send email notifications on new form submissions (create operation)
  if (operation !== 'create') return doc

  try {
    // Fetch SiteSettings to get the contact email address
    const settings = await payload.findGlobal({
      slug: 'site-settings',
    })

    const recipientEmail = settings?.contactEmail || 'hello@jcibangkok.org'

    await payload.sendEmail({
      to: recipientEmail,
      from: 'website@jcibangkok.org',
      subject: `[JCI BKK Website] New ${String(doc.inquiryType).toUpperCase()} Inquiry from ${doc.name}`,
      html: `
        <h2>New Inquiry Received</h2>
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <tbody>
            <tr>
              <th style="padding: 8px; border: 1px solid #ddd; width: 30%;">Name</th>
              <td style="padding: 8px; border: 1px solid #ddd;">${doc.name}</td>
            </tr>
            <tr>
              <th style="padding: 8px; border: 1px solid #ddd;">Email</th>
              <td style="padding: 8px; border: 1px solid #ddd;">${doc.email}</td>
            </tr>
            <tr>
              <th style="padding: 8px; border: 1px solid #ddd;">Phone</th>
              <td style="padding: 8px; border: 1px solid #ddd;">${doc.phone || 'N/A'}</td>
            </tr>
            <tr>
              <th style="padding: 8px; border: 1px solid #ddd;">Type</th>
              <td style="padding: 8px; border: 1px solid #ddd;">${doc.inquiryType}</td>
            </tr>
            <tr>
              <th style="padding: 8px; border: 1px solid #ddd;">Message</th>
              <td style="padding: 8px; border: 1px solid #ddd; white-space: pre-wrap;">${doc.message}</td>
            </tr>
          </tbody>
        </table>
      `,
    })
    console.log(`[Email] Inquiry notification sent to ${recipientEmail}`)
  } catch (error) {
    console.error('[Email] Failed to send inquiry notification:', error)
  }

  return doc
}
