/* Iida Peltonen 2022 */

var _ = require('lodash')

const dummy = blogs => {
  blogs = 1
  return blogs
}

const totalLikes = blogs => {
  //tarkistaa, onko listalla blogeja
  //jos ei
  if (blogs.length === 0) {
    return 0
  }
  //muuten
  else if (blogs.length === undefined) {
    return blogs[0].likes
  } else {
    const summa = blogs.reduce((pre, cur) => {
      return pre + cur.likes
    }, 0)
    return summa
  }
}

const favoriteBlog = blogs => {
  //tarkistaa, onko listalla blogeja
  //jos ei
  if (blogs.length === 0) {
    return 0
  }
  //muuten
  const max = blogs.reduce((prev, current) =>
    prev.likes > current.likes ? prev : current
  )
  //haetaan sen blogin indeksi, jolla on eniten tykkäyksiä
  const index = blogs.findIndex(object => {
    return object.likes === max.likes
  })
  return {
    title: blogs[index].title,
    author: blogs[index].author,
    likes: blogs[index].likes
  }
}

const mostBlogs = blogs => {
  //tarkistaa, onko listalla blogeja
  //jos ei
  if (blogs.length === 0) {
    return 0
  }
  //jos listalla on vaan yksi, palautetaan sen tiedot
  else if (blogs.length === 1) {
    return {
      author: blogs[0].author,
      blogs: 1
    }
  }
  //muuten
  const blogsPerAuthor = blogs.reduce((obj, blog) => {
    obj[blog.author] = obj[blog.author] ? obj[blog.author] + 1 : 1

    return obj
  }, {})
  //muuttuja, johon authorin blogimäärää verrataan
  let maara = 0
  //muuttuja eniten blogeja kirjoittaneelle authorille
  let ahkerinBlogaaja = null
  //muuttuja, johon isoin blogimäärä tallentaan
  let isoinMaara = 0
  Object.entries(blogsPerAuthor).forEach(entry => {
    const [a, c] = entry
    if (c > maara) {
      ahkerinBlogaaja = a
      isoinMaara = c
      maara = c
    }
  })
  return {
    author: ahkerinBlogaaja,
    blogs: isoinMaara
  }
}

const mostLikes = blogs => {
  //tarkistaa, onko listalla blogeja
  //jos ei
  if (blogs.length === 0) {
    return 0
  }
  //jos listalla on vaan yksi, palautetaan sen tiedot
  else if (blogs.length === 1) {
    return {
      author: blogs[0].author,
      likes: blogs[0].likes
    }
  }
  //muuten
  var counts = _(blogs)
    .groupBy('author')
    .map((g, key) => {
      return {
        author: key,
        likes: _.sumBy(g, 'likes')
      }
    })
    .values()
    .orderBy('likes', 'desc')
    .value()
  counts = _(counts).maxBy('likes')
  //muuttuja tykätyimmälle tyypille
  let tykatyinAuthor = counts.author
  //muuttuja tykkäysten määrälle
  let tykkaysNro = counts.likes
  return {
    author: tykatyinAuthor,
    likes: tykkaysNro
  }
}
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
