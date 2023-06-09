import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import JourneysContextLayout from "./components/JourneysContextLayout";
import StationsContextLayout from "./components/StationsContextLayout";
import Home from "./components/Home";
import JourneyView from "./components/JourneyView";
import Explore from "./components/Explore";
import StationView from "./components/StationView";
import SingleStation from "./components/SingleStation";
import SingleJourney from "./components/SingleJourney";

const App = () => {
  const [stations, setStations] = useState(null);
  const [journeys, setJourneys] = useState(null);

  const [journeyOptions, setJourneyOptions] = useState({
    page: null,
    search: null,
  });

  const [stationOptions, setStationOptions] = useState({
    page: null,
    search: null,
  });

  return (
    <>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route
            element={
              <JourneysContextLayout
                journeys={journeys}
                setJourneys={setJourneys}
                options={journeyOptions}
                setOptions={setJourneyOptions}
              />
            }
          >
            <Route path="/journeys" element={<JourneyView />} />
            <Route path="/journeys/:id" element={<SingleJourney />} />
          </Route>
          <Route
            element={
              <StationsContextLayout
                stations={stations}
                setStations={setStations}
                options={stationOptions}
                setOptions={setStationOptions}
              />
            }
          >
            <Route path="/explore" element={<Explore />} />
            <Route path="/stations" element={<StationView />} />
            <Route path="/stations/:id" element={<SingleStation />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
