const Container = styled.div`
  display: flex;
  max-width: 1080px;
  margin: 0 auto;
  gap: var(--section-gap);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--section-gap) 24px;

  @media (max-width: 768px) {
    padding: var(--section-gap) 12px;
  }
  background-color: #b96868;
`;

const Header = styled.div`
  padding: 20px;
`;

const Name = styled.span`
    font-size: 100px;
    color: #89c70d;
    font-weight: bolder;
    font-family: 'Courier New', Courier, monospace;
    &:hover {
                color: #b3e253; 
            }
`;

const LogoWrapper = styled.div`
    padding: 2px;
    svg {
        fill: #89c70d;
        width: 500px; 
        height: 500px; 
        transition: rotate(1turn);
        &:hover {
            transform: rotate(0.5turn);
            fill: #b3e253; 
        }
    }
    span {
        font-size: 25px;
        color: #89c70d;
        font-weight: bolder;
        font-family: 'Courier New', Courier, monospace;
        &:hover {
            color: #b3e253; 
        }
    }
`;

const Detail = styled.div`
    font-size: 14px;
    color: #b3e253;
    font-weight: bolder;
    font-family: 'Courier New', Courier, monospace;
`;

return (
  <Container>
    <Header>
      <LogoWrapper>
          <svg viewBox="0 0 26 24" fill="none" aria-hidden="true">
            <path
              d="M24.3767 8.06326L1.51965 0.0649912C1.10402 -0.0830767 0.639031 0.026026 0.327308 0.340346C0.0181841 0.657263 -0.0831256 1.12225 0.0701378 1.53788L8.071 23.2519C8.23726 23.7013 8.66587 24 9.14385 24H9.14644C9.62702 24 10.0556 23.6961 10.2167 23.2441L13.734 13.495L24.3325 10.2349C24.8053 10.0895 25.13 9.65824 25.1378 9.16468C25.1482 8.67112 24.8391 8.22691 24.3715 8.06326H24.3767Z"
            />
          </svg>
          <br/>
          <span>Trade the Untradable</span>
      </LogoWrapper>
      <hr/>
      <Name>Repute</Name>
      <Detail>A non-custodial OTC escrow service for special situation opportunities. The special situations opportunities often include non-liquid off-chain assets, such as bankruptcy claims and SAFT/SAFE agreements.</Detail>
    </Header>
  </Container>
);
