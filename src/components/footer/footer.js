import React from 'react';
import './footer.css'

function Footer() {
  return (
    <div>
      <footer className="footer">
        <div className="footer-info">
          <div className="footer-part">
            <p>© 2021 Kateryna Karetnikova - All Rights Reserved</p>
          </div>
          <div className="footer-part">
            <div>По вопросам поддержки:</div>
            <div>Телефон: +380998749302</div>
            <div>E-mail: help@gmail.com</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;