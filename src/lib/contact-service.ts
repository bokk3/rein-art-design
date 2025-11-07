import { ContactMessage, ContactMessageFilters, ContactMessagesResponse } from '../types/contact';

export class ContactMessageService {
  private baseUrl = '/api/contact/messages';

  async getMessages(
    page: number = 1,
    limit: number = 10,
    filters: ContactMessageFilters = {}
  ): Promise<ContactMessagesResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters.search && { search: filters.search }),
      ...(filters.status && filters.status !== 'all' && { status: filters.status }),
      ...(filters.sortBy && { sortBy: filters.sortBy }),
      ...(filters.sortOrder && { sortOrder: filters.sortOrder })
    });

    const response = await fetch(`${this.baseUrl}?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch contact messages');
    }

    return response.json();
  }

  async updateMessage(id: string, updates: { read?: boolean; replied?: boolean }): Promise<ContactMessage> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update contact message');
    }

    return response.json();
  }

  async deleteMessage(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete contact message');
    }
  }

  async markAsRead(id: string): Promise<ContactMessage> {
    return this.updateMessage(id, { read: true });
  }

  async markAsUnread(id: string): Promise<ContactMessage> {
    return this.updateMessage(id, { read: false });
  }

  async markAsReplied(id: string): Promise<ContactMessage> {
    return this.updateMessage(id, { replied: true });
  }
}

export const contactMessageService = new ContactMessageService();