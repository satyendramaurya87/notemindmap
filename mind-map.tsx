"use client"

import { useCallback, useEffect, useState } from "react"
import { Topic } from "./types/mind-map"
import { Toolbar } from "./components/toolbar"
import { TopicNode } from "./components/topic-node"
import { syncWithGoogleSheets, fetchFromGoogleSheets } from "./actions/sheets"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from 'lucide-react'

export default function MindMap() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    fetchFromGoogleSheets()
      .then(setTopics)
      .catch((error) => {
        console.error("Failed to fetch initial data:", error)
        toast({
          title: "Error",
          description: "Failed to load initial data. Please try again.",
          variant: "destructive",
        })
      })
      .finally(() => setIsLoading(false))
  }, [])

  const handleTopicUpdate = useCallback((updatedTopic: Topic) => {
    setTopics((prevTopics) => {
      const updateTopicInTree = (topics: Topic[]): Topic[] => {
        return topics.map((topic) => {
          if (topic.id === updatedTopic.id) {
            return updatedTopic
          }
          if (topic.children) {
            return {
              ...topic,
              children: updateTopicInTree(topic.children),
            }
          }
          return topic
        })
      }
      return updateTopicInTree(prevTopics)
    })
  }, [])

  const handleTopicDelete = useCallback((id: string) => {
    setTopics((prevTopics) => {
      const deleteTopicFromTree = (topics: Topic[]): Topic[] => {
        return topics.filter((topic) => {
          if (topic.id === id) {
            return false
          }
          if (topic.children) {
            topic.children = deleteTopicFromTree(topic.children)
          }
          return true
        })
      }
      return deleteTopicFromTree(prevTopics)
    })
  }, [])

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      const success = await syncWithGoogleSheets(topics)
      if (success) {
        toast({
          title: "Sync Successful",
          description: "Your mind map has been synced with Google Sheets.",
        })
      } else {
        throw new Error("Sync failed")
      }
    } catch (error) {
      console.error("Sync error:", error)
      toast({
        title: "Sync Failed",
        description: "There was an error syncing with Google Sheets.",
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <Toolbar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex justify-center">
          {topics.map((topic) => (
            <TopicNode
              key={topic.id}
              topic={topic}
              onUpdate={handleTopicUpdate}
              onDelete={handleTopicDelete}
            />
          ))}
        </div>
      </div>
      <div className="p-4 border-t">
        <Button onClick={handleSync} disabled={isSyncing}>
          {isSyncing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            "Sync with Google Sheets"
          )}
        </Button>
      </div>
    </div>
  )
}

