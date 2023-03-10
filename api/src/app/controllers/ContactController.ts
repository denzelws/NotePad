import { Request, Response } from 'express'
import {
  Contacts,
  ContactsRepository
} from '../repositories/ContactsRepository'

export const index = async (req: Request, res: Response): Promise<void> => {
  const contacts: Contacts[] = await ContactsRepository.findAll()
  res.json(contacts)
}

export const store = async (req: Request, res: Response) => {
  const { id, name, email, phone, category_id } = req.body

  if (!name) {
    return res.status(400).json({ Error: 'Name is required' })
  }

  const contactExists: Contacts | null = ContactsRepository.findByEmail(email)

  if (contactExists) {
    return res.status(400).json({ Error: 'This e-mail is already in use' })
  }

  const contact = await ContactsRepository.create({
    id,
    name,
    email,
    phone,
    category_id
  })

  return res.json(contact)
}

export const show = (req: Request, res: Response) => {
  const { id } = req.params

  const contact: Contacts | null = ContactsRepository.findById(id)

  if (!contact) {
    return res.status(404).json({ error: 'User not found' })
  }

  res.json(contact)
}

export const update = (req: Request, res: Response) => {
  const { id } = req.params

  const { name, email, phone, category_id } = req.body

  if (!name) {
    return res.status(400).json({ Error: 'User not found ' })
  }

  const contactsExists = ContactsRepository.findById(id)

  if (!contactsExists) {
    return res.status(400).json({ Error: 'User not found' })
  }

  const contactByEmail = ContactsRepository.findByEmail(email)

  if (contactByEmail && contactByEmail.id !== id) {
    return res.status(400).json({ Error: 'This e-mail is already in use' })
  }

  const contact = ContactsRepository.update({
    id,
    name,
    email,
    phone,
    category_id
  })

  res.json(contact)
}

export const deleteContact = (req: Request, res: Response) => {
  const { id } = req.params

  const contact: Contacts | null = ContactsRepository.findById(id)

  if (!contact) {
    return res.status(404).json({ error: 'User not found' })
  }

  ContactsRepository.delete(id)
  res.sendStatus(204)
}
