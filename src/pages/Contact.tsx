import {useEffect} from "react";

const Contact = () => {
  useEffect(() => {
    document.title = 'V2K Contact';
  }, []);

  return (
    <h1>Contact me?</h1>
  );
}

export default Contact;