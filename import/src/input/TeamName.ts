import { slug } from "../utils"

export interface TeamName {
  id: string
  teamName: string
  clubName: string
  category: string
}

export function parseTeamName(name: string): TeamName {
  const regex = /(.+) ((JO|MO|M)(\d+)(-\d+)?)/
  const matches = name.match(regex)
  if (!matches) {
    throw new Error(`Team name failed to match regex: ${name}`)
  }

  const clubName = matches[1];
  const teamName = matches[2];

  return {
    id: slug(`${clubName}-${teamName}`),
    clubName,
    teamName,
    category: matches[3] + matches[4],
  }
}
