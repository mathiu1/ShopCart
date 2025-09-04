import { Helmet } from 'react-helmet-async';

const MetaData = ({title}) => {
  return (
    <Helmet>
        <title>{`${title} - ShopCart`}</title>
    </Helmet>
  )
}

export default MetaData