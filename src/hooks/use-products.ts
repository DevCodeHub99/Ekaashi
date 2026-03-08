import { useInfiniteQuery } from '@tanstack/react-query'

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  comparePrice?: number
  images: string[]
  category: string
  categoryName: string
  featured?: boolean
  inStock?: boolean
}

interface ProductsResponse {
  success: boolean
  data: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

interface UseProductsOptions {
  endpoint: string
  limit?: number
  enabled?: boolean
}

export function useProducts({ endpoint, limit = 12, enabled = true }: UseProductsOptions) {
  return useInfiniteQuery<ProductsResponse>({
    queryKey: ['products', endpoint, limit],
    queryFn: async ({ pageParam = 1 }) => {
      const url = `${endpoint}${endpoint.includes('?') ? '&' : '?'}page=${pageParam}&limit=${limit}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      
      return response.json()
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasMore) {
        return lastPage.pagination.page + 1
      }
      return undefined
    },
    initialPageParam: 1,
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
