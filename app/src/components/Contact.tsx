import React, { ReactNode } from 'react';

const Contact = ({
  header,
  name,
  email,
  phone,
}: {
  header: ReactNode;
  name: string;
  email?: string | null;
  phone?: string | null;
}) => {
  return (
    <>
      <h5 className="mt-5">{header}</h5>
      {name}
      {email && (
        <>
          <br />
          <a href={`mailto:${email}`}>{email}</a>
        </>
      )}
      {phone && (
        <>
          <br />
          Tel: {phone}
        </>
      )}
    </>
  );
};

export default Contact;
