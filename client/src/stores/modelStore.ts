// client/src/stores/modelStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Model } from '@/data/modelGroups'

export interface ExtendedModel extends Model {
  family: string
}

interface ModelStore {
  selectedModel: ExtendedModel | null
  setSelectedModel: (model: ExtendedModel | null) => void
}

const useModelStore = create<ModelStore>()(
  persist(
    (set) => ({
      selectedModel: null,
      setSelectedModel: (model) => set({ selectedModel: model })
    }),
    {
      name: 'model-store'
    }
  )
)

export default useModelStore
