"use client"
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { MonacoBinding } from 'y-monaco'
import * as monaco from 'monaco-editor'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import { getSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { useMapSetStore } from '@/store/use-colormap-store'

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function debounceAsync<T>(fn: () => Promise<T>, delay: number): Promise<T> {
  return new Promise((resolve, reject) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        const result = await fn();
        resolve(result);
      } catch (e) {
        reject(e);
      }
    }, delay);
  });
}


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
  const editorRef = useRef(null);
  const {resolvedTheme} = useTheme()
  const {data, addValue, resetAll, removeClientIdFromAll} = useMapSetStore()
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
        provider.awareness.setLocalStateField('user', {
          name: `${user?.user.name}`,
          color: getRandomColor()
        })
    })(provider)

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
    const clientInfoMap = new Map<string, string[]>()
    const updateClientColorMap = () => {
      resetAll()
      const states = awareness.getStates()
      states.forEach((state, clientId) => {
        if (clientId === myClientId) return
        if (state.user?.color) {
          clientColorMap.set(clientId, state.user.color)
          // clientInfoMap.set(state.user?.name, [clientInfoMap.get(state.user?.name), state.user.color])
          addValue(state.user?.name, [state.user.color, clientId.toString()])
        }
      })
      console.log(clientColorMap, "is the color map")
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

    const onAwarenessChange = ({ added, updated, removed }: any) => {
      console.log(removed, "are the removed client")
      if(removed.length > 0) {
        for(let a of removed) {
          removeClientIdFromAll(String(a))
        }
      }
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
  // @ts-ignore
  function handleEditorDidMount(editor, monaco) {
    setEditor(editor)
    monaco.languages.registerInlineCompletionsProvider(language, {
      // @ts-ignore
      provideInlineCompletions(model, position, context, token) {
        return debounceAsync(async () => {
          const prefix = model.getValueInRange({
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          });

          if (token.isCancellationRequested || prefix.trim() === "") {
            return { items: [] };
          }
          const prompt = `
          Continue the following **incomplete** ${language} code snippet **without repeating** any existing part. Do not include any explanations, markdown, or comments. Respond with only the next few characters of valid JavaScript code that complete the code naturally. The response must be pure code, directly usable in an inline completion.
          
          Prefix:
          `;
          

          try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 2000);

            const response = await fetch("/api/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                prompt,
                prefix
              }),
              // signal: controller.signal,
            });

            clearTimeout(timeout);

            if (!response.ok) throw new Error("Failed to fetch");

            const data = await response.json();
            const suggestion = data?.choices?.[0]?.message?.content?.trim().replace(/["`]/g, "") ?? "";

            return {
              items: [
                {
                  insertText: suggestion,
                  range: {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: position.column,
                    endColumn: position.column,
                  },
                  command: {
                    id: "",
                    title: "Auto",
                  },
                },
              ],
            };
          } catch (err) {
            // @ts-ignore
            console.warn("Debounced fetch error:", err.message);
            return { items: [] };
          }
        }, 500); // ⏱️ 500ms debounce
      },

      freeInlineCompletions() {
        console.log("Freed inline completions");
      },
    });
  }


  return <Editor  className='w-full h-[calc(100vh-50px-57px)]' theme={"vs-"+resolvedTheme} defaultLanguage={language} language={language} onMount={handleEditorDidMount}
  options={{
    quickSuggestions: {
      other: "inline",
      comments: "inline",
      strings: "inline",
    },
    inlineSuggest: {
      enabled: true,
    },
    suggestOnTriggerCharacters: true,
    tabCompletion: "on",
    acceptSuggestionOnEnter: "on",
  }}
  />
}

export default EditorFragment
