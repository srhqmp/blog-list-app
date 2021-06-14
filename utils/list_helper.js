const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }

  const reducer = (sum, item) => {
    return sum + item
  }
  const likes = blogs.map((blog) => blog['likes'])
  return likes.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return []
  }
  const highestLike = Math.max(...blogs.map((blog) => blog.likes))

  return blogs.find((blog) => blog.likes == highestLike)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
