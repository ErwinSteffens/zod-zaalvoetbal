import React from 'react';
import { PageProps } from 'gatsby';

import Layout from '../components/Layout';
import { Head as DefaultHead } from '../components/Head';

const RootPage = ({ data }: PageProps<Queries.IndexPageQuery>) => {
  return (
    <Layout showNavigation={false} showTemporary={false}>
      <h3>Welkom</h3>
      <p>
        Welkom op de website van de ZOD zaalvoetbalcompetitie!
        <br />
        <br />
        De ZOD zaalvoetbalcompetitie is ontstaan uit een onderlinge samenwerking
        van voetbalverenigingen uit Zuid-Oost Drenthe. Het doel van deze
        competitie is om de JO-7 t/m JO-13 in de winterperiode te kunnen laten
        voetballen!
        <br />
        <br />
        We zijn druk bezig met de voorbereidingen voor de winter 2023/2024. We
        zullen hier binnenkort het programma publiceren. Houd de website dus
        goed in de gaten.
      </p>
    </Layout>
  );
};

export function Head() {
  return <DefaultHead />;
}

export default RootPage;
