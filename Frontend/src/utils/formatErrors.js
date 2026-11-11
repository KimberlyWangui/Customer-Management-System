export default function formatErrors(laravelErrors) {
  const errors = {}
  for (const [field, messages] of Object.entries(laravelErrors)) {
    errors[field] = messages[0]
  }
  return errors
}