export const storage = {
  get<T = any>(key: string): T | null {
    try {
      const value = localStorage.getItem(key)
      return value ? (JSON.parse(value) as T) : null
    } catch (error) {
      console.error(`Error getting key "${key}" from localStorage:`, error)
      return null
    }
  },

  set<T = any>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting key "${key}" in localStorage:`, error)
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing key "${key}" from localStorage:`, error)
    }
  },

  clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error(`Error clearing localStorage:`, error)
    }
  }
}
