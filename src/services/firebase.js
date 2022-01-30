import { db } from '../lib/firebase'
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'

export async function doesUsernameExist(username) {
  const q = query(collection(db, 'users'), where('username', '==', username))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((user) => user.data().length > 0)
}

export async function getUserByUsername(username) {
  const q = query(collection(db, 'users'), where('username', '==', username))
  const querySnapshot = await getDocs(q)
  const user = querySnapshot.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }))

  return user
}

// Get user from the firestore where userId === userId (passed from the auth)
export async function getUserByUserId(userId) {
  const q = query(collection(db, 'users'), where('userId', '==', userId))
  const querySnapshot = await getDocs(q)
  const user = querySnapshot.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }))

  return user
}

export async function getSuggestedProfiles(userId, following) {
  const q = query(collection(db, 'users'), limit(10))
  const querySnapshot = await getDocs(q)

  const response = querySnapshot.docs
    .map((user) => ({ ...user.data(), docId: user.id }))
    .filter(
      (profile) =>
        profile.userId !== userId && !following.includes(profile.userId)
    )

  return response
}

export async function updateLoggedInUserFollowing(
  loggedInUserDocId, // currently logged in user doc id (arnoldo2 id)
  profileId, // the user that arnoldo requests to follow
  isFollowingProfile // true/false (am I currently following this person?)
) {
  const followingRef = doc(db, 'users', loggedInUserDocId)
  return await updateDoc(followingRef, {
    following: isFollowingProfile
      ? arrayRemove(profileId)
      : arrayUnion(profileId),
  })
}

export async function updateFollowedUserFollowers(
  profileDocId,
  loggedInUserDocId,
  isFollowingProfile
) {
  const followingRef = doc(db, 'users', profileDocId)
  return await updateDoc(followingRef, {
    followers: isFollowingProfile
      ? arrayRemove(loggedInUserDocId)
      : arrayUnion(loggedInUserDocId),
  })
}

export async function getPhotos(userId, following) {
  const q = query(collection(db, 'photos'), where('userId', 'in', following))
  const result = await getDocs(q)

  const userFollowedPhotos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }))

  const photosWithUserDetails = await Promise.all(
    userFollowedPhotos.map(async (photo) => {
      let userLikedPhoto = false
      if (photo.likes.includes(userId)) {
        userLikedPhoto = true
      }
      const user = await getUserByUserId(photo.userId)

      const { username } = user[0]

      return { username, ...photo, userLikedPhoto }
    })
  )

  return photosWithUserDetails
}

export async function getUserPhotosByUsername(username) {
  const [user] = await getUserByUsername(username)
  const q = query(collection(db, 'photos'), where('userId', '==', user.userId))
  const result = await getDocs(q)

  return result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }))
}

export async function isUserFollowingProfile(
  loggedInUserUsername,
  profileUserId
) {
  const q = query(
    collection(db, 'users'),
    where('username', '==', loggedInUserUsername),
    where('following', 'array-contains', profileUserId)
  )
  const result = await getDocs(q)

  const [response = {}] = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }))

  return response.userId
}

export async function toggleFollow(
  isFollowingProfile,
  activeUserDocId,
  profileDocId,
  profileUserId,
  followingUserId
) {
  // 1st param: arnoldo's doc id
  // 2nd param: raphael's user id
  // 3rd param: is the user following this profile? e.g. does arnoldo follow raphael? (true/false)
  await updateLoggedInUserFollowing(
    activeUserDocId,
    profileUserId,
    isFollowingProfile
  )

  // 1st param: arnoldo's user id
  // 2nd param: raphael's doc id
  // 3rd param: is the user following this profile? e.g. does arnoldo follow raphael? (true/false)
  await updateFollowedUserFollowers(
    profileDocId,
    followingUserId,
    isFollowingProfile
  )
}
