/* Iida Peltonen 2022 */

const dummy = blogs => {
  blogs = 1
  return blogs
}

module.exports = {
  dummy
}

const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})
