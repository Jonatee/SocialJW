export const sampleFeed = [
  {
    id: "post-1",
    author: { name: "Brother James", username: "brother_james", initials: "BJ" },
    content: "Today’s reading reminded me that calm trust in Jehovah brings real peace, even when the week feels demanding.",
    createdAtLabel: "2m",
    media: [],
    stats: { likeCount: 18, commentCount: 6, repostCount: 3, bookmarkCount: 9 }
  },
  {
    id: "post-2",
    author: { name: "Sister Ruth", username: "sister_ruth", initials: "SR" },
    content: "I appreciated how this week’s meeting emphasized gentle speech in family life. That counsel felt very practical.",
    createdAtLabel: "19m",
    media: [
      { id: "media-1", type: "image", url: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80" }
    ],
    stats: { likeCount: 42, commentCount: 12, repostCount: 11, bookmarkCount: 14 }
  }
];

export const sampleComments = [
  {
    id: "comment-1",
    author: { name: "Brother Daniel", initials: "BD" },
    content: "That thought encouraged me too. It helped me stay steady during a busy day."
  },
  {
    id: "comment-2",
    author: { name: "Sister Naomi", initials: "SN" },
    content: "The daily discussion prompt was timely and gave our family worship conversation a good direction."
  }
];

export const sampleNotifications = [
  {
    id: "notification-1",
    actor: { name: "Brother Daniel", initials: "BD" },
    message: "appreciated your encouraging post"
  },
  {
    id: "notification-2",
    actor: { name: "Sister Ruth", initials: "SR" },
    message: "connected with you"
  }
];
