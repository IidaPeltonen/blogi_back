/* Iida Peltonen 2022 */

const dummy = blogs => {
  blogs = 1
  return blogs
}

const totalLikes = blogs => {
  //tarkistetaan onko kannassa yhtäkään blogia
  console.log(blogs.length)
  //jos nolla
  if (blogs.length === 0) {
    return 0
  } else {
    const summa = blogs.reduce((previousValue, currentValue) => {
      return previousValue + currentValue.likes
    }, 0)
    return summa
  }
}

module.exports = {
  dummy,
  totalLikes
}
