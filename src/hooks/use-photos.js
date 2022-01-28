import { func } from 'prop-types'
import { useState, useEffect, useContext } from 'react'
import UserContext from '../context/user'
import { getUserByUserId, getPhotos } from '../services/firebase'

export default function usePhotos() {
  const [photos, setPhotos] = useState(null)

  const {
    user: { uid: userId = '' },
  } = useContext(UserContext)

  useEffect(() => {
    async function getTimelinePhotos() {
      // get the following array
      const [{ following }] = await getUserByUserId(userId)
      let followedUserPhotos = []

      // does the user actually follow people?
      if (following.length > 0) {
        followedUserPhotos = await getPhotos(userId, following)
      }

      // Re-arrange array to be newest photos first by date created
      followedUserPhotos.sort((a, b) => b.dateCreated - a.dateCreated)
      setPhotos(followedUserPhotos)
    }

    getTimelinePhotos()
  }, [userId])

  return { photos }
}
