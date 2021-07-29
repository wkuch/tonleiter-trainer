import { Accordion } from "react-bootstrap";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import { useState } from "react";
import logo from "./logo.png";

function App() {
  const tonleitern = [
    "C",
    "1#",
    "2#",
    "3#",
    "4#",
    "5#",
    "1b",
    "2b",
    "3b",
    "4b",
    "5b",
    "6b",
  ];

  const getTlCookie = () => {
    const learntScales = parseCookies().learntScales;
    return learntScales ? learntScales.split(",") : [];
  };

  const getExcludedTLCookie = () => {
    const excludedTLs = parseCookies().excluededScales;
    return excludedTLs ? excludedTLs.split(",") : [];
  };

  const [aktuelleTL, setaktuelleTL] = useState("");
  const [gelernteTL, setgelernteTL] = useState(getTlCookie());
  const [excludedScales, setexcludedScales] = useState(getExcludedTLCookie());

  const learntScalesCookieName = "learntScales";
  const excludedScalesCookieName = "excluededScales";

  const tonleiterZiehen = () => {
    const learntScales = getTlCookie();
    let newTL = "";
    if (
      !learntScales ||
      learntScales.length >= tonleitern.length - excludedScales.length
    ) {
      resetTonleitern();
      newTL = tonleitern[Math.floor(Math.random() * tonleitern.length)];
      while (
        excludedScales.includes(newTL) &&
        excludedScales.length < tonleitern.length
      ) {
        newTL = tonleitern[Math.floor(Math.random() * tonleitern.length)];
      }
      setaktuelleTL(newTL);
      setCookie(null, learntScalesCookieName, newTL);
      setgelernteTL(getTlCookie);
      return;
    }

    let newCookieValue = null;
    while (!newCookieValue) {
      newTL = tonleitern[Math.floor(Math.random() * tonleitern.length)];
      if (!learntScales.includes(newTL) && !excludedScales.includes(newTL)) {
        learntScales.push(newTL);
        newCookieValue = learntScales.join();
      }
    }
    setaktuelleTL(newTL);
    setCookie(null, learntScalesCookieName, newCookieValue);
    setgelernteTL(learntScales);
  };

  const resetTonleitern = () => {
    destroyCookie(null, learntScalesCookieName);
    setaktuelleTL("");
    setgelernteTL([]);
  };

  const removeTL = (tonleiter) => {
    let learntScales = getTlCookie();
    learntScales = learntScales.filter((tl) => tl !== tonleiter);
    setCookie(null, learntScalesCookieName, learntScales.join());
    setgelernteTL(learntScales);
  };

  const displayLearntScale = (tonleiter) => {
    return (
      <div key={tonleiter} className="card shadow rounded col-3 m-1">
        <div className="align-self-end">
          <div
            className="btn-close m-1"
            aria-label="Close"
            onClick={() => removeTL(tonleiter)}
          />
        </div>
        <div
          className="d-flex  align-items-center justify-content-center mx-4 py-3 fs-5"
          key={tonleiter}
        >
          {tonleiter}
        </div>
      </div>
    );
  };

  const toggleTonleiter = (tonleiter) => {
    let excludedTemp = getExcludedTLCookie();
    if (excludedScales.includes(tonleiter)) {
      excludedTemp = excludedTemp.filter((tl) => tl !== tonleiter);
    } else {
      excludedTemp.push(tonleiter);
    }
    setCookie(null, excludedScalesCookieName, excludedTemp.join());
    setexcludedScales(excludedTemp);
  };

  const renderTLSettingBtn = (tonleiter) => {
    const isExcluded = excludedScales.includes(tonleiter);
    return (
      <div
        onClick={() => toggleTonleiter(tonleiter)}
        key={tonleiter}
        className={
          isExcluded
            ? "card shadow-sm rounded p-1 m-2 col-2 text-decoration-line-through bg-danger"
            : "card shadow-sm rounded p-1 m-2 col-2"
        }
      >
        <div className="align-self-center">{tonleiter}</div>
      </div>
    );
  };

  return (
    <div className="container col-sm-8 col-md-5">
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid shadow rounded">
          <div>
            <img
              src={logo}
              alt=""
              width="80"
              height="80"
              className="d-inline-block align-text-center"
            />
            Tonleiter Trainer
          </div>
        </div>
      </nav>

      <Accordion className="my-2">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Einstellungen</Accordion.Header>
          <Accordion.Body>
            <div className="mb-2">Tonleitern die geübt werden sollen:</div>
            <div className="d-flex flex-wrap justify-content-center">
              {tonleitern.map((tl) => renderTLSettingBtn(tl))}
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div>
        <div className="h4 m-3">Aktuelle Tonleiter:</div>
        <div className="align-items-center justify-content-center d-flex">
          <div className="card shadow rounded">
            <div className="p-4 h4 my-0">
              {excludedScales.length >= tonleitern.length ? "" : aktuelleTL}
            </div>
          </div>
        </div>
        {excludedScales.length >= tonleitern.length && (
          <div className="alert alert-warning mt-3" role="alert">
            Keine Tonleiter zum üben eingestellt.
          </div>
        )}
        <div className="d-flex  justify-content-center my-3">
          <button
            className="btn btn-primary me-3"
            disabled={excludedScales.length >= tonleitern.length}
            onClick={() => tonleiterZiehen()}
          >
            Tonleiter ziehen
          </button>
          <div className="btn btn-secondary" onClick={() => resetTonleitern()}>
            zurücksetzen
          </div>
        </div>
        <div className="h4 mx-3 mt-4">Bereits gelernte Tonleitern:</div>
        <div className="d-flex align-items-center justify-content-center my-3 flex-wrap">
          {gelernteTL.map((tonleiter) => displayLearntScale(tonleiter))}
        </div>
      </div>
    </div>
  );
}

export default App;
