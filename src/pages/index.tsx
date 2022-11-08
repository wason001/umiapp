import React, { useState, useEffect } from 'react'
import { history } from 'umi';

export default function HomePage() {
  const [posts, setPosts] = useState<any[]>()

  async function refresh() {
    try {
      const res = await fetch('/api/posts')
      if (res.status !== 200) {
        console.error(res.text())
      }
      let result = await res.json()
      console.log('result', result)
      setPosts(result)
    } catch (error: any) {
      console.error(error)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <div className="flex flex-row w-full justify-center flex-wrap">
      {!posts && <div
          className="fixed w-screen h-screen flex justify-center items-center">
          <p className="animate-pulse">Loading...</p>
      </div>}
      {posts && <div className="container flex flex-row w-full justify-center
       flex-wrap p-4 px-2 md:px-24 xl:px-64">
        {posts.map(post => <div
          key={post.id} className="w-full lg:w-1/2 p-4">
          <div
            onClick={() => history.push(`/posts/${post.id}`)}
            className="w-full h-64 bg-white relative transition-all
          rounded-xl overflow-hidden cursor-pointer hover:shadow-xl">
            <img
              src={post.imageUrl}
              alt=""
              className="absolute top-0 w-full h-full" />
            <div
              className="absolute top-0 w-full h-full bg-black opacity-10
              hover:opacity-40 transition-all" />
            <div className="z-50 absolute bottom-0 p-4">
              <p className="text-white font-extrabold">{post.title}</p>
            </div>
          </div>
        </div>)}
      </div>}
    </div>
  );
}
