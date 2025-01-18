export interface Topic {
  id: string
  title: string
  parentId: string | null
  color?: string
  emoji?: string
  isExpanded?: boolean
  children?: Topic[]
}

export interface MindMapProps {
  initialData: Topic[]
}

