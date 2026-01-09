import React from 'react';
import {  Alert } from 'react-bootstrap';
import moment from 'moment';

export interface NewsItemProps {
  time: string;
  title: string | null;
  status: string | null;
  message: string | null;
}

const NewsItem = ({ time, title, status, message }: NewsItemProps) => {
  return (
    <Alert variant={status || 'info'} className="mt-3">
      {title && <h5>{title}</h5>}
      <div
        className="mt-4"
        dangerouslySetInnerHTML={{ __html: message ?? '' }}
      ></div>
      <hr />
      <small>{moment(time).format('LLL')}</small>
    </Alert>
  );
};

export default NewsItem;
