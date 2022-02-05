import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { API } from 'project/api'
import { nextReduxWrapper } from 'components/util/nextReduxWrapper'

const ArticlePage = () => {
  const {
    query: { id },
  } = useRouter()

  useEffect(() => {
    API.trackPage('ArticlePage')
  }, [])

  return <div className='container'>Article {id}</div>
}

export const getStaticPaths = async () => {
  return {
    paths: [{ params: { id: '1' } }],
    fallback: 'blocking', // builds page that is not compiled
  }
}

export const getStaticProps = nextReduxWrapper.getStaticProps(
  () => async () => {
    // await nextPromiseAction<'getArticle'>(store, 'getArticle', {
    //   id: ctx.params.id,
    // })
    return {
      props: {},
    }
  },
)

export default ArticlePage
