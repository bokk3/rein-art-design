export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  projectType: string;
  message: string;
  privacyAccepted: boolean;
  marketingConsent: boolean;
  read: boolean;
  replied: boolean;
  createdAt: Date;
}

export interface ContactMessageFilters {
  search?: string;
  status?: 'read' | 'unread' | 'replied' | 'all';
  sortBy?: 'createdAt' | 'name' | 'email' | 'projectType';
  sortOrder?: 'asc' | 'desc';
}

export interface ContactMessagesPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ContactMessagesResponse {
  messages: ContactMessage[];
  pagination: ContactMessagesPagination;
}