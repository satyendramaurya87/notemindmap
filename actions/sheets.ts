"use server"

import { Topic } from "../types/mind-map"

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzMDNHdkQTixQNf0JqBn2D1cC6F9GhVQSpObmsBCs_cqo2UWSrdM4svqfsysdNvK424/exec"

export async function syncWithGoogleSheets(data: Topic[]) {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result.success
  } catch (error) {
    console.error("Error syncing with Google Sheets:", error)
    return false
  }
}

export async function fetchFromGoogleSheets(): Promise<Topic[]> {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: Topic[] = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching from Google Sheets:", error)
    return []
  }
}

