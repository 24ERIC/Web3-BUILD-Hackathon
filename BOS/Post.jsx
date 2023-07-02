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

const FormContainer = styled.div`
    display: flex;
    padding: 35px;
`;

const Description = styled.div`
    font-family: 'Courier New', Courier, monospace;
    color: #89c70d;
    padding: 25px;
    font-weight: bold;
    h1 {
        font-size: 35px;
        font-weight: bold;
    }
    p {
        text-align: left;
        padding-top: 5px;
    }
`;

const Form = styled.div`
    background-color: #b6a1a1;
    padding: 20px; 
    border-radius: 10px;
`;

const Label = styled.label`
    font-size: 15px;
    float: left; 
    padding-top: 10px;
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold; 
`;

const Input = styled.input`
    width: 100%;
    border-radius: 10px;
    &::placeholder {
      font-size  : 12px;
    }
`;

const Input2 = styled.input`
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    &::placeholder {
      font-size  : 12px;
    }
`;

const LabelWrapper = styled.label`
    display: flex;
    width: 100%;
    align-items: stretch;
    flex-direction: row;
    div {
        display: flex; 
        width: 100%;
        border-color: black;
        background-color: #89c70d;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px; 
        align-items:center;
        justify-content:center;
        font-size: 15px;
    }
`;

const Button = styled.button`
    font-weight: bold;
    background-color: #89c70d;
    border-color: black;
    &:hover {
        color: #b96868;
        background-color: #89c70d;
    }
`

return (
    <>
        <Widget src={`mishih.near/widget/ReputeHeader`} />
        <Container>
            <FormContainer>
                <Description>
                    <h1 className="text-5xl font-bold">Post the deal now!</h1>
                    <p className="py-6">
                        Post the deal with your mind assured! Have a special investment opportunity to sell? Post your offer here.
                        Just fill in the type of opportunity your are offering (i.e. claims, SAFT, or SAFE), some details on the
                        opportunity, your asking price, the expiration time of the offer, and the amount of collateral that you want
                        to post.
                    </p>
                </Description>
                <Form>
                    <div>
                        <div>
                            <Label>Deal Type</Label>
                            <Input
                                type="text"
                                placeholder="SAFT"
                                value={_dealType}
                                onChange={e => setDealType(e.target.value)}
                            />
                            <Label>Opportunity Name</Label>
                            <Input
                                type="text"
                                placeholder="I want to sell XXX for XXX$"
                                value={_opportunityName}
                                onChange={(e) => setOpportunityName(e.target.value)}
                            />
                            <Label>Expiry Block</Label>
                            <LabelWrapper>
                                <Input2
                                type="number"
                                placeholder="100000000"
                                value={_expiryBlock}
                                onChange={(e) => setExpiryBlock(e.target.valueAsNumber)} 
                                />
                                <div>Block</div>
                            </LabelWrapper>
                            <Label>Seller's Deposit</Label>
                            <LabelWrapper>
                                <Input2
                                type="number"
                                value={_sellerDeposit}
                                onChange={e => setSellerDeposit(e.target.valueAsNumber)}
                                placeholder="1000000000000"
                                className="input w-80 input-bordered"
                                />
                                <div>Wei</div>
                            </LabelWrapper>
                        </div>
                        <div>
                            <Label>Buyer's Deposit</Label>
                            <LabelWrapper>
                                <Input2
                                type="number"
                                value={_buyerDeposit}
                                onChange={e => setBuyerDeposit(e.target.valueAsNumber)}
                                placeholder="1000000000000"
                                className="input w-80 input-bordered"
                                />
                                <div>Wei</div>
                            </LabelWrapper>
                        </div>
                        <hr/>
                        <div>
                            <Button
                                className={`btn btn-primary rounded-full capitalize font-normal font-white w-24 flex items-center gap-1 hover:gap-2 transition-all tracking-widest ${
                                isLoading ? "loading" : ""
                                }`}
                                onClick={writeAsync}
                            >
                                {!isLoading && (
                                <>
                                    Send
                                </>
                                )}
                            </Button>
                        </div>
                    </div>
                </Form>        
            </FormContainer>
        </Container>
    
    </>
)