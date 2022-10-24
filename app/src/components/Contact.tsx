import React from 'react'

const Contact = ({
  header,
  name,
  email,
  phone,
}: {
  header: string
  name: string
  email: string
  phone: string
}) => {
  return (
    <>
      <h5 className="mt-5">{header}</h5>
      {name}
      <br />
      <a href={`mailto:${email}`}>{email}</a>
      <br />
      Tel: {phone}
    </>
  )
}

export default Contact
