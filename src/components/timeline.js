import React from 'react'
import Skeleton from 'react-loading-skeleton'
import usePhotos from '../hooks/use-photos'
import Post from './post'

export default function Timeline() {
  // We need to get the logged in user's photos (hook)
  const { photos } = usePhotos()
  // on loading the photos, we need to use react-skeleton
  // if we have photos, render them (create a post component)
  // if user has no photos, tell them to create
  return (
    <div className="container col-span-2">
      {!photos ? (
        <>
          {[...new Array(4)].map((_, index) => (
            <Skeleton
              key={index}
              count={1}
              width={640}
              height={600}
              className="mb-5"
            />
          ))}
        </>
      ) : photos?.length > 0 ? (
        photos.map((content) => <Post key={content.docId} content={content} />)
      ) : (
        <p className="text-center text-2xl">Follow people to see photos</p>
      )}
    </div>
  )
}
