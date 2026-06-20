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
        <p><strong>Name:</strong> ${doc.name}</p>
        <p><strong>Email:</strong> ${doc.email}</p>
        <p><strong>Phone:</strong> ${doc.phone || 'N/A'}</p>
        <p><strong>Type:</strong> ${doc.inquiryType}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 5px;">${doc.message}</p>
      `,
    })
    console.log(`[Email] Inquiry notification sent to ${recipientEmail}`)
  } catch (error) {
    console.error('[Email] Failed to send inquiry notification:', error)
  }

  return doc
}
