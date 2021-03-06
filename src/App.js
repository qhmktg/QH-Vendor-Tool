// Quantum Health December, 2020
// Sean Malone Front-end Developer
// contact: sean.malone@quantum-health.com

import React, { useRef } from 'react';
import { parse } from "papaparse";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faDownload } from '@fortawesome/free-solid-svg-icons'
import './toast.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { render } from '@testing-library/react';


export default function App() {
  const [highlighted, setHighlighted] = React.useState(false);
  let [contacts, setContacts] = React.useState([]);
  let newduplicateArray = contacts;
  const textAreaRef = useRef(null);
  const toastNotificationRef = useRef(null);
  const [copySuccess, setCopySuccess] = React.useState(false)

  const config = {
    delimiter: ",",
    header: true,
    dynamicTyping: true,
    transformHeader: function (h) {
      return h.replace(/\s/g, '');
    }

  };

  //toast closed and setting copy status to false
  function toastClose() {
    setTimeout(function () { setCopySuccess(false) }, 1000)
    //console.log(copySuccess)
  }

  //copy code button functionality
  function copyText(e) {
    setCopySuccess(true)
    textAreaRef.current.select()
    document.execCommand('copy')
    e.target.focus();
    setTimeout(function () { setCopySuccess(false) }, 4000)
  }

  //Download excel
  function DownloadExcel() {

    console.log('from download .csv template')
  }


  //Clear text area 
  function clearText(e) {
    e.preventDefault();
    textAreaRef.current.value = '';
    setContacts((existing) => []);
  };

  function ValidateArray() {
    checkUrl()
    console.log(contacts)
  }

  //checks VendorName for appropriate formatting
  function checkUrl() {
    for (let i = 0; i < newduplicateArray.length; ++i) {
      let contact = newduplicateArray[i];
      //if not lead in formatting at all it will be added and returned
      if (!contact['Vendor Site - Member'].includes("https://") && !contact['Vendor Site - Member'].includes("http://") && !contact['Vendor Site - Member'].includes("www.")) {
        var hypertextTransferWorldWideWeb = "http://www."
        contact['Vendor Site - Member'] = hypertextTransferWorldWideWeb.concat(contact['Vendor Site - Member'])
        //if only contains www. lead in remaining "https://" will be added
      } else if (!contact.['Vendor Site - Member'].includes("https://") && !contact['Vendor Site - Member'].includes("http://") && contact['Vendor Site - Member'].includes("www.")) {
        var hypertextTransfer = "http://"
        contact['Vendor Site - Member'] = hypertextTransfer.concat(contact['Vendor Site - Member'])
      }
    }

  };




  // *********************************************************
  // ***************Main functionality below******************
  // *********************************************************


  //final markup string created conditionally based on what information was provided.
  let createMarkUp = newduplicateArray.map((contact) => {
    //if there is an SSO item it will print out the script 

    // checkUrl()
    if (contact['Will this have SSO?'].toUpperCase().includes("YES")) {
      return `
          <p>${contact.Role}<br>
                <a 
                  class="link__external" 
                  href="{$SiteDomain}${contact['SSO key']}" 
                  target="_blank" sso-link>${contact['Vendor Name']}
                </a>
          </p>`
    } else if (contact['Will this have SSO?'] === "") {
      return ``
    } else {
      //if there is a telephone number
      return `
             <p>${contact.Role}<br>
                   <a 
                     class="link__external" 
                     href="${contact['Vendor Site - Member']}" 
                    target="_blank">${contact['Vendor Name']}
                  </a>
           </p>`
    }
  }
  );


  // *********************************************************
  // *************** Main functionality Above ****************
  // *********************************************************




  //toast notification 
  let toastNotification = (
    <div onClick={toastClose} className="alert-toast fixed bottom-0 right-0 m-8 w-5/6 md:w-full max-w-sm" >
      <input type="checkbox" className="hidden" id="footertoast" ref={toastNotificationRef} />
      <label
        className="close cursor-pointer flex items-start justify-between w-full p-2 bg-green-500 h-24 rounded shadow-lg text-white" title="close"
      >
        Copied to Clipboard!
      <svg className="fill-current text-white" width="18" height="18" viewBox="0 0 18 18">
          <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
        </svg>
      </label>
    </div>
  );


  //rendered information below
  return (
    <div className="flex space-x-4n m-0 ">
      {/*Dropzone for .csv file*/}
      <div
        className={` flex flex-wrap content-center h-auto  p-6 w-2/12  ${highlighted ? "border-blue-600 bg-blue-100" : "border-gray-600"
          }`}
        onDragEnter={() => {
          setHighlighted(true);
        }}
        onDragLeave={() => {
          setHighlighted(false);
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}

        onDrop={(e) => {
          e.preventDefault();
          setHighlighted(false);
          Array.from(e.dataTransfer.files)
            .filter((file) => file.type === "text/csv")
            .forEach(async (file) => {
              const text = await file.text();
              const result = parse(text, { header: true });
              setContacts((existing) => [...existing, ...result.data]);
            });
        }}
      >

        <div className={`text-center mx-auto text-3xl p-5 text-gray-500 ${highlighted ? "text-gray-800" : "border-gray-600"
          }`}>
          DROP .CSV HERE
          <div>
            <FontAwesomeIcon icon={faArrowDown} size="lg" />
          </div>
        </div>
      </div>
      {ValidateArray()}

      <div className="relative flex flex-col h-screen w-10/12 p-6 justify-self-center bg-gray-800	">
        {/*Text area where code will populate*/}
        <textarea className="resize-none bg-gray-800 text-white overflow-auto h-full w-full m-0"
          ref={textAreaRef}
          placeholder="Code will appear below:"
          value={createMarkUp.join("")}
        >


        </textarea>

        <div className=" relative bottom-0 mt-6">
          {/* Copy code button */}
          {/*<Router>
           <Link to='./public/assets/Quantum_Health_Vendor_Template.xlsx' download> */}
          <a href="./assets/Quantum_Health_Vendor_Template.xlsx" download>
            <button
              className="text-white bg-transparent border border-solid border-white hover:bg-white hover:text-gray-800  active:bg-white font-bold uppercase px-8 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
              type="button"
              onClick={DownloadExcel}
            >
              <FontAwesomeIcon icon={faDownload} size="md" /> .csv Template
          </button>
          </a>
          {/*</Link>
          </Router>*/}
          <button onClick={copyText}
            className="text-white bg-transparent border border-solid border-white hover:bg-white hover:text-gray-800  active:bg-white font-bold uppercase px-8 py-3 rounded outline-none focus:outline-none ml-8 mr-1 mb-1"
            type="button" >
            Copy code
          </button>
          {/* clear content button */}
          <button onClick={clearText}
            className="text-white bg-transparent border border-solid border-white hover:bg-white hover:text-gray-800  active:bg-white font-bold uppercase px-8 py-3 rounded outline-none focus:outline-none ml-8 mb-1"
            type="button" >
            Clear
          </button>
        </div>
        {copySuccess ? <div>{toastNotification}</div> : null}
      </div>
    </div>
  );
}