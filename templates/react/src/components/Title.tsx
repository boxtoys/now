import { useEffect } from 'react'

interface Properties {
  title: string
}

export default function Title({ title }: Properties) {
  useEffect(() => {
    document.title = title
  }, [title])

  return null
}
