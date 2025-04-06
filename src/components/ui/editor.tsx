"use client"
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { MonacoBinding } from 'y-monaco'
import * as monaco from 'monaco-editor'
import React, { useEffect, useMemo, useState } from 'react'
import Editor from '@monaco-editor/react'
import { getSession } from 'next-auth/react'

function getRandomColor() {
  const hue = Math.floor(Math.random() * 360)
  return `hsl(${hue}, 80%, 70%)`
}

function EditorFragment({
  wsUrl,
  room,
  language,
}: {
  wsUrl: string;
  room: string;
  language: string;
}) {
  console.log(wsUrl, room, language, "FOR THE EDITOR SETUp")
  const ydoc = useMemo(() => new Y.Doc(), [])
  const [editor, setEditor] = useState<any | null>(null)
  const [provider, setProvider] = useState<WebsocketProvider | null>(null)
  const [binding, setBinding] = useState<MonacoBinding | null>(null)
  
  // this effect manages the lifetime of the Yjs document and the provider
  useEffect(() => {
    const provider = new WebsocketProvider(wsUrl, room, ydoc)
    setProvider(provider);
    (async (provider) => {
        const user = await getSession()
        provider.ws?.send(JSON.stringify({
          token: user?.user.token,
          user_id: user?.user.id
        }))
    })(provider)
    provider.awareness.setLocalStateField('user', {
      name: `User-${provider.awareness.clientID}`,
      color: getRandomColor()
    })

    return () => {
      provider?.destroy()
      ydoc.destroy()
    }
  }, [ydoc])

  // This manages the multiple cursors color mappings
  useEffect(() => {
    if (!editor || !provider) return
    const awareness = provider.awareness
    const myClientId = awareness.clientID
    const container = editor.getDomNode()
    if (!container) return

    const clientColorMap = new Map<number, string>()

    const updateClientColorMap = () => {
      const states = awareness.getStates()
      states.forEach((state, clientId) => {
        if (clientId === myClientId) return
        if (state.user?.color) {
          clientColorMap.set(clientId, state.user.color)
        }
      })
    }

    updateClientColorMap()

    const applyColorToCursor = (clientId: number, color: string) => {
      const className = `yRemoteSelectionHead-${clientId}`
      const heads = container.querySelectorAll(`.${className}`) as NodeListOf<HTMLElement>

      heads.forEach(head => {
        head.style.borderLeft = `${color} solid 2px`
        head.style.borderTop = `${color} solid 2px`
        head.style.borderBottom = `${color} solid 2px`

        // Dynamically patch ::after via a style tag
        const styleId = `cursor-style-${clientId}`
        if (!document.getElementById(styleId)) {
          const style = document.createElement('style')
          style.id = styleId
          style.innerHTML = `
            .${className}::after {
              border: 3px solid ${color};
            }
          `
          document.head.appendChild(style)
        }
      })
    }

    const observer = new MutationObserver(() => {
      clientColorMap.forEach((color, clientId) => {
        applyColorToCursor(clientId, color)
      })
    })

    observer.observe(container, { childList: true, subtree: true })

    const onAwarenessChange = ({ added, updated }: any) => {
      updateClientColorMap()
        ;[...added, ...updated].forEach(clientId => {
          const color = clientColorMap.get(clientId)
          if (color) {
            setTimeout(() => applyColorToCursor(clientId, color), 30)
          }
        })
    }

    awareness.on('change', onAwarenessChange)

    return () => {
      awareness.off('change', onAwarenessChange)
      observer.disconnect()
    }
  }, [editor, provider])

  // this effect manages the lifetime of the editor binding
  useEffect(() => {
    if (provider == null || editor == null) {
      return
    }
    console.log('reached', provider)
    const binding = new MonacoBinding(ydoc.getText(), editor.getModel()!, new Set([editor]), provider?.awareness)
    setBinding(binding)
    return () => {
      binding.destroy()
    }
  }, [ydoc, provider, editor])

  return <Editor height="90vh" theme='vs-dark' defaultLanguage={language} language={language} onMount={(editor, monacoInstance) => {
    setEditor(editor);
    editor.updateOptions({
      inlineSuggest: {
        enabled: true,
      },
    })
  }}
    options={{
      quickSuggestions: {
        other: 'inline',  
        comments: 'inline',
        strings: 'inline',
      },
      inlineSuggest: {
        enabled: true,
      },
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnEnter: 'on',
      tabCompletion: 'on',
    }}

  />
}

export default EditorFragment
