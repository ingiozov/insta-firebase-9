import { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import FirebaseContext from '../../context/firebase'
import UserContext from '../../context/user'
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'

export default function AddComment({
  docId,
  comments,
  setComments,
  commentInput,
}) {
  const [comment, setComment] = useState('')
  const { db } = useContext(FirebaseContext)
  const {
    user: { displayName },
  } = useContext(UserContext)

  const handleSubmitComment = async (e) => {
    e.preventDefault()

    setComments([{ displayName, comment }, ...comments])
    setComment('')
    // Give me a new array []
    // put the new comment in there
    // add the old comments
    // then we have a new array with new comment and older comments

    const photoRef = doc(db, 'photos', docId)
    return await updateDoc(photoRef, {
      comments: arrayUnion({ displayName, comment }),
    })
  }

  return (
    <div className="border-t border-gray-primary">
      <form
        className="flex justify-between pl-0 pr-5"
        method="POST"
        onSubmit={(event) =>
          comment.length >= 1
            ? handleSubmitComment(event)
            : event.preventDefault()
        }
      >
        <input
          aria-label="Add a comment"
          autoComplete="off"
          className="text-sm text-gray-base w-full mr-3 py-5 px-4"
          type="text"
          name="Add comment"
          placeholder="Add a comment ..."
          value={comment}
          onChange={({ target }) => setComment(target.value)}
          ref={commentInput}
        />
        <button
          className={`text-sm font-bold text-blue-medium ${
            !comment && 'opacity-25'
          }`}
          type="button"
          disabled={comment.length < 1}
          onClick={handleSubmitComment}
        >
          post
        </button>
      </form>
    </div>
  )
}

AddComment.propTypes = {
  docId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  setComments: PropTypes.func.isRequired,
  commentInput: PropTypes.object,
}
