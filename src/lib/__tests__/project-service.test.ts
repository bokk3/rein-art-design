import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { ProjectService } from '../project-service'
import { prisma } from '../db'

// Mock Prisma
vi.mock('../db', () => ({
  prisma: {
    project: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    projectTranslation: {
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
    projectImage: {
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}))

const mockPrisma = prisma as any

describe('ProjectService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('getProjects', () => {
    it('should fetch projects with default filters', async () => {
      const mockProjects = [
        {
          id: '1',
          contentTypeId: 'ct1',
          featured: false,
          published: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          translations: [],
          images: [],
          contentType: { id: 'ct1', name: 'projects' },
          creator: { id: 'u1', name: 'Test User', email: 'test@example.com' }
        }
      ]

      mockPrisma.project.findMany.mockResolvedValue(mockProjects)

      const result = await ProjectService.getProjects()

      expect(mockPrisma.project.findMany).toHaveBeenCalledWith({
        where: {},
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' }
      })
      expect(result).toEqual(mockProjects)
    })

    it('should apply published filter', async () => {
      mockPrisma.project.findMany.mockResolvedValue([])

      await ProjectService.getProjects({ published: true })

      expect(mockPrisma.project.findMany).toHaveBeenCalledWith({
        where: { published: true },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' }
      })
    })

    it('should apply search filter', async () => {
      mockPrisma.project.findMany.mockResolvedValue([])

      await ProjectService.getProjects({ search: 'test' })

      expect(mockPrisma.project.findMany).toHaveBeenCalledWith({
        where: {
          translations: {
            some: {
              OR: [
                {
                  title: {
                    contains: 'test',
                    mode: 'insensitive'
                  }
                },
                {
                  materials: {
                    hasSome: ['test']
                  }
                }
              ]
            }
          }
        },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' }
      })
    })
  })

  describe('getProjectById', () => {
    it('should fetch project by id', async () => {
      const mockProject = {
        id: '1',
        contentTypeId: 'ct1',
        featured: false,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        translations: [],
        images: [],
        contentType: { id: 'ct1', name: 'projects' },
        creator: { id: 'u1', name: 'Test User', email: 'test@example.com' }
      }

      mockPrisma.project.findUnique.mockResolvedValue(mockProject)

      const result = await ProjectService.getProjectById('1')

      expect(mockPrisma.project.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: expect.any(Object)
      })
      expect(result).toEqual(mockProject)
    })
  })

  describe('createProject', () => {
    it('should create project with translations and images', async () => {
      const createData = {
        contentTypeId: 'ct1',
        featured: false,
        published: true,
        createdBy: 'u1',
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
        ...createData,
        createdAt: new Date(),
        updatedAt: new Date(),
        translations: [],
        images: [],
        contentType: { id: 'ct1', name: 'projects' },
        creator: { id: 'u1', name: 'Test User', email: 'test@example.com' }
      }

      mockPrisma.project.create.mockResolvedValue(mockCreatedProject)

      const result = await ProjectService.createProject(createData)

      expect(mockPrisma.project.create).toHaveBeenCalledWith({
        data: {
          contentTypeId: 'ct1',
          featured: false,
          published: true,
          createdBy: 'u1',
          translations: {
            create: createData.translations
          },
          images: {
            create: createData.images
          }
        },
        include: expect.any(Object)
      })
      expect(result).toEqual(mockCreatedProject)
    })

    it('should create project without images', async () => {
      const createData = {
        contentTypeId: 'ct1',
        featured: false,
        published: true,
        createdBy: 'u1',
        translations: [
          {
            languageId: 'l1',
            title: 'Test Project',
            description: 'Test description',
            materials: ['wood']
          }
        ]
      }

      mockPrisma.project.create.mockResolvedValue({})

      await ProjectService.createProject(createData)

      expect(mockPrisma.project.create).toHaveBeenCalledWith({
        data: {
          contentTypeId: 'ct1',
          featured: false,
          published: true,
          createdBy: 'u1',
          translations: {
            create: createData.translations
          },
          images: undefined
        },
        include: expect.any(Object)
      })
    })
  })

  describe('updateProject', () => {
    it('should update project with translations and images', async () => {
      const updateData = {
        contentTypeId: 'ct2',
        featured: true,
        published: false,
        translations: [
          {
            languageId: 'l1',
            title: 'Updated Project',
            description: 'Updated description',
            materials: ['glass']
          }
        ],
        images: [
          {
            originalUrl: '/uploads/new.jpg',
            thumbnailUrl: '/uploads/thumb-new.jpg',
            alt: 'New image',
            order: 0
          }
        ]
      }

      const mockUpdatedProject = {
        id: '1',
        contentTypeId: 'ct2',
        featured: true,
        published: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        translations: [],
        images: [],
        contentType: { id: 'ct2', name: 'services' },
        creator: { id: 'u1', name: 'Test User', email: 'test@example.com' }
      }

      // Mock transaction
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = {
          project: {
            update: vi.fn().mockResolvedValue({ id: '1' }),
            findUnique: vi.fn().mockResolvedValue(mockUpdatedProject)
          },
          projectTranslation: {
            deleteMany: vi.fn(),
            createMany: vi.fn()
          },
          projectImage: {
            deleteMany: vi.fn(),
            createMany: vi.fn()
          }
        }
        return await callback(tx)
      })

      const result = await ProjectService.updateProject('1', updateData)

      expect(mockPrisma.$transaction).toHaveBeenCalled()
      expect(result).toEqual(mockUpdatedProject)
    })
  })

  describe('deleteProject', () => {
    it('should delete project', async () => {
      const mockDeletedProject = {
        id: '1',
        contentTypeId: 'ct1',
        featured: false,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        translations: [],
        images: [],
        contentType: { id: 'ct1', name: 'projects' },
        creator: { id: 'u1', name: 'Test User', email: 'test@example.com' }
      }

      mockPrisma.project.delete.mockResolvedValue(mockDeletedProject)

      const result = await ProjectService.deleteProject('1')

      expect(mockPrisma.project.delete).toHaveBeenCalledWith({
        where: { id: '1' },
        include: expect.any(Object)
      })
      expect(result).toEqual(mockDeletedProject)
    })
  })

  describe('toggleFeatured', () => {
    it('should toggle featured status from false to true', async () => {
      mockPrisma.project.findUnique.mockResolvedValue({ featured: false })
      mockPrisma.project.update.mockResolvedValue({ featured: true })

      const result = await ProjectService.toggleFeatured('1')

      expect(mockPrisma.project.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        select: { featured: true }
      })
      expect(mockPrisma.project.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { featured: true },
        include: expect.any(Object)
      })
    })

    it('should throw error if project not found', async () => {
      mockPrisma.project.findUnique.mockResolvedValue(null)

      await expect(ProjectService.toggleFeatured('1')).rejects.toThrow('Project not found')
    })
  })

  describe('togglePublished', () => {
    it('should toggle published status from true to false', async () => {
      mockPrisma.project.findUnique.mockResolvedValue({ published: true })
      mockPrisma.project.update.mockResolvedValue({ published: false })

      const result = await ProjectService.togglePublished('1')

      expect(mockPrisma.project.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        select: { published: true }
      })
      expect(mockPrisma.project.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { published: false },
        include: expect.any(Object)
      })
    })
  })

  describe('getPublishedProjects', () => {
    it('should fetch only published projects', async () => {
      mockPrisma.project.findMany.mockResolvedValue([])

      await ProjectService.getPublishedProjects()

      expect(mockPrisma.project.findMany).toHaveBeenCalledWith({
        where: { published: true },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' }
      })
    })

    it('should fetch published projects with language filter', async () => {
      mockPrisma.project.findMany.mockResolvedValue([])

      await ProjectService.getPublishedProjects('l1')

      expect(mockPrisma.project.findMany).toHaveBeenCalledWith({
        where: {
          published: true,
          translations: {
            some: {
              languageId: 'l1'
            }
          }
        },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' }
      })
    })
  })

  describe('getFeaturedProjects', () => {
    it('should fetch featured and published projects', async () => {
      mockPrisma.project.findMany.mockResolvedValue([])

      await ProjectService.getFeaturedProjects()

      expect(mockPrisma.project.findMany).toHaveBeenCalledWith({
        where: {
          published: true,
          featured: true
        },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' }
      })
    })
  })
})