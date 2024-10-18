import React, { useEffect, useState } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import styled from 'styled-components';
import DashboardNavigationBar from '../../components/DashboardNavigationBar';

const Dashboard = () => {
  const [movieSummary, setMovieSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the movie summary data from the backend
  useEffect(() => {
    const fetchMovieSummary = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/dashboard/summary');
        if (!response.ok) {
          throw new Error('Failed to fetch movie summary');
        }
        const data = await response.json();
        setMovieSummary(data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchMovieSummary();
  }, []);

  // Calculate total watchlists and bookings
  const totalWatchlists = movieSummary.reduce((acc, movie) => acc + movie.watchlist_count, 0);
  const totalBookings = movieSummary.reduce((acc, movie) => acc + movie.booking_count, 0);

  // Find movie with max watchlists
  const maxWatchlistMovie = movieSummary.reduce(
    (maxMovie, movie) => (movie.watchlist_count > (maxMovie?.watchlist_count || 0) ? movie : maxMovie),
    null
  );

  // Create some sample data for charts
  const pieData = [
    { name: 'New Tickets', value: 38 },
    { name: 'Returned Tickets', value: 62 }
  ];

  const colors = ['#8884d8', '#82ca9d'];

  return (
    <>
      <DashboardNavigationBar />
      
      <DashboardContainer>
        <Header>
          <h1>Movie Watchlist and Booking Dashboard</h1>
        </Header>

        {loading && <p>Loading data...</p>}
        {error && <p>Error: {error}</p>}

        <StatsContainer>
          <StatBox>
            <h2>Movie Statistics</h2>
            <p>Total Movies: {movieSummary.length}</p>
            <p>Max Watchlist: {maxWatchlistMovie ? `${maxWatchlistMovie.title} (${maxWatchlistMovie.watchlist_count})` : 'N/A'}</p>
          </StatBox>
          <StatBox>
            <h2>Summary</h2>
            <p>Total Bookings: {totalBookings}</p>
            <p>Total Watchlists: {totalWatchlists}</p>
          </StatBox>
        </StatsContainer>

        <ChartsContainer>
          {/* Line Chart */}
          <ChartBox>
            <h3>Watchlists and Bookings Over Time</h3>
            <LineChart width={500} height={300} data={movieSummary}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="watchlist_count" stroke="#a82d2d" />
              <Line type="monotone" dataKey="booking_count" stroke="#000000" />
            </LineChart>
          </ChartBox>

          {/* Bar Chart */}
          <ChartBox>
            <h3>Watchlists and Bookings by Movie</h3>
            <BarChart width={500} height={300} data={movieSummary}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="watchlist_count" fill="#a82d2d" />
              <Bar dataKey="booking_count" fill="#000000" />
            </BarChart>
          </ChartBox>
        </ChartsContainer>
      </DashboardContainer>
    </>
  );
};

// Styled Components for Dark-Themed Dashboard
const DashboardContainer = styled.div`
  background-color: ;
  color: #000000;
  padding: 60px 20px 20px 20px; // Adds top padding to push down everything
  min-height: 100vh;
`;


const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;
  h1 {
    color: #f0f0f0;
    letter-spacing: 2px; // Adds spacing between letters
  }
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  gap: 20px; // Add some space between the StatBoxes
  flex-wrap: wrap; // Ensures they wrap if necessary
`;

const StatBox = styled.div`
  background-color: #D3D3D3;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  flex-basis: 30%;
  flex-grow: 1;
  flex-shrink: 1;
  min-width: 250px;
  h2 {
    margin-bottom: 10px;
    letter-spacing: 1.5px; // Adds spacing between letters
  }
  p {
    letter-spacing: 1px; // Adds spacing between letters for paragraphs
  }
`;

const ChartsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap; // Ensures the charts wrap when the screen size is small
  gap: 20px; // Adds space between charts
`;

const ChartBox = styled.div`
  background-color: #D3D3D3;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  flex-basis: 32%;
  flex-grow: 1;
  flex-shrink: 1;
  min-width: 300px;
  h3 {
    letter-spacing: 1.5px; // Adds spacing between letters for chart titles
  }
`;

export default Dashboard;
