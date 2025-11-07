"use client";

import { useState } from 'react';
import { ContactMessage } from '../../types/contact';
import { ContactMessageList } from './contact-message-list';
import { ContactMessageDetail } from './contact-message-detail';

export function ContactMessageManagement() {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleMessageSelect = (message: ContactMessage) => {
    setSelectedMessage(message);
  };

  const handleCloseDetail = () => {
    setSelectedMessage(null);
  };

  const handleUpdate = () => {
    setRefreshKey(prev => prev + 1);
    setSelectedMessage(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Contact Messages</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Click on a message to view details
        </div>
      </div>

      <ContactMessageList
        key={refreshKey}
        onMessageSelect={handleMessageSelect}
      />

      {selectedMessage && (
        <ContactMessageDetail
          message={selectedMessage}
          onClose={handleCloseDetail}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}