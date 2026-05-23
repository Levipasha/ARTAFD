/** Collect all IDs that represent the logged-in user (marketplace or artist). */
export function getIdentityIds(user) {
  const ids = new Set();
  const add = (id) => {
    if (id != null && id !== '') ids.add(String(id));
  };
  add(user?._id);
  add(user?.id);
  add(user?.userId);
  return ids;
}

/** True only when this message was sent by the current user — not by senderType alone. */
export function isMessageFromCurrentUser(msg, currentUser) {
  const senderId = msg?.sender?._id ?? msg?.sender;
  if (senderId == null) return false;
  return getIdentityIds(currentUser).has(String(senderId));
}
