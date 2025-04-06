"use client"
import dynamic from 'next/dynamic';

const EditorWrapper = dynamic(() => import('@/components/ui/editor'), {
    ssr: false,
    loading: () => <p>Loading editor...</p>, // Optional fallback
  });
  
export default EditorWrapper