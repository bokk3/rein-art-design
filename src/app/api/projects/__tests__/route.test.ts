import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { GET, POST } from '../route'
import { NextRequest } from 'next/server'
import { ProjectService } from '@/lib/project-service'
import { requireEditor, AuthError } from '@/lib/auth-middleware'

// Mock dependencies
vi.mock('@/lib/project-service')
vi.mock('@/lib/auth-middleware')

const mockProjectService = ProjectService as any
const mockRequireEditor = requireEditor as any

describe('/api/projects', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('GET', () => {
    it('should return published projects for public requests', async () => {
      const mockProjects = [
        {
          id: '1',
          published: true,
          featured: false,
          translations: [{ title: 'Test Project' }],
          images: [],
          createdAt: '2025-11-05T00:21:24.321Z'
        }
      ]

      mockProjectService.getProjects.mockResolvedValue(mockProjects)

      const request = new NextRequest('http://localhost:3000/api/projects')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(mockProjectService.getProjects).toHaveBeenCalledWith({
        published: true,
        featured: undefined,
        contentTypeId: undefined,
        languageId: undefined,
        search: undefined,
        page: 1,
        limit: 10
      })
      expect(data.projects).toEqual(mockProjects)
      expect(data.total).toBe(1)
      expect(data.page).toBe(1)
      expect(data.limit).toBe(10)
      expect(data.totalPages).toBe(1)
    })

    it('should apply search filter', async () => {
      mockProjectService.getProjects.mockResolvedValue([])

      const request = new NextRequest('http://localhost:3000/api/projects?search=test&published=false')
      await GET(request)

      expect(mockProjectService.getProjects).toHaveBeenCalledWith({
        published: true, // Public requests always get published: true
        featured: undefined,
        contentTypeId: undefined,
        languageId: undefined,
        search: 'test',
        page: 1,
        limit: 10
      })
    })

    it('should apply pagination', async () => {
      mockProjectService.getProjects.mockResolvedValue([])

      const request = new NextRequest('http://localhost:3000/api/projects?page=2&limit=5')
      await GET(request)

      expect(mockProjectService.getProjects).toHaveBeenCalledWith({
        published: true,
        featured: undefined,
        contentTypeId: undefined,
        languageId: undefined,
        search: undefined,
        page: 2,
        limit: 5
      })
    })

    it('should handle admin requests with authentication', async () => {
      mockRequireEditor.mockResolvedValue({ id: 'user1', role: 'admin' })
      mockProjectService.getProjects.mockResolvedValue([])

      const request = new NextRequest('http://localhost:3000/api/projects', {
        headers: { 'cookie': 'better-auth=token' }
      })
      await GET(request)

      expect(mockRequireEditor).toHaveBeenCalledWith(request)
      expect(mockProjectService.getProjects).toHaveBeenCalledWith({
        published: undefined, // Admin can see all projects
        featured: undefined,
        contentTypeId: undefined,
        languageId: undefined,
        search: undefined,
        page: 1,
        limit: 10
      })
    })

    it('should handle service errors', async () => {
      mockProjectService.getProjects.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/projects')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to fetch projects')
    })
  })

  describe('POST', () => {
    const mockUser = { id: 'user1', role: 'admin', name: 'Test User', email: 'test@example.com' }

    it('should create project with valid data', async () => {
      const projectData = {
        contentTypeId: 'ct1',
        featured: false,
        published: true,
        translations: [
          {
            languageId: 'l1',
            title: 'Test Project',
            description: 'Test description',
            materials: ['wood', 'metal']
          }
        ],
        images: [
          {
            originalUrl: '/uploads/test.jpg',
            thumbnailUrl: '/uploads/thumb-test.jpg',
            alt: 'Test image',
            order: 0
          }
        ]
      }

      const mockCreatedProject = {
        id: '1',
        ...projectData,
        createdBy: mockUser.id,
        createdAt: '2025-11-05T00:21:24.363Z',
        updatedAt: '2025-11-05T00:21:24.363Z'
      }

      mockRequireEditor.mockResolvedValue(mockUser)
      mockProjectService.createProject.mockResolvedValue(mockCreatedProject)

      const request = new NextRequest('http://localhost:3000/api/projects', {
        method: 'POST',
        body: JSON.stringify(projectData),
        headers: { 'content-type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(mockRequireEditor).toHaveBeenCalledWith(request)
      expect(mockProjectService.createProject).toHaveBeenCalledWith({
        contentTypeId: 'ct1',
        featured: false,
        published: true,
        createdBy: mockUser.id,
        translations: projectData.translations,
        images: projectData.images
      })
      expect(data.project).toEqual(mockCreatedProject)
    })

    it('should require authentication', async () => {
      const authError = new AuthError('Authentication required', 401)
      mockRequireEditor.mockRejectedValue(authError)

      const projectData = {
        contentTypeId: 'ct1',
        translations: [
          {
            languageId: 'l1',
            title: 'Test Project',
            description: 'Test description',
            materials: []
          }
        ]
      }

      const request = new NextRequest('http://localhost:3000/api/projects', {
        method: 'POST',
        body: JSON.stringify(projectData),
        headers: { 'content-type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Authentication required')
    })

    it('should validate required fields', async () => {
      mockRequireEditor.mockResolvedValue(mockUser)

      const request = new NextRequest('http://localhost:3000/api/projects', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'content-type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Content type and at least one translation are required')
    })

    it('should validate translation fields', async () => {
      mockRequireEditor.mockResolvedValue(mockUser)

      const projectData = {
        contentTypeId: 'ct1',
        translations: [
          {
            languageId: 'l1',
            // Missing title
            description: 'Test description',
            materials: []
          }
        ]
      }

      const request = new NextRequest('http://localhost:3000/api/projects', {
        method: 'POST',
        body: JSON.stringify(projectData),
        headers: { 'content-type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Each translation must have languageId and title')
    })

    it('should handle service errors', async () => {
      mockRequireEditor.mockResolvedValue(mockUser)
      mockProjectService.createProject.mockRejectedValue(new Error('Database error'))

      const projectData = {
        contentTypeId: 'ct1',
        translations: [
          {
            languageId: 'l1',
            title: 'Test Project',
            description: 'Test description',
            materials: []
          }
        ]
      }

      const request = new NextRequest('http://localhost:3000/api/projects', {
        method: 'POST',
        body: JSON.stringify(projectData),
        headers: { 'content-type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to create project')
    })
  })
})