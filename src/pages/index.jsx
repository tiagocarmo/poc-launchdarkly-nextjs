const Index = ({ features, featureKeys }) => {
  return (
    <>
      <h1>Lista de Feature Flags</h1>
      <ul>
        {featureKeys.map((flag, index) => (
          <li key={index}>
            {flag}: <strong>{features[flag].toString()}</strong>
          </li>
        ))}
      </ul>
      <hr />
      <a href='/promo'>Acesse a página "Promo"</a>
    </>
  );
};

Index.getInitialProps = async function ({ req }) {
  let features = {};
  let featureKeys = [];
  if (req) {
    features = req.features;
    for (let p in features) {
      if (features.hasOwnProperty(p)) {
        featureKeys.push(p);
      }
    }
  } else {
    const res = await fetch('/api/features');
    features = await res.json();
    for (let p in features) {
      if (features.hasOwnProperty(p)) {
        featureKeys.push(p);
      }
    }
  }

  return {
    features: features,
    featureKeys: featureKeys
  };
};

export default Index;
