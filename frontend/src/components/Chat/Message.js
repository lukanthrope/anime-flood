import React, { memo } from 'react';
import { Image } from 'react-bootstrap';

const Message = memo(({ username, image, classProp }) =>
  <div className="Message">
    <Image 
      className={`messageImage ${classProp}`} 
      thumbnail 
      src={image} 
      alt="image" 
      />
    <h3 className={`name ${classProp}`}>{username}</h3>
  </div>
)

export default Message;