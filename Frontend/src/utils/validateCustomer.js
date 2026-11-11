export default function validateCustomer(form) {
  const errors = {}

  if (!form.first_name.trim()) errors.first_name = 'First name is required'
  if (!form.last_name.trim()) errors.last_name = 'Last name is required'

  if (!form.email) errors.email = 'Email is required'
  else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email'

  if (!form.phone) errors.phone = 'Phone number is required'
  else if (!/^\d{10,13}$/.test(form.phone)) errors.phone = 'Phone must be 10 to 13 digits'

  return errors
}