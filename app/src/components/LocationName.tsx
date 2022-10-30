import React from 'react';
import { Link } from 'gatsby';

export const LocationName = ({
  location,
}: {
  location: { jsonId: string; venue: string; city: string };
}) => {
  let locationName = location.venue;
  if (!locationName.includes(location.city)) {
    locationName += ` - ${location.city}`;
  }

  return (
    <Link className="location" to={`/locaties/${location.jsonId}`}>
      {locationName}
    </Link>
  );
};
