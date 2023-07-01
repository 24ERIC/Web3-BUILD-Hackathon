const Container = styled.div`
  display: flex;
  width: 100%;
  margin: 0 auto;
  gap: var(--section-gap);
  align-items: center;
  justify-content: space-between;
  text-align: center;
  padding: var(--section-gap) 24px;

  @media (max-width: 768px) {
    padding: var(--section-gap) 12px;
  }
  background-color: #b96868;
  border-bottom: black 1px;
`;

const Logo = styled.div`
  svg {
    fill: #89c70d;
    width: 30px; 
    height: 30px; 
    transition: rotate(1turn);
    &:hover {
        transform: rotate(0.5turn);
        fill: #b3e253; 
    }
  }
  padding: 3px;
`;

const LogoContainer = styled.div`
  display: flex; 
  align-items: center;
  justify-content: center;
  padding-left: 15px;
`;

const ButtonContainer = styled.div`
  display: flex; 
  align-items: center;
  justify-content: center;
  padding-right: 15px;
`;

const Name = styled.span`
    font-size: 50px;
    color: #89c70d;
    font-weight: bolder;
    font-family: 'Courier New', Courier, monospace;
    &:hover {
      color: #b3e253; 
    }
`;

const Offer = styled.button`
  color: #89c70d;;
  background-color: #b96868;
  border-radius: 10px;
  border-width: 0px;
  font-weight: bold;
  &:hover {
    background-color: #b3e253;
    color: #b96868;
    border-width: 1px;
    border-color: black;
    box-shadow: #b3e253;
    fill: #b96868;
  }
  svg {
    width: 20px; 
    height: 20px;
    fill: #89c70d;
  }
`;

return (
  <>
    <Container>
      <LogoContainer>
        <Logo>
          <svg viewBox="0 0 26 24" fill="none" aria-hidden="true">
            <path
                d="M24.3767 8.06326L1.51965 0.0649912C1.10402 -0.0830767 0.639031 0.026026 0.327308 0.340346C0.0181841 0.657263 -0.0831256 1.12225 0.0701378 1.53788L8.071 23.2519C8.23726 23.7013 8.66587 24 9.14385 24H9.14644C9.62702 24 10.0556 23.6961 10.2167 23.2441L13.734 13.495L24.3325 10.2349C24.8053 10.0895 25.13 9.65824 25.1378 9.16468C25.1482 8.67112 24.8391 8.22691 24.3715 8.06326H24.3767Z"
            />
          </svg>
        </Logo>
        <Name>Repute</Name>
      </LogoContainer>
      <ButtonContainer>
        <Offer>
          <svg viewBox="0 0 512 512">
            <path 
              d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"
            />
          </svg>
          Post an Offer
        </Offer>
      </ButtonContainer>
    </Container>
  </>
);