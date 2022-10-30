import React from 'react';
import { Alert } from 'react-bootstrap';

import Layout from '../components/Layout';
import { Head as DefaultHead } from '../components/Head';

const RootPage = () => {
  return (
    <Layout showNavigation={false} showTemporary={false}>
      <h3>Welkom</h3>
      <Alert variant="warning" className="text-center">
        We zijn druk bezig met de competitie voor de winter van 2022/2023. Hou
        de site in de gaten voor updates!
      </Alert>
      <p>
        Welkom op de website van de ZOD zaalvoetbalcompetitie!
        <br />
        <br />
        De ZOD zaalvoetbalcompetitie is ontstaan uit een onderlinge samenwerking
        van voetbalverenigingen uit Zuid-Oost Drenthe. Het doel van deze
        competitie is om de JO-6 t/m JO-11 in de winterperiode te kunnen laten
        voetballen!
      </p>
    </Layout>
  );
};

export function Head() {
  return <DefaultHead />;
}

export default RootPage;
