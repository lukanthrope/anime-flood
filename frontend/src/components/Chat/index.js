import 
  React, { 
  useState, 
  useEffect, 
  useRef } from 'react';
import socketIOClient from "socket.io-client";
import axios from 'axios';
import { connect } from 'react-redux';

import Header from '../Header';
import Message from './Message';
import Spinner from '../Spinner';

import './styles.css';

const socket = socketIOClient('http://localhost:3001');

function Chat({ username }) {
  const [messages, setMessages] = useState();
  const [load, setLoad] = useState();
  const messagesRef = useRef(null);
  const [err, setErr] = useState(null);
  const [showButton, setShowButton] = useState({'display' : 'block'});

  const OnChange = async e => {
    e.preventDefault();
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    e.target.value = null;
    
    try {
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      socket.emit('mes', { url: res.data.fileName, author: username });
      setErr(false);
      console.log(res);
    } catch(err) {
      setErr(err);
    }
  };

  const goDown = () =>
    messagesRef.current.scrollIntoView({ behavior: "smooth" })

  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.body.style.background = 'lavender';

    const listener = () => {
      if (window.pageYOffset > document.body.clientHeight / 2) {
        setShowButton({ 'display' : 'none' });
      } else {
        setShowButton({ 'display' : 'block' });
      }  
    };

    window.addEventListener('scroll', listener);

    setLoad(true);
    (async () => {
      try {
        const res = await axios.get('/api/messages');
        if (res.data.length === 0) {
          setErr(true);
        }
        setMessages(res.data);
        setLoad(false);

        setTimeout(() => 
          goDown()
        , 1000);
      } catch(err) {
        setErr(err);
      }
    })();

    return () =>
      window.removeEventListener('scroll', listener);
  }, []);

  useEffect(() => {
    if (Array.isArray(messages)) {
      socket.on('new message', data => {
        setMessages([...messages, data]);
        setShowButton({ 'display' : 'block' });
        setErr(false);
      }
      );
    }
  }, [messages]);

  return (
    <div className="Chat">
      <Header username={username} />
      {load && <Spinner /> }
      <div className="container chat-container">
        {
          messages && !load &&
          messages.map(( { url, author }, index, array ) =>
            <Message 
              image={url} 
              username={author}
              classProp={username === author ? 'mine' : ''}
              key={index}
              ref={index === array.length - 1 ? messagesRef : null}
              />
          )
        }

        {
          err && 
          <h3 className="empty">No messages yet, bratishka</h3>
        }
      </div>
      <div ref={messagesRef} />
      <div className="fileContainer">
        send
        <input 
          onChange={(e) => OnChange(e)}
          type="file"
          name="myFile"
          className="inputfile"
          />
      </div>
      <button style={showButton} onClick={goDown} className="godown">
          &#8595;
      </button>
    </div>
  );
}

const mapStateToProps = state => ({
  username: state.user,
  spinner: state.spinner,
});

export default connect(mapStateToProps)(Chat);
