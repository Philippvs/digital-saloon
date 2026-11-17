import type { FieldIssue } from '../data/settingsForm'
import type { TranslateFn } from '../i18n'

export function fieldIssueMessage(t: TranslateFn, issue: FieldIssue): string {
  switch (issue.kind) {
    case 'range':
      return t('admin.rangeError', { min: issue.min, max: issue.max })
    case 'required':
      return t('admin.requiredError')
    case 'email':
      return t('admin.emailError')
    case 'tooLong':
      return t('admin.tooLongError', { max: issue.max })
    case 'price':
      return t('admin.priceError')
  }
}

export function fieldIssueMessages<Field extends string>(
  t: TranslateFn,
  issues: Partial<Record<Field, FieldIssue>>,
): Partial<Record<Field, string>> {
  const messages: Partial<Record<Field, string>> = {}
  for (const [field, issue] of Object.entries(issues) as Array<[Field, FieldIssue]>) {
    messages[field] = fieldIssueMessage(t, issue)
  }
  return messages
}
