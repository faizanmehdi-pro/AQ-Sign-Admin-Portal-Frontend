import React from "react";
import styled from "styled-components";
import { FaHome, FaSearch, FaChartBar, FaSignInAlt } from "react-icons/fa";

const LogsDetail = () => {
  const logsData = [
    { title: "Home Page Visits", value: 4565, bg: "#FFC107", icon: <FaHome /> },
    { title: "Search Page Visits", value: 5674, bg: "#FF5722", icon: <FaSearch /> },
    { title: "Search Hits", value: 6533, bg: "#8BC34A", icon: <FaChartBar /> },
    { title: "Number of Logins", value: 7895, bg: "#673AB7", icon: <FaSignInAlt /> },
  ];

  return (
    <Container>
      <CardsContainer>
        {logsData.map((log, index) => (
          <Card key={index} bg={log.bg}>
            <IconWrapper>{log.icon}</IconWrapper>
            <CardTitle>{log.title}</CardTitle>
            <CardValue>{log.value}</CardValue>
          </Card>
        ))}
      </CardsContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;
  margin-top: 20px;
`;

const Card = styled.div`
  background: ${(props) => props.bg};
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  text-align: center;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  color: #fff;

  &:hover {
    transform: translateY(-5px);
    filter: brightness(0.9);
  }
`;

const IconWrapper = styled.div`
  font-size: 40px;
  margin-bottom: 10px;
  color: #fff;
`;

const CardTitle = styled.h2`
  font-size: 20px;
  color: #fff;
  margin-bottom: 10px;
  transition: color 0.3s ease-in-out;
`;

const CardValue = styled.p`
  font-size: 26px;
  font-weight: bold;
  color: #fff;
  transition: color 0.3s ease-in-out;
`;

export default LogsDetail;