import VersaoA from '../templates/versaoa';
import VersaoB from '../templates/versaob';
import fetch from 'isomorphic-unfetch';

export const disablePromo = () => {
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
  return <div />;
};

const Promo = ({ features }) => {

  if (!features['nova-funcionalidade-da-api']) {
    return disablePromo();
  }

  return (
    <>
      {!features['nova-funcionalidade-da-api'] && <VersaoA />}
      {features['nova-funcionalidade-da-api'] && <VersaoB />}
    </>
  );
};

Promo.getInitialProps = async function ({ req }) {
  let features = {};
  if (req) {
    features = req.features;
  } else {
    const res = await fetch('/api/features');
    features = await res.json();
  }

  return {
    features: features
  };
};

export default Promo;
