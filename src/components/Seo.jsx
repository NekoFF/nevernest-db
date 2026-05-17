import { useEffect } from 'react'
import { setSeo } from '../utils/seo.js'

export default function Seo(props) {
  useEffect(() => {
    setSeo(props)
  }, [props.title, props.description, props.canonicalPath, props.ogTitle, props.ogDescription, props.ogImage, props.twitterCard])

  return null
}
