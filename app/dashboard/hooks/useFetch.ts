'use client'
import { useState, useEffect, useCallback } from 'react'

interface UseFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: Record<string, any>
  cache?: RequestCache
}

interface UseFetchState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export function useFetch<T>(
  url: string,
  options: UseFetchOptions = {}
): UseFetchState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const { method = 'GET', body, cache = 'no-store' } = options

  const fetch_ = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const response = await fetch(url, {
        method,
        cache,
        headers: method !== 'GET' ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
      })
    }
  }, [url, method, body, cache])

  useEffect(() => {
    fetch_()
  }, [fetch_])

  return {
    ...state,
    refetch: fetch_,
  }
}
