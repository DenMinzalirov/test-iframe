export interface RegistrationFormData {
  email: string
  password: string
  newsUpdates: boolean
  termsAccepted: boolean
}

export interface ModalProps {
  onClose: () => void
}
