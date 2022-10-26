import React from 'react'
import { Link, graphql, PageProps } from 'gatsby'
import { Row, Col, Alert } from 'react-bootstrap'
import moment from 'moment'

import Layout from '../components/Layout'
import ClubIcon from '../components/ClubIcon'
import ChampionIcon from '../components/ChampionIcon'
import { Head as DefaultHead } from '../components/Head'

const RootPage = () => {
  return (
    <Layout showNavigation={false} showTemporary={false}>
      <h3>Welkom</h3>
      <Alert variant="warning" className="text-center">
        We zijn druk bezig met de competitie voor de winter van 2022/2023. Hou de site in de gaten
        voor updates!
      </Alert>
      <p>
        Welkom op de website van de ZOD zaalvoetbalcompetitie!
        <br />
        <br />
        De ZOD zaalvoetbalcompetitie is ontstaan uit een onderlinge samenwerking van
        voetbalverenigingen uit Zuid-Oost Drenthe. Het doel van deze competitie is om de JO-6 t/m
        JO-13 in de winterperiode te kunnen laten voetballen!
      </p>
    </Layout>
  )
}

export function Head() {
  return <DefaultHead />
}

export default RootPage
