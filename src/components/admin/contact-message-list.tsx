"use client";

import { useState, useEffect } from 'react';
import { ContactMessage, ContactMessageFilters, ContactMessagesResponse } from '../../types/contact';
import { contactMessageService } from '../../lib/contact-service';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { DeleteConfirmation } from './delete-confirmation';

interface ContactMessageListProps {
  onMessageSelect?: (message: ContactMessage) => void;
}

export function ContactMessageList({ onMessageSelect }: ContactMessageListProps) {
  const [data, setData] = useState<ContactMessagesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<ContactMessageFilters>({
    search: '',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; messageId: string; messageName: string }>({
    show: false,
    messageId: '',
    messageName: ''
  });

  const loadMessages = async (page: number = currentPage) => {
    try {
      setLoading(true);
      setError(null);
      const response = await contactMessageService.getMessages(page, 10, filters);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages(1);
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    loadMessages();
  }, [currentPage]);

  const handleStatusChange = async (messageId: string, field: 'read' | 'replied', value: boolean) => {
    try {
      await contactMessageService.updateMessage(messageId, { [field]: value });
      await loadMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update message');
    }
  };

  const handleDelete = async (messageId: string) => {
    try {
      await contactMessageService.deleteMessage(messageId);
      setDeleteConfirm({ show: false, messageId: '', messageName: '' });
      await loadMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete message');
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">{error}</p>
        <Button
          onClick={() => loadMessages()}
          className="mt-2"
          variant="outline"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filters */}
      <div className="glass border border-white/20 dark:border-gray-700/30 p-4 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search messages..."
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <Select
            value={filters.status || 'all'}
            onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </Select>
          <Select
            value={filters.sortBy || 'createdAt'}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
          >
            <option value="createdAt">Date</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="projectType">Project Type</option>
          </Select>
          <Select
            value={filters.sortOrder || 'desc'}
            onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value as any })}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </Select>
        </div>
      </div>

      {/* Messages List */}
      <div className="glass border border-white/20 dark:border-gray-700/30 rounded-xl shadow-lg overflow-hidden">
        {data?.messages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No contact messages found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Project Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Message Preview
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {data?.messages.map((message) => (
                  <tr
                    key={message.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${
                      !message.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                    onClick={() => onMessageSelect?.(message)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            message.read
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {message.read ? 'Read' : 'Unread'}
                        </span>
                        {message.replied && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Replied
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {message.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {message.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {message.projectType}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate">
                        {message.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(message.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(message.id, 'read', !message.read);
                        }}
                        variant="outline"
                        size="sm"
                      >
                        {message.read ? 'Mark Unread' : 'Mark Read'}
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(message.id, 'replied', !message.replied);
                        }}
                        variant="outline"
                        size="sm"
                      >
                        {message.replied ? 'Mark Not Replied' : 'Mark Replied'}
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm({
                            show: true,
                            messageId: message.id,
                            messageName: message.name
                          });
                        }}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.pagination.pages > 1 && (
          <div className="bg-white dark:bg-gray-800/50 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentPage(Math.min(data.pagination.pages, currentPage + 1))}
                  disabled={currentPage === data.pagination.pages}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing{' '}
                    <span className="font-medium">
                      {(currentPage - 1) * 10 + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * 10, data.pagination.total)}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">{data.pagination.total}</span>{' '}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <Button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      variant="outline"
                      className="rounded-l-md"
                    >
                      Previous
                    </Button>
                    {Array.from({ length: data.pagination.pages }, (_, i) => i + 1)
                      .filter(page => 
                        page === 1 || 
                        page === data.pagination.pages || 
                        Math.abs(page - currentPage) <= 2
                      )
                      .map((page, index, array) => (
                        <div key={page} className="flex">
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-3 py-2 text-gray-500">...</span>
                          )}
                          <Button
                            onClick={() => setCurrentPage(page)}
                            variant={currentPage === page ? "default" : "outline"}
                            className="rounded-none"
                          >
                            {page}
                          </Button>
                        </div>
                      ))}
                    <Button
                      onClick={() => setCurrentPage(Math.min(data.pagination.pages, currentPage + 1))}
                      disabled={currentPage === data.pagination.pages}
                      variant="outline"
                      className="rounded-r-md"
                    >
                      Next
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={deleteConfirm.show}
        onCancel={() => setDeleteConfirm({ show: false, messageId: '', messageName: '' })}
        onConfirm={() => handleDelete(deleteConfirm.messageId)}
        title="Delete Contact Message"
        message={`Are you sure you want to delete the message from ${deleteConfirm.messageName}? This action cannot be undone.`}
      />
    </div>
  );
}