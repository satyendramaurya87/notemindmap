import { useState } from "react"
import { Topic } from "../types/mind-map"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronRight, ChevronDown } from 'lucide-react'

interface TopicNodeProps {
  topic: Topic
  onUpdate: (updatedTopic: Topic) => void
  onDelete: (id: string) => void
}

export function TopicNode({ topic, onUpdate, onDelete }: TopicNodeProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(topic.title)

  const handleToggleExpand = () => {
    onUpdate({ ...topic, isExpanded: !topic.isExpanded })
  }

  const handleSubmit = () => {
    onUpdate({ ...topic, title })
    setIsEditing(false)
  }

  return (
    <div className="relative group">
      <div
        className="flex items-center gap-2 p-2 rounded-lg border bg-background"
        style={{ borderColor: topic.color }}
      >
        {topic.children?.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4"
            onClick={handleToggleExpand}
          >
            {topic.isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        )}
        {isEditing ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="h-6 px-1"
            autoFocus
          />
        ) : (
          <div
            className="min-w-[100px] px-2 cursor-pointer"
            onDoubleClick={() => setIsEditing(true)}
          >
            {topic.emoji && <span className="mr-2">{topic.emoji}</span>}
            {topic.title}
          </div>
        )}
      </div>
      {topic.isExpanded && topic.children && (
        <div className="ml-8 mt-2">
          {topic.children.map((child) => (
            <TopicNode
              key={child.id}
              topic={child}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

