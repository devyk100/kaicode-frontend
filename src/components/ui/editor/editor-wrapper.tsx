"use client"
import dynamic from 'next/dynamic';
import { Skeleton } from '../skeleton';

const SkeletonCodeBlock = () => (
  <>
  <span className='flex flex-col gap-3'>
    <Skeleton className="w-full h-[30px] rounded-full" />
    <Skeleton className="w-full h-[15px] rounded-full" />
    <Skeleton className="w-full h-[15px] rounded-full" />
    <Skeleton className="w-full h-[15px] rounded-full" />
  </span>
  </>
)

const EditorWrapper = dynamic(() => import('@/components/ui/editor/editor'), {
  ssr: false,
  loading: () => <>
    <div className='flex flex-col p-2 px-3 gap-10 h-[calc(100vh-50px-57px)]'>
      <SkeletonCodeBlock />
      <SkeletonCodeBlock />
      <SkeletonCodeBlock />
    </div>
  </>
  , // Optional fallback
});

export default EditorWrapper