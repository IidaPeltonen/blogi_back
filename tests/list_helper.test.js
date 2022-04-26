/* Iida Peltonern 2022 */

const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const blogs = [
    {
      _id: '62668667ff810c465a36acf1',
      title: 'Kissablogi',
      author: 'Iida Peltonen',
      url: 'www.kissoja.fi',
      likes: 100000,
      __v: 0
    },
    {
      _id: '62668700ff810c465a36acf7',
      title: 'Kissablogi2',
      author: 'Iida Peltonen',
      url: 'www.kissoja.fi',
      likes: 0,
      __v: 0
    },
    {
      _id: '6266967090b80f659bca6ede',
      title: 'Hömppäblogi',
      author: 'Hölmö',
      url: 'www.hulluja.fi',
      likes: 0,
      __v: 0
    },
    {
      _id: '626698eaa646507601eb7b69',
      title: 'Kasviblogi',
      author: 'Hanna',
      url: 'www.kasveja.fi',
      __v: 0
    }
  ]
})
